'use client'

import { useState } from 'react'
import { login, signup } from './actions'

export function LoginForm({ error }: { error?: string }) {
    const [isSignUp, setIsSignUp] = useState(false)

    return (
        <div className="w-full max-w-sm rounded-[24px] border border-white/5 bg-white/5 p-8 shadow-2xl backdrop-blur-xl">
            <div className="mb-8 flex flex-col items-center text-center">
                <h1 className="text-2xl font-semibold tracking-tight text-white">
                    {isSignUp ? 'Create an account' : 'Welcome back'}
                </h1>
                <p className="mt-2 text-sm text-zinc-400">
                    {isSignUp ? 'Enter your details to get started' : 'Enter your details to sign in to your account'}
                </p>
            </div>

            <form className="flex w-full flex-col justify-center gap-4 text-white">
                <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium text-zinc-300" htmlFor="email">
                        Email
                    </label>
                    <input
                        className="rounded-xl border border-white/10 bg-black/50 px-4 py-2.5 text-sm outline-none transition-all placeholder:text-zinc-600 focus:border-purple-500/50 focus:bg-black"
                        name="email"
                        type="email"
                        placeholder="you@example.com"
                        required
                    />
                </div>

                <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium text-zinc-300" htmlFor="password">
                        Password
                    </label>
                    <input
                        className="rounded-xl border border-white/10 bg-black/50 px-4 py-2.5 text-sm outline-none transition-all placeholder:text-zinc-600 focus:border-purple-500/50 focus:bg-black"
                        type="password"
                        name="password"
                        placeholder="••••••••"
                        required
                        minLength={6}
                    />
                </div>

                <div className="mt-4 flex flex-col gap-3">
                    <button
                        formAction={isSignUp ? signup : login}
                        className="flex w-full items-center justify-center rounded-xl bg-purple-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-purple-500 shadow-lg shadow-purple-500/20"
                    >
                        {isSignUp ? 'Create account' : 'Sign in'}
                    </button>

                    <button
                        type="button"
                        onClick={() => setIsSignUp(!isSignUp)}
                        className="text-sm text-zinc-400 hover:text-white transition-colors mt-2"
                    >
                        {isSignUp ? 'Already have an account? Sign in' : "Don't have an account? Sign up"}
                    </button>
                </div>

                {error && (
                    <p className="mt-4 rounded-xl border border-red-500/20 bg-red-500/10 p-3 text-center text-sm text-red-500">
                        {error}
                    </p>
                )}
            </form>
        </div>
    )
}
