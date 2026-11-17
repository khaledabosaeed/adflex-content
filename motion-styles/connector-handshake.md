---
name: "Connector handshake"
slug: "connector-handshake"
type: "graphics"
fits: [hero, ad, social]
source: "Supercomputer — How to run paid ads on Supercomputer… (68 s), 8.24–8.9 s (setup 3.5–8.2 s): https://video.twimg.com/amplify_video/2055680164101832704/vid/avc1/1920x1080/kjD89CicQd4hkiFs.mp4 · page https://whatships.com/videos/supercomputer-4350/"
used_in: []
---

# Connector handshake

## What it looks like
After a connector is ticked in a list, the list fades away and two app icons appear side by side with a row of dashes between them. The second icon pops in with a small overshoot, and the dashes fill in one after another like a loading bar until the two apps are linked. It turns the "connected" moment into an animation of under a second.

## Breakdown
- **Before it (3.5–8.2 s):** the cursor opens "+", then Use Skill / Connectors, then the connector list, and Telegram is ticked.
- **The handshake (8.24–8.9 s):**
  - The connector list fades out in about 0.15 s.
  - The Higgsfield logo and the Telegram icon pop in. The Telegram icon scales up with overshoot.
  - The dashes between them fill in one by one, like a loader.
  - It holds until about 10 s, when the run starts ("Running 10 subagents…").
- **Echo later:** at 20.5 s, when the Telegram chat appears, a Telegram badge pops in at the bottom left with overshoot (20.7–20.9 s).

## How to make it
- **Model:** none.
- **Edit recipe (Remotion):**
  - Lead-in: the real recording of the connector being added (AdFlex in Claude's or ChatGPT's connector settings) in a `UIWindow`. Fade it out over 0.15 s.
  - Icons: AdFlex on the left, the AI app on the right. Each `scale` comes from the house spring (mass 0.6, stiffness 140, damping 12; about 7 % overshoot), the second 50 ms after the first.
  - Dashes: 8–12 small rounded bars. Dash `i` turns from grey to the purple gradient at `fillStart + i · 0.04 s` (≤50 ms stagger), each with a short `ip` fade.
  - After the last dash, a soft sparkle-gradient pulse runs along the line and decays exponentially. Then cut, or `whipOut`, to the first real result.

## Watch out for
- Show it only for a connection that really exists and is seen working right after (the AdFlex MCP connector in Claude or ChatGPT).
- AdFlex comes first: on the left, and it may be the bigger icon in this lockup. When Claude and ChatGPT are both shown, they are the same size and weight as each other.
- Real app icons only, no invented "MCP" glyph. If needed, write "MCP" in small Archivo caps under the line.
- AdFlex version: the dashes fill in the Generate purple (#8337F1 → #6730D4), and the pulse is the sparkle gradient (#C95AC5 → #55AAFF).

## Examples
- Reference only so far. Related: [memory-node-graph](memory-node-graph.md), [comet-chips](../transitions/comet-chips.md), [shockwave-rings](../transitions/shockwave-rings.md), [3d-icon-pops](3d-icon-pops.md).
