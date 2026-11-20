#!/usr/bin/env python3
# ALFA hero v14 = v13 + (1) a progress-timer chip with a story, (2) watch-anchored match transitions.
#   python3 hero14.py wide frames t1,t2 | python3 hero14.py wide render out.mp4 [t0 t1]
import sys, os, math, subprocess
import hero13 as h13
from hero13 import (h10, h11, H8, H5, H2, W, H, CX, CY, U, WIDE, clamp, prog, eo3, ei3, eio, lerp, paste,
                    F, caption, two_tone, show, grad_fill, grad_arr, STOPS, LAV, DEEP, GLOW, darken)
import numpy as np
from PIL import Image, ImageDraw, ImageFilter

FPS, DUR = 30, 20.0
# ---------------- schedule ----------------
A1 = h13.T_OPEN; A2 = A1 + 2.0
TR = 0.5                                  # one transition length for the watch match-cuts
C0 = A2 + TR;  C1 = C0 + 1.65             # product video
D0 = C1 + TR;  D1 = D0 + 1.45             # billboard
E0 = D1 + TR;  E1 = E0 + 1.45             # UGC
F0 = E1 + 0.35; F1 = F0 + 1.40            # any size
G0 = F1 + 0.30; G1 = G0 + 1.40            # scheduled
H0 = G1; FLY = 0.55; HSTOP = H0 + 0.80; H1 = H0 + 1.60
I0 = H1 + 0.25
TSTART = A1 + 1.1
for k, v in dict(A1=A1, A2=A2, C0=C0, C1=C1, D0=D0, D1=D1, E0=E0, E1=E1, F0=F0, F1=F1, G0=G0, G1=G1,
                 H0=H0, HSTOP=HSTOP, H1=H1, I0=I0, TIMER_START=TSTART).items():
    setattr(h13, k, v)

def ad_frame(t):  return H5.grade_bottom(H5.fit_frame(H5.frame('ad', 0.05 + (t - A2) * 1.1), 'ad', zoom=lerp(1.0, 1.05, prog(t, A2, D0))))
def bb_frame(t):  return H5.grade_bottom(H5.fit_frame(H5.frame('bb', 0.1 + (t - C1) * 1.3), 'bb'))
def ugc_frame(t): return H5.grade_bottom(H5.fit_frame(H5.frame('ugc', 0.2 + (t - D1) * 1.2), 'ugc'))
h13.ad_frame, h13.bb_frame, h13.ugc_frame = ad_frame, bb_frame, ugc_frame

# ---------------- watch positions on screen (x, y, face diameter), wide 1920x1080 ----------------
# measured on the graded frames at the cut points
WP = dict(ad0=(900, 435, 435), ad1=(900, 495, 485), bb0=(1290, 315, 255), bb1=(1305, 330, 285), ugc0=(1350, 660, 210))
WP_WIDE = dict(WP)
if not WIDE:   # tall: fit_frame centre-crops the 16:9 clip to the 1080x1350 canvas at full height
    def _tall(p):
        s = H / 1080; x0 = (1920 * s - W) / 2
        return (p[0] * s - x0, p[1] * s, p[2] * s)
    WP = {k: _tall(v) for k, v in WP.items()}

# ---------------- match transition ----------------
def xform(img, s, cx, cy):
    """scale img by s about its centre, place centre at (cx,cy); if it no longer covers the
       canvas, fill behind it with a blurred, darker copy that does"""
    out = Image.new('RGBA', (W, H), (0, 0, 0, 255))
    if s < 1.0:
        bgc = img.filter(ImageFilter.GaussianBlur(30)); darken(bgc, 0.35)
        out.alpha_composite(bgc)
    w, hh = int(W * s), int(H * s)
    if s >= 1.0:   # keep the canvas covered (no empty edges)
        cx = clamp(cx, W - w / 2, w / 2); cy = clamp(cy, H - hh / 2, hh / 2)
    im = img.resize((w, hh), Image.BILINEAR).convert('RGBA')
    if s < 1.0:
        m = Image.new('L', (w, hh), 0); f = int(min(w, hh) * 0.06)
        ImageDraw.Draw(m).rectangle([f, f, w - f, hh - f], fill=255)
        im.putalpha(m.filter(ImageFilter.GaussianBlur(f * 0.6)))
    out.alpha_composite(im, (int(round(cx - w / 2)), int(round(cy - hh / 2))))
    return out

def sweep(img, k, a=0.22):
    """soft diagonal light band crossing the frame while the shots swap"""
    if k <= 0 or k >= 1: return img
    x = lerp(-0.3, 1.3, eio(k)) * (W + H)
    yy, xx = np.mgrid[0:H:4, 0:W:4].astype(np.float32)
    d = (xx + yy * 0.6) - x
    band = np.exp(-(d / (W * 0.10)) ** 2) * math.sin(math.pi * k) * a
    m = Image.fromarray((np.clip(band, 0, 1) * 255).astype(np.uint8)).resize((W, H), Image.BILINEAR)
    lay = Image.new('RGBA', (W, H), (215, 200, 255, 0)); lay.putalpha(m)
    img.alpha_composite(lay); return img

def match(t, t0, t1, A, B, pa, pb):
    """the watch stays locked on screen: its position/size glide from A's to B's while A dissolves into B"""
    k = eio(prog(t, t0, t1))
    vx, vy = lerp(pa[0], pb[0], k), lerp(pa[1], pb[1], k)
    vd = math.exp(lerp(math.log(pa[2]), math.log(pb[2]), k))
    sa, sb = vd / pa[2], vd / pb[2]
    a = xform(A, sa, vx + (CX - pa[0]) * sa, vy + (CY - pa[1]) * sa)
    b = xform(B, sb, vx + (CX - pb[0]) * sb, vy + (CY - pb[1]) * sb)
    out = Image.blend(a, b, eio(prog(k, 0.22, 0.78)))
    return sweep(out, prog(t, t0, t1))


# ---------------- hero-object transition: the watch itself is cut out and flies between shots ----------------
def _cut(name, box, wp):
    im = Image.open(f'/home/claude/alfa/cut/{name}.png').convert('RGBA')
    bb = im.getchannel('A').point(lambda v: 255 if v > 8 else 0).getbbox(); im = im.crop(bb)
    if not WIDE:
        s = H / 1080; im = im.resize((int(im.width * s), int(im.height * s)), Image.LANCZOS)
        x0 = (1920 * s - W) / 2; ox, oy = box[0] * s - x0 + bb[0] * s, box[1] * s + bb[1] * s
    else: ox, oy = box[0] + bb[0], box[1] + bb[1]
    wp = wp if WIDE else (wp[0] * H / 1080, wp[1] * H / 1080, wp[2] * H / 1080)
    return im, ((wp[0] - (0 if WIDE else (1920 * H / 1080 - W) / 2)) - ox, wp[1] - oy, wp[2])          # watch face centre/diameter inside the cutout
import json as _json
_BOX = _json.load(open('/home/claude/alfa/cut/boxes.json'))
CUT_AD = _cut('ad', _BOX['ad'], WP_WIDE['ad1'])
CUT_BB = _cut('bb', _BOX['bb'], WP_WIDE['bb1'])

def soft(img, blur, dark):
    if blur > 0.5: img = img.filter(ImageFilter.GaussianBlur(blur))
    else: img = img.copy()
    darken(img, dark); return img

def fly(t, t0, t1, A, B, pa, pb, cut, rot=0.0):
    k = prog(t, t0, t1)
    ca = eio(prog(k, 0.0, 0.45)); cb = eio(prog(k, 0.45, 1.0))
    a = soft(A, 10 * ca, 0.45 * ca)
    b = soft(B, 14 * (1 - cb), 0.45 * (1 - cb))
    img = Image.blend(a, b, eio(prog(k, 0.25, 0.7)))
    im, (wx, wy, wd) = cut
    m = eio(prog(k, 0.04, 0.88))
    d = math.exp(lerp(math.log(pa[2]), math.log(pb[2]), m)) * (1 + 0.07 * math.sin(math.pi * m))
    x, y = lerp(pa[0], pb[0], m), lerp(pa[1], pb[1], m)
    dx, dy = pb[0] - pa[0], pb[1] - pa[1]; L = math.hypot(dx, dy) + 1e-6
    arc = math.sin(math.pi * m) * min(140 * U, 0.18 * L)
    x += -dy / L * arc; y += dx / L * arc - math.sin(math.pi * m) * 30 * U
    sc = d / wd
    cw, ch = max(2, int(im.width * sc)), max(2, int(im.height * sc))
    c = im.resize((cw, ch), Image.BILINEAR)
    if rot:
        ang = rot * m; P = int(max(cw, ch) * 0.5)
        cp = Image.new('RGBA', (cw + 2 * P, ch + 2 * P), (0, 0, 0, 0)); cp.paste(c, (P, P))
        c = cp.rotate(ang, resample=Image.BICUBIC, center=(P + wx * sc, P + wy * sc))
        wx, wy = wx + P / sc, wy + P / sc; cw, ch = c.size
    al = eo3(prog(k, 0.0, 0.12)) * (1 - eio(prog(k, 0.86, 1.0)))
    if al > 0:
        lift = math.sin(math.pi * m)
        ox, oy = x - wx * sc, y - wy * sc          # top-left of the cutout on screen
        sh = Image.new('RGBA', (cw, ch), (0, 0, 0, 0)); sh.putalpha(c.getchannel('A').point(lambda v: int(v * 0.55)))
        sh = sh.filter(ImageFilter.GaussianBlur(10 + 18 * lift))
        img.alpha_composite(Image.new('RGBA', img.size, (0, 0, 0, 0)))
        paste(img, sh, ox + cw / 2 + 10 * U, oy + ch / 2 + (16 + 40 * lift) * U, al * (0.4 + 0.6 * lift))
        if lift > 0.05:
            gl = Image.new('RGBA', (cw, ch), GLOW + (0,)); gl.putalpha(c.getchannel('A').filter(ImageFilter.GaussianBlur(24 * sc + 6)).point(lambda v: int(v * 0.45)))
            paste(img, gl, ox + cw / 2, oy + ch / 2, al * lift)
        paste(img, c, ox + cw / 2, oy + ch / 2, al)
    return img

# ---------------- progress-timer chip ----------------
STEPS = [(C1, 'Product video'), (D1, 'Billboard ads'), (E1, 'UGC videos'), (F1, 'All sizes'), (G1, 'Scheduled')]
def secs(t):
    if t < TSTART: return 0
    return int(3492 * (prog(t, TSTART, HSTOP) ** 1.1))
h13.timer_secs = secs; H5.timer_secs = secs

def done_progress(t):
    """0..5, each step fills over 0.35 s"""
    return sum(eo3(prog(t, ts, ts + 0.35)) for ts, _ in STEPS)

def chip_img(t, sc=1.0, stopped=False):
    s = secs(t); txt = f'{s // 3600:02d}:{(s % 3600) // 60:02d}:{s % 60:02d}'
    fT = F(600 if not stopped else 800, 38 * U * sc); fS = F(600, 24 * U * sc)
    hgt = int(68 * U * sc); r = hgt / 2
    tw = fT.getlength('00:00:00'); n = int(math.floor(done_progress(t) + 1e-6))
    stxt = f'{n}/5'; sw = fS.getlength('5/5')
    w = int(hgt * 0.95 + tw + 26 * U * sc + 2 * U * sc + 22 * U * sc + sw + hgt * 0.45)
    c = Image.new('RGBA', (w, hgt), (0, 0, 0, 0)); d = ImageDraw.Draw(c)
    d.rounded_rectangle([0, 0, w - 1, hgt - 1], int(r), fill=DEEP + (225,), outline=LAV + (115,), width=max(2, int(2 * sc)))
    # clock
    rr = hgt * 0.22; ccx = hgt * 0.5; cy = hgt * 0.47; lw = max(2, int(3 * U * sc))
    d.ellipse([ccx - rr, cy - rr, ccx + rr, cy + rr], outline=(108, 180, 255), width=lw)
    ang = (t * 2.2) if not stopped else 2.2 * HSTOP
    d.line([(ccx, cy), (ccx + rr * 0.68 * math.sin(ang), cy - rr * 0.68 * math.cos(ang))], fill=(152, 72, 254), width=lw)
    d.line([(ccx, cy), (ccx, cy - rr * 0.5)], fill=(108, 180, 255), width=lw)
    # time
    tx = hgt * 0.95
    if stopped:
        m = Image.new('L', c.size, 0); ImageDraw.Draw(m).text((tx, cy), txt, font=fT, fill=255, anchor='lm')
        c.alpha_composite(grad_fill(m))
    else:
        d.text((tx, cy), txt, font=fT, fill='white', anchor='lm')
    # divider + steps
    dx = tx + tw + 26 * U * sc
    d.line([(dx, hgt * 0.28), (dx, hgt * 0.66)], fill=LAV + (90,), width=max(1, int(2 * sc)))
    d.text((dx + 22 * U * sc, cy), stxt, font=fS, fill=LAV + (255,), anchor='lm')
    # progress bar
    bx0, bx1, by = hgt * 0.45, w - hgt * 0.45, hgt - 9 * U * sc; bh = max(2, int(4 * U * sc))
    d.rounded_rectangle([bx0, by, bx1, by + bh], bh, fill=LAV + (40,))
    p = done_progress(t) / 5
    if p > 0.002:
        bw = int((bx1 - bx0) * p); ga = Image.fromarray(grad_arr(max(1, bw), bh + 1, STOPS), 'RGB').convert('RGBA')
        bm = Image.new('L', ga.size, 0); ImageDraw.Draw(bm).rounded_rectangle([0, 0, ga.width - 1, ga.height - 1], bh, fill=255)
        ga.putalpha(bm); c.alpha_composite(ga, (int(bx0), int(by)))
    return c

def toast_img(label, sc=1.0):
    f = F(600, 28 * U * sc); hgt = int(50 * U * sc); w = int(f.getlength(label) + hgt * 1.5)
    c = Image.new('RGBA', (w, hgt), (0, 0, 0, 0)); d = ImageDraw.Draw(c)
    d.rounded_rectangle([0, 0, w - 1, hgt - 1], hgt // 2, fill=(255, 255, 255, 235))
    r = hgt * 0.30; ccx = hgt * 0.52
    m = Image.new('L', c.size, 0); ImageDraw.Draw(m).ellipse([ccx - r, hgt / 2 - r, ccx + r, hgt / 2 + r], fill=255)
    c.alpha_composite(grad_fill(m))
    lw = max(2, int(3 * U * sc))
    d.line([(ccx - r * 0.45, hgt / 2), (ccx - r * 0.1, hgt / 2 + r * 0.35), (ccx + r * 0.5, hgt / 2 - r * 0.35)], fill='white', width=lw, joint='curve')
    d.text((hgt * 1.0, hgt / 2), label, font=f, fill=DEEP, anchor='lm')
    return c

BIRTH = A1 + 0.95; LIFT0, LIFT1 = A1 + 1.45, A1 + 2.0
def corner_center(c):
    return W - 44 * U - c.width / 2, 44 * U + c.height / 2

def chip_layer(img, t):
    """born under the ALFA tagline, flies to the corner, ticks off each finished output"""
    if t < BIRTH or t >= H0: return
    c = chip_img(t)
    bx, by = CX, CY + (345 if WIDE else 330) * U
    kx, ky = corner_center(c)
    q = eo3(prog(t, LIFT0, LIFT1))
    x, y = lerp(bx, kx, q), lerp(by, ky, q)
    sc = lerp(1.3, 1.0, q)
    a = eo3(prog(t, BIRTH, BIRTH + 0.3))
    pulse = 0
    for ts, _ in STEPS:
        pulse = max(pulse, math.sin(math.pi * prog(t, ts, ts + 0.3)) * 0.09)
    paste(img, c, x, y + (1 - a) * 16 * U, a, scale=sc + pulse)
    if t < LIFT1:  # "Campaign started" caption over the chip at birth
        cs, _, _ = two_tone('Campaign started', '', 30 * U, 600)
        al = a * (1 - eio(prog(t, LIFT0 - 0.05, LIFT0 + 0.2)))
        if al > 0: paste(img, cs, x, y - c.height * sc / 2 - 30 * U, al)
    for ts, lab in STEPS:     # toast under the chip for each finished output
        if ts <= t < ts + 1.05 and ts < G1:
            ti = toast_img(lab); p_in = eo3(prog(t, ts + 0.05, ts + 0.3)); p_out = eio(prog(t, ts + 0.85, ts + 1.05))
            al = p_in * (1 - p_out)
            paste(img, ti, kx + c.width / 2 - ti.width / 2, ky + c.height / 2 + 18 * U + ti.height / 2 - (1 - p_in) * 14 * U, al)
h13.chip = lambda img, t, a=1.0: chip_layer(img, t)

# ---------------- timer finale: the same chip flies to the centre and becomes the big timer ----------------
BIG = 3.1 if WIDE else 2.05
def timer_scene(t):
    img = h13.sched_layer(G1, title=False)
    dim = eio(prog(t, H0, H0 + FLY)); darken(img, 0.72 * dim)
    img = Image.blend(img, img.filter(ImageFilter.GaussianBlur(10)), 0.7 * dim)
    q = eio(prog(t, H0, H0 + FLY))
    sc = lerp(1.0, BIG, q)
    stopped = t >= HSTOP
    c = chip_img(t, sc, stopped)
    c0 = chip_img(H0, 1.0); kx, ky = corner_center(c0)
    x, y = lerp(kx, CX, q), lerp(ky, CY + 10 * U, q)
    punch = clamp(1 - (t - HSTOP) / 0.25) * 0.07 if stopped else 0
    if stopped:   # glow behind the stopped timer
        g = Image.new('RGBA', (c.width + 200, c.height + 200), GLOW + (0,)); gm = Image.new('L', g.size, 0)
        ImageDraw.Draw(gm).rounded_rectangle([100, 100, 100 + c.width, 100 + c.height], c.height // 2, fill=int(150 * eo3(prog(t, HSTOP, HSTOP + 0.3))))
        g.putalpha(gm.filter(ImageFilter.GaussianBlur(50))); paste(img, g, x, y, 1)
    paste(img, c, x, y, 1, scale=1 + punch)
    caption(img, 'Full', 'campaign.', 76 * U, t, H0 + FLY - 0.05, x=CX, y=CY - (190 if WIDE else 165) * U)
    caption(img, 'Under', '1 hour.', 96 * U, t, HSTOP + 0.05, x=CX, y=CY + (205 if WIDE else 175) * U)
    return img

# ---------------- render ----------------
def card_watch(t):
    """watch position inside the lifted photo card at the end of the ALFA beat"""
    ph = H8.photo_crop()
    hh = (H8.PHOTO_BOX[3] - H8.PHOTO_BOX[1]) * (1 if WIDE else H / 1080) * 1.1 * 1.18
    ww = hh * ph.width / ph.height
    return (CX + (0.457 - 0.5) * ww, CY + (0.423 - 0.5) * hh, 0.354 * ww)

def label(img, w1, w2, t, t_in, t_out): h13.label(img, w1, w2, t, t_in, t_out)

def render(t):
    if t < A1: return h10.render_(t)
    if t < A2: return h13.alfa_beat(t)
    if t < C0:   # photo card watch -> product video watch
        A = h13.alfa_beat(A2 - 1e-3)
        img = match(t, A2, C0, A, ad_frame(t), card_watch(t), WP['ad0'])
    elif t < C1:
        img = ad_frame(t); label(img, 'Product', 'Video', t, C0 + 0.05, C1)
    elif t < D0:
        img = match(t, C1, D0, ad_frame(t), bb_frame(t), WP['ad1'], WP['bb0'])
    elif t < D1:
        img = bb_frame(t); label(img, 'Billboard', 'Ads', t, D0 + 0.03, D1)
    elif t < E0:
        img = match(t, D1, E0, bb_frame(t), ugc_frame(t), WP['bb1'], WP['ugc0'])
    elif t < E1:
        img = ugc_frame(t); label(img, 'UGC', 'Videos', t, E0 + 0.03, E1)
    elif t < F0:
        p = eio(prog(t, E1, F0))
        img = h13.size_layer(F0 - 0.001, center_done=False)
        x, y, w, hh = h13.size_rects()[1]
        paste(img, h13.ccard(ugc_frame(t), lerp(W, w, p), lerp(H, hh, p), lerp(0, 18, p), shadow=p > 0.02, glow=0.35 * p), lerp(CX, x, p), lerp(CY, y, p), 1)
    elif t < F1:
        img = h13.size_layer(t)
    elif t < G0:
        p = prog(t, F1, G0)
        img = h10.push_out(h13.size_layer(F1), p, H2.BG.copy())
        nxt = h13.sched_layer(G0); s = lerp(0.94, 1, eo3(p))
        paste(img, nxt.resize((int(W * s), int(H * s)), Image.BILINEAR), CX, CY, eo3(prog(p, 0.25, 1)))
    elif t < G1:
        img = h13.sched_layer(t)
    elif t < H1:
        return timer_scene(t)
    elif t < I0:
        return Image.blend(timer_scene(t), h13.end_layer(t), eio(prog(t, H1, I0)))
    else:
        img = h13.end_layer(t); fo = eio(prog(t, DUR - 0.3, DUR))
        if fo > 0: H5.darken(img, fo)
        return img
    chip_layer(img, t)
    return img

if __name__ == '__main__':
    FMT, MODE = sys.argv[1], sys.argv[2]
    if MODE == 'frames':
        for ts in sys.argv[3].split(','):
            render(float(ts)).convert('RGB').save(f'/home/claude/alfa/build/h14_{FMT}_{ts}.jpg', quality=88)
    elif MODE == 'times':
        print({k: round(v, 3) for k, v in dict(A1=A1, A2=A2, C0=C0, C1=C1, D0=D0, D1=D1, E0=E0, E1=E1, F0=F0, F1=F1, G0=G0, G1=G1, HSTOP=HSTOP, H1=H1, I0=I0).items()})
    else:
        out = sys.argv[3]; tmp = out.replace('.mp4', '.tmp.mp4')
        t0 = float(sys.argv[4]) if len(sys.argv) > 4 else 0.0; t1 = float(sys.argv[5]) if len(sys.argv) > 5 else DUR
        p = subprocess.Popen(['ffmpeg', '-v', 'error', '-y', '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-s', f'{W}x{H}', '-r', str(FPS), '-i', '-',
                              '-c:v', 'libx264', '-crf', '14', '-preset', 'veryfast', '-pix_fmt', 'yuv420p', tmp], stdin=subprocess.PIPE)
        for k in range(int(round(t0 * FPS)), int(round(t1 * FPS))):
            p.stdin.write(render(k / FPS).convert('RGB').tobytes())
        p.stdin.close()
        if p.wait() == 0: os.replace(tmp, out); print('done', out)
