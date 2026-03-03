import Link from 'next/link'
import { login, signup } from './actions'

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

            <div className="w-full max-w-sm rounded-[24px] border border-white/5 bg-white/5 p-8 shadow-2xl backdrop-blur-xl">
                <div className="mb-8 flex flex-col items-center text-center">
                    <h1 className="text-2xl font-semibold tracking-tight text-white">Welcome back</h1>
                    <p className="mt-2 text-sm text-zinc-400">Enter your details to sign in to your account</p>
                </div>

                <form className="flex w-full flex-col justify-center gap-4 text-white">
                    <div className="flex flex-col gap-1.5">
                        <label className="text-sm font-medium text-zinc-300" htmlFor="email">
                            Email
                        </label>
                        <input
                            className="rounded-xl border border-white/10 bg-black/50 px-4 py-2.5 text-sm outline-none transition-all placeholder:text-zinc-600 focus:border-purple-500/50 focus:bg-black"
                            name="email"
                            type="email"
                            placeholder="you@example.com"
                            required
                        />
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <label className="text-sm font-medium text-zinc-300" htmlFor="password">
                            Password
                        </label>
                        <input
                            className="rounded-xl border border-white/10 bg-black/50 px-4 py-2.5 text-sm outline-none transition-all placeholder:text-zinc-600 focus:border-purple-500/50 focus:bg-black"
                            type="password"
                            name="password"
                            placeholder="••••••••"
                            required
                        />
                    </div>

                    <div className="mt-4 flex flex-col gap-3">
                        <button
                            formAction={login}
                            className="flex w-full items-center justify-center rounded-xl bg-purple-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-purple-500"
                        >
                            Sign in
                        </button>
                        <button
                            formAction={signup}
                            className="flex w-full items-center justify-center rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-white/10"
                        >
                            Create an account
                        </button>
                    </div>

                    {resolvedSearchParams?.error && (
                        <p className="mt-4 rounded-xl border border-red-500/20 bg-red-500/10 p-3 text-center text-sm text-red-500">
                            {resolvedSearchParams.error}
                        </p>
                    )}
                </form>
            </div>
        </div>
    )
}
