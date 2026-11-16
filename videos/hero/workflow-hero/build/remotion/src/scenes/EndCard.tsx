import React from 'react';
import {Img, staticFile, useCurrentFrame} from 'remotion';
import {C, DISP, INOUT, ip, Label, MBlur, springAt, UI, whipIn} from '../lib';

// real marks from the AdFlex FE: ALFA = the site favicon (public/android-chrome-512x512.png), Claude = public/icons/ai-clients/claude.svg.
// The FE has no MCP mark, so MCP stays text-only until we get the official file.
const CHIPS: {name: string; icon?: string}[] = [
  {name: 'ALFA', icon: 'alfa-mark.png'},
  {name: 'Claude', icon: 'claude-mark.svg'},
  {name: 'MCP'},
];
const DOTX = [700, 960, 1220];

/** Scene 5: end card. Whips in from the right (the canvas is shoved out left). Fades to the bare background so the loop is seamless. */
export const EndCard: React.FC = () => {
  const f = useCurrentFrame();
  const fo = ip(f, [84, 96], [0, 1], INOUT); // loop-out
  const k = 1 - fo;
  const w = whipIn(f, 0);
  const logo = springAt(f, 2, 18);
  const line = ip(f, [26, 40], [0, 1], INOUT);
  return (
    <MBlur id="end-whip" x={w.blur} style={{translate: `${w.x}px 0`}}>
      <div style={{position: 'absolute', left: 960 - 520, top: 260 - 300, width: 1040, height: 600, borderRadius: '50%', background: 'radial-gradient(closest-side, rgba(135,56,245,.42), transparent)', opacity: ip(f, [8, 30], [0, 1]) * k}} />
      <Img
        src={staticFile('adflex-logo.png')}
        style={{
          position: 'absolute',
          width: 640,
          left: 960 - 320,
          top: 220 - 92,
          opacity: k,
          scale: String(0.8 + 0.2 * logo),
        }}
      />
      <div style={{opacity: k}}>
        <Label lines={[{t: 'BUILD WORKFLOWS'}, {t: 'IN ONE SENTENCE.', bold: true}]} at={8} x={0} y={344} size={104} align="center" />
      </div>
      <svg width={1920} height={1080} style={{position: 'absolute', left: 0, top: 0, opacity: k}}>
        <defs>
          <linearGradient id="eline" x1="0" x2="1">
            <stop offset="0" stopColor={C.pink} />
            <stop offset="1" stopColor={C.sky} />
          </linearGradient>
        </defs>
        <path d="M700 616 L1220 616" stroke="url(#eline)" strokeWidth={5} strokeLinecap="round" pathLength={1} strokeDasharray="1" strokeDashoffset={1 - line} />
      </svg>
      {DOTX.map((x, i) => {
        const p = springAt(f, 32 + i * 4, 14);
        return (
          <div key={x} style={{position: 'absolute', left: x - 11, top: 605, width: 22, height: 22, borderRadius: '50%', background: [C.pink, '#9B6BFF', C.sky][i], boxShadow: `0 0 0 5px ${C.bg}, 0 0 18px 4px rgba(155,107,255,.6)`, opacity: (f >= 32 + i * 4 ? 1 : 0) * k, scale: String(0.4 + 0.6 * p)}} />
        );
      })}
      {CHIPS.map((c, i) => {
        const p = springAt(f, 42 + i * 3, 16);
        return (
          <div
            key={c.name}
            style={{
              position: 'absolute',
              left: DOTX[i] - 110,
              width: 220,
              top: 672,
              textAlign: 'center',
              fontFamily: UI,
              fontWeight: 800,
              fontSize: 30,
              color: '#efe9fb',
              opacity: (f >= 42 + i * 3 ? 1 : 0) * k,
              scale: String(0.8 + 0.2 * p),
            }}
          >
            <span style={{display: 'inline-flex', alignItems: 'center', gap: 12, background: 'rgba(255,255,255,.06)', border: '2px solid rgba(185,150,255,.45)', borderRadius: 999, padding: '6px 28px 8px'}}>
              {c.icon ? <Img src={staticFile(c.icon)} style={{width: 32, height: 32}} /> : null}
              {c.name}
            </span>
          </div>
        );
      })}
      <div style={{position: 'absolute', left: 0, width: 1920, top: 772, textAlign: 'center', fontFamily: UI, fontWeight: 700, fontSize: 38, color: '#cfc6e6', opacity: ip(f, [52, 62], [0, 1]) * k, translate: `0 ${ip(f, [52, 62], [14, 0])}px`}}>
        Works inside the AI you already use.
      </div>
      <div style={{position: 'absolute', left: 0, width: 1920, top: 862, display: 'flex', justifyContent: 'center', opacity: ip(f, [58, 64], [0, 1]) * k}}>
        <div style={{fontFamily: DISP, fontSize: 44, color: '#fff', background: 'linear-gradient(135deg, #8337F1, #6730D4)', padding: '14px 44px 18px', borderRadius: 20, boxShadow: '0 18px 50px rgba(131,55,241,.45)', scale: String(0.9 + 0.1 * springAt(f, 58, 18))}}>
          Try it at adflex.ai
        </div>
      </div>
    </MBlur>
  );
};

