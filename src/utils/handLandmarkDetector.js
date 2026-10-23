/**
 * Hand Landmark Detector utility for Learnable.
 * Integrates Google MediaPipe Tasks Vision (HandLandmarker) for on-device
 * 21 3D hand keypoint extraction and real-time canvas skeleton rendering.
 * Includes resilient fallback handling if WASM files cannot be loaded.
 */

import { FilesetResolver, HandLandmarker } from '@mediapipe/tasks-vision';

// Standard 21 Hand Landmark Connections in MediaPipe
export const HAND_CONNECTIONS = [
  // Thumb
  [0, 1], [1, 2], [2, 3], [3, 4],
  // Index finger
  [0, 5], [5, 6], [6, 7], [7, 8],
  // Middle finger
  [9, 10], [10, 11], [11, 12],
  // Ring finger
  [13, 14], [14, 15], [15, 16],
  // Pinky
  [0, 17], [17, 18], [18, 19], [19, 20],
  // Palm base knuckles
  [5, 9], [9, 13], [13, 17]
];

export class HandLandmarkDetector {
  constructor() {
    this.handLandmarker = null;
    this.isInitializing = false;
    this.isReady = false;
    this.initializationError = null;
    this.lastVideoTime = -1;
  }

  /**
   * Initializes MediaPipe HandLandmarker with on-device WASM
   */
  async initialize() {
    if (this.isReady) return true;
    if (this.isInitializing) return false;

    this.isInitializing = true;
    this.initializationError = null;

    try {
      // Load vision WASM binary from standard CDN
      const vision = await FilesetResolver.forVisionTasks(
        'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm'
      );

      this.handLandmarker = await HandLandmarker.createFromOptions(vision, {
        baseOptions: {
          modelAssetPath: 'https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task',
          delegate: 'GPU',
        },
        runningMode: 'VIDEO',
        numHands: 2,
        minHandDetectionConfidence: 0.5,
        minHandPresenceConfidence: 0.5,
        minTrackingConfidence: 0.5,
      });

      this.isReady = true;
      this.isInitializing = false;
      return true;
    } catch (err) {
      console.warn('Primary MediaPipe GPU initialization failed, attempting CPU fallback...', err);
      
      try {
        const vision = await FilesetResolver.forVisionTasks(
          'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm'
        );

        this.handLandmarker = await HandLandmarker.createFromOptions(vision, {
          baseOptions: {
            modelAssetPath: 'https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task',
            delegate: 'CPU',
          },
          runningMode: 'VIDEO',
          numHands: 2,
          minHandDetectionConfidence: 0.4,
        });

        this.isReady = true;
        this.isInitializing = false;
        return true;
      } catch (fallbackErr) {
        console.error('MediaPipe HandLandmarker failed to load:', fallbackErr);
        this.initializationError = fallbackErr.message || 'Failed to initialize hand tracking module.';
        this.isInitializing = false;
        this.isReady = false;
        return false;
      }
    }
  }

  /**
   * Detects landmarks in a video frame
   * @param {HTMLVideoElement} videoElement 
   * @returns {Object|null} { landmarks, handednesses, handCount }
   */
  detectForVideo(videoElement) {
    if (!this.isReady || !this.handLandmarker || !videoElement) {
      return null;
    }

    if (videoElement.readyState < 2) {
      return null;
    }

    const currentTime = videoElement.currentTime;
    if (currentTime === this.lastVideoTime) {
      return null;
    }
    this.lastVideoTime = currentTime;

    try {
      const results = this.handLandmarker.detectForVideo(videoElement, performance.now());
      return {
        landmarks: results.landmarks || [],
        handednesses: results.handednesses || [],
        handCount: (results.landmarks && results.landmarks.length) || 0,
      };
    } catch (err) {
      console.warn('Detection frame error:', err);
      return null;
    }
  }

  /**
   * Draws 21 glowing hand skeleton joints and bones onto an overlay canvas
   * @param {HTMLCanvasElement} canvas 
   * @param {Array} multiHandLandmarks - array of landmark sets
   * @param {Object} options - { overlayStyle, showBones, showJoints, showLabels }
   */
  static drawSkeleton(canvas, multiHandLandmarks = [], options = {}) {
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (!multiHandLandmarks || multiHandLandmarks.length === 0) {
      return;
    }

    const {
      primaryColor = '#22D3EE',  // Cyan 400
      secondaryColor = '#A78BFA', // Violet 400
      accentColor = '#FFFFFF',
      lineWidth = 3,
      jointRadius = 4,
    } = options;

    multiHandLandmarks.forEach((landmarks, handIndex) => {
      if (!landmarks || landmarks.length < 21) return;

      const isRightHand = handIndex === 0;
      const boneGradientColor = isRightHand ? primaryColor : secondaryColor;

      // 1. Draw Skeleton Bone Connections
      ctx.lineWidth = lineWidth;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      HAND_CONNECTIONS.forEach(([startIdx, endIdx]) => {
        const start = landmarks[startIdx];
        const end = landmarks[endIdx];

        if (start && end) {
          ctx.beginPath();
          ctx.moveTo(start.x * canvas.width, start.y * canvas.height);
          ctx.lineTo(end.x * canvas.width, end.y * canvas.height);

          // Glowing effect
          ctx.strokeStyle = boneGradientColor;
          ctx.shadowColor = boneGradientColor;
          ctx.shadowBlur = 8;
          ctx.stroke();
        }
      });

      // 2. Draw 21 Hand Joints (Keypoints)
      landmarks.forEach((pt, idx) => {
        const x = pt.x * canvas.width;
        const y = pt.y * canvas.height;

        ctx.beginPath();
        // Fingertip points (4, 8, 12, 16, 20) get extra prominence
        const isFingertip = [4, 8, 12, 16, 20].includes(idx);
        const radius = isFingertip ? jointRadius + 2 : jointRadius;

        ctx.arc(x, y, radius, 0, 2 * Math.PI);

        if (isFingertip) {
          ctx.fillStyle = '#F43F5E'; // Vibrant coral/rose for fingertips
          ctx.shadowColor = '#F43F5E';
          ctx.shadowBlur = 12;
        } else if (idx === 0) {
          ctx.fillStyle = '#10B981'; // Emerald wrist point
          ctx.shadowColor = '#10B981';
          ctx.shadowBlur = 10;
        } else {
          ctx.fillStyle = accentColor;
          ctx.shadowColor = primaryColor;
          ctx.shadowBlur = 6;
        }

        ctx.fill();

        // Subtle outer ring
        ctx.beginPath();
        ctx.arc(x, y, radius + 2, 0, 2 * Math.PI);
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
        ctx.lineWidth = 1;
        ctx.stroke();
      });

      // Reset shadow blur
      ctx.shadowBlur = 0;

      // 3. Draw subtle bounding box and hand label
      const xs = landmarks.map(p => p.x * canvas.width);
      const ys = landmarks.map(p => p.y * canvas.height);
      const minX = Math.max(0, Math.min(...xs) - 20);
      const maxX = Math.min(canvas.width, Math.max(...xs) + 20);
      const minY = Math.max(0, Math.min(...ys) - 20);
      const maxY = Math.min(canvas.height, Math.max(...ys) + 20);

      // Subtle rounded boundary
      ctx.strokeStyle = 'rgba(34, 211, 238, 0.25)';
      ctx.lineWidth = 1.5;
      ctx.setLineDash([4, 4]);
      ctx.strokeRect(minX, minY, maxX - minX, maxY - minY);
      ctx.setLineDash([]); // Reset line dash

      // Pill label above hand
      ctx.fillStyle = 'rgba(16, 22, 37, 0.85)';
      ctx.fillRect(minX, Math.max(0, minY - 24), 95, 20);
      ctx.strokeStyle = boneGradientColor;
      ctx.strokeRect(minX, Math.max(0, minY - 24), 95, 20);

      ctx.fillStyle = '#FFFFFF';
      ctx.font = '10px Inter, sans-serif';
      ctx.fillText(`Hand ${handIndex + 1} (Tracked)`, minX + 6, Math.max(14, minY - 10));
    });
  }

  /**
   * Release resources
   */
  destroy() {
    if (this.handLandmarker) {
      try {
        this.handLandmarker.close();
      } catch (e) {
        console.warn('Error closing handLandmarker:', e);
      }
      this.handLandmarker = null;
    }
    this.isReady = false;
  }
}
