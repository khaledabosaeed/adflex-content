---
name: "Pixel-block wipe"
slug: "pixel-block-wipe"
type: "transition"
fits: [social, ad]
source: "Kling 4.0 — now on Higgsfield (36 s), 17.11–17.28 s: https://video.twimg.com/amplify_video/2112922956435484672/vid/avc1/1920x1080/N_XjrT0_e4YGBaRk.mp4 · page https://whatships.com/videos/kling-4-higgsfield/. Higgsfield — Cursor for motion designers (20 s), 4.17–4.77 s: https://video.twimg.com/amplify_video/2098824709995642880/vid/avc1/1080x1080/3IkblATHvJtuAHFP.mp4 · page https://whatships.com/videos/higgsfield-astra-cursor/. Higgsfield Playable — games from a prompt (32 s), 19.63–19.73 s: https://video.twimg.com/amplify_video/2114769021774028800/vid/avc1/1440x1080/SXc6ovz8cKC-WfTI.mp4 · page https://whatships.com/videos/higgsfield-playable/. Higgsfield — Faceless documentaries researched… (43 s), 4.98–5.5 s: https://video.twimg.com/amplify_video/2072717948469514240/vid/avc1/1920x1080/plnsTUB7_f2rT1JU.mp4 · page https://whatships.com/videos/higgsfield-explainer/"
used_in: []
---

# Pixel-block wipe

## What it looks like
The next shot, or a flat field of accent colour, eats the frame through a mask with a stepped, pixel-stair edge: square blocks march in from one corner. It's fast and digital. Two variants: **depixelate-in** (a hard cut lands on a very coarse mosaic that resolves to the shot in about 4 frames) and **pixel-dither dissolve** (a dot-matrix shimmer runs across a UI element, then the cut, then the leftover dither clears).

## Breakdown
- **Transitions:**
  - Block wipe (Kling 4.0, 24 fps, 17.11–17.28 s, about 0.17 s): a magenta pixel-block mosaic eats the player diagonally from the top-right corner. A full-bleed giant "10" then lands from oversize and shrinks (17.28–17.6 s).
  - Burst (Astra cursor, 1:1, 4.17–4.77 s): several colour fields in a row (cream/black, a desaturated shot, magenta, lime, black), each revealed by a pixel-stair edge and held 1–3 frames. The burst comes back at about 10.9 and 17.6 s.
  - Depixelate-in (Playable, 19.5–19.73 s): the "Promote" pill glows and scales toward the camera (19.5–19.6 s). A hard cut at 19.63 s lands on a very coarse mosaic that resolves in about 4 frames; sharp by about 19.73 s.
  - Dither dissolve (Explainer, 4.98–5.5 s): a green dot-matrix shimmer runs across the prompt pill while it drifts up. A hard cut at 5.32 s to footage; leftover green dither in the top-left corner clears over about 4 frames.
- **Sound cues:** a short bit-crushed tick on each step.

## How to make it
- **Model:** none.
- **Edit recipe (Remotion):**
  - Block wipe: a grid of square cells (e.g. 48 px) as an SVG `<mask>` over the incoming shot. Each cell's reveal time is its distance along the diagonal from the start corner, quantised into steps, plus a little `random(\`px${i}\`)` jitter so the edge is a staircase, not a line. The whole wipe takes 0.15–0.2 s. Cells snap on, with no easing or fade.
  - Depixelate-in: put the incoming `Clip` in a `div` at 1/k size, `transform: scale(k)`, `imageRendering: 'pixelated'`. Step k 64 → 32 → 16 → 8 → 1 over about 0.13 s.
  - Dither: a dot pattern (like the dot grid in `Background`) in the accent colour, masked by a band that moves across the element with `ip(..., INOUT)`. After the cut, switch leftover cells off at `random()` times over about 0.13 s.

## Watch out for
- It's loud. Use it once per video, between graphic beats or into the payoff. Keep it off the soft hero (Bloom v4 rejected flashy hits); use [render-reveal](render-reveal.md) or [hard-cut-blur-settle](hard-cut-blur-settle.md) there.
- Steps must snap. Eased or blurred blocks look like a cheap mosaic filter.
- One cell size on one grid across the whole frame. Mixed sizes read as compression noise.
- AdFlex version: blocks in Generate purple (#8337F1 → #6730D4) or the sparkle colours (#C95AC5, #55AAFF), never lime or magenta. Any type that lands after it is Archivo (Cairo for Arabic).

## Examples
- Reference only so far.
- Related: [pixel-square-burst](pixel-square-burst.md) (the same pixels as an accent on a click), [proof-numbers](../motion-styles/proof-numbers.md) (the number slam that follows it in Kling 4.0).
