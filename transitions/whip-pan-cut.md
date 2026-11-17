---
name: "Whip-pan cut (footage)"
slug: "whip-pan-cut"
type: "transition"
fits: [social, ad, hero]
source: "Higgsfield Talent Contest card, 11.55–11.9 s: https://static-public-media.higgsfield.ai/cards/9a1e389f-efeb-4b7a-a0e6-2b39defe2116.mp4 · page https://higgsfield.ai/contests/talent-contest"
used_in: [workflow-hero]
---

# Whip-pan cut (footage)

## What it looks like
The camera in the footage whips sideways so fast that the picture smears and over-exposes for a few frames, then lands on a new shot. Unlike [whip-push](whip-push.md), which slides flat cards, this happens inside the footage: the world itself spins past.

## Breakdown
- **Transitions:**
  1. 11.55–11.70 s: the old shot's label erases.
  2. 11.72 s: the cut. The next clip *starts* in the middle of a whip pan.
  3. 11.72–11.84 s: 3 frames of heavy directional blur. The highlights bloom almost to white.
  4. 11.88 s: it lands on the new framing (a woman standing on the track in a stone archway).
  5. About 0.3 s after landing, the new label types on.
- **Sound cues:** a sharp whoosh, very short (0.2–0.3 s).

## How to make it
- **Model:**
  - *AI version:* prompt the clip to start with "a fast whip pan from the left that lands on…". Most video models do a whip pan well when it's the first beat.
  - *Edit version:* no model needed.
- **Edit recipe (any footage):**
  - End clip A with 2 frames of `MBlur` x blur rising to about 60 plus `translate` moving with the pan.
  - Start clip B with 3 frames of the same blur falling, plus a brightness lift (`filter: brightness(1.6)` easing back to 1).
  - In ffmpeg: `xfade=transition=hblur:duration=0.2` is a rough stand-in.

## Watch out for
- Both halves must pan the same direction.
- Avoid it on talking heads mid-sentence; it's for jumping between places.

## Examples
- Reference only so far.
