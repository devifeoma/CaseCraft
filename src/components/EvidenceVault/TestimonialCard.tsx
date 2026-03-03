import { Quote } from 'lucide-react'

export function TestimonialCard({ quote, author, role }: { quote: string, author: string, role: string }) {
    return (
        <div className="relative rounded-2xl border border-white/5 bg-gradient-to-br from-white/5 to-white/[0.02] p-8 backdrop-blur-md">
            <div className="absolute top-6 left-6 text-purple-500/20">
                <Quote size={48} className="rotate-180" />
            </div>
            <div className="relative z-10 flex flex-col h-full justify-between">
                <p className="text-lg leading-relaxed tracking-tight text-white mb-8 select-none">
                    &quot;{quote}&quot;
                </p>
                <div className="flex items-center gap-3">
                    <div className="h-10 w-10 shrink-0 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 border-2 border-[#111]" />
                    <div className="flex flex-col">
                        <span className="text-sm font-semibold tracking-tight text-white">{author}</span>
                        <span className="text-xs font-medium text-zinc-500">{role}</span>
                    </div>
                </div>
            </div>
        </div>
    )
}
