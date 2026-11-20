/*
 * ALFA hero, script v14 = v13 with a new opening: Leen bored at her desk writes to ALFA, then the v13 sequence.
 * Team: «حول البداية لبنت زهقانة وبتكتب لالفا رسالة وبعدها بيصير تسلسل الاحداث هادا». B1 (assets.md) opens the film.
 *
 * From v13: "Get me out of here", and Leen herself carries every transition.
 * Team: «بدي ياك تبين انو الانتقال بيصير مع البنت نفسها». Four generated first/last-frame clips (T1–T4, assets.md) where her
 * body moves from one world into the next: she dives into her laptop and comes out sprinting; falls between the roofs and
 * lands on the ropes; ducks the punch and comes up on the bike in a burst of sand; is thrown off the bike and drops into her
 * chair. Each T clip starts on the exact frame where the world's jam ends, so the joins are invisible.
 * Text in English only (v12). The film is one time-remapped strip of clips: every shot is speed-ramped to its strong part.
 * 1920×1080, 24 fps, silent loop. Spec: ../../production.md "Script v14".
 */
import React from 'react';
import {AbsoluteFill, Audio, Freeze, Img, OffthreadVideo, Sequence, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {C, cond, IN, INOUT, ip, MBlur, OUT} from './lib';
import {FULL, lerpQuad, Pinned, Quad, useSec} from './Preview';
import {G1, project} from './Hero';
import {glyphTime, PromptBox, SendBurst as PixelBurst, typedCount, WakeText} from './PromptBox';

/* ---------- the strip: each segment maps film time → source time with linear keys ([film s, source s]) ---------- */
type Seg = {name: string; src: string; keys: [number, number][]; land?: boolean; screen?: boolean; into?: boolean};
// v12 cut «دخول النص في البداية لازم يكون اكتر حماس… والبنت بتدخل للابتوب بعد البرومت ع طول»: T4 starts as she reaches the
// screen (no lean-in wait) right on the send; the v13 sequence from VOLT on is pushed back by D s.
// v14 cut «شو ستايل موشن تطلع فيه شكل البرومت افضل… اعملو»: the first prompt is a macro on her laptop screen (ScreenPrompt).
// v15 cut «لو خليت مثلا البنت تدخل الشاشة بدل هيك»: T4 (gold burst → sprint) is replaced by T5, a locked-off desk shot where
// the light of her screen pulls her in; VOLT appears on that screen and the screen grows to the frame (IntoScreen).
// v16 cut «طريقة الدخول… اسحبها بشكل اقوى واسرع»: the pull is yanked (up to 4.2×) under a suction rush (camera rushes at the
// screen, radial smear, streaks converging into it, a flare and a kick as she goes in), and the dive is 0.4 s.
// v17 cut «شيل قصة البراندات وخليه كله كانه البنت زهقانة وطلعت جولة»: no clients any more. Bored Leen asks ALFA to take her
// somewhere wild and gets a tour: rooftops, a boxing ring, the desert, home. No client tags, no brand chip; new prompt lines.
const D = 1.95;
const OPENING: Seg[] = [
  // bored: chin on hand, eyes roll (1×) → skim the sigh → the idea, a small smile (1×) → pulls the laptop over, starts typing (3×)
  {name: 'B1: Leen bored at her desk, gets an idea', src: 'b1-bored.mp4', keys: [[0, 0.5], [1.2, 1.7], [1.45, 2.5], [1.85, 2.9], [2.25, 4.1]]},
  {name: 'her screen: macro on ALFA, the message types, send', src: 'screen.mp4', keys: [[2.25, 2.5], [3.95, 4.2]], screen: true},
  // T5: out of the send bloom onto the desk as her screen flares, she leans (2.3×), is yanked in (4.2×), the chair is empty
  {name: 'T5: the screen pulls her in; VOLT grows out of it', src: 't5-into-screen.mp4', keys: [[3.95, 1.5], [4.1, 1.85], [4.36, 2.95], [4.45, 3.1], [4.95, 3.4]], into: true},
];
const V13_REST: Seg[] = [
  {name: 'VOLT: the leap → jam', src: 'act-volt.mp4', keys: [[3.0, 2.2], [3.7, 3.33], [4.7, 3.48], [4.85, 3.6]], land: true},
  {name: 'T1: she falls between the roofs, lands on the ropes', src: 't1-volt-ko.mp4', keys: [[4.85, 0], [5.75, 1.25], [6.3, 2.1]]},
  {name: 'KNOCKOUT: the hook → jam', src: 'act-knockout.mp4', keys: [[6.3, 3.2], [6.8, 4.0], [7.8, 4.15], [7.95, 4.3]], land: true},
  {name: 'T2: she ducks, the gym bursts into sand, she is on the bike', src: 't2-ko-dune.mp4', keys: [[7.95, 0], [9.1, 1.75], [9.5, 2.3]]},
  {name: 'DUNE: up the crest → jam', src: 'act-dune.mp4', keys: [[9.5, 2.0], [10.2, 3.13], [11.2, 3.28], [11.35, 3.4]], land: true},
  {name: 'T3: thrown off the bike, she drops into her chair', src: 't3-dune-desk.mp4', keys: [[11.35, 0], [12.4, 1.5], [13.0, 2.2], [14.2, 3.6], [16.2, 4.9]]}, // (v18) she keeps smiling under the end card
];
// VOLT is already running inside her screen when it fills the frame, so it continues without the landing cut
const SEGS: Seg[] = [...OPENING, ...V13_REST.map((g) => ({...g, land: g.src === 'act-volt.mp4' ? false : g.land, keys: g.keys.map(([t, v]) => [t + D, v] as [number, number])}))];
export const V14_SECONDS = 16.2 + D; // v18: + the 2 s end card

const remap = (keys: [number, number][], t: number) => {
  for (let i = 1; i < keys.length; i++) {
    const [t0, s0] = keys[i - 1], [t1, s1] = keys[i];
    if (t <= t1) return s0 + ((s1 - s0) * (t - t0)) / (t1 - t0);
  }
  return keys[keys.length - 1][1];
};

const At: React.FC<{src: string; t: number}> = ({src, t}) => {
  const {fps} = useVideoConfig();
  return (
    <Freeze frame={Math.max(0, Math.round(Math.min(4.95, t) * fps))}>
      <OffthreadVideo src={staticFile(src)} muted style={{width: 1920, height: 1080, objectFit: 'cover'}} />
    </Freeze>
  );
};

/** One segment: the remapped clip under a camera that never stops (a slow push). A hard cut (`land`) lands out of a small
 * zoom with a 2-frame blur, so the cut reads as the same forward motion (Talent Contest). */
const SegShot: React.FC<{seg: Seg}> = ({seg}) => {
  const s = useSec(); // local
  const t0 = seg.keys[0][0];
  const t = t0 + s;
  const q = seg.land ? ip(s, [0, 0.18], [0, 1], OUT) : 1;
  if (seg.screen) return <ScreenPrompt />;
  if (seg.into) return <IntoScreen seg={seg} />;
  return (
    <AbsoluteFill style={{transform: `scale(${(1.02 + 0.012 * s) * (1 + 0.07 * (1 - q)) * jamPush(t)})`, filter: q < 1 ? `blur(${5 * (1 - q)}px)` : undefined}}>
      <At src={seg.src} t={remap(seg.keys, t)} />
    </AbsoluteFill>
  );
};

/* ---------- the jams: the prompt flies in beside her while time crawls, sends, and she moves ---------- */
type Jam = {at: number; send: number; text: string; box: {x: number; y: number; w: number; side: 'left' | 'right'}; her: [number, number]};
const JAMS: Jam[] = ([
  // `her`: her head at the jam (frame px); the bubble's tail points there and the bubble grows out of her
  {at: 3.7, send: 4.7, text: 'Get me out of here! Somewhere else!', box: {x: 1060, y: 66, w: 600, side: 'right'}, her: [935, 200]},
  {at: 6.8, send: 7.8, text: 'Not a fight! Somewhere calmer!', box: {x: 690, y: 50, w: 600, side: 'left'}, her: [1390, 260]},
  {at: 10.2, send: 11.2, text: 'OK, OK! Take me home!', box: {x: 320, y: 60, w: 600, side: 'left'}, her: [985, 175]},
] as Jam[]).map((j) => ({...j, at: j.at + D, send: j.send + D}));
/** Time-stop amount 0..1 for a jam at film time t. */
const jamG = (j: Jam, t: number) => ip(t, [j.at - 0.05, j.at + 0.2], [0, 1]) * (1 - ip(t, [j.send, j.send + 0.12], [0, 1]));
/** The push while she's stuck; the bubbles ride the same push, so they sit in her world. */
const jamPush = (t: number) => 1 + 0.05 * JAMS.reduce((m, j) => Math.max(m, jamG(j, t)), 0);
const FIRST_TEXT = 'So bored. Take me somewhere wild';

/* ---------- the first prompt: macro dolly on ALFA on her laptop (ui-macro-dolly + accent-typed-prompt) ---------- */
/** Camera keys over the full-frame UI: [u, scale, focus x, focus y]; INOUT between keys, IN into the last (the dive into Send). */
const MK: [number, number, number, number][] = [
  [0, 1, 960, 540], // the UI sits on her screen; the screen grows to the frame (0 → 0.3)
  [0.3, 2.7, 330, 440], // macro on the ALFA mark
  [0.48, 2.7, 1560, 625], // slide along the empty field to Send
  [0.7, 1.3, 760, 540], // pull out onto the start of the line
  [1.02, 1.3, 800, 540], // drift while it types
  [1.14, 1.3, 1180, 540], // the hop to keep up with the text
  [1.42, 1.3, 1230, 545],
  [1.52, 1.45, 1560, 615], // onto Send
  [1.7, 7, 1642, 636], // and through it
];
const mcam = (u: number) => {
  let i = 1;
  while (i < MK.length - 1 && u > MK[i][0]) i++;
  const [u0, s0, x0, y0] = MK[i - 1], [u1, s1, x1, y1] = MK[i];
  const e = (i === MK.length - 1 ? IN : INOUT)(Math.max(0, Math.min(1, (u - u0) / (u1 - u0))));
  return {S: s0 * Math.pow(s1 / s0, e), x: x0 + (x1 - x0) * e, y: y0 + (y1 - y0) * e};
};
const SP_T0 = 0.72, SP_T1 = 1.4, SP_SEND = 1.5; // local (u) times
const SEND_C: [number, number] = [1642, 636];

/** ALFA's input at full frame (1920×1080 design), as it looks on her laptop. */
const AlfaScreen: React.FC<{u: number}> = ({u}) => {
  const chars = Array.from(FIRST_TEXT);
  const n = typedCount(u, SP_T0, SP_T1, chars);
  const caretOn = u < SP_SEND && (n > 0 && n < chars.length ? true : Math.floor(u * 3) % 2 === 0);
  const press = u < SP_SEND ? 1 : 0.84 + 0.16 * ip(u, [SP_SEND, SP_SEND + 0.15], [0, 1], OUT);
  const glow = ip(u, [SP_SEND, SP_SEND + 0.08], [0, 1]);
  return (
    <AbsoluteFill>
      {/* the page runs past the design frame, so the macro moves never show its edge */}
      <div style={{position: 'absolute', left: -2400, top: -1600, width: 6720, height: 4280, background: 'linear-gradient(160deg, #F5F5FA 0%, #F5F5FA 35%, #EEE5FD 50%, #DCC6FB 65%, #DCC6FB 100%)'}} />
      <div style={{position: 'absolute', left: 260, top: 300, width: 1400, height: 480, borderRadius: 240, background: 'radial-gradient(ellipse, rgba(201,90,197,.28), rgba(85,170,255,.16) 50%, rgba(255,255,255,0) 72%)', filter: 'blur(30px)'}} />
      <div style={{position: 'absolute', left: 190, top: 380, width: 1540, height: 320, borderRadius: 40, background: '#fff', border: '1.5px solid rgba(131,55,241,.22)', boxShadow: `0 30px 80px rgba(60,20,120,.18), 0 0 ${60 * glow}px rgba(131,55,241,${0.5 * glow})`}}>
        <div style={{position: 'absolute', left: 50, top: 40, display: 'flex', alignItems: 'center', gap: 12}}>
          <Img src={staticFile('alfa-mark.png')} style={{height: 34}} />
          <span style={{...cond(800, 100), fontSize: 28, letterSpacing: 4, color: '#8337F1'}}>ALFA</span>
        </div>
        <div style={{position: 'absolute', left: 50, top: 108, width: 1440, ...cond(700, 88), fontSize: 64, lineHeight: 1.2, letterSpacing: -0.5, whiteSpace: 'nowrap'}}>
          {n === 0 ? <span style={{color: 'rgba(28,24,36,.32)'}}>Ask ALFA anything…</span> : null}
          <WakeText chars={chars} n={n} s={u} when={(i) => glyphTime(i, SP_T0, SP_T1, chars)} />
          <span style={{display: 'inline-block', width: 5, height: 62, marginLeft: 6, verticalAlign: '-0.12em', borderRadius: 3, background: '#8337F1', opacity: caretOn ? 1 : 0}} />
        </div>
        <div style={{position: 'absolute', left: 50, top: 222, display: 'flex', alignItems: 'center', gap: 16}}>
          <div style={{width: 60, height: 60, borderRadius: 30, border: '1.5px solid rgba(28,24,36,.16)', display: 'flex', alignItems: 'center', justifyContent: 'center', ...cond(500, 100), fontSize: 40, color: 'rgba(28,24,36,.55)'}}>+</div>
        </div>
      </div>
      <div style={{position: 'absolute', left: SEND_C[0] - 48, top: SEND_C[1] - 48, width: 96, height: 96}}>
        <div style={{position: 'absolute', left: 21, top: 21, width: 54, height: 54, scale: '1.9'}}>
          <PixelBurst t={(u - SP_SEND - 0.02) / 0.3} />
        </div>
        <div style={{position: 'absolute', inset: 0, borderRadius: 48, scale: String(press), background: 'linear-gradient(135deg, #9B5BFF, #6730D4)', boxShadow: `0 10px 26px rgba(103,48,212,.45), 0 0 ${60 * glow}px ${12 * glow}px rgba(131,55,241,.7)`, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
          <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 19V5M5 12l7-7 7 7" />
          </svg>
        </div>
      </div>
    </AbsoluteFill>
  );
};

/** 2.25 → 3.95: over her shoulder, her screen shows ALFA; the screen grows to the frame as the camera dives into the ALFA mark,
 * slides along the field to Send, pulls out, the line types with a purple wake and a hop, Send squashes and bursts, and the
 * camera dives through Send into the light (the bloom clears onto T5, her screen pulling her in). */
const ScreenPrompt: React.FC = () => {
  const u = useSec();
  const q = ip(u, [0, 0.3], [0, 1], INOUT);
  const [cx, cy] = project(G1, 960, 540);
  const k = 1 + 0.25 * q; // the footage push toward her screen
  const g1k = G1.map(([x, y]) => [cx + (x - cx) * k, cy + (y - cy) * k]) as Quad;
  const m = mcam(u);
  const vx = Math.abs(mcam(u + 1 / 24).x - m.x) * m.S; // on-screen speed → horizontal smear on the slide and the hop
  const bloom = ip(u, [1.55, 1.7], [0, 1], IN);
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{transformOrigin: `${cx}px ${cy}px`, transform: `scale(${k})`}}>
        <At src="screen.mp4" t={2.5 + u} />
      </AbsoluteFill>
      <Pinned quad={lerpQuad(g1k, FULL, q)}>
        <MBlur id="sp-mb" x={Math.min(40, vx * 0.25)}>
          <AbsoluteFill style={{transformOrigin: `${m.x}px ${m.y}px`, transform: `translate(${960 - m.x}px, ${540 - m.y}px) scale(${m.S})`}}>
            <AlfaScreen u={u} />
          </AbsoluteFill>
        </MBlur>
      </Pinned>
      <AbsoluteFill style={{opacity: bloom, background: 'radial-gradient(circle at 50% 50%, rgba(255,255,255,1) 0%, rgba(255,232,180,.95) 30%, rgba(255,196,100,.6) 60%, rgba(255,190,90,.2) 100%)'}} />
    </AbsoluteFill>
  );
};

/* ---------- v15: she goes into her screen ---------- */
// laptop screen corners in t5-into-screen.mp4 (1280×720), measured from the white screen at 2.9, 3.2, 4.0, 4.9 s (±1 px), ×1.5
const T5Q = ([[207, 338], [480, 329], [537, 528], [272, 592]] as [number, number][]).map(([x, y]) => [x * 1.5, y * 1.5]) as Quad;
const T5_AT = 3.95, T5_YANK = 4.36, T5_GROW = 4.45; // T5_YANK: she is gone into the screen
const VOLT_AT = 3.0 + D, VOLT_SRC = 2.2, VOLT_RATE = 1.6; // the VOLT segment's first key and speed (V13_REST)
const fr = (v: number) => v - Math.floor(v);
const STREAKS = Array.from({length: 20}, (_, i) => {
  const r = Math.sin(i * 12.9898 + 4.1) * 43758.5453;
  // angles fan from the screen toward her (right and up), radius past the frame edge
  return {a: ((-95 + 135 * fr(r)) * Math.PI) / 180, R: 800 + 700 * fr(r * 1.7), ph: fr(r * 3.1), len: 140 + 260 * fr(r * 5.3), w: 2 + 4 * fr(r * 7.7)};
});
/** Light streaks rushing into the screen centre, accelerating as they arrive. */
const Streaks: React.FC<{t: number; c: [number, number]; pull: number}> = ({t, c, pull}) => (
  <svg width={1920} height={1080} style={{position: 'absolute', left: 0, top: 0, opacity: pull}}>
    {STREAKS.map((k, i) => {
      const p = fr(k.ph + (t - T5_AT) * 3.4);
      const head = k.R * Math.pow(1 - p, 1.6), tail = head + k.len * (1 - p * 0.6);
      const [x0, y0, x1, y1] = [c[0] + Math.cos(k.a) * tail, c[1] + Math.sin(k.a) * tail, c[0] + Math.cos(k.a) * head, c[1] + Math.sin(k.a) * head];
      const o = Math.min(1, p * 5) * Math.pow(1 - p, 0.4);
      return (
        <g key={i} opacity={o} strokeLinecap="round">
          <line x1={x0} y1={y0} x2={x1} y2={y1} stroke="rgba(255,206,120,.45)" strokeWidth={k.w * 4} />
          <line x1={x0} y1={y0} x2={x1} y2={y1} stroke="rgba(255,252,240,.95)" strokeWidth={k.w} />
        </g>
      );
    })}
  </svg>
);
/** 3.95 → 4.95: the send bloom clears from her screen outward onto the desk; she leans in and the screen yanks her in under
 * a suction rush (the camera rushes at the screen, a radial smear, streaks converging, a flare and a kick as she goes);
 * VOLT (her run-up to the edge) comes up on the screen out of the flare, and the camera dives into the screen until it is
 * the frame, mid-run, where the VOLT segment carries on. */
const IntoScreen: React.FC<{seg: Seg}> = ({seg}) => {
  const t = T5_AT + useSec();
  const [cx, cy] = project(T5Q, 960, 540);
  const pull = ip(t, [4.0, 4.2, T5_YANK, T5_YANK + 0.08], [0, 1, 1, 0]);
  const q = ip(t, [T5_GROW, VOLT_AT], [0, 1], INOUT);
  const k = (1.02 + 0.22 * ip(t, [4.0, T5_YANK], [0, 1], IN)) * Math.pow(3.6, q); // the rush at the screen, then the dive
  const qk = T5Q.map(([x, y]) => [cx + (x - cx) * k, cy + (y - cy) * k]) as Quad;
  const u = t - T5_YANK, d = u > 0 ? Math.exp(-u * 18) * 16 : 0; // the kick as she goes in
  const show = ip(t, [T5_YANK - 0.04, T5_YANK + 0.06], [0, 1]);
  const flash = ip(t, [T5_YANK - 0.04, T5_YANK, T5_YANK + 0.25], [0, 1, 0]);
  const flare = ip(t, [4.22, T5_YANK, T5_YANK + 0.2], [0, 0.55, 0]);
  const clear = ip(t, [T5_AT, T5_AT + 0.2], [1, 0], OUT);
  const src = remap(seg.keys, t);
  return (
    <AbsoluteFill style={{transform: `translate(${Math.sin(u * 90) * d}px, ${Math.cos(u * 75) * d * 0.6}px)`}}>
      <AbsoluteFill style={{transformOrigin: `${cx}px ${cy}px`, transform: `scale(${k})`, filter: q > 0.02 && q < 0.98 ? `blur(${5 * Math.sin(Math.PI * q)}px)` : undefined}}>
        <At src={seg.src} t={src} />
        {pull > 0.01
          ? [1, 2, 3].map((i) => (
              <AbsoluteFill key={i} style={{transformOrigin: `${cx}px ${cy}px`, transform: `scale(${1 + 0.05 * i * pull})`, opacity: 0.2 * pull}}>
                <At src={seg.src} t={src} />
              </AbsoluteFill>
            ))
          : null}
      </AbsoluteFill>
      {pull > 0.01 ? <Streaks t={t} c={[cx, cy]} pull={pull} /> : null}
      {flare > 0.001 ? <AbsoluteFill style={{opacity: flare, mixBlendMode: 'screen', background: `radial-gradient(circle at ${cx}px ${cy}px, rgba(255,255,255,1) 0%, rgba(255,226,160,.7) 22%, rgba(255,190,90,0) 55%)`}} /> : null}
      {show > 0 ? (
        <Pinned quad={lerpQuad(qk, FULL, q)}>
          <AbsoluteFill style={{opacity: show, transform: 'scale(1.02)'}}>
            <At src="act-volt.mp4" t={VOLT_SRC + VOLT_RATE * (t - VOLT_AT)} />
          </AbsoluteFill>
          <AbsoluteFill style={{background: '#fff', opacity: flash}} />
        </Pinned>
      ) : null}
      {clear > 0.001 ? (
        <AbsoluteFill style={{opacity: clear, background: `radial-gradient(circle at ${cx}px ${cy}px, rgba(255,255,255,1) 0%, rgba(255,232,180,.95) 30%, rgba(255,196,100,.6) 60%, rgba(255,190,90,.2) 100%)`}} />
      ) : null}
    </AbsoluteFill>
  );
};

/** Time-stop grade while she's stuck: a little push, desaturate, a lavender pulse when it starts. */
const JamGrade: React.FC<{jam: Jam}> = ({jam}) => {
  const s = useSec();
  const g = ip(s, [jam.at - 0.05, jam.at + 0.2], [0, 1]) * (1 - ip(s, [jam.send, jam.send + 0.12], [0, 1]));
  return (
    <>
      <AbsoluteFill style={{backdropFilter: g > 0.01 ? `saturate(${1 - 0.3 * g}) brightness(${1 - 0.1 * g})` : undefined}} />
      <AbsoluteFill style={{background: C.accent, mixBlendMode: 'screen', opacity: ip(s, [jam.at - 0.05, jam.at + 0.03, jam.at + 0.25], [0, 0.2, 0])}} />
    </>
  );
};

/** Flare wash: one or two frames of haze with a soft diagonal beam. */
const Haze: React.FC<{at: number; len?: number}> = ({at, len = 0.08}) => {
  const s = useSec();
  const o = ip(s, [at - 0.02, at, at + len], [0, 1, 0]);
  return o > 0.001 ? <AbsoluteFill style={{opacity: o, background: 'linear-gradient(115deg, rgba(255,250,244,.35) 20%, rgba(255,255,255,.85) 48%, rgba(235,222,255,.45) 70%)'}} /> : null;
};

/** v18 end card «لقطة الختمة» (2 s, hero rules): her desk blurs and dims; the AdFlex logo drops in, ALFA rises letter by
 * letter, the end-card line types on (CLAUDE.md: AdFlex works with the AI you already use), the integrations come up small
 * and equal-weight, and the end line sits at the bottom. It clears into a dim hand-off to frame 0 (the title slam over her). */
const CARD_SPRING = {mass: 0.6, stiffness: 210, damping: 15};
const EndCard: React.FC<{at: number}> = ({at}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const s = f / fps;
  const p = ip(s, [at, at + 0.35], [0, 1], OUT);
  const e = ip(s, [V14_SECONDS - 0.4, V14_SECONDS - 0.15], [0, 1], IN);
  const line = 'WORKS WITH THE AI YOU ALREADY USE';
  const lineN = Math.floor(ip(s, [at + 0.4, at + 0.4 + line.length * 0.012], [0, line.length]));
  const fade = (t0: number) => ip(s, [at + t0, at + t0 + 0.2], [0, 1]);
  const drop = (t0: number) => -24 * (1 - ip(s, [at + t0, at + t0 + 0.3], [0, 1], OUT));
  return (
    <>
      {p > 0 ? <AbsoluteFill style={{backdropFilter: `blur(${16 * p * (1 - e)}px) brightness(${1 - 0.5 * p * (1 - e)}) saturate(${1 - 0.3 * p * (1 - e)})`}} /> : null}
      {p > 0 && e < 1 ? (
        <AbsoluteFill style={{opacity: 1 - e, filter: e > 0 ? `blur(${e * 10}px)` : undefined, color: '#fff', textShadow: '0 6px 40px rgba(0,0,0,.35)'}}>
          <AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 50%, rgba(60,20,110,.35), rgba(10,5,15,0) 65%)', opacity: p}} />
          <div style={{position: 'absolute', top: 270, width: 1920, display: 'flex', justifyContent: 'center', opacity: fade(0.05), translate: `0 ${drop(0.05)}px`}}>
            <Img src={staticFile('adflex-logo.png')} style={{height: 46, filter: 'brightness(0) invert(1)'}} />
          </div>
          <div style={{position: 'absolute', top: 345, width: 1920, display: 'flex', justifyContent: 'center', ...cond(900, 125), fontSize: 280, lineHeight: 1, letterSpacing: -3}}>
            {['A', 'L', 'F', 'A'].map((c, i) => {
              const q = spring({frame: f - Math.round((at + 0.1 + i * 0.045) * fps), fps, config: CARD_SPRING});
              return <span key={i} style={{display: 'inline-block', opacity: Math.min(1, q * 2), translate: `0 ${70 * (1 - q)}px`}}>{c}</span>;
            })}
          </div>
          <div style={{position: 'absolute', top: 680, width: 1920, textAlign: 'center', ...cond(700, 110), fontSize: 32, letterSpacing: 9, whiteSpace: 'pre'}}>
            {line.slice(0, lineN)}
            <span style={{opacity: 0}}>{line.slice(lineN)}</span>
          </div>
          <div style={{position: 'absolute', top: 742, width: 1920, textAlign: 'center', ...cond(600, 100), fontSize: 24, letterSpacing: 5, color: 'rgba(255,255,255,.7)', opacity: fade(0.75)}}>
            CLAUDE · CHATGPT · MCP
          </div>
          <div style={{position: 'absolute', bottom: 70, width: 1920, textAlign: 'center', ...cond(700, 110), fontSize: 26, letterSpacing: 8, opacity: fade(0.85)}}>
            ALFA · AVAILABLE ON ADFLEX.AI
          </div>
        </AbsoluteFill>
      ) : null}
      <AbsoluteFill style={{background: 'rgba(10,5,15,1)', opacity: ip(s, [V14_SECONDS - 0.3, V14_SECONDS], [0, 0.35])}} />
    </>
  );
};

/** Frame 0 picks up the end's dimming (0.35) and eases out of it, so the loop has no brightness jump. */
const LoopIn: React.FC = () => {
  const s = useSec();
  const o = ip(s, [0, 0.35], [0.35, 0]);
  return o > 0 ? <AbsoluteFill style={{background: 'rgba(10,5,15,1)', opacity: o}} /> : null;
};

/* ---------- v12: the title slams in ---------- */
const SLAM = {mass: 0.5, stiffness: 230, damping: 10}; // fast, with an overshoot that squashes the letter on landing
// v13 cut «الفا بتطلع من اول ثانية فوق البنت»: the title opens the film over bored Leen, left of her face (T_CX).
const T_AT = 0.12, T_OUT = 1.15, T_STAG = 0.055, T_CX = 680;
/** Camera shake: a kick on each letter's landing, decaying in ~0.15 s. */
const shakeAt = (s: number) => {
  let x = 0, y = 0;
  for (let i = 0; i < 4; i++) {
    const u = s - (T_AT + i * T_STAG + 0.07);
    if (u > 0 && u < 0.2) {
      const d = Math.exp(-u * 22) * (i === 3 ? 14 : 7);
      x += Math.sin(u * 95 + i) * d;
      y += Math.cos(u * 80 + i * 2) * d * 0.7;
    }
  }
  return {x, y};
};
/** ALFA: each letter springs in from 2.8× with blur, lands with a squash; a flash and a purple shockwave on the last;
 * the lockup drops in, the line types on; on exit the whole title punches at the camera. */
const TitleSlam: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const s = f / fps;
  if (s < T_AT || s > T_OUT + 0.25) return null;
  const ex = ip(s, [T_OUT, T_OUT + 0.18], [0, 1], IN);
  const lastLand = T_AT + 3 * T_STAG + 0.07;
  const ring = ip(s, [lastLand, lastLand + 0.45], [0, 1], OUT);
  const sub = 'YOUR AI MARKETING AGENT';
  const subN = Math.floor(ip(s, [T_AT + 0.25, T_AT + 0.25 + sub.length * 0.012], [0, sub.length]));
  return (
    <AbsoluteFill style={{transform: `scale(${1 + 0.8 * ex})`, opacity: 1 - ex, filter: ex > 0 ? `blur(${ex * 16}px)` : undefined}}>
      <AbsoluteFill style={{background: `radial-gradient(ellipse at ${T_CX}px 520px, rgba(40,12,80,.45), rgba(10,5,15,.12) 60%, rgba(10,5,15,0) 85%)`, opacity: ip(s, [T_AT, T_AT + 0.08], [0, 1])}} />
      <AbsoluteFill style={{translate: `${T_CX - 960}px 0`}}>
      {ring > 0 && ring < 1 ? (
        <div style={{position: 'absolute', left: 960 - 1300 * ring, top: 520 - 1300 * ring, width: 2600 * ring, height: 2600 * ring, borderRadius: '50%', border: `${10 * (1 - ring) + 2}px solid rgba(185,140,255,${0.8 * (1 - ring)})`, boxShadow: `0 0 60px rgba(131,55,241,${0.6 * (1 - ring)})`}} />
      ) : null}
      <div style={{position: 'absolute', top: 250, width: 1920, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 16, opacity: ip(s, [T_AT + 0.2, T_AT + 0.32], [0, 1]), translate: `0 ${-30 * (1 - ip(s, [T_AT + 0.2, T_AT + 0.4], [0, 1], OUT))}px`}}>
        <Img src={staticFile('adflex-logo.png')} style={{height: 40, filter: 'brightness(0) invert(1)'}} />
        <span style={{...cond(500, 100), fontSize: 30, color: 'rgba(255,255,255,.85)', letterSpacing: 4}}>AGENT</span>
      </div>
      <div style={{position: 'absolute', top: 330, width: 1920, display: 'flex', justifyContent: 'center', ...cond(900, 125), fontSize: 380, lineHeight: 1, color: '#fff', letterSpacing: -4}}>
        {['A', 'L', 'F', 'A'].map((c, i) => {
          const p = spring({frame: f - Math.round((T_AT + i * T_STAG) * fps), fps, config: SLAM});
          if (p <= 0.001) return <span key={i} style={{opacity: 0}}>{c}</span>;
          return (
            <span key={i} style={{display: 'inline-block', transform: `scale(${2.8 - 1.8 * p})`, transformOrigin: '50% 60%', opacity: Math.min(1, p * 3), filter: p < 0.9 ? `blur(${(1 - p) * 16}px)` : undefined, textShadow: `0 10px 60px rgba(0,0,0,.35), 0 0 ${50 * Math.max(0, 1 - Math.abs(p - 1) * 4)}px rgba(185,140,255,.9)`}}>
              {c}
            </span>
          );
        })}
      </div>
      <div style={{position: 'absolute', top: 760, width: 1920, textAlign: 'center', ...cond(700, 110), fontSize: 30, letterSpacing: 10, color: 'rgba(255,255,255,.92)', whiteSpace: 'pre'}}>
        {sub.slice(0, subN)}
        <span style={{opacity: 0}}>{sub.slice(subN)}</span>
      </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
/** Gold-white burst on send: carries into the bloom that clears onto T5. */
const SendBurst: React.FC<{at: number}> = ({at}) => {
  const s = useSec();
  const o = ip(s, [at, at + 0.06, at + 0.22], [0, 1, 0]);
  return o > 0.001 ? <AbsoluteFill style={{opacity: o, background: 'radial-gradient(circle at 45% 45%, rgba(255,255,255,1) 0%, rgba(255,228,170,.9) 25%, rgba(255,190,90,.35) 55%, rgba(255,190,90,0) 80%)'}} /> : null;
};

/** The jam bubbles, riding the scene's jam push (same origin), so they stay where she is. */
const BubbleLayer: React.FC = () => {
  const t = useSec();
  return (
    <AbsoluteFill style={{transform: `scale(${1.02 * jamPush(t)})`}}>
      {JAMS.map((j, i) => (
        <PromptBox key={i} text={j.text} {...j.box} lang="en" from={j.her} at={j.at + 0.04} send={j.send} out={j.send + 0.1} />
      ))}
    </AbsoluteFill>
  );
};

/* ---------- v19 sound «حط الموسيقى»: the arranged bed (make_music.sh) and a few cues from existing SFX ---------- */
// The website plays it muted (render with SILENT=1 for the site file); the sound is for viewers who unmute and the social cut.
const CUES: {at: number; src: string; vol: number}[] = [
  {at: 2.95, src: 'audio/riser.mp3', vol: 0.4}, // peaks at 1.0 s: builds into the drop as her screen pulls her in
  {at: 3.75, src: 'audio/click.wav', vol: 0.6}, // Send on the ALFA screen
  {at: T5_YANK - 0.08, src: 'audio/whoosh.mp3', vol: 0.8}, // yanked into the screen
  ...JAMS.map((j) => ({at: j.send, src: 'audio/click.wav', vol: 0.5})), // each bubble's send
  {at: 14.25 + D, src: 'audio/impact.mp3', vol: 0.5}, // ALFA lands on the end card
  /* v20 «الساوند افيكت لانتقالات البنت»: one cue per Leen transition (2026-11-19 SFX, already paid). gen-whoosh peaks 0.42 s in;
     times are measured on v19 frames. Film time = clip key + D for everything after the opening. */
  {at: 1.85, src: 'audio/gen-whoosh.mp3', vol: 0.5}, // 2.27: cut from Leen to her screen
  {at: 3.9, src: 'audio/gen-sparkle.mp3', vol: 0.9}, // the send bloom
  {at: T5_YANK, src: 'audio/gen-boom.mp3', vol: 0.45}, // the kick as she goes into the screen
  {at: 4.33, src: 'audio/gen-whoosh.mp3', vol: 0.55}, // 4.75: the dive through the laptop into VOLT
  ...JAMS.map((j) => ({at: j.at, src: 'audio/gen-pop.mp3', vol: 1})), // each bubble pops up
  {at: 7.4, src: 'audio/gen-whoosh.mp3', vol: 0.6}, // 7.82: T1, she falls between the roofs
  {at: 8.15, src: 'audio/gen-boom.mp3', vol: 0.4}, // lands on the ropes
  {at: 8.3, src: 'audio/gen-slam.mp3', vol: 0.65}, // the hook
  {at: 10.33, src: 'audio/gen-whoosh.mp3', vol: 0.5}, // 10.75: T2, she ducks
  {at: 10.85, src: 'audio/gen-boom.mp3', vol: 0.55}, // the gym bursts into sand
  {at: 13.3, src: 'audio/gen-whoosh.mp3', vol: 0.6}, // 13.72: T3, thrown off the bike
  {at: 14.05, src: 'audio/gen-boom.mp3', vol: 0.85}, // the crash in the sand
  {at: 14.25, src: 'audio/gen-sparkle.mp3', vol: 0.3}, // the sand turns into her office
  {at: 14.5, src: 'audio/gen-slam.mp3', vol: 0.6}, // she drops into her chair
];
const Sound: React.FC = () => {
  const {fps} = useVideoConfig();
  // the bed dips while time crawls in a jam, and comes back on the send
  const duck = (f: number) => JAMS.reduce((m, j) => Math.max(m, jamG(j, f / fps)), 0);
  return (
    <>
      <Audio src={staticFile('audio/trip-bed.wav')} volume={(f) => 0.9 * (1 - 0.45 * duck(f))} />
      {CUES.map((c, i) => (
        <Sequence key={i} from={Math.round(c.at * fps)} durationInFrames={Math.round(1.6 * fps)} layout="none">
          <Audio src={staticFile(c.src)} volume={c.vol} />
        </Sequence>
      ))}
    </>
  );
};

/* =========================== TIMELINE =========================== */
export const AlfaHeroV14: React.FC = () => {
  const {fps} = useVideoConfig();
  const F = (t: number) => Math.round(t * fps);
  const sh = shakeAt(useSec());
  return (
    <AbsoluteFill style={{background: '#000', transform: `translate(${sh.x}px, ${sh.y}px) scale(${sh.x || sh.y ? 1.02 : 1})`}}>
      {SEGS.map((seg, i) => {
        const from = seg.keys[0][0];
        const to = i + 1 < SEGS.length ? SEGS[i + 1].keys[0][0] : V14_SECONDS;
        return (
          <Sequence key={i} name={seg.name} from={F(from)} durationInFrames={F(to) - F(from)}>
            <SegShot seg={seg} />
          </Sequence>
        );
      })}
      {JAMS.map((j, i) => (
        <JamGrade key={`g${i}`} jam={j} />
      ))}
      <TitleSlam />
      <Haze at={T_AT} len={0.06} />
      <BubbleLayer />
      <SendBurst at={3.89} />
      <EndCard at={14.2 + D} />
      <LoopIn />
      <Sound />
    </AbsoluteFill>
  );
};
