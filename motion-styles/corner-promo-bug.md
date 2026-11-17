---
name: "Corner promo bug"
slug: "corner-promo-bug"
type: "graphics"
fits: [ad, social]
source: "Hell Grind — Higgsfield's open-sourced 95-minute AI feature film (5754 s), from 0 s (first 120 s analysed): https://video.twimg.com/amplify_video/2084697990917476352/vid/avc1/1920x1080/eYMpmO2BRNMO-8Kc.mp4 · page https://whatships.com/videos/higgsfield-hell-grind/. Passport Rush — an open-source hybrid short (303 s), 0–120 s (first 120 s analysed): https://video.twimg.com/amplify_video/2103563594655031296/vid/avc1/1920x1080/_t0m0eC0u3GLYTh_.mp4 · page https://whatships.com/videos/passport-rush/"
used_in: []
---

# Corner promo bug

## What it looks like
A small stacked badge sits in the top-right corner for the whole film and never moves: the brand in a coloured box, with the product or model under it in white italic caps ("HIGGSFIELD" / "UNLIMITED" / "SEEDANCE", or "HIGGSFIELD" / "CINEMA STUDIO 4"). The film itself is pure cinema with no product UI, so the bug is the only branding while it plays. It works like a TV channel logo: you stop noticing it, but every screenshot and re-post carries it.

## Breakdown
- **Text and graphics:**
  - Two or three stacked lines of bold italic caps. First line: the brand in a lime box (#c6ff00). The lines below: white, no box.
  - Small, broadcast-logo size, top right. Hell Grind is letterboxed (~2.39:1 inside 16:9).
- **Timing:** on every frame of the analysed 120 s. No entrance, exit or animation was seen.
- **The same badge in short films:** pinned at the top right of the result in a split screen ("HIGGSFIELD / CLAUDE OPUS 5.5" in the motion pipeline film, "HIGGSFIELD | AI MOTION DESIGNER" in Astra cursor).

## How to make it
- **Model:** none.
- **Edit recipe (Remotion):**
  - One component at the top level of the composition, above every `Sequence`, so no cut ever touches it.
  - First line: the real AdFlex logo (`brand/adflex-logo-1820.png`), or "ADFLEX" in `cond(860, 72)` on a Generate-purple box. Second line: the real model or feature name in `cond(700, 72)`, white (italic once the italic file is added), with a soft text shadow so it reads on bright footage.
  - About 8–10 % of the frame width (our choice; the reference gives no size), inside the title-safe margin.
  - No animation, or one house-spring entrance on the first story frame and nothing after.

## Watch out for
- The second line must be the model or feature that really made the footage, checked against the run.
- 9:16 social: some apps put their own icons in the top-right corner. Move the bug to the top left, or lower, inside the safe box.
- Keep it static. A bug that pulses competes with the film (focal-point rule).
- AdFlex version: the box in the Generate purple (#8337F1 → #6730D4) with white Archivo caps. Claude/ChatGPT/MCP never get their own bug. If they are named, it's a small third line, equal-weight to each other.

## Examples
- Reference only so far. Related: [corner-type-labels](corner-type-labels.md), [result-over-process-split](result-over-process-split.md), [flash-forward-cold-open](flash-forward-cold-open.md).
