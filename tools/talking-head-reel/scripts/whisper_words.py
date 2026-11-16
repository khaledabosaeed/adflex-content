#!/usr/bin/env python3
"""Word-level timestamps for the reel timeline (faster-whisper large-v3 on CUDA)."""
import json
import os
import sys
import time
import wave

import numpy as np
from pathlib import Path

# pip's nvidia-cublas-cu12 / nvidia-cudnn-cu12 wheels aren't on the loader path; preload them
# so CTranslate2 finds libcublas/libcudnn without exporting LD_LIBRARY_PATH.
import ctypes, glob, site  # noqa: E401,E402
for pat in ("nvidia/cublas/lib/libcublas*.so.*", "nvidia/cudnn/lib/libcudnn*.so.*"):
    for d in site.getsitepackages():
        for lib in sorted(glob.glob(f"{d}/{pat}")):
            try:
                ctypes.CDLL(lib, mode=ctypes.RTLD_GLOBAL)
            except OSError:
                pass

from faster_whisper import WhisperModel  # noqa: E402

ROOT = Path(__file__).resolve().parent.parent
wav = Path(sys.argv[1]) if len(sys.argv) > 1 else ROOT / "work" / "timeline.wav"   # 16 kHz mono
out = Path(sys.argv[2]) if len(sys.argv) > 2 else ROOT / "work" / "words.json"
t0 = time.time()
model = WhisperModel(os.environ.get("WHISPER_MODEL", "large-v3"),   # name (auto-download) or local folder
                     device="cuda", compute_type="float16")
with wave.open(str(wav)) as f:   # pass samples directly (PyAV in this env is too new for faster-whisper)
    audio = np.frombuffer(f.readframes(f.getnframes()), np.int16).astype(np.float32) / 32768
segs, info = model.transcribe(audio, language="ar", word_timestamps=True, beam_size=5,
                              vad_filter=False, condition_on_previous_text=False)
words = []
for s in segs:
    for w in s.words:
        words.append({"w": w.word.strip(), "s": round(w.start, 3), "e": round(w.end, 3), "p": round(w.probability, 3)})
out.write_text(json.dumps(words, ensure_ascii=False, indent=0))
print(f"{len(words)} words in {time.time() - t0:.1f}s on {info.language}", file=sys.stderr)
print(" ".join(f"{w['w']}[{w['s']:.2f}]" for w in words))
