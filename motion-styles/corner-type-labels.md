---
name: "Corner labels: typed and smeared"
slug: "corner-type-labels"
type: "graphics"
fits: [hero, social, ad]
source: "Higgsfield Talent Contest card (typed variant, 3.25–14.1 s): https://static-public-media.higgsfield.ai/cards/9a1e389f-efeb-4b7a-a0e6-2b39defe2116.mp4 · page https://higgsfield.ai/contests/talent-contest. Higgsfield Seedream 5.5 card (smeared variant, 2.5–16 s): https://static-public-media.higgsfield.ai/cards/bdb7ff38-7e95-4e3e-bfa6-c965ae7f266a.mp4 · page https://higgsfield.ai/ai/image?model=seedream_5_5"
used_in: []
---

# Corner labels: typed and smeared

## What it looks like
One short label per shot sits at the bottom left over the footage and names the feature ("ANY GENRE", "EDIT AFTER EDIT"). It never competes with the picture: it arrives just after the shot settles and leaves just before the cut. There are two variants, a plain one that types letter by letter and an extended one that smears in and out sideways.

## Breakdown
- **Typed variant (Talent Contest):**
  - White bold sans (Inter-like), uppercase, about 6 % of the frame height, with a soft shadow.
  - Types on at about one letter every 2 frames (12 letters per second), starting about 0.1–0.3 s after the shot lands.
  - Erases letter by letter from the end, at the same speed, finishing just before the cut ("ANY GENRE" → "AN" → cut).
  - Two to three words max ("ANY GENRE", "ANY STYLE", "ANYTHING GOES"). The words build a sequence across shots.
- **Extended variant (Seedream):**
  - A wide extended grotesk, uppercase, two sizes on the first line: big words with small connecting words ("**EDIT** AFTER **EDIT**"). A tiny second line explains ("THE REST OF THE FRAME STAYS PUT").
  - Enters in 2 frames as a horizontal smear (stretched streaks resolving into letters) and exits the same way.
  - It stays up for the whole feature (2.5–3 s), even across camera moves.
- **Position:** bottom left, about 5 % margins. The same spot in every shot.
- **Sound cues:** none for typed. A tiny swish on each smear.

## How to make it
- **Model:** none.
- **Edit recipe (Remotion):**
  - Typed: `Typed` with `per` ≈ 2 frames at 24 fps (0.08 s), and an `out` that removes glyphs from the end. Remove the blur on each glyph for a crisp type-on.
  - Extended: Archivo at `wdth 125` for the big words and `wdth 100` for the small ones (`cond(wght, wdth)` in `lib.tsx`). The smear is `MBlur` x from about 60 to 0 over 2 frames with `scaleX` from 1.6 to 1.
  - Captions sit above the footage layer and below any transition overlay.

## Watch out for
- Arabic: put the label at the bottom right and type right to left. Cairo Black for the big word, Cairo Bold for the small ones. Don't smear Arabic so wide that the joins break; keep `scaleX` under 1.3.
- One label per shot. If the shot also has a UI caption, drop the label.
- AdFlex comes first: when the label names a feature, use the AdFlex name for it.

## Examples
- Reference only so far.
