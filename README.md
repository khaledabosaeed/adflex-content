# AdFlex Content

The working repo for AdFlex's social reels, ads and website hero videos: ideas, scripts, characters, references and links to every generated asset. AI assistants should start with [CLAUDE.md](CLAUDE.md).

## Layout
```
CLAUDE.md / AGENTS.md   instructions for AI assistants
brand/                  colours, logo, fonts, tone, end-card rules
characters/             recurring characters: look, reference links, voice, prompts
references/             viral videos we adapted, with the breakdown
videos/<slug>/
  brief.md              goal, audience, idea, reference, status (frontmatter)
  production.md         script/timeline, versions, feedback, lessons
  assets.md             full links to every image, clip and audio file
  build/                editing scripts for this video
templates/new-video/    copy this to start a video
lessons/                model and editing lessons
tools/                  reusable scripts (Arabic text renderer, etc.)
```

## Videos
| Slug | Video | Format | Status (2026-11-15) |
|---|---|---|---|
| [mcp-reel](videos/mcp-reel/brief.md) | Adnan talks, ads pop around him, chat demo, connect in one click | 45 s, 9:16, Arabic | v12 done |
| [ugc-reel](videos/ugc-reel/brief.md) | "Claude + AdFlex = UGC machine" | 48 s, 9:16, Arabic | v7 done |
| [alfa-agent-reel](videos/alfa-agent-reel/brief.md) | ALFA: a full campaign from one line | 24 s, 9:16, Arabic | v3 done |
| [hayla-launch-reel](videos/hayla-launch-reel/brief.md) | «الإطلاق بكرا»: Saudi family launches the «هيلة» can overnight | 40 s / 35 s, 9:16 | v16 + v6 done |
| [zaatar-cat-reel](videos/zaatar-cat-reel/brief.md) | Zaatar the cat: "I made this ad in one chat" | 42 s, 9:16, Arabic | v4 done; re-record screens on prod |
| [hajja-cheetah-reel](videos/hajja-cheetah-reel/brief.md) | الحجة with a cheetah: "where does the money come from?" | 13 s, 9:16 | v4 done |
| [hajja-construction-reel](videos/hajja-construction-reel/brief.md) | الحجة out-works the men on a building site | ~44 s, 9:16 | Draft; 6 shots + music to go |
| [mammoth-wash-reel](videos/mammoth-wash-reel/brief.md) | Stone Age mammoth wash | 20 s, 9:16 | Re-cut; realistic re-shoot pending |
| [bloom-hero](videos/bloom-hero/brief.md) | "Bloom · بلوم" coffee-cart GPT Image 2.6 hero | 16:9 + social | v4 final |
| [diner-hero](videos/diner-hero/brief.md) | "Al's Diner" hero | 16:9 + social | Superseded by Bloom |
| [genjutsu-promo](videos/genjutsu-promo/brief.md) | Genjutsu swap tool promo | 20 s, 16:9 | Final |

**Nothing has been published.** Some posts exist as drafts only.

## Not in the repo
- **Rendered videos** (`*.mp4`, `*.mov`) are git-ignored. Put finals in the shared Drive and link them in `brief.md`.
- **Lost build scripts:** the original editing scripts lived in temporary sessions and are gone. `production.md` describes how each cut was built.

## Getting started
```bash
git clone <repo-url> && cd adflex-content
claude      # or any AI assistant; it reads CLAUDE.md / AGENTS.md
```
Connect the AdFlex MCP in your own client and sign in with your own AdFlex account (see `.mcp.json`).
