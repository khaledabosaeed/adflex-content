import React from 'react';
import {AbsoluteFill, Easing, Freeze, Img, interpolate, interpolateColors, OffthreadVideo, random, Sequence, staticFile, useCurrentFrame} from 'remotion';
import {loadFont} from '@remotion/fonts';

loadFont({family: 'Archivo Black', url: staticFile('ArchivoBlack-Regular.ttf')});
loadFont({family: 'CairoV', url: staticFile('Cairo-var.ttf'), weight: '200 1000'});
loadFont({family: 'ArchivoV', url: staticFile('Archivo-var.ttf'), weight: '100 900'});

export const DISP = "'Archivo Black', 'Arial Black', sans-serif";
export const UI = "CairoV, system-ui, sans-serif";
export const COND = "ArchivoV, 'Archivo Black', sans-serif";
/** Archivo variable: weight + width (62 = most condensed). */
export const cond = (wght: number, wdth = 72): React.CSSProperties => ({fontFamily: COND, fontWeight: wght, fontVariationSettings: `'wght' ${wght}, 'wdth' ${wdth}`});
export const C = {
  bg: '#0B0912',
  accent: '#8738F5',
  lav: '#B996FF',
  img: '#3292FF',
  vid: '#F83AAE',
  aud: '#06b58a',
  pink: '#C95AC5',
  sky: '#55AAFF',
};

// Easings: soft, never snappy
export const OUT = Easing.bezier(0.16, 1, 0.3, 1);
export const INOUT = Easing.bezier(0.65, 0, 0.35, 1);
export const IN = Easing.bezier(0.55, 0, 0.9, 0.3);

/** Clamped interpolate with an easing (default: ease-out expo-ish). */
export const ip = (f: number, inR: number[], outR: number[], easing = OUT) =>
  interpolate(f, inR, outR, {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing});

/** Damped spring 0→1 starting at frame `at`, lasting about `dur` frames. */
export const springAt = (f: number, at: number, dur = 18) => {
  const p = Math.max(0, Math.min(1, (f - at) / dur));
  return p <= 0 ? 0 : p >= 1 ? 1 : 1 - Math.exp(-6 * p) * Math.cos(7.5 * p);
};

/* ---------- persistent background (identical first and last frame, so the loop is seamless) ---------- */
export const Background: React.FC = () => {
  const f = useCurrentFrame();
  const a = (f / 600) * Math.PI * 2; // one full drift cycle per loop
  return (
    <AbsoluteFill style={{background: C.bg}}>
      <AbsoluteFill
        style={{
          background: `radial-gradient(50% 55% at ${50 + 8 * Math.sin(a)}% ${40 + 6 * Math.cos(a)}%, rgba(135,56,245,.34), transparent 70%),
            radial-gradient(38% 42% at ${82 + 5 * Math.cos(a)}% ${88 + 4 * Math.sin(a)}%, rgba(50,146,255,.14), transparent 70%),
            radial-gradient(30% 35% at ${14 + 4 * Math.sin(a)}% ${86}%, rgba(201,90,197,.12), transparent 70%)`,
        }}
      />
      <AbsoluteFill
        style={{
          backgroundImage: 'radial-gradient(rgba(185,150,255,.15) 1.6px, transparent 1.8px)',
          backgroundSize: '34px 34px',
          WebkitMaskImage: 'radial-gradient(75% 70% at 50% 50%, #000 25%, transparent 80%)',
        }}
      />
    </AbsoluteFill>
  );
};

export const Grain: React.FC = () => {
  const f = useCurrentFrame();
  const g = Math.floor(f / 1.25);
  return (
    <div
      style={{
        position: 'absolute',
        inset: -60,
        pointerEvents: 'none',
        opacity: 0.06,
        mixBlendMode: 'overlay',
        transform: `translate(${(g * 37) % 60 - 30}px, ${(g * 53) % 60 - 30}px)`,
        // eslint-disable-next-line @remotion/no-background-image -- inline SVG noise, nothing to load
        backgroundImage:
          "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='2' stitchTiles='stitch'/></filter><rect width='200' height='200' filter='url(%23n)'/></svg>\")",
      }}
    />
  );
};

/* ---------- the glowing node that carries the eye between scenes ---------- */
export const Orb: React.FC<{x: number; y: number; s: number; o?: number; trail?: [number, number][]}> = ({x, y, s, o = 1, trail = []}) => (
  <>
    {trail.map(([tx, ty], i) => (
      <div
        key={i}
        style={{
          position: 'absolute',
          left: tx - 9,
          top: ty - 9,
          width: 18,
          height: 18,
          borderRadius: '50%',
          background: 'rgba(185,150,255,.55)',
          filter: 'blur(3px)',
          opacity: o * (0.5 - i * 0.12),
          scale: String(s * (1 - i * 0.18)),
        }}
      />
    ))}
    <div
      style={{
        position: 'absolute',
        left: x - 22,
        top: y - 22,
        width: 44,
        height: 44,
        borderRadius: '50%',
        opacity: o,
        scale: String(s),
        background: 'radial-gradient(circle, #fff 0%, #fff 34%, #D4B8FF 58%, rgba(135,56,245,0) 74%)',
        boxShadow: '0 0 60px 26px rgba(135,56,245,.55), 0 0 140px 60px rgba(85,170,255,.18)',
      }}
    />
  </>
);

/* ---------- typed text: each glyph rises out of a blur ---------- */
export const Typed: React.FC<{
  text: string;
  at: number;
  per?: number;
  out?: number;
  size: number;
  color?: string;
  font?: string;
  style?: React.CSSProperties;
  colors?: string[];
}> = ({text, at, per = 1, out, size, color = '#fff', font = DISP, style, colors}) => {
  const f = useCurrentFrame();
  const fo = out == null ? 1 : ip(f, [out, out + 8], [1, 0], INOUT);
  if (f < at - 1 || fo <= 0) return null;
  return (
    <div style={{position: 'absolute', fontFamily: font, fontSize: size, lineHeight: 1.05, whiteSpace: 'pre', color, ...style}}>
      {[...text].map((ch, i) => {
        const p = ip(f, [at + i * per, at + i * per + 7], [0, 1]);
        return (
          <span
            key={i}
            style={{
              display: 'inline-block',
              whiteSpace: 'pre',
              opacity: p * fo,
              translate: `0 ${(1 - p) * 0.12 * size}px`,
              filter: p < 1 || fo < 1 ? `blur(${(1 - p) * 8 + (1 - fo) * 10}px)` : undefined,
              color: colors ? colors[i % colors.length] : undefined,
            }}
          >
            {ch}
          </span>
        );
      })}
    </div>
  );
};

/** Small caps label above a headline, e.g. "01 · ASK ALFA". */
export const Kicker: React.FC<{text: string; at: number; out?: number; x: number; y: number}> = ({text, at, out, x, y}) => {
  const f = useCurrentFrame();
  const p = ip(f, [at, at + 12], [0, 1]);
  const fo = out == null ? 1 : ip(f, [out, out + 8], [1, 0], INOUT);
  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        ...cond(700, 85),
        fontSize: 24,
        letterSpacing: 4,
        color: C.lav,
        opacity: p * fo,
        translate: `${(1 - p) * -24}px 0`,
        display: 'flex',
        alignItems: 'center',
        gap: 14,
        whiteSpace: 'nowrap',
      }}
    >
      <span style={{width: 34 * p, height: 3, borderRadius: 2, background: `linear-gradient(90deg, ${C.pink}, ${C.sky})`}} />
      {text}
    </div>
  );
};

/* ---------- a floating app window that shows a real recording ---------- */
export type WinProps = {
  w: number; // on-screen width before transforms
  srcW: number;
  srcH: number;
  cx: number;
  cy: number;
  rx?: number;
  ry?: number;
  rz?: number;
  s?: number;
  tx?: number;
  ty?: number;
  tz?: number;
  o?: number;
  dim?: number; // 0..1, darkens + blurs the window body (lifted parts stay sharp)
  content: React.ReactNode; // drawn in source pixel space, clipped to the window
  overlay?: React.ReactNode; // drawn in source pixel space, NOT clipped, keeps 3D (for lift-outs)
  url?: string;
};
export const BAR = 42;
export const UIWindow: React.FC<WinProps> = ({w, srcW, srcH, cx, cy, rx = 0, ry = 0, rz = 0, s = 1, tx = 0, ty = 0, tz = 0, o = 1, dim = 0, content, overlay, url = 'adflex.ai'}) => {
  const k = w / srcW;
  const h = srcH * k + BAR;
  return (
    <div
      style={{
        position: 'absolute',
        left: cx - w / 2,
        top: cy - h / 2,
        width: w,
        height: h,
        transformStyle: 'preserve-3d',
        transform: `translate3d(${tx}px, ${ty}px, ${tz}px) rotateX(${rx}deg) rotateY(${ry}deg) rotateZ(${rz}deg) scale(${s})`,
        opacity: o,
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: 0,
          borderRadius: 22,
          overflow: 'hidden',
          background: '#100e17',
          boxShadow: '0 70px 140px rgba(0,0,0,.65), 0 0 0 1.5px rgba(255,255,255,.10), 0 0 140px rgba(135,56,245,.22)',
          filter: dim > 0.001 ? `brightness(${1 - 0.55 * dim}) blur(${2.5 * dim}px)` : undefined,
        }}
      >
        <div style={{position: 'absolute', left: 0, right: 0, top: 0, height: BAR, background: '#0c0b12', display: 'flex', alignItems: 'center', padding: '0 18px', gap: 9}}>
          {['#ff5f57', '#febc2e', '#28c840'].map((c) => (
            <i key={c} style={{width: 12, height: 12, borderRadius: '50%', background: c, opacity: 0.85}} />
          ))}
          <div style={{margin: '0 auto', fontFamily: UI, fontWeight: 700, fontSize: 17, color: '#a69fba', background: '#17151f', borderRadius: 8, padding: '2px 40px 4px'}}>{url}</div>
        </div>
        <div style={{position: 'absolute', left: 0, top: BAR, width: srcW, height: srcH, transform: `scale(${k})`, transformOrigin: '0 0'}}>{content}</div>
        <div style={{position: 'absolute', inset: 0, background: 'linear-gradient(160deg, rgba(255,255,255,.07), transparent 35%)', pointerEvents: 'none'}} />
      </div>
      {overlay ? (
        <div style={{position: 'absolute', left: 0, top: BAR, width: srcW, height: srcH, transform: `scale(${k})`, transformOrigin: '0 0', transformStyle: 'preserve-3d'}}>{overlay}</div>
      ) : null}
    </div>
  );
};

/** A rectangle of a source (video/image) at its own place in source space, used for lift-outs. */
export const Crop: React.FC<{
  x: number;
  y: number;
  w: number;
  h: number;
  srcW: number;
  srcH: number;
  z?: number;
  s?: number;
  rx?: number;
  ry?: number;
  o?: number;
  glow?: number;
  radius?: number;
  children: React.ReactNode;
}> = ({x, y, w, h, srcW, srcH, z = 0, s = 1, rx = 0, ry = 0, o = 1, glow = 0, radius = 16, children}) => (
  <div
    style={{
      position: 'absolute',
      left: x,
      top: y,
      width: w,
      height: h,
      overflow: 'hidden',
      borderRadius: radius,
      opacity: o,
      transform: `translateZ(${z}px) rotateX(${rx}deg) rotateY(${ry}deg) scale(${s})`,
      boxShadow: `0 ${40 * glow}px ${100 * glow}px rgba(0,0,0,${0.6 * glow}), 0 0 0 ${2 * glow}px rgba(170,130,255,${0.85 * glow}), 0 0 ${70 * glow}px rgba(135,56,245,${0.55 * glow})`,
    }}
  >
    <div style={{position: 'absolute', left: -x, top: -y, width: srcW, height: srcH}}>{children}</div>
  </div>
);

/** A recording clip placed on the parent timeline (OffthreadVideo renders exact frames as images). */
export const Clip: React.FC<{src: string; from?: number; dur?: number; trimBefore?: number; playbackRate?: number; style?: React.CSSProperties}> = ({src, from = 0, dur, trimBefore, playbackRate, style}) => (
  <Sequence from={from} durationInFrames={dur} layout="none">
    <OffthreadVideo src={staticFile(src)} muted trimBefore={trimBefore} playbackRate={playbackRate} style={style} />
  </Sequence>
);

/** One frame of a clip, held. Frames come from the uploaded clips (media.tsv) instead of image files in git. */
export const Still: React.FC<{src: string; frame: number; style?: React.CSSProperties}> = ({src, frame, style}) => (
  <Freeze frame={frame}>
    <OffthreadVideo src={staticFile(src)} muted style={style} />
  </Freeze>
);

/* ---------- camera + transition FX ---------- */
/** A 2D camera over a whole scene (zoom / roll / shake / blur). Sits outside the perspective layer, so 3D lifts survive. */
export const Cam: React.FC<{s?: number; x?: number; y?: number; r?: number; blur?: number; o?: number; ox?: number; oy?: number; children: React.ReactNode}> = ({s = 1, x = 0, y = 0, r = 0, blur = 0, o = 1, ox = 960, oy = 540, children}) => (
  <AbsoluteFill
    style={{
      opacity: o,
      transformOrigin: `${ox}px ${oy}px`,
      transform: `translate(${x}px, ${y}px) rotate(${r}deg) scale(${s})`,
      filter: blur > 0.05 ? `blur(${blur}px)` : undefined,
    }}
  >
    {children}
  </AbsoluteFill>
);

/** A light burst that peaks at frame `at` and hides a cut. */
export const Flash: React.FC<{at: number; len?: number; x: number; y: number; max?: number}> = ({at, len = 10, x, y, max = 1}) => {
  const f = useCurrentFrame();
  const o = ip(f, [at - len * 0.5, at], [0, 1], IN) * ip(f, [at, at + len], [1, 0], OUT) * max;
  if (o <= 0.001) return null;
  return (
    <AbsoluteFill
      style={{
        opacity: o,
        background: `radial-gradient(circle at ${x}px ${y}px, rgba(255,255,255,1) 0%, rgba(232,220,255,.95) ${8 + 22 * o}%, rgba(160,110,255,.7) ${30 + 30 * o}%, rgba(135,56,245,.25) ${60 + 30 * o}%, rgba(135,56,245,0) 100%)`,
      }}
    />
  );
};

/** Speed streaks flying out of a vanishing point: sells a hard push forward. */
export const Streaks: React.FC<{at: number; dur: number; x: number; y: number; n?: number; seed?: string; max?: number}> = ({at, dur, x, y, n = 56, seed = 's', max = 1}) => {
  const f = useCurrentFrame();
  const t = (f - at) / dur;
  if (t <= 0 || t >= 1) return null;
  const env = Math.sin(Math.PI * t) * max;
  return (
    <svg width={1920} height={1080} style={{position: 'absolute', left: 0, top: 0, mixBlendMode: 'screen'}}>
      {Array.from({length: n}, (_, i) => {
        const a = random(`${seed}a${i}`) * Math.PI * 2;
        const sp = 0.55 + random(`${seed}v${i}`) * 0.9;
        const r0 = 60 + random(`${seed}r${i}`) * 420;
        const head = r0 + 2300 * sp * Math.pow(t, 1.5);
        const len = 80 + 1100 * sp * t;
        const tail = Math.max(r0 * 0.6, head - len);
        const c = Math.cos(a);
        const sn = Math.sin(a);
        const lav = random(`${seed}c${i}`) > 0.55;
        return (
          <line
            key={i}
            x1={x + c * tail}
            y1={y + sn * tail}
            x2={x + c * head}
            y2={y + sn * head}
            stroke={lav ? '#C9AEFF' : '#fff'}
            strokeWidth={1.2 + random(`${seed}w${i}`) * 4.2}
            strokeLinecap="round"
            opacity={env * (0.35 + 0.65 * random(`${seed}o${i}`))}
          />
        );
      })}
    </svg>
  );
};

/* ---------- Genjutsu-style motion: directional motion blur, whip pushes, wipe text, scanline ---------- */
/** Directional (x / y) motion blur. The SVG filter sits beside the content, not inside it. */
export const MBlur: React.FC<{id: string; x?: number; y?: number; style?: React.CSSProperties; children: React.ReactNode}> = ({id, x = 0, y = 0, style, children}) => {
  const on = x > 0.4 || y > 0.4;
  return (
    <>
      {on ? (
        <svg width={0} height={0} style={{position: 'absolute'}}>
          <defs>
            <filter id={id} x="-25%" y="-25%" width="150%" height="150%" colorInterpolationFilters="sRGB">
              <feGaussianBlur stdDeviation={`${x.toFixed(2)} ${y.toFixed(2)}`} />
            </filter>
          </defs>
        </svg>
      ) : null}
      <AbsoluteFill style={{...style, filter: on ? `url(#${id})` : undefined}}>{children}</AbsoluteFill>
    </>
  );
};

/** Horizontal whip push. Outgoing scene accelerates off to the left; incoming one arrives from the right and brakes hard.
 *  Returns the x offset and the matching blur for frame f. */
export const whipOut = (f: number, at: number, dur = 9, dist = 2300) => {
  const x = (t: number) => -dist * ip(t, [at, at + dur], [0, 1], IN);
  return {x: x(f), blur: Math.min(70, Math.abs(x(f) - x(f - 1)) * 0.22)};
};
export const whipIn = (f: number, at: number, dur = 14, dist = 2300) => {
  const x = (t: number) => dist * (1 - ip(t, [at, at + dur], [0, 1], OUT));
  return {x: x(f), blur: Math.min(70, Math.abs(x(f) - x(f - 1)) * 0.22)};
};

/** One line of condensed uppercase text revealed by a left-to-right wipe (a dim ghost runs ahead of the solid edge).
 *  `rise` = the line slides up out of a mask instead. Exit = a fast slide left with blur. */
export const Wipe: React.FC<{
  text: string;
  at: number;
  out?: number;
  dur?: number;
  size: number;
  wght?: number;
  wdth?: number;
  color?: string;
  mode?: 'wipe' | 'rise';
  style?: React.CSSProperties;
}> = ({text, at, out, dur = 12, size, wght = 800, wdth = 72, color = '#fff', mode = 'wipe', style}) => {
  const f = useCurrentFrame();
  const p = ip(f, [at, at + dur], [0, 1], OUT);
  const o = out == null ? 0 : ip(f, [out, out + 7], [0, 1], IN);
  if (o >= 1) return <div style={{height: size * 0.95, ...style}} />;
  const base: React.CSSProperties = {...cond(wght, wdth), fontSize: size, lineHeight: 0.95, whiteSpace: 'pre', color, letterSpacing: -0.01 * size};
  const exit: React.CSSProperties = {
    translate: `${-o * 320}px 0`,
    opacity: 1 - o,
    filter: o > 0 ? `blur(${o * 14}px)` : undefined,
  };
  if (mode === 'rise') {
    return (
      <div style={{overflow: 'hidden', paddingBottom: size * 0.06, marginBottom: -size * 0.06, ...style}}>
        <div style={{...base, ...exit, translate: `${-o * 320}px ${(1 - p) * 105}%`, opacity: f < at ? 0 : 1 - o}}>{text}</div>
      </div>
    );
  }
  const edge = -40 + p * 154; // percent (fully hidden at p = 0, ghost included)
  const solid = `linear-gradient(90deg, #000 ${edge}%, transparent ${edge + 10}%)`;
  const ghost = `linear-gradient(90deg, #000 ${edge + 14}%, transparent ${edge + 26}%)`;
  return (
    <div style={{position: 'relative', ...style}}>
      <div style={{...base, ...exit, translate: `${(1 - p) * -30 - o * 320}px 0`}}>
        <div style={{WebkitMaskImage: solid, maskImage: solid}}>{text}</div>
        <div style={{position: 'absolute', left: 0, top: 0, opacity: 0.3, WebkitMaskImage: ghost, maskImage: ghost}}>{text}</div>
      </div>
    </div>
  );
};

/** Stacked two-weight label: light line(s) + bold line(s), staggered. */
export const Label: React.FC<{
  lines: {t: string; bold?: boolean; size?: number; color?: string}[];
  at: number;
  out?: number;
  x: number;
  y: number;
  size: number;
  align?: 'left' | 'center';
  wdth?: number;
}> = ({lines, at, out, x, y, size, align = 'left', wdth = 72}) => (
  <div style={{position: 'absolute', left: align === 'center' ? 0 : x, width: align === 'center' ? 1920 : undefined, top: y, display: 'flex', flexDirection: 'column', alignItems: align === 'center' ? 'center' : 'flex-start'}}>
    {lines.map((l, i) => (
      <Wipe key={i} text={l.t} at={at + i * 4} out={out == null ? undefined : out + i * 2} size={l.size ?? size} wght={l.bold ? 860 : 300} wdth={wdth} color={l.color ?? (l.bold ? '#fff' : '#d9d0ee')} />
    ))}
  </div>
);

/** A glowing light line (white core, pink/lavender halo) used to sweep a conversion across something. */
export const ScanLine: React.FC<{y: number; w: number; o?: number; x?: number}> = ({y, w, o = 1, x = 0}) => (
  <div style={{position: 'absolute', left: x, top: y - 40, width: w, height: 80, opacity: o, pointerEvents: 'none'}}>
    <div style={{position: 'absolute', left: 0, right: 0, top: 22, height: 36, background: 'linear-gradient(180deg, transparent, rgba(248,58,174,.55), rgba(185,150,255,.75), rgba(248,58,174,.55), transparent)', filter: 'blur(8px)'}} />
    <div style={{position: 'absolute', left: 0, right: 0, top: 38, height: 4, borderRadius: 2, background: 'linear-gradient(90deg, rgba(255,255,255,0), #fff 12%, #fff 88%, rgba(255,255,255,0))', boxShadow: '0 0 18px 4px rgba(255,255,255,.8)'}} />
  </div>
);

/* ---------- v11: ALFA's mark, node glow, wake typing, corner labels, blur settle ---------- */
export const WAKE = '#8337F1'; // the Generate purple: only on ALFA's actions
export type Pt = {at: number; x: number; y: number};

/** Where ALFA's mark is at frame f along timed points (eased hops), plus a short trail of past positions. */
export const markAt = (f: number, pts: Pt[]) => {
  const pos = (t: number) => {
    if (t <= pts[0].at) return {x: pts[0].x, y: pts[0].y};
    for (let i = 1; i < pts.length; i++) {
      if (t <= pts[i].at) {
        const p = ip(t, [pts[i - 1].at, pts[i].at], [0, 1], INOUT);
        return {x: pts[i - 1].x + (pts[i].x - pts[i - 1].x) * p, y: pts[i - 1].y + (pts[i].y - pts[i - 1].y) * p};
      }
    }
    const l = pts[pts.length - 1];
    return {x: l.x, y: l.y};
  };
  const {x, y} = pos(f);
  const trail: [number, number][] = [1, 2, 3, 4].map((k) => {
    const q = pos(f - k);
    return [q.x, q.y];
  });
  return {x, y, trail};
};

/** ALFA's real mark (the FE favicon) as a small glowing object with a soft trail: the thread through the video. */
export const Mark: React.FC<{x: number; y: number; trail?: [number, number][]; o?: number; s?: number}> = ({x, y, trail = [], o = 1, s = 1}) => (
  <>
    {trail.map(([tx, ty], i) =>
      Math.hypot(tx - x, ty - y) < 2 ? null : (
        <div key={i} style={{position: 'absolute', left: tx - 10, top: ty - 10, width: 20, height: 20, borderRadius: '50%', background: 'rgba(160,110,255,.6)', filter: 'blur(4px)', opacity: o * (0.55 - i * 0.12), scale: String(s * (1 - i * 0.16))}} />
      ),
    )}
    <div style={{position: 'absolute', left: x - 20, top: y - 20, width: 40, height: 40, borderRadius: '50%', opacity: o, scale: String(s), background: '#17131f', boxShadow: '0 0 0 1.5px rgba(200,170,255,.9), 0 0 28px 8px rgba(131,55,241,.75), 0 0 80px 30px rgba(131,55,241,.3)'}}>
      <Img src={staticFile('alfa-mark.png')} style={{position: 'absolute', left: 7, top: 7, width: 26, height: 26}} />
    </div>
  </>
);

/** A node lights up in the Generate purple when ALFA's mark reaches it, then decays (exponential). */
export const NodeGlow: React.FC<{x: number; y: number; w: number; h: number; at: number; r?: number}> = ({x, y, w, h, at, r = 8}) => {
  const f = useCurrentFrame();
  if (f < at) return null;
  const o = ip(f, [at, at + 3], [0, 1]) * Math.exp(-Math.max(0, f - at - 3) / 9);
  if (o < 0.02) return null;
  return <div style={{position: 'absolute', left: x - 2, top: y - 2, width: w + 4, height: h + 4, borderRadius: r, opacity: o, boxShadow: `0 0 0 2px ${WAKE}, 0 0 24px 4px rgba(131,55,241,.7)`, pointerEvents: 'none'}} />;
};

/** A prompt typed at ~24 cps; the newest letters are in the Generate purple and cool to the text colour (accent-typed-prompt). */
export const WakeType: React.FC<{text: string; at: number; cps?: number; size: number; color?: string; font?: string; style?: React.CSSProperties}> = ({
  text,
  at,
  cps = 24,
  size,
  color = '#e6e6ea',
  font = "'Adwaita Sans', Inter, system-ui, sans-serif",
  style,
}) => {
  const f = useCurrentFrame();
  const per = 30 / cps;
  return (
    <div style={{position: 'absolute', fontFamily: font, fontSize: size, whiteSpace: 'pre', ...style}}>
      {[...text].map((ch, i) => {
        const age = f - (at + i * per);
        if (age < 0) return null;
        return (
          <span key={i} style={{color: interpolateColors(age, [0, 5], ['#B98CFF', color]), textShadow: age < 5 ? `0 0 ${10 * (1 - age / 5)}px rgba(131,55,241,.9)` : undefined}}>
            {ch}
          </span>
        );
      })}
    </div>
  );
};

/** One small label per shot, bottom left, typed on letter by letter and erased from the end before the cut (corner-type-labels). */
export const CornerLabel: React.FC<{text: string; at: number; out?: number; per?: number; x?: number; bottom?: number; size?: number}> = ({text, at, out, per = 2.5, x = 72, bottom = 64, size = 54}) => {
  const f = useCurrentFrame();
  const shown = Math.min(text.length, Math.max(0, Math.floor((f - at) / per) + 1));
  const gone = out == null ? 0 : Math.max(0, Math.floor((f - out) / (per * 0.6)) + 1);
  const n = Math.max(0, shown - gone);
  if (f < at || n === 0) return null;
  return (
    <div style={{position: 'absolute', left: x, bottom, ...cond(860, 100), fontSize: size, letterSpacing: 0.5, color: '#fff', whiteSpace: 'pre', textShadow: '0 2px 18px rgba(0,0,0,.55), 0 0 2px rgba(0,0,0,.4)'}}>
      {text.slice(0, n)}
    </div>
  );
};

/** Hard cut + blur settle: the incoming content arrives blurred and a little low, and is sharp within ~0.3 s. */
export const Settle: React.FC<{children: React.ReactNode; dur?: number}> = ({children, dur = 9}) => {
  const f = useCurrentFrame();
  const p = ip(f, [0, dur], [0, 1], OUT);
  return <AbsoluteFill style={{filter: p < 1 ? `blur(${(1 - p) * 8}px)` : undefined, translate: `0 ${(1 - p) * 14}px`}}>{children}</AbsoluteFill>;
};

/*
 * v11b "fast and punchy" (transitions/whip-pan-cut.md, ui-punch-in-cut.md).
 * Pan: whip-pan cut inside the footage. A shot opens mid-pan (3 frames of heavy horizontal smear, over-exposed,
 * moving left into place) and/or leaves on one (its last 2 frames smear on to the left). Both halves pan the
 * same way, so back-to-back scenes read as one whip.
 */
export const Pan: React.FC<{id: string; dur: number; inn?: boolean; out?: boolean; children: React.ReactNode}> = ({id, dur, inn = true, out = true, children}) => {
  const f = useCurrentFrame();
  const pi = inn ? ip(f, [0, 3], [1, 0]) : 0;
  const po = out ? ip(f, [dur - 2, dur - 0.01], [0, 1]) : 0;
  const k = Math.max(pi, po);
  return (
    <MBlur id={id} x={60 * k} style={{translate: `${160 * pi - 160 * po}px 0`}}>
      <AbsoluteFill style={{filter: k > 0.01 ? `brightness(${1 + 0.6 * k})` : undefined}}>{children}</AbsoluteFill>
    </MBlur>
  );
};

/** ui-punch-in-cut: a one-frame jump in scale at `cut` (no zoom frames, no blur); the drift runs straight through. */
export const punch = (f: number, cut: number, k = 1.9) => (f >= cut ? k : 1);

/** A word that hits big in the middle of the frame and holds for a moment, then cuts out. "ALFA" takes the lavender. */
export const Slam: React.FC<{text: string; at: number; dur?: number; size?: number}> = ({text, at, dur = 16, size = 150}) => {
  const f = useCurrentFrame();
  if (f < at || f >= at + dur) return null;
  const s = ip(f, [at, at + 3], [1.16, 1], OUT);
  return (
    <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', background: 'radial-gradient(ellipse 60% 42% at 50% 50%, rgba(8,6,14,.55), transparent 75%)'}}>
      <div style={{...cond(900, 72), fontSize: size, lineHeight: 0.92, color: '#fff', textAlign: 'center', letterSpacing: -1, scale: String(s), textShadow: '0 10px 50px rgba(0,0,0,.55)', whiteSpace: 'pre'}}>
        {text.split(/(ALFA)/).map((w, i) => (
          <span key={i} style={w === 'ALFA' ? {color: C.lav} : undefined}>{w}</span>
        ))}
      </div>
    </AbsoluteFill>
  );
};
