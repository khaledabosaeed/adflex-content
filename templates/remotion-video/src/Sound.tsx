import React from 'react';
import {Audio, interpolate, Sequence, staticFile} from 'remotion';

/*
 * Music + SFX on absolute frames. Generate audio only after a quote and a yes; check each file's peak first
 * (some AdFlex SFX come back near-silent), add it to media.tsv, then cue it here.
 * Re-cut music on bar lines: at 120 BPM / 30 fps one beat = 15 frames, one bar = 60.
 */
const M = 0.6; // music level under the effects
const sfx = (name: string) => staticFile(`audio/${name}`);
type Cue = {at: number; src: string; vol: number; dur: number};
const CUES: Cue[] = [
  {at: 148, src: sfx('click.wav'), vol: 0.7, dur: 6}, // example; click.wav comes from brand/sfx
];
const MUSIC: {from: number; dur: number; trimBefore: number; fadeOut?: boolean}[] = [
  // {from: 0, dur: 300, trimBefore: 0, fadeOut: true},  // needs public/audio/music.mp3
];

export const Sound: React.FC = () => (
  <>
    {MUSIC.map((m, i) => (
      <Sequence key={`m${i}`} name={`music ${i}`} from={m.from} durationInFrames={m.dur} layout="none">
        <Audio
          src={staticFile('audio/music.mp3')}
          trimBefore={m.trimBefore}
          volume={(f) => M * (m.fadeOut ? interpolate(f, [m.dur - 30, m.dur - 2], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}) : 1)}
        />
      </Sequence>
    ))}
    {CUES.map((c, i) => (
      <Sequence key={i} name={`sfx ${c.src.split('/').pop()}`} from={c.at} durationInFrames={c.dur} layout="none">
        <Audio src={c.src} volume={c.vol} />
      </Sequence>
    ))}
  </>
);
