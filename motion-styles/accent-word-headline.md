---
name: "Accent-word headline"
slug: "accent-word-headline"
type: "graphics"
fits: [hero, ad, social]
source: "Higgsfield AI launch (42 s), 30.41–31.12 s (also the 3.93–7.7 s title): https://video.twimg.com/amplify_video/2013725657914843141/vid/avc1/720x880/_NdNdeDsZhkyh6xB.mp4?tag=14 · page https://whatships.com/videos/higgsfield-ai-launch/. higgsfield — so it turns out i was right. (15 s), 1.1–3.5 s and 13.43–15 s: https://video.twimg.com/amplify_video/2055372937813774336/vid/avc1/1920x1080/4ZNo33gN7u3pQW6p.mp4 · page https://whatships.com/videos/higgsfield/. Claude + Higgsfield MCP — 18-minute breakdown of… (1134 s), 1.63–2.13 s (lockup): https://video.twimg.com/amplify_video/2056404580619919361/vid/avc1/1920x1080/wT7FGshDUzNLLoiU.mp4 · page https://whatships.com/videos/claude-higgsfield-mcp/. Higgsfield — Gemini Omni 1.1 Flash is live (77 s), ~11.9 s and 27–28 s (wrapped variant): https://video.twimg.com/amplify_video/2093448096311382016/vid/avc1/1920x1080/tm6lzTYZJQoIdEzn.mp4 · page https://whatships.com/videos/higgsfield-omni-1-1-flash/"
used_in: []
---

# Accent-word headline

## What it looks like
A short, bold sans headline where one word is set differently: an italic serif or a brush script, in the accent colour. "*Free* AI Influencer *Studio*". "THE MIND / CREATES / THE REALITY.", then "*SHAPE IT WISELY.*" in pink script. "Higgsfield MCP × *Claude*", with Claude in serif. In the rotating version, a three-line caption ("REALISTIC / FACIAL / EXPRESSIONS") sits over a fast montage. On every cut the accent jumps to the next word, and the word it left goes back to plain white.

## Breakdown
- **Text and graphics:**
  - Base words: white (or black on light) bold grotesk or condensed caps. Accent word: lime italic serif, or pink italic brush script.
  - The AI Influencer title is stacked in the lower third, and its letters wobble slightly from frame to frame.
- **Rotation (accent-word-rotation), 30.41–31.12 s:** the accent moves REALISTIC → FACIAL → EXPRESSIONS, one step per hard cut, so the whole caption reads in about 0.7 s. The style switches on the cut frame. Nothing tweens.
- **Typed version ("so it turns out i was right"):** white condensed caps type on letter by letter (the first letter at 1.09 s) and the script line finishes the thought. The end line "SHAPE YOUR REALITY." arrives in script with a radial zoom blur and settles under the packshot (13.43–13.9 s).
- **Wrapped variant (wrapped-gradient-type):** the feature words in a big italic sans with a green → cyan → blue gradient, wrapped on an invisible cylinder around the model, who stands in front ("START & END FRAME" ~11.9 s, "VIDEO EXTENSION" 27–28 s).

## How to make it
- **Model:** none.
- **Edit recipe (Remotion):**
  - Each word is its own span. Word `i` gets the accent style when `i === accentIndex`, and `accentIndex` is the number of cuts passed (from the same cut list as the footage).
  - Base: `cond(860, 72)`. Accent: Archivo italic, or a width jump (`cond(900, 125)` against the condensed base), filled with the purple gradient (`background-clip: text`).
  - Entrance: `Wipe` or `Typed` per line. The accent word can arrive on the house spring as the line's one prominent pop.
  - Wrapped variant: per-letter `rotateY(θ) translateZ(r)` inside a `preserve-3d` parent, with the subject's matte on top ([text-behind-subject](text-behind-subject.md)).

## Watch out for
- One accent word per line, on the word that carries the meaning (the feature, the benefit).
- The rotating version needs cuts about 0.2 s apart or more (about 0.24 s in the reference), or the eye can't follow the accent.
- `brand/fonts/` has no italic file yet (only the roman `Archivo-var.ttf`). Add Archivo Italic (OFL) first, or use the width contrast. Never let the browser fake an oblique.
- AdFlex version: the accent word in Archivo italic or a different width, never a serif or script, in the Generate purple (#8337F1 → #6730D4). Glows use the sparkle gradient (#C95AC5 → #55AAFF). Cairo has no italic, so Arabic uses a weight jump. In a lockup AdFlex comes first, and Claude/ChatGPT stay small and equal-weight.

## Examples
- Reference only so far. Related: [accent-typed-prompt](accent-typed-prompt.md), [corner-type-labels](corner-type-labels.md), [chapter-cards](chapter-cards.md).
