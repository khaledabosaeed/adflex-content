# Hero references

16:9 showcases for the website or one product feature: motion graphics, product transformations, launch promos.

## What makes a good hero reference
- It shows the product's output, not a person talking about it.
- Bold motion graphics: big type, cards, transitions that carry the eye.
- It works silent and loops cleanly for a website hero.
- It comes from a polished AI-product launch, so the bar is high.

## Where to search
| Place | How | Notes |
|---|---|---|
| **Higgsfield feature cards** | `cdn.higgsfield.ai/card/<id>.mp4` and similar links from higgsfield.ai feature pages. | 3 of our hero references came from Higgsfield. They're direct mp4s, so Claude can import them. |
| **AI product launch videos** | Launch posts from OpenAI, Runway, Kling, Pika, Krea, Midjourney, Artlist on their sites, YouTube and X. | Claude can search YouTube and import directly. |
| **Product landing pages** | The hero videos on AI tools' home pages. | Claude can read a page and pull its video links. |
| **Motion design galleries** | Behance (motion graphics), Dribbble, Vimeo staff picks. | Good for one motion style rather than a whole structure. |

**Search words:** product launch video, feature launch, motion graphics promo, input output AI, "now available", hero video.

## Reference libraries
Curated sites to browse before searching the open web. Checked 2026-11-15 with agent-reach and Playwright.

| Site | What it is | Size | Access | Best for |
|---|---|---|---|---|
| [What Ships](https://whatships.com/) | Curated launch videos, demos and walkthroughs posted on X, each linking the original post. Filters: AI, Developer tools, Design, Motion, Productivity, Consumer, Hardware. Also lists [launch-video studios](https://whatships.com/studios/) and [tools](https://whatships.com/tools/). | 3,203 videos, 119 tools, 14 studios | Free. Has an [MCP server](https://whatships.com/mcp/) (`search_videos`, `get_video`) and a [JSON index](https://whatships.com/search-index.json). | Finding how AI tools launch, by category |
| [Launchscene](https://launchscene.app/) | Launch videos cut into labelled scenes: hook, feature reveal, demo, CTA, and techniques such as kinetic type, 3D mockup, UI zoom, morph, split screen. | 2,246 videos, 66,594 scenes | Free to browse, paid plans. MCP server free in beta. | Finding one **motion style** or scene type (maps to `motion-styles/`) |
| [Refs](https://refs.video/) | Launch and brand films measured cut by cut into blueprints and prompts "your agent can build from". AI search by description or link. | 5,416 films | Part free, Pro is paid. Has an MCP. | Exact shot timings and structure to copy |
| [Launch Gallery](https://launchgallery.video/) | Handpicked launches from X and YouTube, tagged (Agents, Design, Fintech, YC…). | 550+ videos | Free | Quick browsing |
| [launch.gallery](https://launch.gallery/) | Launch videos curated daily (Figma, Framer, ElevenLabs…). | — | Free | Big-brand launch films |
| [Global Launch Directory](https://www.launchvideo.com/directory) | Launches on X with view stats, run by The Launch Video Company. | — | Free | Seeing which launches got the most views |
| [Swipefile · Videos](https://swipefile.design/videos/) | Motion design, intros and launches, each with a note on what to study. | 110 videos | Free | Hardware and product films |
| [Motion Index](https://www.motionindex.io/) | Product commercials and 3D motion design, filtered by category (perfume, drinks, beauty, automotive…). | 14,875 shots, 893 videos | Free to browse, Pro is paid | Product macro and 3D hero shots |
| [Comotion](https://comotion.design/) | AI-made videos sorted by design style (Product Ad, Product Demo, Kinetic Type, Claymation, Paper Collage…), each with how it was made and the prompt. | — | Browse free, paid credits. Has an MCP. | AI-made styles with prompts we can adapt |
| [landing.love · Hero](https://www.landing.love/section/hero/) | Animated website hero sections from real sites, as short clips. | 1,657 heroes | Free | The hero section around our video, not the video itself |

Also found but not useful right now: LaunchDB (launchdb.xyz) was down when checked; okara.ai/launch-library sits inside a marketing-agent product.

### Worth watching on What Ships
Launches close to what AdFlex does:
- [Dreamina — Marketing Studio](https://whatships.com/videos/dreamina-marketing-studio/)
- [AdaL v2 — the video agent for GTM](https://whatships.com/videos/adal-v2/)
- [ego lite — a film crew from one prompt](https://whatships.com/videos/ego-lite-film-crew/)
- [Higgsfield Miracle — real-time layered video editing](https://whatships.com/videos/higgsfield-miracle/)
- [Krea Video — Hollywood-grade in browser](https://whatships.com/videos/krea-video/)
- [Ditto — swap yourself into any viral video](https://whatships.com/videos/ditto-melius/) (a Genjutsu-like swap)
- [Makina — YouTube ideation inside Claude](https://whatships.com/videos/makina-claude/) and [Runway Dev — now on Claude Code](https://whatships.com/videos/runway-dev-claude-code/) (tools that live inside Claude, like our MCP story)

## References
| Reference | Link | Used in | What we took |
|---|---|---|---|
| Higgsfield × ChatGPT "GPT Image 2.6" ad (23.2 s, 16:9) | https://static-public-media.higgsfield.ai/cards/b6c4b359-bce7-489b-99ca-b8dc0fb00cbd.mp4 | diner-hero, bloom-hero | A logo flies out of Generate and transforms real objects; typed prompts; hard cuts; a white-bloom → colour flood reveal |
| Higgsfield Genjutsu card video (10 s) | uploaded as `genjutsu.webm` | genjutsu-promo | Structure and pacing of input→output swap cards |
| Higgsfield Genjutsu launch promo (19 s, 16:9, silent) | https://cdn.higgsfield.ai/card/16eebc9a-8310-4f68-8a02-1e2e6f109169.mp4 (AdFlex copy: https://cdn.adflex.ai/alfa-attachments/6a4e858a12b2fc125b9e380a/318b06d0-757e-48dd-8f82-edbb67627ef1.mp4) | not used yet (reviewed 2026-11-15) | Wordmark glitch-split title → use-case cards → diagonal anime/real split with 0.5 s matched cuts → "KEEP camera / lipsync / motion" tilted cards with whip-blur → live-action object swap → product macro payoff |
