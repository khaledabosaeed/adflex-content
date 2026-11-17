---
name: "Colour wash cut"
slug: "colour-wash-cut"
type: "transition"
fits: [social, ad, hero]
source: "Higgsfield Genjutsu Lite — step into a video (29 s), 9.17–9.80 s: https://video.twimg.com/amplify_video/2112640616387772416/vid/avc1/1920x1080/cBcDqM1e80f0gPNQ.mp4 · page https://whatships.com/videos/higgsfield-genjutsu-lite/. Higgsfield — Gemini Omni 1.1 Flash is live (77 s), 51.27–51.67 s: https://video.twimg.com/amplify_video/2093448096311382016/vid/avc1/1920x1080/tm6lzTYZJQoIdEzn.mp4 · page https://whatships.com/videos/higgsfield-omni-1-1-flash/. Introducing Higgsfield Genjutsu Restyle (30 s), 16.85–17.4 s: https://video.twimg.com/amplify_video/2105412179881332737/vid/avc1/1920x1080/D2Md59y7AaTq6g9E.mp4 · page https://whatships.com/videos/higgsfield-genjutsu-restyle/"
used_in: []
---

# Colour wash cut

## What it looks like
The outgoing shot floods with one hot colour, the cut hides inside the colour, and the next shot comes out of it and drains back to its true colours. Two flavours: **colour bloom** (the shot glows up into a soft colour haze and the next one resolves out of it) and **duotone wash** (a hard duotone flood rolls across the frame, and the next shot starts in the same tint and un-tints).

## Breakdown
- **Transitions:**
  - Bloom (Genjutsu Lite, 9.17–9.80 s): the chat thread overexposes, first white, then a saturated yellow/pink bloom, then a flat hot-pink haze (9.17–9.46 s). From 9.50 to 9.80 s a vertical video card resolves out of the haze through hot colours to normal.
  - Bloom (Omni 1.1 Flash, 51.27–51.67 s): a hard cut at 51.27 s to pure white for 4 frames, then a soft iridescent haze (pink, blue, lime blobs) blooms in and resolves into the next title while a figure drops in from the top (51.53–51.67 s).
  - Duotone (Genjutsu Restyle, 16.85–17.4 s): the shot floods from the bottom with a hot pink → orange → lime duotone (16.85–17.1 s). The next shot appears already in lime and un-tints back through orange and pink (17.15–17.4 s) while a diagonal line sweeps across it.
  - Both bloom references pass through white. We skip that step.
- **Sound cues:** a soft swell into the colour, a release as it clears.

## How to make it
- **Model:** none.
- **Edit recipe (Remotion):**
  - Out: an `AbsoluteFill` in the wash colour over the outgoing clip, `mixBlendMode: 'screen'` (bloom) or `'color'` (duotone), `opacity` 0 → 1 with `ip(..., IN)` over about 0.25 s, plus a `brightness()`/`saturate()` lift on the clip. Hard cut at the peak.
  - In: the same layer 1 → 0 with `ip(..., OUT)` over about 0.3 s on the new shot.
  - Duotone roll: animate a `linear-gradient` mask edge from bottom to top instead of a flat fade.
  - Haze: two or three large blurred radial blobs drifting on top (like the radial gradients in `Background`).
  - Don't use `Flash` here: its core is white.

## Watch out for
- Never white. Peak on a saturated colour (Bloom v4 rejected white flashes).
- Keep the whole thing to about 0.7 s or less. A long hold of flat colour reads as a dropout.
- One wash colour per video, so it becomes a signature rather than a disco.
- AdFlex version: the wash in Generate purple (#8337F1 → #6730D4), the haze blobs in the sparkle gradient (#C95AC5 → #55AAFF). A title that resolves out of it is Archivo (Cairo for Arabic).

## Examples
- Reference only so far.
- Related: [object-carry](object-carry.md) (its purple flood reveal), [before-after-diagonal](before-after-diagonal.md) (the diagonal that rides with the duotone in Restyle), [flare-fly-in](flare-fly-in.md), [style-swap-cut](style-swap-cut.md).
