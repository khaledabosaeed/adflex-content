import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';

import {Clip, INOUT, ip, Kicker, Label, MBlur, whipIn, whipOut} from '../lib';

/*
 * Scene: the payoff, like the reference's product macro ending: the two real story videos the same workflow
 * made (serum, then candle), big, over a blurred copy. Calm: a slow push-in only.
 */
export const END = 96; // the end card whips in here

const Phone: React.FC<{src: string; cx: number; cy: number; H: number; push: number}> = ({src, cx, cy, H, push}) => {
  const W = (H * 9) / 16;
  return (
    <div
      style={{
        position: 'absolute',
        left: cx - W / 2,
        top: cy - H / 2,
        width: W,
        height: H,
        borderRadius: 24,
        overflow: 'hidden',
        scale: String(push),
        boxShadow: '0 60px 130px rgba(0,0,0,.6), 0 0 0 1.5px rgba(255,255,255,.16)',
      }}
    >
      <Clip src={src} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
    </div>
  );
};

export const Payoff: React.FC = () => {
  const f = useCurrentFrame();
  const wi = whipIn(f, 0);
  const wo = whipOut(f, END - 4);
  const push = 1 + 0.03 * ip(f, [0, END], [0, 1], INOUT);
  const H = 820;
  const W = (H * 9) / 16;
  const cx2 = 1920 - 90 - W / 2;
  const cx1 = cx2 - W - 40;
  return (
    <MBlur id="payoff-whip" x={Math.max(wi.blur, wo.blur)} style={{translate: `${wi.x + wo.x}px 0`}}>
      <AbsoluteFill style={{overflow: 'hidden'}}>
        <Clip src="candle-story.mp4" style={{position: 'absolute', left: -60, top: -1100, width: 2040, height: 3627, filter: 'blur(40px) brightness(.5)'}} />
      </AbsoluteFill>
      <Phone src="story.mp4" cx={cx1} cy={540 + 24} H={H} push={push} />
      <Phone src="candle-story.mp4" cx={cx2} cy={540 - 24} H={H} push={push} />
      <Kicker text="OUTPUT" at={6} out={END - 6} x={112} y={380} />
      <Label lines={[{t: 'FROM ONE SENTENCE'}, {t: 'A STORY VIDEO', bold: true}, {t: 'FOR EACH PRODUCT.', bold: true}]} at={8} out={END - 6} x={108} y={418} size={84} />
    </MBlur>
  );
};
