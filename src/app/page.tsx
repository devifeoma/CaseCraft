import Link from 'next/link';
import { ArrowRight, Figma, Sparkles, Layers, ShieldCheck } from 'lucide-react';
import { LandingNav } from './landing-nav';
import { PricingSection } from './pricing-section';
import { createClient } from '@/utils/supabase/server';

export default async function LandingPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <div className="relative min-h-screen bg-background text-foreground selection:bg-brand-500/30 overflow-hidden text-zinc-900 dark:text-zinc-100 transition-colors duration-300">
      {/* Premium Background Effects */}
      <div className="absolute inset-0 z-0">
        <div className="absolute left-1/2 top-0 -translate-x-1/2 w-[1000px] h-[500px] opacity-20 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-b from-brand-500 to-transparent blur-[100px] rounded-full mix-blend-screen mix-blend-color-dodge"></div>
        </div>
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay pointer-events-none"></div>
      </div>

      <LandingNav userEmail={user?.email} />

      <main className="relative z-10 mx-auto flex max-w-5xl flex-col items-center justify-center px-6 pt-48 pb-32 text-center">
        <div className="animate-fade-in inline-flex items-center rounded-full border border-zinc-200 dark:border-white/10 bg-black/5 dark:bg-white/5 px-4 py-1.5 text-sm text-zinc-600 dark:text-zinc-300 backdrop-blur-md mb-8 shadow-sm dark:shadow-2xl">
          <span className="relative flex h-2 w-2 mr-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-500 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-500"></span>
          </span>
          <span className="font-medium tracking-wide">CaseCraft Beta 2.0 is live</span>
        </div>

        <h1 className="animate-fade-in mb-8 text-5xl font-medium tracking-tight text-zinc-900 dark:text-white sm:text-7xl leading-[1.1]" style={{ animationDelay: '0.1s' }}>
          Build portfolios that <br className="hidden sm:block" />
          <span className="brand-gradient drop-shadow-sm">
            actually get you hired.
          </span>
        </h1>

        <p className="animate-fade-in mx-auto mb-10 max-w-2xl text-lg text-zinc-600 dark:text-zinc-400 sm:text-xl leading-relaxed" style={{ animationDelay: '0.2s' }}>
          Turn your messy Figma files into professional, results-driven case studies in minutes.
          Stop writing context, <strong className="font-medium text-zinc-900 dark:text-zinc-200">start proving impact.</strong>
        </p>

        <div className="animate-fade-in flex flex-col sm:flex-row gap-4 w-full sm:w-auto mb-32" style={{ animationDelay: '0.3s' }}>
          <Link href="/dashboard" className="btn-primary flex items-center justify-center group">
            Start building for free
            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
          <Link href="#demo" className="btn-secondary">
            View Interactive Demo
          </Link>
        </div>

        {/* Feature Highlights Grid */}
        <div className="grid md:grid-cols-3 gap-6 w-full max-w-4xl text-left border-t border-zinc-200 dark:border-white/10 pt-16 mb-32 transition-colors">
          <div className="glass-panel p-8 hover:-translate-y-1 transition-transform duration-300">
            <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-black/5 dark:bg-white/5 border border-zinc-200 dark:border-white/10 text-brand-600 dark:text-brand-400">
              <Figma className="h-5 w-5" />
            </div>
            <h3 className="text-lg font-medium text-zinc-900 dark:text-white mb-2">Smart Full-Sync</h3>
            <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">Paste your Figma URL and we automatically extract frames, constraints, and visual assets without manual exports.</p>
          </div>
          <div className="glass-panel p-8 hover:-translate-y-1 transition-transform duration-300" style={{ animationDelay: '0.1s' }}>
            <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-black/5 dark:bg-white/5 border border-zinc-200 dark:border-white/10 text-blue-600 dark:text-blue-400">
              <Sparkles className="h-5 w-5" />
            </div>
            <h3 className="text-lg font-medium text-zinc-900 dark:text-white mb-2">AI Copywriter</h3>
            <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">Answer 3 simple questions and our LLM engine drafts compelling Problem/Solution narratives tailored to your design constraints.</p>
          </div>
          <div className="glass-panel p-8 hover:-translate-y-1 transition-transform duration-300" style={{ animationDelay: '0.2s' }}>
            <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-black/5 dark:bg-white/5 border border-zinc-200 dark:border-white/10 text-emerald-600 dark:text-emerald-400">
              <Layers className="h-5 w-5" />
            </div>
            <h3 className="text-lg font-medium text-zinc-900 dark:text-white mb-2">Evidence Vault</h3>
            <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">Drag and drop interactive bar charts, responsive progress rings, and stylized testimonials to validate your design decisions.</p>
          </div>
        </div>

        <PricingSection />

        {/* Footer */}
        <footer className="w-full max-w-5xl mt-32 border-t border-zinc-200 dark:border-white/10 pt-8 pb-8 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-zinc-500 transition-colors duration-300">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4" /> © 2026 CaseCraft, Inc.
          </div>
          <div className="flex gap-6">
            <a href="#" className="hover:text-zinc-800 dark:hover:text-zinc-300 transition-colors">Twitter</a>
            <a href="#" className="hover:text-zinc-800 dark:hover:text-zinc-300 transition-colors">GitHub</a>
            <a href="#" className="hover:text-zinc-800 dark:hover:text-zinc-300 transition-colors">Terms</a>
            <a href="#" className="hover:text-zinc-800 dark:hover:text-zinc-300 transition-colors">Privacy</a>
          </div>
        </footer>
      </main>
    </div>
  );
}
