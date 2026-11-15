---
name: الحجة (Hajja)
role: AdFlex's recurring Gulf grandma influencer
adflex_account: devAdflex
used_in: [hajja-cheetah-reel, hajja-construction-reel]
---

# الحجة (Hajja)

## Look (keep identical in every prompt)
- Elderly Gulf/Arab grandmother
- Purple-magenta abaya with gold geometric stripes
- Black hijab or shayla, gold bangles, sunglasses pushed up on her head
- White-and-violet chunky sneakers
- Expression: deadpan, bored, unbothered. She's the boss, and the joke is that nothing impresses her.

## Reference images
- **Character sheet:** saved in the devAdflex brand library as «الحجة الي عنا». Fetch it with `list_brand_elements` on devAdflex. Its image ID starts with `7ae2c068`. **TODO:** paste its full URL here.
- Good look references (generated stills):
  - Poster pose with cheetah and camel: https://cdn-dev.adflex.ai/ai-content/images/ad9edc6d-e5e4-4cdd-97db-2f2419d8ee80.jpg
  - Medium shot at the ATM: https://cdn-dev.adflex.ai/ai-content/images/5c7aba73-4a04-4b57-8aec-79476b535560.jpg
  - Construction version (hard hat + tool belt): https://cdn-dev.adflex.ai/ai-content/images/4408f5c9-bb83-4769-8248-5b571be2a470.jpg

## Recurring companions
- A real adult cheetah on a leather leash.
- A baby camel with black sunglasses and a violet satin bow.

## Prompt tips
- Use nano-banana-2 with `task_type: character_consistency` and the sheet as a reference.
- Don't use the Dubai-pier photo as a second reference: it leaks the modern skyline. Use an old-fareej still instead.
- Write "no writing anywhere except …", or the model invents gibberish Arabic.
- For video, Gemini Omni Flash 1.2 kept her likeness best across clips. Kling O3 fails when character `elements` are passed.
- Visual style used so far: a 1990s 35mm film look with warm faded colours and grain.
