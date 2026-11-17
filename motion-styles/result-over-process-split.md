---
name: "Result over process split"
slug: "result-over-process-split"
type: "edit"              # also covers graphics
fits: [social, ad]
source: "Higgsfield — Cursor for motion designers (20 s), 0–20 s: https://video.twimg.com/amplify_video/2098824709995642880/vid/avc1/1080x1080/3IkblATHvJtuAHFP.mp4 · page https://whatships.com/videos/higgsfield-astra-cursor/. Higgsfield — animate with GPT-6 Astra (20 s), 0–19.6 s (bottom-only cut at 3.1 s): https://video.twimg.com/amplify_video/2097831175557681152/vid/avc1/1080x1440/q6dGQBcSOem1gwpV.mp4 · page https://whatships.com/videos/higgsfield-astra-animate/. Higgsfield — a pipeline for AI motion (10 s), 0–10 s: https://video.twimg.com/amplify_video/2103956975201443840/vid/avc1/1080x1170/8xIHb5JH3FjFA-F3.mp4 · page https://whatships.com/videos/higgsfield-motion-pipeline/"
used_in: []
---

# Result over process split

## What it looks like
One square or tall frame, split in two for the whole film. The top half is the finished piece: fast kinetic type, an animated character. The bottom half is the thing making it: the After Effects timeline with a chat panel, an artist drawing on a tablet, layer bars growing while a Claude chat scrolls. A fixed badge or a row of tool icons sits on the seam. The two halves cut on their own clocks, so the top can cut every 0.7 s while the bottom holds still. It proves "the AI made this" without a word.

## Breakdown
- **Layout:**
  - Output on top, process below, in 1:1 (1080×1080), 3:4 (1080×1440) or near-square (1080×1170).
  - The seam: a row of icons (OpenAI • Higgsfield • Ae, or Claude + Higgsfield + Ae) or a badge (lime box "HIGGSFIELD" + white italic "GPT-6 ASTRA"). The 3:4 one blends the top canvas into the bottom panel with a white-to-black gradient.
  - A small badge at the top right of the output ("HIGGSFIELD | AI MOTION DESIGNER", "HIGGSFIELD / CLAUDE OPUS 5.5").
- **Cuts and timing:**
  - Astra cursor: three prompts, each replaying a revised version of the same animation, about 6.7 s each. About 27 cuts in the top panel (average ~0.7 s). The process panel stays steady.
  - Astra animate: at ~3.1 s only the bottom cuts (tablet → UI) while the top keeps playing. At 6.30 s both cut on the same frame. At 9.77 s both cut back to the start (loop).
  - Motion pipeline: 12 cuts in 10 s on top, on the beat. Below, the chat steps and frame thumbnails update live.
- **End:** none of the three has an end card. They loop.

## How to make it
- **Model:** nothing extra. The top is the real output. The bottom is the screen recording of the run that made it.
- **Edit recipe (Remotion):**
  - Two `AbsoluteFill`s, each clipped to its half (`overflow: hidden`), each with its own list of `Sequence`s, so the two cut lists are independent.
  - Top: the output `Clip`s, cut on the music's beats. Bottom: one long `Clip` of the recording with a slow `Cam` drift, cut only when the process moves to a new step.
  - The seam row and the corner badge sit above both halves and never move. The icons enter once on the house spring (≤50 ms stagger), then hold.
  - Loop structure: prompt → result, then revised prompt → revised result, 2–3 times.

## Watch out for
- The bottom must be the real recording of this output being made, not a different run. Crop it so the chat text is readable on a phone.
- The top is the busy half. Keep the bottom calm, or the frame turns to noise.
- AdFlex version: the seam carries the AdFlex logo first, then Claude/ChatGPT/MCP small and equal-weight. The badge is in the Generate purple (#8337F1 → #6730D4), with text in Archivo (italic or a wider width where they use white italic). Good fits: a workflow run (top: the ad, bottom: the nodes filling in) or ALFA chat building a reel.

## Examples
- Reference only so far. Related: [corner-promo-bug](corner-promo-bug.md) (the corner badge), [status-line-zoom](status-line-zoom.md), [deliverables-parade](deliverables-parade.md).
