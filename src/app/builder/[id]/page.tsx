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
import { saveProjectSections, publishProject, checkIsPro, uploadProjectImage } from './actions'

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

function EditableMarkdown({ initialValue, onChange }: { initialValue: string, onChange: (val: string) => void }) {
    const [isEditing, setIsEditing] = useState(false)
    const [value, setValue] = useState(initialValue)

    useEffect(() => {
        setValue(initialValue)
    }, [initialValue])

    const handleBlur = () => {
        setIsEditing(false)
        onChange(value)
    }

    if (isEditing) {
        return (
            <div className="flex flex-col gap-2">
                <textarea
                    autoFocus
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    onBlur={handleBlur}
                    className="w-full min-h-[300px] resize-y bg-transparent text-zinc-700 dark:text-zinc-300 outline-none border-none p-0 focus:ring-0 leading-relaxed md:text-md"
                    placeholder="Start typing your case study text here (Markdown supported)..."
                />
                <div className="flex justify-end">
                    <button
                        onMouseDown={(e) => { e.preventDefault(); handleBlur(); }}
                        className="rounded-lg bg-zinc-100 dark:bg-zinc-800 px-3 py-1.5 text-xs font-medium text-zinc-600 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition"
                    >
                        Done
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div
            onClick={() => setIsEditing(true)}
            className="prose max-w-none prose-headings:font-medium text-zinc-700 dark:prose-invert dark:text-zinc-300 cursor-text hover:bg-black/5 dark:hover:bg-white/5 rounded-lg transition-colors min-h-[200px] -m-2 p-2 ring-1 ring-transparent hover:ring-zinc-200 dark:hover:ring-white/10"
            dangerouslySetInnerHTML={{ __html: value ? value.replace(/\n\n/g, '<br/><br/>').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/^# (.*$)/gim, '<h1 class="font-bold text-2xl mt-4 mb-2">$1</h1>') : '<span class="text-zinc-400">Click to add text...</span>' }}
        />
    )
}

function FigmaImageBlock({ section, projectId, updateSection }: { section: any, projectId: string, updateSection: (id: string, content: any) => void }) {
    const [isUploading, setIsUploading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        setIsUploading(true)
        setError(null)
        try {
            const formData = new FormData()
            formData.append('projectId', projectId)
            formData.append('file', file)

            const res = await uploadProjectImage(formData)
            if (res.success && res.url) {
                updateSection(section.id, { ...section.content, url: res.url })
            }
        } catch (err: any) {
            console.error(err)
            setError(err.message || 'Upload failed')
        } finally {
            setIsUploading(false)
        }
    }

    const hasImage = section.content?.url && section.content.url !== '/placeholder:image'

    return (
        <div className={`w-full ${hasImage ? '' : 'aspect-video'} bg-zinc-100 dark:bg-zinc-900 rounded-lg flex flex-col items-center justify-center border border-zinc-300 dark:border-white/10 ${hasImage ? '' : 'border-dashed'} transition-colors relative overflow-hidden group`}>
            {hasImage ? (
                <>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={section.content.url} alt="Project asset" className="w-full object-contain rounded-lg" />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity rounded-lg z-10">
                        <label className="cursor-pointer bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg backdrop-blur text-sm font-medium transition-colors">
                            {isUploading ? 'Uploading...' : 'Change Image'}
                            <input type="file" accept="image/*" className="hidden" onChange={handleUpload} disabled={isUploading} />
                        </label>
                    </div>
                </>
            ) : (
                <div className="flex flex-col items-center text-center p-6">
                    {isUploading ? (
                        <div className="flex flex-col items-center gap-2">
                            <Sparkles className="h-5 w-5 animate-pulse text-zinc-400" />
                            <span className="text-sm text-zinc-500 font-medium animate-pulse">Uploading...</span>
                        </div>
                    ) : (
                        <>
                            <span className="text-sm text-zinc-500 font-medium mb-3">Figma Image Placeholder</span>
                            <label className="cursor-pointer bg-white dark:bg-zinc-800 shadow-sm border border-zinc-200 dark:border-white/10 hover:bg-zinc-50 dark:hover:bg-zinc-700 px-4 py-2 rounded-lg text-sm font-medium text-zinc-900 dark:text-white transition-colors">
                                Upload Image
                                <input type="file" accept="image/*" className="hidden" onChange={handleUpload} />
                            </label>
                            {error && <span className="text-xs text-red-500 mt-2 max-w-xs">{error}</span>}
                        </>
                    )}
                </div>
            )}
        </div>
    )
}
function EditableTestimonial({ content, onChange }: { content: any, onChange: (val: any) => void }) {
    const [isEditing, setIsEditing] = useState(!content.quote)
    const quote = content.quote || "This redesign completely changed how our users interact with the platform..."
    const author = content.author || "Jane Doe"
    const role = content.role || "Product Manager"

    if (isEditing) {
        return (
            <div className="flex flex-col gap-3 p-4 border border-zinc-200 dark:border-white/10 rounded-xl bg-zinc-50/50 dark:bg-white/5">
                <textarea 
                    value={quote} 
                    onChange={(e) => onChange({ ...content, quote: e.target.value })} 
                    placeholder="Quote" 
                    className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 rounded-lg p-2 text-sm text-zinc-900 dark:text-white"
                />
                <div className="flex gap-2">
                    <input 
                        value={author} 
                        onChange={(e) => onChange({ ...content, author: e.target.value })} 
                        placeholder="Author" 
                        className="flex-1 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 rounded-lg p-2 text-sm text-zinc-900 dark:text-white"
                    />
                    <input 
                        value={role} 
                        onChange={(e) => onChange({ ...content, role: e.target.value })} 
                        placeholder="Role" 
                        className="flex-1 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 rounded-lg p-2 text-sm text-zinc-900 dark:text-white"
                    />
                </div>
                <button onClick={() => setIsEditing(false)} className="self-end rounded-lg bg-zinc-200 dark:bg-zinc-700 px-3 py-1.5 text-xs font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-300 dark:hover:bg-zinc-600 transition">Done</button>
            </div>
        )
    }

    return (
        <div onClick={() => setIsEditing(true)} className="group cursor-pointer p-8 border border-zinc-200 dark:border-white/10 rounded-xl bg-zinc-50 dark:bg-black/50 relative overflow-hidden transition-colors hover:border-zinc-300 dark:hover:border-white/20">
            <div className="absolute top-0 right-0 p-8 text-8xl text-black/5 dark:text-white/5 leading-none font-serif opacity-50">&quot;</div>
            <p className="text-zinc-700 dark:text-zinc-300 italic mb-4 relative z-10">&quot;{quote}&quot;</p>
            <div className="flex items-center gap-3 relative z-10">
                <div className="h-10 w-10 rounded-full bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center font-bold text-zinc-400">{author.charAt(0)}</div>
                <div><p className="text-sm text-zinc-900 dark:text-white font-medium">{author}</p><p className="text-xs text-zinc-500">{role}</p></div>
            </div>
            <div className="absolute inset-0 bg-black/5 dark:bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center z-20 pointer-events-none">
                <span className="bg-white dark:bg-zinc-800 px-3 py-1.5 rounded-lg text-xs font-medium shadow-sm border border-zinc-200 dark:border-white/10">Click to edit</span>
            </div>
        </div>
    )
}

function EditableBarChart({ content, onChange }: { content: any, onChange: (val: any) => void }) {
    const [isEditing, setIsEditing] = useState(!content.data)
    const title = content.title || "Impact Metrics"
    const data = content.data || [
        { label: "Before", value: 40, color: "bg-zinc-300 dark:bg-zinc-700" },
        { label: "After", value: 85, color: "bg-brand-500" }
    ]

    const maxValue = Math.max(...data.map((d: any) => d.value), 100)

    if (isEditing) {
        return (
            <div className="flex flex-col gap-4 p-4 border border-zinc-200 dark:border-white/10 rounded-xl bg-zinc-50/50 dark:bg-white/5">
                <div>
                    <label className="text-xs font-medium text-zinc-500 mb-1 block">Chart Title</label>
                    <input 
                        value={title} 
                        onChange={(e) => onChange({ ...content, title: e.target.value })} 
                        className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 rounded-lg p-2 text-sm text-zinc-900 dark:text-white"
                    />
                </div>
                <div className="space-y-3">
                    <label className="text-xs font-medium text-zinc-500 block">Data Points</label>
                    {data.map((item: any, idx: number) => (
                        <div key={idx} className="flex gap-2">
                            <input 
                                value={item.label}
                                onChange={(e) => {
                                    const newData = [...data]
                                    newData[idx].label = e.target.value
                                    onChange({ ...content, data: newData })
                                }}
                                placeholder="Label"
                                className="flex-1 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 rounded-lg p-2 text-sm text-zinc-900 dark:text-white"
                            />
                            <input 
                                type="number"
                                value={item.value}
                                onChange={(e) => {
                                    const newData = [...data]
                                    newData[idx].value = Number(e.target.value)
                                    onChange({ ...content, data: newData })
                                }}
                                placeholder="Value"
                                className="w-24 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 rounded-lg p-2 text-sm text-zinc-900 dark:text-white"
                            />
                            <select 
                                value={item.color}
                                onChange={(e) => {
                                    const newData = [...data]
                                    newData[idx].color = e.target.value
                                    onChange({ ...content, data: newData })
                                }}
                                className="w-32 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 rounded-lg p-2 text-sm text-zinc-900 dark:text-white"
                            >
                                <option value="bg-zinc-300 dark:bg-zinc-700">Gray</option>
                                <option value="bg-brand-500">Brand Blue</option>
                                <option value="bg-emerald-500">Success Green</option>
                                <option value="bg-purple-500">Purple</option>
                            </select>
                            <button 
                                onClick={() => {
                                    const newData = data.filter((_: any, i: number) => i !== idx)
                                    onChange({ ...content, data: newData })
                                }}
                                className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition"
                            >
                                ✕
                            </button>
                        </div>
                    ))}
                    <button 
                        onClick={() => onChange({ ...content, data: [...data, { label: "New", value: 50, color: "bg-brand-500" }] })}
                        className="text-xs font-medium text-brand-500 hover:text-brand-600 transition flex self-start"
                    >
                        + Add Data Point
                    </button>
                </div>
                <button onClick={() => setIsEditing(false)} className="self-end rounded-lg bg-zinc-200 dark:bg-zinc-700 px-3 py-1.5 text-xs font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-300 dark:hover:bg-zinc-600 transition">Done</button>
            </div>
        )
    }

    return (
        <div onClick={() => setIsEditing(true)} className="group cursor-pointer p-6 border border-zinc-200 dark:border-white/10 rounded-xl bg-zinc-50 dark:bg-black/50 relative transition-colors hover:border-zinc-300 dark:hover:border-white/20">
            <h4 className="text-sm font-medium text-zinc-900 dark:text-white mb-6 text-center">{title}</h4>
            <div className="flex items-end justify-center gap-4 h-48 w-full max-w-md mx-auto">
                {data.map((item: any, idx: number) => (
                    <div key={idx} className="flex flex-col items-center gap-2 flex-1 group/bar">
                        <div className="relative w-full flex justify-center h-full items-end">
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
            <div className="absolute inset-0 bg-black/5 dark:bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center z-20 pointer-events-none rounded-xl">
                <span className="bg-white dark:bg-zinc-800 px-3 py-1.5 rounded-lg text-xs font-medium shadow-sm border border-zinc-200 dark:border-white/10">Click to edit</span>
            </div>
        </div>
    )
}

function EditableProgressRing({ content, onChange }: { content: any, onChange: (val: any) => void }) {
    const [isEditing, setIsEditing] = useState(!content.percentage)
    const percentage = content.percentage || 75
    const label = content.label || "Performance Increase"
    const color = content.color || "text-emerald-500"

    if (isEditing) {
        return (
            <div className="flex flex-col gap-4 p-4 border border-zinc-200 dark:border-white/10 rounded-xl bg-zinc-50/50 dark:bg-white/5">
                <div className="flex gap-4">
                    <div className="flex-1">
                        <label className="text-xs font-medium text-zinc-500 mb-1 block">Percentage</label>
                        <input 
                            type="number"
                            value={percentage} 
                            onChange={(e) => onChange({ ...content, percentage: Number(e.target.value) })} 
                            className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 rounded-lg p-2 text-sm text-zinc-900 dark:text-white"
                        />
                    </div>
                    <div className="flex-1">
                        <label className="text-xs font-medium text-zinc-500 mb-1 block">Color</label>
                        <select 
                            value={color}
                            onChange={(e) => onChange({ ...content, color: e.target.value })}
                            className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 rounded-lg p-2 text-sm text-zinc-900 dark:text-white"
                        >
                            <option value="text-brand-500">Brand Blue</option>
                            <option value="text-emerald-500">Success Green</option>
                            <option value="text-purple-500">Purple</option>
                            <option value="text-zinc-900 dark:text-white">Neutral</option>
                        </select>
                    </div>
                </div>
                <div>
                    <label className="text-xs font-medium text-zinc-500 mb-1 block">Label</label>
                    <input 
                        value={label} 
                        onChange={(e) => onChange({ ...content, label: e.target.value })} 
                        className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 rounded-lg p-2 text-sm text-zinc-900 dark:text-white"
                    />
                </div>
                <button onClick={() => setIsEditing(false)} className="self-end rounded-lg bg-zinc-200 dark:bg-zinc-700 px-3 py-1.5 text-xs font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-300 dark:hover:bg-zinc-600 transition">Done</button>
            </div>
        )
    }

    const radius = 60;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    return (
        <div onClick={() => setIsEditing(true)} className="group cursor-pointer p-8 border border-zinc-200 dark:border-white/10 rounded-xl bg-zinc-50 dark:bg-black/50 relative transition-colors hover:border-zinc-300 dark:hover:border-white/20 flex flex-col items-center justify-center">
            <div className="relative w-40 h-40 flex items-center justify-center">
                {/* Background Ring */}
                <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 140 140">
                    <circle 
                        cx="70" cy="70" r={radius} 
                        className="stroke-zinc-200 dark:stroke-zinc-800"
                        strokeWidth="12" fill="none"
                    />
                    {/* Foreground Ring */}
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
            
            <div className="absolute inset-0 bg-black/5 dark:bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center z-20 pointer-events-none rounded-xl">
                <span className="bg-white dark:bg-zinc-800 px-3 py-1.5 rounded-lg text-xs font-medium shadow-sm border border-zinc-200 dark:border-white/10">Click to edit</span>
            </div>
        </div>
    )
}

export default function BuilderPage({ params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = use(params)
    const projectId = resolvedParams.id

    const isDemo = projectId.includes('demo') || projectId.includes('mock')
    const [step, setStep] = useState<WizardStep>(isDemo ? 'done' : 'goal')
    const [goal, setGoal] = useState('')
    const [constraints, setConstraints] = useState('')
    const [outcome, setOutcome] = useState('')
    const [generatedText, setGeneratedText] = useState('')

    // DND State
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [sections, setSections] = useState<any[]>(isDemo ? [
        {
            id: `ai_text_demo1`,
            type: 'ai_text',
            content: { text: "## The Challenge\n\nThe primary goal was to redesign the core experience to reduce drop-off rates. However, we were faced with several significant limitations." }
        },
        {
            id: `figma_image_demo1`,
            type: 'figma_image',
            content: { url: '/placeholder:image' }
        }
    ] : [])
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

    const updateSection = (idToUpdate: string, newContent: any) => {
        setSections(sections.map(s => s.id === idToUpdate ? { ...s, content: newContent } : s))
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
                                                <EditableMarkdown
                                                    initialValue={section.content.text || ''}
                                                    onChange={(newText) => updateSection(section.id, { ...section.content, text: newText })}
                                                />
                                            )}
                                            {section.type === 'figma_image' && (
                                                <FigmaImageBlock section={section} projectId={projectId} updateSection={updateSection} />
                                            )}
                                            {section.type === 'barchart' && (
                                                <EditableBarChart 
                                                    content={section.content || {}} 
                                                    onChange={(newContent) => updateSection(section.id, newContent)} 
                                                />
                                            )}
                                            {section.type === 'ring' && (
                                                <EditableProgressRing 
                                                    content={section.content || {}} 
                                                    onChange={(newContent) => updateSection(section.id, newContent)} 
                                                />
                                            )}
                                            {section.type === 'testimonial' && (
                                                <EditableTestimonial 
                                                    content={section.content || {}} 
                                                    onChange={(newContent) => updateSection(section.id, newContent)} 
                                                />
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
