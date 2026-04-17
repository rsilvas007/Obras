'use client'

import { usePathname } from 'next/navigation'
import { ChevronRight, Bell, User } from 'lucide-react'

const breadcrumbLabels: Record<string, string> = {
  obras: 'Obras',
  relatorios: 'Relatórios',
  configuracoes: 'Configurações',
  cronograma: 'Cronograma',
  custos: 'Custos',
  materiais: 'Materiais',
  equipe: 'Equipe',
  diario: 'Diário de Obra',
  new: 'Nova Obra',
}

export function Header({ userName }: { userName?: string }) {
  const pathname = usePathname()
  const parts = pathname.split('/').filter(Boolean)

  const crumbs = parts.map((part, i) => ({
    label: breadcrumbLabels[part] || (part.length === 1 ? `Obra #${part}` : part),
    isLast: i === parts.length - 1,
  }))

  return (
    <header className="bg-white border-b border-slate-200 h-16 flex items-center px-6 gap-4 sticky top-0 z-30">
      <div className="flex-1 flex items-center gap-1.5 text-sm min-w-0">
        <span className="text-slate-500 hidden sm:block">Dashboard</span>
        {crumbs.map((c, i) => (
          <div key={i} className="flex items-center gap-1.5">
            <ChevronRight className="w-4 h-4 text-slate-400 hidden sm:block" />
            <span className={c.isLast ? 'font-semibold text-slate-900 truncate' : 'text-slate-500 truncate'}>
              {c.label}
            </span>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-2 flex-shrink-0">
        <button className="relative w-9 h-9 rounded-lg bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors">
          <Bell className="w-4 h-4 text-slate-600" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-orange-500 rounded-full"></span>
        </button>

        <div className="flex items-center gap-2.5 pl-1">
          <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center shadow-sm">
            <User className="w-4 h-4 text-white" />
          </div>
          <div className="hidden sm:block">
            <p className="text-sm font-semibold text-slate-900 leading-tight">{userName || 'Admin'}</p>
            <p className="text-xs text-slate-500">Administrador</p>
          </div>
        </div>
      </div>
    </header>
  )
}
