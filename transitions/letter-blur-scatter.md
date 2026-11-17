---
name: "Letter blur scatter"
slug: "letter-blur-scatter"
type: "transition"
fits: [hero, ad, social]
source: "Higgsfield AI launch (42 s), 12.93–13.55 s: https://video.twimg.com/amplify_video/2013725657914843141/vid/avc1/720x880/_NdNdeDsZhkyh6xB.mp4?tag=14 · page https://whatships.com/videos/higgsfield-ai-launch/. Claude + Higgsfield MCP — 18-minute breakdown of… (1134 s), 13.1–13.66 s: https://video.twimg.com/amplify_video/2056404580619919361/vid/avc1/1920x1080/wT7FGshDUzNLLoiU.mp4 · page https://whatships.com/videos/claude-higgsfield-mcp/"
used_in: []
---

# Letter blur scatter

## What it looks like
The title's letters drift apart, blur and fade one by one. Across a hard cut, the next word assembles letter by letter from blurred, scattered fragments. A line that stays the same (a second line under the title) holds still across the cut, which ties the two shots together.

## Breakdown
- **Transitions:**
  - AI launch (720×880, 24 fps, 12.93–13.55 s): the first two words break apart and blur out one by one. A hard cut at 13.14 s. The new word assembles letter by letter from blurred, scattered fragments (13.25–13.55 s). The bottom line ("CHARACTERS") stays put across the cut.
  - Claude + MCP (13.1–13.66 s): the word's letter spacing widens (13.15 s), the clips orbiting it drift outward with motion blur, and everything blurs out (about 13.45 s). The next title resolves from blur with small asterisk sparkles (13.5–13.66 s).
- **Cuts and timing:** out in about 0.2 s, in in about 0.3 s, with a small offset per letter.
- **Sound cues:** a soft airy whoosh out, a light shimmer in.

## How to make it
- **Model:** none.
- **Edit recipe (Remotion):**
  - Out: one `span` per letter. Each gets an x/y drift from `random(\`l${i}\`)` (40–120 px), wider `letterSpacing`, `blur` 0 → 12 px and `opacity` → 0 with `ip(..., IN)` over 0.2 s (the house exit), 20–30 ms apart (house stagger is ≤ 50 ms).
  - In: `Typed` with a small `per` already does a blur-rise per glyph. For the scatter, add a per-letter start offset (a random x/y) that settles to 0 on the house spring (mass 0.6, stiffness 140, damping 12).
  - The held line: render it above the cut (outside the `Sequence`s or `TransitionSeries`), so it doesn't flicker.

## Watch out for
- Keep the scatter small. Letters should drift, not explode (no burst look on the soft hero).
- Arabic (Cairo) is joined script: scatter word by word, never letter by letter. `Typed` splits by code point, so don't use it per glyph on Arabic.
- Fade fully before the cut, so no half letter sits on the new shot.
- AdFlex version: Archivo (Cairo for Arabic), white with one accent word in Generate purple (#8337F1 → #6730D4); any sparkles in the sparkle gradient (#C95AC5 → #55AAFF).

## Examples
- Reference only so far.
- Related: [hard-cut-blur-settle](hard-cut-blur-settle.md), [scramble-bar-title](../motion-styles/scramble-bar-title.md), [corner-type-labels](../motion-styles/corner-type-labels.md).
