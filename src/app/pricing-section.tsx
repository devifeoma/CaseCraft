'use client'

import Link from 'next/link';
import { ShieldCheck } from 'lucide-react';
import { useState } from 'react';

export function PricingSection() {
    const [isYearly, setIsYearly] = useState(false);

    return (
        <div id="pricing" className="w-full max-w-4xl pt-16 border-t border-zinc-200 dark:border-white/10 transition-colors duration-300">
            <div className="text-center mb-12">
                <h2 className="text-3xl font-semibold tracking-tight text-zinc-900 dark:text-white mb-4">Simple, transparent pricing</h2>
                <p className="text-zinc-600 dark:text-zinc-400 mb-8">Start for free, upgrade when your career takes off.</p>

                {/* Monthly/Yearly Toggle */}
                <div className="flex items-center justify-center gap-3 text-sm font-medium">
                    <span className={`transition-colors ${!isYearly ? 'text-zinc-900 dark:text-white' : 'text-zinc-500 dark:text-zinc-400'}`}>Monthly</span>
                    <button
                        onClick={() => setIsYearly(!isYearly)}
                        className="relative inline-flex h-6 w-11 items-center rounded-full bg-zinc-200 dark:bg-white/10 transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 dark:focus:ring-offset-black"
                    >
                        <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${isYearly ? 'translate-x-6 bg-brand-500' : 'translate-x-1'}`} />
                    </button>
                    <span className={`flex items-center gap-1.5 transition-colors ${isYearly ? 'text-zinc-900 dark:text-white' : 'text-zinc-500 dark:text-zinc-400'}`}>
                        Yearly <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-semibold text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400">Save 20%</span>
                    </span>
                </div>
            </div>

            <div className="grid gap-8 md:grid-cols-2 lg:gap-12 relative items-stretch">
                {/* Free Tier */}
                <div className="glass-panel flex flex-col h-full p-10">
                    <h3 className="mb-2 text-xl font-medium text-zinc-900 dark:text-white">Starter</h3>
                    <div className="mb-6 flex items-baseline gap-1">
                        <span className="text-5xl font-semibold tracking-tight text-zinc-900 dark:text-white">$0</span>
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
                <div className="glass-panel relative flex flex-col h-full p-10 border-brand-500/30 overflow-hidden shadow-[0_0_40px_rgba(236,72,153,0.15)]">
                    {/* Pro Background Glow */}
                    <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-brand-500/20 blur-3xl rounded-full pointer-events-none"></div>

                    <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-400"></div>

                    <div className="mb-2 flex items-center justify-between">
                        <h3 className="text-xl font-medium text-zinc-900 dark:text-white">Pro</h3>
                        <span className="inline-flex items-center rounded-full bg-brand-500/10 border border-brand-500/20 px-3 py-1 text-xs font-semibold text-brand-600 dark:text-brand-400">
                            Most Popular
                        </span>
                    </div>

                    <div className="mb-2 flex items-baseline gap-1">
                        <span className="text-5xl font-semibold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-zinc-900 to-zinc-600 dark:text-white dark:text-gradient">
                            ${isYearly ? '12' : '15'}
                        </span>
                        <span className="text-sm font-medium text-zinc-600 dark:text-zinc-400">/ month</span>
                    </div>
                    {isYearly ? (
                        <p className="text-xs font-medium text-emerald-600 dark:text-emerald-400 mb-6">Billed annually at $144/year</p>
                    ) : (
                        <p className="text-xs font-medium text-zinc-400 mb-6 opacity-0">Placeholder</p>
                    )}

                    <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-8 pb-8 border-b border-zinc-200 dark:border-white/10 leading-relaxed mt-auto">Everything you need to land senior roles and stand out from the crowd.</p>

                    <ul className="mb-10 flex flex-col gap-5 text-sm font-medium text-zinc-700 dark:text-zinc-300 relative z-10">
                        <li className="flex items-center gap-3"><ShieldCheck className="h-5 w-5 text-brand-500 dark:text-brand-400" /> Unlimited Projects</li>
                        <li className="flex items-center gap-3"><ShieldCheck className="h-5 w-5 text-brand-500 dark:text-brand-400" /> Custom Branding & No Watermark</li>
                        <li className="flex items-center gap-3"><ShieldCheck className="h-5 w-5 text-brand-500 dark:text-brand-400" /> Password Protection (NDAs)</li>
                        <li className="flex items-center gap-3"><ShieldCheck className="h-5 w-5 text-brand-500 dark:text-brand-400" /> Figma Embeds & PDF Export</li>
                    </ul>
                    <Link href={`/login?plan=pro&interval=${isYearly ? 'year' : 'month'}`} className="btn-primary mt-auto w-full py-4 text-base relative z-10 text-center">
                        Upgrade to Pro
                    </Link>
                </div>
            </div>
        </div>
    )
}
