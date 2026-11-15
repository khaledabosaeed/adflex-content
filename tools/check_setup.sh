#!/usr/bin/env bash
# Checks that this machine has what the AdFlex content repo needs.
# Usage: bash tools/check_setup.sh          full report
#        bash tools/check_setup.sh --hook   short report for the Claude Code SessionStart hook
# See SETUP.md for what each item is for.

MODE="${1:-}"
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

# Pick install commands for this OS.
if command -v brew >/dev/null 2>&1 && [ "$(uname)" = "Darwin" ]; then
  PKG="brew install"; RAQM="brew install libraqm"
elif command -v dnf >/dev/null 2>&1; then
  PKG="sudo dnf install"; RAQM="sudo dnf install libraqm"
elif command -v apt-get >/dev/null 2>&1; then
  PKG="sudo apt install"; RAQM="sudo apt install libraqm0"
else
  PKG="(your package manager) install"; RAQM="install libraqm with your package manager"
fi

missing=()   # "group|name|why|how"
ok=()

need() { # group name why how test-command...
  local group="$1" name="$2" why="$3" how="$4"; shift 4
  if "$@" >/dev/null 2>&1; then ok+=("$name"); else missing+=("$group|$name|$why|$how"); fi
}
has() { command -v "$1"; }
py_mod() { python3 -c "import importlib.util,sys; sys.exit(0 if importlib.util.find_spec('$1') else 1)"; }
py_raqm() { python3 -c "from PIL import features; import sys; sys.exit(0 if features.check('raqm') else 1)"; }
node_mod() { (cd "$ROOT" && node -e "require.resolve('$1')"); }
font() { if has fc-list >/dev/null; then fc-list | grep -qi "$1"; else ls ~/Library/Fonts /Library/Fonts 2>/dev/null | grep -qi "${1// /}"; fi; }
cairo_font() { [ -d "$ROOT/node_modules/@fontsource/cairo" ] || font "Cairo"; }
agent_reach() { has agent-reach || [ -d "$HOME/.claude/skills/agent-reach" ]; }
pw_browser() { ls -d "$HOME/.cache/ms-playwright"/chromium* "$HOME/Library/Caches/ms-playwright"/chromium* 2>/dev/null | grep -q .; }

# Everyone
need everyone git "clone and update the repo" "$PKG git" has git

# Editing
need editing ffmpeg "cutting, captions, loudness, music ducking" "$PKG ffmpeg" has ffmpeg
need editing ffprobe "measuring clips (comes with ffmpeg)" "$PKG ffmpeg" has ffprobe
need editing python3 "editing scripts" "$PKG python3" has python3
need editing "Pillow" "rendering caption and title PNGs" "pip install -r requirements.txt" py_mod PIL
need editing "Pillow + raqm" "shaping Arabic text correctly (ffmpeg's own Arabic is broken)" "$RAQM, then pip install --force-reinstall pillow" py_raqm
need editing librosa "beat grid for music-synced cuts" "pip install -r requirements.txt" py_mod librosa
need editing numpy "audio analysis" "pip install -r requirements.txt" py_mod numpy
need editing node "fonts and Playwright come from npm" "install Node.js from nodejs.org (or nvm)" has node
need editing "Cairo font" "Arabic captions and titles" "npm install (in the repo)" cairo_font
need editing "IBM Plex Sans Arabic font" "ALFA UI text" "fonts.google.com/specimen/IBM+Plex+Sans+Arabic" font "IBM Plex Sans Arabic"
need editing "Archivo Black font" "Latin display titles" "fonts.google.com/specimen/Archivo+Black" font "Archivo Black"
need editing "Anton font" "Latin display titles" "fonts.google.com/specimen/Anton" font "Anton"
need editing "Unbounded font" "Latin display titles" "fonts.google.com/specimen/Unbounded" font "Unbounded"
need editing "Playfair Display font" "the الحجة signature" "fonts.google.com/specimen/Playfair+Display" font "Playfair Display"

# Research
need research agent-reach "web, YouTube, Reddit and X research" "ask the team for the agent-reach skill setup (it lives in ~/.claude/skills/, not the repo)" agent_reach
need research playwright "opening sites that need a real browser" "npm install (in the repo)" node_mod playwright
need research "Playwright Chromium" "the browser Playwright drives" "npx playwright install chromium" pw_browser

# Optional
need optional faster-whisper "checking pronunciation of generated takes" "python3 -m pip install --user faster-whisper" py_mod faster_whisper

required_missing=0; optional_missing=0
for m in "${missing[@]}"; do [ "${m%%|*}" = optional ] && optional_missing=$((optional_missing+1)) || required_missing=$((required_missing+1)); done

if [ "$MODE" = "--hook" ]; then
  if [ ${#missing[@]} -eq 0 ]; then
    echo "AdFlex setup check: everything in SETUP.md is installed."
    exit 0
  fi
  echo "AdFlex setup check: $required_missing missing, $optional_missing optional missing. See SETUP.md."
  echo "When a task needs one of these, tell the user it's missing, what it's for, and the install command, before trying the task:"
  for m in "${missing[@]}"; do
    IFS='|' read -r g n w h <<<"$m"
    echo "- [$g] $n: $w. Install: $h"
  done
  exit 0
fi

echo "AdFlex setup check ($ROOT)"
echo "Found: ${ok[*]:-nothing}"
echo
if [ ${#missing[@]} -eq 0 ]; then echo "Everything is installed."; exit 0; fi
for group in everyone editing research optional; do
  printed=0
  for m in "${missing[@]}"; do
    IFS='|' read -r g n w h <<<"$m"
    [ "$g" = "$group" ] || continue
    [ $printed -eq 0 ] && { echo "Missing ($group):"; printed=1; }
    echo "  - $n: $w"
    echo "      install: $h"
  done
done
echo
echo "$required_missing required item(s) missing, $optional_missing optional. See SETUP.md."
exit 0
