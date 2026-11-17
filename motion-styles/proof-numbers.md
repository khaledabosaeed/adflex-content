---
name: "Proof numbers"
slug: "proof-numbers"
type: "graphics"
fits: [hero, ad]
source: "Higgsfield Ad Multiplier launch (33 s), 5–6 s and 28–29 s: https://video.twimg.com/amplify_video/2092348961063677952/vid/avc1/1920x1080/wHHfzAMUzERqzJ0f.mp4 · page https://whatships.com/videos/higgsfield-ad-multiplier/. Higgsfield in ChatGPT and Codex (59 s), 30–40 s: https://video.twimg.com/amplify_video/2087552798531702785/vid/avc1/1920x1080/9eBlCe8-31tFizAb.mp4 · page https://whatships.com/videos/higgsfield-chatgpt-plugin/"
used_in: []
---

# Proof numbers

## What it looks like
The ads don't just get made, they get *results*, and the video shows the numbers. A "YOUR TOP PERFORMER" card with ROAS and CTR under it. A real Ads Manager window filling with the generated ads. An insights dashboard whose line chart draws itself. A big "ROAS 0x" that counts up to "4.2x" while the top ads slide in beside it. A globe that turns and shows "+90 % ROI GERMANY", "+137 % ROI TÜRKIYE", "+160 % ROI BRAZIL". It closes the loop from "make ads" to "make money".

## Breakdown
- **Text and graphics:**
  - Numbers are big and set in the same family as the labels, in a lime pill or lime text. The labels are small grey caps.
  - Counters count up over about 1 s (ease-out), not instantly.
  - The globe is a slow 3D turn with country labels that pop in on the brand spring.
- **Cuts and timing:** 1.5–3 s per proof beat, always *after* the ads are shown, never before.
- **Sound cues:** a ticking counter and a soft "ding" when it lands.

## How to make it
- **Model:** none.
- **Edit recipe (Remotion):**
  - Counters: `Math.round(ip(f, [at, at + 1 s], [0, target], OUT) * 10) / 10`, with tabular numerals.
  - Dashboard: a real Ads Manager or AdFlex insights recording if we have one. The chart line is an SVG path with `strokeDashoffset` animated.
  - Globe: React Three Fiber with an earth texture, rotating slowly, plus HTML labels.

## Watch out for
- **Only real numbers.** Use a real campaign's numbers with permission, or label them clearly as an example. Never invent ROAS or ROI (house rule: nothing made up).
- Use AdFlex's own insights screens, not someone else's dashboard, wherever possible.
- AdFlex version: numbers in the Generate purple. Arabic markets on the globe: Saudi Arabia, UAE, Jordan, Egypt.

## Examples
- Reference only so far.
