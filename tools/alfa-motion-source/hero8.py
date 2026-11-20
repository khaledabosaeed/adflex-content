#!/usr/bin/env python3
# ALFA hero v8 — full 20 s. Front view through a glass door: she sprints, slams into the glass, papers (each a campaign
# piece) explode; she slides down; the brief sheet slaps the glass. ALFA is written, lifts the product photo, and the
# product turns into video -> billboard -> UGC -> any size -> scheduled, with strong transitions. Done under 1 hour.
#   python3 hero8.py wide|tall frames t1,t2  |  python3 hero8.py wide|tall render out.mp4
import sys, os, math, subprocess
import hero5 as H5
H2 = H5.H2
from hero2 import W, H, CX, CY, U, WIDE, clamp, prog, eo3, eo5, ei3, eio, lerp, paste, word_img, font, two_words, kinetic_word
import numpy as np
from PIL import Image, ImageDraw, ImageFilter

FMT, MODE = sys.argv[1], sys.argv[2]
FPS, DUR = 30, 20.0
for k in ('gA', 'gB'):
    H5.NFR[k] = len(os.listdir(H5.R + f'clips/{k}'))
H5.TALL_FX.update({'gA': 0.5, 'gB': 0.45})
F = H5.frame
FF = H5.fit_frame

def timer_secs(t):
    if t < 4.7: return 0
    return int(3492 * (prog(t, 4.7, 17.6) ** 1.1))
H5.timer_secs = timer_secs

def vign(img):
    img.alpha_composite(H5.vign()); return img

# ---------- transitions ----------
def zoom_blur(img, amount, n=5):
    if amount < 0.01: return img
    acc = np.zeros((H, W, 4), np.float32)
    for i in range(n):
        s = 1 + amount * i / (n - 1)
        im = img.resize((int(W * s), int(H * s)), Image.BILINEAR)
        x = (im.width - W) // 2; y = (im.height - H) // 2
        acc += np.asarray(im.crop((x, y, x + W, y + H)), np.float32)
    return Image.fromarray((acc / n).astype(np.uint8), 'RGBA')

def whip(img, dx, n=8):
    """horizontal motion blur + offset"""
    a = np.asarray(img, np.float32)
    acc = np.zeros_like(a)
    for i in range(n):
        acc += np.roll(a, int(dx * i / n), axis=1)
    return Image.fromarray((acc / n).astype(np.uint8), 'RGBA')

def scaled_into(src, dst, s, cx, cy):
    """place src scaled by s centered at (cx, cy) over dst"""
    im = src.resize((max(2, int(W * s)), max(2, int(H * s))), Image.BILINEAR)
    out = dst.copy()
    out.alpha_composite(im, (int(cx - im.width / 2), int(cy - im.height / 2))) if (cx - im.width / 2 >= 0 and cy - im.height / 2 >= 0 and cx + im.width / 2 <= W and cy + im.height / 2 <= H) else paste(out, im, cx, cy)
    return out

def flash(img, a):
    if a > 0: img.alpha_composite(Image.new('RGBA', img.size, (255, 255, 255, int(255 * clamp(a)))))
    return img

# ---------- ALFA write-on ----------
ALFA_IMG = word_img('ALFA', 'Poppins800i.ttf', 330 * U, 'purple')
def write_on(img, p, cx, cy, alpha=1.0):
    if p <= 0 or alpha <= 0: return
    a = ALFA_IMG; w, h = a.size; edge = int(w * p)
    m = np.zeros((h, w), np.uint8); m[:, :max(0, edge - 30)] = 255
    for k in range(30):
        x = edge - 30 + k
        if 0 <= x < w: m[:, x] = int(255 * (1 - k / 30))
    out = a.copy(); out.putalpha(Image.fromarray(np.minimum(np.array(a.getchannel('A')), m)))
    paste(img, out, cx, cy, alpha)
    if p < 0.99:
        tip = Image.new('RGBA', (90, 90), (0, 0, 0, 0)); ImageDraw.Draw(tip).ellipse([0, 0, 89, 89], fill=(230, 210, 255, 255))
        paste(img, tip.filter(ImageFilter.GaussianBlur(18)), cx - w / 2 + edge, cy + math.sin(p * 18) * h * 0.18, 0.9 * alpha)

def pill(img, text, cx, cy, a):
    if a <= 0: return
    f = H2.FUI6(26 * U); tw = f.getlength(text)
    p = Image.new('RGBA', (int(tw + 48 * U), int(48 * U)), (0, 0, 0, 0))
    ImageDraw.Draw(p).rounded_rectangle([0, 0, p.width - 1, p.height - 1], p.height // 2, fill=H2.PURP + (255,))
    ImageDraw.Draw(p).text((p.width / 2, p.height / 2), text, font=f, fill='white', anchor='mm')
    paste(img, p, cx, cy, a)

# product photo region on the slapped sheet (last frame of gB), in 1920x1080 source coords
PHOTO_BOX = (540, 52, 1220, 656)
LAST_B = None
def last_b():
    global LAST_B
    if LAST_B is None:
        LAST_B = F('gB', 99)
    return LAST_B
def photo_crop():
    return last_b().crop(PHOTO_BOX)
def photo_center_screen():
    x = (PHOTO_BOX[0] + PHOTO_BOX[2]) / 2; y = (PHOTO_BOX[1] + PHOTO_BOX[3]) / 2
    if WIDE: return x, y
    s = H / 1080; full_w = 1920 * s
    off = clamp(H5.TALL_FX['gB'] * full_w - W / 2, 0, full_w - W)
    return x * s - off, y * s

def ad_frame(t, t0):
    img = FF(F('ad', 0.2 + (t - t0) * 1.5), 'ad', zoom=lerp(1.0, 1.06, prog(t, t0, t0 + 2.2)))
    return H5.grade_bottom(img)
def bb_frame(t, t0):
    return H5.grade_bottom(FF(F('bb', 0.1 + (t - t0) * 1.3), 'bb'))
def ugc_frame(t, t0):
    return H5.grade_bottom(FF(F('ugc', 0.2 + (t - t0) * 1.2), 'ugc'))

def render(t):
    # 1. sprint at the glass door -> slam (0 - 3.0)
    if t < 2.0:
        sh = 9 * max(0, 1 - abs(t - 1.5) / 0.25)
        return vign(FF(F('gA', t * 0.95), 'gA', zoom=1.02 + 0.03 * clamp(1 - abs(t - 1.5) / 0.25), t=t, shake=sh + 1))
    # 2. she slides down; the brief sheet slaps the glass (3.0 - 5.0)
    if t < 4.4:
        ct = 0.3 + (t - 2.0) * 1.6
        hit = clamp(1 - abs(t - 3.85) / 0.12)
        return vign(FF(F('gB', ct), 'gB', zoom=1.02 + 0.03 * hit, t=t, shake=8 * hit + 1))
    # 3. ALFA is written on the screen, then lifts the product photo (5.0 - 6.4)
    if t < 5.9:
        img = FF(last_b(), 'gB', zoom=lerp(1.02, 1.06, prog(t, 4.4, 5.9)))
        dim = eio(prog(t, 4.45, 4.75))
        img = Image.blend(img, img.filter(ImageFilter.GaussianBlur(5)), 0.5 * dim)
        img.alpha_composite(Image.new('RGBA', img.size, (12, 6, 26, int(140 * dim))))
        vign(img)
        out = eio(prog(t, 5.45, 5.65))
        write_on(img, eo3(prog(t, 4.55, 5.15)), CX, CY + 40 * U, 1 - out)
        pill(img, 'YOUR AI MARKETING AGENT', CX, CY - 160 * U, eo3(prog(t, 5.1, 5.35)) * (1 - out))
        # ALFA lifts the photo off the sheet
        lp = eo3(prog(t, 5.5, 5.9))
        if lp > 0:
            ph = photo_crop()
            cx, cy = photo_center_screen()
            base_h = (PHOTO_BOX[3] - PHOTO_BOX[1]) * (1 if WIDE else H / 1080)
            hh = base_h * lerp(1.0, 1.18, lp)
            c = H2.card(ph, hh * ph.width / ph.height, hh, glow=0.9 * lp)
            paste(img, c, lerp(cx, CX, lp), lerp(cy, CY, lp), 1)
        H5.timer_chip(img, t, eo3(prog(t, 4.7, 4.9)))
        return img
    # 4. zoom-through into the product video (6.4 - 7.0)
    if t < 6.5:
        p = prog(t, 5.9, 6.5)
        bg = H2.BG.copy()
        ph = photo_crop()
        hh = (PHOTO_BOX[3] - PHOTO_BOX[1]) * (1 if WIDE else H / 1080) * 1.18 * lerp(1, 3.2, ei3(p))
        paste(bg, H2.card(ph, hh * ph.width / ph.height, hh), CX, CY, 1 - eo3(prog(p, 0.45, 1.0)))
        ad = ad_frame(t, 5.9)
        ad.putalpha(int(255 * eo3(prog(p, 0.45, 1.0))))
        bg.alpha_composite(ad)
        img = zoom_blur(bg, 0.1 * math.sin(p * math.pi), n=4)
        H5.timer_chip(img, t)
        return flash(img, 0.45 * clamp(1 - abs(p - 0.5) / 0.08))
    # 5. product video (7.0 - 9.2)
    if t < 9.2:
        img = ad_frame(t, 5.9)
        H5.label(img, 'Product', 'Video', t, 6.55)
        H5.timer_chip(img, t)
        return img
    # 6. zoom-out: the ad lands on the billboard (9.2 - 9.6)
    if t < 9.6:
        p = eio(prog(t, 9.2, 9.6))
        bb = bb_frame(t, 9.2)
        ad = ad_frame(t, 5.9)
        tx, ty, tw = (1060, 390, 1240) if WIDE else (W * 0.45, H * 0.36, W * 0.95)
        s = lerp(1.0, tw / W, p)
        img = bb.copy()
        im = ad.resize((int(W * s), int(H * s)), Image.BILINEAR)
        im.putalpha(int(255 * (1 - eo3(prog(p, 0.6, 1.0)))))
        paste(img, im, lerp(CX, tx, p), lerp(CY, ty, p), 1)
        img = zoom_blur(img, 0.12 * math.sin(p * math.pi))
        H5.timer_chip(img, t)
        return img
    # 7. billboard (9.6 - 11.6)
    if t < 11.6:
        img = bb_frame(t, 9.2)
        H5.label(img, 'Billboard', 'Ads', t, 9.7)
        H5.timer_chip(img, t)
        return img
    # 8. whip pan into UGC (11.6 - 11.9)
    if t < 11.9:
        p = prog(t, 11.6, 11.9)
        a = bb_frame(t, 9.2) if p < 0.5 else ugc_frame(t, 11.6)
        off = (-W * 0.6 * ei3(p * 2)) if p < 0.5 else (W * 0.6 * (1 - eo3((p - 0.5) * 2)))
        a = Image.fromarray(np.roll(np.asarray(a), int(off), axis=1), 'RGBA')
        img = whip(a, 160 * math.sin(p * math.pi))
        H5.timer_chip(img, t)
        return img
    # 9. UGC (11.9 - 13.9)
    if t < 13.9:
        img = ugc_frame(t, 11.6)
        H5.label(img, 'UGC', 'Videos', t, 12.0)
        H5.timer_chip(img, t)
        return img
    # 10. shrink into a card -> any size (13.9 - 16.0)
    if t < 14.25:
        p = eio(prog(t, 13.9, 14.25))
        img = H2.BG.copy()
        u = ugc_frame(t, 11.6)
        s = lerp(1.0, 0.42, p)
        paste(img, H2.card(u, W * s, H * s, glow=0.6 * p), CX, CY, 1)
        H5.timer_chip(img, t)
        return flash(img, 0.35 * clamp(1 - abs(p - 0.95) / 0.1))
    if t < 16.0:
        img = H2.BG.copy()
        L = Image.new('RGBA', (W, H), (0, 0, 0, 0))
        H2.s_size(L, 12.3 + (t - 14.25) * (2.2 / 1.75))
        img.alpha_composite(L)
        H5.timer_chip(img, t)
        return img
    # 11. scheduled (16.0 - 17.6)
    if t < 17.6:
        img = H2.BG.copy()
        H5.calendar(img, (t - 16.0) * 1.6 + 14.55, 14.55)
        two_words(img, 'Auto', 'Scheduled.', 120 * U, CX, (CY - 360 if WIDE else CY - 420), prog(t, 16.05, 16.45), prog(t, 16.13, 16.53))
        H5.timer_chip(img, t)
        return img
    # 12. done under 1 hour (17.6 - 18.9)
    if t < 18.9:
        img = H2.BG.copy()
        H5.calendar(img, 14.55 + 3.0, 14.55)
        dim = eio(prog(t, 17.6, 17.85))
        H5.darken(img, 0.6 * dim)
        chip = H5.timer_chip(img, 17.6, big=True, glow=True)
        paste(img, chip, CX, CY - (90 if WIDE else 140) * U, dim, scale=lerp(0.8, 1, dim))
        if WIDE:
            two_words(img, 'Full campaign.', 'Under 1 hour.', 110 * U, CX, CY + 60 * U, prog(t, 17.75, 18.15), prog(t, 17.85, 18.25))
        else:
            kinetic_word(img, 'Full campaign.', 'Poppins700i.ttf', 120 * U, 'white', CX, CY + 20, prog(t, 17.75, 18.15))
            kinetic_word(img, 'Under 1 hour.', 'Poppins700i.ttf', 120 * U, 'purple', CX, CY + 140, prog(t, 17.85, 18.25))
        fo = eio(prog(t, 18.65, 18.9))
        if fo > 0: H5.darken(img, fo)
        return img
    # 13. ALFA end card -> black
    img = H2.BG.copy()
    L = Image.new('RGBA', (W, H), (0, 0, 0, 0))
    H2.s_outro(L, 18.6 + (t - 18.9) * (1.4 / 1.1))
    img.alpha_composite(L)
    return img

if __name__ == '__main__':
    if MODE == 'frames':
        for ts in sys.argv[3].split(','):
            render(float(ts)).convert('RGB').save(f'/home/claude/alfa/build/h8_{FMT}_{ts}.jpg', quality=88)
    else:
        out = sys.argv[3]; tmp = out.replace('.mp4', '.tmp.mp4')
        p = subprocess.Popen(['ffmpeg', '-v', 'error', '-y', '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-s', f'{W}x{H}', '-r', str(FPS), '-i', '-',
                              '-c:v', 'libx264', '-crf', '14', '-preset', 'veryfast', '-pix_fmt', 'yuv420p', tmp], stdin=subprocess.PIPE)
        for k in range(int(DUR * FPS)):
            p.stdin.write(render(k / FPS).convert('RGB').tobytes())
            if k % 100 == 0: print(k, flush=True)
        p.stdin.close()
        if p.wait() == 0: os.replace(tmp, out); print('done', out)
