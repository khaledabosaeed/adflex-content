---
name: "Compare cards"
slug: "compare-cards"
type: "graphics"
fits: [hero, ad, social]
source: "Higgsfield — Gemini Omni 1.1 Flash is live (77 s), 5–11 s: https://video.twimg.com/amplify_video/2093448096311382016/vid/avc1/1920x1080/tm6lzTYZJQoIdEzn.mp4 · page https://whatships.com/videos/higgsfield-omni-1-1-flash/. Higgsfield Genjutsu — transfer motion onto a character (59 s), 28.98–37.17 s (split-to-cards pullback 36.67–37.17 s): https://video.twimg.com/amplify_video/2094850792952102912/vid/avc1/1920x1080/waVUeOOW9YyGTdme.mp4 · page https://whatships.com/videos/higgsfield-genjutsu/"
used_in: []
---

# Compare cards

## What it looks like
The result and the original as two separate cards, offset diagonally: the result at the top left with a small pill naming the model, the original at the bottom right with a grey "Original" pill. You compare them without a wipe. In the pullback variant, the shot starts as a full-frame diagonal before/after split. Then the split's angle steepens while the two halves shrink and drift apart, until they are two floating cards on a soft gradient.

## Breakdown
- **Compare cards (Omni, 5–11 s):** the edited result (wings, fire) at the top left with a lime "✦ Gemini Omni 1.1 Flash" pill, and the original at the bottom right with a grey "Original" pill. Held for about 6 s, long enough to compare.
- **Split to cards (Genjutsu):**
  - 28.98–29.86 s: a diagonal INPUT | OUTPUT split. The divider moves with the subject's arm, and a white sparkle burst runs along the line.
  - 36.67–37.17 s (0.5 s): the angle steepens, and both halves shrink and separate into two floating cards on a cream/pink gradient.
  - Elsewhere the pairs are tilted ±5–10°, with small "INPUT" / "OUTPUT" corner tags.
- **Text and graphics:** small rounded pills, the accent colour for the result and grey for the original.

## How to make it
- **Model:** the result is a real AdFlex edit of a real original. Quote the credits first.
- **Edit recipe (Remotion):**
  - Two `Crop` cards (or `Clip`s in rounded frames). The result arrives first on the house spring, the original 50 ms later, then a slow drift in opposite directions.
  - Pills: small divs in `cond(700, 72)`, the result's in the Generate purple, "Original" in grey.
  - Pullback: each half starts as a full-frame layer with a diagonal `clipPath: polygon(...)`. Over 0.5 s (`ip(..., INOUT)`), steepen the polygon, scale each half to about 0.45 and move them apart, then swap the polygon for a rounded `inset()` so they become cards.

## Watch out for
- Use the same framing in both cards, or the eye compares the framing instead of the edit.
- Hero: keep the cards flat (no tilt). The tilted pairs are for social.
- The pill names the model that really made the result, from the run's details.
- AdFlex version: the result pill and the result card's rim in the Generate purple (#8337F1 → #6730D4), a sparkle-gradient glow (#C95AC5 → #55AAFF) on the split line, labels in Archivo. Good fits: background swap, product recolour, image → video.

## Examples
- Reference only so far. Related: [before-after-diagonal](../transitions/before-after-diagonal.md), [input-tray-under-player](input-tray-under-player.md), [option-board](option-board.md).
