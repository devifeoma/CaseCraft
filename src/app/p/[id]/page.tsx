import { BarChartCard } from '@/components/EvidenceVault/BarChartCard'
import { ProgressRingCard } from '@/components/EvidenceVault/ProgressRingCard'
import { TestimonialCard } from '@/components/EvidenceVault/TestimonialCard'

export default async function PublicProjectPage({
    params,
}: {
    params: Promise<{ id: string }>
}) {
    const resolvedParams = await params

    // Simulated case study data
    return (
        <div className="min-h-screen bg-background text-foreground selection:bg-purple-500/30">
            <main className="mx-auto max-w-3xl px-6 py-24 sm:py-32">
                <div className="mb-16">
                    <h1 className="mb-4 text-4xl font-semibold tracking-tight text-zinc-900 dark:text-white sm:text-5xl">Redesigning Checkout</h1>
                    <p className="text-xl text-zinc-600 dark:text-zinc-400">A UX Case Study by CaseCraft User</p>
                </div>

                {/* Narrative Block */}
                <section className="prose dark:prose-invert prose-p:leading-relaxed prose-headings:font-semibold max-w-none text-zinc-700 dark:text-zinc-300">
                    <h2>The Challenge</h2>
                    <p>
                        The primary goal was to modernize the legacy checkout system to reduce cart abandonment.
                        However, we were faced with several significant limitations, chiefly an outdated internal payment API that we couldn't replace.
                    </p>
                    <p>
                        This meant the standard approaches wouldn't work. We had to rethink the core interaction paradigm to ensure a seamless experience that balanced both usability and technical guardrails.
                    </p>

                    <div className="my-12">
                        <TestimonialCard
                            quote="This new flow is incredible. It feels twice as fast, even though the backend hasn't changed."
                            author="Alex Rivers"
                            role="Beta Tester"
                        />
                    </div>

                    <h2>Our Approach</h2>
                    <p>
                        To tackle this, we initiated a comprehensive review of the user journey. By focusing on the critical path, we designed a streamlined flow that abstracted the underlying complexity away from the user. We relied heavily on progressive disclosure and contextual cues.
                    </p>

                    <div className="my-12 flex h-64 w-full items-center justify-center rounded-2xl bg-black/5 dark:bg-white/5 border border-zinc-200 dark:border-white/10">
                        <span className="text-sm font-medium text-zinc-600 dark:text-zinc-400">Figma Image: Final UI Flow</span>
                    </div>

                    <h2>The Outcome</h2>
                    <p>
                        Ultimately, the project was a resounding success. Conversion increased by 14% and support tickets dropped by half. This validated our hypothesis that a constraint-driven design approach often yields the most innovative, user-centric solutions.
                    </p>
                </section>

                {/* Evidence Vault Data */}
                <div className="mt-16 grid gap-6 sm:grid-cols-2">
                    <BarChartCard title="Conversion Rate Lift" value={14} label="Increase" />
                    <ProgressRingCard title="Task Success Rate" percentage={92} description="Users completed checkout in under 2 minutes." />
                </div>

                {/* Footer / Watermark */}
                <footer className="mt-32 flex items-center justify-between border-t border-zinc-200 dark:border-white/10 pt-8 text-sm text-zinc-500 dark:text-zinc-400">
                    <span>© 2026 Author Name</span>
                    <a href="/" className="flex items-center gap-2 hover:text-zinc-900 dark:hover:text-white transition-colors">
                        <div className="h-4 w-4 rounded-sm bg-purple-500"></div>
                        Powered by CaseCraft
                    </a>
                </footer>
            </main>
        </div>
    )
}
