---
name: "3D title inside the scene"
slug: "chrome-title-in-scene"
type: "graphics"
fits: [hero, social, ad]
source: "Higgsfield Talent Contest card, 0.55–7.13 s: https://static-public-media.higgsfield.ai/cards/9a1e389f-efeb-4b7a-a0e6-2b39defe2116.mp4 · page https://higgsfield.ai/contests/talent-contest"
used_in: []
---

# 3D title inside the scene

## What it looks like
The headline is a real 3D object standing in the shot, not a caption on top of it. Chrome "$1,000,000" letters float over a stadium crowd. A girl stands up *in front of* them. A laser from her eyes hits a stage where the same number now stands huge, and the camera dives through one of its zeros into the next world. The title takes part in the story.

## Breakdown
- **Text and graphics:**
  1. 0.55–0.95 s: the title flies in from behind the camera (see [flare-fly-in](../transitions/flare-fly-in.md)): chrome, extruded, with a small logo above and "TALENT CONTEST" below, between two laurel marks.
  2. 0.95–2.75 s: it holds while the crowd moves. A girl rises from her seat and her head and body pass in front of it (it's occluded). It fades as she fills the frame.
  3. 3.0–3.5 s: cartoon eyes pop out of her head and fire pink lasers. A second caption types on at the bottom ("2 WEEKS · 20 PRIZES").
  4. 4.0–6.0 s: the camera swings behind her. The lasers hit a stage in the centre of the stadium, where giant chrome "$1,000,000" letters rise among fireworks and arcs of light.
  5. 6.3–7.1 s: [dive-through](../transitions/dive-through.md) the centre "0", whose inside burns.
- **Grade and texture:** a warm, slightly faded film look, soft daylight, chrome with real reflections of the crowd.
- **Sound cues:** a crowd roar, a laser zap, fireworks, and a whoosh into the dive.

## How to make it
- **Model:** image-to-video from stills that already contain the 3D title (generate the still with the text in it, e.g. GPT Image 2.6 or Nano Banana, which render text well). The occlusion and reflections then come from the video model. Quote the credits first.
- **Prompt wording (paste-ready, adapt):**
  > Giant polished chrome 3D letters reading "[TEXT]" float in the middle of [location], reflecting the scene around them, cinematic 35 mm film look, soft daylight. [Person] stands up in the foreground, in front of the letters.
- **Edit recipe:** the opening fly-in can be added in edit (see [flare-fly-in](../transitions/flare-fly-in.md)) on top of a clean plate, and the generated shot takes over once the title is in place.

## Watch out for
- Check the generated letters frame by frame. Video models drift text. Keep the title shot short (under 2 s) or re-composite a clean title over it.
- AdFlex version: brand-purple metal rather than chrome, and the text is an AdFlex line or number. Keep the AdFlex logo rules (`brand/brand.md`); never let the model redraw the logo, composite the real one.

## Examples
- Reference only so far.
