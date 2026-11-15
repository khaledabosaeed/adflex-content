# References

The viral videos and ads we adapt, split by video type like `videos/`. Each type has its own list and its own places to search, because good ads, social reels and hero videos come from different places.

| Type | List and where to search | References |
|---|---|---|
| `ad` | [ad/README.md](ad/README.md) | 4 |
| `social` | [social/README.md](social/README.md) | 3 |
| `hero` | [hero/README.md](hero/README.md) | 3 |

## Rules
- Reuse the **idea, structure and motion style**, never the story, characters, footage, music or logos.
- Links die, so the breakdown is the part that matters.
- Before searching outside, check this list, [`motion-styles/`](../motion-styles/README.md) and past videos' `production.md`.

## Reference libraries
Each type file has a **Reference libraries** table of curated sites (checked 2026-11-15). The strongest ones:
- **Hero:** [What Ships](https://whatships.com/), [Launchscene](https://launchscene.app/) and [Refs](https://refs.video/). All three have MCP servers, so Claude could search them directly once connected.
- **Ad:** [UGC Agent's 1,922 winning UGC ads](https://ugcagent.app/ugc-ads/examples/) and [AdSwipeFile](https://adswipefile.com/).
- **Social:** [Graynote · Virals](https://graynote.ai/virals), with daily view counts.

## How searching works
- **Exact links work best.** An exact Instagram reel, YouTube video or Short, or direct `.mp4` link can be imported and inspected with `import_web_video` for 0 credits.
- **Feeds don't.** Claude can't scroll Instagram or TikTok, and the Meta Ad Library search page is unreliable without an exact ad id. When the team finds something while scrolling, send the link.
- **TikTok links can't be imported.** Download the file and upload it instead.

## Adding a reference
1. Add a row to the right type's table.
2. If it's worth it, add a file `references/<type>/<slug>.md` with:
   - a shot-by-shot breakdown
   - why it works
   - what we'll keep and what we'll change
3. If it has a motion style worth reusing, save it in [`motion-styles/`](../motion-styles/README.md).
