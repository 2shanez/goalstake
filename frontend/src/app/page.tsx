'use client'

import { ConnectButton } from '@rainbow-me/rainbowkit'
import { useAccount } from 'wagmi'
import { CreateChallenge } from '@/components/CreateChallenge'
import { MyChallenges } from '@/components/MyChallenges'

export default function Home() {
  const { isConnected } = useAccount()

  return (
    <main className="min-h-screen bg-black">
      {/* Header */}
      <header className="border-b border-[#222]">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#2EE59D] flex items-center justify-center">
              <span className="text-black font-bold text-lg">G</span>
            </div>
            <span className="text-xl font-semibold tracking-tight">GoalStake</span>
          </div>
          <ConnectButton 
            showBalance={false}
            chainStatus="icon"
            accountStatus="address"
          />
        </div>
      </header>

      {/* Hero */}
      {!isConnected && (
        <section className="max-w-6xl mx-auto px-6 py-24 text-center">
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6">
            Bet on <span className="text-[#2EE59D]">yourself</span>
          </h1>
          <p className="text-xl text-[#888] max-w-2xl mx-auto mb-12">
            Stake money on your fitness goals. Hit them, keep your stake. Miss them, lose it. 
            No willpower required — just consequences.
          </p>
          <ConnectButton />
        </section>
      )}

      {/* Main Content */}
      {isConnected && (
        <section className="max-w-6xl mx-auto px-6 py-12">
          <div className="grid lg:grid-cols-5 gap-8">
            {/* Create Challenge - Takes more space */}
            <div className="lg:col-span-3">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-2 h-2 rounded-full bg-[#2EE59D]"></div>
                <h2 className="text-lg font-medium text-[#888]">New Challenge</h2>
              </div>
              <CreateChallenge />
            </div>

            {/* My Challenges */}
            <div className="lg:col-span-2">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-2 h-2 rounded-full bg-[#2EE59D]"></div>
                <h2 className="text-lg font-medium text-[#888]">My Challenges</h2>
              </div>
              <MyChallenges />
            </div>
          </div>
        </section>
      )}

      {/* How It Works */}
      <section className="border-t border-[#222] mt-12">
        <div className="max-w-6xl mx-auto px-6 py-20">
          <h3 className="text-sm font-medium text-[#888] uppercase tracking-wider mb-12 text-center">How it works</h3>
          <div className="grid md:grid-cols-4 gap-8">
            {[
              { step: '01', title: 'Set a goal', desc: 'Choose your running target' },
              { step: '02', title: 'Stake USDC', desc: 'Put money on the line' },
              { step: '03', title: 'Connect Strava', desc: 'We verify automatically' },
              { step: '04', title: 'Win or lose', desc: 'Hit goal = keep stake + bonus' },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="text-[#2EE59D] font-mono text-sm mb-3">{item.step}</div>
                <h4 className="font-semibold mb-2">{item.title}</h4>
                <p className="text-sm text-[#888]">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#222] py-8">
        <div className="max-w-6xl mx-auto px-6 flex justify-between items-center text-sm text-[#888]">
          <span>Built on Base with Chainlink</span>
          <div className="flex gap-6">
            <a href="#" className="hover:text-white transition-colors">Docs</a>
            <a href="#" className="hover:text-white transition-colors">GitHub</a>
          </div>
        </div>
      </footer>
    </main>
  )
}
