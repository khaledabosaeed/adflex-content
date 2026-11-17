---
name: "UI punch-in cut"
slug: "ui-punch-in-cut"
type: "transition"
fits: [hero, ad]
source: "Supercomputer turns ideas into short dramas at scale. (98 s), 6.0 s: https://video.twimg.com/amplify_video/2055362554424332288/vid/avc1/1920x1080/Qru7EJrW-PlDd7N-.mp4 · page https://whatships.com/videos/supercomputer-8048/"
used_in: [workflow-hero]
---

# UI punch-in cut

## What it looks like
On the same UI, a hard cut jumps to about twice as close in one frame, and the slow camera drift carries on as if nothing happened. It's the talking-head jump cut applied to a screen: a jolt of energy and a new focus, without a new shot.

## Breakdown
- **Cuts and timing (Supercomputer, 30 fps):**
  1. 2–6 s: a row of model-icon chips slides in, a button pops in and its arrow turns. The camera drifts slowly.
  2. 6.0 s (frame-exact): the same UI jumps to about 2.2× scale on one frame, then keeps drifting.
  3. A mascot avatar card follows.
- **Transitions:** none. No blur, no zoom frames between the two scales. The drift speed and direction are the same before and after the cut.
- **Sound cues:** cut on a beat; a small tick, or nothing.

## How to make it
- **Model:** none.
- **Edit recipe (Remotion):**
  - Wrap the UI scene in one `Cam`. `s = drift(f) * (f >= cut ? 2.2 : 1)`, with `ox`/`oy` on the element you punch onto.
  - Drift: `s` grows slowly (e.g. 1 → 1.04 over 4 s) with `ip(..., INOUT)` and runs straight through the cut.
  - Capture or render the UI at 2× resolution or more, so the punched-in frame stays sharp.

## Watch out for
- A soft upscale shows immediately. Record the UI at 2× (or 4K) before you plan a punch.
- Punch onto the thing that matters next (the button about to be clicked), so the cut has a reason.
- No zoom blur and no shake on the punch: both are on the Bloom v4 reject list. It's a clean cut.
- One or two per sequence. Every few seconds it turns into jitter.
- AdFlex version: real AdFlex UI from a recording only, punching onto the real Generate button or the ALFA chat input. Any callout in Archivo, a highlight in Generate purple (#8337F1 → #6730D4), and a glow, if any, in the sparkle gradient (#C95AC5 → #55AAFF).

## Examples
- Reference only so far.
- Related: [talking-head-punch](../motion-styles/talking-head-punch.md) (the same cut on a person), [ui-step-walkthrough](../motion-styles/ui-step-walkthrough.md), [hard-cut-blur-settle](hard-cut-blur-settle.md).
