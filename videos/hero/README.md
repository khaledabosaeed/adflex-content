# Hero video rules

The rules every AdFlex hero video follows. They come from what the six Higgsfield home-page heroes and all 35 Higgsfield launch films on What Ships have in common (measured frame by frame on 2026-11-17) and from the team's feedback on our own heroes (bloom-hero, workflow-hero). Read this before writing a hero's `production.md`. For motion, also read the house motion rules in [`motion-styles/README.md`](../../motion-styles/README.md) and pick transitions from [`transitions/README.md`](../../transitions/README.md).

## What a hero is for
A website hero autoplays **muted**, **loops**, and sits next to the page's own headline and button. So the video doesn't need to sell with words or end on a call to action. It needs to show **one feature working, from input to result**, in a way that reads in the first second and keeps moving until it loops.

## 1. Format
- **Length:** 12–20 s. The references run 12.2–19 s. Our workflow-hero felt crammed at 11 beats in 20 s (v1) and too long at 25.6 s (v7–v8).
- **Frame:** 1920×1080, 16:9, at 24 fps (all six references) or 30 fps. Export mp4 + webm + a poster PNG (see `videos/hero/workflow-hero/build/remotion/render.sh`).
- **Sound:** it must work silent. All six references are silent. Music and SFX are optional extras for the social cut or for viewers who unmute. If there is audio: about −15 LUFS, true peak under −1 dBFS.
- **Social cut:** optional, made from the same edit (Bloom: a 420×280 social version with a 2 s end card and music).

## 2. Structure
| Part | When | Rule |
|---|---|---|
| Name | 0–1 s | The product or feature name is on screen within the first second. All six references do it by 0.6 s. |
| Beats | after the name | 3–5 beats, **one idea per beat**, 1.5–3 s each. Higgsfield shows a new feature or step every 2.5–3 s. |
| The bold moment | around the middle (40–55 %) | Exactly one big move (a dive, a flip, a shockwave). Talent Contest dives at 43 %, Short Drama flips at 44 %, Seedream swaps the jacket at 49 %, Fable MCP fires the rings at 52 %. |
| Result | the last 3–5 s | The real output, given the most screen time. Every reference ends on its result: the episode playing, the game footage, the finished cover on the tablet, the product macro. |
| Loop | the last 0.5 s | The last frame flows back into the first (the same background, or a fade to it). An end card is optional and at most 2 s. |

- **Input → process → result.** Every reference tells this. Short Drama: upload → style → "analyzing" → episodes → watch. Fable MCP: models → prompt → switch on → game. Seedream: shot → edit → edit → final print.
- **Prove the change at the same framing.** The rough or plain version turns into the final without the camera moving: clay → cinematic (Blender), wireframe → game (Playable), depth map → footage (API cashback), live → restyled (Genjutsu Restyle). Blender, Playable, API cashback, Genjutsu, Shorts and Motion design are all built on it, and the change is the demo ([render-reveal](../../transitions/render-reveal.md), [region-box-restyle](../../transitions/region-box-restyle.md)).
- **The result must clearly come from AdFlex.** Show the hand-off from the AdFlex UI to the output (workflow-hero v6 feedback: "the result doesn't land, and it isn't clear that ALFA produces it").

## 3. Show the real product
- Real AdFlex UI from real recordings and real outputs, never mockups. No invented tool windows, icons or file chips to "explain" a point (workflow-hero v8 feedback: "you've put in a lot of motion and icons of your own").
- Show the plain "before" for about 0.4 s, then the change (Bloom v3).
- UI that matters is shown big: a card or input fills the centre third of the frame, not a full-screen recording with a zoom (workflow-hero v1 feedback).
- Record on **prod** for anything public.

## 4. Motion
- **Never static.** Every shot has a slow push-in or drift. None of the six references holds a still frame.
- **One move per beat**, plus the transition. Windows sit flat; no tilts, orbits or follow-cams (workflow-hero v8: "much calmer motion").
- **Motion blur on anything fast** (whips, fly-ins, scrolling lists), as in every reference.
- Use the house motion rules: one spring, 0.2 s ease-in exits, staggers of 50 ms or less, and timings in seconds.

## 5. Transitions
- **Most joins are hidden or motivated.** The references have only 1–5 visible hard cuts in 12–19 s. Everything else is a camera move, a morph or a blocker.
- **Short:** UI transitions take 0.25–0.4 s, and the longest (a dive) 0.8 s.
- **UI ↔ footage on one canvas.** Going from the UI to the result is a card move, not a cut: a chat attachment or grid tile expands to full frame, or the footage shrinks back into a card ([card-to-fullbleed](../../transitions/card-to-fullbleed.md)). The launch films of 30–40 s have only 4–7 hard cuts but a new beat every 1–2 s.
- **Mark "AI is working" with one small hit at the click:** accent pixel squares, a press and a soft glow ([pixel-square-burst](../../transitions/pixel-square-burst.md), [button-press](../../motion-styles/button-press.md)). Fable 5.1, Academy, Restyle and Playable all do it.
- **One bold transition per video**, on the bold moment. Everything else is calm: hard cut with blur settle, object carry, whip push. See the "Pick a transition" table in [`transitions/README.md`](../../transitions/README.md).
- On a soft, premium hero: hard cuts only, and no zoom-blur whips, white flashes, shake or burst rings (Bloom v4).

## 6. Text
- **One label per beat**, 2–4 words, uppercase ("EDIT AFTER EDIT", "ANY STYLE", "RUN IT."). It names the feature; the picture does the explaining.
- **One type family** (Archivo; Cairo for Arabic) in at most two weights or sizes. A light line over a bold line, or big words with small connecting words.
- **One accent word:** a bold line with one word in the accent colour and a different style (italic or a wider width), e.g. "*Free* AI Influencer *Studio*". The accent can jump to the next word on each cut ([accent-word-headline](../../motion-styles/accent-word-headline.md)).
- **A fixed spot:** the same corner (bottom left in Seedream and Talent Contest) or a fixed lockup (Short Drama keeps its name at the bottom for all 15 s).
- **It moves too:** it types on, wipes or smears in after the shot settles, and leaves just before the cut ([corner-type-labels](../../motion-styles/corner-type-labels.md)).
- **English** on the website hero. Arabic lines only in an Arabic social cut.
- **AdFlex comes first.** Claude, ChatGPT and MCP appear small and equal-weight. The end card (if any) says AdFlex works with the AI you already use.

## 7. Look
Higgsfield has a small fixed system and lets everything else change with the video. We copy the system, not their colours.

**Fixed in every video:**
- **One accent colour, only for actions and results:** ✓ marks, progress lines, the clicked button, the result's frame, the numbers. Higgsfield uses lime (and magenta as a second colour in its own-brand launches); we use the Generate purple #8337F1 → #6730D4, with the sparkle gradient (#C95AC5 → #55AAFF) for glows. Everything else stays neutral.
- **The lockup:** a small logo (plus "× partner" when there is one) above a big feature name. Higgsfield does this in almost every card and launch film ("Higgsfield MCP × Claude for Meta Paid Ads" over "AD MULTIPLIER").
- **The end line:** one short sentence in small caps, centred, on a plain background or over the last shot, for 2–3 s: "AD MULTIPLIER AVAILABLE ON HIGGSFIELD.AI", "MEET HIGGSFIELD IN CHATGPT AND CODEX". 24 of the 35 launch films end on one short line, almost all in small caps (the Claude one uses Claude's serif: "Available now at Higgsfield.ai/mcp"). The rest end on the content or loop, and only the Supercomputer films end on a logo card. None ends on a logo slam. Ours: "[FEATURE] · AVAILABLE ON ADFLEX.AI" or the end-card line from `CLAUDE.md`.

**Chosen per video, from the kind of video:**

| Kind of video | Background | Example |
|---|---|---|
| A product feature or flow (UI) | dark, with a faint texture (dot grid) and dark-glass cards | Short Drama, Black Friday, API |
| A model or output showcase | full-bleed cinematic footage, white labels | Seedream, Talent Contest, Miracle |
| A launch with a partner (Claude, ChatGPT, Meta) | the partner's world: Claude's beige and serif, OpenAI's white | Fable × MCP, Burger Queen, ChatGPT plugin, Ad Multiplier |

- **Calm and light, with one or two dark payoff beats.** The long UI demos (Supercomputer, Photoshop) stay on off-white with frosted panels, then go dark and glowing for the payoff (the finished commercial, the night billboard), around 70–90 %.
- **The title type changes per launch** (heavy grey gradient, italic, extended, chrome 3D, serif, sticker slabs). Ours stays inside Archivo (any weight and width) and Cairo, so the brand holds.
- Generated footage uses only invented or logo-free brands.

## 7b. What the launch films add
The longer Higgsfield launch films (mostly 20–100 s, with music, posted on X; all 35 are in [`references/hero/README.md`](../../references/hero/README.md) with links and what to take from each) follow the same rules, plus these. Use them for an ad or a long cut, and as a source of beats for a hero:
- **The prompt is the spine, and the agent's work is the story.** A real chat box, big, with the prompt typing in, appears in 5 of the first 8 analysed (Miracle uses a small prompt pill in the shot). The agent films go on: prompt → a status line or log ([status-line-zoom](../../motion-styles/status-line-zoom.md)) → a grid of outputs → the best one full-screen.
- **Open on the payoff.** Several open on the result before explaining it: a 3.5 s flash-forward of the best shots (Passport Rush), the full deliverables sizzle before the presenter (MCP breakdown), one movement across five worlds (Genjutsu) ([flash-forward-cold-open](../../motion-styles/flash-forward-cold-open.md), [motion-match-cut](../../transitions/motion-match-cut.md)).
- **Show the process next to the result** when the craft is the point: the output on one half, the tool or chat building it on the other ([result-over-process-split](../../motion-styles/result-over-process-split.md)).
- **Show the whole output, labelled.** A parade of deliverables, each with a small pill naming it ([deliverables-parade](../../motion-styles/deliverables-parade.md)).
- **Prove it with numbers, after the output:** ROAS, CTR, a dashboard, a counter, a globe of markets ([proof-numbers](../../motion-styles/proof-numbers.md)). Only real numbers.
- **Controls in the shot** instead of cutting to a UI screen ([in-scene-widgets](../../motion-styles/in-scene-widgets.md)). This one powered the most-watched film (Miracle, 20.3M views).
- **One feature per beat with its own header** ("/skill-name", "SELECTIVE SPEED CONTROL") and a before → after ([before-after-diagonal](../../transitions/before-after-diagonal.md)).
- **Show the output where it will live:** in a social feed with comments, on a billboard, in an Ads Manager ([output-in-context](../../motion-styles/output-in-context.md)).
- The peak isn't always in the middle in a launch film (anywhere from 7 % to 91 %), and many have a second peak at 70–90 %. A hero keeps one peak at 40–55 %.
- A 12–20 s hero can be cut from a launch film's strongest 3–5 beats, so plan the long film and the hero together.

## 8. Before showing the team
- [ ] The name is on screen by 1 s, and each beat makes sense with the sound off.
- [ ] Every beat has one idea, one label and one move.
- [ ] There's one bold moment, near the middle.
- [ ] The result is real, comes from AdFlex visibly, and gets the most time.
- [ ] Any change (plain → final, before → after) happens at the same framing.
- [ ] Nothing is invented: the UI, results and numbers are real.
- [ ] It loops cleanly (watch the join twice).
- [ ] Animation code passes the `12-principles-of-animation` audit.
- [ ] mp4 + webm + poster rendered. If there's audio, loudness and peak are checked.

## Where these rules come from
| Video | Length | Name on screen | Bold moment | Visible hard cuts | Ends on | Link |
|---|---|---|---|---|---|---|
| Higgsfield Short Drama Studio | 14.9 s | 0 s (fixed lockup) | chroma flip, 6.5 s (44 %) | 1 | the episode playing | https://static-public-media.higgsfield.ai/cards/788c93dc-a6fc-42f7-924d-949b2aae8a51.mp4 |
| Higgsfield Fable 5.2 × MCP | 12.2 s | 0 s | shockwave rings, 6.4 s (52 %) | 6 (most in the closing game montage) | game footage | https://static-public-media.higgsfield.ai/cards/b7c76e0d-2ca5-431e-b1ee-4b2ecc3bf984.mp4 |
| Higgsfield Talent Contest | 14.5 s | 0.6 s | dive through the "0", 6.3 s (43 %) | 3 | "ANYTHING GOES" | https://static-public-media.higgsfield.ai/cards/9a1e389f-efeb-4b7a-a0e6-2b39defe2116.mp4 |
| Higgsfield Seedream 5.5 | 16.3 s | 0 s | jacket swap, 8.0 s (49 %) | 3 | the final cover on a tablet | https://static-public-media.higgsfield.ai/cards/bdb7ff38-7e95-4e3e-bfa6-c965ae7f266a.mp4 |
| Higgsfield Genjutsu | 19 s | 0 s | the title splits open | 5 | the product macro | https://cdn.higgsfield.ai/card/16eebc9a-8310-4f68-8a02-1e2e6f109169.mp4 |
| Higgsfield Black Friday | 4.5 s | 0.3 s | the scramble lock | 0 | the offer card | https://static-public-media.higgsfield.ai/cards/576e5edf-d90f-40cb-9fe4-f6432f6e76b3.mp4 |

All 35 Higgsfield launch films on What Ships (Ad Multiplier, Miracle, Kling 4.0, Supercomputer, Genjutsu and the rest) are listed with their links, views and what to take from each in [`references/hero/README.md`](../../references/hero/README.md).

Team feedback behind the rules: [`bloom-hero/production.md`](bloom-hero/production.md) (v3–v4) and [`workflow-hero/production.md`](workflow-hero/production.md) (v1, v6–v8). More references: [`references/hero/README.md`](../../references/hero/README.md).
