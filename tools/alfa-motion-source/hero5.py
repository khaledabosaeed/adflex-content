#!/usr/bin/env python3
# ALFA hero v5 — girl runs, hits the door, papers fly; one paper (ORRA watch, "FULL CAMPAIGN. 1 HOUR.")
# lands in the ALFA chat; the product becomes video -> ads -> UGC -> any size -> scheduled; done under 1 hour.
#   python3 hero5.py wide|tall frames t1,t2   |   python3 hero5.py wide|tall render out.mp4
import sys, os, math, random, subprocess
FMT, MODE = sys.argv[1], sys.argv[2]
import hero2 as H2
from hero2 import (W, H, CX, CY, U, WIDE, clamp, prog, eo3, eo5, ei3, eio, eback, lerp,
                   paste, kinetic_word, two_words, word_img, font, rr_mask)
import numpy as np
from PIL import Image, ImageDraw, ImageFilter, ImageOps, ImageEnhance

R = '/home/claude/alfa/v5/'
FPS, DUR = 30, 20.0
NFR = {k: len(os.listdir(R + f'clips/{k}')) for k in ('run', 'ad', 'bb', 'ugc')}
def frame(k, ct):
    i = int(clamp(ct * 30, 0, NFR[k] - 1))
    return Image.open(R + f'clips/{k}/{i + 1:03d}.jpg').convert('RGB')

# swap hero2's serum ad for the watch ad (used by the Any Size scene)
def _load_ad():
    raw = subprocess.run(['ffmpeg', '-v', 'error', '-i', R + 'clips/ad.mp4', '-vf', 'scale=1280:720', '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-'],
                         capture_output=True, check=True).stdout
    return np.frombuffer(raw, np.uint8).reshape(-1, 720, 1280, 3)
H2.AD = _load_ad(); H2.UGC = None

WATCH = Image.open(R + 'kf/watch.jpg').convert('RGB')

TALL_FX = {'run': 0.55, 'ad': 0.47, 'bb': 0.52, 'ugc': 0.6}
def fit_frame(img, key, zoom=1.0, t=0.0, shake=0.0):
    if zoom != 1.0 or shake:
        w, h = int(1920 / zoom), int(1080 / zoom)
        dx = math.sin(t * 37) * shake; dy = math.cos(t * 29) * shake
        x0 = int((1920 - w) / 2 + dx); y0 = int((1080 - h) / 2 + dy)
        img = img.crop((x0, y0, x0 + w, y0 + h)).resize((1920, 1080), Image.BILINEAR)
    if WIDE:
        return img.convert('RGBA')
    s = H / 1080
    img = img.resize((int(1920 * s), H), Image.BILINEAR)
    x = int(clamp(TALL_FX.get(key, 0.5) * img.width - W / 2, 0, img.width - W))
    return img.crop((x, 0, x + W, H)).convert('RGBA')

VIGN = None
def vign():
    global VIGN
    if VIGN is None:
        yy, xx = np.mgrid[0:H, 0:W].astype(np.float32)
        d = np.sqrt(((xx - W / 2) / (W / 2)) ** 2 + ((yy - H / 2) / (H / 2)) ** 2)
        VIGN = Image.new('RGBA', (W, H), (0, 0, 0, 0)); VIGN.putalpha(Image.fromarray((np.clip(d - 0.55, 0, 1) ** 1.5 * 200).astype(np.uint8)))
    return VIGN

def darken(img, a):
    if a > 0: img.alpha_composite(Image.new('RGBA', img.size, (6, 4, 12, int(255 * a))))
    return img

# ---------- the hero paper ----------
def hero_paper(w):
    w = int(w); h = int(w * 1.3)
    img = Image.new('RGBA', (w, h), (247, 245, 241, 255))
    d = ImageDraw.Draw(img)
    pad = int(w * 0.08)
    ph = ImageOps.fit(WATCH, (w - 2 * pad, int(h * 0.62)), Image.BILINEAR)
    img.paste(ph, (pad, pad))
    f = font('Poppins800i.ttf', w * 0.115)
    d.text((pad, pad + ph.height + w * 0.05), 'FULL CAMPAIGN.', font=f, fill=(18, 16, 24))
    d.text((pad, pad + ph.height + w * 0.05 + f.size * 1.1), '1 HOUR.', font=f, fill=(120, 50, 230))
    sh = np.linspace(0, 1, h)[:, None] * np.ones((1, w))
    s = Image.new('RGBA', (w, h), (0, 0, 0, 0)); s.putalpha(Image.fromarray((sh * 24).astype(np.uint8)))
    img.alpha_composite(s)
    return img
HP = hero_paper(700)

def blank_paper(w):
    w = int(w); img = Image.new('RGBA', (w, int(w * 1.3)), (244, 242, 238, 255)); return img

rnd = random.Random(21)
BURST = [dict(x=rnd.uniform(0.25, 0.8), y=rnd.uniform(0.25, 0.6), vx=rnd.uniform(-1, 1), vy=rnd.uniform(-1.2, 0.3), w=rnd.uniform(90, 260),
              r0=rnd.uniform(-60, 60), vr=rnd.uniform(-200, 200), hero=(i == 5)) for i in range(14)]

def draw_burst(L, t, t0, speed=1.0, blur_k=1.0):
    dt = (t - t0) * speed
    if dt < 0: return
    for p in BURST:
        g = dt * dt * 0.25
        x = (p['x'] + p['vx'] * dt * 0.35) * W
        y = (p['y'] + p['vy'] * dt * 0.35 + g) * H
        sc = 1 + dt * 0.9
        w = p['w'] * U * sc
        img = HP.resize((int(w), int(w * 1.3)), Image.BILINEAR) if p['hero'] else blank_paper(w)
        flip = abs(math.cos(dt * 2 + p['x'] * 7)) * 0.6 + 0.4
        img = img.resize((max(4, int(img.width * flip)), img.height), Image.BILINEAR)
        paste(L, img, x, y, 1.0, p['r0'] + p['vr'] * dt, blur=min(10, w / 60) * blur_k)

# ---------- ALFA chat UI ----------
def panel_geom():
    if WIDE: return CX, CY, 1100, 720
    return CX, CY, 980, 1120

def chat_panel(L, t, phase):
    """phase: dict with flags. Draws a dark glass chat window."""
    cx, cy, pw, ph = panel_geom()
    pw, ph = pw * (1 if WIDE else 1), ph
    pan = Image.new('RGBA', (int(pw), int(ph)), (0, 0, 0, 0))
    d = ImageDraw.Draw(pan)
    d.rounded_rectangle([0, 0, pw - 1, ph - 1], 34, fill=(20, 18, 30, 238), outline=(255, 255, 255, 34), width=2)
    # header
    d.ellipse([28, 26, 72, 70], fill=H2.PURP)
    d.text((50, 48), 'A', font=font('Poppins800i.ttf', 26), fill='white', anchor='mm')
    d.text((88, 30), 'ALFA', font=H2.FUI6(26), fill='white')
    d.text((88, 60), 'Your AI marketing agent', font=H2.FUI(17), fill=(170, 160, 190))
    d.line([(0, 96), (pw, 96)], fill=(255, 255, 255, 22), width=2)
    paste(L, pan, cx, cy, phase.get('alpha', 1))
    return cx - pw / 2, cy - ph / 2, pw, ph

def input_bar(L, x0, y0, pw, ph, text, n, attach_a, send_a, caret):
    iw, ih = pw - 56, 92
    ix, iy = x0 + 28, y0 + ph - ih - 28
    bar = Image.new('RGBA', (int(iw), int(ih)), (0, 0, 0, 0))
    d = ImageDraw.Draw(bar)
    d.rounded_rectangle([0, 0, iw - 1, ih - 1], 26, fill=(34, 31, 48, 255), outline=(255, 255, 255, 40), width=2)
    tx = 24
    if attach_a > 0:
        th = ih - 24; tw = th * 0.77
        thumb = ImageOps.fit(WATCH, (int(tw), int(th)), Image.BILINEAR).convert('RGBA')
        bar.paste(thumb, (16, 12), rr_mask(int(tw), int(th), 8))
        tx = 16 + tw + 18
    f = H2.FUI(28)
    s = text[:n]
    if s:
        d.text((tx, ih / 2), s, font=f, fill=(240, 240, 245), anchor='lm')
    if caret:
        cxp = tx + f.getlength(s) + 4
        d.rectangle([cxp, ih / 2 - 16, cxp + 3, ih / 2 + 16], fill=H2.PURP)
    bd = int(ih * 0.58)
    btn = H2.send_btn(bd, active=send_a > 0)
    bar.alpha_composite(btn, (int(iw - bd - 16), int((ih - bd) / 2)))
    paste(L, bar, ix + iw / 2, iy + ih / 2)
    return ix, iy, iw, ih

def bubble(L, x, y, maxw, text, mine, attach=False, a=1.0, thumbs=None, check=False):
    f = H2.FUI(26)
    tw = f.getlength(text)
    bw = min(maxw, tw + 48) if not thumbs else maxw
    th = 0
    if attach: th = 190
    if thumbs: th = 2 * 118 + 12
    bh = 64 + th + (12 if th else 0)
    b = Image.new('RGBA', (int(bw), int(bh)), (0, 0, 0, 0))
    d = ImageDraw.Draw(b)
    d.rounded_rectangle([0, 0, bw - 1, bh - 1], 22, fill=(H2.PURP + (255,)) if mine else (40, 37, 56, 255))
    yy = 14
    if attach:
        w2 = int(th * 0.77)
        im = ImageOps.fit(WATCH, (w2, th), Image.BILINEAR).convert('RGBA')
        b.paste(im, (int(bw - w2 - 14), yy), rr_mask(w2, th, 12)); yy += th + 12
    if thumbs:
        cols = 3; cw = (bw - 28 - (cols - 1) * 10) / cols
        for k, im in enumerate(thumbs[:6]):
            c, r = k % cols, k // cols
            im2 = ImageOps.fit(im, (int(cw), 118), Image.BILINEAR).convert('RGBA')
            b.paste(im2, (int(14 + c * (cw + 10)), int(yy + r * 130)), rr_mask(int(cw), 118, 10))
        yy += th + 12
    d.text((24 if not mine else bw - 24, yy + 18), text, font=f, fill='white', anchor='lm' if not mine else 'rm')
    if check:
        d.ellipse([bw - 54, yy + 4, bw - 22, yy + 36], fill=(60, 200, 120))
        d.line([(bw - 46, yy + 20), (bw - 40, yy + 27), (bw - 29, yy + 13)], fill='white', width=4)
    paste(L, b, x + (bw / 2 if not mine else -bw / 2), y + bh / 2, a)
    return bh

CHAT_S = 1.22 if WIDE else 1.0
def upscale(L):
    if CHAT_S == 1.0: return L
    big = L.resize((int(W * CHAT_S), int(H * CHAT_S)), Image.BICUBIC)
    x = (big.width - W) // 2; y = (big.height - H) // 2
    return big.crop((x, y, x + W, y + H))
def to_screen(x, y):
    return CX + (x - CX) * CHAT_S, CY + (y - CY) * CHAT_S

# ---------- timer chip ----------
def timer_secs(t):
    if t < 6.2: return 0
    p = prog(t, 6.2, 17.6)
    return int(3492 * (p ** 1.15))
def timer_chip(L, t, a=1.0, big=False, glow=False):
    s = timer_secs(t)
    txt = f'{s // 3600:02d}:{(s % 3600) // 60:02d}:{s % 60:02d}'
    f = font('Poppins600n.ttf', (40 if big else 28) * U)
    w = int(f.getlength(txt) + 90 * U); h = int((70 if big else 54) * U)
    c = Image.new('RGBA', (w, h), (0, 0, 0, 0))
    d = ImageDraw.Draw(c)
    d.rounded_rectangle([0, 0, w - 1, h - 1], h // 2, fill=(20, 18, 30, 225), outline=((60, 200, 120, 255) if glow else (255, 255, 255, 50)), width=3 if glow else 2)
    r = h * 0.28; ccx = h * 0.55
    d.ellipse([ccx - r, h / 2 - r, ccx + r, h / 2 + r], outline='white', width=3)
    d.line([(ccx, h / 2), (ccx, h / 2 - r * 0.7)], fill='white', width=3)
    d.line([(ccx, h / 2), (ccx + r * 0.55, h / 2)], fill='white', width=3)
    d.text((h * 1.0, h / 2), txt, font=f, fill='white', anchor='lm')
    if big: return c
    paste(L, c, W - w / 2 - 40 * U, 40 * U + h / 2, a)

def label(img, w1, w2, t, t0, pos='bl'):
    size = 140 * U
    fn = 'Poppins700i.ttf'
    a, b = H2.word_width(w1, fn, size), H2.word_width(w2, fn, size)
    tot = a + b + size * 0.2
    if pos == 'bl' and WIDE:
        cx, cy = 90 + tot / 2, H - 130
    else:
        cx, cy = CX, H - 150 * U
    two_words(img, w1, w2, size, cx, cy, prog(t, t0, t0 + 0.4), prog(t, t0 + 0.08, t0 + 0.48), dy2=0)

def grade_bottom(img):
    h = int(H * 0.45)
    g = (np.linspace(0, 1, h) ** 1.6 * 200).astype(np.uint8)
    m = Image.fromarray(np.repeat(g[:, None], W, 1), 'L')
    s = Image.new('RGBA', (W, h), (8, 6, 14, 0)); s.putalpha(m)
    img.alpha_composite(s, (0, H - h))
    return img

THUMBS = None
def thumbs():
    global THUMBS
    if THUMBS is None:
        ad = frame('ad', 2.0); bb = frame('bb', 1.0); ug = frame('ugc', 1.2)
        THUMBS = [WATCH, ad, bb, ug, H2.crop_aspect(ad, 9 / 16), H2.crop_aspect(bb, 1.0)]
    return THUMBS

# ---------- calendar ----------
DAYS = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN']
def calendar(img, t, t0):
    cols = 7
    gw = (1500 if WIDE else 1000) * 1.0; gh = (470 if WIDE else 640)
    x0 = CX - gw / 2; y0 = CY - gh / 2 - (20 if WIDE else -40)
    cw = (gw - (cols - 1) * 14) / cols
    th = thumbs()
    plats = [('ig', 'fb'), ('tt',), ('ig',), ('ig', 'tt'), ('fb',), ('tt', 'ig'), ('ig',)]
    for i in range(cols):
        e = eo3(prog(t, t0 + 0.05 * i, t0 + 0.4 + 0.05 * i))
        x = x0 + i * (cw + 14)
        col = Image.new('RGBA', (int(cw), int(gh)), (0, 0, 0, 0))
        d = ImageDraw.Draw(col)
        d.rounded_rectangle([0, 0, cw - 1, gh - 1], 18, fill=(24, 22, 34, 230), outline=(255, 255, 255, 30), width=2)
        d.text((cw / 2, 30), DAYS[i], font=H2.FUI6(20), fill=(190, 170, 230), anchor='mm')
        paste(img, col, x + cw / 2, y0 + gh / 2 + (1 - e) * 40, e)
        # post card drops in
        pe = eback(prog(t, t0 + 0.45 + 0.13 * i, t0 + 0.8 + 0.13 * i))
        if pe > 0:
            ch = gh - 120
            card = H2.card(th[i % len(th)], cw - 18, ch * 0.78)
            paste(img, card, x + cw / 2, y0 + 60 + ch * 0.39 + (1 - pe) * -60, clamp(pe), scale=max(0.05, min(1.1, pe)))
            for k, p in enumerate(plats[i]):
                ic = H2.ICONS[p].resize((int(34 * U), int(34 * U)), Image.LANCZOS)
                paste(img, ic, x + cw / 2 + (k - (len(plats[i]) - 1) / 2) * 40 * U, y0 + gh - 34, clamp(pe))

def render(t):
    # 1. the run, the door, the burst (0-3.0)
    if t < 3.0:
        ct = t * 1.22
        img = fit_frame(frame('run', ct), 'run', zoom=1.02, t=t, shake=3 if t > 2.4 else 1)
        img.alpha_composite(vign())
        if t > 2.45:   # extra papers bursting toward the lens after the hit
            L = Image.new('RGBA', (W, H), (0, 0, 0, 0)); draw_burst(L, t, 2.45, 1.0); img.alpha_composite(L)
        a = 1 - eio(prog(t, 2.35, 2.6))
        kinetic_word(img, 'ALFA', 'Poppins800i.ttf', 250 * U, 'purple', CX, CY + 150 * U, prog(t, 0.35, 1.1), seed=3, mode='scatter', spread=0.6, alpha=a)
        pe = eo3(prog(t, 1.0, 1.3)) * a
        if pe > 0:
            f = H2.FUI6(24 * U); s_ = 'YOUR AI MARKETING AGENT'; tw = f.getlength(s_)
            pill = Image.new('RGBA', (int(tw + 44 * U), int(44 * U)), (0, 0, 0, 0))
            ImageDraw.Draw(pill).rounded_rectangle([0, 0, pill.width - 1, pill.height - 1], pill.height // 2, fill=H2.PURP + (255,))
            ImageDraw.Draw(pill).text((pill.width / 2, pill.height / 2), s_, font=f, fill='white', anchor='mm')
            paste(img, pill, CX, CY + 10 * U, pe)
        return img
    # 2. slow-mo: the one paper (3.0-4.5)
    if t < 4.5:
        bg = fit_frame(frame('run', 3.6), 'run', zoom=1.06).filter(ImageFilter.GaussianBlur(12))
        darken(bg, 0.25); bg.alpha_composite(vign())
        L = Image.new('RGBA', (W, H), (0, 0, 0, 0)); draw_burst(L, 2.55 + (t - 3.0) * 0.12 + 0.45, 2.55, 1.0, blur_k=2.2); bg.alpha_composite(L)
        p = prog(t, 3.0, 4.5)
        w = (430 if WIDE else 470) * U * lerp(0.75, 1.12, eio(p))
        x = CX + lerp(180, -10, eio(p)) * U; y = CY + lerp(-90, 10, eio(p)) * U
        paste(bg, HP.resize((int(w), int(w * 1.3)), Image.LANCZOS), x, y, 1, lerp(-16, -5, eo3(p)))
        return bg
    # 3. it falls into the ALFA chat (4.5-6.5)
    if t < 6.5:
        img = H2.BG.copy()
        ea = eo3(prog(t, 4.5, 4.8))
        L = Image.new('RGBA', (W, H), (0, 0, 0, 0))
        x0, y0, pw, ph = chat_panel(L, t, {'alpha': 1})
        sent = t >= 6.05
        msg = 'Full campaign in 1 hour.'
        n = int(len(msg) * prog(t, 5.25, 5.85))
        if not sent:
            input_bar(L, x0, y0, pw, ph, msg, n, attach_a=1 if t > 5.15 else 0, send_a=1 if t > 5.95 else 0, caret=5.2 < t < 6.05)
        else:
            input_bar(L, x0, y0, pw, ph, '', 0, 0, 0, False)
            e = eo3(prog(t, 6.05, 6.3))
            bh = 64 + 190 + 12
            bubble(L, x0 + pw - 28, lerp(y0 + ph - 140, y0 + 120, e), 520, msg, True, attach=True, a=e)
            if t > 6.25:
                bubble(L, x0 + 28, y0 + 120 + bh + 18, 420, 'On it. Building your campaign...', False, a=eo3(prog(t, 6.25, 6.45)))
        L2 = upscale(L)
        if ea < 1: L2.putalpha(L2.getchannel('A').point(lambda v: int(v * ea)))
        img.alpha_composite(L2)
        # the paper drops in and shrinks into the attachment slot
        if t < 5.2:
            p = eio(prog(t, 4.5, 5.15))
            iw, ih = pw - 56, 92
            tx, ty = x0 + 28 + 16 + (ih - 24) * 0.77 / 2, y0 + ph - ih - 28 + ih / 2
            w = lerp(520 * U, (ih - 24) * 0.77 * 1.3 / 1.3, p)
            tx, ty = to_screen(tx, ty); w = lerp(520 * U, (ih - 24) * 0.77 * CHAT_S, p)
            paste(img, HP.resize((max(8, int(w)), max(8, int(w * 1.3))), Image.BILINEAR), lerp(CX, tx, p), lerp(-0.1 * H, ty, p), 1, lerp(-8, 0, p))
        if t > 6.2: timer_chip(img, t, eo3(prog(t, 6.2, 6.4)))
        return img
    # 4. product -> video (6.5-8.5)
    if t < 8.5:
        ct = 0.2 + (t - 6.5) * 1.6
        img = fit_frame(frame('ad', ct), 'ad', zoom=lerp(1.0, 1.06, prog(t, 6.5, 8.5)))
        img = grade_bottom(img)
        e = eo3(prog(t, 6.5, 6.9))
        if e < 1:  # grow out of the chat thumbnail
            bg = H2.BG.copy()
            s = lerp(0.18, 1.0, e)
            paste(bg, img.resize((int(W * s), int(H * s)), Image.BILINEAR), CX, CY, 1)
            img = bg
        label(img, 'Product', 'Video', t, 6.75)
        timer_chip(img, t)
        return img
    # 5. ads (8.5-10.5)
    if t < 10.5:
        img = fit_frame(frame('bb', 0.1 + (t - 8.5) * 1.3), 'bb')
        img = grade_bottom(img)
        label(img, 'Billboard', 'Ads', t, 8.6)
        timer_chip(img, t)
        return img
    # 6. UGC (10.5-12.5)
    if t < 12.5:
        img = fit_frame(frame('ugc', 0.2 + (t - 10.5) * 1.25), 'ugc')
        img = grade_bottom(img)
        label(img, 'UGC', 'Videos', t, 10.6)
        timer_chip(img, t)
        return img
    # 7. any size (12.5-14.5)
    if t < 14.5:
        img = H2.BG.copy()
        L = Image.new('RGBA', (W, H), (0, 0, 0, 0))
        H2.s_size(L, 12.3 + (t - 12.5) * (2.2 / 2.0))
        img.alpha_composite(L)
        timer_chip(img, t)
        return img
    # 8. scheduled (14.5-17.0)
    if t < 17.0:
        img = H2.BG.copy()
        calendar(img, t, 14.55)
        y = (CY + 330) if WIDE else (CY + 470 * U)
        a, b = H2.word_width('Auto', 'Poppins700i.ttf', 120 * U), H2.word_width('Scheduled.', 'Poppins700i.ttf', 120 * U)
        two_words(img, 'Auto', 'Scheduled.', 120 * U, CX, (CY - 360 if WIDE else CY - 420), prog(t, 14.6, 15.0), prog(t, 14.68, 15.08))
        timer_chip(img, t)
        return img
    # 9. back in the chat: done under 1 hour (17.0-18.8)
    if t < 18.8:
        img = H2.BG.copy()
        L = Image.new('RGBA', (W, H), (0, 0, 0, 0))
        x0, y0, pw, ph = chat_panel(L, t, {'alpha': 1})
        input_bar(L, x0, y0, pw, ph, '', 0, 0, 0, False)
        bubble(L, x0 + pw - 28, y0 + 120, 520, 'Full campaign in 1 hour.', True, attach=True)
        e = eo3(prog(t, 17.05, 17.35))
        bubble(L, x0 + 28, y0 + 120 + 266 + 18, pw - 56 - 120, 'Your full campaign is ready.', False, thumbs=thumbs(), a=e, check=True)
        dim = eio(prog(t, 17.7, 18.0))
        img.alpha_composite(upscale(L))
        if dim > 0: darken(img, 0.55 * dim)
        chip = timer_chip(img, 17.6, big=True, glow=True)
        paste(img, chip, CX, CY - (60 if WIDE else 120) * U, dim, scale=lerp(0.8, 1, dim))
        if WIDE:
            two_words(img, 'Full campaign.', 'Under 1 hour.', 110 * U, CX, CY + 90 * U, prog(t, 17.85, 18.25), prog(t, 17.95, 18.35))
        else:
            kinetic_word(img, 'Full campaign.', 'Poppins700i.ttf', 120 * U, 'white', CX, CY + 40, prog(t, 17.85, 18.25))
            kinetic_word(img, 'Under 1 hour.', 'Poppins700i.ttf', 120 * U, 'purple', CX, CY + 160, prog(t, 17.95, 18.35))
        fo = eio(prog(t, 18.55, 18.8))
        if fo > 0: darken(img, fo)
        return img
    # 10. ALFA end card -> black
    img = H2.BG.copy()
    L = Image.new('RGBA', (W, H), (0, 0, 0, 0))
    H2.s_outro(L, 18.6 + (t - 18.8) * (1.4 / 1.2))
    img.alpha_composite(L)
    return img

if __name__ == '__main__':
    if MODE == 'frames':
        for ts in sys.argv[3].split(','):
            render(float(ts)).convert('RGB').save(f'/home/claude/alfa/build/h5_{FMT}_{ts}.jpg', quality=88)
    else:
        out = sys.argv[3]; tmp = out.replace('.mp4', '.tmp.mp4')
        p = subprocess.Popen(['ffmpeg', '-v', 'error', '-y', '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-s', f'{W}x{H}', '-r', str(FPS), '-i', '-',
                              '-c:v', 'libx264', '-crf', '14', '-preset', 'veryfast', '-pix_fmt', 'yuv420p', tmp], stdin=subprocess.PIPE)
        for k in range(int(DUR * FPS)):
            p.stdin.write(render(k / FPS).convert('RGB').tobytes())
            if k % 100 == 0: print(k, flush=True)
        p.stdin.close()
        if p.wait() == 0: os.replace(tmp, out); print('done', out)
