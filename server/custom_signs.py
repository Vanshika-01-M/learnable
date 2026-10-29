"""
Your own signs for Learnable: record a few samples of any word in the app and the
server recognizes it right away, with no training step.

Every sample is turned into a 256-number SL-GCN "fingerprint" (the network's output
before its 263-word classifier). A new sign is compared with the recorded
fingerprints; centring them on the mean of all your recordings removes what they
share (your body, camera and room), which leaves mostly the sign itself.

Samples are stored as one JSON file each (label + landmark frames, never video)
under LEARNABLE_DATA_DIR, by default server/user_data/custom_signs.
"""

import json
import os
import re
import threading
import time
import uuid
from pathlib import Path

import numpy as np

DEFAULT_DATA_DIR = Path(__file__).with_name("user_data") / "custom_signs"
TOP_K_SAMPLES = 3  # a word's score is the mean similarity to its closest samples
MAX_LABEL_LENGTH = 40


def _slug(label):
    return re.sub(r"[^a-z0-9]+", "-", label.lower()).strip("-")[:30] or "sign"


class CustomSignStore:
    def __init__(self, embed, data_dir=None):
        self.embed = embed
        self.dir = Path(data_dir or os.environ.get("LEARNABLE_DATA_DIR", DEFAULT_DATA_DIR))
        self.dir.mkdir(parents=True, exist_ok=True)
        self.lock = threading.Lock()
        self.samples = []  # {"id", "label", "hindi", "path", "embedding"}

        for path in sorted(self.dir.glob("*.json")):
            data = json.loads(path.read_text(encoding="utf-8"))
            self.samples.append(self._entry(data, path))

    def _entry(self, data, path):
        return {
            "id": data["id"],
            "label": data["label"],
            "hindi": data.get("hindi", ""),
            "path": path,
            "embedding": self.embed(data["frames"]),
        }

    def words(self):
        with self.lock:
            words = {}
            for s in self.samples:
                word = words.setdefault(s["label"].lower(), {"label": s["label"], "hindi": s["hindi"], "samples": 0})
                word["samples"] += 1
                word["hindi"] = word["hindi"] or s["hindi"]
            return sorted(words.values(), key=lambda w: w["label"].lower())

    def add(self, label, frames, hindi=""):
        label = " ".join(label.split())[:MAX_LABEL_LENGTH]
        if not label:
            raise ValueError("label must not be empty")

        # Reuse the existing spelling of a word recorded before
        with self.lock:
            for s in self.samples:
                if s["label"].lower() == label.lower():
                    label = s["label"]
                    break

        data = {
            "id": uuid.uuid4().hex[:12],
            "label": label,
            "hindi": hindi.strip(),
            "created": time.strftime("%Y-%m-%dT%H:%M:%S"),
            "frames": frames,
        }
        entry = self._entry(data, self.dir / f"{_slug(label)}_{data['id']}.json")
        entry["path"].write_text(json.dumps(data), encoding="utf-8")
        with self.lock:
            self.samples.append(entry)
        return label

    def delete_word(self, label):
        with self.lock:
            removed = [s for s in self.samples if s["label"].lower() == label.lower()]
            self.samples = [s for s in self.samples if s["label"].lower() != label.lower()]
        for s in removed:
            s["path"].unlink(missing_ok=True)
        return len(removed)

    def match(self, embedding):
        """Rank recorded words by similarity to `embedding`; returns [(label, hindi, score)]."""
        with self.lock:
            samples = list(self.samples)
        if not samples:
            return []

        E = np.stack([s["embedding"] for s in samples])
        labels = [s["label"] for s in samples]
        # Centring needs at least two different words; with one word, fall back to plain cosine.
        center = E.mean(axis=0) if len({l.lower() for l in labels}) > 1 else np.zeros_like(embedding)
        E = E - center
        q = embedding - center
        sims = (E @ q) / (np.linalg.norm(E, axis=1) * np.linalg.norm(q) + 1e-8)

        scores = {}
        for label, sim in zip(labels, sims):
            scores.setdefault(label, []).append(float(sim))
        hindi = {}
        for s in samples:
            hindi[s["label"]] = hindi.get(s["label"]) or s["hindi"]
        ranked = [
            (label, hindi[label], float(np.mean(sorted(v, reverse=True)[:TOP_K_SAMPLES])))
            for label, v in scores.items()
        ]
        return sorted(ranked, key=lambda r: -r[2])
