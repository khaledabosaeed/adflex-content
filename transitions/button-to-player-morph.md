---
name: "Button → player morph"
slug: "button-to-player-morph"
type: "transition"
fits: [hero, ad]
source: "Higgsfield Short Drama Studio card, 10.30–11.0 s: https://static-public-media.higgsfield.ai/cards/788c93dc-a6fc-42f7-924d-949b2aae8a51.mp4 · page https://higgsfield.ai/short-drama. Related: Bolt.new launch film by Skale, the 'Merge' button lift-out: https://whatships.com/videos/bolt-skale-film/ · mp4 https://video.twimg.com/amplify_video/2038985258834546688/vid/avc1/1920x1080/34qt6R1z97IhpDrq.mp4"
used_in: [workflow-hero]
---

# Button → player morph

## What it looks like
A cursor clicks a real button (Preview, Generate, Run). The button lights up in the accent colour, turns into a white card, and that card grows and reshapes into the video player showing the result. The thing you clicked *becomes* what it made: a shared-element transition with no cut.

## Breakdown
- **Transitions (Short Drama: "Preview" → vertical player):**
  1. 10.30 s: the cursor clicks. The button fills with lime and gets a press (about 0.97× and back).
  2. 10.38–10.50 s: the page scrolls up and blurs slightly. The button pops forward and turns white.
  3. 10.55–10.80 s: the white card grows from button size to a 9:16 player in the middle of the frame. Its corner radius stays the same. The result video fades up inside it from white.
  4. From 11.0 s: the episode list slides in on the right.
- **Sound cues:** a click, then a soft rising whoosh while the card grows.

## How to make it
- **Model:** none. Use the real recording of the button and the real result clip.
- **Edit recipe (Remotion):**
  - Measure the button's rect in the recording (x, y, w, h) and the player's final rect.
  - Animate one `div` between them: `left/top/width/height` with `ip(..., INOUT)` over 0.25 s, fixed `borderRadius`, white background.
  - Inside it, `Clip` the result video with `opacity` from 0 to 1 during the last 60 %.
  - The page behind: `Crop` + `Cam` with a small upward `y` and `blur` of up to 4 px.
  - Same idea as the photo → node move in workflow-hero v10 (see `lessons/editing.md`, "Swapping media inside a real UI screenshot"), run in reverse.

## Watch out for
- The button must be the real AdFlex button from a real recording, at the real size (house rule: no mockups).
- Keep the aspect change in one move. If the card changes shape and then size, it reads as two steps.
- AdFlex version: the Generate button purple (#8337F1 → #6730D4) on the press, not lime.

## Examples
- Reference only so far.
