# AdFlex Content

The working repo for AdFlex's social reels, ads and website hero videos: ideas, scripts, characters, references and links to every generated asset. AI assistants should start with [CLAUDE.md](CLAUDE.md).

## Layout
```
CLAUDE.md               instructions for AI assistants (AGENTS.md links to it)
brand/                  colours, logo, tone, end-card rules; fonts/, marks/ (ALFA, Claude), sfx/
characters/             recurring characters: look, reference links, voice, prompts
references/<type>/      viral videos we adapted and where to search, by type
motion-styles/          reusable motion styles copied from references, by type
transitions/            reusable shot-to-shot transitions, each with its reference link and recipe
videos/
  ad/                   paid ads: presenter/narrator demos AdFlex, ad CTA
  social/               no-dialogue viral comedy reels ending on an AdFlex card
  hero/                 16:9 website heroes and product promos; hero/README.md holds the hero rules
  <type>/<slug>/
    brief.md            goal, audience, idea, reference, status (frontmatter)
    production.md       script/timeline, versions, feedback, lessons
    assets.md           full links to every image, clip and audio file
    build/              editing scripts; build/remotion/ for Remotion builds (media.tsv lists git-ignored clips)
    renders/            outputs (git-ignored)
templates/new-video/    copy this to start a video
templates/remotion-video/  starter Remotion build (setup.sh, lib.tsx, Sound, render.sh)
templates/motion-style.md  copy this to add a motion style
lessons/                model and editing lessons
tools/                  reusable scripts (fetch_media.sh, talking-head-reel, ...)
```

## Videos
Status as of 2026-11-15.

### Ads (`videos/ad/`)
| Slug | Video | Format | Status |
|---|---|---|---|
| [mcp-reel](videos/ad/mcp-reel/brief.md) | Adnan talks, ads pop around him, chat demo, connect in one click | 45 s, 9:16, Arabic | v12 done |
| [ugc-reel](videos/ad/ugc-reel/brief.md) | "Claude + AdFlex = UGC machine" | 48 s, 9:16, Arabic | v7 done |
| [alfa-agent-reel](videos/ad/alfa-agent-reel/brief.md) | ALFA: a full campaign from one line | 24 s, 9:16, Arabic | v3 done |
| [hayla-launch-reel](videos/ad/hayla-launch-reel/brief.md) | «الإطلاق بكرا»: Saudi family launches the «هيلة» can overnight | 40 s / 35 s, 9:16 | v16 + v6 done |
| [zaatar-cat-reel](videos/ad/zaatar-cat-reel/brief.md) | Zaatar the cat: "I made this ad in one chat" | 42 s, 9:16, Arabic | v4 done; re-record screens on prod |

### Social (`videos/social/`)
| Slug | Video | Format | Status |
|---|---|---|---|
| [hajja-cheetah-reel](videos/social/hajja-cheetah-reel/brief.md) | الحجة with a cheetah: "where does the money come from?" | 13 s, 9:16 | v4 done |
| [hajja-construction-reel](videos/social/hajja-construction-reel/brief.md) | الحجة out-works the men on a building site | ~44 s, 9:16 | Draft; 6 shots + music to go |
| [mammoth-wash-reel](videos/social/mammoth-wash-reel/brief.md) | Stone Age mammoth wash | 20 s, 9:16 | Re-cut; realistic re-shoot pending |

### Hero (`videos/hero/`)
| Slug | Video | Format | Status |
|---|---|---|---|
| [bloom-hero](videos/hero/bloom-hero/brief.md) | "Bloom · بلوم" coffee-cart GPT Image 2.6 hero | 16:9 + social | v4 final |
| [diner-hero](videos/hero/diner-hero/brief.md) | "Al's Diner" hero | 16:9 + social | Superseded by Bloom |
| [genjutsu-promo](videos/hero/genjutsu-promo/brief.md) | Genjutsu swap tool promo | 20 s, 16:9 | Final |
| [workflow-hero](videos/hero/workflow-hero/brief.md) | "Workflow × ALFA" hero: one sentence to ALFA builds and runs a real workflow | 21.8 s, 16:9, loop with music + SFX | v18 (final quality: ProRes master, new music + SFX, upscaled story) rendered, awaiting review |

**Nothing has been published.** Some posts exist as drafts only.

## Not in the repo
- **Rendered videos** (`*.mp4`, `*.mov`) are git-ignored. Put finals in the shared Drive and link them in `brief.md`.
- **Lost build scripts:** the original editing scripts lived in temporary sessions and are gone. `production.md` describes how each cut was built.

## Setup
See [SETUP.md](SETUP.md) for what to install, and run `bash tools/check_setup.sh` to see what's missing on your machine.

## Getting started
```bash
git clone <repo-url> && cd adflex-content
claude      # or any AI assistant; it reads CLAUDE.md
```
Connect the AdFlex MCP in your own client and sign in with your own AdFlex account (see `.mcp.json`).
