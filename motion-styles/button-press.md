---
name: "Button press"
slug: "button-press"
type: "graphics"
fits: [hero, ad, social]
source: "Supercomputer — How to run paid ads on Supercomputer… (68 s), 26.6–27.5 s: https://video.twimg.com/amplify_video/2055680164101832704/vid/avc1/1920x1080/kjD89CicQd4hkiFs.mp4 · page https://whatships.com/videos/supercomputer-4350/. Higgsfield Academy — from prompt to AI film (77 s), 18.1–19.2 s (also 53–55 s): https://video.twimg.com/amplify_video/2111187461342982144/vid/avc1/1920x1080/zVJRZIQLHAz0xfQa.mp4 · page https://whatships.com/videos/higgsfield-academy/"
used_in: [workflow-hero]
---

# Button press

## What it looks like
The whole frame is one button. A glowing pill sits on a dark dotted grid. The cursor slides in and presses, the button sinks under it, holds for a moment, then springs back up brighter than before. The press is the "go" of the film. In the bolder version, a chunky 3D cursor flies in and clicks a 3D extruded GENERATE pill, pixel squares burst out of it, and the camera swings along the button into a smear that becomes the next shot.

## Breakdown
- **Flat version (Supercomputer, 26.6–27.5 s):**
  - A glowing pill button on a dark dotted grid (the dark "Run ✦ 32" button appears in the shots before it). Dark teal gradient with a cyan glow.
  - The cursor enters. The button squashes to about 85 % (26.9–27.3 s, a 0.4 s hold), then springs back brighter (27.4–27.5 s).
- **3D version (Academy, 18.1–19.2 s):**
  - An oversized extruded lime cursor flies in and clicks a 3D GENERATE pill at ~18.52 s, with a squash on the click.
  - Lime pixel squares burst out of the button (18.6–18.9 s). The camera swings along the button into a lime motion-blur smear (19.0–19.1 s), then a hard cut at 19.21 s.
- **Where it sits:** the turn from setup to results.

## How to make it
- **Model:** none.
- **The squash, a compromise with the house rule:** the reference squashes to 85 %. The house limit is ≤1.05× (5 % deformation). Use **0.95** for the press. A 15 % squash on a frame-filling button reads as jitter and breaks the shared motion language. The press still reads because of the hold (keep the reference's ~0.4 s) and the light change (dim while pressed, flare on release). The release uses the house spring and overshoots only to about 1.004 before settling.
- **Edit recipe (Remotion):**
  - Cursor: an SVG arrow moved with `ip(..., INOUT)`, its tip landing 0.1 s before the press.
  - Press: `scale = ip(f, [press, press + 0.08 s], [1, 0.95], IN)`, hold, then release with `0.95 + 0.05 · spring(...)` (mass 0.6, stiffness 140, damping 12).
  - Light: `filter: brightness()` at 0.85 while held, then a flare to about 1.3 that decays exponentially (τ ≈ 60 ms) to 1.1, so it ends brighter. The glow is a box-shadow.
  - 3D version: extrude the real button (React Three Fiber, as for the globe in [proof-numbers](proof-numbers.md)) with a big cursor model, on the same timings.
  - Out: [pixel-square-burst](../transitions/pixel-square-burst.md) (the Academy burst), [shockwave-rings](../transitions/shockwave-rings.md) or [button-to-player-morph](../transitions/button-to-player-morph.md).

## Watch out for
- It must be the real AdFlex button with its real label, never a button made up for the film. The 3D version is the same real pill, extruded.
- One press per film, as the hero beat. More presses and it stops landing.
- AdFlex version: the Generate pill in the Generate purple (#8337F1 → #6730D4) with a sparkle-gradient glow (#C95AC5 → #55AAFF). The label keeps the UI's own text as recorded; any added type is Archivo.

## Examples
- Reference only so far. Related: [ui-macro-dolly](ui-macro-dolly.md), [accent-typed-prompt](accent-typed-prompt.md), [chapter-cards](chapter-cards.md).
