---
title: "Workflows in one sentence: Lama's candle shop hero"
slug: "workflow-hero"
status: "v18 (final-quality render: ProRes master, new shaped music + SFX, upscaled story, 21.8 s) rendered, awaiting review"
type: "hero"
format: "22.8 s, 16:9, 1920x1080, loop with music + SFX (autoplays muted on the site)"
language: "English"
adflex_account: "devAdflex for stills, prod Adflex for ALFA/canvas recordings"
characters: ""
motion_styles: [glitch-split-whip, ui-punch-in-cut, whip-pan-cut, ui-macro-dolly, status-line-zoom, button-press, card-to-fullbleed, button-to-player-morph, object-carry]
cta: "Build workflows in one sentence · adflex.ai"
production_chat: ""
cost_credits: 2917
final_url: ""             # set once the team approves a final (Drive / CDN)
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
- `build/remotion/`: the Remotion build (see its README: `media.tsv`, `render.sh`)
- Early motion preview (before v1): https://claude.ai/artifact/3kqzGaJ2o8J33y9kgxktTG (its source `build/motion-preview.src.html` was removed with the v1 HTML pipeline; it is in git history)
- Old 9:16 reel preview (superseded): https://claude.ai/artifact/Xc97zJP4rJZ5zFbVkuvL5a
