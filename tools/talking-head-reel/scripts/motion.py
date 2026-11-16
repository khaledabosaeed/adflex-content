#!/usr/bin/env python3
"""Motion-graphics pass for the reel.

1. Re-cut every segment from the 4K originals (NVDEC crop/resize -> 1350x2400, NVENC)
   so dynamic zooms only ever downscale.
2. Per frame (Python): dynamic zoom / punch / shake, animated graphics, progress bar, flashes.
3. Encode (NVENC) with ASS captions, voice + synthesized SFX mix.

Timeline, segment bounds and captions come from work/edl.json + work/captions.ass
produced by build.py, so cuts are identical to the approved v3.
"""
import json
import os
import math
import subprocess
import sys
from pathlib import Path

import numpy as np
import skia
from PIL import Image, ImageDraw, ImageFilter, ImageFont

def font_file(pattern):
    """Installed font path via fontconfig (install the fonts listed in SETUP.md)."""
    return subprocess.run(["fc-match", "-f", "%{file}", pattern], capture_output=True, text=True).stdout.strip()


# Project folder (holds proxy/ work/ out/ assets/). Defaults to this tool's folder;
# point REEL_ROOT at videos/<type>/<slug>/build/ when you use it for a video.
ROOT = Path(os.environ.get("REEL_ROOT", Path(__file__).resolve().parent.parent))
WORK, OUT = ROOT / "work", ROOT / "out"
SRC = Path(os.environ.get("REEL_SRC", ROOT / "footage"))   # folder with the original 4K .MOV clips
SFXDIR = WORK / "sfx"
FPS, W, H = 30, 1080, 1920
HW, HH = 1350, 2400            # working resolution (zoom headroom)
F_AR = font_file("IBM Plex Sans Arabic:bold")
F_NUM = font_file("Anton")
F_EMOJI = font_file("Noto Color Emoji")   # fallback for emoji missing in assets/fluent
YELLOW, BLACK, WHITE = (255, 214, 0), (18, 18, 18), (255, 255, 255)
CLAUDE = (217, 119, 87)

SECTIONS = [4.30, 19.77, 39.15, 55.20]
EMPHASIS = [3.75, 24.6, 54.0, 58.75, 59.75]
SHAKES = [3.75]


def run(cmd):
    r = subprocess.run(cmd, capture_output=True, text=True)
    if r.returncode != 0:
        sys.exit(f"FAILED: {' '.join(map(str, cmd))}\n{r.stderr[-3000:]}")
    return r


def probe_dur(p):
    r = run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", str(p)])
    return float(r.stdout.strip())


# ---------------------------------------------------------------- stage 1: 4K re-cut
def cut_hi(i, sg):
    out = WORK / f"hi_{i:02d}.mov"
    z = sg["zoom"]
    DW, DH, Ws, Hs = 2160, 3840, 3840, 2160          # display vs stored (rotated -90)
    # all crop offsets must be multiples of 16 or NVDEC misplaces the chroma plane
    w, h = int(DW / z) // 32 * 32, int(DH / z) // 32 * 32
    X0, Y0 = (DW - w) // 2 // 16 * 16, int((DH - h) * 0.30) // 16 * 16
    top, bottom, left, right = Hs - X0 - w, X0, Y0, Ws - Y0 - h
    dur, fade = sg["b"] - sg["a"], 0.012
    run(["ffmpeg", "-v", "error", "-y", "-hwaccel", "cuda", "-hwaccel_output_format", "cuda",
         "-c:v", "hevc_cuvid", "-crop", f"{top}x{bottom}x{left}x{right}", "-resize", f"{HH}x{HW}",
         "-noautorotate", "-ss", f"{sg['a']:.4f}", "-i", str(SRC / f"{sg['clip']}.MOV"),
         "-t", f"{dur:.4f}", "-vf", "hwdownload,format=nv12,transpose=clock",
         "-c:v", "h264_nvenc", "-preset", "p6", "-tune", "hq", "-rc", "vbr", "-cq", "15",
         "-b:v", "0", "-g", "60",
         "-af", f"afade=t=in:d={fade},afade=t=out:st={dur - fade:.4f}:d={fade}",
         "-c:a", "pcm_s16le", "-ar", "48000", "-ac", "1", str(out)])
    return out


# ---------------------------------------------------------------- assets
_emoji_tf = skia.Typeface.MakeFromFile(F_EMOJI)


FLUENT = Path(__file__).resolve().parent.parent / "assets" / "fluent"   # Microsoft Fluent 3D emoji (MIT)


def emoji(ch, size, shadow=True):
    """Fluent 3D emoji when available, sized to the Noto glyph's box so layouts don't move.
    Free-floating emoji get a soft drop shadow (same light as the 3D layer: from above)."""
    ch = ch.replace("\ufe0f", "")
    ref = noto_emoji(ch, size)
    f = FLUENT / f"{ord(ch[0]):x}.png"
    if len(ch) != 1 or not f.exists():
        return ref
    im = Image.open(f).convert("RGBA")
    im = im.crop(im.getbbox())
    k = min(ref.width / im.width, ref.height / im.height) * 1.08
    im = im.resize((max(1, round(im.width * k)), max(1, round(im.height * k))), Image.LANCZOS)
    return with_shadow(im, max(4, size // 22), (0, max(3, size // 22)), 95) if shadow else im


def noto_emoji(ch, size):
    font = skia.Font(_emoji_tf, size)
    s = int(size * 1.6)
    surf = skia.Surface(s, s)
    c = surf.getCanvas()
    c.clear(skia.ColorTRANSPARENT)
    c.drawString(ch, size * 0.15, size * 1.15, font, skia.Paint(AntiAlias=True))
    img = Image.fromarray(surf.makeImageSnapshot().toarray(colorType=skia.kRGBA_8888_ColorType))
    return img.crop(img.getbbox())


ASSETS = ROOT / "assets"   # copied from adflex/public (landing/media + icons/ai-clients)


def svg_icon(name, size, color=None):
    """Render a brand SVG from the AdFlex repo; optionally recolor its solid fills."""
    src = (ASSETS / f"{name}.svg").read_text()
    if color:
        import re
        src = re.sub(r'fill="(?!none)[^"]+"', f'fill="{color}"', src)
        src = re.sub(r'stop-color="[^"]+"', f'stop-color="{color}"', src)
    data = skia.Data.MakeWithCopy(src.encode())
    stream = skia.MemoryStream(data)   # keep both alive while parsing
    dom = skia.SVGDOM.MakeFromStream(stream)
    vb = 100.0
    import re as _re
    m = _re.search(r'viewBox="0 0 ([0-9.]+) ([0-9.]+)"', src)
    if m:
        vb = float(m.group(1))
    surf = skia.Surface(size, size)
    c = surf.getCanvas()
    c.clear(skia.ColorTRANSPARENT)
    c.scale(size / vb, size / vb)
    dom.setContainerSize(skia.Size(vb, vb))
    dom.render(c)
    img = Image.fromarray(surf.makeImageSnapshot().toarray(colorType=skia.kRGBA_8888_ColorType))
    return img.crop(img.getbbox())


def tiktok_icon(size):
    """TikTok note with its cyan/red offset layers, as in the real app icon."""
    w, r, c = svg_icon("tiktok", size, "#FFFFFF"), svg_icon("tiktok", size, "#FE2C55"), svg_icon("tiktok", size, "#25F4EE")
    o = max(2, size // 22)
    im = Image.new("RGBA", (w.width + 2 * o, w.height + 2 * o), (0, 0, 0, 0))
    im.alpha_composite(c, (0, 0))
    im.alpha_composite(r, (2 * o, 2 * o))
    im.alpha_composite(w, (o, o))
    return im


def text_img(txt, size, color, font=F_AR, rtl=True):
    f = ImageFont.truetype(font, size, layout_engine=ImageFont.Layout.RAQM)
    d = ImageDraw.Draw(Image.new("RGBA", (10, 10)))
    kw = {"direction": "rtl"} if rtl else {}
    l, t, r, b = d.textbbox((0, 0), txt, font=f, **kw)
    im = Image.new("RGBA", (r - l + 4, b - t + 4), (0, 0, 0, 0))
    ImageDraw.Draw(im).text((-l + 2, -t + 2), txt, font=f, fill=color, **kw)
    return im


def with_shadow(im, blur=10, off=(0, 8), alpha=110):
    pad = blur * 3
    out = Image.new("RGBA", (im.width + 2 * pad, im.height + 2 * pad), (0, 0, 0, 0))
    sh = Image.new("RGBA", im.size, (0, 0, 0, alpha))
    sh.putalpha(im.getchannel("A").point(lambda a: a * alpha // 255))
    out.alpha_composite(sh, (pad + off[0], pad + off[1]))
    out = out.filter(ImageFilter.GaussianBlur(blur))
    out.alpha_composite(im, (pad, pad))
    return out


def pill(txt, icon=None, bg=WHITE, fg=BLACK, size=54, rtl=True, border=None):
    t = text_img(txt, size, fg, rtl=rtl, font=F_AR)
    ic = (emoji(icon, int(size * 1.05), shadow=False) if isinstance(icon, str) else icon) if icon else None
    padx, pady, gap = int(size * 0.55), int(size * 0.32), int(size * 0.3)
    h = max(t.height, ic.height if ic else 0) + 2 * pady
    w = t.width + (ic.width + gap if ic else 0) + 2 * padx
    im = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    d = ImageDraw.Draw(im)
    d.rounded_rectangle((0, 0, w - 1, h - 1), radius=h // 2, fill=bg + (255,),
                        outline=border, width=6 if border else 0)
    if ic:
        if rtl:   # icon on the right (start of an RTL line)
            im.alpha_composite(ic, (w - padx - ic.width, (h - ic.height) // 2))
            im.alpha_composite(t, (padx, (h - t.height) // 2))
        else:
            im.alpha_composite(ic, (padx, (h - ic.height) // 2))
            im.alpha_composite(t, (padx + ic.width + gap, (h - t.height) // 2))
    else:
        im.alpha_composite(t, (padx, (h - t.height) // 2))
    return with_shadow(im)


def badge(num, title, icon):
    circ = 150
    c = Image.new("RGBA", (circ, circ), (0, 0, 0, 0))
    ImageDraw.Draw(c).ellipse((0, 0, circ - 1, circ - 1), fill=YELLOW + (255,), outline=BLACK, width=6)
    n = text_img(num, 92, BLACK, font=F_NUM, rtl=False)
    c.alpha_composite(n, ((circ - n.width) // 2, (circ - n.height) // 2))
    p = pill(title, icon, bg=WHITE, fg=BLACK, size=64)
    gap = -20
    im = Image.new("RGBA", (p.width + circ + gap, max(p.height, circ)), (0, 0, 0, 0))
    im.alpha_composite(p, (0, (im.height - p.height) // 2))
    im.alpha_composite(c,
                       (p.width + gap, (im.height - circ) // 2))
    return im


def stamp(txt, icon):
    t = text_img(txt, 70, (230, 40, 40))
    ic = emoji(icon, 70)
    pad = 34
    w, h = t.width + ic.width + 3 * pad, max(t.height, ic.height) + 2 * pad
    im = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    d = ImageDraw.Draw(im)
    d.rounded_rectangle((0, 0, w - 1, h - 1), radius=26, fill=(255, 255, 255, 235),
                        outline=(230, 40, 40, 255), width=9)
    im.alpha_composite(ic, (w - pad - ic.width, (h - ic.height) // 2))
    im.alpha_composite(t, (pad, (h - t.height) // 2))
    return with_shadow(im.rotate(6, resample=Image.BICUBIC, expand=True))


def ad_card(k):
    colors = [(255, 99, 99), (99, 179, 255), (120, 220, 140), (255, 190, 80), (190, 130, 255)]
    w, h = 104, 140
    im = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    d = ImageDraw.Draw(im)
    d.rounded_rectangle((0, 0, w - 1, h - 1), radius=14, fill=WHITE + (255,), outline=BLACK, width=4)
    d.rounded_rectangle((10, 10, w - 11, 66), radius=8, fill=colors[k % 5] + (255,))
    for j, y in enumerate((80, 98, 116)):
        d.rounded_rectangle((12, y, w - 12 - (25 if j == 2 else 0), y + 9), radius=4, fill=(200, 200, 200, 255))
    return with_shadow(im.rotate((k - 4.5) * -4, resample=Image.BICUBIC, expand=True), 6, (0, 5), 90)


# ---------------------------------------------------------------- animation
# Motion tokens shared with the 3D layer (remotion/src/motionTokens.ts)
SPRING_M, SPRING_K, SPRING_C = 0.6, 140.0, 12.0   # mass, stiffness, damping
EXIT_S = 0.2                                      # 6 frames, ease-in
STAGGER_S = 0.05
PUNCH = 0.05


def spring_enter(u):
    """Damped spring 0 -> 1 (same physics as remotion's spring()); u = seconds since start."""
    if u <= 0:
        return 0.0
    w0 = math.sqrt(SPRING_K / SPRING_M)
    z = SPRING_C / (2 * math.sqrt(SPRING_K * SPRING_M))
    wd = w0 * math.sqrt(1 - z * z)
    return 1 - math.exp(-z * w0 * u) * (math.cos(wd * u) + z * w0 / wd * math.sin(wd * u))


def ease_out_back(p):
    c1 = 1.9
    c3 = c1 + 1
    return 1 + c3 * (p - 1) ** 3 + c1 * (p - 1) ** 2


def ease_out_cubic(p):
    return 1 - (1 - p) ** 3


def clamp(x, a=0.0, b=1.0):
    return max(a, min(b, x))


class El:
    def __init__(self, img, t_in, t_out, x, y, anim="pop", bob=0.0, pulses=(), dur_in=0.3):
        self.img, self.t_in, self.t_out, self.x, self.y = img, t_in, t_out, x, y
        self.anim, self.bob, self.pulses, self.dur_in = anim, bob, pulses, dur_in
        self._cache = {}

    def active(self, t):
        return self.t_in <= t < self.t_out

    def draw(self, canvas, t):
        p = clamp((t - self.t_in) / self.dur_in)
        q = 1 - (1 - clamp((self.t_out - t) / EXIT_S)) ** 3     # ease-in exit
        scale, alpha, dx, dy = 1.0, 1.0, 0.0, 0.0
        if self.anim == "pop":
            scale, alpha = spring_enter(t - self.t_in), clamp((t - self.t_in) / 0.1)
        elif self.anim == "stamp":
            pp = clamp((t - self.t_in) / 0.2)
            scale, alpha = 2.0 - ease_out_cubic(pp), clamp(pp * 4)
        elif self.anim in ("slide_r", "slide_l"):
            e = ease_out_cubic(p)
            dx = (1 - e) * (260 if self.anim == "slide_r" else -260)
            alpha = clamp(p * 2.5)
        elif self.anim == "drop":
            dy, alpha = -(1 - spring_enter(t - self.t_in)) * 120, clamp((t - self.t_in) / 0.1)
        if q < 1:
            scale *= 0.7 + 0.3 * q
            alpha *= q
        for tp in self.pulses:
            if 0 <= t - tp < 0.35:
                scale *= 1 + PUNCH * math.sin(math.pi * (t - tp) / 0.35)
        if self.bob:
            dy += self.bob * math.sin(2 * math.pi * 0.7 * (t - self.t_in))
        paste(canvas, self.img, self.x + dx, self.y + dy, scale, alpha)


class Fly(El):
    """Moves along a straight path while spinning a little."""

    def __init__(self, img, t_in, dur, p0, p1, spin=0.0):
        super().__init__(img, t_in, t_in + dur, *p0)
        self.dur, self.p0, self.p1, self.spin = dur, p0, p1, spin

    def pose(self, t):
        p = clamp((t - self.t_in) / self.dur)
        e = p * p * (3 - 2 * p)
        x = self.p0[0] + (self.p1[0] - self.p0[0]) * e
        y = self.p0[1] + (self.p1[1] - self.p0[1]) * e - 90 * math.sin(math.pi * p)
        return p, x, y, clamp(p * 6) * clamp((1 - p) * 4)

    def draw(self, canvas, t, samples=4):
        # 180-degree shutter: average sub-frame poses over half a frame, centred on t
        poses = [self.pose(t + (i + 0.5) / samples * 0.5 / FPS - 0.25 / FPS) for i in range(samples)]
        imgs = [(self.img.rotate(self.spin * p, resample=Image.BILINEAR, expand=True) if self.spin else self.img)
                for p, *_ in poses]
        pad = 4
        x0 = int(min(x - im.width / 2 for (_, x, _, _), im in zip(poses, imgs))) - pad
        y0 = int(min(y - im.height / 2 for (_, _, y, _), im in zip(poses, imgs))) - pad
        x1 = int(max(x + im.width / 2 for (_, x, _, _), im in zip(poses, imgs))) + pad
        y1 = int(max(y + im.height / 2 for (_, _, y, _), im in zip(poses, imgs))) + pad
        acc = np.zeros((y1 - y0, x1 - x0, 4), np.float32)
        for (_, x, y, a), im in zip(poses, imgs):
            arr = np.asarray(im, np.float32) / 255
            arr[..., :3] *= arr[..., 3:] * a          # premultiply (and fade)
            arr[..., 3] *= a
            ox, oy = int(x - im.width / 2) - x0, int(y - im.height / 2) - y0
            acc[oy:oy + im.height, ox:ox + im.width] += arr
        acc /= samples
        rgb = np.where(acc[..., 3:] > 1e-4, acc[..., :3] / np.maximum(acc[..., 3:], 1e-4), 0)
        layer = Image.fromarray((np.dstack([rgb, acc[..., 3]]) * 255).clip(0, 255).astype(np.uint8), "RGBA")
        paste(canvas, layer, x0 + layer.width / 2, y0 + layer.height / 2, 1.0, 1.0)


class Counter(El):
    def __init__(self, t_in, t_out, x, y, n=10, count_dur=1.0):
        super().__init__(None, t_in, t_out, x, y)
        self.n, self.count_dur = n, count_dur
        self.frames = [with_shadow(text_img(f"{k}×", 190, YELLOW, font=F_NUM, rtl=False), 8, (0, 6), 160)
                       for k in range(1, n + 1)]

    def draw(self, canvas, t):
        k = int(clamp((t - self.t_in) / self.count_dur) * (self.n - 1) + 0.5)
        self.img = self.frames[k]
        super().draw(canvas, t)


class Bars(El):
    def __init__(self, t_in, t_out, x, y):
        super().__init__(None, t_in, t_out, x, y, anim="pop")
        self.card = Image.new("RGBA", (330, 280), (0, 0, 0, 0))
        ImageDraw.Draw(self.card).rounded_rectangle((0, 0, 329, 279), radius=28, fill=(255, 255, 255, 240))
        self.heights = [0.35, 0.55, 0.45, 0.85]
        self.cols = [(99, 179, 255), (120, 220, 140), (255, 190, 80), (34, 197, 94)]
        self.arrow = emoji("📈", 70)

    def draw(self, canvas, t):
        im = self.card.copy()
        d = ImageDraw.Draw(im)
        base, bw = 250, 52
        for k, (hh, col) in enumerate(zip(self.heights, self.cols)):
            g = ease_out_cubic(clamp((t - self.t_in - 0.25 - k * 0.15) / 0.5))
            top = base - int(hh * 200 * g)
            x0 = 30 + k * 72
            if top < base - 2:
                d.rounded_rectangle((x0, top, x0 + bw, base), radius=10, fill=col + (255,))
        if t - self.t_in > 0.9:
            im.alpha_composite(self.arrow, (330 - self.arrow.width - 12, 12))
        self.img = with_shadow(im)
        super().draw(canvas, t)


def paste(canvas, img, cx, cy, scale, alpha):
    if alpha <= 0.01 or scale <= 0.02:
        return
    if abs(scale - 1) > 0.01:
        img = img.resize((max(1, int(img.width * scale)), max(1, int(img.height * scale))), Image.BILINEAR)
    if alpha < 0.99:
        a = img.getchannel("A").point(lambda v: int(v * alpha))
        img = img.copy()
        img.putalpha(a)
    canvas.paste(img, (int(cx - img.width / 2), int(cy - img.height / 2)), img)


def row(imgs, y, gap=18):
    """Centers for a right-to-left row of images (first item on the right)."""
    total = sum(i.width for i in imgs) + gap * (len(imgs) - 1)
    x = W / 2 + total / 2
    out = []
    for im in imgs:
        out.append((x - im.width / 2, y))
        x -= im.width + gap
    return out


# ---------------------------------------------------------------- storyboard
# Safe area agreed with the client: every graphic stays inside this box (1080x1920 coords).
BOX = (104, 1136, 976, 1484)
BCX, BCY = (BOX[0] + BOX[2]) / 2, (BOX[1] + BOX[3]) / 2


def app_tile(kind, size=180):
    """Square app-style tile built from the real brand SVGs in the AdFlex repo."""
    r = int(size * 0.24)
    bg = {"snapchat": (255, 252, 0), "meta": WHITE, "tiktok": BLACK, "claude": (250, 249, 245)}[kind]
    tile = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    ImageDraw.Draw(tile).rounded_rectangle((0, 0, size - 1, size - 1), radius=r, fill=bg + (255,))
    if kind == "snapchat":
        g = svg_icon("snapchat", int(size * 0.66), "#000000")
        # fill the ghost white inside its outline, like the real app icon
        # pad first so the flood fill reaches every outside corner
        pad = 4
        gp = Image.new("RGBA", (g.width + 2 * pad, g.height + 2 * pad), (0, 0, 0, 0))
        gp.alpha_composite(g, (pad, pad))
        m = gp.getchannel("A").point(lambda a: 255 if a > 40 else 0)
        ImageDraw.floodfill(m, (0, 0), 128)
        inside = m.point(lambda v: 255 if v == 0 else 0)
        ghost = Image.new("RGBA", gp.size, (0, 0, 0, 0))
        ghost.paste((255, 255, 255, 255), (0, 0), inside)
        ghost.alpha_composite(gp)
        g = ghost
    elif kind == "meta":
        g = svg_icon("meta", int(size * 0.66), "#0081FB")
    elif kind == "tiktok":
        g = tiktok_icon(int(size * 0.55))
    else:
        g = svg_icon("claude", int(size * 0.68))
    tile.alpha_composite(g, ((size - g.width) // 2, (size - g.height) // 2))
    return with_shadow(tile, 12, (0, 10), 120)


def checked(ch, size=170):
    im = emoji(ch, size)
    ck = emoji("✅", int(size * 0.42), shadow=False)
    out = Image.new("RGBA", (im.width + ck.width // 2, im.height + ck.height // 3), (0, 0, 0, 0))
    out.alpha_composite(im, (0, 0))
    out.alpha_composite(ck, (out.width - ck.width, out.height - ck.height))
    return out


def storyboard():
    E, S, HIDE = [], [], []          # elements, sfx (time, name), caption-hide windows
    R, C, L = BCX + 220, BCX, BCX - 220   # three slots, right-to-left
    Y = BCY

    def gap3d(t0, t1, sfx="pop"):     # 3D logo in remotion overlay: no 2D element
        S.append((t0, sfx))
        HIDE.append((t0, t1))

    def add(el, sfx=None, at=None, hide=True):
        E.append(el)
        if sfx:
            S.append((el.t_in if at is None else at, sfx))
        if hide:
            HIDE.append((el.t_in, el.t_out))

    # every in/out time below hangs off a spoken word (scripts/align.py -> work/cues.json)
    q = json.loads((WORK / "cues.json").read_text())

    # Hook: "تخسر وقت وفلوس" (the flying-money burst was dropped: it collided with the 01 badge)
    add(El(emoji("⏰", 190), q["clock"], 4.28, L + 60, Y, "pop", bob=6), "pop")
    add(El(emoji("💸", 190), q["money"], 4.28, R - 60, Y, "pop", bob=6), "pop")

    # Section badges (number + title live inside the box)
    for t, end, (num, title, icon) in zip(SECTIONS, (5.55, 21.15, 40.70, 56.15),
                                          [("01", "التحليل", "📊"), ("02", "الـ Creative", "🎨"),
                                           ("03", "التقرير", "📈"), ("", "الخلاصة", "📌")]):
        if num:   # title pill; the 3D number coin sits at its right end (remotion overlay)
            add(El(pill(title, icon, bg=WHITE, fg=BLACK, size=64), t + 0.04, end, C - 65, Y, "pop"))
        else:
            add(El(pill(title, icon, bg=YELLOW, fg=BLACK, size=66), t + 0.04, end, C, Y, "pop"))
        S.append((t - 0.22, "whoosh"))

    # 1. Analysis
    gap3d(q["claude1"], q["claude1"] + 1.2)                      # 3D Claude
    for k in ("snapchat", "meta", "tiktok"):                    # 3D Snapchat, Meta, TikTok
        gap3d(q[k], q["logos_out"])
    add(El(emoji("🔍", 170), q["search"], 15.5, L, Y, "pop", bob=8), "pop")
    for k in range(4):
        add(Fly(emoji("💸", 110), q["leak"] + k * 0.22, 0.9, (C - 40, Y + 60), (BOX[2] - 80, BOX[1] + 70 + 30 * k), 50))
    S.append((q["leak"], "whoosh_s"))
    add(El(emoji("✅", 210), q["check"], 17.85, C, Y, "pop"), "ding")
    add(El(emoji("⛔", 210), q["stop"], 19.72, C, Y, "stamp"), "thud")

    # 2. Creative: ten 3D ad cards + 10x counter (remotion Cards3D); counter lands on "عشر"
    HIDE.append((q["cards"], q["cards_out"]))
    for k in range(10):
        S.append((q["cards"] + k * STAGGER_S, "tick"))
    S.append((q["ten"], "ding"))
    for ch, x, k in (("💰", R, "price"), ("📝", C, "content"), ("👥", L, "audience")):
        add(El(emoji(ch, 170), q[k], q["three_out"], x, Y, "pop"), "pop")
    add(El(emoji("🏆", 220), q["trophy"], q["claude2"] - 0.05, C, Y, "pop", bob=5), "ding")
    add(El(emoji("✨", 90), q["trophy"] + 0.2, q["claude2"] - 0.05, C - 170, Y - 70, "pop", bob=8), hide=False)
    add(El(emoji("✨", 70), q["trophy"] + 0.3, q["claude2"] - 0.05, C + 170, Y + 60, "pop", bob=8), hide=False)
    gap3d(q["claude2"], 39.10)                                   # 3D Claude

    # 3. Report
    HIDE.append((q["bars"], q["bars"] + 1.7))                   # 3D growth chart (Bars3D)
    S.append((q["bars"], "pop"))
    S.append((q["bars"] + 0.9, "whoosh_s"))                     # trend arrow draws on
    add(El(emoji("💡", 200), q["bulb"], q["bulb"] + 1.0, C, Y, "pop", bob=6), "ding")
    for ch, x, k in (("💰", R, "budget"), ("📈", C, "revenue"), ("👥", L, "people")):
        add(El(checked(ch, 160), q[k], q["checks_out"], x, Y, "pop"), "ding")
    add(Fly(emoji("🚀", 180), q["rocket"], 1.3, (BOX[0] + 90, BOX[3] - 80), (BOX[2] - 90, BOX[1] + 80)))
    HIDE.append((q["rocket"], q["rocket"] + 1.3))
    S.append((q["rocket"], "rise"))

    # Conclusion
    gap3d(q["claude3"], 57.3)                                    # 3D Claude
    add(El(emoji("⚡", 210), q["fast"], q["clear"] - 0.05, C, Y, "pop", bob=6), "pop")
    add(El(emoji("💡", 210), q["clear"], 61.0, C, Y, "pop", bob=6), "pop")
    return E, S, HIDE


def trim_captions(src, dst, hide):
    """Drop / cut caption events wherever a graphic is on screen."""
    def secs(ts):
        h, m, s_ = ts.split(":")
        return int(h) * 3600 + int(m) * 60 + float(s_)

    def fmt(t):
        h, rem = divmod(max(0.0, t), 3600)
        m, s_ = divmod(rem, 60)
        return f"{int(h)}:{int(m):02d}:{s_:05.2f}"

    out = []
    for line in src.read_text(encoding="utf-8").splitlines(keepends=True):
        if not line.startswith("Dialogue:"):
            out.append(line)
            continue
        parts = line.split(",", 9)
        pieces = [(secs(parts[1]), secs(parts[2]))]
        for h0, h1 in hide:
            nxt = []
            for a, b in pieces:
                if h1 <= a or h0 >= b:
                    nxt.append((a, b))
                else:
                    if h0 - a > 0.25:
                        nxt.append((a, h0))
                    if b - h1 > 0.25:
                        nxt.append((h1, b))
            pieces = nxt
        for a, b in pieces:
            parts[1], parts[2] = fmt(a), fmt(b)
            out.append(",".join(parts))
    dst.write_text("".join(out), encoding="utf-8")


# ---------------------------------------------------------------- sfx
SFX = {
    "pop": "aevalsrc='0.55*sin(2*PI*(420*t+2400*t*t))*exp(-30*t)':d=0.14",
    "tick": "aevalsrc='0.45*sin(2*PI*2200*t)*exp(-140*t)':d=0.05",
    "ding": "aevalsrc='0.35*(sin(2*PI*1568*t)+0.5*sin(2*PI*2349*t)+0.25*sin(2*PI*3136*t))*exp(-6*t)':d=0.8",
    "thud": "aevalsrc='0.9*sin(2*PI*(140*t-70*t*t))*exp(-13*t)':d=0.35",
    "whoosh": "anoisesrc=color=pink:d=0.5:a=0.6,highpass=f=500,lowpass=f=7000,afade=t=in:d=0.3:curve=exp,afade=t=out:st=0.3:d=0.2:curve=exp",
    "whoosh_s": "anoisesrc=color=pink:d=0.7:a=0.35,highpass=f=900,lowpass=f=6000,afade=t=in:d=0.35,afade=t=out:st=0.35:d=0.35:curve=exp",
    "rise": "anoisesrc=color=brown:d=1.1:a=0.7,highpass=f=200,afade=t=in:d=0.7:curve=exp,afade=t=out:st=0.7:d=0.4:curve=exp",
}
SFX_GAIN = {"pop": 0.30, "tick": 0.22, "ding": 0.22, "thud": 0.45, "whoosh": 0.40, "whoosh_s": 0.30, "rise": 0.35}


def make_sfx():
    SFXDIR.mkdir(exist_ok=True)
    for name, src in SFX.items():
        run(["ffmpeg", "-v", "error", "-y", "-f", "lavfi", "-i", src, "-ar", "48000", "-ac", "1",
             str(SFXDIR / f"{name}.wav")])


# ---------------------------------------------------------------- per-frame camera
def make_camera(seg_bounds):
    def cam(t):
        i = max(k for k, (s, _) in enumerate(seg_bounds) if s <= t + 1e-6)
        s, e = seg_bounds[i]
        z = 1.0 + 0.04 * clamp((t - s) / max(e - s, 0.01))
        for ts in [0.0] + SECTIONS:
            if 0 <= t - ts < 0.45:
                z += 0.16 * (1 - ease_out_cubic((t - ts) / 0.45))
        for te in EMPHASIS:
            if 0 <= t - te < 0.32:
                z += 0.07 * math.sin(math.pi * (t - te) / 0.32)
        dx = dy = 0.0
        for ts in SHAKES:
            u = t - ts
            if 0 <= u < 0.4:
                amp = 14 * math.exp(-8 * u)
                dx, dy = amp * math.sin(73 * u), amp * math.cos(61 * u)
        return z, dx, dy
    return cam


WORKERS = 6
OVERLAY3D_RAW = Path(__file__).resolve().parent.parent / "work" / "overlay3d.mov"   # remotion BrandIcons3D @120fps
OVERLAY3D = OVERLAY3D_RAW.with_name("overlay3d_blur.mov")                            # 30fps, motion-blurred


def blur_overlay():
    """120fps -> 30fps with a 180-degree shutter: average sub-frames 4n and 4n+1 in
    premultiplied alpha (so transparent edges don't pick up dark fringes)."""
    fc = ("format=rgba64le,premultiply=inplace=1,tmix=frames=2,select='eq(mod(n\\,4)\\,1)',"
          "setpts=N/30/TB,unpremultiply=inplace=1,format=yuva444p10le")
    run(["ffmpeg", "-v", "error", "-y", "-i", str(OVERLAY3D_RAW), "-vf", fc, "-r", "30",
         "-c:v", "prores_ks", "-profile:v", "4444", "-pix_fmt", "yuva444p10le", str(OVERLAY3D)])


def load_timeline():
    edl = json.loads((WORK / "edl.json").read_text())
    durs = edl["durations"]
    bounds, t0 = [], 0.0
    for d in durs:
        bounds.append((t0, t0 + d))
        t0 += d
    return edl["segments"], durs, bounds


def render_part(job):
    """Render frames [f0, f1) of the timeline to its own NVENC file (runs in a worker process)."""
    k, f0, f1 = job
    _, _, bounds = load_timeline()
    elements, _, _ = storyboard()
    cam = make_camera(bounds)
    tl = WORK / "timeline_hi.mov"
    part = WORK / f"part_{k:02d}.mp4"
    dec = subprocess.Popen(
        ["ffmpeg", "-v", "error", "-hwaccel", "cuda", "-i", str(tl), "-an",
         "-vf", f"fps={FPS},select='between(n\\,{f0}\\,{f1 - 1})'", "-fps_mode", "passthrough",
         "-pix_fmt", "rgb24", "-f", "rawvideo", "pipe:1"], stdout=subprocess.PIPE)
    enc = subprocess.Popen(
        ["ffmpeg", "-v", "error", "-y", "-f", "rawvideo", "-pix_fmt", "rgb24", "-s", f"{W}x{H}",
         "-r", str(FPS), "-i", "pipe:0", "-c:v", "h264_nvenc", "-preset", "p5", "-tune", "hq",
         "-rc", "vbr", "-cq", "13", "-b:v", "0", "-g", "30", "-pix_fmt", "yuv420p", str(part)],
        stdin=subprocess.PIPE)
    fsize = HW * HH * 3
    white = Image.new("RGB", (W, H), WHITE)
    n = f0
    while n < f1:
        buf = dec.stdout.read(fsize)
        if len(buf) < fsize:
            break
        t = n / FPS
        frame = Image.frombuffer("RGB", (HW, HH), buf, "raw", "RGB", 0, 1)
        z, dx, dy = cam(t)
        cw, ch = HW / z, HH / z
        x0 = clamp((HW - cw) / 2 + dx, 0, HW - cw)
        y0 = clamp((HH - ch) * 0.35 + dy, 0, HH - ch)
        img = frame.resize((W, H), Image.BICUBIC, box=(x0, y0, x0 + cw, y0 + ch))
        for el in elements:
            if el.active(t):
                el.draw(img, t)
        for ts in SECTIONS:
            if 0 <= t - ts < 0.22:
                img = Image.blend(img, white, 0.6 * math.exp(-(t - ts) / 0.06))
        enc.stdin.write(img.tobytes())
        n += 1
    enc.stdin.close()
    enc.wait()
    dec.stdout.close()
    dec.wait()
    return k, n - f0


def main():
    import multiprocessing as mp
    import time
    version = sys.argv[1] if len(sys.argv) > 1 else "v7"
    t_start = time.time()
    segs, durs, bounds = load_timeline()

    # stage 1: 4K re-cut (cached)
    files = []
    for i, sg in enumerate(segs):
        f = WORK / f"hi_{i:02d}.mov"
        if not f.exists():
            cut_hi(i, sg)
        d = probe_dur(f)
        if abs(d - durs[i]) > 0.02:
            sys.exit(f"segment {i} duration mismatch {d} vs {durs[i]}")
        files.append(f)
    (WORK / "hi_concat.txt").write_text("".join(f"file '{f}'\n" for f in files))
    tl = WORK / "timeline_hi.mov"
    run(["ffmpeg", "-v", "error", "-y", "-f", "concat", "-safe", "0", "-i", str(WORK / "hi_concat.txt"),
         "-c", "copy", str(tl)])
    total = probe_dur(tl)
    nframes = int(round(total * FPS))

    # stage 2: graphics, rendered in parallel chunks
    blur_overlay()
    make_sfx()
    _, sfx_events, hide = storyboard()
    caps = WORK / "captions_motion.ass"
    trim_captions(WORK / "captions.ass", caps, hide)
    step = math.ceil(nframes / WORKERS)
    jobs = [(k, k * step, min(nframes, (k + 1) * step)) for k in range(WORKERS)]
    with mp.get_context("spawn").Pool(WORKERS) as pool:
        done = pool.map(render_part, jobs)
    got = sum(c for _, c in done)
    print(f"rendered {got}/{nframes} frames in {time.time() - t_start:.0f}s")
    (WORK / "parts.txt").write_text("".join(f"file '{WORK / f'part_{k:02d}.mp4'}'\n" for k, _, _ in jobs))

    # stage 3: captions + audio mix + final encode
    r = subprocess.run(["ffmpeg", "-hide_banner", "-i", str(tl), "-vn", "-af",
                        "highpass=f=80,loudnorm=I=-14:TP=-1.5:LRA=9:print_format=json", "-f", "null", "-"],
                       capture_output=True, text=True)
    m = json.loads(r.stderr[r.stderr.rindex("{"):r.stderr.rindex("}") + 1])
    voice = (f"highpass=f=80,loudnorm=I=-14:TP=-1.5:LRA=9:linear=true:measured_I={m['input_i']}:"
             f"measured_TP={m['input_tp']}:measured_LRA={m['input_lra']}:"
             f"measured_thresh={m['input_thresh']}:offset={m['target_offset']}")
    inputs, chains, labels = [], [], ["[voice]"]
    for k, (t, name) in enumerate(sorted(sfx_events)):
        inputs += ["-i", str(SFXDIR / f"{name}.wav")]
        chains.append(f"[{k + 3}:a]adelay={max(0, int(t * 1000))}:all=1,volume={SFX_GAIN[name]}[s{k}]")
        labels.append(f"[s{k}]")
    fc = (f"[0:v][2:v]overlay={BOX[0]}:{BOX[1]}:eof_action=pass,ass={caps}:shaping=complex,format=yuv420p[v];"
          f"[1:a]{voice}[voice];" + ";".join(chains) + ";" +
          "".join(labels) + f"amix=inputs={len(labels)}:normalize=0:duration=first,alimiter=limit=0.89:level=false[a]")
    final = OUT / f"reel_{version}.mp4"
    run(["ffmpeg", "-v", "error", "-y", "-hwaccel", "cuda", "-f", "concat", "-safe", "0", "-i", str(WORK / "parts.txt"),
         "-i", str(tl), "-i", str(OVERLAY3D), *inputs, "-filter_complex", fc, "-map", "[v]", "-map", "[a]",
         "-c:v", "h264_nvenc", "-preset", "p7", "-tune", "hq", "-rc", "vbr", "-cq", "18", "-b:v", "0",
         "-maxrate", "18M", "-bufsize", "36M", "-profile:v", "high", "-g", "60",
         "-c:a", "aac", "-b:a", "192k", "-ar", "48000", "-ac", "2", "-movflags", "+faststart",
         "-t", f"{total:.3f}", str(final)])
    print(f"FINAL {final} {probe_dur(final):.2f}s in {time.time() - t_start:.0f}s total, "
          f"{len(sfx_events)} sfx, {len(hide)} caption-hide windows")


if __name__ == "__main__":
    main()
