---
name: "Region-box restyle"
slug: "region-box-restyle"
type: "transition"
fits: [hero, ad, social]
source: "Introducing Higgsfield Genjutsu Restyle (30 s), 1.3–2.3 s: https://video.twimg.com/amplify_video/2105412179881332737/vid/avc1/1920x1080/D2Md59y7AaTq6g9E.mp4 · page https://whatships.com/videos/higgsfield-genjutsu-restyle/"
used_in: []
---

# Region-box restyle

## What it looks like
Rounded outline boxes sit over parts of a live shot (the people, the sofa, the rug, the window), and inside each box that part has already been restyled. Then the boxes scatter and the whole frame flips to the restyled version. It shows the change before it happens, one region at a time, so the full flip feels earned.

## Breakdown
- **Transitions (Genjutsu Restyle, 24 fps):**
  1. 0–1.3 s: a live living-room shot with rounded outline boxes over its main regions.
  2. 1.3–2.0 s: inside the boxes the colours shift to the restyled look; outside, the shot stays live.
  3. 2.05–2.25 s: the boxes scatter, coloured bars of the title drop in from the edges, and the whole frame becomes the cartoon version inside a rounded frame with a halftone border.
- **Cuts and timing:** the full flip at about 2.2 s is the biggest moment of the video (7 % in). It works as an opener.
- **Sound cues:** a soft tick per box, a whoosh on the full flip.

## How to make it
- **Model:** yes. The restyled version must be the same clip, frame-locked (a video-to-video restyle). Quote the credits first.
- **Edit recipe (Remotion):**
  - Stack the live `Clip` (bottom) and the restyled `Clip` (top), aligned exactly.
  - Each region: a `Crop` of the restyled clip at the box rect, plus an outline `div` (2 px, the real card radius). Boxes enter on the house spring (mass 0.6, stiffness 140, damping 12), ≤ 50 ms apart. Inside each, cross-fade live → restyled with `ip(..., INOUT)` over about 0.5 s.
  - The flip: the boxes leave with the house exit (0.2 s, `IN`) while the top clip's `clipPath` grows from the boxes to the full frame (or a 0.2 s cross-dissolve).

## Watch out for
- The restyle must keep the layout. If the model moves things, the boxes stop lining up; check alignment frame by frame.
- 3–5 boxes, on things a viewer can name at a glance.
- Leave out the reference's halftone border and title bars unless they're ours.
- AdFlex version: box outlines in Generate purple (#8337F1 → #6730D4) with a soft sparkle-gradient glow (#C95AC5 → #55AAFF), optional small Archivo labels. The restyled footage is a real AdFlex output.

## Examples
- Reference only so far.
- Related: [style-swap-cut](style-swap-cut.md) (the whole frame at once), [render-reveal](render-reveal.md), [before-after-diagonal](before-after-diagonal.md).
