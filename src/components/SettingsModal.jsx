import React from 'react';
import { 
  X, 
  Sliders, 
  Camera, 
  Volume2, 
  Layers, 
  CheckCircle2, 
  Palette,
  Shield
} from 'lucide-react';

export default function SettingsModal({
  isOpen,
  onClose,
  videoDevices = [],
  selectedDeviceId,
  setSelectedDeviceId,
  overlayColor,
  setOverlayColor,
  speechRate,
  setSpeechRate,
  resolution,
  setResolution,
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/80 backdrop-blur-md animate-fadeIn">
      <div 
        className="w-full max-w-lg bg-navy-900 border border-violet-500/30 rounded-2xl shadow-2xl overflow-hidden flex flex-col"
        role="dialog"
        aria-labelledby="settings-title"
      >
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-800 bg-navy-950/70 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-violet-950 text-violet-400 border border-violet-500/30">
              <Sliders className="w-4 h-4" />
            </div>
            <div>
              <h3 id="settings-title" className="text-sm font-bold text-white">
                Studio & Vision Settings
              </h3>
              <p className="text-[11px] text-slate-400">Configure camera device, vision styling, and audio</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Settings Body */}
        <div className="p-5 sm:p-6 space-y-6 overflow-y-auto max-h-[75vh]">
          
          {/* Camera Device Selection */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-white flex items-center gap-2">
              <Camera className="w-3.5 h-3.5 text-cyan-400" />
              <span>Camera Input Device</span>
            </label>
            <select
              value={selectedDeviceId || ''}
              onChange={(e) => setSelectedDeviceId(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-navy-950 border border-slate-800 text-xs text-white focus:border-cyan-500 focus:outline-none"
            >
              <option value="">Default Front Webcam</option>
              {videoDevices.map((d, idx) => (
                <option key={d.deviceId || idx} value={d.deviceId}>
                  {d.label || `Camera ${idx + 1}`}
                </option>
              ))}
            </select>
            <p className="text-[11px] text-slate-400">
              Select your integrated webcam or external USB video capture card.
            </p>
          </div>

          {/* Camera Resolution */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-white flex items-center gap-2">
              <Sliders className="w-3.5 h-3.5 text-violet-400" />
              <span>Camera Resolution</span>
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: '720p', label: '720p HD', desc: 'Balanced (30 FPS)' },
                { id: '1080p', label: '1080p FHD', desc: 'High Detail' },
                { id: '480p', label: '480p SD', desc: 'Low Latency' },
              ].map(res => (
                <button
                  key={res.id}
                  onClick={() => setResolution(res.id)}
                  className={`p-2.5 rounded-xl border text-left transition-all ${
                    resolution === res.id
                      ? 'bg-violet-950/80 border-cyan-400 text-white shadow-sm'
                      : 'bg-navy-950 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  <div className="text-xs font-semibold">{res.label}</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">{res.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Landmark Overlay Theme */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-white flex items-center gap-2">
              <Palette className="w-3.5 h-3.5 text-cyan-400" />
              <span>Skeleton Overlay Color</span>
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'cyan', label: 'Neon Cyan', color: '#22D3EE' },
                { id: 'violet', label: 'Electric Violet', color: '#A78BFA' },
                { id: 'emerald', label: 'Emerald Mint', color: '#34D399' },
              ].map(theme => (
                <button
                  key={theme.id}
                  onClick={() => setOverlayColor(theme.id)}
                  className={`p-2.5 rounded-xl border flex items-center gap-2 transition-all ${
                    overlayColor === theme.id
                      ? 'bg-navy-950 border-cyan-400 text-white'
                      : 'bg-navy-950 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  <span 
                    className="w-3.5 h-3.5 rounded-full shrink-0" 
                    style={{ backgroundColor: theme.color }}
                  />
                  <span className="text-xs font-medium">{theme.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Text-to-Speech Speed */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-white flex items-center gap-2">
                <Volume2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Text-to-Speech Speed ({speechRate}x)</span>
              </label>
              <span className="text-[11px] font-mono text-slate-400">
                {speechRate === 1.0 ? 'Normal' : speechRate < 1 ? 'Slow' : 'Fast'}
              </span>
            </div>
            <input
              type="range"
              min="0.7"
              max="1.4"
              step="0.05"
              value={speechRate}
              onChange={(e) => setSpeechRate(parseFloat(e.target.value))}
              className="w-full accent-cyan-400 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>0.7x (Clear)</span>
              <span>1.0x (Standard)</span>
              <span>1.4x (Brisk)</span>
            </div>
          </div>

          {/* Privacy Note */}
          <div className="p-3 rounded-xl bg-navy-950 border border-slate-800 flex items-start gap-2.5 text-xs text-slate-400">
            <Shield className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <span>Preferences are stored only locally in your browser session. No tracking cookies are used.</span>
          </div>

        </div>

        {/* Footer */}
        <div className="px-5 py-3.5 border-t border-slate-800 bg-navy-950/70 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-semibold transition-colors"
          >
            Apply & Close
          </button>
        </div>
      </div>
    </div>
  );
}
