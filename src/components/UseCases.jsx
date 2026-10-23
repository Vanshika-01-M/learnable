import React from 'react';
import { 
  Building2, 
  Stethoscope, 
  GraduationCap, 
  Landmark, 
  Video, 
  HeartHandshake, 
  Users, 
  CheckCircle2,
  ArrowRight
} from 'lucide-react';

export default function UseCases({ onSelectScenario }) {
  const cases = [
    {
      id: 'healthcare',
      title: 'Hospitals & Emergency Clinics',
      category: 'Healthcare Access',
      icon: Stethoscope,
      color: 'text-rose-400 bg-rose-950/60 border-rose-500/30',
      description: 'Enables deaf patients to communicate symptoms, locate pharmacy counters, and understand emergency triage instructions when human interpreters are not immediately physically on site.',
      keyPhrases: ['Where is emergency triage?', 'Severe chest pain', 'Need doctor now'],
      impact: 'Reduces misdiagnosis risk during urgent admissions'
    },
    {
      id: 'banking',
      title: 'Banks & Financial Desks',
      category: 'Public Services',
      icon: Landmark,
      color: 'text-amber-400 bg-amber-950/60 border-amber-500/30',
      description: 'Bridges customer-to-teller conversations at busy financial counters for opening savings accounts, updating passbooks, cash transactions, and KYC verification.',
      keyPhrases: ['Open savings account', 'Cash deposit counter', 'KYC document verification'],
      impact: 'Dignified, independent financial autonomy for deaf citizens'
    },
    {
      id: 'education',
      title: 'Classrooms & Universities',
      category: 'Inclusive Education',
      icon: GraduationCap,
      color: 'text-violet-400 bg-violet-950/60 border-violet-500/30',
      description: 'Assists deaf students in asking questions during lectures, group project collaborations, and communicating directly with hearing faculty members.',
      keyPhrases: ['Can you repeat that slide?', 'I have a question', 'Project submission date'],
      impact: 'Promotes peer-to-peer peer learning without intermediaries'
    },
    {
      id: 'government',
      title: 'Public Service & Municipal Centers',
      category: 'Civic Accessibility',
      icon: Building2,
      color: 'text-cyan-400 bg-cyan-950/60 border-cyan-500/30',
      description: 'Installed at transport hubs (railway inquiry counters, metro stations) and government service offices (RTO, passport offices) to streamline citizen grievance resolution.',
      keyPhrases: ['Where is platform 4?', 'Document renewal desk', 'Need assistance'],
      impact: 'Complies with national accessibility directives'
    },
    {
      id: 'videocalls',
      title: 'Video Conferencing & Remote Work',
      category: 'Digital Workplace',
      icon: Video,
      color: 'text-emerald-400 bg-emerald-950/60 border-emerald-500/30',
      description: 'Feeds live webcam frames directly into meeting tabs (Google Meet, Zoom) to generate instant live captions for hearing teammates without third-party bot joins.',
      keyPhrases: ['I agree with this proposal', 'Please look at my screen', 'Next agenda item'],
      impact: 'Empowers deaf software engineers & remote professionals'
    },
  ];

  return (
    <section id="use-cases" className="py-20 md:py-28 bg-navy-950/70 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-cyan-300 text-xs font-semibold uppercase tracking-wider mb-4">
            Real-World Impact
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight">
            Designed for Everyday Encounters
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-300 leading-relaxed">
            Bridging critical touchpoints where sign language interpreters are scarce and immediate communication is vital.
          </p>
        </div>

        {/* Use Cases Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cases.map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.id}
                className="bg-navy-900/80 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between hover:border-cyan-500/40 hover:shadow-xl transition-all group backdrop-blur-sm"
              >
                <div>
                  {/* Category Pill & Icon */}
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[11px] font-semibold tracking-wider uppercase px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300">
                      {item.category}
                    </span>
                    <div className={`p-2 rounded-xl border ${item.color}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="text-lg font-bold text-white group-hover:text-cyan-300 transition-colors mb-2">
                    {item.title}
                  </h3>

                  {/* Description */}
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-4">
                    {item.description}
                  </p>

                  {/* Sample Phrases Pill Box */}
                  <div className="space-y-1.5 mb-5 bg-navy-950/70 p-3 rounded-xl border border-slate-800">
                    <div className="text-[10px] uppercase font-semibold text-slate-400">
                      Common Signs Needed:
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {item.keyPhrases.map((phrase, idx) => (
                        <span
                          key={idx}
                          className="text-[11px] bg-navy-900 text-slate-200 px-2 py-0.5 rounded border border-slate-700/80 font-mono"
                        >
                          &ldquo;{phrase}&rdquo;
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Impact Stat Bottom */}
                <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs text-emerald-300 font-medium">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span className="truncate">{item.impact}</span>
                  </div>

                  <button
                    onClick={() => onSelectScenario(item.id)}
                    className="text-xs text-cyan-400 hover:text-cyan-300 font-semibold flex items-center gap-1 transition-colors cursor-pointer shrink-0 ml-2"
                  >
                    <span>Test Demo</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
