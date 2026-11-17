# Motion styles

A library of motion styles copied from references: how the camera moves, how shots cut and transition, how text and graphics animate, and how the footage is graded. Each style is one file, so a new video can pick from it instead of starting from scratch.

## What a motion style is
**Copy freely:** camera moves, shot lengths and cut rhythm, transitions, text and graphics animation, grade and texture, sound-design cues (whooshes, hits, risers).

**Never copy:** the reference's story or characters, its footage, its licensed music, or its logos and brand assets. Those rules still come from `CLAUDE.md`.

## Types
Every style has one `type`:

| Type | Covers | Example |
|---|---|---|
| `camera` | How the camera moves and frames | handheld selfie, drone push-in, locked-off wide |
| `transition` | How one shot becomes the next. **These live in [`transitions/`](../transitions/README.md)**, not here. | white bloom → colour flood, whip pan, match cut |
| `edit` | Cut rhythm and pacing | 1.2 s hard cuts on the beat, multi-shot gag montage |
| `graphics` | Text, UI and card animation | typed prompt, numbered step cards, popping ad cards, PiP screens |
| `look` | Grade and texture | faded 1990s 35 mm film with grain, neon gradient |

Each style also lists the video types it `fits`: `ad`, `social`, `hero`.

## Adding a style
1. Copy `templates/motion-style.md` to `motion-styles/<slug>.md`.
2. Fill in the breakdown from the reference (timings, moves, colours), the paste-ready prompt wording and the edit recipe.
3. Add a row to the index below, under its type.
4. When a video uses it, add the slug to that video's `motion_styles` field in `brief.md` and to the style's `used_in`.

## House motion rules
Every animated element (2D or 3D) uses the same motion language, so a video feels like one piece. These rules come from Disney's 12 principles as adapted by the `12-principles-of-animation` skill (in `.claude/skills/`; run it to audit any animation code), with the UI-only rules dropped for video.

| Rule | Value | Why |
|---|---|---|
| Entrances | One spring everywhere: mass 0.6, stiffness 140, damping 12 (about 7 % overshoot, settles in about 0.5 s) | Same weight and bounce for every object. Use a spring, not an easing curve, when something should overshoot and settle. |
| Exits | 0.2 s, ease-in (cubic): starts slow and speeds up as it leaves | Objects build momentum to leave. A linear exit looks mechanical. |
| Stagger | ≤ 50 ms between items of a group | A group reads as one beat. Longer gaps are allowed only when they tell the story (bars growing one by one, money leaking out). |
| Punch / squash | ≤ 1.05× scale | Subtle deformation. Big pulses read as jitter. |
| Anticipation | Graphics land 60 ms before their spoken word | The eye arrives just before the ear. |
| Focal point | One prominent arrival at a time; let a pop settle before the next starts | Competing entrances split attention. |
| Fades and decays | Exponential (flash τ ≈ 60 ms, `afade curve=exp`) | Natural decay, not linear. |
| Motion blur | 180° shutter on anything that moves fast (spins, fly-ins) | Matches real camera footage. |
| Units | All timings in seconds, never frames | The same code renders at 30 or 120 fps. |

The code that applies these rules is `tools/talking-head-reel/remotion/src/motionTokens.ts` (3D) and the `SPRING_*` / `EXIT_S` / `STAGGER_S` / `PUNCH` constants in `tools/talking-head-reel/scripts/motion.py` (2D). For Remotion work in general, follow the `remotion-best-practices` skill.

## Index
| Style | Type | Fits | Source | Used in |
|---|---|---|---|---|
| [Glitch-split title + whip-blur cards](glitch-split-whip.md) | graphics | hero, ad, social | Higgsfield Genjutsu launch promo | workflow-hero |
| [3D icon pops in a safe box](3d-icon-pops.md) | graphics | social, ad | Claude talking-head reel (Nov 2026) | Claude talking-head reel (outside the repo) |
| [Word-synced Arabic pop captions](word-synced-captions.md) | graphics | social, ad | Claude talking-head reel (Nov 2026) | Claude talking-head reel (outside the repo) |
| [Talking-head punch edit](talking-head-punch.md) | edit | social, ad | Claude talking-head reel (Nov 2026) | Claude talking-head reel (outside the repo) |
| [UI step walkthrough](ui-step-walkthrough.md) | edit | hero, ad | Higgsfield Short Drama Studio | |
| [In-world AI oner](in-world-oner.md) | camera | hero, social, ad | Higgsfield Seedream 5.5 | |
| [Slot-machine list](slot-list.md) | graphics | hero, ad, social | Higgsfield Fable 5.2 × MCP | |
| [Accent-typed prompt](accent-typed-prompt.md) | graphics | hero, ad, social | Higgsfield Fable 5.2 × MCP | |
| [Light-bar scramble title](scramble-bar-title.md) | graphics | hero, ad, social | Higgsfield Black Friday card | |
| [3D title inside the scene](chrome-title-in-scene.md) | graphics | hero, social, ad | Higgsfield Talent Contest | |
| [Corner labels: typed and smeared](corner-type-labels.md) | graphics | hero, social, ad | Higgsfield Talent Contest, Seedream 5.5 | |
| [Deliverables parade](deliverables-parade.md) | edit | hero, ad, social | Higgsfield MCP × Claude "Burger Queen" | |
| [Option board around one ad](option-board.md) | graphics | hero, ad | Higgsfield Ad Multiplier | |
| [Proof numbers](proof-numbers.md) | graphics | hero, ad | Higgsfield Ad Multiplier, Higgsfield in ChatGPT | |
| [In-scene control widgets](in-scene-widgets.md) | graphics | hero, ad, social | Higgsfield Miracle, AI Influencer | |
| [Status line zoom](status-line-zoom.md) | graphics | hero, ad, social | Higgsfield Supercomputer | |
| [Input tray under the player](input-tray-under-player.md) | graphics | hero, ad | Higgsfield Kling 4.0 | |
| [Compare cards](compare-cards.md) | graphics | hero, ad, social | Higgsfield Omni 1.1 Flash, Genjutsu | |
| [Button press](button-press.md) | graphics | hero, ad, social | Higgsfield Supercomputer, Academy | |
| [Connector handshake](connector-handshake.md) | graphics | hero, ad, social | Higgsfield Supercomputer | |
| [Memory node graph](memory-node-graph.md) | graphics | hero, ad | Higgsfield Supercomputer | |
| [Accent-word headline](accent-word-headline.md) | graphics | hero, ad, social | Higgsfield AI launch, Omni 1.1 Flash, Claude + Higgsfield MCP | |
| [Text behind the subject](text-behind-subject.md) | graphics | hero, ad, social | Higgsfield Katana, Omni 1.1 Flash, Claude + Higgsfield MCP | |
| [Corner promo bug](corner-promo-bug.md) | graphics | ad, social | Higgsfield Hell Grind, Passport Rush | |
| [UI macro dolly](ui-macro-dolly.md) | camera | hero, ad | Higgsfield Supercomputer | |
| [Cursor auto-zoom](cursor-auto-zoom.md) | camera | social, ad | Open-source AI studio screen recording | |
| [Result over process split](result-over-process-split.md) | edit | social, ad | Higgsfield Astra cursor, Astra animate, Motion pipeline | |
| [Output in context](output-in-context.md) | edit | ad, social | Higgsfield Genjutsu Lite, Motion design | |
| [Chapter cards](chapter-cards.md) | edit | ad, social | Higgsfield Academy | |
| [Flash-forward cold open](flash-forward-cold-open.md) | edit | ad, social | Higgsfield Passport Rush, Claude + Higgsfield MCP | |

The links to every source video are in each file's `source` field and in [`references/hero/README.md`](../references/hero/README.md). Transitions are indexed in [`transitions/README.md`](../transitions/README.md).
