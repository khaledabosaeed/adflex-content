---
name: "Blur-out → comet chips"
slug: "comet-chips"
type: "transition"
fits: [hero, ad]
source: "Higgsfield Short Drama Studio card, 3.42–4.25 s: https://static-public-media.higgsfield.ai/cards/788c93dc-a6fc-42f7-924d-949b2aae8a51.mp4 · page https://higgsfield.ai/short-drama"
used_in: []
---

# Blur-out → comet chips

## What it looks like
The finished step blurs away into black. Then small coloured chips (names, tags, keywords) streak in from off-screen like comets with long blurred tails and land inside an empty panel that fades up behind them. It shows the AI "pulling the pieces in" before the next result.

## Breakdown
- **Transitions (Short Drama: "Style ✓" → "Analyzing the script"):**
  1. 3.42–3.63 s: the selected cards scale down to about 90 %, blur and fade to nothing.
  2. 3.63–3.75 s: about 0.1 s of near-black. Only the fixed lockup at the bottom stays.
  3. From 3.76 s: chips fly in one at a time, about 0.08 s apart, each from a different screen edge. Each has a horizontal tail 3–5× its own width, and the tail shrinks as the chip brakes.
  4. At the same time, the panel ("Analyzing the script", a progress line, an empty "Series global context" box) fades in from blur over about 0.3 s.
  5. 4.25 s on: the chips settle into the text. They become the highlighted names inside a paragraph that types itself.
- **Text and graphics:** each chip is a pill in its own colour (pink, amber, blue, green) with an uppercase label.
- **Sound cues:** a soft tick or zip per chip, slightly pitched up each time.

## How to make it
- **Model:** none.
- **Edit recipe (Remotion):**
  - Blur-out: `opacity` and `filter: blur()` on the outgoing group, `scale` from 1 to 0.9, all `ease-in` over 0.2 s (the house exit).
  - Chips: per chip, a start point off-screen and an end point in the panel. Animate with `ip(..., OUT)` over 0.35–0.45 s, staggered by no more than 0.05–0.08 s. Use `MBlur` with `x` set from the per-frame speed (as `whipIn` does) for the tail.
  - Panel: `Typed` for the paragraph. The chips' end points are the positions of the highlighted words.

## Watch out for
- The chips must land on words that really appear in the result (real names, real tags from the real run). Made-up UI is against house taste.
- Keep it to 4–6 chips. More reads as noise.
- AdFlex version: chips in the brand colours (#F83AAE, #9848FE, #3292FF, #55AAFF). For ALFA, the chips can be the brand facts ALFA pulls in (product, audience, tone).

## Examples
- Reference only so far.
