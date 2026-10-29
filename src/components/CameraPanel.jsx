import React, { useState } from 'react';
import { 
  Video, 
  VideoOff, 
  RefreshCw, 
  Layers, 
  CheckCircle2, 
  AlertCircle, 
  ShieldCheck, 
  Hand, 
  Eye, 
  Info,
  SlidersHorizontal,
  Activity,
  Sparkles,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

export default function CameraPanel({
  cameraStatus, // 'idle' | 'initializing' | 'live' | 'error'
  errorMessage,
  isHandDetected,
  handCount,
  showLandmarks,
  setShowLandmarks,
  onStartCamera,
  onStopCamera,
  onOpenSettings,
  videoRef,
  canvasRef,
  fps = 30,
  recognitionEngine = 'heuristic', // 'heuristic' | 'model'
  modelStatus, // { state: 'idle' | 'recording' | 'predicting' | 'error', message }
}) {
  const [showGuide, setShowGuide] = useState(true);
  const isModel = recognitionEngine === 'model';

  const modelStatusStyles = {
    recording: 'border-rose-400/50 text-rose-200',
    predicting: 'border-violet-400/50 text-violet-200',
    error: 'border-amber-400/50 text-amber-200',
  }[modelStatus?.state] || 'border-slate-700/60 text-slate-300';

  // A few of the 263 INCLUDE words the pretrained model knows
  const sampleModelWords = ['Hello', 'Thank you', 'Good morning', 'How are you?', 'Mother', 'Father', 'Friend', 'Doctor', 'Hospital', 'Bank', 'Teacher'];

  const supportedLiveGestures = [
    { icon: '👋', name: 'Wave Bye', desc: 'Wave open hand side to side' },
    { icon: '✋', name: 'Hello', desc: 'Hold open palm forward' },
    { icon: '👍', name: 'Good / Thanks', desc: 'Thumb up, fingers curled' },
    { icon: '👌', name: 'OK', desc: 'Thumb & index circle, 3 up' },
    { icon: '🤟', name: 'I Love You', desc: 'Thumb, index & pinky up' },
    { icon: '🤙', name: 'Call Me', desc: 'Thumb & pinky extended' },
    { icon: '✌️', name: 'Help / Two', desc: 'Index & middle in V-shape' },
    { icon: '☝️', name: 'You / One', desc: 'Single index extended' },
    { icon: '✊', name: 'Yes', desc: 'Closed fist nod' },
    { icon: '👎', name: 'No / Disagree', desc: 'Thumb pointing down' },
  ];

  return (
    <div className="flex flex-col h-full bg-navy-900/90 rounded-2xl border border-violet-500/20 shadow-xl overflow-hidden backdrop-blur-md">
      
      {/* Studio Header Bar */}
      <div className="flex items-center justify-between px-4 sm:px-5 py-3.5 border-b border-slate-800 bg-navy-950/50">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-lg bg-violet-950/60 text-violet-400 border border-violet-500/20">
            <Video className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-white tracking-wide flex items-center gap-2">
              Camera Studio
              {cameraStatus === 'live' && (
                <span className="flex items-center gap-1.5 text-[11px] font-normal text-emerald-400 bg-emerald-950/50 px-2 py-0.5 rounded-full border border-emerald-500/30">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Live {fps ? `(${fps} FPS)` : ''}
                </span>
              )}
            </h2>
            <p className="text-[11px] text-slate-400">Webcam input & computer-vision landmark tracking</p>
          </div>
        </div>

        {/* Status Pill */}
        <div className="flex items-center gap-2">
          {cameraStatus === 'idle' && (
            <span className="text-xs px-2.5 py-1 rounded-md bg-slate-800 text-slate-300 border border-slate-700">
              Ready
            </span>
          )}
          {cameraStatus === 'initializing' && (
            <span className="text-xs px-2.5 py-1 rounded-md bg-cyan-950 text-cyan-300 border border-cyan-500/40 flex items-center gap-1.5 animate-pulse">
              <RefreshCw className="w-3 h-3 animate-spin" />
              Initializing...
            </span>
          )}
          {cameraStatus === 'live' && (
            <span className="text-xs px-2.5 py-1 rounded-md bg-emerald-950/80 text-emerald-300 border border-emerald-500/40 font-medium">
              Connected
            </span>
          )}
          {cameraStatus === 'error' && (
            <span className="text-xs px-2.5 py-1 rounded-md bg-rose-950/80 text-rose-300 border border-rose-500/40 font-medium flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              Error
            </span>
          )}
        </div>
      </div>

      {/* Video Viewport Area */}
      <div className="relative flex-1 min-h-[340px] sm:min-h-[420px] bg-navy-950 flex items-center justify-center overflow-hidden">
        
        {/* Actual Video Stream */}
        <video
          ref={videoRef}
          playsInline
          muted
          autoPlay
          className={`absolute inset-0 w-full h-full object-cover transform -scale-x-100 ${
            cameraStatus === 'live' ? 'opacity-100' : 'opacity-0 pointer-events-none'
          } transition-opacity duration-300`}
        />

        {/* Canvas Landmark Overlay */}
        <canvas
          ref={canvasRef}
          className={`absolute inset-0 w-full h-full object-cover transform -scale-x-100 pointer-events-none ${
            cameraStatus === 'live' && showLandmarks ? 'opacity-100' : 'opacity-0'
          }`}
        />

        {/* Hand Landmark Detection Pill (Overlay when live) */}
        {cameraStatus === 'live' && (
          <div className="absolute top-3 left-3 z-20 flex flex-col gap-1.5 pointer-events-none">
            {isHandDetected ? (
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-navy-900/90 border border-cyan-400/40 shadow-lg backdrop-blur-md">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-cyan-500" />
                </span>
                <span className="text-xs font-semibold text-cyan-200">
                  {handCount > 1 ? `${handCount} Hands Detected` : 'Hand Detected'}
                </span>
                <span className="text-[10px] text-slate-400 font-mono">
                  (21 Landmarks)
                </span>
              </div>
            ) : (
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-navy-900/80 border border-slate-700/60 backdrop-blur-md">
                <Hand className="w-3.5 h-3.5 text-slate-400" />
                <span className="text-xs text-slate-300">
                  Place hand in frame
                </span>
              </div>
            )}

            {isModel && modelStatus && (
              <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-navy-900/90 border backdrop-blur-md max-w-[260px] ${modelStatusStyles}`}>
                {modelStatus.state === 'recording' && <span className="w-2 h-2 rounded-full bg-rose-400 animate-pulse shrink-0" />}
                {modelStatus.state === 'predicting' && <RefreshCw className="w-3 h-3 animate-spin shrink-0" />}
                {modelStatus.state === 'error' && <AlertCircle className="w-3 h-3 shrink-0" />}
                {modelStatus.state === 'idle' && <Activity className="w-3 h-3 text-violet-300 shrink-0" />}
                <span className="text-[11px] leading-tight">{modelStatus.message}</span>
              </div>
            )}
          </div>
        )}

        {/* Landmark Overlay Indicator (Top Right) */}
        {cameraStatus === 'live' && (
          <div className="absolute top-3 right-3 z-20">
            <button
              onClick={() => setShowLandmarks(!showLandmarks)}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-medium border flex items-center gap-1.5 transition-all shadow-md backdrop-blur-md cursor-pointer ${
                showLandmarks
                  ? 'bg-cyan-950/90 text-cyan-300 border-cyan-500/50'
                  : 'bg-navy-900/80 text-slate-400 border-slate-700 hover:text-white'
              }`}
              title="Toggle glowing landmark skeleton overlay"
            >
              <Layers className="w-3.5 h-3.5" />
              <span>{showLandmarks ? 'Skeleton ON' : 'Skeleton OFF'}</span>
            </button>
          </div>
        )}

        {/* Idle Placeholder State */}
        {cameraStatus === 'idle' && (
          <div className="text-center p-6 max-w-sm z-10">
            <div className="w-16 h-16 rounded-2xl bg-navy-850 border border-slate-700/70 flex items-center justify-center mx-auto mb-4 text-slate-400 shadow-inner">
              <Video className="w-8 h-8 text-violet-400/80" />
            </div>
            <h3 className="text-base font-semibold text-white mb-1.5">
              Camera is Inactive
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed mb-5">
              Click &quot;Start Camera&quot; to allow webcam access. Video will be processed directly in your browser without uploading to any remote server.
            </p>
            <button
              onClick={onStartCamera}
              className="px-5 py-2.5 rounded-xl font-semibold text-xs bg-gradient-to-r from-violet-600 to-cyan-500 hover:from-violet-500 hover:to-cyan-400 text-white shadow-lg shadow-violet-600/30 transition-all flex items-center justify-center gap-2 mx-auto cursor-pointer"
            >
              <Video className="w-4 h-4" />
              <span>Start Camera</span>
            </button>
          </div>
        )}

        {/* Initializing State */}
        {cameraStatus === 'initializing' && (
          <div className="text-center p-6 z-10">
            <div className="w-16 h-16 rounded-2xl bg-cyan-950/40 border border-cyan-500/30 flex items-center justify-center mx-auto mb-4 text-cyan-400">
              <RefreshCw className="w-7 h-7 animate-spin" />
            </div>
            <h3 className="text-base font-semibold text-white mb-1">
              Starting Camera & Vision Models
            </h3>
            <p className="text-xs text-slate-400 max-w-xs mx-auto">
              Requesting browser permissions and loading on-device MediaPipe landmark detector...
            </p>
          </div>
        )}

        {/* Error State */}
        {cameraStatus === 'error' && (
          <div className="text-center p-6 max-w-md z-10">
            <div className="w-16 h-16 rounded-2xl bg-rose-950/50 border border-rose-500/40 flex items-center justify-center mx-auto mb-4 text-rose-400">
              <AlertCircle className="w-8 h-8" />
            </div>
            <h3 className="text-base font-semibold text-white mb-1.5">
              Camera Unavailable
            </h3>
            <p className="text-xs text-rose-300/90 leading-relaxed mb-4 bg-rose-950/30 p-3 rounded-lg border border-rose-500/20 text-left">
              {errorMessage || 'Unable to access camera. Please check browser permissions and verify that your camera is not being used by another application.'}
            </p>
            <div className="flex items-center justify-center gap-3">
              <button
                onClick={onStartCamera}
                className="px-4 py-2 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-white border border-slate-600 flex items-center gap-1.5 cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Try Again
              </button>
            </div>
          </div>
        )}

        {/* Bottom privacy pill */}
        <div className="absolute bottom-3 left-3 right-3 z-20 flex items-center justify-between pointer-events-none">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-navy-950/90 border border-slate-800 text-[11px] text-slate-300 backdrop-blur-sm">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>
              {isModel
                ? 'Zero Cloud Video — only landmarks go to your model server'
                : '100% Local Processing — Zero Cloud Video'}
            </span>
          </div>

          {cameraStatus === 'live' && (
            <div className="hidden sm:flex items-center gap-1 px-2 py-0.5 rounded bg-navy-950/80 text-[10px] text-slate-400 border border-slate-800">
              <span>{isModel ? 'ISL Model + My Signs' : 'WebAssembly Vision'}</span>
            </div>
          )}
        </div>

      </div>

      {/* Live Signs Supported Cheat Sheet Strip */}
      <div className="border-t border-slate-800/80 bg-navy-950/90 px-4 py-2">
        <div className="flex items-center justify-between mb-1.5">
          <button
            onClick={() => setShowGuide(!showGuide)}
            className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-300 hover:text-white cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-violet-400" />
            <span>{isModel ? 'ISL Model (263 Words + My Signs)' : 'Live Signs You Can Make (10+ Gestures)'}</span>
            {showGuide ? <ChevronUp className="w-3 h-3 text-slate-400" /> : <ChevronDown className="w-3 h-3 text-slate-400" />}
          </button>
          <span className="text-[10px] text-cyan-300 font-mono">
            {isModel ? 'Upper body in view, one word per sign' : 'Wave hand for Bye 👋'}
          </span>
        </div>

        {showGuide && isModel && (
          <div className="py-1 space-y-1.5">
            <p className="text-[11px] text-slate-400">
              Start with hands down, sign one word, then lower your hands. Add your own words in the My Signs panel below.
            </p>
            <div className="flex items-center gap-2 overflow-x-auto scrollbar-thin">
              {sampleModelWords.map((word) => (
                <span
                  key={word}
                  className="shrink-0 px-2.5 py-1 rounded-lg bg-navy-900 border border-slate-800 text-[11px] font-medium text-slate-200 whitespace-nowrap"
                >
                  {word}
                </span>
              ))}
            </div>
          </div>
        )}

        {showGuide && !isModel && (
          <div className="flex items-center gap-2 overflow-x-auto py-1 scrollbar-thin">
            {supportedLiveGestures.map((g, idx) => (
              <div
                key={idx}
                className="shrink-0 flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-navy-900 border border-slate-800 text-left text-xs text-slate-200"
                title={g.desc}
              >
                <span className="text-sm">{g.icon}</span>
                <span className="font-medium whitespace-nowrap text-[11px]">{g.name}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Studio Footer Controls */}
      <div className="px-4 sm:px-5 py-3 border-t border-slate-800 bg-navy-950/60 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          {cameraStatus === 'live' ? (
            <button
              onClick={onStopCamera}
              className="px-4 py-2 rounded-lg text-xs font-semibold bg-rose-600/90 hover:bg-rose-600 text-white shadow-md shadow-rose-900/30 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <VideoOff className="w-3.5 h-3.5" />
              <span>Stop Camera</span>
            </button>
          ) : (
            <button
              onClick={onStartCamera}
              disabled={cameraStatus === 'initializing'}
              className="px-4 py-2 rounded-lg text-xs font-semibold bg-gradient-to-r from-violet-600 to-cyan-500 hover:from-violet-500 hover:to-cyan-400 text-white shadow-md transition-all flex items-center gap-1.5 disabled:opacity-50 cursor-pointer"
            >
              <Video className="w-3.5 h-3.5" />
              <span>Start Camera</span>
            </button>
          )}

          <button
            onClick={() => setShowLandmarks(!showLandmarks)}
            disabled={cameraStatus !== 'live'}
            className={`px-3 py-2 rounded-lg text-xs font-medium border flex items-center gap-1.5 transition-colors cursor-pointer ${
              showLandmarks && cameraStatus === 'live'
                ? 'bg-slate-800 text-cyan-300 border-cyan-500/40'
                : 'text-slate-400 border-slate-800 hover:text-slate-200 disabled:opacity-40'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Overlay</span>
          </button>
        </div>

        {/* Crucial Ethical / Technical Disclaimer Note */}
        <div className="text-[11px] text-slate-400 flex items-center gap-1.5 max-w-xs">
          <Info className="w-3.5 h-3.5 text-violet-400 shrink-0" />
          <span className="truncate" title="Landmark detection tracks joints; translation occurs via the classifier.">
            Landmarks track joints; sign translation is separate.
          </span>
        </div>
      </div>

    </div>
  );
}
