# Model lessons (AdFlex)

## Images
- **nano-banana-2** (about 60–70 cr): best for character consistency (`task_type: character_consistency`, a sheet as reference).
  - It invents gibberish Arabic on signs, so say "no writing anywhere except …".
  - It sometimes adds real brand badges (a Toyota pickup). Check and paint them out.
  - A second reference image can leak its background (the Dubai skyline came in from a pier photo).
- **gpt-image-2-6-sunburst** (70 cr): best for edits that keep the photo and change one thing, such as filling a blank billboard or rebranding a cup (`task_type: edit_existing`, first frame + brand mark). It handles Arabic text well.

## Video
- **Gemini Omni Flash 1.2:** the go-to model.
  - Talking heads with native audio: write lines with tashkeel and romanization hints, and give a 4 s line 5 s.
  - Watch for burned-in subtitles and remove them with `delogo`.
  - Text-to-video with a product sheet as reference keeps labels readable.
  - It handles multi-shot prompts ("exactly four hard-cut shots, ~2 s each").
  - Costs about 504 cr for 8 s at 720p, 315 cr for 5 s at 720p, and 364–455 cr per 1080p plate.
- **Wan 3.0 Prime:** 110 cr/s at 720p, image-to-video, no audio. 3 s is enough for cuts of about 1.2 s.
- **Kling Video O3 Standard** (75 cr/s): works with `image_to_video` + one `source_url` + `multi_prompt_segments`. It **fails immediately (and refunds) when character `elements` are passed**.
- **Seedance 2.5:** used for the UGC girl video (14 s, 480p draft, 1,260 cr).
- Check hands and props frame by frame. Trimming past a warp is free; regenerating isn't.

## Audio
- **ElevenLabs Music v2.5:** 25–80 cr per track. Ask for an instant start, a clean final stab at a given second, and the BPM. Then check where it really goes silent.
- **SFX:** about 6 cr each.
- **Voiceover:** the Levantine voice "Laloosh" was used in the UGC reel.

## STT is a check, not proof
STT heard "AdFlicks" and "Cloud". Always listen to the line yourself as well.
