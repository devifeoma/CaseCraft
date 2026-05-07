import { createClient } from '@/utils/supabase/server'
import { cookies } from 'next/headers'
import { PasswordChallenge } from './password-challenge'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

function ReadOnlyMarkdown({ content }: { content: any }) {
    const value = content.text || ''
    return (
        <div className="prose max-w-none prose-p:leading-relaxed prose-headings:font-bold text-zinc-700 dark:prose-invert dark:text-zinc-300">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {value}
            </ReactMarkdown>
        </div>
    )
}

function ReadOnlyImage({ content }: { content: any }) {
    return (
        <div className="my-12 flex h-64 w-full items-center justify-center rounded-2xl bg-black/5 dark:bg-white/5 border border-zinc-200 dark:border-white/10">
            <span className="text-sm font-medium text-zinc-600 dark:text-zinc-400">Figma Image Placeholder</span>
        </div>
    )
}

function ReadOnlyTestimonial({ content }: { content: any }) {
    const quote = content.quote || "This redesign completely changed how our users interact with the platform..."
    const author = content.author || "Jane Doe"
    const role = content.role || "Product Manager"

    return (
        <blockquote className="my-12 border-l-4 border-blue-500 pl-6 text-zinc-700 dark:text-zinc-300">
            <p className="text-lg italic mb-4">&quot;{quote}&quot;</p>
            <footer>
                <div className="text-sm font-bold text-zinc-900 dark:text-white">{author}</div>
                <div className="text-xs text-zinc-500">{role}</div>
            </footer>
        </blockquote>
    )
}

function ReadOnlyBarChart({ content }: { content: any }) {
    const title = content.title || "Impact Metrics"
    const data = content.data || [
        { label: "Before", value: 40, color: "bg-zinc-300 dark:bg-zinc-700" },
        { label: "After", value: 85, color: "bg-brand-500" }
    ]
    const maxValue = Math.max(...data.map((d: any) => d.value), 100)

    return (
        <div className="my-12 p-6 border border-zinc-200 dark:border-white/10 rounded-xl bg-zinc-50 dark:bg-black/50 relative">
            <h4 className="text-sm font-medium text-zinc-900 dark:text-white mb-6 text-center">{title}</h4>
            <div className="flex justify-center gap-4 h-48 w-full max-w-md mx-auto">
                {data.map((item: any, idx: number) => (
                    <div key={idx} className="flex flex-col items-center gap-2 flex-1 group/bar h-full">
                        <div className="relative w-full flex justify-center flex-1 items-end">
                            <span className="absolute -top-6 text-xs font-medium text-zinc-500 opacity-0 group-hover/bar:opacity-100 transition-opacity">{item.value}</span>
                            <div 
                                className={`w-full max-w-[4rem] rounded-t-sm transition-all duration-500 ${item.color}`}
                                style={{ height: `${(item.value / maxValue) * 100}%` }}
                            />
                        </div>
                        <span className="text-xs font-medium text-zinc-600 dark:text-zinc-400 text-center truncate w-full">{item.label}</span>
                    </div>
                ))}
            </div>
        </div>
    )
}

function ReadOnlyProgressRing({ content }: { content: any }) {
    const percentage = content.percentage || 75
    const label = content.label || "Performance Increase"
    const color = content.color || "text-emerald-500"

    const radius = 60;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    return (
        <div className="my-12 p-8 border border-zinc-200 dark:border-white/10 rounded-xl bg-zinc-50 dark:bg-black/50 flex flex-col items-center justify-center">
            <div className="relative w-40 h-40 flex items-center justify-center">
                <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 140 140">
                    <circle 
                        cx="70" cy="70" r={radius} 
                        className="stroke-zinc-200 dark:stroke-zinc-800"
                        strokeWidth="12" fill="none"
                    />
                    <circle 
                        cx="70" cy="70" r={radius} 
                        className={`stroke-current ${color} transition-all duration-1000 ease-out`}
                        strokeWidth="12" fill="none" strokeLinecap="round"
                        style={{ strokeDasharray: circumference, strokeDashoffset }}
                    />
                </svg>
                <span className="text-3xl font-semibold text-zinc-900 dark:text-white relative z-10">{percentage}%</span>
            </div>
            <p className="mt-4 text-sm font-medium text-zinc-600 dark:text-zinc-400">{label}</p>
        </div>
    )
}

export default async function PublicProjectPage({
    params,
}: {
    params: Promise<{ id: string }>
}) {
    const resolvedParams = await params
    const projectId = resolvedParams.id

    let project: any = null
    let sections: any[] = []

    // Bypass DB check for hardcoded demo routes if any exist, otherwise check DB
    if (!projectId.includes('demo') && !projectId.includes('mock')) {
        const supabase = await createClient()
        
        // Fetch project metadata
        const { data: projData } = await supabase
            .from('projects')
            .select('password_hash, is_published, title, vibe')
            .eq('id', projectId)
            .single()

        project = projData

        if (!project || !project.is_published) {
            return (
                <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-black">
                    <p className="text-zinc-500">This project is not public or does not exist.</p>
                </div>
            )
        }

        // Check password protection
        if (project.password_hash) {
            const cookieStore = await cookies()
            const isUnlocked = cookieStore.get(`casecraft_unlocked_${projectId}`)

            if (!isUnlocked) {
                return <PasswordChallenge projectId={projectId} />
            }
        }

        // Fetch actual sections
        const { data: secData } = await supabase
            .from('sections')
            .select('*')
            .eq('project_id', projectId)
            .order('sort_order', { ascending: true })

        sections = secData || []
    }

    const title = project?.title || 'Untitled Project'
    const subtitle = project?.vibe || 'CaseCraft Generated Case Study'

    return (
        <div className="min-h-screen bg-background text-foreground selection:bg-blue-500/30">
            <main className="mx-auto max-w-3xl px-6 py-24 sm:py-32">
                <div className="mb-16">
                    <h1 className="mb-4 text-4xl font-semibold tracking-tight text-zinc-900 dark:text-white sm:text-5xl">{title}</h1>
                    <p className="text-xl text-zinc-600 dark:text-zinc-400">{subtitle}</p>
                </div>

                <div className="flex flex-col gap-8">
                    {sections.map((section) => {
                        return (
                            <div key={section.id}>
                                {section.type === 'ai_text' && <ReadOnlyMarkdown content={section.content} />}
                                {section.type === 'figma_image' && <ReadOnlyImage content={section.content} />}
                                {section.type === 'testimonial' && <ReadOnlyTestimonial content={section.content} />}
                                {section.type === 'barchart' && <ReadOnlyBarChart content={section.content} />}
                                {section.type === 'ring' && <ReadOnlyProgressRing content={section.content} />}
                            </div>
                        )
                    })}

                    {sections.length === 0 && (
                        <div className="text-center py-12">
                            <p className="text-zinc-500">This project has no content yet.</p>
                        </div>
                    )}
                </div>

                {/* Footer / Watermark */}
                <footer className="mt-32 flex items-center justify-between border-t border-zinc-200 dark:border-white/10 pt-8 text-sm text-zinc-500 dark:text-zinc-400">
                    <span>© {new Date().getFullYear()} Author Name</span>
                    <a href="/" className="flex items-center gap-2 hover:text-zinc-900 dark:hover:text-white transition-colors">
                        <div className="h-4 w-4 rounded-sm bg-blue-500"></div>
                        Powered by CaseCraft
                    </a>
                </footer>
            </main>
        </div>
    )
}
