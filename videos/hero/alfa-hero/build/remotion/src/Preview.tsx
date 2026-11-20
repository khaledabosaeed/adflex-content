/*
 * ALFA hero, motion preview of script v5 (action clients, no new screen recordings).
 * ALFA's UI is REAL: crops of the existing recordings from workflow-hero (alfa.mp4, alfa-plan.mp4, alfa-edit.mp4; dev account).
 * Every footage shot (the action reels, her desk, the high five) is a labelled PLACEHOLDER until it's generated after a credit quote.
 * Spec: ../../production.md, "Script v5". All times in seconds; frames derived from fps.
 */
import React from 'react';
import {AbsoluteFill, Freeze, Img, OffthreadVideo, random, Sequence, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {Cam, cond, IN, INOUT, ip, OUT, Streaks} from './lib';

/* ---------- house motion tokens (motion-styles/README.md) ---------- */
const HS = {mass: 0.6, stiffness: 140, damping: 12};
export const P1 = '#8337F1';
export const EXIT = 0.2;
export const useSec = () => useCurrentFrame() / useVideoConfig().fps;
const useHS = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  return (at: number) => spring({frame: f - at * fps, fps, config: HS});
};
const pressScale = (s: number, at: number, hs: (a: number) => number) => (s < at ? 1 : s < at + 0.06 ? 1 - 0.03 * ip(s, [at, at + 0.06], [0, 1]) : 0.97 + 0.03 * hs(at + 0.06));

/* ---------- timeline (absolute seconds) ---------- */
const T = {home: 1.65, type: 3.3, work: 5.0, run: 6.5, dive: 7.4, volt: 8.2, ko: 9.6, dune: 10.8, back: 12.0, end: 17};
export const ALFA_BG = '#13121a';

/* ---------- a real recording, frozen or playing, cropped to a source rect and placed into a destination rect ---------- */
export type Rect = {x: number; y: number; w: number; h: number};
export const Rec: React.FC<{src: string; srcW: number; srcH: number; crop: Rect; dest: Rect; at: number; rate?: number; freeze?: boolean; radius?: number}> = ({src, srcW, srcH, crop, dest, at, rate = 1, freeze, radius = 18}) => {
  const {fps} = useVideoConfig();
  const k = dest.w / crop.w;
  const video = <OffthreadVideo src={staticFile(src)} muted trimBefore={Math.round(at * fps)} playbackRate={rate} style={{width: srcW, height: srcH}} />;
  return (
    <div style={{position: 'absolute', left: dest.x, top: dest.y, width: dest.w, height: dest.h, overflow: 'hidden', borderRadius: radius}}>
      <div style={{position: 'absolute', left: -crop.x * k, top: -crop.y * k, width: srcW, height: srcH, transformOrigin: '0 0', scale: String(k)}}>
        {freeze ? <Freeze frame={0}>{video}</Freeze> : video}
      </div>
    </div>
  );
};
export const centred = (w: number, h: number, cy = 540): Rect => ({x: 960 - w / 2, y: cy - h / 2, w, h});
export const box = (r: Rect): React.CSSProperties => ({left: r.x, top: r.y, width: r.w, height: r.h});

/* ---------- placeholder tag ---------- */
const Tag: React.FC<{text: string}> = ({text}) => (
  <div style={{position: 'absolute', right: 40, top: 34, fontFamily: 'ui-monospace, monospace', fontSize: 17, letterSpacing: 1, padding: '6px 12px', borderRadius: 6, color: '#fff', background: 'rgba(0,0,0,.45)', whiteSpace: 'nowrap'}}>
    PLACEHOLDER · {text}
  </div>
);

/* ---------- action placeholders (flat shapes in motion; real ones are generated) ---------- */
type Action = 'volt' | 'knockout' | 'dune';
const ActionShot: React.FC<{kind: Action; t: number; tag?: boolean}> = ({kind, t, tag = true}) => {
  if (kind === 'volt') {
    // runner leaps between rooftops at sunset; slow motion at the top of the arc, then a speed ramp
    const ramp = t < 0.5 ? (t / 0.5) * 0.45 : t < 1.1 ? 0.45 + ((t - 0.5) / 0.6) * 0.1 : 0.55 + Math.min(0.45, ((t - 1.1) / 0.3) * 0.45);
    const x = 300 + ramp * 1300;
    const y = 640 - Math.sin(ramp * Math.PI) * 330;
    return (
      <AbsoluteFill style={{background: 'linear-gradient(180deg, #ff9a4d 0%, #e0533b 45%, #3a1630 100%)', overflow: 'hidden'}}>
        <div style={{position: 'absolute', left: 0, top: 760, width: 760, height: 400, background: '#1d0d1c'}} />
        <div style={{position: 'absolute', left: 1180, top: 800, width: 760, height: 400, background: '#1d0d1c'}} />
        <div style={{position: 'absolute', left: x - 50, top: y - 160, width: 100, height: 100, borderRadius: '50%', background: '#120812'}} />
        <div style={{position: 'absolute', left: x - 60, top: y - 60, width: 120, height: 200, borderRadius: 50, background: '#120812', rotate: `${-30 + ramp * 60}deg`}} />
        {tag ? <Tag text="VOLT reel (generated): runner leaps between rooftops, slow-mo apex, speed ramp" /> : null}
      </AbsoluteFill>
    );
  }
  if (kind === 'knockout') {
    const punch = ip(t, [0.2, 0.75], [0, 1], OUT);
    return (
      <AbsoluteFill style={{background: 'radial-gradient(circle at 50% 40%, #5a1a1a, #0d0606 70%)', overflow: 'hidden'}}>
        <div style={{position: 'absolute', left: 300 + punch * 760, top: 420, width: 260, height: 220, borderRadius: 110, background: '#c0262c'}} />
        {Array.from({length: 14}, (_, i) => (
          <div key={i} style={{position: 'absolute', left: 1100 + random(`k${i}`) * 300 * punch, top: 380 + random(`ky${i}`) * 300, width: 10, height: 10, borderRadius: 5, background: 'rgba(220,240,255,.8)', opacity: punch}} />
        ))}
        {tag ? <Tag text="KNOCKOUT reel (generated): slow-mo punch, sweat spray" /> : null}
      </AbsoluteFill>
    );
  }
  const j = ip(t, [0.1, 1.1], [0, 1], INOUT);
  return (
    <AbsoluteFill style={{background: 'linear-gradient(180deg, #f6c27a 0%, #e59a4f 50%, #b8642c 100%)', overflow: 'hidden'}}>
      <div style={{position: 'absolute', left: -200, top: 700, width: 1400, height: 700, borderRadius: '50%', background: '#c97a3a'}} />
      <div style={{position: 'absolute', left: 900, top: 760, width: 1400, height: 700, borderRadius: '50%', background: '#b8692f'}} />
      <div style={{position: 'absolute', left: 200 + j * 1300, top: 620 - Math.sin(j * Math.PI) * 300, width: 220, height: 110, borderRadius: 40, background: '#1c1c22', rotate: `${-20 + j * 40}deg`}} />
      {tag ? <Tag text="DUNE reel (generated): bikes jump a dune, sand flying" /> : null}
    </AbsoluteFill>
  );
};

/** Leen's agency desk: the REAL generated clip C1 (public/desk-c1.mp4, see media.tsv): Reem walks in ~1.0 s, high five ~3.6–4.6 s. Locked camera, so the screen corners hold for the whole clip. */
export type Pt = [number, number];
export type Quad = [Pt, Pt, Pt, Pt]; // TL, TR, BR, BL
// laptop screen corners in desk-c1.mp4 (1280×720), measured from the white screen at 0, 2.5 and 4.9 s (±1 px), mapped to 1920×1080
const DESK_SRC = {w: 1280, h: 720};
const DESK_K = Math.max(1920 / DESK_SRC.w, 1080 / DESK_SRC.h);
const deskPt = (x: number, y: number): Pt => [x * DESK_K - (DESK_SRC.w * DESK_K - 1920) / 2, y * DESK_K - (DESK_SRC.h * DESK_K - 1080) / 2];
export const SCREEN: Quad = [deskPt(204, 342), deskPt(478, 333), deskPt(536, 533), deskPt(269, 596)];
export const FULL: Quad = [[0, 0], [1920, 0], [1920, 1080], [0, 1080]];
export const SCREEN_C: Pt = [SCREEN.reduce((a, p) => a + p[0], 0) / 4, SCREEN.reduce((a, p) => a + p[1], 0) / 4];
export const lerpQuad = (a: Quad, b: Quad, k: number) => a.map((p, i) => [p[0] + (b[i][0] - p[0]) * k, p[1] + (b[i][1] - p[1]) * k]) as Quad;

/** CSS matrix3d that maps a 1920×1080 box onto a quad (projective corner-pin). */
export const pinMatrix = (q: Quad, w = 1920, h = 1080) => {
  const [[x0, y0], [x1, y1], [x2, y2], [x3, y3]] = q;
  const dx1 = x1 - x2, dx2 = x3 - x2, dy1 = y1 - y2, dy2 = y3 - y2;
  const sx = x0 - x1 + x2 - x3, sy = y0 - y1 + y2 - y3;
  const den = dx1 * dy2 - dx2 * dy1;
  const g = (sx * dy2 - dx2 * sy) / den;
  const hh = (dx1 * sy - sx * dy1) / den;
  const a = x1 - x0 + g * x1, b = x3 - x0 + hh * x3, c = x0;
  const d = y1 - y0 + g * y1, e = y3 - y0 + hh * y3, f = y0;
  // unit square → quad; pre-scale the box to the unit square
  const m = [a / w, d / w, 0, g / w, b / h, e / h, 0, hh / h, 0, 0, 1, 0, c, f, 0, 1];
  return `matrix3d(${m.join(',')})`;
};
export const Pinned: React.FC<{quad: Quad; children: React.ReactNode}> = ({quad, children}) => (
  <div style={{position: 'absolute', left: 0, top: 0, width: 1920, height: 1080, transformOrigin: '0 0', transform: pinMatrix(quad), overflow: 'hidden'}}>{children}</div>
);

export const Desk: React.FC = () => (
  <AbsoluteFill>
    <OffthreadVideo src={staticFile('desk-c1.mp4')} muted style={{width: 1920, height: 1080, objectFit: 'cover'}} />
  </AbsoluteFill>
);

/* ---------- pixel burst (transitions/pixel-square-burst.md) ---------- */
export const PixelBurst: React.FC<{at: number; x: number; y: number}> = ({at, x, y}) => {
  const t = (useSec() - at) / 0.3;
  if (t <= 0 || t >= 1) return null;
  return (
    <>
      {Array.from({length: 16}, (_, i) => {
        const a = random(`ang${i}`) * Math.PI * 2;
        const d = (90 + random(`d${i}`) * 160) * OUT(t);
        const size = 8 + Math.round(random(`s${i}`) * 2) * 4;
        const snap = (v: number) => Math.round(v / 6) * 6;
        return <div key={i} style={{position: 'absolute', left: snap(x + Math.cos(a) * d) - size / 2, top: snap(y + Math.sin(a) * d) - size / 2, width: size, height: size, background: i % 3 === 0 ? '#C95AC5' : P1, opacity: t < 0.5 ? 1 : 1 - (t - 0.5) * 2}} />;
      })}
    </>
  );
};

/* ---------- corner label: smear in/out; the accent can jump between words (accent-word-headline) ---------- */
export const CornerLabel: React.FC<{words: string[]; accent: number | ((s: number) => number); sub?: string; at: number; out: number}> = ({words, accent, sub, at, out}) => {
  const s = useSec();
  const p = ip(s, [at, at + 0.09], [0, 1]);
  const e = ip(s, [out, out + 0.09], [0, 1], IN);
  if (p <= 0 || e >= 1) return null;
  const smear = 1 - p + e;
  const ai = typeof accent === 'number' ? accent : accent(s);
  return (
    <div style={{position: 'absolute', left: 96, bottom: 84, transformOrigin: '0 50%', scale: `${1 + 0.9 * smear} 1`, opacity: p * (1 - e), filter: smear > 0.02 ? `blur(${smear * 14}px)` : undefined}}>
      <div style={{display: 'flex', gap: 22, alignItems: 'baseline', textShadow: '0 4px 30px rgba(0,0,0,.45)'}}>
        {words.map((w, i) => (
          <span key={i} style={i === ai ? {...cond(900, 125), fontSize: 96, background: 'linear-gradient(135deg, #B57BFF, #8337F1)', WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent', textShadow: 'none'} : {...cond(860, 72), fontSize: 96, color: '#fff'}}>
            {w}
          </span>
        ))}
      </div>
      {sub ? <div style={{...cond(700, 100), fontSize: 24, letterSpacing: 5, color: 'rgba(255,255,255,.85)', marginTop: 6}}>{sub}</div> : null}
    </div>
  );
};

/* =========================== SHOTS =========================== */

/** The ALFA home screen, real (alfa.mp4 frozen at 0.1 s): input + the four suggestion chips, at source scale. */
export const HomeFrame: React.FC = () => (
  <AbsoluteFill style={{background: ALFA_BG}}>
    <Rec src="alfa.mp4" srcW={1920} srcH={1080} crop={{x: 0, y: 0, w: 1920, h: 1080}} dest={{x: 0, y: 0, w: 1920, h: 1080}} at={0.1} freeze radius={0} />
  </AbsoluteFill>
);
// chip centres in alfa.mp4 (source px): Plan my week, Review media performance, Understand comments
const CHIPS = [{x: 576, y: 529}, {x: 831, y: 529}, {x: 1122, y: 529}];
const INPUT_C = {x: 1005, y: 420};

/** 0–1.65 s: VOLT action under a giant ALFA; it splits AL | FA and the gap shows ALFA's real home screen. */
const ColdOpen: React.FC = () => {
  const s = useSec();
  const inP = ip(s, [0, 0.45], [0, 1]);
  const drift = 1 + 0.03 * ip(s, [0.45, 1.25], [0, 1]);
  const gap = ip(s, [1.2, 1.6], [0, 1920], INOUT);
  const halvesOut = ip(s, [1.45, 1.45 + EXIT], [0, 1], IN);
  const smallOut = ip(s, [1.15, 1.15 + EXIT], [0, 1], IN);
  const word: React.CSSProperties = {...cond(900, 125), fontSize: 360, lineHeight: 1, color: '#fff', letterSpacing: -4, whiteSpace: 'nowrap', textShadow: '0 10px 60px rgba(0,0,0,.35)'};
  const ent = {opacity: inP, filter: `blur(${(1 - inP) * 14}px)`};
  const half = (dir: -1 | 1): React.CSSProperties => ({...word, translate: `${dir * halvesOut * 260}px 0`, opacity: 1 - halvesOut, filter: halvesOut > 0 ? `blur(${halvesOut * 12}px)` : undefined});
  return (
    <AbsoluteFill>
      <ActionShot kind="volt" t={s} />
      <AbsoluteFill style={{background: 'rgba(10,5,15,.25)', opacity: ip(s, [0, 0.3], [0, 1])}} />
      {/* the gap: a window onto ALFA's home (title-gap-window) */}
      <AbsoluteFill style={{clipPath: `inset(0 ${(1920 - gap) / 2}px 0 ${(1920 - gap) / 2}px)`}}>
        <Cam s={1.25} ox={INPUT_C.x} oy={INPUT_C.y} x={960 - INPUT_C.x} y={540 - INPUT_C.y}>
          <HomeFrame />
        </Cam>
      </AbsoluteFill>
      {halvesOut < 1 ? (
        <AbsoluteFill style={{scale: String((1.08 - 0.08 * inP) * drift)}}>
          <div style={{position: 'absolute', top: 250, width: 1920, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 16, ...ent, opacity: inP * (1 - smallOut)}}>
            <Img src={staticFile('adflex-logo.png')} style={{height: 40, filter: 'brightness(0) invert(1)'}} />
            <span style={{...cond(500, 100), fontSize: 30, color: 'rgba(255,255,255,.8)', letterSpacing: 4}}>AGENT</span>
          </div>
          <div style={{position: 'absolute', top: 350, left: 0, width: 1920, display: 'flex', justifyContent: 'center', ...ent}}>
            <div style={half(-1)}>AL</div>
            <div style={{width: Math.min(gap, 1120)}} />
            <div style={half(1)}>FA</div>
          </div>
          <div style={{position: 'absolute', top: 760, width: 1920, textAlign: 'center', ...cond(700, 110), fontSize: 30, letterSpacing: 10, color: 'rgba(255,255,255,.9)', ...ent, opacity: inP * (1 - smallOut)}}>YOUR AI MARKETING AGENT</div>
        </AbsoluteFill>
      ) : null}
    </AbsoluteFill>
  );
};

/** 1.65–3.3 s: macro dolly across the real suggestion chips: Plan my week → Review media performance → Understand comments. */
const ChipsDolly: React.FC = () => {
  const s = useSec();
  const k0 = ip(s, [0, 0.3], [0, 1], INOUT);
  let cx = INPUT_C.x + (CHIPS[0].x - INPUT_C.x) * k0;
  const cy = INPUT_C.y + (CHIPS[0].y - INPUT_C.y) * k0;
  const z = 1.25 + (2.6 - 1.25) * k0;
  const legs: [number, number][] = [[0.53, 0.75], [0.83, 1.05]];
  let speed = 0;
  legs.forEach(([a, b], i) => {
    const k = ip(s, [a, b], [0, 1], INOUT);
    cx += (CHIPS[i + 1].x - CHIPS[i].x) * k;
    speed += Math.abs(k - ip(s - 1 / 24, [a, b], [0, 1], INOUT));
  });
  return (
    <Cam s={z} ox={cx} oy={cy} x={960 - cx} y={540 - cy} blur={Math.min(6, speed * 40)}>
      <HomeFrame />
    </Cam>
  );
};

/** 3.3–5.0 s: the real typing (alfa.mp4 0.4–6.4 s at 3.75×), the input line big; send at 1.6 s local. */
const Typing: React.FC = () => {
  const s = useSec();
  const crop = {x: 484, y: 372, w: 1040, h: 96};
  const k = 1800 / crop.w;
  const sendAt = 1.6;
  const sendX = 960 + (1493 - (crop.x + crop.w / 2)) * k;
  const sendY = 540 + (444 - (crop.y + crop.h / 2)) * k;
  return (
    <AbsoluteFill style={{background: `radial-gradient(60% 60% at 50% 0%, rgba(131,55,241,.45), ${ALFA_BG} 70%)`}}>
      <Cam s={1 + 0.03 * s}>
        <div style={{position: 'absolute', ...box(centred(1800, crop.h * k)), borderRadius: 22, boxShadow: '0 0 0 2px rgba(156,71,255,.45), 0 40px 120px rgba(0,0,0,.6)'}}>
          <Rec src="alfa.mp4" srcW={1920} srcH={1080} crop={crop} dest={{x: 0, y: 0, w: 1800, h: crop.h * k}} at={0.4} rate={3.75} radius={22} />
        </div>
        <div style={{position: 'absolute', left: sendX - 36, top: sendY - 36, width: 72, height: 72, borderRadius: 36, boxShadow: `0 0 ${40 * ip(s, [sendAt, sendAt + 0.1, sendAt + 0.35], [0, 1, 0])}px 10px rgba(135,56,245,.7)`}} />
        <PixelBurst at={sendAt} x={sendX} y={sendY} />
      </Cam>
    </AbsoluteFill>
  );
};

/** 5.0–6.5 s: ALFA working, as giant real status lines (status-line-zoom): "Understanding the request…" → "Planning the steps…". */
const Working: React.FC = () => {
  const s = useSec();
  const cut = 0.75;
  const settle = s < cut ? ip(s, [0, 0.25], [8, 0]) : ip(s, [cut, cut + 0.25], [8, 0]);
  const push = 1 + 0.04 * (s < cut ? s / cut : (s - cut) / 0.75);
  return (
    <AbsoluteFill style={{background: `radial-gradient(60% 60% at 50% 0%, rgba(131,55,241,.4), ${ALFA_BG} 70%)`}}>
      <Cam s={push} blur={settle}>
        {s < cut ? (
          <Rec src="alfa-plan.mp4" srcW={1464} srcH={994} crop={{x: 430, y: 215, w: 400, h: 52}} dest={centred(1500, 195)} at={0} radius={0} />
        ) : (
          <Rec src="alfa-edit.mp4" srcW={1920} srcH={1080} crop={{x: 595, y: 610, w: 420, h: 70}} dest={centred(1500, 250)} at={11.5} radius={0} />
        )}
      </Cam>
    </AbsoluteFill>
  );
};

/** The real "Run this plan? … Approve and run" card (alfa-plan.mp4 at 3.9 s), big; the press on Approve and run. */
const RUN_CROP = {x: 16, y: 672, w: 700, h: 190};
const RUN_K = 1400 / RUN_CROP.w;
const BTN = {x: 960 + (630 - (RUN_CROP.x + RUN_CROP.w / 2)) * RUN_K, y: 540 + (829 - (RUN_CROP.y + RUN_CROP.h / 2)) * RUN_K};
const RunCard: React.FC<{pressAt: number}> = ({pressAt}) => {
  const s = useSec();
  const hs = useHS();
  return (
    <AbsoluteFill style={{background: `radial-gradient(60% 60% at 50% 0%, rgba(131,55,241,.4), ${ALFA_BG} 70%)`}}>
      <div style={{position: 'absolute', ...box(centred(1400, RUN_CROP.h * RUN_K)), boxShadow: '0 0 0 2px rgba(156,71,255,.45), 0 40px 120px rgba(0,0,0,.6)', borderRadius: 24}}>
        <Rec src="alfa-plan.mp4" srcW={1464} srcH={994} crop={RUN_CROP} dest={{x: 0, y: 0, w: 1400, h: RUN_CROP.h * RUN_K}} at={3.9} freeze radius={24} />
      </div>
      <div style={{position: 'absolute', left: BTN.x - 140, top: BTN.y - 40, width: 280, height: 80, borderRadius: 14, scale: String(pressScale(s, pressAt, hs)), boxShadow: `0 0 ${50 * ip(s, [pressAt, pressAt + 0.1, pressAt + 0.5], [0, 1, 0.6])}px 12px rgba(135,56,245,.75)`}} />
      <PixelBurst at={pressAt} x={BTN.x} y={BTN.y} />
    </AbsoluteFill>
  );
};

/** 6.5–8.2 s: run card, press at 0.6 s, then the bold dive through the button into the VOLT reel (dive-through). */
const RunAndDive: React.FC = () => {
  const s = useSec();
  const {fps} = useVideoConfig();
  const d0 = T.dive - T.run;
  const p = ip(s, [d0, d0 + 0.8], [0, 1], IN);
  const sc = (1 + 0.03 * Math.min(s, d0)) * Math.pow(14, p);
  const cx = BTN.x + (960 - BTN.x) * p;
  const cy = BTN.y + (540 - BTN.y) * p;
  const hw = (280 * sc) / 2;
  const hh = (80 * sc) / 2;
  return (
    <AbsoluteFill>
      <Cam s={sc} ox={BTN.x} oy={BTN.y} x={(960 - BTN.x) * p} y={(540 - BTN.y) * p} blur={ip(s, [d0 + 0.2, d0 + 0.6, d0 + 0.8], [0, 4, 0])}>
        <RunCard pressAt={0.6} />
      </Cam>
      {s >= d0 ? (
        <AbsoluteFill style={{clipPath: `inset(${Math.max(0, cy - hh)}px ${Math.max(0, 1920 - cx - hw)}px ${Math.max(0, 1080 - cy - hh)}px ${Math.max(0, cx - hw)}px round ${Math.min(40, 14 * sc)}px)`}}>
          <ActionShot kind="volt" t={0} tag={false} />
        </AbsoluteFill>
      ) : null}
      <Streaks at={(d0 + 0.05) * fps} dur={0.75 * fps} x={960} y={540} max={0.55} seed="dive" />
    </AbsoluteFill>
  );
};

/** 8.2–12.0 s: the action reels, cut on matching motion: VOLT → KNOCKOUT → DUNE. */
const Montage: React.FC = () => {
  const s = useSec();
  const a = T.ko - T.volt;
  const b = T.dune - T.volt;
  const kind: Action = s < a ? 'volt' : s < b ? 'knockout' : 'dune';
  const t = s < a ? s : s < b ? s - a : s - b;
  const lastCut = s < a ? -1 : s < b ? a : b;
  return (
    <Cam s={1 + 0.03 * t} blur={lastCut > 0 ? ip(s, [lastCut, lastCut + 0.2], [6, 0]) : 0}>
      <ActionShot kind={kind} t={t} />
    </Cam>
  );
};

/** 12.0–17 s: the DUNE reel corner-pins down into Leen's laptop screen (clip C1 plays under it); Reem walks in, high five; then her screen (now VOLT) grows back to full frame = frame 0. */
const Reveal: React.FC = () => {
  const s = useSec();
  const dur = T.end - T.back;
  const k = ip(s, [0, 0.9], [0, 1], INOUT); // full frame → screen
  const q = ip(s, [dur - 1.0, dur], [0, 1], INOUT); // screen → full frame (loop)
  const quad = q > 0 ? lerpQuad(SCREEN, FULL, q) : lerpQuad(FULL, SCREEN, k);
  const push = 1 + 0.6 * q; // the desk pushes in under the growing screen
  const showVolt = s > 3.2; // her screen switches to the VOLT reel, ready for the loop
  const endP = ip(s, [2.2, 2.5], [0, 1]);
  const endE = ip(s, [3.8, 3.8 + EXIT], [0, 1], IN);
  return (
    <AbsoluteFill>
      <Cam s={push} ox={SCREEN_C[0]} oy={SCREEN_C[1]} blur={ip(s, [0, 0.9], [10, 0]) + 6 * q}>
        <Desk />
      </Cam>
      <Pinned quad={quad}>{showVolt ? <ActionShot kind="volt" t={0} tag={false} /> : <ActionShot kind="dune" t={1.2 + s} tag={k < 0.5} />}</Pinned>
      {endP > 0 && endE < 1 ? (
        <div style={{position: 'absolute', bottom: 70, width: 1920, textAlign: 'center', ...cond(700, 110), fontSize: 30, letterSpacing: 8, color: '#fff', textShadow: '0 2px 20px rgba(0,0,0,.55)', opacity: endP * (1 - endE), filter: `blur(${(1 - endP) * 8 + endE * 8}px)`}}>
          ALFA · AVAILABLE ON ADFLEX.AI
        </div>
      ) : null}
    </AbsoluteFill>
  );
};


/* =========================== TIMELINE =========================== */
export const AlfaPreview: React.FC = () => {
  const {fps} = useVideoConfig();
  const seq = (from: number, to: number) => ({from: Math.round(from * fps), durationInFrames: Math.round((to - from) * fps)});
  return (
    <AbsoluteFill style={{background: '#000'}}>
      <Sequence name="0 · Cold open: VOLT action + ALFA title split" {...seq(0, T.home)}>
        <ColdOpen />
      </Sequence>
      <Sequence name="1 · ALFA home: chips dolly (REAL)" {...seq(T.home, T.type)}>
        <ChipsDolly />
      </Sequence>
      <Sequence name="2 · Typing + send (REAL)" {...seq(T.type, T.work)}>
        <Typing />
      </Sequence>
      <Sequence name="3 · ALFA working (REAL status lines)" {...seq(T.work, T.run)}>
        <Working />
      </Sequence>
      <Sequence name="4 · Approve and run (REAL) + DIVE (bold)" {...seq(T.run, T.volt)}>
        <RunAndDive />
      </Sequence>
      <Sequence name="5 · Action montage: VOLT → KNOCKOUT → DUNE" {...seq(T.volt, T.back)}>
        <Montage />
      </Sequence>
      <Sequence name="6 · Reveal: her desk, high five → loop" {...seq(T.back, T.end)}>
        <Reveal />
      </Sequence>
      <CornerLabel words={['PLANS.', 'MEASURES.', 'LISTENS.']} accent={(s) => (s < T.home + 0.53 ? 0 : s < T.home + 0.83 ? 1 : 2)} at={T.home + 0.2} out={T.type - 0.15} />
      <CornerLabel words={['ONE', 'LINE.']} accent={1} at={T.type + 0.15} out={T.work - 0.15} />
      <CornerLabel words={['IT', 'WORKS.']} accent={1} at={T.work + 0.15} out={T.run - 0.15} />
      <CornerLabel words={['ONE', 'CLICK.']} accent={1} at={T.run + 0.15} out={T.dive - 0.15} />
      <CornerLabel words={['EVERY', 'CLIENT.']} accent={1} sub="VOLT" at={T.volt + 0.2} out={T.ko - 0.1} />
      <CornerLabel words={['EVERY', 'CLIENT.']} accent={1} sub="KNOCKOUT" at={T.ko} out={T.dune - 0.1} />
      <CornerLabel words={['EVERY', 'CLIENT.']} accent={1} sub="DUNE" at={T.dune} out={T.back - 0.15} />
    </AbsoluteFill>
  );
};
