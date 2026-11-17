---
name: "Dive through an object"
slug: "dive-through"
type: "transition"
fits: [hero, ad, social]
source: "Higgsfield Talent Contest card (14.5 s, 16:9, silent), 6.30–7.13 s: https://static-public-media.higgsfield.ai/cards/9a1e389f-efeb-4b7a-a0e6-2b39defe2116.mp4 · page https://higgsfield.ai/contests/talent-contest. Also our own workflow-hero v3 (dive through the ×)."
used_in: [workflow-hero]
---

# Dive through an object

## What it looks like
The camera flies at an object in the scene that has a hole or a screen in it (the "0" of a 3D number, a button, a phone screen). The hole already shows the next world. The camera speeds up, the object's edge glows white-hot as it passes, and on the far side the next scene is already moving. It's a portal: the cut is inside the object.

## Breakdown
- **Transitions (Talent Contest: the stadium → the roller-coaster world):**
  1. 6.30 s: the chrome "$1,000,000" stands in the stadium. Inside the centre "0" a different scene already plays (fire and a coaster car).
  2. 6.30–7.09 s: the camera pushes into that "0". It's slow for the first 0.3 s, then accelerates hard (about 0.8 s in all). The other digits slide off to the sides with motion blur.
  3. The last 0.15 s: the 0's rim fills most of the frame and glows white-hot, and the fire inside fills the screen.
  4. 7.13 s: a hard cut to the new world, already in motion (the coaster car flying down a track), with letterbox bars.
  5. 7.17 s: the new label types on ("ANY GENRE").
- **Our version (workflow-hero v3):** the camera dives 11× through the lifted Send button with an accelerating zoom, a roll and blur. A light flash and speed streaks cover the cut. The next scene lands out of a 3.4× zoom with blur and roll.
- **Sound cues:** a rising whoosh that peaks on the cut, then the new scene's sound comes straight in.

## How to make it
- **Model:**
  - *AI version (like the reference):* generate the move as one video. The first frame is the object with the next world inside, and the last frame is inside the next world. Gemini Omni Flash 1.2 or Seedance with start and end frames (see `lessons/models.md`). Quote the credits first.
  - *Edit version:* no model needed.
- **Edit recipe (Remotion), from `lessons/editing.md` → "Hard transitions in Remotion":**
  - Put a 2D `Cam` wrapper outside the perspective layer and set `transformOrigin` to the object's on-screen point.
  - `scale = Math.pow(10, p)` with an ease-in. It accelerates far better than a linear zoom.
  - Show the next scene's clip clipped inside the hole from the start, so the portal is real.
  - Hide the cut under `Flash` (about 0.35 s) plus `Streaks` from the same point, or with the hole's own glow as in the reference.
  - Land the next scene out of a 2–3× zoom with blur, so the motion keeps going forward.

## Watch out for
- Fade the outgoing scene to 0 right after the flash peaks, or it lingers behind the next one.
- The team swapped the v3 dives and flashes for calmer whips in v4. Use one dive per video, on the biggest moment.
- The hole needs real content in it before the dive starts. A dive into a blank shape is just a zoom.

## Examples
- workflow-hero v3: `renders/workflow-hero-v3.mp4` (git-ignored), ALFA → canvas.
