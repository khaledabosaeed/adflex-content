/*
 * ALFA hero, script v13: "Get me out of here", and Leen herself carries every transition.
 * Team: «بدي ياك تبين انو الانتقال بيصير مع البنت نفسها». Four generated first/last-frame clips (T1–T4, assets.md) where her
 * body moves from one world into the next: she dives into her laptop and comes out sprinting; falls between the roofs and
 * lands on the ropes; ducks the punch and comes up on the bike in a burst of sand; is thrown off the bike and drops into her
 * chair. Each T clip starts on the exact frame where the world's jam ends, so the joins are invisible.
 * Text in English only (v12). The film is one time-remapped strip of clips: every shot is speed-ramped to its strong part.
 * 1920×1080, 24 fps, silent loop. Spec: ../../production.md "Script v13".
 */
import React from 'react';
import {AbsoluteFill, Freeze, Img, OffthreadVideo, Sequence, staticFile, useVideoConfig} from 'remotion';
import {C, cond, IN, ip, OUT} from './lib';
import {EXIT, useSec} from './Preview';
import {PromptBox} from './PromptBox';

/* ---------- the strip: each segment maps film time → source time with linear keys ([film s, source s]) ---------- */
type Seg = {name: string; src: string; keys: [number, number][]; land?: boolean};
const SEGS: Seg[] = [
  {name: 'desk: her hands, the first prompt', src: 'typing.mp4', keys: [[0, 0.8], [1.5, 2.3]]},
  {name: 'T4: she dives into her screen, out sprinting', src: 't4-desk-volt.mp4', keys: [[1.5, 0.35], [2.1, 0.95], [2.55, 1.6], [3.0, 2.4]], land: true},
  {name: 'VOLT: the leap → jam', src: 'act-volt.mp4', keys: [[3.0, 2.2], [3.7, 3.33], [4.7, 3.48], [4.85, 3.6]], land: true},
  {name: 'T1: she falls between the roofs, lands on the ropes', src: 't1-volt-ko.mp4', keys: [[4.85, 0], [5.75, 1.25], [6.3, 2.1]]},
  {name: 'KNOCKOUT: the hook → jam', src: 'act-knockout.mp4', keys: [[6.3, 3.2], [6.8, 4.0], [7.8, 4.15], [7.95, 4.3]], land: true},
  {name: 'T2: she ducks, the gym bursts into sand, she is on the bike', src: 't2-ko-dune.mp4', keys: [[7.95, 0], [9.1, 1.75], [9.5, 2.3]]},
  {name: 'DUNE: up the crest → jam', src: 'act-dune.mp4', keys: [[9.5, 2.0], [10.2, 3.13], [11.2, 3.28], [11.35, 3.4]], land: true},
  {name: 'T3: thrown off the bike, she drops into her chair', src: 't3-dune-desk.mp4', keys: [[11.35, 0], [12.4, 1.5], [13.0, 2.2], [14.2, 3.6]]},
];
export const V13_SECONDS = 14.2;

const remap = (keys: [number, number][], t: number) => {
  for (let i = 1; i < keys.length; i++) {
    const [t0, s0] = keys[i - 1], [t1, s1] = keys[i];
    if (t <= t1) return s0 + ((s1 - s0) * (t - t0)) / (t1 - t0);
  }
  return keys[keys.length - 1][1];
};

const At: React.FC<{src: string; t: number}> = ({src, t}) => {
  const {fps} = useVideoConfig();
  return (
    <Freeze frame={Math.max(0, Math.round(Math.min(4.95, t) * fps))}>
      <OffthreadVideo src={staticFile(src)} muted style={{width: 1920, height: 1080, objectFit: 'cover'}} />
    </Freeze>
  );
};

/** One segment: the remapped clip under a camera that never stops (a slow push). A hard cut (`land`) lands out of a small
 * zoom with a 2-frame blur, so the cut reads as the same forward motion (Talent Contest). */
const SegShot: React.FC<{seg: Seg}> = ({seg}) => {
  const s = useSec(); // local
  const t0 = seg.keys[0][0];
  const t = t0 + s;
  const q = seg.land ? ip(s, [0, 0.18], [0, 1], OUT) : 1;
  return (
    <AbsoluteFill style={{transform: `scale(${(1.02 + 0.012 * s) * (1 + 0.07 * (1 - q))})`, filter: q < 1 ? `blur(${5 * (1 - q)}px)` : undefined}}>
      <At src={seg.src} t={remap(seg.keys, t)} />
    </AbsoluteFill>
  );
};

/* ---------- the jams: the prompt flies in beside her while time crawls, sends, and she moves ---------- */
type Jam = {at: number; send: number; text: string; box: {x: number; y: number; w: number; side: 'left' | 'right'}};
const JAMS: Jam[] = [
  {at: 3.7, send: 4.7, text: 'Get me out of here! Next: KNOCKOUT fight night', box: {x: 1230, y: 140, w: 600, side: 'right'}},
  {at: 6.8, send: 7.8, text: 'Get me out of here! Next: a DUNE desert ride', box: {x: 520, y: 60, w: 600, side: 'left'}},
  {at: 10.2, send: 11.2, text: 'Get me out of here! Schedule all three for Monday', box: {x: 70, y: 150, w: 600, side: 'left'}},
];
const FIRST = {text: 'VOLT launch reel: runners on the rooftops', box: {x: 150, y: 110, w: 600, side: 'left' as const}, at: 0.45, send: 1.3};

/** Time-stop grade while she's stuck: a little push, desaturate, a lavender pulse when it starts. */
const JamGrade: React.FC<{jam: Jam}> = ({jam}) => {
  const s = useSec();
  const g = ip(s, [jam.at - 0.05, jam.at + 0.2], [0, 1]) * (1 - ip(s, [jam.send, jam.send + 0.12], [0, 1]));
  return (
    <>
      <AbsoluteFill style={{backdropFilter: g > 0.01 ? `saturate(${1 - 0.3 * g}) brightness(${1 - 0.1 * g})` : undefined}} />
      <AbsoluteFill style={{background: C.accent, mixBlendMode: 'screen', opacity: ip(s, [jam.at - 0.05, jam.at + 0.03, jam.at + 0.25], [0, 0.2, 0])}} />
    </>
  );
};

/** Client label, bottom-left: types on letter by letter, erases from the end before she moves on (Talent Contest). */
const ClientTag: React.FC<{name: string; kind: string; at: number; out: number}> = ({name, kind, at, out}) => {
  const s = useSec();
  if (s < at || s > out + 0.5) return null;
  const n = name.length + 2 + kind.length;
  const shown = (i: number) => s >= at + i * 0.025 && s < out + (n - 1 - i) * 0.012;
  const ch = (c: string, i: number) => <span key={i} style={{display: 'inline-block', whiteSpace: 'pre', opacity: shown(i) ? 1 : 0}}>{c}</span>;
  const shade = ip(s, [at, at + 0.2], [0, 1]) * (1 - ip(s, [out, out + 0.3], [0, 1]));
  return (
    <>
      <div style={{position: 'absolute', left: 0, bottom: 0, width: 1100, height: 360, background: 'radial-gradient(ellipse at 0% 100%, rgba(10,6,20,.55), rgba(10,6,20,0) 70%)', opacity: shade}} />
      <div style={{position: 'absolute', left: 92, bottom: 80, display: 'flex', alignItems: 'baseline', gap: 22, textShadow: '0 2px 4px rgba(0,0,0,.35), 0 4px 30px rgba(0,0,0,.55)'}}>
        <div style={{...cond(900, 112), fontSize: 92, lineHeight: 1, color: '#fff', letterSpacing: -0.5}}>{[...name].map((c, i) => ch(c, i))}</div>
        <div style={{...cond(800, 100), fontSize: 30, letterSpacing: 6, color: '#E6D6FF'}}>{[...kind].map((c, i) => ch(c, name.length + 2 + i))}</div>
      </div>
    </>
  );
};

/** Flare wash: one or two frames of haze with a soft diagonal beam. */
const Haze: React.FC<{at: number; len?: number}> = ({at, len = 0.08}) => {
  const s = useSec();
  const o = ip(s, [at - 0.02, at, at + len], [0, 1, 0]);
  return o > 0.001 ? <AbsoluteFill style={{opacity: o, background: 'linear-gradient(115deg, rgba(255,250,244,.35) 20%, rgba(255,255,255,.85) 48%, rgba(235,222,255,.45) 70%)'}} /> : null;
};

/** ALFA flies in from behind the camera (8× → 1 in 0.35 s, radial blur from stacked copies), holds, blurs off. */
const Title: React.FC<{at: number; out: number}> = ({at, out}) => {
  const s = useSec();
  const tp = ip(s, [at, at + 0.35], [0, 1], OUT);
  const ex = ip(s, [out, out + EXIT], [0, 1], IN);
  if (s < at || ex >= 1) return null;
  return (
    <AbsoluteFill style={{opacity: Math.min(1, tp * 3) * (1 - ex), filter: ex > 0 ? `blur(${ex * 12}px)` : undefined}}>
      <AbsoluteFill style={{background: 'rgba(10,5,15,.35)'}} />
      <div style={{position: 'absolute', top: 250, width: 1920, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 16, opacity: ip(s, [at + 0.25, at + 0.45], [0, 1])}}>
        <Img src={staticFile('adflex-logo.png')} style={{height: 40, filter: 'brightness(0) invert(1)'}} />
        <span style={{...cond(500, 100), fontSize: 30, color: 'rgba(255,255,255,.85)', letterSpacing: 4}}>AGENT</span>
      </div>
      {[0, 1, 2, 3].map((i) => (
        <div key={i} style={{position: 'absolute', top: 330, width: 1920, textAlign: 'center', ...cond(900, 125), fontSize: 380, lineHeight: 1, color: '#fff', letterSpacing: -4, textShadow: i === 0 ? '0 10px 60px rgba(0,0,0,.35)' : undefined, transform: `scale(${(1 + 7 * (1 - tp)) * (1 + i * 0.06 * (1 - tp))})`, transformOrigin: '960px 190px', opacity: i === 0 ? 1 : 0.35 * (1 - tp), filter: tp < 1 ? `blur(${(1 - tp) * (6 + i * 4)}px)` : undefined}}>
          ALFA
        </div>
      ))}
      <div style={{position: 'absolute', top: 760, width: 1920, textAlign: 'center', ...cond(700, 110), fontSize: 30, letterSpacing: 10, color: 'rgba(255,255,255,.92)', opacity: ip(s, [at + 0.3, at + 0.5], [0, 1])}}>YOUR AI MARKETING AGENT</div>
    </AbsoluteFill>
  );
};

/** The end line over her back at her desk, then a dim hand-off to frame 0 (her hands, dimmed by the title shade). */
const End: React.FC<{at: number}> = ({at}) => {
  const s = useSec();
  const p = ip(s, [at, at + 0.3], [0, 1]);
  const e = ip(s, [V13_SECONDS - 0.35, V13_SECONDS - 0.15], [0, 1], IN);
  return (
    <>
      <AbsoluteFill style={{background: 'linear-gradient(0deg, rgba(0,0,0,.45), rgba(0,0,0,0) 35%)', opacity: p}} />
      {p > 0 && e < 1 ? (
        <div style={{position: 'absolute', bottom: 70, width: 1920, textAlign: 'center', ...cond(700, 110), fontSize: 30, letterSpacing: 8, color: '#fff', textShadow: '0 2px 20px rgba(0,0,0,.6)', opacity: p * (1 - e), filter: `blur(${(1 - p) * 8 + e * 8}px)`}}>
          ALFA · AVAILABLE ON ADFLEX.AI
        </div>
      ) : null}
      <AbsoluteFill style={{background: 'rgba(10,5,15,1)', opacity: ip(s, [V13_SECONDS - 0.3, V13_SECONDS], [0, 0.35])}} />
    </>
  );
};

/* =========================== TIMELINE =========================== */
export const AlfaHeroV13: React.FC = () => {
  const {fps} = useVideoConfig();
  const F = (t: number) => Math.round(t * fps);
  return (
    <AbsoluteFill style={{background: '#000'}}>
      {SEGS.map((seg, i) => {
        const from = seg.keys[0][0];
        const to = i + 1 < SEGS.length ? SEGS[i + 1].keys[0][0] : V13_SECONDS;
        return (
          <Sequence key={i} name={seg.name} from={F(from)} durationInFrames={F(to) - F(from)}>
            <SegShot seg={seg} />
          </Sequence>
        );
      })}
      {JAMS.map((j, i) => (
        <JamGrade key={`g${i}`} jam={j} />
      ))}
      <Title at={0.1} out={0.8} />
      <Haze at={0.1} />
      <PromptBox text={FIRST.text} {...FIRST.box} lang="en" at={FIRST.at} send={FIRST.send} out={FIRST.send + 0.12} />
      {JAMS.map((j, i) => (
        <PromptBox key={`b${i}`} text={j.text} {...j.box} lang="en" at={j.at + 0.04} send={j.send} out={j.send + 0.1} />
      ))}
      <ClientTag name="VOLT" kind="RUNNING SHOES" at={3.05} out={4.45} />
      <ClientTag name="KNOCKOUT" kind="BOXING GYM" at={6.35} out={7.55} />
      <ClientTag name="DUNE" kind="DESERT TOURS" at={9.55} out={10.95} />
      <End at={13.1} />
    </AbsoluteFill>
  );
};
