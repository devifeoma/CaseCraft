import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { LayoutDashboard, LogOut, Settings, Plus } from 'lucide-react'
import { ThemeToggle } from '@/components/ThemeToggle'
import { DashboardNav } from './nav'

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const supabase = await createClient()
    const { data: { user }, error } = await supabase.auth.getUser()

    if (error || !user) {
        redirect('/login')
    }

    return (
        <div className="flex min-h-screen w-full bg-background text-foreground selection:bg-purple-500/30 transition-colors duration-300">
            {/* Sidebar */}
            <aside className="fixed bottom-0 top-0 hidden w-64 flex-col border-r border-zinc-200 bg-white/50 dark:border-white/5 dark:bg-black/50 p-6 backdrop-blur-md sm:flex">
                <Link href="/" className="mb-8 flex items-center gap-2 hover:opacity-80 transition-opacity">
                    <div className="h-6 w-6 rounded-md bg-gradient-to-br from-purple-500 to-indigo-600" />
                    <span className="font-semibold tracking-tight text-zinc-900 dark:text-white">CaseCraft</span>
                </Link>

                <DashboardNav />

                <div className="mt-auto flex flex-col gap-4 border-t border-zinc-200 dark:border-white/5 pt-4 text-sm">
                    <div className="flex flex-col gap-1">
                        <span className="text-zinc-500 text-xs font-medium uppercase tracking-wider">Account</span>
                        <span className="truncate text-zinc-700 dark:text-zinc-300">{user.email}</span>
                        <span className="mt-1 inline-flex w-fit items-center rounded-full bg-zinc-200 dark:bg-zinc-800 px-2.5 py-0.5 text-xs font-medium text-zinc-700 dark:text-zinc-300">Free Plan</span>
                    </div>

                    <div className="flex items-center justify-between">
                        <form action="/auth/signout" method="post" className="flex-1 mr-2">
                            <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left font-medium text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 transition-colors dark:text-zinc-400 dark:hover:bg-white/5 dark:hover:text-white">
                                <LogOut className="h-4 w-4" />
                                Sign out
                            </button>
                        </form>
                        <ThemeToggle />
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex flex-1 flex-col sm:ml-64">
                {/* Mobile Header */}
                <header className="flex h-14 items-center justify-between border-b border-zinc-200 bg-white/50 dark:border-white/5 dark:bg-black/50 px-4 backdrop-blur-md sm:hidden">
                    <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                        <div className="h-5 w-5 rounded-md bg-gradient-to-br from-purple-500 to-indigo-600" />
                        <span className="font-semibold tracking-tight text-zinc-900 dark:text-white">CaseCraft</span>
                    </Link>
                    <button className="flex h-8 items-center justify-center rounded-md bg-purple-600 px-3 text-xs font-medium text-white">
                        <Plus className="mr-1 h-3 w-3" /> New
                    </button>
                </header>

                <div className="flex-1 p-6 sm:p-10">
                    {children}
                </div>
            </main>
        </div>
    )
}
