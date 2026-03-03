'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { LayoutDashboard, Settings } from 'lucide-react'

export function DashboardNav() {
    const pathname = usePathname()

    return (
        <nav className="flex flex-1 flex-col gap-2">
            <Link
                href="/dashboard"
                className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${pathname === '/dashboard'
                        ? 'bg-zinc-100 text-zinc-900 dark:bg-white/10 dark:text-white'
                        : 'text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-white/5 dark:hover:text-white'
                    }`}
            >
                <LayoutDashboard className="h-4 w-4" />
                Projects
            </Link>
            <Link
                href="/dashboard/settings"
                className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${pathname === '/dashboard/settings'
                        ? 'bg-zinc-100 text-zinc-900 dark:bg-white/10 dark:text-white'
                        : 'text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-white/5 dark:hover:text-white'
                    }`}
            >
                <Settings className="h-4 w-4" />
                Settings
            </Link>
        </nav>
    )
}
