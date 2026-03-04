'use client'

import { useState, use, useEffect } from 'react'
import { Sparkles, ArrowRight, CheckCircle2, ChevronRight, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { PublishModal } from './publish-modal'
import { generateCaseStudyCopy } from './actions'
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragEndEvent
} from '@dnd-kit/core'
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
    useSortable
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { saveProjectSections, publishProject, checkIsPro } from './actions'

type WizardStep = 'goal' | 'constraints' | 'outcome' | 'generating' | 'done'

// A basic Sortable Item wrapper
function SortableItem({ id, children, onRemove }: { id: string, children: React.ReactNode, onRemove: () => void }) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
    } = useSortable({ id })

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    }

    return (
        <div ref={setNodeRef} style={style} className="group relative mb-4">
            <div
                {...attributes}
                {...listeners}
                className="absolute left-0 top-1/2 -translate-x-full -translate-y-1/2 p-2 opacity-0 transition-opacity group-hover:opacity-100 cursor-grab active:cursor-grabbing"
            >
                <div className="flex flex-col gap-0.5">
                    <div className="h-1 w-1 rounded-full bg-zinc-500" />
                    <div className="h-1 w-1 rounded-full bg-zinc-500" />
                    <div className="h-1 w-1 rounded-full bg-zinc-500" />
                </div>
            </div>

            <div className="absolute right-4 top-4 z-10 opacity-0 transition-opacity group-hover:opacity-100 flex gap-2">
                <button
                    onClick={(e) => { e.stopPropagation(); onRemove(); }}
                    className="text-xs font-medium text-red-400 hover:text-red-300 bg-black/50 px-2 py-1 rounded backdrop-blur-sm"
                >
                    Remove
                </button>
            </div>

            {children}
        </div>
    )
}

export default function BuilderPage({ params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = use(params)
    const projectId = resolvedParams.id

    const [step, setStep] = useState<WizardStep>('goal')
    const [goal, setGoal] = useState('')
    const [constraints, setConstraints] = useState('')
    const [outcome, setOutcome] = useState('')
    const [generatedText, setGeneratedText] = useState('')

    // DND State
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [sections, setSections] = useState<any[]>([])
    const [isSaving, setIsSaving] = useState(false)
    const [isPublishing, setIsPublishing] = useState(false)
    const [isPublishModalOpen, setIsPublishModalOpen] = useState(false)
    const [isPro, setIsPro] = useState(false)

    useEffect(() => {
        const checkTier = async () => {
            const hasPro = await checkIsPro()
            setIsPro(hasPro)
        }
        checkTier()
    }, [])

    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
        useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
    )

    async function handleGenerate() {
        setStep('generating')
        try {
            const { copy } = await generateCaseStudyCopy(goal, constraints, outcome)
            setGeneratedText(copy)

            // Auto-add the generated text as the first block
            setSections([{
                id: `ai_text_${Date.now()}`,
                type: 'ai_text',
                content: { text: copy }
            }])

            setStep('done')
        } catch (e) {
            console.error(e)
            setStep('outcome')
        }
    }

    // Add items from sidebar
    const addSection = (type: string) => {
        const newSection = {
            id: `${type}_${Date.now()}`,
            type: type,
            content: type === 'figma_image' ? { url: '/placeholder:image' } : {}
        }
        setSections([...sections, newSection])
    }

    const removeSection = (idToRemove: string) => {
        setSections(sections.filter(s => s.id !== idToRemove))
    }

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event
        if (over && active.id !== over.id) {
            setSections((items) => {
                const oldIndex = items.findIndex((i) => i.id === active.id)
                const newIndex = items.findIndex((i) => i.id === over.id)
                return arrayMove(items, oldIndex, newIndex)
            })
        }
    }

    const handleSave = async () => {
        setIsSaving(true)
        try {
            await saveProjectSections(projectId, sections)
        } catch (e) {
            console.error(e)
            alert("Failed to save.")
        }
        setIsSaving(false)
    }

    const handlePublishClick = () => {
        setIsPublishModalOpen(true)
    }

    const handleConfirmPublish = async (password?: string) => {
        setIsPublishing(true)
        try {
            await saveProjectSections(projectId, sections) // save latest
            await publishProject(projectId, password)
            window.location.href = `/dashboard`
        } catch (e: any) {
            console.error(e)
            setIsPublishing(false)
            alert(e.message || "Failed to publish project.")
        }
    }

    // --- WIZARD RENDER ---
    if (step !== 'done') {
        return (
            <div className="flex min-h-screen w-full flex-col items-center justify-center bg-background text-foreground p-6 transition-colors duration-300 relative">
                <Link href="/dashboard" className="absolute top-6 left-6 flex items-center gap-3 hover:opacity-80 transition-opacity">
                    <div className="relative flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-brand-500 to-indigo-600 shadow-lg shadow-brand-500/20">
                        <Sparkles className="h-4 w-4 text-white" />
                        <div className="absolute inset-0 rounded-lg ring-1 ring-white/20"></div>
                    </div>
                    <span className="text-lg font-semibold tracking-tight text-zinc-900 dark:text-white">CaseCraft</span>
                </Link>

                <div className="w-full max-w-xl">
                    <div className="mb-8 flex items-center gap-4 text-sm font-medium">
                        <div className={`flex items-center gap-2 ${step === 'goal' ? 'text-zinc-900 dark:text-white' : 'text-zinc-500'}`}>
                            <span className="flex h-6 w-6 items-center justify-center rounded-full border border-current text-xs">1</span>
                            Goal
                        </div>
                        <ChevronRight className="h-4 w-4 text-zinc-300 dark:text-zinc-700" />
                        <div className={`flex items-center gap-2 ${step === 'constraints' ? 'text-zinc-900 dark:text-white' : 'text-zinc-500'}`}>
                            <span className="flex h-6 w-6 items-center justify-center rounded-full border border-current text-xs">2</span>
                            Constraints
                        </div>
                        <ChevronRight className="h-4 w-4 text-zinc-300 dark:text-zinc-700" />
                        <div className={`flex items-center gap-2 ${step === 'outcome' ? 'text-zinc-900 dark:text-white' : 'text-zinc-500'}`}>
                            <span className="flex h-6 w-6 items-center justify-center rounded-full border border-current text-xs">3</span>
                            Outcome
                        </div>
                    </div>

                    <div className="rounded-2xl border border-zinc-200 bg-white/50 p-8 backdrop-blur-md dark:border-white/5 dark:bg-white/5">
                        {step === 'goal' && (
                            <div className="animate-in fade-in slide-in-from-bottom-4">
                                <h2 className="mb-2 text-2xl font-semibold text-zinc-900 dark:text-white">What was the primary goal?</h2>
                                <p className="mb-6 text-sm text-zinc-600 dark:text-zinc-400">Briefly explain what you set out to achieve with this project.</p>
                                <textarea
                                    className="mb-6 min-h-[120px] w-full resize-none rounded-xl border border-zinc-200 dark:border-white/10 bg-zinc-50 dark:bg-black/50 p-4 text-zinc-900 dark:text-white outline-none placeholder:text-zinc-400 dark:placeholder:text-zinc-600 focus:border-purple-500/50 transition-colors"
                                    placeholder="e.g., Redesign the onboarding flow to reduce drop-off rates..."
                                    value={goal}
                                    onChange={(e) => setGoal(e.target.value)}
                                />
                                <button
                                    onClick={() => setStep('constraints')}
                                    disabled={!goal.trim()}
                                    className="btn-primary flex w-full items-center justify-center disabled:opacity-50 disabled:pointer-events-none"
                                >
                                    Next Step <ArrowRight className="ml-2 h-4 w-4" />
                                </button>
                            </div>
                        )}

                        {step === 'constraints' && (
                            <div className="animate-in fade-in slide-in-from-bottom-4">
                                <h2 className="mb-2 text-2xl font-semibold text-zinc-900 dark:text-white">Any constraints?</h2>
                                <p className="mb-6 text-sm text-zinc-600 dark:text-zinc-400">What held you back? Time? Legacy tech? Budget?</p>
                                <textarea
                                    className="mb-6 min-h-[120px] w-full resize-none rounded-xl border border-zinc-200 dark:border-white/10 bg-zinc-50 dark:bg-black/50 p-4 text-zinc-900 dark:text-white outline-none placeholder:text-zinc-400 dark:placeholder:text-zinc-600 focus:border-purple-500/50 transition-colors"
                                    placeholder="e.g., We had a 2-week deadline and couldn't touch the backend API..."
                                    value={constraints}
                                    onChange={(e) => setConstraints(e.target.value)}
                                />
                                <div className="flex gap-3">
                                    <button onClick={() => setStep('goal')} className="btn-secondary px-6">
                                        Back
                                    </button>
                                    <button
                                        onClick={() => setStep('outcome')}
                                        disabled={!constraints.trim()}
                                        className="btn-primary flex flex-1 items-center justify-center disabled:opacity-50 disabled:pointer-events-none"
                                    >
                                        Next Step <ArrowRight className="ml-2 h-4 w-4" />
                                    </button>
                                </div>
                            </div>
                        )}

                        {step === 'outcome' && (
                            <div className="animate-in fade-in slide-in-from-bottom-4">
                                <h2 className="mb-2 text-2xl font-semibold text-zinc-900 dark:text-white">What was the outcome?</h2>
                                <p className="mb-6 text-sm text-zinc-600 dark:text-zinc-400">Brag a little. What impact did your design have?</p>
                                <textarea
                                    className="mb-6 min-h-[120px] w-full resize-none rounded-xl border border-zinc-200 dark:border-white/10 bg-zinc-50 dark:bg-black/50 p-4 text-zinc-900 dark:text-white outline-none placeholder:text-zinc-400 dark:placeholder:text-zinc-600 focus:border-purple-500/50 transition-colors"
                                    placeholder="e.g., Conversion increased by 14% and support tickets dropped by half."
                                    value={outcome}
                                    onChange={(e) => setOutcome(e.target.value)}
                                />
                                <div className="flex gap-3">
                                    <button onClick={() => setStep('constraints')} className="btn-secondary px-6">
                                        Back
                                    </button>
                                    <button
                                        onClick={handleGenerate}
                                        disabled={!outcome.trim()}
                                        className="btn-primary flex flex-1 items-center justify-center disabled:opacity-50 disabled:pointer-events-none"
                                    >
                                        <Sparkles className="mr-2 h-4 w-4" /> Generate Context
                                    </button>
                                </div>
                            </div>
                        )}

                        {step === 'generating' && (
                            <div className="flex flex-col items-center justify-center py-12 text-center animate-in fade-in">
                                <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-purple-500/10">
                                    <Sparkles className="h-8 w-8 animate-pulse text-purple-600 dark:text-purple-400" />
                                </div>
                                <h2 className="mb-2 text-xl font-medium text-zinc-900 dark:text-white">Crafting your narrative...</h2>
                                <p className="max-w-xs text-sm text-zinc-600 dark:text-zinc-400">Our AI agent is formatting your inputs into a professional case study structure.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        )
    }

    // --- STORYLINE BUILDER RENDER ---
    return (
        <div className="flex min-h-screen w-full bg-background text-foreground transition-colors duration-300">
            {/* Topbar */}
            <header className="fixed left-0 right-0 top-0 z-50 flex h-14 items-center justify-between border-b border-zinc-200 bg-white/80 px-4 backdrop-blur-md dark:border-white/5 dark:bg-black/80">
                <div className="flex items-center gap-4">
                    <Link href="/dashboard" className="flex items-center gap-2 pr-4 border-r border-zinc-200 dark:border-white/10 hover:opacity-80 transition-opacity">
                        <div className="relative flex h-6 w-6 items-center justify-center rounded-md bg-gradient-to-br from-brand-500 to-indigo-600 shadow-sm">
                            <Sparkles className="h-3 w-3 text-white" />
                        </div>
                        <span className="font-semibold tracking-tight text-zinc-900 dark:text-white hidden sm:block">CaseCraft</span>
                    </Link>
                    <span className="text-sm font-medium text-zinc-500 dark:text-zinc-400 truncate max-w-[200px]">Project: {projectId}</span>
                </div>
                <div className="flex items-center gap-3">
                    <button onClick={handleSave} disabled={isSaving} className="text-xs font-medium text-zinc-400 hover:text-white transition-colors flex items-center gap-1 min-w-[60px] justify-center">
                        {isSaving ? <span className="animate-pulse">Saving...</span> : <><CheckCircle2 className="h-3 w-3" /> Save</>}
                    </button>
                    <button onClick={handlePublishClick} disabled={isPublishing} className="rounded-md bg-white px-4 py-1.5 text-xs font-semibold text-black transition-colors hover:bg-zinc-200 disabled:opacity-50">
                        {isPublishing ? "Publishing..." : "Publish"}
                    </button>
                </div>
            </header>

            {/* Sidebar Assets */}
            <aside className="fixed bottom-0 left-0 top-14 w-64 border-r border-zinc-200 bg-zinc-50/50 p-4 backdrop-blur-md overflow-y-auto dark:border-white/5 dark:bg-black/50">
                <h3 className="mb-4 text-xs font-semibold uppercase tracking-wider text-zinc-500">Extracted Assets</h3>
                <div className="flex flex-col gap-3 mb-8">
                    <div onClick={() => addSection('figma_image')} className="group cursor-pointer rounded-lg border border-white/5 bg-white/5 p-2 hover:border-white/20 transition-colors">
                        <div className="h-24 w-full rounded bg-zinc-800 mb-2 flex flex-col items-center justify-center text-zinc-600">
                            + Add Image
                        </div>
                        <p className="text-xs font-medium text-zinc-400 group-hover:text-white">Wireframe Asset</p>
                    </div>
                    <div onClick={() => addSection('figma_image')} className="group cursor-pointer rounded-lg border border-white/5 bg-white/5 p-2 hover:border-white/20 transition-colors">
                        <div className="h-24 w-full rounded bg-zinc-800 mb-2 flex flex-col items-center justify-center text-zinc-600">
                            + Add Image
                        </div>
                        <p className="text-xs font-medium text-zinc-400 group-hover:text-white">Final UI Frame</p>
                    </div>
                </div>

                <h3 className="mb-4 text-xs font-semibold uppercase tracking-wider text-zinc-500">Evidence Vault</h3>
                <div className="flex flex-col gap-3">
                    <button onClick={() => addSection('barchart')} className="w-full text-left rounded-lg border border-white/5 bg-white/5 px-4 py-3 text-sm font-medium text-zinc-300 hover:bg-white/10 transition-colors">
                        + Add Bar Chart
                    </button>
                    <button onClick={() => addSection('ring')} className="w-full text-left rounded-lg border border-white/5 bg-white/5 px-4 py-3 text-sm font-medium text-zinc-300 hover:bg-white/10 transition-colors">
                        + Add Progress Ring
                    </button>
                    <button onClick={() => addSection('testimonial')} className="w-full text-left rounded-lg border border-white/5 bg-white/5 px-4 py-3 text-sm font-medium text-zinc-300 hover:bg-white/10 transition-colors">
                        + Add Testimonial
                    </button>
                </div>
            </aside>

            {/* Main Storyline Canvas */}
            <main className="ml-64 mt-14 flex-1 p-8">
                <div className="mx-auto max-w-2xl">
                    <div className="mb-8 border-l-2 border-purple-500 pl-6">
                        <h1 className="mb-2 text-4xl font-semibold tracking-tight text-zinc-900 dark:text-white">Untitled Project</h1>
                        <p className="text-zinc-600 dark:text-zinc-400">CaseCraft Generated Case Study</p>
                    </div>

                    <DndContext
                        sensors={sensors}
                        collisionDetection={closestCenter}
                        onDragEnd={handleDragEnd}
                    >
                        <SortableContext
                            items={sections.map(s => s.id)}
                            strategy={verticalListSortingStrategy}
                        >
                            <div className="flex flex-col gap-2">
                                {sections.map((section) => (
                                    <SortableItem key={section.id} id={section.id} onRemove={() => removeSection(section.id)}>
                                        <div className="rounded-2xl border border-white/5 bg-white/5 p-6 hover:border-white/10 transition-colors">
                                            {section.type === 'ai_text' && (
                                                <div
                                                    className="prose max-w-none prose-headings:font-medium text-zinc-700 dark:prose-invert dark:text-zinc-300"
                                                    dangerouslySetInnerHTML={{ __html: section.content.text.replace(/\n\n/g, '<br/><br/>').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }}
                                                />
                                            )}
                                            {section.type === 'figma_image' && (
                                                <div className="w-full aspect-video bg-zinc-100 dark:bg-zinc-900 rounded-lg flex flex-col items-center justify-center border border-zinc-300 dark:border-white/10 border-dashed transition-colors">
                                                    <span className="text-sm text-zinc-500 font-medium">Figma Image Placeholder</span>
                                                </div>
                                            )}
                                            {section.type === 'barchart' && (
                                                <div className="h-64 border border-zinc-200 dark:border-white/10 rounded-xl bg-zinc-50 dark:bg-black/50 flex flex-col items-center justify-center transition-colors">
                                                    <span className="text-brand-600 dark:text-brand-400 font-medium tracking-wide">Interactive Bar Chart Module</span>
                                                    <span className="text-xs text-zinc-500 mt-2">Data viz injected here</span>
                                                </div>
                                            )}
                                            {section.type === 'ring' && (
                                                <div className="h-48 border border-zinc-200 dark:border-white/10 rounded-xl bg-zinc-50 dark:bg-black/50 flex flex-col items-center justify-center transition-colors">
                                                    <span className="text-emerald-600 dark:text-emerald-400 font-medium tracking-wide">Progress Ring Module</span>
                                                    <span className="text-xs text-zinc-500 mt-2">+100% Increase</span>
                                                </div>
                                            )}
                                            {section.type === 'testimonial' && (
                                                <div className="p-8 border border-zinc-200 dark:border-white/10 rounded-xl bg-zinc-50 dark:bg-black/50 relative overflow-hidden transition-colors">
                                                    <div className="absolute top-0 right-0 p-8 text-8xl text-black/5 dark:text-white/5 leading-none font-serif opacity-50">&quot;</div>
                                                    <p className="text-zinc-700 dark:text-zinc-300 italic mb-4 relative z-10">&quot;This redesign completely changed how our users interact with the platform...&quot;</p>
                                                    <div className="flex items-center gap-3">
                                                        <div className="h-10 w-10 rounded-full bg-zinc-200 dark:bg-zinc-800"></div>
                                                        <div><p className="text-sm text-zinc-900 dark:text-white font-medium">Jane Doe</p><p className="text-xs text-zinc-500">Product Manager</p></div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </SortableItem>
                                ))}
                            </div>
                        </SortableContext>
                    </DndContext>

                    {sections.length === 0 && (
                        <div className="mt-8 flex items-center justify-center rounded-2xl border border-dashed border-white/10 py-12">
                            <p className="text-sm font-medium text-zinc-500">Click elements in the sidebar to add them here</p>
                        </div>
                    )}
                </div>
            </main>

            <PublishModal
                isOpen={isPublishModalOpen}
                onClose={() => setIsPublishModalOpen(false)}
                onPublish={handleConfirmPublish}
                isPublishing={isPublishing}
                isPro={isPro}
                projectId={projectId}
            />
        </div>
    )
}
