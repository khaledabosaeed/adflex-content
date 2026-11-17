---
name: "Pixel-square burst"
slug: "pixel-square-burst"
type: "transition"
fits: [hero, ad, social]
source: "Higgsfield Academy — from prompt to AI film (77 s), 18.6–18.9 s: https://video.twimg.com/amplify_video/2111187461342982144/vid/avc1/1920x1080/zVJRZIQLHAz0xfQa.mp4 · page https://whatships.com/videos/higgsfield-academy/. Higgsfield — Claude Fable 5.1 for 3D spatial design (57 s), 4.05–4.30 s: https://video.twimg.com/amplify_video/2095483820934041600/vid/avc1/1920x1080/SXJf8yUuVvIpqXxB.mp4 · page https://whatships.com/videos/higgsfield-fable-5-1/. Introducing Higgsfield Genjutsu Restyle (30 s), 2.85–3.25 s: https://video.twimg.com/amplify_video/2105412179881332737/vid/avc1/1920x1080/D2Md59y7AaTq6g9E.mp4 · page https://whatships.com/videos/higgsfield-genjutsu-restyle/"
used_in: []
---

# Pixel-square burst

## What it looks like
A cursor clicks a real button (Generate, Send), or a file lands as an attachment, and a handful of small accent-coloured squares burst out of it and dissolve within a third of a second. It says "the AI has started" without a spinner. In a variant, the squares fly the other way and assemble into a bar or label.

## Breakdown
- **Transitions:**
  - Click (Academy, 24 fps, 18.1–19.2 s): the cursor clicks the GENERATE pill at about 18.52 s. Lime pixel squares burst out of the button (18.6–18.9 s). The camera then swings along the button into a motion-blur smear (19.0–19.1 s) and hard-cuts at 19.21 s.
  - Attachment (Fable 5.1, 3.93–4.30 s): the full-frame photo shrinks into a rounded card and cuts to the same image as a chat thumbnail (3.93–4.02 s). From 4.05 to 4.30 s, salmon pixel squares bloom out of the thumbnail across the card and dissolve as the prompt starts typing.
  - Assemble (Genjutsu Restyle, 2.85–3.25 s): purple pixel squares assemble into a bar and "RESTYLE" types into it.
  - Also Playable (8.7–9.17 s): the sparkle button squashes on the click (8.7–8.93 s) and a ring of square pixels radiates out (8.97–9.17 s).
- **Cuts and timing:** the burst lasts about 0.25–0.3 s. The next step (typing, the build) starts as it dissolves.
- **Sound cues:** a soft click, then a light digital sparkle.

## How to make it
- **Model:** none.
- **Edit recipe (Remotion):**
  - The press: the button scales to about 0.97× and back on the house spring (mass 0.6, stiffness 140, damping 12).
  - 12–20 squares (8–16 px) start at the button centre. Each takes an angle and a speed from `random(\`sq${i}\`)` and travels out with `ip(f, [at, at + 0.3 * fps], [0, dist], OUT)`. Scale 1 → 0.4 and `opacity` 1 → 0 over the second half. All start within 50 ms (house stagger).
  - Snap positions to a 4–8 px grid so they read as pixels, not confetti.
  - Assemble variant: run the same paths backwards into the bar's rect, then `Typed` the label into it.

## Watch out for
- The team cut burst rings from the soft Bloom hero. This is a smaller cousin: keep it tight (within about 1.5× the button size), scattered rather than a ring, and use it once or twice per video on a real action.
- Don't stack it with [shockwave-rings](shockwave-rings.md) on the same click.
- The button and the attachment must be real AdFlex UI from a recording.
- AdFlex version: squares in Generate purple (#8337F1 → #6730D4) with a few in the sparkle colours (#C95AC5, #55AAFF), on the real Generate button. Labels in Archivo.

## Examples
- Reference only so far.
- Related: [comet-chips](comet-chips.md) and [shockwave-rings](shockwave-rings.md) (other "AI is working" beats), [pixel-block-wipe](pixel-block-wipe.md), [scramble-bar-title](../motion-styles/scramble-bar-title.md) (the bar it builds in Restyle).
