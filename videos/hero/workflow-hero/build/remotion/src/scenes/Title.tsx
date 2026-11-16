import React from 'react';
import {AbsoluteFill, Img, random, staticFile, useCurrentFrame} from 'remotion';
import {C, Clip, cond, IN, INOUT, ip, MBlur, OUT} from '../lib';

/*
 * Scene 1 (0–2.2 s), Genjutsu-style title:
 *   outline → glitch fill (chromatic split, letters jump) → a light streak runs along the word and leaves the
 *   lower half in the brand gradient → the word splits at the ×, a selected "chip" opens in the gap with the girl
 *   in it → the chip grows to full frame and shoves both words off screen. Scene 2 continues the same clip.
 */
const SIZE = 124;
const WW = 976; // "WORKFLOW" at 124 px, wght 900, wdth 125 (measured)
const WA = 425; // "ALFA"
const PAD = 26;
const SLOT0 = 140; // × slot before the split
const CY = 560; // caps centre
const TOP = CY - 66; // div top so the caps sit on CY
const SHIFT = (WW - WA) / 2; // the slot sits right of centre until the split re-centres it
export const TITLE_X = 960 + SHIFT;
export const TITLE_Y = CY;
export const CHIP_AT = 32; // the girl clip starts here (scene 2 trims to match)
export const CHIP_RATE = 0.75;
const GRAD = `linear-gradient(90deg, ${C.pink}, #9B6BFF 45%, ${C.sky})`;

type Layer = 'outline' | 'fill' | 'grad';
const Word: React.FC<{text: string; f: number; seed: string; layer: Layer}> = ({text, f, seed, layer}) => {
  const base: React.CSSProperties = {...cond(900, 125), fontSize: SIZE, lineHeight: 1, whiteSpace: 'pre', letterSpacing: -1};
  if (layer === 'grad') {
    return <span style={{...base, background: GRAD, WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent'}}>{text}</span>;
  }
  if (layer === 'outline') {
    return <span style={{...base, color: 'transparent', WebkitTextStroke: '2px rgba(235,225,255,.9)'}}>{text}</span>;
  }
  // fill: a few letters jump while the glitch is on
  const g = f >= 3 && f <= 9;
  return (
    <span style={base}>
      {[...text].map((ch, i) => {
        const hit = g && random(`${seed}${i}${Math.floor(f / 2)}`) > 0.68;
        const dy = hit ? (random(`${seed}y${i}${f}`) - 0.5) * 70 : 0;
        return (
          <span key={i} style={{display: 'inline-block', translate: `0 ${dy}px`}}>
            {ch}
          </span>
        );
      })}
    </span>
  );
};

export const Title: React.FC = () => {
  const f = useCurrentFrame();
  if (f > 68) return null;
  const fill = ip(f, [3, 9], [0, 1]);
  const chroma = Math.max(Math.sin(Math.PI * ip(f, [2, 12], [0, 1])), 0.5 * Math.sin(Math.PI * ip(f, [23, 27], [0, 1])));
  const streakX = ip(f, [9, 19], [-300, 2200], INOUT);
  // split, then the chip grows to full frame
  const split = ip(f, [30, 42], [0, 1], OUT);
  const grow = ip(f, [43, 58], [0, 1], INOUT);
  const sx = 960 + SHIFT * (1 - grow); // the chip opens where the × was, then centres as it grows
  const CW0 = 440;
  const CH0 = 150;
  const cw = CW0 * split + (1920 - CW0) * grow;
  const ch = CH0 * Math.min(1, split * 1.4) + (1080 - CH0) * grow;
  const ccy = CY + (540 - CY) * grow;
  const slot = Math.max(SLOT0 * (1 - split), cw);
  const wRight = sx - slot / 2 - PAD;
  const aLeft = sx + slot / 2 + PAD;
  const push = Math.min(60, (1920 - CW0) * (grow - ip(f - 1, [43, 58], [0, 1], INOUT)) * 0.25);
  const shadow =
    chroma > 0.01 ? `${-16 * chroma}px 0 ${18 * chroma}px rgba(255,40,90,${0.95 * chroma}), ${16 * chroma}px 0 ${18 * chroma}px rgba(60,150,255,${0.9 * chroma})` : undefined;
  const row = (layer: Layer, style?: React.CSSProperties) => (
    <>
      <div style={{position: 'absolute', right: 1920 - wRight, top: TOP, ...style}}>
        <Word text="WORKFLOW" f={f} seed="w" layer={layer} />
      </div>
      <div style={{position: 'absolute', left: aLeft, top: TOP, ...style}}>
        <Word text="ALFA" f={f} seed="a" layer={layer} />
      </div>
    </>
  );
  const xO = 1 - split;
  const gradMask = `linear-gradient(90deg, #000 ${streakX}px, transparent ${streakX + 1}px)`;
  return (
    <AbsoluteFill>
      <Img
        src={staticFile('adflex-logo.png')}
        style={{
          position: 'absolute',
          height: 70,
          left: 960 - 122,
          top: CY - 200,
          opacity: ip(f, [2, 10], [0, 1]) * ip(f, [30, 38], [1, 0]),
          translate: `0 ${ip(f, [2, 10], [10, 0]) - 30 * ip(f, [30, 38], [0, 1], IN)}px`,
        }}
      />
      <MBlur id="title-push" x={push}>
        {f < 12 ? row('outline', {opacity: 1 - fill}) : null}
        {row('fill', {color: '#fff', opacity: fill, textShadow: shadow})}
        {/* lower half turns to the brand gradient where the streak has passed */}
        {f >= 9 ? <AbsoluteFill style={{clipPath: `inset(${CY + 2}px 0 0 0)`, WebkitMaskImage: gradMask, maskImage: gradMask}}>{row('grad')}</AbsoluteFill> : null}
        {xO > 0.01 ? (
          <svg width={110} height={110} viewBox="0 0 120 120" style={{position: 'absolute', left: sx - 55, top: CY - 55, opacity: xO * fill, scale: String(xO), rotate: `${90 * split}deg`, overflow: 'visible'}}>
            <defs>
              <linearGradient id="xg" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0" stopColor={C.pink} />
                <stop offset="1" stopColor={C.sky} />
              </linearGradient>
            </defs>
            <path d="M20 20 L100 100 M100 20 L20 100" stroke="url(#xg)" strokeWidth={22} strokeLinecap="round" fill="none" />
          </svg>
        ) : null}
      </MBlur>
      {/* the light streak along the word's middle */}
      {f >= 8 && f <= 20 ? (
        <div style={{position: 'absolute', left: streakX - 520, top: CY - 4, width: 560, height: 8, borderRadius: 4, background: 'linear-gradient(90deg, rgba(255,255,255,0), rgba(248,58,174,.8) 55%, #fff 92%, #fff)', boxShadow: '0 0 22px 6px rgba(248,58,174,.55)'}} />
      ) : null}
      {/* the selected chip that opens in the gap and becomes scene 2 */}
      {split > 0 ? (
        <div style={{position: 'absolute', left: sx - cw / 2, top: ccy - ch / 2, width: cw, height: ch}}>
          <div style={{position: 'absolute', inset: 0, borderRadius: 10 * (1 - grow), overflow: 'hidden', background: '#1a1426'}}>
            <Clip
              src="girl.mp4"
              from={CHIP_AT}
              playbackRate={CHIP_RATE}
              style={{position: 'absolute', left: '50%', top: '50%', width: Math.max(cw, (ch * 16) / 9), height: Math.max(ch, (cw * 9) / 16), translate: '-50% -50%', objectFit: 'cover'}}
            />
          </div>
          <div style={{position: 'absolute', inset: -2, border: '2px solid rgba(185,150,255,.9)', borderRadius: 10 * (1 - grow), opacity: 1 - ip(f, [48, 54], [0, 1])}} />
          {(
            [
              [0, 0, C.pink],
              [1, 0, C.sky],
              [0, 1, '#C8F25B'],
              [1, 1, C.lav],
            ] as const
          ).map(([hx, hy, col], i) => (
            <div
              key={i}
              style={{
                position: 'absolute',
                left: hx * cw - 7,
                top: hy * ch - 7,
                width: 14,
                height: 14,
                borderRadius: 3,
                background: col,
                border: '2px solid #fff',
                opacity: ip(f, [32 + i, 36 + i], [0, 1]) * (1 - ip(f, [48, 54], [0, 1])),
                scale: String(0.5 + 0.5 * ip(f, [32 + i, 38 + i], [0, 1], OUT)),
              }}
            />
          ))}
        </div>
      ) : null}
    </AbsoluteFill>
  );
};
