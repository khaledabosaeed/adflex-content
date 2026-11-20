/*
 * ALFA hero, script v7: every shot is footage (generated clips, see ../../assets.md); graphics only in cuts and text.
 * ALFA's UI appears only on Leen's laptop screen: the existing recordings corner-pinned into the clips.
 * 17 s, 1920×1080, 24 fps, silent loop. Spec: ../../production.md "Script v7".
 */
import React from 'react';
import {AbsoluteFill, Freeze, Img, OffthreadVideo, Sequence, staticFile, useVideoConfig} from 'remotion';
import {Cam, cond, IN, INOUT, ip, OUT, Streaks} from './lib';
import {ALFA_BG, CornerLabel, EXIT, FULL, HomeFrame, lerpQuad, Pinned, Quad, SCREEN as C1_SCREEN, SCREEN_C as C1_SCREEN_C, useSec} from './Preview';

/* ---------- timeline (absolute seconds) ---------- */
const T = {s1: 1.6, s2: 2.6, s3: 3.6, s3b: 4.1, s4: 4.6, s5: 5.6, s6: 6.6, dive: 7.4, s7: 8.2, ko: 9.5, dune: 10.7, s8: 12.0, end: 17};

/* ---------- footage ---------- */
/** A generated clip (1280×720) filling the frame, starting `from` seconds into the source. */
export const Clip: React.FC<{src: string; from?: number; rate?: number; freeze?: boolean}> = ({src, from = 0, rate = 1, freeze}) => {
  const {fps} = useVideoConfig();
  const v = <OffthreadVideo src={staticFile(src)} muted trimBefore={Math.round(from * fps)} playbackRate={rate} style={{width: 1920, height: 1080, objectFit: 'cover'}} />;
  return <AbsoluteFill>{freeze ? <Freeze frame={0}>{v}</Freeze> : v}</AbsoluteFill>;
};

/* ---------- Leen's screen (clip G1, screen.mp4): corners measured at 0, 1.5, 3, 4.9 s (±1 px), ×1.5 to 1920 ---------- */
export const G1: Quad = [[376 * 1.5 + 1, 65 * 1.5 + 1], [1106 * 1.5 - 1, 62 * 1.5 + 1], [1097 * 1.5 - 1, 492 * 1.5 - 1], [361 * 1.5 + 1, 479 * 1.5 - 1]];

/** Project a point of the 1920×1080 UI box onto a quad (same homography as Pinned). */
export const project = (q: Quad, x: number, y: number): [number, number] => {
  const [[x0, y0], [x1, y1], [x2, y2], [x3, y3]] = q;
  const dx1 = x1 - x2, dx2 = x3 - x2, dy1 = y1 - y2, dy2 = y3 - y2;
  const sx = x0 - x1 + x2 - x3, sy = y0 - y1 + y2 - y3;
  const den = dx1 * dy2 - dx2 * dy1;
  const g = (sx * dy2 - dx2 * sy) / den, h = (dx1 * sy - sx * dy1) / den;
  const u = x / 1920, v = y / 1080, w = g * u + h * v + 1;
  return [((x1 - x0 + g * x1) * u + (x3 - x0 + h * x3) * v + x0) / w, ((y1 - y0 + g * y1) * u + (y3 - y0 + h * y3) * v + y0) / w];
};

/* ---------- the real ALFA recordings, as a 1920×1080 screen ---------- */
export const PLAN_K = 1080 / 994; // alfa-plan.mp4 is 1464×994: fit to height, centred
export const PLAN_X = (1920 - 1464 * PLAN_K) / 2;
export const Plan: React.FC<{at: number; freeze?: boolean; rate?: number}> = ({at, freeze, rate = 1}) => {
  const {fps} = useVideoConfig();
  const v = <OffthreadVideo src={staticFile('alfa-plan.mp4')} muted trimBefore={Math.round(at * fps)} playbackRate={rate} style={{width: 1464, height: 994}} />;
  return (
    <AbsoluteFill style={{background: ALFA_BG}}>
      <div style={{position: 'absolute', left: PLAN_X, top: 0, width: 1464, height: 994, transformOrigin: '0 0', scale: String(PLAN_K)}}>{freeze ? <Freeze frame={0}>{v}</Freeze> : v}</div>
    </AbsoluteFill>
  );
};
export const planPt = (x: number, y: number): [number, number] => [PLAN_X + x * PLAN_K, y * PLAN_K];
export const HomeTyping: React.FC<{at: number; rate: number}> = ({at, rate}) => {
  const {fps} = useVideoConfig();
  return (
    <AbsoluteFill style={{background: ALFA_BG}}>
      <OffthreadVideo src={staticFile('alfa.mp4')} muted trimBefore={Math.round(at * fps)} playbackRate={rate} style={{width: 1920, height: 1080}} />
    </AbsoluteFill>
  );
};

/** Leen's laptop (G1) with a real ALFA screen pinned on it, and a digital push toward a UI point. */
export const ScreenShot: React.FC<{ui: React.ReactNode; from?: number; zoom?: number; focus?: [number, number]; blur?: number}> = ({ui, from = 0, zoom = 1, focus = [960, 540], blur = 0}) => {
  const [fx, fy] = project(G1, focus[0], focus[1]);
  const k = (zoom - 1) / zoom; // keep the focus point drifting to the centre as we push
  return (
    <Cam s={zoom} ox={fx} oy={fy} x={(960 - fx) * k} y={(540 - fy) * k} blur={blur}>
      <Clip src="screen.mp4" from={from} />
      <Pinned quad={G1}>
        {ui}
        {/* the screen's glow and glass: lift blacks a touch so it sits in the daylight room */}
        <AbsoluteFill style={{background: 'linear-gradient(115deg, rgba(255,255,255,.10), rgba(255,255,255,0) 40%)', mixBlendMode: 'screen'}} />
      </Pinned>
    </Cam>
  );
};

/* =========================== SHOTS =========================== */

export const CHIP_MID: [number, number] = [831, 529];

/** 0–1.6: VOLT leap under a giant ALFA; the name splits AL | FA onto Leen's screen. */
export const Open: React.FC = () => {
  const s = useSec();
  const inP = ip(s, [0, 0.45], [0, 1]);
  const gap = ip(s, [1.15, 1.55], [0, 1920], INOUT);
  const out = ip(s, [1.4, 1.4 + EXIT], [0, 1], IN);
  const smallOut = ip(s, [1.1, 1.1 + EXIT], [0, 1], IN);
  const word: React.CSSProperties = {...cond(900, 125), fontSize: 380, lineHeight: 1, color: '#fff', letterSpacing: -4, whiteSpace: 'nowrap', textShadow: '0 10px 60px rgba(0,0,0,.35)'};
  const ent = {opacity: inP, filter: inP < 1 ? `blur(${(1 - inP) * 14}px)` : undefined};
  const half = (dir: -1 | 1): React.CSSProperties => ({...word, translate: `${dir * out * 260}px 0`, opacity: 1 - out, filter: out > 0 ? `blur(${out * 12}px)` : undefined});
  return (
    <AbsoluteFill>
      <Cam s={1 + 0.04 * s}>
        <Clip src="volt.mp4" />
      </Cam>
      <AbsoluteFill style={{background: 'rgba(10,5,15,.2)', opacity: ip(s, [0, 0.3], [0, 1])}} />
      <AbsoluteFill style={{clipPath: `inset(0 ${(1920 - gap) / 2}px 0 ${(1920 - gap) / 2}px)`}}>
        <ScreenShot ui={<HomeFrame />} zoom={1.15} focus={CHIP_MID} />
      </AbsoluteFill>
      {out < 1 ? (
        <AbsoluteFill style={{scale: String(1.08 - 0.08 * inP)}}>
          <div style={{position: 'absolute', top: 230, width: 1920, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 16, ...ent, opacity: inP * (1 - smallOut)}}>
            <Img src={staticFile('adflex-logo.png')} style={{height: 40, filter: 'brightness(0) invert(1)'}} />
            <span style={{...cond(500, 100), fontSize: 30, color: 'rgba(255,255,255,.85)', letterSpacing: 4}}>AGENT</span>
          </div>
          <div style={{position: 'absolute', top: 330, left: 0, width: 1920, display: 'flex', justifyContent: 'center', ...ent}}>
            <div style={half(-1)}>AL</div>
            <div style={{width: Math.min(gap, 1120)}} />
            <div style={half(1)}>FA</div>
          </div>
          <div style={{position: 'absolute', top: 760, width: 1920, textAlign: 'center', ...cond(700, 110), fontSize: 30, letterSpacing: 10, color: 'rgba(255,255,255,.92)', ...ent, opacity: inP * (1 - smallOut)}}>YOUR AI MARKETING AGENT</div>
        </AbsoluteFill>
      ) : null}
    </AbsoluteFill>
  );
};

/** 1.6–2.6: Leen's screen, ALFA home; push onto the chips (Plan my week / Review media performance / Understand comments). */
const Home: React.FC = () => {
  const s = useSec();
  return <ScreenShot ui={<HomeFrame />} from={0.4} zoom={1.15 + 0.55 * ip(s, [0, 1.0], [0, 1], INOUT)} focus={CHIP_MID} />;
};

/** 3.6–4.6: her fingers type (G2), then the real prompt on her screen. */
const Typing: React.FC = () => {
  const s = useSec();
  const split = T.s3b - T.s3;
  return s < split ? (
    <Cam s={1.04 + 0.03 * s}>
      <Clip src="typing.mp4" from={2.2} />
    </Cam>
  ) : (
    <ScreenShot ui={<HomeTyping at={4.0} rate={3.75} />} from={2.0} zoom={2.1 + 0.1 * (s - split)} focus={[1000, 420]} blur={ip(s, [split, split + 0.15], [6, 0])} />
  );
};

/** 5.6–6.6: "Understanding the request…" on her screen, close. */
const Working: React.FC = () => {
  const s = useSec();
  return <ScreenShot ui={<Plan at={0} />} from={3.0} zoom={3.6 + 0.2 * s} focus={planPt(600, 241)} blur={ip(s, [0, 0.2], [6, 0])} />;
};

/** 6.6–8.2: "Approve and run", her click, then the dive into the button onto VOLT. */
export const BTN = planPt(630, 829);
const Run: React.FC = () => {
  const s = useSec();
  const {fps} = useVideoConfig();
  const press = 0.55;
  const d0 = T.dive - T.s6;
  const p = ip(s, [d0, d0 + 0.8], [0, 1], IN);
  const zoom = (2.3 + 0.5 * ip(s, [0, press], [0, 1], OUT)) * Math.pow(7, p);
  const glow = ip(s, [press, press + 0.1, press + 0.5], [0, 1, 0.6]);
  const hole = 30 * Math.pow(60, p);
  return (
    <AbsoluteFill>
      <ScreenShot
        ui={
          <AbsoluteFill>
            <Plan at={3.9} freeze />
            <div style={{position: 'absolute', left: BTN[0] - 80, top: BTN[1] - 26, width: 160, height: 52, borderRadius: 10, boxShadow: `0 0 ${40 * glow}px 10px rgba(135,56,245,.75)`}} />
          </AbsoluteFill>
        }
        from={1.0}
        zoom={zoom}
        focus={BTN}
        blur={ip(s, [d0 + 0.2, d0 + 0.6, d0 + 0.8], [0, 5, 0])}
      />
      {p > 0 ? (
        <AbsoluteFill style={{clipPath: `circle(${hole}px at ${960}px ${540}px)`}}>
          <Clip src="volt.mp4" from={0.3} freeze />
        </AbsoluteFill>
      ) : null}
      <Streaks at={(d0 + 0.05) * fps} dur={0.75 * fps} x={960} y={540} max={0.5} seed="dive7" />
    </AbsoluteFill>
  );
};

/** 8.2–12: the reels ALFA made, cut on motion: VOLT landing → KNOCKOUT punch → DUNE over the lens. */
const Montage: React.FC = () => {
  const s = useSec();
  const a = T.ko - T.s7, b = T.dune - T.s7;
  const settle = (c: number) => ip(s, [c, c + 0.15], [6, 0]);
  return (
    <AbsoluteFill>
      {s < a ? (
        <Cam s={1.03 + 0.03 * s}>
          <Clip src="volt.mp4" from={0.3} />
        </Cam>
      ) : s < b ? (
        <Cam s={1.03 + 0.03 * (s - a)} blur={settle(a)}>
          <Clip src="knockout.mp4" from={0.0} />
        </Cam>
      ) : (
        <Cam s={1.03 + 0.03 * (s - b)} blur={settle(b)}>
          <Clip src="dune.mp4" from={1.9} />
        </Cam>
      )}
    </AbsoluteFill>
  );
};

/** 12–17: DUNE pins down into Leen's laptop (C1: Reem walks in, high five); then her screen (VOLT, frame 0) grows back to full frame. */
const Reveal: React.FC = () => {
  const s = useSec();
  const dur = T.end - T.s8;
  const k = ip(s, [0, 0.9], [0, 1], INOUT);
  const q = ip(s, [dur - 1.0, dur], [0, 1], INOUT);
  const quad = q > 0 ? lerpQuad(C1_SCREEN, FULL, q) : lerpQuad(FULL, C1_SCREEN, k);
  const showVolt = s > 3.2;
  const endP = ip(s, [2.2, 2.5], [0, 1]);
  const endE = ip(s, [3.8, 3.8 + EXIT], [0, 1], IN);
  return (
    <AbsoluteFill>
      <Cam s={1 + 0.6 * q} ox={C1_SCREEN_C[0]} oy={C1_SCREEN_C[1]} blur={ip(s, [0, 0.9], [10, 0]) + 6 * q}>
        <Clip src="desk-c1.mp4" />
      </Cam>
      <Pinned quad={quad}>{showVolt ? <Clip src="volt.mp4" freeze /> : <Clip src="dune.mp4" from={3.2} />}</Pinned>
      {endP > 0 && endE < 1 ? (
        <div style={{position: 'absolute', bottom: 70, width: 1920, textAlign: 'center', ...cond(700, 110), fontSize: 30, letterSpacing: 8, color: '#fff', textShadow: '0 2px 20px rgba(0,0,0,.6)', opacity: endP * (1 - endE), filter: `blur(${(1 - endP) * 8 + endE * 8}px)`}}>
          ALFA · AVAILABLE ON ADFLEX.AI
        </div>
      ) : null}
    </AbsoluteFill>
  );
};

/* =========================== TIMELINE =========================== */
export const AlfaHero: React.FC = () => {
  const {fps} = useVideoConfig();
  const seq = (from: number, to: number) => ({from: Math.round(from * fps), durationInFrames: Math.round((to - from) * fps)});
  return (
    <AbsoluteFill style={{background: '#000'}}>
      <Sequence name="0 · VOLT leap + ALFA title" {...seq(0, T.s1)}>
        <Open />
      </Sequence>
      <Sequence name="1 · Leen's screen: ALFA home" {...seq(T.s1, T.s2)}>
        <Home />
      </Sequence>
      <Sequence name="2 · KNOCKOUT punch" {...seq(T.s2, T.s3)}>
        <Cam s={1.05}>
          <Clip src="knockout.mp4" from={2.95} />
        </Cam>
      </Sequence>
      <Sequence name="3 · typing → the prompt" {...seq(T.s3, T.s4)}>
        <Typing />
      </Sequence>
      <Sequence name="4 · DUNE over the lens" {...seq(T.s4, T.s5)}>
        <Cam s={1.05}>
          <Clip src="dune.mp4" from={1.8} />
        </Cam>
      </Sequence>
      <Sequence name="5 · ALFA working" {...seq(T.s5, T.s6)}>
        <Working />
      </Sequence>
      <Sequence name="6 · Approve and run + DIVE" {...seq(T.s6, T.s7)}>
        <Run />
      </Sequence>
      <Sequence name="7 · the reels" {...seq(T.s7, T.s8)}>
        <Montage />
      </Sequence>
      <Sequence name="8 · Leen + Reem, loop" {...seq(T.s8, T.end)}>
        <Reveal />
      </Sequence>
      <CornerLabel words={['PLANS.', 'MEASURES.', 'LISTENS.']} accent={(s) => (s < T.s1 + 0.4 ? 0 : s < T.s1 + 0.7 ? 1 : 2)} at={T.s1 + 0.12} out={T.s2 - 0.12} />
      <CornerLabel words={['ONE', 'LINE.']} accent={1} at={T.s3 + 0.1} out={T.s4 - 0.12} />
      <CornerLabel words={['IT', 'WORKS.']} accent={1} at={T.s5 + 0.12} out={T.s6 - 0.12} />
      <CornerLabel words={['ONE', 'CLICK.']} accent={1} at={T.s6 + 0.12} out={T.dive - 0.1} />
      <CornerLabel words={['EVERY', 'CLIENT.']} accent={1} sub="VOLT" at={T.s7 + 0.2} out={T.ko - 0.08} />
      <CornerLabel words={['EVERY', 'CLIENT.']} accent={1} sub="KNOCKOUT" at={T.ko} out={T.dune - 0.08} />
      <CornerLabel words={['EVERY', 'CLIENT.']} accent={1} sub="DUNE" at={T.dune} out={T.s8 - 0.12} />
    </AbsoluteFill>
  );
};
