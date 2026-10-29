import React from 'react';
import { 
  Globe, 
  Type, 
  RotateCcw, 
  BookOpen, 
  FileText,
  Filter,
  Plus
} from 'lucide-react';
import { DEMO_DOMAINS } from '../utils/demoData';

export default function TranslationControls({
  selectedLanguage,
  setSelectedLanguage,
  selectedDomain,
  setSelectedDomain,
  captionFontSize,
  setCaptionFontSize,
  onResetSession,
  onToggleHistory,
  onOpenLibrary,
  historyCount = 0,
  signCount = 0,
}) {
  return (
    <div className="bg-navy-900/80 rounded-2xl border border-violet-500/15 p-4 sm:p-5 shadow-lg backdrop-blur-md">
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        
        {/* Left: Language & Vocabulary Filters */}
        <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
          
          {/* Sign Language Selection */}
          <div className="flex items-center gap-2 bg-navy-950/70 px-3 py-1.5 rounded-xl border border-slate-800">
            <Globe className="w-4 h-4 text-violet-400 shrink-0" />
            <label htmlFor="language-select" className="text-xs text-slate-400 font-medium whitespace-nowrap">
              Target Sign:
            </label>
            <select
              id="language-select"
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
              className="bg-transparent text-xs font-semibold text-white focus:outline-none cursor-pointer"
            >
              <option value="ISL" className="bg-navy-900 text-white">Indian Sign Language (ISL) — Default</option>
              <option value="ASL" className="bg-navy-900 text-white">American Sign Language (ASL)</option>
              <option value="BSL" className="bg-navy-900 text-white">British Sign Language (BSL)</option>
              <option value="IS" className="bg-navy-900 text-white">International Sign (IS)</option>
            </select>
          </div>

          {/* Domain Vocabulary Filter */}
          <div className="flex items-center gap-2 bg-navy-950/70 px-3 py-1.5 rounded-xl border border-slate-800">
            <Filter className="w-4 h-4 text-cyan-400 shrink-0" />
            <label htmlFor="domain-select" className="text-xs text-slate-400 font-medium whitespace-nowrap">
              Domain:
            </label>
            <select
              id="domain-select"
              value={selectedDomain}
              onChange={(e) => setSelectedDomain(e.target.value)}
              className="bg-transparent text-xs font-semibold text-white focus:outline-none cursor-pointer"
            >
              {DEMO_DOMAINS.map(d => (
                <option key={d.id} value={d.id} className="bg-navy-900 text-white">
                  {d.name} {d.badge ? `(${d.badge})` : ''}
                </option>
              ))}
            </select>
          </div>

          {/* Library & Add Sign Button */}
          <button
            onClick={onOpenLibrary}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-violet-950/80 hover:bg-violet-900 text-violet-200 border border-violet-500/40 text-xs font-semibold transition-all shadow-sm cursor-pointer"
            title="Browse all signs or create custom signs"
          >
            <BookOpen className="w-3.5 h-3.5 text-violet-400" />
            <span>Sign Library ({signCount})</span>
            <span className="text-[10px] bg-cyan-400/20 text-cyan-300 px-1 rounded ml-0.5">+ Add</span>
          </button>

        </div>

        {/* Right: Accessibility & Session Tools */}
        <div className="flex flex-wrap items-center gap-2.5 w-full lg:w-auto justify-end">
          
          {/* Caption Font Size */}
          <div className="flex items-center bg-navy-950/70 p-1 rounded-xl border border-slate-800" title="Adjust caption font size">
            <Type className="w-3.5 h-3.5 text-slate-400 ml-2 mr-1" />
            <button
              onClick={() => setCaptionFontSize('normal')}
              className={`px-2 py-1 text-xs rounded-lg font-medium transition-all ${
                captionFontSize === 'normal' 
                  ? 'bg-violet-600 text-white shadow-sm' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              A
            </button>
            <button
              onClick={() => setCaptionFontSize('large')}
              className={`px-2 py-1 text-xs rounded-lg font-medium transition-all ${
                captionFontSize === 'large' 
                  ? 'bg-violet-600 text-white shadow-sm font-semibold' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              A+
            </button>
            <button
              onClick={() => setCaptionFontSize('xl')}
              className={`px-2 py-1 text-xs rounded-lg font-medium transition-all ${
                captionFontSize === 'xl' 
                  ? 'bg-violet-600 text-white shadow-sm font-bold' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              A++
            </button>
          </div>


          {/* History Drawer Trigger */}
          <button
            onClick={onToggleHistory}
            className="px-3 py-1.5 rounded-xl bg-navy-950/70 text-slate-300 hover:text-white border border-slate-800 hover:border-slate-700 text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
            title="Toggle session history drawer"
          >
            <FileText className="w-3.5 h-3.5 text-cyan-400" />
            <span>History ({historyCount})</span>
          </button>

          {/* Reset Session */}
          <button
            onClick={onResetSession}
            className="px-3 py-1.5 rounded-xl bg-navy-950/70 text-slate-400 hover:text-rose-300 border border-slate-800 hover:border-rose-500/40 text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
            title="Reset current session, captions, and history"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>

        </div>

      </div>
    </div>
  );
}
