---
title: "Workflows in one sentence: Lama's candle shop hero"
slug: "workflow-hero"
status: "v6 (music + sound effects) rendered, awaiting review"
type: "hero"
format: "20 s, 16:9, 1920x1080, loop with music + SFX (autoplays muted on the site)"
language: "English"
adflex_account: "devAdflex for stills, prod Adflex for ALFA/canvas recordings"
characters: ""
motion_styles: [glitch-split-whip]
cta: "Build workflows in one sentence · adflex.ai"
production_chat: ""
cost_credits: 1473
published: false
---

# Workflows in one sentence: Lama's candle shop hero

## Goal
- **Why this video exists:** AdFlex Workflows are powerful but overlooked, because node canvases look complicated. Now ALFA (and Claude/ChatGPT via MCP) build the workflow from one sentence.
- **Audience:** small business owners and marketers who repeat the same content work every week and were scared off by node tools.
- **Where it runs:** website hero section (autoplay, muted, loops).
- **Success metric:** TODO

## Idea
Lama, who owns a small handmade-candle shop, used to close the laptop when she saw a node canvas and redo the same content by hand every Thursday. She tells ALFA one sentence, the workflow builds itself, one click makes 3 ads and a story video with music, and Thursday is hers again.

## Research behind it (2026-11-16)
People quit node tools (ComfyUI, n8n, Weavy) because of the learning curve, overbuilt graphs and silent breakage; the market is moving to "describe it and it's built" (n8n MCP, 2026). Prod had only one workflow template, so the feature really is under-shown.

## Reference
No dedicated workflow reference yet. Structure borrows from refs already in the repo: ImagineArt Creative Agent (live prompt → step cards → "0 settings touched"), Artlist GPT Image 2.5 (deadline montage) and Bloom hero's v4 motion rules (hard cuts, a travelling glowing object, white → purple → true-colour bloom).

## Honesty constraints
- Workflows have no triggers or schedules: say "one click", never "runs by itself".
- No caption/text node exists: the outputs are 3 ads + a story video with music.
- Record ALFA and the canvas on prod. Confirm ALFA builds the whole workflow from one prompt before recording.
- ChatGPT chip only if the integration is live.

## Files
- [production.md](production.md): script, shot list, versions, feedback
- [assets.md](assets.md): full links to every asset
- `build/`: editing scripts
- Motion preview, 16:9 hero (current): https://claude.ai/artifact/3kqzGaJ2o8J33y9kgxktTG (source: `build/motion-preview.src.html`; `__GIRL__` is replaced with the base64 of shot 1 v3)
- Old 9:16 reel preview (superseded): https://claude.ai/artifact/Xc97zJP4rJZ5zFbVkuvL5a
