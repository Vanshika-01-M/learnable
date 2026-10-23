import React, { useState } from 'react';
import { 
  X, 
  BookOpen, 
  Search, 
  Plus, 
  Trash2, 
  Sparkles, 
  ArrowRight, 
  Volume2, 
  Copy, 
  Check, 
  Code2, 
  Info,
  CheckCircle2
} from 'lucide-react';
import { DEMO_DOMAINS, saveCustomPhrase, deleteCustomPhrase } from '../utils/demoData';
import { SpeechSynthesizer } from '../utils/speechSynthesizer';

export default function SignLibraryModal({
  isOpen,
  onClose,
  allPhrases = [],
  onRefreshPhrases,
  onSelectPhrase,
}) {
  const [activeTab, setActiveTab] = useState('browse'); // 'browse' | 'add' | 'developer-guide'
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDomain, setSelectedDomain] = useState('all');
  const [copiedId, setCopiedId] = useState(null);

  // New Sign Form State
  const [newText, setNewText] = useState('');
  const [newHindi, setNewHindi] = useState('');
  const [newGloss, setNewGloss] = useState('');
  const [newDomain, setNewDomain] = useState('greetings');
  const [newGesture, setNewGesture] = useState('');
  const [formSuccess, setFormSuccess] = useState(false);

  if (!isOpen) return null;

  // Filter phrases
  const filteredPhrases = allPhrases.filter((item) => {
    const matchesDomain = selectedDomain === 'all' || item.domain === selectedDomain;
    const query = searchQuery.toLowerCase().trim();
    const matchesSearch = !query || 
      item.text.toLowerCase().includes(query) ||
      (item.hindiText && item.hindiText.toLowerCase().includes(query)) ||
      (item.islGloss && item.islGloss.toLowerCase().includes(query)) ||
      (item.gestureDescription && item.gestureDescription.toLowerCase().includes(query));
    return matchesDomain && matchesSearch;
  });

  const handleCopy = (e, item) => {
    e.stopPropagation();
    navigator.clipboard.writeText(item.text);
    setCopiedId(item.id);
    setTimeout(() => setCopiedId(null), 1800);
  };

  const handleSpeak = (e, item) => {
    e.stopPropagation();
    SpeechSynthesizer.speak(item.text);
  };

  const handleCreateSign = (e) => {
    e.preventDefault();
    if (!newText.trim()) return;

    const saved = saveCustomPhrase({
      text: newText,
      hindiText: newHindi,
      islGloss: newGloss,
      domain: newDomain,
      gestureDescription: newGesture,
      simulatedConfidence: 0.96,
    });

    if (saved) {
      setFormSuccess(true);
      onRefreshPhrases();
      setTimeout(() => {
        setFormSuccess(false);
        setNewText('');
        setNewHindi('');
        setNewGloss('');
        setNewGesture('');
        setActiveTab('browse');
      }, 1200);
    }
  };

  const handleDelete = (e, id) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this custom sign?')) {
      deleteCustomPhrase(id);
      onRefreshPhrases();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-navy-950/80 backdrop-blur-md animate-fadeIn">
      <div 
        className="w-full max-w-4xl max-h-[92vh] bg-navy-900 border border-violet-500/30 rounded-2xl shadow-2xl flex flex-col overflow-hidden"
        role="dialog"
        aria-labelledby="library-modal-title"
      >
        
        {/* Header Bar */}
        <div className="px-5 sm:px-6 py-4 border-b border-slate-800 bg-navy-950/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-violet-950 text-violet-300 border border-violet-500/30">
              <BookOpen className="w-5 h-5 text-violet-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 id="library-modal-title" className="text-base font-bold text-white">
                  Learnable Vocabulary & Sign Library
                </h3>
                <span className="text-[10px] font-semibold bg-cyan-950 text-cyan-300 px-2 py-0.5 rounded border border-cyan-500/30">
                  {allPhrases.length} Signs Available
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Browse Indian Sign Language phrases, add new custom signs, or connect AI models
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="px-5 sm:px-6 py-2.5 bg-navy-950/50 border-b border-slate-800 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('browse')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'browse'
                  ? 'bg-violet-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              Browse Library ({allPhrases.length})
            </button>
            <button
              onClick={() => setActiveTab('add')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                activeTab === 'add'
                  ? 'bg-cyan-500 text-black shadow-sm font-bold'
                  : 'text-slate-400 hover:text-cyan-300 hover:bg-slate-800/60'
              }`}
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Custom Sign</span>
            </button>
            <button
              onClick={() => setActiveTab('developer-guide')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                activeTab === 'developer-guide'
                  ? 'bg-violet-950 text-violet-200 border border-violet-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-violet-300 hover:bg-slate-800/60'
              }`}
            >
              <Code2 className="w-3.5 h-3.5 text-violet-400" />
              <span>How to Code More Signs</span>
            </button>
          </div>
        </div>

        {/* TAB 1: BROWSE LIBRARY */}
        {activeTab === 'browse' && (
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Search & Domain Filter Bar */}
            <div className="px-5 sm:px-6 py-3 border-b border-slate-800 bg-navy-950/30 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              {/* Search input */}
              <div className="relative flex-1 max-w-md">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search by sign, English, Hindi, or keyword..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-navy-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                />
              </div>

              {/* Domain pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
                {DEMO_DOMAINS.map(d => (
                  <button
                    key={d.id}
                    onClick={() => setSelectedDomain(d.id)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-medium whitespace-nowrap transition-all ${
                      selectedDomain === d.id
                        ? 'bg-cyan-950 text-cyan-300 border border-cyan-500/40 font-semibold'
                        : 'bg-navy-950 text-slate-400 hover:text-white border border-slate-800'
                    }`}
                  >
                    {d.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Signs Grid */}
            <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-3">
              {filteredPhrases.length === 0 ? (
                <div className="text-center py-16 text-slate-500">
                  <Search className="w-10 h-10 mx-auto mb-3 opacity-40" />
                  <p className="text-sm text-slate-400">No signs match your search criteria.</p>
                  <button
                    onClick={() => setActiveTab('add')}
                    className="mt-3 px-3 py-1.5 rounded-lg text-xs font-semibold bg-violet-600 text-white"
                  >
                    Create &quot;{searchQuery}&quot; as a New Sign
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {filteredPhrases.map((phrase) => {
                    const isCustom = phrase.id.startsWith('custom-');

                    return (
                      <div
                        key={phrase.id}
                        onClick={() => {
                          onSelectPhrase(phrase);
                          onClose();
                        }}
                        className="p-4 rounded-xl border bg-navy-950/60 border-slate-800 hover:border-violet-500/50 hover:bg-navy-950/90 transition-all cursor-pointer flex flex-col justify-between group shadow-sm"
                      >
                        <div>
                          <div className="flex items-center justify-between mb-1.5">
                            <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                              {phrase.domain}
                            </span>
                            <div className="flex items-center gap-1.5">
                              {isCustom && (
                                <span className="text-[10px] font-bold text-cyan-300 bg-cyan-950 px-1.5 py-0.5 rounded border border-cyan-500/30">
                                  Custom
                                </span>
                              )}
                              <span className="text-[11px] font-mono text-amber-300">
                                ~{Math.round((phrase.simulatedConfidence || 0.95) * 100)}% Conf
                              </span>
                            </div>
                          </div>

                          <h4 className="text-sm font-bold text-white group-hover:text-cyan-200 transition-colors">
                            &ldquo;{phrase.text}&rdquo;
                          </h4>

                          {phrase.hindiText && (
                            <p className="text-xs text-slate-400 mt-0.5">
                              {phrase.hindiText}
                            </p>
                          )}

                          <div className="mt-2 text-[11px] text-slate-400 bg-navy-900/80 p-2 rounded-lg border border-slate-800/80">
                            <span className="text-violet-300 font-medium">Gesture: </span>
                            {phrase.gestureDescription}
                          </div>
                        </div>

                        <div className="mt-3 pt-3 border-t border-slate-800 flex items-center justify-between">
                          <span className="text-[10px] font-mono text-slate-400 truncate max-w-[150px]">
                            ISL: {phrase.islGloss}
                          </span>

                          <div className="flex items-center gap-1">
                            <button
                              onClick={(e) => handleSpeak(e, phrase)}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-cyan-300 hover:bg-slate-800"
                              title="Speak phrase aloud"
                            >
                              <Volume2 className="w-3.5 h-3.5" />
                            </button>

                            <button
                              onClick={(e) => handleCopy(e, phrase)}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
                              title="Copy text"
                            >
                              {copiedId === phrase.id ? (
                                <Check className="w-3.5 h-3.5 text-emerald-400" />
                              ) : (
                                <Copy className="w-3.5 h-3.5" />
                              )}
                            </button>

                            {isCustom && (
                              <button
                                onClick={(e) => handleDelete(e, phrase.id)}
                                className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-950/40"
                                title="Delete custom sign"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}

                            <span className="px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-violet-600/80 group-hover:bg-violet-600 text-white flex items-center gap-1 transition-colors ml-1">
                              <span>Send</span>
                              <ArrowRight className="w-3 h-3" />
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 2: ADD CUSTOM SIGN */}
        {activeTab === 'add' && (
          <div className="flex-1 overflow-y-auto p-5 sm:p-8">
            <div className="max-w-2xl mx-auto space-y-6">
              
              <div className="p-4 rounded-xl bg-cyan-950/30 border border-cyan-500/30 flex items-start gap-3">
                <Sparkles className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
                <div className="text-xs text-slate-300 leading-relaxed">
                  <strong className="text-white block font-semibold mb-0.5">
                    Create Any Sign or Sentence
                  </strong>
                  Add custom phrases, medical questions, or local dialect signs. They will be saved to your browser session and will immediately appear in the Live Captions, Demo Suite, and Text-to-Speech audio engine!
                </div>
              </div>

              {formSuccess && (
                <div className="p-4 rounded-xl bg-emerald-950/80 border border-emerald-500/40 flex items-center gap-3 text-emerald-300 text-sm font-semibold animate-fadeIn">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  <span>Custom sign added successfully! Updating library...</span>
                </div>
              )}

              <form onSubmit={handleCreateSign} className="space-y-4">
                
                {/* English Text */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-white">
                    English Sentence / Translation <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g., Where can I get clean drinking water?"
                    value={newText}
                    onChange={(e) => setNewText(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-navy-950 border border-slate-800 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                  />
                </div>

                {/* Hindi Translation */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-white">
                    Hindi Translation (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., पीने का साफ पानी कहाँ मिलेगा?"
                    value={newHindi}
                    onChange={(e) => setNewHindi(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-navy-950 border border-slate-800 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                  />
                </div>

                {/* Two Col: Domain & ISL Gloss */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-white">
                      Vocabulary Domain
                    </label>
                    <select
                      value={newDomain}
                      onChange={(e) => setNewDomain(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-navy-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-cyan-400"
                    >
                      <option value="greetings">Greetings & Basics</option>
                      <option value="healthcare">Hospital & Healthcare</option>
                      <option value="banking">Banking & Counters</option>
                      <option value="travel_daily">Travel & Daily Living</option>
                      <option value="education">Classroom & School</option>
                      <option value="emergency">Emergency & Urgent</option>
                      <option value="custom">Custom Category</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-white">
                      ISL Grammatical Gloss
                    </label>
                    <input
                      type="text"
                      placeholder="e.g., WATER / CLEAN / DRINK / WHERE"
                      value={newGloss}
                      onChange={(e) => setNewGloss(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-navy-950 border border-slate-800 text-xs text-white uppercase placeholder-slate-500 focus:outline-none focus:border-cyan-400 font-mono"
                    />
                  </div>
                </div>

                {/* Gesture Description */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-white">
                    Physical Gesture Description (How to perform the sign)
                  </label>
                  <textarea
                    rows={2}
                    placeholder="e.g., Tilt hand cupped towards mouth, followed by questioning index finger pointing towards hallway."
                    value={newGesture}
                    onChange={(e) => setNewGesture(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-navy-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 leading-relaxed"
                  />
                </div>

                {/* Submit button */}
                <div className="pt-2 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setActiveTab('browse')}
                    className="px-4 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl text-xs font-semibold bg-gradient-to-r from-violet-600 to-cyan-500 hover:from-violet-500 hover:to-cyan-400 text-white shadow-lg shadow-violet-600/30 flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Save to Vocabulary Library</span>
                  </button>
                </div>

              </form>

            </div>
          </div>
        )}

        {/* TAB 3: DEVELOPER CODE GUIDE */}
        {activeTab === 'developer-guide' && (
          <div className="flex-1 overflow-y-auto p-5 sm:p-8 space-y-6">
            <div className="max-w-3xl mx-auto space-y-6 text-xs text-slate-300">
              
              <div className="p-4 rounded-xl bg-violet-950/40 border border-violet-500/30">
                <h4 className="text-sm font-bold text-white mb-1 flex items-center gap-2">
                  <Code2 className="w-4 h-4 text-violet-400" />
                  How to Add More Signs in Learnable
                </h4>
                <p className="text-slate-400 leading-relaxed">
                  Learnable provides 3 different levels to add more signs, depending on whether you want instant simulated vocabulary, live webcam geometric rules, or a trained AI deep learning model.
                </p>
              </div>

              {/* Method 1 */}
              <div className="p-4 rounded-xl bg-navy-950 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <strong className="text-white text-sm">
                    Method 1: Add to Default Predefined Vocabulary
                  </strong>
                  <span className="text-[10px] bg-slate-800 px-2 py-0.5 rounded text-slate-300 font-mono">
                    src/utils/demoData.js
                  </span>
                </div>
                <p className="text-slate-400">
                  Simply open <code className="text-violet-300 font-mono">src/utils/demoData.js</code> and add an object into <code className="text-cyan-300 font-mono">INITIAL_DEMO_PHRASES</code>:
                </p>
                <pre className="p-3 rounded-lg bg-navy-900 border border-slate-800 font-mono text-[11px] text-cyan-300 overflow-x-auto">
{`{
  id: 'my-custom-sign',
  domain: 'healthcare', // or 'greetings', 'banking', 'travel_daily', etc.
  text: 'I need water immediately.',
  hindiText: 'मुझे तुरंत पानी चाहिए।',
  islGloss: 'WATER / URGENT / NEED',
  simulatedConfidence: 0.96,
  durationMs: 1500,
  gestureDescription: 'Cupped hand tilted towards lips.',
}`}
                </pre>
              </div>

              {/* Method 2 */}
              <div className="p-4 rounded-xl bg-navy-950 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <strong className="text-white text-sm">
                    Method 2: Add Real-Time Live Webcam Geometric Rules
                  </strong>
                  <span className="text-[10px] bg-slate-800 px-2 py-0.5 rounded text-slate-300 font-mono">
                    src/utils/signClassifierAdapter.js
                  </span>
                </div>
                <p className="text-slate-400">
                  To make the webcam recognize a new hand shape from actual MediaPipe landmarks in real time, add a rule inside <code className="text-violet-300 font-mono">HeuristicISLClassifier.evaluateHand()</code>:
                </p>
                <pre className="p-3 rounded-lg bg-navy-900 border border-slate-800 font-mono text-[11px] text-violet-300 overflow-x-auto">
{`// Example: Detect Index + Middle pointing horizontally
if (indexExtended && middleExtended && ringCurled && pinkyCurled && landmarks[8].y > landmarks[6].y) {
  candidate = {
    text: 'Look straight ahead',
    hindiText: 'सीधे आगे देखें',
    islGloss: 'LOOK / FORWARD',
    confidence: 0.90,
    explanation: 'Horizontal two-finger pointer detected.',
  };
}`}
                </pre>
              </div>

              {/* Method 3 */}
              <div className="p-4 rounded-xl bg-navy-950 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <strong className="text-white text-sm">
                    Method 3: Connect a Trained AI Neural Network
                  </strong>
                  <span className="text-[10px] bg-slate-800 px-2 py-0.5 rounded text-slate-300 font-mono">
                    ONNX Runtime / TensorFlow.js
                  </span>
                </div>
                <p className="text-slate-400">
                  For continuous dynamic sentences, plug your PyTorch/TensorFlow trained sequence model into <code className="text-cyan-300 font-mono">FutureDeepModelAdapter</code> in <code className="text-violet-300 font-mono">src/utils/signClassifierAdapter.js</code>. The input buffer delivers 30 consecutive frames of 21 3D joint landmarks `(30, 21, 3)`!
                </p>
              </div>

            </div>
          </div>
        )}

        {/* Footer */}
        <div className="px-5 sm:px-6 py-3 border-t border-slate-800 bg-navy-950/80 flex items-center justify-between text-xs text-slate-400">
          <span>Click any sign to test it instantly in the Live Caption studio.</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-medium"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
}
