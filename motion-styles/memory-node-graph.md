---
name: "Memory node graph"
slug: "memory-node-graph"
type: "graphics"
fits: [hero, ad]
source: "Supercomputer — How to run paid ads on Supercomputer… (68 s), 60–62 s (beat 60–65.5 s): https://video.twimg.com/amplify_video/2055680164101832704/vid/avc1/1920x1080/kjD89CicQd4hkiFs.mp4 · page https://whatships.com/videos/supercomputer-4350/. Supercomputer turns ideas into short dramas at scale. (98 s), 89–91 s (beat 86.9–92 s): https://video.twimg.com/amplify_video/2055362554424332288/vid/avc1/1920x1080/Qru7EJrW-PlDd7N-.mp4 · page https://whatships.com/videos/supercomputer-8048/"
used_in: []
---

# Memory node graph

## What it looks like
To show what the AI remembers, the film draws a small map: an avatar disc in the middle, spokes running out to icon nodes, and labelled pills and dark note cards hanging off them ("Founder · Solo", "26 y.o", "Brooklyn, NY", "Saving to long-term memory"). It turns an invisible feature, memory, into something you can watch grow.

## Breakdown
- **Text and graphics:**
  - Hub: the avatar disc. Spokes: thin lines to icon nodes. Leaves: rounded labelled pills (4350) or dark text cards (8048).
- **Cuts and timing:**
  - Supercomputer 4350: the avatar disc drifts slowly (from 60 s), then the graph appears around it, then "Skill locked: full campaign generation runs every Thursday…" (to 65.5 s).
  - Supercomputer 8048: a glowing-rim iris closes the UI into a circle and a blue orb rolls into it (86.9–88.2 s). Then the graph with dark note cards, 88–92 s, just before the end card.
- **Where it sits:** near the end, after the run is done and automated. It says "and it will remember this next time".

## How to make it
- **Model:** none. The content comes from the real account: `get_brand_kit` (logo, colours, fonts) and `get_business_context` (what the business sells, its audience, its tone).
- **Edit recipe (Remotion):**
  - Hub: the business's logo in a disc with an `Orb`-style glow behind it, drifting slowly (`Cam` with small `x`/`y`).
  - Spokes: SVG lines drawn outward from the hub with `strokeDashoffset`. Each node or pill arrives on the house spring at the end of its line, ≤50 ms apart, so the whole graph is one beat.
  - Note card: a second beat after the graph settles (focal-point rule), with its text `Typed`.
  - Exit: 0.2 s ease-in, or straight into the end card.

## Watch out for
- Only real stored fields with their real values: a colour pill shows the brand kit's actual hex, a tone pill the actual text. No made-up personas, ages or cities.
- 5–7 nodes. More becomes a mind map nobody can read in 2 s.
- It's a diagram, not a screen. Don't dress it up as an AdFlex screen; where the real Brand Kit page exists, cut to it next.
- AdFlex version: spokes and node rims in the Generate purple (#8337F1 → #6730D4), the hub glow in the sparkle gradient (#C95AC5 → #55AAFF), pill text in Archivo (Cairo for Arabic). Fit: "AdFlex already knows your brand" (brand kit and business context).

## Examples
- Reference only so far. Related: [connector-handshake](connector-handshake.md), [3d-icon-pops](3d-icon-pops.md), [comet-chips](../transitions/comet-chips.md).
