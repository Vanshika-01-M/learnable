"""
Learnable ISL model server.

Receives landmark sequences (never video) from the Learnable web app and returns
the top ISL word predictions from the pretrained OpenHands INCLUDE model.

Run locally from the repo root:
    python -m uvicorn server.app:app --port 8000
"""

import time
from contextlib import asynccontextmanager

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

from .isl_model import NUM_POINTS, ISLRecognizer

MIN_FRAMES = 4
MAX_FRAMES = 600

state = {"recognizer": None, "requests": 0}


@asynccontextmanager
async def lifespan(app):
    state["recognizer"] = ISLRecognizer()
    print(f"Model ready: {state['recognizer'].name} on {state['recognizer'].device}")
    yield


app = FastAPI(title="Learnable ISL Model Server", lifespan=lifespan)

# The web app may be served from localhost, Netlify, etc.; only landmark data is exchanged.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
)


class PredictRequest(BaseModel):
    frames: list[list[list[float]]] = Field(
        ..., description=f"T frames x {NUM_POINTS} points x [x, y] (MediaPipe normalized coords)"
    )
    top_k: int = Field(5, ge=1, le=20)


@app.get("/health")
def health():
    recognizer = state["recognizer"]
    return {
        "status": "ok",
        "model": recognizer.name,
        "device": str(recognizer.device),
        "num_classes": len(recognizer.labels),
        "points_per_frame": NUM_POINTS,
        "requests_served": state["requests"],
    }


@app.get("/labels")
def labels():
    return state["recognizer"].labels


@app.post("/predict")
def predict(req: PredictRequest):
    if not MIN_FRAMES <= len(req.frames) <= MAX_FRAMES:
        raise HTTPException(422, f"send between {MIN_FRAMES} and {MAX_FRAMES} frames")

    start = time.perf_counter()
    try:
        predictions = state["recognizer"].predict(req.frames, top_k=req.top_k)
    except ValueError as err:
        raise HTTPException(422, str(err))

    state["requests"] += 1
    return {
        "predictions": predictions,
        "num_frames": len(req.frames),
        "latency_ms": round((time.perf_counter() - start) * 1000, 1),
    }
