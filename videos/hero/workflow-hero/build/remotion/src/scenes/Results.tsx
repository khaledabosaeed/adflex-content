import React from 'react';
import {AbsoluteFill, Img, staticFile, useCurrentFrame} from 'remotion';

import {C, Clip, INOUT, ip, Kicker, Label, MBlur, OUT, UI, whipIn, whipOut} from '../lib';

/*
 * Scene 5: what ALFA's workflow made, out of the canvas and big enough to read.
 * The story video (with music) and ad 1 are the heroes. Ads 2 and 3 (a collage and a 4-bottle grid)
 * stay small and pushed back, as the team asked.
 */
export const END = 106; // the end card whips in here

type CardProps = {x: number; y: number; w: number; h: number; at: number; dim?: number; children: React.ReactNode};
// calm entrance: fade in and settle up a little, flat (no depth fly, no tilt)
const Card: React.FC<CardProps & {f: number}> = ({f, x, y, w, h, at, dim = 0, children}) => {
  if (f < at) return null;
  const p = ip(f, [at, at + 14], [0, 1], OUT);
  return (
    <div
      style={{
        position: 'absolute',
        left: x - w / 2,
        top: y - h / 2 + 24 * (1 - p),
        width: w,
        height: h,
        borderRadius: 22,
        overflow: 'hidden',
        background: '#1a1426',
        opacity: p,
        scale: String(0.97 + 0.03 * p),
        boxShadow: '0 40px 90px rgba(0,0,0,.6), 0 0 0 1.5px rgba(255,255,255,.14)',
        filter: dim > 0 ? `brightness(${1 - dim})` : undefined,
      }}
    >
      {children}
    </div>
  );
};

const Tag: React.FC<{f: number; at: number; dot: string; children: React.ReactNode}> = ({f, at, dot, children}) => (
  <div
    style={{
      position: 'absolute',
      left: 16,
      bottom: 16,
      fontFamily: UI,
      fontWeight: 800,
      fontSize: 21,
      color: '#fff',
      background: 'rgba(10,8,18,.6)',
      padding: '4px 16px 6px',
      borderRadius: 999,
      display: 'flex',
      gap: 9,
      alignItems: 'center',
      opacity: ip(f, [at, at + 8], [0, 1]),
    }}
  >
    <b style={{width: 10, height: 10, borderRadius: '50%', background: dot}} />
    {children}
  </div>
);

export const Results: React.FC = () => {
  const f = useCurrentFrame();
  const wi = whipIn(f, 0);
  const wo = whipOut(f, END - 4);
  const kb = ip(f, [0, END], [1, 1.04], INOUT); // slow push inside the ad
  return (
    <MBlur id="results-whip" x={Math.max(wi.blur, wo.blur)} style={{translate: `${wi.x + wo.x}px 0`}}>
      <AbsoluteFill>
        <AbsoluteFill>
          {/* ads 2 and 3: small and pushed back */}
          <Card f={f} x={520} y={470} w={220} h={220} at={16} dim={0.3}>
            <Img src={staticFile('ad2.jpg')} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
          </Card>
          <Card f={f} x={540} y={800} w={220} h={220} at={18} dim={0.3}>
            <Img src={staticFile('ad3.jpg')} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
          </Card>
          {/* ad 1 */}
          <Card f={f} x={860} y={640} w={480} h={480} at={10}>
            <Img src={staticFile('ad1.jpg')} style={{width: '100%', height: '100%', objectFit: 'cover', scale: String(kb)}} />
            <Tag f={f} at={26} dot={C.img}>
              Ad 1 of 3
            </Tag>
          </Card>
          {/* the story video, with music */}
          <Card f={f} x={1400} y={580} w={370} h={658} at={4}>
            <Clip src="story.mp4" style={{width: '100%', height: '100%', objectFit: 'cover'}} />
            <Tag f={f} at={22} dot={C.vid}>
              Story video · with music
            </Tag>
          </Card>
          {/* music chip */}
          <Card f={f} x={1720} y={300} w={240} h={80} at={22}>
            <div style={{position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', gap: 12, padding: '0 20px', fontFamily: UI, fontWeight: 800, fontSize: 21, color: '#fff'}}>
              <b style={{width: 10, height: 10, borderRadius: '50%', background: C.aud}} />
              Music
              <div style={{display: 'flex', gap: 4, alignItems: 'center', marginLeft: 'auto'}}>
                {[0, 1, 2, 3, 4, 5, 6].map((i) => (
                  <i key={i} style={{width: 5, borderRadius: 3, background: C.aud, height: 10 + 22 * Math.abs(Math.sin(f / 4 + i * 1.3))}} />
                ))}
              </div>
            </div>
          </Card>
        </AbsoluteFill>
      </AbsoluteFill>
      <Kicker text="04 · DONE" at={4} out={END - 6} x={112} y={52} />
      <Label lines={[{t: 'MADE BY ALFA:'}, {t: '3 ADS + A STORY VIDEO.', bold: true}]} at={6} out={END - 6} x={108} y={88} size={96} />
    </MBlur>
  );
};
