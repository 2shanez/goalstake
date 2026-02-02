'use client'

import { useState, useEffect } from 'react'
import { useAccount, useWriteContract, useWaitForTransactionReceipt, useReadContract } from 'wagmi'
import { baseSepolia } from 'wagmi/chains'
import { CONTRACTS } from '@/lib/wagmi'

const STRAVA_CLIENT_ID = process.env.NEXT_PUBLIC_STRAVA_CLIENT_ID

// Automation contract ABI (just the functions we need)
const automationAbi = [
  {
    name: 'storeToken',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [{ name: 'token', type: 'string' }],
    outputs: [],
  },
  {
    name: 'hasToken',
    type: 'function',
    stateMutability: 'view',
    inputs: [{ name: 'user', type: 'address' }],
    outputs: [{ type: 'bool' }],
  },
] as const

export function StravaConnect() {
  const { address, isConnected } = useAccount()
  const [stravaConnected, setStravaConnected] = useState(false)
  const [athleteName, setAthleteName] = useState<string | null>(null)
  const [isStoring, setIsStoring] = useState(false)
  
  const { writeContract, data: hash, error: writeError } = useWriteContract()
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash })
  
  // Check if user already has token stored on-chain
  const { data: hasTokenOnChain, refetch: refetchHasToken } = useReadContract({
    address: CONTRACTS[baseSepolia.id].oracle,
    abi: automationAbi,
    functionName: 'hasToken',
    args: address ? [address] : undefined,
    query: { enabled: !!address },
  })

  // Check for Strava connection on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const stravaStatus = params.get('strava')
    const name = params.get('athlete_name')
    
    if (stravaStatus === 'success') {
      setStravaConnected(true)
      if (name) setAthleteName(decodeURIComponent(name))
      // Clean URL
      window.history.replaceState({}, '', '/')
    }
    
    // Also check cookie for athlete_id
    const athleteId = document.cookie
      .split('; ')
      .find(row => row.startsWith('strava_athlete_id='))
      ?.split('=')[1]
    
    if (athleteId) {
      setStravaConnected(true)
    }
  }, [])

  // Refetch on-chain status after successful store
  useEffect(() => {
    if (isSuccess) {
      refetchHasToken()
      setIsStoring(false)
    }
  }, [isSuccess, refetchHasToken])

  const handleConnectStrava = () => {
    const redirectUri = `${window.location.origin}/api/strava/callback`
    const scope = 'read,activity:read_all'
    const stravaAuthUrl = `https://www.strava.com/oauth/authorize?client_id=${STRAVA_CLIENT_ID}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=${scope}`
    window.location.href = stravaAuthUrl
  }

  const handleStoreToken = async () => {
    setIsStoring(true)
    try {
      // Fetch token from our API
      const res = await fetch('/api/strava/token')
      if (!res.ok) throw new Error('Failed to get token')
      const { token } = await res.json()
      
      // Store on-chain
      writeContract({
        address: CONTRACTS[baseSepolia.id].oracle,
        abi: automationAbi,
        functionName: 'storeToken',
        args: [token],
      })
    } catch (err) {
      console.error('Error storing token:', err)
      setIsStoring(false)
    }
  }

  if (!isConnected) return null

  // Already stored on-chain - fully verified
  if (hasTokenOnChain) {
    return (
      <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[#2EE59D]/10 border border-[#2EE59D]/20">
        <svg className="w-4 h-4 text-[#2EE59D]" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
        </svg>
        <span className="text-sm font-medium text-[#2EE59D]">Strava Verified</span>
      </div>
    )
  }

  // Connected to Strava but not stored on-chain yet
  if (stravaConnected) {
    return (
      <button
        onClick={handleStoreToken}
        disabled={isStoring || isConfirming}
        className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[#FC4C02]/10 border border-[#FC4C02]/30 text-sm font-medium hover:bg-[#FC4C02]/20 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        title="Sign a transaction to enable automatic Strava verification"
      >
        <svg className="w-4 h-4 text-[#FC4C02]" viewBox="0 0 24 24" fill="currentColor">
          <path d="M15.387 17.944l-2.089-4.116h-3.065L15.387 24l5.15-10.172h-3.066m-7.008-5.599l2.836 5.599h4.172L10.463 0l-7 13.828h4.169" />
        </svg>
        <span className="text-[#FC4C02]">
          {isConfirming ? 'Confirming...' : isStoring ? 'Signing...' : 'Verify Strava'}
        </span>
      </button>
    )
  }

  // Not connected to Strava yet
  return (
    <button
      onClick={handleConnectStrava}
      className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#FC4C02] text-white font-medium text-sm hover:bg-[#FC4C02]/90 transition-colors"
    >
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
        <path d="M15.387 17.944l-2.089-4.116h-3.065L15.387 24l5.15-10.172h-3.066m-7.008-5.599l2.836 5.599h4.172L10.463 0l-7 13.828h4.169" />
      </svg>
      Connect Strava
    </button>
  )
}
