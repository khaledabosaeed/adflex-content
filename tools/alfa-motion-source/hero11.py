#!/usr/bin/env python3
# ALFA hero v11 = v10 timeline with a new type system: Outfit (upright geometric sans, matches the AdFlex logo)
# replaces Poppins italic everywhere, and the ALFA wordmark is rebuilt: upright Outfit 800, AdFlex blue->purple
# gradient, soft glow, clean staggered letter rise (no pen-tip blob).
#   python3 hero11.py wide|tall frames t1,t2  |  python3 hero11.py wide|tall render out.mp4
import sys, os, subprocess, functools
import hero10 as h10
H8, H5, H2 = h10.H8, h10.H5, h10.H2
from hero2 import W, H, CX, CY, U, WIDE, clamp, prog, eo3, eio, lerp, paste
import numpy as np
from PIL import Image, ImageDraw, ImageFont, ImageFilter

# ---------- font swap: Poppins -> Outfit ----------
MAP = {'Poppins800i.ttf': 'Outfit-800.ttf', 'Poppins700i.ttf': 'Outfit-700.ttf', 'Poppins600i.ttf': 'Outfit-600.ttf',
       'Poppins600n.ttf': 'Outfit-600.ttf', 'Poppins500n.ttf': 'Outfit-500.ttf'}
_font = H2.font
def font(name, size): return _font(MAP.get(name, name), size)
H2.font = font
H2.PURP_L = (112, 172, 255)   # purple words get the AdFlex blue->purple gradient
H5.font = font
for m in (H2, H5, H8):
    for fn in ('letter_img', 'rr_mask'):
        f = getattr(m, fn, None)
        if hasattr(f, 'cache_clear'): f.cache_clear()

# ---------- ALFA wordmark ----------
BLUE, VIOLET = (78, 162, 255), (146, 64, 255)      # sampled from the AdFlex logo
@functools.lru_cache(maxsize=8)
def alfa_letters(size):
    f = ImageFont.truetype('/home/claude/alfa/assets/Outfit-800.ttf', int(size))
    track = size * 0.03
    xs, x = [], 0.0
    for ch in 'ALFA':
        xs.append(x); x += f.getlength(ch) + track
    tw = x - track
    l, t, r, b = f.getbbox('ALFA')
    pad = int(size * 0.3)
    w, h = int(tw + 2 * pad), int(b - t + 2 * pad)
    g = np.linspace(0, 1, w)[None, :, None]
    grad = (np.array(BLUE) * (1 - g) + np.array(VIOLET) * g).astype(np.uint8).repeat(h, 0)
    out = []
    for ch, x0 in zip('ALFA', xs):
        m = Image.new('L', (w, h), 0)
        ImageDraw.Draw(m).text((pad + x0, pad - t), ch, font=f, fill=255)
        glow = Image.new('RGBA', (w, h), (130, 90, 255, 0))
        glow.putalpha(m.filter(ImageFilter.GaussianBlur(size * 0.09)).point(lambda v: int(v * 0.75)))
        fill = Image.fromarray(grad, 'RGB').convert('RGBA'); fill.putalpha(m)
        glow.alpha_composite(fill)
        out.append(glow)
    return out

def alfa_word(img, p, cx, cy, size=330, alpha=1.0):
    """staggered letter rise: each letter slides up 18% of size and fades in; p 0..1"""
    if p <= 0 or alpha <= 0: return
    L = alfa_letters(int(size * U))
    w, h = L[0].size
    acc = Image.new('RGBA', (w, h + int(size * U * 0.2)), (0, 0, 0, 0))
    for i, li in enumerate(L):
        q = eo3(prog(p, i * 0.14, i * 0.14 + 0.58))
        if q <= 0: continue
        layer = li.copy(); layer.putalpha(layer.getchannel('A').point(lambda v, q=q: int(v * q)))
        acc.alpha_composite(layer, (0, int((1 - q) * size * U * 0.18)))
    paste(img, acc, cx, cy + (acc.height - h) / 2, alpha, scale=lerp(1.04, 1.0, eo3(p)))

def write_on(img, p, cx, cy, alpha=1.0):
    alfa_word(img, p, cx, cy, 330, alpha)
H8.write_on = write_on

def end_layer(t):
    L = H2.BG.copy()
    alfa_word(L, prog(t, h10.I0, h10.I0 + 0.7), CX, CY - 60 * U, 300)
    a = eo3(prog(t, h10.I0 + 0.5, h10.I0 + 0.9))
    if a > 0:
        lw = 440 * U; lg = h10.LOGO.resize((int(lw), int(lw * h10.LOGO.height / h10.LOGO.width)), Image.LANCZOS)
        by = H2.word_img('by', 'Outfit-600.ttf', 58 * U, 'white')
        gap = 20 * U; tot = by.width + gap + lg.width
        y = CY + 160 * U + (1 - a) * 24 * U
        paste(L, by, CX - tot / 2 + by.width / 2, y + 6 * U, a * 0.8)
        paste(L, lg, CX + tot / 2 - lg.width / 2, y, a)
    return L
h10.end_layer = end_layer

render, DUR, FPS = h10.render, h10.DUR, h10.FPS

if __name__ == '__main__':
    FMT, MODE = sys.argv[1], sys.argv[2]
    if MODE == 'frames':
        for ts in sys.argv[3].split(','):
            render(float(ts)).convert('RGB').save(f'/home/claude/alfa/build/h11_{FMT}_{ts}.jpg', quality=88)
    else:
        out = sys.argv[3]; tmp = out.replace('.mp4', '.tmp.mp4')
        p = subprocess.Popen(['ffmpeg', '-v', 'error', '-y', '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-s', f'{W}x{H}', '-r', str(FPS), '-i', '-',
                              '-c:v', 'libx264', '-crf', '14', '-preset', 'veryfast', '-pix_fmt', 'yuv420p', tmp], stdin=subprocess.PIPE)
        for k in range(int(round(DUR * FPS))):
            p.stdin.write(render(k / FPS).convert('RGB').tobytes())
            if k % 100 == 0: print(k, flush=True)
        p.stdin.close()
        if p.wait() == 0: os.replace(tmp, out); print('done', out)
