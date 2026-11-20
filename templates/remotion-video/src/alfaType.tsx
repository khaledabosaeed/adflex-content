/*
 * ALFA brand type: the motion and text system from the ORRA ALFA hero (Python source in tools/alfa-motion-source/).
 * Recipe and copy: motion-styles/alfa-brand-type.md.
 *
 *   <BrandBg />                      deep violet aurora background (drifts, grain, vignette)
 *   <AlfaTitle at={0} />             1.4 s title card: ALFA letters drop from the camera, "by AdFlex" locks up, glitch out
 *   <AlfaWord at size cx cy />       the ALFA wordmark rising letter by letter (ALFA beat, end card)
 *   <BoxCaption w1 w2 at x y />      white word + gradient box that wipes open ("Any [Size.]")
 *   <TimerChip secs done />          campaign timer pill with steps and progress bar; <Toast label />
 *   <Glitch g seed>                  RGB split + slice offsets around any layer
 *
 * All times are in seconds. Positions are for a 1920x1080 frame.
 * Needs public/Outfit-{500,600,700,800}.ttf, public/Unbounded-900.ttf and public/adflex-logo.png (setup.sh copies them).
 */
import React from 'react';
import {AbsoluteFill, Img, random, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {loadFont} from '@remotion/fonts';

for (const w of [500, 600, 700, 800]) loadFont({family: 'Outfit', url: staticFile(`Outfit-${w}.ttf`), weight: String(w)});
loadFont({family: 'Unbounded', url: staticFile('Unbounded-900.ttf'), weight: '900'});

export const OUTFIT = "Outfit, system-ui, sans-serif";
export const UNBOUNDED = "Unbounded, 'Archivo Black', sans-serif";

/* ---------- colours (sampled from the AdFlex logo) ---------- */
export const AT = {
  base: '#0B0520', // background base
  deep: '#0D0624', // chip / panel fill
  lav: '#D9C1FB', // lavender lines and small text
  by: '#D9C8FF', // the "by" before the logo
  glow: 'rgb(140,80,255)',
  blue: '#3292FF',
  violet: '#9848FE',
};
/** logo gradient (timer digits, check circles, progress bar) */
export const LOGO_GRAD = 'linear-gradient(90deg, #6CB4FF 0%, #3292FF 30%, #9848FE 72%, #6730D4 100%)';
/** caption box gradient */
export const BOX_GRAD = 'linear-gradient(90deg, #3292FF 0%, #9848FE 55%, #6730D4 100%)';

/* ---------- time + easing (same curves as the Python source) ---------- */
export const clamp = (x: number, a = 0, b = 1) => Math.max(a, Math.min(b, x));
export const prog = (t: number, t0: number, t1: number) => clamp((t - t0) / (t1 - t0));
export const eo3 = (x: number) => 1 - (1 - x) ** 3;
export const ei3 = (x: number) => x ** 3;
export const eio = (x: number) => (x < 0.5 ? 4 * x ** 3 : 1 - (-2 * x + 2) ** 3 / 2);
export const lerp = (a: number, b: number, x: number) => a + (b - a) * x;
/** current time in seconds */
export const useT = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  return f / fps;
};

/* ---------- background ---------- */
/** Additive gaussian blob. r is in fractions of the frame height (as in title_style.bg2). */
const Blob: React.FC<{x: number; y: number; r: number; rgb: string; k: number}> = ({x, y, r, rgb, k}) => {
  const R = r * 1080;
  const g = [1, 0.78, 0.37, 0.105, 0.018].map((v, i) => `rgba(${rgb},${(k * v).toFixed(3)}) ${(i * 0.5 * R).toFixed(0)}px`);
  return (
    <AbsoluteFill
      style={{mixBlendMode: 'plus-lighter', background: `radial-gradient(circle at ${x * 100}% ${y * 100}%, ${g.join(', ')}, rgba(${rgb},0) ${(2.2 * R).toFixed(0)}px)`}}
    />
  );
};

/** Deep #0B0520 base, drifting blue/violet aurora, faint pink accent, spotlight behind the title, diagonal streak, vignette, grain. */
export const BrandBg: React.FC<{drift?: boolean; grain?: boolean}> = ({drift = true, grain = true}) => {
  const t = useT();
  const tt = drift ? t : 0.3;
  const s = Math.sin(tt * 0.9);
  const c = Math.cos(tt * 0.7);
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{background: AT.base, overflow: 'hidden'}}>
      <Blob x={0.12 + 0.04 * s} y={0.1 + 0.03 * c} r={0.55} rgb="50,146,255" k={0.42 * 0.6} />
      <Blob x={0.92 - 0.04 * c} y={0.95 + 0.02 * s} r={0.65} rgb="152,72,254" k={0.48 * 0.6} />
      <Blob x={0.8 + 0.03 * s} y={0.18} r={0.3} rgb="255,105,200" k={0.1 * 0.6} />
      <Blob x={0.5} y={0.47} r={0.42} rgb="90,50,190" k={0.3 * 0.7} />
      {/* soft diagonal light streak */}
      <AbsoluteFill
        style={{
          mixBlendMode: 'plus-lighter',
          background: `linear-gradient(118deg, transparent ${(52 + 8 * s).toFixed(1)}%, rgba(170,150,255,.07) ${(56 + 8 * s).toFixed(1)}%, transparent ${(60 + 8 * s).toFixed(1)}%)`,
        }}
      />
      {/* vignette: edges fall to ~45 % */}
      <AbsoluteFill style={{background: 'radial-gradient(ellipse 75% 80% at 50% 50%, rgba(0,0,0,0) 35%, rgba(0,0,0,.55) 100%)'}} />
      {grain ? (
        <svg width={1920} height={1080} style={{position: 'absolute', inset: 0, opacity: 0.09, mixBlendMode: 'overlay'}}>
          <filter id="alfa-grain">
            <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves={2} seed={f % 24} stitchTiles="stitch" />
          </filter>
          <rect width="100%" height="100%" filter="url(#alfa-grain)" />
        </svg>
      ) : null}
    </AbsoluteFill>
  );
};

/* ---------- the ALFA wordmark (Unbounded 900, logo gradient + top gloss + glow) ---------- */
// Unbounded Black advances in em (measured), 0.02 em tracking.
const ADV = [0.996, 0.781, 0.791, 0.996];
const OFF = [0, 1.016, 1.817, 2.628];
const TOTAL = 3.624;
const LINE = 1.24; // ascent + descent; the cap-height centre sits at 0.62 em
const FILL_STOPS = ['#8EC5FF 0%', '#3C96FF 16.5%', '#A058FF 36%', '#BE82FF 50%', '#A058FF 64%', '#3C96FF 83.5%', '#8EC5FF 100%'];

const clipText: React.CSSProperties = {backgroundClip: 'text', WebkitBackgroundClip: 'text', color: 'transparent', backgroundRepeat: 'no-repeat'};

export type LetterPose = {x?: number; y?: number; scale?: number; rot?: number; blur?: number; opacity?: number};

/**
 * The four ALFA letters, each one a separate layer you can pose.
 * shift: gradient flow, in word widths (the title uses 0.30 per second).
 * sweep: 0..1 position of the white light band, or null.
 */
export const AlfaLetters: React.FC<{
  size: number;
  cx: number;
  cy: number;
  shift?: number;
  sweep?: number | null;
  pose?: (i: number) => LetterPose;
  scale?: number;
  opacity?: number;
}> = ({size, cx, cy, shift = 0, sweep = null, pose, scale = 1, opacity = 1}) => {
  if (opacity <= 0) return null;
  return (
    <div
      style={{
        position: 'absolute',
        left: cx - (TOTAL * size) / 2,
        top: cy - (LINE / 2) * size,
        width: `${TOTAL}em`,
        height: `${LINE}em`,
        fontSize: size,
        fontFamily: UNBOUNDED,
        fontWeight: 900,
        lineHeight: `${LINE}em`,
        whiteSpace: 'pre',
        opacity,
        transform: `scale(${scale})`,
        transformOrigin: '50% 50%',
      }}
    >
      {'ALFA'.split('').map((ch, i) => {
        const p = pose ? pose(i) : {};
        if ((p.opacity ?? 1) <= 0) return null;
        const at = `-${OFF[i]}em 0`;
        const word = `${TOTAL}em ${LINE}em`;
        const band =
          sweep == null
            ? []
            : (() => {
                const c = lerp(-0.3, 1.4, sweep) / 1.35;
                const pc = (v: number) => `${(v * 100).toFixed(1)}%`;
                return [`linear-gradient(135deg, rgba(255,255,255,0) ${pc(c - 0.075)}, rgba(255,255,255,.85) ${pc(c)}, rgba(255,255,255,0) ${pc(c + 0.075)})`];
              })();
        const fill: React.CSSProperties = {
          ...clipText,
          backgroundImage: [
            ...band,
            'linear-gradient(180deg, rgba(255,255,255,.47) 0%, rgba(255,255,255,.19) 50%, rgba(255,255,255,0) 50.5%)',
            `linear-gradient(90deg, ${FILL_STOPS.join(', ')})`,
          ].join(', '),
          backgroundSize: [...band.map(() => word), word, `${2 * TOTAL}em ${LINE}em`].join(', '),
          backgroundPosition: [...band.map(() => at), at, `-${OFF[i] + (((shift % 2) + 2) % 2) * TOTAL}em 0`].join(', '),
          backgroundRepeat: [...band.map(() => 'no-repeat'), 'no-repeat', 'repeat-x'].join(', '),
        };
        const glow = (blur: number, a: number): React.CSSProperties => ({
          ...clipText,
          position: 'absolute',
          inset: 0,
          backgroundImage: 'linear-gradient(90deg, #3C96FF, #9848FE)',
          backgroundSize: word,
          backgroundPosition: at,
          filter: `blur(${blur * size}px)`,
          opacity: a,
        });
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: `${OFF[i]}em`,
              top: 0,
              width: `${ADV[i]}em`,
              height: `${LINE}em`,
              transformOrigin: `${ADV[i] / 2}em ${LINE / 2}em`,
              transform: `translate(${p.x ?? 0}px, ${p.y ?? 0}px) rotate(${p.rot ?? 0}deg) scale(${p.scale ?? 1})`,
              filter: (p.blur ?? 0) > 0.6 ? `blur(${p.blur}px)` : undefined,
              opacity: p.opacity ?? 1,
            }}
          >
            <span style={glow(0.16, 0.85)}>{ch}</span>
            <span style={glow(0.05, 0.6)}>{ch}</span>
            <span style={{...fill, position: 'absolute', inset: 0}}>{ch}</span>
          </div>
        );
      })}
    </div>
  );
};

/**
 * ALFA rising letter by letter (the ALFA beat and the end card).
 * Each letter slides up 24 % of the size and fades in, 0.14 of the move apart; the word settles from 1.04x.
 * size: Unbounded font size in px (228 = the end card, 250 = the ALFA beat).
 */
export const AlfaWord: React.FC<{at: number; size: number; cx?: number; cy?: number; dur?: number; out?: number; shift?: number}> = ({
  at,
  size,
  cx = 960,
  cy = 480,
  dur = 0.6,
  out,
  shift = 0,
}) => {
  const t = useT();
  const p = prog(t, at, at + dur);
  if (p <= 0) return null;
  const o = out == null ? 0 : eio(prog(t, out - 0.2, out));
  return (
    <AlfaLetters
      size={size}
      cx={cx}
      cy={cy}
      shift={shift}
      scale={lerp(1.04, 1, eo3(p))}
      opacity={1 - o}
      pose={(i) => {
        const q = eo3(prog(p, i * 0.14, i * 0.14 + 0.58));
        return {y: (1 - q) * size * 0.237, opacity: q};
      }}
    />
  );
};

/* ---------- glitch: RGB split + horizontal slice offsets ---------- */
const CH = {
  r: '1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0',
  g: '0 0 0 0 0  0 1 0 0 0  0 0 0 0 0  0 0 0 1 0',
  b: '0 0 0 0 0  0 0 0 0 0  0 0 1 0 0  0 0 0 1 0',
};
const Split: React.FC<{dx: number; children: React.ReactNode}> = ({dx, children}) => (
  <AbsoluteFill style={{background: '#000', isolation: 'isolate'}}>
    {(['r', 'g', 'b'] as const).map((c) => (
      <AbsoluteFill key={c} style={{mixBlendMode: 'screen', filter: `url(#alfa-ch-${c})`, transform: `translateX(${c === 'r' ? dx : c === 'b' ? -dx : 0}px)`}}>
        {children}
      </AbsoluteFill>
    ))}
  </AbsoluteFill>
);
/** g: 0..1 strength (28 px RGB split and 3-12 slices of up to 80 px at full strength). Draws the children up to 3x(1+slices) times, so keep it to a few frames. */
export const Glitch: React.FC<{g: number; seed: string | number; children: React.ReactNode}> = ({g, seed, children}) => {
  if (g <= 0.01) return <>{children}</>;
  const dx = 28 * g;
  const n = Math.floor(3 + 9 * g);
  const slices = Array.from({length: n}, (_, k) => {
    const y0 = random(`${seed}-y${k}`) * 1080;
    const hh = 6 + random(`${seed}-h${k}`) * Math.max(2, 80 * g - 6);
    // normal-ish offset, sigma 140 px * g
    const nrm = (random(`${seed}-a${k}`) + random(`${seed}-b${k}`) + random(`${seed}-c${k}`) - 1.5) * 2;
    return {y0, hh, off: nrm * 140 * g};
  });
  return (
    <AbsoluteFill>
      <svg width={0} height={0} style={{position: 'absolute'}}>
        {(['r', 'g', 'b'] as const).map((c) => (
          <filter key={c} id={`alfa-ch-${c}`} colorInterpolationFilters="sRGB">
            <feColorMatrix type="matrix" values={CH[c]} />
          </filter>
        ))}
      </svg>
      <Split dx={dx}>{children}</Split>
      {slices.map((s, k) => (
        <AbsoluteFill key={k} style={{clipPath: `inset(${s.y0}px 0 ${Math.max(0, 1080 - s.y0 - s.hh)}px 0)`, transform: `translateX(${s.off}px)`}}>
          <Split dx={dx}>{children}</Split>
        </AbsoluteFill>
      ))}
    </AbsoluteFill>
  );
};

/* ---------- small pieces ---------- */
/** 4-point sparkle (the pink star in the AdFlex logo) */
export const Sparkle: React.FC<{x: number; y: number; size: number; rot?: number; opacity?: number}> = ({x, y, size, rot = 0, opacity = 1}) => {
  const s = size;
  const k = s * 0.16;
  const pts = [
    [0, -s],
    [k, -k],
    [s, 0],
    [k, k],
    [0, s],
    [-k, k],
    [-s, 0],
    [-k, -k],
  ]
    .map(([a, b]) => `${a + s * 1.5},${b + s * 1.5}`)
    .join(' ');
  return (
    <svg width={s * 3} height={s * 3} style={{position: 'absolute', left: x - s * 1.5, top: y - s * 1.5, opacity, transform: `rotate(${rot}deg)`, overflow: 'visible'}}>
      <polygon points={pts} fill="rgb(255,140,220)" style={{filter: `blur(${s * 0.18}px)`}} />
      <polygon points={pts} fill="rgb(255,245,255)" />
    </svg>
  );
};

/** "by [AdFlex logo]" lockup. qBy: "by" rises out of its mask; qLogo: the logo wipes in left to right with a glowing edge. */
export const ByLockup: React.FC<{cy: number; qBy: number; qLogo: number; drop?: number; spark?: number; logoW?: number}> = ({cy, qBy, qLogo, drop = 0, spark = 0, logoW = 470}) => {
  const logoH = (logoW * 524) / 1820;
  const bySize = 58;
  const byW = 1.082 * bySize;
  const gap = 22;
  const tot = byW + gap + logoW;
  const x0 = 960 - tot / 2;
  const lx0 = x0 + byW + gap;
  const dy = drop * 30;
  const cw = logoW * qLogo;
  // sparkle centre inside the logo (measured: 18.9 % across, 9.6 % down)
  const sx = lx0 + 0.1886 * logoW;
  const sy = cy - logoH / 2 + 0.0956 * logoH + dy;
  const k = Math.sin(Math.PI * clamp(spark));
  return (
    <>
      {qBy > 0 ? (
        <div style={{position: 'absolute', left: x0, top: cy + 6 + dy - (bySize * 1.26) / 2, height: bySize * 1.26, overflow: 'hidden', opacity: 0.9 * (1 - drop)}}>
          <div style={{fontFamily: OUTFIT, fontWeight: 500, fontSize: bySize, lineHeight: 1.26, color: AT.by, transform: `translateY(${(1 - qBy) * 100}%)`}}>by</div>
        </div>
      ) : null}
      {qLogo > 0 ? (
        <>
          <Img
            src={staticFile('adflex-logo.png')}
            style={{position: 'absolute', left: lx0, top: cy - logoH / 2 + dy, width: logoW, height: logoH, clipPath: `inset(0 ${(1 - qLogo) * 100}% 0 0)`, opacity: 1 - drop}}
          />
          {qLogo < 1 ? (
            <div
              style={{
                position: 'absolute',
                left: lx0 + cw - 3,
                top: cy - logoH * 0.6 + dy,
                width: 6,
                height: logoH * 1.2,
                background: 'rgb(200,170,255)',
                filter: 'blur(6px)',
                opacity: Math.sin(Math.PI * qLogo),
              }}
            />
          ) : null}
        </>
      ) : null}
      {spark > 0 && spark < 1 ? <Sparkle x={sx} y={sy} size={48 * (0.4 + 0.9 * k)} rot={spark * 90} opacity={k * (1 - drop)} /> : null}
    </>
  );
};

/* ---------- the 1.4 s title card ---------- */
export const TITLE_S = 1.4;
/**
 * ALFA title card (hero17.intro): letters drop in from the camera one by one (blur to sharp, small squash, a glitch tick and
 * a shake on each landing), the gradient keeps flowing, a light sweep passes, the word pushes in; "by" rises, the logo wipes
 * in and its sparkle flashes; a ring bursts out; exit: letters fly past the camera, the lockup drops, glitch cut to black.
 */
export const AlfaTitle: React.FC<{at?: number; size?: number; cy?: number; lockupY?: number}> = ({at = 0, size = 228, cy = 480, lockupY = 705}) => {
  const T = useT() - at;
  const f = useCurrentFrame();
  if (T < 0 || T > TITLE_S + 0.05) return null;
  const cx = 960;
  const push = lerp(1.0, 1.06, eio(prog(T, 0.45, 1.15)));
  const sw = prog(T, 0.6, 0.85);
  const land = (i: number) => 0.08 + i * 0.055 + 0.2;
  let tick = 0;
  for (let i = 0; i < 4; i++) tick = Math.max(tick, Math.exp(-(((T - land(i)) / 0.02) ** 2)));
  const shake = [0, 1, 2, 3].reduce((a, i) => a + Math.exp(-(((T - land(i)) / 0.03) ** 2)), 0);
  const sdx = shake > 0.02 ? Math.sin(f * 2.7) * 14 * shake : 0;
  const sdy = shake > 0.02 ? Math.cos(f * 3.1) * 9 * shake : 0;
  const drop = eio(prog(T, 1.0, 1.22));
  const r = prog(T, land(3), land(3) + 0.35);
  const gOut = eio(prog(T, 1.24, TITLE_S));
  const black = eio(prog(T, 1.3, TITLE_S));
  return (
    <AbsoluteFill>
      <Glitch g={Math.max(0.75 * tick, gOut)} seed={`t${f}`}>
        <AbsoluteFill style={{transform: `translate(${sdx}px, ${sdy}px)`}}>
          <AbsoluteFill style={{background: '#000'}} />
          <AbsoluteFill style={{opacity: eo3(prog(T, 0, 0.12))}}>
            <BrandBg />
          </AbsoluteFill>
          <AlfaLetters
            size={size}
            cx={cx}
            cy={cy}
            shift={0.3 * T}
            sweep={sw > 0 && sw < 1 ? sw : null}
            pose={(i) => {
              const t0 = 0.08 + i * 0.055;
              const q = prog(T, t0, t0 + 0.24);
              if (q <= 0) return {opacity: 0};
              const e = eo3(q);
              const sq = Math.sin(Math.PI * prog(T, t0 + 0.2, t0 + 0.34)) * 0.05; // landing squash (source: 0.09; house cap 1.05)
              const x1 = 1.05 + i * 0.035;
              const o = prog(T, x1, x1 + 0.2);
              const oe = o > 0 ? ei3(o) : 0;
              // letter centre relative to the word centre, pushed in, spread on exit
              const lc = (OFF[i] + ADV[i] / 2 - TOTAL / 2) * size;
              return {
                x: lc * (push * lerp(1, 1.6, oe) - 1),
                y: -(1 - e) * 40,
                scale: lerp(3.6, 1.0, e) * (1 - sq) * push * lerp(1, 4.0, oe),
                rot: lerp(-16 + 9 * i, 0, e),
                blur: 20 * (1 - e) + 14 * oe,
                opacity: clamp(q * 3) * (1 - oe),
              };
            }}
          />
          <ByLockup cy={lockupY} qBy={eo3(prog(T, 0.36, 0.52))} qLogo={eio(prog(T, 0.4, 0.62))} drop={drop} spark={prog(T, 0.6, 0.92)} />
          {r > 0 && r < 1 ? (
            <svg width={1920} height={1080} style={{position: 'absolute', inset: 0, overflow: 'visible'}}>
              <ellipse cx={cx} cy={cy} rx={lerp(120, 1250, eo3(r))} ry={lerp(120, 1250, eo3(r)) * 0.62} fill="none" stroke="rgb(150,90,255)" strokeWidth={lerp(36, 4, r)} opacity={0.7 * (1 - r)} style={{filter: 'blur(12px)'}} />
              <ellipse cx={cx} cy={cy} rx={700} ry={260} fill="rgb(110,120,255)" opacity={0.45 * (1 - eo3(r))} style={{filter: 'blur(120px)'}} />
            </svg>
          ) : null}
        </AbsoluteFill>
      </Glitch>
      {black > 0 ? <AbsoluteFill style={{background: '#000', opacity: black}} /> : null}
    </AbsoluteFill>
  );
};

/* ---------- caption: white word + gradient box ---------- */
/**
 * "Any [Size.]": the white word rises out of a mask (0.32 s), the gradient box wipes open from the left (+0.10 to +0.42 s),
 * the boxed word rises inside it (+0.24 to +0.52 s), then one small pulse. Exit: fade + 18 px up over the last 0.2 s before `out`.
 * Sizes used in the source: 104 (scene labels and titles), 96 ("Under 1 hour."), 76 ("Full campaign."), 56 (tagline under ALFA, weight 600).
 */
export const BoxCaption: React.FC<{
  w1?: string;
  w2: string;
  at: number;
  out?: number;
  size?: number;
  x?: number;
  y: number;
  anchor?: 'c' | 'l';
  weight?: number;
}> = ({w1, w2, at, out, size = 104, x = 960, y, anchor = 'c', weight = 700}) => {
  const t = useT();
  if (t < at) return null;
  const o = out == null ? 0 : eio(prog(t, out - 0.2, out));
  if (o >= 1) return null;
  const lh = 1.26 * size;
  const q1 = eo3(prog(t, at, at + 0.32));
  const qb = eo3(prog(t, at + 0.1, at + 0.42));
  const q2 = eo3(prog(t, at + 0.24, at + 0.52));
  const pulse = Math.sin(Math.PI * prog(t, at + 0.5, at + 0.72)) * 0.035;
  const px = 0.24 * size;
  const py = 0.1 * size;
  const word = (q: number, shadow: boolean, txt: string) => (
    <div style={{height: lh, overflow: 'hidden'}}>
      <div
        style={{
          transform: `translateY(${(1 - q) * 45}%)`,
          opacity: Math.min(1, q * 1.6),
          color: '#fff',
          textShadow: shadow ? `0 ${0.03 * size}px ${0.1 * size}px rgba(4,2,14,.65)` : undefined,
        }}
      >
        {txt}
      </div>
    </div>
  );
  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        transform: `translate(${anchor === 'c' ? '-50%' : '0'}, calc(-50% - ${o * 18}px)) scale(${1 + pulse})`,
        transformOrigin: anchor === 'c' ? '50% 50%' : '0 50%',
        display: 'flex',
        alignItems: 'center',
        gap: w1 ? 0.26 * size : 0,
        fontFamily: OUTFIT,
        fontWeight: weight,
        fontSize: size,
        lineHeight: `${lh}px`,
        whiteSpace: 'pre',
        opacity: 1 - o,
      }}
    >
      {w1 ? <div style={{paddingTop: py, paddingBottom: py}}>{word(q1, true, w1)}</div> : null}
      <div style={{clipPath: `inset(-40% calc(${(1 - qb) * 100}% - ${qb * 0.4 * size}px) -40% -40%)`, opacity: qb > 0 ? 1 : 0}}>
        <div
          style={{
            padding: `${py}px ${px}px`,
            borderRadius: 0.2 * size,
            background: `linear-gradient(180deg, rgba(255,255,255,.13) 0 50%, rgba(255,255,255,0) 50%), ${BOX_GRAD}`,
            boxShadow: `0 0 ${0.18 * size}px rgba(140,80,255,.45)`,
          }}
        >
          {word(q2, false, w2)}
        </div>
      </div>
    </div>
  );
};

/* ---------- campaign timer chip + toast ---------- */
/** hh:mm:ss for the chip; the source counts to 3492 s (58:12) with an ease of prog^1.1 */
export const timerSecs = (t: number, start: number, stop: number, end = 3492) => (t < start ? 0 : Math.round(end * prog(t, start, stop) ** 1.1));
const hms = (s: number) => [Math.floor(s / 3600), Math.floor((s % 3600) / 60), s % 60].map((v) => String(v).padStart(2, '0')).join(':');

/** Fixed-width digits so the counter doesn't jitter. */
const Digits: React.FC<{txt: string; size: number; weight: number; grad?: boolean}> = ({txt, size, weight, grad}) => (
  <span style={{display: 'inline-flex', fontFamily: OUTFIT, fontWeight: weight, fontSize: size, lineHeight: 1}}>
    {txt.split('').map((ch, i) => (
      <span
        key={i}
        style={{
          width: `${ch === ':' ? 0.29 : 0.67}em`,
          textAlign: 'center',
          ...(grad ? {...clipText, backgroundImage: LOGO_GRAD, backgroundSize: `${txt.length * 0.6}em 100%`, backgroundPosition: `-${i * 0.6}em 0`} : {color: '#fff'}),
        }}
      >
        {ch}
      </span>
    ))}
  </span>
);

/**
 * The campaign chip: clock (hand turns with `t`), hh:mm:ss, a divider, "n/total", and a gradient progress bar.
 * done: 0..total, fractional while a step fills (0.35 s per step in the source). stopped: digits turn bold + logo gradient.
 * Place it yourself: the source keeps it 44 px from the top-right corner, and flies it to the centre at 3.1x for the finale.
 */
export const TimerChip: React.FC<{secs: number; done: number; total?: number; stopped?: boolean; t?: number; x: number; y: number; scale?: number; opacity?: number}> = ({
  secs,
  done,
  total = 5,
  stopped = false,
  t = 0,
  x,
  y,
  scale = 1,
  opacity = 1,
}) => {
  if (opacity <= 0) return null;
  const h = 68;
  const rr = h * 0.22;
  const ang = t * 2.2;
  const n = Math.floor(done + 1e-6);
  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        transform: `translate(-50%, -50%) scale(${scale})`,
        opacity,
        height: h,
        display: 'flex',
        alignItems: 'center',
        paddingLeft: h * 0.95,
        paddingRight: h * 0.45,
        borderRadius: h / 2,
        background: 'rgba(13,6,36,.88)',
        border: '2px solid rgba(217,193,251,.45)',
        boxSizing: 'border-box',
        fontFamily: OUTFIT,
      }}
    >
      <svg width={h} height={h} style={{position: 'absolute', left: 0, top: 0}}>
        <circle cx={h * 0.5} cy={h * 0.47} r={rr} fill="none" stroke="#6CB4FF" strokeWidth={3} />
        <line x1={h * 0.5} y1={h * 0.47} x2={h * 0.5} y2={h * 0.47 - rr * 0.5} stroke="#6CB4FF" strokeWidth={3} strokeLinecap="round" />
        <line x1={h * 0.5} y1={h * 0.47} x2={h * 0.5 + rr * 0.68 * Math.sin(ang)} y2={h * 0.47 - rr * 0.68 * Math.cos(ang)} stroke="#9848FE" strokeWidth={3} strokeLinecap="round" />
      </svg>
      <div style={{marginTop: -3}}>
        <Digits txt={hms(secs)} size={38} weight={stopped ? 800 : 600} grad={stopped} />
      </div>
      <div style={{width: 2, height: h * 0.38, background: 'rgba(217,193,251,.35)', margin: '0 22px 0 26px', marginTop: -3}} />
      <div style={{fontSize: 24, fontWeight: 600, color: AT.lav, marginTop: -3, minWidth: 36}}>{`${n}/${total}`}</div>
      <div style={{position: 'absolute', left: h * 0.45, right: h * 0.45, bottom: 7, height: 4, borderRadius: 4, background: 'rgba(217,193,251,.16)', overflow: 'hidden'}}>
        <div style={{width: `${(100 * done) / total}%`, height: '100%', borderRadius: 4, background: LOGO_GRAD}} />
      </div>
    </div>
  );
};

/** White pill with a gradient check, e.g. "Product video" under the chip when that output is done. */
export const Toast: React.FC<{label: string; x: number; y: number; opacity?: number}> = ({label, x, y, opacity = 1}) => {
  if (opacity <= 0) return null;
  const h = 50;
  const r = h * 0.3;
  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        transform: 'translate(-50%, -50%)',
        opacity,
        height: h,
        display: 'flex',
        alignItems: 'center',
        paddingLeft: h,
        paddingRight: h * 0.5,
        borderRadius: h / 2,
        background: 'rgba(255,255,255,.92)',
        fontFamily: OUTFIT,
        fontWeight: 600,
        fontSize: 28,
        color: AT.deep,
        whiteSpace: 'pre',
      }}
    >
      <div style={{position: 'absolute', left: h * 0.52 - r, top: h / 2 - r, width: 2 * r, height: 2 * r, borderRadius: '50%', background: LOGO_GRAD}} />
      <svg width={h} height={h} style={{position: 'absolute', left: 0, top: 0}}>
        <polyline
          points={`${h * 0.52 - r * 0.45},${h / 2} ${h * 0.52 - r * 0.1},${h / 2 + r * 0.35} ${h * 0.52 + r * 0.5},${h / 2 - r * 0.35}`}
          fill="none"
          stroke="#fff"
          strokeWidth={3}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      {label}
    </div>
  );
};
