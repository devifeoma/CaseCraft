'use client'

import { useState } from 'react'
import { Sparkles, Lock, Globe, X } from 'lucide-react'

interface PublishModalProps {
    isOpen: boolean;
    onClose: () => void;
    onPublish: (password?: string) => Promise<void>;
    isPublishing: boolean;
    isPro: boolean;
    projectId: string;
}

export function PublishModal({ isOpen, onClose, onPublish, isPublishing, isPro, projectId }: PublishModalProps) {
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')

    if (!isOpen) return null

    const handlePublishClick = async () => {
        setError('')
        try {
            await onPublish(password)
        } catch (err: unknown) {
            if (err instanceof Error) {
                setError(err.message)
            } else {
                setError('Failed to publish project.')
            }
        }
    }

    // Usually, the public URL would be derived from the window location or an env var
    // We construct a relative public URL for display
    const publicUrl = `/p/${projectId}`

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="relative w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl dark:bg-zinc-900 border border-zinc-200 dark:border-white/10" onClick={e => e.stopPropagation()}>
                <button
                    onClick={onClose}
                    className="absolute right-4 top-4 rounded-full p-1 text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                >
                    <X className="h-4 w-4" />
                </button>

                <div className="p-6">
                    <div className="mb-6 flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-100 dark:bg-purple-500/20 text-purple-600 dark:text-purple-400">
                            <Globe className="h-5 w-5" />
                        </div>
                        <div>
                            <h2 className="text-xl font-semibold text-zinc-900 dark:text-white">Publish Project</h2>
                            <p className="text-sm text-zinc-500 dark:text-zinc-400">Make your case study public</p>
                        </div>
                    </div>

                    <div className="mb-6 rounded-xl border border-zinc-200 dark:border-white/10 bg-zinc-50 dark:bg-black/50 p-4">
                        <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-zinc-500">Public URL</label>
                        <div className="truncate text-sm font-medium text-zinc-900 dark:text-white">
                            {typeof window !== 'undefined' ? window.location.origin + publicUrl : publicUrl}
                        </div>
                    </div>

                    <div className="mb-6">
                        <div className="mb-2 flex items-center justify-between">
                            <label className="text-sm font-medium text-zinc-900 dark:text-white flex items-center gap-2">
                                <Lock className="h-4 w-4 text-zinc-500" />
                                Password Protection
                            </label>
                            {!isPro && (
                                <span className="inline-flex rounded-full bg-purple-100 dark:bg-purple-500/20 px-2 py-0.5 text-[10px] font-semibold tracking-wide text-purple-600 dark:text-purple-400 uppercase">
                                    Pro feature
                                </span>
                            )}
                        </div>

                        {isPro ? (
                            <div>
                                <input
                                    type="password"
                                    placeholder="Optional: Enter a password..."
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full rounded-xl border border-zinc-300 dark:border-white/10 bg-white dark:bg-zinc-900 px-4 py-2.5 text-sm outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all dark:text-white"
                                />
                                <p className="mt-2 text-xs text-zinc-500">Leaving this blank means anyone with the link can view it.</p>
                            </div>
                        ) : (
                            <div className="rounded-xl border border-dashed border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-black/20 p-4 text-center">
                                <Lock className="mx-auto mb-2 h-5 w-5 text-zinc-400" />
                                <p className="text-sm text-zinc-600 dark:text-zinc-400">Upgrade to Pro to restrict access to your case studies with a password.</p>
                                <button className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-purple-600 dark:text-purple-400 hover:text-purple-700 hover:underline">
                                    <Sparkles className="h-3 w-3" />
                                    Upgrade to Pro
                                </button>
                            </div>
                        )}
                        {error && (
                            <p className="mt-4 text-sm text-red-500">{error}</p>
                        )}
                    </div>

                    <div className="flex justify-end gap-3 pt-4 border-t border-zinc-200 dark:border-white/10">
                        <button
                            onClick={onClose}
                            className="rounded-xl px-4 py-2 text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handlePublishClick}
                            disabled={isPublishing}
                            className="rounded-xl bg-purple-600 px-6 py-2 text-sm font-medium text-white shadow-md hover:bg-purple-700 transition-colors disabled:opacity-50"
                        >
                            {isPublishing ? 'Publishing...' : 'Publish Now'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
