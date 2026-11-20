#!/usr/bin/env python3
# ALFA hero v2 — Dreamina-style kinetic type: one feature, one word.
#   python3 hero2.py wide|tall frames t1,t2,...
#   python3 hero2.py wide|tall render out.mp4
import sys, math, random, subprocess, functools, os
import numpy as np
from PIL import Image, ImageDraw, ImageFont, ImageFilter, ImageOps

A = '/home/claude/alfa/assets/'
FMT = sys.argv[1]
WIDE = FMT == 'wide'
W, H = (1920, 1080) if WIDE else (1080, 1350)
U = 1.0 if WIDE else 0.72
FPS, DUR = 30, 20.0
CX, CY = W / 2, H / 2

WHITE = (255, 255, 255)
PURP_L = (205, 168, 255)
PURP = (135, 56, 245)
GLOW = (150, 80, 255)

def clamp(x, a=0.0, b=1.0): return max(a, min(b, x))
def prog(t, t0, t1): return clamp((t - t0) / (t1 - t0))
def eo3(x): return 1 - (1 - x) ** 3
def eo5(x): return 1 - (1 - x) ** 5
def ei3(x): return x ** 3
def eio(x): return 4 * x ** 3 if x < .5 else 1 - (-2 * x + 2) ** 3 / 2
def eback(x, s=1.6):
    x -= 1
    return x * x * ((s + 1) * x + s) + 1
def lerp(a, b, x): return a + (b - a) * x

@functools.lru_cache(None)
def font(name, size): return ImageFont.truetype(A + name, max(6, int(round(size))))
def FB(s): return font('Poppins800i.ttf', s)     # display, bold italic
def FT(s): return font('Poppins700i.ttf', s)     # feature words
def FS(s): return font('Poppins600i.ttf', s)     # flying prompt letters
def FUI(s): return font('Poppins500n.ttf', s)    # UI text
def FUI6(s): return font('Poppins600n.ttf', s)

@functools.lru_cache(maxsize=256)
def rr_mask(w, h, r, ss=3):
    m = Image.new('L', (w * ss, h * ss), 0)
    ImageDraw.Draw(m).rounded_rectangle([0, 0, w * ss - 1, h * ss - 1], r * ss, fill=255)
    return m.resize((w, h), Image.LANCZOS)

def with_alpha(img, a):
    if a >= 0.999: return img
    img = img.copy()
    img.putalpha(img.getchannel('A').point(lambda v: int(v * a)))
    return img

def paste(canvas, img, cx, cy, alpha=1.0, rot=0.0, scale=1.0, blur=0):
    if alpha <= 0.003 or img is None: return
    if abs(scale - 1) > 0.002:
        img = img.resize((max(1, int(img.width * scale)), max(1, int(img.height * scale))), Image.BILINEAR)
    if abs(rot) > 0.05:
        img = img.rotate(rot, resample=Image.BICUBIC, expand=True)
    if blur > 0.5:
        pad = int(blur * 2)
        big = Image.new('RGBA', (img.width + 2 * pad, img.height + 2 * pad), (0, 0, 0, 0))
        big.paste(img, (pad, pad))
        img = big.filter(ImageFilter.GaussianBlur(blur))
    img = with_alpha(img, alpha)
    canvas.alpha_composite(img, (0, 0)) if False else None
    x, y = int(round(cx - img.width / 2)), int(round(cy - img.height / 2))
    # manual clip for alpha_composite
    x0, y0 = max(0, x), max(0, y)
    x1, y1 = min(canvas.width, x + img.width), min(canvas.height, y + img.height)
    if x1 <= x0 or y1 <= y0: return
    canvas.alpha_composite(img.crop((x0 - x, y0 - y, x1 - x, y1 - y)), (x0, y0))

# ---------- text ----------
def grad_fill(mask, c0, c1):
    w, h = mask.size
    g = np.linspace(0, 1, w)[None, :, None]
    arr = (np.array(c0) * (1 - g) + np.array(c1) * g).astype(np.uint8)
    arr = np.repeat(arr, h, axis=0)
    img = Image.fromarray(arr, 'RGB').convert('RGBA')
    img.putalpha(mask)
    return img

@functools.lru_cache(maxsize=512)
def word_img(s, fname, size, style):
    """style: 'white' | 'purple' (gradient + glow) | 'whiteglow'"""
    f = font(fname, size)
    l, t, r, b = f.getbbox(s)
    pad = int(size * 0.35)
    w, h = r - l + 2 * pad, b - t + 2 * pad
    mask = Image.new('L', (w, h), 0)
    ImageDraw.Draw(mask).text((pad - l, pad - t), s, font=f, fill=255)
    out = Image.new('RGBA', (w, h), (0, 0, 0, 0))
    if style in ('purple', 'whiteglow'):
        gl = Image.new('RGBA', (w, h), GLOW + (0,))
        gl.putalpha(mask.filter(ImageFilter.GaussianBlur(size * 0.12)).point(lambda v: int(v * (0.9 if style == 'purple' else 0.55))))
        out.alpha_composite(gl)
    if style == 'purple':
        out.alpha_composite(grad_fill(mask, PURP_L, (163, 102, 255)))
    else:
        txt = Image.new('RGBA', (w, h), WHITE + (0,)); txt.putalpha(mask); out.alpha_composite(txt)
    return out

@functools.lru_cache(maxsize=1024)
def letter_img(ch, fname, size, style):
    f = font(fname, size)
    l, t, r, b = f.getbbox(ch, anchor='ls')
    pad = int(size * 0.35)
    w, h = int(r - l + 2 * pad), int(b - t + 2 * pad)
    ox, oy = pad - l, pad - t
    mask = Image.new('L', (w, h), 0)
    ImageDraw.Draw(mask).text((ox, oy), ch, font=f, fill=255, anchor='ls')
    out = Image.new('RGBA', (w, h), (0, 0, 0, 0))
    if style in ('purple', 'whiteglow'):
        gl = Image.new('RGBA', (w, h), GLOW + (0,))
        gl.putalpha(mask.filter(ImageFilter.GaussianBlur(size * 0.12)).point(lambda v: int(v * (0.9 if style == 'purple' else 0.55))))
        out.alpha_composite(gl)
    if style == 'purple':
        out.alpha_composite(grad_fill(mask, PURP_L, (163, 102, 255)))
    else:
        txt = Image.new('RGBA', (w, h), WHITE + (0,)); txt.putalpha(mask); out.alpha_composite(txt)
    return out, ox, oy

def glyph_center(ch, fname, size, style, penx, base):
    img, ox, oy = letter_img(ch, fname, size, style)
    return img, penx + img.width / 2 - ox, base + img.height / 2 - oy

def cap_half(fname, size):
    return -font(fname, size).getbbox('H', anchor='ls')[1] / 2

def word_width(s, fname, size): return font(fname, size).getlength(s)

def two_words(L, w1, w2, size, cx, cy, p1, p2, dy2=0, gap=0.28, overlap=False):
    fn = 'Poppins700i.ttf'
    a, b = word_width(w1, fn, size), word_width(w2, fn, size)
    g = size * (gap if not overlap else -0.05)
    tot = a + g + b
    kinetic_word(L, w1, fn, size, 'white', cx - tot / 2 + a / 2, cy, p1)
    kinetic_word(L, w2, fn, size, 'purple', cx + tot / 2 - b / 2, cy + dy2, p2)

def letters_layout(s, f):
    """per-letter x offsets (left edge) relative to string start, and total width"""
    xs, x = [], 0
    for ch in s:
        xs.append(x); x += f.getlength(ch)
    return xs, x

def kinetic_word(canvas, s, fname, size, style, cx, cy, p, seed=1, mode='rise', alpha=1.0, spread=1.0):
    """Animate a word letter by letter. p 0..1 intro progress.
    mode 'rise': letters rise + unblur; 'scatter': letters fly in from random spots with rotation."""
    if alpha <= 0.003: return
    f = font(fname, size)
    xs, total = letters_layout(s, f)
    rnd = random.Random(seed)
    n = len(s)
    base_y = cy
    asc = f.getbbox('H', anchor='ls')[1]
    base = cy + cap_half(fname, size)
    for i, ch in enumerate(s):
        if ch == ' ': continue
        lp = clamp(p * (n * 0.35 + 1) - i * 0.35)
        if lp <= 0: continue
        e = eo3(lp)
        li, tx, ty = glyph_center(ch, fname, size, style, cx - total / 2 + xs[i], base)
        if mode == 'scatter':
            ang = rnd.uniform(0, 2 * math.pi)
            dist = rnd.uniform(0.25, 0.6) * W * spread
            sx, sy = tx + math.cos(ang) * dist, ty + math.sin(ang) * dist * 0.6
            rot = rnd.uniform(-70, 70)
            x, y = lerp(sx, tx, e), lerp(sy, ty, e)
            paste(canvas, li, x, y, alpha * clamp(lp * 3), rot * (1 - e), lerp(1.6, 1, e), blur=(1 - e) * 6)
        else:
            paste(canvas, li, tx, ty + (1 - e) * size * 0.45, alpha * clamp(lp * 2.5), 0, 1, blur=(1 - e) * 5)

def curved_text(canvas, s, f, cx, cy, radius, a0, a1, p, alpha):
    """text along an arc from angle a0 to a1 (degrees, 0 = right, ccw positive upward)."""
    xs, total = letters_layout(s, f)
    n = len(s)
    for i, ch in enumerate(s):
        if ch == ' ': continue
        lp = clamp(p * (n * 0.25 + 1) - i * 0.25)
        if lp <= 0: continue
        frac = (xs[i] + f.getlength(ch) / 2) / total
        ang = math.radians(lerp(a0, a1, frac))
        x, y = cx + radius * math.cos(ang), cy - radius * math.sin(ang)
        li, ox, oy = letter_img(ch, 'Poppins700i.ttf', f.size, 'whiteglow')
        adv = f.getlength(ch)
        dx, dy = li.width / 2 - ox - adv / 2, li.height / 2 - oy
        th = ang - math.pi / 2          # glyph x-axis direction (tangent), screen coords
        ux, uy = math.cos(th), -math.sin(th)
        vx, vy = math.sin(th), math.cos(th)   # glyph "down" direction
        rot = math.degrees(th)
        paste(canvas, li, x + dx * ux + dy * vx, y + dx * uy + dy * vy, alpha * eo3(lp), rot, blur=(1 - eo3(lp)) * 4)

# ---------- assets ----------
BEFORE = Image.open(A + 'before.jpg').convert('RGB')
STUDIO = Image.open(A + 'studio.jpg').convert('RGB')
POSTER = Image.open(A + 'poster.jpg').convert('RGB')
def load_frames(path, w, h):
    raw = subprocess.run(['ffmpeg', '-v', 'error', '-i', path, '-vf', f'scale={w}:{h}', '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-'],
                         capture_output=True, check=True).stdout
    return np.frombuffer(raw, np.uint8).reshape(-1, h, w, 3)
AD = load_frames(A + 'advideo.mp4', 1920, 1080)
UGC = load_frames(A + 'ugcvideo.mp4', 720, 1280)
def vframe(arr, vt): return Image.fromarray(arr[int(vt * 24) % len(arr)])
def crop_aspect(img, asp):
    w, h = img.size
    if w / h > asp:
        nw = int(h * asp); x = (w - nw) // 2
        return img.crop((x, 0, x + nw, h))
    nh = int(w / asp); y = (h - nh) // 2
    return img.crop((0, y, w, y + nh))

def make_bg():
    yy, xx = np.mgrid[0:H, 0:W].astype(np.float32)
    bg = np.zeros((H, W, 3), np.float32) + np.array([9, 8, 14], np.float32)
    d = np.sqrt(((xx - W * 0.5) / W) ** 2 + ((yy - H * 0.42) / W) ** 2)
    m = (np.clip(1 - d / 0.55, 0, 1) ** 2)[..., None]
    bg = bg + m * np.array([34, 16, 62], np.float32)
    return Image.fromarray(np.clip(bg, 0, 255).astype(np.uint8)).convert('RGBA')
BG = make_bg()

@functools.lru_cache(maxsize=128)
def shadow(w, h, r, m):
    s = Image.new('L', ((w + 2 * m) // 4 + 1, (h + 2 * m) // 4 + 1), 0)
    ImageDraw.Draw(s).rounded_rectangle([m // 4, m // 4 + 6, m // 4 + w // 4, m // 4 + h // 4 + 6], max(1, r // 4), fill=255)
    s = s.filter(ImageFilter.GaussianBlur(m / 9)).resize((w + 2 * m, h + 2 * m), Image.BILINEAR)
    img = Image.new('RGBA', s.size, (0, 0, 0, 0)); img.putalpha(s.point(lambda v: int(v * 0.6)))
    return img

def card(content, w, h, glow=0.0):
    w, h = max(8, int(round(w))), max(8, int(round(h)))
    r = max(6, int(min(w, h) * 0.06))
    m = int(max(16, min(w, h) * 0.16))
    out = Image.new('RGBA', (w + 2 * m, h + 2 * m), (0, 0, 0, 0))
    out.alpha_composite(shadow(w, h, r, m))
    if glow > 0:
        g = Image.new('L', out.size, 0)
        ImageDraw.Draw(g).rounded_rectangle([m, m, m + w, m + h], r, fill=255)
        g = g.filter(ImageFilter.GaussianBlur(m * 0.45))
        gi = Image.new('RGBA', out.size, GLOW + (0,)); gi.putalpha(g.point(lambda v: int(v * glow)))
        out.alpha_composite(gi)
    c = ImageOps.fit(content, (w, h), Image.BILINEAR).convert('RGBA')
    out.paste(c, (m, m), rr_mask(w, h, r))
    # hairline border
    b = Image.new('RGBA', (w, h), (0, 0, 0, 0))
    ImageDraw.Draw(b).rounded_rectangle([0, 0, w - 1, h - 1], r, outline=(255, 255, 255, 40), width=2)
    out.alpha_composite(b, (m, m))
    return out

def dark_pill(w, h, a=225):
    w, h = int(w), int(h)
    img = Image.new('RGBA', (w, h), (0, 0, 0, 0))
    d = ImageDraw.Draw(img)
    d.rounded_rectangle([0, 0, w - 1, h - 1], int(min(h / 2, 28 * U)), fill=(24, 22, 32, a), outline=(255, 255, 255, 38), width=2)
    return img

def send_btn(d, active=False):
    D = d * 3
    img = Image.new('RGBA', (D, D), (0, 0, 0, 0))
    g = ImageDraw.Draw(img)
    g.ellipse([0, 0, D - 1, D - 1], fill=(PURP if active else (235, 235, 240)) + (255,))
    col = 'white' if active else (20, 20, 28)
    g.line([(D / 2, D * .72), (D / 2, D * .28)], fill=col, width=int(D * .08))
    g.line([(D * .33, D * .45), (D / 2, D * .27), (D * .67, D * .45)], fill=col, width=int(D * .08), joint='curve')
    return img.resize((d, d), Image.LANCZOS)

# ---------- scene timing ----------
SC = [  # name, t0, t1
    ('intro', 0.0, 2.25), ('prompt', 2.25, 4.5), ('studio', 4.5, 6.5), ('poster', 6.5, 8.4), ('ugc', 8.4, 10.3),
    ('video', 10.3, 12.3), ('size', 12.3, 14.5), ('post', 14.5, 16.45), ('less', 16.45, 18.6), ('outro', 18.6, 20.0)]
TR = 0.22   # cross transition length

# ---------- scenes (draw onto a transparent layer) ----------
def s_intro(L, t):
    p = prog(t, 0.15, 1.15)
    size = 300 * U
    kinetic_word(L, 'ALFA', 'Poppins800i.ttf', size, 'purple', CX, CY - 10 * U, p, seed=3, mode='scatter', spread=0.7)
    pe = eo3(prog(t, 1.05, 1.4))
    if pe > 0:
        f = FUI6(24 * U)
        s = 'YOUR AI MARKETING AGENT'
        tw = f.getlength(s)
        pill = Image.new('RGBA', (int(tw + 44 * U), int(44 * U)), (0, 0, 0, 0))
        ImageDraw.Draw(pill).rounded_rectangle([0, 0, pill.width - 1, pill.height - 1], pill.height // 2, fill=PURP + (255,))
        ImageDraw.Draw(pill).text((pill.width / 2, pill.height / 2), s, font=f, fill='white', anchor='mm')
        paste(L, pill, CX, CY - 170 * U - (1 - pe) * 20 * U, pe)

PROMPT = 'Launch my serum this week.'
def input_geom():
    iw = min(980 * U, W * 0.9); ih = 108 * U
    return CX, CY + (120 if WIDE else 150) * U, iw, ih

def s_prompt(L, t):
    x, y, iw, ih = input_geom()
    ea = eo3(prog(t, 2.25, 2.6))
    pill = dark_pill(iw, ih)
    paste(L, pill, x, y + (1 - ea) * 30 * U, ea)
    left = x - iw / 2
    # label row
    paste(L, word_img('ALFA', 'Poppins600n.ttf', 22 * U, 'white'), left + 70 * U, y - 22 * U, 0.55 * ea)
    btn = send_btn(int(ih * 0.5), active=t > 4.15)
    bs = 1 - 0.15 * math.sin(math.pi * prog(t, 4.15, 4.32))
    paste(L, btn, x + iw / 2 - ih * 0.45, y + 2 * U, ea, scale=bs)
    # flying letters: big, scattered, then they land inside the input at UI size
    f_big = FS(78 * U); f_sm = FUI(30 * U)
    xs_sm, tot_sm = letters_layout(PROMPT, f_sm)
    xs_bg, tot_bg = letters_layout(PROMPT, f_big)
    rnd = random.Random(11)
    n = len(PROMPT)
    for i, ch in enumerate(PROMPT):
        sx0 = rnd.uniform(0.08, 0.92) * W; sy0 = rnd.uniform(0.12, 0.5) * H
        rot0 = rnd.uniform(-40, 40)
        if ch == ' ': continue
        # phase a: letter appears big near its "sentence" position (typing-ish, wavy)
        ta = 2.45 + i * 0.035
        pa = eo3(prog(t, ta, ta + 0.35))
        if pa <= 0: continue
        _, bx, by = glyph_center(ch, 'Poppins600i.ttf', 78 * U, 'white', CX - tot_bg / 2 + xs_bg[i], CY - 150 * U + 28 * U)
        by += math.sin(i * 0.7) * 26 * U
        # phase b: letters swirl down into the input
        tb = 3.35 + i * 0.022
        pb = eio(prog(t, tb, tb + 0.42))
        img0, fx, fy = glyph_center(ch, 'Poppins600i.ttf', 78 * U, 'white', 0, 0)
        # landing: scale 30/78 around glyph center -> place pen at input text origin
        k = 30 / 78
        fx = left + 40 * U + xs_sm[i] + fx * k
        fy = y + 26 * U + fy * k
        if pb <= 0:
            cx_, cy_ = lerp(sx0, bx, pa), lerp(sy0, by, pa)
            sc, rot = 1.0, rot0 * (1 - pa)
            paste(L, img0, cx_, cy_, pa, rot, sc, blur=(1 - pa) * 5)
        else:
            # arc path
            cx_ = lerp(bx, fx, pb) + math.sin(pb * math.pi) * (rnd.uniform(-1, 1) * 160 * U)
            cy_ = lerp(by, fy, pb)
            sc = lerp(1.0, 30 / 78, pb)
            rot = math.sin(pb * math.pi) * rnd.uniform(-90, 90)
            paste(L, img0, cx_, cy_, 1.0, rot, sc, blur=math.sin(pb * math.pi) * 3)
    # title "One Prompt" (two-tone) above
    if t > 3.6:
        p = prog(t, 3.6, 4.05)
        two_words(L, 'One', 'Prompt', 130 * U, CX, CY - 150 * U, p, prog(t, 3.72, 4.17))

def split_words(L, t, t0, w1, w2, card_img_fn, asp, card_h, gap=None, glow=0.5):
    """Dreamina 'Any … Size': two words part around a card that grows in the middle."""
    e = eo5(prog(t, t0 + 0.05, t0 + 0.6))
    ch = card_h * U * lerp(0.55, 1, e)
    cw = ch * asp
    content = card_img_fn(t)
    if WIDE:
        paste(L, card(content, cw, ch, glow=glow * e), CX, CY, clamp(e * 2))
        gap = gap or (cw / 2 + 40 * U)
        f = font('Poppins700i.ttf', 150 * U)
        wl, wr = f.getlength(w1), f.getlength(w2)
        p1 = prog(t, t0, t0 + 0.55)
        kinetic_word(L, w1, 'Poppins700i.ttf', 150 * U, 'white', CX - lerp(cw * 0.25, gap, e) - wl / 2, CY, p1)
        kinetic_word(L, w2, 'Poppins700i.ttf', 150 * U, 'purple', CX + lerp(cw * 0.25, gap, e) + wr / 2, CY, prog(t, t0 + 0.08, t0 + 0.63))
    else:
        paste(L, card(content, cw, ch, glow=glow * e), CX, CY + 40 * U, clamp(e * 2))
        kinetic_word(L, w1, 'Poppins700i.ttf', 150 * U, 'white', CX, CY + 40 * U - ch / 2 - lerp(0, 110 * U, e), prog(t, t0, t0 + 0.55))
        kinetic_word(L, w2, 'Poppins700i.ttf', 150 * U, 'purple', CX, CY + 40 * U + ch / 2 + lerp(0, 110 * U, e), prog(t, t0 + 0.08, t0 + 0.63))
    return cw, ch

def s_studio(L, t):
    t0 = 4.5
    def content(tt):
        # before photo -> studio, wipe at t0+0.75
        wp = eio(prog(tt, t0 + 0.7, t0 + 1.05))
        a = ImageOps.fit(BEFORE, (960, 540)); b = ImageOps.fit(STUDIO, (960, 540))
        if wp <= 0: return a
        if wp >= 1: return b
        m = Image.new('L', (960, 540), 0)
        ImageDraw.Draw(m).rectangle([0, 0, int(960 * wp), 540], fill=255)
        out = a.copy(); out.paste(b, (0, 0), m)
        ImageDraw.Draw(out).rectangle([int(960 * wp) - 2, 0, int(960 * wp) + 2, 540], fill=PURP_L)
        return out
    split_words(L, t, t0, 'Studio', 'Shots', content, 16 / 9, 330 if WIDE else 470)

def s_poster(L, t):
    t0 = 6.5
    # overlapping two-word title under a tilted card (Motion-Transfer style)
    e = eo5(prog(t, t0, t0 + 0.55))
    ch = (520 if WIDE else 560) * U
    rot = lerp(-14, -4, e)
    paste(L, card(POSTER, ch * 0.8, ch, glow=0.6 * e), CX + (0 if not WIDE else 0), CY - 40 * U + (1 - e) * 80 * U, clamp(e * 2), rot, lerp(0.8, 1, e))
    by = CY + ch / 2 - 30 * U
    two_words(L, 'Ad', 'Posters', 165 * U, CX, by, prog(t, t0 + 0.2, t0 + 0.6), prog(t, t0 + 0.3, t0 + 0.75), dy2=34 * U, gap=0.12)

def s_ugc(L, t):
    t0 = 8.4
    split_words(L, t, t0, 'UGC', 'Videos', lambda tt: vframe(UGC, 0.4 + (tt - t0)), 9 / 16, 560 if WIDE else 760)

def s_video(L, t):
    t0 = 10.3
    # near full-bleed video card, words bottom-left (Object-Swap style)
    e = eo5(prog(t, t0, t0 + 0.5))
    vw = lerp(0.7, 0.86, e) * W
    vh = vw * 9 / 16 if WIDE else vw * 1.15
    fr = crop_aspect(vframe(AD, 0.9 + (t - t0) * 0.9), vw / vh).convert('RGBA')
    gh = int(fr.height * 0.5)
    grad = np.linspace(0, 1, gh) ** 1.6 * 200
    gm = Image.fromarray(np.repeat(grad[:, None], fr.width, 1).astype(np.uint8), 'L')
    sh = Image.new('RGBA', (fr.width, gh), (10, 6, 20, 0)); sh.putalpha(gm)
    fr.alpha_composite(sh, (0, fr.height - gh))
    paste(L, card(fr.convert('RGB'), vw, vh, glow=0.4 * e), CX, CY, clamp(e * 2))
    bx = CX - vw / 2 + 60 * U
    by = CY + vh / 2 - 120 * U
    a, b = word_width('Video', 'Poppins700i.ttf', 150 * U), word_width('Ads', 'Poppins700i.ttf', 150 * U)
    two_words(L, 'Video', 'Ads', 150 * U, bx + (a + b + 150 * U * 0.12) / 2, by, prog(t, t0 + 0.2, t0 + 0.65), prog(t, t0 + 0.3, t0 + 0.75), dy2=26 * U, gap=0.12)

RATIOS = [('21:9', 21 / 9), ('16:9', 16 / 9), ('4:3', 4 / 3), ('1:1', 1.0), ('3:4', 3 / 4), ('9:16', 9 / 16)]
def s_size(L, t):
    t0 = 12.3
    seq = [(t0 + 0.0, 1), (t0 + 0.75, 3), (t0 + 1.25, 5), (t0 + 1.75, 1)]
    a_cur = 16 / 9; act = 1
    for i, (ts, k) in enumerate(seq):
        if t >= ts:
            prev = RATIOS[seq[i - 1][1]][1] if i else RATIOS[k][1]
            a_cur = lerp(prev, RATIOS[k][1], eio(prog(t, ts, ts + 0.3)))
            act = k
    e = eo5(prog(t, t0 + 0.05, t0 + 0.6))
    box_h = (430 if WIDE else 640) * U
    ch = box_h * lerp(0.6, 1, e)
    cw = ch * a_cur
    if not WIDE and cw > W * 0.82:
        cw = W * 0.82; ch = cw / a_cur
    fr = vframe(AD, 1.6 + (t - t0) * 0.9)
    cy = CY - 20 * U
    paste(L, card(crop_aspect(fr, a_cur), cw, ch, glow=0.4 * e), CX, cy, clamp(e * 2))
    # corner handles
    d = ImageDraw.Draw(L)
    if e > 0.5:
        for sx in (-1, 1):
            for sy in (-1, 1):
                hx, hy = CX + sx * (cw / 2 + 10 * U), cy + sy * (ch / 2 + 10 * U)
                d.rectangle([hx - 4, hy - 4, hx + 4, hy + 4], fill=(255, 255, 255, int(200 * e)))
    # ratio bar
    f = FUI6(20 * U)
    labels = [r[0] for r in RATIOS]
    cellw = 86 * U
    bw, bh = cellw * len(labels) + 16 * U, 46 * U
    bar = dark_pill(bw, bh, a=235)
    bd = ImageDraw.Draw(bar)
    for i, lab in enumerate(labels):
        x0 = 8 * U + i * cellw
        if i == act:
            bd.rounded_rectangle([x0 + 3, 6 * U, x0 + cellw - 3, bh - 6 * U], int(14 * U), fill=(255, 255, 255, 40))
        bd.text((x0 + cellw / 2, bh / 2), lab, font=f, fill=(255, 255, 255, 235 if i == act else 140), anchor='mm')
    paste(L, bar, CX, cy + box_h / 2 + 50 * U, e)
    if WIDE:
        fnt = font('Poppins700i.ttf', 165 * U)
        gap = 1.05 * box_h * 16 / 9 / 2 + 30 * U
        kinetic_word(L, 'Any', 'Poppins700i.ttf', 165 * U, 'white', CX - gap - fnt.getlength('Any') / 2 + 120 * U, cy, prog(t, t0, t0 + 0.5))
        kinetic_word(L, 'Size', 'Poppins700i.ttf', 165 * U, 'purple', CX + gap + fnt.getlength('Size') / 2 - 120 * U, cy, prog(t, t0 + 0.08, t0 + 0.58))
    else:
        two_words(L, 'Any', 'Size', 150 * U, CX, cy - box_h / 2 - 120 * U, prog(t, t0, t0 + 0.5), prog(t, t0 + 0.08, t0 + 0.58))

def icon(kind, d):
    D = d * 3
    img = Image.new('RGBA', (D, D), (0, 0, 0, 0)); g = ImageDraw.Draw(img)
    if kind == 'ig':
        g.ellipse([0, 0, D - 1, D - 1], fill=(221, 42, 123))
        g.rounded_rectangle([D * .26, D * .26, D * .74, D * .74], D * .13, outline='white', width=int(D * .07))
        g.ellipse([D * .39, D * .39, D * .61, D * .61], outline='white', width=int(D * .07))
    elif kind == 'tt':
        g.ellipse([0, 0, D - 1, D - 1], fill=(30, 30, 34), outline=(255, 255, 255, 60), width=int(D * .03))
        g.line([(D * .55, D * .25), (D * .55, D * .66)], fill='white', width=int(D * .08))
        g.ellipse([D * .33, D * .58, D * .55, D * .76], fill='white')
        g.line([(D * .55, D * .27), (D * .70, D * .36)], fill='white', width=int(D * .08))
    else:
        g.ellipse([0, 0, D - 1, D - 1], fill=(24, 119, 242))
        g.text((D * .55, D * .58), 'f', font=font('Poppins700n.ttf', D * .62) if os.path.exists(A + 'Poppins700n.ttf') else FUI6(D * .62), fill='white', anchor='mm')
    return img.resize((d, d), Image.LANCZOS)
ICONS = {k: icon(k, int(84 * U)) for k in ('ig', 'tt', 'fb')}

def post_content(tt, t0):
    w, h = 540, 860
    img = Image.new('RGB', (w, h), (16, 15, 22))
    d = ImageDraw.Draw(img)
    av = ImageOps.fit(STUDIO.crop((700, 120, 1350, 770)), (50, 50)).convert('RGBA')
    img.paste(av, (20, 18), rr_mask(50, 50, 25))
    d.text((84, 22), 'aurel.skin', font=FUI6(22), fill='white')
    d.text((84, 48), 'Scheduled · Tue 7:00 PM', font=FUI(16), fill=(200, 175, 255))
    v = ImageOps.fit(vframe(UGC, 1.0 + (tt - t0)), (w, 640))
    img.paste(v, (0, 86))
    d.text((20, 742), 'Your glow, bottled. 20% off this week.', font=FUI(20), fill='white')
    d.text((20, 772), '#glowserum #skincare', font=FUI6(20), fill=(200, 175, 255))
    return img

def s_post(L, t):
    t0 = 14.5
    e = eo5(prog(t, t0 + 0.05, t0 + 0.55))
    ch = (560 if WIDE else 820) * U
    cw = ch * 540 / 860
    cy = CY if WIDE else CY + 40 * U
    paste(L, card(post_content(t, t0), cw, ch, glow=0.45 * e), CX, cy, clamp(e * 2), 0, lerp(0.85, 1, e))
    # platform icons pop around the card
    pos = [(-1, -0.25), (1, -0.05), (-1, 0.3)] if WIDE else [(-1, -0.42), (1, -0.42), (1, 0.42)]
    for k, (kind, (sx, sy)) in enumerate(zip(('ig', 'tt', 'fb'), pos)):
        pe = eback(prog(t, t0 + 0.45 + 0.12 * k, t0 + 0.8 + 0.12 * k), 2.2)
        if pe <= 0: continue
        x = CX + sx * (cw / 2 + 20 * U); y = cy + sy * ch
        paste(L, ICONS[kind], x, y + math.sin((t - t0) * 3 + k) * 6 * U, clamp(pe), 0, max(0.05, pe))
    if WIDE:
        fnt = font('Poppins700i.ttf', 165 * U)
        gap = cw / 2 + 110 * U
        kinetic_word(L, 'Auto', 'Poppins700i.ttf', 165 * U, 'white', CX - gap - fnt.getlength('Auto') / 2, cy, prog(t, t0, t0 + 0.5))
        kinetic_word(L, 'Post', 'Poppins700i.ttf', 165 * U, 'purple', CX + gap + fnt.getlength('Post') / 2, cy, prog(t, t0 + 0.08, t0 + 0.58))
    else:
        kinetic_word(L, 'Auto', 'Poppins700i.ttf', 150 * U, 'white', CX - 150 * U, cy - ch / 2 - 110 * U, prog(t, t0, t0 + 0.5))
        kinetic_word(L, 'Post', 'Poppins700i.ttf', 150 * U, 'purple', CX + 150 * U, cy + ch / 2 + 110 * U, prog(t, t0 + 0.08, t0 + 0.58))

def s_less(L, t):
    t0 = 16.45
    # full-bleed hero shot, slow push, curved line around the bottle
    fr = vframe(AD, 3.2 + (t - t0) * 0.6)
    z = lerp(1.0, 1.08, prog(t, t0, 18.6))
    img = crop_aspect(fr, W / H)
    img = img.resize((int(W * z), int(H * z)), Image.BILINEAR).convert('RGBA')
    # darken + vignette for legibility
    dark = Image.new('RGBA', img.size, (8, 6, 14, 90))
    img.alpha_composite(dark)
    paste(L, img, CX, CY)
    f = font('Poppins700i.ttf', 64 * U)
    r = (330 if WIDE else 300) * U
    bx = CX + (-60 * U if WIDE else 0)
    curved_text(L, 'Less work. More launches.', f, bx, CY - 40 * U, r, 200, 40, prog(t, t0 + 0.2, t0 + 1.2), 1 - eio(prog(t, 18.25, 18.55)))

def s_outro(L, t):
    p = prog(t, 18.6, 19.2)
    kinetic_word(L, 'ALFA', 'Poppins800i.ttf', 300 * U, 'purple', CX, CY - 10 * U, p, seed=5, mode='rise')
    a = 1 - eio(prog(t, 19.45, 19.95))
    if a < 1:
        # fade by painting black over the layer
        ov = Image.new('RGBA', L.size, (0, 0, 0, 0))
        L.putalpha(L.getchannel('A').point(lambda v: int(v * a)))

FUNCS = dict(intro=s_intro, prompt=s_prompt, studio=s_studio, poster=s_poster, ugc=s_ugc, video=s_video,
             size=s_size, post=s_post, less=s_less, outro=s_outro)

def render(t):
    canvas = BG.copy()
    for name, t0, t1 in SC:
        if not (t0 - 0.001 <= t < t1 + TR): continue
        L = Image.new('RGBA', (W, H), (0, 0, 0, 0))
        FUNCS[name](L, t)
        # exit: quick zoom-through + fade (except outro, which fades itself)
        if name != 'outro' and t > t1 - 0.001:
            x = prog(t, t1, t1 + TR)
            s = 1 + 0.12 * ei3(x)
            L = L.resize((int(W * s), int(H * s)), Image.BILINEAR)
            if x > 0.05: L = L.filter(ImageFilter.GaussianBlur(x * 10))
            paste(canvas, L, CX, CY, 1 - x)
        else:
            # entry: settle from slightly smaller
            x = prog(t, t0, t0 + TR) if name != 'intro' else 1
            if x < 1:
                s = lerp(0.94, 1, eo3(x))
                L2 = L.resize((int(W * s), int(H * s)), Image.BILINEAR)
                paste(canvas, L2, CX, CY, eo3(x))
            else:
                canvas.alpha_composite(L)
    return canvas.convert('RGB')

if __name__ == '__main__':
    mode = sys.argv[2]
    if mode == 'frames':
        for ts in sys.argv[3].split(','):
            render(float(ts)).save(f'/home/claude/alfa/build/g_{FMT}_{ts}.jpg', quality=90)
    else:
        out = sys.argv[3]; tmp = out.replace('.mp4', '.tmp.mp4')
        p = subprocess.Popen(['ffmpeg', '-v', 'error', '-y', '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-s', f'{W}x{H}', '-r', str(FPS), '-i', '-',
                              '-c:v', 'libx264', '-crf', '14', '-preset', 'veryfast', '-pix_fmt', 'yuv420p', tmp], stdin=subprocess.PIPE)
        for k in range(int(DUR * FPS)):
            p.stdin.write(render(k / FPS).tobytes())
            if k % 100 == 0: print(k, flush=True)
        p.stdin.close()
        if p.wait() == 0: os.replace(tmp, out); print('done', out)
