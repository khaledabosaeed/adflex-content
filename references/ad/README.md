# Ad references

Paid ads where a presenter, narrator or mascot shows AdFlex with real chat or UI recordings and ends on an ad CTA.

## What makes a good ad reference
- A hook in the first 2 s: a finished result, an impossible deadline, or a bold claim.
- The product is shown working (real screens, typed prompts, step cards), not just talked about.
- A clear payoff line and CTA.
- It comes from a competitor or a nearby AI tool and is clearly running as a paid ad, so it's proven to convert.

## Where to search
| Place | How | Notes |
|---|---|---|
| **Meta Ad Library** (facebook.com/ads/library) | Search advertisers such as Artlist, ImagineArt, Arcads, Higgsfield, Runway, Krea, Canva, CapCut. Filter to active video ads. | 3 of our 4 ad references came from here. Send the exact ad id: Claude can't use the search page reliably. |
| **TikTok Creative Center → Top Ads** | Filter by industry (tech / apps) and region (Saudi Arabia, UAE, Jordan). | Needs a person to browse. TikTok links can't be imported, so download and upload the file. |
| **YouTube** | Search "AI ad generator ad", "UGC AI ad", "AI agent marketing ad". | Claude can search and import these directly, and read transcripts. |
| **Instagram** | Sponsored reels from AI tools and AI creators in your feed. | Send the exact reel link. |
| **Competitor sites** | Launch and pricing pages of Arcads, Creatify, ImagineArt, Higgsfield. | Claude can read the page and pull any direct video links. |

**Search words:** AI ad generator, UGC AI, AI marketing agent, "one prompt" campaign, AI creative agent, إعلان بالذكاء الاصطناعي.

## Reference libraries
Curated ad libraries to browse before searching the open web. Checked 2026-11-15 with agent-reach and Playwright.

| Site | What it is | Size | Access | Best for |
|---|---|---|---|---|
| [UGC Agent · UGC ad examples](https://ugcagent.app/ugc-ads/examples/) | UGC video ads that ran 45+ days on Facebook and Instagram, with run length, number of copies and a Meta Ad Library link for each. Filters by niche (apps, beauty…) and format (testimonial, talking head, demo). | 1,922 ads from 130 brands | Free page | Proven UGC structures (ugc-reel style) |
| [AdSwipeFile](https://adswipefile.com/) | Winning Facebook and Instagram ads filed by brand, niche and format, with written descriptions. Built to be queried by Claude or ChatGPT. | 63,244+ ads | 7-day free trial, then paid | Searching ads by format or angle |
| [Starpop · AI ads library](https://starpop.ai/video-ad-library) | Meta ads from fast-growing DTC brands, plus handpicked AI video ads and free swipe files. | 324,813 ads from 118 brands | Free swipe files; brand tracking is paid | AI-made video ads |
| [Swipekit · Ad inspiration](https://swipekit.app/ad-inspiration) | Ads saved by Swipekit users across Meta, Instagram and TikTok, searchable by brand, niche, platform and format. | 1.9M ads | Free to browse, tool is paid | Volume: lots of examples of one format |
| [Swiped · Video ad breakdowns](https://swiped.co/videos/) | Written breakdowns of video ads and VSLs: hook, script and why it works. | 19 breakdowns | Part free | Learning script structure |
| [Foreplay · Swipe File](https://www.foreplay.co/swipe-file) | A tool for saving ads from the Meta and TikTok ad libraries into boards. | — | Paid tool | A shared team board of saved ads |

Launch-video libraries in [`../hero/`](../hero/README.md) (Launchscene, Refs, What Ships) also help with ads: their "hook", "demo" and "call to action" scenes apply to ads.

## References
| Reference | Link | Used in | What we took |
|---|---|---|---|
| Artlist "GPT Image 2.5 is now on Artlist" | Meta Ad Library id 1629598135330702: https://www.facebook.com/ads/library/?id=1629598135330702 | hayla-launch-reel | A mini-drama: impossible deadline → AI makes the whole campaign → results grid → payoff line |
| Artlist × Claude Opus 5.5 otter ad (1:35) | Meta Ad Library id 1792806264949166: https://www.facebook.com/ads/library/?id=1792806264949166 | zaatar-cat-reel | A mascot narrator walks through locations, PiP screens show the real chat, ending titles build up |
| ImagineArt Creative Agent ad by shira.wiggles (38 s) | Meta Ad Library id 1780278639910653: https://www.facebook.com/ads/library/?id=1780278639910653 | alfa-agent-reel | Result first → "I only explained the idea" → live prompt → numbered step cards → "0 settings touched" → recap → creator on camera |
| Arcads × Claude UGC reel | not saved | ugc-reel | "Turn Claude into a UGC machine": UGC ad hook, then a 3-step walkthrough |
