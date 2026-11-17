---
name: "UI macro dolly"
slug: "ui-macro-dolly"
type: "camera"
fits: [hero, ad]
source: "Supercomputer turns ideas into short dramas at scale. (98 s), 15–20 s: https://video.twimg.com/amplify_video/2055362554424332288/vid/avc1/1920x1080/Qru7EJrW-PlDd7N-.mp4 · page https://whatships.com/videos/supercomputer-8048/"
used_in: [workflow-hero]
---

# UI macro dolly

## What it looks like
Instead of showing the prompt box flat, the camera goes in very close, like a macro lens on a product, and slides across its parts: the "+" button, the model chip ("Claude Opus 4.7"), the send button. Then it pulls out and you see the whole frosted box, ready for the prompt to type in. It treats a piece of UI like a piece of hardware.

## Breakdown
- **Cuts and timing:**
  - 15.03 s: hard cut to a blank light frame. At about 15.3 s a corner of the frosted panel slides in from the right.
  - 15–20 s: the macro pass across the box's parts, then the pull-out to the whole box.
  - From 20 s: the prompt types into the box, followed by the agent log.
- **Camera:** an extreme close-up travelling sideways along the box, then a pull-back to the full box.
- **Look:** off-white #F5F6F8, a frosted-glass panel, a soft blue glow.
- **Where it sits:** straight after a dark beat (the black card with the "Higgsfield" pill, 11.8–15 s), so it reads as a calm reset before the demo starts.

## How to make it
- **Model:** none.
- **Source:** the real AdFlex prompt box (ALFA or the Generate input), captured at 3–4× pixel density (browser `deviceScaleFactor` 3–4, or a 4K screenshot) so the macro stays sharp. Empty field, real model chip.
- **Edit recipe (Remotion):**
  - The box as an `Img` (or a `Clip`) inside `Cam`. Keyframe `s`, `x` and `y` with `ip(..., INOUT)`: start at about 3× on the left part, slide to the chip, then to the send button, then pull out to 1× with the box filling the centre third (our values).
  - `MBlur` (x only) on the fastest part of the slide.
  - Then the typed prompt ([accent-typed-prompt](accent-typed-prompt.md)) in the same box.

## Watch out for
- Close-ups show every pixel. Never upscale a 1× capture; soft UI kills the macro look.
- Keep the path flat, with no tilt or orbit (hero rule: windows sit flat).
- 5 s is long for a hero. Trim to 2–2.5 s and visit two parts, not three.
- AdFlex version: the parts are the real Generate input (attach, model chip, the purple Generate button #8337F1 → #6730D4), with a soft sparkle-gradient glow (#C95AC5 → #55AAFF) behind the box.

## Examples
- Reference only so far. Related: [accent-typed-prompt](accent-typed-prompt.md) (what comes after it), [button-press](button-press.md), [ui-step-walkthrough](ui-step-walkthrough.md).
