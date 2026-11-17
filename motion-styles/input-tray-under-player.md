---
name: "Input tray under the player"
slug: "input-tray-under-player"
type: "graphics"
fits: [hero, ad]
source: "Kling 4.0 — now on Higgsfield (36 s), 10.4–17 s and 23.4–31 s: https://video.twimg.com/amplify_video/2112922956435484672/vid/avc1/1920x1080/N_XjrT0_e4YGBaRk.mp4 · page https://whatships.com/videos/kling-4-higgsfield/"
used_in: []
---

# Input tray under the player

## What it looks like
The output plays in a 16:9 player in the middle of a light set, framed by « » chevrons on both sides, and under it sits a row of the inputs that made it: a character sheet, a weapon, an audio waveform. Later the same tray holds three frames, START FRAME 1 / MIDDLE FRAME 2 / END FRAME 3, and as the clip plays past each one, that step lights up in the accent colour. You see the ingredients and the result at once, and the highlight tells you which ingredient is "on" right now.

## Breakdown
- **Text and graphics:**
  - A header above the player names the feature ("OMNI REFERENCE"): squared, wide all-caps, one word per line in the accent colour.
  - The chevrons are a recurring motif in the film. They pulse beside headlines.
  - The tray: small cards in one row under the player. The active card turns pink (magenta ~#E0167A). The others stay neutral.
- **Cuts and timing:**
  - 10.4–17 s: "REFERENCE" → "OMNI REFERENCE", the input cards, then the player with the input tray under it.
  - 23.38–23.95 s: the previous player swings away in 3D and a START / MIDDLE / END list builds. Then 25–31 s: the full clip with the 3-step tray, the highlight moving with playback.
  - Few cuts (7 in 36.5 s), but a new graphic beat every 1.5–2 s.
- **Look:** white → pale lime gradient with soft pink corner glows, black type.

## How to make it
- **Model:** the output is a real generation, and the tray holds the exact inputs that run used. No credits beyond the generation itself.
- **Edit recipe (Remotion):**
  - Player: a `Clip` in a rounded frame filling the centre third. Chevrons: SVG on either side, pulsing at ≤1.05× scale.
  - Tray: one `Crop` (or `Img`) per input, entering on the house spring (mass 0.6, stiffness 140, damping 12) with ≤50 ms stagger. Header with `Wipe`.
  - Highlight: work out the active card from the clip's own time (`f − clipStart` against each input's timestamp), and drive that `Crop`'s `glow` 0 → 1 with `ip` over 0.15 s. The highlight then follows the footage, not a guessed beat.
  - A slow push-in on the whole set (`Cam` `s` 1 → 1.03 over the beat), so nothing is static.

## Watch out for
- Only show slots the run really used. If the model took one reference image, the tray has one card. Never fake START / MIDDLE / END frames that AdFlex didn't send.
- Keep the tray cards small so the player stays the hero. The tray is a caption, not a second grid.
- AdFlex version: the active card in the Generate purple (#8337F1 → #6730D4) with a sparkle-gradient glow (#C95AC5 → #55AAFF). The header is in Archivo, with the accent word in Archivo italic or a wider width. Good fits: product photo + logo → ad, and image → video with its real start frame.

## Examples
- Reference only so far. Related: [slot-list](slot-list.md) (the START / MIDDLE / END build before it), [compare-cards](compare-cards.md), [in-scene-widgets](in-scene-widgets.md).
