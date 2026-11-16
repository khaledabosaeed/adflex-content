import React from 'react';
import {AbsoluteFill, Sequence, useVideoConfig} from 'remotion';
import {Background, Grain} from './lib';
import {Title} from './scenes/Title';
import {Problem} from './scenes/Problem';
import {Prompt} from './scenes/Prompt';
import {Canvas} from './scenes/Canvas';
import {EndCard} from './scenes/EndCard';
import {Sound} from './scenes/Sound';

/**
 * AdFlex "Workflow × ALFA" website hero: 20 s, 1920x1080, 30 fps, silent, seamless loop.
 * Scenes overlap a little so the glowing node can hand off between them.
 */
export const WorkflowHero: React.FC = () => {
  const {fps} = useVideoConfig();
  return (
    <AbsoluteFill style={{background: '#0B0912'}}>
      <Background />
      <Sequence name="1 Title" durationInFrames={2.8 * fps}>
        <Title />
      </Sequence>
      <Sequence name="2 Problem" from={64} durationInFrames={124}>
        <Problem />
      </Sequence>
      <Sequence name="3 Prompt" from={180} durationInFrames={112}>
        <Prompt />
      </Sequence>
      <Sequence name="4 Canvas" from={282} durationInFrames={236}>
        <Canvas />
      </Sequence>
      <Sequence name="5 End card" from={504} durationInFrames={96}>
        <EndCard />
      </Sequence>
      <Grain />
      <Sound />
    </AbsoluteFill>
  );
};
