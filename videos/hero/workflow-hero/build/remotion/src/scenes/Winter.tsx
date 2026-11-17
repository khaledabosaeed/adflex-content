import React from 'react';
import {AbsoluteFill, Img, staticFile, useCurrentFrame} from 'remotion';

import {INOUT, ip} from '../lib';

/*
 * v11: style-swap match cut. Summer ad 1 → the same ad in winter (same framing, the push carries straight
 * through the cut), then the three winter ads together. Winter ads: seedream-5-5 edits of the serum ads (media.tsv).
 */
export const END = 30;
const SWAP = 8;
const TRIO = 17;

const Square: React.FC<{src: string; x: number; size: number}> = ({src, x, size}) => (
  <Img src={staticFile(src)} style={{position: 'absolute', left: x, top: (1080 - size) / 2, width: size, height: size, borderRadius: 10, objectFit: 'cover'}} />
);

export const Winter: React.FC = () => {
  const f = useCurrentFrame();
  const push = 1 + 0.05 * ip(f, [0, TRIO], [0, 1], INOUT);
  if (f >= TRIO) {
    const s = 1 + 0.02 * ip(f, [TRIO, END], [0, 1], INOUT);
    return (
        <AbsoluteFill style={{background: '#dfe7f0', scale: String(s)}}>
          {['winter-ad1.jpg', 'winter-ad2.jpg', 'winter-ad3.jpg'].map((src, i) => <Square key={src} src={src} x={60 + i * 610} size={580} />)}
        </AbsoluteFill>
    );
  }
  return (
    <AbsoluteFill style={{background: f < SWAP ? '#e9e2ef' : '#dfe7f0', overflow: 'hidden'}}>
      <AbsoluteFill style={{scale: String(push)}}>
        <Square src={f < SWAP ? 'ad1.jpg' : 'winter-ad1.jpg'} x={420} size={1080} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
