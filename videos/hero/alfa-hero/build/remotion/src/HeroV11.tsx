/*
 * ALFA hero, script v11: "Get me out of here".
 * Leen does what each client's world does; every world ends in a jam: the action ramps down into a freeze, ALFA's prompt
 * flies in beside her (motion graphic, PromptBox), the Arabic prompt types itself, send — and the box opens into a
 * door onto the next world, which grows to full frame while the frozen world is pulled into it (she dives into her prompt).
 * All footage generated (assets.md A1–A3 + desk clips). 17 s, 1920×1080, 24 fps, silent loop. Spec: ../../production.md "Script v11".
 */
import React from 'react';
import {AbsoluteFill, Freeze, Img, OffthreadVideo, Sequence, staticFile, useVideoConfig} from 'remotion';
import {C, Cam, cond, IN, INOUT, ip} from './lib';
import {EXIT, Pinned, useSec} from './Preview';
import {G1, project} from './Hero';
import {boxH, PromptBox} from './PromptBox';

/* ---------- timeline (absolute seconds) ---------- */
// v5 «الفيديو بطئ»: 17 → 15.25 s. v6, after the references: 13.75 s. v8 «اللقطات بطئ»: the action runs at 1.8×,
// the jam keeps moving (0.2×), the prompt types in ~0.75 s: 10.7 s.
const ACT = 1.2; // action until the jam (the last RAMP seconds ramp down into slow motion — never a dead freeze)
const RAMP = 0.25;
const SLOW = 0.2; // speed during the jam, as a fraction of `rate`
const BOX_IN = 0.04, SEND = 1.0, DOOR = 0.3; // relative to the jam; the door opens right after send and takes DOOR s
const OPEN = 1.75; // desk + title + first prompt
const W = ACT + SEND + 0.05 + DOOR; // one world: 2.55 s
const DESK = 1.3;
export const V11_SECONDS = OPEN + 3 * W + DESK; // 10.7 s
const T = {volt: OPEN, ko: OPEN + W, dune: OPEN + 2 * W, desk: OPEN + 3 * W, end: V11_SECONDS};

/* ---------- the jams ---------- */
type Box = {x: number; y: number; w: number; side: 'left' | 'right'};
type Jam = {src: string; freezeAt: number; rate: number; box: Box; text: string};
const JAMS: Record<'volt' | 'ko' | 'dune', Jam> = {
  // A1: sprint → leap → mid-air over the gap, arms flailing
  volt: {src: 'act-volt.mp4', freezeAt: 3.37, rate: 1.8, box: {x: 1320, y: 150, w: 540, side: 'right'}, text: 'طلّعني من هون! وبعدها ريل لليلة القتال عند KNOCKOUT'},
  // A2: pinned on the ropes, the glove inches from her face
  ko: {src: 'act-knockout.mp4', freezeAt: 4.0, rate: 1.8, box: {x: 540, y: 60, w: 560, side: 'left'}, text: 'طلّعني من هون! وبعدها فيديو رحلة بالصحرا لـ DUNE'},
  // A3: off the crest, airborne over the dunes
  dune: {src: 'act-dune.mp4', freezeAt: 3.0, rate: 1.8, box: {x: 70, y: 150, w: 540, side: 'left'}, text: 'طلّعني من هون! وجدول التلاتة ليوم الاتنين'},
};
const FIRST_PROMPT = 'اعملي ريل لإطلاق VOLT، عدّائين على السطوح';
const FIRST_BOX: Box = {x: 150, y: 110, w: 600, side: 'left'};

/** Source time of a jam clip at local time s: steady `rate`, a linear slow-down over RAMP to SLOW×rate reaching `freezeAt`
 * at ACT, then it keeps creeping at SLOW×rate (the shot stays alive under the prompt). */
const srcTime = (jam: Jam, s: number) => {
  const s1 = ACT - RAMP;
  const k = 1 - SLOW;
  const start = jam.freezeAt - jam.rate * (s1 + RAMP - (k * RAMP) / 2);
  if (s <= s1) return start + jam.rate * s;
  const u = Math.min(s, ACT) - s1;
  return start + jam.rate * (s1 + u - (k * u * u) / (2 * RAMP)) + jam.rate * SLOW * Math.max(0, s - ACT);
};
/** Where a jam clip is `lead` seconds before its own sequence starts (what the door shows while it opens). */
const preroll = (jam: Jam, lead: number) => srcTime(jam, 0) - jam.rate * lead;

/** A clip at an exact source time (seconds), full frame. */
const At: React.FC<{src: string; t: number}> = ({src, t}) => {
  const {fps} = useVideoConfig();
  return (
    <Freeze frame={Math.max(0, Math.round(t * fps))}>
      <OffthreadVideo src={staticFile(src)} muted style={{width: 1920, height: 1080, objectFit: 'cover'}} />
    </Freeze>
  );
};

/* ---------- the door: the sent prompt box opens onto the next world ---------- */
/** p 0→1: the box rect grows to the full frame; the whole next shot sits inside it (cover-fit), so her next world is
 * visible in the prompt box from the first frame, then fills the screen (card-to-fullbleed). */
const Door: React.FC<{box: Box; p: number; children: React.ReactNode}> = ({box, p, children}) => {
  if (p <= 0) return null;
  const h = boxH(box.w);
  const L = box.x * (1 - p), Tp = box.y * (1 - p), Wd = box.w + (1920 - box.w) * p, Hd = h + (1080 - h) * p;
  const k = Math.max(Wd / 1920, Hd / 1080) * (1.12 - 0.12 * p); // cover the door, with a push that settles to 1
  return (
    <div style={{position: 'absolute', left: L, top: Tp, width: Wd, height: Hd, borderRadius: 26 * (1 - p), overflow: 'hidden', boxShadow: `0 0 ${60 * (1 - p)}px rgba(135,56,245,${0.8 * (1 - p)})`, outline: p < 1 ? `1.5px solid rgba(185,150,255,${0.6 * (1 - p)})` : undefined}}>
      <div style={{position: 'absolute', left: (Wd - 1920 * k) / 2, top: (Hd - 1080 * k) / 2, width: 1920, height: 1080, scale: String(k), transformOrigin: '0 0', filter: `blur(${6 * Math.sin(Math.PI * p)}px)`}}>{children}</div>
    </div>
  );
};
/** The world being left: pulled into the box (push toward its centre, blur, dim). */
const pullIn = (box: Box, p: number) => ({s: 1 + 0.7 * p * p, ox: box.x + box.w / 2, oy: box.y + boxH(box.w) / 2, blur: 10 * p});

/** The client label, bottom-left (Talent Contest / Genjutsu): the name in bold white, the business in lavender beside it,
 * typed on letter by letter with a blur-in, and blurred off the same way. */
const ClientTag: React.FC<{name: string; kind: string; at: number; out: number}> = ({name, kind, at, out}) => {
  const s = useSec();
  if (s < at || s > out + 0.3) return null;
  const PER = 0.03;
  const ch = (c: string, i: number, total: number) => {
    const p = ip(s, [at + i * PER, at + i * PER + 0.15], [0, 1]);
    const e = ip(s, [out + (total - i) * 0.012, out + (total - i) * 0.012 + 0.12], [0, 1], IN);
    return (
      <span key={i} style={{display: 'inline-block', whiteSpace: 'pre', opacity: p * (1 - e), translate: `0 ${(1 - p) * 14}px`, filter: p < 1 || e > 0 ? `blur(${(1 - p) * 8 + e * 10}px)` : undefined}}>
        {c}
      </span>
    );
  };
  const total = name.length + kind.length;
  return (
    <>
      {/* a soft corner shade so the label reads on bright sand as well as the dark ring */}
      <div style={{position: 'absolute', left: 0, bottom: 0, width: 1100, height: 360, background: 'radial-gradient(ellipse at 0% 100%, rgba(10,6,20,.55), rgba(10,6,20,0) 70%)', opacity: ip(s, [at, at + 0.2], [0, 1]) * (1 - ip(s, [out, out + 0.3], [0, 1]))}} />
      <div style={{position: 'absolute', left: 92, bottom: 80, display: 'flex', alignItems: 'baseline', gap: 22, textShadow: '0 2px 4px rgba(0,0,0,.35), 0 4px 30px rgba(0,0,0,.55)'}}>
        <div style={{...cond(900, 112), fontSize: 92, lineHeight: 1, color: '#fff', letterSpacing: -0.5}}>{[...name].map((c, i) => ch(c, i, total))}</div>
        <div style={{...cond(800, 100), fontSize: 30, letterSpacing: 6, color: '#E6D6FF'}}>{[...kind].map((c, i) => ch(c, name.length + 2 + i, total))}</div>
      </div>
    </>
  );
};

/** One client's world: action ramping into the jam, the prompt, then the door to `next`. */
const World: React.FC<{jam: Jam; label: [string, string, string]; next: React.ReactNode}> = ({jam, label, next}) => {
  const s = useSec();
  const stop = ip(s, [ACT - 0.05, ACT + 0.25], [0, 1]); // time-stop grade + push
  const pop = ip(s, [ACT, ACT + 0.06, ACT + 0.3], [0, 1, 0]); // the impact as time stops
  const door = ip(s, [ACT + SEND + 0.05, ACT + SEND + 0.05 + DOOR], [0, 1], INOUT);
  const pull = pullIn(jam.box, door);
  return (
    <AbsoluteFill>
      <Cam s={pull.s} ox={pull.ox} oy={pull.oy} blur={pull.blur}>
        <Cam s={1.02 + 0.02 * Math.min(s, ACT) / ACT + 0.05 * stop + 0.035 * pop + 0.015 * Math.max(0, s - ACT)}>
          <AbsoluteFill style={{filter: `saturate(${1 - 0.35 * stop}) brightness(${1 - 0.12 * stop - 0.3 * door})`}}>
            <At src={jam.src} t={srcTime(jam, s)} />
          </AbsoluteFill>
        </Cam>
      </Cam>
      {/* time stops: a lavender pulse */}
      <AbsoluteFill style={{background: C.accent, mixBlendMode: 'screen', opacity: ip(s, [ACT - 0.05, ACT + 0.03, ACT + 0.25], [0, 0.22, 0])}} />
      <ClientTag name={label[1]} kind={label[2]} at={0.08} out={ACT + 0.35} />
      <PromptBox text={jam.text} {...jam.box} at={ACT + BOX_IN} send={ACT + SEND} out={ACT + SEND + 0.08} />
      <Door box={jam.box} p={door}>
        {next}
      </Door>
    </AbsoluteFill>
  );
};

/** What the door shows: the next jam clip running into its own sequence (continuous across the cut). */
const NextJam: React.FC<{jam: Jam; doorStart: number}> = ({jam, doorStart}) => {
  const s = useSec();
  const lead = Math.max(0, doorStart + DOOR - s); // seconds until the next sequence starts (the door ends on the cut)
  return <At src={jam.src} t={preroll(jam, lead)} />;
};

/** 0–3.1: her hands on the keyboard at the agency; giant ALFA, then her first prompt (VOLT) flies in, sends, opens onto VOLT. */
const OPEN_SEND = OPEN - DOOR - 0.05;
const Open: React.FC = () => {
  const s = useSec();
  const inP = ip(s, [0, 0.25], [0, 1]);
  const out = ip(s, [0.5, 0.5 + EXIT], [0, 1], IN);
  const ent: React.CSSProperties = {opacity: inP * (1 - out), filter: inP < 1 || out > 0 ? `blur(${(1 - inP) * 14 + out * 12}px)` : undefined};
  const doorStart = OPEN_SEND + 0.05;
  const door = ip(s, [doorStart, doorStart + DOOR], [0, 1], INOUT);
  const pull = pullIn(FIRST_BOX, door);
  return (
    <AbsoluteFill>
      <Cam s={pull.s} ox={pull.ox} oy={pull.oy} blur={pull.blur + ip(s, [0, 0.6], [5, 0])}>
        <Cam s={1.03 + 0.02 * s}>
          <OffthreadVideo src={staticFile('typing.mp4')} muted trimBefore={Math.round(0.8 * 24)} style={{width: 1920, height: 1080, objectFit: 'cover'}} />
        </Cam>
      </Cam>
      <AbsoluteFill style={{background: 'rgba(10,5,15,.35)', opacity: 1 - ip(s, [0.5, 0.8], [0, 0.6]) + 0.6 * door}} />
      {out < 1 ? (
        <AbsoluteFill style={{scale: String(1.08 - 0.08 * inP), ...ent}}>
          <div style={{position: 'absolute', top: 250, width: 1920, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 16}}>
            <Img src={staticFile('adflex-logo.png')} style={{height: 40, filter: 'brightness(0) invert(1)'}} />
            <span style={{...cond(500, 100), fontSize: 30, color: 'rgba(255,255,255,.85)', letterSpacing: 4}}>AGENT</span>
          </div>
          <div style={{position: 'absolute', top: 330, width: 1920, textAlign: 'center', ...cond(900, 125), fontSize: 380, lineHeight: 1, color: '#fff', letterSpacing: -4, textShadow: '0 10px 60px rgba(0,0,0,.35)'}}>ALFA</div>
          <div style={{position: 'absolute', top: 760, width: 1920, textAlign: 'center', ...cond(700, 110), fontSize: 30, letterSpacing: 10, color: 'rgba(255,255,255,.92)'}}>YOUR AI MARKETING AGENT</div>
        </AbsoluteFill>
      ) : null}
      <PromptBox text={FIRST_PROMPT} {...FIRST_BOX} at={0.42} send={OPEN_SEND} out={OPEN_SEND + 0.08} />
      <Door box={FIRST_BOX} p={door}>
        <NextJam jam={JAMS.volt} doorStart={doorStart} />
      </Door>
    </AbsoluteFill>
  );
};

/** The desk at the end (also what the DUNE door opens onto): her screen shows VOLT's reel. */
const DeskShot: React.FC<{t: number}> = ({t}) => {
  const [cx, cy] = project(G1, 960, 540);
  return (
    <Cam s={1.0 + 0.03 * t} ox={cx} oy={cy}>
      <At src="screen.mp4" t={2.5 + t} />
      <Pinned quad={G1}>
        <At src="act-volt.mp4" t={1.0 + t} />
      </Pinned>
    </Cam>
  );
};
const DeskIn: React.FC<{doorStart: number}> = ({doorStart}) => {
  const s = useSec();
  return <DeskShot t={s - doorStart - DOOR} />;
};

/** 15.4–17: back at her desk, safe; the end line. Loops to the desk at frame 0. */
const Desk: React.FC = () => {
  const s = useSec();
  const endP = ip(s, [0.12, 0.4], [0, 1]);
  const endE = ip(s, [DESK - 0.3, DESK - 0.3 + EXIT], [0, 1], IN);
  return (
    <AbsoluteFill>
      <DeskShot t={s} />
      <AbsoluteFill style={{background: 'linear-gradient(0deg, rgba(0,0,0,.45), rgba(0,0,0,0) 35%)'}} />
      {endP > 0 && endE < 1 ? (
        <div style={{position: 'absolute', bottom: 70, width: 1920, textAlign: 'center', ...cond(700, 110), fontSize: 30, letterSpacing: 8, color: '#fff', textShadow: '0 2px 20px rgba(0,0,0,.6)', opacity: endP * (1 - endE), filter: `blur(${(1 - endP) * 8 + endE * 8}px)`}}>
          ALFA · AVAILABLE ON ADFLEX.AI
        </div>
      ) : null}
      {/* hand-off to frame 0 (her hands, dimmed): ease down into the same darkness */}
      <AbsoluteFill style={{background: 'rgba(10,5,15,1)', opacity: ip(s, [DESK - 0.3, DESK], [0, 0.35], INOUT)}} />
    </AbsoluteFill>
  );
};

/* =========================== TIMELINE =========================== */
const WORLD_DOOR = ACT + SEND + 0.05; // == W - DOOR
export const AlfaHeroV11: React.FC = () => {
  const {fps} = useVideoConfig();
  const seq = (from: number, to: number) => ({from: Math.round(from * fps), durationInFrames: Math.round(to * fps) - Math.round(from * fps)});
  if (Math.abs(WORLD_DOOR + DOOR - W) > 1e-6) throw new Error('door must end at the world cut');
  return (
    <AbsoluteFill style={{background: '#000'}}>
      <Sequence name="0 · desk: ALFA title + first prompt → door" {...seq(0, T.volt)}>
        <Open />
      </Sequence>
      <Sequence name="1 · VOLT: the leap → jam → door" {...seq(T.volt, T.ko)}>
        <World jam={JAMS.volt} label={['01', 'VOLT', 'RUNNING SHOES']} next={<NextJam jam={JAMS.ko} doorStart={WORLD_DOOR} />} />
      </Sequence>
      <Sequence name="2 · KNOCKOUT: the ropes → jam → door" {...seq(T.ko, T.dune)}>
        <World jam={JAMS.ko} label={['02', 'KNOCKOUT', 'BOXING GYM']} next={<NextJam jam={JAMS.dune} doorStart={WORLD_DOOR} />} />
      </Sequence>
      <Sequence name="3 · DUNE: off the crest → jam → door home" {...seq(T.dune, T.desk)}>
        <World jam={JAMS.dune} label={['03', 'DUNE', 'DESERT TOURS']} next={<DeskIn doorStart={WORLD_DOOR} />} />
      </Sequence>
      <Sequence name="4 · back at the desk, loop" {...seq(T.desk, T.end)}>
        <Desk />
      </Sequence>
    </AbsoluteFill>
  );
};
