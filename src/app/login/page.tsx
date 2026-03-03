import Link from 'next/link'
import { Sparkles } from 'lucide-react'
import { LoginForm } from './login-form'

export default async function LoginPage({
    searchParams,
}: {
    searchParams: Promise<{ error?: string }>
}) {
    const resolvedSearchParams = await searchParams
    return (
        <div className="flex h-screen w-full flex-col items-center justify-center bg-black px-4 text-zinc-100 selection:bg-purple-500/30">
            <div className="mb-8 flex items-center gap-2">
                <Link href="/" className="flex items-center gap-2 transition-opacity hover:opacity-80">
                    <div className="h-6 w-6 rounded-md bg-gradient-to-br from-purple-500 to-indigo-600" />
                    <span className="font-semibold tracking-tight text-white">CaseCraft</span>
                </Link>
            </div>

            <LoginForm error={resolvedSearchParams?.error} />
        </div>
    )
}
