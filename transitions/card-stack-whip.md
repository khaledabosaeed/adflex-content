---
name: "Card-stack whip"
slug: "card-stack-whip"
type: "transition"
fits: [hero, ad]
source: "Higgsfield Short Drama Studio card (14.9 s, 1080×810, silent), 0.84–1.55 s: https://static-public-media.higgsfield.ai/cards/788c93dc-a6fc-42f7-924d-949b2aae8a51.mp4 · page https://higgsfield.ai/short-drama"
used_in: []
---

# Card-stack whip

## What it looks like
A UI card turns pale and fans out into a stack of ghost copies, like a deck being dealt to the right. The front of the deck fills with the next step's image, and the camera zooms through it into the next card, which settles with a slight 3D tilt. It moves from one UI step to the next without a cut.

## Breakdown
- **Transitions (Short Drama: "Upload your script" → "Style"):**
  1. 0.84 s: the card turns white-grey and leaves 4–5 copies behind it. Each copy is offset to the right and a little dimmer. The deck spreads over about 0.3 s.
  2. 1.13 s: the front copy fills with the next step's footage (a green field), still card-sized.
  3. 1.17–1.25 s: a zoom-blur whip into it. The footage fills the frame and blurs past the camera.
  4. 1.25–1.55 s: the new card ("Style") lands from the right with a Y tilt of about 15° that settles to flat.
  5. Labels ("Style", "Aspect Ratio", "16:9") slide in from the left with horizontal blur and land about 0.15 s after the card.
- **Text and graphics:** the product lockup (logo + "SHORT DRAMA · EARLY PREVIEW") stays fixed at the bottom the whole time. Only the card area changes.
- **Sound cues:** a paper-flick or card-deal tick on the fan-out, then a whoosh on the zoom.

## How to make it
- **Model:** none. It's UI recordings or stills plus edit.
- **Edit recipe (Remotion):**
  - The deck: render the card 5 times with `translate: i × 36 px`, `opacity: 1 − i × 0.17` and a white overlay that rises to about 70 %. Animate the spread with `ip(f, [at, at + 0.3 s], [0, 1], OUT)`.
  - The fill: crossfade the front copy's content to the next clip over 0.1 s.
  - The zoom: wrap it in `Cam` with `scale` from 1 to about 4, `ease-in`, plus a radial blur (`blur` on `Cam`), over 0.15 s.
  - The landing: the next card in `UIWindow` with `ry` from 15° to 0 on the house spring (see "House motion rules" in [motion-styles/README.md](../motion-styles/README.md)), and `whipIn` for the x offset.

## Watch out for
- Keep the deck to 4–5 copies. More reads as a glitch.
- The deck must be paler than the real card, or it looks like five cards and not one card's motion trail.
- AdFlex version: tint the ghost copies with the brand lavender (#D9C1FB), not neutral grey, on a dark background.

## Examples
- Reference only so far.
