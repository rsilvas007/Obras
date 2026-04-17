'use client'

import { useState } from 'react'
import { Plus, BookOpen, Cloud, Sun, CloudRain, Wind, Trash2 } from 'lucide-react'
import { mockDiario } from '@/lib/mock-data'
import { formatDateTime } from '@/lib/utils'
import type { DiarioObra } from '@/types'

const CLIMA_OPTIONS = ['Ensolarado', 'Parcialmente nublado', 'Nublado', 'Chuva leve', 'Chuva forte', 'Ventoso']

const climaIcon = (clima: string) => {
  if (clima?.includes('Sol')) return <Sun className="w-4 h-4 text-yellow-500" />
  if (clima?.includes('Chuva')) return <CloudRain className="w-4 h-4 text-blue-500" />
  if (clima?.includes('Vento')) return <Wind className="w-4 h-4 text-slate-500" />
  return <Cloud className="w-4 h-4 text-slate-400" />
}

export default function DiarioPage({ params }: { params: { id: string } }) {
  const [entradas, setEntradas] = useState<DiarioObra[]>(mockDiario[params.id] || [])
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({
    data: new Date().toISOString().split('T')[0],
    descricao: '',
    condicao_clima: 'Ensolarado',
    funcionarios_presentes: '',
    ocorrencias: '',
  })

  function handleAdd(e: React.FormEvent) {
    e.preventDefault()
    const nova: DiarioObra = {
      id: `diary${Date.now()}`,
      obra_id: params.id,
      data: form.data,
      descricao: form.descricao,
      condicao_clima: form.condicao_clima,
      funcionarios_presentes: form.funcionarios_presentes ? parseInt(form.funcionarios_presentes) : undefined,
      ocorrencias: form.ocorrencias || undefined,
      created_by: 'demo',
      created_at: new Date().toISOString(),
    }
    setEntradas(prev => [nova, ...prev])
    setForm({
      data: new Date().toISOString().split('T')[0],
      descricao: '',
      condicao_clima: 'Ensolarado',
      funcionarios_presentes: '',
      ocorrencias: '',
    })
    setShowForm(false)
  }

  const sortedEntradas = [...entradas].sort((a, b) =>
    new Date(b.data).getTime() - new Date(a.data).getTime()
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="page-title">Diário de Obra</h2>
          <p className="text-slate-500 text-sm mt-1">{entradas.length} registros</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary">
          <Plus className="w-4 h-4" /> Novo Registro
        </button>
      </div>

      {/* Add Form */}
      {showForm && (
        <div className="card p-5 border-blue-200 bg-blue-50">
          <h3 className="section-title mb-4">Novo Registro Diário</h3>
          <form onSubmit={handleAdd} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="form-label">Data *</label>
                <input type="date" value={form.data}
                  onChange={e => setForm(p => ({ ...p, data: e.target.value }))}
                  className="form-input" required />
              </div>
              <div>
                <label className="form-label">Condição Climática</label>
                <select value={form.condicao_clima}
                  onChange={e => setForm(p => ({ ...p, condicao_clima: e.target.value }))}
                  className="form-select">
                  {CLIMA_OPTIONS.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="form-label">Funcionários Presentes</label>
                <input type="number" min="0" value={form.funcionarios_presentes}
                  onChange={e => setForm(p => ({ ...p, funcionarios_presentes: e.target.value }))}
                  className="form-input" placeholder="0" />
              </div>
            </div>
            <div>
              <label className="form-label">Descrição das Atividades *</label>
              <textarea value={form.descricao}
                onChange={e => setForm(p => ({ ...p, descricao: e.target.value }))}
                className="form-input resize-none" rows={4}
                placeholder="Descreva as atividades realizadas no dia..."
                required />
            </div>
            <div>
              <label className="form-label">Ocorrências</label>
              <textarea value={form.ocorrencias}
                onChange={e => setForm(p => ({ ...p, ocorrencias: e.target.value }))}
                className="form-input resize-none" rows={2}
                placeholder="Registre ocorrências, acidentes, visitas, etc..." />
            </div>
            <div className="flex gap-3">
              <button type="submit" className="btn-primary">Salvar Registro</button>
              <button type="button" onClick={() => setShowForm(false)} className="btn-secondary">Cancelar</button>
            </div>
          </form>
        </div>
      )}

      {/* Entries */}
      {sortedEntradas.length === 0 ? (
        <div className="card p-12 text-center">
          <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <p className="text-slate-500">Nenhum registro no diário</p>
          <button onClick={() => setShowForm(true)} className="btn-primary mt-4 mx-auto">
            <Plus className="w-4 h-4" /> Criar primeiro registro
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {sortedEntradas.map(entrada => (
            <div key={entrada.id} className="card p-5 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="bg-slate-100 rounded-lg px-3 py-2 text-center">
                    <p className="text-lg font-bold text-slate-900 leading-none">
                      {new Date(entrada.data + 'T12:00:00').getDate()}
                    </p>
                    <p className="text-xs text-slate-500">
                      {new Date(entrada.data + 'T12:00:00').toLocaleString('pt-BR', { month: 'short' })}
                    </p>
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900">
                      {new Date(entrada.data + 'T12:00:00').toLocaleDateString('pt-BR', { weekday: 'long' })}
                    </p>
                    <p className="text-xs text-slate-500">{formatDateTime(entrada.created_at)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {entrada.condicao_clima && (
                    <div className="flex items-center gap-1.5 text-xs text-slate-500">
                      {climaIcon(entrada.condicao_clima)}
                      <span>{entrada.condicao_clima}</span>
                    </div>
                  )}
                  {entrada.funcionarios_presentes !== undefined && (
                    <span className="text-xs bg-blue-50 text-blue-700 font-medium px-2 py-1 rounded">
                      {entrada.funcionarios_presentes} funcionários
                    </span>
                  )}
                  <button
                    onClick={() => setEntradas(p => p.filter(x => x.id !== entrada.id))}
                    className="text-slate-400 hover:text-red-500 transition-colors ml-2"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <p className="text-sm text-slate-700 leading-relaxed mb-3">{entrada.descricao}</p>

              {entrada.ocorrencias && (
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                  <p className="text-xs font-semibold text-amber-800 mb-1">Ocorrências</p>
                  <p className="text-xs text-amber-700">{entrada.ocorrencias}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
