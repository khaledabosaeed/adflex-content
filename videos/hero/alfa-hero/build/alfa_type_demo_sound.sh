#!/usr/bin/env bash
# Sound for the ALFA brand-type demo (templates/remotion-video/src/AlfaTypeDemo.tsx, 8.2 s).
# Music is re-cut on the beat so its drop lands on ALFA (1.5 s) and its final hit on the end card (6.5 s).
# SFX follow the ORRA mix (tools/alfa-motion-source/mix17.py, cue list in motion-styles/alfa-brand-type.md).
# Usage: [SET=gen|stock] bash videos/hero/alfa-hero/build/alfa_type_demo_sound.sh <demo.mp4> <out.mp4>
set -euo pipefail
ROOT=$(cd "$(dirname "$0")/../../../.." && pwd)
IN=${1:?demo mp4}; OUT=${2:?out mp4}
A="$ROOT/videos/hero/alfa-hero/build/remotion/public/audio"
W="$ROOT/videos/hero/workflow-hero/build/remotion/public/audio"
DUR=8.2
TMP=$(mktemp -d)

# name|file|start s|gain dB|extra filters (applied before delay)
# SET=gen (default): music + SFX generated on AdFlex dev on 2026-11-19 (public/audio/gen-*.mp3, see media.tsv).
# SET=stock: the first free version: trip-music.mp3 (already paid) + earlier SFX files.
G="$ROOT/videos/hero/alfa-hero/build/remotion/public/audio"
if [[ ${SET:-gen} == gen ]]; then
# gen-music-20.mp3 (20 s, generated 2026-11-19): ticking build, drop at 8.025 s, beat every 0.5 s,
# final hit on the bar line at 16.025 s, then a tail. Offset 6.525 puts the drop on ALFA (1.5 s);
# the ending jumps to the final hit on the end card (6.5 s), under the logo sting.
MUSIC=(
  "build|$G/gen-music-20.mp3|0.00|-2|atrim=6.525:7.875,asetpts=PTS-STARTPTS,afade=t=in:d=0.05,afade=t=out:st=1.29:d=0.06"
  "drop|$G/gen-music-20.mp3|1.50|0|atrim=8.025:13.025,asetpts=PTS-STARTPTS,afade=t=in:d=0.005,afade=t=out:st=4.985:d=0.015"
  "tail|$G/gen-music-20.mp3|6.50|0|atrim=16.015:17.725,asetpts=PTS-STARTPTS,afade=t=in:d=0.01,afade=t=out:st=1.3:d=0.4"
)
else
MUSIC=(
  "build|$A/trip-music.mp3|0.00|-4|atrim=6.6:7.95,asetpts=PTS-STARTPTS,afade=t=in:d=0.05,afade=t=out:st=1.27:d=0.08"
  "drop|$A/trip-music.mp3|1.50|-1|atrim=8.0:13.0,asetpts=PTS-STARTPTS,afade=t=in:d=0.01,afade=t=out:st=4.985:d=0.015"
  "tail|$A/trip-music.mp3|6.50|0|atrim=16.0:17.7,asetpts=PTS-STARTPTS,afade=t=out:st=1.2:d=0.5"
)
fi
if [[ ${SET:-gen} == gen ]]; then
CUES=("${MUSIC[@]}"
  # --- title (0-1.4) ---
  "suck|$G/gen-whoosh.mp3|0.00|-12|areverse,atrim=0.30,asetpts=PTS-STARTPTS"
  "hit1|$G/gen-slam.mp3|0.28|-9|asetrate=44100*1.00,aresample=44100"
  "hit2|$G/gen-slam.mp3|0.335|-9|asetrate=44100*1.08,aresample=44100"
  "hit3|$G/gen-slam.mp3|0.39|-9|asetrate=44100*1.16,aresample=44100"
  "hit4|$G/gen-slam.mp3|0.445|-7|asetrate=44100*1.24,aresample=44100"
  "tick1|$G/gen-glitch.mp3|0.28|-22|atrim=0:0.05,afade=t=out:st=0.03:d=0.02"
  "tick2|$G/gen-glitch.mp3|0.335|-23|atrim=0.08:0.12,asetpts=PTS-STARTPTS,afade=t=out:st=0.025:d=0.015"
  "tick3|$G/gen-glitch.mp3|0.39|-23|atrim=0.14:0.18,asetpts=PTS-STARTPTS,afade=t=out:st=0.025:d=0.015"
  "tick4|$G/gen-glitch.mp3|0.445|-20|atrim=0.2:0.26,asetpts=PTS-STARTPTS,afade=t=out:st=0.04:d=0.02"
  "ring|$G/gen-boom.mp3|0.445|-4|"
  "wipe|$G/gen-whoosh.mp3|0.10|-18|"
  "spark|$G/gen-sparkle.mp3|0.70|-9|"
  "fly|$G/gen-whoosh.mp3|0.76|-7|"
  "gout|$G/gen-glitch.mp3|1.24|-14|atrim=0:0.16,afade=t=out:st=0.12:d=0.04"
  # --- body ---
  "alfa|$G/gen-boom.mp3|1.50|-6|"
  "cap1|$G/gen-whoosh.mp3|1.96|-19|asetrate=44100*1.4,aresample=44100"
  "chip|$G/gen-pop.mp3|2.35|-4|"
  "lift|$G/gen-whoosh.mp3|2.68|-17|"
  "size|$G/gen-whoosh.mp3|3.41|-13|asetrate=44100*1.4,aresample=44100"
  "t1|$G/gen-pop.mp3|3.75|-5|asetrate=44100*1.05,aresample=44100"
  "t2|$G/gen-pop.mp3|4.15|-5|asetrate=44100*1.12,aresample=44100"
  "t3|$G/gen-pop.mp3|4.55|-5|asetrate=44100*1.19,aresample=44100"
  "t4|$G/gen-pop.mp3|4.85|-5|asetrate=44100*1.26,aresample=44100"
  "flyc|$G/gen-whoosh.mp3|4.88|-10|"
  "cap3|$G/gen-whoosh.mp3|5.46|-19|asetrate=44100*1.4,aresample=44100"
  "stop|$G/gen-stop.mp3|5.78|4|"
  "stopk|$G/gen-slam.mp3|5.80|-7|"
  "end|$G/gen-sting.mp3|6.45|-4|"
  "endb|$G/gen-boom.mp3|6.50|-9|"
  "lock|$G/gen-sparkle.mp3|6.92|-15|"
)
else
CUES=("${MUSIC[@]}"
  "suck|$A/whoosh.mp3|0.00|-12|areverse"
  "hit1|$A/impact.mp3|0.26|-11|atrim=0:0.35,asetrate=44100*1.5,aresample=44100,afade=t=out:st=0.15:d=0.08"
  "hit2|$A/impact.mp3|0.315|-11|atrim=0:0.35,asetrate=44100*1.62,aresample=44100,afade=t=out:st=0.14:d=0.08"
  "hit3|$A/impact.mp3|0.37|-11|atrim=0:0.35,asetrate=44100*1.74,aresample=44100,afade=t=out:st=0.13:d=0.08"
  "hit4|$A/impact.mp3|0.425|-9|atrim=0:0.35,asetrate=44100*1.86,aresample=44100,afade=t=out:st=0.12:d=0.08"
  "tick1|$W/glitch.mp3|0.28|-18|atrim=0:0.06,afade=t=out:st=0.04:d=0.02"
  "tick4|$W/glitch.mp3|0.445|-16|atrim=0.1:0.16,asetpts=PTS-STARTPTS,afade=t=out:st=0.04:d=0.02"
  "ring|$A/impact.mp3|0.44|-5|"
  "boom1|SUB|0.445|-6|"
  "wipe|$A/whoosh.mp3|0.40|-17|"
  "spark|$W/scan.mp3|0.60|-20|afade=t=out:st=0.4:d=0.3"
  "fly|$A/whoosh.mp3|0.95|-8|"
  "gout|$W/glitch.mp3|1.24|-10|atrim=0:0.16,afade=t=out:st=0.12:d=0.04"
  "alfa|$A/impact.mp3|1.50|-6|"
  "boom2|SUB|1.50|-5|"
  "chip|$W/pop.mp3|2.35|-12|"
  "lift|$W/sfx-lift.mp3|2.85|-10|"
  "size|$W/sfx-whip.mp3|3.30|-12|"
  "t1|$W/pop.mp3|3.75|-13|asetrate=44100*1.05,aresample=44100"
  "t2|$W/pop.mp3|4.15|-13|asetrate=44100*1.12,aresample=44100"
  "t3|$W/pop.mp3|4.55|-13|asetrate=44100*1.19,aresample=44100"
  "t4|$W/pop.mp3|4.85|-13|asetrate=44100*1.26,aresample=44100"
  "flyc|$A/whoosh.mp3|4.95|-11|"
  "rise|$A/riser.mp3|4.80|-13|afade=t=out:st=0.9:d=0.1"
  "stop|$A/impact.mp3|5.80|-5|"
  "stopc|$A/click.wav|5.80|-4|"
  "end|$W/sfx-logo.mp3|6.45|-5|"
  "boom3|SUB|6.50|-7|"
)
fi

ARGS=(); FG=""; n=0
for c in "${CUES[@]}"; do
  IFS='|' read -r name file at gain extra <<<"$c"
  if [[ $file == SUB ]]; then
    ARGS+=(-f lavfi -i "aevalsrc='0.9*sin(2*PI*44*t*(1-0.3*t/0.9))*exp(-5*t)':s=44100:d=0.9")
  else
    ARGS+=(-i "$file")
  fi
  ms=$(awk -v t="$at" 'BEGIN{printf "%d", t*1000}')
  chain="aformat=sample_rates=44100:channel_layouts=stereo"
  [[ -n $extra ]] && chain="$chain,$extra"
  FG+="[$n:a]$chain,volume=${gain}dB,adelay=${ms}|${ms}[c$n];"
  n=$((n+1))
done
MIX=""; for ((i=0;i<n;i++)); do MIX+="[c$i]"; done
FG+="${MIX}amix=inputs=$n:normalize=0:duration=longest,apad,atrim=0:$DUR,alimiter=limit=0.7:level=0[pre]"
ffmpeg -v error -y "${ARGS[@]}" -filter_complex "$FG" -map "[pre]" -c:a pcm_s16le "$TMP/pre.wav"

# loudness to about -14 LUFS, true peak under -1 dBTP
I=$(ffmpeg -hide_banner -i "$TMP/pre.wav" -af ebur128=peak=true -f null - 2>&1 | awk '/Integrated loudness/{f=1} f&&/I:/{print $2; exit}')
G=$(awk -v i="$I" 'BEGIN{printf "%.2f", -14 - i}')
ffmpeg -v error -y -i "$TMP/pre.wav" -af "volume=${G}dB,alimiter=limit=0.84:level=0" -ar 48000 "$TMP/mix.wav"
ffmpeg -v error -y -i "$IN" -i "$TMP/mix.wav" -map 0:v -map 1:a -c:v copy -c:a aac -b:a 256k -shortest -movflags +faststart "$OUT"
echo "pre-gain loudness $I LUFS, gain $G dB"
ffmpeg -hide_banner -i "$OUT" -af ebur128=peak=true -f null - 2>&1 | grep -E "^\s+(I|Peak):" | tr -s ' '
rm -r "$TMP"
