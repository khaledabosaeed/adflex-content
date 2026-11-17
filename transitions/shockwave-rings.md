---
name: "Toggle shockwave rings"
slug: "shockwave-rings"
type: "transition"
fits: [hero, ad, social]
source: "Higgsfield Fable 5.2 × Higgsfield MCP card (12.2 s, 16:9, silent), 5.85–6.98 s: https://static-public-media.higgsfield.ai/cards/b7c76e0d-2ca5-431e-b1ee-4b2ecc3bf984.mp4 · page https://higgsfield.ai/mcp?tab=claude"
used_in: []
---

# Toggle shockwave rings

## What it looks like
A grey toggle sits on a white card. Purple electricity crackles inside it, then it snaps on (lime → green). Neon rounded-rectangle rings burst out of it one after another, pink, then purple, then teal, and fly past the frame edges. The card settles, sharp and bright, and then it hard-cuts to the payoff footage. It's the "switched on" moment before the result.

## Breakdown
- **Transitions:**
  1. 5.85–5.97 s: a grey, washed-out toggle under the heading "HIGGSFIELD MCP" and "3-DAY FREE TRIAL". The camera pushes in slowly.
  2. 5.97–6.40 s: thin purple lightning crackles inside the toggle (about 0.4 s). The heading and caption sharpen.
  3. 6.43–6.72 s: three rings, each the toggle's own rounded-rect shape, scale out from it about 0.08 s apart: pink (#FF3CAC-like), purple, then teal. Each is thick, glowing and motion-blurred, and grows past the frame in about 0.2 s. The toggle turns lime → green as the first ring leaves.
  4. 6.72–6.93 s: the background fades back to off-white and the text turns black and crisp.
  5. 6.98 s: a hard cut to the payoff footage.
- **Sound cues:** an electric crackle, then a deep "thoom" on the first ring, and a riser that ends on the cut.

## How to make it
- **Model:** none.
- **Edit recipe (Remotion):**
  - Lightning: an SVG polyline with jittered points re-seeded every 2 frames (`random(seed + frame)`), `stroke: #9848FE`, plus a glow `drop-shadow`.
  - Rings: three `div`s with the toggle's `borderRadius` and a thick `border` in a gradient. `scale` from 1 to 6 with `ip(..., IN)` over 0.2 s, staggered 0.08 s, `opacity` from 1 to 0 over the last half, and `filter: blur()` that grows with scale.
  - The cut: a `TransitionSeries` hard cut (no transition) right after the rings clear.

## Watch out for
- The team cut burst rings from the soft Bloom hero ("not cheap"). Use this once, on the "switch it on" or CTA beat, not between ordinary scenes.
- The rings must be the shape of the object they leave (here the toggle). Plain circles read as a stock effect.
- AdFlex version: the rings in the sparkle colours (#F83AAE → #C95AC5 → #55AAFF). The object can be the "Connect" toggle for the AdFlex MCP, or ALFA's Approve button.
- **Calm variant (send-glow pulse):** for a soft hero, swap the rings for one soft radial bloom that swells out of the send button and fades in about 0.3 s, before the next step. Higgsfield Fable 5.1 (57 s), 38.70–38.97 s: https://video.twimg.com/amplify_video/2095483820934041600/vid/avc1/1920x1080/SXJf8yUuVvIpqXxB.mp4 · page https://whatships.com/videos/higgsfield-fable-5-1/

## Examples
- Reference only so far.
