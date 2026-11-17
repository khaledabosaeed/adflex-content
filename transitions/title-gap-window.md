---
name: "Title gap → window"
slug: "title-gap-window"
type: "transition"
fits: [hero, ad, social]
source: "Higgsfield Genjutsu — transfer motion onto a character (59 s), 14.02–14.52 s: https://video.twimg.com/amplify_video/2094850792952102912/vid/avc1/1920x1080/waVUeOOW9YyGTdme.mp4 · page https://whatships.com/videos/higgsfield-genjutsu/. Claude + Higgsfield MCP — 18-minute breakdown of… (1134 s), about 8–10.5 s: https://video.twimg.com/amplify_video/2056404580619919361/vid/avc1/1920x1080/wT7FGshDUzNLLoiU.mp4 · page https://whatships.com/videos/claude-higgsfield-mcp/"
used_in: []
---

# Title gap → window

## What it looks like
A title in two parts sits on screen. The parts slide apart, and the gap between them is a window onto the next shot, or a content card that opens in the space. Then the window takes over, by a cut or by growing to full frame. The title introduces what comes next by making room for it.

## Breakdown
- **Transitions:**
  - Split title (Genjutsu, 14.02–14.52 s, about 0.5 s): the product name splits between two syllables, the halves slide apart, and the gap shows a glitchy, colour-shifted window of the next clip. At 14.52 s it cuts to that clip as a card on the set.
  - Split words (Claude + MCP, about 8–10.5 s): a two-word title sits apart ("Brand ··· INTRO") and an image card opens between the words. The same device returns at about 17–19.3 s with three product cards in the gap; at 19.32–19.6 s the cards drop out downward one after another.
- **Cuts and timing:** the halves part over 0.3–0.5 s, eased. The window grows with them, so its width always equals the gap.
- **Sound cues:** a soft air pull on the split.

## How to make it
- **Model:** none.
- **Edit recipe (Remotion):**
  - Render the two halves as separate spans (`Wipe`, or plain text with `cond(860)`) at x = centre ± gap / 2, with `gap = ip(f, [at, at + 0.4 * fps], [0, W], INOUT)`.
  - Between them, a `div` of width `gap`, as tall as the caps (or taller, for a card), with `overflow: hidden` and the real card radius. Inside it, the next `Clip` at full-frame scale and centred, so the window shows a slice of the real shot, not a squashed one.
  - Then hard-cut to the shot, or grow the window to full frame (see [card-to-fullbleed](card-to-fullbleed.md)). The halves leave with the house exit (0.2 s, `IN`).

## Watch out for
- Split on a boundary that still reads. For Arabic (Cairo, right to left), split between words only, never inside a joined word.
- Genjutsu's glitch and colour shift in the window is a loud look. On the soft hero keep the window clean.
- Show the next shot moving inside the window, so the eye wants in.
- AdFlex version: words in Archivo (Cairo for Arabic), white with one accent word in Generate purple (#8337F1 → #6730D4). The window rim is a thin sparkle-gradient glow (#C95AC5 → #55AAFF), and what's inside is a real AdFlex output.

## Examples
- Reference only so far.
- Related: [glitch-split-whip](../motion-styles/glitch-split-whip.md) (the same title split, whipping instead of opening), [card-to-fullbleed](card-to-fullbleed.md), [card-stack-whip](card-stack-whip.md).
