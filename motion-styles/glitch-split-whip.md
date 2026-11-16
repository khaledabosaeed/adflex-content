---
name: "Glitch-split title + whip-blur cards"
slug: "glitch-split-whip"
type: "graphics"          # also covers transitions
fits: [hero, ad, social]
source: "Higgsfield Genjutsu launch promo (19 s): https://cdn.higgsfield.ai/card/16eebc9a-8310-4f68-8a02-1e2e6f109169.mp4"
used_in: [workflow-hero]
---

# Glitch-split title + whip-blur cards

## What it looks like
The title glitches in and splits open. A small selected chip appears in the gap and grows into the first scene. After that every scene change is a fast horizontal whip with heavy motion blur. Text is condensed uppercase in two weights, revealed by a left-to-right wipe.

## Breakdown
- **Title (0–1.8 s at 24 fps):**
  - The wordmark starts as a thin outline. Within ~6 frames it fills in with a strong chromatic split: a red glow on the left, a blue offset, and a few letters jumping up or down for 2–3 frames.
  - A thin light streak (pink → white head) runs along the word's middle in ~10 frames. It leaves the lower half of the letters in a different fill (two-tone).
  - Hold ~0.5 s, with one small glitch blip.
  - The word splits at a letter. A rounded chip with **design-tool selection handles** (four small coloured squares and a thin outline) opens in the gap with footage inside.
  - The chip grows to full frame in ~0.6 s and shoves the halves of the word off screen with horizontal motion blur.
- **Transitions:**
  - Whip push: the outgoing scene accelerates off left in ~6–9 frames with heavy horizontal blur, and the next one arrives from the right, braking hard (expo-out, ~12 frames).
  - Cards arrive with a slight Y tilt that settles.
  - Small elements fly in from off-screen blurred and spinning, then land with a small bounce.
  - Input → output: a glowing horizontal light line sweeps across and the area behind it is converted.
- **Text and graphics:**
  - Condensed grotesk in uppercase, stacked, two weights: a light line over a bold line ("SCALE YOUR / **VIRAL TRENDS**").
  - Revealed left to right: a dim ghost of the letters runs just ahead of the solid edge.
  - Big single words ("KEEP", "RUN IT.") rise out of a line mask in ~8 frames.
  - Text exits as a fast slide left with blur.
- **Grade and texture:** the reference uses a light pastel background (lime and pink). In our dark brand version the two-tone fill uses the pink → violet → blue brand gradient.
- **Sound cues (if sound is added):** a whoosh on each whip, a glitch zap on the title fill, and a soft riser under the chip growing.

## How to make it
- **Model:** none. It is all edit and graphics; no paid generation.
- **Edit recipe (Remotion), in `videos/hero/workflow-hero/build/remotion/src/`:**
  - The title is `scenes/Title.tsx`.
  - The helpers are in `lib.tsx`:
    - `MBlur`: directional blur, an SVG `feGaussianBlur stdDeviation="x 0"` that sits beside the content.
    - `whipOut` and `whipIn`: the x offset and blur from the per-frame speed.
    - `Wipe`: wipe or rise text.
    - `Label`: two-weight stacked text.
    - `ScanLine`: the input → output line.
  - **Font:** Archivo variable (`public/Archivo-var.ttf`). Titles use wght 900 / wdth 125; labels use wdth 68–72, light 300 over bold 860.
  - **Overlap the whips:** start the outgoing whip ~6 frames before the next scene and let the incoming whip begin on the next scene's frame 0.

## Watch out for
- If the chip's clip and the next scene's clip are not frame-matched, the hand-off jumps. Start the chip's clip at frame `CHIP_AT` and trim the next scene by `(sceneStart − CHIP_AT) × rate`.
- A wide title gets pushed off the screen edge when the split re-centres the gap. Open the chip where the × was, and only centre it while it grows.
- The wipe's ghost layer must be fully masked at progress 0, or a faint letter shows at the left edge before the text's turn.

## Examples
- workflow-hero v4: `renders/workflow-hero-v4.mp4` (git-ignored).
