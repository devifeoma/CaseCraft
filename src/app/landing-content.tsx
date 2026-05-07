'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight, Figma, Sparkles, Layers, Zap, PenTool, BarChart3, Layout } from 'lucide-react'
import { PricingSection } from './pricing-section'

export function LandingContent({ userEmail }: { userEmail?: string | null }) {
    return (
        <div className="relative z-10 w-full flex flex-col items-center overflow-x-hidden">
            {/* Hero Section */}
            <section className="relative w-full max-w-7xl mx-auto px-6 pt-40 pb-32 text-center flex flex-col items-center bg-grid-pattern [mask-image:radial-gradient(ellipse_at_center,black_20%,transparent_100%)]">
                {/* Floating Elements Background */}
                {/* Floating Elements Background Removed for Clarity */}
                <div className="absolute inset-0 pointer-events-none overflow-hidden flex items-center justify-center">
                </div>

                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-sm text-zinc-600 dark:text-zinc-300 backdrop-blur-md mb-8 shadow-2xl relative z-10"
                >
                    <span className="relative flex h-2 w-2 mr-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-500 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-500"></span>
                    </span>
                    <span className="font-medium tracking-wide">CaseCraft Beta 2.0 is live</span>
                </motion.div>

                <motion.h1 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.1 }}
                    className="mb-8 text-6xl md:text-8xl font-semibold tracking-tighter text-zinc-900 dark:text-white leading-[1.05] relative z-10 max-w-5xl"
                >
                    Build portfolios that <br className="hidden sm:block" />
                    <span className="aurora-gradient drop-shadow-lg pb-2">
                        actually get you hired.
                    </span>
                </motion.h1>

                <motion.p 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="mx-auto mb-12 max-w-2xl text-lg md:text-xl text-zinc-600 dark:text-zinc-400 leading-relaxed relative z-10"
                >
                    Turn your messy Figma files into professional, results-driven case studies in minutes.
                    Stop writing context, <strong className="font-medium text-zinc-900 dark:text-zinc-200">start proving impact.</strong>
                </motion.p>

                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                    className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto relative z-10"
                >
                    <Link href={userEmail ? "/dashboard" : "/login?signup=true"} className="btn-primary flex items-center justify-center group text-base px-10 py-4">
                        {userEmail ? "Go to Dashboard" : "Start building for free"}
                        <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                    <Link href="/builder/demo" className="btn-secondary text-base px-10 py-4">
                        View Interactive Demo
                    </Link>
                </motion.div>
                
                {/* 3D Dashboard Preview (Abstract) */}
                <motion.div 
                    initial={{ opacity: 0, y: 100, rotateX: 20 }}
                    animate={{ opacity: 1, y: 0, rotateX: 0 }}
                    transition={{ duration: 1.2, delay: 0.4, type: "spring" }}
                    className="w-full max-w-5xl mt-24 relative z-10 perspective-[2000px]"
                >
                    <div className="rounded-2xl md:rounded-[2rem] border border-white/20 bg-zinc-900/90 p-2 md:p-4 shadow-[0_0_80px_rgba(37,99,235,0.25)] overflow-hidden transform-gpu hover:-translate-y-2 transition-transform duration-500">
                        <div className="aspect-[16/9] w-full rounded-xl md:rounded-[1.5rem] bg-black overflow-hidden relative border border-white/10 flex flex-col shadow-2xl">
                            {/* Browser Top Bar */}
                            <div className="w-full h-10 md:h-12 border-b border-white/5 bg-black flex items-center px-4 gap-2 flex-shrink-0 z-20">
                                <div className="flex gap-1.5">
                                    <div className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-red-500/80 border border-red-500"></div>
                                    <div className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-yellow-500/80 border border-yellow-500"></div>
                                    <div className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-green-500/80 border border-green-500"></div>
                                </div>
                                <div className="mx-auto px-4 py-1 rounded-md bg-white/10 text-[10px] md:text-xs text-white/90 font-mono flex items-center gap-2">
                                    <Sparkles className="w-3 h-3 text-blue-400" /> casecraft.app/builder/demo
                                </div>
                                <div className="w-10"></div> {/* Spacer for alignment */}
                            </div>
                            
                            {/* Recorded Video Demo */}
                            <div className="flex-1 w-full relative bg-zinc-900 pointer-events-none overflow-hidden flex items-center justify-center">
                                <img 
                                    src="/demo.webp" 
                                    className="w-full h-full object-cover brightness-110 contrast-110"
                                    alt="CaseCraft Builder Video Demo"
                                />
                            </div>
                        </div>
                    </div>
                </motion.div>
            </section>

            {/* Trusted By Marquee */}
            <section className="w-full border-y border-zinc-200/50 dark:border-white/5 bg-zinc-50/50 dark:bg-white/[0.02] py-10 overflow-hidden relative backdrop-blur-sm">
                <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-background to-transparent z-10" />
                <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-background to-transparent z-10" />
                <p className="text-center text-sm font-medium text-zinc-500 mb-6 tracking-widest uppercase">Works seamlessly with your favorite tools</p>
                <div className="flex w-[200%] animate-[marquee_20s_linear_infinite]">
                    <div className="flex w-1/2 justify-around items-center opacity-50 grayscale hover:grayscale-0 transition-all duration-300">
                        <div className="flex items-center gap-2 font-bold text-xl"><Figma className="w-6 h-6" /> Figma</div>
                        <div className="flex items-center gap-2 font-bold text-xl"><Layers className="w-6 h-6" /> Framer</div>
                        <div className="flex items-center gap-2 font-bold text-xl"><PenTool className="w-6 h-6" /> Webflow</div>
                        <div className="flex items-center gap-2 font-bold text-xl"><Layout className="w-6 h-6" /> Notion</div>
                    </div>
                    <div className="flex w-1/2 justify-around items-center opacity-50 grayscale hover:grayscale-0 transition-all duration-300">
                        <div className="flex items-center gap-2 font-bold text-xl"><Figma className="w-6 h-6" /> Figma</div>
                        <div className="flex items-center gap-2 font-bold text-xl"><Layers className="w-6 h-6" /> Framer</div>
                        <div className="flex items-center gap-2 font-bold text-xl"><PenTool className="w-6 h-6" /> Webflow</div>
                        <div className="flex items-center gap-2 font-bold text-xl"><Layout className="w-6 h-6" /> Notion</div>
                    </div>
                </div>
            </section>

            {/* Bento Box Features Grid */}
            <section className="w-full max-w-7xl mx-auto px-6 py-32 relative z-10">
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-semibold tracking-tight text-zinc-900 dark:text-white mb-4">Everything you need to stand out.</h2>
                    <p className="text-lg text-zinc-600 dark:text-zinc-400">A complete toolkit designed to showcase your process, not just your pixels.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[300px]">
                    {/* Large Feature 1 */}
                    <motion.div 
                        whileHover={{ y: -5 }}
                        className="glass-panel md:col-span-2 row-span-1 p-8 flex flex-col justify-between group"
                    >
                        <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                            <Sparkles className="w-32 h-32 text-brand-500" />
                        </div>
                        <div className="relative z-10 max-w-md mt-auto">
                            <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-500/10 border border-brand-500/20 text-brand-600 dark:text-brand-400">
                                <Sparkles className="h-6 w-6" />
                            </div>
                            <h3 className="text-2xl font-medium text-zinc-900 dark:text-white mb-2">AI Copywriter Engine</h3>
                            <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">Answer 3 simple questions and our LLM engine drafts compelling Problem/Solution narratives tailored to your design constraints.</p>
                        </div>
                    </motion.div>

                    {/* Tall Feature 2 */}
                    <motion.div 
                        whileHover={{ y: -5 }}
                        className="glass-panel md:col-span-1 row-span-2 p-8 flex flex-col group relative overflow-hidden"
                    >
                         <div className="absolute inset-0 bg-gradient-to-b from-transparent to-emerald-500/5 group-hover:to-emerald-500/10 transition-colors" />
                         <div className="relative z-10 flex-1 flex flex-col justify-end">
                            <div className="mb-8 relative w-full aspect-square bg-black/5 dark:bg-white/5 rounded-xl border border-white/10 flex items-center justify-center p-6 overflow-hidden">
                                {/* Mock Chart */}
                                <div className="w-full h-full flex items-end justify-between gap-2">
                                    <motion.div animate={{ height: ["40%", "60%", "40%"] }} transition={{ duration: 4, repeat: Infinity }} className="w-full bg-zinc-300 dark:bg-zinc-700 rounded-t-sm"></motion.div>
                                    <motion.div animate={{ height: ["70%", "85%", "70%"] }} transition={{ duration: 4, delay: 0.5, repeat: Infinity }} className="w-full bg-brand-500/60 rounded-t-sm"></motion.div>
                                    <motion.div animate={{ height: ["90%", "100%", "90%"] }} transition={{ duration: 4, delay: 1, repeat: Infinity }} className="w-full bg-emerald-500 rounded-t-sm"></motion.div>
                                </div>
                            </div>
                            <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400">
                                <BarChart3 className="h-6 w-6" />
                            </div>
                            <h3 className="text-2xl font-medium text-zinc-900 dark:text-white mb-2">Evidence Vault</h3>
                            <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">Drag and drop interactive bar charts, responsive progress rings, and stylized testimonials to validate your design decisions.</p>
                        </div>
                    </motion.div>

                    {/* Wide Feature 3 */}
                    <motion.div 
                        whileHover={{ y: -5 }}
                        className="glass-panel md:col-span-2 row-span-1 p-8 flex flex-col justify-between group"
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent to-blue-500/5 group-hover:to-blue-500/10 transition-colors" />
                        <div className="relative z-10 max-w-md mt-auto">
                            <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400">
                                <Figma className="h-6 w-6" />
                            </div>
                            <h3 className="text-2xl font-medium text-zinc-900 dark:text-white mb-2">Smart Full-Sync</h3>
                            <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">Paste your Figma URL and we automatically extract frames, constraints, and visual assets without manual exports. Keep your portfolio always up to date.</p>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Pricing Section */}
            <div className="w-full relative z-10 px-6 pb-32">
                 <PricingSection />
            </div>

            {/* Massive CTA */}
            <section className="w-full border-t border-zinc-200/50 dark:border-white/5 bg-zinc-900 dark:bg-black py-32 relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 mix-blend-overlay"></div>
                
                <div className="relative z-10 max-w-4xl mx-auto px-6 text-center flex flex-col items-center">
                    <h2 className="text-4xl md:text-6xl font-semibold tracking-tight text-white mb-6">Ready to stop explaining <br/> and start proving?</h2>
                    <p className="text-lg md:text-xl text-zinc-400 mb-10 max-w-2xl">Join the thousands of designers using CaseCraft to build high-converting portfolios that speak for themselves.</p>
                    <Link href={userEmail ? "/dashboard" : "/login?signup=true"} className="relative group overflow-hidden rounded-full p-[1px] inline-flex">
                        <span className="absolute inset-0 bg-gradient-to-r from-blue-600 via-blue-500 to-sky-400 animate-pulse rounded-full"></span>
                        <div className="relative bg-zinc-950 px-10 py-4 rounded-full flex items-center justify-center gap-2 group-hover:bg-zinc-900 transition-colors">
                            <span className="text-lg font-medium text-white">{userEmail ? "Go to Dashboard" : "Build your first project"}</span>
                            <ArrowRight className="w-5 h-5 text-white group-hover:translate-x-1 transition-transform" />
                        </div>
                    </Link>
                </div>
            </section>

            {/* Footer */}
            <footer className="w-full border-t border-zinc-200 dark:border-white/5 bg-background pt-12 pb-8 flex flex-col items-center z-10">
                <div className="w-full max-w-7xl px-6 flex flex-col md:flex-row items-center justify-between gap-6 text-sm text-zinc-500 transition-colors duration-300">
                    <div className="flex items-center gap-2 font-medium">
                        <div className="flex h-6 w-6 items-center justify-center rounded bg-gradient-to-br from-blue-600 to-blue-400 shadow-sm">
                            <Sparkles className="h-3 w-3 text-white" />
                        </div>
                        © 2026 CaseCraft, Inc.
                    </div>
                    <div className="flex gap-8">
                        <a href="#" className="hover:text-zinc-800 dark:hover:text-zinc-300 transition-colors font-medium">Twitter</a>
                        <a href="#" className="hover:text-zinc-800 dark:hover:text-zinc-300 transition-colors font-medium">GitHub</a>
                        <a href="#" className="hover:text-zinc-800 dark:hover:text-zinc-300 transition-colors font-medium">Terms</a>
                        <a href="#" className="hover:text-zinc-800 dark:hover:text-zinc-300 transition-colors font-medium">Privacy</a>
                    </div>
                </div>
            </footer>
        </div>
    )
}
