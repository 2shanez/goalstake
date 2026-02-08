'use client'

import { useState, useEffect } from 'react'

interface DuolingoProfile {
  username: string
  streak: number
  totalXp: number
  courses: Array<{ title: string; xp: number }>
}

interface DuolingoConnectProps {
  onConnect: (username: string, streak: number) => void
  onDisconnect: () => void
  connectedUsername?: string
}

export function DuolingoConnect({ onConnect, onDisconnect, connectedUsername }: DuolingoConnectProps) {
  const [username, setUsername] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [profile, setProfile] = useState<DuolingoProfile | null>(null)

  // Load saved username on mount
  useEffect(() => {
    const saved = localStorage.getItem('vaada_duolingo_username')
    if (saved) {
      setUsername(saved)
      fetchProfile(saved)
    }
  }, [])

  const fetchProfile = async (user: string) => {
    setLoading(true)
    setError('')
    
    try {
      const res = await fetch(`/api/duolingo/profile?username=${encodeURIComponent(user)}`)
      const data = await res.json()
      
      if (!res.ok) {
        setError(data.error || 'User not found')
        setProfile(null)
        return
      }
      
      setProfile(data)
      localStorage.setItem('vaada_duolingo_username', user)
      onConnect(user, data.streak)
    } catch {
      setError('Failed to connect')
      setProfile(null)
    } finally {
      setLoading(false)
    }
  }

  const handleConnect = () => {
    if (!username.trim()) {
      setError('Enter your Duolingo username')
      return
    }
    fetchProfile(username.trim())
  }

  const handleDisconnect = () => {
    localStorage.removeItem('vaada_duolingo_username')
    setProfile(null)
    setUsername('')
    onDisconnect()
  }

  if (profile) {
    return (
      <div className="p-3 rounded-xl bg-[#58CC02]/10 border border-[#58CC02]/30">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#58CC02] flex items-center justify-center">
              <span className="text-xl">🦉</span>
            </div>
            <div>
              <p className="font-bold text-sm">{profile.username}</p>
              <p className="text-xs text-[var(--text-secondary)]">
                🔥 {profile.streak} day streak • {profile.totalXp.toLocaleString()} XP
              </p>
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
      <div className="flex items-center gap-2 mb-2">
        <span className="text-xl">🦉</span>
        <span className="text-sm font-medium">Connect Duolingo</span>
      </div>
      
      <div className="flex gap-2">
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Your Duolingo username"
          className="flex-1 px-3 py-2 text-sm rounded-lg border border-[var(--border)] bg-[var(--background)]
            focus:outline-none focus:border-[#58CC02] focus:ring-1 focus:ring-[#58CC02]/50"
          onKeyDown={(e) => e.key === 'Enter' && handleConnect()}
        />
        <button
          onClick={handleConnect}
          disabled={loading}
          className="px-4 py-2 text-sm font-bold rounded-lg bg-[#58CC02] text-white
            hover:bg-[#4CAF00] disabled:opacity-50 transition-colors"
        >
          {loading ? '...' : 'Connect'}
        </button>
      </div>
      
      {error && (
        <p className="text-xs text-red-500 mt-2">{error}</p>
      )}
      
      <p className="text-[10px] text-[var(--text-secondary)] mt-2">
        Find your username at duolingo.com/profile
      </p>
    </div>
  )
}

// Hook to check if Duolingo is connected
export function useDuolingoConnection() {
  const [username, setUsername] = useState<string | null>(null)
  const [streak, setStreak] = useState<number>(0)

  useEffect(() => {
    const saved = localStorage.getItem('vaada_duolingo_username')
    if (saved) {
      setUsername(saved)
      // Fetch current streak
      fetch(`/api/duolingo/profile?username=${encodeURIComponent(saved)}`)
        .then(res => res.json())
        .then(data => {
          if (data.streak !== undefined) {
            setStreak(data.streak)
          }
        })
        .catch(() => {})
    }
  }, [])

  return { username, streak, isConnected: !!username }
}
