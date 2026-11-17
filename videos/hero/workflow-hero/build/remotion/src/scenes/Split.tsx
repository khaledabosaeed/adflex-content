import React from 'react';
import {AbsoluteFill, Img, staticFile, useCurrentFrame} from 'remotion';

import {Clip, cond, INOUT, ip, Slam} from '../lib';
import {PhotoFill} from './Photo';

/*
 * Scene 4: INPUT | OUTPUT (the Genjutsu split). Left: the product photo that went in. Right: what the
 * workflow made, hard-cut every half second between the real outputs. The story video keeps playing
 * underneath, so every time it comes back it has moved on. Ad 2 is shown as its left panel (one bottle),
 * ad 3 (a 4-bottle grid) is left out.
 */
export const END = 45;
const CUT = 9; // one output every 0.3 s
type Out = 'story' | 'ad1' | 'ad2' | 'ad1z';
const SEQ: Out[] = ['ad1', 'story', 'ad2', 'ad1z', 'story'];
// the diagonal split (x at the top and at the bottom)
const XT = 1010;
const XB = 900;

const Tag: React.FC<{text: string; style: React.CSSProperties}> = ({text, style}) => (
  <div style={{position: 'absolute', ...cond(800, 80), fontSize: 30, letterSpacing: 3, color: '#fff', textShadow: '0 2px 14px rgba(0,0,0,.45)', ...style}}>{text}</div>
);

export const Split: React.FC = () => {
  const f = useCurrentFrame();
  const cur = SEQ[Math.min(SEQ.length - 1, Math.floor(f / CUT))];
  const push = 1 + 0.03 * ip(f, [0, END], [0, 1], INOUT);
  const right = `polygon(${XT}px 0, 1920px 0, 1920px 1080px, ${XB}px 1080px)`;
  const left = `polygon(0 0, ${XT}px 0, ${XB}px 1080px, 0 1080px)`;
  const rw = 1920 - XB; // the right panel's box (left edge at the bottom of the diagonal)
  return (
    <AbsoluteFill>
      {/* INPUT */}
      <AbsoluteFill style={{clipPath: left}}>
        <div style={{position: 'absolute', left: -470, top: 0, width: 1920, height: 1080, scale: String(push)}}>
          <PhotoFill w={1920} h={1080} />
        </div>
      </AbsoluteFill>
      {/* OUTPUT */}
      <AbsoluteFill style={{clipPath: right, background: '#e6dcef'}}>
        <div style={{position: 'absolute', left: XB, top: 0, width: rw, height: 1080, overflow: 'hidden', scale: String(push)}}>
          <div style={{position: 'absolute', inset: 0, opacity: cur === 'story' ? 1 : 0}}>
            <Clip src="story.mp4" style={{position: 'absolute', left: 0, top: (1080 - (rw * 16) / 9) / 2, width: rw, height: (rw * 16) / 9}} />
          </div>
          {cur === 'ad1' ? <Img src={staticFile('ad1.jpg')} style={{position: 'absolute', left: (rw - 1080) / 2, top: 0, width: 1080, height: 1080}} /> : null}
          {cur === 'ad1z' ? <Img src={staticFile('ad1.jpg')} style={{position: 'absolute', left: (rw - 1700) / 2, top: -330, width: 1700, height: 1700}} /> : null}
          {cur === 'ad2' ? <Img src={staticFile('ad2.jpg')} style={{position: 'absolute', left: (rw - 2160 / 2) / 2, top: 0, width: 2160, height: 2160, translate: '0 -27%'}} /> : null}
        </div>
      </AbsoluteFill>
      {/* the seam */}
      <svg width={1920} height={1080} style={{position: 'absolute', left: 0, top: 0}}>
        <line x1={XT} y1={-10} x2={XB} y2={1090} stroke="#fff" strokeWidth={6} />
      </svg>
      <AbsoluteFill style={{background: 'linear-gradient(0deg, rgba(11,9,18,.75), rgba(11,9,18,.35) 24%, transparent 40%)', pointerEvents: 'none'}} />
      <Tag text="INPUT" style={{left: 70, top: 46}} />
      <Tag text="OUTPUT" style={{right: 70, top: 46}} />
      <Slam text={'3 ADS +\nA STORY VIDEO.'} at={1} dur={12} size={120} />
    </AbsoluteFill>
  );
};
