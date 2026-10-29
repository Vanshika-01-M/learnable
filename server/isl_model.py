"""
Pretrained Indian Sign Language (ISL) word recognizer for Learnable.

Wraps the AI4Bharat OpenHands SL-GCN checkpoint trained on the INCLUDE dataset
(263 isolated ISL words). The network is re-implemented in plain PyTorch
(see slgcn.py) so the server does not depend on the unmaintained OpenHands
package, and the checkpoint is loaded with `weights_only=True`.

Input contract — one frame is 75 [x, y] points in MediaPipe normalized image
coordinates, matching the OpenHands MediaPipe Holistic layout:
    0-32   BlazePose body landmarks
    33-53  signer's left hand landmarks  (all zeros when not visible)
    54-74  signer's right hand landmarks (all zeros when not visible)
"""

import hashlib
import json
import os
import urllib.request
import zipfile
from pathlib import Path

import numpy as np
import torch

from .slgcn import SLGCN

CHECKPOINT_URL = (
    "https://github.com/AI4Bharat/OpenHands/releases/download/checkpoints_v1/include_slgcn.zip"
)
CHECKPOINT_SHA256 = "0aa8eb27091dff71e5ae721a648a7410abb827c495731d3da43c55f195757a52"
CHECKPOINT_MEMBER = "include/sl_gcn/epoch=112-step=12203.ckpt"
LABELS_PATH = Path(__file__).with_name("include_labels.json")

NUM_POINTS = 75
# OpenHands PoseSelect preset "mediapipe_holistic_minimal_27"
MINIMAL_27 = [0, 2, 5, 11, 12, 13, 14, 33, 37, 38, 41, 42, 45, 46, 49, 50, 53,
              54, 58, 59, 62, 63, 66, 67, 70, 71, 74]
# Shoulder indexes inside the 27-point selection (preset "shoulder_mediapipe_holistic_minimal_27")
SHOULDERS = (3, 4)


def preprocess(frames):
    """(T, 75, 2+) holistic frames -> (1, 2, T, 27) tensor, as in OpenHands' INCLUDE eval pipeline."""
    x = np.asarray(frames, dtype=np.float32)
    if x.ndim != 3 or x.shape[1] != NUM_POINTS or x.shape[2] < 2:
        raise ValueError(f"expected frames of shape (T, {NUM_POINTS}, 2), got {x.shape}")
    x = x[:, MINIMAL_27, :2]

    # CenterAndScaleNormalize (clip level): center on the mean shoulder midpoint,
    # scale by the mean shoulder width.
    left, right = x[:, SHOULDERS[0]], x[:, SHOULDERS[1]]
    center = ((left + right) / 2).mean(axis=0)
    mean_dist = np.sqrt(((left - right) ** 2).sum(-1)).mean()
    if mean_dist > 0:
        x = (x - center) * (1.0 / mean_dist)

    return torch.from_numpy(np.ascontiguousarray(x)).permute(2, 0, 1).unsqueeze(0)


def _sha256(path):
    h = hashlib.sha256()
    with open(path, "rb") as f:
        for chunk in iter(lambda: f.read(1 << 20), b""):
            h.update(chunk)
    return h.hexdigest()


def download_checkpoint(cache_dir):
    """Download (once) and verify the OpenHands INCLUDE SL-GCN checkpoint; returns the .ckpt path."""
    cache_dir = Path(cache_dir)
    ckpt_path = cache_dir / CHECKPOINT_MEMBER
    if ckpt_path.exists():
        return ckpt_path

    cache_dir.mkdir(parents=True, exist_ok=True)
    zip_path = cache_dir / Path(CHECKPOINT_URL).name
    if not zip_path.exists() or _sha256(zip_path) != CHECKPOINT_SHA256:
        print(f"Downloading pretrained ISL model from {CHECKPOINT_URL} ...")
        urllib.request.urlretrieve(CHECKPOINT_URL, zip_path)
        digest = _sha256(zip_path)
        if digest != CHECKPOINT_SHA256:
            zip_path.unlink()
            raise RuntimeError(f"checkpoint checksum mismatch: {digest}")

    with zipfile.ZipFile(zip_path) as zf:
        zf.extract(CHECKPOINT_MEMBER, cache_dir)
    return ckpt_path


def _stub_class(module, name):
    cls = type(name, (), {"__setstate__": lambda self, state: None})
    cls.__module__ = module
    return cls


def load_state_dict(ckpt_path):
    # The Lightning checkpoint also pickles two callback objects we don't need;
    # stand-ins let the safe weights-only loader skip them without pytorch_lightning.
    stubs = [
        _stub_class("pytorch_lightning.callbacks.early_stopping", "EarlyStopping"),
        _stub_class("pytorch_lightning.callbacks.model_checkpoint", "ModelCheckpoint"),
    ]
    with torch.serialization.safe_globals(stubs):
        ckpt = torch.load(ckpt_path, map_location="cpu", weights_only=True)
    return {k.removeprefix("model."): v for k, v in ckpt["state_dict"].items()}


class ISLRecognizer:
    name = "OpenHands SL-GCN (INCLUDE, 263 ISL words)"

    def __init__(self, cache_dir=None, device=None):
        cache_dir = cache_dir or os.environ.get(
            "LEARNABLE_MODEL_DIR", Path.home() / ".cache" / "learnable"
        )
        self.device = torch.device(device or ("cuda" if torch.cuda.is_available() else "cpu"))
        self.labels = json.loads(LABELS_PATH.read_text(encoding="utf-8"))

        self.model = SLGCN(num_class=len(self.labels))
        self.model.load_state_dict(load_state_dict(download_checkpoint(cache_dir)), strict=True)
        self.model.to(self.device).eval()

    @torch.no_grad()
    def predict(self, frames, top_k=5):
        x = preprocess(frames).to(self.device)
        probs = torch.softmax(self.model(x)[0], dim=-1).cpu()
        conf, idx = probs.topk(min(top_k, len(self.labels)))
        return [
            {**self.labels[i], "index": i, "confidence": round(c, 4)}
            for c, i in zip(conf.tolist(), idx.tolist())
        ]
