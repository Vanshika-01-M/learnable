# Learnable — Real-Time Sign Language to Text

> **“Sign it. See it.”**
> An accessibility-focused web application prototype designed to translate sign language into readable text and audible speech using a standard webcam, without requiring special gloves or custom hardware.

Developed for the **InnoTech Hackathon Showcase**, prioritizing **Indian Sign Language (ISL)** with configurable vocabulary domains.

---

## 1. Project Overview & Architecture

Learnable bridges communication barriers for deaf and hard-of-hearing individuals in hospitals, banks, public service counters, and classrooms.

### The Core Processing Pipeline:

```
Camera Input (Webcam) 
  → 21 3D Landmark Detection (MediaPipe WebAssembly) 
    → Spatial & Feature Extraction (Bone Angles & Velocity) 
      → Sign Recognition Adapter (Heuristic ISL, or Pretrained ISL Model on a Kaggle server)
        → Natural Language Captions (Readable Text, Hindi, ISL Gloss & Speech TTS)
```

### Essential Technical Distinction (Ethical AI Principle)
* **Computer Vision Landmark Tracking** tracks anatomical hand joints in real time directly on your device.
* **Landmark tracking is NOT sign translation**. Sign language involves complex spatio-temporal trajectories, syntax, and non-manual expressions.
* For static poses, Learnable includes a **Live Heuristic Classifier** (Alpha). For isolated ISL words, it can use a **Pretrained ISL Model** (OpenHands SL-GCN, 263 words) hosted on Kaggle. For complex continuous sentences, it provides a **Presenter Demo Suite** (Simulated).

---

## 2. Key Features

- **Standard Webcam Support**: Operates directly in modern web browsers via `navigator.mediaDevices.getUserMedia`.
- **100% On-Device Privacy**: Video frames are processed locally in memory using WebAssembly/WebGL. Zero video footage or biometric templates are stored or transmitted to cloud servers.
- **21 3D Hand Landmark Tracking**: Powered by Google MediaPipe Tasks Vision with glowing skeleton overlay, joint prominence, and multi-hand detection.
- **Sign Library & Custom Sign Creator**: Built-in interactive Sign Dictionary with 40+ Indian Sign Language signs across 8 domains (Alphabet, Numbers, Greetings, Healthcare, Banking, Daily Living, Education, Emergency), plus a 1-click form to create and save custom signs into localStorage.
- **Expanded Live Webcam Recognizer (14+ Real-Time Gestures)**: Detects static ISL shapes and dynamic wave motions in real time:
  - 👋 **Goodbye / Bye!**: Dynamic lateral waving hand motion with open palm
  - ✋ **Hello / Welcome**: Open palm held facing camera
  - 👍 **Good / Thank you**: Upward thumb with curled fingers
  - 👎 **No / Disagree**: Downward thumb gesture
  - 👌 **OK / All Good**: Thumb and index circle with 3 upright fingers
  - 🤟 **I Love You / Respect**: Thumb, index, and pinky extended
  - 🤙 **Call Me / Phone**: Thumb and pinky extended
  - ✌️ **Two / Help / Assistance**: Index and middle in V-formation
  - ☝️ **One / You**: Directional index pointer
  - ✊ **Yes / Understood**: Closed fist affirmative
  - 🤘 **Rock On / Awesome**: Index and pinky extended
  - 3️⃣ **Number 3** & 4️⃣ **Number 4** numerical signs
- **Pretrained ISL Word Recognition (Kaggle)**: Switch Settings → *Sign Recognition Engine* to **Pretrained ISL Model** to recognize 263 Indian Sign Language words with the AI4Bharat OpenHands SL-GCN model, served from a free Kaggle notebook (see [Section 6](#6-pretrained-isl-model-on-kaggle)).
- **Interactive Live Gesture Cheat Sheet**: Collapsible on-screen visual guide showing all supported camera postures so users know exactly what to sign.
- **Large Accessible Captions**: High-visibility typography with adjustable font scaling (`Normal`, `Large`, `Extra Large`), Hindi translation, and ISL grammatical glosses.
- **Text-to-Speech (TTS)**: Built-in voice playback via the browser Web Speech API for audible two-way communication.
- **Presenter Demo Suite**: Pre-configured domain scenarios with guided auto-play for demonstration even when a camera is unavailable.
- **Transcript Management**: Real-time session history, one-click clipboard copy, and formatted `.txt` transcript file export.
- **WCAG 2.1 AA Accessibility**: Ultra-high contrast mode (black/yellow stark palette for low vision), keyboard navigation, and visible focus rings.

---

## 3. Technology Stack

- **Framework**: React 19 + Vite 6
- **Styling**: Tailwind CSS 3.4 (Dark navy, soft violet, and cyan palette)
- **Icons**: Lucide React
- **Computer Vision**: Google MediaPipe Tasks Vision (`@mediapipe/tasks-vision`)
- **Webcam API**: Browser MediaDevices API
- **Audio Output**: Web Speech API (`SpeechSynthesis`)
- **State Management**: Modular React hooks & local session state

---

## 4. Project Structure

```
learnable/
├── index.html                  # HTML entry point with fonts & metadata
├── vite.config.js              # Vite configuration
├── tailwind.config.js          # Custom theme: Navy, Violet, Cyan palette
├── postcss.config.js           # PostCSS Tailwind plugins
├── package.json                # Dependencies and npm run scripts
├── src/
│   ├── main.jsx                # React root mount
│   ├── index.css               # Base Tailwind, high-contrast & glass styles
│   ├── App.jsx                 # Central application orchestrator & detection loop
│   ├── components/
│   │   ├── Navbar.jsx          # Header with Learnable logo, links, contrast & demo
│   │   ├── HeroSection.jsx     # InnoTech showcase header with quick pills
│   │   ├── CameraPanel.jsx     # Left workspace panel: video, overlay & controls
│   │   ├── CaptionPanel.jsx    # Right workspace panel: text, TTS & export
│   │   ├── TranslationControls.jsx # Language, domain, font-size & reset
│   │   ├── DemoPresenterModal.jsx  # InnoTech presenter modal & auto-demo
│   │   ├── SignLibraryModal.jsx    # Interactive 40+ sign library & custom creator
│   │   ├── HowItWorks.jsx      # 6-step visual architecture breakdown
│   │   ├── UseCases.jsx        # Healthcare, banking, classroom scenarios
│   │   ├── PrivacySection.jsx  # Zero-cloud privacy, consent & ethics
│   │   ├── Roadmap.jsx         # Development milestones & honest metrics
│   │   ├── HistoryDrawer.jsx   # Slide-out session transcript log
│   │   ├── SettingsModal.jsx   # Camera device, resolution, and theme settings
│   │   └── Footer.jsx          # Accessible footer with hackathon credits
│   └── utils/
│       ├── webcamManager.js    # Camera acquisition, permissions, and lifecycle
│       ├── handLandmarkDetector.js # MediaPipe 21-joint extraction & canvas drawing
│       ├── poseLandmarkDetector.js # MediaPipe 33-point body pose (for the pretrained model)
│       ├── signClassifierAdapter.js # Heuristics + Kaggle ISL model client & sign segmentation
│       ├── demoData.js         # Predefined ISL sample phrases & domains
│       ├── transcriptManager.js # Transcript formatting, copy & .txt download
│       └── speechSynthesizer.js # Web Speech API text-to-speech audio engine
├── server/                     # Python model server (FastAPI + PyTorch)
│   ├── app.py                  # /health, /labels, /predict endpoints
│   ├── isl_model.py            # Checkpoint download, preprocessing & inference
│   ├── slgcn.py                # SL-GCN network (adapted from AI4Bharat OpenHands)
│   ├── include_labels.json     # The 263 INCLUDE words, in model output order
│   └── kaggle_runner.py        # Starts the API + a Cloudflare tunnel on Kaggle
└── kaggle/
    └── learnable_isl_server.ipynb # Run this notebook on Kaggle to host the model
```

---

## 5. Installation and Setup

### Prerequisites
- Node.js (version 18+ or 20+ LTS recommended)
- Modern web browser (Chrome, Edge, Firefox, or Safari) with webcam support

### Running Locally

1. **Navigate to the project directory**:
   ```bash
   cd learnable
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npm run dev
   ```

4. **Open in browser**:
   Visit `http://localhost:5173` to test the application.

---

## 6. Pretrained ISL Model on Kaggle

Learnable can recognize **263 isolated Indian Sign Language words** (greetings, people, places, colours, days, jobs and more) with the pretrained **SL-GCN** model from [AI4Bharat OpenHands](https://github.com/AI4Bharat/OpenHands), trained on the [INCLUDE](https://zenodo.org/records/4010759) dataset. The model runs in a free Kaggle notebook, and the web app talks to it over HTTPS.

```
Browser: webcam → MediaPipe hands (21 pts × 2) + body pose (33 pts) → 75 [x, y] points per frame
         → sign segmentation (hands up → sign → hands down) → POST /predict
Kaggle:  FastAPI → OpenHands SL-GCN (PyTorch) → top-5 words → caption in the app
```

Only landmark coordinates are sent to the server. Camera video never leaves the browser.

### Start the server on Kaggle

1. On [kaggle.com](https://www.kaggle.com), choose **Create → New Notebook → File → Import Notebook** and upload [`kaggle/learnable_isl_server.ipynb`](kaggle/learnable_isl_server.ipynb).
2. In the notebook's right-hand panel (*Session options*), turn **Internet on**. This needs a phone-verified Kaggle account. **Accelerator: None** is enough (about 30 ms per sign on CPU).
3. If this code isn't merged into `main` yet, set `BRANCH` in the first cell to the branch that contains the `server/` folder.
4. Click **Run All**. The third code cell downloads the checkpoint (~40 MB, SHA-256 verified), starts the API, and prints a URL like `https://something.trycloudflare.com`.
5. In Learnable, open **Settings → Sign Recognition Engine → Pretrained ISL Model**, paste the URL, and click **Test**.

Keep the notebook running while you use the app. The URL changes every time the notebook restarts, and Kaggle may stop idle sessions, so if the app says the server is unreachable, re-run the notebook and paste the new URL.

### Signing with the model

- Keep your head, shoulders and hands in view; the model uses body pose as well as hands.
- Start with your hands down (out of frame), sign **one word**, then lower your hands. The sign is sent about 0.7 s after your hands leave the frame.
- The camera panel shows the model status (*Recording sign… / Recognizing… / Recognized "Doctor"*). Results below 35% confidence are reported as "Not sure" instead of becoming a caption.

### Run the server on your own machine

```bash
pip install -r server/requirements.txt
```

```bash
python -m uvicorn server.app:app --port 8000
```

Then use `http://localhost:8000` as the server URL. API:

| Endpoint | Description |
| --- | --- |
| `GET /health` | Model name, device, number of classes |
| `GET /labels` | The 263 words with their INCLUDE category |
| `POST /predict` | Body `{"frames": [[[x, y] × 75] × T], "top_k": 5}` → top-k words with confidence |

Frame layout follows OpenHands' MediaPipe Holistic order: points 0–32 body pose, 33–53 signer's left hand, 54–74 signer's right hand (zeros when a hand is not visible), all in normalized image coordinates.

### Credits

- Model and checkpoint: [AI4Bharat OpenHands](https://github.com/AI4Bharat/OpenHands) (Apache-2.0). `server/slgcn.py` is adapted from its SL-GCN implementation.
- Training data: [INCLUDE](https://zenodo.org/records/4010759) by AI4Bharat (CC BY 4.0).

---

## 7. Limitations & Ethical Notice

* **Assistive Prototype**: Learnable is designed as an assistive tool for casual daily interactions. It does not replace certified professional sign language interpreters in critical legal, financial, or diagnostic medical settings.
* **Accuracy Metrics**: As specified by responsible AI practices, unmeasured metrics are labeled as "Not yet measured" rather than presenting fabricated accuracy percentages.
* **Pretrained Model Scope**: The Kaggle model recognizes one isolated word at a time from the 263-word INCLUDE vocabulary, which was recorded from a small group of signers standing in front of a camera. Its confidence is the model's probability, not a measured real-world accuracy. Expect lower accuracy with other signers, lighting, or camera framing. When it is enabled, body and hand landmark coordinates (not video) are sent to the Kaggle server you run.
* **Continuous Grammar**: Indian Sign Language has its own distinct grammatical structure (OSV — Object Subject Verb). Full natural language translation requires rich multi-modal corpus collection currently planned for Phase 2.

---

## 8. License

Created for the InnoTech Hackathon. Distributed under the MIT License.
