import React from 'react';
import {Audio, interpolate, Sequence, staticFile} from 'remotion';
import {SCENES} from '../timeline';
import {SEND as ASK_SEND, SEND_CANDLE} from './Ask';
import {CLICK as PLAN_CLICK, OPEN as PLAN_OPEN, A as PLAN_A, STATUS_AT} from './Plan';
import {FILLED_AT, MORPH} from './Build';
import {CARRY} from './Flow';
import {LAND} from './Result';
import {SERUM_TAP as LAMA_SERUM_TAP, TAP as LAMA_TAP} from './LamaShot';

/*
 * Music + sound effects, placed on absolute frames (30 fps); scene starts come from SCENES.
 * Music (v18): one bed, music-shaped.wav, which make_music.sh builds from the 120 BPM generation (one beat = 15 frames):
 * a low-passed intro, half a beat of silence, the drop at 8.0 s on the Approve click (S.plan + CLICK = 241), a
 * high-passed breakdown under Lama's second product (13.5–16.5 s = S.lama → S.flow), then the second drop to the end,
 * faded at the loop point. Every whip-pan cut gets the whip SFX, which peaks 2 frames in (lib Pan).
 */
const MUSIC = staticFile('audio/music-shaped.wav');
const M = 0.6; // music level under the effects
const DROP = 240; // the drop in music-shaped.wav (8.0 s)

const sfx = (name: string) => staticFile(`audio/${name}`);
type Cue = {at: number; src: string; vol: number; dur: number};
const S = SCENES;
// the whip-pan cuts (scene starts that a Pan joins); the whoosh starts 2 frames early so its rush sits on the cut
const PANS = [S.shoot, S.plan, S.lama, S.flow];
const CUES: Cue[] = [
  // title: glitch fill + blip, riser into the chip, the words get shoved off
  {at: 2, src: sfx('glitch.mp3'), vol: 1, dur: 18},
  {at: 22, src: sfx('glitch.mp3'), vol: 0.5, dur: 18},
  {at: 28, src: sfx('riser.mp3'), vol: 0.55, dur: 30},
  {at: 42, src: sfx('whoosh.mp3'), vol: 0.6, dur: 20},
  // the problem: a hit on each punch-in
  {at: S.problem + 15, src: sfx('click.wav'), vol: 0.5, dur: 6},
  {at: S.problem + 30, src: sfx('click.wav'), vol: 0.5, dur: 6},
  ...PANS.map((at) => ({at: at - 2, src: sfx('sfx-whip.mp3'), vol: 0.7, dur: 12})),
  // the first photo: shutter, then the photo flies into the composer; Send (the punch-in)
  {at: S.shoot + LAMA_SERUM_TAP, src: sfx('click.wav'), vol: 0.9, dur: 6},
  {at: S.ask, src: sfx('whoosh.mp3'), vol: 0.5, dur: 14},
  {at: S.ask + ASK_SEND, src: sfx('click.wav'), vol: 0.8, dur: 6},
  // ALFA PLANS IT.: the Approve click (the drop lands here), then the reply lights up
  {at: S.plan + STATUS_AT, src: sfx('glitch.mp3'), vol: 0.3, dur: 10},
  // the silent half-beat before the drop: a short riser, and the Approve card lifting off the page (peaks 6 frames in)
  {at: DROP - 20, src: sfx('riser.mp3'), vol: 0.35, dur: 20},
  {at: S.plan + PLAN_A - 2, src: sfx('sfx-lift.mp3'), vol: 1, dur: 24},
  {at: S.plan + PLAN_CLICK, src: sfx('click.wav'), vol: 0.8, dur: 6},
  {at: S.plan + PLAN_OPEN, src: sfx('whoosh.mp3'), vol: 0.55, dur: 14},
  // ALFA BUILDS THE WORKFLOW.: the mark lights the nodes
  {at: S.build + 10, src: sfx('scan.mp3'), vol: 0.4, dur: 30},
  // the result: the camera dives at the last node, the story thumbnail grows into the player, the ads land
  {at: S.build + FILLED_AT, src: sfx('whoosh.mp3'), vol: 0.45, dur: 12},
  {at: S.build + FILLED_AT + MORPH - 2, src: sfx('sfx-morph.mp3'), vol: 0.55, dur: 31},
  {at: S.result, src: sfx('impact.mp3'), vol: 0.4, dur: 30},
  ...LAND.map((d) => ({at: S.result + d, src: sfx('click.wav'), vol: 0.45, dur: 5})),
  // next week: the candle shutter, its photo flies into the composer, Send
  {at: S.lama + LAMA_TAP, src: sfx('click.wav'), vol: 0.9, dur: 6},
  {at: S.ask2, src: sfx('whoosh.mp3'), vol: 0.5, dur: 14},
  {at: S.ask2 + SEND_CANDLE, src: sfx('click.wav'), vol: 0.8, dur: 6},
  // ALFA RUNS IT AGAIN.: the outputs flip, whip → end card, logo lands
  {at: S.flow + 30, src: sfx('scan.mp3'), vol: 0.45, dur: 30},
  {at: S.flow + CARRY[0], src: sfx('riser.mp3'), vol: 0.5, dur: CARRY[1] - CARRY[0]},
  {at: S.flow + CARRY[0] + 2, src: sfx('whoosh.mp3'), vol: 0.6, dur: 14},
  {at: S.end - 2, src: sfx('sfx-logo.mp3'), vol: 0.75, dur: 75},
];

const fadeOut = (abs: number) => interpolate(abs, [S.total - 30, S.total - 2], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

export const Sound: React.FC = () => (
  <>
    <Audio src={MUSIC} volume={(f) => M * fadeOut(f)} />
    {CUES.map((c, i) => (
      <Sequence key={i} name={`sfx ${c.src.split('/').pop()}`} from={c.at} durationInFrames={c.dur} layout="none">
        <Audio src={c.src} volume={c.vol} />
      </Sequence>
    ))}
  </>
);
