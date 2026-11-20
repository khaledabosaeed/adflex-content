/*
 * ALFA hero, script v10: "Every client, its own world. Its own ALFA."
 * Leen (agency marketer) steps into each client's world with her laptop; ALFA's real UI (dev recordings) is pinned on her screen.
 * Every shot is footage; graphics only in cuts and text. 17 s, 1920×1080, 24 fps, silent loop. Spec: ../../production.md "Script v10".
 */
import React from 'react';
import {AbsoluteFill, Freeze, OffthreadVideo, Sequence, staticFile, useVideoConfig} from 'remotion';
import {Cam, cond, IN, INOUT, ip, OUT} from './lib';
import {CornerLabel, EXIT, FULL, HomeFrame, lerpQuad, Pinned, Quad, useSec} from './Preview';
import {BTN, CHIP_MID, Clip, G1, HomeTyping, Open, Plan, project, ScreenShot} from './Hero';

/* ---------- timeline (absolute seconds) ---------- */
const T = {agency: 1.6, dive: 2.9, volt: 3.5, voltReel: 5.0, ko: 6.0, koReel: 7.5, dune: 8.5, duneReel: 10.0, montage: 11.0, m2: 12.15, m3: 13.3, desk: 14.5, end: 17};

/* ---------- Leen's screen in each world: corners measured at 0, 1.5, 3, 4.8 s (±1 px) on the 1280×720 clip, ×1.5 ---------- */
// the >225 threshold misses the screen's anti-aliased rim: push each corner `grow` px out from the centre
const q15 = (q: [number, number][], grow = 8): Quad => {
  const cx = (q[0][0] + q[1][0] + q[2][0] + q[3][0]) * 0.375, cy = (q[0][1] + q[1][1] + q[2][1] + q[3][1]) * 0.375;
  return q.map(([x, y]) => {
    const X = x * 1.5, Y = y * 1.5, d = Math.hypot(X - cx, Y - cy);
    return [X + ((X - cx) / d) * grow, Y + ((Y - cy) / d) * grow];
  }) as Quad;
};
const WORLD = {
  volt: {src: 'world-volt.mp4', quad: q15([[748, 350], [1023, 375], [979, 578], [707, 527]]), tint: 'rgba(255,170,90,.16)'},
  knockout: {src: 'world-knockout.mp4', quad: q15([[803, 345], [1094, 364], [1054, 576], [768, 530]]), tint: 'rgba(20,10,0,.18)'},
  dune: {src: 'world-dune.mp4', quad: q15([[802, 315], [1137, 328], [1106, 547], [769, 518]]), tint: 'rgba(255,190,110,.14)'},
};

/** Leen in a client's world (locked clip), the real ALFA screen pinned on her laptop, a slow push toward the screen. */
const World: React.FC<{w: keyof typeof WORLD; from: number; ui: React.ReactNode}> = ({w, from, ui}) => {
  const s = useSec();
  const {src, quad, tint} = WORLD[w];
  const [cx, cy] = project(quad, 960, 540);
  return (
    <Cam s={1.02 + 0.1 * ip(s, [0, 1.5], [0, 1], INOUT)} ox={cx} oy={cy} blur={ip(s, [0, 0.15], [6, 0])}>
      <Clip src={src} from={from} />
      <Pinned quad={quad}>
        {ui}
        {/* the screen sits in the scene's light: a touch of the ambient colour and a glass sheen */}
        <AbsoluteFill style={{background: tint, mixBlendMode: 'multiply'}} />
        <AbsoluteFill style={{background: 'linear-gradient(115deg, rgba(255,255,255,.12), rgba(255,255,255,0) 40%)', mixBlendMode: 'screen'}} />
      </Pinned>
    </Cam>
  );
};

/** A client's reel (what ALFA made), cut in on the motion; settles from a short blur. */
const Reel: React.FC<{src: string; from: number}> = ({src, from}) => {
  const s = useSec();
  return (
    <Cam s={1.04 + 0.03 * s} blur={ip(s, [0, 0.15], [6, 0])}>
      <Clip src={src} from={from} />
    </Cam>
  );
};

/** 1.6–3.5: her agency desk, ALFA home on her screen; she clicks, we dive into the screen and its light fills the frame. */
const Agency: React.FC = () => {
  const s = useSec();
  const d = T.dive - T.agency;
  const p = ip(s, [d, d + 0.6], [0, 1], IN);
  const zoom = (1.15 + 0.45 * ip(s, [0, d], [0, 1], INOUT)) * Math.pow(5, p);
  const light = ip(s, [d + 0.25, d + 0.6], [0, 1], IN);
  return (
    <AbsoluteFill>
      <ScreenShot ui={<HomeFrame />} from={0.4} zoom={zoom} focus={CHIP_MID} blur={ip(s, [d + 0.2, d + 0.6], [0, 6])} />
      <AbsoluteFill style={{background: '#fff8f0', opacity: light}} />
    </AbsoluteFill>
  );
};

/** Screen light clearing off the first world (the other half of the dive). */
const LightOut: React.FC = () => {
  const s = useSec();
  const o = ip(s, [0, 0.3], [1, 0], OUT);
  return o > 0 ? <AbsoluteFill style={{background: '#fff8f0', opacity: o}} /> : null;
};

/** DUNE world UI: the run card frozen, her click lights "Approve and run". */
const RunCard: React.FC<{press: number}> = ({press}) => {
  const s = useSec();
  const glow = ip(s, [press, press + 0.1, press + 0.5], [0, 1, 0.6]);
  return (
    <AbsoluteFill>
      <Plan at={3.9} freeze />
      <div style={{position: 'absolute', left: BTN[0] - 80, top: BTN[1] - 26, width: 160, height: 52, borderRadius: 10, boxShadow: `0 0 ${40 * glow}px 10px rgba(135,56,245,.75)`}} />
    </AbsoluteFill>
  );
};

/** 14.5–17: back at her desk, VOLT's reel on her screen (frame 0); the screen grows to full frame = frame 0 of the loop. */
const Desk: React.FC = () => {
  const s = useSec();
  const dur = T.end - T.desk;
  const q = ip(s, [dur - 1.0, dur], [0, 1], INOUT);
  const [cx, cy] = project(G1, 960, 540);
  const endP = ip(s, [0.4, 0.7], [0, 1]);
  const endE = ip(s, [1.5, 1.5 + EXIT], [0, 1], IN);
  return (
    <AbsoluteFill>
      <Cam s={(1.0 + 0.04 * s) * (1 + 0.6 * q)} ox={cx} oy={cy} blur={ip(s, [0, 0.15], [6, 0]) + 6 * q}>
        <Clip src="screen.mp4" from={2.5} />
      </Cam>
      <Pinned quad={lerpQuad(G1, FULL, q)}>
        <Freeze frame={0}>
          <OffthreadVideo src={staticFile('volt.mp4')} muted style={{width: 1920, height: 1080, objectFit: 'cover'}} />
        </Freeze>
      </Pinned>
      {endP > 0 && endE < 1 ? (
        <div style={{position: 'absolute', bottom: 70, width: 1920, textAlign: 'center', ...cond(700, 110), fontSize: 30, letterSpacing: 8, color: '#fff', textShadow: '0 2px 20px rgba(0,0,0,.6)', opacity: endP * (1 - endE), filter: `blur(${(1 - endP) * 8 + endE * 8}px)`}}>
          ALFA · AVAILABLE ON ADFLEX.AI
        </div>
      ) : null}
    </AbsoluteFill>
  );
};

/* =========================== TIMELINE =========================== */
export const AlfaHeroV10: React.FC = () => {
  const {fps} = useVideoConfig();
  const seq = (from: number, to: number) => ({from: Math.round(from * fps), durationInFrames: Math.round((to - from) * fps)});
  const L = (at: number, out: number) => ({at: at + 0.12, out: out - 0.12});
  return (
    <AbsoluteFill style={{background: '#000'}}>
      <Sequence name="0 · VOLT leap + ALFA title" {...seq(0, T.agency)}>
        <Open />
      </Sequence>
      <Sequence name="1 · agency desk → dive into the screen" {...seq(T.agency, T.volt)}>
        <Agency />
      </Sequence>

      <Sequence name="2 · VOLT's world (typing)" {...seq(T.volt, T.voltReel)}>
        <World w="volt" from={1.9} ui={<HomeTyping at={0.6} rate={3.5} />} />
        <LightOut />
      </Sequence>
      <Sequence name="2b · VOLT reel" {...seq(T.voltReel, T.ko)}>
        <Reel src="volt.mp4" from={0.3} />
      </Sequence>

      <Sequence name="3 · KNOCKOUT's world (planning)" {...seq(T.ko, T.koReel)}>
        <World w="knockout" from={1.0} ui={<Plan at={0} rate={2} />} />
      </Sequence>
      <Sequence name="3b · KNOCKOUT reel" {...seq(T.koReel, T.dune)}>
        <Reel src="knockout.mp4" from={0} />
      </Sequence>

      <Sequence name="4 · DUNE's world (approve and run)" {...seq(T.dune, T.duneReel)}>
        <World w="dune" from={0} ui={<RunCard press={0.8} />} />
      </Sequence>
      <Sequence name="4b · DUNE reel" {...seq(T.duneReel, T.montage)}>
        <Reel src="dune.mp4" from={1.9} />
      </Sequence>

      <Sequence name="5 · montage VOLT" {...seq(T.montage, T.m2)}>
        <Reel src="volt.mp4" from={1.3} />
      </Sequence>
      <Sequence name="5 · montage KNOCKOUT" {...seq(T.m2, T.m3)}>
        <Reel src="knockout.mp4" from={2.9} />
      </Sequence>
      <Sequence name="5 · montage DUNE" {...seq(T.m3, T.desk)}>
        <Reel src="dune.mp4" from={3.1} />
      </Sequence>

      <Sequence name="6 · back at the desk, loop" {...seq(T.desk, T.end)}>
        <Desk />
      </Sequence>

      <CornerLabel words={['ONE', 'AGENCY.', 'MANY', 'CLIENTS.']} accent={3} {...L(T.agency, T.dive)} />
      <CornerLabel words={['VOLT.']} accent={0} sub="CLIENT 01 · RUNNING SHOES" {...L(T.volt + 0.2, T.ko)} />
      <CornerLabel words={['KNOCKOUT.']} accent={0} sub="CLIENT 02 · BOXING GYM" {...L(T.ko, T.dune)} />
      <CornerLabel words={['DUNE.']} accent={0} sub="CLIENT 03 · DESERT TOURS" {...L(T.dune, T.montage)} />
      <CornerLabel words={['EVERY', 'CLIENT.', 'ITS', 'OWN', 'ALFA.']} accent={4} {...L(T.montage, T.desk)} />
    </AbsoluteFill>
  );
};
