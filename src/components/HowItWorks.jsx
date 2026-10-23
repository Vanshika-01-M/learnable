import React from 'react';
import { 
  Camera, 
  Hand, 
  Binary, 
  Network, 
  FileText, 
  Volume2, 
  CheckCircle, 
  Clock, 
  Sparkles,
  ArrowRight
} from 'lucide-react';

export default function HowItWorks() {
  const steps = [
    {
      num: '01',
      title: 'Camera Capture',
      subtitle: 'Standard Video Stream',
      description: 'Acquires raw webcam video frames locally using browser MediaDevices API at 30-60 FPS without installing drivers or special gloves.',
      status: 'Implemented',
      statusType: 'success',
      icon: Camera,
      color: 'from-cyan-500 to-blue-500',
      badge: 'Local Web API'
    },
    {
      num: '02',
      title: 'Landmark Extraction',
      subtitle: '21 3D Hand Keypoints',
      description: 'MediaPipe Tasks Vision processes each frame in WebAssembly/GPU to detect 21 anatomical 3D joints per hand, tracking fingertips, knuckles, and wrist.',
      status: 'Implemented',
      statusType: 'success',
      icon: Hand,
      color: 'from-violet-500 to-cyan-400',
      badge: 'On-Device WASM'
    },
    {
      num: '03',
      title: 'Feature Normalization',
      subtitle: 'Geometry & Velocity',
      description: 'Translates raw pixel coordinates into scale-invariant vectors, calculating bone angles, finger curvature, and wrist velocity vectors.',
      status: 'Implemented (Heuristic)',
      statusType: 'success',
      icon: Binary,
      color: 'from-violet-600 to-indigo-500',
      badge: 'Spatial Vectorization'
    },
    {
      num: '04',
      title: 'Deep Sequence Model',
      subtitle: 'Temporal Transformer / Bi-LSTM',
      description: 'Classifies continuous dynamic sign phrases across multi-frame sliding windows. Evaluates spatial hand posture plus temporal trajectory.',
      status: 'Planned (Phase 2)',
      statusType: 'planned',
      icon: Network,
      color: 'from-amber-500 to-rose-500',
      badge: 'Deep Learning Model'
    },
    {
      num: '05',
      title: 'Language Layer',
      subtitle: 'ISL Grammar Translation',
      description: 'Maps Indian Sign Language grammatical glosses into natural conversational English & Hindi sentences without hallucinating or inventing meaning.',
      status: 'Planned / Simulated',
      statusType: 'planned',
      icon: FileText,
      color: 'from-emerald-500 to-teal-400',
      badge: 'NLG Grammar Filter'
    },
    {
      num: '06',
      title: 'Accessible Live Output',
      subtitle: 'Captions, Audio & History',
      description: 'Renders high-visibility captions, triggers text-to-speech (TTS) audio playback, and maintains an exportable timestamped transcript.',
      status: 'Implemented',
      statusType: 'success',
      icon: Volume2,
      color: 'from-cyan-400 to-emerald-400',
      badge: 'WCAG Accessible'
    },
  ];

  return (
    <section id="how-it-works" className="py-20 md:py-28 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-violet-950/60 border border-violet-500/30 text-violet-300 text-xs font-semibold uppercase tracking-wider mb-4">
            Computer Vision Architecture
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight">
            How Learnable Works
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-300 leading-relaxed">
            A 6-stage pipeline taking raw camera pixels to accessible spoken and written text. 
            We clearly distinguish currently implemented on-device computer vision from future deep model stages.
          </p>
        </div>

        {/* 6-Step Visual Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isImplemented = step.statusType === 'success';

            return (
              <div
                key={step.num}
                className="relative bg-navy-900/70 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between hover:border-violet-500/40 transition-all hover:shadow-xl hover:shadow-violet-950/20 group backdrop-blur-sm"
              >
                <div>
                  {/* Top Header: Step Number & Status Badge */}
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-2xl font-black font-mono bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent">
                      {step.num}
                    </span>

                    <span
                      className={`text-[11px] font-medium px-2.5 py-0.5 rounded-full border flex items-center gap-1 ${
                        isImplemented
                          ? 'bg-emerald-950/80 text-emerald-300 border-emerald-500/30'
                          : 'bg-amber-950/70 text-amber-300 border-amber-500/30'
                      }`}
                    >
                      {isImplemented ? (
                        <CheckCircle className="w-3 h-3 text-emerald-400" />
                      ) : (
                        <Clock className="w-3 h-3 text-amber-400" />
                      )}
                      <span>{step.status}</span>
                    </span>
                  </div>

                  {/* Icon & Title */}
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`p-2.5 rounded-xl bg-gradient-to-br ${step.color} text-navy-950 shadow-md group-hover:scale-105 transition-transform`}>
                      <Icon className="w-5 h-5 font-bold" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-white group-hover:text-cyan-300 transition-colors">
                        {step.title}
                      </h3>
                      <p className="text-xs text-slate-400 font-medium">
                        {step.subtitle}
                      </p>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mt-2">
                    {step.description}
                  </p>
                </div>

                {/* Bottom Chip */}
                <div className="mt-5 pt-4 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400 font-mono">
                  <span>{step.badge}</span>
                  <span className="text-slate-500 group-hover:text-slate-300 transition-colors">
                    Stage {index + 1} of 6
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Pipeline Summary Banner */}
        <div className="mt-12 p-6 rounded-2xl bg-navy-950 border border-violet-500/25 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-violet-950 text-violet-400 border border-violet-500/30 shrink-0">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">
                Independent Computer Vision & Classifier Separation
              </h4>
              <p className="text-xs text-slate-400 mt-0.5">
                Our architecture decouples raw landmark detection from sign classification. When a custom-trained ISL PyTorch model is ready, it plugs in with zero UI refactoring.
              </p>
            </div>
          </div>

          <div className="shrink-0">
            <a
              href="#workspace"
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-violet-600 hover:bg-violet-500 text-white flex items-center gap-1.5 transition-colors shadow-sm"
            >
              <span>Test Current Pipeline</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

      </div>
    </section>
  );
}
