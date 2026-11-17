---
name: "Flare wash + title from behind the camera"
slug: "flare-fly-in"
type: "transition"
fits: [hero, social, ad]
source: "Higgsfield Talent Contest card, 0.30–0.95 s: https://static-public-media.higgsfield.ai/cards/9a1e389f-efeb-4b7a-a0e6-2b39defe2116.mp4 · page https://higgsfield.ai/contests/talent-contest"
used_in: []
---

# Flare wash + title from behind the camera

## What it looks like
An opening wide shot holds for a beat. A hazy light flare washes over it for a single frame, and then a huge 3D title flies in from *behind* the camera: you see the inside of the giant letters rushing past before they shrink, settle in front of the scene and lock into place. The title is in the scene, not on top of it.

## Breakdown
- **Transitions:**
  1. 0–0.55 s: a still-ish wide shot (a stadium crowd) with a slow push-in.
  2. 0.55 s: one frame of haze or flare. The frame lifts to about 60 % white with a soft diagonal light beam.
  3. 0.59 s: chrome digits fill the frame, so close they're out of focus, with strong radial motion blur.
  4. 0.59–0.92 s: they shrink back to their final size (about 0.35 s, expo-out). The blur fades and a small logo fades in above.
  5. 0.95 s on: the title holds while the scene behind keeps moving.
- **Text and graphics:** extruded chrome 3D text with soft reflections and a laurel mark. It sits at the depth of the scene, so a person can later rise in front of it (around 2.0–2.75 s in the reference).
- **Sound cues:** an airy whoosh-in ending on a low boom when the title locks.

## How to make it
- **Model:**
  - *AI version:* generate the shot with the title in it (image-to-video from a still that already has the 3D title). The occlusion comes for free.
  - *Edit version:* no model needed.
- **Edit recipe (Remotion):**
  - The title is a 3D layer (React Three Fiber, see the `3d-icon-pops` setup in `tools/talking-head-reel/remotion/`) or a pre-rendered PNG.
  - `scale` from about 8 to 1 with `ip(..., OUT)` over 0.35 s.
  - Radial blur: three or four stacked copies at slightly larger scales with falling opacity.
  - Flare: a single-frame `Flash` at about 0.6, with a white-to-transparent `linear-gradient` beam.
  - Render WebGL with motion blur at 120 fps as in `lessons/editing.md` (talking-head reel section).

## Watch out for
- The flare is one or two frames, no more. Longer reads as an exposure mistake.
- Only for an opening title or a single big number (a price, a count). Don't repeat it.
- AdFlex version: a brand-purple metallic (not chrome) "AdFlex" or a hero number ("10 ads in one chat"). Logo rules from `brand/brand.md` apply.

## Examples
- Reference only so far. The full in-scene title: [chrome-title-in-scene](../motion-styles/chrome-title-in-scene.md).
