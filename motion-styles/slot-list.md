---
name: "Slot-machine list"
slug: "slot-list"
type: "graphics"
fits: [hero, ad, social]
source: "Higgsfield Fable 5.2 × Higgsfield MCP card, 2.03–4.63 s: https://static-public-media.higgsfield.ai/cards/b7c76e0d-2ca5-431e-b1ee-4b2ecc3bf984.mp4 · page https://higgsfield.ai/mcp?tab=claude"
used_in: []
---

# Slot-machine list

## What it looks like
A vertical list of names (models, features, platforms) scrolls upward like a slot-machine reel. The item in the middle is big, bold and in a gradient colour. The ones above and below get smaller and fade with distance. To the right, a fixed phrase finishes the sentence: "**Seedance 2.5** | is free and unlimited to try". It turns a long list into one line that keeps changing.

## Breakdown
- **Text and graphics:**
  - The middle item is about 2× the size of its neighbours, in a gradient (purple, then pink, then blue as items change). The rest are dark grey, then light grey, then almost invisible.
  - The fixed phrase sits right of the reel, in black, small, three lines. Its last word types on with a lime highlight that wipes over it.
- **Cuts and timing:**
  - The reel steps about every 0.5–0.7 s. Each step is a fast scroll of one row (about 0.15 s) with vertical motion blur, then a hold.
  - Every second or third step it jumps two rows at once, which keeps the rhythm from being mechanical.
  - About 9 items in 2.6 s.
- **Grade and texture:** off-white background with soft corner gradients (lime top right, pink bottom left) that slowly drift.
- **Sound cues:** a soft tick on every step, like a reel.

## How to make it
- **Model:** none.
- **Edit recipe (Remotion):**
  - An array of names. `offset` (rows) is a step function eased with `springAt` per step.
  - Each row's `y = (i − offset) × rowH`.
  - `fontSize`, `opacity` and `color` come from `|i − offset|`.
  - `MBlur` with `y` from the per-frame speed.
  - The phrase on the right is `Typed`.
- **Into it:** [hard-cut-blur-settle](../transitions/hard-cut-blur-settle.md).

## Watch out for
- Use real names only (real AdFlex models, platforms and features), each spelled as in the product.
- Arabic version: the reel sits on the right and the phrase on the left. Latin model names stay in Archivo, and the Arabic phrase is in Cairo.
- Don't use «أي موديل» or «أي ذكاء اصطناعي» as the phrase (house rule). Something like «كلها داخل AdFlex» works.

## Examples
- Reference only so far.
