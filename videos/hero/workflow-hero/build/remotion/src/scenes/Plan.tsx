import React from 'react';
import {AbsoluteFill, Sequence, useCurrentFrame} from 'remotion';

import {C as COL, Clip, INOUT, ip, Mark, OUT, springAt, Still, UI, WAKE} from '../lib';
import {BUILD_VIEW} from './Build';

/*
 * v14: ALFA plans it, on the real recording (alfa-plan.mp4, Take A2, 1464x994, sidebar cropped), in 3D.
 *   A  status-line zoom: ALFA's real status "Understanding the request…" fills the frame and slides, then snaps
 *      back to the real chat (tilted panel, clip 0+).
 *   B  the real "Run this plan? · Free · Approve and run" card lifts off the page toward the camera; punch-in onto
 *      Approve; the button sinks under the click and springs back lit, a lavender ring goes out from it (clip 80+,
 *      the click at clip 93).
 *   C  the reply (clip 184, settled): the tilted page slides down the three outputs ALFA names (each gets a sweep),
 *      flattens onto the real workflow card, "Open workflow" lights, and the card opens up into the canvas
 *      (card → full bleed): the last frame is exactly Build's first.
 */
export const A = 18;
export const B = 27;
export const C = 30;
export const END = A + B + C;
export const CLICK = A + 13; // the Approve click (Sound.tsx)
export const OPEN = A + B + 21; // the workflow card starts opening (Sound.tsx)
const STATUS = 9; // the giant status line, then the snap back
export const STATUS_AT = 0;
const W = 1464;
const H = 994;

type Frame = {cx: number; cy: number; z: number};
const mix = (a: Frame, b: Frame, t: number): Frame => ({cx: a.cx + (b.cx - a.cx) * t, cy: a.cy + (b.cy - a.cy) * t, z: a.z + (b.z - a.z) * t});

/** The recording as a panel in 3D: (cx, cy) of the clip at the frame centre, scaled z, then turned rx/ry about the centre. */
const View3D: React.FC<{fr: Frame; rx: number; ry: number; children: React.ReactNode}> = ({fr, rx, ry, children}) => (
  <AbsoluteFill style={{background: '#0d0b14', perspective: 1800, overflow: 'hidden'}}>
    <AbsoluteFill style={{transformStyle: 'preserve-3d', transform: `rotateX(${rx}deg) rotateY(${ry}deg)`}}>
      <div style={{position: 'absolute', left: 0, top: 0, width: W, height: H, transformOrigin: '0 0', transform: `translate(${960 - fr.cx * fr.z}px, ${540 - fr.cy * fr.z}px) scale(${fr.z})`, transformStyle: 'preserve-3d'}}>
        {children}
      </div>
    </AbsoluteFill>
  </AbsoluteFill>
);

type R = {x: number; y: number; w: number; h: number};
/** A rect of the recording cut out as its own layer (the same clip, offset), so it can lift, press or glow. */
const Cut: React.FC<{r: R; trim?: number; still?: number; radius?: number; style?: React.CSSProperties}> = ({r, trim, still, radius = 12, style}) => (
  <div style={{position: 'absolute', left: r.x, top: r.y, width: r.w, height: r.h, overflow: 'hidden', borderRadius: radius, ...style}}>
    {still !== undefined ? (
      <Still src="alfa-plan.mp4" frame={still} style={{position: 'absolute', left: -r.x, top: -r.y, width: W, height: H}} />
    ) : (
      <Clip src="alfa-plan.mp4" trimBefore={trim} style={{position: 'absolute', left: -r.x, top: -r.y, width: W, height: H}} />
    )}
  </div>
);

/* ---------- A: status line ---------- */
const StatusLine: React.FC = () => {
  const f = useCurrentFrame();
  const x = ip(f, [0, STATUS], [140, -40]);
  const text = 'Understanding the request…';
  const n = Math.min(text.length, Math.floor(ip(f, [0, 6], [9, text.length])));
  return (
    <AbsoluteFill style={{background: 'radial-gradient(ellipse 80% 70% at 30% 40%, #2a1b4a, #0d0b14 70%)', overflow: 'hidden'}}>
      <div style={{position: 'absolute', left: 90 + x, top: 455, display: 'flex', alignItems: 'center', gap: 34, whiteSpace: 'pre'}}>
        <div style={{position: 'relative', width: 120, height: 120}}>
          <Mark x={60} y={60} s={1.9} />
        </div>
        <div style={{fontFamily: UI, fontWeight: 600, fontSize: 118, color: '#e9e4f5', letterSpacing: -2}}>{text.slice(0, n)}</div>
      </div>
    </AbsoluteFill>
  );
};

/* ---------- B: the approve card ---------- */
const CARD: R = {x: 313, y: 669, w: 838, h: 191};
const BTN: R = {x: 998, y: 808, w: 137, h: 37};
const FB: Frame = {cx: 760, cy: 765, z: 1.55};
const PUNCH: Frame = {cx: 1010, cy: 815, z: 2.9};
const B_PUNCH = 9;
const B_TRIM = 80;
const B_CLICK = 13;

const Approve: React.FC = () => {
  const f = useCurrentFrame();
  const lift = springAt(f, 0, 14);
  const punched = f >= B_PUNCH;
  const fr = punched ? PUNCH : FB;
  const drift = 1 + 0.04 * ip(f, [0, B], [0, 1], INOUT);
  const tilt = punched ? 0.35 : 1 - 0.3 * ip(f, [0, B_PUNCH], [0, 1], INOUT);
  // the press: sinks for 2 frames, springs back slightly larger and lit
  const press = f < B_CLICK ? 1 : f < B_CLICK + 2 ? 0.94 : 1 + 0.04 * (1 - springAt(f, B_CLICK + 2, 12)) + 0.02;
  const lit = ip(f, [B_CLICK, B_CLICK + 2, B_CLICK + 14], [0, 1, 0.45]);
  const ring = ip(f, [B_CLICK, B_CLICK + 14], [0, 1], OUT);
  return (
    <View3D fr={{...fr, z: fr.z * drift}} rx={9 * tilt} ry={10 * tilt}>
      <Clip src="alfa-plan.mp4" trimBefore={B_TRIM} style={{position: 'absolute', width: W, height: H}} />
      <div style={{position: 'absolute', left: 0, top: 0, width: W, height: H, background: `rgba(8,6,14,${0.45 * lift})`}} />
      <div style={{position: 'absolute', left: 0, top: 0, width: W, height: H, transformStyle: 'preserve-3d', transform: `translateZ(${70 * lift}px)`}}>
        <Cut r={CARD} trim={B_TRIM} radius={12} style={{boxShadow: `0 ${40 * lift}px ${90 * lift}px rgba(0,0,0,.6), 0 0 0 1.5px rgba(185,150,255,${0.55 * lift})`}} />
        <div style={{position: 'absolute', left: BTN.x, top: BTN.y, width: BTN.w, height: BTN.h, scale: String(press), borderRadius: 8, boxShadow: `0 0 ${30 * lit}px ${8 * lit}px rgba(131,55,241,${0.7 * lit})`}}>
          <Cut r={BTN} trim={B_TRIM} radius={8} style={{left: 0, top: 0, filter: `brightness(${1 + 0.6 * lit})`}} />
        </div>
        {ring > 0 && ring < 1 ? (
          <div style={{position: 'absolute', left: BTN.x + BTN.w / 2 - 20 - 160 * ring, top: BTN.y + BTN.h / 2 - 20 - 160 * ring, width: 40 + 320 * ring, height: 40 + 320 * ring, borderRadius: '50%', border: `${3 * (1 - ring) + 1}px solid ${COL.lav}`, opacity: Math.exp(-3 * ring), boxShadow: `0 0 24px ${WAKE}`}} />
        ) : null}
      </div>
    </View3D>
  );
};

/* ---------- C: the reply → the workflow card opens into the canvas ---------- */
const LINES = [
  {y: 96, w: 560},
  {y: 156, w: 640},
  {y: 215, w: 520},
];
const WCARD: R = {x: 58, y: 413, w: 657, h: 299};
const LINK: R = {x: 214, y: 655, w: 98, h: 24}; // "Open workflow"
const C_TOP: Frame = {cx: 400, cy: 190, z: 1.6};
const C_CARD: Frame = {cx: WCARD.x + WCARD.w / 2, cy: WCARD.y + WCARD.h / 2, z: 1.55};
const SLIDE: [number, number] = [10, 19];
const C_OPEN = 21;

const Reply: React.FC = () => {
  const f = useCurrentFrame();
  const t = ip(f, SLIDE, [0, 1], INOUT);
  const fr = mix(C_TOP, C_CARD, t);
  const tilt = 1 - t;
  const link = ip(f, [SLIDE[1] - 2, C_OPEN], [0, 1]);
  // the card's on-screen rect once flat, then it opens to the full frame
  const o = ip(f, [C_OPEN, C], [0, 1], INOUT);
  const s = {x: (WCARD.x - C_CARD.cx) * C_CARD.z + 960, y: (WCARD.y - C_CARD.cy) * C_CARD.z + 540, w: WCARD.w * C_CARD.z, h: WCARD.h * C_CARD.z};
  const r = {x: s.x * (1 - o), y: s.y * (1 - o), w: s.w + (1920 - s.w) * o, h: s.h + (1080 - s.h) * o};
  return (
    <AbsoluteFill>
      <View3D fr={fr} rx={7 * tilt} ry={-13 * tilt}>
        <Still src="alfa-plan.mp4" frame={184} style={{position: 'absolute', width: W, height: H}} />
        {LINES.map((l, i) => {
          const p = ip(f, [1 + i * 3, 8 + i * 3], [0, 1], OUT);
          return p > 0 ? (
            <div key={i} style={{position: 'absolute', left: 40, top: l.y - 12, width: l.w * p, height: 26, borderRadius: 6, background: 'linear-gradient(90deg, rgba(131,55,241,.32), rgba(131,55,241,.12))', boxShadow: `inset 3px 0 0 ${WAKE}`, mixBlendMode: 'screen'}} />
          ) : null;
        })}
        {/* the real card lifts a little as the camera arrives, "Open workflow" lights up */}
        <div style={{position: 'absolute', left: WCARD.x - 2, top: WCARD.y - 2, width: WCARD.w + 4, height: WCARD.h + 4, borderRadius: 14, boxShadow: `0 0 0 2px rgba(185,150,255,${0.8 * t}), 0 0 50px rgba(131,55,241,${0.45 * t})`}} />
        {link > 0 ? <div style={{position: 'absolute', left: LINK.x - 6, top: LINK.y - 3, width: LINK.w + 12, height: LINK.h + 6, borderRadius: 6, background: `rgba(185,150,255,${0.28 * link})`, boxShadow: `0 0 18px rgba(131,55,241,${0.6 * link})`}} /> : null}
      </View3D>
      {o > 0 ? (
        <div style={{position: 'absolute', left: r.x, top: r.y, width: r.w, height: r.h, overflow: 'hidden', borderRadius: 18 * (1 - o), boxShadow: '0 30px 90px rgba(0,0,0,.6)'}}>
          <div style={{position: 'absolute', left: -r.x, top: -r.y, width: 1920, height: 1080}}>
            <BUILD_VIEW />
          </div>
          {/* the card's own pixels fade off as it opens */}
          <div style={{position: 'absolute', inset: 0, opacity: ip(o, [0, 0.45], [1, 0])}}>
            <div style={{position: 'absolute', left: 0, top: 0, width: WCARD.w, height: WCARD.h, transformOrigin: '0 0', scale: `${r.w / WCARD.w} ${r.h / WCARD.h}`}}>
              <Still src="alfa-plan.mp4" frame={184} style={{position: 'absolute', left: -WCARD.x, top: -WCARD.y, width: W, height: H}} />
            </div>
          </div>
        </div>
      ) : null}
    </AbsoluteFill>
  );
};

export const Plan: React.FC = () => {
  const f = useCurrentFrame();
  const snap = ip(f, [STATUS, A], [0, 1], INOUT);
  return (
    <AbsoluteFill>
      <Sequence durationInFrames={STATUS} layout="none">
        <StatusLine />
      </Sequence>
      <Sequence from={STATUS} durationInFrames={A - STATUS} layout="none">
        <View3D fr={{cx: 640, cy: 230, z: 1.9 - 0.3 * snap}} rx={8} ry={-12 + 4 * snap}>
          <Clip src="alfa-plan.mp4" style={{position: 'absolute', width: W, height: H}} />
        </View3D>
      </Sequence>
      <Sequence from={A} durationInFrames={B} layout="none">
        <Approve />
      </Sequence>
      <Sequence from={A + B} layout="none">
        <Reply />
      </Sequence>
    </AbsoluteFill>
  );
};
