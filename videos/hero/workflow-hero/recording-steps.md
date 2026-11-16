# Workflows in one sentence: screen-recording steps

These recordings fill shots 2–5 of the hero (ALFA prompt → canvas builds itself → Run → outputs). Record them on **prod** (business `6adc7785123283962dbffc92`), because the hero goes on the public site.

## 1. Before recording
1. **Top up prod to at least 450 credits.** The Run costs about **427** (see "Run price" below), and prod had 40.5 on 2026-11-16. Recording the prompt and the build is free. Only the Run spends credits, so run it **once**.
2. **Product photo.** Upload one clean photo of a handmade candle in a plain glass jar, with no logo and no label text. Use a real photo you own, or generate one on prod first (about 60 credits).
3. **Check once, off camera, that ALFA builds the whole workflow from one prompt.** If it can't, stop and tell Claude. The hero claims it can.
4. **Browser setup:**
   - Chrome, window exactly 1920×1080, English UI (`adflex.ai/en/alfa`), light theme.
   - Zoom 110–125 % so text reads on a website hero.
   - Hide the bookmarks bar and extension icons.
   - Turn on Do Not Disturb, so no notifications pop up.
   - Close tabs that show emails, billing or other customers.
5. **Recorder:** OBS or the system recorder, 1920×1080, 60 fps (30 is OK), no audio, cursor visible. Keep one continuous recording per take.

## 2. Takes
Don't rush. Claude re-times the typing and speeds up the waits in the edit, so record at a natural pace and leave about 2 s of stillness at the start and end of every take.

### Take A: the prompt (shot 3)
1. Open a new ALFA chat and attach the candle photo.
2. Type exactly:
   > Build me a workflow: I give you a product photo, you make 3 ads and a story video with music.
3. Pause about 1 s, then press Send.

### Take B: the workflow builds itself (shot 4)
1. Keep recording straight on from Take A, or start the moment ALFA opens the canvas.
2. **Don't touch the mouse.** Let the nodes appear and connect on their own.
3. When it's done, leave the canvas at "fit to screen" for 3 s. Claude adds the zooms and pans later.

### Between B and C (off camera)
- Open the video node and check its model.
  - **If it's Seedance 2.5 at 720p, the Run costs about 1,087** instead of 427.
  - Switch it to **Gemini Omni Flash 1.2, 720p, 5 s**, and leave everything else as ALFA built it.
- Check the credit estimate the canvas shows before Run. It should be about 427.

### Take C: Run (shot 5)
1. Start with the whole canvas in view, move the cursor to **Run** slowly and click.
2. Keep recording until every node has finished, even if it takes minutes. Claude speeds up the wait.
3. Then open each output one by one: Ad 1, Ad 2, Ad 3 full size, and play the story video to the end.

### Take D: clean outputs (free)
Download the 3 ads and the story video at full resolution. They become the cards in shot 5.

## 3. What to send Claude
- The raw recordings (A+B, C), uploaded to the shared Drive. Put the links in [assets.md](assets.md) under "Clips".
- The workflow link or ID and the run ID.
- The output URLs (`https://cdn.adflex.ai/...`) for the 3 ads and the story video.

## Run price (quoted 2026-11-16 on prod with a test graph)
| Node | Credits |
|---|---|
| 3 × image edit (Nano Banana 2.1, 1K, 4:5) | 3 × 31 = 93 |
| Story video (Gemini Omni Flash 1.2, 720p, 5 s, 9:16) | 315 |
| Music (ElevenLabs Music v2.5, 10 s, instrumental) | 19 |
| Merge audio, inputs, output | 0 |
| **Total** | **427** |

With Seedance 2.5 at 720p for the video the total is about **1,087**, which is why the video node gets switched before Run.

The test graph is saved on prod as the draft **"Price check – workflow hero (delete after)"** (`c4f4f8e9ce9e7dfdf0d94aab`). It was never run. Delete it before recording, so it doesn't show up in the workflows list on camera.
