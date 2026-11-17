import React from 'react';
import {AbsoluteFill, Img, staticFile, useCurrentFrame} from 'remotion';

import {Clip, cond, INOUT, ip, springAt} from '../lib';

/*
 * v14: the final result, front and centre. The story-video thumbnail in the workflow's last node has just grown
 * into this player (Build → button-to-player morph), so the scene opens on it already playing; the real ads then
 * swing in on both sides as 3D cards (ad1 left, ad2's one-bottle half right; ad3's grid has invented label text,
 * so it stays out), and the line rises under them.
 */
export const END = 60;
export const PLAYER = {x: 729, y: 58, w: 462, h: 822}; // 9:16, Build's morph lands here
export const STORY_FROM = 10; // frames of story.mp4 already played inside the morph
export const LAND = [6, 10]; // the two ad cards land (Sound.tsx)

const Card: React.FC<{at: number; side: -1 | 1; children: React.ReactNode}> = ({at, side, children}) => {
  const f = useCurrentFrame();
  const s = springAt(f, at, 16);
  if (f < at) return null;
  const size = 470;
  const x = 960 + side * 600 - size / 2;
  return (
    <div style={{position: 'absolute', left: x + side * 500 * (1 - s), top: 470 - size / 2, width: size, height: size, borderRadius: 16, overflow: 'hidden', opacity: Math.min(1, s * 1.6), transform: `perspective(1600px) rotateY(${-side * (16 + 40 * (1 - s))}deg)`, boxShadow: '0 30px 80px rgba(0,0,0,.55)'}}>
      {children}
    </div>
  );
};

export const Result: React.FC = () => {
  const f = useCurrentFrame();
  const push = 1 + 0.035 * ip(f, [0, END], [0, 1], INOUT);
  const cap = ip(f, [14, 22], [0, 1], INOUT);
  return (
    <AbsoluteFill style={{background: '#0d0b14', overflow: 'hidden'}}>
      {/* the story's own light around it */}
      <AbsoluteFill style={{filter: 'blur(60px) brightness(.55) saturate(1.2)', scale: '1.3'}}>
        <Clip src="story.mp4" trimBefore={STORY_FROM} style={{width: 1920, height: 1080, objectFit: 'cover'}} />
      </AbsoluteFill>
      <AbsoluteFill style={{background: 'radial-gradient(ellipse 70% 70% at 50% 45%, transparent, rgba(8,6,14,.75))'}} />
      <AbsoluteFill style={{scale: String(push)}}>
        <Card at={LAND[0]} side={-1}>
          <Img src={staticFile('ad1.jpg')} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
        </Card>
        <Card at={LAND[1]} side={1}>
          <Img src={staticFile('ad2.jpg')} style={{position: 'absolute', left: 0, top: 0, width: '200%', height: '200%', translate: '0 -27%'}} />
        </Card>
        <div style={{position: 'absolute', left: PLAYER.x, top: PLAYER.y, width: PLAYER.w, height: PLAYER.h, borderRadius: 22, overflow: 'hidden', boxShadow: '0 40px 100px rgba(0,0,0,.6), 0 0 0 1.5px rgba(255,255,255,.12)'}}>
          <Clip src="story.mp4" trimBefore={STORY_FROM} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
        </div>
      </AbsoluteFill>
      <div style={{position: 'absolute', left: 0, right: 0, top: 932, textAlign: 'center', ...cond(900, 72), fontSize: 76, color: '#fff', letterSpacing: 1, opacity: cap, translate: `0 ${24 * (1 - cap)}px`, textShadow: '0 6px 30px rgba(0,0,0,.6)'}}>
        3 ADS + A STORY VIDEO.
      </div>
    </AbsoluteFill>
  );
};
