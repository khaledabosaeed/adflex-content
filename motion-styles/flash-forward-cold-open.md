---
name: "Flash-forward cold open"
slug: "flash-forward-cold-open"
type: "edit"
fits: [ad, social]
source: "Passport Rush — an open-source hybrid short (303 s), 0–5 s: https://video.twimg.com/amplify_video/2103563594655031296/vid/avc1/1920x1080/_t0m0eC0u3GLYTh_.mp4 · page https://whatships.com/videos/passport-rush/. Claude + Higgsfield MCP — 18-minute breakdown of… (1134 s), 0–26.17 s: https://video.twimg.com/amplify_video/2056404580619919361/vid/avc1/1920x1080/wT7FGshDUzNLLoiU.mp4 · page https://whatships.com/videos/claude-higgsfield-mcp/"
used_in: []
---

# Flash-forward cold open

## What it looks like
Before the story starts, the film shows its best moments out of order: about eight sub-second shots from later on (a face, an explosion, a rooftop ninja, a police scan, a skydive) in 3.5 s, then black, then the slow, normal opening. The viewer knows where it's going and stays for it. In the deliverables variant, a 26 s motion-graphics sizzle shows everything one prompt made (brand intro, UGC, product review, motion shots, TV spot, then the whole grid) before a presenter appears to explain how.

## Breakdown
- **Burst (Passport Rush, 0–3.5 s):**
  - About 8 cuts: 0.54, 0.67, 0.75, 0.83, 0.92, 1.33, 2.13 and 2.92 s. The first shot holds 0.54 s, then four very short ones (0.08–0.13 s), then four of 0.4–0.8 s.
  - 0.65–0.875 s: six graphic ink "impact" frames before the explosion lands at 0.90 s.
  - About 3.5–5 s: black. Then the story opens on an establishing shot.
  - The explosion in the teaser pays off at ~78 s, so the teaser pre-sells the film's biggest moment.
- **Sizzle (Claude + Higgsfield MCP, 0–26.17 s):** logo → prompt typed and sent (~2–5 s) → one deliverable every 2–3 s → everything slides up into a grid with the lockup in the centre (23.2–26 s) → hard cut at 26.17 s to the presenter at his desk.

## How to make it
- **Model:** nothing extra. The burst reuses shots from the same film, and the sizzle uses the real deliverables of the run.
- **Edit recipe (Remotion):**
  - A list of `{src, trimBefore, dur}` played back to back as `Clip`s, with durations taken from a cut list like the one above and cuts on the music's hits.
  - Then a black `AbsoluteFill` for about 1–1.5 s (the reference holds black for about 1.5 s) before the first story shot.
  - Sizzle variant: build it as a [deliverables-parade](deliverables-parade.md), end on the grid, then hard-cut to the presenter.

## Watch out for
- Only use shots that are really in the film. A teaser shot that never comes back feels like bait.
- Pick the 3–4 strongest shots to carry it. The 2–3-frame shots are flashes, not information.
- The ink impact frames are white, high-contrast flashes. Skip them on a soft, premium piece (hero rule).
- AdFlex version: the burst is the best real outputs of the run (the ads, the video's peak). Any type is Archivo, and if Claude/ChatGPT/MCP are named they stay small and equal-weight after AdFlex.

## Examples
- Reference only so far. Related: [deliverables-parade](deliverables-parade.md), [talking-head-punch](talking-head-punch.md), [corner-promo-bug](corner-promo-bug.md).
