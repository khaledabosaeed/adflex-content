---
name: "Card → full bleed"
slug: "card-to-fullbleed"
type: "transition"
fits: [hero, ad, social]
source: "Higgsfield — Claude Fable 5.1 for 3D spatial design (57 s), 8.10–8.23 s: https://video.twimg.com/amplify_video/2095483820934041600/vid/avc1/1920x1080/SXJf8yUuVvIpqXxB.mp4 · page https://whatships.com/videos/higgsfield-fable-5-1/. Supercomputer — How to run paid ads on Supercomputer… (68 s), 45.6–48.1 s: https://video.twimg.com/amplify_video/2055680164101832704/vid/avc1/1920x1080/kjD89CicQd4hkiFs.mp4 · page https://whatships.com/videos/supercomputer-4350/. Higgsfield — motion design in After Effects (82 s), 20.47–21.2 s: https://video.twimg.com/amplify_video/2098407971227398144/vid/avc1/1920x1080/jFycYXjVGgAwzmzi.mp4 · page https://whatships.com/videos/higgsfield-motion-design/. Higgsfield Genjutsu Lite — step into a video (29 s), 4.99–5.33 s (shrink): https://video.twimg.com/amplify_video/2112640616387772416/vid/avc1/1920x1080/cBcDqM1e80f0gPNQ.mp4 · page https://whatships.com/videos/higgsfield-genjutsu-lite/. Higgsfield AI launch (42 s), 9.8–10.8 s: https://video.twimg.com/amplify_video/2013725657914843141/vid/avc1/720x880/_NdNdeDsZhkyh6xB.mp4?tag=14 · page https://whatships.com/videos/higgsfield-ai-launch/"
used_in: [workflow-hero]
---

# Card → full bleed

## What it looks like
A card inside the UI (a chat attachment, a tile in a results grid, the app's preview viewer, a stack of input cards) grows until its content fills the frame as full-frame footage. Or the reverse: full-frame footage shrinks into a card in the UI. The card is the thread between "the tool" and "the result", so there's no cut to explain.

## Breakdown
- **Transitions:**
  - Chat card (Fable 5.1, 8.10–8.23 s): the chat thumbnail lifts and zooms toward the camera with motion blur until it fills the frame as live footage. Same move at 24.77–24.87 s with a 3D-model card, after the card cycles its tint while loading (23.0–24.7 s).
  - Grid tile (Supercomputer paid ads, 45.6–48.1 s): the grid of generating tiles dims and the selected tile lifts and scales up (45.6–45.9 s). A cut at 46.76 s to the clip in an outlined frame with an audio waveform. The frame first shrinks slightly, then expands to full bleed between about 47.9 and 48.1 s.
  - Viewer (motion design in AE, 20.47–21.2 s): inside the app's preview viewer the banner builds, then the viewer scales up until the render fills the frame.
  - Input merge (AI launch, 9.8–10.8 s): the headline drifts up and fades, the character card slides over the reference card, the stack glows (10.3 s) and flashes into the result, and that card grows to full bleed with soft edges by about 10.8 s while the Generate button slides off the bottom.
  - Shrink (Genjutsu Lite, 4.99–5.33 s): the full-frame shot shrinks into a rounded square card on light grey, which then becomes a sent message.
- **Sound cues:** a soft whoosh rising with the scale (reversed for the shrink).

## How to make it
- **Model:** none. A real UI recording and a real output clip.
- **Edit recipe (Remotion):**
  - Measure the card's rect in the recording. One wrapper `div` animates `left/top/width/height` from that rect to the full frame with `ip(..., INOUT)` over 0.3–0.5 s, `borderRadius` → 0 in the last 30 %. Inside, the result `Clip` with `objectFit: 'cover'`.
  - The UI behind: `UIWindow` with `dim` going 0 → 1 (darkens and blurs), or a `Crop` lift-out with `glow` for a grid tile.
  - Only the fast Fable version needs blur: wrap the card in `MBlur` with `y` following the speed.
  - Shrink: run it backwards; the card settles into its slot on the house spring (mass 0.6, stiffness 140, damping 12).

## Watch out for
- One move. If the card changes shape first and then grows, it reads as two steps (same note as [button-to-player-morph](button-to-player-morph.md)).
- The card and the full frame must show the same clip at the same moment, so the handoff is invisible.
- The AI-launch merge flashes white. Use a soft sparkle-gradient glow instead (Bloom v4 rejected white flashes). On the soft hero, skip the motion blur and use the slower Supercomputer version.
- AdFlex version: real AdFlex cards only (an ALFA chat attachment, a Generate result tile, the real preview player). Lift glow in the sparkle gradient (#C95AC5 → #55AAFF), selection outline in Generate purple (#8337F1 → #6730D4), labels in Archivo.

## Examples
- Reference only so far.
- Related: [button-to-player-morph](button-to-player-morph.md) (the clicked button becomes the player), [dive-through](dive-through.md), [deliverables-parade](../motion-styles/deliverables-parade.md), [ui-step-walkthrough](../motion-styles/ui-step-walkthrough.md).
