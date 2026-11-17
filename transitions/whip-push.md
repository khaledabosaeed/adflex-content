---
name: "Whip push"
slug: "whip-push"
type: "transition"
fits: [hero, ad, social]
source: "Higgsfield Genjutsu launch promo (19 s, 16:9): https://cdn.higgsfield.ai/card/16eebc9a-8310-4f68-8a02-1e2e6f109169.mp4 · page https://higgsfield.ai/ai/video?model=genjutsu · AdFlex copy https://cdn.adflex.ai/alfa-attachments/6a4e858a12b2fc125b9e380a/318b06d0-757e-48dd-8f82-edbb67627ef1.mp4"
used_in: [workflow-hero]
---

# Whip push

## What it looks like
The whole outgoing scene accelerates off to the left with heavy horizontal motion blur. The next scene arrives from the right already moving and brakes hard into place. There's no cut you can see: it reads as one fast camera move.

## Breakdown
- **Transitions:**
  - Out: about 0.3 s, ease-in (the scene picks up speed as it leaves).
  - In: about 0.5 s, expo-out (fast arrival, long soft brake).
  - The two overlap by about 0.15 s. The incoming scene starts while the old one is still leaving.
  - The blur strength follows the speed of each frame, so it's strongest mid-whip and gone when the scene settles.
- **Sound cues:** a short whoosh (0.3–0.8 s) whose peak lands on the overlap.

## How to make it
- **Model:** none.
- **Edit recipe (Remotion):** `whipOut(f, at)` and `whipIn(f, at)` in `templates/remotion-video/src/lib.tsx` return `{x, blur}`. Wrap each scene in `<MBlur id x={blur} style={{translate: `${x}px 0`}}>`. Start the next scene about 0.15 s before the old one finishes. A working example is `videos/hero/workflow-hero/build/remotion/src/scenes/`.

## Watch out for
- Give each `MBlur` its own `id`, or two scenes share one SVG filter.
- Use it between scenes only, never inside a scene. The team said tilts, orbits and follow-cams read as "too much motion" (workflow-hero v7 → v8).
- On a soft hero (Bloom), the team rejected zoom-blur whips. Use [hard-cut-blur-settle](hard-cut-blur-settle.md) or [object-carry](object-carry.md) there.

## Examples
- workflow-hero v4–v10: every scene change (`renders/`, git-ignored).
- The full Genjutsu style around it: [glitch-split-whip](../motion-styles/glitch-split-whip.md).
