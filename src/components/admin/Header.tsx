'use client'

import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'

export default function Header() {
  const pathname = usePathname()
  const [lastUpdated, setLastUpdated] = useState<string>(new Date().toLocaleTimeString())
  const isProd = process.env.NODE_ENV === 'production'

  const getPageTitle = () => {
    const segment = pathname.split('/').pop() || 'Dashboard'
    return segment.charAt(0).toUpperCase() + segment.slice(1)
  }

  useEffect(() => {
    const interval = setInterval(() => {
      setLastUpdated(new Date().toLocaleTimeString())
    }, 30000)
    return () => clearInterval(interval)
  }, [])

  return (
    <header className="fixed top-0 right-0 left-[240px] h-[64px] bg-[#0A0A0A]/80 backdrop-blur-md border-b border-white/5 flex items-center justify-between px-8 z-40">
      <h2 className="text-lg font-semibold tracking-tight">{getPageTitle()}</h2>

      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${isProd ? 'bg-[#EF4444] shadow-[0_0_8px_rgba(239,68,68,0.5)]' : 'bg-[#F59E0B] shadow-[0_0_8px_rgba(245,158,11,0.5)]'}`} />
          <span className={`text-[10px] font-bold uppercase tracking-widest ${isProd ? 'text-[#EF4444]' : 'text-[#F59E0B]'}`}>
            {isProd ? 'Production' : 'Development'}
          </span>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-[10px] text-[#888880] uppercase tracking-wider">
            Last updated: {lastUpdated}
          </span>
          <button 
            className="p-1.5 hover:bg-white/5 rounded-md transition-colors"
            onClick={() => window.location.reload()}
          >
            <svg className="w-4 h-4 text-[#888880]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 2v6h-6M3 12a9 9 0 0 1 15-6.7L21 8M3 22v-6h6M21 12a9 9 0 0 1-15 6.7L3 16" />
            </svg>
          </button>
        </div>
      </div>
    </header>
  )
}
