import React from 'react';
import {AbsoluteFill} from 'remotion';

import {cond, UI} from '../lib';

/** Storyboard only: marks a shot whose real material doesn't exist yet. Removed once the material is in. */
export const Placeholder: React.FC<{title: string; lines: string[]; style?: React.CSSProperties}> = ({title, lines, style}) => (
  <div style={{position: 'absolute', left: 560, top: 300, width: 800, padding: '28px 34px', borderRadius: 18, background: 'rgba(14,11,22,.82)', border: '2px dashed rgba(200,170,255,.8)', color: '#efe9ff', ...style}}>
    <div style={{...cond(860, 100), fontSize: 30, letterSpacing: 2, color: '#C8A8FF'}}>PLACEHOLDER · {title}</div>
    {lines.map((l, i) => (
      <div key={i} style={{fontFamily: UI, fontSize: 24, lineHeight: 1.35, marginTop: 10}}>
        {l}
      </div>
    ))}
  </div>
);

export const Dim: React.FC = () => <AbsoluteFill style={{background: 'rgba(8,6,14,.45)'}} />;
