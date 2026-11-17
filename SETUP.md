# Setup

What each person needs to work in this repo. Run `bash tools/check_setup.sh` (or `npm run check`) to see what's missing on your machine. Claude Code also runs it at the start of every session and tells you when a task needs something you don't have.

## Quick start
```bash
git clone <repo-url> && cd adflex-content
pip install -r requirements.txt        # after installing libraqm, see below
npm install                            # Cairo font + Playwright
npx playwright install chromium
bash tools/check_setup.sh
claude                                 # then run /mcp and sign in to AdFlex
```

**No `pip`?** Some systems (Fedora, for example) ship Python without it. Run `python3 -m ensurepip --user` first, then use `python3 -m pip install --user ...`.

## 1. Everyone
| What | Why | How |
|---|---|---|
| git | Get and update the repo | `dnf/apt/brew install git` |
| Claude Code (or another AI client) | Reads `CLAUDE.md` (`AGENTS.md` is a link to it) and does the work | claude.com/claude-code |
| AdFlex MCP login | Generations, assets, imports, drafts | `.mcp.json` already has it. Run `/mcp` in Claude Code and sign in with **your own** AdFlex account. |
| Access to both AdFlex businesses | Videos use prod "Adflex" or dev "devAdflex" | Ask an AdFlex admin to add you to both |
| Shared Drive | Final renders live there, not in git | Ask for access to the team folder |

## 2. Editing videos
| What | Why | How |
|---|---|---|
| ffmpeg (includes ffprobe) | Cutting, captions, loudness, music ducking | `dnf/apt/brew install ffmpeg` |
| Python 3 | Editing scripts | Usually preinstalled |
| libraqm + Pillow | Renders Arabic text correctly. ffmpeg's own Arabic shaping is broken. | `sudo dnf install libraqm` / `sudo apt install libraqm0` / `brew install libraqm`, then `pip install -r requirements.txt` |
| librosa, numpy | Beat grid for music-synced cuts | `pip install -r requirements.txt` |
| Node.js | Fonts and Playwright come from npm | nodejs.org or nvm |
| Cairo font | Arabic captions and titles | `npm install` |
| IBM Plex Sans Arabic, Archivo Black, Anton, Unbounded, Playfair Display | ALFA UI text, Latin titles, the الحجة signature | Download from fonts.google.com and install |
| A screen recorder (OBS or the OS recorder) | The rules require real AdFlex UI and real chat recordings | Any recorder |

## 3. Research and references
| What | Why | How |
|---|---|---|
| agent-reach skill | Web search and reading YouTube, Reddit and X | Lives in `~/.claude/skills/agent-reach`, not in the repo. Ask the team for the setup. |
| Playwright + Chromium | Opening and screenshotting sites that need a real browser | `npm install`, then `npx playwright install chromium` |

## 4. Optional
These make some jobs faster or better. Nothing breaks without them.

| What | What it does | When you'd want it | How |
|---|---|---|---|
| faster-whisper | Transcribes a generated take on your machine so you can check that every word was said right (for example "AdFlex", not "AdFlicks"). | When you generate talking-head clips. Without it you only listen yourself, which is still required anyway. | `python3 -m pip install --user faster-whisper nvidia-cublas-cu12 nvidia-cudnn-cu12` (the last two for the GPU). The first transcription downloads a model (about 0.5 GB for `small`, 3 GB for `large-v3`). |
| NVIDIA GPU + driver, ffmpeg with cuvid/nvenc, `skia-python` | The `tools/talking-head-reel/` pipeline: GPU decode/encode, 3D overlay, emoji rendering | Talking-head reels with 3D icons | Driver from RPM Fusion / your distro (disable Secure Boot or enrol the key); `python3 -m pip install --user skia-python` |
| Remotion + three.js | 3D and code-driven motion graphics | Any Remotion build | New build: `bash templates/remotion-video/setup.sh videos/<type>/<slug>`. Existing build: `npm install` inside its `remotion/` folder, then `bash tools/fetch_media.sh media.tsv` for the clips and audio git ignores. The `remotion-best-practices` skill is in `.claude/skills/`. Licence: free for teams of up to 3, companies of 4+ need one. |
| Reference MCP servers: What Ships, Launchscene, Refs, Comotion | Let Claude **search** these reference libraries directly (for example "split-screen scenes" or "AI tool launches") instead of reading them as web pages. | When you look for references or motion styles often. | Not in `.mcp.json` yet. Ask before adding: some have paid tiers. |
| Paid library accounts: Refs Pro, AdSwipeFile, Motion Index Pro | Unlock the hidden part of those libraries: full breakdowns, more ads, more shots. | Only if the free parts aren't enough. | Sign up on each site |

## Not needed
- No AdFlex API keys. The MCP login handles access.
- No video editing app. Editing is done in Remotion, ffmpeg and Python scripts.
