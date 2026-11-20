---
title: "Every client, its own ALFA"
slug: "alfa-hero"
status: "editing"            # idea / script approved / stills / animating / editing / done / published
type: "hero"
format: "~18 s, 16:9, 1920x1080, 24 fps, loop; silent site file + a music cut"
language: "English (on-screen labels only)"
adflex_account: "prod Adflex for the ALFA recording; devAdflex for stills"
characters: ""            # new: young woman, agency marketer (character file to write)
motion_styles: [ui-macro-dolly, accent-typed-prompt, corner-type-labels, accent-word-headline, button-press, hard-cut-blur-settle, card-to-fullbleed, pixel-square-burst, dive-through, render-reveal, motion-match-cut]
cta: "ALFA · AVAILABLE ON ADFLEX.AI"
production_chat: ""
cost_credits: 6778.5
final_url: ""
published: false
---

# ALFA hero: "Every client, its own ALFA"

## Goal
- **Why this video exists:** introduce ALFA, the AdFlex marketing agent, on the website hero: you tell it one line and it does the marketing while you run your business.
- **Audience:** small business owners and marketers who don't have time for daily content.
- **Where it runs:** website hero section (autoplays muted, loops).
- **Success metric:** TODO

## Idea: "Every client, its own ALFA" (script v3, 2026-11-17)
**Now script v15 (2026-11-18), cut v20 (sound + SFX on every transition) / v18 (silent, website): the bored trip.** No clients or brands: bored Leen asks ALFA to take her somewhere wild, her screen pulls her in, and she tours the rooftops, a boxing ring and the desert, prompting her way out of each jam until "Take me home!" drops her back in her chair. **Script v14:** opens on Leen bored at her desk writing to ALFA, then the v13 sequence. **Script v13:** the v11 story in English, and Leen herself carries each transition (generated first/last-frame clips: into her laptop, down between the roofs into the ring, under the punch onto the bike, off the bike into her chair). **Script v12:** Talent Contest transitions done in the edit. **Script v11 "Get me out of here":** with each prompt Leen lands in a client's world doing what they do (VOLT rooftops, KNOCKOUT ring, DUNE dunes), each ends in a jam, and a floating ALFA prompt in Arabic gets her out and into the next; all generated footage plus motion graphics (team decision). See production.md "Script v11". **Before that, script v10:** Leen steps into each client's world with ALFA on her laptop. **Earlier, script v5:** no new screen recordings. ALFA's UI is crops of the 3 existing recordings (home chips, typing, status lines, Approve and run); the action reels and her desk are generated. The calendar, client switch, results, comments and memory beats below are dropped. See [production.md](production.md#script-v5-no-new-screen-recordings-2026-11-18-not-approved).

The hero is a young woman who works at a small marketing agency and juggles three action-brand clients (VOLT sneakers, KNOCKOUT boxing gym, DUNE desert bike tours; all invented, no logos). The video opens on VOLT's ALFA-made action reel under a giant ALFA title (v4). Monday: she asks ALFA to plan one client's week, then switches client and the same card turns into the next client's brand, with its own plan, at the same framing. Friday: she asks how the week went, ALFA reads each client's real results and comments, and next week's plan rebuilds itself better. It ends on the action reel full frame, then in the client meeting: the reel on the meeting-room screen, VOLT's marketing lead punching the air. The loop goes back to Monday at her desk.

Why an agency: it's where marketing work multiplies (many brands, many calendars, many reports), and AdFlex supports it: each client is its own business with its own brand kit, memory, social accounts and insights, and team members can be invited to a business.

Shown honestly: she asks each time (ALFA doesn't run by itself), memory is saved after she confirms, comment replies are drafts she sends, insights are FB/IG only.

Earlier versions the same day: v1/v2 "The week that learns" (a baker in her bakery), and A/B/C. The team asked for the agency setting and a woman as the hero.

## Competitors (researched 2026-11-17)
9 agent films watched frame by frame (Pomelli Agent and v1, Icon, Okara AI CMO, Jasper Agents and "Marketing, Reimagined", Dreamina Marketing Studio, AdaL v2, Canva AI), plus the agent films already in [`references/hero/README.md`](../../../references/hero/README.md#competitor-ai-marketing-agents).
- **Clichés (most common first):** prompt or URL → agent working (ticked steps, terminal log, spinner) → grid or parade of outputs; a gradient void with floating cards; a "team of agents" or mascot; a cute "Yes" click; vanity metrics; founder talking to camera.
- **Gaps:** no business owner is ever the hero; no real place or time of day; the output never lands in the physical world; nothing after posting (results, customers); nothing Arabic; none is a short silent loop.
- **Not a gap:** brand memory. Pomelli owns it ("Business DNA", Brand Book). If we show memory, show it through the person, never as a DNA card.
- **So we avoid:** output grids, step-list or log screens, gradient voids, mascots. We use: a real person in a real place at a real time, what happens after posting, and the result landing in the shop.

## What ALFA really does (read from adflex-be, 2026-11-17)
Source: `adflex-be/src/modules/alfa/` (tool list in `tools/agent-tool.catalog.ts`). Show only these in the video.
- **Learns the brand:** `scan_brand_url` (website), `sync_verified_instagram_style` (learns the visual style from 2–3 of the brand's own Instagram posts), brand kit, `update_brand_kit`, `apply_brand`.
- **Remembers:** `remember_context` saves stable preferences ("always…", "we never…") into every future chat; a daily cron (`business-memory-miner`) also learns habits (preferred model, usual posting hour).
- **Watches competitors:** `scan_competitor_url` reads a rival's site and compares it to your brand (gaps, ways to stand out). Also `web_search`.
- **Plans:** `plan_content_calendar` builds an editable day-by-day plan (date, platform, format, concept, caption seed).
- **Makes:** images, product photos, video, storyboards, voiceover, music, SFX, Genjutsu, text overlays, logo on video, workflows.
- **Posts:** draft, schedule, publish, reschedule on Facebook, Instagram, LinkedIn, TikTok (publish), X (publish only).
- **Reads the results:** `get_post_insights` (real views, reach, likes, comments, shares for FB/IG).
- **Reads comments and DMs:** `list_inbox_comments`, `read_inbox_conversation`. It **drafts** replies only; the person sends them from Inbox. Never show ALFA sending a reply.
- Every paid step shows a cost card for the user to confirm.

## Reference
- Higgsfield Short Drama Studio (structure: input → process → result in 15 s, real UI centred) and Supercomputer (status lines), both in [`references/hero/README.md`](../../../references/hero/README.md).
- Hero rules: [`videos/hero/README.md`](../README.md).

## Open questions
1. Approve script v5 (existing recordings + generated action)?
6. The recordings are on dev/localhost and the prompt is a workflow request. OK for the public hero, or re-record on prod later?
2. ~~The heroine~~ Leen ([characters/leen.md](../../../characters/leen.md)); VOLT's marketing lead is Reem ([characters/reem.md](../../../characters/reem.md)). Both striking women, per the team.
5. ~~(v4)~~ We needed 3 client businesses on prod with brand kits; at least one needs a connected IG/FB account with real posts and comments for the insights shot. Which accounts?
3. ~~Which ALFA capabilities are live?~~ Answered from the code (see above); confirm each one we show works on prod when recording.
4. ~~Who records the real ALFA chat on prod?~~ No new recordings (v5).

## Motion styles
See "Motion and transitions (v3)" in [production.md](production.md): calm everywhere, one bold dive-through into her laptop at ~47 %, UI over her real office instead of a gradient void, and a loop on the laptop lid.

## Files
- [production.md](production.md): script, shot list, versions, feedback
- [assets.md](assets.md): full links to every asset
- `build/`: editing scripts (Remotion builds: `build/remotion/`, from `templates/remotion-video`)
