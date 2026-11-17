import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';

import {Clip, Crop, INOUT, ip, Kicker, Label, MBlur, UIWindow, whipIn, whipOut} from '../lib';

/*
 * Scene 3b: ALFA answers. Real Take A2 (alfa-reply.mp4, sidebar cropped off, 1464x996):
 *   clip 0–42: "Run this plan?" → Approve (frame ~2) → ALFA's workflow card appears (~frame 32)
 *   clip 43–96: the full reply; the cursor clicks "Open workflow" (~frame 84)
 * The card lifts toward the camera as it appears; the page re-lays out at the cut, so the lifted crop
 * jumps with it and the card stays put on screen. The click whips straight into the canvas.
 */
const SW = 1464;
const SH = 996;
const VID_AT = 4; // the clip starts here (whip still braking)
const CUT = VID_AT + 43; // first frame of the second half (card moved down)
const CARD_A = {x: 58, y: 247, w: 658, h: 299}; // the card before the cut
const CARD_B = {x: 58, y: 413, w: 658, h: 299}; // after the cut
const LINK = {x: 263 - 58, y: 667 - 413}; // "Open workflow", relative to the card
export const CLICK = VID_AT + 84;
const WHIP_OUT = CLICK + 3; // the canvas whips in at WHIP_OUT + 4

export const Reply: React.FC = () => {
  const f = useCurrentFrame();
  const wi = whipIn(f, 0);
  const wo = whipOut(f, WHIP_OUT);
  const lift = ip(f, [VID_AT + 30, VID_AT + 50], [0, 1], INOUT);
  const press = Math.sin(Math.PI * ip(f, [CLICK - 3, CLICK + 5], [0, 1], INOUT));
  const orbit = ip(f, [10, WHIP_OUT], [0, 1], INOUT);
  const card = f < CUT ? CARD_A : CARD_B;
  const rec = <Clip src="alfa-reply.mp4" from={VID_AT} style={{position: 'absolute', left: 0, top: 0, width: SW, height: SH}} />;
  return (
    <>
      <MBlur id="reply-whip" x={Math.max(wi.blur, wo.blur)} style={{translate: `${wi.x + wo.x}px 0`}}>
        <AbsoluteFill style={{perspective: 2200}}>
          <UIWindow
            w={1240}
            srcW={SW}
            srcH={SH}
            cx={1120}
            cy={640}
            s={1 + 0.04 * orbit}
            dim={0.6 * lift}
            content={rec}
            overlay={
              lift > 0.001 ? (
                <Crop {...card} srcW={SW} srcH={SH} z={240 * lift} s={1 + 0.1 * lift - 0.03 * press} glow={lift} radius={14}>
                  {rec}
                  {/* Open workflow: click bloom */}
                  <div
                    style={{
                      position: 'absolute',
                      left: card.x + LINK.x - 70,
                      top: card.y + LINK.y - 70,
                      width: 140,
                      height: 140,
                      borderRadius: '50%',
                      background: 'radial-gradient(circle, rgba(255,255,255,.9), rgba(190,150,255,.55) 40%, transparent 70%)',
                      opacity: press,
                      scale: String(0.6 + 1.2 * press),
                    }}
                  />
                </Crop>
              ) : null
            }
          />
        </AbsoluteFill>
        <Kicker text="02 · ALFA BUILDS IT" at={10} out={WHIP_OUT - 2} x={112} y={52} />
        <Label lines={[{t: 'ALFA PLANS'}, {t: 'THE WHOLE WORKFLOW.', bold: true}]} at={14} out={WHIP_OUT - 2} x={108} y={88} size={96} />
      </MBlur>
    </>
  );
};
