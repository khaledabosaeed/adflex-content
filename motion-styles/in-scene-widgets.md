---
name: "In-scene control widgets"
slug: "in-scene-widgets"
type: "graphics"
fits: [hero, ad, social]
source: "Higgsfield Miracle launch (54 s, 20.3M views), 7–51 s: https://video.twimg.com/amplify_video/2118732342634106880/vid/avc1/1920x1080/coaCctE6YY5X9cX4.mp4 · page https://whatships.com/videos/higgsfield-miracle/. Higgsfield AI Influencer (49 s), 9–18 s: https://video.twimg.com/amplify_video/2107111382588243968/vid/avc1/1920x1080/GfUBBqFaYQawYM7M.mp4 · page https://whatships.com/videos/higgsfield-influencer/"
used_in: []
---

# In-scene control widgets

## What it looks like
Instead of cutting to a UI screen, one small, real-looking control sits right on top of the footage and the footage obeys it. A "change tree" prompt pill, and the tree turns red. A "Fur Length" slider, and the dog's fur grows. A speed dial at "23", then "100", and the skater slows. A light sphere with a time of day, and the street goes from noon to night. A character panel next to a dancer, and his hair and body change as each option is clicked. The product looks like it controls reality.

## Breakdown
- **Text and graphics:**
  - The widget is small (10–20 % of the frame), glassy or dark, with a lime active state, placed beside the subject rather than over it.
  - Each feature gets a big 2–3-line white uppercase label in a top corner ("LOCALIZED / REAL TIME / EDITING", "SELECTIVE / SPEED / CONTROL") with a small paragraph of explanation under or beside it.
- **Cuts and timing:** 4–6 s per feature (the longest beats in these films), because the change has to play out. The widget moves first, and the footage reacts 0.1–0.2 s later.
- **Camera:** the footage keeps its own camera move; the widget stays fixed on screen.
- **Sound cues:** UI clicks plus a sound for the change itself (fur rustle, time-lapse whoosh).

## How to make it
- **Model:** the "before" and "after" footage is generated (or the after is an edit of the before, start frame = before). Quote the credits first.
- **Edit recipe (Remotion):**
  - The widget is HTML/SVG over a `Clip`. Its value is driven by `ip`, and the crossfade or wipe between before and after footage uses the same `p`, so they move together.
  - A wipe that follows the slider looks better than a crossfade.

## Watch out for
- The widget must be a real AdFlex control (or a faithful crop of one), not an invented one. If AdFlex doesn't have that control, use the real prompt box instead ("change tree" style).
- One widget per shot.
- AdFlex version: the active state in the Generate purple. Good fits: background swap, colour change on a product, aspect-ratio change for each platform.

## Examples
- Reference only so far. Related: [in-world-oner](in-world-oner.md) (the same idea with gestures instead of widgets).
