import { Plus, ArrowRight, FolderPlus } from 'lucide-react'
import Link from 'next/link'

export default function DashboardPage() {
    return (
        <div className="flex flex-col max-w-5xl mx-auto w-full h-full">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-semibold tracking-tight text-zinc-900 dark:text-white">Your Projects</h1>
                    <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">Manage and edit your case studies.</p>
                </div>
                <Link
                    href="/new"
                    className="hidden sm:flex h-10 items-center justify-center rounded-lg bg-purple-600 px-4 text-sm font-medium text-white transition-colors hover:bg-purple-500"
                >
                    <Plus className="mr-2 h-4 w-4" />
                    New Project
                </Link>
            </div>

            {/* Empty State */}
            <div className="flex flex-1 flex-col items-center justify-center rounded-2xl border border-dashed border-zinc-300 dark:border-white/10 bg-zinc-50 dark:bg-white/[0.02] p-12 text-center mt-12 transition-colors">
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-black/5 dark:bg-white/5">
                    <FolderPlus className="h-6 w-6 text-zinc-500 dark:text-zinc-400" />
                </div>
                <h3 className="mb-1 text-lg font-medium text-zinc-900 dark:text-white">No projects yet</h3>
                <p className="mx-auto mb-6 max-w-sm text-sm text-zinc-600 dark:text-zinc-400">
                    Get started by creating a new case study. Paste a Figma link and let our AI do the heavy lifting.
                </p>
                <Link
                    href="/new"
                    className="group flex h-10 items-center justify-center rounded-lg bg-zinc-900 dark:bg-white px-5 text-sm font-medium text-white dark:text-black transition-colors hover:bg-zinc-800 dark:hover:bg-zinc-200"
                >
                    Create your first project
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
            </div>
        </div>
    )
}
