import React from 'react';
import {AbsoluteFill, Sequence} from 'remotion';
import {Background, Grain, Pan} from './lib';
import {Title} from './scenes/Title';
import {Problem} from './scenes/Problem';
import {Ask, AskCandle} from './scenes/Ask';
import {Plan} from './scenes/Plan';
import {Build} from './scenes/Build';
import {Result} from './scenes/Result';
import {LamaShot, LamaSerum} from './scenes/LamaShot';
import {Flow} from './scenes/Flow';
import {EndCard} from './scenes/EndCard';
import {Sound} from './scenes/Sound';
import {SCENES as S} from './timeline';

/**
 * AdFlex "Workflow × ALFA" website hero (v14): 21.8 s, 1920x1080, 30 fps, seamless loop with music + SFX.
 * ALFA is the hero: the problem (Lama, every week the same work) → she photographs her serum and the photo flies
 * into ALFA's prompt → one sentence → ALFA plans it (real plan + Approve) → ALFA builds the workflow → 3 ads + a story
 * video → next week she photographs a new candle, its photo goes to ALFA → ALFA runs it again → end card.
 * Cuts on the beat; whip-pan cuts between scenes, punch-ins on UI beats, each scene's line slams in big.
 */
// [name, from, to, scene, whip-pan in, whip-pan out]
const SCN: [string, keyof typeof S, keyof typeof S, React.FC, boolean, boolean][] = [
  ['2 Problem', 'problem', 'shoot', Problem, false, true],
  ['3 Lama photographs her serum', 'shoot', 'ask', LamaSerum, true, false],
  ['4 The photo goes to ALFA', 'ask', 'plan', Ask, false, true],
  ['5 ALFA plans it', 'plan', 'build', Plan, true, false],
  ['6 ALFA builds the workflow', 'build', 'result', Build, false, false],
  ['7 The result: 3 ads + a story video', 'result', 'lama', Result, false, true],
  ['8 Next week: a new candle', 'lama', 'ask2', LamaShot, true, false],
  ['9 Its photo goes to ALFA', 'ask2', 'flow', AskCandle, false, true],
];

export const WorkflowHero: React.FC = () => (
  <AbsoluteFill style={{background: '#0B0912'}}>
    <Background />
    <Sequence name="1 Title" durationInFrames={S.problem}>
      <Title />
    </Sequence>
    {SCN.map(([name, from, to, C, inn, out]) => (
      <Sequence key={name} name={name} from={S[from]} durationInFrames={S[to] - S[from]}>
        <Pan id={`pan-${from}`} dur={S[to] - S[from]} inn={inn} out={out}>
          <C />
        </Pan>
      </Sequence>
    ))}
    <Sequence name="10 ALFA runs it again" from={S.flow} durationInFrames={S.end - S.flow + 4}>
      <Flow v11 />
    </Sequence>
    <Sequence name="11 End card" from={S.end} durationInFrames={S.total - S.end}>
      <EndCard />
    </Sequence>
    <Grain />
    <Sound />
  </AbsoluteFill>
);
