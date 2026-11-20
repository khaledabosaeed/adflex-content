/*
 * The floating ALFA prompt (script v11 idea): at each jam the frame freezes, ALFA's input flies in beside Leen,
 * the Arabic prompt types itself, send lights up, whoosh to the next world.
 * Motion graphic by the team's choice («كله توليد وموشن», 2026-11-18): not a screen recording.
 */
import React from 'react';
import {AbsoluteFill, Freeze, Img, interpolateColors, OffthreadVideo, random, Sequence, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {C, Cam, cond, IN, ip, OUT, Streaks, UI} from './lib';
import {EXIT, useSec} from './Preview';

const HOUSE = {mass: 0.6, stiffness: 140, damping: 12};

/* v6, after watching Miracle / Higgsfield-in-ChatGPT / Talent Contest / Genjutsu: a small, light prompt that lives in the
 * scene (ALFA's own lavender-white UI), types fast with a purple wake behind the caret, squashes on send and bursts pixels. */
const INK = '#1C1824', PURPLE = '#8337F1';

/** Font size and on-screen height of a box `w` wide (the door transition starts from this rect). */
export const boxFont = (w: number) => Math.round((36 * w) / 560);
export const boxH = (w: number) => 2 + 14 + 14 + 20 + 8 + Math.ceil(boxFont(w) * 2.6) + 2;

/** Typed characters at time s: steady rhythm, with a held beat after the first "!" (the joke lands, then the task). */
export const typedCount = (s: number, t0: number, t1: number, chars: string[]) => {
  const bang = chars.indexOf('!');
  const hold = bang >= 0 ? 0.16 : 0;
  const rate = chars.length / Math.max(0.1, t1 - t0 - hold);
  const tb = bang >= 0 ? t0 + (bang + 1) / rate : Infinity; // when the "!" lands
  const t = s < tb ? s - t0 : s < tb + hold ? tb - t0 : s - t0 - hold;
  return Math.max(0, Math.min(chars.length, Math.floor(t * rate)));
};

/** The typed Arabic text, Latin client names in purple, the newest `wake` letters in purple.
 * A Latin run is never split into two spans: two isolated LTR spans in an RTL line swap places ("VOLT" typed as "OLTV"). */
const Typed: React.FC<{text: string; wake: number; brand: RegExp}> = ({text, wake, brand}) => {
  const cut = text.length - wake; // Arabic letters from here on are in the wake
  let at = 0;
  return (
    <>
      {text.split(brand).map((r, i) => {
        const from = at;
        at += r.length;
        if (i % 2 === 1) return <span key={i} style={{color: PURPLE, fontWeight: 900, unicodeBidi: 'isolate'}}>{r}</span>;
        const k = Math.max(0, Math.min(r.length, cut - from));
        return (
          <React.Fragment key={i}>
            <span style={{color: INK}}>{r.slice(0, k)}</span>
            {k < r.length ? <span style={{color: PURPLE}}>{r.slice(k)}</span> : null}
          </React.Fragment>
        );
      })}
    </>
  );
};

/** English typed text with the accent wake by age (accent-typed-prompt): each glyph lands in a light purple and cools to ink
 * over `cool` s; whole-caps brand names stay purple 900. `when(i)` = when glyph i appeared. */
export const WakeText: React.FC<{chars: string[]; n: number; s: number; when: (i: number) => number; cool?: number}> = ({chars, n, s, when, cool = 0.15}) => {
  const text = chars.join('');
  const brand: boolean[] = chars.map(() => false);
  for (const m of text.matchAll(/\b[A-Z]{3,}\b/g)) for (let k = m.index!; k < m.index! + m[0].length; k++) brand[k] = true;
  return (
    <>
      {chars.slice(0, n).map((c, i) => (
        <span key={i} style={brand[i] ? {color: PURPLE, fontWeight: 900} : {color: interpolateColors(s - when(i), [0, cool], ['#A766FF', INK])}}>{c}</span>
      ))}
    </>
  );
};
/** When glyph i appeared under typedCount (binary search on the typing clock). */
export const glyphTime = (i: number, t0: number, t1: number, chars: string[]) => {
  let lo = t0, hi = t1 + 0.5;
  for (let k = 0; k < 18; k++) {
    const mid = (lo + hi) / 2;
    if (typedCount(mid, t0, t1, chars) > i) hi = mid;
    else lo = mid;
  }
  return hi;
};

/** A tight pixel burst from the send button (pixel-square-burst): 14 squares, within ~1.5× the button, 0.3 s. */
export const SendBurst: React.FC<{t: number}> = ({t}) => {
  if (t <= 0 || t >= 1) return null;
  return (
    <>
      {Array.from({length: 14}, (_, i) => {
        const a = random(`sb${i}`) * Math.PI * 2;
        const d = (34 + random(`sbd${i}`) * 52) * OUT(t);
        const size = 6 + Math.round(random(`sbs${i}`) * 2) * 3;
        const snap = (v: number) => Math.round(v / 4) * 4;
        const col = i % 4 === 0 ? '#C95AC5' : i % 5 === 0 ? '#55AAFF' : PURPLE;
        return <div key={i} style={{position: 'absolute', left: snap(27 + Math.cos(a) * d) - size / 2, top: snap(27 + Math.sin(a) * d) - size / 2, width: size, height: size, background: col, opacity: t < 0.5 ? 1 : 1 - (t - 0.5) * 2, scale: String(1 - 0.6 * t)}} />;
      })}
    </>
  );
};

/** A speech-bubble tail for a w×h box toward (tx, ty) (box coords): anchor on the nearest edge (kept off the corners), a
 * 52 px base, a tip most of the way toward her (≤ 170 px). */
const bubbleTail = (tx: number, ty: number, w: number, h: number) => {
  const r = 34;
  const ax0 = Math.max(r, Math.min(w - r, tx)), ay0 = Math.max(r, Math.min(h - r, ty));
  const dl = Math.abs(tx - 0), dr = Math.abs(tx - w), dt = Math.abs(ty - 0), db = Math.abs(ty - h);
  const out = tx < 0 || tx > w ? (dl < dr ? 'l' : 'r') : dt < db ? 't' : 'b';
  const horizontal = out === 'l' || out === 'r';
  const ax = out === 'l' ? 2 : out === 'r' ? w - 2 : ax0, ay = out === 't' ? 2 : out === 'b' ? h - 2 : ay0;
  const b1: [number, number] = horizontal ? [ax, ay - 26] : [ax - 26, ay];
  const b2: [number, number] = horizontal ? [ax, ay + 26] : [ax + 26, ay];
  const dx = tx - ax, dy = ty - ay, d = Math.hypot(dx, dy) || 1, L = Math.min(170, 0.75 * d);
  return {ax, ay, b1, b2, tip: [ax + (dx / d) * L, ay + (dy / d) * L] as [number, number]};
};

/** ALFA's input, floating in the scene. `at` = when it springs in (s, local), typing follows, send at `send`, exit at `out`. */
/* `lang`: 'ar' (script v11) or 'en' (v12, «ما بدي نص بالعربي»). `settle`: how much of the fly-in tilt goes away (1 = lands flat,
 * so a portal can sit exactly on it). Brand names: Latin runs in Arabic text; whole-caps words (VOLT) in English. */
const BRAND = {ar: /([A-Z][A-Z0-9]*)/, en: /\b([A-Z]{3,})\b/};
export const PromptBox: React.FC<{text: string; x: number; y: number; at: number; send: number; out: number; tilt?: number; w?: number; side?: 'left' | 'right'; lang?: 'ar' | 'en'; settle?: number; from?: [number, number]}> = ({text, x, y, at, send, out, tilt: tilt0 = 4, w = 560, side = 'right', lang = 'ar', settle = 0.5, from}) => {
  const en = lang === 'en';
  const dir = side === 'right' ? 1 : -1;
  const tilt = -dir * tilt0;
  const fs = boxFont(w);
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const s = f / fps;
  const inP = spring({frame: f - Math.round(at * fps), fps, config: HOUSE});
  const ex = ip(s, [out, out + EXIT], [0, 1], IN);
  if (s < at || ex >= 1) return null;

  const chars = Array.from(text);
  const t0 = at + 0.12, t1 = send - 0.14;
  const n = typedCount(s, t0, t1, chars);
  const WAKE = 3; // newest letters in purple, the wake behind the caret
  const typed = chars.slice(0, n).join('');
  const wakeLen = chars.slice(Math.max(0, n - WAKE), n).join('').length; // UTF-16 length, to match string slicing
  const typing = n > 0 && n < chars.length;
  const caretOn = s < send && (typing || Math.floor(s * 3) % 2 === 0);
  const squash = s >= send ? spring({frame: f - Math.round(send * fps), fps, config: HOUSE}) : 0;
  const press = s < send ? 1 : 0.86 + 0.14 * squash;
  const glow = ip(s, [send, send + 0.1], [0, 1]);
  // v14 cut: a speech bubble out of her. The tail anchors on the box edge nearest `from` (her head) and points at her;
  // the box grows out of that anchor (scale 0.2 → 1, travelling from her), so the message is visibly hers.
  const h = boxH(w);
  const tail = from ? bubbleTail(from[0] - x, from[1] - y, w, h) : null;
  const grow = from ? `translate(${(1 - inP) * (from[0] - x - tail!.ax) * 0.7}px, ${(1 - inP) * (from[1] - y - tail!.ay) * 0.7}px) scale(${(0.2 + 0.8 * inP) * (1 - 0.12 * ex)})` : '';

  return (
    <div
      style={{
        position: 'absolute', left: x, top: y, width: w, transformOrigin: tail ? `${tail.ax}px ${tail.ay}px` : side === 'right' ? '100% 50%' : '0% 50%',
        transform: from ? `perspective(1400px) rotateY(${tilt * 0.5}deg) ${grow}` : `perspective(1400px) rotateY(${tilt * (1 - settle * inP)}deg) translate(${dir * ((1 - inP) * 70 + ex * 30)}px, ${(1 - inP) * 14}px) scale(${(0.86 + 0.14 * inP) * (1 - 0.12 * ex)})`,
        opacity: Math.min(1, inP * 2) * (1 - ex),
        filter: ex > 0 ? `blur(${ex * 8}px)` : undefined,
      }}
    >
      {tail ? (
        <svg width={4000} height={4000} style={{position: 'absolute', left: -2000, top: -2000, overflow: 'visible', pointerEvents: 'none'}}>
          <path d={`M ${2000 + tail.b1[0]} ${2000 + tail.b1[1]} Q ${2000 + tail.ax} ${2000 + tail.ay} ${2000 + tail.tip[0]} ${2000 + tail.tip[1]} Q ${2000 + tail.ax} ${2000 + tail.ay} ${2000 + tail.b2[0]} ${2000 + tail.b2[1]} Z`} fill="#FBF8FF" stroke="rgba(131,55,241,.28)" strokeWidth={1.2} style={{filter: 'drop-shadow(0 10px 18px rgba(25,8,55,.3))'}} />
        </svg>
      ) : null}
      <div
        style={{
          position: 'relative', borderRadius: 22, padding: '14px 18px 14px 20px', direction: en ? 'ltr' : 'rtl',
          background: 'linear-gradient(180deg, rgba(255,255,255,.97), rgba(243,236,253,.95))',
          border: '1px solid rgba(131,55,241,.22)',
          boxShadow: `0 22px 60px rgba(25,8,55,.38), 0 2px 0 rgba(255,255,255,.6) inset, 0 0 ${40 * glow}px rgba(131,55,241,${0.55 * glow})`,
        }}
      >
        <div style={{display: 'flex', alignItems: 'center', gap: 7, marginBottom: 8, height: 20}}>
          <Img src={staticFile('alfa-mark.png')} style={{height: 18}} />
          <span style={{fontFamily: UI, fontWeight: 800, fontSize: 14, letterSpacing: 2.5, color: PURPLE, direction: 'ltr'}}>ALFA</span>
        </div>
        <div style={{display: 'flex', alignItems: 'flex-end', gap: 14}}>
          <div style={{flex: 1, ...(en ? {...cond(700, 88), letterSpacing: -0.3} : {fontFamily: UI, fontWeight: 800}), fontSize: fs, lineHeight: 1.3, minHeight: fs * 2.6}}>
            {en ? <WakeText chars={chars} n={n} s={s} when={(i) => glyphTime(i, t0, t1, chars)} /> : <Typed text={typed} wake={wakeLen} brand={BRAND[lang]} />}
            <span style={{display: 'inline-block', width: 3, height: fs * 0.95, marginInlineStart: 4, verticalAlign: '-0.14em', borderRadius: 2, background: PURPLE, opacity: caretOn ? 1 : 0}} />
          </div>
          <div style={{position: 'relative', width: 54, height: 54, flex: 'none'}}>
            <SendBurst t={(s - send - 0.03) / 0.3} />
            <div
              style={{
                position: 'absolute', inset: 0, borderRadius: 27, scale: String(press),
                background: 'linear-gradient(135deg, #9B5BFF, #6730D4)',
                boxShadow: `0 6px 16px rgba(103,48,212,.45), 0 0 ${36 * glow}px ${6 * glow}px rgba(131,55,241,.7)`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 19V5M5 12l7-7 7 7" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

/** Test: VOLT leap → freeze mid-air over the gap → prompt → whoosh to the KNOCKOUT punch. 4.5 s. */
export const PromptTest: React.FC = () => {
  const s = useSec();
  const {fps} = useVideoConfig();
  const FZ = 0.5; // freeze point in volt.mp4 (s): mid-air over the gap
  const SEND = 2.75, CUT = 3.1;
  const v = (from: number) => <OffthreadVideo src={staticFile('volt.mp4')} muted trimBefore={Math.round(from * fps)} style={{width: 1920, height: 1080, objectFit: 'cover'}} />;
  const frozen = s >= FZ;
  const punch = ip(s, [FZ, FZ + 0.25], [0, 1]); // the "time stops" push and grade
  const whip = ip(s, [CUT - 0.25, CUT], [0, 1], IN);
  return (
    <AbsoluteFill style={{background: '#000'}}>
      {s < CUT ? (
        <Cam s={1 + 0.06 * punch + 0.01 * Math.max(0, s - FZ) + 0.25 * whip} ox={960} oy={420} blur={whip * 16} x={-whip * 300}>
          <AbsoluteFill style={{filter: `saturate(${1 - 0.35 * punch}) brightness(${1 - 0.12 * punch})`}}>
            {frozen ? <Freeze frame={Math.round(FZ * fps)}>{v(0)}</Freeze> : v(0)}
          </AbsoluteFill>
        </Cam>
      ) : (
        <Sequence from={Math.round(CUT * fps)}>
          <Cam s={1.06 - 0.02 * (s - CUT)} blur={ip(s, [CUT, CUT + 0.18], [14, 0])} x={ip(s, [CUT, CUT + 0.2], [300, 0], OUT)}>
            <OffthreadVideo src={staticFile('knockout.mp4')} muted style={{width: 1920, height: 1080, objectFit: 'cover'}} />
          </Cam>
        </Sequence>
      )}
      {/* freeze flash: a quick lavender pulse when time stops */}
      <AbsoluteFill style={{background: C.accent, mixBlendMode: 'screen', opacity: ip(s, [FZ, FZ + 0.05, FZ + 0.3], [0, 0.35, 0])}} />
      <PromptBox text="طلّعني من هون! وبعدها ريل لليلة القتال عند KNOCKOUT" x={1150} y={70} at={FZ + 0.2} send={SEND} out={CUT - 0.28} />
      <Streaks at={(CUT - 0.2) * fps} dur={0.5 * fps} x={960} y={540} max={0.5} seed="ptest" />
    </AbsoluteFill>
  );
};
