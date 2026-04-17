'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import {
  LayoutDashboard, Building2, BarChart3, Settings,
  ChevronRight, HardHat, LogOut, Menu, X,
} from 'lucide-react'
import { cn } from '@/lib/utils'

const navItems = [
  { href: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/obras', icon: Building2, label: 'Obras' },
  { href: '/relatorios', icon: BarChart3, label: 'Relatórios' },
]

export function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const [mobileOpen, setMobileOpen] = useState(false)

  async function handleLogout() {
    try {
      const { createClient } = await import('@/lib/supabase/client')
      const supabase = createClient()
      await supabase.auth.signOut()
    } catch { /* demo mode */ }
    router.push('/login')
    router.refresh()
  }

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 py-5 border-b border-slate-700/50">
        <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
          <HardHat className="w-5 h-5 text-white" />
        </div>
        <div>
          <p className="font-bold text-white text-sm leading-tight">Obras ERP</p>
          <p className="text-xs text-slate-400">Gestão de Obras</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-0.5">
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest px-3 mb-3">Menu</p>
        {navItems.map(({ href, icon: Icon, label }) => {
          const isActive = href === '/' ? pathname === '/' : pathname.startsWith(href)
          return (
            <Link
              key={href}
              href={href}
              onClick={() => setMobileOpen(false)}
              className={cn(
                'sidebar-link',
                isActive ? 'active' : 'text-slate-400'
              )}
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              <span className="flex-1">{label}</span>
              {isActive && <ChevronRight className="w-4 h-4" />}
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="px-3 py-4 border-t border-slate-700/50 space-y-0.5">
        <Link
          href="/configuracoes"
          className={cn('sidebar-link', pathname === '/configuracoes' ? 'active' : 'text-slate-400')}
          onClick={() => setMobileOpen(false)}
        >
          <Settings className="w-5 h-5" />
          <span>Configurações</span>
        </Link>
        <button onClick={handleLogout} className="sidebar-link text-slate-400 w-full text-left">
          <LogOut className="w-5 h-5" />
          <span>Sair</span>
        </button>
      </div>
    </div>
  )

  return (
    <>
      {/* Mobile toggle */}
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 w-10 h-10 bg-slate-800 text-white rounded-lg flex items-center justify-center shadow-lg"
      >
        {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 bg-black/50 z-40" onClick={() => setMobileOpen(false)} />
      )}

      {/* Mobile sidebar */}
      <aside className={cn(
        'lg:hidden fixed inset-y-0 left-0 z-40 w-64 bg-slate-800 transform transition-transform duration-300 ease-in-out',
        mobileOpen ? 'translate-x-0' : '-translate-x-full'
      )}>
        <SidebarContent />
      </aside>

      {/* Desktop sidebar */}
      <aside className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 bg-slate-800">
        <SidebarContent />
      </aside>
    </>
  )
}
