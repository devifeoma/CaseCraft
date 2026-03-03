export function ProgressRingCard({ title, percentage, description }: { title: string, percentage: number, description: string }) {
    const radius = 40;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    return (
        <div className="flex items-center gap-6 rounded-2xl border border-white/5 bg-white/5 p-6 backdrop-blur-md">
            <div className="relative flex h-24 w-24 items-center justify-center">
                <svg className="h-full w-full -rotate-90 transform" viewBox="0 0 100 100">
                    {/* Background circle */}
                    <circle
                        className="text-white/10 stroke-current"
                        strokeWidth="8"
                        cx="50"
                        cy="50"
                        r={radius}
                        fill="transparent"
                    />
                    {/* Progress circle */}
                    <circle
                        className="text-purple-500 stroke-current transition-all duration-1000 ease-in-out"
                        strokeWidth="8"
                        strokeLinecap="round"
                        cx="50"
                        cy="50"
                        r={radius}
                        fill="transparent"
                        strokeDasharray={circumference}
                        strokeDashoffset={strokeDashoffset}
                    />
                </svg>
                <span className="absolute text-xl font-semibold text-white">{percentage}%</span>
            </div>
            <div className="flex flex-col">
                <h3 className="text-lg font-medium text-white">{title}</h3>
                <p className="mt-1 text-sm text-zinc-400 leading-relaxed">{description}</p>
            </div>
        </div>
    )
}
