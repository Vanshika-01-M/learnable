import React, { useState } from 'react';
import {
  Hand,
  Circle,
  Square,
  Trash2,
  RefreshCw,
  AlertCircle,
  Video,
  Info,
} from 'lucide-react';

const SAMPLES_PER_RECORDING = 5;

export default function MySignsPanel({
  words = [],
  error,
  cameraLive,
  recordingSign, // { label, saved, count } while recording
  onRecord,
  onCancelRecording,
  onDelete,
  onRefresh,
  onlyCustomSigns,
  setOnlyCustomSigns,
  onStartCamera,
}) {
  const [label, setLabel] = useState('');
  const [hindi, setHindi] = useState('');
  const [confirmDelete, setConfirmDelete] = useState(null);

  const trimmed = label.trim();
  const existing = words.find(w => w.label.toLowerCase() === trimmed.toLowerCase());
  const totalSamples = words.reduce((sum, w) => sum + w.samples, 0);

  const handleRecord = (e) => {
    e.preventDefault();
    if (!trimmed || recordingSign) return;
    onRecord(trimmed, hindi.trim(), SAMPLES_PER_RECORDING);
  };

  return (
    <div className="bg-navy-900/90 rounded-2xl border border-violet-500/20 shadow-xl overflow-hidden backdrop-blur-md">

      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 sm:px-5 py-3.5 border-b border-slate-800 bg-navy-950/50">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-lg bg-violet-950/60 text-violet-400 border border-violet-500/20">
            <Hand className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-white tracking-wide">My Signs</h2>
            <p className="text-[11px] text-slate-400">
              Teach Learnable your own words: record a sign 5 times and it is recognized right away
            </p>
          </div>
        </div>

        <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={onlyCustomSigns}
            onChange={(e) => setOnlyCustomSigns(e.target.checked)}
            className="w-4 h-4 accent-cyan-400 cursor-pointer"
          />
          <span>Only recognize my signs</span>
        </label>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-4 sm:p-5">

        {/* Record a sign */}
        <form onSubmit={handleRecord} className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <div className="space-y-1">
              <label htmlFor="my-sign-word" className="text-[11px] font-semibold text-slate-300">Word or phrase</label>
              <input
                id="my-sign-word"
                value={label}
                onChange={(e) => setLabel(e.target.value)}
                maxLength={40}
                placeholder="e.g. Water"
                disabled={!!recordingSign}
                className="w-full px-3 py-2 rounded-xl bg-navy-950 border border-slate-800 text-xs text-white focus:border-cyan-500 focus:outline-none disabled:opacity-50"
              />
            </div>
            <div className="space-y-1">
              <label htmlFor="my-sign-hindi" className="text-[11px] font-semibold text-slate-300">Hindi (optional)</label>
              <input
                id="my-sign-hindi"
                value={hindi}
                onChange={(e) => setHindi(e.target.value)}
                maxLength={80}
                placeholder="e.g. पानी"
                disabled={!!recordingSign}
                className="w-full px-3 py-2 rounded-xl bg-navy-950 border border-slate-800 text-xs text-white focus:border-cyan-500 focus:outline-none disabled:opacity-50"
              />
            </div>
          </div>

          {recordingSign ? (
            <div className="p-3 rounded-xl bg-rose-950/30 border border-rose-500/30 space-y-2">
              <div className="flex items-center justify-between gap-3">
                <span className="flex items-center gap-2 text-xs font-semibold text-rose-200">
                  <span className="w-2 h-2 rounded-full bg-rose-400 animate-pulse" />
                  Recording &ldquo;{recordingSign.label}&rdquo;: {recordingSign.saved} of {recordingSign.count} saved
                </span>
                <button
                  type="button"
                  onClick={onCancelRecording}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-white border border-slate-600 flex items-center gap-1.5 cursor-pointer"
                >
                  <Square className="w-3 h-3" />
                  Stop
                </button>
              </div>
              <div className="h-1.5 rounded-full bg-navy-950 overflow-hidden">
                <div
                  className="h-full bg-rose-400 transition-all"
                  style={{ width: `${(recordingSign.saved / recordingSign.count) * 100}%` }}
                />
              </div>
              <p className="text-[11px] text-slate-400">
                Hands down, sign the word, hands down again. Repeat until all samples are saved.
              </p>
            </div>
          ) : cameraLive ? (
            <button
              type="submit"
              disabled={!trimmed}
              className="w-full px-4 py-2.5 rounded-xl font-semibold text-xs bg-gradient-to-r from-violet-600 to-cyan-500 hover:from-violet-500 hover:to-cyan-400 text-white shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-40 cursor-pointer"
            >
              <Circle className="w-3.5 h-3.5 fill-current" />
              <span>
                {existing
                  ? `Record ${SAMPLES_PER_RECORDING} more samples of "${existing.label}"`
                  : `Record ${SAMPLES_PER_RECORDING} samples${trimmed ? ` of "${trimmed}"` : ''}`}
              </span>
            </button>
          ) : (
            <button
              type="button"
              onClick={onStartCamera}
              className="w-full px-4 py-2.5 rounded-xl font-semibold text-xs bg-slate-800 hover:bg-slate-700 text-white border border-slate-600 flex items-center justify-center gap-2 cursor-pointer"
            >
              <Video className="w-3.5 h-3.5" />
              <span>Start the camera to record signs</span>
            </button>
          )}

          <div className="flex items-start gap-2 text-[11px] text-slate-400">
            <Info className="w-3.5 h-3.5 text-violet-400 shrink-0 mt-0.5" />
            <span>
              Record at least 2 words, 5 samples each. Samples from several people make a word work for everyone.
              You can also re-record built-in words (like Hello) so they match how you sign them.
              Only landmark points are saved, on the computer running the model server.
            </span>
          </div>
        </form>

        {/* Recorded words */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-300">
              Recorded words ({words.length}, {totalSamples} samples)
            </span>
            <button
              type="button"
              onClick={onRefresh}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer"
              title="Reload from the model server"
              aria-label="Reload recorded words"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          </div>

          {error && (
            <p className="text-[11px] text-rose-300 flex items-start gap-1.5">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              <span>{error}</span>
            </p>
          )}

          {words.length === 0 ? (
            <p className="text-xs text-slate-500 py-6 text-center border border-dashed border-slate-800 rounded-xl">
              No signs recorded yet.
            </p>
          ) : (
            <ul className="max-h-56 overflow-y-auto space-y-1.5 pr-1 scrollbar-thin">
              {words.map((w) => (
                <li
                  key={w.label}
                  className="flex items-center justify-between gap-2 px-3 py-2 rounded-xl bg-navy-950 border border-slate-800"
                >
                  <button
                    type="button"
                    onClick={() => setLabel(w.label)}
                    disabled={!!recordingSign}
                    className="text-left min-w-0 cursor-pointer disabled:cursor-default"
                    title="Record more samples of this word"
                  >
                    <span className="block text-xs font-medium text-white truncate">{w.label}</span>
                    {w.hindi && <span className="block text-[11px] text-cyan-300 truncate">{w.hindi}</span>}
                  </button>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded border ${
                      w.samples >= SAMPLES_PER_RECORDING
                        ? 'text-emerald-300 border-emerald-500/30 bg-emerald-950/40'
                        : 'text-amber-300 border-amber-500/30 bg-amber-950/40'
                    }`}>
                      {w.samples} {w.samples === 1 ? 'sample' : 'samples'}
                    </span>
                    {confirmDelete === w.label ? (
                      <button
                        type="button"
                        onClick={() => { onDelete(w.label); setConfirmDelete(null); }}
                        className="px-2 py-1 rounded-lg text-[10px] font-semibold bg-rose-600 hover:bg-rose-500 text-white cursor-pointer"
                      >
                        Delete?
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setConfirmDelete(w.label)}
                        disabled={!!recordingSign}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-300 hover:bg-slate-800 cursor-pointer disabled:opacity-40"
                        title={`Delete all samples of "${w.label}"`}
                        aria-label={`Delete ${w.label}`}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
