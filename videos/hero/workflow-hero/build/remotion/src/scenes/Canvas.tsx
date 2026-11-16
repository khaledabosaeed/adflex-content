import React from 'react';
import {AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame} from 'remotion';

import {C, Crop, INOUT, ip, Kicker, Label, MBlur, Orb, OUT, ScanLine, springAt, UI, UIWindow, Clip, whipIn, whipOut, Wipe} from '../lib';

const SW = 1536; // canvas recordings (top-left 1536x994 of the take)
const SH = 994;
const W = 1240;
const K = W / SW;
const RUN_AT = 108; // runsel.mp4 starts (its frame 0 = runsel-0.png)
const RUN_RATE = 3.5; // the click (3.51 s) lands on frame 138
const CLICK = 138;
const SCAN_END = CLICK + 20;
const SCAN = [CLICK + 2, SCAN_END]; // light line converts input → output (top to bottom)
const TL_AT = CLICK + 2; // the finished run is revealed as the scanline sweeps down
// finished outputs that pop toward the camera right after the scan (the ads node stays small on purpose: the ads are not good enough for a close-up)
const RESULTS = [
  {x: 706, y: 100, w: 146, h: 168, at: SCAN_END + 1}, // music
  {x: 698, y: 272, w: 162, h: 258, at: SCAN_END + 5}, // story video
  {x: 922, y: 188, w: 142, h: 276, at: SCAN_END + 9}, // music attached to the video
];
const OUT_AT = 192; // the story video lifts out of its node
const END = 222; // the end card whips in here
const BTN = {x: 1290, y: 893, w: 236, h: 44};
const PHOTO = {x: 300, y: 405, w: 146, h: 226};
const STORY_NODE = {x: 707, y: 300, w: 146, h: 225};
// screen points the camera works around
export const RUN_SCREEN = {x: 1210, y: 730};
export const CARD_SCREEN = {x: 1420, y: 550};

// the node's path through the graph while it "builds" it (source pixels)
const PATH_F = [4, 26, 36, 48, 58, 68, 80, 92];
const PATH_X = [900, 372, 565, 780, 780, 990, 1175, 1420];
const PATH_Y = [470, 520, 375, 420, 700, 300, 400, 300];
const path = (f: number) => ({
  x: interpolate(f, PATH_F, PATH_X, {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: INOUT}),
  y: interpolate(f, PATH_F, PATH_Y, {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: INOUT}),
});

const scanY = (f: number) => ip(f, SCAN, [-20, SH + 20], INOUT);
const Layer: React.FC<{children: React.ReactNode; mask?: string}> = ({children, mask}) => (
  <div style={{position: 'absolute', left: 0, top: 0, width: SW, height: SH, overflow: 'hidden', WebkitMaskImage: mask, maskImage: mask}}>{children}</div>
);
const Content: React.FC<{f: number}> = ({f}) => (
  <>
    <Layer>
      <Img src={staticFile('runsel-0.png')} style={{position: 'absolute', left: 0, top: 0, width: 1920, height: 1080}} />
    </Layer>
    {f >= RUN_AT && f < SCAN[1] + 1 ? (
      <Layer>
        <Clip src="runsel.mp4" from={RUN_AT} playbackRate={RUN_RATE} style={{position: 'absolute', left: 0, top: 0, width: 1920, height: 1080}} />
      </Layer>
    ) : null}
    {/* no loading states: the line converts the graph straight into the finished run (last frame of the run take) */}
    {f >= TL_AT ? (
      <Layer mask={f < SCAN[1] ? `linear-gradient(180deg, #000 ${scanY(f)}px, transparent ${scanY(f) + 1}px)` : undefined}>
        <Img src={staticFile('runout.png')} style={{position: 'absolute', left: 0, top: 0, width: 1920, height: 1080}} />
      </Layer>
    ) : null}
  </>
);

/** Scene 4: the workflow ALFA built, on the real canvas. Build sweep → Run → timelapse → the story video lifts out. */
export const Canvas: React.FC = () => {
  const f = useCurrentFrame();
  const enter = ip(f, [0, 16], [0, 1], OUT); // brakes after the whip
  const wi = whipIn(f, 0);
  const wo = whipOut(f, END - 4);
  // camera: push to the Run button, then back out
  const toBtn = ip(f, [RUN_AT - 4, 126], [0, 1], INOUT) * (1 - ip(f, [CLICK + 4, 158], [0, 1], INOUT));
  const bx = BTN.x + BTN.w / 2;
  const by = BTN.y + BTN.h / 2;
  // during the build the camera follows the node through the graph (lagging a little), then pulls back
  const H = SH * K + 42;
  const wB = ip(f, [16, 40], [0, 1], INOUT) * (1 - ip(f, [88, 106], [0, 1], INOUT));
  const sB = 1 + 0.65 * wB;
  const fp = path(f - 7);
  const fx = Math.min(1180, Math.max(372, fp.x));
  const fy = Math.min(700, Math.max(300, fp.y));
  const baseX = 1040 + (1000 - (fx * K - W / 2) * sB - 1040) * wB;
  const baseY = 640 + (620 - (42 + fy * K - H / 2) * sB - 640) * wB;
  const s = sB * (1 + 0.5 * toBtn);
  const cx = baseX + (1210 - (bx * K - W / 2) * 1.5 - baseX) * toBtn;
  const cy = baseY + (730 - (42 + by * K - (SH * K + 42) / 2) * 1.5 - baseY) * toBtn;
  const lift = ip(f, [118, 132], [0, 1], INOUT) * (1 - ip(f, [CLICK + 6, CLICK + 16], [0, 1]));
  const press = Math.sin(Math.PI * ip(f, [CLICK - 3, CLICK + 5], [0, 1], INOUT));
  // build sweep
  const p = path(f);
  const revealX = f < 26 ? 230 : Math.max(230, interpolate(f, [26, 100], [372 + 220, 1800], {extrapolateRight: 'clamp', easing: OUT}));
  const sweeping = f < 104;
  const photoLift = Math.sin(Math.PI * ip(f, [26, 52], [0, 1], INOUT));
  // output
  const outP = ip(f, [OUT_AT, OUT_AT + 20], [0, 1], INOUT);
  // an orbit while it builds
  const orbitY = 6 * Math.sin((f - 20) / 26) * ip(f, [16, 40], [0, 1]) * (1 - ip(f, [96, 110], [0, 1]));
  const card = {
    w: STORY_NODE.w + (381 - STORY_NODE.w) * outP,
    h: STORY_NODE.h + (677 - STORY_NODE.h) * outP,
  };
  const cardC = {x: STORY_NODE.x + STORY_NODE.w / 2 + (1180 - 780) * outP, y: STORY_NODE.y + STORY_NODE.h / 2 + (430 - 412) * outP};
  const mask = sweeping ? `linear-gradient(90deg, #000 ${revealX}px, transparent ${revealX + 240}px)` : undefined;
  return (
    <>
    <MBlur id="canvas-whip" x={Math.max(wi.blur, wo.blur)} style={{translate: `${wi.x + wo.x}px 0`}}>
    <AbsoluteFill style={{perspective: 2200}}>
      <UIWindow
        w={W}
        srcW={SW}
        srcH={SH}
        cx={cx}
        cy={cy}
        s={s}
        rx={7 - 3 * toBtn}
        ry={-34 * (1 - enter) - 7 * enter * (1 - toBtn) + orbitY}
        rz={4 * (1 - enter)}
        dim={0.7 * outP}
        content={
          <>
            {sweeping ? <div style={{position: 'absolute', inset: 0, background: '#121118'}} /> : null}
            <div style={{position: 'absolute', inset: 0, WebkitMaskImage: mask, maskImage: mask}}>
              <Content f={f} />
            </div>
          </>
        }
        overlay={
          <>
            {/* the product photo node lifts as the node lands on it */}
            {f > 24 && f < 56 ? (
              <Crop {...PHOTO} srcW={SW} srcH={SH} z={70 * photoLift} s={1 + 0.05 * photoLift} glow={photoLift} radius={12}>
                <Img src={staticFile('runsel-0.png')} style={{width: 1920, height: 1080}} />
              </Crop>
            ) : null}
            {f < 100 ? <Orb x={p.x} y={p.y} s={ip(f, [4, 12], [0.4, 1.5]) * (1 - ip(f, [90, 100], [0, 1]))} trail={[2, 4, 6].map((d) => { const q = path(f - d); return [q.x, q.y] as [number, number]; })} /> : null}
            {/* Run selected · 510 cr lifts toward the camera */}
            {lift > 0.001 || press > 0.001 ? (
              <Crop {...BTN} srcW={SW} srcH={SH} z={150 * lift} s={1 + 0.15 * lift - 0.05 * press} glow={Math.max(lift, press)} radius={10}>
                <Clip src="runsel.mp4" from={RUN_AT} playbackRate={RUN_RATE} style={{position: 'absolute', left: 0, top: 0, width: 1920, height: 1080}} />
              </Crop>
            ) : null}
            {/* Run: a light line sweeps down and converts the graph into the running one */}
            {f >= SCAN[0] && f <= SCAN[1] + 2 ? <ScanLine y={scanY(f)} w={SW} o={ip(f, [SCAN[1] - 2, SCAN[1] + 2], [1, 0])} /> : null}
            {/* the finished outputs pop toward the camera one by one, then settle */}
            {f > SCAN_END && f < OUT_AT
              ? RESULTS.map((r, i) => {
                  const up = Math.max(0, springAt(f, r.at, 16)) * (1 - ip(f, [OUT_AT - 10, OUT_AT], [0, 1], INOUT));
                  return up > 0.001 ? (
                    <Crop key={i} x={r.x} y={r.y} w={r.w} h={r.h} srcW={SW} srcH={SH} z={110 * up} s={1 + 0.08 * up} glow={Math.min(1, up)} radius={10}>
                      <Img src={staticFile('runout.png')} style={{width: 1920, height: 1080}} />
                    </Crop>
                  ) : null;
                })
              : null}
            {/* the story video comes out of its node */}
            {f >= OUT_AT ? (
              <div
                style={{
                  position: 'absolute',
                  left: cardC.x - card.w / 2,
                  top: cardC.y - card.h / 2,
                  width: card.w,
                  height: card.h,
                  borderRadius: 10 + 18 * outP,
                  overflow: 'hidden',
                  transform: `translateZ(${420 * outP}px) rotateY(${7 * outP}deg) rotateX(${-7 * outP}deg)`,
                  boxShadow: `0 50px 110px rgba(0,0,0,${0.7 * outP}), 0 0 0 ${2 * outP}px rgba(255,255,255,.18), 0 0 90px rgba(135,56,245,${0.45 * outP})`,
                }}
              >
                <Clip src="story.mp4" from={OUT_AT - 6} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
                <div style={{position: 'absolute', left: 14, bottom: 14, fontFamily: UI, fontWeight: 800, fontSize: 20, color: '#fff', background: 'rgba(10,8,18,.55)', padding: '3px 14px 5px', borderRadius: 999, display: 'flex', gap: 8, alignItems: 'center', opacity: ip(f, [OUT_AT + 14, OUT_AT + 22], [0, 1])}}>
                  <b style={{width: 9, height: 9, borderRadius: '50%', background: C.vid}} />
                  Story video · with music
                </div>
              </div>
            ) : null}
          </>
        }
      />
    </AbsoluteFill>
    <Kicker text="02 · ALFA BUILDS IT" at={14} out={RUN_AT - 6} x={112} y={52} />
    <Label lines={[{t: 'ALFA BUILDS'}, {t: 'THE WORKFLOW.', bold: true}]} at={18} out={RUN_AT - 6} x={108} y={88} size={104} />
    <Kicker text="03 · RUN" at={RUN_AT + 2} out={OUT_AT - 4} x={112} y={52} />
    <Wipe text="RUN IT." mode="rise" at={RUN_AT + 4} out={OUT_AT - 4} dur={10} size={150} wght={900} wdth={68} style={{position: 'absolute', left: 104, top: 88}} />
    <Kicker text="04 · DONE" at={OUT_AT + 2} x={112} y={52} />
    <Label lines={[{t: 'FROM ONE SENTENCE:'}, {t: '3 ADS + A STORY VIDEO.', bold: true}]} at={OUT_AT + 2} x={108} y={88} size={96} />
    </MBlur>
    </>
  );
};
