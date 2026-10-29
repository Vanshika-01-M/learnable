import React from 'react';
import { 
  Sparkles, 
  ShieldCheck, 
  Cpu, 
  Eye, 
  Accessibility 
} from 'lucide-react';

export default function HeroSection({ onTryDemo }) {
  return (
    <section id="hero" className="relative pt-12 pb-16 md:pt-20 md:pb-24 overflow-hidden">
      {/* Background radial gradient glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[350px] bg-gradient-to-tr from-violet-600/15 via-cyan-500/10 to-transparent blur-3xl pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        
        {/* Hackathon Showcase Pill */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/90 border border-violet-500/30 text-violet-300 text-xs font-medium mb-6 shadow-sm shadow-violet-900/40">
          <span className="flex h-2 w-2 rounded-full bg-cyan-400 animate-ping" />
          <span className="font-semibold text-white">InnoTech 2026 Showcase</span>
          <span className="text-slate-500">•</span>
          <span>Indian Sign Language (ISL) Prototype</span>
        </div>

        {/* Main Title */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-white max-w-4xl mx-auto leading-[1.12]">
          Communication{' '}
          <span className="bg-gradient-to-r from-violet-400 via-cyan-300 to-violet-300 bg-clip-text text-transparent">
            without barriers.
          </span>
        </h1>

        {/* Subtitle */}
        <p className="mt-6 text-lg sm:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed font-normal">
          Turn signs into words and make everyday conversations more accessible. 
          Real-time sign language translation powered by on-device computer vision — no special gloves or wearable hardware required.
        </p>

        {/* Action Buttons */}
        <div className="mt-9 flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto">

          <button
            onClick={onTryDemo}
            className="w-full sm:w-auto px-6 py-3.5 rounded-xl font-semibold text-sm bg-navy-850 hover:bg-navy-800 text-slate-200 hover:text-white border border-slate-700/80 hover:border-violet-500/50 transition-all flex items-center justify-center gap-2 shadow-sm cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-violet-400" />
            <span>Try Demo</span>
          </button>
        </div>

        {/* Feature Highlights Grid */}
        <div className="mt-14 grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 max-w-4xl mx-auto text-left">
          
          <div className="p-3.5 rounded-xl bg-navy-900/60 border border-slate-800/80 backdrop-blur-sm flex items-start gap-3">
            <div className="p-2 rounded-lg bg-cyan-950/60 text-cyan-400 border border-cyan-500/20 shrink-0">
              <Eye className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-semibold text-white">Standard Webcam</div>
              <div className="text-[11px] text-slate-400 mt-0.5">Runs on any laptop or phone camera</div>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-navy-900/60 border border-slate-800/80 backdrop-blur-sm flex items-start gap-3">
            <div className="p-2 rounded-lg bg-violet-950/60 text-violet-400 border border-violet-500/20 shrink-0">
              <Cpu className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-semibold text-white">Local Vision</div>
              <div className="text-[11px] text-slate-400 mt-0.5">21 3D hand landmarks via MediaPipe</div>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-navy-900/60 border border-slate-800/80 backdrop-blur-sm flex items-start gap-3">
            <div className="p-2 rounded-lg bg-emerald-950/60 text-emerald-400 border border-emerald-500/20 shrink-0">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-semibold text-white">100% Private</div>
              <div className="text-[11px] text-slate-400 mt-0.5">Video never leaves your device</div>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-navy-900/60 border border-slate-800/80 backdrop-blur-sm flex items-start gap-3">
            <div className="p-2 rounded-lg bg-amber-950/60 text-amber-400 border border-amber-500/20 shrink-0">
              <Accessibility className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-semibold text-white">Accessibility First</div>
              <div className="text-[11px] text-slate-400 mt-0.5">Readable captions, TTS & transcript export</div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
