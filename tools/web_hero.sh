#!/usr/bin/env bash
# Make the website files of a hero from its master render, encoded on the GPU (NVENC; no CPU encode). The master's sound is
# kept (AAC copied into the MP4, Opus in the WebM); SILENT=1 drops it. The site still autoplays muted; viewers can unmute.
#   <out>/<name>-web-1080.mp4  H.264 1920×1080, ~3 Mbps (multipass + spatial/temporal AQ), faststart
#   <out>/<name>-web-720.mp4   H.264 1280×720, ~1.4 Mbps, for phones
#   <out>/<name>-web-poster.jpg / -poster-720.jpg  frame 0, so the swap from poster to video is invisible
#   <out>/<name>-web-audio.mp3 / .m4a  the sound alone (when the master has it), same length as the video, for a page that
#                                      plays it separately from the muted video
# Measured on alfa-hero v18 (18 s, heavy generated footage): 6.8 MB / 3.2 MB, SSIM 0.986 vs the master (cq 24 was 12 MB).
# WEBM=1 also makes <name>-web-1080.webm / -720.webm (VP9, two-pass) on the CPU: neither GPU on this machine can encode VP9
# or AV1 (lessons/editing.md). alfa-hero v18: 95 s of CPU, 6.2 MB / 2.9 MB, SSIM 0.954 / 0.943 (looks the same in crops).
# Usage: [WEBM=1] bash tools/web_hero.sh videos/hero/<slug>/renders/<slug>-vN.mp4 [name]
set -euo pipefail
SRC=${1:?usage: web_hero.sh <silent master.mp4> [name]}
NAME=${2:-$(basename "$SRC" .mp4 | sed -E 's/-v[0-9]+$//')}
OUT=$(dirname "$SRC")/web; mkdir -p "$OUT"
HAS_A=$(ffprobe -v error -select_streams a -show_entries stream=index -of csv=p=0 "$SRC" | head -1)
A_MP4=(-an); A_WEBM=(-an)
if [ -n "$HAS_A" ] && [ "${SILENT:-0}" != 1 ]; then A_MP4=(-c:a copy); A_WEBM=(-c:a libopus -b:a 128k); fi
enc() { # $1 out, $2 bitrate (Mbps), $3 extra filters
  ffmpeg -nostdin -v error -y -i "$SRC" "${A_MP4[@]}" ${3:+-vf "$3"} -c:v h264_nvenc -preset p7 -tune hq -multipass fullres -rc vbr \
    -b:v "$2"M -maxrate "$(echo "$2*1.8" | bc)"M -bufsize "$(echo "$2*3" | bc)"M -spatial-aq 1 -temporal-aq 1 \
    -profile:v high -g 48 -pix_fmt yuv420p -movflags +faststart "$1"
}
enc "$OUT/$NAME-web-1080.mp4" 3
enc "$OUT/$NAME-web-720.mp4" 1.4 scale=1280:720:flags=lanczos
vp9() { # $1 out, $2 bitrate, $3 crf, $4 extra filters (CPU, two-pass)
  local vf=(); [ -n "${4:-}" ] && vf=(-vf "$4")
  local log; log=$(mktemp -u)
  for pass in 1 2; do
    local dst=/dev/null fmt=(-f null) a=(-an); [ $pass = 2 ] && { dst=$1; fmt=(); a=("${A_WEBM[@]}"); }
    ffmpeg -nostdin -v error -y -i "$SRC" "${a[@]}" "${vf[@]}" -c:v libvpx-vp9 -b:v "$2" -crf "$3" -row-mt 1 -tile-columns 2 \
      -deadline good -cpu-used 2 -g 48 -pix_fmt yuv420p -pass $pass -passlogfile "$log" "${fmt[@]}" "$dst"
  done
  rm -f "$log"-*.log
}
if [ "${WEBM:-0}" = 1 ]; then
  vp9 "$OUT/$NAME-web-1080.webm" 3M 32
  vp9 "$OUT/$NAME-web-720.webm" 1.4M 33 scale=1280:720:flags=lanczos
fi
ffmpeg -nostdin -v error -y -i "$SRC" -frames:v 1 -q:v 3 "$OUT/$NAME-web-poster.jpg"
ffmpeg -nostdin -v error -y -i "$SRC" -frames:v 1 -vf scale=1280:720:flags=lanczos -q:v 3 "$OUT/$NAME-web-poster-720.jpg"
if [ -n "$HAS_A" ] && [ "${SILENT:-0}" != 1 ]; then
  ffmpeg -nostdin -v error -y -i "$SRC" -vn -c:a libmp3lame -b:a 192k "$OUT/$NAME-web-audio.mp3"
  ffmpeg -nostdin -v error -y -i "$SRC" -vn -c:a copy -movflags +faststart "$OUT/$NAME-web-audio.m4a"
fi
for f in "$OUT/$NAME"-web-*; do printf '%s  %s\n' "$(du -h "$f" | cut -f1)" "$f"; done
