/**
 * Speech synthesis utility for Learnable.
 * Enables text-to-speech (TTS) playback of recognized sign language captions
 * to provide a two-way communication bridge for hearing participants.
 */

export class SpeechSynthesizer {
  static isSupported() {
    return typeof window !== 'undefined' && 'speechSynthesis' in window;
  }

  static speak(text, options = {}) {
    if (!this.isSupported()) {
      console.warn('Speech synthesis is not supported on this browser.');
      return false;
    }

    try {
      // Cancel any ongoing speech to avoid queue buildup
      window.speechSynthesis.cancel();

      if (!text || text.trim() === '') return false;

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = options.rate || 1.0;
      utterance.pitch = options.pitch || 1.0;
      utterance.volume = options.volume !== undefined ? options.volume : 1.0;

      // Select preferred voice if available
      const voices = window.speechSynthesis.getVoices();
      if (voices && voices.length > 0) {
        // Prefer natural English voices (e.g. Google UK/US or Indian English if available)
        const preferredVoice = voices.find(v => 
          v.lang.startsWith('en-IN') || 
          v.name.includes('Natural') || 
          v.name.includes('Google')
        ) || voices.find(v => v.lang.startsWith('en'));

        if (preferredVoice) {
          utterance.voice = preferredVoice;
        }
      }

      window.speechSynthesis.speak(utterance);
      return true;
    } catch (err) {
      console.error('Error speaking utterance:', err);
      return false;
    }
  }

  static stop() {
    if (this.isSupported()) {
      window.speechSynthesis.cancel();
    }
  }
}
