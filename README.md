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
      → Sign Recognition Adapter (Heuristic ISL, or ISL Model + My Signs on a local server)
        → Natural Language Captions (Readable Text, Hindi, ISL Gloss & Speech TTS)
```

### Essential Technical Distinction (Ethical AI Principle)
* **Computer Vision Landmark Tracking** tracks anatomical hand joints in real time directly on your device.
* **Landmark tracking is NOT sign translation**. Sign language involves complex spatio-temporal trajectories, syntax, and non-manual expressions.
* For static poses, Learnable includes a **Live Heuristic Classifier** (Alpha). For isolated ISL words, it can use a **Pretrained ISL Model** (OpenHands SL-GCN, 263 words) plus words you record yourself (**My Signs**), on a local server. For complex continuous sentences, it provides a **Presenter Demo Suite** (Simulated).

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
- **Pretrained ISL Word Recognition + My Signs**: Switch Settings → *Sign Recognition Engine* to **ISL Model + My Signs** to recognize 263 Indian Sign Language words with the AI4Bharat OpenHands SL-GCN model, and add your own words by recording each one 5 times (see [Section 6](#6-isl-model--my-signs-local)).
- **Sentence Builder (Groq, optional)**: Recognized words collect as chips; one click turns them into a natural English sentence with a Hindi translation and speaks it, using the free Groq API (only words are sent, never video). See [SETUP.md](SETUP.md#8-optional-make-sentences-with-groq-free).
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
│   │   ├── MySignsPanel.jsx    # Record, list and delete your own signs
│   │   ├── SentenceBuilder.jsx # Recognized words → sentence + Hindi (Groq)
│   │   └── Footer.jsx          # Accessible footer with hackathon credits
│   └── utils/
│       ├── webcamManager.js    # Camera acquisition, permissions, and lifecycle
│       ├── handLandmarkDetector.js # MediaPipe 21-joint extraction & canvas drawing
│       ├── poseLandmarkDetector.js # MediaPipe 33-point body pose (for the pretrained model)
│       ├── signClassifierAdapter.js # Heuristics + ISL model client, sign segmentation & recording
│       ├── demoData.js         # Predefined ISL sample phrases & domains
│       ├── transcriptManager.js # Transcript formatting, copy & .txt download
│       └── speechSynthesizer.js # Web Speech API text-to-speech audio engine
├── server/                     # Python model server (FastAPI + PyTorch)
│   ├── app.py                  # /health, /labels, /predict, /custom-signs, /sentence endpoints
│   ├── isl_model.py            # Checkpoint download, preprocessing & inference
│   ├── custom_signs.py         # My Signs: stores recorded samples and matches them
│   ├── sentence.py             # Optional: words → sentence + Hindi via the Groq API
│   ├── .env.example            # Copy to server/.env and add GROQ_API_KEY (never committed)
│   ├── slgcn.py                # SL-GCN network (adapted from AI4Bharat OpenHands)
│   ├── include_labels.json     # The 263 INCLUDE words, in model output order
│   ├── kaggle_runner.py        # Optional: starts the API + a Cloudflare tunnel on Kaggle
│   └── user_data/              # Your recorded signs (not committed)
└── kaggle/
    └── learnable_isl_server.ipynb # Optional: host the model server on Kaggle
```

---

## 5. Installation and Setup

> **Setting up on a new computer?** Follow the step-by-step [SETUP.md](SETUP.md) guide (Windows, macOS and Linux). It covers the web app and the pretrained ISL model server.

### Prerequisites
- Node.js 20.19+ or 22.12+ (22 LTS recommended)
- Modern web browser (Chrome, Edge, Firefox, or Safari) with webcam support
- Python 3.10–3.13, only for the pretrained ISL model server

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

## 6. ISL Model & My Signs (local)

Learnable recognizes **263 isolated Indian Sign Language words** with the pretrained **SL-GCN** model from [AI4Bharat OpenHands](https://github.com/AI4Bharat/OpenHands), trained on the [INCLUDE](https://zenodo.org/records/4010759) dataset. With **My Signs** you can add your own words: record a sign 5 times and it is recognized right away, with no training step. Everything runs on your own computer.

```
Browser: webcam → MediaPipe hands (21 pts × 2) + body pose (33 pts) → 75 [x, y] points per frame
         → sign segmentation (hands up → sign → hands down) → POST /predict
Server:  SL-GCN fingerprint → closest of your recorded signs, else the 263 built-in words → caption
```

Only landmark coordinates are sent to the server. Camera video never leaves the browser.

### Start it

See [SETUP.md](SETUP.md) for a full install guide. In short, from the repo root:

```bash
python -m uvicorn server.app:app --port 8000
```

Then in Learnable open **Settings → Sign Recognition Engine → ISL Model + My Signs**. The server URL defaults to `http://localhost:8000`; click **Test** to check it.

### Signing

- Keep your head, shoulders and hands in view; the model uses body pose as well as hands.
- Start with your hands down (out of frame), sign **one word**, then lower your hands. The sign is sent about 0.7 s after your hands leave the frame.
- The camera panel shows the status (*Recording sign… / Recognizing… / Recognized "Doctor"*). Results below 35% confidence are reported as "Not sure" instead of becoming a caption.

### Add your own signs (My Signs)

The INCLUDE model was trained on a small group of signers, so it is much less accurate for new people, rooms and cameras. My Signs fixes this for the words you need:

1. Start the camera. The **My Signs** panel appears below the camera and captions.
2. Type a word (and optionally its Hindi), click **Record 5 samples**, and sign the word 5 times (hands down between signs).
3. Sign it again: it is recognized as your word. Record at least 2 words; samples from several people make a word work for everyone.
4. Re-recording a built-in word (for example *Hello*) makes it match the way you sign it.
5. Tick **Only recognize my signs** to limit recognition to your recorded words.

How it works: each sample becomes a 256-number SL-GCN fingerprint. A new sign is compared with your samples after centring on their average (which removes what they share: your body, camera and room). If it is close enough to one of your words, that word wins; otherwise the 263 built-in words are used.

Recorded signs are stored as JSON files (landmarks only) in `server/user_data/custom_signs/`, which is not committed to git. Back up or share that folder to keep or share your signs; set `LEARNABLE_DATA_DIR` to store them elsewhere.

### API

| Endpoint | Description |
| --- | --- |
| `GET /health` | Model name, device, number of classes and recorded words |
| `GET /labels` | The 263 built-in words with their INCLUDE category |
| `POST /predict` | Body `{"frames": [[[x, y] × 75] × T], "top_k": 5, "only_custom": false}` → top-k words, each with `source` `custom` or `include` |
| `GET /custom-signs` | Your recorded words with sample counts |
| `POST /custom-signs` | Body `{"label": "Water", "hindi": "पानी", "frames": …}` → saves one sample |
| `DELETE /custom-signs/{label}` | Deletes all samples of a word |
| `POST /sentence` | Body `{"words": ["I", "Doctor", "Tomorrow"]}` → `{"english", "hindi", "model"}` via Groq (needs `GROQ_API_KEY` in `server/.env`) |

Frame layout follows OpenHands' MediaPipe Holistic order: points 0–32 body pose, 33–53 signer's left hand, 54–74 signer's right hand (zeros when a hand is not visible), all in normalized image coordinates.

The `kaggle/` notebook can still host the server on Kaggle, but recorded signs are not kept between Kaggle sessions, so running locally is recommended.

### Credits

- Model and checkpoint: [AI4Bharat OpenHands](https://github.com/AI4Bharat/OpenHands) (Apache-2.0). `server/slgcn.py` is adapted from its SL-GCN implementation.
- Training data: [INCLUDE](https://zenodo.org/records/4010759) by AI4Bharat (CC BY 4.0).

---

## 7. Limitations & Ethical Notice

* **Assistive Prototype**: Learnable is designed as an assistive tool for casual daily interactions. It does not replace certified professional sign language interpreters in critical legal, financial, or diagnostic medical settings.
* **Accuracy Metrics**: As specified by responsible AI practices, unmeasured metrics are labeled as "Not yet measured" rather than presenting fabricated accuracy percentages.
* **Pretrained Model Scope**: The ISL model recognizes one isolated word at a time from the 263-word INCLUDE vocabulary, which was recorded from a small group of signers standing in front of a camera. Its confidence is the model's probability, not a measured real-world accuracy. Expect lower accuracy with other signers, lighting, or camera framing. My Signs closes much of this gap for the words you record. When it is enabled, body and hand landmark coordinates (not video) are sent to the model server you run.
* **Continuous Grammar**: Indian Sign Language has its own distinct grammatical structure (OSV — Object Subject Verb). Full natural language translation requires rich multi-modal corpus collection currently planned for Phase 2.

---

## 8. License

Created for the InnoTech Hackathon. Distributed under the MIT License.
