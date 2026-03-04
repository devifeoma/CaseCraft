'use client'

import { useState, useRef } from 'react'
import { User, MapPin, Briefcase, Camera, Loader2, Save } from 'lucide-react'
import { updateProfile } from './actions'
import Image from 'next/image'

type ProfileData = {
    first_name: string | null;
    last_name: string | null;
    location: string | null;
    job_title: string | null;
    avatar_url: string | null;
}

export function ProfileForm({ initialData }: { initialData: ProfileData | null }) {
    const [isPending, setIsPending] = useState(false)
    const [previewUrl, setPreviewUrl] = useState<string | null>(initialData?.avatar_url || null)
    const [successMessage, setSuccessMessage] = useState('')
    const fileInputRef = useRef<HTMLInputElement>(null)

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            setPreviewUrl(URL.createObjectURL(file))
        }
    }

    const handleSubmit = async (formData: FormData) => {
        setIsPending(true)
        setSuccessMessage('')
        try {
            await updateProfile(formData)
            setSuccessMessage('Profile updated successfully.')
        } catch (error) {
            console.error(error)
            alert('Failed to update profile. Ensure your database is synced with the latest schema fields.')
        } finally {
            setIsPending(false)
        }
    }

    return (
        <form action={handleSubmit} className="flex flex-col gap-6">
            <input type="hidden" name="currentAvatarUrl" value={initialData?.avatar_url || ''} />

            {/* Avatar Upload */}
            <div className="flex items-center gap-6">
                <div className="relative h-20 w-20 overflow-hidden rounded-full border-2 border-zinc-200 bg-zinc-100 dark:border-white/10 dark:bg-black/50">
                    {previewUrl ? (
                        <Image src={previewUrl} alt="Avatar" fill className="object-cover" unoptimized />
                    ) : (
                        <div className="flex h-full w-full items-center justify-center text-zinc-400">
                            <User className="h-8 w-8" />
                        </div>
                    )}
                </div>
                <div>
                    <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="flex items-center gap-2 rounded-lg border border-zinc-200 bg-white px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50 dark:border-white/10 dark:bg-zinc-900/50 dark:text-zinc-300 dark:hover:bg-white/5 transition-colors"
                    >
                        <Camera className="h-4 w-4" /> Change Picture
                    </button>
                    <input
                        ref={fileInputRef}
                        type="file"
                        name="avatar"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                    />
                    <p className="mt-2 text-xs text-zinc-500">JPG, GIF or PNG. 1MB max.</p>
                </div>
            </div>

            {/* Name Fields */}
            <div className="grid gap-4 sm:grid-cols-2">
                <div>
                    <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">First Name</label>
                    <input
                        type="text"
                        name="firstName"
                        defaultValue={initialData?.first_name || ''}
                        className="w-full rounded-xl border border-zinc-200 dark:border-white/10 bg-zinc-50 dark:bg-black/50 px-4 py-2.5 text-sm text-zinc-900 dark:text-white outline-none focus:border-blue-500/50 transition-all placeholder:text-zinc-400"
                        placeholder="e.g. Jane"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">Last Name</label>
                    <input
                        type="text"
                        name="lastName"
                        defaultValue={initialData?.last_name || ''}
                        className="w-full rounded-xl border border-zinc-200 dark:border-white/10 bg-zinc-50 dark:bg-black/50 px-4 py-2.5 text-sm text-zinc-900 dark:text-white outline-none focus:border-blue-500/50 transition-all placeholder:text-zinc-400"
                        placeholder="e.g. Doe"
                    />
                </div>
            </div>

            {/* Details Fields */}
            <div className="grid gap-4 sm:grid-cols-2">
                <div>
                    <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5 flex items-center gap-1.5"><MapPin className="h-4 w-4 text-zinc-400" /> Location</label>
                    <input
                        type="text"
                        name="location"
                        defaultValue={initialData?.location || ''}
                        className="w-full rounded-xl border border-zinc-200 dark:border-white/10 bg-zinc-50 dark:bg-black/50 px-4 py-2.5 text-sm text-zinc-900 dark:text-white outline-none focus:border-blue-500/50 transition-all placeholder:text-zinc-400"
                        placeholder="e.g. San Francisco, CA"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5 flex items-center gap-1.5"><Briefcase className="h-4 w-4 text-zinc-400" /> Job Title</label>
                    <input
                        type="text"
                        name="jobTitle"
                        defaultValue={initialData?.job_title || ''}
                        className="w-full rounded-xl border border-zinc-200 dark:border-white/10 bg-zinc-50 dark:bg-black/50 px-4 py-2.5 text-sm text-zinc-900 dark:text-white outline-none focus:border-blue-500/50 transition-all placeholder:text-zinc-400"
                        placeholder="e.g. Product Designer"
                    />
                </div>
            </div>

            <div className="mt-2 flex items-center gap-4">
                <button
                    type="submit"
                    disabled={isPending}
                    className="flex items-center gap-2 rounded-xl bg-zinc-900 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200 disabled:opacity-50"
                >
                    {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                    Save Changes
                </button>
                {successMessage && <span className="text-sm text-emerald-600 dark:text-emerald-400 font-medium animate-fade-in">{successMessage}</span>}
            </div>
        </form>
    )
}
