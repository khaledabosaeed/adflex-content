#!/usr/bin/env python3
# ALFA hero v16 = v15 + "one message": after ALFA blows the pile away, a small ALFA chat opens; one ready message
# ("Launch our ORRA watch this week." + the watch photo flown in from the sheet) is sent, ALFA answers with a 5-step
# plan, the plan collapses into the progress chip, and the attached photo match-cuts into the product video.
import sys, os, math, subprocess
import hero15 as h15
from hero15 import h14, h13, H8, H5, H2, W, H, CX, CY, U, WIDE, clamp, prog, eo3, ei3, eio, lerp, paste, F, grad_fill, darken, LAV, DEEP, GLOW
from hero13 import h11, caption, grad_arr, STOPS, BOXST
import numpy as np
from PIL import Image, ImageDraw, ImageFilter, ImageFont

FPS = 30
UU = U if WIDE else U * 1.65
TB = h15.TB                     # ALFA arrives (6.067)
CHAT = 4.2                      # TB .. TB+CHAT is the ALFA + chat beat
T_END = TB + CHAT               # = product video starts (h14.C0)
SHIFT = T_END - h14.C0          # v14 time = t - SHIFT after the chat
DUR = h14.DUR + SHIFT

# beat times (relative to TB)
K_OUT = TB + 1.00               # ALFA + tagline hand over to the chat
K_PANEL = TB + 1.00
K_PHOTO = TB + 1.10             # photo lifts off the sheet and flies into the message
K_USER = TB + 1.30              # user message appears (sent, not typed)
K_DOTS = TB + 1.62              # ALFA "typing" dots
K_REPLY = TB + 1.88
K_ROWS = TB + 2.05              # plan rows, 0.12 apart
K_COLLAPSE = TB + 3.20          # plan collapses into the corner chip
K_MATCH = TB + 3.70             # attached photo -> product video (watch match-cut)

PLAN = ['Product video', 'Billboard ads', 'UGC videos', 'All sizes', 'Schedule']

# ---------------- layout ----------------
if WIDE:
    PW, PH = 1100 * UU, 860 * UU; PCX, PCY = CX, CY + 30 * UU
else:
    PW, PH = W * 0.9, H * 0.77; PCX, PCY = CX, CY + 45 * U
PX0, PY0 = PCX - PW / 2, PCY - PH / 2
PAD = 40 * UU
ATT_W = (240 if WIDE else 225) * UU
ph_src = None

def photo():
    global ph_src
    if ph_src is None: ph_src = H8.photo_crop().convert('RGB')
    return ph_src
def att_rect():
    p = photo(); w = ATT_W; h = w * p.height / p.width
    x1 = PX0 + PW - PAD; y0 = PY0 + 120 * UU
    return (x1 - w / 2, y0 + h / 2, w, h)        # centre x, centre y, w, h

FS_MSG = (40 if WIDE else 42) * UU
def user_bubble():
    f = F(600, FS_MSG); txt = 'Launch our ORRA watch this week.'
    tw = f.getlength(txt); bw, bh = int(tw + 2 * 30 * UU), int(FS_MSG * 2.0)
    m = Image.new('L', (bw, bh), 0); ImageDraw.Draw(m).rounded_rectangle([0, 0, bw - 1, bh - 1], int(bh * 0.42), fill=255)
    b = grad_fill(m, BOXST); ImageDraw.Draw(b).text((bw / 2, bh / 2), txt, font=f, fill='white', anchor='mm')
    return b
def user_bubble_pos(b):
    _, ay, _, ah = att_rect()
    return PX0 + PW - PAD - b.width / 2, ay + ah / 2 + 18 * UU + b.height / 2

FS_R = (36 if WIDE else 38) * UU
ROW_H = FS_R * 1.55
def reply_geom():
    ub = user_bubble(); ux, uy = user_bubble_pos(ub)
    top = uy + ub.height / 2 + 34 * UU
    x0 = PX0 + PAD + 74 * UU                        # bubble left (after avatar)
    bw = (600 if WIDE else 660) * UU
    bh = FS_R * 1.9 + ROW_H * len(PLAN) + 20 * UU
    return x0, top, bw, bh

def avatar(sz):
    m = Image.new('L', (int(sz), int(sz)), 0); ImageDraw.Draw(m).ellipse([0, 0, sz - 1, sz - 1], fill=255)
    a = grad_fill(m, STOPS); ImageDraw.Draw(a).text((sz / 2, sz / 2 + 1), 'A', font=ImageFont.truetype('/home/claude/alfa/assets/Unbounded-900.ttf', int(sz * 0.42)), fill='white', anchor='mm')
    return a

def row_img(i, checked=False):
    f = F(500, FS_R); sz = int(FS_R * 0.8)
    w = int(f.getlength(PLAN[i]) + sz + 24 * UU + 8); h = int(ROW_H)
    c = Image.new('RGBA', (w, h), (0, 0, 0, 0)); d = ImageDraw.Draw(c)
    cy = h / 2
    d.ellipse([2, cy - sz / 2, 2 + sz, cy + sz / 2], outline=LAV + (200,), width=max(2, int(3 * UU)))
    d.text((sz + 24 * UU, cy), PLAN[i], font=f, fill=(235, 230, 255), anchor='lm')
    return c

def panel_img():
    w, h = int(PW), int(PH); m = int(60 * UU)
    out = Image.new('RGBA', (w + 2 * m, h + 2 * m), (0, 0, 0, 0))
    g = Image.new('RGBA', out.size, GLOW + (0,)); gm = Image.new('L', out.size, 0)
    ImageDraw.Draw(gm).rounded_rectangle([m, m, m + w, m + h], int(36 * UU), fill=110)
    g.putalpha(gm.filter(ImageFilter.GaussianBlur(m * 0.7))); out.alpha_composite(g)
    c = Image.new('RGBA', (w, h), (0, 0, 0, 0)); d = ImageDraw.Draw(c)
    d.rounded_rectangle([0, 0, w - 1, h - 1], int(36 * UU), fill=DEEP + (236,), outline=LAV + (100,), width=2)
    # header: avatar + ALFA + subtitle + online dot
    av = avatar(52 * UU); c.alpha_composite(av, (int(PAD), int(30 * UU)))
    fx = PAD + 52 * UU + 18 * UU
    import title_style as TS
    wm = TS.wordmark('B', 30 * UU); pad = int(30 * UU * 0.45)
    c.alpha_composite(wm, (int(fx - pad), int(30 * UU + 26 * UU - wm.height / 2)))
    d.text((fx + wm.width - 2 * pad + 18 * UU, 30 * UU + 28 * UU), 'AI marketing agent', font=F(500, 24 * UU), fill=LAV + (220,), anchor='lm')
    d.ellipse([w - PAD - 14 * UU, 30 * UU + 19 * UU, w - PAD, 30 * UU + 33 * UU], fill=(80, 220, 140))
    d.line([(PAD, 104 * UU), (w - PAD, 104 * UU)], fill=LAV + (40,), width=2)
    out.alpha_composite(c, (m, m))
    return out
_PANEL = None

def reply_img(n_rows, t):
    x0, top, bw, bh = reply_geom()
    bh = lerp(bh, FS_R * 2.0, eio(prog(t, K_COLLAPSE + 0.1, K_COLLAPSE + 0.45)))
    w, h = int(bw), int(bh)
    c = Image.new('RGBA', (w, h), (0, 0, 0, 0)); d = ImageDraw.Draw(c)
    d.rounded_rectangle([0, 0, w - 1, h - 1], int(28 * UU), fill=(38, 26, 78, 245), outline=LAV + (50,), width=2)
    d.text((28 * UU, FS_R * 1.0), "On it. Here's the plan:", font=F(600, FS_R), fill='white', anchor='lm')
    return c

def chat_layer(img, t, hide_rows=False):
    global _PANEL
    if _PANEL is None: _PANEL = panel_img()
    pa = eo3(prog(t, K_PANEL, K_PANEL + 0.35))
    if pa <= 0: return
    paste(img, _PANEL, PCX, PCY + (1 - pa) * 60 * UU, pa, scale=lerp(0.96, 1, pa))
    if pa < 1: return
    # user message
    ub = user_bubble(); ux, uy = user_bubble_pos(ub)
    q = eo3(prog(t, K_USER, K_USER + 0.3))
    if q > 0: paste(img, ub, ux, uy + (1 - q) * 30 * UU, q, scale=lerp(0.9, 1, q))
    # ALFA typing dots / reply
    x0, top, bw, bh = reply_geom()
    av = avatar(52 * UU)
    if t >= K_DOTS:
        paste(img, av, PX0 + PAD + 26 * UU, top + 30 * UU, eo3(prog(t, K_DOTS, K_DOTS + 0.2)))
    if K_DOTS <= t < K_REPLY + 0.05:
        dots = Image.new('RGBA', (int(120 * UU), int(60 * UU)), (0, 0, 0, 0)); dd = ImageDraw.Draw(dots)
        dd.rounded_rectangle([0, 0, dots.width - 1, dots.height - 1], int(28 * UU), fill=(38, 26, 78, 245))
        for i in range(3):
            yy = 30 * UU - 7 * UU * max(0, math.sin((t - K_DOTS) * 14 - i * 0.9))
            dd.ellipse([24 * UU + i * 28 * UU - 7 * UU, yy - 7 * UU, 24 * UU + i * 28 * UU + 7 * UU, yy + 7 * UU], fill=LAV)
        paste(img, dots, x0 + dots.width / 2, top + dots.height / 2, 1 - eio(prog(t, K_REPLY - 0.05, K_REPLY + 0.05)))
    if t >= K_REPLY:
        q = eo3(prog(t, K_REPLY, K_REPLY + 0.3))
        rb = reply_img(len(PLAN), t)
        paste(img, rb, x0 + bw / 2, top + rb.height / 2 + (1 - q) * 24 * UU, q, scale=lerp(0.94, 1, q))
        for i in range(len(PLAN)):
            ti = K_ROWS + i * 0.10
            if t < ti or hide_rows: continue
            r = eo3(prog(t, ti, ti + 0.25))
            ri = row_img(i)
            rx, ry = row_pos(i, ri)
            paste(img, ri, rx + (1 - r) * 30 * UU, ry, r)

def row_pos(i, ri):
    x0, top, bw, bh = reply_geom()
    return x0 + 28 * UU + ri.width / 2, top + FS_R * 1.9 + ROW_H * (i + 0.5)

def att_layer(img, t):
    """the watch photo lifts off the sheet and flies into the message"""
    if t < K_PHOTO: return
    p = photo(); q = eio(prog(t, K_PHOTO, K_PHOTO + 0.5))
    sx, sy = H8.photo_center_screen()
    sh = (H8.PHOTO_BOX[3] - H8.PHOTO_BOX[1]) * (1 if WIDE else H / 1080) * 1.08
    ax, ay, aw, ah = att_rect()
    hh = lerp(sh, ah, q); ww = hh * p.width / p.height
    x = lerp(sx, ax, q); y = lerp(sy, ay, q) - math.sin(math.pi * q) * 60 * UU
    paste(img, h13.ccard(p, ww, hh, lerp(6, 20, q) * UU, glow=0.6 * math.sin(math.pi * q) + 0.15), x, y, eo3(prog(t, K_PHOTO, K_PHOTO + 0.12)))

def att_watch():
    ax, ay, aw, ah = att_rect()
    return (ax + (0.457 - 0.5) * aw, ay + (0.423 - 0.5) * ah, 0.354 * aw)

def chip_time(t):
    """counter starts when the plan lands in the corner and reaches v14's value at the product-video start"""
    return lerp(h14.TSTART, h14.C0, prog(t, K_COLLAPSE + 0.35, T_END))

def collapse_layer(img, t):
    """plan rows fly into the corner and become the progress chip"""
    c = h14.chip_img(chip_time(t)); kx, ky = h14.corner_center(c)
    for i in range(len(PLAN)):
        t0 = K_COLLAPSE + i * 0.04; q = eio(prog(t, t0, t0 + 0.35))
        if q <= 0 or q >= 1: continue
        ri = row_img(i); rx, ry = row_pos(i, ri)
        paste(img, ri, lerp(rx, kx, q), lerp(ry, ky, q) - math.sin(math.pi * q) * 40 * UU, 1 - eio(prog(q, 0.6, 1.0)), scale=lerp(1, 0.25, q))
    a = eo3(prog(t, K_COLLAPSE + 0.3, K_COLLAPSE + 0.5))
    if a > 0:
        pulse = math.sin(math.pi * prog(t, K_COLLAPSE + 0.3, K_COLLAPSE + 0.6)) * 0.12
        paste(img, c, kx, ky, a, scale=1 + pulse)
        cs, _, _ = h13.two_tone('Campaign started', '', 24 * U, 600)
        al = a * (1 - eio(prog(t, K_MATCH + 0.1, K_MATCH + 0.4)))
        if al > 0: paste(img, cs, kx, ky + c.height / 2 + 26 * U, al)

def chat_frame(t, hide_rows=False, with_chip=True):
    img = h15.pile_bg(TB + 1).copy()
    # ALFA + tagline, then they hand over to the chat
    o = eio(prog(t, K_OUT - 0.1, K_OUT + 0.2))
    h11.alfa_word(img, prog(t, TB + 0.1, TB + 0.75), CX, CY - 40 * U - o * 60 * U, 330, 1 - o)
    caption(img, h13.TAGLINE[0], h13.TAGLINE[1], 56 * U, t, TB + 0.6, K_OUT, x=CX, y=CY + 170 * U, weight=600)
    chat_layer(img, t, hide_rows or t >= K_COLLAPSE)
    att_layer(img, t)
    if t >= K_COLLAPSE and with_chip: collapse_layer(img, t)
    return img

def render(t):
    if t < TB: return h15.render(t)
    if t < K_MATCH:
        img = chat_frame(t)
        if t < TB + 0.5: h15.draw_pile(img, t)
        return img
    if t < T_END:
        A = chat_frame(K_MATCH - 1e-3, with_chip=False)
        img = h14.match(t, K_MATCH, T_END, A, h14.ad_frame(t - SHIFT), att_watch(), h14.WP['ad0'])
        collapse_layer(img, t)
        return img
    return h14.render(t - SHIFT)

if __name__ == '__main__':
    FMT, MODE = sys.argv[1], sys.argv[2]
    if MODE == 'frames':
        for ts in sys.argv[3].split(','):
            render(float(ts)).convert('RGB').save(f'/home/claude/alfa/build/h16_{FMT}_{ts}.jpg', quality=88)
    elif MODE == 'times':
        print(dict(TB=TB, T_END=T_END, SHIFT=SHIFT, DUR=DUR))
    else:
        out = sys.argv[3]; tmp = out.replace('.mp4', '.tmp.mp4')
        t0 = float(sys.argv[4]) if len(sys.argv) > 4 else 0.0; t1 = float(sys.argv[5]) if len(sys.argv) > 5 else DUR
        p = subprocess.Popen(['ffmpeg', '-v', 'error', '-y', '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-s', f'{W}x{H}', '-r', str(FPS), '-i', '-',
                              '-c:v', 'libx264', '-crf', '14', '-preset', 'veryfast', '-pix_fmt', 'yuv420p', tmp], stdin=subprocess.PIPE)
        for k in range(int(round(t0 * FPS)), int(round(t1 * FPS))):
            p.stdin.write(render(k / FPS).convert('RGB').tobytes())
        p.stdin.close()
        if p.wait() == 0: os.replace(tmp, out); print('done', out)
