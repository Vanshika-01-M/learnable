# Learnable — Complete Setup Guide

This guide takes you from a new computer to signing in front of your webcam. Learnable has two parts:

| Part | What it does | Needed for |
| --- | --- | --- |
| **Web app** (React + Vite) | Camera, hand and body tracking, captions, speech | Everything |
| **Model server** (Python + PyTorch) | Runs the pretrained ISL model (263 words) and stores your own recorded signs | **ISL Model + My Signs** mode |

Without the model server, the app still works in **On-Device Gestures** mode (about 13 simple hand shapes). Both parts run on your own computer.

---

## 1. Install the prerequisites

| Tool | Version | Download |
| --- | --- | --- |
| Git | any recent | https://git-scm.com/downloads |
| Node.js | **20.19+ or 22.12+** (22 LTS recommended) | https://nodejs.org |
| Python | **3.10 – 3.13** (for the model server) | https://www.python.org/downloads |
| Browser | Chrome or Edge recommended | |
| Webcam | built-in or USB | |

- **Windows:** in the Python installer, tick **"Add python.exe to PATH"**.
- **macOS / Linux:** use `python3` wherever this guide says `python`.

You also need an internet connection. The browser downloads the MediaPipe tracking models, and the model server downloads the ISL model (~40 MB) the first time it starts.

Check what you have:

```bash
git --version
```

```bash
node --version
```

```bash
python --version
```

---

## 2. Get the code

```bash
git clone https://github.com/Vanshika-01-M/learnable.git
```

```bash
cd learnable
```

All the commands below are run inside this `learnable` folder.

---

## 3. Run the web app

Install the JavaScript packages (first time only):

```bash
npm install
```

Start the app:

```bash
npm run dev
```

Open **http://localhost:5173** in Chrome or Edge, click **Start Camera** and allow camera access. The app now works in **On-Device Gestures** mode. Leave this terminal open while you use the app.

---

## 4. Run the model server

Open a **second terminal** in the `learnable` folder.

**First time only:** create a Python virtual environment and install the server packages. This downloads PyTorch, which takes a few minutes.

On **Windows**:

```bash
python -m venv .venv
```

```bash
.venv\Scripts\python -m pip install -r server/requirements.txt
```

On **macOS / Linux**:

```bash
python3 -m venv .venv
```

```bash
.venv/bin/python -m pip install -r server/requirements.txt
```

> **Linux without an NVIDIA GPU:** run this before the line above, so you get the small CPU-only PyTorch (~200 MB) instead of the CUDA build (several GB):
>
> ```bash
> .venv/bin/python -m pip install torch --index-url https://download.pytorch.org/whl/cpu
> ```

**Every time:** start the server.

On **Windows**:

```bash
.venv\Scripts\python -m uvicorn server.app:app --port 8000
```

On **macOS / Linux**:

```bash
.venv/bin/python -m uvicorn server.app:app --port 8000
```

When it is ready you will see:

```
Model ready: OpenHands SL-GCN (INCLUDE, 263 ISL words) on cpu
Your signs: 0 words from 0 samples in ...\server\user_data\custom_signs
Uvicorn running on http://127.0.0.1:8000
```

The first start downloads the model (~40 MB) into `~/.cache/learnable`. To store it somewhere else, set the `LEARNABLE_MODEL_DIR` environment variable. Leave this terminal open; press **Ctrl+C** to stop the server.

---

## 5. Connect the app to the model

1. In the app, click the **settings icon** in the top bar.
2. Under **Sign Recognition Engine**, choose **ISL Model + My Signs**.
3. The server URL is already `http://localhost:8000`. Click **Test**; it should say **Connected: OpenHands SL-GCN (INCLUDE, 263 ISL words)**.
4. Click **Apply & Close**. The app remembers these settings in this browser.

---

## 6. Sign

1. Click **Start Camera**.
2. Sit back so your **head, shoulders and hands** are in view.
3. Start with your hands **down, out of the frame**.
4. Sign **one word** (for example Hello, Thank you, Mother, Doctor, Good morning), then lower your hands.
5. About a second later the word appears in the caption panel. The camera panel shows the status: *Recording sign… → Recognizing sign… → Recognized "…"*.

The full list of 263 words, by category, is in [`server/include_labels.json`](server/include_labels.json).

---

## 7. Add your own signs (My Signs)

The built-in model was trained on a small group of signers, so it may not recognize *your* signing well, and it doesn't know every word. Teach it your own:

1. With the camera running, scroll to the **My Signs** panel (below the camera and captions).
2. Type a word, for example *Water*, and optionally its Hindi (*पानी*).
3. Click **Record 5 samples**. Sign the word 5 times: hands down, sign, hands down again. The panel counts the saved samples.
4. Sign the word again: the caption shows it with the label **My Signs (recorded by you)**.

Tips:

- Record **at least 2 words**, 5 samples each. Recording the same words from 2–3 different people makes them work for everyone.
- Re-record built-in words (like *Hello*) to make them match the way you sign them.
- Tick **Only recognize my signs** to ignore the 263 built-in words.
- Your samples are saved as landmark files (no video) in `server/user_data/custom_signs/` on the computer running the server. Copy that folder to back them up or to give your signs to a teammate.

---

## 8. Optional: translate into sentences with Groq (free)

Recognition gives one word per sign. The **Sentence Builder** (below the captions) collects those words, and **when you stop signing for 2 seconds** it automatically translates them into a natural English sentence plus a Hindi translation, and speaks it. For example *I · Doctor · Tomorrow* → "I will see a doctor tomorrow." / "मैं कल डॉक्टर के पास जाऊँगा।" Untick **Auto-translate when I pause** to translate only when you click **Translate now**.

It uses the free [Groq](https://console.groq.com) API. Only the recognized words (text) are sent to Groq, never video or landmarks. Sign recognition itself keeps working without it.

1. Sign up at **https://console.groq.com** (free, no credit card) and open **API Keys → Create API Key**. Copy the key (it starts with `gsk_`).
2. In the `server` folder, copy `.env.example` to a new file named **`.env`**:

   On **Windows**:

   ```bash
   copy server\.env.example server\.env
   ```

   On **macOS / Linux**:

   ```bash
   cp server/.env.example server/.env
   ```

3. Open `server/.env` in a text editor and paste your key after `GROQ_API_KEY=`, with no spaces or quotes:

   ```
   GROQ_API_KEY=gsk_your_key_here
   ```

   `server/.env` is listed in `.gitignore`, so the key never goes to GitHub. Don't paste it anywhere else.
4. Restart the model server (Ctrl+C, then start it again as in step 4). It should print:

   ```
   Sentence building: on (Groq model openai/gpt-oss-120b)
   ```

5. In the app, sign a few words, lowering your hands between them; they appear as chips in the **Sentence Builder**. Keep the pause between words short (under 2 seconds). When you stop, the sentence appears in the captions by itself. Use **Undo** right away to remove a wrongly recognized word.

The free plan allows about 1,000 sentences a day; each takes about 1 second. To try another model, set `GROQ_MODEL` in `server/.env` (for example `openai/gpt-oss-20b`) and restart the server. Free accounts don't get every model listed on Groq's website; if you see "check GROQ_MODEL", the account can't use that model.

---

## Everyday start (after the first setup)

Terminal 1, the web app:

```bash
npm run dev
```

Terminal 2, the model server. On **Windows**:

```bash
.venv\Scripts\python -m uvicorn server.app:app --port 8000
```

On **macOS / Linux**:

```bash
.venv/bin/python -m uvicorn server.app:app --port 8000
```

Then open http://localhost:5173.

---

## Troubleshooting

| Problem | Fix |
| --- | --- |
| `npm run dev` fails with an engine or syntax error | Node.js is too old. Install Node 22 LTS from nodejs.org and run `npm install` again. |
| `python` is not recognized (Windows) | Reinstall Python with **"Add python.exe to PATH"** ticked, or use `py` instead of `python`. |
| `pip` cannot find a matching version of `torch` | Your Python version isn't supported by PyTorch. Use Python 3.10 – 3.13. |
| The camera doesn't start | Allow camera permission in the browser's address bar, and close other apps that use the camera (Zoom, Teams…). The camera only works on `http://localhost` or an `https://` address, not on `http://<your-ip>`. |
| **Test** says "Not reachable" | The model server isn't running or the URL is wrong. Start it (step 4) and check the URL is `http://localhost:8000`. |
| A recorded word is confused with another | Record 5 more samples of both words, and make the signs clearly different. Check the panel shows at least 5 samples for each word. |
| An unrecorded sign shows up as one of your words | It looks similar to that recorded sign. Record the other word too, so the two can be told apart. |
| "Sentence building is off" | `server/.env` is missing or has no key. Do step 8, then restart the server. |
| "the Groq API key was rejected" | The key in `server/.env` is wrong or was deleted. Create a new key at console.groq.com and paste it again. |
| "the free Groq limit was reached" | Wait a minute and try again; the free plan limits requests per minute and per day. |
| A hand is detected but no word appears | Keep your shoulders in view, lower your hands fully out of the frame after each sign, and sign at a natural speed. |
| The status says "Not sure (maybe …)" | The model was below 35% confident. Repeat the sign more clearly, or it may be a word outside the 263-word vocabulary. |
| Port 5173 or 8000 is already in use | Use another port: `npm run dev -- --port 5174`, or `--port 8001` for the server (then use `http://localhost:8001` in Settings). |
| On a phone or another computer | `localhost` only works on the computer running the server. Run both parts on the computer you sign at. (The optional `kaggle/` notebook can host the server online, but recorded signs are not kept between Kaggle sessions.) |
