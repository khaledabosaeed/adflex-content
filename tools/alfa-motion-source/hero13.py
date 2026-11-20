#!/usr/bin/env python3
# ALFA hero v13 = v11 (ORRA watch) with the review fixes:
#  1 labels appear as whole words (no half letters inside transitions)
#  2 ALFA is written over the sheet while the warm office stays visible
#  3 ALFA holds ~1.5 s with a readable tagline
#  4 Any Size shows three real formats (9:16 / 16:9 / 1:1)
#  5 calendar bigger & brighter; the timer stop is a big centered moment
#  6 no empty frames between scenes
#  7 bigger timer chip, no tiny AdFlex mark (logo only on the end card)
#   python3 hero13.py wide|tall frames t1,t2  |  python3 hero13.py wide|tall render out.mp4
import sys, os, math, subprocess
import hero11 as h11
h10, H8, H5, H2 = h11.h10, h11.H8, h11.H5, h11.H2
from hero2 import W, H, CX, CY, U, WIDE, clamp, prog, eo3, ei3, eio, eback, lerp, paste
import numpy as np
from PIL import Image, ImageDraw, ImageFont, ImageFilter, ImageEnhance

FPS, DUR = 30, 20.0
ASSETS = '/home/claude/alfa/assets/'
T_OPEN = h10.T_OPEN                       # 4.767
IMPACT, SLAP = h10.IMPACT, h10.SLAP       # 1.75, 4.50

# ---------------- schedule ----------------
A1 = T_OPEN            # ALFA beat (2.0 s)
A2 = A1 + 2.0          # 6.767 zoom-through
C0 = A2 + 0.40;  C1 = C0 + 1.80          # product video
D0 = C1 + 0.35;  D1 = D0 + 1.60          # billboard
E0 = D1 + 0.25;  E1 = E0 + 1.60          # UGC
F0 = E1 + 0.35;  F1 = F0 + 1.40          # any size
G0 = F1 + 0.30;  G1 = G0 + 1.40          # scheduled
H0 = G1;         HSTOP = H0 + 0.55; H1 = H0 + 1.55   # timer stop
I0 = H1 + 0.25                           # end card (crossfade H1..I0)
TIMER_START = A1 + 0.3
def timer_secs(t):
    if t < TIMER_START: return 0
    return int(3492 * (prog(t, TIMER_START, HSTOP) ** 1.1))
H5.timer_secs = timer_secs

BLUE, VIOLET = h11.BLUE, h11.VIOLET
def F(w, size): return ImageFont.truetype(ASSETS + f'Outfit-{w}.ttf', int(size))


# ---------------- helpers ----------------
def ad_frame(t):  return H5.grade_bottom(H5.fit_frame(H5.frame('ad', 0.2 + (t - A2) * 1.4), 'ad', zoom=lerp(1.0, 1.06, prog(t, C0, C1))))
def bb_frame(t):  return H5.grade_bottom(H5.fit_frame(H5.frame('bb', 0.1 + (t - C1) * 1.3), 'bb'))
def ugc_frame(t): return H5.grade_bottom(H5.fit_frame(H5.frame('ugc', 0.2 + (t - D1) * 1.2), 'ugc'))
def raw(k, ct):   return H5.frame(k, ct)

def grad_fill(mask):
    w, h = mask.size
    g = np.linspace(0, 1, w)[None, :, None]
    arr = (np.array(BLUE) * (1 - g) + np.array(VIOLET) * g).astype(np.uint8).repeat(h, 0)
    im = Image.fromarray(arr, 'RGB').convert('RGBA'); im.putalpha(mask); return im

_TT = {}
def two_tone(w1, w2, size, weight=700):
    """one baseline for both words; w1 white, w2 AdFlex gradient; soft shadow"""
    key = (w1, w2, int(size), weight)
    if key in _TT: return _TT[key]
    f = F(weight, size); gap = size * 0.24
    a = f.getlength(w1) if w1 else 0; b = f.getlength(w2) if w2 else 0
    tw = a + (gap if w1 and w2 else 0) + b
    pad = int(size * 0.35); asc, desc = f.getmetrics()
    Wd, Hd = int(tw + 2 * pad), int(asc + desc + 2 * pad)
    m1 = Image.new('L', (Wd, Hd), 0); m2 = Image.new('L', (Wd, Hd), 0)
    if w1: ImageDraw.Draw(m1).text((pad, pad + asc), w1, font=f, fill=255, anchor='ls')
    if w2: ImageDraw.Draw(m2).text((pad + a + (gap if w1 else 0), pad + asc), w2, font=f, fill=255, anchor='ls')
    out = Image.new('RGBA', (Wd, Hd), (0, 0, 0, 0))
    sh = Image.new('RGBA', (Wd, Hd), (6, 4, 14, 0)); both = Image.fromarray(np.maximum(np.asarray(m1), np.asarray(m2)))
    sh.putalpha(both.filter(ImageFilter.GaussianBlur(size * 0.12)).point(lambda v: int(v * 0.7)))
    out.alpha_composite(sh)
    if w1:
        wh = Image.new('RGBA', (Wd, Hd), (255, 255, 255, 0)); wh.putalpha(m1); out.alpha_composite(wh)
    if w2:
        gl = Image.new('RGBA', (Wd, Hd), VIOLET + (0,)); gl.putalpha(m2.filter(ImageFilter.GaussianBlur(size * 0.08)).point(lambda v: int(v * 0.5)))
        out.alpha_composite(gl); out.alpha_composite(grad_fill(m2))
    _TT[key] = (out, pad, tw)
    return _TT[key]

def show(img, im, cx, cy, t, t_in, t_out=None, rise=26, d=0.28):
    """whole-word entry: fade + slide up; exit: fade + slide up before t_out"""
    a = eo3(prog(t, t_in, t_in + d))
    o = eio(prog(t, t_out - 0.2, t_out)) if t_out else 0
    al = a * (1 - o)
    if al <= 0: return
    paste(img, im, cx, cy + (1 - a) * rise * U - o * 18 * U, al)


# ================= AdFlex brand look (same system as the Genjutsu promo) =================
STOPS = [(0.0, (108, 180, 255)), (0.30, (50, 146, 255)), (0.72, (152, 72, 254)), (1.0, (103, 48, 212))]   # logo gradient
BOXST = [(0.0, (50, 146, 255)), (0.55, (152, 72, 254)), (1.0, (103, 48, 212))]                             # caption box
LAV = (217, 193, 251); DEEP = (13, 6, 36); GLOW = (140, 80, 255)
def grad_arr(w, h, stops):
    g = np.linspace(0, 1, max(1, w)); cols = np.zeros((len(g), 3))
    for c in range(3): cols[:, c] = np.interp(g, [q for q, _ in stops], [v[c] for _, v in stops])
    return np.repeat(cols[None].astype(np.uint8), h, 0)
def grad_fill(mask, stops=STOPS):
    im = Image.fromarray(grad_arr(*mask.size, stops), 'RGB').convert('RGBA'); im.putalpha(mask); return im

def make_bg():
    yy, xx = np.mgrid[0:H, 0:W].astype(np.float32); D = max(W, H)
    bg = np.zeros((H, W, 3), np.float32) + np.array(DEEP, np.float32)
    def glow(cx, cy, r, col, k):
        d = np.sqrt(((xx - cx) / D) ** 2 + ((yy - cy) / D) ** 2); return (np.clip(1 - d / r, 0, 1) ** 2)[..., None] * np.array(col, np.float32) * k
    bg += glow(W * 0.08, H * 0.05, 0.62, (50, 146, 255), 0.30) + glow(W * 0.95, H * 1.0, 0.70, (152, 72, 254), 0.36) + glow(W * 0.5, H * 0.45, 0.5, (60, 30, 110), 0.25)
    return Image.fromarray(np.clip(bg, 0, 255).astype(np.uint8)).convert('RGBA')
H2.BG = make_bg()

_AL = {}
def alfa_letters(size):
    if size in _AL: return _AL[size]
    f = F(800, size); track = size * 0.03; xs, x = [], 0.0
    for ch in 'ALFA': xs.append(x); x += f.getlength(ch) + track
    tw = x - track; l, t_, r, b = f.getbbox('ALFA'); pad = int(size * 0.3)
    w, h = int(tw + 2 * pad), int(b - t_ + 2 * pad)
    grad = Image.fromarray(np.pad(grad_arr(int(tw), h, STOPS), ((0, 0), (pad, w - pad - int(tw)), (0, 0)), mode='edge'), 'RGB')
    out = []
    for ch, x0 in zip('ALFA', xs):
        m = Image.new('L', (w, h), 0); ImageDraw.Draw(m).text((pad + x0, pad - t_), ch, font=f, fill=255)
        gl = Image.new('RGBA', (w, h), GLOW + (0,)); gl.putalpha(m.filter(ImageFilter.GaussianBlur(size * 0.1)).point(lambda v: int(v * 0.7)))
        fill = grad.convert('RGBA'); fill.putalpha(m); gl.alpha_composite(fill); out.append(gl)
    _AL[size] = out; return out
h11.alfa_letters = alfa_letters

_CP = {}
def cap_parts(w1, w2, size, weight=700):
    key = (w1, w2, int(size), weight)
    if key in _CP: return _CP[key]
    f = F(weight, size); asc, desc = f.getmetrics(); lh = int(asc + desc)
    def word(txt):
        m = Image.new('L', (int(f.getlength(txt)) + 4, lh), 0); ImageDraw.Draw(m).text((2, asc), txt, font=f, fill=255, anchor='ls'); return m
    m1 = word(w1) if w1 else None; m2 = word(w2)
    px, py = int(size * 0.24), int(size * 0.10)
    bw, bh = m2.width + 2 * px, lh + 2 * py
    box = Image.new('RGBA', (bw, bh), (0, 0, 0, 0)); bm = Image.new('L', (bw, bh), 0)
    ImageDraw.Draw(bm).rounded_rectangle([0, 0, bw - 1, bh - 1], int(size * 0.2), fill=255)
    box.alpha_composite(grad_fill(bm, BOXST))
    hl = Image.new('RGBA', (bw, bh), (255, 255, 255, 0)); hm = Image.new('L', (bw, bh), 0)
    ImageDraw.Draw(hm).rounded_rectangle([2, 2, bw - 3, bh // 2], int(size * 0.18), fill=34); hl.putalpha(hm); box.alpha_composite(hl)
    gap = int(size * 0.26); w1w = (m1.width + gap) if m1 else 0
    _CP[key] = dict(m1=m1, m2=m2, box=box, bm=bm, px=px, py=py, gap=gap, w1w=w1w, W=w1w + bw, H=bh, lh=lh, size=size)
    return _CP[key]

def caption(img, w1, w2, size, t, t_in, t_out=None, anchor='c', x=None, y=None, weight=700):
    """Genjutsu caption: white words rise out of a mask, gradient box wipes open from the left,
       highlighted words rise inside it, one small pulse."""
    P = cap_parts(w1, w2, size, weight)
    if t < t_in: return
    o = eio(prog(t, t_out - 0.2, t_out)) if t_out else 0
    if o >= 1: return
    Wc, Hc, sz = P['W'], P['H'], P['size']; pad = int(sz * 0.3)
    L = Image.new('RGBA', (Wc + 2 * pad, Hc + 2 * pad), (0, 0, 0, 0))
    if P['m1'] is not None:
        q = eo3(prog(t, t_in, t_in + 0.32)); m1 = P['m1']
        if q > 0:
            lay = Image.new('L', m1.size, 0); lay.paste(m1.point(lambda v, q=q: int(v * min(1, q * 1.6))), (0, int((1 - q) * m1.height * 0.45)))
            sh = Image.new('RGBA', m1.size, (4, 2, 14, 0)); sh.putalpha(lay.filter(ImageFilter.GaussianBlur(sz * 0.1)).point(lambda v: int(v * 0.65)))
            L.alpha_composite(sh, (pad, pad + P['py'] + int(sz * 0.03)))
            wh = Image.new('RGBA', m1.size, (255, 255, 255, 0)); wh.putalpha(lay); L.alpha_composite(wh, (pad, pad + P['py']))
    bx = pad + P['w1w']; qb = eo3(prog(t, t_in + 0.10, t_in + 0.42))
    if qb > 0:
        box = P['box']; cw = max(1, int(box.width * qb))
        gl = Image.new('RGBA', box.size, GLOW + (0,)); gl.putalpha(P['bm'].filter(ImageFilter.GaussianBlur(sz * 0.18)).point(lambda v: int(v * 0.45)))
        clip = Image.new('L', box.size, 0); ImageDraw.Draw(clip).rectangle([0, 0, cw, box.height], fill=255)
        g2 = gl.copy(); g2.putalpha(Image.fromarray(np.minimum(np.asarray(gl.getchannel('A')), np.asarray(clip))))
        b2 = box.copy(); b2.putalpha(Image.fromarray(np.minimum(np.asarray(box.getchannel('A')), np.asarray(clip))))
        L.alpha_composite(g2, (bx, pad)); L.alpha_composite(b2, (bx, pad))
        q2 = eo3(prog(t, t_in + 0.24, t_in + 0.52)); m2 = P['m2']
        if q2 > 0:
            lay = Image.new('L', m2.size, 0); lay.paste(m2.point(lambda v, q=q2: int(v * min(1, q * 1.6))), (0, int((1 - q2) * m2.height * 0.45)))
            wh = Image.new('RGBA', m2.size, (255, 255, 255, 0)); wh.putalpha(lay); L.alpha_composite(wh, (bx + P['px'], pad + P['py']))
    pulse = math.sin(math.pi * prog(t, t_in + 0.5, t_in + 0.72)) * 0.035
    al = 1 - o; dy = -o * 18 * U
    if anchor == 'l': cx = x - pad + L.width / 2
    else: cx = x if x is not None else CX
    paste(img, L, cx, y + dy, al, scale=1 + pulse)

def lav_text(txt, size, weight=600):
    im, _, _ = two_tone(txt, '', size, weight); return im

def label(img, w1, w2, t, t_in, t_out):
    if WIDE: caption(img, w1, w2, 104 * U, t, t_in, t_out, anchor='l', x=90, y=H - 135)
    else: caption(img, w1, w2, 96 * U, t, t_in, t_out, x=CX, y=H - 175 * U)

def brand_chip(t):
    sec = timer_secs(t); txt = f'{sec // 3600:02d}:{(sec % 3600) // 60:02d}:{sec % 60:02d}'
    f = F(600, 40 * U); h = int(72 * U); w = int(f.getlength('00:00:00') + h * 1.35)
    c = Image.new('RGBA', (w, h), (0, 0, 0, 0)); d = ImageDraw.Draw(c)
    d.rounded_rectangle([0, 0, w - 1, h - 1], h // 2, fill=DEEP + (215,), outline=LAV + (110,), width=2)
    r = h * 0.24; ccx = h * 0.52; cy = h / 2
    d.ellipse([ccx - r, cy - r, ccx + r, cy + r], outline=(108, 180, 255), width=3)
    d.line([(ccx, cy), (ccx, cy - r * 0.65)], fill=(108, 180, 255), width=3); d.line([(ccx, cy), (ccx + r * 0.5, cy)], fill=(152, 72, 254), width=3)
    d.text((h * 0.95, cy), txt, font=f, fill='white', anchor='lm')
    return c
def chip(img, t, a=1.0):
    if a <= 0: return
    c = brand_chip(t)
    paste(img, c, W - c.width / 2 - 44 * U, 44 * U + c.height / 2, a)

def ccard(content, w, h, r, shadow=True, glow=0.0):
    w, h, r = max(8, int(round(w))), max(8, int(round(h))), int(max(0, r))
    m = int(max(16, min(w, h) * 0.12)) if shadow else 0
    out = Image.new('RGBA', (w + 2 * m, h + 2 * m), (0, 0, 0, 0))
    if glow > 0:
        g = Image.new('RGBA', out.size, GLOW + (0,)); gm = Image.new('L', out.size, 0)
        ImageDraw.Draw(gm).rounded_rectangle([m, m, m + w, m + h], max(r, 6), fill=int(200 * glow))
        g.putalpha(gm.filter(ImageFilter.GaussianBlur(m * 0.6))); out.alpha_composite(g)
    if shadow: out.alpha_composite(H2.shadow(w, h, max(r, 6), m))
    c = content.convert('RGBA').resize((w, h), Image.BILINEAR)
    if r > 0:
        out.paste(c, (m, m), H2.rr_mask(w, h, r))
        b = Image.new('RGBA', (w, h), (0, 0, 0, 0))
        ImageDraw.Draw(b).rounded_rectangle([0, 0, w - 1, h - 1], r, outline=LAV + (70,), width=2)
        out.alpha_composite(b, (m, m))
    else: out.paste(c, (m, m))
    return out

def darken(img, a):
    if a > 0: img.alpha_composite(Image.new('RGBA', img.size, (8, 5, 18, int(255 * clamp(a)))))
    return img

# ---------------- ALFA beat ----------------
DIM_FULL = False
TAGLINE = ('Your AI', 'marketing agent')
def alfa_beat(t):
    img = H5.fit_frame(H8.last_b(), 'gB', zoom=lerp(1.08, 1.12, prog(t, A1, A2)))
    dim = 1.0 if DIM_FULL else eio(prog(t, A1, A1 + 0.3))
    img = Image.blend(img, img.filter(ImageFilter.GaussianBlur(12)), 0.75 * dim)
    darken(img, 0.38 * dim)
    # soft dark halo behind the wordmark so it reads over the sheet, office stays warm around it
    halo = Image.new('L', (W, H), 0)
    hw, hh = (1500, 720) if WIDE else (1100, 760)
    ImageDraw.Draw(halo).ellipse([CX - hw / 2, CY - hh / 2 - 20 * U, CX + hw / 2, CY + hh / 2 - 20 * U], fill=int(235 * dim))
    hl = Image.new('RGBA', (W, H), (10, 6, 22, 0)); hl.putalpha(halo.filter(ImageFilter.GaussianBlur(110 * U)))
    img.alpha_composite(hl); H8.vign(img)
    out = eio(prog(t, A1 + 1.55, A1 + 1.75))
    h11.alfa_word(img, prog(t, A1 + 0.1, A1 + 0.75), CX, CY - 40 * U, 330, 1 - out)
    caption(img, TAGLINE[0], TAGLINE[1], 56 * U, t, A1 + 0.6, A1 + 1.75, x=CX, y=CY + 170 * U, weight=600)
    lp = eo3(prog(t, A1 + 1.6, A2))
    if lp > 0:
        ph = H8.photo_crop(); cx, cy = H8.photo_center_screen()
        base_h = (H8.PHOTO_BOX[3] - H8.PHOTO_BOX[1]) * (1 if WIDE else H / 1080) * 1.1
        hh2 = base_h * lerp(1.0, 1.18, lp)
        paste(img, H2.card(ph, hh2 * ph.width / ph.height, hh2, glow=0.9 * lp), lerp(cx, CX, lp), lerp(cy, CY, lp), 1)
    chip(img, t, eo3(prog(t, TIMER_START, TIMER_START + 0.25)))
    return img

# ---------------- any size: three formats ----------------
def size_rects():
    cw = 720; ch = cw * 9 / 16; vh = 560; vw = vh * 9 / 16; sw = 470
    gap = 56; tot = vw + cw + sw + 2 * gap
    sc = min(1.0, (W - 90) / tot); cy = CY + 30 * U
    x0 = CX - tot * sc / 2
    r_v = (x0 + vw * sc / 2, cy, vw * sc, vh * sc)
    r_c = (x0 + (vw + gap + cw / 2) * sc, cy, cw * sc, ch * sc)
    r_s = (x0 + (vw + gap + cw + gap + sw / 2) * sc, cy, sw * sc, sw * sc)
    return r_v, r_c, r_s

def size_layer(t, center_done=True):
    L = H2.BG.copy()
    r_v, r_c, r_s = size_rects()
    items = [(r_v, lambda: H2.crop_aspect(raw('ad', 1.2 + (t - F0) * 0.8), 9 / 16), '9:16', F0 + 0.05, -1),
             (r_c, lambda: H2.crop_aspect(raw('ugc', 0.2 + (t - D1) * 1.2), 16 / 9), '16:9', F0 - 1, 0),
             (r_s, lambda: H2.crop_aspect(raw('bb', 0.8 + (t - F0) * 0.8), 1.0), '1:1', F0 + 0.15, 1)]
    for (x, y, w, h), src, tag, t_in, side in items:
        q = 1.0 if side == 0 else eo3(prog(t, t_in, t_in + 0.4))
        if q <= 0: continue
        if side == 0 and not center_done: continue
        dx = side * (1 - q) * 220 * U
        paste(L, ccard(src(), w, h, 18, glow=0.35), x + dx, y, q)
        tim, _, _ = two_tone(tag, '', 40 * U, 600)
        show(L, tim, x + dx, y + h / 2 + 56 * U, t, t_in + 0.15 if side else F0 + 0.1, None, rise=10)
    caption(L, 'Any', 'Size.', 104 * U, t, F0 + 0.05, x=CX, y=(CY - 360) if WIDE else (CY - 440 * U))
    return L

# ---------------- scheduled ----------------
def sched_layer(t, title=True):
    L = H2.BG.copy()
    H5.calendar(L, 14.55 + 0.7 + (t - G0) * 2.0, 14.55)
    L = ImageEnhance.Brightness(L.convert('RGB')).enhance(1.22).convert('RGBA')
    s = 1.1 if WIDE else 1.0
    if s > 1: L = L.resize((int(W * s), int(H * s)), Image.BICUBIC).crop((int(W * (s - 1) / 2), int(H * (s - 1) / 2) - int(30 * U), int(W * (s - 1) / 2) + W, int(H * (s - 1) / 2) - int(30 * U) + H))
    if title:
        caption(L, 'Auto', 'Scheduled.', 104 * U, t, G0 + 0.05, G1, x=CX, y=(CY - 380) if WIDE else (CY - 470 * U))
    return L

# ---------------- timer stop ----------------
def timer_scene(t):
    img = sched_layer(G1, title=False)
    dim = eio(prog(t, H0, H0 + 0.25)); darken(img, 0.72 * dim)
    img = Image.blend(img, img.filter(ImageFilter.GaussianBlur(10)), 0.7 * dim)
    s = int(3492 * (prog(t, TIMER_START, HSTOP) ** 1.1)) if t < HSTOP else 3492
    txt = f'{s // 3600:02d}:{(s % 3600) // 60:02d}:{s % 60:02d}'
    size = (230 if WIDE else 170) * U
    f = F(800, size)
    # fixed-width digits so the counter doesn't jitter
    cw = max(f.getlength(d) for d in '0123456789'); colw = f.getlength(':')
    tw = cw * 6 + colw * 2; pad = int(size * 0.3); asc, desc = f.getmetrics()
    m = Image.new('L', (int(tw + 2 * pad), int(asc + desc + 2 * pad)), 0); d = ImageDraw.Draw(m); x = pad
    for ch in txt:
        w = colw if ch == ':' else cw
        d.text((x + w / 2, pad + asc), ch, font=f, fill=255, anchor='ms'); x += w
    stopped = t >= HSTOP
    digits = Image.new('RGBA', m.size, (0, 0, 0, 0))
    gl = Image.new('RGBA', m.size, (GLOW if stopped else (90, 110, 200)) + (0,))
    gl.putalpha(m.filter(ImageFilter.GaussianBlur(size * 0.1)).point(lambda v: int(v * (0.8 if stopped else 0.3))))
    digits.alpha_composite(gl)
    fill = grad_fill(m) if stopped else Image.new('RGBA', m.size, (255, 255, 255, 0))
    if not stopped: fill.putalpha(m)
    digits.alpha_composite(fill)
    punch = clamp(1 - (t - HSTOP) / 0.25) if stopped else 0
    paste(img, digits, CX, CY + 10 * U, dim, scale=1 + 0.08 * punch)
    caption(img, 'Full', 'campaign.', 76 * U, t, H0 + 0.1, x=CX, y=CY - (225 if WIDE else 195) * U)
    caption(img, 'Under', '1 hour.', 96 * U, t, HSTOP + 0.05, x=CX, y=CY + (240 if WIDE else 205) * U)
    return img

def end_layer(t):
    L = H2.BG.copy()
    h11.alfa_word(L, prog(t, H1, H1 + 0.45), CX, CY - 60 * U, 300 if WIDE else 345)
    a = eo3(prog(t, I0 + 0.15, I0 + 0.55))
    if a > 0:
        lw = 470 * U; lg = h10.LOGO.resize((int(lw), int(lw * h10.LOGO.height / h10.LOGO.width)), Image.LANCZOS)
        import title_style as _TS; by = _TS.by_text(58 * U)
        gap = 22 * U; tot = by.width + gap + lg.width
        y = CY + (165 if WIDE else 215) * U + (1 - a) * 24 * U
        paste(L, by, CX - tot / 2 + by.width / 2, y + 6 * U, a * 0.85)
        paste(L, lg, CX + tot / 2 - lg.width / 2, y, a)
    return L

# ---------------- render ----------------
def render(t):
    if t < A1:
        return h10.render_(t)                          # opener unchanged (real speed)
    if t < A2:
        return alfa_beat(t)
    if t < C0:                                         # zoom-through the photo
        p = prog(t, A2, C0)
        bg = H2.BG.copy(); ph = H8.photo_crop()
        hh = (H8.PHOTO_BOX[3] - H8.PHOTO_BOX[1]) * (1 if WIDE else H / 1080) * 1.1 * 1.18 * lerp(1, 3.2, ei3(p))
        paste(bg, H2.card(ph, hh * ph.width / ph.height, hh), CX, CY, 1 - eo3(prog(p, 0.45, 1.0)))
        ad = ad_frame(t); ad.putalpha(int(255 * eo3(prog(p, 0.45, 1.0)))); bg.alpha_composite(ad)
        img = H8.zoom_blur(bg, 0.1 * math.sin(p * math.pi), n=4); chip(img, t); return img
    if t < C1:
        img = ad_frame(t); label(img, 'Product', 'Video', t, C0 + 0.05, C1); chip(img, t); return img
    if t < D0:                                         # zoom-out onto the billboard
        p = eio(prog(t, C1, D0))
        img = bb_frame(t); ad = ad_frame(t)
        tx, ty, tw = (1060, 390, 1240) if WIDE else (W * 0.45, H * 0.36, W * 0.95)
        s = lerp(1.0, tw / W, p)
        im = ad.resize((int(W * s), int(H * s)), Image.BILINEAR); im.putalpha(int(255 * (1 - eo3(prog(p, 0.6, 1.0)))))
        paste(img, im, lerp(CX, tx, p), lerp(CY, ty, p), 1)
        img = H8.zoom_blur(img, 0.12 * math.sin(p * math.pi)); chip(img, t); return img
    if t < D1:
        img = bb_frame(t); label(img, 'Billboard', 'Ads', t, D0 + 0.03, D1); chip(img, t); return img
    if t < E0:                                         # whip
        p = prog(t, D1, E0)
        a = bb_frame(t) if p < 0.5 else ugc_frame(t)
        off = (-W * 0.6 * ei3(p * 2)) if p < 0.5 else (W * 0.6 * (1 - eo3((p - 0.5) * 2)))
        a = Image.fromarray(np.roll(np.asarray(a), int(off), axis=1), 'RGBA')
        img = H8.whip(a, 160 * math.sin(p * math.pi)); chip(img, t); return img
    if t < E1:
        img = ugc_frame(t); label(img, 'UGC', 'Videos', t, E0 + 0.03, E1); chip(img, t); return img
    if t < F0:                                         # UGC shrinks into the 16:9 slot
        p = eio(prog(t, E1, F0))
        img = size_layer(F0 - 0.001, center_done=False)
        x, y, w, h = size_rects()[1]
        u = ugc_frame(t)
        paste(img, ccard(u, lerp(W, w, p), lerp(H, h, p), lerp(0, 18, p), shadow=p > 0.02, glow=0.35 * p), lerp(CX, x, p), lerp(CY, y, p), 1)
        chip(img, t); return img
    if t < F1:
        img = size_layer(t); chip(img, t); return img
    if t < G0:                                         # push: any size -> scheduled
        p = prog(t, F1, G0)
        img = h10.push_out(size_layer(F1), p, H2.BG.copy())
        nxt = sched_layer(G0)
        s = lerp(0.94, 1, eo3(p)); paste(img, nxt.resize((int(W * s), int(H * s)), Image.BILINEAR), CX, CY, eo3(prog(p, 0.25, 1)))
        chip(img, t); return img
    if t < G1:
        img = sched_layer(t); chip(img, t); return img
    if t < H1:
        img = timer_scene(t); chip(img, t, 1 - eio(prog(t, H0, H0 + 0.2))); return img
    if t < I0:                                         # crossfade timer -> end card
        p = eio(prog(t, H1, I0))
        a = timer_scene(t); b = end_layer(t)
        return Image.blend(a, b, p)
    img = end_layer(t)
    fo = eio(prog(t, DUR - 0.3, DUR))
    if fo > 0: H5.darken(img, fo)
    return img

if __name__ == '__main__':
    FMT, MODE = sys.argv[1], sys.argv[2]
    if MODE == 'frames':
        for ts in sys.argv[3].split(','):
            render(float(ts)).convert('RGB').save(f'/home/claude/alfa/build/h13_{FMT}_{ts}.jpg', quality=88)
    elif MODE == 'times':
        print({k: round(v, 3) for k, v in dict(A1=A1, A2=A2, C0=C0, C1=C1, D0=D0, D1=D1, E0=E0, E1=E1, F0=F0, F1=F1, G0=G0, G1=G1, HSTOP=HSTOP, H1=H1, I0=I0).items()})
    else:
        out = sys.argv[3]; tmp = out.replace('.mp4', '.tmp.mp4')
        p = subprocess.Popen(['ffmpeg', '-v', 'error', '-y', '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-s', f'{W}x{H}', '-r', str(FPS), '-i', '-',
                              '-c:v', 'libx264', '-crf', '14', '-preset', 'veryfast', '-pix_fmt', 'yuv420p', tmp], stdin=subprocess.PIPE)
        for k in range(int(round(DUR * FPS))):
            p.stdin.write(render(k / FPS).convert('RGB').tobytes())
            if k % 100 == 0: print(k, flush=True)
        p.stdin.close()
        if p.wait() == 0: os.replace(tmp, out); print('done', out)
