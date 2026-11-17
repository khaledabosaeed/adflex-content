---
name: "UI step walkthrough"
slug: "ui-step-walkthrough"
type: "edit"              # also covers camera and graphics
fits: [hero, ad]
source: "Higgsfield Short Drama Studio card (14.9 s, 1080×810, silent): https://static-public-media.higgsfield.ai/cards/788c93dc-a6fc-42f7-924d-949b2aae8a51.mp4 · page https://higgsfield.ai/short-drama"
used_in: []
---

# UI step walkthrough

## What it looks like
A whole product flow told in 15 s on a dark background: upload → choose → the AI works → the result → watch it. Every step is a real UI card in the middle of the frame, the product's lockup sits fixed at the bottom the whole time, and each step flows into the next with its own transition. The camera never stops moving inside the UI, and one accent colour marks every action.

## Breakdown
- **Structure (Short Drama):**

  | t (s) | Step | Into the next step |
  |---|---|---|
  | 0–0.84 | "Upload your script" card; a PDF icon flies in and drops into it | [card-stack-whip](../transitions/card-stack-whip.md) |
  | 0.84–3.4 | "Style" card + "Aspect Ratio" pill; the choice changes once (16:9 → 9:16, cinematic → 1990s romantic), then two ✓ checks pop in lime | [comet-chips](../transitions/comet-chips.md) |
  | 3.4–5.5 | "Analyzing the script": a progress line, chips fly in, the context paragraph types itself | the camera slides down to the next panel |
  | 5.5–6.4 | "Splitting into episodes": a numbered episode list fills two columns, a lime line sweeps | [chroma-flip](../transitions/chroma-flip.md) |
  | 6.4–10.3 | The series page: the poster, the title typed, the episode grid fills with thumbnails one by one; the camera pans and zooms across the page | [button-to-player-morph](../transitions/button-to-player-morph.md) |
  | 10.3–14.9 | The 9:16 player plays the real episode; the episode list slides in beside it | end (loops) |

- **Camera:** always moving. A slow push-in on every card, pans between panels, and a zoom when something gets selected. There are no static holds.
- **Cuts and timing:** steps last 0.8–2.5 s. The AI-working step is the longest and the result step gets the most room. Only one hard cut in 15 s (at 1.17 s, hidden inside a zoom).
- **Text and graphics:**
  - The lockup at the bottom: a small logo over "SHORT DRAMA" in big grey-to-white gradient type, with "EARLY PREVIEW" under it.
  - UI text is the product's own.
  - The accent (lime) is used only for actions: ✓, progress, selected borders, buttons.
- **Grade and texture:** pure black with a faint dot grid, UI cards in dark glass with soft borders, and results in full colour.
- **Sound cues:** silent in the reference. For ours: a tick per selection, a soft data sound under "analyzing", and a riser into the result.

## How to make it
- **Model:** none for the walkthrough. The result footage is whatever the product really made.
- **Edit recipe (Remotion):**
  - `bash templates/remotion-video/setup.sh videos/<type>/<slug>` gives `UIWindow`, `Crop`, `Clip`, `Cam`, `Typed`, `MBlur`, `whipIn/whipOut`.
  - One scene per step, with the transitions above between them.
  - The lockup is a fixed layer above every scene.
  - Record each step of the real AdFlex flow (see `tools/screen-rec/`) at 1920×1080 and crop in the composition.

## Watch out for
- Every card must be the real AdFlex UI from a real recording (house rule). No invented panels to "explain" a step.
- Keep the camera calm. A slow push-in plus one move per step; no orbits or tilts beyond the transitions (workflow-hero v8 feedback).
- AdFlex version: the lockup is the AdFlex logo + the feature name (e.g. "ALFA" or "WORKFLOWS") in Archivo. The accent is the Generate purple (#8337F1 → #6730D4), not lime. Arabic UI flows right to left, so the card motion runs right to left too.
- A fit for ALFA: prompt → ALFA plans → the workflow builds → Run → ads and the story video play.

## Examples
- Reference only so far. workflow-hero is the closest one we've built.
