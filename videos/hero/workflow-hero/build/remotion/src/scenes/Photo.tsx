import React from 'react';
import {AbsoluteFill, Img, staticFile, useCurrentFrame} from 'remotion';

import {INOUT, ip, Kicker, MBlur, whipOut, Wipe} from '../lib';

/*
 * The input: the real product photo the workflow was run on (serum.jpg, 4:5, logo-free).
 * PhotoFill draws it "contained" (full height) over a blurred copy of itself, so the lilac backdrop
 * fills any 16:9 box without cropping the bottle. The title chip uses the same component, so when the
 * chip reaches full frame it is exactly this scene's first frame.
 */
export type Product = {src: string; bg: string};
export const SERUM: Product = {src: 'serum.jpg', bg: '#d7c9e6'};
export const CANDLE: Product = {src: 'candle.jpg', bg: '#c1ae96'}; // the second product (same 928x1152 framing)

export const PhotoFill: React.FC<{w: number; h: number; zoom?: number; shift?: number; product?: Product}> = ({w, h, zoom = 1, shift = 0.12, product = SERUM}) => {
  const ih = h * zoom;
  const iw = (ih * 928) / 1152;
  const fade = 'linear-gradient(90deg, transparent, #000 14%, #000 86%, transparent)';
  return (
    <div style={{position: 'absolute', left: 0, top: 0, width: w, height: h, overflow: 'hidden', background: product.bg}}>
      <Img src={staticFile(product.src)} style={{position: 'absolute', left: -w * 0.05, top: -h * 0.05, width: w * 1.1, height: h * 1.1, objectFit: 'cover', filter: `blur(${Math.max(8, w / 40)}px)`}} />
      <Img
        src={staticFile(product.src)}
        style={{position: 'absolute', left: (w - iw) / 2 + w * shift, top: (h - ih) / 2, width: iw, height: ih, WebkitMaskImage: fade, maskImage: fade}}
      />
    </div>
  );
};

export const WHIP = 40; // the whip to the prompt; the next scene starts 4 frames later

/** Scene 2: ONE PHOTO. The input, full frame, with a slow push-in. */
export const Photo: React.FC = () => {
  const f = useCurrentFrame();
  const w = whipOut(f, WHIP);
  const zoom = 1 + 0.035 * ip(f, [0, WHIP + 9], [0, 1], INOUT);
  return (
    <MBlur id="photo-whip" x={w.blur} style={{translate: `${w.x}px 0`}}>
      <AbsoluteFill style={{scale: String(zoom), transformOrigin: '62% 50%'}}>
        <PhotoFill w={1920} h={1080} />
      </AbsoluteFill>
      <AbsoluteFill style={{background: 'linear-gradient(90deg, rgba(11,9,18,.72) 0%, rgba(11,9,18,.3) 34%, transparent 52%)'}} />
      <Kicker text="INPUT" at={2} x={112} y={420} />
      <Wipe text="ONE PHOTO." mode="rise" at={4} dur={10} size={150} wght={900} wdth={68} style={{position: 'absolute', left: 104, top: 458}} />
    </MBlur>
  );
};
