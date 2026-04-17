'use client'

import { useState } from 'react'
import { Plus, Calendar, CheckCircle, Clock, AlertCircle, Circle } from 'lucide-react'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { mockEtapas } from '@/lib/mock-data'
import { formatDate } from '@/lib/utils'
import type { Etapa } from '@/types'

const statusIcon = {
  concluida: <CheckCircle className="w-5 h-5 text-emerald-500" />,
  em_andamento: <Clock className="w-5 h-5 text-amber-500" />,
  atrasada: <AlertCircle className="w-5 h-5 text-red-500" />,
  pendente: <Circle className="w-5 h-5 text-slate-300" />,
}

export default function CronogramaPage({ params }: { params: { id: string } }) {
  const [etapas, setEtapas] = useState<Etapa[]>(mockEtapas[params.id] || [])
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ nome: '', descricao: '', data_inicio: '', data_fim: '', ordem: '' })

  function handleAddEtapa(e: React.FormEvent) {
    e.preventDefault()
    const nova: Etapa = {
      id: `e${Date.now()}`,
      obra_id: params.id,
      nome: form.nome,
      descricao: form.descricao,
      data_inicio: form.data_inicio,
      data_fim: form.data_fim,
      progresso: 0,
      status: 'pendente',
      ordem: etapas.length + 1,
      created_at: new Date().toISOString(),
    }
    setEtapas(prev => [...prev, nova])
    setForm({ nome: '', descricao: '', data_inicio: '', data_fim: '', ordem: '' })
    setShowForm(false)
  }

  const total = etapas.length
  const concluidas = etapas.filter(e => e.status === 'concluida').length
  const mediaProgresso = total > 0 ? Math.round(etapas.reduce((s, e) => s + e.progresso, 0) / total) : 0

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="page-title">Cronograma</h2>
          <p className="text-slate-500 text-sm mt-1">{concluidas} de {total} etapas concluídas</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary">
          <Plus className="w-4 h-4" />
          Nova Etapa
        </button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-4">
        <div className="card p-4 text-center">
          <p className="text-2xl font-bold text-slate-900">{total}</p>
          <p className="text-xs text-slate-500">Total de etapas</p>
        </div>
        <div className="card p-4 text-center">
          <p className="text-2xl font-bold text-emerald-600">{concluidas}</p>
          <p className="text-xs text-slate-500">Concluídas</p>
        </div>
        <div className="card p-4 text-center">
          <p className="text-2xl font-bold text-blue-600">{mediaProgresso}%</p>
          <p className="text-xs text-slate-500">Progresso médio</p>
        </div>
      </div>

      {/* Add Form */}
      {showForm && (
        <div className="card p-5 border-blue-200 bg-blue-50">
          <h3 className="section-title mb-4">Nova Etapa</h3>
          <form onSubmit={handleAddEtapa} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="form-label">Nome da Etapa *</label>
                <input value={form.nome} onChange={e => setForm(p => ({ ...p, nome: e.target.value }))}
                  className="form-input" placeholder="Ex: Fundação" required />
              </div>
              <div className="sm:col-span-2">
                <label className="form-label">Descrição</label>
                <textarea value={form.descricao} onChange={e => setForm(p => ({ ...p, descricao: e.target.value }))}
                  className="form-input resize-none" rows={2} placeholder="Descreva a etapa..." />
              </div>
              <div>
                <label className="form-label">Data de Início *</label>
                <input type="date" value={form.data_inicio} onChange={e => setForm(p => ({ ...p, data_inicio: e.target.value }))}
                  className="form-input" required />
              </div>
              <div>
                <label className="form-label">Data de Término *</label>
                <input type="date" value={form.data_fim} onChange={e => setForm(p => ({ ...p, data_fim: e.target.value }))}
                  className="form-input" required />
              </div>
            </div>
            <div className="flex gap-3">
              <button type="submit" className="btn-primary">Adicionar Etapa</button>
              <button type="button" onClick={() => setShowForm(false)} className="btn-secondary">Cancelar</button>
            </div>
          </form>
        </div>
      )}

      {/* Timeline */}
      {etapas.length === 0 ? (
        <div className="card p-12 text-center">
          <Calendar className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <p className="text-slate-500">Nenhuma etapa cadastrada</p>
          <button onClick={() => setShowForm(true)} className="btn-primary mt-4 mx-auto">
            <Plus className="w-4 h-4" /> Adicionar primeira etapa
          </button>
        </div>
      ) : (
        <div className="card divide-y divide-slate-100">
          {etapas
            .sort((a, b) => a.ordem - b.ordem)
            .map((etapa, idx) => (
              <div key={etapa.id} className="p-5">
                <div className="flex items-start gap-4">
                  {/* Step number + icon */}
                  <div className="flex flex-col items-center">
                    <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-600">
                      {idx + 1}
                    </div>
                    {idx < etapas.length - 1 && (
                      <div className="w-0.5 h-6 bg-slate-200 mt-1" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 flex-wrap mb-1">
                      <h3 className="font-semibold text-slate-900">{etapa.nome}</h3>
                      <StatusBadge status={etapa.status} />
                      {etapa.dependencia_id && (
                        <span className="text-xs text-slate-400 bg-slate-100 px-2 py-0.5 rounded">Dep. de etapa anterior</span>
                      )}
                    </div>
                    {etapa.descricao && (
                      <p className="text-sm text-slate-500 mb-2">{etapa.descricao}</p>
                    )}
                    <div className="flex items-center gap-4 text-xs text-slate-500 mb-3 flex-wrap">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        {formatDate(etapa.data_inicio)} → {formatDate(etapa.data_fim)}
                      </span>
                    </div>
                    <ProgressBar value={etapa.progresso} showLabel size="sm" />
                  </div>

                  <div className="flex-shrink-0">
                    {statusIcon[etapa.status]}
                  </div>
                </div>
              </div>
            ))}
        </div>
      )}
    </div>
  )
}
