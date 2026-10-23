/**
 * Transcript Management utility for Learnable.
 * Formats, stores, copies, and exports recognized sign language captions.
 */

export class TranscriptManager {
  static formatTimestamp(date = new Date()) {
    return date.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
    });
  }

  static formatDate(date = new Date()) {
    return date.toLocaleDateString([], {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  }

  /**
   * Generates a clean text document of the translation session.
   * @param {Array} history - Array of { id, text, timestamp, confidence, source, domain }
   * @param {Object} sessionMeta - { language, startTime, mode }
   */
  static generateTextDocument(history, sessionMeta = {}) {
    const divider = '='.repeat(64);
    const subDivider = '-'.repeat(64);
    const now = new Date();

    const header = [
      divider,
      'LEARNABLE — REAL-TIME SIGN LANGUAGE TRANSLATION TRANSCRIPT',
      'Tagline: "Sign it. See it."',
      divider,
      `Generated: ${this.formatDate(now)} at ${this.formatTimestamp(now)}`,
      `Language: ${sessionMeta.language || 'Indian Sign Language (ISL)'}`,
      `Total Phrases Recognized: ${history.length}`,
      `Hardware: Local Browser Webcam / Computer Vision`,
      `Privacy Status: On-Device Processing — No Raw Video Stored`,
      divider,
      '',
      'CHRONOLOGICAL CAPTION LOG:',
      subDivider,
    ].join('\n');

    if (history.length === 0) {
      return `${header}\n[No captions were recorded during this session.]\n\n${divider}`;
    }

    const body = history
      .map((item, index) => {
        const confPercent = Math.round((item.confidence || 0) * 100);
        const sourceLabel = item.source === 'live-heuristic' 
          ? '[Live Heuristic Vision]'
          : item.source === 'demo'
          ? '[Simulated Demo Phrase]'
          : '[Vision Classifier]';

        return `[${index + 1}] ${item.timestamp} | Confidence: ${confPercent}% ${sourceLabel}\n` +
               `    Text: "${item.text}"` +
               (item.islGloss ? `\n    ISL Gloss: ${item.islGloss}` : '') +
               (item.hindiText ? `\n    Hindi: ${item.hindiText}` : '');
      })
      .join('\n\n');

    const footer = [
      '',
      subDivider,
      'END OF TRANSCRIPT',
      'Disclaimer: Learnable is an assistive prototype developed for',
      'accessibility and hackathon demonstration. It does not replace certified',
      'sign language interpreters for medical or legal procedures.',
      divider,
    ].join('\n');

    return `${header}\n${body}\n${footer}`;
  }

  /**
   * Triggers a browser download of the transcript file.
   */
  static downloadTranscriptFile(history, sessionMeta = {}) {
    const content = this.generateTextDocument(history, sessionMeta);
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    
    const timestampStr = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
    link.href = url;
    link.download = `Learnable-Transcript-${timestampStr}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  /**
   * Copies text cleanly to clipboard with fallback.
   */
  static async copyToClipboard(text) {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    } else {
      // Fallback for non-https or older environments
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      textArea.style.top = '-999999px';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      const successful = document.execCommand('copy');
      textArea.remove();
      return successful;
    }
  }
}
