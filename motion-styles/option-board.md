---
name: "Option board around one ad"
slug: "option-board"
type: "graphics"
fits: [hero, ad]
source: "Higgsfield Ad Multiplier launch (33 s), about 7–13 s: https://video.twimg.com/amplify_video/2092348961063677952/vid/avc1/1920x1080/wHHfzAMUzERqzJ0f.mp4 · page https://whatships.com/videos/higgsfield-ad-multiplier/"
used_in: []
---

# Option board around one ad

## What it looks like
One winning ad sits in the middle of a white frame. Around it, four small groups of options: **Language** (flag chips), **Character** (face thumbnails), **Outfit** (clothing cut-outs) and **Location** (place thumbnails). A cursor clicks one option at a time, and each click flips the centre ad into a new version with only that thing changed. Then the labels "NEW CHARACTER / NEW LOCATION / NEW OUTFIT / NEW LANGUAGE" surround the final ad, and it explodes into a wall of variants.

## Breakdown
- **Text and graphics:**
  - The centre ad is a 9:16 card at about 30 % of the frame height. The option groups sit in the four corners with a small grey caption under each.
  - Selected options get a lime ring.
- **Cuts and timing (about 1 s per option):**
  1. The cursor clicks an option.
  2. The centre card flips on its Y axis (or ripples with a lime glow) into the new version. The rest of the board doesn't move.
  3. After four changes, the corners clear and the four "NEW …" labels fade in around the card.
  4. The card multiplies into a wall: a grid of 15–20 variants that drifts slowly, then blurs behind the next prompt.
- **Before it:** "YOUR TOP PERFORMER" with the real numbers under it (ROAS, CTR), see [proof-numbers](proof-numbers.md).
- **Sound cues:** a click and a card-flip swish per change.

## How to make it
- **Model:** the variants are real AdFlex generations (same ad, one attribute changed each time). Quote the credits first.
- **Edit recipe (Remotion):**
  - The board is laid out in code. The centre card is a `Clip` or `Img` per variant.
  - The flip: `ry` from 0 to 90° (old) then −90° to 0 (new) on the house spring, about 0.3 s.
  - The wall: a grid of `Img`s that scales from the centre card's rect with a 30 ms stagger.

## Watch out for
- Every option and every variant must be real output from AdFlex (house rule: no mockups). Use invented brands only.
- AdFlex version: selection rings and the cursor highlight in the Generate purple. For Arabic markets, the language chips can be Arabic dialects or countries (السعودية، الإمارات، الأردن), which matches the "localize" story.

## Examples
- Reference only so far.
