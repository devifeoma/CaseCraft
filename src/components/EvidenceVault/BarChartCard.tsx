export function BarChartCard({ title, value, label }: { title: string, value: number, label: string }) {
    // A simple pure CSS bar chart simulation
    return (
        <div className="rounded-2xl border border-white/5 bg-white/5 p-6 backdrop-blur-md">
            <h3 className="mb-4 text-sm font-medium text-zinc-400">{title}</h3>
            <div className="flex select-none items-end gap-2 h-32 w-full mt-4">
                {/* Mock Data bars */}
                <div className="w-full bg-white/10 rounded-t-sm h-[30%] transition-all hover:bg-white/20"></div>
                <div className="w-full bg-white/10 rounded-t-sm h-[50%] transition-all hover:bg-white/20"></div>
                <div className="w-full bg-white/10 rounded-t-sm h-[40%] transition-all hover:bg-white/20"></div>
                <div className="w-full bg-white/10 rounded-t-sm h-[70%] transition-all hover:bg-white/20"></div>
                <div className="w-full bg-purple-500 rounded-t-sm transition-all hover:bg-purple-400" style={{ height: `${value}%` }}></div>
            </div>
            <div className="mt-4 flex items-center justify-between border-t border-white/10 pt-4">
                <span className="text-3xl font-semibold tracking-tight text-white">+{value}%</span>
                <span className="text-sm font-medium text-purple-400">{label}</span>
            </div>
        </div >
    )
}
