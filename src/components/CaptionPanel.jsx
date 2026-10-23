import React, { useState } from 'react';
import { 
  Copy, 
  Check, 
  Download, 
  Trash2, 
  Volume2, 
  Sparkles, 
  Clock, 
  Gauge, 
  HelpCircle,
  FileText,
  VolumeX,
  Languages,
  Activity
} from 'lucide-react';
import { SpeechSynthesizer } from '../utils/speechSynthesizer';

export default function CaptionPanel({
  currentCaption,
  hindiCaption,
  islGloss,
  confidence,
  timestamp,
  source, // 'live-heuristic' | 'demo' | 'model' | 'idle'
  sourceLabel,
  captionFontSize = 'normal', // 'normal' | 'large' | 'xl'
  onClearCaptions,
  onCopyCaptions,
  onDownloadTranscript,
  onOpenHistory,
  historyCount = 0,
}) {
  const [copied, setCopied] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const handleCopy = async () => {
    if (!currentCaption) return;
    const ok = await onCopyCaptions(currentCaption);
    if (ok) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleSpeak = () => {
    if (!currentCaption) return;
    setIsSpeaking(true);
    SpeechSynthesizer.speak(currentCaption, {
      rate: 0.95,
      pitch: 1.0,
    });
    setTimeout(() => setIsSpeaking(false), 2000);
  };

  // Font size class mapping
  const fontSizeClasses = {
    normal: 'text-xl sm:text-2xl',
    large: 'text-2xl sm:text-3xl font-semibold',
    xl: 'text-3xl sm:text-4xl font-bold tracking-tight',
  }[captionFontSize] || 'text-xl sm:text-2xl';

  const isDemo = source === 'demo';
  const isHeuristic = source === 'live-heuristic';
  const confidencePercent = confidence ? Math.round(confidence * 100) : null;

  return (
    <div className="flex flex-col h-full bg-navy-900/90 rounded-2xl border border-violet-500/20 shadow-xl overflow-hidden backdrop-blur-md">
      
      {/* Caption Panel Header Bar */}
      <div className="flex items-center justify-between px-4 sm:px-5 py-3.5 border-b border-slate-800 bg-navy-950/50">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-lg bg-cyan-950/60 text-cyan-400 border border-cyan-500/20">
            <Languages className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-white tracking-wide flex items-center gap-2">
              Live Text Captions
              {isDemo && (
                <span className="text-[10px] font-semibold text-amber-300 bg-amber-950/60 px-2 py-0.5 rounded-md border border-amber-500/30 flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-amber-400" />
                  Demo Mode Active
                </span>
              )}
              {isHeuristic && (
                <span className="text-[10px] font-semibold text-cyan-300 bg-cyan-950/60 px-2 py-0.5 rounded-md border border-cyan-500/30 flex items-center gap-1">
                  <Activity className="w-3 h-3 text-cyan-400" />
                  Live Heuristic
                </span>
              )}
            </h2>
            <p className="text-[11px] text-slate-400">Translated text display with speech synthesis</p>
          </div>
        </div>

        {/* Confidence Badge */}
        {confidencePercent ? (
          <div 
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-mono font-medium border ${
              isDemo 
                ? 'bg-amber-950/40 text-amber-300 border-amber-500/30'
                : 'bg-emerald-950/50 text-emerald-300 border-emerald-500/30'
            }`}
            title={
              isDemo 
                ? 'Illustrative simulated confidence metric for presentation'
                : 'Geometric landmark match confidence'
            }
          >
            <Gauge className="w-3.5 h-3.5" />
            <span>{confidencePercent}%</span>
            <span className="text-[10px] text-slate-400">
              {isDemo ? '(Simulated)' : 'Confidence'}
            </span>
          </div>
        ) : (
          <span className="text-[11px] text-slate-500 font-mono">
            Awaiting Sign...
          </span>
        )}
      </div>

      {/* Main Large Caption Reading Stage */}
      <div className="relative flex-1 min-h-[340px] sm:min-h-[420px] p-6 sm:p-8 flex flex-col justify-between bg-gradient-to-b from-navy-950/40 via-navy-900/60 to-navy-950/80">
        
        {/* Top Info Banner */}
        <div className="flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 rounded-full bg-violet-400" />
            <span className="font-medium text-slate-300">
              {sourceLabel || 'Waiting for sign input...'}
            </span>
          </div>

          {timestamp && (
            <div className="flex items-center gap-1 font-mono text-[11px] text-slate-400 bg-navy-850 px-2.5 py-1 rounded-md border border-slate-800">
              <Clock className="w-3 h-3 text-slate-400" />
              <span>{timestamp}</span>
            </div>
          )}
        </div>

        {/* Center Caption Box */}
        <div className="my-auto py-6">
          {currentCaption ? (
            <div className="space-y-4 animate-fadeIn">
              {/* Primary English Caption Sentence */}
              <p className={`${fontSizeClasses} text-white leading-relaxed font-sans`}>
                &ldquo;{currentCaption}&rdquo;
              </p>

              {/* Secondary Hindi Translation */}
              {hindiCaption && (
                <p className="text-base sm:text-lg text-cyan-300 font-medium">
                  {hindiCaption}
                </p>
              )}

              {/* ISL Grammatical Gloss representation */}
              {islGloss && (
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-navy-800/80 border border-violet-500/30 text-xs font-mono text-violet-300">
                  <span className="text-slate-400 font-normal">ISL Gloss:</span>
                  <span>{islGloss}</span>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-10 space-y-3">
              <div className="w-12 h-12 rounded-xl bg-slate-800/50 border border-slate-700/60 flex items-center justify-center mx-auto text-slate-500">
                <Languages className="w-6 h-6 text-slate-400" />
              </div>
              <p className="text-slate-400 text-sm max-w-sm mx-auto">
                No captions yet. Start your camera and hold an ISL sign, or launch <strong className="text-violet-300 font-semibold cursor-pointer">Demo Mode</strong> to test predefined sentences.
              </p>
            </div>
          )}
        </div>

        {/* Bottom Helper Bar */}
        <div className="pt-4 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <button
              onClick={onOpenHistory}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-navy-850 hover:bg-navy-800 text-slate-300 border border-slate-700/80 transition-colors cursor-pointer"
            >
              <FileText className="w-3.5 h-3.5 text-cyan-400" />
              <span>Session History ({historyCount})</span>
            </button>
          </div>

          {isDemo && (
            <div className="flex items-center gap-1.5 text-amber-300/90 text-[11px] bg-amber-950/30 px-2.5 py-0.5 rounded border border-amber-500/20">
              <Sparkles className="w-3 h-3 text-amber-400" />
              <span>Simulated presentation caption</span>
            </div>
          )}
        </div>

      </div>

      {/* Action Controls Toolbar */}
      <div className="px-4 sm:px-5 py-3 border-t border-slate-800 bg-navy-950/60 flex flex-wrap items-center justify-between gap-2.5">
        
        {/* Left Actions: TTS & Copy */}
        <div className="flex items-center gap-2">
          {/* Speak Audio Button */}
          <button
            onClick={handleSpeak}
            disabled={!currentCaption}
            className={`px-3 py-2 rounded-lg text-xs font-semibold border flex items-center gap-1.5 transition-all ${
              isSpeaking
                ? 'bg-cyan-600 text-white border-cyan-400 animate-pulse'
                : 'bg-navy-850 hover:bg-navy-800 text-slate-200 border-slate-700 hover:border-cyan-500/50 disabled:opacity-40 cursor-pointer'
            }`}
            title="Speak caption aloud using Web Speech synthesis"
          >
            <Volume2 className="w-3.5 h-3.5 text-cyan-400" />
            <span>{isSpeaking ? 'Speaking...' : 'Speak'}</span>
          </button>

          {/* Copy Text Button */}
          <button
            onClick={handleCopy}
            disabled={!currentCaption}
            className="px-3 py-2 rounded-lg text-xs font-semibold bg-navy-850 hover:bg-navy-800 text-slate-200 border border-slate-700 hover:border-violet-500/50 transition-all flex items-center gap-1.5 disabled:opacity-40 cursor-pointer"
            title="Copy recognized sentence to clipboard"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-300">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-violet-400" />
                <span>Copy</span>
              </>
            )}
          </button>

          {/* Download Transcript */}
          <button
            onClick={onDownloadTranscript}
            disabled={historyCount === 0 && !currentCaption}
            className="px-3 py-2 rounded-lg text-xs font-semibold bg-navy-850 hover:bg-navy-800 text-slate-200 border border-slate-700 hover:border-emerald-500/50 transition-all flex items-center gap-1.5 disabled:opacity-40 cursor-pointer"
            title="Download complete session transcript as text file"
          >
            <Download className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden sm:inline">Export</span>
          </button>
        </div>

        {/* Right Actions: Clear */}
        <div className="flex items-center gap-2">
          <button
            onClick={onClearCaptions}
            disabled={!currentCaption}
            className="px-3 py-2 rounded-lg text-xs font-medium text-slate-400 hover:text-rose-300 bg-navy-850 hover:bg-rose-950/40 border border-slate-800 hover:border-rose-500/40 transition-colors flex items-center gap-1.5 disabled:opacity-40 cursor-pointer"
            title="Clear current caption"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear</span>
          </button>
        </div>

      </div>

    </div>
  );
}
