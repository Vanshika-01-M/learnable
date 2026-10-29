import React from 'react';
import { ArrowLeft, BookOpen, Mail, MessageCircle, ShieldCheck } from 'lucide-react';
import HowItWorks from './HowItWorks';
import UseCases from './UseCases';
import Roadmap from './Roadmap';
import PrivacySection from './PrivacySection';

const PAGE_TITLES = {
  'how-it-works': 'How It Works',
  'use-cases': 'Use Cases',
  roadmap: 'Project Roadmap',
  privacy: 'Privacy & Accessibility',
  support: 'Support',
  contact: 'Contact',
  faqs: 'Frequently Asked Questions',
};

function HomeLink({ children = 'Back to Learnable' }) {
  return <a href="?page=home" className="inline-flex items-center gap-2 rounded-xl bg-violet-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-violet-700"> <ArrowLeft className="h-4 w-4" /> {children} </a>;
}

function TextPage({ page }) {
  if (page === 'support') return (
    <div className="mx-auto max-w-3xl space-y-6">
      <p className="text-lg text-slate-600">Need help using Learnable? Start with the FAQ page, then report bugs or ask questions through the project repository.</p>
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <MessageCircle className="mb-3 h-7 w-7 text-violet-700" />
        <h2 className="text-xl font-bold text-slate-900">Get project support</h2>
        <p className="mt-2 text-slate-600">Please include your device/browser, the steps you followed, and any error message. Do not attach private camera footage.</p>
        <a className="mt-4 inline-flex rounded-lg bg-violet-600 px-4 py-2 text-sm font-semibold text-white hover:bg-violet-700" href="https://github.com/Vanshika-01-M/learnable/issues/new" target="_blank" rel="noreferrer">Open a support issue</a>
      </div>
    </div>
  );

  if (page === 'contact') return (
    <div className="mx-auto max-w-3xl space-y-6">
      <p className="text-lg text-slate-600">Learnable is an open-source prototype. The repository is the reliable contact point for bug reports, feedback, and project questions.</p>
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <Mail className="mb-3 h-7 w-7 text-violet-700" />
        <h2 className="text-xl font-bold text-slate-900">Contact the project maintainers</h2>
        <p className="mt-2 text-slate-600">Open a GitHub issue and choose a clear title such as “Bug report”, “Accessibility feedback”, or “Feature request”. No email address is published here, so this page does not invent one.</p>
        <a className="mt-4 inline-flex rounded-lg bg-violet-600 px-4 py-2 text-sm font-semibold text-white hover:bg-violet-700" href="https://github.com/Vanshika-01-M/learnable/issues/new" target="_blank" rel="noreferrer">Contact via GitHub</a>
      </div>
    </div>
  );

  if (page === 'faqs') return (
    <div className="mx-auto max-w-3xl space-y-3">
      {[
        ['What is Learnable?', 'Learnable is a browser-based Indian Sign Language (ISL) accessibility prototype. It combines a live camera workspace, a heuristic gesture recognizer, and a simulated demo library.'],
        ['Does the camera start automatically?', 'No. The camera should start only after you explicitly activate the camera control and grant browser permission. Use Stop Camera to end the stream.'],
        ['Is every sign translated accurately?', 'No. The current live recognizer is limited and the demo suite uses simulated phrases. It is not a replacement for a qualified human interpreter, especially in medical, legal, or emergency situations.'],
        ['Does Learnable upload my camera video?', 'The prototype is designed to process camera frames locally in the browser. Do not use the app with sensitive footage if you have not reviewed the implementation and your browser environment.'],
        ['Why is no sign detected?', 'Try improving lighting, placing one hand clearly in frame, granting camera permission, or using the demo suite to test the caption workflow. Gesture recognition is still limited.'],
        ['How do I report a problem?', 'Use the Support or Contact link in the footer to open a GitHub issue with the device/browser, reproduction steps, and the exact error message.'],
      ].map(([question, answer]) => (
        <details key={question} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <summary className="cursor-pointer font-semibold text-slate-900">{question}</summary>
          <p className="mt-3 leading-relaxed text-slate-600">{answer}</p>
        </details>
      ))}
    </div>
  );

  return (
    <div className="mx-auto max-w-3xl rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <BookOpen className="mb-3 h-7 w-7 text-violet-700" />
      <h2 className="text-xl font-bold text-slate-900">Page not found</h2>
      <p className="mt-2 text-slate-600">That page is not available. Return to Learnable and choose a link from the footer.</p>
      <div className="mt-4"><HomeLink /></div>
    </div>
  );
}

export default function InfoPage({ page }) {
  const title = PAGE_TITLES[page] || 'Learnable';
  const goHomeForDemo = () => { window.location.href = `${window.location.pathname}?page=home&demo=1`; };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
          <a href="?page=home" className="text-xl font-extrabold tracking-tight text-slate-900">Learnable <span className="ml-1 rounded-md bg-violet-100 px-2 py-1 text-xs font-bold text-violet-700">ISL</span></a>
          <nav className="flex flex-wrap items-center justify-end gap-2 text-sm">
            <a href="?page=how-it-works" className="rounded-lg px-3 py-2 text-slate-600 hover:bg-slate-100">How It Works</a>
            <a href="?page=faqs" className="rounded-lg px-3 py-2 text-slate-600 hover:bg-slate-100">FAQs</a>
            <button type="button" onClick={goHomeForDemo} className="rounded-lg bg-violet-600 px-3 py-2 font-semibold text-white hover:bg-violet-700">Try Demo</button>
          </nav>
        </div>
      </header>

      <main className="min-h-[65vh]">
        {page === 'how-it-works' ? <HowItWorks /> : null}
        {page === 'use-cases' ? <UseCases onSelectScenario={goHomeForDemo} /> : null}
        {page === 'roadmap' ? <Roadmap /> : null}
        {page === 'privacy' ? <PrivacySection /> : null}
        {['support', 'contact', 'faqs'].includes(page) ? (
          <section className="px-4 py-12 sm:px-6 sm:py-16">
            <div className="mx-auto mb-8 max-w-3xl">
              <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-violet-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-violet-700"><ShieldCheck className="h-4 w-4" /> Learnable Help Centre</div>
              <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">{title}</h1>
              <p className="mt-3 text-slate-600">Clear guidance for using the Learnable prototype responsibly.</p>
            </div>
            <TextPage page={page} />
          </section>
        ) : null}
        {!PAGE_TITLES[page] ? <section className="px-4 py-12"><TextPage page={page} /></section> : null}
      </main>

      <footer className="border-t border-slate-200 bg-white px-4 py-8 text-sm text-slate-500">
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <p>Learnable · Indian Sign Language prototype</p>
          <div className="flex flex-wrap gap-4">
            <a href="?page=support" className="hover:text-violet-700">Support</a>
            <a href="?page=contact" className="hover:text-violet-700">Contact</a>
            <a href="?page=faqs" className="hover:text-violet-700">FAQs</a>
            <a href="?page=privacy" className="hover:text-violet-700">Privacy</a>
          </div>
          <HomeLink />
        </div>
      </footer>
    </div>
  );
}
