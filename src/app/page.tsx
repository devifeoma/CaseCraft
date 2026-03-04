import Link from 'next/link';
import { ArrowRight, Figma, Sparkles, Layers, ShieldCheck } from 'lucide-react';
import { LandingNav } from './landing-nav';
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

        {/* Pricing Section */}
        <div id="pricing" className="w-full max-w-4xl pt-16 border-t border-zinc-200 dark:border-white/10 transition-colors duration-300">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-semibold tracking-tight text-zinc-900 dark:text-white mb-4">Simple, transparent pricing</h2>
            <p className="text-zinc-600 dark:text-zinc-400">Start for free, upgrade when your career takes off.</p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:gap-12 relative items-stretch">
            {/* Free Tier */}
            <div className="glass-panel flex flex-col h-full p-10">
              <h3 className="mb-2 text-xl font-medium text-zinc-900 dark:text-white">Starter</h3>
              <div className="mb-6 flex items-baseline gap-1">
                <span className="text-5xl font-semibold tracking-tight text-zinc-900 dark:text-white">$0</span>
                <span className="text-sm font-medium text-zinc-600 dark:text-zinc-400">/ forever</span>
              </div>
              <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-8 pb-8 border-b border-zinc-200 dark:border-white/10 leading-relaxed">Perfect for junior designers building their very first professional case study.</p>

              <ul className="mb-10 flex flex-col gap-5 text-sm font-medium text-zinc-700 dark:text-zinc-300">
                <li className="flex items-center gap-3"><ShieldCheck className="h-5 w-5 text-zinc-400 dark:text-zinc-500" /> 1 Active Project</li>
                <li className="flex items-center gap-3"><ShieldCheck className="h-5 w-5 text-zinc-400 dark:text-zinc-500" /> Public URL Export</li>
                <li className="flex items-center gap-3"><ShieldCheck className="h-5 w-5 text-zinc-400 dark:text-zinc-500" /> Basic AI Context Engine</li>
                <li className="flex items-center gap-3 text-zinc-400 dark:text-zinc-500 opacity-60"><ShieldCheck className="h-5 w-5" /> CaseCraft Watermark</li>
              </ul>
              <Link href="/login" className="btn-secondary mt-auto w-full py-4 text-base">
                Get Started for Free
              </Link>
            </div>

            {/* Pro Tier */}
            <div className="glass-panel relative flex flex-col h-full p-10 border-brand-500/30 overflow-hidden shadow-[0_0_40px_rgba(124,58,237,0.1)]">
              {/* Pro Background Glow */}
              <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-brand-500/20 blur-3xl rounded-full pointer-events-none"></div>

              <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-brand-500 via-indigo-500 to-purple-500"></div>

              <div className="mb-2 flex items-center justify-between">
                <h3 className="text-xl font-medium text-zinc-900 dark:text-white">Pro</h3>
                <span className="inline-flex items-center rounded-full bg-brand-500/10 border border-brand-500/20 px-3 py-1 text-xs font-semibold text-brand-600 dark:text-brand-400">
                  Most Popular
                </span>
              </div>

              <div className="mb-6 flex items-baseline gap-1">
                <span className="text-5xl font-semibold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-zinc-900 to-zinc-600 dark:text-white dark:text-gradient">$15</span>
                <span className="text-sm font-medium text-zinc-600 dark:text-zinc-400">/ month</span>
              </div>

              <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-8 pb-8 border-b border-zinc-200 dark:border-white/10 leading-relaxed">Everything you need to land senior roles and stand out from the crowd.</p>

              <ul className="mb-10 flex flex-col gap-5 text-sm font-medium text-zinc-700 dark:text-zinc-300 relative z-10">
                <li className="flex items-center gap-3"><ShieldCheck className="h-5 w-5 text-brand-500 dark:text-brand-400" /> Unlimited Projects</li>
                <li className="flex items-center gap-3"><ShieldCheck className="h-5 w-5 text-brand-500 dark:text-brand-400" /> Custom Branding & No Watermark</li>
                <li className="flex items-center gap-3"><ShieldCheck className="h-5 w-5 text-brand-500 dark:text-brand-400" /> Password Protection (NDAs)</li>
                <li className="flex items-center gap-3"><ShieldCheck className="h-5 w-5 text-brand-500 dark:text-brand-400" /> Figma Embeds & PDF Export</li>
              </ul>
              <Link href="/login?plan=pro" className="btn-primary mt-auto w-full py-4 text-base relative z-10">
                Upgrade to Pro
              </Link>
            </div>
          </div>
        </div>

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
