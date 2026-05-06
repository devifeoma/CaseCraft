import { Plus, ArrowRight, FolderPlus, Globe, Edit2, Lock } from 'lucide-react'
import Link from 'next/link'
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

export default async function DashboardPage() {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
        redirect('/login')
    }

    const { data: projects, error } = await supabase
        .from('projects')
        .select('*')
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false })

    if (error) {
        console.error("Error fetching projects:", error)
    }

    const hasProjects = projects && projects.length > 0
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

            {/* Content */}
            {!hasProjects ? (
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
            ) : (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 mt-8">
                    {projects.map((project) => (
                        <div key={project.id} className="group relative flex flex-col rounded-2xl border border-zinc-200 dark:border-white/10 bg-white dark:bg-zinc-900/50 p-6 shadow-sm transition-all hover:shadow-md hover:border-zinc-300 dark:hover:border-white/20">
                            <Link href={`/builder/${project.id}`} className="absolute inset-0 z-0" aria-label={`Edit ${project.title || 'Untitled Project'}`} />
                            <div className="mb-4 flex items-start justify-between relative z-10 pointer-events-none">
                                <h3 className="text-lg font-semibold text-zinc-900 dark:text-white truncate pr-4">
                                    {project.title || 'Untitled Project'}
                                </h3>
                                {project.is_published ? (
                                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 dark:bg-emerald-500/20 px-2.5 py-1 text-[10px] font-semibold tracking-wide text-emerald-700 dark:text-emerald-400 uppercase">
                                        <Globe className="h-3 w-3" /> Published
                                    </span>
                                ) : (
                                    <span className="inline-flex items-center rounded-full bg-zinc-100 dark:bg-white/10 px-2.5 py-1 text-[10px] font-semibold tracking-wide text-zinc-600 dark:text-zinc-400 uppercase">
                                        Draft
                                    </span>
                                )}
                            </div>

                            <p className="text-sm text-zinc-500 dark:text-zinc-400 line-clamp-2 mb-6 flex-1 relative z-10 pointer-events-none">
                                {project.vibe || 'No description available yet.'}
                            </p>

                            <div className="flex items-center justify-between border-t border-zinc-100 dark:border-white/5 pt-4 relative z-10">
                                <div className="text-xs text-zinc-400 dark:text-zinc-500 flex items-center gap-2 pointer-events-none">
                                    {project.password_hash && (
                                        <span title="Password Protected"><Lock className="h-3 w-3 text-purple-500" /></span>
                                    )}
                                    Updated {new Date(project.updated_at).toLocaleDateString()}
                                </div>
                                <div className="flex gap-2">
                                    {project.is_published && (
                                        <Link
                                            href={`/p/${project.id}`}
                                            target="_blank"
                                            className="rounded-lg p-2 text-zinc-400 hover:bg-zinc-100 dark:hover:bg-white/5 hover:text-zinc-900 dark:hover:text-white transition-colors"
                                            title="View Public Link"
                                        >
                                            <Globe className="h-4 w-4" />
                                        </Link>
                                    )}
                                    <Link
                                        href={`/builder/${project.id}`}
                                        className="rounded-lg p-2 text-zinc-400 hover:bg-zinc-100 dark:hover:bg-white/5 hover:text-zinc-900 dark:hover:text-white transition-colors"
                                        title="Edit Project"
                                    >
                                        <Edit2 className="h-4 w-4" />
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
