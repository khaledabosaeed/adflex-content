---
name: "Render reveal (placeholder → final)"
slug: "render-reveal"
type: "transition"
fits: [hero, ad, social]
source: "Higgsfield — prompt scenes and cameras in Blender (49 s), 19.78–20.15 s: https://video.twimg.com/amplify_video/2092255568828522496/vid/avc1/1920x1080/1AxgC4ujXX9DDhQK.mp4 · page https://whatships.com/videos/higgsfield-blender/. Higgsfield Playable — games from a prompt (32 s), 9.77–9.97 s: https://video.twimg.com/amplify_video/2114769021774028800/vid/avc1/1440x1080/SXc6ovz8cKC-WfTI.mp4 · page https://whatships.com/videos/higgsfield-playable/. Higgsfield API — 100% cashback (26 s), 19.63–20.4 s: https://video.twimg.com/amplify_video/2103234267052646400/vid/avc1/1920x1080/8LaYVBn-o-U3XwQ_.mp4 · page https://whatships.com/videos/higgsfield-cashback/"
used_in: []
---

# Render reveal

## What it looks like
The shot starts as a placeholder (grey clay, a wireframe, a false-colour depth map) and becomes the finished, lit result at exactly the same framing. The change travels across the frame: a bright line sweeps over it, a soft bubble inflates from the centre, or the false-colour grade drains away. Nothing cuts and the camera doesn't move, so the only thing that changes is "draft → done". Placeholder → final at a locked framing is the core proof device in 6 of the 7 Higgsfield launch videos in group A.

## Breakdown
- **Transitions:**
  - Light sweep (Blender, 19.78–20.15 s, about 0.4 s): a bright orange-white line crosses the clay car left to right. Behind the line the car is textured and lit, ahead of it it's still clay. The viewport chrome drops away as the render takes over, by about 20.15 s.
  - Bubble (Playable, cut at 9.6 s, then 9.77–9.97 s): a dark empty card fades up a wireframe-grid level, then a soft bubble of the final textured world inflates from the centre over the wireframe.
  - Depth-map dissolve (Cashback, 19.63–20.4 s): the headline scrambles out (19.63–19.83 s), then the magenta/lime depth-map grade of the office slowly desaturates and the real scene shows through, by about 20.4 s.
- **Cuts and timing:** in the Blender film the sweep is the biggest moment (about 41 % in). Hold the placeholder long enough to read as "draft" before it changes.
- **Sound cues:** a soft rising shimmer that peaks as the line or the bubble edge passes the subject.

## How to make it
- **Model:** optional.
  - Edit-only: the final is a real AdFlex output, and the placeholder is made from it in the edit (greyscale flat-shade pass or a false-colour gradient map).
  - AI version: generate a clay or depth-map frame of the same shot (image-to-image), then the final from it. Quote the credits first.
- **Edit recipe (Remotion):**
  - Stack the placeholder under the final, both as `Clip`s (or images) in the same rect.
  - Sweep: give the final `clipPath: inset(0 ${100 - p}% 0 0)` with `p = ip(f, [at, at + 0.4 * fps], [0, 100], INOUT)`. Draw `ScanLine` on the edge (it's horizontal, so rotate its wrapper 90° for a left-to-right sweep).
  - Bubble: `clipPath: circle(r% at 50% 50%)` with `r` on the house spring (mass 0.6, stiffness 140, damping 12), plus a feathered `WebkitMaskImage: radial-gradient(...)` for the soft edge.
  - Depth map: a false-colour copy on top (a pre-made pass or a gradient via `mixBlendMode`), `opacity` 1 → 0 with `ip(..., INOUT)` over about 0.8 s.

## Watch out for
- The placeholder and the final must line up to the pixel (same crop, same frame), or the reveal shows a jump.
- One variant per video: the sweep for the hero moment, the bubble for an "it's building" UI step, the depth map for a slow, calm beat.
- The sweep is a thin line of light, not a flash. Never wash the frame to white (Bloom v4).
- AdFlex version: the sweep line and the bubble rim glow in the sparkle gradient (#C95AC5 → #55AAFF), any pill or label in Generate purple (#8337F1 → #6730D4) with Archivo type. The final is a real AdFlex output, never a mock.

## Examples
- Reference only so far.
- Related: [before-after-diagonal](before-after-diagonal.md) (a line sweep with tags), [style-swap-cut](style-swap-cut.md) (same framing, hard cut), [object-carry](object-carry.md) (flood reveal).
