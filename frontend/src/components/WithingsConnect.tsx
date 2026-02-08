'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'

interface WithingsProfile {
  connected: boolean
  latestWeight?: {
    weight: number
    weightLbs: number
    date: number
  }
}

interface WithingsConnectProps {
  onConnect: (accessToken: string, weight: number) => void
  onDisconnect: () => void
}

export function WithingsConnect({ onConnect, onDisconnect }: WithingsConnectProps) {
  const searchParams = useSearchParams()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [profile, setProfile] = useState<WithingsProfile | null>(null)

  // Check for OAuth callback
  useEffect(() => {
    const code = searchParams.get('withings_code')
    const error = searchParams.get('withings_error')
    
    if (error) {
      setError(`Connection failed: ${error}`)
      // Clear URL params
      window.history.replaceState({}, '', window.location.pathname)
      return
    }
    
    if (code) {
      handleCallback(code)
      // Clear URL params
      window.history.replaceState({}, '', window.location.pathname)
    }
  }, [searchParams])

  // Load saved connection on mount
  useEffect(() => {
    const saved = localStorage.getItem('vaada_withings_token')
    if (saved) {
      try {
        const { access_token, weight } = JSON.parse(saved)
        fetchWeight(access_token)
      } catch {
        localStorage.removeItem('vaada_withings_token')
      }
    }
  }, [])

  const handleCallback = async (code: string) => {
    setLoading(true)
    setError('')
    
    try {
      // Exchange code for token
      const res = await fetch('/api/withings/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, action: 'token' }),
      })
      
      const data = await res.json()
      
      if (!res.ok) {
        setError(data.error || 'Failed to connect')
        return
      }
      
      // Save token and fetch weight
      localStorage.setItem('vaada_withings_token', JSON.stringify({
        access_token: data.access_token,
        refresh_token: data.refresh_token,
      }))
      
      await fetchWeight(data.access_token)
    } catch {
      setError('Connection failed')
    } finally {
      setLoading(false)
    }
  }

  const fetchWeight = async (accessToken: string) => {
    try {
      const res = await fetch(`/api/withings/weight?access_token=${accessToken}`)
      const data = await res.json()
      
      if (!res.ok) {
        throw new Error(data.error)
      }
      
      if (data.latestWeight) {
        setProfile({
          connected: true,
          latestWeight: data.latestWeight,
        })
        onConnect(accessToken, data.latestWeight.weight)
      } else {
        setProfile({ connected: true })
        onConnect(accessToken, 0)
      }
    } catch {
      setError('Failed to fetch weight data')
    }
  }

  const handleConnect = async () => {
    setLoading(true)
    setError('')
    
    try {
      const res = await fetch('/api/withings/auth?action=authorize')
      const data = await res.json()
      
      if (data.authUrl) {
        // Redirect to Withings OAuth
        window.location.href = data.authUrl
      }
    } catch {
      setError('Failed to start connection')
      setLoading(false)
    }
  }

  const handleDisconnect = () => {
    localStorage.removeItem('vaada_withings_token')
    setProfile(null)
    onDisconnect()
  }

  if (profile?.connected) {
    return (
      <div className="p-3 rounded-xl bg-[#00B4D8]/10 border border-[#00B4D8]/30">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#00B4D8] flex items-center justify-center">
              <span className="text-xl">⚖️</span>
            </div>
            <div>
              <p className="font-bold text-sm">Withings Connected</p>
              {profile.latestWeight && (
                <p className="text-xs text-[var(--text-secondary)]">
                  Latest: {profile.latestWeight.weightLbs.toFixed(1)} lbs
                </p>
              )}
            </div>
          </div>
          <button
            onClick={handleDisconnect}
            className="text-xs text-[var(--text-secondary)] hover:text-red-500 transition-colors"
          >
            Disconnect
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="p-3 rounded-xl bg-[var(--surface)] border border-[var(--border)]">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xl">⚖️</span>
          <span className="text-sm font-medium">Connect Withings Scale</span>
        </div>
        <button
          onClick={handleConnect}
          disabled={loading}
          className="px-4 py-2 text-sm font-bold rounded-lg bg-[#00B4D8] text-white
            hover:bg-[#0096C7] disabled:opacity-50 transition-colors"
        >
          {loading ? '...' : 'Connect'}
        </button>
      </div>
      
      {error && (
        <p className="text-xs text-red-500 mt-2">{error}</p>
      )}
      
      <p className="text-[10px] text-[var(--text-secondary)] mt-2">
        Connect your Withings smart scale to track weight loss goals
      </p>
    </div>
  )
}

// Hook to check if Withings is connected
export function useWithingsConnection() {
  const [accessToken, setAccessToken] = useState<string | null>(null)
  const [weight, setWeight] = useState<number>(0)

  useEffect(() => {
    const saved = localStorage.getItem('vaada_withings_token')
    if (saved) {
      try {
        const data = JSON.parse(saved)
        setAccessToken(data.access_token)
      } catch {}
    }
  }, [])

  return { accessToken, weight, isConnected: !!accessToken }
}
