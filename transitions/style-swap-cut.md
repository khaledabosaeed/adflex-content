---
name: "Style-swap match cut"
slug: "style-swap-cut"
type: "transition"
fits: [hero, social, ad]
source: "Higgsfield Talent Contest card, 9.55–10.4 s: https://static-public-media.higgsfield.ai/cards/9a1e389f-efeb-4b7a-a0e6-2b39defe2116.mp4 · page https://higgsfield.ai/contests/talent-contest. Also the Genjutsu promo's diagonal anime/real split with 0.5 s matched cuts: https://cdn.higgsfield.ai/card/16eebc9a-8310-4f68-8a02-1e2e6f109169.mp4"
used_in: []
---

# Style-swap match cut

## What it looks like
A hard cut where the situation, framing and motion carry straight through, but the look of the world changes completely: live action becomes anime, a film look becomes 3D, day becomes neon. Because the motion continues across the cut, the eye accepts it as the same moment in a new style. It says "any style" without a word.

## Breakdown
- **Cuts and timing:**
  1. 9.55–9.70 s: the old label erases letter by letter ("ANY GENRE" → "AN") just before the cut.
  2. 9.72 s: a hard cut from a realistic roller-coaster selfie to an anime-styled coaster with a cartoon beaver. The camera keeps moving forward at the same speed.
  3. 9.75–9.95 s: the new label types on letter by letter ("ANY STYLE").
  4. About 0.5 s later, a character whips into the frame from the left to give the new shot its own beat.
- **Transitions:** none, just the cut. The match is in camera speed and direction, horizon height and subject position.
- **Sound cues:** keep the same sound bed across the cut so the ear says "same moment".

## How to make it
- **Model:**
  - Generate one clip, then restyle it with a style-transfer or video-to-video model (Genjutsu-type, or Kling or Seedance with a reference image).
  - Or generate two clips from the same start frame, restyled with image-to-image first.
  - Quote the credits first.
- **Edit recipe:** cut on a frame where both clips have the same motion vector. Use `TransitionSeries` with no transition. Type the label out over the last 0.15 s before the cut and type the new one in after (see [corner-type-labels](../motion-styles/corner-type-labels.md)).

## Watch out for
- If the camera speed differs between the two clips, the cut jolts. Retime one clip with `playbackRate` to match.
- Two or three swaps in a row max. After that it's a montage, not a reveal.
- For AdFlex: the same ad shot in "UGC phone", "studio product" and "3D render" looks, which is exactly what a campaign of variants is.

## Examples
- Reference only so far.
