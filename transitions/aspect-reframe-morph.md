---
name: "Aspect reframe morph"
slug: "aspect-reframe-morph"
type: "transition"
fits: [ad, social, hero]
source: "Higgsfield — Adapt any clip into short-form video with… (24 s), 4.77–5.27 s: https://video.twimg.com/amplify_video/2072380437868027905/vid/avc1/1920x1080/eYMjDhOPA2Ng9FUg.mp4 · page https://whatships.com/videos/higgsfield-shorts/. Higgsfield — Faceless documentaries researched… (43 s), 35.9–36.6 s: https://video.twimg.com/amplify_video/2072717948469514240/vid/avc1/1920x1080/plnsTUB7_f2rT1JU.mp4 · page https://whatships.com/videos/higgsfield-explainer/"
used_in: []
---

# Aspect reframe morph

## What it looks like
A 16:9 video card squeezes into a 9:16 card in one move, keeping the subject in frame. Or the 16:9 frame slides aside and splits into three 9:16 panels that each fill with a different version. It says "every format" without a word.

## Breakdown
- **Transitions:**
  - Squeeze (Shorts, 4.77–5.27 s, 0.5 s): the 16:9 card smears and compresses horizontally (4.77–4.87 s) and resolves as a 9:16 card on the left, while preset thumbnails rise row by row from the bottom (4.9–5.2 s). At 5.27 s the vertical card becomes the selected preset (dashed selection box).
  - Triptych (Explainer, 35.9–36.6 s): a grey panel pushes in from the left, and the 16:9 frame slides right and splits into three 9:16 panels. The old headline wipes out word by word while the new one types in word by word and slides to the centre. The panels then fill with different stories (37–39 s).
- **Cuts and timing:** in Shorts, quick style swaps on the vertical card follow straight after (9.0–9.77 s).
- **Sound cues:** a short compress "thwip" on the squeeze; three soft ticks as the panels separate.

## How to make it
- **Model:** none for the move. Three different panel contents need three real outputs (if they must be generated, quote the credits first).
- **Edit recipe (Remotion):**
  - Squeeze: one card `div` with `overflow: hidden`, width animating from 16:9 to 9:16 at the same height with `ip(..., INOUT)` over about 0.3 s. Wrap it in `MBlur` with a short `x` blur only during the fast part. The `Clip` inside keeps its full height with `objectFit: 'cover'` and an `objectPosition` on the subject, so it's a reframe, not a squash.
  - Triptych: three `Crop`s that together tile the 16:9 frame. Gaps open between them on the house spring (mass 0.6, stiffness 140, damping 12), ≤ 50 ms apart, each crop narrows to 9:16, then each panel hard-cuts inside to its own version.
  - Headline: the old `Label` with `out`, the new one with `at` right after it.

## Watch out for
- Track the subject so the 9:16 crop never loses the face or the product.
- Smear only in the squeeze direction and briefly (about 0.1 s). A long blur reads as a whip, which the soft hero bans (Bloom v4).
- Show only formats AdFlex really exports, and its real format controls if UI is in shot.
- AdFlex version: the selection box in Generate purple (#8337F1 → #6730D4), panel rims a soft sparkle-gradient glow (#C95AC5 → #55AAFF), labels in Archivo (Cairo for Arabic).

## Examples
- Reference only so far.
- Related: [style-swap-cut](style-swap-cut.md) (the locked-frame swaps that follow it in Shorts), [deliverables-parade](../motion-styles/deliverables-parade.md), [option-board](../motion-styles/option-board.md).
