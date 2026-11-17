import React from 'react';
import {AbsoluteFill, Img, staticFile, useCurrentFrame} from 'remotion';

import {INOUT, ip, Mark, markAt, MBlur, NodeGlow, OUT, Slam, Still, UI, whipIn, whipOut, Wipe} from '../lib';
import {END_MARK} from './EndCard';
import {CANDLE, PhotoFill, Product, SERUM} from './Photo';

/*
 * Scene: the photo turns into the workflow, then a new product goes through the same workflow.
 *   1. Full-frame product photo (serum). The camera pulls back and the photo lands in the real canvas's
 *      "Your product photo" node, revealing the real workflow around it (runout.png).        ONE WORKFLOW.
 *   2. A new product (candle) wipes into the photo node; then, following the wires, every output node
 *      wipes over to the candle's real outputs (story video thumbnail, music+video, the 4 ad thumbnails).
 *                                                                         NEW PRODUCT. / SAME WORKFLOW.
 * The canvas itself is the real screenshot; only the media inside the nodes is replaced, at the measured
 * image rects (source px in runout.png). Play icons are left visible through a hole in the overlay.
 */
export const END = 144; // the next scene whips in here
export const END_V11 = 75;
// v17 ending (object carry): after the last node ALFA's mark flies to the centre and grows into the end card's mark,
// while the canvas pulls back into the dark. CARRY = [start, landed] in Flow frames; the end card starts 4 frames later.
export const CARRY: [number, number] = [59, 73];
const HOLD = 8; // full-frame photo before the pull-back
const MORPH = 30; // pull-back length
const LANDED = HOLD + MORPH;
const SWAP = 66; // the candle enters the photo node
// v11: Lama's candle photo arrives full frame (after the phone wipe) and lands straight in the node; ALFA's mark then walks the outputs
const V11 = {HOLD: 2, MORPH: 14, SWAP: 30};
const WIPE = 12;

// canvas framing: source px → screen = src * K + (OX, OY)
const K = 1.3;
const OX = 190;
const OY = -42;

type Rect = {x: number; y: number; w: number; h: number};
const PHOTO: Rect = {x: 309, y: 439, w: 127, h: 181};
const STORY: Rect = {x: 707, y: 301, w: 146, h: 225};
const ATTACH: Rect = {x: 929, y: 217, w: 127, h: 195};
const CELLS: Rect[] = [
  {x: 1121, y: 379, w: 52, h: 60},
  {x: 1176, y: 379, w: 51, h: 60},
  {x: 1121, y: 442, w: 52, h: 60},
  {x: 1176, y: 442, w: 51, h: 60},
];

/** A rect in source px with rounded corners; `hole` keeps the real play icon visible (local x, y, r). */
const Node: React.FC<{r: Rect; radius?: number; hole?: [number, number, number]; children: React.ReactNode; style?: React.CSSProperties}> = ({r, radius = 5, hole, children, style}) => {
  const mask = hole ? `radial-gradient(circle at ${hole[0]}px ${hole[1]}px, transparent ${hole[2]}px, #000 ${hole[2] + 1}px)` : undefined;
  return (
    <div style={{position: 'absolute', left: r.x, top: r.y, width: r.w, height: r.h, borderRadius: radius, overflow: 'hidden', WebkitMaskImage: mask, maskImage: mask, ...style}}>
      {children}
    </div>
  );
};

/** Top-to-bottom wipe from the old media to the new one, with a thin light edge riding the wipe. */
const Swap: React.FC<{r: Rect; at: number; radius?: number; hole?: [number, number, number]; old?: React.ReactNode; next: React.ReactNode}> = ({r, at, radius, hole, old, next}) => {
  const f = useCurrentFrame();
  const p = ip(f, [at, at + WIPE], [0, 1], INOUT);
  return (
    <>
      {old ? (
        <Node r={r} radius={radius} hole={hole}>
          {old}
        </Node>
      ) : null}
      {p > 0 ? (
        <Node r={r} radius={radius} hole={hole} style={{clipPath: `inset(0 0 ${(1 - p) * 100}% 0)`}}>
          {next}
        </Node>
      ) : null}
      {p > 0 && p < 1 ? (
        <div style={{position: 'absolute', left: r.x, top: r.y + p * r.h - 1, width: r.w, height: 1.6, background: '#fff', opacity: Math.sin(Math.PI * p), boxShadow: '0 0 8px 2px rgba(200,170,255,.85)'}} />
      ) : null}
    </>
  );
};

// the product-brief node's text (the workflow reads the photo and writes this); re-written for the candle in the node's own type
const BRIEF: Rect = {x: 499, y: 325, w: 133, h: 99};
const CANDLE_BRIEF = [
  'Product category: Scented candle,',
  'likely for home fragrance',
  'Silhouette: Cylindrical ribbed',
  'glass jar with a wooden lid',
  'Colors: Clear ribbed glass,',
  'cream wax, light wood lid',
  'Materials: Ribbed glass jar,',
];
const BriefText: React.FC = () => (
  <div style={{width: '100%', height: '100%', background: 'rgb(38,38,45)', fontFamily: UI, fontWeight: 500, fontSize: 9, lineHeight: '14px', color: '#d6d5da', whiteSpace: 'pre', paddingLeft: 2, paddingTop: 1}}>
    {CANDLE_BRIEF.join('\n')}
  </div>
);

const Cover: React.FC<{src: string}> = ({src}) => <Img src={staticFile(src)} style={{width: '100%', height: '100%', objectFit: 'cover'}} />;
// the candle story video's thumbnail: its frame at 4.6 s (the full candle)
const Thumb: React.FC = () => <Still src="candle-story.mp4" frame={138} style={{width: '100%', height: '100%', objectFit: 'cover'}} />;
const Photo: React.FC<{r: Rect; product: Product}> = ({r, product}) => <PhotoFill w={r.w} h={r.h} shift={0} product={product} />;

/** ALFA's mark (lib Mark: a 40 px disc, 26 px icon) carried to the end card: it grows until the icon is END_MARK.size,
 *  while the disc and its glow fade, leaving just the mark exactly where the end card draws it. */
const CarryMark: React.FC<{from: {x: number; y: number}; q: number}> = ({from, q}) => {
  const s = 1 + (END_MARK.size / 26 - 1) * q;
  const x = from.x + (END_MARK.x - from.x) * q;
  const y = from.y + (END_MARK.y - from.y) * q;
  const disc = 1 - ip(q, [0.45, 0.9], [0, 1]);
  return (
    <div style={{position: 'absolute', left: x - 20, top: y - 20, width: 40, height: 40, scale: String(s)}}>
      <div style={{position: 'absolute', inset: 0, borderRadius: '50%', background: '#17131f', opacity: disc, boxShadow: `0 0 0 1.5px rgba(200,170,255,.9), 0 0 28px 8px rgba(131,55,241,${0.75 * disc}), 0 0 80px 30px rgba(131,55,241,${0.3 * disc})`}} />
      <Img src={staticFile('alfa-mark.png')} style={{position: 'absolute', left: 7, top: 7, width: 26, height: 26, filter: `drop-shadow(0 0 ${4 * q}px rgba(155,107,255,.75))`}} />
    </div>
  );
};

export const Flow: React.FC<{v11?: boolean}> = ({v11 = false}) => {
  const f = useCurrentFrame();
  const end = v11 ? END_V11 : END;
  const hold = v11 ? V11.HOLD : HOLD;
  const landed = v11 ? V11.HOLD + V11.MORPH : LANDED;
  const swap = v11 ? V11.SWAP : SWAP;
  const wi = v11 ? {x: 0, blur: 0} : whipIn(f, 0);
  const wo = v11 ? {x: 0, blur: 0} : whipOut(f, end - 4);
  const q = v11 ? ip(f, CARRY, [0, 1], INOUT) : 0;
  // v11 order the mark walks: brief, story, attach, then the ad grid (the photo node is already the candle)
  const at = v11 ? {photo: -99, brief: swap, story: swap + 6, attach: swap + 12, cells: [swap + 17, swap + 19, swap + 21, swap + 23]} : {photo: SWAP, brief: SWAP + 8, story: SWAP + 16, attach: SWAP + 24, cells: [SWAP + 30, SWAP + 33, SWAP + 36, SWAP + 39]};
  const scr = (r: Rect) => ({x: r.x * K + OX, y: r.y * K + OY, w: r.w * K, h: r.h * K});
  const ctr = (r: Rect) => ({x: (r.x + r.w / 2) * K + OX, y: (r.y + r.h / 2) * K + OY});
  const GRID: Rect = {x: 1121, y: 379, w: 106, h: 123};
  const m = markAt(f, [
    {at: swap - 8, x: -60, y: ctr(PHOTO).y},
    {at: swap - 2, ...ctr(PHOTO)},
    {at: at.brief, ...ctr(BRIEF)},
    {at: at.story, ...ctr(STORY)},
    {at: at.attach, ...ctr(ATTACH)},
    {at: at.cells[0], ...ctr(GRID)},
    {at: at.cells[3] + (v11 ? 4 : 10), ...(v11 ? ctr(GRID) : {x: 2100, y: ctr(GRID).y - 80})},
  ]);

  // the pull-back: the photo rect R goes from the full frame to the node's on-screen rect T,
  // and the canvas camera keeps the node centred under R at matching height
  // v13: the candle was just seen full frame in the prompt scene, so the shrink starts already under way
  const p = ip(f, [v11 ? hold - 7 : hold, landed], [0, 1], INOUT);
  const T = {x: PHOTO.x * K + OX, y: PHOTO.y * K + OY, w: PHOTO.w * K, h: PHOTO.h * K};
  const R = {x: T.x * p, y: T.y * p, w: 1920 + (T.w - 1920) * p, h: 1080 + (T.h - 1080) * p};
  const c = R.h / T.h;
  const camX = R.x + R.w / 2 - (T.x + T.w / 2) * c;
  const camY = R.y + R.h / 2 - (T.y + T.h / 2) * c;
  const push = 1 + 0.04 * ip(f, [landed, end], [0, 1], INOUT);
  const fade = ip(f, [hold + 6, landed], [0, 1], OUT);

  return (
    <MBlur id="flow-whip" x={Math.max(wi.blur, wo.blur)} style={{translate: `${wi.x + wo.x}px 0`}}>
      <AbsoluteFill style={{scale: String(push * (1 - 0.1 * q)), transformOrigin: '1080px 560px', filter: q > 0 ? `blur(${10 * q}px) brightness(${1 - 0.8 * q})` : undefined, opacity: 1 - ip(f, [CARRY[0] + 6, CARRY[1]], [0, 1])}}>
        {/* the real canvas, with the node media replaced */}
        <div style={{position: 'absolute', left: 0, top: 0, width: 1920, height: 1080, transformOrigin: '0 0', transform: `translate(${camX}px, ${camY}px) scale(${c})`, filter: c > 1.02 ? `blur(${Math.min(6, (c - 1) * 1.6)}px)` : undefined}}>
          <div style={{position: 'absolute', left: OX, top: OY, width: 1920, height: 1080, transformOrigin: '0 0', scale: String(K)}}>
            <Img src={staticFile('runout.png')} style={{position: 'absolute', left: 0, top: 0, width: 1920, height: 1080}} />
            {/* paint out the mouse cursor with empty canvas from just above it */}
            <div style={{position: 'absolute', left: 1288, top: 805, width: 28, height: 36, overflow: 'hidden'}}>
              <Img src={staticFile('runout.png')} style={{position: 'absolute', left: -1288, top: -720, width: 1920, height: 1080}} />
            </div>
            <Swap r={PHOTO} at={at.photo} old={v11 ? undefined : <Photo r={PHOTO} product={SERUM} />} next={<Photo r={PHOTO} product={CANDLE} />} />
            <Swap r={BRIEF} at={at.brief} radius={0} next={<BriefText />} />
            <Swap r={STORY} at={at.story} hole={[72, 112, 11.5]} next={<Thumb />} />
            <Swap r={ATTACH} at={at.attach} hole={[63.5, 97.5, 11.5]} next={<Thumb />} />
            <Swap r={CELLS[0]} at={at.cells[0]} radius={4} next={<Cover src="candle-ad1.jpg" />} />
            <Swap r={CELLS[1]} at={at.cells[1]} radius={4} next={<Cover src="candle-ad2.jpg" />} />
            <Swap r={CELLS[2]} at={at.cells[2]} radius={4} next={<Cover src="candle-ad3.jpg" />} />
            <Swap r={CELLS[3]} at={at.cells[3]} radius={4} hole={[26, 30, 9]} next={<Thumb />} />
          </div>
        </div>
        {/* the photo itself, shrinking from the full frame into the node */}
        {p < 1 ? (
          <div style={{position: 'absolute', left: R.x, top: R.y, width: R.w, height: R.h, borderRadius: 5 * K * p, overflow: 'hidden', boxShadow: `0 ${30 * (1 - p)}px ${80 * (1 - p)}px rgba(0,0,0,${0.5 * p})`}}>
            <PhotoFill w={R.w} h={R.h} shift={0.12 * (1 - p)} product={v11 ? CANDLE : SERUM} />
          </div>
        ) : null}
        {v11 ? (
          <>
            {[{r: BRIEF, a: at.brief}, {r: STORY, a: at.story}, {r: ATTACH, a: at.attach}, {r: GRID, a: at.cells[0]}].map(({r, a}, i) => (
              <NodeGlow key={i} {...scr(r)} at={a} />
            ))}
            {f > swap - 9 && f < (v11 ? CARRY[0] : at.cells[3] + 11) ? <Mark x={m.x} y={m.y} trail={m.trail} /> : null}
          </>
        ) : null}
      </AbsoluteFill>
      {v11 && f >= CARRY[0] ? <CarryMark from={{x: 1080 + (ctr(GRID).x - 1080) * push, y: 560 + (ctr(GRID).y - 560) * push}} q={q} /> : null}
      {/* text sits bottom-left over a soft dark corner */}
      {v11 ? (
        <>
          <Slam text="ALFA RUNS IT AGAIN." at={landed - 2} dur={14} />
        </>
      ) : (
        <>
        <AbsoluteFill style={{opacity: fade, background: 'radial-gradient(ellipse 1150px 560px at 0% 100%, rgba(11,9,18,.94), rgba(11,9,18,.7) 45%, transparent 78%)'}} />
        <Wipe text="ONE WORKFLOW." mode="rise" at={LANDED - 10} out={SWAP - 8} dur={10} size={104} wght={900} wdth={68} style={{position: 'absolute', left: 104, top: 900}} />
        <Wipe text="NEW PRODUCT." mode="rise" at={SWAP + 2} out={END - 6} dur={10} size={104} wght={300} wdth={68} color="#d9d0ee" style={{position: 'absolute', left: 104, top: 800}} />
        <Wipe text="SAME WORKFLOW." mode="rise" at={SWAP + 28} out={END - 4} dur={10} size={104} wght={900} wdth={68} style={{position: 'absolute', left: 104, top: 900}} />
        </>
      )}
    </MBlur>
  );
};
