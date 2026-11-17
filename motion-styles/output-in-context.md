---
name: "Output in context"
slug: "output-in-context"
type: "edit"              # also covers graphics
fits: [ad, social]
source: "Higgsfield Genjutsu Lite — step into a video (29 s), 9.17–18.6 s: https://video.twimg.com/amplify_video/2112640616387772416/vid/avc1/1920x1080/cBcDqM1e80f0gPNQ.mp4 · page https://whatships.com/videos/higgsfield-genjutsu-lite/. Higgsfield — motion design in After Effects (82 s), 55.5–56.2 s: https://video.twimg.com/amplify_video/2098407971227398144/vid/avc1/1920x1080/jFycYXjVGgAwzmzi.mp4 · page https://whatships.com/videos/higgsfield-motion-design/. Higgsfield Plugin for Photoshop is live. (46 s), 41–43.6 s: https://video.twimg.com/amplify_video/2066570754263805952/vid/avc1/1920x1080/ik3NRDb7f_mmmBap.mp4 · page https://whatships.com/videos/higgsfield-plugin-for-photoshop/"
used_in: []
---

# Output in context

## What it looks like
The finished output is shown where it will actually live. Either a vertical social feed: the clip centred, its neighbours ghosted above and below, comment bubbles floating up beside it, small price pills. Or the real world: a hard cut from the design on screen to the same design on a Times Square billboard, held for a beat, then a whip pan out. It answers "and then what?" in one shot.

## Breakdown
- **Feed (Genjutsu Lite, 9.17–18.6 s):**
  - It enters through a colour bloom. The chat overexposes to white and hot pink (9.17–9.46 s), and a vertical clip card resolves out of the haze with its neighbours ghosted (9.50–9.80 s).
  - Three clips (fashion, football, drama) in about 9 s. Floating comment bubbles ("wait how did she do that", "is it expensive?", "bro it is free to try"), green and blue pills ("720p 3.5x CHEAPER", "1080p 5x CHEAPER"), and like counts ticking up.
  - 18.59 s: a hard cut to an empty grey set for the next part.
- **Billboard (Motion design, 55.5–56.2 s):** a hard cut at 55.5 s from the After Effects banner to the same banner on a Times Square billboard. At 56.03–56.2 s a whip pan with strong horizontal motion blur carries into the next shot.
- **Billboard as the payoff (Photoshop plugin, ~41–43.6 s):** a click on the mockup, then the poster on a billboard in a night city, the film's biggest moment (91 %).

## How to make it
- **Model:** the output is real. The billboard plate is generated or stock (quote it first). The feed is built as graphics.
- **Edit recipe (Remotion):**
  - Feed: a 9:16 `Clip` in a rounded card in the centre, its neighbours above and below at about 0.35 opacity and 0.92 scale. Scroll to the next clip with `ip(..., INOUT)` over 0.3 s plus `MBlur` (y). Bubbles arrive on the house spring, one at a time.
  - Billboard: corner-pin the output onto the plate (`matrix3d` from the four corners), match its grade and add a slow push-in. Leave with `whipOut` + `MBlur`.

## Watch out for
- No real platform logos or UI: a generic feed, with no Instagram or TikTok marks, icons or fonts.
- Comments, likes and prices must be real: comments from a real published post (with permission), real AdFlex prices, or none at all. Never invented social proof.
- The billboard is a mockup. Don't caption it as a real placement.
- AdFlex version: the feed card's rim and any price pill in the Generate purple (#8337F1 → #6730D4), and a sparkle-gradient bloom (#C95AC5 → #55AAFF) for the entrance instead of hot pink. Bubbles in Archivo (Cairo for Arabic comments). Fit: the ad AdFlex made, playing in a feed.

## Examples
- Reference only so far. Related: [deliverables-parade](deliverables-parade.md), [whip-pan-cut](../transitions/whip-pan-cut.md), [in-world-oner](in-world-oner.md).
