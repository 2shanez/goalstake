'use client'

import { useState } from 'react'
import { useAccount } from 'wagmi'

interface FaucetButtonProps {
  onSuccess?: () => void
  className?: string
}

export function FaucetButton({ onSuccess, className }: FaucetButtonProps) {
  const { address } = useAccount()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const requestFunds = async () => {
    if (!address) return
    
    setLoading(true)
    setError(null)
    
    try {
      const res = await fetch('/api/faucet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ wallet: address }),
      })
      
      const data = await res.json()
      
      if (!res.ok) {
        if (data.alreadyFunded) {
          setError('You already received testnet funds!')
        } else {
          setError(data.error || 'Failed to get funds')
        }
        return
      }
      
      setSuccess(true)
      onSuccess?.()
      
      // Reset after 3 seconds
      setTimeout(() => setSuccess(false), 3000)
      
    } catch (err) {
      setError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className={`flex items-center gap-2 px-4 py-3 bg-[#2EE59D]/10 border border-[#2EE59D]/30 rounded-xl ${className}`}>
        <span className="text-lg">✅</span>
        <div>
          <p className="text-sm font-medium text-[#2EE59D]">Funds received!</p>
          <p className="text-xs text-[var(--text-secondary)]">0.005 ETH + 10 USDC sent to your wallet</p>
        </div>
      </div>
    )
  }

  return (
    <div className={className}>
      <button
        onClick={requestFunds}
        disabled={loading || !address}
        className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-medium transition-all
          ${loading 
            ? 'bg-[var(--border)] text-[var(--text-secondary)] cursor-wait' 
            : 'bg-gradient-to-r from-[#2EE59D] to-[#26c987] text-white hover:shadow-lg hover:shadow-[#2EE59D]/20 active:scale-[0.98]'
          }`}
      >
        {loading ? (
          <>
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            <span>Sending funds...</span>
          </>
        ) : (
          <>
            <span>🚰</span>
            <span>Get Testnet Funds</span>
          </>
        )}
      </button>
      
      {error && (
        <p className="mt-2 text-xs text-red-500 text-center">{error}</p>
      )}
      
      <p className="mt-2 text-[10px] text-[var(--text-secondary)] text-center">
        Receive 0.005 ETH (for gas) + 10 USDC (for staking)
      </p>
    </div>
  )
}

// Hook to check if user needs funds
export function useFaucetStatus() {
  const { address } = useAccount()
  const [status, setStatus] = useState<{
    funded: boolean
    loading: boolean
  }>({ funded: false, loading: true })

  const checkStatus = async () => {
    if (!address) {
      setStatus({ funded: false, loading: false })
      return
    }

    try {
      const res = await fetch(`/api/faucet?wallet=${address}`)
      const data = await res.json()
      setStatus({ funded: data.funded, loading: false })
    } catch {
      setStatus({ funded: false, loading: false })
    }
  }

  return { ...status, checkStatus }
}
