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
      → Sign Recognition Adapter (Heuristic ISL & Modular AI Slot) 
        → Natural Language Captions (Readable Text, Hindi, ISL Gloss & Speech TTS)
```

### Essential Technical Distinction (Ethical AI Principle)
* **Computer Vision Landmark Tracking** tracks anatomical hand joints in real time directly on your device.
* **Landmark tracking is NOT sign translation**. Sign language involves complex spatio-temporal trajectories, syntax, and non-manual expressions.
* For static poses, Learnable includes a **Live Heuristic Classifier** (Alpha). For complex continuous sentences, it provides a **Presenter Demo Suite** (Simulated) and an extensible **Model Adapter Interface** for attaching a trained deep learning model.

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
│       ├── signClassifierAdapter.js # Modular recognition adapter & heuristics
│       ├── demoData.js         # Predefined ISL sample phrases & domains
│       ├── transcriptManager.js # Transcript formatting, copy & .txt download
│       └── speechSynthesizer.js # Web Speech API text-to-speech audio engine
```

---

## 5. Installation and Setup

### Prerequisites
- Node.js (version 18+ or 20+ LTS recommended)
- Modern web browser (Chrome, Edge, Firefox, or Safari) with webcam support

### Running Locally

1. **Navigate to the project directory**:
   ```bash
   cd signspeak
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

## 6. How to Connect a Real Sign-Recognition Deep Learning Model

The codebase is built with a decoupled architecture specifically to enable dropping in a trained neural network without refactoring the UI.

### Step-by-Step Integration Guide:

1. **Locate the Adapter Interface**:
   Open `src/utils/signClassifierAdapter.js`.

2. **Prepare Input Tensor Shape**:
   The `detectForVideo` method generates 21 3D coordinates per frame `(x, y, z)`. A standard continuous sign classifier expects a temporal sliding window:
   - Input shape: `[BatchSize = 1, TimeSteps = 30, Landmarks = 21, Coordinates = 3]`

3. **Load Model Weights (TensorFlow.js / ONNX Runtime Web)**:
   ```javascript
   import * as tf from '@tensorflow/tfjs';
   // Or: import * as ort from 'onnxruntime-web';

   export class TrainedISLModelAdapter {
     constructor() {
       this.model = null;
     }

     async loadModel() {
       this.model = await tf.loadLayersModel('/models/isl_transformer/model.json');
     }

     async predict(slidingWindowBuffer) {
       const inputTensor = tf.tensor4d([slidingWindowBuffer]);
       const prediction = this.model.predict(inputTensor);
       const probabilities = await prediction.data();
       const topIndex = prediction.argMax(-1).dataSync()[0];
       
       return {
         hasMatch: true,
         text: VOCABULARY_MAP[topIndex],
         confidence: probabilities[topIndex],
         source: 'deep-model',
         sourceLabel: 'Trained ISL Transformer',
       };
     }
   }
   ```

4. **Connect in `App.jsx`**:
   Replace the `HeuristicISLClassifier.evaluateHand()` call in the detection loop with your model instance.

---

## 7. Limitations & Ethical Notice

* **Assistive Prototype**: Learnable is designed as an assistive tool for casual daily interactions. It does not replace certified professional sign language interpreters in critical legal, financial, or diagnostic medical settings.
* **Accuracy Metrics**: As specified by responsible AI practices, unmeasured metrics are labeled as "Not yet measured" rather than presenting fabricated accuracy percentages.
* **Continuous Grammar**: Indian Sign Language has its own distinct grammatical structure (OSV — Object Subject Verb). Full natural language translation requires rich multi-modal corpus collection currently planned for Phase 2.

---

## 8. License

Created for the InnoTech Hackathon. Distributed under the MIT License.
