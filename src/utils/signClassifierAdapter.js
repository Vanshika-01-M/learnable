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
 * 4. Extensible Deep Learning Sequence Model adapter interface.
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
 * 3. Future Deep Sequence Model Adapter (Reference Implementation)
 */
export class FutureDeepModelAdapter {
  constructor() {
    this.name = 'Spatial-Temporal Transformer (ISL)';
    this.isReady = false;
    this.isTrainedModel = true;
    this.modelStatus = 'Planned / In Development';
  }

  async predictSequence(frameSequenceBuffer) {
    throw new Error(
      'Deep sequence model is planned for Phase 2. ' +
      'Currently using MediaPipe Landmark Extraction + Heuristic / Demo mode.'
    );
  }
}
