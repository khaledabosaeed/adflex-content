import React from 'react';
import {AbsoluteFill, Img, Sequence, staticFile, useCurrentFrame} from 'remotion';

import {INOUT, ip, Still, WakeType} from '../lib';
import {CANDLE, PhotoFill, Product, SERUM} from './Photo';
import {CANDLE_SHIFT} from './LamaShot';

/*
 * v13: Lama hands ALFA the photo she just took. The scene opens on that photo full frame (the shutter flash still
 * fading) and it flies down into the real ALFA composer (alfa.mp4, sidebar cropped, name painted out), landing
 * exactly on the attachment thumbnail (object carry). Then the sentence types in with the purple wake, and on Send
 * the frame punches 1.9x onto the pressed Send button (the real frame 252: ui-punch-in-cut).
 *   AskSerum: the first run (the recording's own attachment is the serum, so it lands on the real thumbnail).
 *   AskCandle: next week's product. The candle photo lands on the thumbnail rect and stays over it (the real
 *   × button shows through a hole); the shorter line types in and the punched Send frame has its text covered.
 */
export const END = 60;
const HOLD = 3; // the match cut holds on the photo a beat
const FLY = 17; // the photo has landed in the composer
const TYPE_AT = 18;
const CPS = 105; // a sped-up real typing
const SERUM_TEXT = 'Build me a workflow: I give you a product photo, you make 3 ads and a story video with music.';
const CANDLE_TEXT = 'Same workflow, new product.';
const sendAt = (text: string) => TYPE_AT + Math.ceil((text.length * 30) / CPS) + 4;
export const SEND = sendAt(SERUM_TEXT); // Sound.tsx clicks here
export const SEND_CANDLE = sendAt(CANDLE_TEXT);
const SEND_SRC = 252;
// composer geometry in the 1920x1080 recording frame
const FIELD = {x: 495, y: 376, w: 300, h: 40, bg: 'rgb(27,29,37)'};
const TEXT = {x: 499, y: 389, size: 20.6};
const THUMB = {x: 496, y: 297, w: 66, h: 66, r: 8};
const CLOSE: [number, number, number] = [49, 18, 12]; // the real × button on the thumbnail (local x, y, r)
const FOCUS = {x: 1000, y: 380};
// ui-punch-in-cut: on Send the frame jumps 1.9x onto the composer's right end, where the Send button (1492, 444) is pressed
const PUNCH = {x: 1360, y: 430, sy: 540};
const PUNCH_CANDLE = {x: 1480, y: 430, sy: 540}; // further right, so none of the recorded sentence shows

// the recording's privacy box over the greeting (source px 780–1239 × 168–243) is painted over with soft
// background, sampled from around it in each frame, so no grey slab sits above the composer
const Patch: React.FC<{bg: string}> = ({bg}) => (
  <div style={{position: 'absolute', left: 764, top: 154, width: 492, height: 104, background: bg, filter: 'blur(10px)'}} />
);
const PATCH_0 = 'linear-gradient(180deg, rgb(31,27,46), rgb(19,20,29))';
const PATCH_SEND = 'linear-gradient(90deg, rgb(68,46,102), rgb(56,43,82) 45%, rgb(22,21,32))';

const Cover: React.FC<{product: Product; hole?: boolean}> = ({product, hole}) => {
  const mask = hole ? `radial-gradient(circle at ${CLOSE[0]}px ${CLOSE[1]}px, transparent ${CLOSE[2]}px, #000 ${CLOSE[2] + 1}px)` : undefined;
  return (
    <div style={{position: 'absolute', left: THUMB.x, top: THUMB.y, width: THUMB.w, height: THUMB.h, borderRadius: THUMB.r, overflow: 'hidden', WebkitMaskImage: mask, maskImage: mask}}>
      <Img src={staticFile(product.src)} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
    </div>
  );
};

const AskScene: React.FC<{product: Product; text: string; send: number; punch: typeof PUNCH; real: boolean; shift?: number}> = ({product, text, send, punch, real, shift = 0}) => {
  const f = useCurrentFrame();
  const drift = 1 + 0.04 * ip(f, [0, END], [0, 1], INOUT);
  const punched = f >= send;
  const z = (punched ? 1.4 * 1.9 : 1.4) * drift;
  // the camera follows the typing along the field (ui-macro-dolly), then punches onto Send
  const follow = ip(f, [TYPE_AT, send], [0, 1], INOUT);
  const at = punched ? punch : {x: FOCUS.x + 180 * follow, y: FOCUS.y, sy: 470};
  // once the photo has landed the composer turns into a 3D panel
  const tilt = ip(f, [FLY, FLY + 10], [0, 1], INOUT) * (punched ? 0.5 : 1);
  const tx = 960 - at.x * z;
  const ty = at.sy - at.y * z;
  // the flying photo, in screen px: from the full frame to the thumbnail's on-screen rect
  const p = ip(f, [HOLD, FLY], [0, 1], INOUT);
  const T = {x: tx + THUMB.x * z, y: ty + THUMB.y * z, w: THUMB.w * z, h: THUMB.h * z};
  const R = {x: T.x * p, y: T.y * p, w: 1920 + (T.w - 1920) * p, h: 1080 + (T.h - 1080) * p};
  const landed = f >= FLY;
  return (
    <AbsoluteFill style={{background: '#0B0912'}}>
      <AbsoluteFill style={{perspective: 1700}}>
      <AbsoluteFill style={{transform: `rotateX(${7 * tilt}deg) rotateY(${-11 * tilt}deg)`, transformStyle: 'preserve-3d'}}>
      <AbsoluteFill style={{transformOrigin: '0 0', transform: `translate(${tx}px, ${ty}px) scale(${z})`}}>
        <Sequence durationInFrames={send} layout="none">
          <Still src="alfa.mp4" frame={0} style={{position: 'absolute', left: 0, top: 0, width: 1920, height: 1080}} />
          <Patch bg={PATCH_0} />
          {/* the real thumbnail stays hidden until the photo lands on it */}
          {!landed ? <div style={{position: 'absolute', left: THUMB.x - 2, top: THUMB.y - 2, width: THUMB.w + 4, height: THUMB.h + 4, background: FIELD.bg}} /> : null}
          {landed && !real ? <Cover product={product} hole /> : null}
          <div style={{position: 'absolute', left: FIELD.x, top: FIELD.y, width: FIELD.w, height: FIELD.h, background: FIELD.bg}} />
          <WakeType text={text} at={TYPE_AT} cps={CPS} size={TEXT.size} style={{left: TEXT.x, top: TEXT.y - TEXT.size * 0.62}} />
        </Sequence>
        <Sequence from={send} layout="none">
          <Still src="alfa.mp4" frame={SEND_SRC} style={{position: 'absolute', left: 0, top: 0, width: 1920, height: 1080}} />
          <Patch bg={PATCH_SEND} />
          {!real ? (
            <>
              <Cover product={product} hole />
              <div style={{position: 'absolute', left: FIELD.x, top: FIELD.y - 4, width: 860, height: FIELD.h + 8, background: 'rgb(30,31,40)'}} />
            </>
          ) : null}
        </Sequence>
      </AbsoluteFill>
      </AbsoluteFill>
      </AbsoluteFill>
      {!landed ? (
        <div style={{position: 'absolute', left: R.x, top: R.y, width: R.w, height: R.h, borderRadius: THUMB.r * z * p, overflow: 'hidden', boxShadow: `0 ${24 * p}px ${60 * p}px rgba(0,0,0,${0.5 * p})`}}>
          <PhotoFill w={R.w} h={R.h} shift={shift * (1 - p)} product={product} />
          {/* the last frames of the flight settle into the thumbnail's own crop */}
          <Img src={staticFile(product.src)} style={{position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: ip(p, [0.7, 1], [0, 1])}} />
        </div>
      ) : null}
    </AbsoluteFill>
  );
};

export const Ask: React.FC = () => <AskScene product={SERUM} text={SERUM_TEXT} send={SEND} punch={PUNCH} real />;
export const AskCandle: React.FC = () => <AskScene product={CANDLE} text={CANDLE_TEXT} send={SEND_CANDLE} punch={PUNCH_CANDLE} real={false} shift={CANDLE_SHIFT} />;
