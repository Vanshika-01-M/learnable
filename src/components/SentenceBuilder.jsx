import React from 'react';
import { MessageSquareText, Sparkles, Undo2, X, RefreshCw, AlertCircle } from 'lucide-react';

export default function SentenceBuilder({
  words = [],
  status, // { state: 'working' | 'error', message }
  autoTranslate,
  setAutoTranslate,
  autoDelaySeconds = 2,
  onMakeSentence,
  onUndo,
  onClear,
}) {
  const working = status?.state === 'working';

  return (
    <div className="bg-navy-900/90 rounded-2xl border border-violet-500/20 shadow-xl overflow-hidden backdrop-blur-md">
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 sm:px-5 py-3.5 border-b border-slate-800 bg-navy-950/50">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-lg bg-cyan-950/60 text-cyan-400 border border-cyan-500/20">
            <MessageSquareText className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-white tracking-wide">Sentence Builder</h2>
            <p className="text-[11px] text-slate-400">
              Sign several words; Groq AI translates them into an English sentence and Hindi
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer select-none mr-1">
            <input
              type="checkbox"
              checked={autoTranslate}
              onChange={(e) => setAutoTranslate(e.target.checked)}
              className="w-4 h-4 accent-cyan-400 cursor-pointer"
            />
            <span>Auto-translate when I pause</span>
          </label>
          <button
            type="button"
            onClick={onUndo}
            disabled={words.length === 0 || working}
            className="px-3 py-1.5 rounded-lg text-xs font-medium border border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800 flex items-center gap-1.5 disabled:opacity-40 cursor-pointer"
            title="Remove the last word"
          >
            <Undo2 className="w-3.5 h-3.5" />
            <span>Undo</span>
          </button>
          <button
            type="button"
            onClick={onClear}
            disabled={words.length === 0 || working}
            className="px-3 py-1.5 rounded-lg text-xs font-medium border border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800 flex items-center gap-1.5 disabled:opacity-40 cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
            <span>Clear</span>
          </button>
          <button
            type="button"
            onClick={onMakeSentence}
            disabled={words.length === 0 || working}
            className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-gradient-to-r from-violet-600 to-cyan-500 hover:from-violet-500 hover:to-cyan-400 text-white shadow-md flex items-center gap-1.5 disabled:opacity-40 cursor-pointer"
          >
            {working ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
            <span>{working ? 'Translating...' : 'Translate now'}</span>
          </button>
        </div>
      </div>

      <div className="px-4 sm:px-5 py-3 space-y-2">
        {words.length === 0 ? (
          <p className="text-xs text-slate-500">
            Recognized words collect here, in the order you sign them.
            {autoTranslate && ` When you stop signing for ${autoDelaySeconds} seconds, they are translated automatically.`}
          </p>
        ) : (
          <div className="flex flex-wrap items-center gap-2">
            {words.map((word, i) => (
              <span
                key={`${word}-${i}`}
                className="px-2.5 py-1 rounded-lg bg-navy-950 border border-slate-800 text-xs font-medium text-slate-100"
              >
                {word}
              </span>
            ))}
          </div>
        )}

        {words.length > 0 && autoTranslate && !status && (
          <p className="text-[11px] text-slate-400">
            Keep signing to add words. Translating {autoDelaySeconds} seconds after your last sign...
          </p>
        )}

        {status?.state === 'error' && (
          <p className="text-[11px] text-rose-300 flex items-start gap-1.5">
            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
            <span>{status.message}</span>
          </p>
        )}
      </div>
    </div>
  );
}
