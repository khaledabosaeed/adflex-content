# Title-card look for ALFA (v17): richer brand background + wordmark options.
import math
import numpy as np
from PIL import Image, ImageDraw, ImageFont, ImageFilter
from hero2 import W, H, CX, CY, U, WIDE, clamp, prog, eo3, eio, lerp, paste

ASSETS = '/home/claude/alfa/assets/'
BLUE, VIOL, PINK = np.array((50, 146, 255.)), np.array((152, 72, 254.)), np.array((255, 105, 200.))

def bg2(t=0.0, seed=0):
    """deep #0b0520 base, drifting blue/violet aurora, faint logo-pink accent, spotlight, grain, vignette"""
    w, h = W // 4, H // 4
    yy, xx = np.mgrid[0:h, 0:w].astype(np.float32); xx /= w; yy /= h
    ar = W / H
    def blob(cx, cy, r, col, k):
        d = np.sqrt(((xx - cx) * ar) ** 2 + (yy - cy) ** 2)
        return (np.exp(-(d / r) ** 2))[..., None] * col * k
    img = np.zeros((h, w, 3), np.float32) + np.array((11, 5, 32), np.float32)
    s = math.sin(t * 0.9); c = math.cos(t * 0.7)
    img += blob(0.12 + 0.04 * s, 0.10 + 0.03 * c, 0.55, BLUE, 0.42)
    img += blob(0.92 - 0.04 * c, 0.95 + 0.02 * s, 0.65, VIOL, 0.48)
    img += blob(0.80 + 0.03 * s, 0.18, 0.30, PINK, 0.10)
    img += blob(0.5, 0.47, 0.42, np.array((90, 50, 190.)), 0.30)          # spotlight behind the title
    # soft diagonal light streak
    d = (xx * ar + yy * 0.8) - (0.9 + 0.15 * s)
    img += (np.exp(-(d / 0.08) ** 2) * 0.10)[..., None] * np.array((170, 150, 255.))
    # vignette
    v = np.sqrt(((xx - 0.5) * ar * 0.9) ** 2 + ((yy - 0.5) * 1.1) ** 2)
    img *= np.clip(1.15 - v * 0.75, 0.45, 1)[..., None]
    out = Image.fromarray(np.clip(img, 0, 255).astype(np.uint8)).resize((W, H), Image.BICUBIC)
    g = np.random.default_rng(seed).normal(0, 4.0, (H, W, 1)).astype(np.float32)
    a = np.clip(np.asarray(out).astype(np.float32) + g, 0, 255).astype(np.uint8)
    return Image.fromarray(a).convert('RGBA')

def _grad_h(w, h, stops):
    g = np.linspace(0, 1, w); cols = np.stack([np.interp(g, [q for q, _ in stops], [c[i] for _, c in stops]) for i in range(3)], 1)
    return np.repeat(cols[None], h, 0)
def _grad_v(w, h, stops):
    g = np.linspace(0, 1, h); cols = np.stack([np.interp(g, [q for q, _ in stops], [c[i] for _, c in stops]) for i in range(3)], 1)
    return np.repeat(cols[:, None], w, 1)

STYLES = {
    # chrome: white → lavender, brand-gradient glow
    'A': dict(font='Unbounded-900.ttf', track=0.02, fill='chrome'),
    # brand: brighter logo gradient + white highlight on the top half
    'B': dict(font='Unbounded-900.ttf', track=0.02, fill='brand'),
    # current font (Outfit 800) with the chrome treatment
    'C': dict(font='Outfit-800.ttf', track=0.03, fill='chrome'),
}

_WM = {}
def wordmark(style, size, sweep=None):
    key = (style, int(size), None if sweep is None else round(sweep, 3))
    if key in _WM: return _WM[key]
    st = STYLES[style]; f = ImageFont.truetype(ASSETS + st['font'], int(size))
    txt = 'ALFA'; tr = size * st['track']
    ws = [f.getlength(ch) for ch in txt]; tw = sum(ws) + tr * (len(txt) - 1)
    l, t0, r, b = f.getbbox(txt); th = b - t0
    pad = int(size * 0.45); Wd, Hd = int(tw + 2 * pad), int(th + 2 * pad)
    m = Image.new('L', (Wd, Hd), 0); d = ImageDraw.Draw(m); x = pad
    for ch, cw in zip(txt, ws):
        d.text((x, pad - t0), ch, font=f, fill=255); x += cw + tr
    if st['fill'] == 'chrome':
        fill = _grad_v(Wd, Hd, [(0.0, (255, 255, 255)), (0.45, (240, 236, 255)), (0.62, (205, 188, 255)), (1.0, (170, 150, 245))])
        glow_cols = [(0.0, (90, 170, 255)), (1.0, (160, 80, 255))]
    else:
        fill = _grad_h(Wd, Hd, [(0.0, (142, 197, 255)), (0.33, (60, 150, 255)), (0.72, (160, 88, 255)), (1.0, (190, 130, 255))])
        hi = _grad_v(Wd, Hd, [(0.0, (1, 1, 1)), (0.5, (0.35, 0.35, 0.35)), (0.51, (0, 0, 0)), (1, (0, 0, 0))])
        fill = fill + (255 - fill) * hi * 0.55
        glow_cols = [(0.0, (60, 150, 255)), (1.0, (152, 72, 254))]
    if sweep is not None:   # light sweep across the letters, 0..1
        xg = np.linspace(0, 1, Wd)[None, :]; yg = np.linspace(0, 1, Hd)[:, None]
        band = np.exp(-(((xg + yg * 0.35) - lerp(-0.3, 1.4, sweep)) / 0.06) ** 2)[..., None]
        fill = fill + (255 - fill) * band * 0.85
    out = Image.new('RGBA', (Wd, Hd), (0, 0, 0, 0))
    gl = Image.fromarray(_grad_h(Wd, Hd, glow_cols).astype(np.uint8)).convert('RGBA')
    gl.putalpha(m.filter(ImageFilter.GaussianBlur(size * 0.16)).point(lambda v: int(v * 0.85)))
    out.alpha_composite(gl)
    gl2 = gl.copy(); gl2.putalpha(m.filter(ImageFilter.GaussianBlur(size * 0.05)).point(lambda v: int(v * 0.6)))
    out.alpha_composite(gl2)
    fi = Image.fromarray(np.clip(fill, 0, 255).astype(np.uint8)).convert('RGBA'); fi.putalpha(m)
    out.alpha_composite(fi)
    _WM[key] = out
    return out

def by_text(size):
    f = ImageFont.truetype(ASSETS + 'Outfit-500.ttf', int(size))
    w = int(f.getlength('by') + 8); asc, desc = f.getmetrics()
    im = Image.new('RGBA', (w, asc + desc + 8), (0, 0, 0, 0))
    ImageDraw.Draw(im).text((4, 4), 'by', font=f, fill=(217, 200, 255, 255))
    return im

# ---- staggered-letter version of style B for hero11.alfa_word (ALFA beat, end card, title) ----
_AL = {}
def alfa_letters_B(size):
    """size = the old Outfit size in px; Unbounded is wider, so it is drawn at 0.76x"""
    if size in _AL: return _AL[size]
    fs = size * 0.76
    f = ImageFont.truetype(ASSETS + 'Unbounded-900.ttf', int(fs)); txt = 'ALFA'; tr = fs * 0.02
    ws = [f.getlength(ch) for ch in txt]; tw = sum(ws) + tr * (len(txt) - 1)
    l, t0, r, b = f.getbbox(txt); th = b - t0
    pad = int(fs * 0.45); Wd, Hd = int(tw + 2 * pad), int(th + 2 * pad)
    fill = _grad_h(Wd, Hd, [(0.0, (142, 197, 255)), (0.33, (60, 150, 255)), (0.72, (160, 88, 255)), (1.0, (190, 130, 255))])
    hi = _grad_v(Wd, Hd, [(0.0, (1, 1, 1)), (0.5, (0.35, 0.35, 0.35)), (0.51, (0, 0, 0)), (1, (0, 0, 0))])
    fill = Image.fromarray(np.clip(fill + (255 - fill) * hi * 0.55, 0, 255).astype(np.uint8)).convert('RGBA')
    glow = Image.fromarray(_grad_h(Wd, Hd, [(0.0, (60, 150, 255)), (1.0, (152, 72, 254))]).astype(np.uint8)).convert('RGBA')
    out = []; x = pad
    for ch, cw in zip(txt, ws):
        m = Image.new('L', (Wd, Hd), 0); ImageDraw.Draw(m).text((x, pad - t0), ch, font=f, fill=255); x += cw + tr
        L = Image.new('RGBA', (Wd, Hd), (0, 0, 0, 0))
        g = glow.copy(); g.putalpha(m.filter(ImageFilter.GaussianBlur(fs * 0.16)).point(lambda v: int(v * 0.85))); L.alpha_composite(g)
        g2 = glow.copy(); g2.putalpha(m.filter(ImageFilter.GaussianBlur(fs * 0.05)).point(lambda v: int(v * 0.6))); L.alpha_composite(g2)
        fi = fill.copy(); fi.putalpha(m); L.alpha_composite(fi)
        out.append(L)
    _AL[size] = out
    return out

# ---- animated ALFA (per-letter transforms + flowing gradient + sweep) ----
class AnimWord:
    def __init__(self, size):
        fs = size * 0.76; self.fs = fs
        f = ImageFont.truetype(ASSETS + 'Unbounded-900.ttf', int(fs)); txt = 'ALFA'; tr = fs * 0.02
        ws = [f.getlength(ch) for ch in txt]; tw = sum(ws) + tr * 3
        l, t0, r, b = f.getbbox(txt); th = b - t0
        pad = int(fs * 0.45); self.Wd, self.Hd = int(tw + 2 * pad), int(th + 2 * pad)
        self.masks, self.boxes = [], []
        x = pad
        for ch, cw in zip(txt, ws):
            m = Image.new('L', (self.Wd, self.Hd), 0); ImageDraw.Draw(m).text((x, pad - t0), ch, font=f, fill=255); x += cw + tr
            bb = m.getbbox(); g = int(fs * 0.4)
            bb = (max(0, bb[0] - g), max(0, bb[1] - g), min(self.Wd, bb[2] + g), min(self.Hd, bb[3] + g))
            self.masks.append(m.crop(bb)); self.boxes.append(bb)
        self.glow_m = [m.filter(ImageFilter.GaussianBlur(fs * 0.16)).point(lambda v: int(v * 0.85)) for m in self.masks]
        self.glow2_m = [m.filter(ImageFilter.GaussianBlur(fs * 0.05)).point(lambda v: int(v * 0.6)) for m in self.masks]
        stops = [(0.0, (142, 197, 255)), (0.33, (60, 150, 255)), (0.72, (160, 88, 255)), (1.0, (190, 130, 255))]
        # a 2x wide, mirrored gradient so it can flow (shift) seamlessly
        g1 = _grad_h(self.Wd, 1, stops)[0]; self.gline = np.concatenate([g1, g1[::-1]], 0)
        self.hi = _grad_v(1, self.Hd, [(0.0, (1, 1, 1)), (0.5, (0.35, 0.35, 0.35)), (0.51, (0, 0, 0)), (1, (0, 0, 0))])[:, 0]
        self.glow_line = _grad_h(self.Wd, 1, [(0.0, (60, 150, 255)), (1.0, (152, 72, 254))])[0]

    def letter(self, i, shift=0.0, sweep=None):
        x0, y0, x1, y1 = self.boxes[i]; w, h = x1 - x0, y1 - y0
        n = len(self.gline); idx = (np.arange(x0, x1) + int(shift * self.Wd)) % n
        fill = np.repeat(self.gline[idx][None], h, 0)
        hi = self.hi[y0:y1][:, None, :]
        fill = fill + (255 - fill) * hi * 0.55
        if sweep is not None:
            xg = (np.arange(x0, x1) / self.Wd)[None, :]; yg = (np.arange(y0, y1) / self.Hd)[:, None]
            band = np.exp(-(((xg + yg * 0.35) - lerp(-0.3, 1.4, sweep)) / 0.06) ** 2)[..., None]
            fill = fill + (255 - fill) * band * 0.85
        out = Image.new('RGBA', (w, h), (0, 0, 0, 0))
        gl = Image.fromarray(np.repeat(self.glow_line[x0:x1][None], h, 0).astype(np.uint8)).convert('RGBA')
        g = gl.copy(); g.putalpha(self.glow_m[i]); out.alpha_composite(g)
        g = gl.copy(); g.putalpha(self.glow2_m[i]); out.alpha_composite(g)
        fi = Image.fromarray(np.clip(fill, 0, 255).astype(np.uint8)).convert('RGBA'); fi.putalpha(self.masks[i]); out.alpha_composite(fi)
        return out

    def centre(self, i, cx, cy):
        x0, y0, x1, y1 = self.boxes[i]
        return cx - self.Wd / 2 + (x0 + x1) / 2, cy - self.Hd / 2 + (y0 + y1) / 2

def logo_star(logo):
    """centre of the pink 4-point sparkle in the AdFlex logo (logo pixel coords)"""
    a = np.asarray(logo.convert('RGBA')).astype(int)
    m = (a[..., 0] > 200) & (a[..., 1] < 150) & (a[..., 2] > 140) & (a[..., 3] > 120)
    ys, xs = np.nonzero(m)
    if len(xs) == 0: return logo.width * 0.2, logo.height * 0.1
    return xs.mean(), ys.mean()

def sparkle(size, rot=0.0):
    s = int(size); im = Image.new('RGBA', (s * 2, s * 2), (0, 0, 0, 0)); c = s
    m = Image.new('L', im.size, 0); d = ImageDraw.Draw(m)
    k = s * 0.16
    d.polygon([(c, c - s), (c + k, c - k), (c + s, c), (c + k, c + k), (c, c + s), (c - k, c + k), (c - s, c), (c - k, c - k)], fill=255)
    gl = Image.new('RGBA', im.size, (255, 140, 220, 0)); gl.putalpha(m.filter(ImageFilter.GaussianBlur(s * 0.18)))
    im.alpha_composite(gl)
    core = Image.new('RGBA', im.size, (255, 245, 255, 0)); core.putalpha(m); im.alpha_composite(core)
    return im.rotate(rot, resample=Image.BICUBIC)
