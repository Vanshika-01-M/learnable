import React from 'react';
import { 
  ShieldCheck, 
  Lock, 
  EyeOff, 
  FileCheck, 
  AlertTriangle, 
  Accessibility, 
  CheckCircle2, 
  Layers 
} from 'lucide-react';

export default function PrivacySection() {
  return (
    <section id="privacy" className="py-20 md:py-28 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-950/60 border border-emerald-500/30 text-emerald-300 text-xs font-semibold uppercase tracking-wider mb-4">
            Security & Accessibility Ethics
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight">
            Privacy First. Accessibility Always.
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-300 leading-relaxed">
            Assistive tools must safeguard personal privacy. Learnable runs vision algorithms right in your browser, leaving your biometric camera data entirely in your hands.
          </p>
        </div>

        {/* 3 Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          
          {/* Pillar 1: 100% On-Device Processing */}
          <div className="bg-navy-900/80 border border-slate-800 rounded-2xl p-6 hover:border-emerald-500/30 transition-all backdrop-blur-sm">
            <div className="w-12 h-12 rounded-xl bg-emerald-950/80 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-5">
              <Lock className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">
              Zero Cloud Video Uploads
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Video streams acquired through <code className="text-violet-300 font-mono">getUserMedia</code> are processed strictly in your local device memory using WebAssembly. No video frames are ever recorded, streamed, or uploaded to any remote server.
            </p>
            <div className="mt-4 flex items-center gap-2 text-xs text-emerald-300 font-medium">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Full air-gapped camera isolation</span>
            </div>
          </div>

          {/* Pillar 2: Explicit On-Demand Permission */}
          <div className="bg-navy-900/80 border border-slate-800 rounded-2xl p-6 hover:border-violet-500/30 transition-all backdrop-blur-sm">
            <div className="w-12 h-12 rounded-xl bg-violet-950/80 border border-violet-500/30 flex items-center justify-center text-violet-400 mb-5">
              <EyeOff className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">
              Explicit User Consent
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              We never invoke camera permissions on page load. The browser prompts you only after you explicitly click &ldquo;Start Camera&rdquo;. Stopping the camera immediately halts all media tracks and powers down the camera LED.
            </p>
            <div className="mt-4 flex items-center gap-2 text-xs text-violet-300 font-medium">
              <CheckCircle2 className="w-4 h-4 text-violet-400 shrink-0" />
              <span>Instant hardware track termination</span>
            </div>
          </div>

          {/* Pillar 3: Accessibility WCAG 2.1 AA */}
          <div className="bg-navy-900/80 border border-slate-800 rounded-2xl p-6 hover:border-cyan-500/30 transition-all backdrop-blur-sm">
            <div className="w-12 h-12 rounded-xl bg-cyan-950/80 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mb-5">
              <Accessibility className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">
              Inclusive WCAG 2.1 Compliance
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Built for diverse access needs: high-contrast stark visual mode for low vision, adjustable font scaling, keyboard-first navigation with visible focus indicators, and screen-reader live announcements.
            </p>
            <div className="mt-4 flex items-center gap-2 text-xs text-cyan-300 font-medium">
              <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
              <span>Audible Text-to-Speech integration</span>
            </div>
          </div>

        </div>

        {/* Ethical Assistive Disclaimer Banner */}
        <div className="p-6 sm:p-7 rounded-2xl bg-navy-950 border border-amber-500/30 flex flex-col sm:flex-row items-start gap-4">
          <div className="p-3 rounded-xl bg-amber-950/80 text-amber-400 border border-amber-500/30 shrink-0">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div className="space-y-2">
            <h4 className="text-base font-bold text-white flex items-center gap-2">
              Assistive Technology Prototype Notice
              <span className="text-xs font-normal text-amber-300 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-500/20">
                Ethical Standard
              </span>
            </h4>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Learnable is an assistive prototype intended for informal dialogue and hackathon evaluation. 
              <strong> It is not a certified substitute for qualified human sign language interpreters</strong> in legal, high-stakes medical, diagnostic, or court proceedings. Human interpreters remain indispensable for nuanced, idiomatic sign expression.
            </p>
            <div className="text-xs text-slate-400 pt-1">
              Transparent AI principle: Never overstate algorithmic capabilities or claim 100% accuracy without standardized medical/legal validation.
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
