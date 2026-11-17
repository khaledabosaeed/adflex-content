---
name: "Light-bar scramble title"
slug: "scramble-bar-title"
type: "graphics"
fits: [hero, ad, social]
source: "Higgsfield Black Friday card (4.5 s, 16:9, silent): https://static-public-media.higgsfield.ai/cards/576e5edf-d90f-40cb-9fe4-f6432f6e76b3.mp4 · page https://higgsfield.ai/pricing"
used_in: []
---

# Light-bar scramble title

## What it looks like
On black, the logo glows like a lit filament with a thin line hanging under it. The line snaps out sideways into an outlined bar, the bar floods with neon colour, and then the bar breaks into letters that scramble through random glyphs until they lock into the headline. A second word is revealed by a wipe, a small line fades up under it, and four-pointed sparkles pop around it and twinkle. A complete title or offer card in about 2 s.

## Breakdown
- **Text and graphics:**
  1. 0–0.17 s: the logo mark glows lime with a soft halo. A thin vertical line under it.
  2. 0.17–0.33 s: the line flips into a thin outlined rectangle and stretches horizontally, with motion blur, to the full title width.
  3. 0.33 s: the bar fills solid lime. White sparkles pop in at its corners (scale 0 → 1 with overshoot).
  4. 0.17–0.70 s: the wordmark above it assembles letter by letter, each letter flickering through 2–3 wrong glyphs.
  5. 0.70–1.10 s: the bar dissolves from its right end into the headline. Letters scramble (mirrored and random glyphs, gaps) and lock in left to right.
  6. 1.25 s: a second word ("SALE") wipes in inside a lime box.
  7. 1.50–1.75 s: a sub-line ("UP TO 65% OFF") fades in from blur with a small sparkle bullet.
  8. A glow sweeps across the headline once. The sparkles twinkle (rotate and scale ±10 %) for the rest of the hold.
- **Font:** heavy italic grotesk, uppercase, tight. Neon lime on black and black text in the lime box.
- **Sound cues:** an electric hum, a snap on the bar, a digital chatter under the scramble, and a chime on the lock.

## How to make it
- **Model:** none.
- **Edit recipe (Remotion):**
  - The bar is a `div` (`scaleX` from 0 to 1 on `ip(..., OUT)` over 0.15 s with `MBlur`).
  - The scramble: per letter, for frames before its lock time show `random(seed + frame)` picked from a glyph set, then the real letter. Lock times are staggered about 0.03 s.
  - The wipe word is `Wipe` from `lib.tsx`.
  - The sparkles are SVG four-point stars on the house spring.

## Watch out for
- Arabic letters connect, so a per-letter scramble breaks the shaping. For Arabic, scramble whole words, or scramble only the Latin parts (prices, "AdFlex").
- AdFlex version: the bar in the Generate purple gradient (#8337F1 → #6730D4), the sparkles in the brand sparkle gradient (#C95AC5 → #55AAFF). AdFlex's own logo already has sparkles, so this fits the brand well.
- Good for offer or launch cards and end cards. Don't stack it with another big title move.

## Examples
- Reference only so far. Related title: [glitch-split-whip](glitch-split-whip.md).
