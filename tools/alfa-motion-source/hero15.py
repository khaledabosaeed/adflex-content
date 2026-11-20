#!/usr/bin/env python3
# ALFA hero v15 = v14 + "the pile": after the opener, the usual AI-tool chores (MCP setup, API keys, prompts,
# 10 tools, connectors) pile up as messy cards; ALFA arrives and blows them away -> "No MCP. No setup. Just ALFA."
import sys, os, math, random, subprocess
import hero14 as h14
from hero14 import h13, H8, H5, H2, W, H, CX, CY, U, WIDE, clamp, prog, eo3, ei3, eio, lerp, paste, F, grad_fill, darken, LAV, DEEP, GLOW
import numpy as np
from PIL import Image, ImageDraw, ImageFilter

FPS = 30
PILE = 1.3
A1 = h14.A1; TB = A1 + PILE              # TB = moment ALFA arrives and the pile is blown away
DUR = h14.DUR + PILE
h13.DIM_FULL = True
h13.TAGLINE = ('No MCP. No setup.', 'Just ALFA.')

AMBER, RED = (255, 184, 76), (255, 92, 92)
CARDS = [('MCP setup', 'Configuring…', AMBER, 'plug'), ('API keys', 'Expired', RED, 'key'),
         ('Prompts', 'Rewrite #7', AMBER, 'text'), ('10 tools', 'Switching…', AMBER, 'grid'),
         ('Connectors', 'Failed', RED, 'link')]
if WIDE: POS = [(-420, -190, -9), (330, -230, 7), (-60, -20, -4), (410, 90, 10), (-380, 200, 6)]
else:    POS = [(-150, -360, -9), (140, -210, 8), (-50, -50, -5), (150, 120, 10), (-130, 290, 6)]
DROP = [A1 + 0.08 + i * 0.16 for i in range(len(CARDS))]

def icon(d, kind, x, y, s, col):
    lw = max(2, int(4 * s / 60))
    if kind == 'plug':
        d.rounded_rectangle([x - s * .22, y - s * .05, x + s * .22, y + s * .25], int(s * .08), outline=col, width=lw)
        d.line([(x - s * .1, y - s * .05), (x - s * .1, y - s * .25)], fill=col, width=lw); d.line([(x + s * .1, y - s * .05), (x + s * .1, y - s * .25)], fill=col, width=lw)
        d.line([(x, y + s * .25), (x, y + s * .38)], fill=col, width=lw)
    elif kind == 'key':
        r = s * .14; d.ellipse([x - s * .3, y - r, x - s * .3 + 2 * r, y + r], outline=col, width=lw)
        d.line([(x - s * .02, y), (x + s * .3, y)], fill=col, width=lw); d.line([(x + s * .2, y), (x + s * .2, y + s * .12)], fill=col, width=lw); d.line([(x + s * .3, y), (x + s * .3, y + s * .12)], fill=col, width=lw)
    elif kind == 'text':
        for i, w in enumerate([.5, .38, .44]): d.line([(x - s * .25, y - s * .15 + i * s * .15), (x - s * .25 + s * w, y - s * .15 + i * s * .15)], fill=col, width=lw)
        d.line([(x + s * .25, y - s * .22), (x + s * .25, y + s * .22)], fill=col, width=lw)
    elif kind == 'grid':
        g = s * .2
        for i in (-1, 1):
            for j in (-1, 1): d.rounded_rectangle([x + i * g * .6 - g / 2, y + j * g * .6 - g / 2, x + i * g * .6 + g / 2, y + j * g * .6 + g / 2], 3, outline=col, width=lw)
    elif kind == 'link':
        r = s * .09
        for cx_, cy_ in [(x - s * .22, y + s * .1), (x + s * .22, y - s * .1)]: d.ellipse([cx_ - r, cy_ - r, cx_ + r, cy_ + r], outline=col, width=lw)
        d.line([(x - s * .14, y + s * .06), (x + s * .14, y - s * .06)], fill=col, width=lw)
        d.line([(x - s * .06, y - s * .12), (x + s * .06, y + s * .12)], fill=RED, width=lw)

_CI = {}
def card_img(i):
    if i in _CI: return _CI[i]
    title, status, scol, kind = CARDS[i]
    w, h = int(360 * U), int(118 * U); m = int(30 * U)
    out = Image.new('RGBA', (w + 2 * m, h + 2 * m), (0, 0, 0, 0))
    out.alpha_composite(H2.shadow(w, h, int(22 * U), m))
    c = Image.new('RGBA', (w, h), (0, 0, 0, 0)); d = ImageDraw.Draw(c)
    d.rounded_rectangle([0, 0, w - 1, h - 1], int(22 * U), fill=(24, 15, 52, 240), outline=LAV + (95,), width=2)
    ib = int(72 * U); ix, iy = int(22 * U), (h - ib) // 2
    d.rounded_rectangle([ix, iy, ix + ib, iy + ib], int(16 * U), fill=(44, 30, 92, 255))
    icon(d, kind, ix + ib / 2, iy + ib / 2, ib, (190, 175, 255))
    tx = ix + ib + 20 * U
    d.text((tx, h * 0.40), title, font=F(700, 36 * U), fill='white', anchor='lm')
    d.ellipse([tx, h * 0.70 - 6 * U, tx + 12 * U, h * 0.70 + 6 * U], fill=scol)
    d.text((tx + 22 * U, h * 0.70), status, font=F(500, 25 * U), fill=scol + (255,), anchor='lm')
    out.alpha_composite(c, (m, m))
    _CI[i] = out; return out

_BG = {}
def pile_bg(t):
    if 'a' not in _BG:
        _BG['a'] = H5.fit_frame(H8.last_b(), 'gB', zoom=1.08).convert('RGBA')
        _BG['b'] = h13.alfa_beat(A1).convert('RGBA')
    return Image.blend(_BG['a'], _BG['b'], eio(prog(t, A1, A1 + 0.35)))

def draw_pile(img, t):
    # tiny global shake each time a card lands
    sh = sum(math.sin((t - d0 - 0.24) * 70) * math.exp(-(t - d0 - 0.24) * 14) for d0 in DROP if t > d0 + 0.24) * 6 * U
    for i, (dx, dy, rot) in enumerate(POS):
        d0 = DROP[i]
        if t < d0: continue
        q = clamp((t - d0) / 0.28)
        fall = 1 - eo3(q)
        jitter = math.sin(t * 5.5 + i * 1.7) * 1.4
        b = prog(t, TB - 0.02, TB + 0.42)            # blown away by ALFA
        bo = eo3(b)
        L = math.hypot(dx, dy + 30) + 1e-6
        ox, oy = dx / L * 900 * U * bo, (dy + 30) / L * 700 * U * bo
        ang = rot + 22 * fall + jitter + rot * 2.2 * bo
        im = card_img(i)
        if b > 0: im = im.filter(ImageFilter.GaussianBlur(14 * bo))
        im = im.rotate(ang, resample=Image.BICUBIC, expand=True)
        x = CX + dx * U + ox + sh
        y = CY + 10 * U + dy * U - fall * 260 * U + oy
        a = eo3(clamp(q * 2.5)) * (1 - eio(prog(b, 0.15, 1.0)))
        if a > 0: paste(img, im, x, y, a, scale=(1.3 if WIDE else 1.5) * lerp(1.0, 1.18, fall) * lerp(1, 0.85, bo))
    # brand shockwave ring at the moment ALFA arrives
    r = prog(t, TB, TB + 0.45)
    if 0 < r < 1:
        R = lerp(80, 1100, eo3(r)) * U
        ring = Image.new('L', (W, H), 0)
        ImageDraw.Draw(ring).ellipse([CX - R, CY - 40 * U - R, CX + R, CY - 40 * U + R], outline=255, width=int(lerp(30, 4, r) * U))
        lay = Image.new('RGBA', (W, H), GLOW + (0,)); lay.putalpha(ring.filter(ImageFilter.GaussianBlur(14 * U)).point(lambda v: int(v * 0.55 * (1 - r))))
        img.alpha_composite(lay)

def render(t):
    if t < A1: return h14.render(t)
    if t < TB:
        img = pile_bg(t); draw_pile(img, t); return img
    img = h14.render(t - PILE)
    if t < TB + 0.5: draw_pile(img, t)
    return img

if __name__ == '__main__':
    FMT, MODE = sys.argv[1], sys.argv[2]
    if MODE == 'frames':
        for ts in sys.argv[3].split(','):
            render(float(ts)).convert('RGB').save(f'/home/claude/alfa/build/h15_{FMT}_{ts}.jpg', quality=88)
    else:
        out = sys.argv[3]; tmp = out.replace('.mp4', '.tmp.mp4')
        t0 = float(sys.argv[4]) if len(sys.argv) > 4 else 0.0; t1 = float(sys.argv[5]) if len(sys.argv) > 5 else DUR
        p = subprocess.Popen(['ffmpeg', '-v', 'error', '-y', '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-s', f'{W}x{H}', '-r', str(FPS), '-i', '-',
                              '-c:v', 'libx264', '-crf', '14', '-preset', 'veryfast', '-pix_fmt', 'yuv420p', tmp], stdin=subprocess.PIPE)
        for k in range(int(round(t0 * FPS)), int(round(t1 * FPS))):
            p.stdin.write(render(k / FPS).convert('RGB').tobytes())
        p.stdin.close()
        if p.wait() == 0: os.replace(tmp, out); print('done', out)
