/**
 * Pose Landmark Detector utility for Learnable.
 * Wraps Google MediaPipe Tasks Vision (PoseLandmarker) to extract the 33 BlazePose
 * body keypoints the pretrained ISL model needs alongside the hand landmarks.
 * Loaded lazily, only when the Kaggle ISL model engine is selected.
 */

import { FilesetResolver, PoseLandmarker } from '@mediapipe/tasks-vision';

const WASM_URL = 'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm';
const POSE_MODEL_URL =
  'https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_lite/float16/1/pose_landmarker_lite.task';

export class PoseLandmarkDetector {
  constructor() {
    this.poseLandmarker = null;
    this.isReady = false;
    this.initPromise = null;
    this.lastTimestamp = -1;
  }

  /**
   * Initializes MediaPipe PoseLandmarker (GPU with CPU fallback). Safe to call repeatedly.
   */
  initialize() {
    if (!this.initPromise) {
      this.initPromise = this.createLandmarker().catch((err) => {
        this.initPromise = null;
        throw err;
      });
    }
    return this.initPromise;
  }

  async createLandmarker() {
    const vision = await FilesetResolver.forVisionTasks(WASM_URL);
    const options = (delegate) => ({
      baseOptions: { modelAssetPath: POSE_MODEL_URL, delegate },
      runningMode: 'VIDEO',
      numPoses: 1,
    });

    try {
      this.poseLandmarker = await PoseLandmarker.createFromOptions(vision, options('GPU'));
    } catch (err) {
      console.warn('PoseLandmarker GPU initialization failed, falling back to CPU...', err);
      this.poseLandmarker = await PoseLandmarker.createFromOptions(vision, options('CPU'));
    }
    this.isReady = true;
    return true;
  }

  /**
   * Detects body landmarks in the current video frame.
   * @param {HTMLVideoElement} videoElement
   * @returns {Array|null} 33 normalized landmarks, or null when no person is found
   */
  detectForVideo(videoElement) {
    if (!this.isReady || !videoElement || videoElement.readyState < 2) {
      return null;
    }

    // MediaPipe VIDEO mode requires strictly increasing timestamps
    const timestamp = Math.max(performance.now(), this.lastTimestamp + 1);
    this.lastTimestamp = timestamp;

    try {
      const results = this.poseLandmarker.detectForVideo(videoElement, timestamp);
      return (results.landmarks && results.landmarks[0]) || null;
    } catch (err) {
      console.warn('Pose detection frame error:', err);
      return null;
    }
  }

  destroy() {
    if (this.poseLandmarker) {
      try {
        this.poseLandmarker.close();
      } catch (e) {
        console.warn('Error closing poseLandmarker:', e);
      }
      this.poseLandmarker = null;
    }
    this.isReady = false;
    this.initPromise = null;
  }
}
