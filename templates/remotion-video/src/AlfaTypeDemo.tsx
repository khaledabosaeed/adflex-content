/* Preview of the ALFA brand type (src/alfaType.tsx) with the ORRA hero's copy and timings. 8 s, 1920x1080. */
import React from 'react';
import {AbsoluteFill} from 'remotion';
import {AlfaTitle, AlfaWord, BoxCaption, BrandBg, ByLockup, TimerChip, TITLE_S, Toast, eio, eo3, lerp, prog, timerSecs, useT} from './alfaType';

const A1 = TITLE_S; // ALFA beat
const S0 = A1 + 2.0; // "Any Size."
const H0 = S0 + 1.6; // timer finale
const HSTOP = H0 + 0.8;
const E0 = H0 + 1.6; // end card
export const DEMO_S = E0 + 1.6;

const STEPS = [S0 + 0.3, S0 + 0.7, S0 + 1.1, S0 + 1.4];
const LABELS = ['Product video', 'Billboard ads', 'UGC videos', 'All sizes'];

export const AlfaTypeDemo: React.FC = () => {
  const t = useT();
  const done = Math.min(5, STEPS.reduce((a, s) => a + eo3(prog(t, s, s + 0.35)), 0) + eo3(prog(t, H0 + 0.2, H0 + 0.55)));
  const secs = timerSecs(t, A1 + 1.1, HSTOP);
  // chip: born under the tagline, lifts to the corner, then flies to the centre for the finale
  const lift = eo3(prog(t, A1 + 1.45, A1 + 2.0));
  const fly = eio(prog(t, H0, H0 + 0.55));
  const corner = [1920 - 44 - 220, 44 + 34];
  const cx = lerp(lerp(960, corner[0], lift), 960, fly);
  const cy = lerp(lerp(885, corner[1], lift), 550, fly);
  const sc = lerp(lerp(1.3, 1, lift), 3.1, fly);
  const stopped = t >= HSTOP;
  const chipA = eo3(prog(t, A1 + 0.95, A1 + 1.25)) * (1 - eio(prog(t, E0 - 0.25, E0)));
  return (
    <AbsoluteFill style={{background: '#000'}}>
      {t >= A1 ? <BrandBg /> : null}
      {/* ALFA beat */}
      <AlfaWord at={A1 + 0.1} size={250} cy={470} dur={0.65} out={S0} />
      <BoxCaption w1="No MCP. No setup." w2="Just ALFA." size={56} weight={600} at={A1 + 0.6} out={S0} y={650} />
      {/* a scene title */}
      <BoxCaption w1="Any" w2="Size." at={S0 + 0.05} out={H0} y={200} />
      {STEPS.map((s, i) =>
        t >= s && t < s + 1.05 ? (
          <Toast key={i} label={LABELS[i]} x={corner[0] + 60} y={corner[1] + 34 + 18 + 25 - (1 - eo3(prog(t, s + 0.05, s + 0.3))) * 14} opacity={eo3(prog(t, s + 0.05, s + 0.3)) * (1 - eio(prog(t, s + 0.85, s + 1.05)))} />
        ) : null,
      )}
      {/* finale */}
      {t >= H0 ? <AbsoluteFill style={{background: 'rgba(8,5,18,.6)', opacity: fly * (1 - eio(prog(t, E0 - 0.25, E0)))}} /> : null}
      <BoxCaption w1="Full" w2="campaign." size={76} at={H0 + 0.5} out={E0} y={360} />
      <BoxCaption w1="Under" w2="1 hour." size={96} at={HSTOP + 0.05} out={E0} y={760} />
      <TimerChip secs={secs} done={done} stopped={stopped} t={stopped ? HSTOP : t} x={cx} y={cy} scale={sc * (1 + (stopped ? Math.max(0, 1 - (t - HSTOP) / 0.25) * 0.05 : 0))} opacity={chipA} />
      {/* end card */}
      <AlfaWord at={E0 - 0.1} size={228} cy={480} dur={0.45} />
      <ByLockup cy={705 + (1 - eo3(prog(t, E0 + 0.15, E0 + 0.55))) * 24} qBy={eo3(prog(t, E0 + 0.15, E0 + 0.55))} qLogo={eo3(prog(t, E0 + 0.15, E0 + 0.55))} />
      <AlfaTitle at={0} />
    </AbsoluteFill>
  );
};
