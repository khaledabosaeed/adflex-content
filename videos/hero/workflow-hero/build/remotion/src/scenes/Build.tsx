import React from 'react';
import {AbsoluteFill, Img, Sequence, staticFile, useCurrentFrame} from 'remotion';
import {PLAYER} from './Result';

import {Clip, INOUT, ip, Mark, markAt, NodeGlow, Slam, Still, WAKE} from '../lib';

/*
 * v11: ALFA builds the workflow. The real canvas ALFA just built, still empty (canvas-empty.mp4, Take A2 after
 * "Open workflow" + fit). ALFA's mark enters from the left edge (it left the reply on the right) and hops along
 * the graph; each node lights up as it arrives. Then a hard cut to the same workflow after its run (runout.png,
 * Take C), outputs filled in.
 */
export const END = 60;
export const FILLED_AT = 40;
export const MORPH = 10; // inside Filled: the story thumbnail starts growing into the player (Sound.tsx)
const K = 1.25;
const OX = 79;
const OY = -60;
type R = {x: number; y: number; w: number; h: number};
// node cards in canvas-empty (source px)
const NODES: R[] = [
  {x: 262, y: 466, w: 154, h: 210}, // your product photo
  {x: 464, y: 312, w: 164, h: 184}, // read the product details
  {x: 464, y: 122, w: 164, h: 178}, // instrumental music direction
  {x: 696, y: 128, w: 164, h: 104}, // twelve-second instrumental
  {x: 690, y: 308, w: 176, h: 266}, // vertical product story
  {x: 680, y: 582, w: 196, h: 312}, // three square product ads
  {x: 932, y: 220, w: 160, h: 148}, // attach music to story
  {x: 1136, y: 400, w: 140, h: 44}, // 3 ads and finished music story
];
const HOP = 4;
const START = 10;
const scr = (n: R) => ({x: (n.x + n.w / 2) * K + OX, y: (n.y + n.h / 2) * K + OY});

/** Build's first frame without the mark or the slam: Plan's workflow card opens up into exactly this. */
export const BUILD_VIEW: React.FC = () => (
  <AbsoluteFill style={{background: '#121117'}}>
    <div style={{position: 'absolute', left: OX, top: OY, width: 1920, height: 1080, transformOrigin: '0 0', scale: String(K)}}>
      <Still src="canvas-empty.mp4" frame={0} style={{position: 'absolute', width: 1920, height: 1080}} />
    </div>
  </AbsoluteFill>
);

export const Build: React.FC = () => {
  const f = useCurrentFrame();
  const pts = [{at: 0, x: -60, y: scr(NODES[0]).y}, ...NODES.map((n, i) => ({at: START + i * HOP, ...scr(n)}))];
  const m = markAt(f, pts);
  const push = 1 + 0.05 * ip(f, [0, FILLED_AT], [0, 1], INOUT);
  return (
    <AbsoluteFill style={{background: '#121117'}}>
      <Sequence durationInFrames={FILLED_AT} layout="none">
        <AbsoluteFill style={{scale: String(push)}}>
          <div style={{position: 'absolute', left: OX, top: OY, width: 1920, height: 1080, transformOrigin: '0 0', scale: String(K)}}>
            <Still src="canvas-empty.mp4" frame={0} style={{position: 'absolute', width: 1920, height: 1080}} />
            {NODES.map((n, i) => (
              <NodeGlow key={i} {...n} at={START + i * HOP} />
            ))}
          </div>
          <Mark x={m.x} y={m.y} trail={m.trail} />
        </AbsoluteFill>
      </Sequence>
      <Sequence from={FILLED_AT} layout="none">
        <Filled />
      </Sequence>
      <Slam text={'ALFA BUILDS\nTHE WORKFLOW.'} at={0} dur={12} size={130} />
    </AbsoluteFill>
  );
};

/*
 * The same workflow after its run (runout.png, outputs in the nodes). The camera dives at the last node (the
 * finished deliverables: 3 ads + the story video), it lights up, and its story-video thumbnail grows into the
 * player of the next scene (button-to-player morph): the result is what the run made.
 */
const RK = 1.3; // runout framing: screen = (190, -42) + src * RK
const G = {x: 1174, y: 440}; // centre of the output grid (runout px)
const GRID = {x: 1121, y: 379, w: 106, h: 123};
const STORY_CELL = {x: 1176, y: 442, w: 51, h: 60};
const Filled: React.FC = () => {
  const f = useCurrentFrame();
  const t = ip(f, [0, MORPH], [0, 1], INOUT);
  const k = RK + (3.4 - RK) * t;
  const gs = {x: 190 + G.x * RK + (960 - (190 + G.x * RK)) * t, y: -42 + G.y * RK + (540 - (-42 + G.y * RK)) * t};
  const ox = gs.x - G.x * k;
  const oy = gs.y - G.y * k;
  const glow = ip(f, [4, MORPH], [0, 1]);
  const m = ip(f, [MORPH, END - FILLED_AT], [0, 1], INOUT);
  const c = {x: ox + STORY_CELL.x * k, y: oy + STORY_CELL.y * k, w: STORY_CELL.w * k, h: STORY_CELL.h * k};
  const r = {x: c.x + (PLAYER.x - c.x) * m, y: c.y + (PLAYER.y - c.y) * m, w: c.w + (PLAYER.w - c.w) * m, h: c.h + (PLAYER.h - c.h) * m};
  return (
    <AbsoluteFill style={{background: '#121117', overflow: 'hidden'}}>
      <div style={{position: 'absolute', left: ox, top: oy, width: 1920, height: 1080, transformOrigin: '0 0', scale: String(k), filter: m > 0 ? `blur(${8 * m}px) brightness(${1 - 0.55 * m})` : undefined}}>
        <Img src={staticFile('runout.png')} style={{position: 'absolute', width: 1920, height: 1080}} />
        <div style={{position: 'absolute', left: GRID.x - 3, top: GRID.y - 3, width: GRID.w + 6, height: GRID.h + 6, borderRadius: 6, boxShadow: `0 0 0 ${1.2 * glow}px #C9AEFF, 0 0 ${16 * glow}px ${WAKE}`}} />
      </div>
      {m > 0 ? (
        <div style={{position: 'absolute', left: r.x, top: r.y, width: r.w, height: r.h, borderRadius: 4 + 18 * m, overflow: 'hidden', boxShadow: `0 ${40 * m}px ${100 * m}px rgba(0,0,0,.6)`}}>
          <Clip src="story.mp4" style={{width: '100%', height: '100%', objectFit: 'cover'}} />
        </div>
      ) : null}
    </AbsoluteFill>
  );
};
