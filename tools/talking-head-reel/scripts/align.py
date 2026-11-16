#!/usr/bin/env python3
"""
Word-accurate timing for captions and graphics.

1. work/words.json (faster-whisper large-v3 word timestamps, scripts/whisper_words.py)
2. snap each word's start/end to real speech onsets with silencedetect (Whisper glues
   pauses onto the *next* word, so starts after a pause come out early)
3. align the edited caption text (edl.json captions) to those words (DP alignment,
   tolerant of dialect spelling + Latin brand names)
4. write work/captions.ass with groups timed to their words, and work/cues.json:
   the in/out times every graphic hangs off (read by motion.py and the Remotion overlay)
"""
import json
import re
import shutil
import subprocess
import sys
from difflib import SequenceMatcher
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
WORK = ROOT / "work"
sys.path.insert(0, str(Path(__file__).resolve().parent))
from build import ass_time  # noqa: E402

LEAD = 0.06          # graphics land a beat before the word (anticipation)
SECTIONS = [4.30, 19.77, 39.15, 55.20]


# ------------------------------------------------------------------ speech onsets
def silences(wav):
    r = subprocess.run(["ffmpeg", "-hide_banner", "-i", str(wav), "-af", "silencedetect=n=-35dB:d=0.1",
                        "-f", "null", "-"], capture_output=True, text=True)
    st = [float(x) for x in re.findall(r"silence_start: ([\d.]+)", r.stderr)]
    en = [float(x) for x in re.findall(r"silence_end: ([\d.]+)", r.stderr)]
    return list(zip(st, en))


def refine(words, sil):
    # Whisper glues a pause onto the start of the following word: any pause that sits in
    # the first half of a word's span is really the gap before it.
    for k, w in enumerate(words):
        for a, b in sil:
            if w["s"] + 0.08 < a and b < w["e"] and a < w["s"] + 0.5 * (w["e"] - w["s"]):
                w["s"] = b
                if k and words[k - 1]["e"] > a:
                    words[k - 1]["e"] = a
    for w in words:
        for a, b in sil:
            if a <= w["s"] + 0.08 and w["s"] < b < w["e"]:      # word "starts" inside a pause
                w["s"] = b
            if w["s"] < a < w["e"] and b >= w["e"] - 0.08:      # word "ends" inside a pause
                w["e"] = a
    return words


# ------------------------------------------------------------------ text alignment
SYN = {"claude": "كلود", "mcp": "mcb", "snapchat": "سنابشات", "meta": "ميتا", "tiktok": "تيك",
       "creative": "كرياتيف", "scale": "سكيل", "عشر": "10"}


def norm(w):
    w = re.sub(r"\{[^}]*\}", "", w).lower().strip("،,.:؟!‫‬ ")
    w = SYN.get(w, w)
    w = re.sub(r"[ً-ْـ]", "", w)              # tashkeel + tatweel
    w = w.translate(str.maketrans("أإآةى", "اااهي"))
    for p in ("وال", "بال", "لل", "ال", "و", "ل"):              # common clitics
        if w.startswith(p) and len(w) - len(p) >= 2:
            w = w[len(p):]
            break
    return w


def align(cap, wh):
    """Needleman-Wunsch on token similarity; returns {caption_index: whisper_index}."""
    n, m = len(cap), len(wh)
    sim = [[SequenceMatcher(None, a, b).ratio() for b in wh] for a in cap]
    gap = -0.4
    S = [[0.0] * (m + 1) for _ in range(n + 1)]
    for i in range(1, n + 1):
        S[i][0] = i * gap
    for j in range(1, m + 1):
        S[0][j] = j * gap
    for i in range(1, n + 1):
        for j in range(1, m + 1):
            S[i][j] = max(S[i - 1][j - 1] + (sim[i - 1][j - 1] * 2 - 1), S[i - 1][j] + gap, S[i][j - 1] + gap)
    out, i, j = {}, n, m
    while i and j:
        if S[i][j] == S[i - 1][j - 1] + (sim[i - 1][j - 1] * 2 - 1):
            if sim[i - 1][j - 1] >= 0.6:
                out[i - 1] = j - 1
            i, j = i - 1, j - 1
        elif S[i][j] == S[i - 1][j] + gap:
            i -= 1
        else:
            j -= 1
    return out


def main():
    words = json.loads((WORK / "words.json").read_text())
    words = refine(words, silences(WORK / "timeline.wav"))
    (WORK / "words_refined.json").write_text(json.dumps(words, ensure_ascii=False, indent=0))

    edl = json.loads((WORK / "edl.json").read_text())
    caps = edl["captions"]
    toks, owner = [], []                                   # caption word -> caption index
    for ci, (_, _, _, txt) in enumerate(caps):
        clean = re.sub(r"\{[^}]*\}", "", txt).replace(":", " ")
        for w in clean.split():
            if norm(w) and w not in ("لـ", "الـ", "و"):
                toks.append(norm(w))
                owner.append(ci)
    match = align(toks, [norm(w["w"]) for w in words])
    print(f"aligned {len(match)}/{len(toks)} caption words to {len(words)} whisper words")

    # per caption: first/last matched word
    span = {}
    for ti, ci in enumerate(owner):
        if ti in match:
            w = words[match[ti]]
            a, b = span.get(ci, (w["s"], w["e"]))
            span[ci] = (min(a, w["s"]), max(b, w["e"]))
    new = []
    for ci, (style, s0, e0, txt) in enumerate(caps):
        s, e = span.get(ci, (s0, e0))
        new.append([style, s, e, txt])
    # captions hold until the next one when the gap is short, never overlap
    for i in range(len(new) - 1):
        nxt = new[i + 1][1]
        if nxt - new[i][2] < 0.35:
            new[i][2] = nxt
        new[i][2] = max(new[i][2], new[i][1] + 0.55)          # readable minimum
        new[i][2] = min(new[i][2], nxt)
    new[-1][2] += 0.3
    for (st, s0, e0, txt), (_, s, e, _) in zip(caps, new):
        flag = "  <-- moved" if abs(s - s0) > 0.15 else ""
        print(f"{st:5s} {s0:6.2f}->{s:6.2f}  {e0:6.2f}->{e:6.2f}  {re.sub(r'{[^}]*}', '', txt)}{flag}")

    head = (WORK / "captions.ass").read_text(encoding="utf-8").split("[Events]")[0]
    lines = [head, "[Events]\nFormat: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text\n"]
    pop = r"{\fscx85\fscy85\t(0,90,\fscx100\fscy100)}"
    for style, a, b, txt in new:
        lines.append(f"Dialogue: 0,{ass_time(a)},{ass_time(b)},{style},,0,0,0,,{pop}‫{txt}‬\n")
    if not (WORK / "captions_estimated.ass").exists():
        shutil.copy(WORK / "captions.ass", WORK / "captions_estimated.ass")
    (WORK / "captions.ass").write_text("".join(lines), encoding="utf-8")

    # ------------------------------------------------------------ graphic cues
    def on(word, after=0.0):
        """Speech onset of the first whisper word matching `word` after time `after`."""
        k = norm(word)
        for w in words:
            if w["s"] >= after - 0.01 and SequenceMatcher(None, norm(w["w"]), k).ratio() >= 0.75:
                return round(w["s"] - LEAD, 3)
        sys.exit(f"cue word not found: {word} after {after}")

    c = {}
    c["clock"] = on("وقت", 3)
    c["money"] = on("وفلوس", 3)
    c["claude1"] = on("للكلود", 6.5)
    c["snapchat"] = on("سنابشات", 10)
    c["meta"] = on("ميتا", 11)
    c["tiktok"] = on("وتيك", 11.5)
    c["logos_out"] = on("ويقدر", 12) + 0.2
    c["search"] = on("وين", 13)
    c["leak"] = on("فلوسك", 13.5)
    c["check"] = on("أفضل", 15.5)
    c["stop"] = on("لازم", 18.5)                            # stamp on "لازم توقف"
    c["cards"] = on("كمحتوى", 24)
    c["ten"] = on("10", 24.5) + LEAD                        # counter lands on 10x exactly on the word
    c["cards_out"] = on("وتلعب", 25.5) - 0.05
    c["price"] = on("السعر", 27.8)
    c["content"] = on("المحتوى", 28.5)
    c["audience"] = on("مخاطبة", 29.5)
    c["three_out"] = on("وتختبرهم", 31) + 0.1
    c["trophy"] = on("الاكثر", 36)
    c["claude2"] = on("مع", 37.3)
    c["bars"] = on("التقرير", 41.0)
    c["bulb"] = on("توصيات", 43.8)
    c["budget"] = on("ميزانيات", 46.2)
    c["revenue"] = on("ايراد", 48.4)
    c["people"] = on("جمهور", 49.2)
    c["checks_out"] = on("وبناء", 50.7) + 0.4
    c["rocket"] = on("السكيل", 53.5) - 0.15
    c["claude3"] = on("كلود", 55.5)
    c["fast"] = on("أسرع", 58.3)
    c["clear"] = on("وبشكل", 59.0)
    c["sections"] = SECTIONS
    (WORK / "cues.json").write_text(json.dumps(c, indent=1))
    shutil.copy(WORK / "cues.json", ROOT / "remotion" / "src" / "cues.json")
    print(json.dumps({k: v for k, v in c.items() if k != "sections"}))


if __name__ == "__main__":
    main()
