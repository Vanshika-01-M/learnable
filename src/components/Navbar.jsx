import React, { useState } from 'react';
import { 
  Sparkles, 
  Sun, 
  Moon, 
  Video, 
  Menu, 
  X, 
  Sliders, 
  Activity, 
  HelpCircle, 
  ShieldCheck, 
  Milestone,
  Layers,
  BookOpen
} from 'lucide-react';

export default function Navbar({ 
  onStartSigning, 
  onOpenDemo, 
  onOpenSettings,
  onOpenLibrary,
  highContrast, 
  toggleHighContrast,
  activeSection,
  setActiveSection,
  signCount = 0,
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const scrollToSection = (id) => {
    setActiveSection(id);
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-navy-950/85 backdrop-blur-md border-b border-violet-500/15">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Logo & Tagline */}
          <div className="flex items-center gap-3">
            <button 
              onClick={() => scrollToSection('hero')}
              className="flex items-center gap-3.5 group focus:outline-none cursor-pointer"
              aria-label="Learnable Home"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-violet-600 to-cyan-400 p-0.5 shadow-lg shadow-violet-500/25 group-hover:scale-105 transition-transform duration-200">
                <div className="w-full h-full bg-navy-900 rounded-[10px] flex items-center justify-center">
                  <svg className="w-5 h-5 text-cyan-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 11V6a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v0"/>
                    <path d="M14 10V4a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v2"/>
                    <path d="M10 10.5V6a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v8"/>
                    <path d="M18 8a2 2 0 1 1 4 0v6a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.82L7 15"/>
                  </svg>
                </div>
              </div>

              <div className="flex flex-col text-left">
                <div className="flex items-center gap-1.5">
                  <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-white via-slate-100 to-violet-200 bg-clip-text text-transparent">
                    Learnable
                  </span>
                  <span className="text-[10px] uppercase font-semibold tracking-wider px-1.5 py-0.5 rounded bg-violet-500/20 text-violet-300 border border-violet-500/30">
                    ISL
                  </span>
                </div>
                <span className="text-[11px] text-slate-400 font-medium tracking-wide">
                  Sign it. See it.
                </span>
              </div>
            </button>
          </div>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2" aria-label="Main Navigation">
            <button
              onClick={() => scrollToSection('workspace')}
              className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors cursor-pointer ${
                activeSection === 'workspace' 
                  ? 'text-cyan-400 bg-cyan-950/40 border border-cyan-500/30' 
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              Translation Studio
            </button>
            <button
              onClick={() => scrollToSection('how-it-works')}
              className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors cursor-pointer ${
                activeSection === 'how-it-works' 
                  ? 'text-cyan-400 bg-cyan-950/40 border border-cyan-500/30' 
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              How It Works
            </button>
            <button
              onClick={() => scrollToSection('use-cases')}
              className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors cursor-pointer ${
                activeSection === 'use-cases' 
                  ? 'text-cyan-400 bg-cyan-950/40 border border-cyan-500/30' 
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              Use Cases
            </button>
            <button
              onClick={() => scrollToSection('privacy')}
              className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors cursor-pointer ${
                activeSection === 'privacy' 
                  ? 'text-cyan-400 bg-cyan-950/40 border border-cyan-500/30' 
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              Privacy & Ethics
            </button>
            <button
              onClick={() => scrollToSection('roadmap')}
              className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors cursor-pointer ${
                activeSection === 'roadmap' 
                  ? 'text-cyan-400 bg-cyan-950/40 border border-cyan-500/30' 
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              Roadmap
            </button>
          </nav>

          {/* Action CTAs */}
          <div className="hidden sm:flex items-center gap-2">
            
            {/* Sign Library & Custom Signs Trigger */}
            <button
              onClick={onOpenLibrary}
              className="px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-navy-850 hover:bg-navy-800 text-slate-200 border border-slate-700/80 hover:border-violet-500/50 transition-all flex items-center gap-1.5 shadow-sm cursor-pointer"
              title="Explore sign vocabulary and add custom signs"
            >
              <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
              <span>Library</span>
              <span className="text-[10px] bg-slate-800 text-slate-300 px-1 rounded font-mono">
                {signCount}
              </span>
            </button>

            {/* High Contrast Toggle */}
            <button
              onClick={toggleHighContrast}
              className={`p-2 rounded-lg border transition-all text-sm flex items-center gap-1.5 cursor-pointer ${
                highContrast 
                  ? 'bg-yellow-400 text-black border-yellow-300 font-bold' 
                  : 'text-slate-300 hover:text-white bg-slate-800/60 border-slate-700/60 hover:border-slate-600'
              }`}
              title="Toggle High Contrast Mode (Accessibility)"
              aria-label="Toggle High Contrast Mode"
            >
              {highContrast ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* Settings Modal Button */}
            <button
              onClick={onOpenSettings}
              className="p-2 rounded-lg text-slate-300 hover:text-white bg-slate-800/60 border border-slate-700/60 hover:border-slate-600 transition-colors cursor-pointer"
              title="Camera & UI Settings"
              aria-label="Open Settings"
            >
              <Sliders className="w-4 h-4" />
            </button>

            {/* Try Demo Mode Button */}
            <button
              onClick={onOpenDemo}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-violet-950/80 hover:bg-violet-900 text-violet-200 border border-violet-500/40 hover:border-violet-400 transition-all flex items-center gap-1.5 shadow-sm shadow-violet-900/30 cursor-pointer"
              title="Launch InnoTech Presenter Demo Suite"
            >
              <Sparkles className="w-3.5 h-3.5 text-violet-400" />
              <span>Demo Suite</span>
            </button>

            {/* Start Signing Primary CTA */}
            <button
              onClick={onStartSigning}
              className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-gradient-to-r from-violet-600 to-cyan-500 hover:from-violet-500 hover:to-cyan-400 text-white shadow-md shadow-violet-600/25 hover:shadow-cyan-500/35 transition-all flex items-center gap-1.5 group cursor-pointer"
            >
              <Video className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
              <span>Start Signing</span>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex sm:hidden items-center gap-2">
            <button
              onClick={onOpenLibrary}
              className="p-2 rounded-lg bg-navy-850 border border-slate-700 text-cyan-300"
              title="Library"
            >
              <BookOpen className="w-4 h-4" />
            </button>
            <button
              onClick={toggleHighContrast}
              className={`p-2 rounded-lg border ${
                highContrast ? 'bg-yellow-400 text-black border-yellow-300' : 'bg-slate-800/60 border-slate-700'
              }`}
              aria-label="Toggle High Contrast"
            >
              {highContrast ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg bg-slate-800/80 border border-slate-700 text-slate-300 hover:text-white"
              aria-label="Open Mobile Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="sm:hidden bg-navy-900/95 border-b border-violet-500/20 px-4 pt-3 pb-5 space-y-2.5 backdrop-blur-lg">
          <button
            onClick={() => scrollToSection('workspace')}
            className="w-full text-left px-3 py-2 rounded-lg text-sm text-slate-200 hover:bg-slate-800 flex items-center gap-2.5"
          >
            <Activity className="w-4 h-4 text-cyan-400" />
            Translation Studio
          </button>
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              onOpenLibrary();
            }}
            className="w-full text-left px-3 py-2 rounded-lg text-sm text-slate-200 hover:bg-slate-800 flex items-center gap-2.5"
          >
            <BookOpen className="w-4 h-4 text-cyan-400" />
            Sign Library & Add Signs ({signCount})
          </button>
          <button
            onClick={() => scrollToSection('how-it-works')}
            className="w-full text-left px-3 py-2 rounded-lg text-sm text-slate-200 hover:bg-slate-800 flex items-center gap-2.5"
          >
            <HelpCircle className="w-4 h-4 text-violet-400" />
            How It Works
          </button>
          <button
            onClick={() => scrollToSection('use-cases')}
            className="w-full text-left px-3 py-2 rounded-lg text-sm text-slate-200 hover:bg-slate-800 flex items-center gap-2.5"
          >
            <Layers className="w-4 h-4 text-cyan-400" />
            Use Cases
          </button>
          <button
            onClick={() => scrollToSection('privacy')}
            className="w-full text-left px-3 py-2 rounded-lg text-sm text-slate-200 hover:bg-slate-800 flex items-center gap-2.5"
          >
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            Privacy & Ethics
          </button>
          <button
            onClick={() => scrollToSection('roadmap')}
            className="w-full text-left px-3 py-2 rounded-lg text-sm text-slate-200 hover:bg-slate-800 flex items-center gap-2.5"
          >
            <Milestone className="w-4 h-4 text-amber-400" />
            Roadmap
          </button>

          <div className="pt-3 border-t border-slate-800 grid grid-cols-2 gap-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenDemo();
              }}
              className="w-full py-2.5 rounded-lg text-xs font-semibold bg-violet-950/90 text-violet-200 border border-violet-500/40 flex items-center justify-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5 text-violet-400" />
              Demo Suite
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onStartSigning();
              }}
              className="w-full py-2.5 rounded-lg text-xs font-semibold bg-gradient-to-r from-violet-600 to-cyan-500 text-white flex items-center justify-center gap-1.5"
            >
              <Video className="w-3.5 h-3.5" />
              Start Signing
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
