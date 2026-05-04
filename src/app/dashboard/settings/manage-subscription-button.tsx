'use client'

import { Sparkles, Loader2, CreditCard } from 'lucide-react'
import { useState } from 'react'

export function ManageSubscriptionButton({ isPro }: { isPro: boolean }) {
    const [isLoading, setIsLoading] = useState(false)

    const handleAction = async () => {
        setIsLoading(true)
        try {
            if (isPro) {
                // Manage existing subscription in Customer Portal
                const res = await fetch('/api/stripe/portal', { method: 'POST' })
                const data = await res.json()
                if (data.url) {
                    window.location.href = data.url
                } else {
                    alert(data.error || 'Failed to open portal.')
                }
            } else {
                // Not pro, trigger checkout
                const res = await fetch('/api/stripe/checkout', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ interval: 'month' }) // Default to month if upgrading from here
                })
                const data = await res.json()
                if (data.url) {
                    window.location.href = data.url
                } else {
                    alert(data.error || 'Failed to start checkout.')
                }
            }
        } catch (err) {
            console.error(err)
            alert('Something went wrong.')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <button 
            onClick={handleAction}
            disabled={isLoading}
            className="whitespace-nowrap inline-flex items-center justify-center gap-2 rounded-xl bg-purple-600 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-purple-500 shadow-lg shadow-purple-500/20 w-full sm:w-auto disabled:opacity-50"
        >
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : (isPro ? <CreditCard className="h-4 w-4" /> : <Sparkles className="h-4 w-4" />)}
            {isLoading ? 'Processing...' : (isPro ? 'Manage Billing' : 'Upgrade to Pro')}
        </button>
    )
}
