import React from 'react';
import {AbsoluteFill, Img, Sequence, staticFile, useCurrentFrame} from 'remotion';

import {Clip, INOUT, ip, MBlur, OUT, Still, whipIn, whipOut, Wipe} from '../lib';

/*
 * Scene 5: how it got made, as three quick cards (the Genjutsu "KEEP …" beat), real UI only:
 *   ALFA BUILDS IT.     ALFA's real workflow card (frame 70 of alfa-reply.mp4, from Take A2)
 *   ONE WORKFLOW.       the real canvas after the run (runout.png)
 *   RUN IT EVERY WEEK.  the real canvas, a slow push to "Run selected · 510 cr" and the click (runsel.mp4)
 * Each card whips in and out; the words rise. Flat cards, no tilt.
 */
export const LEN = 38; // frames per card
export const END = LEN * 3; // the next scene whips in here
const CLICK_AT = 22; // the Run click inside the third card
export const RUN_CLICK = 2 * LEN + CLICK_AT; // the Run click inside this scene
const RUN_RATE = 1.4;

const Frame: React.FC<{x: number; y: number; w: number; h: number; children: React.ReactNode}> = ({x, y, w, h, children}) => {
  const f = useCurrentFrame();
  const p = ip(f, [0, 14], [0, 1], OUT);
  return (
    <div
      style={{
        position: 'absolute',
        left: x - w / 2,
        top: y - h / 2,
        width: w,
        height: h,
        borderRadius: 20,
        overflow: 'hidden',
        background: '#100e17',
        scale: String((0.97 + 0.03 * p) * (1 + 0.025 * ip(f, [0, LEN], [0, 1], INOUT))),
        boxShadow: '0 50px 110px rgba(0,0,0,.6), 0 0 0 1.5px rgba(255,255,255,.12), 0 0 100px rgba(135,56,245,.25)',
      }}
    >
      {children}
    </div>
  );
};

const Card: React.FC<{word: string; last?: boolean; children: React.ReactNode}> = ({word, last, children}) => {
  const f = useCurrentFrame();
  const wi = whipIn(f, 0, 10);
  const wo = whipOut(f, LEN - 4, last ? 9 : 7);
  return (
    <MBlur id={`how-${word.replace(/\W/g, '')}`} x={Math.max(wi.blur, wo.blur)} style={{translate: `${wi.x + wo.x}px 0`}}>
      {children}
      <Wipe text={word} mode="rise" at={3} dur={9} size={132} wght={900} wdth={68} style={{position: 'absolute', left: 104, top: 74}} />
    </MBlur>
  );
};

// ALFA's workflow card: frame 70 of alfa-reply.mp4 (1464x996), card at 58,413, 658x298
const UICard: React.FC<{w: number}> = ({w}) => {
  const s = w / 658;
  return <Still src="alfa-reply.mp4" frame={70} style={{position: 'absolute', left: -58 * s, top: -413 * s, width: 1464 * s, height: 996 * s}} />;
};

const RunPush: React.FC = () => {
  const f = useCurrentFrame();
  const k = 1180 / 1536;
  const z = 1 + 0.35 * ip(f, [0, 22], [0, 1], INOUT);
  return (
    <div style={{position: 'absolute', left: 0, top: 0, width: 1920 * k, height: 1080 * k, scale: String(z), transformOrigin: `${1408 * k}px ${913 * k}px`}}>
      {/* the clip stops right after the click and holds a clean frame: the "Review and run" dialog that opens next shows the account balance */}
      <Still src="runsel.mp4" frame={103} style={{position: 'absolute', width: '100%', height: '100%'}} />
      <Clip src="runsel.mp4" dur={CLICK_AT + 1} trimBefore={Math.round(3.51 * 30 - CLICK_AT * RUN_RATE)} playbackRate={RUN_RATE} style={{position: 'absolute', width: '100%', height: '100%'}} />
    </div>
  );
};

/** Only the first card (v10: the canvas now comes from the Flow scene). The next scene starts at LEN. */
export const AlfaCard: React.FC = () => (
  <Card word="ALFA BUILDS IT.">
    <Frame x={1100} y={640} w={1150} h={(1150 * 298) / 658}>
      <UICard w={1150} />
    </Frame>
  </Card>
);

export const How: React.FC = () => (
  <AbsoluteFill>
    <Sequence durationInFrames={LEN + 4} layout="none">
      <Card word="ALFA BUILDS IT.">
        <Frame x={1100} y={640} w={1150} h={(1150 * 298) / 658}>
          <UICard w={1150} />
        </Frame>
      </Card>
    </Sequence>
    <Sequence from={LEN} durationInFrames={LEN + 4} layout="none">
      <Card word="ONE WORKFLOW.">
        <Frame x={1120} y={640} w={1000} h={(1000 * 760) / 960}>
          {/* the canvas graph after the run (source crop 290,80 960x760) */}
          <Img src={staticFile('runout.png')} style={{position: 'absolute', left: (-290 * 1000) / 960, top: (-80 * 1000) / 960, width: (1920 * 1000) / 960, height: (1080 * 1000) / 960}} />
        </Frame>
      </Card>
    </Sequence>
    <Sequence from={2 * LEN} durationInFrames={LEN + 4} layout="none">
      <Card word="RUN IT EVERY WEEK." last>
        <Frame x={1100} y={650} w={1180} h={(1180 * 994) / 1536}>
          {/* the real canvas with "8 steps selected" and Run selected · 510 cr; slow push toward the button, then the click */}
          <RunPush />
        </Frame>
      </Card>
    </Sequence>
  </AbsoluteFill>
);

