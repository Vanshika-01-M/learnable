"""
Run the Learnable ISL model server on Kaggle (or any Linux machine) and expose it
through a free Cloudflare quick tunnel, so the web app can reach it over HTTPS.

    from server.kaggle_runner import start
    url = start()
"""

import os
import queue
import re
import subprocess
import threading
import time
import urllib.request
from pathlib import Path

CLOUDFLARED_URL = (
    "https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64"
)
TUNNEL_URL_RE = re.compile(r"https://[a-z0-9-]+\.trycloudflare\.com")
CACHE_DIR = Path(os.environ.get("LEARNABLE_MODEL_DIR", Path.home() / ".cache" / "learnable"))


def start_server(port=8000, timeout=300):
    """Start uvicorn in a background thread and wait until the model is loaded."""
    import uvicorn

    from .app import app

    server = uvicorn.Server(uvicorn.Config(app, host="0.0.0.0", port=port, log_level="warning"))
    thread = threading.Thread(target=server.run, daemon=True)
    thread.start()

    deadline = time.time() + timeout
    while not server.started:
        if not thread.is_alive():
            raise RuntimeError("Model server failed to start; see the error above.")
        if time.time() > deadline:
            raise TimeoutError("Model server did not start in time.")
        time.sleep(0.5)
    return server


def find_tunnel_url(line):
    match = TUNNEL_URL_RE.search(line)
    return match.group(0) if match else None


def start_tunnel(port=8000, timeout=60):
    """Open a Cloudflare quick tunnel to localhost:port; returns (public_url, process)."""
    binary = CACHE_DIR / "cloudflared"
    if not binary.exists():
        CACHE_DIR.mkdir(parents=True, exist_ok=True)
        print("Downloading cloudflared ...")
        urllib.request.urlretrieve(CLOUDFLARED_URL, binary)
        binary.chmod(0o755)

    proc = subprocess.Popen(
        [str(binary), "tunnel", "--no-autoupdate", "--url", f"http://localhost:{port}"],
        stdout=subprocess.PIPE,
        stderr=subprocess.STDOUT,
        text=True,
    )

    # Keep draining cloudflared's output so its pipe never fills up.
    lines = queue.Queue()
    threading.Thread(target=lambda: [lines.put(l) for l in proc.stdout], daemon=True).start()

    deadline = time.time() + timeout
    while time.time() < deadline:
        try:
            url = find_tunnel_url(lines.get(timeout=1))
        except queue.Empty:
            if proc.poll() is not None:
                break
            continue
        if url:
            return url, proc

    proc.kill()
    raise RuntimeError("Could not open a Cloudflare tunnel. Is Internet enabled for this notebook?")


def start(port=8000):
    start_server(port)
    url, _ = start_tunnel(port)
    print("=" * 64)
    print(" Learnable ISL model server is live.")
    print(" Paste this URL into Learnable -> Settings -> Kaggle Model Server:")
    print(f"   {url}")
    print(" (It can take ~10 seconds before the new URL starts resolving.)")
    print("=" * 64)
    return url
