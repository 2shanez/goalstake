'use client'

import { useState, useEffect } from 'react'
import { useAccount } from 'wagmi'
import { BrowseGoals } from '@/components/BrowseGoals'
import { ThemeToggle } from '@/components/ThemeToggle'
import { PrivyConnectButton } from '@/components/PrivyConnectButton'

const categories = ['All', 'Test', 'Daily', 'Weekly', 'Monthly'] as const
type Category = typeof categories[number]

export default function Home() {
  const { isConnected } = useAccount()
  const [activeCategory, setActiveCategory] = useState<Category>('All')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <main className="min-h-screen bg-white text-gray-900 scroll-smooth">
      {/* Subtle Background Pattern */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#2EE59D]/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-[#2EE59D]/3 rounded-full blur-3xl" />
      </div>

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200/50">
        <div className="max-w-6xl mx-auto px-6 py-3 flex justify-between items-center">
          <a 
            href="/" 
            onClick={(e) => { e.preventDefault(); window.history.pushState({}, '', '/'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} 
            className="text-xl font-bold text-[#2EE59D] hover:scale-105 transition-transform cursor-pointer"
          >
            goalstake
          </a>
          <div className="flex items-center gap-6">
            <a href="#how-it-works" className="text-sm text-gray-500 hover:text-gray-900 transition-colors hidden sm:block relative group">
              How it works
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#2EE59D] group-hover:w-full transition-all duration-300" />
            </a>
            <a href="#goals" className="text-sm text-gray-500 hover:text-gray-900 transition-colors hidden sm:block relative group">
              Goals
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#2EE59D] group-hover:w-full transition-all duration-300" />
            </a>
            <ThemeToggle />
            <PrivyConnectButton />
          </div>
        </div>
      </header>

      {/* Trust Bar - Kalshi style */}
      <div className="fixed top-[57px] left-0 right-0 z-40 bg-gray-50/80 backdrop-blur-sm border-b border-gray-200/50 py-2">
        <div className="max-w-6xl mx-auto flex justify-center gap-8 text-sm text-gray-600">
          <span className="flex items-center gap-2 hover:text-gray-900 transition-colors cursor-default">
            <svg className="w-4 h-4 text-[#2EE59D]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            $0 Platform Fees
          </span>
          <span className="flex items-center gap-2 hover:text-gray-900 transition-colors cursor-default">
            <svg className="w-4 h-4 text-[#2EE59D]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            100% Auto-Verified
          </span>
          <span className="flex items-center gap-2 hidden sm:flex hover:text-gray-900 transition-colors cursor-default">
            <svg className="w-4 h-4 text-[#2EE59D]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
            2x More Likely to Succeed
          </span>
        </div>
      </div>

      {/* Hero - Compact with animation */}
      <section className={`pt-32 pb-12 px-6 relative transition-all duration-700 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gray-100/80 text-xs text-gray-600 mb-6 backdrop-blur-sm border border-gray-200/50">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#2EE59D] opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#2EE59D]" />
            </span>
            Live on Base Sepolia
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 leading-tight">
            Stake Money on{' '}
            <span className="text-[#2EE59D] relative">
              Your Goals
              <svg className="absolute -bottom-2 left-0 w-full h-3 text-[#2EE59D]/20" viewBox="0 0 200 12" preserveAspectRatio="none">
                <path d="M0,8 Q50,0 100,8 T200,8" stroke="currentColor" strokeWidth="4" fill="none" />
              </svg>
            </span>
          </h1>
          
          <p className="text-lg text-gray-500 max-w-xl mx-auto mb-8">
            Hit your goal, keep your stake + earn from those who don't.
          </p>
          
          <a 
            href="#goals" 
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#2EE59D] text-black font-semibold rounded-lg 
              hover:bg-[#26c987] hover:shadow-lg hover:shadow-[#2EE59D]/25 hover:-translate-y-0.5
              active:translate-y-0 active:shadow-md
              transition-all duration-200"
          >
            Browse Goals
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </a>
        </div>
      </section>

      {/* Category Filter Pills - Sticky */}
      <div id="goals" className="sticky top-[97px] z-30 bg-white/80 backdrop-blur-md border-b border-gray-200/50 py-3">
        <div className="max-w-6xl mx-auto px-6 flex items-center justify-between">
          <div className="flex gap-2 p-1 bg-gray-100/80 rounded-full">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200
                  ${activeCategory === cat 
                    ? 'bg-white text-gray-900 shadow-sm' 
                    : 'text-gray-500 hover:text-gray-900'}`}
              >
                {cat}
              </button>
            ))}
          </div>
          <div className="text-sm text-gray-400 hidden sm:flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#2EE59D] animate-pulse" />
            8 goals live
          </div>
        </div>
      </div>

      {/* Goals Grid */}
      <section className="py-8 px-6 relative">
        <div className="max-w-6xl mx-auto">
          <BrowseGoals filter={activeCategory} />
        </div>
      </section>

      {/* How It Works - Compact horizontal */}
      <section id="how-it-works" className="py-16 px-6 bg-gradient-to-b from-gray-50 to-white border-t border-gray-200/50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-xs font-semibold text-[#2EE59D] uppercase tracking-wider">Simple Process</span>
            <h2 className="text-2xl font-bold mt-2">How It Works</h2>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 relative">
            {/* Connecting line */}
            <div className="hidden md:block absolute top-8 left-[12.5%] right-[12.5%] h-0.5 bg-gradient-to-r from-transparent via-gray-200 to-transparent" />
            
            {[
              { step: '01', icon: '👤', title: 'Sign up', desc: 'Email or Google. No crypto needed.' },
              { step: '02', icon: '🎯', title: 'Pick a goal', desc: 'Choose your challenge level.' },
              { step: '03', icon: '💵', title: 'Stake money', desc: 'Put real money on the line.' },
              { step: '04', icon: '🏆', title: 'Hit your goal', desc: 'Win = keep stake + bonus.' },
            ].map((item, i) => (
              <div 
                key={item.step} 
                className="text-center group relative"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <div className="relative inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white shadow-sm border border-gray-100 mb-4 group-hover:shadow-md group-hover:border-[#2EE59D]/30 group-hover:scale-110 transition-all duration-300">
                  <span className="text-2xl">{item.icon}</span>
                  <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-[#2EE59D] text-[10px] font-bold text-black flex items-center justify-center">
                    {item.step.slice(-1)}
                  </span>
                </div>
                <h3 className="font-semibold mb-1 group-hover:text-[#2EE59D] transition-colors">{item.title}</h3>
                <p className="text-sm text-gray-500">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why It Works - Compact */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-xs font-semibold text-[#2EE59D] uppercase tracking-wider">The Science</span>
            <h2 className="text-2xl font-bold mt-2">Why It Works</h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: '🧠', title: 'Loss Aversion', desc: 'We work 2x harder to avoid losing money than to gain it.' },
              { icon: '🔗', title: 'Trustless Verification', desc: 'Chainlink oracles verify Strava data automatically.' },
              { icon: '💸', title: 'Real Consequences', desc: 'Miss your goal = stake goes to winners. No excuses.' },
            ].map((item, i) => (
              <div 
                key={item.title}
                className="group p-6 rounded-xl border border-gray-200 hover:border-[#2EE59D]/50 hover:shadow-lg hover:shadow-[#2EE59D]/5 hover:-translate-y-1 transition-all duration-300 bg-white"
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#2EE59D]/10 to-[#2EE59D]/5 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <span className="text-2xl">{item.icon}</span>
                </div>
                <h3 className="font-semibold mb-2 group-hover:text-[#2EE59D] transition-colors">{item.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="py-20 px-6 bg-gray-900 text-white relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-0 left-1/4 w-64 h-64 bg-[#2EE59D]/20 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-48 h-48 bg-[#2EE59D]/10 rounded-full blur-3xl" />
        </div>
        
        <div className="max-w-3xl mx-auto text-center relative">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to bet on yourself?
          </h2>
          <p className="text-gray-400 mb-8 text-lg">
            Join the commitment market. Put money on your goals.
          </p>
          <a 
            href="#goals" 
            className="inline-flex items-center gap-2 px-8 py-4 bg-[#2EE59D] text-black font-bold rounded-xl 
              hover:bg-white hover:shadow-xl hover:shadow-[#2EE59D]/25 hover:-translate-y-1
              active:translate-y-0
              transition-all duration-200 text-lg"
          >
            Get Started
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 py-8 px-6 bg-white">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-4">
            <span className="font-bold text-[#2EE59D] text-lg">goalstake</span>
            <span className="text-sm text-gray-400">The Commitment Market</span>
          </div>
          
          <div className="flex items-center gap-6 text-sm text-gray-500">
            <a href="https://github.com/2shanez/goalstake" target="_blank" rel="noopener noreferrer" className="hover:text-[#2EE59D] transition-colors">
              GitHub
            </a>
            <a href="https://github.com/2shanez/goalstake/blob/main/WHITEPAPER.md" target="_blank" rel="noopener noreferrer" className="hover:text-[#2EE59D] transition-colors">
              Whitepaper
            </a>
            <span>
              Built on{' '}
              <a href="https://base.org" target="_blank" rel="noopener noreferrer" className="text-[#2EE59D] hover:underline">Base</a>
              {' '}×{' '}
              <a href="https://chain.link" target="_blank" rel="noopener noreferrer" className="text-[#2EE59D] hover:underline">Chainlink</a>
            </span>
          </div>
        </div>
      </footer>
    </main>
  )
}
