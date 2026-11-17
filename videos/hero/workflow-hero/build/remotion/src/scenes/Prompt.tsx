import React from 'react';
import {AbsoluteFill, Sequence, useCurrentFrame} from 'remotion';

import {Crop, INOUT, ip, Kicker, MBlur, UI, UIWindow, Clip, Still, whipIn, whipOut, Wipe} from '../lib';

const SW = 1830; // ALFA home with the 90 px sidebar cropped off (alfa.mp4 is full 1920 wide, drawn at x -90)
const SH = 1080;
const VID_AT = 14; // the recording starts playing here (first frame is held before)
const TRIM = 14; // source frame where typing starts
const RATE = 3.3; // send lands on frame SEND
const SEND = 86;
const SEND_SRC = Math.round(TRIM + (SEND - VID_AT) * RATE) - 1; // the last source frame the clip shows (Send)
const COMPOSER = {x: 386, y: 250, w: 1060, h: 236};
// where the (lifted) send button lands on screen: the camera dives through it into the canvas
export const SEND_SCREEN = {x: 1670, y: 530};
const WHIP_OUT = 88; // the next scene whips in at 92 (its frame 0)

const Rec: React.FC = () => (
  <>
    {/* first frame held until typing starts; after Send the page re-lays out (and the greeting moves), so hold the Send frame */}
    <Sequence durationInFrames={VID_AT} layout="none">
      <Still src="alfa.mp4" frame={0} style={{position: 'absolute', left: -90, top: 0, width: 1920, height: 1080}} />
    </Sequence>
    <Sequence from={SEND} layout="none">
      <Still src="alfa.mp4" frame={SEND_SRC} style={{position: 'absolute', left: -90, top: 0, width: 1920, height: 1080}} />
    </Sequence>
    <Clip src="alfa.mp4" from={VID_AT} dur={SEND - VID_AT} trimBefore={TRIM} playbackRate={RATE} style={{position: 'absolute', left: -90, top: 0, width: 1920, height: 1080}} />
  </>
);

/** Scene 3: the prompt typed into the real ALFA. The composer lifts out of the window toward the camera. */
export const Prompt: React.FC = () => {
  const f = useCurrentFrame();
  // whip in from the right (the girl's scene is shoved out left), whip out to the canvas after Send
  const wi = whipIn(f, 0);
  const wo = whipOut(f, WHIP_OUT);
  const lift = ip(f, [12, 32], [0, 1], INOUT);
  const press = Math.sin(Math.PI * ip(f, [SEND - 3, SEND + 5], [0, 1], INOUT));
  const cx = 1060;
  const cy = 630;
  const orbit = ip(f, [16, SEND], [0, 1], INOUT);
  return (
    <>
    <MBlur id="prompt-whip" x={Math.max(wi.blur, wo.blur)} style={{translate: `${wi.x + wo.x}px 0`}}>
    <AbsoluteFill style={{perspective: 2200, perspectiveOrigin: '50% 50%'}}>
      <UIWindow
        w={1300}
        srcW={SW}
        srcH={SH}
        cx={cx}
        cy={cy}
        s={1 + 0.04 * orbit}
        dim={0.65 * lift}
        content={
          <>
            <Rec />
            {/* hide the account name in the greeting */}
            <div style={{position: 'absolute', left: 690, top: 168, width: 460, height: 76, borderRadius: 30, background: '#18161f', boxShadow: '0 0 18px 16px #18161f'}} />
            <div style={{position: 'absolute', left: 690, top: 178, width: 460, textAlign: 'center', fontFamily: UI, fontWeight: 800, fontSize: 44, letterSpacing: -0.5, color: '#fff'}}>Good afternoon</div>
          </>
        }
        overlay={
          <Crop {...COMPOSER} srcW={SW} srcH={SH} z={260 * lift} s={1 + 0.12 * lift - 0.03 * press} glow={lift} radius={18}>
            <Rec />
            {/* send button bloom */}
            <div
              style={{
                position: 'absolute',
                left: 1403 - 60,
                top: 444 - 60,
                width: 120,
                height: 120,
                borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(255,255,255,.95), rgba(190,150,255,.6) 40%, transparent 70%)',
                opacity: press,
                scale: String(0.6 + 1.2 * press),
              }}
            />
          </Crop>
        }
      />
    </AbsoluteFill>
    </MBlur>
    <Kicker text="INPUT" at={8} out={SEND - 4} x={112} y={52} />
    <Wipe text="ONE SENTENCE." mode="rise" at={10} out={SEND - 2} dur={10} size={150} wght={900} wdth={68} style={{position: 'absolute', left: 104, top: 88}} />
    </>
  );
};
