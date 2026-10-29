import React from 'react';
import { ShieldCheck, Sparkles } from 'lucide-react';

export default function Footer({ onOpenDemo }) {
  return (
    <footer className="bg-navy-950 border-t border-slate-800 text-slate-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          
          {/* Brand Col */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-violet-600 to-cyan-400 p-0.5 shadow-md">
                <div className="w-full h-full bg-navy-900 rounded-[6px] flex items-center justify-center">
                  <svg className="w-4 h-4 text-cyan-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 11V6a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v0"/>
                    <path d="M14 10V4a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v2"/>
                    <path d="M10 10.5V6a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v8"/>
                    <path d="M18 8a2 2 0 1 1 4 0v6a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.82L7 15"/>
                  </svg>
                </div>
              </div>
              <span className="text-lg font-bold text-white tracking-tight">
                Learnable
              </span>
              <span className="text-[10px] uppercase font-semibold px-1.5 py-0.5 rounded bg-violet-500/20 text-violet-300 border border-violet-500/30">
                ISL
              </span>
            </div>
            <p className="text-slate-400 max-w-sm leading-relaxed">
              Real-time sign language translation web prototype for Indian Sign Language (ISL), powered by client-side computer vision without wearable gloves.
            </p>
            <p className="text-[11px] text-cyan-300/80 font-medium">
              &ldquo;Sign it. See it.&rdquo;
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-2.5">
            <div className="text-white font-semibold uppercase tracking-wider text-[11px]">
              Platform Navigation
            </div>
            <ul className="space-y-2">
              <li><a href="#hero" className="hover:text-white transition-colors">Overview</a></li>
              <li><a href="#workspace" className="hover:text-white transition-colors">Live Studio</a></li>
              <li><a href="?page=how-it-works" className="hover:text-white transition-colors">How It Works</a></li>
              <li><a href="?page=use-cases" className="hover:text-white transition-colors">Use Cases</a></li>
              <li><a href="?page=roadmap" className="hover:text-white transition-colors">Roadmap</a></li>
            </ul>
          </div>

          {/* Help & Support */}
          <div className="space-y-2.5">
            <div className="text-slate-900 font-semibold uppercase tracking-wider text-[11px]">Help & Support</div>
            <ul className="space-y-2">
              <li><a href="?page=support" className="hover:text-violet-700 transition-colors">Support</a></li>
              <li><a href="?page=contact" className="hover:text-violet-700 transition-colors">Contact</a></li>
              <li><a href="?page=faqs" className="hover:text-violet-700 transition-colors">FAQs</a></li>
              <li><a href="?page=privacy" className="hover:text-violet-700 transition-colors">Privacy</a></li>
            </ul>
          </div>

          {/* Hackathon Credentials */}
          <div className="space-y-2.5">
            <div className="text-white font-semibold uppercase tracking-wider text-[11px]">
              InnoTech 2026 Showcase
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Submitted as an accessibility innovation prototype for deaf & hearing community inclusion.
            </p>
            <button
              onClick={onOpenDemo}
              className="mt-2 px-3 py-1.5 rounded-lg bg-violet-950 text-violet-300 hover:text-white border border-violet-500/30 hover:border-violet-400 text-xs font-semibold flex items-center gap-1.5 transition-all"
            >
              <Sparkles className="w-3.5 h-3.5 text-violet-400" />
              <span>Try Demo</span>
            </button>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>100% Client-Side Processing • No Biometric Data Stored</span>
          </div>

          <div>
            Built with React, Vite, MediaPipe & Tailwind CSS • InnoTech Prototype
          </div>
        </div>

      </div>
    </footer>
  );
}
