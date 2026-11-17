import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';

import {Clip, INOUT, ip, punch, Slam} from '../lib';
import {CHIP_AT, CHIP_RATE} from './Title';

/*
 * v12 scene 2, the problem: Lama at night, tired of redoing the same content (girl.mp4, continued from the
 * title chip at 1.25x, so the 24 fps source plays without judder). Three beats, a punch-in on each:
 * wide + "EVERY WEEK." → punch on her face mid-sigh + "SAME WORK." → tighter punch as her eyes go back to
 * the screen, and the shot whips out.
 */
export const END = 45;
const START_SRC = Math.round((60 - CHIP_AT) * CHIP_RATE) - 1; // where the chip left the clip (−1 so the last frame stays inside the 90-frame file)
const FACE = '68% 30%';

export const Problem: React.FC = () => {
  const f = useCurrentFrame();
  const drift = 1 + 0.06 * ip(f, [0, END], [0, 1], INOUT);
  const s = drift * punch(f, 15, 1.45) * punch(f, 30, 1.3);
  return (
    <AbsoluteFill style={{overflow: 'hidden'}}>
      <AbsoluteFill style={{scale: String(s), transformOrigin: FACE}}>
        <Clip src="girl.mp4" trimBefore={START_SRC} playbackRate={CHIP_RATE} style={{width: 1920, height: 1080}} />
      </AbsoluteFill>
      <Slam text="EVERY WEEK." at={2} dur={13} />
      <Slam text="SAME WORK." at={15} dur={14} />
    </AbsoluteFill>
  );
};
