import React from 'react';
import { 
  Milestone, 
  CheckCircle, 
  Clock, 
  AlertCircle, 
  Activity, 
  Sparkles, 
  Smartphone, 
  Volume2, 
  Users, 
  Layers,
  HelpCircle
} from 'lucide-react';

export default function Roadmap() {
  const phases = [
    {
      phase: 'Phase 1',
      title: 'Current Prototype & Vision Foundation',
      badge: 'Active Hackathon Build',
      status: 'Current',
      items: [
        { title: 'Browser Webcam Pipeline', desc: 'Real-time 30-60 FPS camera acquisition with explicit permissions and graceful fallback.', done: true },
        { title: '21 3D Hand Landmark Tracking', desc: 'MediaPipe Tasks Vision integration with glowing skeleton canvas overlay.', done: true },
        { title: 'Heuristic Geometric Recognizer', desc: 'Static ISL rule matching for core gestures (Hello, Thank You, Peace, Yes).', done: true },
        { title: 'Presenter Demo Mode Suite', desc: 'Simulated domain scenarios for hospital, banking, and emergency presentations.', done: true },
        { title: 'Accessibility & Audio Speech', desc: 'High-contrast mode, adjustable font sizes, and Web Speech API text-to-speech output.', done: true },
      ],
    },
    {
      phase: 'Phase 2',
      title: 'ISL Dataset & Sequence Classifier',
      badge: 'Target: Q1 2027',
      status: 'Upcoming',
      items: [
        { title: 'Indian Sign Language Dataset Collection', desc: 'Curating diverse multi-signer video corpora in partnership with ISL deaf educators.', done: false },
        { title: 'Spatial-Temporal Transformer Model', desc: 'Replacing heuristic rules with lightweight ONNX/TF.js sequence model for 250+ continuous ISL vocabulary phrases.', done: false },
        { title: 'Non-Manual Feature Extraction', desc: 'Adding facial expression tracking (eyebrow raise, head tilt) vital to ISL grammar.', done: false },
        { title: 'Lighting & Skin-Tone Normalization', desc: 'Data augmentation across low-light camera feeds and diverse skin complexions.', done: false },
      ],
    },
    {
      phase: 'Phase 3',
      title: 'Mobile PWA & Bidirectional Bridge',
      badge: 'Target: Q3 2027',
      status: 'Planned',
      items: [
        { title: 'Mobile Progressive Web App (PWA)', desc: 'Optimized touch-friendly UI for Android/iOS with front and rear camera toggle.', done: false },
        { title: 'Reverse Translation (Speech-to-Sign Avatar)', desc: 'Speech recognition translates hearing person’s voice into a 3D animated signing avatar for true two-way conversation.', done: false },
        { title: 'Offline Offline-First Model Execution', desc: 'Quantized 8-bit model weights running fully offline without internet connection.', done: false },
        { title: 'Regional Dialect Support', desc: 'Configurable dialect vocabularies for North vs South Indian Sign Language variations.', done: false },
      ],
    },
  ];

  return (
    <section id="roadmap" className="py-20 md:py-28 bg-navy-950/70 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-violet-950/60 border border-violet-500/30 text-violet-300 text-xs font-semibold uppercase tracking-wider mb-4">
            Development Horizon
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight">
            Progress & Technical Roadmap
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-300 leading-relaxed">
            Honest engineering milestones. We do not display fabricated accuracy figures; unvalidated benchmark metrics are explicitly marked as not yet measured.
          </p>
        </div>

        {/* Honest Benchmark Metric Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
          
          <div className="p-4 rounded-xl bg-navy-900/80 border border-slate-800 backdrop-blur-sm">
            <div className="text-xs text-slate-400 font-medium">Landmark Latency</div>
            <div className="text-xl sm:text-2xl font-bold font-mono text-cyan-400 mt-1">
              ~15-25 ms
            </div>
            <div className="text-[11px] text-slate-500 mt-0.5">Local WASM extraction</div>
          </div>

          <div className="p-4 rounded-xl bg-navy-900/80 border border-slate-800 backdrop-blur-sm">
            <div className="text-xs text-slate-400 font-medium">Static ISL Rules</div>
            <div className="text-xl sm:text-2xl font-bold font-mono text-violet-400 mt-1">
              5 Core Signs
            </div>
            <div className="text-[11px] text-slate-500 mt-0.5">Alpha live heuristics</div>
          </div>

          <div className="p-4 rounded-xl bg-navy-900/80 border border-slate-800 backdrop-blur-sm">
            <div className="text-xs text-slate-400 font-medium">Simulated Vocabulary</div>
            <div className="text-xl sm:text-2xl font-bold font-mono text-amber-400 mt-1">
              14 Phrases
            </div>
            <div className="text-[11px] text-slate-500 mt-0.5">4 domain scenarios</div>
          </div>

          <div className="p-4 rounded-xl bg-navy-900/80 border border-slate-800 backdrop-blur-sm">
            <div className="text-xs text-slate-400 font-medium">Standardized Accuracy</div>
            <div className="text-base sm:text-lg font-bold font-mono text-slate-400 mt-1 flex items-center gap-1.5">
              <span>Not yet measured</span>
            </div>
            <div className="text-[11px] text-slate-500 mt-0.5">Awaiting ISL dataset validation</div>
          </div>

        </div>

        {/* Phase Cards Timeline */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {phases.map((p, idx) => (
            <div
              key={idx}
              className={`rounded-2xl p-6 sm:p-7 border flex flex-col justify-between transition-all backdrop-blur-sm ${
                p.status === 'Current'
                  ? 'bg-navy-900/90 border-violet-500/40 shadow-xl shadow-violet-950/30 ring-1 ring-violet-500/30'
                  : 'bg-navy-900/60 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div>
                {/* Phase Badge & Status */}
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-violet-300">
                    {p.phase}
                  </span>
                  <span
                    className={`text-[11px] px-2.5 py-0.5 rounded-full font-semibold border ${
                      p.status === 'Current'
                        ? 'bg-emerald-950 text-emerald-300 border-emerald-500/40'
                        : 'bg-slate-800 text-slate-400 border-slate-700'
                    }`}
                  >
                    {p.badge}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-white mb-5">
                  {p.title}
                </h3>

                {/* Milestone Items */}
                <ul className="space-y-3.5">
                  {p.items.map((item, itemIdx) => (
                    <li key={itemIdx} className="flex items-start gap-2.5 text-xs text-slate-300 leading-relaxed">
                      {item.done ? (
                        <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      ) : (
                        <Clock className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
                      )}
                      <div>
                        <strong className="text-white block font-medium">
                          {item.title}
                        </strong>
                        <span className="text-slate-400 text-[11px]">
                          {item.desc}
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Phase Footer */}
              <div className="mt-6 pt-4 border-t border-slate-800/80 text-[11px] text-slate-500 font-mono">
                {p.status === 'Current' ? '● Actively deployed' : '○ Scheduled sprint'}
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
