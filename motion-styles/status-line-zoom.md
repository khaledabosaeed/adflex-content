---
name: "Status line zoom"
slug: "status-line-zoom"
type: "graphics"
fits: [hero, ad, social]
source: "Supercomputer — Higgsfield just released Supercomputer. (71 s), 9–10.5 s (also 17.8 s, 33.43 s, ~44 s): https://video.twimg.com/amplify_video/2054988248183951360/vid/avc1/1920x1080/VLBiUTK0bmCbByxr.mp4 · page https://whatships.com/videos/supercomputer/. Supercomputer turns ideas into short dramas at scale. (98 s), 45–66 s: https://video.twimg.com/amplify_video/2055362554424332288/vid/avc1/1920x1080/Qru7EJrW-PlDd7N-.mp4 · page https://whatships.com/videos/supercomputer-8048/"
used_in: [workflow-hero]
---

# Status line zoom

## What it looks like
The agent's current step fills the whole screen as one giant line of monospace text ("Auditing site… mapp…"), still typing, sliding slowly sideways. Then it snaps back: in about 2 frames you see the whole log at reading size, and its rows fade in one by one. Each step of the run gets this beat, like a chapter marker. The big line says what the agent is doing, the log shows it really doing it, and then the output arrives.

## Breakdown
- **Text and graphics:**
  - The giant line: monospace (IBM Plex Mono-like), dark on light grey (#F4F4F4), one line cropped by the frame edges while it types. Sometimes with an icon (a sparkle before "Generating 50 influencers").
  - The log at reading size: rows with icons, each row's first words in the accent colour (cyan #3FC1D6).
- **Cuts and timing:**
  - ~10.5 s: giant "Auditing site…" → the full research log, through a cut or dissolve of about 2 frames. The rows fade in one after another, about 0.15 s apart.
  - 17.8 s: giant "Generating 50 influencers" → the persona grid, filling row by row from the top.
  - 33.43–33.7 s: "Ranking hooks…" enters from the right with horizontal motion blur, brakes within about 0.25 s, then keeps typing while it drifts left. Again at ~44 s.
  - The beat repeats about every 6–10 s.
- **The pattern around it: the agent's process is the story.** Typed prompt → status line and log → a grid or carousel of outputs → the hero output full-screen. All three Supercomputer films follow it. Supercomputer 8048 also shows a prompt ("Add more drama") huge before the log updates (45–56 s), then status lines ("Applying artistic solution…", "Done! Take it.", 56–66 s).

## How to make it
- **Model:** none.
- **Edit recipe (Remotion):**
  - Giant line: `Typed` at a size where 12–20 characters fill the width, `per` ≈ 1 frame per character, in a narrow width (`cond(500, 62)`).
  - Entrance: `whipIn` gives `x` and `blur`; pass the blur to `MBlur`. Then a slow left drift with `ip(..., OUT)` while it types.
  - Snap back: a cut (or 2-frame crossfade) to the real log recording in a `UIWindow` at reading size. To make its rows arrive one by one, lay a `Crop` of each row on top and step their `o` in 0.15 s apart.
  - Then the output grid, then the hero output ([deliverables-parade](deliverables-parade.md)).

## Watch out for
- The 0.15 s row gap is longer than the house 50 ms stagger. Keep it here, because the rows arriving one by one is the story (the agent working). Use ≤50 ms when the log is only decoration.
- The status words must be ALFA's real ones from that run, word for word.
- One giant line per step, and 3–4 at most per film, or it stops working as a chapter marker.
- AdFlex version: the giant line in Archivo (a narrow width, not a monospace), with the step's verb in the Generate purple (#8337F1 → #6730D4) and a sparkle-gradient glow (#C95AC5 → #55AAFF) on the icon only. Arabic in Cairo, entering from the left and drifting right.

## Examples
- Reference only so far. Related: [ui-step-walkthrough](ui-step-walkthrough.md), [accent-typed-prompt](accent-typed-prompt.md), [result-over-process-split](result-over-process-split.md), [hard-cut-blur-settle](../transitions/hard-cut-blur-settle.md).
