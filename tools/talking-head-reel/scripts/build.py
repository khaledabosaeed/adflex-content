#!/usr/bin/env python3
"""Build the Instagram reel from the proxy clips.

Edit list -> per-segment GPU cuts (NVDEC crop/resize + NVENC) -> concat ->
final pass: burn Arabic captions (ASS), 30fps, loudness -14 LUFS, NVENC.
"""
import json
import os
import subprocess
import sys
from pathlib import Path

# Project folder (holds proxy/ work/ out/ assets/). Defaults to this tool's folder;
# point REEL_ROOT at videos/<type>/<slug>/build/ when you use it for a video.
ROOT = Path(os.environ.get("REEL_ROOT", Path(__file__).resolve().parent.parent))
PROXY = ROOT / "proxy"
WORK = ROOT / "work"
OUT = ROOT / "out"
FPS = 60  # proxy frame rate; segment boundaries snap to this grid

# (clip, [(speech_start, speech_end, caption_text), ...])
# Times are source-clip seconds measured from silence detection.
EDL = [
    ("IMG_3130", [
        (0.60, 2.32, "إذا للحين تحلل حملتك يدوي"),
        (2.66, 4.72, "ترى قاعد تخسر وقت وفلوس"),
    ]),
    ("IMG_3143", [
        (0.72, 1.79, "#أول شي: التحليل"),
        (2.31, 4.83, "تقدر تعطي تقرير مفصّل لـ Claude عن حملاتك"),
        (5.33, 9.63, "أو تربط الـ MCP في المنصات الإعلانية مثل Snapchat و Meta و TikTok"),
        (10.24, 12.75, "ويقدر يحلل لك وين فلوسك قاعدة بتروح"),
        (13.35, 15.25, "ويقترح لك أفضل الحملات"),
        (15.65, 17.39, "والميزانيات اللي لازم توقف"),
    ]),
    ("IMG_3144", [
        (0.28, 1.51, "#ثاني شي: الـ Creative"),
        (2.11, 6.11, "الـ Creative بتقدر تكتب من النسخة الخاصة فيك كمحتوى عشر نسخ"),
        (6.50, 7.20, "وتلعب على"),
        (7.83, 9.10, "أحد الأوتار مثل"),
        (9.46, 10.05, "السعر"),
        (10.49, 11.14, "المحتوى"),
        (11.68, 12.98, "مخاطبة الجمهور"),
        (13.40, 15.48, "وتختبرهم كلهم في نفس ذات الوقت"),
        (16.12, 16.97, "وبناءً عليه"),
        (17.24, 19.81, "تقدر تحدد الـ Creative الأكثر نجاحاً"),
        (20.06, 21.04, "مع المنصة Claude"),
    ]),
    ("IMG_3145", [
        (0.18, 1.57, "#ثالث شي: التقرير"),
        (2.09, 4.64, "وبناءً على التقارير اللي بيطلعها لك Claude"),
        (5.01, 7.21, "بيعطيك توصيات واضحة وصريحة"),
        (7.68, 9.61, "على أي ميزانيات ممكن تشتغل"),
        (9.90, 10.76, "من الأعلى إيراد"),
        (11.15, 12.63, "أي جمهور لازم تشتغل عليه"),
        (12.99, 16.61, "وبناءً عليه بتحدد كيف تعمل الـ Scale الخاص فيك"),
    ]),
    ("IMG_3148", [
        (0.10, 0.72, "#الخلاصة"),
        (1.06, 2.13, "Claude ما يقرر عنك"),
        (2.55, 3.28, "يخليك فقط"),
        (3.86, 4.47, "تقرر أسرع"),
        (4.85, 5.62, "وبشكل أوضح"),
    ]),
]

PAD_IN, PAD_OUT = 0.08, 0.12   # breathing room around speech
CUT_GAP = 0.45                 # only jump-cut pauses longer than this
ZOOMS = [1.0, 1.12]            # alternate punch-in on each jump cut
HIGHLIGHT = {"Claude", "MCP", "Creative", "Meta", "TikTok", "Snapchat", "Scale",
             "وقت", "وفلوس", "فلوسك", "عشر", "نسخ", "أسرع", "أوضح", "الجمهور",
             "الميزانيات", "ميزانيات", "إيراد", "جمهور"}


def snap(t):
    return round(t * FPS) / FPS


def run(cmd):
    r = subprocess.run(cmd, capture_output=True, text=True)
    if r.returncode != 0:
        sys.exit(f"FAILED: {' '.join(cmd)}\n{r.stderr[-3000:]}")


def probe_dur(path):
    out = subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration",
                          "-of", "csv=p=0", str(path)], capture_output=True, text=True)
    return float(out.stdout.strip())


def build_segments():
    segs = []
    for clip, chunks in EDL:
        clip_dur = probe_dur(PROXY / f"{clip}.mov")
        cur = None
        for s, e, text in chunks:
            if cur and s - cur["src_end_speech"] <= CUT_GAP:
                cur["src_end_speech"] = e
                cur["chunks"].append((s, e, text))
            else:
                if cur:
                    segs.append(cur)
                cur = {"clip": clip, "src_start_speech": s, "src_end_speech": e,
                       "chunks": [(s, e, text)]}
        segs.append(cur)
        for sg in segs:
            if sg["clip"] == clip:
                sg["a"] = snap(max(0.0, sg["src_start_speech"] - PAD_IN))
                sg["b"] = snap(min(clip_dur, sg["src_end_speech"] + PAD_OUT))
    # zoom: reset at each new clip, alternate on jump cuts within a clip
    prev_clip, k = None, 0
    for sg in segs:
        k = 0 if sg["clip"] != prev_clip else k + 1
        sg["zoom"] = ZOOMS[k % 2]
        prev_clip = sg["clip"]
    return segs


def cut_segment(i, sg):
    out = WORK / f"seg_{i:02d}.mov"
    z = sg["zoom"]
    # NVDEC crop/resize on the 1080x1920 proxy (keep face: bias crop upward)
    W, H = 1080, 1920
    cw, ch = int(W / z) // 2 * 2, int(H / z) // 2 * 2
    left = (W - cw) // 2
    top = int((H - ch) * 0.30)
    crop = f"{top}x{H - ch - top}x{left}x{W - cw - left}"
    dur = sg["b"] - sg["a"]
    fade = 0.012
    cmd = ["ffmpeg", "-v", "error", "-y",
           "-hwaccel", "cuda", "-hwaccel_output_format", "cuda",
           "-c:v", "h264_cuvid", "-crop", crop, "-resize", f"{W}x{H}",
           "-ss", f"{sg['a']:.4f}", "-i", str(PROXY / f"{sg['clip']}.mov"),
           "-t", f"{dur:.4f}",
           "-c:v", "h264_nvenc", "-preset", "p6", "-tune", "hq", "-rc", "vbr",
           "-cq", "16", "-b:v", "0", "-g", "60",
           "-af", f"afade=t=in:d={fade},afade=t=out:st={dur - fade:.4f}:d={fade}",
           "-c:a", "pcm_s16le", "-ar", "48000", "-ac", "1", str(out)]
    run(cmd)
    return out


def ass_time(t):
    t = max(0.0, t)
    h, rem = divmod(t, 3600)
    m, s = divmod(rem, 60)
    return f"{int(h)}:{int(m):02d}:{s:05.2f}"


def split_words(text, max_words=3):
    words = text.split()
    groups, cur = [], []
    for w in words:
        cur.append(w)
        # keep "الـ X" together; break after max_words
        if len(cur) >= max_words and w != "الـ" and w != "لـ":
            groups.append(cur)
            cur = []
    if cur:
        if groups and len(cur) == 1 and len(groups[-1]) < 4:
            groups[-1] += cur
        else:
            groups.append(cur)
    return groups


def styled(words):
    out = []
    for w in words:
        bare = w.strip("،.:؟!")
        if bare in HIGHLIGHT:
            out.append(r"{\c&H00D7FF&}" + w + r"{\c&HFFFFFF&}")
        else:
            out.append(w)
    return " ".join(out)


def write_ass(segs, seg_durs, path):
    events = []
    t0 = 0.0
    for sg, d in zip(segs, seg_durs):
        for s, e, text in sg["chunks"]:
            title = text.startswith("#")
            text = text.lstrip("#")
            os_, oe = t0 + (s - sg["a"]), t0 + (e - sg["a"])
            if title:
                events.append(("Title", os_, oe + 0.1, text))
                continue
            groups = split_words(text)
            total = sum(len(" ".join(g)) for g in groups)
            cur = os_
            for g in groups:
                gd = (oe - os_) * len(" ".join(g)) / total
                events.append(("Cap", cur, cur + gd, styled(g)))
                cur += gd
        t0 += d
    # close tiny gaps between consecutive captions so text doesn't flicker
    for i in range(len(events) - 1):
        if 0 < events[i + 1][1] - events[i][2] < 0.35:
            events[i] = (events[i][0], events[i][1], events[i + 1][1], events[i][3])
    head = """[Script Info]
ScriptType: v4.00+
PlayResX: 1080
PlayResY: 1920
WrapStyle: 0
ScaledBorderAndShadow: yes

[V4+ Styles]
Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding
Style: Cap,IBM Plex Sans Arabic,100,&H00FFFFFF,&H00FFFFFF,&H00000000,&H64000000,1,0,0,0,100,100,0,0,1,7,2,2,80,80,560,-1
Style: Title,IBM Plex Sans Arabic,124,&H0000D7FF,&H0000D7FF,&H00000000,&H64000000,1,0,0,0,100,100,0,0,1,8,3,2,70,70,560,-1

[Events]
Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text
"""
    lines = [head]
    for style, a, b, txt in events:
        pop = r"{\fscx85\fscy85\t(0,90,\fscx100\fscy100)}"
        lines.append(f"Dialogue: 0,{ass_time(a)},{ass_time(b)},{style},,0,0,0,,{pop}\u202b{txt}\u202c\n")
    path.write_text("".join(lines), encoding="utf-8")
    return events


def main():
    WORK.mkdir(exist_ok=True)
    OUT.mkdir(exist_ok=True)
    version = sys.argv[1] if len(sys.argv) > 1 else "v1"
    segs = build_segments()
    files, durs = [], []
    for i, sg in enumerate(segs):
        f = cut_segment(i, sg)
        files.append(f)
        durs.append(probe_dur(f))
        print(f"seg {i:02d} {sg['clip']} {sg['a']:.2f}-{sg['b']:.2f} zoom {sg['zoom']} -> {durs[-1]:.3f}s")
    lst = WORK / "concat.txt"
    lst.write_text("".join(f"file '{f}'\n" for f in files))
    timeline = WORK / "timeline.mov"
    run(["ffmpeg", "-v", "error", "-y", "-f", "concat", "-safe", "0", "-i", str(lst),
         "-c", "copy", str(timeline)])
    ass = WORK / "captions.ass"
    events = write_ass(segs, durs, ass)
    (WORK / "edl.json").write_text(json.dumps(
        {"segments": [{k: v for k, v in sg.items()} for sg in segs], "durations": durs,
         "captions": events}, ensure_ascii=False, indent=1))
    final = OUT / f"reel_{version}.mp4"
    # two-pass loudness: measure, then normalise linearly to -14 LUFS
    r = subprocess.run(["ffmpeg", "-hide_banner", "-i", str(timeline), "-vn", "-af",
                        "highpass=f=80,loudnorm=I=-14:TP=-1.5:LRA=9:print_format=json",
                        "-f", "null", "-"], capture_output=True, text=True)
    m = json.loads(r.stderr[r.stderr.rindex("{"):r.stderr.rindex("}") + 1])
    loud = (f"highpass=f=80,loudnorm=I=-14:TP=-1.5:LRA=9:linear=true:"
            f"measured_I={m['input_i']}:measured_TP={m['input_tp']}:"
            f"measured_LRA={m['input_lra']}:measured_thresh={m['input_thresh']}:"
            f"offset={m['target_offset']}")
    run(["ffmpeg", "-v", "error", "-y",
         "-hwaccel", "cuda", "-hwaccel_output_format", "cuda", "-i", str(timeline),
         "-vf", f"hwdownload,format=nv12,fps=30,ass={ass}:shaping=complex",
         "-c:v", "h264_nvenc", "-preset", "p7", "-tune", "hq", "-rc", "vbr", "-cq", "18",
         "-b:v", "0", "-maxrate", "16M", "-bufsize", "32M", "-profile:v", "high",
         "-pix_fmt", "yuv420p", "-g", "60",
         "-af", loud,
         "-c:a", "aac", "-b:a", "192k", "-ar", "48000", "-ac", "2",
         "-movflags", "+faststart", str(final)])
    print(f"\nFINAL {final}  {probe_dur(final):.2f}s, {len(segs)} segments, {len(events)} captions")


if __name__ == "__main__":
    main()
