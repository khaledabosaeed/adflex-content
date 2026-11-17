import React from 'react';
import {AbsoluteFill, Easing, Sequence, useCurrentFrame} from 'remotion';

import {Clip, INOUT, ip, punch} from '../lib';

/*
 * Scene → product: the last frames zoom onto the product in the room until it sits exactly where and as big as it
 * is in the product photo drawn full frame (PhotoFill: 870x1080 centred), so the cut to the photo (Ask) is a match
 * cut. P = the product's centre in the shot, h = its height; Q, H = the same in the photo on screen.
 */
type Match = {P: {x: number; y: number}; h: number; Q: {x: number; y: number}; H: number};
const matchTf = (m: Match, e: number) => {
  const s = 1 + (m.H / m.h - 1) * e;
  return `translate(${m.P.x + (m.Q.x - m.P.x) * e - m.P.x * s}px, ${m.P.y + (m.Q.y - m.P.y) * e - m.P.y * s}px) scale(${s})`;
};
const SERUM_MATCH: Match = {P: {x: 1310, y: 820}, h: 320, Q: {x: 961, y: 544}, H: 712};
// the candle sits far right in the room, so its photo opens shifted right by CANDLE_SHIFT (Ask), keeping the frame covered
export const CANDLE_SHIFT = 0.25;
const CANDLE_MATCH: Match = {P: {x: 1540, y: 800}, h: 245, Q: {x: 994 + 1920 * CANDLE_SHIFT, y: 626}, H: 398};
const ZOOM = 12; // match-zoom length (frames) at the end of each shot

/*
 * v12: Lama photographs her candle (lama-candle.mp4, Omni Flash from the approved still), in two quick beats,
 * both at 1.25x (one real 24 fps frame per output frame, no judder):
 *   1. 0–15: she shoots; on the tap a shutter flash and a punch-in onto her phone and the candle.
 *   2. 15–45: cut on the beat to the phone coming at the lens; the last frames push into the phone's plain back
 *      (away from the camera bump) until it fills the frame, softening as it goes: a foreground wipe.
 * The next scene opens on the photo she just took (the candle, full frame).
 */
export const END = 45;
const RATE = 1.25;
const A = {src: 6, punch: 7}; // the shot; the shutter fires on the punch
export const TAP = A.punch;
const B = {at: 15, src: 22}; // she checks the shot; the candle stays clear on the right

/*
 * v13 scene 3: Lama photographs her serum (lama-serum.mp4: Omni Flash from the approved still, re-timed to 30 fps
 * with every real frame shown once, so it plays at 1x). Three beats: wide as she frames it → on the tap, shutter
 * flash + punch-in onto the phone and the bottle → back wide as she lowers the phone and smiles at the photo, then
 * a flash to white and the photo flies into ALFA's prompt (Ask).
 */
export const SERUM_END = 45;
const SA = {src: 18, tap: 15, back: 28};
export const SERUM_TAP = SA.tap;

export const LamaSerum: React.FC = () => {
  const f = useCurrentFrame();
  const flash = ip(f, [SA.tap, SA.tap + 4], [0.85, 0]);
  const tight = f >= SA.tap && f < SA.back;
  const e = ip(f, [SERUM_END - ZOOM, SERUM_END - 1], [0, 1], Easing.in(Easing.cubic));
  const s = (1 + 0.06 * ip(f, [0, SA.back], [0, 1], INOUT)) * (tight ? 1.7 : 1);
  return (
    <AbsoluteFill style={{overflow: 'hidden', background: '#0B0912'}}>
      {f < SA.back ? (
        <AbsoluteFill style={{scale: String(s), transformOrigin: tight ? '1250px 690px' : '1150px 560px'}}>
          <Clip src="lama-serum.mp4" trimBefore={SA.src} style={{width: 1920, height: 1080}} />
        </AbsoluteFill>
      ) : (
        <AbsoluteFill style={{transformOrigin: '0 0', transform: matchTf(SERUM_MATCH, e), filter: e > 0.05 ? `blur(${3 * Math.sin(Math.PI * e)}px)` : undefined}}>
          <Clip src="lama-serum.mp4" trimBefore={SA.src} style={{width: 1920, height: 1080}} />
        </AbsoluteFill>
      )}
      {f >= SA.tap ? <AbsoluteFill style={{background: '#fff', opacity: flash}} /> : null}
    </AbsoluteFill>
  );
};

export const LamaShot: React.FC = () => {
  const f = useCurrentFrame();
  const flash = ip(f, [A.punch, A.punch + 4], [0.85, 0]);
  const sA = (1 + 0.04 * ip(f, [0, B.at], [0, 1], INOUT)) * punch(f, A.punch, 1.6);
  return (
    <AbsoluteFill style={{overflow: 'hidden', background: '#0B0912'}}>
      <Sequence durationInFrames={B.at} layout="none">
        <AbsoluteFill style={{scale: String(sA), transformOrigin: '1360px 520px'}}>
          <Clip src="lama-candle.mp4" trimBefore={A.src} playbackRate={RATE} style={{width: 1920, height: 1080}} />
        </AbsoluteFill>
        {f >= A.punch ? <AbsoluteFill style={{background: '#fff', opacity: flash}} /> : null}
      </Sequence>
      <Sequence from={B.at} layout="none">
        <AbsoluteFill style={{transformOrigin: '0 0', transform: matchTf(CANDLE_MATCH, ip(f, [END - ZOOM, END - 1], [0, 1], Easing.in(Easing.cubic)))}}>
          <Clip src="lama-candle.mp4" trimBefore={B.src} playbackRate={RATE} style={{width: 1920, height: 1080}} />
        </AbsoluteFill>
      </Sequence>
    </AbsoluteFill>
  );
};
