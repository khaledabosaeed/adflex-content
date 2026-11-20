# ALFA hero: production notes

## Script v15: the bored trip, no clients (2026-11-18, cut v17)
Team: «شيل قصة البراندات وخليه كله كانه البنت زهقانة وطلعت جولة». The client story is gone: no VOLT/KNOCKOUT/DUNE tags, no brand-kit chip. Bored Leen asks ALFA for an escape and gets a tour, each world ending in a jam she prompts her way out of:
1. Desk, bored. Macro on ALFA: "So bored. Take me somewhere wild". Her screen pulls her in.
2. Rooftops, mid-leap, shocked: "Get me out of here! Somewhere else!"
3. Boxing ring, the hook coming: "Not a fight! Somewhere calmer!" (she lands on a dirt bike in the dunes: the joke).
4. Desert, thrown off the bike: "OK, OK! Take me home!" She drops into her chair and smiles. End line ALFA · AVAILABLE ON ADFLEX.AI.
Same footage and timing as cut v16; only on-screen text changed. Composition `AlfaHeroV14`.

## Script v14: bored opening + the v13 sequence (2026-11-18, cut v11)
Team: «شايف السكربت هادا بدي ياك تحول البداية لبنت زهقانة وبتكتب لالفا رسالة وبعدها بيصير تسلسل الاحداث هادا». New opening (B1, assets.md): Leen bored at her desk (chin on hand, eyes roll), gets an idea, smiles, pulls the laptop over; cut to her hands as ALFA flies in and her message types ("VOLT launch reel: runners on the rooftops"); then the v13 sequence unchanged, shifted 2.35 s. It loops desk → desk: she ends relaxed at the same desk and the film starts again with her bored, faded in from the end's dimming. Composition `AlfaHeroV14` (`src/HeroV14.tsx`, built from HeroV13), 16.55 s.

## Script v13: Leen carries every transition (2026-11-18, cut v10)
Team: «بدي ياك تبين انو الانتقال بيصير مع البنت نفسها». Same story, prompts and English text as v12, but each move between worlds is Leen's own body in one generated first/last-frame clip (T1–T4 in assets.md): she leans into her laptop and comes out sprinting on the roof; falls between the roofs and lands on the ropes; ducks the hook and comes up on the bike in a burst of sand; is thrown off the bike and drops into her chair. Each T clip starts on the exact frame where the world's jam ends, so those joins are invisible; the hard cuts out of a T clip land with a 2-frame blur and a small zoom.

Composition `AlfaHeroV13` (`src/HeroV13.tsx`), 14.2 s: the film is one strip of time-remapped clips (keys film s → source s), so every shot is speed-ramped to its strong part. Ending scenario (drops into her chair) is T3, so the planned scenario stills/clips are no longer needed.

## Script v12: "Get me out of here", English, Talent Contest transitions (2026-11-18, cut v9)
Team: «يعمي الفيديو اللقطات بطئ العرض مش عجباني», then «ما بدي نص بالعربي وشوف فيديو من الفيديوهات الريفرنس عندك وزبط الانتقالات بطريقته».

Same story as v11, with no Arabic on screen. Composition `AlfaHeroV12` (`src/HeroV12.tsx`), 11.05 s. Prompts (English versions of the v11 lines):
| Where | Floating prompt |
|---|---|
| Desk | "VOLT launch reel: runners on the rooftops" |
| VOLT jam | "Get me out of here! Next: KNOCKOUT fight night" |
| KNOCKOUT jam | "Get me out of here! Next: a DUNE desert ride" |
| DUNE jam | "Get me out of here! Schedule all three for Monday" |

Transitions copied from Higgsfield Talent Contest (only 4 cuts in 14.5 s, the camera never stops, every transition is inside the footage, the label erases just before each cut and types on right after):
- Open: one-frame flare wash, then ALFA flies in from behind the camera (8× → 1 in 0.35 s, radial blur) ([flare-fly-in](../../../transitions/flare-fly-in.md)).
- Desk → VOLT: [dive-through](../../../transitions/dive-through.md) into her prompt box. VOLT already plays inside it after send; the dive starts slow and accelerates, the rim glows white, VOLT lands out of a zoom.
- VOLT → KNOCKOUT: [whip-pan-cut](../../../transitions/whip-pan-cut.md) (directional smear, highlights bloom, lands mid-whip).
- KNOCKOUT → DUNE: on send time snaps back, the punch lands, the camera punches in, a one-frame flare and a hard cut onto DUNE already moving.
- DUNE → desk: the camera drops (vertical whip), as if she lands back at her desk.
- Pace: the action runs at 1.8×, the jam crawls at 0.15× (never a dead freeze), worlds are 2.55 s.

## Script v11: "Get me out of here" (2026-11-18, approved, cut v7)
Team: «البنت هاي مع كل برومت بتدخل الشاشة وبتنقل من مكان لمكان وبتكون بتعمل نفس الي في المكان بيعملو», «لعند اخر لقطة في كل فكرة انو تكون بدها تعلق في ورطة وتكتب البرومت انو غيرني من هان», «ما بدنا اللابتوب… البرومت يكون طاير جنبها وينكتب فيه», prompts «عربي», «ما بدي تسجيل للشاشة», «كله توليد وموشن».

**Team decision:** the floating ALFA prompt is a motion graphic built in Remotion (`src/PromptBox.tsx`), not a screen recording. This departs from the repo rule "real AdFlex UI, not mockups" for this video, by the team's choice. Test: `renders/prompt-test-v1.mp4` (composition `PromptTest`).

Leen does what each client's world does, and every world ends in a jam: the frame freezes, ALFA's prompt flies in beside her, the Arabic prompt types itself, send lights up, whoosh to the next world.

| # | Shot | Jam (freeze) | Floating prompt (exact) |
|---|---|---|---|
| 0 | Agency desk | — | «اعملي ريل لإطلاق VOLT، عدّائين على السطوح» |
| 1 | VOLT: Leen sprints the rooftops and leaps | mid-air over a gap far too wide | «طلّعني من هون! وبعدها ريل لليلة القتال عند KNOCKOUT» |
| 2 | KNOCKOUT: Leen spars in the ring | backed on the ropes, a huge hook coming | «طلّعني من هون! وبعدها فيديو رحلة بالصحرا لـ DUNE» |
| 3 | DUNE: Leen rides a dirt bike over the dunes | airborne off a crest over a huge drop | «طلّعني من هون! وجدول التلاتة ليوم الاتنين» |
| 4 | Back at her desk, safe | — | loop |

New footage: A1–A3 (Leen in action) stills, gpt-image-2-6-sunburst 3 × 70 (refs: S0a character + V1–V3 style), quoted; then clips Gemini Omni Flash 1.2, 5 s 720p, 3 × 315.

## Script v10: "Every client, its own world. Its own ALFA." (2026-11-18, approved, cut v2)
Team: «بدي السكربت انو البنت هاي تبعت الاجنسي عندها عملا كتار وكل عميل الو بزنس تاني» (no closing high-five shot), then «مش ضروري يشوف الدروب داون بس انت اعمل الهم لقطات تخيلية». "Opening a client's business" is shown as Leen entering that client's world with her laptop: no business-switcher UI. ALFA's real UI (dev recordings) is pinned on her laptop in every world.

| # | Time | Shot | On her laptop (real recording) | Text |
|---|---|---|---|---|
| 0 | 0–1.6 | VOLT leap (V1) | — | giant **ALFA** splits onto her screen |
| 1 | 1.6–3.0 | Leen at the agency, screen macro (G1) | ALFA home | ONE AGENCY. MANY CLIENTS. |
| 2 | 3.0–3.5 | Her click; the screen's light fills the frame | — | — |
| 3 | 3.5–6.0 | **VOLT's world** (L1): Leen on a rooftop ledge with the laptop; a runner leaps the gap behind her; cut to the VOLT leap | the prompt typing | VOLT · RUNNING SHOES |
| 4 | 6.0–8.5 | **KNOCKOUT's world** (L2): Leen on a bench by the ring; the boxer hits the bag behind her; cut to the slow-mo punch | "Planning the steps…" | KNOCKOUT · BOXING GYM |
| 5 | 8.5–11.0 | **DUNE's world** (L3): Leen on a dune; the bike jumps behind her; she clicks; cut to the bike over the lens | Approve and run | DUNE · DESERT TOURS |
| 6 | 11.0–14.5 | What ALFA made: fast cuts on the three reels | — | EVERY CLIENT. ITS OWN ALFA. |
| 7 | 14.5–17 | Back at her desk (G1); push into the screen onto the VOLT leap = frame 0 | — | ALFA · AVAILABLE ON ADFLEX.AI |

New footage: L1–L3 (stills gpt-image-2-6-sunburst with Leen's sheet + the V-still as style, 3 × 70; clips Gemini Omni Flash 1.2 5 s 720p, 3 × 315) = 1,155.

## Script v7: all live action, action-led (2026-11-18, proposed)
Team: «الفيديو كله لازم يكون حقيقي ولا لقطة موشن غير التعديلات والنصوص», then «وين السكربت والاكشن في الفيديو». Every shot is footage (generated). ALFA's UI appears only on Leen's laptop screen inside the footage (the existing recordings corner-pinned). Graphics are limited to transitions and text. Action carries most of the runtime: each ALFA step on her screen cuts on motion into the action ALFA is making.

| # | Time | Shot (footage) | On her screen (real recording) | Cut / transition | Text |
|---|---|---|---|---|---|
| 0 | 0–1.6 | VOLT: a runner leaps the gap between rooftops at sunset, slow-mo at the apex, right over the lens | — | the title splits AL│FA onto shot 1 | **ALFA** (giant), AdFlex AGENT / YOUR AI MARKETING AGENT |
| 1 | 1.6–2.6 | Macro over Leen's shoulder onto her laptop, hand on the trackpad | ALFA home: Plan my week / Review media performance / Understand comments | hard cut on her click | PLANS. MEASURES. LISTENS. |
| 2 | 2.6–3.6 | KNOCKOUT: slow-mo punch into a heavy bag, sweat spray | — | cut on the impact | — |
| 3 | 3.6–4.6 | Macro: her fingers type, then hit Enter | the prompt typing | Enter = cut | ONE LINE. |
| 4 | 4.6–5.6 | DUNE: a bike launches off a dune toward the lens, sand flying | — | sand hits the lens = cut | — |
| 5 | 5.6–6.6 | Leen at her desk looking at the laptop, smiling (C1, first second) | «Understanding the request…» → «Planning the steps…» | slow digital push | IT WORKS. |
| 6 | 6.6–8.2 | Same macro as shot 1: her finger clicks | Approve and run | **dive into the screen** (the bold move) | ONE CLICK. |
| 7 | 8.2–12 | The reels ALFA made, full frame: VOLT leap → KNOCKOUT punch → DUNE jump, speed ramps, cuts on motion | — | match cuts on motion | EVERY CLIENT. + VOLT / KNOCKOUT / DUNE |
| 8 | 12–17 | Leen's agency desk: Reem (VOLT) walks in, high five (C1, **done**) | the DUNE reel, then VOLT | the screen grows to full frame = frame 0 (loop) | ALFA · AVAILABLE ON ADFLEX.AI |

**To generate** (still 60 + 5 s 720p clip 315 each, quoted one by one):
- V1 VOLT, V2 KNOCKOUT, V3 DUNE: ~1,125. Each clip serves its burst (shots 0/2/4) and the payoff (shot 7).
- G1 the screen macro over her shoulder, hand on the trackpad, locked camera, plain white screen (shots 1 and 6): ~375.
- G2 the typing and Enter macro: ~375.
- Shot 5 reuses C1 (free).

Total ≈ **1,875** on top of the 555 spent.

## Script v5: no new screen recordings (2026-11-18, not approved)
The team's constraint: «ما في تسجيل شاشة… اللقطات كلها بدها تتولد، وفي عندك تسجيل شاشة موجود استخدمه». ALFA's UI comes only from the three recordings we already have (`videos/hero/workflow-hero/build/remotion/public/`: `alfa.mp4`, `alfa-plan.mp4`, `alfa-edit.mp4`, dev account). Every other shot is generated. v4's calendar, client switch, insights, comments and "Remember" beats are dropped, because no recording of them exists and mocking them up breaks the real-UI rule.

17 s, 1920×1080, 24 fps, silent loop. Clients: VOLT, KNOCKOUT, DUNE (invented, no logos).

| # | Time | Picture | Source | Motion / transition | Label |
|---|---|---|---|---|---|
| 0 | 0–1.65 s | VOLT rooftop leap at sunset, slow-mo apex; giant **ALFA** over it (AdFlex AGENT above, YOUR AI MARKETING AGENT below) | generated (VOLT reel) | name blur-settles by 0.45 s; splits AL │ FA at 1.2 s, the gap is a window onto ALFA's home | ALFA |
| 1 | 1.65–3.3 s | ALFA's home: macro dolly across the real chips **Plan my week → Review media performance → Understand comments** | `alfa.mp4` frozen at 0.1 s | [ui-macro-dolly](../../../motion-styles/ui-macro-dolly.md) at 2.6×, motion blur on each move | PLANS. MEASURES. LISTENS. (accent jumps with the chip) |
| 2 | 3.3–5.0 s | The prompt types in, big; send | `alfa.mp4` 0.4–6.4 s at 3.75× | slow push; send glow + [pixel burst](../../../transitions/pixel-square-burst.md) | ONE *LINE.* |
| 3 | 5.0–6.5 s | "Understanding the request…" → "Planning the steps…", huge | `alfa-plan.mp4` 0 s, `alfa-edit.mp4` 11.5 s | [status-line-zoom](../../../motion-styles/status-line-zoom.md), blur settle on the cut | IT *WORKS.* |
| 4 | 6.5–8.2 s (~45 %) | "Run this plan? … Approve and run", press; **dive through the button** into VOLT's reel | `alfa-plan.mp4` frozen at 3.9 s | button-press + burst; **[dive-through](../../../transitions/dive-through.md) (the bold move)**, `14^p`, streaks | ONE *CLICK.* |
| 5 | 8.2–12.0 s | Action montage: VOLT leap → KNOCKOUT slow-mo punch → DUNE bikes over a dune | generated (3 reels) | cuts on matching motion, blur settle | EVERY *CLIENT.* + VOLT / KNOCKOUT / DUNE |
| 6 | 12.0–16 s | DUNE shrinks into Leen's laptop (left, angled): Leen at her agency desk in profile; Reem (VOLT) walks in behind the desk, high five | generated (desk clip) | pull-back 0.9 s, blur 10 → 0 | ALFA · AVAILABLE ON ADFLEX.AI (14.2–15.8 s) |
| loop | 16–17 s | Her screen switches to VOLT; push into the laptop until it fills the frame = frame 0 | — | push, ease-in-out | — |

**Notes**
- The typed prompt is the real one from the recording: a *workflow* request ("Build me a workflow: I give you a product photo, you make 3 ads and a story video with music."). It's legible on screen, so the story is "one line → ALFA plans → one click → content for every client". It's honest, but it isn't about action reels; a viewer who reads it sees a product-photo workflow.
- The recordings are on **dev / localhost**. The hero rules say public versions are recorded on prod. Crops hide the URL bar, but the team should decide if dev is OK for the site.
- The chips in shot 1 are the honest proof of "plans, measures, listens" (they are real ALFA entry points), but we never show those features running.

### Production plan (v5)
| # | What | How | Used in | Est. credits |
|---|---|---|---|---|
| S0 | Character sheets: the heroine and VOLT's marketing lead | nano-banana-2, `character_consistency` | shot 6 | ~130 |
| S1 | Her agency desk, over the shoulder, laptop screen plain and bright (to pin the reel into) | nano-banana-2 from S0 | shot 6 | ~65 |
| C1 | S1 → 5 s: the lead walks in, high five | Gemini Omni Flash 1.2, image-to-video | shot 6 | ~400 |
| V1–V3 | Still + 5 s clip each: VOLT rooftop leap (slow-mo apex), KNOCKOUT punch with sweat spray, DUNE bikes over a dune | gen_image → gen_video | shots 0, 4, 5, loop | ~3 × 465 ≈ 1,400 |
| — | Retries (hands, logos, physics) | | | ~+30 % |

About **2,000 credits + retries (≈ 2,600)**, quoted per item before each generation. Everything else is free: crops of the existing recordings and Remotion. Sections A–C below (plan v3) are superseded: no R1–R6 recordings.

## Script v4: "Every client, its own ALFA" with action (2026-11-18, superseded by v5)
v4 = the team's change: «بدي اكشن في الفيديو». The clients are action brands and their ALFA-made reels are the action; the video opens on that action under the giant ALFA title.

17 s, 1920×1080, 24 fps, silent loop. Clients (invented, no logos): **VOLT** (running and parkour sneakers), **KNOCKOUT** (boxing and MMA gym), **DUNE** (desert motorbike tours). Labels bottom left, Archivo, one accent word in purple. All UI is real ALFA on prod; numbers and comments are whatever the real accounts show.

| # | Time | Picture | Motion / transition | Text |
|---|---|---|---|---|
| 0 | 0–1.65 s | **Cold open, action:** VOLT's reel, a runner leaping between rooftops at sunset, ramping into slow motion at the top of the jump. Over it, the name fills the screen: small "AdFlex AGENT", giant **ALFA**, "YOUR AI MARKETING AGENT" | name blur-settles in by 0.45 s; at 1.2 s it splits AL │ FA and the gap is a window onto ALFA's input, which grows to full frame ([title-gap-window](../../../transitions/title-gap-window.md)) | ALFA |
| 1 | 1.65–2.75 s | **ALFA working:** "Plan this week" types into the real input (business: VOLT); send | slow push; button-press + pixel burst | — |
| 2 | 2.75–4 s | The real content calendar card rises; its tiles are VOLT's reels, playing (running, jumps) | card on the house spring | IT *PLANS* |
| 3 | 4–5.9 s | **Same framing:** she switches client: the tiles become KNOCKOUT (slow-mo punches, sweat), then DUNE (bikes over dunes) | locked; hard cut on each switcher click, blur settle | EVERY *CLIENT* |
| 3b | 5.9–7.3 s | **The reveal:** the UI shrinks into her laptop and the agency office comes into focus: a young woman at her desk, Monday 9:00 | pull-back 0.9 s, blur 14 → 0 | — |
| 4 | 7.3–8.8 s (~47 %) | **Bold moment. Friday, golden light.** She asks ALFA (on VOLT) "How did the week go?" and the camera **dives into her laptop** | dive-through 0.8 s, motion blur, streaks | IT *LISTENS* / FRIDAY 16:30 |
| 5 | 8.8–10.9 s | ALFA's real answer: what worked (the rooftop-jump reel), what people ask (real comments, e.g. drop date, sizes), the real insights card. She types "Remember: more slow-motion jumps" and confirms → ✓ Saved | push-in on the answer; cards spring in ≤ 50 ms apart; one press | IT *LISTENS* |
| 6 | 10.9–12.7 s | Same framing as shot 2: VOLT's calendar rebuilds for next week, more jump reels | render-reveal sweep, camera locked | NEXT WEEK, *BETTER* |
| 7 | 12.7–15 s | **The action payoff:** the new reel's tile grows to full frame: the runner's leap in slow motion, then a speed ramp into the landing and the dust | card-to-fullbleed with motion blur | — |
| 8 | 15–16.1 s | Pull-back: the reel is on the meeting-room screen; VOLT's marketing lead punches the air, she smiles | pull-back 0.8 s | ALFA · AVAILABLE ON ADFLEX.AI (small caps, 15.2–16.8 s) |
| loop | 16.1–17 s | Push into the meeting-room screen until the reel fills the frame at the same moment as frame 0 | digital push, ease-in-out; the last frame = frame 0 | — |

### Closest references
- **Opening:** Higgsfield Seedream 5.5 and Talent Contest (the name big over action footage), Genjutsu (the name splits open onto the next shot).
- **The ALFA steps:** Higgsfield Short Drama Studio (a whole product flow in 15 s, real UI big in the centre, the camera never still).
- **UI → footage and back:** Higgsfield Fable 5.1 and Supercomputer paid ads (a card in the UI grows into full-frame footage).
- What none of them has, and we add: the person who uses it (the reveal, the client meeting) and what happens after posting.

## Motion and transitions (v3)
**Look:** the UI never floats in a gradient void (the competitors' cliché). Every ALFA card sits over her real office, defocused behind it, so the agent lives in her world. Warm daylight on Monday, low golden light on Friday. Real ALFA UI, big (centre third). Purple only on actions and results: the send burst, ✓ ticks, the sweep line, the accent word, the result frame.

**Text:** one label per beat, bottom left, ~5 % margins, Archivo uppercase with one accent word in purple italic ([corner-type-labels](../../../motion-styles/corner-type-labels.md) extended variant + [accent-word-headline](../../../motion-styles/accent-word-headline.md)). A tiny second line carries the time: "MONDAY 9:00", "FRIDAY 16:30". It smears in after the shot settles and out 0.15 s before the cut. Lockup "AdFlex · ALFA" top centre in shot 1 only.

**Motion:** never static (a slow push-in or drift on every shot). House spring for every entrance (mass 0.6, stiffness 140, damping 12), 0.2 s ease-in exits, staggers ≤ 50 ms, one arrival at a time, 180° motion blur on the dive and the card expansion.

| Join | Transition | Calm / bold | How |
|---|---|---|---|
| Open (shot 1) | [hard-cut-blur-settle](../../../transitions/hard-cut-blur-settle.md) for the lockup | calm | Footage already moving (she sits down, slow push-in); lockup blurs 8 → 0 px with a 5 % rise, sharp by 0.5 s |
| 1 → 2 | UI lifts out of her laptop ([card-to-fullbleed](../../../transitions/card-to-fullbleed.md) in reverse) | calm | The push-in reaches the laptop; ALFA's input lifts off the screen to the centre third while the office defocuses behind it |
| Send (shot 2) | [button-press](../../../motion-styles/button-press.md) + [pixel-square-burst](../../../transitions/pixel-square-burst.md) | calm "AI is working" hit | Send button 0.97× and back; 12–20 purple squares, 0.25–0.3 s; the calendar card rises on the spring as they dissolve |
| 2 → 3 (client switches) | hard cut at the **same framing**, motivated by the real business-switcher click | calm | Camera locked; the card changes brand (colours, posts) on each click: bakery → gym → perfume, ~1 s each. The change is the demo |
| 3 → 4 (Monday → Friday) | [hard-cut-blur-settle](../../../transitions/hard-cut-blur-settle.md) to footage | calm | Same desk, golden light, she asks "How did the week go?"; the second line of the label flips to "FRIDAY 16:30" |
| **4: bold moment (~47 %)** | [dive-through](../../../transitions/dive-through.md) into the laptop | **bold (the only one)** | 0.8 s, `scale = 10^p` with ease-in, the next scene visible inside the screen from the start, motion blur; lands out of a 2–3× zoom on ALFA's real results answer, then the insight card and real comments spring in around it (≤ 50 ms stagger) |
| Shot 5 | slow push-in on the answer ([ui-macro-dolly](../../../motion-styles/ui-macro-dolly.md), light), button-press on her confirm | calm | Her "Remember…" types in; one press |
| 5: plan rebuilds | [render-reveal](../../../transitions/render-reveal.md) sweep at the same framing as shot 2 | calm | Camera locked on the calendar card; a thin purple line sweeps left → right in 0.4 s, old plan → next week's plan. A line of light, never a white flash |
| 5 → 6 | [card-to-fullbleed](../../../transitions/card-to-fullbleed.md) | calm | The bakery reel tile lifts and scales to full frame with motion blur, already playing |
| Shot 6 | pull-back reveal | calm | The full-frame reel pulls back to the meeting-room screen; the client smiles; she closes her laptop |
| 6 → 0 (loop) | push into her laptop screen | calm | The last frame is the blurred desk, identical to frame 0 (checked); the name blurs in on it |

Visible hard cuts: 3 (the client switches and Monday → Friday); everything else is carried by a camera move or a card.

## Production plan (v3): how every shot gets made
Three kinds of material. Only the generated footage costs credits; everything else is recorded or built in Remotion.

### A. Generated footage (credits, quote each one first)
Camera: **over her right shoulder, 3/4 from behind**, so the laptop screen is visible and nearly flat to the lens (for the corner-pin). Locked-off camera; all pushes are added digitally in Remotion. Screens in the stills are **plain, bright, no UI and no text**, so the real ALFA recording can be pinned into them. No logos anywhere.

| # | What | How | Used in | Est. credits |
|---|---|---|---|---|
| S0 | Character sheets: the heroine (agency marketer) and VOLT's marketing lead | nano-banana-2, `character_consistency` | every shot with them | ~130 |
| S1 | Monday 9:00, her agency desk, over the shoulder, laptop open, warm daylight | nano-banana-2 from S0 | 0–7.3 s (blurred behind the UI, then the reveal) + the loop frame | ~65 |
| S2 | **Same frame as S1**, Friday 16:30, golden light | gpt-image-2-6 `edit_existing` of S1, so the desk and laptop match exactly | 7.3–8.8 s (the dive) | ~70 |
| S3 | Meeting room: the wall screen big in frame, VOLT's marketing lead and the heroine watching it | nano-banana-2 from S0 | 13–17 s | ~65 |
| C1 | S1 → 5 s clip: she types, sips coffee, small natural movement | Gemini Omni Flash 1.2, image-to-video, 1080p | the reveal 5.9–7.3 s | ~400 |
| C2 | S2 → 5 s clip: she leans back, looks at the screen | same | 7.3–8.8 s | ~400 |
| C3 | S3 → 5 s clip: the marketing lead punches the air, she smiles | same | 15–17 s | ~400 |
| — | Retries (hands, laptops, logos) | | | ~+30 % |

About **1,550 credits + retries (~2,000)** for A. The three action reels (VOLT, KNOCKOUT, DUNE) are made **by ALFA** during the recording (section B), so they're real outputs; ALFA quotes each (~400–500, so ~1,350). **Total ≈ 3,000–3,500.**

### B. Real ALFA recordings on prod (free, except the reel ALFA generates)
Browser at 1920×1080 with device scale 3 (sharp crops for the big UI shots). Three client businesses on prod with their brand kits (VOLT, KNOCKOUT, DUNE: invented, no logos); VOLT's must be connected to IG/FB with real posts and comments.

| # | Record | Used in |
|---|---|---|
| R1 | VOLT: empty ALFA input → type "Plan this week" → the calendar card | 1.2–4 s (the input in the title gap, the typing, the calendar) |
| R2 | Switch business to KNOCKOUT, then DUNE, and ask the same; keep each calendar card | 4–5.9 s (same-framing switches) |
| R3 | VOLT: "How did the week go?" → ALFA's answer with the real insights and comments | 8.8–10.5 s |
| R4 | "Remember: more slow-motion jumps" → the confirmation → saved | 9.9–10.6 s |
| R5 | "Plan next week" → the new calendar (with more jump reels) | 10.9–12.7 s (the sweep) |
| R6 | Ask ALFA for each client's action reel (VOLT rooftop leap with a slow-motion apex, KNOCKOUT slow-mo punch, DUNE bikes over dunes) → the finished videos | the cold open, the calendar tiles, the payoff and the meeting-room screen |

Never schedule or publish a post while recording unless the team explicitly asks for it; plans and drafts are enough.

### C. Built in Remotion (free)
| Moment | How |
|---|---|
| Title card + split (0–1.65 s) | Text in Archivo over the VOLT reel (R6); the gap is a `clipPath` window onto the R1 input crop |
| Typing, send | R1 recording (sped up if needed); button press + pixel burst drawn on top at the send button |
| Calendar rise, client switches | Crops of R1/R2 cards, lifted big on the house spring; hard cuts at the same rect with a blur settle |
| Reveal (5.9 s) | The UI layer is corner-pinned (CSS `matrix3d`) into C1's laptop screen while C1 goes from blurred to sharp |
| Friday cut | Hard cut to C2 with a blur settle |
| **Dive (bold)** | Digital zoom into C2's screen (`10^p`, ease-in, motion blur, streaks), with R3's first frame pinned inside; lands on the R3 crop |
| Insights, comments, Remember | Crops of R3/R4 lifted as separate cards (≤ 50 ms stagger); one press on the confirm |
| Plan rebuilds | R1 calendar crop vs R5 crop at the same rect, `clipPath` sweep + ScanLine |
| Reel | The R6 tile in R5 grows to full frame (card-to-fullbleed), then is corner-pinned into C3's wall screen on the pull-back |
| Loop | Digital push into C3's wall screen until the VOLT reel fills the frame at the same moment as frame 0 |
| Labels, end line | Corner labels and the end line as in the preview |

**Order:** S0 → S1/S2/S3 (review) → R1–R6 recordings → C1–C3 → edit. Stills and the recordings can run in parallel.

### Why it's different
- Competitors end at "it made the assets". We spend half the video *after* posting: results, comments, memory, next week.
- The loop of the hero is the message: each loop is another week, and ALFA knows the shop better.
- A person and her work week are the subject; the clients' posts are supporting evidence, not products being advertised.
- The agency angle: no competitor shows one person handling several brands. Shot 3 proves it at one framing.
- The research found no competitor with a business owner as the hero, a real time of day, results after posting, or an output landing in the physical world (shot 6: the client sees the result in the meeting room).
- Arabic is a gap in the whole field. The hero stays English (hero rules), but the same edit makes an Arabic social cut: the prompts typed in Arabic and the labels in Cairo.

### Honesty checks
- She asks each time ("Plan this week", "How did the week go?"). Never show ALFA acting on its own or on a timer.
- Switching client = switching business in AdFlex (each has its own brand kit, memory and accounts). ALFA doesn't plan three clients in one message; show the switch.
- Insights are FB/IG only, and the numbers must be the account's real numbers.
- Comment replies are drafts. Don't show a reply being sent by ALFA.
- Memory is saved after she confirms (`remember_context` is confirmation-gated): show the tap.

### What we need
| What | How | Cost |
|---|---|---|
| Heroine stills (desk on Monday, Friday at the laptop, the meeting room with the client) + 3 client brand kits | gen_image, devAdflex | quote before generating |
| 4 clips: shot 1 sit-down, shot 4 laptop close-up, the bakery reel, shot 6 meeting-room pull-back | gen_video image-to-video | quote before generating |
| Real ALFA recordings on prod: plan → calendar for 3 client businesses, the business switch, "How did the week go?" → insights + comments, Remember, next week's plan | screen recording on a connected IG/FB account with real posts and comments | free |
| Edit | Remotion (`templates/remotion-video/setup.sh`) | free |

## Current cut
- **Web files, with sound** (2026-11-18, «يعمي اعمل صوت للفيديو وضيفه»): remade from **v19** (music + SFX): the MP4s carry the AAC track (copied), the WebMs Opus 128k; −14.1 LUFS, true peak −1.7 dBFS in all four. 1080: 7.2 MB mp4 / 6.5 MB webm; 720: 3.6 / 3.2 MB. `WEBM=1 bash tools/web_hero.sh renders/alfa-hero-v19.mp4 alfa-hero` (`SILENT=1` for silent files). Browsers only autoplay muted, so the page keeps `muted` and needs an unmute button for the sound.
- **Web audio file** (2026-11-19, «اعمل ملف صوت وضيفه هان»): `renders/web/alfa-hero-web-audio.m4a` (AAC copied from v19, 18.166 s = the video, 440 KB) and `alfa-hero-web-audio.mp3` (192k, 428 KB; MP3 adds ~10 ms of encoder padding, so loop the m4a for sync). −14.1 LUFS. Made by `tools/web_hero.sh` too.
- *Earlier web files* (from silent v18, «اعمل الفيدو للويب»): `renders/web/alfa-hero-web-1080.mp4` (H.264, 3 Mbps, 6.8 MB), `alfa-hero-web-720.mp4` (1.4 Mbps, 3.2 MB, phones), `alfa-hero-web-poster.jpg` / `-poster-720.jpg` (frame 0). No audio track. SSIM 0.986 vs the master. Made with `bash tools/web_hero.sh renders/alfa-hero-v18.mp4 alfa-hero` (all on NVENC). Plus WebM (VP9, two-pass, on the CPU: «اشتغلوة ع المعالج» after checking that neither GPU can encode VP9/AV1): `alfa-hero-web-1080.webm` (6.2 MB) and `-720.webm` (2.9 MB), `WEBM=1 bash tools/web_hero.sh …`. Embed: `<video autoplay muted loop playsinline preload="auto" poster="alfa-hero-web-poster.jpg"><source src="alfa-hero-web-720.webm" type="video/webm" media="(max-width: 768px)"><source src="alfa-hero-web-720.mp4" type="video/mp4" media="(max-width: 768px)"><source src="alfa-hero-web-1080.webm" type="video/webm"><source src="alfa-hero-web-1080.mp4" type="video/mp4"></video>` (note: `media` on `<source>` is honoured by current Chrome, Safari and Firefox; otherwise pick the file in JS).
- **v20** (2026-11-19): `renders/alfa-hero-v20.mp4`, «الساوند افيكت لانتقالات البنت, خلي الفيديو زي ما هو»: the **v19 picture, byte for byte** (video stream copied), with an SFX on every Leen transition, using the 2026-11-19 generated SFX (`public/audio/gen-*.mp3`, already paid). Cues are timed on v19 frames:
  - whoosh on the cut to her screen (2.27 s)
  - sparkle on the send bloom (3.95 s)
  - boom on the yank (4.36 s)
  - whoosh on the dive into VOLT (4.75 s)
  - a pop on each bubble
  - whoosh on the fall between the roofs (7.8 s)
  - boom as she lands on the ropes (8.15 s), slam on the hook (8.3 s)
  - whoosh on the duck (10.75 s), boom as the gym bursts into sand (10.85 s)
  - whoosh as she's thrown off the bike (13.7 s), boom on the crash (14.05 s)
  - sparkle as the sand becomes her office (14.25 s), slam as she drops into the chair (14.5 s; mostly masked by a loud beat in the bed)
  - −13.7 LUFS, −1.7 dBTP
  - Built as audio only (`npx remotion render … --codec=wav`), limited like `render.sh`, and muxed onto v19. Web files in `renders/web/` remade from v20.
- **v19** (2026-11-18): `renders/alfa-hero-v19.mp4`, 18.15 s, script v15, **with sound** (v18 picture). Music generation was down on dev (3 failures), so the bed reuses the team's own unused track: the workflow hero's first music (120 BPM, intro, drop at 8.0 s), arranged on bar lines by `build/remotion/make_music.sh` into `trip-bed.wav`: low-passed intro while she's bored, opens up on Send (3.75 s), the drop lands as her screen pulls her in (4.0 s), the drop again on a downbeat at 12 s, the tail plus the intro groove under the end card so the loop is seamless on the beat. The bed dips 45 % in each jam. Cues (existing SFX): riser into the drop, click on every Send, whoosh on the yank, impact as ALFA lands on the card. The website file stays the silent v18 (same picture). Render: `COMP=AlfaHeroV14 bash render.sh v19` (silent: `SILENT=1`).
- **v18** (2026-11-18): `renders/alfa-hero-v18.mp4`, 18.15 s, script v15, silent (the website version). Adds the 2 s end card «لقطة الختمة»: her desk (T3 extended to 4.9 s, still smiling) blurs and dims; the AdFlex logo drops in, ALFA rises letter by letter, "WORKS WITH THE AI YOU ALREADY USE" types on, CLAUDE · CHATGPT · MCP come up small and equal-weight, ALFA · AVAILABLE ON ADFLEX.AI at the bottom; it clears into the dim hand-off to frame 0. Music cut pending (the first track failed). Render: `SILENT=1 COMP=AlfaHeroV14 bash render.sh v18`.
- **v17** (2026-11-18): `renders/alfa-hero-v17.mp4`, 16.15 s, script v15 (the bored trip). v16 with the client tags and the brand-kit chip removed and the new prompt lines. Render: `SILENT=1 COMP=AlfaHeroV14 bash render.sh v17`.
- **v16** (2026-11-18): `renders/alfa-hero-v16.mp4`, 16.15 s, script v14. Stronger, faster pull into the screen: T5 is ramped 2.3× on the lean and 4.2× on the yank (she's gone 0.4 s after the cut, at 4.36 s), under a suction rush: the camera rushes at the screen (1.02 → 1.24, IN), a radial smear (3 copies scaled out from the screen), 20 light streaks converging into it, a flare and a kick as she goes in; VOLT comes up on the screen out of the flash and the dive is 0.5 s (4.45–4.95). Everything after is 0.5 s earlier than v15 (D 2.45 → 1.95). Render: `SILENT=1 COMP=AlfaHeroV14 bash render.sh v16`.
- **v15** (2026-11-18): `renders/alfa-hero-v15.mp4`, 16.65 s, script v14. T4 (gold burst, out sprinting) is replaced by T5: the macro's send bloom clears from her screen outward onto the locked-off desk, the screen's light pulls her in (generated ribbons, 1.6×), and as she vanishes VOLT (her run-up to the edge, act-volt from 1.0 s) comes up on that laptop screen out of a white flash; the camera dives into the screen (4× push, quad lerped to full frame, 5.0–5.45 s) and lands mid-run in the VOLT segment with no cut. Everything after is 0.55 s later (D 1.9 → 2.45). Render: `SILENT=1 COMP=AlfaHeroV14 bash render.sh v15`.
- **v14** (2026-11-18): `renders/alfa-hero-v14.mp4`, 16.1 s, script v14. Prompt motion styles: the first message is [ui-macro-dolly](../../../motion-styles/ui-macro-dolly.md) + [accent-typed-prompt](../../../motion-styles/accent-typed-prompt.md) on her laptop (over her shoulder the screen shows ALFA and grows to the frame as the camera dives onto the ALFA mark, slides along the empty field to Send, pulls out; the line types big with a purple wake by glyph age and a camera hop; Send squashes and bursts pixels; the camera dives through Send into a gold bloom that cuts into T4). The jam prompts are speech bubbles out of her: a tail points at her head, the bubble grows out of her, and it rides the scene's jam push. ALFA screen is a motion graphic (team decision, script v11). Render: `SILENT=1 COMP=AlfaHeroV14 bash render.sh v14`.
- **v13** (2026-11-18): `renders/alfa-hero-v13.mp4`, 15.87 s, script v14. The ALFA slam opens the film (0.12–1.15 s) over bored Leen, centred at x 680 so it sits beside her face while she rolls her eyes; her message box flies in on the cut to her hands (more time to type). Render: `SILENT=1 COMP=AlfaHeroV14 bash render.sh v13`.
- **v12** (2026-11-18): `renders/alfa-hero-v12.mp4`, 15.87 s, script v14 (`AlfaHeroV14`, edited in place from v11). ALFA slams in letter by letter (spring with overshoot, a camera kick per letter, a flash and a purple shockwave on the last one, the lockup drops in and the line types on), then punches at the camera as her message flies in; on send a gold flash cuts straight into T4 as she reaches her screen (the 0.6 s lean-in is gone); everything after is 0.68 s earlier. Render: `SILENT=1 COMP=AlfaHeroV14 bash render.sh v12`.
- **v11** (2026-11-18): `renders/alfa-hero-v11.mp4`, 16.55 s, script v14 (bored opening). Render: `SILENT=1 COMP=AlfaHeroV14 bash render.sh v11`.
- **v10** (2026-11-18): `renders/alfa-hero-v10.mp4`, 14.2 s, script v13 (Leen carries the transitions). Render: `SILENT=1 COMP=AlfaHeroV13 bash render.sh v10`.
- **v9** (2026-11-18): `renders/alfa-hero-v9.mp4`, 11.05 s, script v12 (English, Talent Contest transitions). Render: `SILENT=1 COMP=AlfaHeroV12 bash render.sh v9` (Vulkan + NVENC).
- **v8** (2026-11-18): v11 sped up to 10.7 s (action 1.8×, jam 0.2×, typing ~0.75 s). Superseded by v9 before review.
- **v7** (2026-11-18): `renders/alfa-hero-v7.mp4`, 13.75 s, script v11. Fixes on v6: a client name half-typed no longer flips («VOLT» showed as «OLTV», «KNOCKOUT» as «OUTKNOCK»: the purple wake split the Latin word into two isolated spans, which swap places in an RTL line); the client tag gets a soft corner shade so DUNE reads on bright sand. Render: `SILENT=1 COMP=AlfaHeroV11 bash render.sh v7`.
- **v6** (2026-11-18): 13.75 s (open 2.25, worlds 3.3, desk 1.6). After studying Talent Contest, Miracle, Higgsfield in ChatGPT and Genjutsu: the camera never stops (the jam is a 0.07× hyper slow-mo, not a dead freeze), a small light prompt in ALFA's lavender UI with a purple wake behind the caret, a squash on send and a pixel burst; one bold typed label (NAME + business) instead of 3 lines.
- **v5** (2026-11-18): `renders/alfa-hero-v5.mp4`, **15.25 s**, script v11. Composition `AlfaHeroV11` (`src/HeroV11.tsx`, box in `src/PromptBox.tsx`). Paced up (open 2.4 s, worlds 3.7 s, desk 1.75 s); the action ramps down into each freeze with an impact pop; the box has a gradient rim, bold Cairo, the client name in lavender and a send ring; after send the box opens into a **door** showing the whole next world, which grows to full frame while the frozen world is pulled into it; new client tag (CLIENT 0n / NAME / business) rising out of masks. Render: `SILENT=1 COMP=AlfaHeroV11 bash render.sh v5` (Vulkan + NVENC, ~90 s).
- **v4** (2026-11-18): first door transition and speed ramp (17 s). **v3**: first v11 cut with whips between worlds.
- **v2** (2026-11-18): `renders/alfa-hero-v2.mp4` (+ `.webm`, poster), 17 s, 1920×1080, silent loop, script v10. Composition `AlfaHeroV10` in `build/remotion/src/HeroV10.tsx` (reuses helpers from `Hero.tsx`). Leen at her agency desk (G1, ALFA home) → dive into the screen, its light fills the frame → VOLT's world (L1, the prompt typing on her laptop) → VOLT reel → KNOCKOUT's world (L2, planning) → punch → DUNE's world (L3, Approve and run lights up) → bike over the lens → montage → back at her desk, VOLT on her screen grows to frame 0. Screen quads measured on each L clip (±1 px over 5 s), grown 8 px to cover the white rim. Render: `cd build/remotion && COMP=AlfaHeroV10 bash render.sh v2` (GPU, 2:05).
- **v1** (2026-11-18): `renders/alfa-hero-v1.mp4` (+ `.webm`, poster), 17 s, 1920×1080, silent loop, script v7. Composition `AlfaHero` in `build/remotion/src/Hero.tsx`: every shot is generated footage; ALFA's real UI (dev recordings) is corner-pinned onto Leen's laptop (clip G1, C1). Render: `cd build/remotion && COMP=AlfaHero bash render.sh v1` (GPU, ~2 min).
- **Motion preview v4, update 2** (2026-11-18): the desk is now the real clip C1 (`public/desk-c1.mp4`): Reem walks in and the high five lands at ~15.6 s, just before the push back into the screen. Only the 3 action reels are still placeholders.
- **Motion preview v4, update** (2026-11-18): the desk is now the real still S1 (since replaced by C1). DUNE corner-pins (`matrix3d`) down into Leen's angled laptop screen, and at the loop her screen (VOLT) grows back to full frame. Reem's walk-in is still a placeholder until clip C1. Layout follows the still: laptop left, Leen right in profile, Reem enters behind the desk between them.
- **Motion preview v4** (2026-11-18): `renders/alfa-hero-preview-v4.mp4`, 17 s, half scale. Script v5. The ALFA UI is real (crops of the 3 existing recordings); the action reels and her desk are labelled placeholders. Rendered on the GPU (`render.sh` now uses `--gl=angle-egl` on the NVIDIA card: about 2× faster than CPU drawing).
- **Motion preview v3** (2026-11-18): `renders/alfa-hero-preview-v3.mp4`, 17 s. Opens on a full-screen ALFA title that splits open onto ALFA's input; MEET ALFA label dropped (the title does its job).
- **Motion preview v2** (2026-11-18): `renders/alfa-hero-preview-v2.mp4`. ALFA working is the first thing on screen (empty input → prompt → calendar → client switches); at 5.0 s the UI shrinks into her laptop to reveal her; the loop ends by pushing back into the laptop onto the empty input. Lockup merged into the corner label (ADFLEX kicker over MEET ALFA).
- **Motion preview v1** (2026-11-17): `renders/alfa-hero-preview-v1.mp4`, 16 s, 960×540 (half scale), silent. Timing and transitions of script v3 with labelled placeholders for every footage shot and UI card. Built from `build/remotion/src/Preview.tsx` (composition `AlfaPreview`, 24 fps). Full size: `cd build/remotion && COMP=AlfaPreview bash render.sh preview-v1`.

## Credits
Quote first, get a yes to the amount, then log it here and update `cost_credits` in `brief.md`.
| Date | What | Credits | Approved by |
|---|---|---|---|
| 2026-11-19 | ALFA type demo music, 20 s (ElevenLabs Music v2.5, op `9fcbcc5d-…`): real track, ticking build, drop at 8.025 s (asked for 3 s), final hit 16.025 s; re-cut on the beat in `build/alfa_type_demo_sound.sh` | 38 | team: «اه ولّدها بـ 38» |
| 2026-11-19 | ALFA type demo sound: music, 9 s (ElevenLabs Music v2.5, op `00fae3cf-…`) **delivered but unusable as a bed**: near-silent for 3.9 s, one hit at 4 s, then a decaying bass pulse; used only as the drop hit. + 8 SFX (ElevenLabs SFX v2, 8 × 6): slam, glitch, whoosh, boom, sparkle, pop, stop, sting | 17.5 + 48 = 65.5 | team: «اه ولّد الكل بـ 65.5» |
| 2026-11-18 | Music, same prompt (ElevenLabs Music **v2**), op `alfa-v18-music-v2`: **failed** after 5.7 min, no file; 34.5 reserved, refund unverified. 3 failures in a row on dev: music generation looks down | 34.5? | team: «جرب ع ادفلكس ديف» to «بجرّب v2 بالـ 34.5 كريدت؟» |
| 2026-11-18 | Music retry, same prompt (ElevenLabs Music v2.5), op `alfa-v18-music-retry1`: **failed** after 5.6 min, no file; 34.5 reserved, refund unverified | 34.5? | team: «عيد» to «بولّدها مرة تانية بنفس البرومت بالـ 34.5 كريدت؟» |
| 2026-11-18 | Music, 18 s (ElevenLabs Music v2.5), op `alfa-v18-music`: **failed** after 5 min, no file; 34.5 reserved, refund unverified (settlement pending) | 34.5? | team: «ااه كمل» to «بولّد الموسيقى بالـ 34.5 كريدت؟ اه ولا لا» |
| 2026-11-18 | S1e empty-desk still (gpt-image-2-6-sunburst edit, 70) + T5 into-the-screen clip (Gemini Omni Flash 1.2, first/last frame, 5 s 720p, 315) | 385 | team: «اعملها» to «بولّدهم بالـ 385 كريدت؟ اه ولا لا» |
| 2026-11-18 | B1 bored-Leen opening clip, script v14 (Gemini Omni Flash 1.2, from S1, 5 s 720p) | 315 | team: «ااه اعملها» to «بولّدها بالـ 315 كريدت؟ اه ولا لا» |
| 2026-11-18 | T1–T4 Leen-carries-the-transition clips, script v12 (Gemini Omni Flash 1.2, first/last frame, 5 s 720p, 4 × 315) | 1,260 | team: «اه، 4 لقطات = 1,260 كريدت» |
| 2026-11-18 | S0a heroine sheet, S0b VOLT lead sheet, S1 desk (nano-banana-2, 3 × 60) | 180 | team in chat: «بلش اه» to the 180 quote |
| 2026-11-18 | A1–A3 Leen-in-action clips, script v11 (Gemini Omni Flash 1.2, 5 s 720p, 3 × 315) | 945 | team: «اعملها» to «945 كريدت؟ اه ولا لا» |
| 2026-11-18 | A1–A3 Leen-in-action stills, script v11 (gpt-image-2-6-sunburst, 3 × 70) | 210 | team: «اه» to the 210 quote |
| 2026-11-18 | L1–L3 Leen-in-the-client's-world stills (gpt-image-2-6-sunburst, 3 × 70) + clips (Gemini Omni Flash 1.2, 5 s 720p, 3 × 315) | 210 + 945 = 1,155 | team: «اه بلش، 1,155» |
| 2026-11-18 | V1–V3 stills (seedream-5-5 2K, 3 × 45), G1–G2 stills (gpt-image-2-6-sunburst, 2 × 70), 5 clips (Gemini Omni Flash 1.2, 5 s 720p, 5 × 315) | 275 + 1,575 = 1,850 | team: «اه بلش، 1,850» |
| 2026-11-18 | E1 high-five end frame (nano-banana-2) + C1 desk clip, 5 s 720p (Gemini Omni Flash 1.2, first/last frame) | 60 + 315 = 375 | team: «اه بلش، 515 مع 720» (ceiling 515; 720p came to 315) |

## Versions and feedback
- 2026-11-18: **web files** from v18. Team: «اعمل الفيدو للويب».
- 2026-11-18: **v19** (script v15). Team: «حط الموسيقى» after the music generations failed. Reused the workflow hero's unused first track and SFX (0 credits).
- 2026-11-18: **v18** (script v15). Team on v17: «حط الموسيقى ولقطة الختمة». End card done; music approved «ااه كمل» to the 34.5 quote, but the generation failed.
- 2026-11-18: **v17** (script v15). Team on v16: «شيل قصة البراندات وخليه كله كانه البنت زهقانة وطلعت جولة». Edit only.
- 2026-11-18: **v16** (script v14). Team on v15: «طريقة الدخول البنت للحاسوب مش حلوة اسحبها بشكل اقوى واسرع». Done in the edit, no new generation.
- 2026-11-18: **v15** (script v14). Team on v14: «الموشن بين الانتقال الاول بين اللاب والبنت الي بتجري مش عاجبني كتير لو خليت مثلا البنت تدخل الشاشة بدل هيك»; S1e + T5 approved «اعملها» to the 385 quote.
- 2026-11-18: **v14** (script v14). Team: «هلقيت شو ستايل موشن تطلع فيه شكل البرومت افضل من هيك», then «اعملو» to: macro dolly + accent-typed prompt for the first message, speech bubbles out of her for the jams.
- 2026-11-18: **v13** (script v14). Team on v12: «الفا بتطلع من اول ثانية فوق البنت».
- 2026-11-18: **v12** (script v14). Team on v11: «دخول النص في البداية لازم يكون اكتر حماس والفات والبنت بتدخل للابتوب بعد البرومت ع طول».
- 2026-11-18: **v11** (script v14). Team on v10: «بدي ياك تحول البداية لبنت زهقانة وبتكتب لالفا رسالة وبعدها بيصير تسلسل الاحداث هادا»; B1 approved «ااه اعملها» to the 315 quote.
- 2026-11-18: **v10** (script v13). Team on v9: «بدي ياك تبين انو الانتقال بيصير مع البنت نفسها»; approved T1–T4 «اه، 4 لقطات = 1,260 كريدت».
- 2026-11-18: **v9** (script v12). Team on v7: «يعمي الفيديو اللقطات بطئ العرض مش عجباني», then «ما بدي نص بالعربي وشوف فيديو من الفيديوهات الريفرنس عندك وزبط الانتقالات بطريقته».
- 2026-11-18: **v6, v7** (script v11). Team: «يخي شوف كيف فيديوهات الناس التانية». v7 fixes the flipped client names while typing and the faint DUNE label.
- 2026-11-18: **v5** (script v11). Team on v3/v4: «الموشن والانتقالات بدها شغل خلي البرومت ينكتب بالعربي دخلت الفيديو خلي الها سيناريو كمان», «الفيديو بطئ اولا وشكل النص في كل لقطة لازم يكون افضل والانتقالات والتحسينات», and «ما تستخدم ال CPU في الريندر» (render.sh now draws on Vulkan and encodes with NVENC). Leen's own opening/ending scenario (swamped at the agency → back in her chair) still to quote.
- 2026-11-18: **v3** (script v11) after the prompt-box test `renders/prompt-test-v1.mp4`.
- 2026-11-18: **v2** (script v10). Team on v1: «مش واضحة فكرة الفيديو والمطلوب من الفال وشو بيعمل», then «بدي السكرتب انو البنت هاي تبعت الاجنسي عندها عملا كتار وكل عميل الو بزنس تاني من غ اللقطة الختامية», «بدي لقطة انو بفتح بزنس ودليل ع هيك», «مش ضروري يشوف الدروب داون بس انت اعمل الهم لقطات تخيلية».
- 2026-11-18: **v1** (script v7, all footage). Team: «الفيديو كله لازم يكون حقيقي ولا لقطة موشن غير التعديلات والنصوص», «وين السكربت والاكشن في الفيديو», «اعمل الفيديوهات اشوف واعطيني الفيديو». Images on Seedream 5.5 / GPT 2.6 per the team.
- 2026-11-18: motion preview v4 (script v5). Team: «حدّث الـ preview على v4 وما في تسجيل شاشة يعني اللقطات كلها بدها تتولد وفي عندك تشجيل شاشة موجود استخدمه», then «يعمي رنيدر ع كرت الشاشة ما تستخدم المعالج».
- 2026-11-17: brief and draft shot list (idea A). Team: "for the hero section, and it's a new idea".
- 2026-11-17: script v1 "The week that learns", after reading what ALFA really does in adflex-be and the competitor agent films. Team: «اقرا المنافسين وابني سكربت مختلف».
- 2026-11-18: script v4 with action clients (VOLT, KNOCKOUT, DUNE). Team: «بدي اكشن في الفيديو شو مخبز ؟».
- 2026-11-18: motion preview v3. Team: «شوف كيف الفيديوهات الريفرنس… اول شوت الاسم تبعها بيملي الشاشة». Checked the first 4 s of 8 references: Fable MCP, Talent Contest, Seedream, Genjutsu, Ad Multiplier and Supercomputer open on the name big and centred (sharp by ~0.3–0.6 s, held 1.5–2.6 s, a small brand lockup above), then turn into the UI or footage.
- 2026-11-18: motion preview v2. Team: «مفروض اول شوف في الفيديو يكون هو الفا وكيف شغال».
- 2026-11-17: motion preview v1 (placeholders), awaiting the team's notes on timing.
- 2026-11-17: script v3: «بدي البطلة بنت تكون في اجنسي ماركتنج والفكرة تكون في اجنسي ماركتنج». Agency marketer with 3 clients, 4 beats.
- 2026-11-17: script v2 after the full competitor report: one card instead of a grid (shot 3), the chat answer instead of a status line (shot 5), the result lands in the shop (shot 7).

## Lessons
