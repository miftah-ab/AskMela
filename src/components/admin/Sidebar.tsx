'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const menuItems = [
  { name: 'Overview', path: '/control/dashboard' },
  { name: 'Businesses', path: '/control/businesses' },
  { name: 'Conversations', path: '/control/conversations' },
  { name: 'System', path: '/control/system' },
  { name: 'Announcements', path: '/control/announcements' },
]

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="fixed left-0 top-0 w-[240px] h-screen bg-[#111111] border-r border-white/5 flex flex-col z-50">
      <div className="p-8">
        <h1 className="text-2xl font-bold tracking-tighter text-white">AskMela</h1>
        <p className="text-[10px] text-[#888880] uppercase tracking-[0.2em] font-medium mt-1">
          Control Panel
        </p>
      </div>

      <nav className="flex-1 mt-4">
        {menuItems.map((item) => {
          const isActive = pathname.startsWith(item.path)
          return (
            <Link
              key={item.path}
              href={item.path}
              className={`flex items-center px-8 py-3 text-sm transition-colors border-l-[3px] ${
                isActive 
                  ? 'border-[#00FF88] text-[#00FF88] bg-[#00FF88]/5' 
                  : 'border-transparent text-[#888880] hover:text-[#F0EDE6]'
              }`}
            >
              {item.name}
            </Link>
          )
        })}
      </nav>

      <div className="p-8 border-t border-white/5 space-y-4">
        <div className="text-[10px] text-[#888880]">
          <p>Admin ID</p>
          <p className="text-[#F0EDE6] mt-0.5">{process.env.NEXT_PUBLIC_ADMIN_TELEGRAM_ID || '12345678'}</p>
        </div>
        
        <button 
          className="text-sm text-[#EF4444]/60 hover:text-[#EF4444] transition-colors flex items-center gap-2"
          onClick={() => {
            document.cookie = "admin_session=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
            window.location.href = "/";
          }}
        >
          Logout
        </button>
      </div>
    </aside>
  )
}
