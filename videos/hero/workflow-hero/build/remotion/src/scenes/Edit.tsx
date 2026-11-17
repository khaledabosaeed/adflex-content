import React from 'react';
import {AbsoluteFill, Sequence, useCurrentFrame} from 'remotion';

import {Clip, INOUT, ip, Slam} from '../lib';

/*
 * v11: the winter prompt, from the real recording (alfa-edit.mp4: localhost on dev, AdFlex.ai brand, 2026-11-17).
 *   A: the sentence typed into ALFA's composer (sped up 2.5×).
 *   B: hard cut to the sent bubble and ALFA's live status ("Understanding the request", then "Planning the steps…").
 * B is a band crop, so the reply above it (a failed build in that chat) and the sidebar never show.
 * Source frames (30 fps): typing 60–168, sent + understanding 245–290, planning 900+.
 */
export const END = 60;
export const SEND = 30; // the cut to the sent bubble (Sound.tsx clicks here)
const A = {src: 60, rate: 4, cx: 996, cy: 1000, z: 1.75};
const B1 = {src: 250, dur: 15};
const B2 = {src: 900};
// B is a band crop of the recording: only the sent bubble and ALFA's status line (source px), scaled to the frame width
const BAND = {x: 585, y: 548, w: 820, h: 124};
const BZ = 1820 / BAND.w;

const View: React.FC<{cx: number; cy: number; z: number; children: React.ReactNode}> = ({cx, cy, z, children}) => {
  const f = useCurrentFrame();
  const k = z * (1 + 0.025 * ip(f, [0, 60], [0, 1], INOUT));
  return (
    <AbsoluteFill style={{background: '#14151c', overflow: 'hidden'}}>
      <div style={{position: 'absolute', width: 1920, height: 1080, transformOrigin: '0 0', transform: `translate(${960 - cx * k}px, ${540 - cy * k}px) scale(${k})`}}>{children}</div>
    </AbsoluteFill>
  );
};

const Band: React.FC<{src: number}> = ({src}) => {
  const f = useCurrentFrame();
  const k = BZ * (1 + 0.02 * ip(f, [0, 50], [0, 1], INOUT));
  const w = BAND.w * k, h = BAND.h * k;
  return (
    <AbsoluteFill style={{background: 'radial-gradient(ellipse 70% 60% at 50% 50%, #1b1a26, #0e0d14)'}}>
      <div style={{position: 'absolute', left: 960 - w / 2, top: 540 - h / 2, width: w, height: h, overflow: 'hidden', borderRadius: 14, boxShadow: '0 30px 80px rgba(0,0,0,.5)'}}>
        <div style={{position: 'absolute', width: 1920, height: 1080, transformOrigin: '0 0', transform: `translate(${-BAND.x * k}px, ${-BAND.y * k}px) scale(${k})`}}>
          <Clip src="alfa-edit.mp4" trimBefore={src} style={{width: 1920, height: 1080}} />
        </div>
      </div>
    </AbsoluteFill>
  );
};

export const Edit: React.FC = () => (
  <AbsoluteFill>
    <Sequence durationInFrames={SEND} layout="none">
      <View {...A}>
        <Clip src="alfa-edit.mp4" trimBefore={A.src} playbackRate={A.rate} style={{width: 1920, height: 1080}} />
      </View>
    </Sequence>
    <Sequence from={SEND} durationInFrames={B1.dur} layout="none">
      <Band src={B1.src} />
    </Sequence>
    <Sequence from={SEND + B1.dur} layout="none">
      <Band src={B2.src} />
    </Sequence>
    <Slam text="ALFA EDITS IT." at={0} dur={12} />
  </AbsoluteFill>
);
