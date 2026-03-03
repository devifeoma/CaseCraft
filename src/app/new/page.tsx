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
        } catch (error) {
            console.error(error)
            // Fallback redirect for local testing if DB throws (e.g., missing auth/schema)
            setTimeout(() => {
                setIsLoading(false)
                router.push('/builder/mock')
            }, 1500)
        }
    }

    return (
        <div className="flex min-h-screen w-full flex-col bg-[#030303] text-zinc-100 selection:bg-purple-500/30">
            <header className="flex h-16 items-center border-b border-white/5 bg-black/50 px-6 backdrop-blur-md">
                <Link href="/dashboard" className="flex items-center gap-2 text-sm font-medium text-zinc-400 hover:text-white transition-colors">
                    <ArrowLeft className="h-4 w-4" />
                    Back to Dashboard
                </Link>
            </header>

            <main className="flex flex-1 items-center justify-center p-6">
                <div className="w-full max-w-xl">
                    <div className="mb-8 text-center">
                        <h1 className="text-3xl font-semibold tracking-tight text-white mb-3">Create New Case Study</h1>
                        <p className="text-zinc-400">Paste your Figma link and our agent will extract your designs and structure your story.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="rounded-2xl border border-white/5 bg-white/5 p-6 backdrop-blur-lg sm:p-8">
                        <div className="mb-6 flex flex-col gap-2">
                            <label htmlFor="figma-url" className="text-sm font-medium text-zinc-300">
                                Figma File URL
                            </label>
                            <div className="relative flex items-center">
                                <Figma className="absolute left-3 h-5 w-5 text-zinc-500" />
                                <input
                                    id="figma-url"
                                    type="url"
                                    className="w-full rounded-xl border border-white/10 bg-black/50 py-3 pl-10 pr-4 text-sm text-white outline-none transition-all placeholder:text-zinc-600 focus:border-purple-500/50 focus:bg-black"
                                    placeholder="https://www.figma.com/file/..."
                                    value={url}
                                    onChange={(e) => setUrl(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <div className="mb-8 flex flex-col gap-2">
                            <label className="text-sm font-medium text-zinc-300">
                                Aesthetic Vibe
                            </label>
                            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                                {['minimal', 'playful', 'dark', 'corporate'].map((v) => (
                                    <button
                                        key={v}
                                        type="button"
                                        onClick={() => setVibe(v)}
                                        className={`rounded-xl border py-2.5 text-xs font-medium capitalize transition-all ${vibe === v
                                                ? 'border-purple-500 bg-purple-500/10 text-purple-300'
                                                : 'border-white/10 bg-black/30 text-zinc-400 hover:border-white/20 hover:text-zinc-200'
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
                            className="group flex w-full items-center justify-center rounded-xl bg-purple-600 px-4 py-3 text-sm font-semibold text-white transition-all hover:bg-purple-500 disabled:opacity-50 disabled:hover:bg-purple-600"
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
