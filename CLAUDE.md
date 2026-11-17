# AdFlex Content: instructions for AI assistants

You're helping the AdFlex content team make social reels, ads and website hero videos. AdFlex (adflex.ai) is an AI marketing studio, and its tools are available to you through the AdFlex MCP connector (see `.mcp.json`).

## Start here
1. Read [README.md](README.md) for the index of every video and its status.
2. Before touching a video, read its `videos/<type>/<slug>/brief.md`, then `production.md` and `assets.md`. For a hero video, follow [videos/hero/README.md](videos/hero/README.md) (the hero rules).
3. Before using a character, read `characters/<name>.md`. Before designing anything, read `brand/brand.md`. Before planning motion, check `motion-styles/README.md`, including its house motion rules, and `transitions/README.md` for how shots join. For Remotion work use the `remotion-best-practices` skill, and audit animation code with the `12-principles-of-animation` skill (both in `.claude/skills/`).
4. Check `lessons/` before choosing a model or writing a prompt.
5. Check the setup. A session-start hook runs `tools/check_setup.sh` and lists what's missing on this machine (or run it yourself). When a task needs a missing tool, stop and tell the user what's missing, what it's for, and the install command from [SETUP.md](SETUP.md), before trying the task. If an AdFlex tool fails with an auth error, tell them to run `/mcp` and sign in.

## Language
- The team writes in Levantine Arabic mixed with English. Reply in the same style and keep it short.
- Keep repo docs in English, and keep Arabic lines (scripts, captions) exactly as written.

## Hard rules
- **Credits cost money.** Quote the credit cost and get a yes before every paid generation. Reading, searching and editing existing footage cost nothing.
- **Never publish or schedule a social post** unless a person explicitly asks for it in this session. Drafts are fine. Never claim a post went live when it's a draft.
- Take a reference's **idea, structure and motion style**, never its story, characters, footage, music or logos.
- **AdFlex comes first** in every spoken line, caption and end card. Claude, ChatGPT and MCP appear as small, equal-weight integrations.
- End cards say AdFlex works with the AI you already use. Don't use «أي موديل» or «أي ذكاء اصطناعي».
- Use an ad CTA, not comment-bait such as "comment X and I'll send the link".
- Use real AdFlex UI and real chat recordings, not mockups.
- Use only invented or logo-free brands in generated footage. Watch for real badges (e.g. Toyota) and paint them out.

## Two AdFlex accounts
| | prod "Adflex" | dev "devAdflex" |
|---|---|---|
| Business id | `6adc7785123283962dbffc92` | `6acb3fb640ba55f116584c78` |
| CDN | `https://cdn.adflex.ai/...` | `https://cdn-dev.adflex.ai/...` |

Each video's `brief.md` says which account it uses. Public versions should be recorded on **prod**.

## Workflow for a new video
1. Copy `templates/new-video/` to `videos/<type>/<slug>/`, where `<type>` is `ad`, `social` or `hero` (the same value as the `type` field in `brief.md`), and fill in `brief.md`. Fill in the goal, audience and channel first. Ask the team if you don't know them.
2. If there's a reference, add it to `references/<type>/README.md` with a short breakdown of why it works. If you need to find one, use the "Where to search" list in that file. If it has a motion style worth reusing, save it as `motion-styles/<slug>.md` from `templates/motion-style.md` and add it to the index.
3. Pick the motion styles from `motion-styles/` and list them in `brief.md` (`motion_styles`). Write the script and shot list in `production.md`, using the styles' prompt wording and edit recipes. Get approval before generating.
4. Generate stills first, review them, then animate. Add **every** asset's full URL to `assets.md` as you go, and log each paid generation in the "Credits" table of `production.md`.
5. Build edited videos in Remotion by default: `bash templates/remotion-video/setup.sh videos/<type>/<slug>` creates `build/remotion/` with the brand fonts, logo and marks (`brand/marks/`). Save other editing scripts in `build/` and reusable helpers in `tools/`. Render outputs go in the video's `renders/`, which git ignores.
   - Git ignores clips, audio **and images**. Add every file a build uses to its `media.tsv` (path, URL, sha256), and run `bash tools/fetch_media.sh <build>/media.tsv` before rendering on a new machine.
   - Never commit images or upload new copies of them (resizes, crops, frames). Point `media.tsv` at the image's original CDN link and size or crop it in code; take a frame of a clip with `<Still src frame>` instead of saving a PNG.
   - Check the peak of every generated audio file before using it (some come back near-silent), and the final mix's loudness and true peak (`render.sh` prints them).
6. Record each version and the feedback that led to it in `production.md`, and update the status in `brief.md` and `README.md`.
7. Add anything reusable you learned to `lessons/`.

## Finding assets
Use the AdFlex `list_assets` tool on the right account and search by prompt words. Searches by date only cover recent items. Write the full URL back into `assets.md`.
