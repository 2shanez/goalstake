'use client'

import { usePrivy } from '@privy-io/react-auth'
import { useAccount, useDisconnect } from 'wagmi'

export function ConnectButton() {
  const { ready, authenticated, login, logout, user } = usePrivy()
  const { address, isConnected } = useAccount()
  const { disconnect } = useDisconnect()

  if (!ready) {
    return (
      <button 
        disabled
        className="px-4 py-2 rounded-xl bg-[var(--surface)] text-[var(--text-secondary)] border border-[var(--border)]"
      >
        Loading...
      </button>
    )
  }

  if (!authenticated) {
    return (
      <button
        onClick={login}
        className="px-4 py-2 rounded-xl bg-[#2EE59D] text-white font-semibold hover:bg-[#26c987] transition-colors"
      >
        Sign In
      </button>
    )
  }

  const displayAddress = address 
    ? `${address.slice(0, 6)}...${address.slice(-4)}`
    : user?.email?.address || 'Connected'

  return (
    <div className="flex items-center gap-2">
      <div className="px-4 py-2 rounded-xl bg-[var(--surface)] border border-[var(--border)] text-sm font-medium">
        {displayAddress}
      </div>
      <button
        onClick={() => {
          logout()
          disconnect()
        }}
        className="px-3 py-2 rounded-xl bg-[var(--surface)] border border-[var(--border)] text-[var(--text-secondary)] hover:border-red-400 hover:text-red-400 transition-colors text-sm"
      >
        ✕
      </button>
    </div>
  )
}
