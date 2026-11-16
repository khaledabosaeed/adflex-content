import React from 'react';
import {Audio, interpolate, Sequence, staticFile} from 'remotion';

/*
 * Music + sound effects, placed on absolute frames (30 fps).
 * Music: ElevenLabs Music v2.5, 120 BPM (one beat = 15 frames). The model put the drop at 8.0 s and stopped at 16 s,
 * so it is re-cut on bar lines: intro from 2 s (drop lands on the whip into ALFA at 6.0 s), drop 8–16 s,
 * then the drop again from 8 s under Run (14.0 s), fading out at the loop point.
 */
const MUSIC = staticFile('audio/music.mp3');
const M = 0.6; // music level under the effects

const sfx = (name: string) => staticFile(`audio/${name}`);
type Cue = {at: number; src: string; vol: number; dur: number};
const CUES: Cue[] = [
  // title: glitch fill + blip, riser into the chip, the words get shoved off
  {at: 2, src: sfx('glitch.mp3'), vol: 1, dur: 18},
  {at: 22, src: sfx('glitch.mp3'), vol: 0.5, dur: 18},
  {at: 28, src: sfx('riser.mp3'), vol: 0.55, dur: 30},
  {at: 46, src: sfx('whoosh.mp3'), vol: 0.6, dur: 24},
  // tool cards land
  {at: 110, src: sfx('pop.mp3'), vol: 0.3, dur: 15},
  {at: 121, src: sfx('pop.mp3'), vol: 0.3, dur: 15},
  {at: 130, src: sfx('pop.mp3'), vol: 0.3, dur: 15},
  // whip: girl → ALFA
  {at: 175, src: sfx('whoosh.mp3'), vol: 0.9, dur: 24},
  // Send, then whip → canvas
  {at: 274, src: sfx('click.wav'), vol: 0.7, dur: 6},
  {at: 277, src: sfx('whoosh.mp3'), vol: 0.9, dur: 24},
  // Run, the scan line, results popping out
  {at: 419, src: sfx('click.wav'), vol: 0.8, dur: 6},
  {at: 422, src: sfx('scan.mp3'), vol: 0.7, dur: 24},
  {at: 441, src: sfx('pop.mp3'), vol: 0.6, dur: 15},
  {at: 445, src: sfx('pop.mp3'), vol: 0.55, dur: 15},
  {at: 449, src: sfx('pop.mp3'), vol: 0.5, dur: 15},
  // whip → end card, logo lands
  {at: 499, src: sfx('whoosh.mp3'), vol: 0.9, dur: 24},
  {at: 505, src: sfx('impact.mp3'), vol: 0.75, dur: 45},
];

export const Sound: React.FC = () => (
  <>
    <Sequence name="music intro" durationInFrames={180} layout="none">
      <Audio src={MUSIC} trimBefore={60} volume={M} />
    </Sequence>
    <Sequence name="music drop" from={180} durationInFrames={240} layout="none">
      <Audio src={MUSIC} trimBefore={240} volume={M} />
    </Sequence>
    <Sequence name="music drop again" from={420} durationInFrames={180} layout="none">
      <Audio src={MUSIC} trimBefore={240} volume={(f) => M * interpolate(f, [150, 178], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'})} />
    </Sequence>
    {CUES.map((c, i) => (
      <Sequence key={i} name={`sfx ${c.src.split('/').pop()}`} from={c.at} durationInFrames={c.dur} layout="none">
        <Audio src={c.src} volume={c.vol} />
      </Sequence>
    ))}
  </>
);
