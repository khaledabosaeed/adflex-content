---
name: "Cursor auto-zoom"
slug: "cursor-auto-zoom"
type: "camera"
fits: [social, ad]
source: "Open-source AI studio (mentioned on GitHub) — People… (84 s), 5.43–5.63 s (in), 25.47–25.73 s (out): https://video.twimg.com/ext_tw_video/2056077473591525376/pu/vid/avc1/1280x720/52jvhhZ7hNt-xRsY.mp4 · page https://whatships.com/videos/open-source-ai-studio-mentioned-on-github/"
used_in: []
---

# Cursor auto-zoom

## What it looks like
A plain screen recording, but the virtual camera follows the hand. It eases in on the area around the cursor, keeps panning as the cursor moves and the page scrolls, and eases back out to the whole window (wallpaper included) when the action moves somewhere else. It's the Screen Studio look: the viewer always sees what's being clicked, big enough to read.

## Breakdown
- **Camera:**
  - In: 5.43–5.63 s, an eased 0.2 s zoom from the full window to the cursor area.
  - Follow: while zoomed, the camera pans with the cursor and with the scroll.
  - Out: 25.47–25.73 s (0.26 s), back to the window and the wallpaper.
  - About 10 zooms in 83.5 s, one every 6–8 s (around 38, 47, 52, 58, 62, 68, 76 and 80 s).
- **Cuts and timing:** one hard cut in the whole video (43.13 s), landing already zoomed in.
- **What's missing:** no titles, captions, logo, end card or sound. That part is a counter-example.

## How to make it
- **Model:** none.
- **Capture:** record the real AdFlex flow on prod at 2× pixel density, with the cursor position logged per frame (a Playwright script driving `page.mouse`, or a recorder that exports cursor data).
- **Edit recipe (Remotion):**
  - The recording as a `Clip`, full frame or inside `UIWindow`, wrapped in `Cam`.
  - Scale around the cursor (`Cam` `ox`/`oy`) and pan with `x`/`y`, following a smoothed cursor position (about 0.3 s of lag, so the camera doesn't jitter). `s` goes from 1 to the zoom level with `ip(..., INOUT)`: 0.2 s in, 0.26 s out.
  - Zoom level: the smallest at which body text reads on a phone (often about 2×, our choice). Clamp so the window edge never shows while zoomed.
  - `MBlur` on fast pans. Add labels ([corner-type-labels](corner-type-labels.md)), since the reference has none.

## Watch out for
- Not for heroes. The hero rule is "UI that matters is shown big: a card or input fills the centre third of the frame, not a full-screen recording with a zoom". Use this for tutorials, social how-tos and long demos.
- Zoom only when the action moves. A zoom every second is seasick.
- AdFlex version: a cursor highlight ring and labels in the Generate purple (#8337F1 → #6730D4), labels in Archivo. In Arabic, labels in Cairo, and the follow pans run right to left with the UI.

## Examples
- Reference only so far. Related: [ui-step-walkthrough](ui-step-walkthrough.md), [ui-macro-dolly](ui-macro-dolly.md).
