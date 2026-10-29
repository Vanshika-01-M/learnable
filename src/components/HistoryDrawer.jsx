import React from 'react';
import { 
  X, 
  FileText, 
  Download, 
  Trash2, 
  Copy, 
  Check, 
  Clock, 
  Sparkles, 
  Activity,
  Layers
} from 'lucide-react';

export default function HistoryDrawer({
  isOpen,
  onClose,
  history = [],
  onClearHistory,
  onDownloadTranscript,
  onCopyPhrase,
}) {
  const [copiedId, setCopiedId] = React.useState(null);

  if (!isOpen) return null;

  const handleCopy = (item) => {
    onCopyPhrase(item.text);
    setCopiedId(item.id);
    setTimeout(() => setCopiedId(null), 1800);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-navy-950/70 backdrop-blur-sm animate-fadeIn">
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-navy-900 border-l border-violet-500/20 shadow-2xl flex flex-col">
          
          {/* Drawer Header */}
          <div className="px-5 py-4 border-b border-slate-800 bg-navy-950 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 rounded-lg bg-cyan-950 text-cyan-400 border border-cyan-500/30">
                <FileText className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">
                  Session Transcript History
                </h3>
                <p className="text-[11px] text-slate-400">
                  {history.length} {history.length === 1 ? 'phrase' : 'phrases'} recorded
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Action Toolbar */}
          <div className="px-5 py-2.5 bg-navy-950/60 border-b border-slate-800 flex items-center justify-between">
            <button
              onClick={onDownloadTranscript}
              disabled={history.length === 0}
              className="px-3 py-1.5 rounded-lg text-xs font-medium bg-navy-850 hover:bg-navy-800 text-slate-200 border border-slate-700 flex items-center gap-1.5 disabled:opacity-40"
            >
              <Download className="w-3.5 h-3.5 text-emerald-400" />
              <span>Download .TXT</span>
            </button>

            <button
              onClick={onClearHistory}
              disabled={history.length === 0}
              className="px-3 py-1.5 rounded-lg text-xs font-medium text-slate-400 hover:text-rose-300 hover:bg-rose-950/40 border border-transparent hover:border-rose-500/30 flex items-center gap-1.5 disabled:opacity-40"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear All</span>
            </button>
          </div>

          {/* History List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {history.length === 0 ? (
              <div className="text-center py-16 text-slate-500">
                <FileText className="w-10 h-10 mx-auto mb-3 opacity-40" />
                <p className="text-sm text-slate-400">No phrases recorded yet.</p>
                <p className="text-xs text-slate-500 mt-1">
                  Signs recognized via webcam or triggered in demo mode will appear here.
                </p>
              </div>
            ) : (
              history.slice().reverse().map((item, index) => {
                const isDemo = item.source === 'demo';

                return (
                  <div
                    key={item.id || index}
                    className="p-3.5 rounded-xl bg-navy-950/80 border border-slate-800 hover:border-slate-700 transition-colors"
                  >
                    <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1.5">
                      <div className="flex items-center gap-1 font-mono">
                        <Clock className="w-3 h-3 text-slate-500" />
                        <span>{item.timestamp}</span>
                      </div>

                      <span
                        className={`px-1.5 py-0.5 rounded text-[10px] font-medium border ${
                          isDemo
                            ? 'bg-amber-950/50 text-amber-300 border-amber-500/30'
                            : 'bg-cyan-950/50 text-cyan-300 border-cyan-500/30'
                        }`}
                      >
                        {isDemo ? 'Demo' : item.source === 'sentence' ? 'Sentence' : 'Vision'} {item.confidence ? `• ${Math.round(item.confidence * 100)}%` : ''}
                      </span>
                    </div>

                    <p className="text-sm text-white font-medium mb-1">
                      &ldquo;{item.text}&rdquo;
                    </p>

                    {item.hindiText && (
                      <p className="text-xs text-cyan-300/80 mb-2">
                        {item.hindiText}
                      </p>
                    )}

                    <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 text-[10px] text-slate-400">
                      <span>{item.islGloss ? `ISL: ${item.islGloss}` : 'Indian Sign Language'}</span>

                      <button
                        onClick={() => handleCopy(item)}
                        className="p-1 rounded text-slate-400 hover:text-white flex items-center gap-1"
                        title="Copy text"
                      >
                        {copiedId === item.id ? (
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                        <span>{copiedId === item.id ? 'Copied' : 'Copy'}</span>
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Drawer Footer */}
          <div className="p-4 border-t border-slate-800 bg-navy-950 text-xs text-slate-400 flex items-center justify-between">
            <span>Local session storage only</span>
            <button
              onClick={onClose}
              className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-medium"
            >
              Close
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
