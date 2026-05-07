'use client'

import Link from 'next/link';
import { ShieldCheck, Loader2 } from 'lucide-react';
import { useState } from 'react';

export function PricingSection() {
    const [isLoading, setIsLoading] = useState<'month' | 'year' | null>(null);

    const handleUpgrade = async (interval: 'month' | 'year') => {
        setIsLoading(interval);
        try {
            const res = await fetch('/api/stripe/checkout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ interval })
            });

            if (res.status === 401) {
                // Not logged in
                window.location.href = `/login?plan=pro&interval=${interval}`;
                return;
            }

            const data = await res.json();
            
            if (data.url) {
                window.location.href = data.url;
            } else if (data.error) {
                alert(`Error: ${data.error}`);
            }
        } catch (err: any) {
            alert('Failed to initiate checkout. Please try again.');
        } finally {
            setIsLoading(null);
        }
    };

    return (
        <div id="pricing" className="w-full max-w-6xl mx-auto pt-16 border-t border-zinc-200 dark:border-white/10 transition-colors duration-300">
            <div className="text-center mb-12">
                <h2 className="text-3xl font-semibold tracking-tight text-zinc-900 dark:text-white mb-4">Simple, transparent pricing</h2>
                <p className="text-zinc-600 dark:text-zinc-400 mb-8">Start for free, upgrade when your career takes off.</p>
            </div>

            <div className="grid gap-6 md:grid-cols-3 lg:gap-8 relative items-stretch">
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
                    <Link href="/login" className="btn-secondary mt-auto w-full py-4 text-base text-center">
                        Get Started for Free
                    </Link>
                </div>

                {/* Pro Monthly Tier */}
                <div className="glass-panel relative flex flex-col h-full p-8 border-brand-500/10 hover:border-brand-500/30">
                    <div className="mb-2 flex items-center justify-between">
                        <h3 className="text-xl font-medium text-zinc-900 dark:text-white">Pro Monthly</h3>
                    </div>

                    <div className="mb-2 flex items-baseline gap-1">
                        <span className="text-4xl font-semibold tracking-tight text-zinc-900 dark:text-white">$15</span>
                        <span className="text-sm font-medium text-zinc-600 dark:text-zinc-400">/ month</span>
                    </div>
                    <p className="text-xs font-medium text-zinc-400 mb-6 opacity-0">Placeholder</p>

                    <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-8 pb-8 border-b border-zinc-200 dark:border-white/10 leading-relaxed mt-auto">Everything you need to land senior roles and stand out from the crowd.</p>

                    <ul className="mb-10 flex flex-col gap-4 text-sm font-medium text-zinc-700 dark:text-zinc-300 relative z-10">
                        <li className="flex items-center gap-3"><ShieldCheck className="h-5 w-5 text-zinc-400 dark:text-zinc-500" /> Unlimited Projects</li>
                        <li className="flex items-center gap-3"><ShieldCheck className="h-5 w-5 text-zinc-400 dark:text-zinc-500" /> Custom Branding</li>
                        <li className="flex items-center gap-3"><ShieldCheck className="h-5 w-5 text-zinc-400 dark:text-zinc-500" /> Password Protection</li>
                        <li className="flex items-center gap-3"><ShieldCheck className="h-5 w-5 text-zinc-400 dark:text-zinc-500" /> Figma Embeds</li>
                    </ul>
                    <button 
                        onClick={() => handleUpgrade('month')}
                        disabled={isLoading !== null}
                        className="btn-secondary mt-auto w-full py-4 text-base relative z-10 text-center flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                        {isLoading === 'month' ? <><Loader2 className="w-4 h-4 animate-spin" /> Processing...</> : 'Upgrade Monthly'}
                    </button>
                </div>

                {/* Pro Yearly Tier */}
                <div className="glass-panel relative flex flex-col h-full p-8 border-brand-500/30 overflow-hidden shadow-[0_0_40px_rgba(59,130,246,0.15)] md:scale-105 z-10">
                    {/* Pro Background Glow */}
                    <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-brand-500/20 blur-3xl rounded-full pointer-events-none"></div>

                    <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-blue-600 via-blue-500 to-sky-400"></div>

                    <div className="mb-2 flex items-center justify-between">
                        <h3 className="text-xl font-medium text-zinc-900 dark:text-white">Pro Yearly</h3>
                        <span className="inline-flex items-center rounded-full bg-blue-500/10 border border-blue-500/20 px-3 py-1 text-xs font-semibold text-blue-600 dark:text-blue-400">
                            Save 20%
                        </span>
                    </div>

                    <div className="mb-2 flex items-baseline gap-1">
                        <span className="text-4xl font-semibold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-zinc-900 to-zinc-600 dark:text-white dark:text-gradient">
                            $12
                        </span>
                        <span className="text-sm font-medium text-zinc-600 dark:text-zinc-400">/ month</span>
                    </div>
                    <p className="text-xs font-medium text-emerald-600 dark:text-emerald-400 mb-6">Billed annually at $144</p>

                    <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-8 pb-8 border-b border-zinc-200 dark:border-white/10 leading-relaxed mt-auto">Best value. All premium features for a whole year.</p>

                    <ul className="mb-10 flex flex-col gap-4 text-sm font-medium text-zinc-700 dark:text-zinc-300 relative z-10">
                        <li className="flex items-center gap-3"><ShieldCheck className="h-5 w-5 text-brand-500 dark:text-brand-400" /> Unlimited Projects</li>
                        <li className="flex items-center gap-3"><ShieldCheck className="h-5 w-5 text-brand-500 dark:text-brand-400" /> Custom Branding</li>
                        <li className="flex items-center gap-3"><ShieldCheck className="h-5 w-5 text-brand-500 dark:text-brand-400" /> Password Protection</li>
                        <li className="flex items-center gap-3"><ShieldCheck className="h-5 w-5 text-brand-500 dark:text-brand-400" /> Figma Embeds</li>
                    </ul>
                    <button 
                        onClick={() => handleUpgrade('year')}
                        disabled={isLoading !== null}
                        className="btn-primary mt-auto w-full py-4 text-base relative z-10 text-center flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                        {isLoading === 'year' ? <><Loader2 className="w-4 h-4 animate-spin" /> Processing...</> : 'Upgrade Yearly'}
                    </button>
                </div>
            </div>
        </div>
    )
}
