"""
Sentence building for Learnable with the free Groq API.

Sign recognition gives one word per sign, in signing order ("I", "Doctor",
"Tomorrow"). This module asks a Groq-hosted LLM to turn those words into one
natural English sentence plus a Hindi translation. Only the words (text) are sent
to Groq; video and landmarks never leave the computer.

Configuration (environment variables, or server/.env):
    GROQ_API_KEY   your key from https://console.groq.com/keys (required)
    GROQ_MODEL     default openai/gpt-oss-120b (free-plan models: see https://console.groq.com/docs/models)
    GROQ_BASE_URL  default https://api.groq.com/openai/v1 (any OpenAI-compatible API works)
"""

import json
import os
import re
import urllib.error
import urllib.request
from pathlib import Path

ENV_FILE = Path(__file__).with_name(".env")
DEFAULT_MODEL = "openai/gpt-oss-120b"
DEFAULT_BASE_URL = "https://api.groq.com/openai/v1"
TIMEOUT_SECONDS = 20

SYSTEM_PROMPT = (
    "You help deaf and hard-of-hearing people communicate. You receive Indian Sign Language "
    "signs as English words, in the order they were signed. ISL often uses topic-comment or "
    "subject-object-verb order and leaves out articles, tense words and 'to be'. "
    "Turn the words into ONE short, natural English sentence with the most likely everyday meaning, "
    "without adding new facts, then translate that sentence into simple Hindi (Devanagari script). "
    'Reply only with JSON: {"english": "...", "hindi": "..."}'
)


class SentenceError(Exception):
    pass


def load_env_file(path=ENV_FILE):
    """Read KEY=VALUE lines from server/.env into the environment (real env vars win)."""
    if not path.exists():
        return
    for line in path.read_text(encoding="utf-8").splitlines():
        line = line.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue
        key, value = line.split("=", 1)
        os.environ.setdefault(key.strip(), value.strip().strip('"').strip("'"))


def config():
    return {
        "api_key": os.environ.get("GROQ_API_KEY", ""),
        "model": os.environ.get("GROQ_MODEL") or DEFAULT_MODEL,
        "base_url": (os.environ.get("GROQ_BASE_URL") or DEFAULT_BASE_URL).rstrip("/"),
    }


def is_configured():
    return bool(config()["api_key"])


def _chat(cfg, body):
    request = urllib.request.Request(
        f"{cfg['base_url']}/chat/completions",
        data=json.dumps(body).encode("utf-8"),
        headers={
            "Authorization": f"Bearer {cfg['api_key']}",
            "Content-Type": "application/json",
            # Python's default User-Agent is blocked by some API gateways
            "User-Agent": "learnable-isl-server/1.0",
        },
    )
    with urllib.request.urlopen(request, timeout=TIMEOUT_SECONDS) as response:
        return json.load(response)


def _parse(content):
    match = re.search(r"\{.*\}", content or "", re.DOTALL)
    if not match:
        raise SentenceError("The language model did not return a sentence.")
    data = json.loads(match.group(0))
    english = str(data.get("english", "")).strip()
    if not english:
        raise SentenceError("The language model did not return a sentence.")
    return english, str(data.get("hindi", "")).strip()


def build_sentence(words):
    """Turn signed words into {"english", "hindi", "model"} using the configured LLM."""
    cfg = config()
    if not cfg["api_key"]:
        raise SentenceError("Sentence building is off: add GROQ_API_KEY to server/.env and restart the server.")

    body = {
        "model": cfg["model"],
        "messages": [
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user", "content": "Signed words: " + ", ".join(words)},
        ],
        "temperature": 0.2,
        "max_tokens": 1024,  # reasoning models spend part of this thinking
        "response_format": {"type": "json_object"},
    }
    if cfg["model"].startswith("openai/gpt-oss"):
        body["reasoning_effort"] = "low"  # keeps answers under ~1 s
    try:
        try:
            reply = _chat(cfg, body)
        except urllib.error.HTTPError as err:
            if err.code != 400:
                raise
            body.pop("response_format")  # model without JSON mode: rely on the prompt
            reply = _chat(cfg, body)
    except urllib.error.HTTPError as err:
        detail = {
            400: "check GROQ_MODEL in server/.env",
            401: "the Groq API key was rejected",
            404: "check GROQ_MODEL in server/.env",
            429: "the free Groq limit was reached, try again shortly",
        }
        raise SentenceError(f"Groq request failed: {detail.get(err.code, f'HTTP {err.code}')}.") from err
    except (urllib.error.URLError, TimeoutError) as err:
        raise SentenceError("Could not reach Groq. Check your internet connection.") from err

    try:
        english, hindi = _parse(reply["choices"][0]["message"]["content"])
    except (KeyError, IndexError, ValueError) as err:
        raise SentenceError("The language model returned an unexpected answer.") from err
    return {"english": english, "hindi": hindi, "model": cfg["model"]}
