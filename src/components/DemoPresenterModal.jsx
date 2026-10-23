import React, { useState, useEffect } from 'react';
import { 
  X, 
  Sparkles, 
  Play, 
  Pause, 
  RotateCcw, 
  Copy, 
  Check, 
  CheckCircle2, 
  HelpCircle, 
  Info, 
  ArrowRight,
  BookOpen,
  Plus
} from 'lucide-react';
import { DEMO_DOMAINS, GUIDED_DEMO_SEQUENCE } from '../utils/demoData';

export default function DemoPresenterModal({
  isOpen,
  onClose,
  onTriggerDemoPhrase,
  onResetDemo,
  onOpenLibrary,
  allPhrases = [],
  currentCaption,
}) {
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [activeGuidedIndex, setActiveGuidedIndex] = useState(-1);
  const [isPlayingAutoDemo, setIsPlayingAutoDemo] = useState(false);
  const [copiedId, setCopiedId] = useState(null);
  const [showPresenterNotes, setShowPresenterNotes] = useState(true);

  // Auto-play guided demo sequence timer
  useEffect(() => {
    let timer = null;
    if (isPlayingAutoDemo) {
      if (activeGuidedIndex < GUIDED_DEMO_SEQUENCE.length - 1) {
        timer = setTimeout(() => {
          const nextIndex = activeGuidedIndex + 1;
          setActiveGuidedIndex(nextIndex);
          const phraseId = GUIDED_DEMO_SEQUENCE[nextIndex];
          const phrase = allPhrases.find(p => p.id === phraseId);
          if (phrase) {
            onTriggerDemoPhrase(phrase);
          }
        }, 3200);
      } else {
        setIsPlayingAutoDemo(false);
      }
    }
    return () => clearTimeout(timer);
  }, [isPlayingAutoDemo, activeGuidedIndex, onTriggerDemoPhrase, allPhrases]);

  if (!isOpen) return null;

  const handleStartAutoDemo = () => {
    setActiveGuidedIndex(0);
    setIsPlayingAutoDemo(true);
    const firstPhraseId = GUIDED_DEMO_SEQUENCE[0];
    const phrase = allPhrases.find(p => p.id === firstPhraseId);
    if (phrase) {
      onTriggerDemoPhrase(phrase);
    }
  };

  const handleStopAutoDemo = () => {
    setIsPlayingAutoDemo(false);
  };

  const handleSelectPhrase = (phrase) => {
    handleStopAutoDemo();
    onTriggerDemoPhrase(phrase);
  };

  const handleCopyPhrase = (e, phrase) => {
    e.stopPropagation();
    navigator.clipboard.writeText(phrase.text);
    setCopiedId(phrase.id);
    setTimeout(() => setCopiedId(null), 1800);
  };

  const filteredPhrases = selectedFilter === 'all' 
    ? allPhrases 
    : allPhrases.filter(p => p.domain === selectedFilter);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-navy-950/80 backdrop-blur-md animate-fadeIn">
      <div 
        className="w-full max-w-4xl max-h-[92vh] bg-navy-900 border border-violet-500/30 rounded-2xl shadow-2xl flex flex-col overflow-hidden"
        role="dialog"
        aria-labelledby="demo-modal-title"
      >
        
        {/* Modal Header */}
        <div className="px-5 sm:px-6 py-4 border-b border-slate-800 bg-navy-950/70 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-violet-950 text-violet-300 border border-violet-500/30">
              <Sparkles className="w-5 h-5 text-violet-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 id="demo-modal-title" className="text-base font-bold text-white">
                  InnoTech Presentation Demo Suite
                </h3>
                <span className="text-[10px] font-semibold bg-amber-950/70 text-amber-300 px-2 py-0.5 rounded border border-amber-500/30 uppercase tracking-wider">
                  Simulated
                </span>
                <span className="text-[10px] text-slate-400 font-mono">
                  ({allPhrases.length} signs)
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Test Indian Sign Language scenarios even without webcam hardware
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label="Close Demo Suite"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Guided Presenter Control Bar */}
        <div className="px-5 sm:px-6 py-3 bg-violet-950/30 border-b border-violet-500/20 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            {isPlayingAutoDemo ? (
              <button
                onClick={handleStopAutoDemo}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-amber-600 hover:bg-amber-500 text-white shadow-md flex items-center gap-2 cursor-pointer"
              >
                <Pause className="w-3.5 h-3.5" />
                <span>Pause Auto-Demo</span>
              </button>
            ) : (
              <button
                onClick={handleStartAutoDemo}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-gradient-to-r from-violet-600 to-cyan-500 hover:from-violet-500 hover:to-cyan-400 text-white shadow-md flex items-center gap-2 cursor-pointer"
              >
                <Play className="w-3.5 h-3.5" />
                <span>Run Guided Demo (4 Signs)</span>
              </button>
            )}

            <button
              onClick={() => {
                handleStopAutoDemo();
                setActiveGuidedIndex(-1);
                onResetDemo();
              }}
              className="px-3 py-2 rounded-xl text-xs font-medium text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-700 border border-slate-700 flex items-center gap-1.5 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onOpenLibrary}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-navy-850 hover:bg-navy-800 text-cyan-300 border border-cyan-500/30 flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Custom Signs</span>
            </button>

            <button
              onClick={() => setShowPresenterNotes(!showPresenterNotes)}
              className="text-xs text-violet-300 hover:text-violet-200 flex items-center gap-1 cursor-pointer"
            >
              <Info className="w-3.5 h-3.5" />
              <span>{showPresenterNotes ? 'Hide Notes' : 'Show Notes'}</span>
            </button>
          </div>
        </div>

        {/* Presenter Pitch Notes for Judges */}
        {showPresenterNotes && (
          <div className="px-5 sm:px-6 py-2.5 bg-navy-950/90 border-b border-slate-800 text-xs text-slate-300 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-cyan-400">Hackathon Note:</span>
              <span>
                Simulated outputs allow judges to evaluate the UI/UX, TTS audio, and transcript workflows independently from camera hardware availability.
              </span>
            </div>
            <span className="text-[11px] text-slate-400 whitespace-nowrap">
              MediaPipe landmark detection operates in live mode.
            </span>
          </div>
        )}

        {/* Domain Filter Pills */}
        <div className="px-5 sm:px-6 py-2.5 border-b border-slate-800 flex items-center gap-2 overflow-x-auto">
          {DEMO_DOMAINS.map(d => (
            <button
              key={d.id}
              onClick={() => setSelectedFilter(d.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
                selectedFilter === d.id
                  ? 'bg-violet-600 text-white shadow-sm shadow-violet-600/30 font-semibold'
                  : 'bg-navy-950 text-slate-400 hover:text-slate-200 border border-slate-800 hover:border-slate-700'
              }`}
            >
              {d.name}
            </button>
          ))}
        </div>

        {/* Phrase Cards Grid */}
        <div className="flex-1 p-5 sm:p-6 overflow-y-auto space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {filteredPhrases.map((phrase) => {
              const isCurrent = currentCaption === phrase.text;

              return (
                <div
                  key={phrase.id}
                  onClick={() => handleSelectPhrase(phrase)}
                  className={`p-4 rounded-xl border text-left transition-all cursor-pointer group flex flex-col justify-between ${
                    isCurrent
                      ? 'bg-violet-950/60 border-cyan-400 shadow-md shadow-violet-900/40 ring-1 ring-cyan-400'
                      : 'bg-navy-950/60 border-slate-800 hover:border-violet-500/40 hover:bg-navy-950/90'
                  }`}
                >
                  <div>
                    {/* Header: Domain badge & confidence */}
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                        {phrase.domain}
                      </span>
                      <span className="text-[11px] font-mono text-amber-300">
                        ~{Math.round((phrase.simulatedConfidence || 0.95) * 100)}% Conf
                      </span>
                    </div>

                    {/* Main English Sentence */}
                    <h4 className="text-sm font-semibold text-white group-hover:text-cyan-200 transition-colors">
                      &ldquo;{phrase.text}&rdquo;
                    </h4>

                    {/* Secondary Hindi */}
                    {phrase.hindiText && (
                      <p className="text-xs text-slate-400 mt-1">
                        {phrase.hindiText}
                      </p>
                    )}

                    {/* ISL Physical Description */}
                    <div className="mt-2 text-[11px] text-slate-400 bg-navy-900/80 p-2 rounded-lg border border-slate-800/80">
                      <span className="text-violet-300 font-medium">Physical Sign: </span>
                      {phrase.gestureDescription}
                    </div>
                  </div>

                  {/* Card Footer: Trigger Button & Copy */}
                  <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between">
                    <span className="text-[10px] font-mono text-slate-400 truncate max-w-[150px]">
                      ISL: {phrase.islGloss}
                    </span>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={(e) => handleCopyPhrase(e, phrase)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
                        title="Copy sample text"
                      >
                        {copiedId === phrase.id ? (
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>

                      <button
                        onClick={() => handleSelectPhrase(phrase)}
                        className={`px-3 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all ${
                          isCurrent
                            ? 'bg-cyan-500 text-black font-bold'
                            : 'bg-violet-600/80 hover:bg-violet-600 text-white'
                        }`}
                      >
                        <span>{isCurrent ? 'Active' : 'Send to Studio'}</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-5 sm:px-6 py-3.5 border-t border-slate-800 bg-navy-950/70 flex items-center justify-between text-xs text-slate-400">
          <span>Click any sign to immediately populate the Live Caption panel.</span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-medium cursor-pointer"
          >
            Done
          </button>
        </div>

      </div>
    </div>
  );
}
