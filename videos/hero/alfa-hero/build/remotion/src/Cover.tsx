/*
 * Covers for the ALFA video, in the style of the team's Genjutsu cover (2026-11-20):
 * full-bleed photo, purple "AdFlex | ALFA" pill top-left, a two-line heavy italic headline (white, then a violet → pink
 * gradient) and a short yellow line under it.
 * Photo: A3 "Leen rides the DUNE crest" (assets.md), read from its CDN link and cropped here (no image copy in the repo).
 * AlfaCover (1080x1920) and AlfaCoverWide (1920x1080) share one layout; only the numbers in SPEC differ.
 * Render: npx remotion still <bundle> AlfaCover ../../renders/alfa-hero-cover-v1.png
 *         npx remotion still <bundle> AlfaCoverWide ../../renders/alfa-hero-cover-wide-v1.png
 */
import React from 'react';
import {AbsoluteFill, Img, staticFile} from 'remotion';
import {loadFont} from '@remotion/fonts';

loadFont({family: 'ArchivoV', url: staticFile('Archivo-var.ttf'), weight: '100 900'});

const PHOTO = 'https://cdn-dev.adflex.ai/ai-content/images/981bba4e-da60-4b70-96ba-e27c0ea3da2a.jpg'; // A3, 1536x864
const SRC_W = 1536, SRC_H = 864;

const heavy = (size: number): React.CSSProperties => ({
  fontFamily: 'ArchivoV, sans-serif',
  fontWeight: 900,
  fontVariationSettings: "'wght' 900, 'wdth' 125",
  fontSize: size,
  lineHeight: 1,
  letterSpacing: '-0.01em',
  whiteSpace: 'pre',
});

export const COVER = {
  badge: 'ALFA',
  line1: 'SAME DESK.',
  line2: 'NEW WORLD.',
  sub: 'ONE PROMPT TO ALFA',
};

type Spec = {
  k: number; // source px -> cover px
  photoX: number; // photo left edge in cover px
  photoY: number;
  shades: string[]; // legibility gradients, bottom to top
  pill: {left: number; top: number; scale: number};
  head: {left: number; top: number; size: number; sub: number};
};

const SPEC: Record<'tall' | 'wide', Spec> = {
  // 9:16: a 486 px wide window of the photo starting at source x 505 (she sits in the middle of it)
  tall: {
    k: 1920 / SRC_H,
    photoX: -505 * (1920 / SRC_H),
    photoY: 0,
    shades: [
      'linear-gradient(180deg, rgba(0,0,0,0) 48%, rgba(20,8,30,.38) 64%, rgba(10,4,16,.55) 100%)',
      'linear-gradient(180deg, rgba(10,4,16,.28) 0%, rgba(0,0,0,0) 18%)',
    ],
    pill: {left: 78, top: 205, scale: 1},
    head: {left: 74, top: 1190, size: 104, sub: 46},
  },
  // 16:9: the whole photo, zoomed 1.2x and pushed right so Leen sits right of centre and the copy gets the left side
  wide: {
    k: 1.2 * (1920 / SRC_W),
    photoX: -40,
    photoY: -40,
    shades: [
      'linear-gradient(90deg, rgba(10,4,16,.62) 0%, rgba(14,6,22,.42) 34%, rgba(0,0,0,0) 58%)',
      'linear-gradient(180deg, rgba(0,0,0,0) 55%, rgba(10,4,16,.35) 100%)',
    ],
    pill: {left: 84, top: 78, scale: 0.86},
    head: {left: 84, top: 300, size: 88, sub: 40},
  },
};

const Layout: React.FC<{s: Spec}> = ({s}) => (
  <AbsoluteFill style={{background: '#120a06', overflow: 'hidden'}}>
    <Img src={PHOTO} style={{position: 'absolute', left: s.photoX, top: s.photoY, width: SRC_W * s.k, height: SRC_H * s.k}} />
    {/* keep the headline readable over the bright sand and the white bike */}
    {s.shades.map((bg) => (
      <AbsoluteFill key={bg} style={{background: bg}} />
    ))}

    {/* AdFlex | ALFA pill */}
    <div
      style={{
        position: 'absolute',
        left: s.pill.left,
        top: s.pill.top,
        transform: `scale(${s.pill.scale})`,
        transformOrigin: '0 0',
        height: 92,
        display: 'flex',
        alignItems: 'center',
        gap: 22,
        padding: '0 34px 0 30px',
        borderRadius: 18,
        background: 'linear-gradient(180deg, #7B3BF5 0%, #6427E6 100%)',
        border: '3px solid rgba(190,160,255,.85)',
        boxShadow: '0 0 34px rgba(124,58,237,.65), 0 10px 30px rgba(0,0,0,.25)',
      }}
    >
      <Img src={staticFile('adflex-logo.png')} style={{height: 37, width: (37 * 1820) / 524, filter: 'brightness(0) invert(1)'}} />
      <div style={{width: 3, height: 50, background: 'rgba(255,255,255,.8)', borderRadius: 2}} />
      <div style={{...heavy(46), color: '#fff', transform: 'skewX(-9deg)', marginTop: 2}}>{COVER.badge}</div>
    </div>

    {/* headline */}
    <div style={{position: 'absolute', left: s.head.left, top: s.head.top, transform: 'skewX(-9deg)', transformOrigin: '0 100%'}}>
      <div style={{...heavy(s.head.size), color: '#fff', textShadow: '0 6px 26px rgba(0,0,0,.35)'}}>{COVER.line1}</div>
      <div style={{filter: 'drop-shadow(0 6px 22px rgba(30,0,60,.45))', marginTop: 14}}>
        <div
          style={{
            ...heavy(s.head.size),
            backgroundImage: 'linear-gradient(90deg, #6D35F2 0%, #9B5CFF 40%, #D28BF0 72%, #FFB3D9 100%)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            color: 'transparent',
            paddingRight: 12,
          }}
        >
          {COVER.line2}
        </div>
      </div>
      <div style={{display: 'flex', alignItems: 'center', gap: 16, marginTop: 34}}>
        <div style={{...heavy(s.head.sub), color: '#FFC21A', textShadow: '0 4px 18px rgba(0,0,0,.35)'}}>{COVER.sub}</div>
        {/* down arrow in place of the reference's 👇 */}
        <svg
          width={(40 * s.head.sub) / 46}
          height={(48 * s.head.sub) / 46}
          viewBox="0 0 40 48"
          style={{transform: 'skewX(9deg)', filter: 'drop-shadow(0 4px 10px rgba(0,0,0,.35))'}}
        >
          <path d="M20 4 V38 M7 26 L20 40 L33 26" fill="none" stroke="#FFC21A" strokeWidth={7} strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    </div>
  </AbsoluteFill>
);

export const AlfaCover: React.FC = () => <Layout s={SPEC.tall} />;
export const AlfaCoverWide: React.FC = () => <Layout s={SPEC.wide} />;
