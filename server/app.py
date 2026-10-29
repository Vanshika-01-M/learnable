"""
Learnable ISL model server.

Receives landmark sequences (never video) from the Learnable web app and returns
the best matching sign: one of your own recorded signs (see custom_signs.py) or
one of the 263 words of the pretrained OpenHands INCLUDE model. Optionally turns
recognized words into a sentence with the free Groq API (see sentence.py).

Run locally from the repo root:
    python -m uvicorn server.app:app --port 8000
"""

import time
from contextlib import asynccontextmanager

import numpy as np
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

from . import sentence
from .custom_signs import MAX_LABEL_LENGTH, CustomSignStore
from .isl_model import NUM_POINTS, ISLRecognizer

sentence.load_env_file()

MIN_FRAMES = 4
MAX_FRAMES = 600

# When a recorded sign wins over the 263 built-in words. Calibrated on one INCLUDE
# signer recording 2-4 words (3-4 takes each): a centred similarity >= 0.5 accepted
# every sign of a recorded word and 3% of signs of unrecorded words.
CUSTOM_MATCH_THRESHOLD = 0.5
# With a single recorded word there is nothing to centre on (plain cosine is used):
# >= 0.85 accepted every sign of that word and none of the other words.
SINGLE_WORD_MATCH_THRESHOLD = 0.85
# "Only my signs" mode: below this a sign is reported as not one of yours. Signs of
# recorded words scored >= 0.42 even by other signers; unrecorded signs mostly < 0.35.
CUSTOM_MIN_SIMILARITY = 0.35
# Turns similarity gaps between recorded words into confidences (lower = sharper).
CUSTOM_TEMPERATURE = 0.1

state = {"recognizer": None, "custom": None, "requests": 0}


@asynccontextmanager
async def lifespan(app):
    recognizer = ISLRecognizer()
    state["recognizer"] = recognizer
    state["custom"] = CustomSignStore(recognizer.embed)
    words = state["custom"].words()
    print(f"Model ready: {recognizer.name} on {recognizer.device}")
    print(f"Your signs: {len(words)} words from {sum(w['samples'] for w in words)} samples in {state['custom'].dir}")
    if sentence.is_configured():
        print(f"Sentence building: on (Groq model {sentence.config()['model']})")
    else:
        print("Sentence building: off (add GROQ_API_KEY to server/.env to turn it on)")
    yield


app = FastAPI(title="Learnable ISL Model Server", lifespan=lifespan)

# The web app may be served from localhost, Netlify, etc.; only landmark data is exchanged.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["GET", "POST", "DELETE"],
    allow_headers=["*"],
)

Frames = list[list[list[float]]]
FRAMES_DESCRIPTION = f"T frames x {NUM_POINTS} points x [x, y] (MediaPipe normalized coords)"


class PredictRequest(BaseModel):
    frames: Frames = Field(..., description=FRAMES_DESCRIPTION)
    top_k: int = Field(5, ge=1, le=20)
    only_custom: bool = Field(False, description="Only match your recorded signs")


class SentenceRequest(BaseModel):
    words: list[str] = Field(..., min_length=1, max_length=20, description="Recognized words in signing order")


class CustomSignRequest(BaseModel):
    label: str = Field(..., min_length=1, max_length=MAX_LABEL_LENGTH)
    hindi: str = Field("", max_length=80)
    frames: Frames = Field(..., description=FRAMES_DESCRIPTION)


def check_frames(frames):
    if not MIN_FRAMES <= len(frames) <= MAX_FRAMES:
        raise HTTPException(422, f"send between {MIN_FRAMES} and {MAX_FRAMES} frames")


def custom_predictions(ranked, top_k):
    scores = np.array([score for _, _, score in ranked])
    if len(ranked) == 1:
        # Nothing to compare against: report the similarity itself
        confidences = [float(np.clip(scores[0], 0, 1))]
    else:
        weights = np.exp((scores - scores.max()) / CUSTOM_TEMPERATURE)
        confidences = (weights / weights.sum()).tolist()
    return [
        {
            "label": label,
            "hindi": hindi,
            "category": "My signs",
            "source": "custom",
            "similarity": round(score, 4),
            "confidence": round(conf, 4),
        }
        for (label, hindi, score), conf in zip(ranked[:top_k], confidences[:top_k])
    ]


@app.get("/health")
def health():
    recognizer = state["recognizer"]
    return {
        "status": "ok",
        "model": recognizer.name,
        "device": str(recognizer.device),
        "num_classes": len(recognizer.labels),
        "custom_words": len(state["custom"].words()),
        "sentence_ready": sentence.is_configured(),
        "points_per_frame": NUM_POINTS,
        "requests_served": state["requests"],
    }


@app.get("/labels")
def labels():
    return state["recognizer"].labels


@app.post("/predict")
def predict(req: PredictRequest):
    check_frames(req.frames)
    start = time.perf_counter()
    recognizer = state["recognizer"]
    try:
        embedding, probs = recognizer.analyze(req.frames)
    except ValueError as err:
        raise HTTPException(422, str(err))

    ranked = state["custom"].match(embedding)
    best = ranked[0][2] if ranked else None
    if len(ranked) == 1:
        accept = min_similarity = SINGLE_WORD_MATCH_THRESHOLD
    else:
        accept, min_similarity = CUSTOM_MATCH_THRESHOLD, CUSTOM_MIN_SIMILARITY

    if ranked and best >= accept:
        predictions = custom_predictions(ranked, req.top_k)
    elif req.only_custom:
        # Nothing recorded yet, or not similar enough to any recorded sign
        predictions = custom_predictions(ranked, req.top_k) if ranked and best >= min_similarity else []
    else:
        predictions = [
            {**p, "source": "include"} for p in recognizer.predict(req.frames, req.top_k, probs=probs)
        ]

    state["requests"] += 1
    return {
        "predictions": predictions,
        "custom_words": len(ranked),
        "num_frames": len(req.frames),
        "latency_ms": round((time.perf_counter() - start) * 1000, 1),
    }


@app.post("/sentence")
def make_sentence(req: SentenceRequest):
    words = [w.strip()[:MAX_LABEL_LENGTH] for w in req.words if w.strip()]
    if not words:
        raise HTTPException(422, "send at least one word")
    if not sentence.is_configured():
        raise HTTPException(503, "Sentence building is off: add GROQ_API_KEY to server/.env and restart the server.")
    try:
        result = sentence.build_sentence(words)
    except sentence.SentenceError as err:
        raise HTTPException(502, str(err))
    return {**result, "words": words}


@app.get("/custom-signs")
def list_custom_signs():
    return {"words": state["custom"].words()}


@app.post("/custom-signs")
def add_custom_sign(req: CustomSignRequest):
    check_frames(req.frames)
    try:
        label = state["custom"].add(req.label, req.frames, req.hindi)
    except ValueError as err:
        raise HTTPException(422, str(err))
    return {"label": label, "words": state["custom"].words()}


@app.delete("/custom-signs/{label}")
def delete_custom_sign(label: str):
    removed = state["custom"].delete_word(label)
    if not removed:
        raise HTTPException(404, f'no recorded sign called "{label}"')
    return {"removed": removed, "words": state["custom"].words()}
