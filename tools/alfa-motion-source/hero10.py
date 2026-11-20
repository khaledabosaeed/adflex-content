#!/usr/bin/env python3
# ALFA hero v10 — 20 s. Opener at real speed (gC1). One consistent transition system:
# every scene enters by settling in, every label leaves before its transition, and each hand-off is a single
# 0.3-0.45 s move (zoom-through, zoom-out, whip, shrink, push). Ends on ALFA + "by AdFlex" logo.
#   python3 hero10.py wide|tall frames t1,t2  |  python3 hero10.py wide|tall render out.mp4
import sys, os, math, subprocess
import hero8 as H8
H5, H2 = H8.H5, H8.H2
from hero2 import W, H, CX, CY, U, WIDE, clamp, prog, eo3, eo5, ei3, eio, lerp, paste, two_words, kinetic_word
import numpy as np
from PIL import Image, ImageFilter

FPS, DUR = 30, 20.0
H5.NFR['gC1'] = len(os.listdir(H5.R + 'clips/gC1'))
T_OPEN = H5.NFR['gC1'] / 30.0                      # 4.77
H5.TALL_FX.update({'gC1': 0.49, 'gB': 0.474})
H8.LAST_B = H5.frame('gC1', 99)
H8.PHOTO_BOX = (575, 75, 1210, 630)
IMPACT, SLAP = 1.75, 4.50

# ---------------- schedule ----------------
A1 = T_OPEN          # ALFA write-on
A2 = A1 + 1.40       # zoom-through -> product video
C0 = A2 + 0.45       # product video
C1 = C0 + 2.00
D0 = C1 + 0.40       # billboard (after zoom-out)
D1 = D0 + 1.80
E0 = D1 + 0.30       # UGC (after whip)
E1 = E0 + 1.80
F0 = E1 + 0.35       # any size (after shrink)
F1 = F0 + 1.55
G0 = F1 + 0.30       # scheduled (after push)
G1 = G0 + 1.45
H0 = G1              # timer / under 1 hour
H1 = H0 + 1.30
I0 = H1 + 0.30       # end card (after push)
TIMER_START, TIMER_END = A1 + 0.2, G1

def timer_secs(t):
    if t < TIMER_START: return 0
    return int(3492 * (prog(t, TIMER_START, TIMER_END) ** 1.1))
H5.timer_secs = timer_secs

LOGO = Image.open('/home/claude/alfa/build/adflex_logo.png')

# ---------------- helpers ----------------
def ad_frame(t): return H5.grade_bottom(H5.fit_frame(H5.frame('ad', 0.2 + (t - A2) * 1.5), 'ad', zoom=lerp(1.0, 1.06, prog(t, C0, C1))))
def bb_frame(t): return H5.grade_bottom(H5.fit_frame(H5.frame('bb', 0.1 + (t - C1) * 1.3), 'bb'))
def ugc_frame(t): return H5.grade_bottom(H5.fit_frame(H5.frame('ugc', 0.2 + (t - D1) * 1.2), 'ugc'))

def label(img, w1, w2, t, t_in, t_out):
    """label animates in at t_in and fades/slides away just before t_out (before the transition starts)"""
    if t < t_in: return
    L = Image.new('RGBA', (W, H), (0, 0, 0, 0))
    H5.label(L, w1, w2, t, t_in)
    o = eio(prog(t, t_out - 0.22, t_out))
    if o > 0:
        L.putalpha(L.getchannel('A').point(lambda v: int(v * (1 - o))))
        L = Image.fromarray(np.roll(np.asarray(L), int(-28 * o), axis=0), 'RGBA')
    img.alpha_composite(L)

def settle(layer, t, t0, d=0.3, bg=None):
    """scene entry: scale 0.94 -> 1 + fade in over the background"""
    x = prog(t, t0, t0 + d)
    if x >= 1: return layer
    out = (bg or H2.BG).copy()
    s = lerp(0.94, 1, eo3(x))
    paste(out, layer.resize((int(W * s), int(H * s)), Image.BILINEAR), CX, CY, eo3(x))
    return out

def push_out(layer, x, bg):
    """scene exit: scale up + blur + fade"""
    s = 1 + 0.14 * ei3(x)
    L = layer.resize((int(W * s), int(H * s)), Image.BILINEAR)
    if x > 0.05: L = L.filter(ImageFilter.GaussianBlur(x * 12))
    paste(bg, L, CX, CY, 1 - eo3(x))
    return bg

def size_layer(t):
    L = H2.BG.copy()
    S = Image.new('RGBA', (W, H), (0, 0, 0, 0))
    H2.s_size(S, 12.3 + (t - F0) * (2.2 / (F1 - F0)))
    L.alpha_composite(S)
    return L

def sched_layer(t, words_at=None):
    L = H2.BG.copy()
    H5.calendar(L, min(14.55 + 3.0, (t - G0) * 2.0 + 14.55), 14.55)
    ta = G0 + 0.05
    two_words(L, 'Auto', 'Scheduled.', 120 * U, CX, (CY - 360 if WIDE else CY - 420), prog(t, ta, ta + 0.4), prog(t, ta + 0.08, ta + 0.48))
    return L

def end_layer(t):
    L = H2.BG.copy()
    p = prog(t, I0, I0 + 0.6)
    kinetic_word(L, 'ALFA', 'Poppins800i.ttf', 300 * U, 'purple', CX, CY - 70 * U, p, seed=5, mode='rise')
    a = eo3(prog(t, I0 + 0.45, I0 + 0.85))
    if a > 0:
        lw = 460 * U; lg = LOGO.resize((int(lw), int(lw * LOGO.height / LOGO.width)), Image.LANCZOS)
        by = H2.word_img('by', 'Poppins700i.ttf', 64 * U, 'white')
        gap = 26 * U
        tot = (by.width if by else 0) + gap + lg.width
        y = CY + 165 * U + (1 - a) * 24 * U
        if by: paste(L, by, CX - tot / 2 + by.width / 2, y + 4 * U, a * 0.85)
        paste(L, lg, CX + tot / 2 - lg.width / 2, y, a)
    return L

MARK = None
def mark(img, t):
    global MARK
    if MARK is None:
        w = int(170 * U); MARK = LOGO.resize((w, int(w * LOGO.height / LOGO.width)), Image.LANCZOS)
    a = eo3(prog(t, A1 + 0.2, A1 + 0.5)) * (1 - eio(prog(t, H1, I0)))
    if a > 0: paste(img, MARK, 36 * U + MARK.width / 2, 34 * U + MARK.height / 2, 0.92 * a)
    return img

# ---------------- render ----------------
def render(t):
    img = render_(t)
    return mark(img, t) if t >= A1 else img

def render_(t):
    # 1. opener, real speed: far sprint -> one slam -> she drops out -> papers -> brief slaps the glass
    if t < A1:
        hit = clamp(1 - abs(t - IMPACT) / 0.14); slap = clamp(1 - abs(t - SLAP) / 0.12)
        zoom = 1.02 + 0.03 * eo3(prog(t, 0, IMPACT)) + 0.05 * hit + 0.06 * slap + 0.02 * prog(t, SLAP, A1)
        img = H8.vign(H5.fit_frame(H5.frame('gC1', t), 'gC1', zoom=zoom, t=t, shake=1 + 14 * hit + 10 * slap))
        return H8.flash(img, 0.18 * clamp(1 - abs(t - IMPACT) / 0.05) + 0.22 * clamp(1 - abs(t - SLAP) / 0.05))
    # 2. ALFA is written over the sheet, then lifts the product photo
    if t < A2:
        img = H5.fit_frame(H8.last_b(), 'gB', zoom=lerp(1.08, 1.12, prog(t, A1, A2)))
        dim = eio(prog(t, A1, A1 + 0.25))
        img = Image.blend(img, img.filter(ImageFilter.GaussianBlur(22)), 0.9 * dim)
        img.alpha_composite(Image.new('RGBA', img.size, (12, 6, 26, int(205 * dim))))
        H8.vign(img)
        out = eio(prog(t, A1 + 0.95, A1 + 1.15))
        H8.write_on(img, eo3(prog(t, A1 + 0.1, A1 + 0.65)), CX, CY + 40 * U, 1 - out)
        H8.pill(img, 'YOUR AI MARKETING AGENT', CX, CY - 160 * U, eo3(prog(t, A1 + 0.6, A1 + 0.85)) * (1 - out))
        lp = eo3(prog(t, A1 + 1.0, A2))
        if lp > 0:
            ph = H8.photo_crop(); cx, cy = H8.photo_center_screen()
            base_h = (H8.PHOTO_BOX[3] - H8.PHOTO_BOX[1]) * (1 if WIDE else H / 1080) * 1.1
            hh = base_h * lerp(1.0, 1.18, lp)
            paste(img, H2.card(ph, hh * ph.width / ph.height, hh, glow=0.9 * lp), lerp(cx, CX, lp), lerp(cy, CY, lp), 1)
        H5.timer_chip(img, t, eo3(prog(t, A1 + 0.2, A1 + 0.4)))
        return img
    # T1. zoom-through the photo into the product video
    if t < C0:
        p = prog(t, A2, C0)
        bg = H2.BG.copy(); ph = H8.photo_crop()
        hh = (H8.PHOTO_BOX[3] - H8.PHOTO_BOX[1]) * (1 if WIDE else H / 1080) * 1.1 * 1.18 * lerp(1, 3.2, ei3(p))
        paste(bg, H2.card(ph, hh * ph.width / ph.height, hh), CX, CY, 1 - eo3(prog(p, 0.45, 1.0)))
        ad = ad_frame(t); ad.putalpha(int(255 * eo3(prog(p, 0.45, 1.0)))); bg.alpha_composite(ad)
        img = H8.zoom_blur(bg, 0.1 * math.sin(p * math.pi), n=4)
        H5.timer_chip(img, t)
        return H8.flash(img, 0.22 * clamp(1 - abs(p - 0.5) / 0.06))
    # 3. product video
    if t < C1:
        img = ad_frame(t); label(img, 'Product', 'Video', t, C0 + 0.1, C1); H5.timer_chip(img, t); return img
    # T2. zoom-out: the ad lands on the billboard
    if t < D0:
        p = eio(prog(t, C1, D0))
        img = bb_frame(t); ad = ad_frame(t)
        tx, ty, tw = (1060, 390, 1240) if WIDE else (W * 0.45, H * 0.36, W * 0.95)
        s = lerp(1.0, tw / W, p)
        im = ad.resize((int(W * s), int(H * s)), Image.BILINEAR); im.putalpha(int(255 * (1 - eo3(prog(p, 0.6, 1.0)))))
        paste(img, im, lerp(CX, tx, p), lerp(CY, ty, p), 1)
        img = H8.zoom_blur(img, 0.12 * math.sin(p * math.pi)); H5.timer_chip(img, t); return img
    # 4. billboard
    if t < D1:
        img = bb_frame(t); label(img, 'Billboard', 'Ads', t, D0 + 0.05, D1); H5.timer_chip(img, t); return img
    # T3. whip pan into UGC
    if t < E0:
        p = prog(t, D1, E0)
        a = bb_frame(t) if p < 0.5 else ugc_frame(t)
        off = (-W * 0.6 * ei3(p * 2)) if p < 0.5 else (W * 0.6 * (1 - eo3((p - 0.5) * 2)))
        a = Image.fromarray(np.roll(np.asarray(a), int(off), axis=1), 'RGBA')
        img = H8.whip(a, 160 * math.sin(p * math.pi)); H5.timer_chip(img, t); return img
    # 5. UGC
    if t < E1:
        img = ugc_frame(t); label(img, 'UGC', 'Videos', t, E0 + 0.05, E1); H5.timer_chip(img, t); return img
    # T4. UGC shrinks into a card -> any size
    if t < F0:
        p = eio(prog(t, E1, F0))
        img = H2.BG.copy(); u = ugc_frame(t); s = lerp(1.0, 0.42, p)
        paste(img, H2.card(u, W * s, H * s, glow=0.6 * p), CX, CY, 1)
        H5.timer_chip(img, t); return H8.flash(img, 0.3 * clamp(1 - abs(p - 0.95) / 0.1))
    # 6. any size
    if t < F1:
        img = size_layer(t); H5.timer_chip(img, t); return img
    # T5. push: any size -> scheduled
    if t < G0:
        p = prog(t, F1, G0)
        img = push_out(size_layer(F1), p, H2.BG.copy())
        nxt = sched_layer(G0 + 0.0001)
        s = lerp(0.94, 1, eo3(p)); paste(img, nxt.resize((int(W * s), int(H * s)), Image.BILINEAR), CX, CY, eo3(prog(p, 0.3, 1)))
        H5.timer_chip(img, t); return img
    # 7. scheduled
    if t < G1:
        img = sched_layer(t); H5.timer_chip(img, t); return img
    # 8. timer stops: full campaign, under 1 hour
    if t < I0:
        img = sched_layer(G1)
        dim = eio(prog(t, H0, H0 + 0.25)); H5.darken(img, 0.6 * dim)
        chip = H5.timer_chip(img, G1, big=True, glow=True)
        paste(img, chip, CX, CY - (90 if WIDE else 140) * U, dim, scale=lerp(0.8, 1, dim))
        if WIDE:
            two_words(img, 'Full campaign.', 'Under 1 hour.', 110 * U, CX, CY + 60 * U, prog(t, H0 + 0.15, H0 + 0.55), prog(t, H0 + 0.25, H0 + 0.65))
        else:
            kinetic_word(img, 'Full campaign.', 'Poppins700i.ttf', 120 * U, 'white', CX, CY + 20, prog(t, H0 + 0.15, H0 + 0.55))
            kinetic_word(img, 'Under 1 hour.', 'Poppins700i.ttf', 120 * U, 'purple', CX, CY + 140, prog(t, H0 + 0.25, H0 + 0.65))
        if t >= H1:  # T6. push into the end card
            p = prog(t, H1, I0)
            out = push_out(img, p, H2.BG.copy())
            nxt = end_layer(I0 + 0.0001)
            return out
        return img
    # 9. end card: ALFA by AdFlex, short fade to black at the very end
    img = settle(end_layer(t), t, I0, 0.3)
    fo = eio(prog(t, DUR - 0.3, DUR))
    if fo > 0: H5.darken(img, fo)
    return img

if __name__ == '__main__':
    FMT, MODE = sys.argv[1], sys.argv[2]
    if MODE == 'frames':
        for ts in sys.argv[3].split(','):
            render(float(ts)).convert('RGB').save(f'/home/claude/alfa/build/h10_{FMT}_{ts}.jpg', quality=88)
    else:
        out = sys.argv[3]; tmp = out.replace('.mp4', '.tmp.mp4')
        p = subprocess.Popen(['ffmpeg', '-v', 'error', '-y', '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-s', f'{W}x{H}', '-r', str(FPS), '-i', '-',
                              '-c:v', 'libx264', '-crf', '14', '-preset', 'veryfast', '-pix_fmt', 'yuv420p', tmp], stdin=subprocess.PIPE)
        for k in range(int(round(DUR * FPS))):
            p.stdin.write(render(k / FPS).convert('RGB').tobytes())
            if k % 100 == 0: print(k, flush=True)
        p.stdin.close()
        if p.wait() == 0: os.replace(tmp, out); print('done', out)
