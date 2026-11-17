---
name: "Chroma flip-in"
slug: "chroma-flip"
type: "transition"
fits: [hero, ad, social]
source: "Higgsfield Short Drama Studio card, 6.20–6.87 s: https://static-public-media.higgsfield.ai/cards/788c93dc-a6fc-42f7-924d-949b2aae8a51.mp4 · page https://higgsfield.ai/short-drama"
used_in: []
---

# Chroma flip-in

## What it looks like
The current screen whips off to the left. A result (a poster or a generated image) swings in on its Y axis like a card being turned over, split into cyan and magenta copies that slide back together as it flattens. When it lands, it snaps into its true colours. It's the "here's the result" beat.

## Breakdown
- **Transitions (Short Drama: "Splitting into episodes" → series page):**
  1. 6.20–6.45 s: a lime progress line finishes, and the list under it smears left with horizontal blur.
  2. 6.49 s: the poster appears already turned about 60° on Y, small, with a strong RGB split (cyan offset left, magenta right, about 4 % of its width).
  3. 6.49–6.87 s: it turns flat and grows to its place. The split closes to zero and the colours go from duotone to true over the last 0.15 s.
  4. From 6.66 s: the page around it (title, tags, buttons) types and fades in.
- **Grade and texture:** during the flip the poster is a cyan/magenta duotone. The true colours arrive only when it's flat.
- **Sound cues:** a short glitch zap at the start and a soft thud on the landing.

## How to make it
- **Model:** none. The poster is a still or a generated image.
- **Edit recipe (Remotion):**
  - Rotation: `UIWindow` (or a plain `div` in a `perspective: 1400px` parent), `ry` from 60° to 0 on the house spring.
  - RGB split: render the image three times. Use the red channel and the blue-green channels via an SVG `feColorMatrix`, with `mix-blend-mode: screen`, offset `±k·(1 − p)` px.
  - Duotone → colour: crossfade from a duotone copy to the original over the last 0.15 s.
  - Outgoing screen: `whipOut`.

## Watch out for
- RGB split on a whole full-frame clip looks cheap. Use it only on the one object that arrives.
- Once per video. It's a reveal, not a cut style.
- AdFlex version: split into the sparkle colours (#F83AAE pink and #55AAFF blue) instead of cyan and magenta.

## Examples
- Reference only so far.
