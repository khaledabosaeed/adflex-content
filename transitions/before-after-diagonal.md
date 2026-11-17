---
name: "Before → after diagonal wipe"
slug: "before-after-diagonal"
type: "transition"
fits: [hero, ad, social]
source: "Higgsfield Production Skills Bundle for Claude (47 s), 6–38 s: https://video.twimg.com/amplify_video/2103489640418410496/vid/avc1/1920x1080/dJCe8ZIiT2FFzt3d.mp4 · page https://whatships.com/videos/higgsfield-skills/"
used_in: []
---

# Before → after diagonal wipe

## What it looks like
A "before" shot with a small tag in the corner (BEFORE). A thin bright line slides diagonally across the frame and the "after" appears behind it; the tag flips to AFTER. It's the cleanest way to prove an edit: same framing, one sweep, done.

## Breakdown
- **Transitions:**
  - The line is thin (3–4 px), lime, at about 60° from horizontal, and travels from one corner to the opposite one in about 0.5–0.8 s (ease-in-out).
  - Behind the line is the after. In front is the before.
  - The tag (BEFORE in magenta, AFTER in lime, small, italic, bottom right) swaps when the line passes it.
- **Cuts and timing:** in the Skills film every skill is a header bar ("/skill-name" + one sentence) over a 3–4 s before → after. A wipe can also go back and forth once to compare.
- **Sound cues:** a soft swipe.

## How to make it
- **Model:** the after is a real output made from the before.
- **Edit recipe (Remotion):** stack the two clips. Give the top one a `clipPath: polygon(...)` whose diagonal edge moves with `ip(..., INOUT)`. Draw the line as a rotated `div` on that edge with a soft glow.

## Watch out for
- The before and after must line up exactly (same crop, same frame), or the wipe shows a jump.
- Show the plain before for about 0.4 s first (house rule from Bloom v3).
- AdFlex version: the line in the sparkle gradient (#C95AC5 → #55AAFF), the tags in white on purple.

## Examples
- Reference only so far. Related: [compare-cards](../motion-styles/compare-cards.md) (before and after side by side as two cards, or a split that shrinks into two cards), [render-reveal](render-reveal.md) (plain → final with a light sweep).
