---
name: "Title → UI"
slug: "title-to-ui"
type: "transition"
fits: [hero, ad]
source: "Higgsfield Plugin for Photoshop is live. (46 s), 2.2–3.0 s: https://video.twimg.com/amplify_video/2066570754263805952/vid/avc1/1920x1080/ik3NRDb7f_mmmBap.mp4 · page https://whatships.com/videos/higgsfield-plugin-for-photoshop/. Claude + Higgsfield MCP — 18-minute breakdown of… (1134 s), 1.63–2.13 s: https://video.twimg.com/amplify_video/2056404580619919361/vid/avc1/1920x1080/wT7FGshDUzNLLoiU.mp4 · page https://whatships.com/videos/claude-higgsfield-mcp/"
used_in: []
---

# Title → UI

## What it looks like
The opening title doesn't cut away: it becomes the product. Either the title's colour bar darkens into an app window's title bar, the window dots pop in, and the camera pulls out to show the app. Or the logo slides aside, a partner name slides in to make "A × B", and the lockup rises to the top as a prompt card rises from below.

## Breakdown
- **Transitions:**
  - Title → window chrome (Photoshop plugin, 30 fps, 2.2–3.0 s): the lime highlight bar behind the brand word darkens to charcoal over about 7 frames. Another word drops away with motion blur, and red, yellow and green window dots pop in one after another (frames 7–15, about 2.43–2.7 s). The bar is now the plugin window's title bar; the camera pulls out to the app (3–5 s) and its panel opens.
  - Lockup → prompt (Claude + MCP, 24 fps, 1.63–2.13 s): the wordmark slides left and the partner name slides in from the right with horizontal motion blur. The whole lockup rises to the top as a white prompt card rises from the bottom, and an image chip with a cursor flies in at about 2.13 s.
- **Sound cues:** a soft UI click as each dot pops, a low whoosh on the pull-out.

## How to make it
- **Model:** none.
- **Edit recipe (Remotion):**
  - Window chrome: `UIWindow` already draws a real-looking bar (`BAR` = 42 px, three dots, `url`). Start with the title on a bar-shaped `div` at full-frame scale. Animate its background from the accent to the `UIWindow` bar colour (#0c0b12) with `ip(..., INOUT)` over about 0.25 s, and pop the three dots on the house spring (mass 0.6, stiffness 140, damping 12), 50 ms apart. Swap to `UIWindow` at the same on-screen rect and pull out with its `s` (or `Cam`) over 1–2 s, `OUT`.
  - Lockup: the AdFlex wordmark moves left on the house spring; the partner name comes in with `whipIn` (a short `dist`, e.g. 400) inside `MBlur`. Then both rise while the real prompt box (a `Crop` of a recording) enters from below on the spring.

## Watch out for
- The bar's size and position must match the real window bar exactly at the swap frame, or the handoff jumps.
- AdFlex comes first in the lockup. The partner (Claude, ChatGPT, MCP) is small and equal weight, and only when the integration is real.
- Keep the pull-out slow and straight, no orbit or tilt (workflow-hero v8). On the soft hero, slide the partner name in without motion blur.
- AdFlex version: the title in Archivo (Cairo for Arabic) on a Generate purple bar (#8337F1 → #6730D4) that darkens into the window bar; the prompt card's rim glow in the sparkle gradient (#C95AC5 → #55AAFF). The app and prompt box are real AdFlex UI, never a mockup.

## Examples
- Reference only so far.
- Related: [flare-fly-in](flare-fly-in.md) and [hard-cut-blur-settle](hard-cut-blur-settle.md) (other title openings), [scramble-bar-title](../motion-styles/scramble-bar-title.md), [accent-typed-prompt](../motion-styles/accent-typed-prompt.md) (what happens in the prompt card next), [ui-step-walkthrough](../motion-styles/ui-step-walkthrough.md).
