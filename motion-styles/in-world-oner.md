---
name: "In-world AI oner"
slug: "in-world-oner"
type: "camera"            # also covers graphics
fits: [hero, social, ad]
source: "Higgsfield Seedream 5.5 card (16.3 s, 16:9, silent): https://static-public-media.higgsfield.ai/cards/bdb7ff38-7e95-4e3e-bfa6-c965ae7f266a.mp4 · page https://higgsfield.ai/ai/image?model=seedream_5_5. Also the Talent Contest card (one take through several worlds): https://static-public-media.higgsfield.ai/cards/9a1e389f-efeb-4b7a-a0e6-2b39defe2116.mp4"
used_in: []
---

# In-world AI oner

## What it looks like
What feels like a single camera take moves through a real-looking set, and the product's features happen *inside* the shot. A hand pinches or taps in the foreground and the subject's jacket changes, the background turns into a transparency checkerboard, then into a studio. At the end, the camera pulls back past the crew to a tablet that shows the finished image. The edits are gestures in the world, not UI.

## Breakdown
- **Camera (Seedream):**
  - 0–1.5 s: an extreme macro (a mouth with a jewelled grill) pulls back fast to a medium shot of a man on a steaming New York street. The title sits over it.
  - 1.5–2.5 s: the pull-back continues and reveals a camera operator and a tripod. It's a shoot.
  - 2.5–5.0 s: the camera follows a stylist in a yellow coat across the frame (feature 1, "PHOTOREAL SKIN AND LIGHT").
  - 5.1–5.8 s: [foreground-wipe](../transitions/foreground-wipe.md) through her hair to her hands.
  - 5.8–8.5 s: her hands frame the man and pinch. His fur jacket becomes a leather jacket; the rest of the frame doesn't change (feature 2, "EDIT AFTER EDIT").
  - 8.5–10 s: she points. The street turns into a grey-and-white checkerboard behind him (feature 3, "TRANSPARENT PNGS").
  - 10–12.75 s: lights come up and he's in a white-floored studio with speakers.
  - 12.8–13.35 s: [foreground-wipe](../transitions/foreground-wipe.md) over a crew member's shoulder to a tablet showing a magazine cover of him.
  - 14.8–15.5 s: lime pixel blocks ripple over the cover and the type on it changes (feature 4, "SMALL TEXT STAYS SHARP").
- **Cuts and timing:** about one feature every 2.5–3 s. Hard cuts only at 8.62, 10.00 and 13.08 s, all hidden in a blocker or a lighting change.
- **Transitions:** the edit *is* the transition. A gesture, then the change, with the rest of the frame left alone.
- **Text and graphics:** labels in the [corner-type-labels](corner-type-labels.md) "extended" variant.
- **Grade and texture:** a filmic, warm daylight street, then cool studio light. Shallow depth of field.

## How to make it
- **Model:** a video model that does long continuous moves with start and end frames. Generate one segment per feature and join them on a blocker or gesture frame.
  - The in-shot edits: generate the "before" and the "after" stills with AdFlex image edit (same seed and framing), then animate each with its start frame = the previous segment's last frame (`extract_video_frame` → image-to-video, 0 credits for the frame).
  - Quote the credits for every segment first.
- **Prompt wording (paste-ready, adapt):**
  > Continuous handheld cinematic shot, 35 mm, shallow depth of field. The camera pulls back from an extreme close-up of [product detail] to reveal [person] on a [location] during a photo shoot, crew and camera visible. A stylist's hand enters the foreground, out of focus, and pinches the air; [one element] changes to [new element] while everything else in the frame stays exactly the same.
- **Edit recipe:**
  - Join the segments with [foreground-wipe](../transitions/foreground-wipe.md) or on the gesture frame.
  - The pixel-block reveal: a grid mask whose cells flip on a random stagger over 0.4 s, with brand-coloured cell edges.

## Watch out for
- "The rest of the frame stays put" is the claim. Check the after-frame for drift (faces, background) before animating.
- Only invented or logo-free brands in the generated footage (house rule). Watch for real logos on jackets, taxis and signs.
- AdFlex version: the gestures become what AdFlex does: change the product colour, swap the background for a brand scene, turn one shot into an ad with a headline. The final tablet or phone shows a real AdFlex ad.

## Examples
- Reference only so far.
