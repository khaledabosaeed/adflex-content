import React from 'react';
import {AbsoluteFill, Img, Sequence, staticFile, useCurrentFrame} from 'remotion';
import {Background, Grain, ip, Label, MBlur, OUT, springAt, whipIn, whipOut} from './lib';
import {Sound} from './Sound';

/*
 * Starter timeline: one scene per <Sequence>, every scene whips in and out (see motion-styles/glitch-split-whip.md).
 * Replace SceneA / EndCard with the shot list from production.md. Put each real scene in src/scenes/<Name>.tsx.
 */
const SceneA: React.FC = () => {
  const f = useCurrentFrame();
  const x = whipIn(f, 0).x + whipOut(f, 140).x;
  const blur = Math.max(whipIn(f, 0).blur, whipOut(f, 140).blur);
  return (
    <MBlur id="a-whip" x={blur} style={{translate: `${x}px 0`}}>
      <Label lines={[{t: 'ONE SENTENCE.'}, {t: 'A WHOLE CAMPAIGN.', bold: true}]} at={10} x={110} y={150} size={124} />
    </MBlur>
  );
};

const EndCard: React.FC = () => {
  const f = useCurrentFrame();
  const s = springAt(f, 4);
  return (
    <MBlur id="end-whip" x={whipIn(f, 0).blur} style={{translate: `${whipIn(f, 0).x}px 0`}}>
      <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center'}}>
        <Img src={staticFile('adflex-logo.png')} style={{width: 640, scale: String(0.8 + 0.2 * s), opacity: ip(f, [2, 10], [0, 1], OUT)}} />
      </AbsoluteFill>
    </MBlur>
  );
};

export const Video: React.FC = () => (
  <AbsoluteFill>
    <Background />
    <Sequence name="Scene A" durationInFrames={150}>
      <SceneA />
    </Sequence>
    <Sequence name="End card" from={150} durationInFrames={150}>
      <EndCard />
    </Sequence>
    <Grain />
    <Sound />
  </AbsoluteFill>
);
