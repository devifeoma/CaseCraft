'use client'

import { useState } from 'react'
import { ArrowLeft, Figma, Sparkles, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { extractFigmaData } from './actions'

export default function NewProjectPage() {
    const [url, setUrl] = useState('')
    const [vibe, setVibe] = useState('minimal')
    const [isLoading, setIsLoading] = useState(false)
    const router = useRouter()

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        setIsLoading(true)

        try {
            await extractFigmaData(url, vibe)
        } catch (error: any) {
            console.error(error)
            setIsLoading(false)
            alert(error?.message || 'Failed to create project. Please try again.')
        }
    }

    return (
        <div className="flex min-h-screen w-full flex-col bg-background text-foreground selection:bg-blue-500/30">
            <header className="flex h-16 items-center border-b border-zinc-200 dark:border-white/5 bg-white/50 dark:bg-black/50 px-6 backdrop-blur-md">
                <Link href="/dashboard" className="flex items-center gap-2 text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors">
                    <ArrowLeft className="h-4 w-4" />
                    Back to Dashboard
                </Link>
            </header>

            <main className="flex flex-1 items-center justify-center p-6">
                <div className="w-full max-w-xl">
                    <div className="mb-8 text-center">
                        <h1 className="text-3xl font-semibold tracking-tight text-zinc-900 dark:text-white mb-3">Create New Case Study</h1>
                        <p className="text-zinc-600 dark:text-zinc-400">Paste your Figma link and our agent will extract your designs and structure your story.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="rounded-2xl border border-zinc-200 dark:border-white/5 bg-black/5 dark:bg-white/5 p-6 backdrop-blur-lg sm:p-8">
                        <div className="mb-6 flex flex-col gap-2">
                            <label htmlFor="figma-url" className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                                Figma File URL
                            </label>
                            <div className="relative flex items-center">
                                <Figma className="absolute left-3 h-5 w-5 text-zinc-500" />
                                <input
                                    id="figma-url"
                                    type="url"
                                    className="w-full rounded-xl border border-zinc-200 dark:border-white/10 bg-white/50 dark:bg-black/50 py-3 pl-10 pr-4 text-sm text-zinc-900 dark:text-white outline-none transition-all placeholder:text-zinc-400 dark:placeholder:text-zinc-600 focus:border-blue-500/50 focus:bg-white dark:focus:bg-black"
                                    placeholder="https://www.figma.com/file/..."
                                    value={url}
                                    onChange={(e) => setUrl(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <div className="mb-8 flex flex-col gap-2">
                            <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                                Aesthetic Vibe
                            </label>
                            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                                {['minimal', 'playful', 'dark', 'corporate'].map((v) => (
                                    <button
                                        key={v}
                                        type="button"
                                        onClick={() => setVibe(v)}
                                        className={`rounded-xl border py-2.5 text-xs font-medium capitalize transition-all ${vibe === v
                                            ? 'border-blue-500 bg-blue-500/10 text-blue-700 dark:text-blue-300'
                                            : 'border-zinc-200 dark:border-white/10 bg-black/5 dark:bg-black/30 text-zinc-600 dark:text-zinc-400 hover:border-zinc-300 dark:hover:border-white/20 hover:text-zinc-900 dark:hover:text-zinc-200'
                                            }`}
                                    >
                                        {v}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading || !url}
                            className="group flex w-full items-center justify-center rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition-all hover:bg-blue-500 disabled:opacity-50 disabled:hover:bg-blue-600"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Extracting Magic...
                                </>
                            ) : (
                                <>
                                    <Sparkles className="mr-2 h-4 w-4" />
                                    Generate Framework
                                </>
                            )}
                        </button>
                    </form>

                    <p className="mt-6 text-center text-xs text-zinc-500">
                        Make sure your Figma file is accessible to "Anyone with the link can view".
                    </p>
                </div>
            </main>
        </div>
    )
}
