---
name: "Foreground wipe"
slug: "foreground-wipe"
type: "transition"
fits: [hero, ad, social]
source: "Higgsfield Seedream 5.5 card (16.3 s, 16:9, silent), 5.10–5.80 s and 12.80–13.35 s: https://static-public-media.higgsfield.ai/cards/bdb7ff38-7e95-4e3e-bfa6-c965ae7f266a.mp4 · page https://higgsfield.ai/ai/image?model=seedream_5_5"
used_in: []
---

# Foreground wipe

## What it looks like
The camera moves until something close to the lens (someone's hair, a shoulder, a hand) fills the frame for a moment. When it clears, the scene, the subject or the caption has changed. The cut hides inside the dark, out-of-focus blocker, so a long sequence feels like one take.

## Breakdown
- **Transitions:**
  - *Hair wipe (5.10–5.80 s):*
    1. The caption exits first with a horizontal smear (2 frames).
    2. The camera pushes into the back of a woman's head until her hair fills the frame (about 0.1 s fully covered, at 5.43–5.52 s).
    3. Two out-of-focus hands rise into the frame, and the scene behind is now a new shot.
    4. The new caption smears in from the left at 5.73 s.
  - *Shoulder pan (12.80–13.35 s):*
    1. The camera pans right in a studio.
    2. A crew member's head passes the lens (2 frames) and the camera lands over their shoulder, looking at a tablet that shows the final image.
    3. The caption smears in 0.2 s after the frame clears.
- **Cuts and timing:** the blocker covers the frame for just 2–3 frames. Everything else is continuous camera motion.
- **Sound cues:** a cloth swish or a soft whoosh as the blocker passes.

## How to make it
- **Model:**
  - *AI version:* write the blocker into the prompt: "camera pushes past the woman's hair, which fills the frame; when it clears…". Or generate two clips and cut between them on the blocker frames.
  - *Edit version:* no model needed.
- **Edit recipe (any footage):**
  - End clip A on a frame where a foreground object covers the lens, and start clip B on a frame where one is clearing (same colour and direction if possible).
  - A 2-frame crossfade inside the dark area is invisible.
  - If neither clip has a blocker, add a separately shot or generated foreground pass (a shoulder, a plant, a hand) with a luma or alpha matte and move it across with `MBlur`.

## Watch out for
- The blocker must move in the same direction as the camera, or the cut shows.
- It only works on live action or realistic AI footage, not on UI.

## Examples
- Reference only so far. The whole oner around it: [in-world-oner](../motion-styles/in-world-oner.md).
