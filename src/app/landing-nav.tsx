'use client'

import Link from 'next/link';
import { ArrowRight, Sparkles, Menu, X, User, LogOut } from 'lucide-react';
import { ThemeToggle } from '@/components/ThemeToggle';
import { useState } from 'react';

export function LandingNav({ userEmail }: { userEmail?: string | null }) {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    return (
        <nav className="fixed top-0 w-full border-b border-zinc-200 bg-white/40 dark:border-white/5 dark:bg-black/40 backdrop-blur-xl z-50 transition-colors duration-300">
            <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
                <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
                    <div className="relative flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-brand-500 to-indigo-600 shadow-lg shadow-brand-500/20">
                        <Sparkles className="h-4 w-4 text-white" />
                        <div className="absolute inset-0 rounded-lg ring-1 ring-white/20"></div>
                    </div>
                    <span className="text-lg font-semibold tracking-tight text-zinc-900 dark:text-white">CaseCraft</span>
                </Link>

                {/* Desktop Navigation */}
                <div className="hidden sm:flex items-center gap-4 text-sm font-medium">
                    <Link href="#pricing" className="text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white transition-colors mr-2">Pricing</Link>
                    <ThemeToggle />
                    <div className="h-4 w-px bg-zinc-200 dark:bg-white/10 mx-2"></div>

                    {userEmail ? (
                        <>
                            <Link href="/dashboard" className="flex items-center gap-2 text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white transition-colors mr-2">
                                <User className="h-4 w-4" />
                                <span className="truncate max-w-[150px]">{userEmail}</span>
                            </Link>
                            <form action="/auth/signout" method="post">
                                <button className="group rounded-full border border-zinc-200 dark:border-white/10 px-4 py-2 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 hover:text-zinc-900 dark:hover:bg-white/5 dark:hover:text-white transition-all flex items-center gap-2">
                                    <LogOut className="h-4 w-4" />
                                </button>
                            </form>
                            <Link href="/dashboard" className="ml-2 group rounded-full bg-zinc-900 dark:bg-white px-5 py-2 text-white dark:text-black hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-all flex items-center gap-2">
                                Dashboard <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
                            </Link>
                        </>
                    ) : (
                        <>
                            <Link href="/login" className="text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white transition-colors">Log in</Link>
                            <Link href="/login" className="group rounded-full bg-zinc-900 dark:bg-white px-5 py-2 text-white dark:text-black hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-all flex items-center gap-2">
                                Sign up <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
                            </Link>
                        </>
                    )}
                </div>

                {/* Mobile Menu Toggle */}
                <div className="flex sm:hidden items-center gap-4">
                    <ThemeToggle />
                    <button
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className="text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white p-2"
                    >
                        {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                    </button>
                </div>
            </div>

            {/* Mobile Navigation Dropdown */}
            {isMobileMenuOpen && (
                <div className="sm:hidden border-t border-zinc-200 dark:border-white/5 bg-white/95 dark:bg-black/95 backdrop-blur-xl px-6 py-4 flex flex-col gap-4 animate-in slide-in-from-top-2">
                    <Link onClick={() => setIsMobileMenuOpen(false)} href="#pricing" className="text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white transition-colors">Pricing</Link>

                    {userEmail ? (
                        <>
                            <div className="flex items-center gap-3 py-2 text-sm text-zinc-500 dark:text-zinc-400 border-t border-zinc-100 dark:border-white/5">
                                <User className="h-4 w-4" />
                                <span className="truncate">{userEmail}</span>
                            </div>
                            <form action="/auth/signout" method="post" className="w-full">
                                <button type="submit" className="flex w-full items-center gap-2 text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white transition-colors">
                                    <LogOut className="h-4 w-4" /> Sign out
                                </button>
                            </form>
                            <Link onClick={() => setIsMobileMenuOpen(false)} href="/dashboard" className="mt-2 flex items-center justify-center gap-2 rounded-full bg-zinc-900 dark:bg-white px-5 py-2.5 text-sm font-medium text-white dark:text-black hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-all">
                                Dashboard <ArrowRight className="h-4 w-4" />
                            </Link>
                        </>
                    ) : (
                        <>
                            <Link onClick={() => setIsMobileMenuOpen(false)} href="/login" className="text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white transition-colors">Log in</Link>
                            <Link onClick={() => setIsMobileMenuOpen(false)} href="/login" className="flex items-center justify-center gap-2 rounded-full bg-zinc-900 dark:bg-white px-5 py-2.5 text-sm font-medium text-white dark:text-black hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-all">
                                Sign up <ArrowRight className="h-4 w-4" />
                            </Link>
                        </>
                    )}
                </div>
            )}
        </nav>
    );
}
