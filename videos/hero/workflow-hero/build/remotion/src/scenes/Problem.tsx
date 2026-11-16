import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';

import {C, INOUT, ip, Label, MBlur, springAt, UI, Clip, whipOut, Wipe} from '../lib';
import {CHIP_AT, CHIP_RATE} from './Title';

const START = 64; // absolute frame this scene starts (the title's chip has been playing the clip since CHIP_AT)
export const WHIP = 110; // the whip push to ALFA

type Tool = {name: string; kind: 'img' | 'vid' | 'aud'; x: number; y: number; r: number; at: number; w: number};
const TOOLS: Tool[] = [
  {name: 'Image tool', kind: 'img', x: 1690, y: 250, r: -6, at: 46, w: 380},
  {name: 'Video editor', kind: 'vid', x: 1700, y: 590, r: 5, at: 52, w: 390},
  {name: 'Music', kind: 'aud', x: 1240, y: 830, r: 4, at: 57, w: 360},
  {name: 'Upscaler', kind: 'img', x: 760, y: 760, r: -6, at: 62, w: 330},
  {name: 'Voice', kind: 'aud', x: 1690, y: 930, r: -5, at: 66, w: 320},
  {name: 'Story maker', kind: 'vid', x: 860, y: 540, r: 7, at: 70, w: 320},
];
const FILES = [
  {t: 'ad_v3_final.png', k: 'img' as const, x: 1420, y: 700, at: 74},
  {t: 'story_FINAL_2.mp4', k: 'vid' as const, x: 1000, y: 900, at: 79},
  {t: 'music_new(1).mp3', k: 'aud' as const, x: 560, y: 960, at: 84},
];
const COL = {img: C.img, vid: C.vid, aud: C.aud};

const ToolBody: React.FC<{kind: Tool['kind']}> = ({kind}) => {
  if (kind === 'img')
    return (
      <div style={{display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10, padding: 16}}>
        {Array.from({length: 6}, (_, i) => (
          <div key={i} style={{height: 64, borderRadius: 10, background: `linear-gradient(${135 + i * 20}deg, rgba(50,146,255,.75), rgba(50,146,255,.12))`}} />
        ))}
      </div>
    );
  if (kind === 'vid')
    return (
      <div style={{padding: 16}}>
        <div style={{height: 96, borderRadius: 10, background: 'linear-gradient(135deg, rgba(248,58,174,.7), rgba(248,58,174,.12))'}} />
        <div style={{display: 'flex', gap: 6, marginTop: 12}}>
          {[1, 2, 1, 1.5, 1].map((fl, i) => (
            <i key={i} style={{flex: fl, height: 22, borderRadius: 6, background: 'rgba(248,58,174,.5)'}} />
          ))}
        </div>
      </div>
    );
  return (
    <div style={{display: 'flex', alignItems: 'center', gap: 4, height: 150, padding: '0 16px'}}>
      {Array.from({length: 38}, (_, i) => (
        <i key={i} style={{flex: 1, height: 12 + Math.abs(Math.sin(i * 0.7) * Math.cos(i * 0.23)) * 110, borderRadius: 3, background: 'rgba(6,181,138,.8)'}} />
      ))}
    </div>
  );
};

/** Scene 2: the girl's problem. Same content every week, spread over many tools; it all gets pulled into one node. */
export const Problem: React.FC = () => {
  const f = useCurrentFrame();
  const crowd = ip(f, [44, 90], [0, 1], INOUT);
  const zoom = 1 + 0.06 * ip(f, [0, 110], [0, 1], INOUT);
  const w = whipOut(f, WHIP);
  return (
    <MBlur id="problem-whip" x={w.blur} style={{translate: `${w.x}px 0`}}>
      <AbsoluteFill style={{scale: String(zoom), transformOrigin: '62% 50%', filter: crowd > 0 ? `brightness(${1 - 0.5 * crowd}) blur(${crowd * 7}px)` : undefined}}>
        <Clip src="girl.mp4" playbackRate={CHIP_RATE} trimBefore={(START - CHIP_AT) * CHIP_RATE} style={{width: 1920, height: 1080}} />
      </AbsoluteFill>
      <AbsoluteFill style={{background: 'linear-gradient(90deg, rgba(10,6,20,.75) 0%, rgba(10,6,20,.35) 38%, transparent 60%)', opacity: ip(f, [0, 14], [0, 1])}} />
      {/* the tools fly in from off screen, blurred and spinning, and land with a bounce */}
      <AbsoluteFill style={{perspective: 1800}}>
        {TOOLS.map((t, i) => {
          const p = springAt(f, t.at, 14);
          const fly = 1 - Math.min(1, ip(f, [t.at, t.at + 9], [0, 1]));
          const ang = Math.atan2(t.y - 540, t.x - 960);
          const d = 1300 * (1 - p);
          const drift = Math.sin((f + i * 20) / 18) * 8;
          return (
            <div
              key={t.name}
              style={{
                position: 'absolute',
                left: t.x + Math.cos(ang) * d - t.w / 2,
                top: t.y + Math.sin(ang) * d + drift - 110,
                width: t.w,
                borderRadius: 18,
                background: 'rgba(22,18,34,.92)',
                border: '1.5px solid rgba(255,255,255,.10)',
                boxShadow: `0 30px 70px rgba(0,0,0,.55), 0 0 0 1px ${COL[t.kind]}33`,
                overflow: 'hidden',
                opacity: f < t.at ? 0 : 1,
                filter: fly > 0.02 ? `blur(${fly * 14}px)` : undefined,
                transform: `rotateZ(${t.r + 50 * (1 - p)}deg) scale(${0.85 + 0.15 * p})`,
              }}
            >
              <div style={{height: 44, background: 'rgba(12,10,20,.9)', display: 'flex', alignItems: 'center', gap: 10, padding: '0 16px', fontFamily: UI, fontWeight: 800, fontSize: 20, color: '#e9e3f6'}}>
                <b style={{width: 11, height: 11, borderRadius: '50%', background: COL[t.kind]}} />
                {t.name}
              </div>
              <ToolBody kind={t.kind} />
            </div>
          );
        })}
        {FILES.map((d, i) => {
          const p = springAt(f, d.at, 12);
          return (
            <div
              key={d.t}
              style={{
                position: 'absolute',
                left: d.x - 130,
                top: d.y - 24 + 500 * (1 - p),
                fontFamily: UI,
                fontWeight: 800,
                fontSize: 21,
                color: '#efe9fb',
                background: '#2a2340',
                border: '1px solid #3c3456',
                borderRadius: 12,
                padding: '8px 18px',
                display: 'flex',
                gap: 10,
                alignItems: 'center',
                whiteSpace: 'nowrap',
                boxShadow: '0 14px 30px rgba(0,0,0,.45)',
                opacity: f < d.at ? 0 : 1,
                transform: `rotate(${(i % 2 ? 4 : -4) * p + 25 * (1 - p)}deg)`,
              }}
            >
              <b style={{width: 10, height: 10, borderRadius: '50%', background: COL[d.k]}} />
              {d.t}
            </div>
          );
        })}
      </AbsoluteFill>
      <Label lines={[{t: 'SAME CONTENT.'}, {t: 'EVERY WEEK.', bold: true}]} at={12} x={110} y={150} size={124} />
      <div style={{position: 'absolute', left: 114, top: 410}}>
        <Wipe text="SIX TOOLS. ONE POST." at={58} size={46} wght={600} wdth={85} color="#d8cfee" />
      </div>
    </MBlur>
  );
};
