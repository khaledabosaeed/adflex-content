---
name: "Hard cut + blur settle"
slug: "hard-cut-blur-settle"
type: "transition"
fits: [hero, ad, social]
source: "Higgsfield Fable 5.2 × Higgsfield MCP card, cuts at 2.03 s, 4.63 s and 6.98 s: https://static-public-media.higgsfield.ai/cards/b7c76e0d-2ca5-431e-b1ee-4b2ecc3bf984.mp4 · page https://higgsfield.ai/mcp?tab=claude"
used_in: []
---

# Hard cut + blur settle

## What it looks like
A plain hard cut, often between opposite looks (dark title → white page, white UI → game footage). On the new side, the content doesn't just sit there: the words or the card arrive with motion blur and settle into focus within a third of a second. The cut is clean and the motion lives in the content. It's the calmest of these transitions, and the default.

## Breakdown
- **Cuts and timing (Fable MCP):**
  - 2.03 s: dark cinematic title → off-white page with a soft lime/pink gradient. The new words blur in vertically and are sharp by 2.30 s (about 0.3 s).
  - 4.63 s: model list → prompt box. The box is already there, and the typing starts 0.15 s after the cut.
  - 6.98 s: the toggle card → game footage, already in motion.
- **Transitions:** the incoming text has `blur` 8 → 0 px and a small rise of 4–6 % of its size, on the house spring. Nothing on the outgoing side.
- **Sound cues:** cut on a beat. No whoosh needed.

## How to make it
- **Model:** none.
- **Edit recipe (Remotion):** `TransitionSeries` with no transition (or plain `Sequence`s). `Typed` with a small `per` already does the blur-rise per glyph. For a block, use `opacity`, `filter: blur()` and `translate` on `springAt`.

## Watch out for
- Pick cuts where the brightness or palette changes a lot. That contrast is what makes a hard cut feel deliberate.
- Hero videos default to hard cuts (`lessons/editing.md`). This is the house-safe choice when unsure.

## Examples
- bloom-hero v4: hard cuts between all shots (without the blur settle).
