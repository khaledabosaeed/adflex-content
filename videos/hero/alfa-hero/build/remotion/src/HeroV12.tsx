/*
 * ALFA hero, script v12: "Get me out of here", English, cut the Talent Contest way.
 * Team: «ما بدي نص بالعربي وشوف فيديو من الفيديوهات الريفرنس عندك وزبط الانتقالات بطريقته».
 * Reference: Higgsfield Talent Contest (references/hero/README.md): the camera never stops, every transition happens inside the
 * footage, and the label erases just before each cut and types on right after it.
 *   open → VOLT     flare-fly-in title, then a dive-through into her prompt box (VOLT already plays inside it)
 *   VOLT → KNOCKOUT whip-pan cut (smear, highlights bloom)
 *   KNOCKOUT → DUNE the punch lands: punch-in + one-frame flare wash, hard cut onto DUNE already moving
 *   DUNE → desk     the camera drops: she lands back at her desk (vertical whip)
 * 1920×1080, 24 fps, silent loop. Spec: ../../production.md "Script v12".
 */
import React from 'react';
import {AbsoluteFill, Freeze, Img, OffthreadVideo, Sequence, staticFile, useVideoConfig} from 'remotion';
import {C, cond, IN, ip, MBlur, OUT} from './lib';
import {EXIT, Pinned, useSec} from './Preview';
import {G1, project} from './Hero';
import {boxH, PromptBox} from './PromptBox';

/* ---------- timeline (seconds) ---------- */
const ACT = 1.2; // action until the jam (the last RAMP seconds slow into it)
const RAMP = 0.25;
const SLOW = 0.15; // speed during the jam (× rate): the shot never dies
const SEND = 1.0; // jam → send (the prompt flies in and types)
const POST = 0.35; // after send: time snaps back, then the transition out
const W = ACT + SEND + POST; // one world: 2.55 s
const OPEN = 2.0;
const OPEN_SEND = 1.35;
const DIVE0 = OPEN_SEND + 0.05; // the dive into the box runs DIVE0 → OPEN
const DESK = 1.4;
export const V12_SECONDS = OPEN + 3 * W + DESK; // 11.05 s
const T = {volt: OPEN, ko: OPEN + W, dune: OPEN + 2 * W, desk: OPEN + 3 * W, end: V12_SECONDS};
const OUTT = 0.2; // the outgoing half of a whip / drop / punch (the last OUTT s of a world)
const INT = 0.22; // the incoming half, at the start of the next shot

/* ---------- the jams ---------- */
type Box = {x: number; y: number; w: number; side: 'left' | 'right'};
type Jam = {src: string; freezeAt: number; rate: number; box: Box; text: string};
const BW = 600;
const JAMS: Record<'volt' | 'ko' | 'dune', Jam> = {
  volt: {src: 'act-volt.mp4', freezeAt: 3.37, rate: 1.8, box: {x: 1230, y: 140, w: BW, side: 'right'}, text: 'Get me out of here! Next: KNOCKOUT fight night'},
  ko: {src: 'act-knockout.mp4', freezeAt: 4.0, rate: 1.8, box: {x: 520, y: 60, w: BW, side: 'left'}, text: 'Get me out of here! Next: a DUNE desert ride'},
  dune: {src: 'act-dune.mp4', freezeAt: 3.0, rate: 1.8, box: {x: 70, y: 150, w: BW, side: 'left'}, text: 'Get me out of here! Schedule all three for Monday'},
};
const FIRST_PROMPT = 'VOLT launch reel: runners on the rooftops';
const FIRST_BOX: Box = {x: 150, y: 110, w: BW, side: 'left'};

/** Source time at local s: full speed, a slow-down into the jam at ACT, a crawl while she types, a snap back to full speed on send. */
const srcTime = (jam: Jam, s: number) => {
  const s1 = ACT - RAMP, k = 1 - SLOW, r = jam.rate;
  const start = jam.freezeAt - r * (ACT - (k * RAMP) / 2);
  let t: number;
  if (s <= s1) t = start + r * s;
  else if (s <= ACT) {
    const u = s - s1;
    t = start + r * (s1 + u - (k * u * u) / (2 * RAMP));
  } else if (s <= ACT + SEND) t = jam.freezeAt + r * SLOW * (s - ACT);
  else t = jam.freezeAt + r * SLOW * SEND + r * (s - ACT - SEND);
  return Math.min(4.95, t);
};

const At: React.FC<{src: string; t: number}> = ({src, t}) => {
  const {fps} = useVideoConfig();
  return (
    <Freeze frame={Math.max(0, Math.round(t * fps))}>
      <OffthreadVideo src={staticFile(src)} muted style={{width: 1920, height: 1080, objectFit: 'cover'}} />
    </Freeze>
  );
};

/* ---------- transitions (Talent Contest) ---------- */
type Move = {x: number; y: number; s: number; bx: number; by: number; bright: number};
const still: Move = {x: 0, y: 0, s: 1, bx: 0, by: 0, bright: 1};
/** A whip pan / drop: the outgoing half accelerates (IN) with a growing directional smear, highlights bloom; the incoming half
 * starts mid-whip and brakes (OUT). Scale 1.35 keeps the frame edges covered while it moves. */
const whip = (p: number, dir: 'x' | 'y', sign: number, incoming: boolean): Move => {
  if (p <= 0 || p >= 1) return still;
  const e = incoming ? 1 - OUT(p) : IN(p);
  const d = sign * 330 * e * (incoming ? 1 : -1);
  const smear = 90 * (incoming ? 1 - p : p) ** 1.2;
  return {x: dir === 'x' ? d : 0, y: dir === 'y' ? d : 0, s: 1 + 0.35 * Math.sin((Math.PI / 2) * (incoming ? 1 - p : p)), bx: dir === 'x' ? smear : smear * 0.15, by: dir === 'y' ? smear : smear * 0.15, bright: 1 + 0.7 * e};
};
/** The camera wrapper every shot sits in: a move (whip / drop) plus a push `s` around (ox, oy). */
const Shot: React.FC<{id: string; m?: Move; s?: number; ox?: number; oy?: number; blur?: number; children: React.ReactNode}> = ({id, m = still, s = 1, ox = 960, oy = 540, blur = 0, children}) => (
  <MBlur id={id} x={m.bx} y={m.by} style={{filter: undefined}}>
    <AbsoluteFill style={{transformOrigin: `${ox}px ${oy}px`, transform: `translate(${m.x}px, ${m.y}px) scale(${m.s * s})`, filter: `brightness(${m.bright})${blur > 0.05 ? ` blur(${blur}px)` : ''}`}}>{children}</AbsoluteFill>
  </MBlur>
);
/** Flare wash (Talent Contest 0.55 s): one or two frames of haze with a soft diagonal beam. */
const Haze: React.FC<{at: number; len?: number}> = ({at, len = 0.09}) => {
  const s = useSec();
  const o = ip(s, [at - 0.02, at, at + len], [0, 1, 0]);
  if (o <= 0.001) return null;
  return <AbsoluteFill style={{opacity: o, background: 'linear-gradient(115deg, rgba(255,250,244,.35) 20%, rgba(255,255,255,.85) 48%, rgba(235,222,255,.45) 70%)'}} />;
};

/** The client label (Talent Contest corner type): types on letter by letter after the cut, erases letter by letter before the next. */
const ClientTag: React.FC<{name: string; kind: string; at: number; out: number}> = ({name, kind, at, out}) => {
  const s = useSec();
  if (s < at || s > out + 0.4) return null;
  const all = [...name, ' ', ' ', ...kind];
  const n = all.length;
  const shown = (i: number) => s >= at + i * 0.025 && s < out + (n - 1 - i) * 0.012; // erase from the end, fast
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

/* ---------- one client's world ---------- */
type Exit = 'whip' | 'punch' | 'drop';
type Enter = 'dive' | 'whip' | 'punch' | 'drop';
/** How a shot lands (its first INT s) — the other half of the previous world's exit. */
const enterMove = (how: Enter, s: number): {m: Move; s: number; blur: number} => {
  const p = s / INT;
  if (how === 'whip') return {m: whip(p, 'x', 1, true), s: 1, blur: 0};
  if (how === 'drop') return {m: whip(p, 'y', 1, true), s: 1, blur: 0};
  // dive / punch: land out of a zoom, already moving
  const z = how === 'dive' ? 1.6 : 1.3;
  const q = ip(s, [0, how === 'dive' ? 0.35 : 0.25], [0, 1], OUT);
  return {m: still, s: z - (z - 1) * q, blur: 8 * (1 - q)};
};

const World: React.FC<{id: string; jam: Jam; label: [string, string]; enter: Enter; exit: Exit; punchAt?: [number, number]}> = ({id, jam, label, enter, exit, punchAt = [960, 540]}) => {
  const s = useSec();
  const ent = enterMove(enter, s);
  const stop = ip(s, [ACT - 0.05, ACT + 0.2], [0, 1]) * (1 - ip(s, [ACT + SEND, ACT + SEND + 0.1], [0, 1])); // jam grade
  const p = (s - (W - OUTT)) / OUTT; // exit progress
  const exitM = exit === 'whip' ? whip(p, 'x', 1, false) : exit === 'drop' ? whip(p, 'y', 1, false) : still;
  const punch = exit === 'punch' ? ip(s, [W - OUTT, W], [0, 1], IN) : 0;
  const m: Move = exitM !== still ? exitM : ent.m;
  const push = ent.s * (1.02 + 0.03 * Math.min(s, ACT) / ACT + 0.05 * stop + 0.01 * Math.max(0, s - ACT)) * (1 + 0.5 * punch);
  return (
    <AbsoluteFill>
      <Shot id={id} m={m} s={push} ox={punch > 0 ? punchAt[0] : 960} oy={punch > 0 ? punchAt[1] : 540} blur={ent.blur + 5 * punch}>
        <AbsoluteFill style={{filter: `saturate(${1 - 0.3 * stop}) brightness(${1 - 0.1 * stop})`}}>
          <At src={jam.src} t={srcTime(jam, s)} />
        </AbsoluteFill>
        {/* the box lives in the shot: it whips / drops / punches out with her world */}
        <PromptBox text={jam.text} {...jam.box} lang="en" at={ACT + 0.04} send={ACT + SEND} out={W + 1} />
      </Shot>
      <AbsoluteFill style={{background: C.accent, mixBlendMode: 'screen', opacity: ip(s, [ACT - 0.05, ACT + 0.03, ACT + 0.25], [0, 0.2, 0])}} />
      <ClientTag name={label[0]} kind={label[1]} at={enter === 'dive' ? 0.3 : INT} out={W - OUTT - 0.3} />
      {exit === 'punch' ? <Haze at={W - 0.02} len={0.1} /> : null}
      {enter === 'punch' ? <Haze at={0} len={0.08} /> : null}
    </AbsoluteFill>
  );
};

/* ---------- 0 – OPEN: her hands at the agency; ALFA flies in; her first prompt; the dive into it ---------- */
const TITLE_AT = 0.1;
const Open: React.FC = () => {
  const s = useSec();
  // title from behind the camera: ~8× → 1 over 0.35 s (expo-out), radial blur from stacked copies
  const tp = ip(s, [TITLE_AT, TITLE_AT + 0.35], [0, 1], OUT);
  const tOut = ip(s, [0.8, 0.8 + EXIT], [0, 1], IN);
  const tScale = 1 + 7 * (1 - tp);
  // the dive: the whole frame scales into the box; the box centre moves to the frame centre; ends with the box filling the frame
  const b = FIRST_BOX, h = boxH(b.w), cx = b.x + b.w / 2, cy = b.y + h / 2;
  const zEnd = 1.1 * Math.max(1920 / b.w, 1080 / h);
  const dp = ip(s, [DIVE0, OPEN], [0, 1], IN);
  const Z = Math.pow(zEnd, dp);
  const portal = ip(s, [OPEN_SEND + 0.02, OPEN_SEND + 0.12], [0, 1]);
  const hot = ip(s, [OPEN - 0.18, OPEN], [0, 1], IN);
  const k = Math.max(b.w / 1920, h / 1080); // VOLT cover-fit inside the box
  const lead = OPEN - s; // VOLT keeps running into its own shot
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{transformOrigin: `${cx}px ${cy}px`, transform: `translate(${(960 - cx) * dp}px, ${(540 - cy) * dp}px) scale(${Z})`, filter: dp > 0.3 ? `blur(${3 * (dp - 0.3)}px)` : undefined}}>
        <AbsoluteFill style={{transform: `scale(${1.03 + 0.02 * s})`}}>
          <OffthreadVideo src={staticFile('typing.mp4')} muted trimBefore={Math.round(0.8 * 24)} style={{width: 1920, height: 1080, objectFit: 'cover'}} />
        </AbsoluteFill>
        <AbsoluteFill style={{background: 'rgba(10,5,15,.35)', opacity: 1 - ip(s, [0.8, 1.1], [0, 0.6])}} />
        <PromptBox text={FIRST_PROMPT} {...b} lang="en" settle={1} at={0.5} send={OPEN_SEND} out={OPEN + 1} />
        {portal > 0 ? (
          <div style={{position: 'absolute', left: b.x, top: b.y, width: b.w, height: h, borderRadius: 22, overflow: 'hidden', opacity: portal, boxShadow: `0 0 ${30 + 50 * hot}px rgba(${200 + 55 * hot},${170 + 85 * hot},255,${0.7 + 0.3 * hot}), inset 0 0 ${10 + 30 * hot}px rgba(255,255,255,${0.5 + 0.5 * hot})`, outline: `${1.5 + 2 * hot}px solid rgba(255,255,255,${0.6 + 0.4 * hot})`}}>
            <div style={{position: 'absolute', left: (b.w - 1920 * k) / 2, top: (h - 1080 * k) / 2, width: 1920, height: 1080, scale: String(k), transformOrigin: '0 0'}}>
              <At src={JAMS.volt.src} t={Math.max(0, srcTime(JAMS.volt, 0) - JAMS.volt.rate * lead)} />
            </div>
          </div>
        ) : null}
      </AbsoluteFill>
      {tOut < 1 && s >= TITLE_AT ? (
        <AbsoluteFill style={{opacity: Math.min(1, tp * 3) * (1 - tOut), filter: tOut > 0 ? `blur(${tOut * 12}px)` : undefined}}>
          <div style={{position: 'absolute', top: 250, width: 1920, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 16, opacity: ip(s, [TITLE_AT + 0.25, TITLE_AT + 0.45], [0, 1])}}>
            <Img src={staticFile('adflex-logo.png')} style={{height: 40, filter: 'brightness(0) invert(1)'}} />
            <span style={{...cond(500, 100), fontSize: 30, color: 'rgba(255,255,255,.85)', letterSpacing: 4}}>AGENT</span>
          </div>
          {[0, 1, 2, 3].map((i) => {
            const sc = tScale * (1 + i * 0.06 * (1 - tp));
            return (
              <div key={i} style={{position: 'absolute', top: 330, width: 1920, textAlign: 'center', ...cond(900, 125), fontSize: 380, lineHeight: 1, color: '#fff', letterSpacing: -4, textShadow: i === 0 ? '0 10px 60px rgba(0,0,0,.35)' : undefined, transform: `scale(${sc})`, transformOrigin: '960px 190px', opacity: i === 0 ? 1 : 0.35 * (1 - tp), filter: tp < 1 ? `blur(${(1 - tp) * (6 + i * 4)}px)` : undefined}}>
                ALFA
              </div>
            );
          })}
          <div style={{position: 'absolute', top: 760, width: 1920, textAlign: 'center', ...cond(700, 110), fontSize: 30, letterSpacing: 10, color: 'rgba(255,255,255,.92)', opacity: ip(s, [TITLE_AT + 0.3, TITLE_AT + 0.5], [0, 1])}}>YOUR AI MARKETING AGENT</div>
        </AbsoluteFill>
      ) : null}
      <Haze at={TITLE_AT} len={0.08} />
    </AbsoluteFill>
  );
};

/* ---------- 4 – back at her desk (she drops in from DUNE); the end line; loops to frame 0 ---------- */
const Desk: React.FC = () => {
  const s = useSec();
  const ent = enterMove('drop', s);
  const [cx, cy] = project(G1, 960, 540);
  const endP = ip(s, [0.25, 0.5], [0, 1]);
  const endE = ip(s, [DESK - 0.3, DESK - 0.3 + EXIT], [0, 1], IN);
  return (
    <AbsoluteFill>
      <Shot id="desk" m={ent.m} s={1.0 + 0.03 * s} ox={cx} oy={cy}>
        <At src="screen.mp4" t={2.5 + s} />
        <Pinned quad={G1}>
          <At src="act-volt.mp4" t={1.0 + s} />
        </Pinned>
      </Shot>
      <AbsoluteFill style={{background: 'linear-gradient(0deg, rgba(0,0,0,.45), rgba(0,0,0,0) 35%)'}} />
      {endP > 0 && endE < 1 ? (
        <div style={{position: 'absolute', bottom: 70, width: 1920, textAlign: 'center', ...cond(700, 110), fontSize: 30, letterSpacing: 8, color: '#fff', textShadow: '0 2px 20px rgba(0,0,0,.6)', opacity: endP * (1 - endE), filter: `blur(${(1 - endP) * 8 + endE * 8}px)`}}>
          ALFA · AVAILABLE ON ADFLEX.AI
        </div>
      ) : null}
      <AbsoluteFill style={{background: 'rgba(10,5,15,1)', opacity: ip(s, [DESK - 0.3, DESK], [0, 0.35])}} />
    </AbsoluteFill>
  );
};

/* =========================== TIMELINE =========================== */
export const AlfaHeroV12: React.FC = () => {
  const {fps} = useVideoConfig();
  const seq = (from: number, to: number) => ({from: Math.round(from * fps), durationInFrames: Math.round(to * fps) - Math.round(from * fps)});
  return (
    <AbsoluteFill style={{background: '#000'}}>
      <Sequence name="0 · desk: ALFA flies in, first prompt, dive into it" {...seq(0, T.volt)}>
        <Open />
      </Sequence>
      <Sequence name="1 · VOLT: leap → jam → whip" {...seq(T.volt, T.ko)}>
        <World id="volt" jam={JAMS.volt} label={['VOLT', 'RUNNING SHOES']} enter="dive" exit="whip" />
      </Sequence>
      <Sequence name="2 · KNOCKOUT: ropes → jam → the punch lands" {...seq(T.ko, T.dune)}>
        <World id="ko" jam={JAMS.ko} label={['KNOCKOUT', 'BOXING GYM']} enter="whip" exit="punch" punchAt={[1300, 480]} />
      </Sequence>
      <Sequence name="3 · DUNE: off the crest → jam → drop" {...seq(T.dune, T.desk)}>
        <World id="dune" jam={JAMS.dune} label={['DUNE', 'DESERT TOURS']} enter="punch" exit="drop" />
      </Sequence>
      <Sequence name="4 · back at the desk, loop" {...seq(T.desk, T.end)}>
        <Desk />
      </Sequence>
    </AbsoluteFill>
  );
};
