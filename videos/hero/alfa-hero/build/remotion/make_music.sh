#!/usr/bin/env bash
# Arrange the hero's music bed from an existing track (public/audio/trip-music.mp3: the workflow hero's first track,
# 120 BPM, intro to 8.0 s, drop 8.0–16.0 s, tail after; in media.tsv) into public/audio/trip-bed.wav (git ignores it;
# render.sh runs this). Pieces are cut on bar lines (one bar = 2 s) so the beat never jumps:
#   film  0.00– 3.75  src  4.00– 7.75  intro, low-passed (bored at her desk, the title, the macro prompt)
#   film  3.75– 4.00  src  7.75– 8.00  the intro opens up on Send
#   film  4.00–12.00  src  8.00–16.00  the drop lands as her screen pulls her in (T5); rooftops, ring
#   film 12.00–16.00  src  8.00–12.00  the drop again on a downbeat (desert, thrown off, back in her chair)
#   film 16.00–18.15  src 16.00–18.15  the drop's tail, under the end card
#                     + src  2.00– 4.15  the low-passed intro groove fades back in under the card, so the loop to
#                                        film 0 (src 4.00) carries straight on, on the beat
# Each join overlaps 20 ms with fades, so there's no click.
set -euo pipefail
cd "$(dirname "$0")"
IN=public/audio/trip-music.mp3
OUT=public/audio/trip-bed.wav
[ -f "$OUT" ] && [ "$OUT" -nt "$IN" ] && [ "$OUT" -nt "$0" ] && exit 0
ffmpeg -v error -y -i "$IN" -filter_complex "\
[0:a]aresample=48000,asplit=4[s1][s2][s3][s4];\
[s1]atrim=4.0:16.02,asetpts=PTS-STARTPTS,afade=t=out:st=11.99:d=0.02,asetnsamples=n=240,asplit=2[p1a][p1b];\
[p1a]lowpass=f=900:p=2,lowpass=f=900:p=2,volume='0.75*clip((3.77-t)/0.02,0,1)':eval=frame[p1lp];\
[p1b]volume='clip((t-3.75)/0.25,0,1)':eval=frame[p1full];\
[s2]atrim=7.98:12.02,asetpts=PTS-STARTPTS,afade=t=in:d=0.02,afade=t=out:st=4.02:d=0.02,adelay=11980:all=1[p2];\
[s3]atrim=15.98:18.2,asetpts=PTS-STARTPTS,afade=t=in:d=0.02,afade=t=out:st=1.4:d=0.75,adelay=15980:all=1[p3];\
[s4]atrim=1.98:4.17,asetpts=PTS-STARTPTS,lowpass=f=900:p=2,lowpass=f=900:p=2,afade=t=in:st=0.1:d=0.5,volume=0.75,adelay=15980:all=1[p4];\
[p1lp][p1full][p2][p3][p4]amix=inputs=5:normalize=0:duration=longest,atrim=0:18.1667,alimiter=limit=0.89:level=false[out]" \
  -map "[out]" -c:a pcm_s16le "$OUT"
echo "music arranged -> $OUT"
