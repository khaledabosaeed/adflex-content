---
name: "Chapter cards between gags"
slug: "chapter-cards"
type: "edit"              # also covers graphics
fits: [ad, social]
source: "Higgsfield Academy — from prompt to AI film (77 s), 12.2 s, 31.0 s, 62.35 s (chapters 12.2–66 s): https://video.twimg.com/amplify_video/2111187461342982144/vid/avc1/1920x1080/zVJRZIQLHAz0xfQa.mp4 · page https://whatships.com/videos/higgsfield-academy/"
used_in: []
---

# Chapter cards between gags

## What it looks like
The film alternates two worlds. A live-action gag (a host on a retro TV set, something absurd happening) hard-cuts to a dark chapter card: near-black with an accent glow, one big two-weight headline ("START WITH / ONE SENTENCE"), and the feature itself, shown in the real product UI on floating media cards. Then back to a gag, then the next chapter. Each card is one feature, so the film reads like a table of contents with jokes between the pages.

## Breakdown
- **Structure:** gag (3–6 s) ↔ chapter card (4–8 s). Six chapters from 12.2 s to 66 s: START WITH ONE SENTENCE, LARGE LANGUAGE MODEL, FROM ONE PHOTO TO A CAMPAIGN, YOUR ASSET KIT, SET THE SCENE, TRANSFER THE PERFOMANCE (sic).
- **Text and graphics:**
  - Headline: extra-bold extended italic grotesque in two weights and sizes ("START WITH" in small white-chrome caps, "ONE SENTENCE" in lime), with a four-point sparkle at a corner and an accent underline streak.
  - The card: near-black #0A0A0A, a lime radial glow, faint halftone dots.
- **Cuts and timing:**
  - 12.21 s, 30.96 s and 62.35 s: hard cut from footage to the card. The headline words smear in sideways in about 0.1 s.
  - 62.47–62.60 s: media cards fly in from different edges with blocky motion blur. "TRANSFER" smears in from the left and "THE PERFOMANCE" from the right, settled by about 63.0 s.
  - A chapter can end on a UI hit (the GENERATE click at ~18.5 s) and leave with a whip into the next gag (19.21 s).
  - 21 hard cuts in 77 s, about 3.5 s per shot.

## How to make it
- **Model:** the chapter cards hold real AdFlex recordings and outputs. The gag footage is shot, or generated per the brief (quote it first).
- **Edit recipe (Remotion):**
  - Card: `Background` (dark, purple radial glow, dot grid) plus `Grain`. A `Kicker` ("02 · …") for the chapter number.
  - Headline: two lines from opposite sides, each a `whipIn` (mirrored `dist`) through `MBlur`, landing in about 0.1 s. For a calmer card, use `Label` (a light line over a bold line).
  - Media cards: `UIWindow` or `Crop`, entering with `whipIn` + `MBlur` from different edges, ≤50 ms apart, then a slow drift.
  - Exit to the gag: `whipOut`, or a hard cut on the speaker's line.

## Watch out for
- One feature per card and 2–4 words of headline. A card with two features breaks the rhythm.
- Keep the gags short (3–6 s). The chapters are the content.
- The gags are ours (our own talent, set and jokes), never the reference's host or set.
- AdFlex version: the glow and underline in the Generate purple (#8337F1 → #6730D4), the sparkle in the sparkle gradient (#C95AC5 → #55AAFF). Headline in Archivo: the big line in Archivo italic or wide (`cond(900, 125)`), the small line light and condensed. Cairo for an Arabic cut. Good fit: a talking-head reel where each point gets its own card.

## Examples
- Reference only so far. Related: [talking-head-punch](talking-head-punch.md), [corner-type-labels](corner-type-labels.md), [button-press](button-press.md), [whip-push](../transitions/whip-push.md), [hard-cut-blur-settle](../transitions/hard-cut-blur-settle.md).
