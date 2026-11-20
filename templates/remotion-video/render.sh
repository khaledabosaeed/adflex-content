#!/usr/bin/env bash
# Render the video and make the site deliverables: MP4 (H.264 on the GPU via NVENC), a poster PNG, and WebM (VP9, CPU) with WEBM=1.
# Usage: bash render.sh v1   -> ../../renders/<slug>-v1{.mp4,.webm,-poster.png}   (COMP=<id> to pick another composition)
#        bash render.sh v1 --scale=0.5  (quick preview; extra args go to `remotion render`)
set -euo pipefail
cd "$(dirname "$0")"
V=${1:?usage: render.sh <version> [remotion args]}; shift
COMP=${COMP:-Video}
NAME=${NAME:-$(basename "$(cd ../.. && pwd)")}
OUT=../../renders/$NAME-$V
mkdir -p ../../renders
bash ../../../../../tools/fetch_media.sh media.tsv
# A build that arranges its music from a raw track does it here (make_music.sh skips itself when up to date).
[ -f make_music.sh ] && bash make_music.sh
# GPU everywhere it's possible on this machine (RTX 3060, measured on alfa-hero, 96 frames):
#  - drawing: Chrome on Vulkan, 4 tabs = 44 s CPU (angle-egl x8 was 87 s, same wall time). GL=angle-egl / swangle to fall back.
#  - encoding: NVENC H.264 = 5 s CPU (x264 was ~37 s). NVENC=0 falls back to x264.
#  - one bundle for every step (each extra bundle costs ~10 s CPU).
if command -v nvidia-smi >/dev/null 2>&1; then
  export __NV_PRIME_RENDER_OFFLOAD=1 __GLX_VENDOR_LIBRARY_NAME=nvidia __EGL_VENDOR_LIBRARY_FILENAMES=/usr/share/glvnd/egl_vendor.d/10_nvidia.json
fi
TMP=$(mktemp -d); trap 'rm -rf "$TMP"' EXIT
npx remotion bundle --out-dir "$TMP/bundle" --log=error >/dev/null
FPS=$(npx remotion compositions "$TMP/bundle" 2>/dev/null | awk -v c="$COMP" '$1==c {print $2; exit}'); FPS=${FPS:-24}
npx remotion render "$TMP/bundle" "$COMP" "$TMP/f" --sequence --image-format=jpeg --jpeg-quality=95 \
  --gl="${GL:-vulkan}" --concurrency="${CONC:-4}" --log=error "$@"
if [ "${NVENC:-1}" = 1 ] && ffmpeg -hide_banner -encoders 2>/dev/null | grep -q h264_nvenc; then
  VENC=(-c:v h264_nvenc -preset p7 -tune hq -rc vbr -cq 16 -b:v 0 -profile:v high)
else
  VENC=(-c:v libx264 -crf 16 -preset medium)
fi
# Audio: rendered alone from the same bundle and peak-limited. SILENT=1 skips it (silent heroes).
AIN=(); AOUT=()
if [ "${SILENT:-0}" != 1 ]; then
  npx remotion render "$TMP/bundle" "$COMP" "$TMP/a.wav" --codec=wav --log=error "$@"
  AIN=(-i "$TMP/a.wav"); AOUT=(-af "alimiter=limit=0.7:attack=2:release=40:level=false" -c:a aac -b:a 192k)
fi
ffmpeg -nostdin -v error -y -framerate "$FPS" -pattern_type glob -i "$TMP/f/*.jpeg" "${AIN[@]}" \
  "${VENC[@]}" -pix_fmt yuv420p "${AOUT[@]}" -shortest -movflags +faststart "$OUT.mp4"
# WebM (VP9) has no GPU encoder on this card (RTX 3060: no AV1/VP9 NVENC), so it's CPU-only: opt in with WEBM=1.
if [ "${WEBM:-0}" = 1 ]; then
  ffmpeg -nostdin -v error -y -i "$OUT.mp4" -c:v libvpx-vp9 -crf 32 -b:v 0 -row-mt 1 -deadline good -cpu-used 2 -pix_fmt yuv420p \
    -c:a libopus -b:a 128k "$OUT.webm"
fi
ffmpeg -v error -y -ss 0.6 -i "$OUT.mp4" -frames:v 1 "$OUT-poster.png"
# loudness check: aim for about -15 LUFS integrated, true peak below -0.5 dBFS
ffmpeg -hide_banner -nostats -i "$OUT.mp4" -af ebur128=peak=true -f null - 2>&1 | grep -E "I:|Peak:" | tail -2 || true
ls -la "$OUT".mp4 "$OUT-poster.png" $( [ -f "$OUT.webm" ] && echo "$OUT.webm" )
