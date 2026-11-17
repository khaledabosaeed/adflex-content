---
name: "Motion match cut"
slug: "motion-match-cut"
type: "transition"
fits: [social, ad, hero]
source: "Higgsfield Genjutsu — transfer motion onto a character (59 s), 0–8.525 s: https://video.twimg.com/amplify_video/2094850792952102912/vid/avc1/1920x1080/waVUeOOW9YyGTdme.mp4 · page https://whatships.com/videos/higgsfield-genjutsu/"
used_in: []
---

# Motion match cut

## What it looks like
One movement (a run, a head turn, a reach) carries on across hard cuts between different characters and different worlds. Framing, direction and speed match on every cut, so the eye reads one motion handed from person to person. Unlike [style-swap-cut](style-swap-cut.md), where the same scene changes look, here the subject and the world change and only the motion stays.

## Breakdown
- **Cuts and timing:**
  - Cold open (24 fps, 0–8.5 s): one character runs down a tunnel, intercut with the same run by other characters in other places (a hallway, a burning city, a waterfall), about 1 s per shot.
  - The key cut, 8.23–8.525 s: the camera tracks the runner, his head sweeps across the frame (8.23–8.48 s), and at 8.525 s it cuts to the back of another runner's head on a rooftop, framed and moving the same way. The title appears on the cut frame.
  - After it (8.5–12 s), the runs carry on under the title. At 11.51 s another hard cut keeps the same running pose in a new place.
- **Transitions:** none, just cuts. The match is in subject position and size, motion direction, camera speed and horizon height. Cut mid-motion, never on a pause.
- **Sound cues:** one sound bed (footsteps on the beat) across every cut, so the ear hears one move.

## How to make it
- **Model:** yes. Generate one driving clip of the motion, then put it on each character and world with a motion-transfer or video-to-video model, or generate each shot from the same start pose with the same camera wording. Quote the credits first.
- **Prompt wording (camera line, paste-ready):**
  > tracking shot from behind at shoulder height, subject centred, running away from camera at a steady pace, camera keeps the same distance
- **Edit recipe (Remotion):** plain `Sequence`s (or `TransitionSeries` with no transition). Find cut frames where the subject's centre and speed match; align with `Clip`'s `trimBefore` and retime with `playbackRate`. The title lands on the cut frame on the house spring (mass 0.6, stiffness 140, damping 12), or with `Wipe`.

## Watch out for
- If the speed or direction differ much, the cut jolts. Fix it with `playbackRate` before anything else.
- About 1 s per shot in the montage, with the last shot given room to breathe under the title. Five or six worlds is plenty.
- Take only the device: never the reference's characters, worlds or footage.
- AdFlex version: the motion passes through outputs a brand would really make (the same product reach in a UGC phone shot, a studio shot, a 3D render). Title in Archivo (Cairo for Arabic) with one word in Generate purple (#8337F1 → #6730D4); if anything glows, the sparkle gradient (#C95AC5 → #55AAFF). Hard cuts only, no flashes.

## Examples
- Reference only so far.
- Related: [style-swap-cut](style-swap-cut.md), [object-carry](object-carry.md) (an object, not a motion, as the thread), [in-world-oner](../motion-styles/in-world-oner.md).
