'use client'

import { useState } from 'react'
import { Lock, ArrowRight, Sparkles } from 'lucide-react'
import { verifyProjectPassword } from './actions'
import { useRouter } from 'next/navigation'

export function PasswordChallenge({ projectId }: { projectId: string }) {
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const router = useRouter()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!password) return

        setIsLoading(true)
        setError('')

        try {
            await verifyProjectPassword(projectId, password)
            // Reload the page to bypass the server-side lock
            router.refresh()
        } catch (err: any) {
            setError(err.message || 'Incorrect password')
            setIsLoading(false)
        }
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-black p-4 selection:bg-blue-500/30">
            <div className="w-full max-w-md animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="mb-8 flex justify-center">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-blue-400 shadow-lg shadow-blue-500/20">
                        <Lock className="h-6 w-6 text-white" />
                    </div>
                </div>

                <div className="rounded-2xl border border-zinc-200 dark:border-white/10 bg-white dark:bg-zinc-900/50 p-8 shadow-xl backdrop-blur-xl">
                    <div className="mb-6 text-center">
                        <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">Protected Project</h1>
                        <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                            This case study requires a password to view.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                        <div>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Enter password"
                                className="w-full rounded-xl border border-zinc-300 dark:border-white/10 bg-zinc-50 dark:bg-black/50 px-4 py-3 text-sm text-zinc-900 dark:text-white outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all font-medium"
                                autoFocus
                            />
                            {error && (
                                <p className="mt-2 text-sm font-medium text-red-500 animate-in fade-in">{error}</p>
                            )}
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading || !password}
                            className="group flex w-full items-center justify-center rounded-xl bg-blue-600 px-4 py-3 text-sm font-medium text-white shadow-md transition-all hover:bg-blue-700 disabled:opacity-50"
                        >
                            {isLoading ? 'Verifying...' : 'Unlock Case Study'}
                            {!isLoading && <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />}
                        </button>
                    </form>
                </div>

                <div className="mt-8 text-center text-xs text-zinc-500 dark:text-zinc-500 flex items-center justify-center gap-1.5 opacity-60">
                    <Sparkles className="h-3 w-3" />
                    Powered by CaseCraft
                </div>
            </div>
        </div>
    )
}
