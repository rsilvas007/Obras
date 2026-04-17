'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

const subNavItems = [
  { label: 'Visão Geral', href: '' },
  { label: 'Cronograma', href: '/cronograma' },
  { label: 'Custos', href: '/custos' },
  { label: 'Materiais', href: '/materiais' },
  { label: 'Equipe', href: '/equipe' },
  { label: 'Diário', href: '/diario' },
]

export default function ObraLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: { id: string }
}) {
  const pathname = usePathname()
  const base = `/obras/${params.id}`

  return (
    <div className="space-y-0">
      {/* Sub Navigation */}
      <div className="-mx-6 -mt-6 px-6 pt-6 pb-0 bg-white border-b border-slate-200 mb-6">
        <div className="flex gap-0 overflow-x-auto">
          {subNavItems.map(item => {
            const href = `${base}${item.href}`
            const isActive = item.href === ''
              ? pathname === base
              : pathname.startsWith(`${base}${item.href}`)
            return (
              <Link
                key={item.href}
                href={href}
                className={cn(
                  'px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap',
                  isActive
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300'
                )}
              >
                {item.label}
              </Link>
            )
          })}
        </div>
      </div>
      {children}
    </div>
  )
}
