/**
 * Webcam Manager utility for Learnable.
 * Handles camera acquisition, permissions, track lifecycle, and device enumeration.
 * strictly ensures:
 * 1. Permission requested only upon user action.
 * 2. Proper cleanup when stopped.
 * 3. Graceful handling of denials and missing hardware.
 */

export class WebcamManager {
  constructor() {
    this.stream = null;
    this.videoElement = null;
    this.selectedDeviceId = null;
  }

  /**
   * Check if user's browser supports mediaDevices.getUserMedia
   */
  static isSupported() {
    return !!(
      typeof navigator !== 'undefined' &&
      navigator.mediaDevices &&
      navigator.mediaDevices.getUserMedia
    );
  }

  /**
   * Enumerate available video input devices
   */
  static async getVideoDevices() {
    if (!this.isSupported()) return [];
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      return devices.filter(d => d.kind === 'videoinput');
    } catch (err) {
      console.warn('Could not enumerate video devices:', err);
      return [];
    }
  }

  /**
   * Request webcam stream with specified deviceId or ideal resolution
   * @param {Object} options - { deviceId, width = 1280, height = 720, facingMode = 'user' }
   */
  async startStream(options = {}) {
    if (!WebcamManager.isSupported()) {
      const err = new Error('Camera API (navigator.mediaDevices.getUserMedia) is not supported by your browser.');
      err.name = 'NotSupportedError';
      throw err;
    }

    // Stop any existing stream first
    this.stopStream();

    const constraints = {
      audio: false,
      video: {
        width: { ideal: options.width || 1280 },
        height: { ideal: options.height || 720 },
        frameRate: { ideal: 30, max: 60 },
      },
    };

    if (options.deviceId) {
      constraints.video.deviceId = { exact: options.deviceId };
    } else {
      constraints.video.facingMode = options.facingMode || 'user';
    }

    try {
      this.stream = await navigator.mediaDevices.getUserMedia(constraints);
      return this.stream;
    } catch (err) {
      // Map error types to human-readable troubleshooting messages
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        err.userMessage = 'Camera permission was denied. Please click the camera icon in your browser address bar to allow camera access.';
      } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
        err.userMessage = 'No camera device found. Please connect a webcam or enable your camera device.';
      } else if (err.name === 'NotReadableError' || err.name === 'TrackStartError') {
        err.userMessage = 'Camera is already in use by another application (e.g. Zoom, Teams, or another tab). Please close other apps and try again.';
      } else if (err.name === 'OverconstrainedError') {
        err.userMessage = 'The requested camera resolution is not supported by your hardware.';
      } else {
        err.userMessage = err.message || 'An unknown error occurred while accessing your camera.';
      }
      throw err;
    }
  }

  /**
   * Attaches the active stream to an HTML <video> element
   */
  attachToVideo(videoEl) {
    if (!videoEl) return;
    this.videoElement = videoEl;
    if (this.stream) {
      videoEl.srcObject = this.stream;
      return new Promise((resolve) => {
        videoEl.onloadedmetadata = () => {
          videoEl.play().catch(e => console.warn('Autoplay prevented:', e));
          resolve(videoEl);
        };
      });
    }
  }

  /**
   * Stops all active media tracks and frees the webcam hardware
   */
  stopStream() {
    if (this.stream) {
      this.stream.getTracks().forEach((track) => {
        try {
          track.stop();
        } catch (e) {
          console.warn('Error stopping track:', e);
        }
      });
      this.stream = null;
    }
    if (this.videoElement) {
      this.videoElement.srcObject = null;
      this.videoElement = null;
    }
  }

  /**
   * Returns whether a stream is currently active
   */
  isActive() {
    if (!this.stream) return false;
    return this.stream.getVideoTracks().some(t => t.readyState === 'live');
  }
}
