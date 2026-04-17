'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Plus, Search, Building2, MapPin, Calendar } from 'lucide-react'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { mockObras } from '@/lib/mock-data'
import { formatCurrency, formatDate, isAtrasada } from '@/lib/utils'
import type { ObraStatus } from '@/types'

const STATUS_TABS: { label: string; value: ObraStatus | 'todas' }[] = [
  { label: 'Todas', value: 'todas' },
  { label: 'Em Andamento', value: 'em_andamento' },
  { label: 'Planejamento', value: 'planejamento' },
  { label: 'Concluídas', value: 'concluida' },
  { label: 'Pausadas', value: 'pausada' },
]

export default function ObrasPage() {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<ObraStatus | 'todas'>('todas')

  const filtered = mockObras.filter(o => {
    const matchSearch = o.nome.toLowerCase().includes(search.toLowerCase()) ||
      (o.endereco || '').toLowerCase().includes(search.toLowerCase())
    const matchStatus = statusFilter === 'todas' || o.status === statusFilter
    return matchSearch && matchStatus
  })

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="page-title">Obras</h1>
          <p className="text-slate-500 text-sm mt-1">{mockObras.length} obras cadastradas</p>
        </div>
        <Link href="/obras/new" className="btn-primary flex-shrink-0">
          <Plus className="w-4 h-4" />
          Nova Obra
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar obras..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="form-input pl-9"
          />
        </div>
        <div className="flex gap-1 bg-white border border-slate-200 rounded-lg p-1 flex-wrap">
          {STATUS_TABS.map(tab => (
            <button
              key={tab.value}
              onClick={() => setStatusFilter(tab.value)}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                statusFilter === tab.value
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="card p-12 text-center">
          <Building2 className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <p className="text-slate-500">Nenhuma obra encontrada</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {filtered.map(obra => {
            const atrasada = isAtrasada(obra.data_fim_prevista, obra.progresso)
            const percentGasto = Math.round((obra.custo_realizado / obra.orcamento_total) * 100)

            return (
              <Link
                key={obra.id}
                href={`/obras/${obra.id}`}
                className="card p-5 hover:shadow-md hover:border-blue-200 transition-all duration-200 block"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center">
                    <Building2 className="w-5 h-5 text-orange-600" />
                  </div>
                  <StatusBadge status={atrasada ? 'atrasada' : obra.status} />
                </div>

                <h3 className="font-semibold text-slate-900 mb-1 line-clamp-2 leading-snug">{obra.nome}</h3>

                {obra.endereco && (
                  <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-3">
                    <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
                    <span className="truncate">{obra.endereco}</span>
                  </div>
                )}

                {/* Progress */}
                <div className="mb-3">
                  <div className="flex justify-between text-xs text-slate-500 mb-1">
                    <span>Progresso</span>
                    <span className="font-semibold">{obra.progresso}%</span>
                  </div>
                  <ProgressBar value={obra.progresso} size="md" />
                </div>

                {/* Budget */}
                <div className="grid grid-cols-2 gap-3 mb-3">
                  <div className="bg-slate-50 rounded-lg p-2.5">
                    <p className="text-xs text-slate-500">Orçado</p>
                    <p className="text-sm font-bold text-slate-900">{formatCurrency(obra.orcamento_total)}</p>
                  </div>
                  <div className={`rounded-lg p-2.5 ${percentGasto > 100 ? 'bg-red-50' : 'bg-slate-50'}`}>
                    <p className="text-xs text-slate-500">Realizado</p>
                    <p className={`text-sm font-bold ${percentGasto > 100 ? 'text-red-600' : 'text-slate-900'}`}>
                      {formatCurrency(obra.custo_realizado)}
                    </p>
                  </div>
                </div>

                {/* Dates */}
                <div className="flex items-center gap-1.5 text-xs text-slate-500">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Previsão: {formatDate(obra.data_fim_prevista)}</span>
                </div>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}
