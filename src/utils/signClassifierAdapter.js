/**
 * Sign Classifier Adapter for Learnable.
 * 
 * Provides a modular, pluggable architecture separating raw computer-vision
 * landmark tracking from sign language translation.
 * 
 * Includes:
 * 1. An expanded geometric Heuristic Classifier supporting 14+ real-time gestures,
 *    including dynamic wave motion for "Goodbye / Bye!".
 * 2. Instructions on how to add custom geometric gesture rules.
 * 3. Simulated Demo Classifier connected to custom user vocabulary.
 * 4. ISL model client (OpenHands SL-GCN + your recorded signs) for the local model server.
 */

// Heuristic stability buffer to prevent jitter
let gestureStabilityCount = 0;
let lastDetectedCandidate = null;
const STABILITY_THRESHOLD = 8; // Must hold gesture steady for ~8 frames (~260ms)

// Rolling buffer for motion detection (e.g. waving goodbye)
const wristHistory = [];
const HISTORY_LENGTH = 16;

function updateWristHistory(wristPoint) {
  wristHistory.push({ x: wristPoint.x, y: wristPoint.y, time: Date.now() });
  if (wristHistory.length > HISTORY_LENGTH) {
    wristHistory.shift();
  }
}

function isWavingMotion() {
  if (wristHistory.length < 8) return false;
  let dirChanges = 0;
  let lastDir = 0;
  for (let i = 1; i < wristHistory.length; i++) {
    const dx = wristHistory[i].x - wristHistory[i - 1].x;
    if (Math.abs(dx) > 0.007) {
      const dir = dx > 0 ? 1 : -1;
      if (lastDir !== 0 && dir !== lastDir) {
        dirChanges++;
      }
      lastDir = dir;
    }
  }
  return dirChanges >= 2;
}

/**
 * Geometric helper functions for Hand Landmarks (21 points)
 */
export class GeometryUtils {
  static distance(p1, p2) {
    const dx = p1.x - p2.x;
    const dy = p1.y - p2.y;
    const dz = (p1.z || 0) - (p2.z || 0);
    return Math.sqrt(dx * dx + dy * dy + dz * dz);
  }

  // Returns true if finger is curled (fingertip closer to wrist than PIP knuckle)
  static isFingerCurled(landmarks, tipIdx, pipIdx, wristIdx = 0) {
    const tipDist = this.distance(landmarks[tipIdx], landmarks[wristIdx]);
    const pipDist = this.distance(landmarks[pipIdx], landmarks[wristIdx]);
    return tipDist < pipDist * 1.05;
  }

  // Returns true if finger is extended straight
  static isFingerExtended(landmarks, tipIdx, pipIdx, mcpIdx) {
    const tipToPip = this.distance(landmarks[tipIdx], landmarks[pipIdx]);
    const pipToMcp = this.distance(landmarks[pipIdx], landmarks[mcpIdx]);
    const tipToMcp = this.distance(landmarks[tipIdx], landmarks[mcpIdx]);
    return tipToMcp > (tipToPip + pipToMcp) * 0.78;
  }

  // Check if thumb is extended away from palm
  static isThumbExtended(landmarks) {
    const thumbTip = landmarks[4];
    const indexMcp = landmarks[5];
    const wrist = landmarks[0];
    const tipDist = this.distance(thumbTip, wrist);
    const mcpDist = this.distance(landmarks[2], wrist);
    return tipDist > mcpDist * 1.2 && this.distance(thumbTip, indexMcp) > 0.12;
  }
}

/**
 * 1. Expanded Heuristic Static & Dynamic ISL Classifier
 * Detects 14+ anatomical hand shapes and dynamic wave motions in real-time.
 */
export class HeuristicISLClassifier {
  static evaluateHand(landmarks) {
    if (!landmarks || landmarks.length < 21) {
      gestureStabilityCount = 0;
      lastDetectedCandidate = null;
      return null;
    }

    const wrist = landmarks[0];
    updateWristHistory(wrist);

    const thumbTip = landmarks[4];
    const indexTip = landmarks[8];
    const middleTip = landmarks[12];
    const ringTip = landmarks[16];
    const pinkyTip = landmarks[20];

    const indexExtended = GeometryUtils.isFingerExtended(landmarks, 8, 6, 5);
    const middleExtended = GeometryUtils.isFingerExtended(landmarks, 12, 10, 9);
    const ringExtended = GeometryUtils.isFingerExtended(landmarks, 16, 14, 13);
    const pinkyExtended = GeometryUtils.isFingerExtended(landmarks, 20, 18, 17);
    const thumbExtended = GeometryUtils.isThumbExtended(landmarks);

    const indexCurled = GeometryUtils.isFingerCurled(landmarks, 8, 6, 0);
    const middleCurled = GeometryUtils.isFingerCurled(landmarks, 12, 10, 0);
    const ringCurled = GeometryUtils.isFingerCurled(landmarks, 16, 14, 0);
    const pinkyCurled = GeometryUtils.isFingerCurled(landmarks, 20, 18, 0);

    // Distance between thumb tip and index tip (for OK sign / pinch)
    const thumbIndexDistance = GeometryUtils.distance(thumbTip, indexTip);

    let candidate = null;

    // --- RULE 1: Waving Hand / "Goodbye / Bye!" ---
    if (indexExtended && middleExtended && ringExtended && pinkyExtended && isWavingMotion()) {
      candidate = {
        text: 'Goodbye / See you soon! (Bye)',
        hindiText: 'अलविदा / फिर मिलेंगे!',
        islGloss: 'BYE / GOODBYE / SEE-YOU',
        confidence: 0.95,
        explanation: 'Lateral waving open palm gesture detected.',
      };
    }
    // --- RULE 2: "OK" Sign (Thumb & Index touch, Middle + Ring + Pinky up) ---
    else if (thumbIndexDistance < 0.08 && middleExtended && ringExtended && pinkyExtended) {
      candidate = {
        text: 'OK / All Good / Perfect',
        hindiText: 'सब ठीक है / बढ़िया',
        islGloss: 'OK / PERFECT / ALL-GOOD',
        confidence: 0.94,
        explanation: 'Thumb and index tip circular contact with 3 fingers extended.',
      };
    }
    // --- RULE 3: "I Love You" Sign (Thumb + Index + Pinky extended, Middle & Ring curled) ---
    else if (thumbExtended && indexExtended && pinkyExtended && middleCurled && ringCurled) {
      candidate = {
        text: 'I Love You / Respect',
        hindiText: 'सप्रेम / आदर',
        islGloss: 'LOVE / RESPECT',
        confidence: 0.96,
        explanation: 'Thumb, index, and pinky extended simultaneously (universal sign).',
      };
    }
    // --- RULE 4: "Call Me / Phone" (Thumb + Pinky extended, Index + Middle + Ring curled) ---
    else if (thumbExtended && pinkyExtended && indexCurled && middleCurled && ringCurled) {
      candidate = {
        text: 'Please call me / Phone',
        hindiText: 'कृपया मुझे फोन करें',
        islGloss: 'PHONE-CALL / CALL-ME',
        confidence: 0.93,
        explanation: 'Thumb and pinky extended mimicking telephone handset.',
      };
    }
    // --- RULE 5: "Rock On / Horns" (Index + Pinky extended, Thumb + Middle + Ring curled) ---
    else if (indexExtended && pinkyExtended && middleCurled && ringCurled && !thumbExtended) {
      candidate = {
        text: 'Rock on / Awesome!',
        hindiText: 'शानदार / बहुत खूब!',
        islGloss: 'AWESOME / ROCK-ON',
        confidence: 0.91,
        explanation: 'Index and pinky upright with middle knuckles locked.',
      };
    }
    // --- RULE 6: "Number 4" (4 fingers up, thumb folded) ---
    else if (indexExtended && middleExtended && ringExtended && pinkyExtended && !thumbExtended) {
      candidate = {
        text: 'Number 4 (Four)',
        hindiText: 'संख्या ४ (चार)',
        islGloss: 'NUMBER-FOUR',
        confidence: 0.92,
        explanation: 'Four fingers upright with thumb folded across palm.',
      };
    }
    // --- RULE 7: "Number 3" (Index + Middle + Ring up, Pinky curled) ---
    else if (indexExtended && middleExtended && ringExtended && pinkyCurled) {
      candidate = {
        text: 'Number 3 (Three)',
        hindiText: 'संख्या ३ (तीन)',
        islGloss: 'NUMBER-THREE',
        confidence: 0.90,
        explanation: 'Index, middle, and ring fingers extended.',
      };
    }
    // --- RULE 8: "Number 2 / Victory / Peace" (Index + Middle up, Ring + Pinky curled) ---
    else if (indexExtended && middleExtended && ringCurled && pinkyCurled) {
      candidate = {
        text: 'Assistance needed / Number 2',
        hindiText: 'सहायता चाहिए / संख्या २',
        islGloss: 'HELP-WANTED / TWO',
        confidence: 0.88,
        explanation: 'Dual-finger V-formation recognized via index and middle joint analysis.',
      };
    }
    // --- RULE 9: "Number 1 / Pointing" (Index extended, all others curled) ---
    else if (indexExtended && middleCurled && ringCurled && pinkyCurled && !thumbExtended) {
      candidate = {
        text: 'You / Pointing / Number 1',
        hindiText: 'आप / इधर देखें / संख्या १',
        islGloss: 'YOU / POINT / ONE',
        confidence: 0.89,
        explanation: 'Single index directional pointer identified.',
      };
    }
    // --- RULE 10: "Thumbs Up / Thank You" (Thumb up, 4 fingers curled) ---
    else if (indexCurled && middleCurled && ringCurled && pinkyCurled && thumbTip.y < landmarks[3].y) {
      candidate = {
        text: 'Thank you / Good',
        hindiText: 'धन्यवाद / अच्छा',
        islGloss: 'THANK-YOU / GOOD',
        confidence: 0.91,
        explanation: 'Upward thumb with curled fingers matching ISL affirmative.',
      };
    }
    // --- RULE 11: "Thumbs Down / Dislike" (Thumb pointing downward) ---
    else if (indexCurled && middleCurled && ringCurled && pinkyCurled && thumbTip.y > landmarks[3].y + 0.05) {
      candidate = {
        text: 'No / Disagree / Not good',
        hindiText: 'नहीं / असहमत',
        islGloss: 'DISAGREE / NOT-GOOD',
        confidence: 0.89,
        explanation: 'Downward thumb indicating disagreement.',
      };
    }
    // --- RULE 12: "Closed Fist / Yes" (All curled) ---
    else if (indexCurled && middleCurled && ringCurled && pinkyCurled) {
      candidate = {
        text: 'Yes / Understood',
        hindiText: 'हाँ / समझ गया',
        islGloss: 'YES / AFFIRMATIVE',
        confidence: 0.86,
        explanation: 'Closed fist handshape identified.',
      };
    }
    // --- RULE 13: "Open Palm / Hello" (All 5 extended, static) ---
    else if (indexExtended && middleExtended && ringExtended && pinkyExtended && thumbExtended) {
      candidate = {
        text: 'Hello, welcome to Learnable!',
        hindiText: 'नमस्ते, लर्नेबल में आपका स्वागत है!',
        islGloss: 'NAMASTE / WELCOME',
        confidence: 0.92,
        explanation: 'Open palm gesture recognized via 5-finger planar extension.',
      };
    }

    if (!candidate) {
      gestureStabilityCount = 0;
      lastDetectedCandidate = null;
      return null;
    }

    // Temporal stability filter: must hold pose steady
    if (lastDetectedCandidate && lastDetectedCandidate.text === candidate.text) {
      gestureStabilityCount++;
    } else {
      gestureStabilityCount = 1;
      lastDetectedCandidate = candidate;
    }

    if (gestureStabilityCount >= STABILITY_THRESHOLD) {
      return {
        hasMatch: true,
        text: candidate.text,
        hindiText: candidate.hindiText,
        islGloss: candidate.islGloss,
        confidence: candidate.confidence,
        source: 'live-heuristic',
        sourceLabel: 'Live Landmark Match',
        explanation: candidate.explanation,
      };
    }

    return null;
  }
}

/**
 * 2. Simulated Demo Classifier
 */
export class SimulatedDemoClassifier {
  static formatDemoResult(demoPhrase) {
    return {
      hasMatch: true,
      text: demoPhrase.text,
      hindiText: demoPhrase.hindiText,
      islGloss: demoPhrase.islGloss,
      confidence: demoPhrase.simulatedConfidence || 0.95,
      source: 'demo',
      sourceLabel: 'Demo Vocabulary Phrase',
      explanation: demoPhrase.gestureDescription || 'Demonstration phrase for presentation scenario.',
    };
  }
}

/**
 * 3. ISL Model (local model server)
 *
 * Streams body + hand landmarks (never video) to the Learnable model server (see /server)
 * running the AI4Bharat OpenHands SL-GCN model trained on the INCLUDE dataset
 * (263 isolated ISL words), plus any signs the user records in the My Signs panel.
 *
 * Each frame uses the OpenHands MediaPipe Holistic layout of 75 [x, y] points:
 *   0-32 body pose, 33-53 signer's left hand, 54-74 signer's right hand (zeros if not visible).
 */

const HOLISTIC_POINTS = 75;
const LEFT_HAND_OFFSET = 33;
const RIGHT_HAND_OFFSET = 54;
const POSE_LEFT_WRIST = 15;
const POSE_RIGHT_WRIST = 16;

// Sign segmentation, in frames resampled to the INCLUDE dataset's 25 FPS
const SAMPLE_INTERVAL_MS = 40;
const MAX_REPEAT_FRAMES = 5; // repeat a frame at most this often when the device runs slow (down to ~5 FPS)
const PRE_ROLL_FRAMES = 4; // rest frames kept before the hands come up
const START_FRAMES = 3; // hands visible this long -> sign started
const HISTORY_FRAMES = 50; // idle frames remembered to recover the sign's first hand sightings
const END_FRAMES = 18; // hands gone this long -> sign finished (tracking can drop ~0.5 s mid-sign)
const POST_ROLL_FRAMES = 4; // rest frames kept after the hands drop
const MIN_SIGN_FRAMES = 10; // ignore blips shorter than ~0.4 s
const MAX_SIGN_FRAMES = 125; // send anyway after ~5 s

const round4 = (v) => Math.round(v * 10000) / 10000;

/**
 * Builds one 75-point frame from PoseLandmarker + HandLandmarker results.
 * Hands are assigned to the signer's left/right by distance to the pose wrists, which
 * avoids MediaPipe's mirrored handedness labels.
 */
export function buildHolisticFrame(poseLandmarks, handLandmarks = [], handednesses = []) {
  const frame = Array.from({ length: HOLISTIC_POINTS }, () => [0, 0]);
  if (poseLandmarks) {
    poseLandmarks.slice(0, 33).forEach((p, i) => { frame[i] = [round4(p.x), round4(p.y)]; });
  }

  let left = null;
  let right = null;
  const hands = handLandmarks.slice(0, 2);
  if (poseLandmarks && hands.length > 0) {
    const lw = poseLandmarks[POSE_LEFT_WRIST];
    const rw = poseLandmarks[POSE_RIGHT_WRIST];
    const dist = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);
    if (hands.length === 1) {
      if (dist(hands[0][0], lw) <= dist(hands[0][0], rw)) left = hands[0];
      else right = hands[0];
    } else {
      const keep = dist(hands[0][0], lw) + dist(hands[1][0], rw);
      const swap = dist(hands[0][0], rw) + dist(hands[1][0], lw);
      [left, right] = keep <= swap ? [hands[0], hands[1]] : [hands[1], hands[0]];
    }
  } else {
    // No body found: MediaPipe labels assume a mirrored image, camera frames are not mirrored
    hands.forEach((hand, i) => {
      const label = handednesses[i]?.[0]?.categoryName;
      if (label === 'Left') right = hand;
      else left = hand;
    });
  }

  if (left) left.forEach((p, i) => { frame[LEFT_HAND_OFFSET + i] = [round4(p.x), round4(p.y)]; });
  if (right) right.forEach((p, i) => { frame[RIGHT_HAND_OFFSET + i] = [round4(p.x), round4(p.y)]; });
  return frame;
}

export const DEFAULT_MODEL_SERVER_URL = 'http://localhost:8000';

export class ISLModelClassifier {
  /**
   * @param {Object} options
   * @param {string} options.serverUrl - model server URL (default http://localhost:8000)
   * @param {Function} options.onPrediction - called with a caption result for each recognized sign
   * @param {Function} options.onStatusChange - called with { state, message }
   * @param {number} options.minConfidence - below this, the sign is reported as uncertain
   */
  constructor({ serverUrl = DEFAULT_MODEL_SERVER_URL, onPrediction, onStatusChange, minConfidence = 0.35 } = {}) {
    this.serverUrl = ISLModelClassifier.normalizeUrl(serverUrl);
    this.onPrediction = onPrediction || (() => {});
    this.onStatusChange = onStatusChange || (() => {});
    this.minConfidence = minConfidence;
    this.onlyCustom = false;
    this.recordTarget = null;
    this.reset();
  }

  static normalizeUrl(url) {
    return (url || '').trim().replace(/\/+$/, '');
  }

  static async request(serverUrl, path, options = {}) {
    const response = await fetch(`${ISLModelClassifier.normalizeUrl(serverUrl)}${path}`, {
      ...options,
      headers: options.body ? { 'Content-Type': 'application/json' } : undefined,
    });
    if (!response.ok) throw new Error(`Server responded with HTTP ${response.status}`);
    return response.json();
  }

  static checkHealth(serverUrl) {
    return ISLModelClassifier.request(serverUrl, '/health');
  }

  /** Words recorded in the My Signs panel: [{ label, hindi, samples }] */
  static async listCustomSigns(serverUrl) {
    return (await ISLModelClassifier.request(serverUrl, '/custom-signs')).words;
  }

  static async deleteCustomSign(serverUrl, label) {
    const path = `/custom-signs/${encodeURIComponent(label)}`;
    return (await ISLModelClassifier.request(serverUrl, path, { method: 'DELETE' })).words;
  }

  /** Turns recognized words into { english, hindi, model } via the server's Groq setup */
  static async makeSentence(serverUrl, words) {
    let response;
    try {
      response = await fetch(`${ISLModelClassifier.normalizeUrl(serverUrl)}/sentence`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ words }),
      });
    } catch {
      throw new Error('Cannot reach the model server. Is it running?');
    }
    const data = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(typeof data.detail === 'string' ? data.detail : `Server responded with HTTP ${response.status}`);
    return data;
  }

  setServerUrl(url) {
    this.serverUrl = ISLModelClassifier.normalizeUrl(url);
  }

  setOnlyCustom(onlyCustom) {
    this.onlyCustom = onlyCustom;
  }

  /**
   * Save the next `count` signs as samples of `label` instead of recognizing them.
   * onSaved(words, saved) runs after each sample; onDone() when all are saved or recording is cancelled.
   */
  recordSamples({ label, hindi = '', count = 5, onSaved, onDone }) {
    this.recordTarget = { label, hindi, count, saved: 0, onSaved: onSaved || (() => {}), onDone: onDone || (() => {}) };
    this.setStatus('idle', this.idleMessage());
  }

  cancelRecording() {
    const target = this.recordTarget;
    this.recordTarget = null;
    if (target) target.onDone();
    this.setStatus('idle', this.idleMessage());
  }

  idleMessage() {
    const t = this.recordTarget;
    return t
      ? `Sign "${t.label}" now (sample ${t.saved + 1} of ${t.count})`
      : 'Raise your hands and sign one word';
  }

  reset() {
    this.generation = (this.generation || 0) + 1; // drops replies to requests made before a reset
    this.mode = 'idle';
    this.history = [];
    this.segment = [];
    this.handFrames = 0;
    this.handRun = 0;
    this.missRun = 0;
    this.nextSampleTime = null;
    this.setStatus('idle', this.idleMessage());
  }

  setStatus(state, message) {
    if (this.status?.state === state && this.status?.message === message) return;
    this.status = { state, message };
    this.onStatusChange(this.status);
  }

  /**
   * Feed one camera frame. Signs are segmented automatically: a sign starts when the
   * hands come into view and ends when they drop out of view again.
   */
  pushFrame(frame, hasHands, timestampMs = performance.now()) {
    // Resample to a steady 25 FPS so signs keep their real speed: extra frames on fast
    // devices are skipped, frames on slow devices are repeated.
    if (this.nextSampleTime === null) this.nextSampleTime = timestampMs;
    let copies = 0;
    while (this.nextSampleTime <= timestampMs && copies < MAX_REPEAT_FRAMES) {
      this.nextSampleTime += SAMPLE_INTERVAL_MS;
      copies++;
    }
    if (this.nextSampleTime <= timestampMs) {
      this.nextSampleTime = timestampMs + SAMPLE_INTERVAL_MS; // long stall (e.g. tab hidden)
    }
    for (let i = 0; i < copies; i++) this.addSample(frame, hasHands);
  }

  addSample(frame, hasHands) {
    if (this.mode === 'idle') {
      this.history.push({ frame, hasHands });
      if (this.history.length > HISTORY_FRAMES) this.history.shift();
      this.handRun = hasHands ? this.handRun + 1 : 0;
      if (this.handRun >= START_FRAMES) {
        this.startSegment();
      }
      return;
    }

    this.segment.push(frame);
    if (hasHands) {
      this.handFrames++;
      this.missRun = 0;
    } else {
      this.missRun++;
    }

    if (this.missRun >= END_FRAMES || this.segment.length >= MAX_SIGN_FRAMES) {
      const frames = this.segment.slice(0, this.segment.length - Math.max(0, this.missRun - POST_ROLL_FRAMES));
      const enoughSigning = this.handFrames >= MIN_SIGN_FRAMES;
      this.mode = 'idle';
      this.history = [];
      this.segment = [];
      this.handRun = 0;
      if (!enoughSigning) {
        this.setStatus('idle', 'Too short. Hold the sign a little longer');
      } else if (this.recordTarget) {
        this.saveSample(frames);
      } else {
        this.predict(frames);
      }
    }
  }

  startSegment() {
    // Hands often flicker in before tracking is steady: rewind to the first sighting that
    // belongs to this sign (no gap of END_FRAMES or more), then keep a few rest frames before it.
    let first = this.history.length - START_FRAMES;
    for (let i = first - 1, gap = 0; i >= 0 && gap < END_FRAMES; i--) {
      if (this.history[i].hasHands) {
        first = i;
        gap = 0;
      } else {
        gap++;
      }
    }
    const kept = this.history.slice(Math.max(0, first - PRE_ROLL_FRAMES));

    this.mode = 'recording';
    this.segment = kept.map(h => h.frame);
    this.handFrames = kept.filter(h => h.hasHands).length;
    this.missRun = 0;
    this.setStatus('recording', this.recordTarget
      ? `Recording "${this.recordTarget.label}"... lower your hands when done`
      : 'Recording sign... lower your hands when done');
  }

  async saveSample(frames) {
    const target = this.recordTarget;
    const generation = this.generation;
    this.setStatus('predicting', `Saving sample of "${target.label}"...`);
    try {
      const { label, words } = await ISLModelClassifier.request(this.serverUrl, '/custom-signs', {
        method: 'POST',
        body: JSON.stringify({ label: target.label, hindi: target.hindi, frames }),
      });
      if (generation !== this.generation || target !== this.recordTarget) return;
      target.saved++;
      target.label = label;
      target.onSaved(words, target.saved);
      if (target.saved >= target.count) {
        this.recordTarget = null;
        target.onDone();
        const samples = target.saved === 1 ? '1 sample' : `${target.saved} samples`;
        if (this.mode !== 'recording') this.setStatus('idle', `Saved ${samples} of "${label}". Try signing it now`);
      } else if (this.mode !== 'recording') {
        this.setStatus('idle', `Saved. ${this.idleMessage()}`);
      }
    } catch (err) {
      console.warn('Saving sign sample failed:', err);
      if (generation === this.generation && this.mode !== 'recording') {
        this.setStatus('error', 'Could not save the sample. Is the model server running?');
      }
    }
  }

  async predict(frames) {
    if (!this.serverUrl) {
      this.setStatus('error', 'Set the model server URL in Settings');
      return;
    }

    const generation = this.generation;
    // A late reply must not overwrite the status of the next sign being recorded
    const settle = (state, message) => {
      if (generation === this.generation && this.mode !== 'recording') this.setStatus(state, message);
    };

    this.setStatus('predicting', 'Recognizing sign...');
    try {
      const response = await fetch(`${this.serverUrl}/predict`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ frames, top_k: 5, only_custom: this.onlyCustom }),
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const { predictions, custom_words: customWords } = await response.json();
      if (generation !== this.generation) return;
      if (predictions.length === 0) {
        settle('idle', customWords
          ? 'Not one of your recorded signs. Try again'
          : 'No signs recorded yet. Add some in the My Signs panel');
        return;
      }
      const [top, ...alternatives] = predictions;
      const isCustom = top.source === 'custom';
      const altText = alternatives.slice(0, 3).map(p => `${p.label} ${Math.round(p.confidence * 100)}%`).join(', ');

      if (top.confidence < this.minConfidence) {
        settle('idle', `Not sure (maybe "${top.label}"). Try the sign again`);
        return;
      }

      settle('idle', `Recognized "${top.label}". Ready for the next sign`);
      this.onPrediction({
        hasMatch: true,
        text: top.label,
        hindiText: top.hindi || '',
        islGloss: top.label.toUpperCase(),
        confidence: top.confidence,
        domain: top.category,
        source: 'deep-model',
        sourceLabel: isCustom ? 'My Signs (recorded by you)' : 'ISL Model (SL-GCN · INCLUDE)',
        explanation: altText ? `Other candidates: ${altText}` : 'Pretrained ISL word model',
      });
    } catch (err) {
      console.warn('ISL model server request failed:', err);
      settle('error', 'Cannot reach the model server. Is it running?');
    }
  }
}
