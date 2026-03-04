import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { CheckCircle2, User, CreditCard, Sparkles } from 'lucide-react'
import { ProfileForm } from './profile-form'

export default async function SettingsPage() {
    const supabase = await createClient()
    const { data: { user }, error } = await supabase.auth.getUser()

    if (error || !user) {
        redirect('/login')
    }

    const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

    return (
        <div className="mx-auto max-w-4xl animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="mb-8">
                <h1 className="text-3xl font-semibold tracking-tight text-zinc-900 dark:text-white">Settings</h1>
                <p className="mt-2 text-zinc-600 dark:text-zinc-400">Manage your account preferences and subscription.</p>
            </div>

            <div className="grid gap-8 sm:grid-cols-12">
                {/* Sidebar Navigation for Settings (Optional, visual only for now) */}
                <div className="col-span-12 sm:col-span-3 flex flex-col gap-1">
                    <div className="flex items-center gap-2 rounded-lg bg-zinc-100 dark:bg-white/10 px-3 py-2 text-sm font-medium text-zinc-900 dark:text-white transition-colors">
                        <User className="h-4 w-4" />
                        Account
                    </div>
                </div>

                {/* Main Settings Content */}
                <div className="col-span-12 sm:col-span-9 flex flex-col gap-8">
                    {/* Profile Section */}
                    <section className="rounded-2xl border border-zinc-200 dark:border-white/5 bg-white dark:bg-white/5 p-6 shadow-sm backdrop-blur-xl">
                        <div className="flex flex-col mb-6">
                            <h2 className="text-lg font-semibold text-zinc-900 dark:text-white">Profile Information</h2>
                            <p className="text-sm text-zinc-600 dark:text-zinc-400">Update your account profile details and public avatar.</p>
                        </div>

                        <div className="flex flex-col gap-8">
                            <div>
                                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">Email Address</label>
                                <input
                                    type="email"
                                    disabled
                                    value={user.email || ''}
                                    className="w-full max-w-md rounded-xl border border-zinc-200 dark:border-white/10 bg-zinc-50 dark:bg-black/50 px-4 py-2.5 text-sm text-zinc-500 dark:text-zinc-500 cursor-not-allowed outline-none transition-all"
                                />
                                <p className="mt-2 text-xs text-zinc-500">Your email address is currently managed through your authentication provider.</p>
                            </div>

                            <hr className="border-zinc-200 dark:border-white/10" />

                            <ProfileForm initialData={profile} />
                        </div>
                    </section>

                    {/* Subscription Section */}
                    <section className="rounded-2xl border border-zinc-200 dark:border-white/5 bg-white dark:bg-white/5 p-6 shadow-sm backdrop-blur-xl relative overflow-hidden">
                        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
                            <div>
                                <div className="flex items-center gap-3 mb-2">
                                    <h2 className="text-lg font-semibold text-zinc-900 dark:text-white">Subscription Plan</h2>
                                    <span className="inline-flex items-center rounded-full bg-zinc-200 dark:bg-zinc-800 px-2.5 py-0.5 text-xs font-medium text-zinc-700 dark:text-zinc-300">
                                        Free Tier
                                    </span>
                                </div>
                                <p className="text-sm text-zinc-600 dark:text-zinc-400 max-w-md">
                                    You are currently on the Free plan. Upgrade to Pro to unlock unlimited projects, password protection, and PDF exports.
                                </p>
                            </div>

                            <button className="whitespace-nowrap inline-flex items-center justify-center gap-2 rounded-xl bg-purple-600 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-purple-500 shadow-lg shadow-purple-500/20 w-full sm:w-auto">
                                <Sparkles className="h-4 w-4" />
                                Upgrade to Pro
                            </button>
                        </div>

                        {/* Decorative Background for Subscription */}
                        <div className="absolute right-0 top-0 h-full w-1/2 bg-gradient-to-l from-brand-500/5 to-transparent pointer-events-none" />
                    </section>
                </div>
            </div>
        </div>
    )
}
