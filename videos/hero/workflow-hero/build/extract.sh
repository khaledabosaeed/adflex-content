#!/usr/bin/env bash
# Extract the source ranges the hero edit uses as JPEG frame sequences.
# The composition (comp.html) picks a source time per output frame, so speed
# ramps and cuts live in comp.html; this only dumps frames at a known rate.
#
# Output: renders/frames/<seg>/f%05d.jpg  (renders/ is git-ignored)
set -euo pipefail
HERE="$(cd "$(dirname "$0")" && pwd)"
V="$HERE/.."
REC="$V/renders/rec"
OUT="$V/renders/frames"
mkdir -p "$OUT"

seg() { # name src start dur fps [extra-filter]
  local name=$1 src=$2 ss=$3 dur=$4 fps=$5 vf=${6:-}
  rm -rf "${OUT:?}/$name"; mkdir -p "$OUT/$name"
  ffmpeg -v error -y -ss "$ss" -t "$dur" -i "$src" \
    -vf "fps=$fps${vf:+,$vf}" -q:v 2 "$OUT/$name/f%05d.jpg"
  echo "$name: $(ls "$OUT/$name" | wc -l) frames from $ss +$dur s @ ${fps}fps"
}

# Girl, animated shot 1 (24 fps source, 3.03 s)
seg girl  "$V/renders/shot1-anim-v1.mp4" 0     3.0  30 "scale=1920:1080"
# ALFA: typing + send (Take A2). The sidebar flashes open at 44.07-44.75 s
# (a real mouse passed over the window); comp.html skips 44.0-44.85.
seg alfa  "$REC/takeA2/take.mp4"         38.5  12.5 30
# ALFA: "Run this plan? Free" card, approve, result streams in
seg build "$REC/takeA2/take.mp4"         163.0 16.0 30
# Canvas: auto-layout + fit (Take A2)
seg canvas "$REC/takeA2/take.mp4"        258.0 13.0 30
# Run: 8 steps selected, "Run selected · 510 cr" (Take C)
seg runsel "$REC/takeC/take.mp4"         44.0  9.0  30
# Run progress, timelapse source at 10 fps (Take C)
seg runtl  "$REC/takeC/take.mp4"         69.0  80.0 10
# Real story-video output (720x1280, with music; picture only here)
seg story "$REC/outputs/story-music.mp4" 0     5.0  30
