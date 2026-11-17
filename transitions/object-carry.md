---
name: "Object carry"
slug: "object-carry"
type: "transition"
fits: [hero, ad]
source: "Higgsfield × ChatGPT 'GPT Image 2.6' ad (23.2 s): https://static-public-media.higgsfield.ai/cards/b6c4b359-bce7-489b-99ca-b8dc0fb00cbd.mp4. Related: Luma Agents particle ring https://cdn.launchscene.app/luma-luma-agents/source.mp4 and Linear Loops glowing dot https://video.twimg.com/amplify_video/2079232220187729920/vid/avc1/1920x1080/xFqlN8hd9LB2wDcS.mp4"
used_in: [bloom-hero, workflow-hero]
---

# Object carry

## What it looks like
One small glowing object (a logo knot, a dot, an orb) is the thread through the whole video. It pops out of a button, flies off the edge of the frame, and in the next shot enters from the opposite edge and keeps going to its target. The cuts are plain hard cuts, but the eye follows the object across them, so the video feels continuous and calm.

## Breakdown
- **Transitions (Bloom v4):**
  1. The object pops from the Generate button and exits toward the top right.
  2. A hard cut. In the next shot it enters from the left and glides to the object it will change.
  3. It collapses into a bright point (the hit), which triggers the transformation.
  4. It re-forms after the reveal and flies off toward the next shot. On the last shot it doesn't come back.
  5. A small soft motion trail always follows it.
- **The transformation it triggers:** a flood clipped to a solid mask of the object:
  1. About 0.17 s of white-hot bloom spreading from the hit point.
  2. Neon brand purple with a wide soft halo, from 0.07 to 0.30 s.
  3. A matte purple tint that fades out by about 0.55 s.
  4. The true colours, with a slow push-in.
- **Cuts and timing:** exit speed equals entry speed, and the exit edge is opposite the entry edge.
- **Sound cues:** a light shimmer on the pop, a soft "tink" on each hit.

## How to make it
- **Model:** none for the carry. The flood is an edit on generated footage.
- **Edit recipe (Remotion):**
  - `Orb` in `templates/remotion-video/src/lib.tsx` is the glowing node with a trail. Feed it a path per shot.
  - Match the velocity: if it leaves at 1800 px/s toward the top right, it enters the next shot at the same speed from the bottom left.
  - The Bloom build lives in `videos/hero/bloom-hero/` (see its `production.md`).

## Watch out for
- No shake, flashes or rings with this one (Bloom v4 feedback). Its strength is that it's quiet.
- The object must be something the product really makes or uses (a brand mark, the workflow node), not a random particle.

## Examples
- bloom-hero v4: the GPT knot.
- workflow-hero v2: the glowing node carries every hand-off.
