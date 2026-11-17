# Transitions

How one shot becomes the next. Each transition is one file, copied from a reference with its timings, its link and a recipe, so a new video can pick one instead of inventing it. The other motion styles (camera, edit, graphics, look) live in [`motion-styles/`](../motion-styles/README.md), and its **house motion rules** apply here too: one spring, ease-in exits, timings in seconds.

## Pick a transition
Start with the calmest one that works. The team has rejected "too much motion" more than once (Bloom v4: no zoom-blur whips, white flashes, shake or burst rings; workflow-hero v8: calm motion, whips only between scenes).

| Moment | Calm (default) | Bold (once per video) |
|---|---|---|
| Between two shots or scenes | [hard-cut-blur-settle](hard-cut-blur-settle.md), [object-carry](object-carry.md), [motion-match-cut](motion-match-cut.md) | [whip-push](whip-push.md), [whip-pan-cut](whip-pan-cut.md), [colour-wash-cut](colour-wash-cut.md), [pixel-block-wipe](pixel-block-wipe.md) |
| Between two steps of a UI flow | [hard-cut-blur-settle](hard-cut-blur-settle.md), [ui-punch-in-cut](ui-punch-in-cut.md) | [card-stack-whip](card-stack-whip.md), [comet-chips](comet-chips.md) (into an "AI is working" step) |
| "AI is working" (the click) | [shockwave-rings](shockwave-rings.md) (calm send-glow variant) | [pixel-square-burst](pixel-square-burst.md) |
| From the UI to the result | [card-to-fullbleed](card-to-fullbleed.md) | [button-to-player-morph](button-to-player-morph.md) |
| Revealing a result | [render-reveal](render-reveal.md), [object-carry](object-carry.md) (flood reveal), [before-after-diagonal](before-after-diagonal.md) | [chroma-flip](chroma-flip.md), [button-to-player-morph](button-to-player-morph.md) |
| Opening title | [hard-cut-blur-settle](hard-cut-blur-settle.md), [title-to-ui](title-to-ui.md) | [flare-fly-in](flare-fly-in.md), [title-gap-window](title-gap-window.md) |
| Between two title words | [letter-blur-scatter](letter-blur-scatter.md) | |
| Into a new world or the payoff | [foreground-wipe](foreground-wipe.md) | [dive-through](dive-through.md) |
| "Any style / any format" | [style-swap-cut](style-swap-cut.md), [aspect-reframe-morph](aspect-reframe-morph.md) | [region-box-restyle](region-box-restyle.md) |
| Switch on / CTA | | [shockwave-rings](shockwave-rings.md) |

- **Hero (16:9 website):** hard cuts or object carry. Loops cleanly.
- **Ad:** one bold move on the payoff, calm everywhere else.
- **Social:** live-action ones work best (foreground wipe, whip pan, style swap).

## Index
| Transition | Fits | Model needed | Source | Used in |
|---|---|---|---|---|
| [Hard cut + blur settle](hard-cut-blur-settle.md) | hero, ad, social | no | Higgsfield Fable 5.2 × MCP | |
| [Object carry](object-carry.md) | hero, ad | no | Higgsfield × ChatGPT "GPT Image 2.6" ad | bloom-hero, workflow-hero |
| [Whip push](whip-push.md) | hero, ad, social | no | Higgsfield Genjutsu promo | workflow-hero |
| [Whip-pan cut (footage)](whip-pan-cut.md) | social, ad, hero | optional | Higgsfield Talent Contest | |
| [Card-stack whip](card-stack-whip.md) | hero, ad | no | Higgsfield Short Drama Studio | |
| [Blur-out → comet chips](comet-chips.md) | hero, ad | no | Higgsfield Short Drama Studio | |
| [Chroma flip-in](chroma-flip.md) | hero, ad, social | no | Higgsfield Short Drama Studio | |
| [Button → player morph](button-to-player-morph.md) | hero, ad | no | Higgsfield Short Drama Studio, Bolt.new film | |
| [Toggle shockwave rings](shockwave-rings.md) | hero, ad, social | no | Higgsfield Fable 5.2 × MCP | |
| [Dive through an object](dive-through.md) | hero, ad, social | optional | Higgsfield Talent Contest, workflow-hero v3 | workflow-hero (v3) |
| [Flare wash + title from behind the camera](flare-fly-in.md) | hero, social, ad | optional | Higgsfield Talent Contest | |
| [Foreground wipe](foreground-wipe.md) | hero, ad, social | optional | Higgsfield Seedream 5.5 | |
| [Style-swap match cut](style-swap-cut.md) | hero, social, ad | yes | Higgsfield Talent Contest, Genjutsu promo | |
| [Before → after diagonal wipe](before-after-diagonal.md) | hero, ad, social | no | Higgsfield Production Skills Bundle | |
| [Render reveal (placeholder → final)](render-reveal.md) | hero, ad, social | optional | Higgsfield Blender, Playable, API cashback | |
| [Card → full bleed](card-to-fullbleed.md) | hero, ad, social | no | Higgsfield Fable 5.1, Supercomputer, Motion design, Genjutsu Lite, AI launch | |
| [Title → UI](title-to-ui.md) | hero, ad | no | Higgsfield Photoshop plugin, Claude + Higgsfield MCP | |
| [UI punch-in cut](ui-punch-in-cut.md) | hero, ad | no | Higgsfield Supercomputer | |
| [Pixel-square burst](pixel-square-burst.md) | hero, ad, social | no | Higgsfield Academy, Fable 5.1, Genjutsu Restyle | |
| [Title gap window](title-gap-window.md) | hero, ad, social | no | Higgsfield Genjutsu, Claude + Higgsfield MCP | |
| [Letter blur scatter](letter-blur-scatter.md) | hero, ad, social | no | Higgsfield AI launch, Claude + Higgsfield MCP | |
| [Aspect reframe morph](aspect-reframe-morph.md) | ad, social, hero | no | Higgsfield Shorts, Explainer | |
| [Region-box restyle](region-box-restyle.md) | hero, ad, social | yes | Higgsfield Genjutsu Restyle | |
| [Motion match cut](motion-match-cut.md) | social, ad, hero | yes | Higgsfield Genjutsu | |
| [Colour wash cut](colour-wash-cut.md) | social, ad, hero | no | Higgsfield Genjutsu Lite, Genjutsu Restyle, Omni 1.1 Flash | |
| [Pixel-block wipe](pixel-block-wipe.md) | social, ad | no | Higgsfield Kling 4.0, Astra cursor, Playable, Explainer | |

"Optional" means there's an edit-only recipe and an AI-generated one. Generating costs credits: quote them and get a yes first.

## Adding a transition
1. Copy [`templates/motion-style.md`](../templates/motion-style.md) to `transitions/<slug>.md` and set `type: "transition"`.
2. Put the reference's **direct video link** (and its page) in `source`, with the seconds where the transition happens.
3. Write the timings in seconds, plus the edit recipe using the helpers in `templates/remotion-video/src/lib.tsx`.
4. Add a row to the index above, and to "Pick a transition" if it fills a gap.
5. When a video uses it, add the slug to that video's `motion_styles` in `brief.md` and to the file's `used_in`.
