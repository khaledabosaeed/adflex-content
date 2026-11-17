import React from 'react';
import {AbsoluteFill, Img, staticFile, useCurrentFrame} from 'remotion';
import {C, cond, INOUT, ip, springAt} from '../lib';

/*
 * End card (v17): a website hero needs two words, so it is just AdFlex and ALFA. ALFA's mark arrives already in
 * place: it is the same mark that walked the workflow, carried here by Flow (object carry), so on frame 0 it sits
 * at END_MARK at full size. On its landing a ring goes out, "ALFA" sharpens in under it in the brand gradient and
 * the AdFlex logo settles on top. No tagline, chips or CTA (the page around the hero carries those). Fades to the
 * bare background so the loop is seamless.
 */
export const END_MARK = {x: 960, y: 420, size: 220}; // Flow's carried mark lands here
const GRAD = `linear-gradient(90deg, ${C.pink}, #9B6BFF 45%, ${C.sky})`;

export const EndCard: React.FC = () => {
  const f = useCurrentFrame();
  const fo = ip(f, [72, 84], [0, 1], INOUT); // loop-out
  const k = 1 - fo;
  const logo = springAt(f, 3, 18);
  const word = ip(f, [0, 9], [0, 1], INOUT);
  const ring = ip(f, [0, 22], [0, 1]);
  const pulse = 1 + 0.03 * Math.sin(Math.max(0, f - 14) / 9);
  return (
    <AbsoluteFill>
      <div style={{position: 'absolute', left: 960 - 620, top: 560 - 380, width: 1240, height: 760, borderRadius: '50%', background: 'radial-gradient(closest-side, rgba(135,56,245,.5), transparent)', opacity: ip(f, [0, 16], [0.4, 1]) * k}} />
      <Img src={staticFile('adflex-logo.png')} style={{position: 'absolute', width: 420, left: 960 - 210, top: 150, opacity: k * Math.min(1, logo * 1.5), translate: `0 ${-20 * (1 - logo)}px`}} />
      {/* ALFA's mark: glow, a ring going out once, a slow breath */}
      {ring > 0 && ring < 1 ? (
        <div style={{position: 'absolute', left: END_MARK.x - 110 - 260 * ring, top: END_MARK.y - 110 - 260 * ring, width: 220 + 520 * ring, height: 220 + 520 * ring, borderRadius: '50%', border: `${3 * (1 - ring) + 1}px solid ${C.lav}`, opacity: Math.exp(-3 * ring) * k}} />
      ) : null}
      <div style={{position: 'absolute', left: END_MARK.x - END_MARK.size / 2, top: END_MARK.y - END_MARK.size / 2, width: END_MARK.size, height: END_MARK.size, opacity: k, scale: String(pulse), filter: `drop-shadow(0 0 ${4 + 36 * ip(f, [0, 10], [0, 1])}px rgba(155,107,255,.75))`}}>
        <Img src={staticFile('alfa-mark.png')} style={{width: '100%', height: '100%'}} />
      </div>
      <div style={{position: 'absolute', left: 0, width: 1920, top: 560, textAlign: 'center', opacity: word * k, filter: word < 1 ? `blur(${14 * (1 - word)}px)` : undefined, scale: String(1.08 - 0.08 * word)}}>
        <span style={{...cond(900, 125), fontSize: 250, lineHeight: 1, letterSpacing: 6, background: GRAD, WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent'}}>ALFA</span>
      </div>
    </AbsoluteFill>
  );
};
