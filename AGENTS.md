# AdFlex Content: instructions for AI assistants

You're helping the AdFlex content team make social reels, ads and website hero videos. AdFlex (adflex.ai) is an AI marketing studio, and its tools are available to you through the AdFlex MCP connector (see `.mcp.json`).

## Start here
1. Read [README.md](README.md) for the index of every video and its status.
2. Before touching a video, read its `videos/<type>/<slug>/brief.md`, then `production.md` and `assets.md`.
3. Before using a character, read `characters/<name>.md`. Before designing anything, read `brand/brand.md`.
4. Check `lessons/` before choosing a model or writing a prompt.

## Language
- The team writes in Levantine Arabic mixed with English. Reply in the same style and keep it short.
- Keep repo docs in English, and keep Arabic lines (scripts, captions) exactly as written.

## Hard rules
- **Credits cost money.** Quote the credit cost and get a yes before every paid generation. Reading, searching and editing existing footage cost nothing.
- **Never publish or schedule a social post** unless a person explicitly asks for it in this session. Drafts are fine. Never claim a post went live when it's a draft.
- Take a reference's **idea and structure**, never its story or characters.
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
2. If there's a reference, add it to `references/README.md` with a short breakdown of why it works.
3. Write the script and shot list in `production.md`. Get approval before generating.
4. Generate stills first, review them, then animate. Add **every** asset's full URL to `assets.md` as you go.
5. Save editing scripts in `videos/<type>/<slug>/build/` and reusable helpers in `tools/`. Render outputs go in `renders/`, which git ignores.
6. Record each version and the feedback that led to it in `production.md`, and update the status in `brief.md` and `README.md`.
7. Add anything reusable you learned to `lessons/`.

## Finding assets
Use the AdFlex `list_assets` tool on the right account and search by prompt words. Searches by date only cover recent items. Write the full URL back into `assets.md`.
