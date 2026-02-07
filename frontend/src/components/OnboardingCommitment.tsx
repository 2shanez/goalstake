'use client'

import { useState, useEffect } from 'react'
import { usePrivy } from '@privy-io/react-auth'

interface OnboardingCommitmentProps {
  onComplete: () => void
}

export function OnboardingCommitment({ onComplete }: OnboardingCommitmentProps) {
  const { user } = usePrivy()
  const [commitment, setCommitment] = useState('')
  const [step, setStep] = useState<'intro' | 'write' | 'confirm'>('intro')

  const handleSubmit = () => {
    if (!commitment.trim()) return
    
    // Store commitment with 48-hour deadline
    const deadline = Date.now() + (48 * 60 * 60 * 1000) // 48 hours from now
    localStorage.setItem('vaada_onboarding', JSON.stringify({
      commitment: commitment.trim(),
      deadline,
      userId: user?.id,
      createdAt: Date.now(),
    }))
    
    onComplete()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-[var(--background)] border border-[var(--border)] rounded-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-gradient-to-br from-[#2EE59D]/10 to-transparent p-6 border-b border-[var(--border)]">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-full bg-[#2EE59D]/20 flex items-center justify-center">
              <span className="text-xl">🤝</span>
            </div>
            <h2 className="text-xl font-bold">Make Your First Promise</h2>
          </div>
          <p className="text-sm text-[var(--text-secondary)]">
            The best way to start is to commit to starting.
          </p>
        </div>

        {/* Content */}
        <div className="p-6">
          {step === 'intro' && (
            <div className="space-y-4">
              <div className="bg-[var(--surface)] rounded-xl p-4 border border-[var(--border)]">
                <p className="text-sm leading-relaxed">
                  You have <span className="font-bold text-[#2EE59D]">48 hours</span> to join your first promise.
                </p>
                <p className="text-sm text-[var(--text-secondary)] mt-2">
                  This isn't a payment — it's a commitment to yourself. If you don't join a promise in time, you'll need to start over.
                </p>
              </div>
              
              <button
                onClick={() => setStep('write')}
                className="w-full py-3 bg-[#2EE59D] text-white font-semibold rounded-xl hover:bg-[#26c987] transition-colors"
              >
                I'm Ready to Commit
              </button>
            </div>
          )}

          {step === 'write' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  What promise will you make?
                </label>
                <textarea
                  value={commitment}
                  onChange={(e) => setCommitment(e.target.value)}
                  placeholder="I'm going to stake on running 1 mile daily because I want to build a consistent habit..."
                  className="w-full h-32 px-4 py-3 bg-[var(--surface)] border border-[var(--border)] rounded-xl text-sm resize-none focus:outline-none focus:border-[#2EE59D] transition-colors"
                />
              </div>
              
              <div className="flex items-center gap-2 text-xs text-[var(--text-secondary)]">
                <svg className="w-4 h-4 text-[#2EE59D]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>48-hour countdown starts when you submit</span>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setStep('intro')}
                  className="flex-1 py-3 bg-[var(--surface)] border border-[var(--border)] font-medium rounded-xl hover:bg-[var(--background)] transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={!commitment.trim()}
                  className="flex-1 py-3 bg-[#2EE59D] text-white font-semibold rounded-xl hover:bg-[#26c987] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Start My 48 Hours
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// Countdown banner component
export function OnboardingCountdownBanner() {
  const [onboarding, setOnboarding] = useState<{
    commitment: string
    deadline: number
    userId: string
  } | null>(null)
  const [timeLeft, setTimeLeft] = useState('')
  const [expired, setExpired] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem('vaada_onboarding')
    if (stored) {
      setOnboarding(JSON.parse(stored))
    }
  }, [])

  useEffect(() => {
    if (!onboarding) return

    const updateCountdown = () => {
      const now = Date.now()
      const diff = onboarding.deadline - now

      if (diff <= 0) {
        setExpired(true)
        setTimeLeft('Expired')
        return
      }

      const hours = Math.floor(diff / (1000 * 60 * 60))
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
      
      if (hours > 0) {
        setTimeLeft(`${hours}h ${minutes}m`)
      } else {
        setTimeLeft(`${minutes}m`)
      }
    }

    updateCountdown()
    const interval = setInterval(updateCountdown, 60000) // Update every minute

    return () => clearInterval(interval)
  }, [onboarding])

  if (!onboarding) return null

  const clearOnboarding = () => {
    localStorage.removeItem('vaada_onboarding')
    setOnboarding(null)
  }

  if (expired) {
    return (
      <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl">⏰</span>
            <div>
              <p className="font-medium text-red-500">Time's up!</p>
              <p className="text-sm text-[var(--text-secondary)]">Your 48-hour commitment window expired</p>
            </div>
          </div>
          <button
            onClick={clearOnboarding}
            className="px-4 py-2 bg-red-500 text-white text-sm font-medium rounded-lg hover:bg-red-600 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-[#2EE59D]/10 border border-[#2EE59D]/30 rounded-xl p-4 mb-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#2EE59D]/20 flex items-center justify-center">
            <span className="text-xl">⏳</span>
          </div>
          <div>
            <p className="font-medium">
              <span className="text-[#2EE59D]">{timeLeft}</span> to join your first promise
            </p>
            <p className="text-sm text-[var(--text-secondary)] truncate max-w-xs">
              "{onboarding.commitment.slice(0, 50)}{onboarding.commitment.length > 50 ? '...' : ''}"
            </p>
          </div>
        </div>
        <a 
          href="#promises"
          className="px-4 py-2 bg-[#2EE59D] text-white text-sm font-semibold rounded-lg hover:bg-[#26c987] transition-colors"
        >
          Browse Promises →
        </a>
      </div>
    </div>
  )
}

// Helper to clear onboarding when user joins a promise
export function clearOnboardingCommitment() {
  localStorage.removeItem('vaada_onboarding')
}

// Helper to check if user needs onboarding
export function needsOnboarding(): boolean {
  if (typeof window === 'undefined') return false
  
  const stored = localStorage.getItem('vaada_onboarding')
  const hasJoinedPromise = localStorage.getItem('vaada_has_joined')
  
  // If they've joined a promise before, no onboarding needed
  if (hasJoinedPromise) return false
  
  // If they have an active onboarding commitment, don't show modal again
  if (stored) return false
  
  return true
}

// Mark that user has joined a promise
export function markHasJoined() {
  localStorage.setItem('vaada_has_joined', 'true')
  localStorage.removeItem('vaada_onboarding')
}
