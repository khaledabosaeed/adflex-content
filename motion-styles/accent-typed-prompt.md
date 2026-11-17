---
name: "Accent-typed prompt"
slug: "accent-typed-prompt"
type: "graphics"
fits: [hero, ad, social]
source: "Higgsfield Fable 5.2 × Higgsfield MCP card, 4.63–5.85 s: https://static-public-media.higgsfield.ai/cards/b7c76e0d-2ca5-431e-b1ee-4b2ecc3bf984.mp4 · page https://higgsfield.ai/mcp?tab=claude"
used_in: []
---

# Accent-typed prompt

## What it looks like
A chat input box, big and centred. A prompt types into it, and the newest letters appear in a warm accent colour and cool to black as the next ones arrive, so a coloured "wake" runs behind the caret. Halfway through, the camera hops sideways to keep up with the text. Under the input, the model chip ("Fable 5.2 · Claude") shows where it's running.

## Breakdown
- **Text and graphics:**
  - The first half of the prompt ("Create game of the year") is already there at the cut. The rest types at about one character per frame (24 cps).
  - The last 3–4 characters are orange-red, fading to the text colour over about 0.15 s.
  - The input box is white with a soft shadow on an off-white background. The model chip sits at the bottom left.
- **Camera:**
  - A slow drift toward the bottom right.
  - 0.17 s after the typing starts, a quick hop left and up (about 15 % of the frame, 3 frames with motion blur) to re-frame on the text.
  - Then the drift continues.
- **Cuts and timing:** about 1.2 s on screen. It ends when the last word lands, without waiting for a Send click.
- **Sound cues:** soft key clicks, faster than real typing.

## How to make it
- **Model:** none.
- **Edit recipe (Remotion):**
  - `Typed` with `per` set so it types about 24 characters per second.
  - The accent wake: colour each glyph by its age, `interpolateColors(f − (at + i·per), [0, 4], [accent, text])`.
  - The camera hop: `Cam` with `x/y` on an `ip(..., INOUT)` over 0.12 s plus `MBlur`.
  - Ideally, the box is the real AdFlex or Claude input from a recording, with the prompt typed over a cleared field.
- **Out of it:** [shockwave-rings](../transitions/shockwave-rings.md) on a "connect" toggle, or [button-to-player-morph](../transitions/button-to-player-morph.md) on Send.

## Watch out for
- Arabic types right to left. The wake runs leftward and the camera hop goes right.
- Keep the prompt short enough to fit on one line at that size, or the hop has to happen twice.
- AdFlex version: the wake in the Generate purple (#8337F1), and the chip shows the real model name.

## Examples
- Related: Bloom's caret type-on (`videos/hero/bloom-hero/production.md`, "Prompt beat").
