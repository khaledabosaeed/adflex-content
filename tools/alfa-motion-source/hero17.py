#!/usr/bin/env python3
# ALFA hero v17 = v16 + an opening title card like the Genjutsu promo: ALFA glitches in on the brand background,
# "by AdFlex" locks up under it, then it glitches out into the opener.
import sys, os, math, subprocess
import hero16 as h16
from hero16 import h13, h14, H2, W, H, CX, CY, U, WIDE, clamp, prog, eo3, ei3, eio, lerp, paste
from hero13 import h10, h11
import numpy as np
from PIL import Image, ImageDraw, ImageFilter
import title_style as TS
h11.alfa_letters = TS.alfa_letters_B          # ALFA wordmark everywhere: Unbounded 900, logo gradient + gloss
H2.BG = TS.bg2(0.3, 1)                         # richer brand background everywhere it is used

FPS = 30

def glitch(img, g, seed):
    """RGB split + horizontal slice offsets, strength g (0..1)"""
    if g <= 0.01: return img
    rng = np.random.default_rng(seed)
    a = np.asarray(img.convert('RGB')).copy()
    dx = int(28 * U * g)
    out = a.copy()
    out[..., 0] = np.roll(a[..., 0], dx, axis=1)
    out[..., 2] = np.roll(a[..., 2], -dx, axis=1)
    for _ in range(int(3 + 9 * g)):
        y0 = int(rng.integers(0, H)); hh = int(rng.integers(6, max(8, int(80 * U * g))))
        off = int(rng.normal(0, 140 * U * g))
        out[y0:y0 + hh] = np.roll(out[y0:y0 + hh], off, axis=1)
    return Image.fromarray(out).convert('RGBA')

_LOCK = {}
def lockup():
    if 'l' not in _LOCK:
        lw = 470 * U; lg = h10.LOGO.resize((int(lw), int(lw * h10.LOGO.height / h10.LOGO.width)), Image.LANCZOS)
        by = TS.by_text(58 * U)
        _LOCK['l'] = (lg, by)
    return _LOCK['l']

INTRO = 1.4
DUR = h16.DUR + INTRO
_AW = {}
def aw():
    if 'w' not in _AW: _AW['w'] = TS.AnimWord((300 if WIDE else 345) * U)
    return _AW['w']

def intro(t):
    """ALFA: letters drop in from the camera one by one (blur → sharp, small overshoot, a glitch tick on each landing),
       the logo gradient keeps flowing, a light sweep passes, the word slowly pushes in;
       'by' rises out of a mask, the AdFlex logo wipes in with a glowing edge and its sparkle flashes;
       exit: letters fly past the camera one by one, lockup drops away, glitch cut into the opener."""
    f = int(round(t * FPS))
    L = TS.bg2(t, f)
    bg_a = eo3(prog(t, 0.0, 0.12))
    if bg_a < 1: L = Image.blend(Image.new('RGBA', (W, H), (0, 0, 0, 255)), L, bg_a)
    A = aw(); cx, cy = CX, CY - 60 * U
    push = lerp(1.0, 1.06, eio(prog(t, 0.45, 1.15)))
    shift = 0.30 * t
    sw = prog(t, 0.6, 0.85); sw = sw if 0 < sw < 1 else None
    tick = 0
    for i in range(4):
        t0 = 0.08 + i * 0.055; q = prog(t, t0, t0 + 0.24)
        if q <= 0: continue
        e = eo3(q)
        land = math.sin(math.pi * prog(t, t0 + 0.2, t0 + 0.34)) * 0.09          # harder squash on landing
        tick = max(tick, math.exp(-((t - (t0 + 0.2)) / 0.02) ** 2))
        x1 = 1.05 + i * 0.035; o = prog(t, x1, x1 + 0.2); oe = ei3(o) if o > 0 else 0
        sc = lerp(3.6, 1.0, e) * (1 - land) * push * lerp(1, 4.0, oe)
        al = clamp(q * 3.0) * (1 - oe)
        if al <= 0: continue
        im = A.letter(i, shift, sw)
        blur = 20 * (1 - e) + 14 * oe
        if blur > 0.6: im = im.filter(ImageFilter.GaussianBlur(blur * U))
        rot = lerp(-16 + 9 * i, 0, e)
        if abs(rot) > 0.2: im = im.rotate(rot, resample=Image.BICUBIC, expand=True)
        lx, ly = A.centre(i, cx, cy)
        lx = cx + (lx - cx) * push * lerp(1, 1.6, oe); ly = cy + (ly - cy) * push - (1 - e) * 40 * U
        paste(L, im, lx, ly, al, scale=sc)
    # lockup: "by" rises out of a mask, the logo wipes in left → right with a glowing edge
    lg, by = lockup(); gap = 22 * U; tot = by.width + gap + lg.width
    y = CY + (165 if WIDE else 215) * U
    drop = eio(prog(t, 1.0, 1.22))
    qb = eo3(prog(t, 0.36, 0.52))
    if qb > 0:
        lay = Image.new('RGBA', by.size, (0, 0, 0, 0)); lay.alpha_composite(by, (0, int((1 - qb) * by.height)))
        paste(L, lay, CX - tot / 2 + by.width / 2, y + 6 * U + drop * 30 * U, 0.9 * (1 - drop))
    qw = eio(prog(t, 0.40, 0.62))
    if qw > 0:
        lx0 = CX + tot / 2 - lg.width
        cw = max(1, int(lg.width * qw))
        part = lg.crop((0, 0, cw, lg.height))
        paste(L, part, lx0 + cw / 2, y + drop * 30 * U, 1 - drop)
        if qw < 1:   # glowing wipe edge
            edge = Image.new('RGBA', (int(26 * U), int(lg.height * 1.2)), (200, 170, 255, 0))
            em = Image.new('L', edge.size, 0); ImageDraw.Draw(em).rectangle([edge.width * 0.4, 0, edge.width * 0.6, edge.height], fill=255)
            edge.putalpha(em.filter(ImageFilter.GaussianBlur(6 * U)))
            paste(L, edge, lx0 + cw, y, math.sin(math.pi * qw))
        sx, sy = _STAR()
        sp = prog(t, 0.6, 0.92)
        if 0 < sp < 1:
            k = math.sin(math.pi * sp)
            paste(L, TS.sparkle(48 * U * (0.4 + 0.9 * k), rot=sp * 90), lx0 + sx * lg.width / _LOGO_W(), y - lg.height / 2 + sy * lg.height / _LOGO_H(), k * (1 - drop))
    T_LAST = 0.08 + 3 * 0.055 + 0.2
    r = prog(t, T_LAST, T_LAST + 0.35)
    if 0 < r < 1:
        R = lerp(120, 1250, eo3(r)) * U
        ring = Image.new('L', (W, H), 0)
        ImageDraw.Draw(ring).ellipse([cx - R, cy - R * 0.62, cx + R, cy + R * 0.62], outline=255, width=int(lerp(36, 4, r) * U))
        lay = Image.new('RGBA', (W, H), (150, 90, 255, 0)); lay.putalpha(ring.filter(ImageFilter.GaussianBlur(12 * U)).point(lambda v: int(v * 0.7 * (1 - r))))
        L.alpha_composite(lay)
        burst = Image.new('L', (W, H), 0)
        ImageDraw.Draw(burst).ellipse([cx - 700 * U, cy - 260 * U, cx + 700 * U, cy + 260 * U], fill=255)
        lay = Image.new('RGBA', (W, H), (110, 120, 255, 0)); lay.putalpha(burst.filter(ImageFilter.GaussianBlur(120 * U)).point(lambda v: int(v * 0.45 * (1 - eo3(r)))))
        L.alpha_composite(lay)
    shake = sum(math.exp(-((t - (0.08 + i * 0.055 + 0.2)) / 0.03) ** 2) for i in range(4))
    if shake > 0.02:
        dx = int(math.sin(f * 2.7) * 14 * U * shake); dy = int(math.cos(f * 3.1) * 9 * U * shake)
        L = Image.fromarray(np.roll(np.asarray(L), (dy, dx), axis=(0, 1)))
    g_out = eio(prog(t, 1.24, INTRO))
    L = glitch(L, max(0.75 * tick, g_out), f)
    if g_out > 0: L = Image.blend(L, Image.new('RGBA', (W, H), (0, 0, 0, 255)), eio(prog(t, 1.3, INTRO)))
    return L

_ST = {}
def _STAR():
    if 's' not in _ST: _ST['s'] = TS.logo_star(h10.LOGO)
    return _ST['s']
def _LOGO_W(): return h10.LOGO.width
def _LOGO_H(): return h10.LOGO.height

def render(t):
    if t < INTRO: return intro(t)
    img = h16.render(t - INTRO)
    gi = 1 - eo3(prog(t, INTRO, INTRO + 0.12))                  # 3-4 glitchy frames into the opener
    return glitch(img, 0.6 * gi, int(t * FPS)) if gi > 0.02 else img

if __name__ == '__main__':
    FMT, MODE = sys.argv[1], sys.argv[2]
    if MODE == 'frames':
        for ts in sys.argv[3].split(','):
            render(float(ts)).convert('RGB').save(f'/home/claude/alfa/build/h17_{FMT}_{ts}.jpg', quality=88)
    else:
        out = sys.argv[3]; tmp = out.replace('.mp4', '.tmp.mp4')
        t0 = float(sys.argv[4]) if len(sys.argv) > 4 else 0.0; t1 = float(sys.argv[5]) if len(sys.argv) > 5 else DUR
        p = subprocess.Popen(['ffmpeg', '-v', 'error', '-y', '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-s', f'{W}x{H}', '-r', str(FPS), '-i', '-',
                              '-c:v', 'libx264', '-crf', '14', '-preset', 'veryfast', '-pix_fmt', 'yuv420p', tmp], stdin=subprocess.PIPE)
        for k in range(int(round(t0 * FPS)), int(round(t1 * FPS))):
            p.stdin.write(render(k / FPS).convert('RGB').tobytes())
        p.stdin.close()
        if p.wait() == 0: os.replace(tmp, out); print('done', out)
