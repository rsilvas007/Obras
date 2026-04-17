'use client'

import { useState } from 'react'
import { Plus, Users, Phone, Mail, Trash2, UserCheck } from 'lucide-react'
import { mockObraFuncionarios, mockFuncionarios } from '@/lib/mock-data'
import { formatDate, getStatusLabel } from '@/lib/utils'
import type { ObraFuncionario, FuncaoFuncionario } from '@/types'

const FUNCAO_COLORS: Record<string, string> = {
  engenheiro: 'bg-blue-100 text-blue-800',
  arquiteto: 'bg-violet-100 text-violet-800',
  mestre_de_obra: 'bg-orange-100 text-orange-800',
  pedreiro: 'bg-amber-100 text-amber-800',
  eletricista: 'bg-yellow-100 text-yellow-800',
  encanador: 'bg-cyan-100 text-cyan-800',
  pintor: 'bg-pink-100 text-pink-800',
  carpinteiro: 'bg-emerald-100 text-emerald-800',
  servente: 'bg-slate-100 text-slate-700',
  outros: 'bg-gray-100 text-gray-700',
}

export default function EquipePage({ params }: { params: { id: string } }) {
  const [equipe, setEquipe] = useState<ObraFuncionario[]>(mockObraFuncionarios[params.id] || [])
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ funcionario_id: '', data_entrada: '', cargo_na_obra: '' })

  // Filter out already added members
  const funcionariosDisponiveis = mockFuncionarios.filter(
    f => !equipe.some(e => e.funcionario_id === f.id)
  )

  function handleAdd(e: React.FormEvent) {
    e.preventDefault()
    const funcionario = mockFuncionarios.find(f => f.id === form.funcionario_id)
    if (!funcionario) return
    const novo: ObraFuncionario = {
      id: `of${Date.now()}`,
      obra_id: params.id,
      funcionario_id: form.funcionario_id,
      funcionario,
      data_entrada: form.data_entrada,
      cargo_na_obra: form.cargo_na_obra || undefined,
      created_at: new Date().toISOString(),
    }
    setEquipe(prev => [...prev, novo])
    setForm({ funcionario_id: '', data_entrada: '', cargo_na_obra: '' })
    setShowForm(false)
  }

  const funcaoCount = equipe.reduce((acc, m) => {
    const f = m.funcionario?.funcao || 'outros'
    acc[f] = (acc[f] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="page-title">Equipe</h2>
          <p className="text-slate-500 text-sm mt-1">{equipe.length} membros na obra</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary">
          <Plus className="w-4 h-4" /> Adicionar Membro
        </button>
      </div>

      {/* Role distribution */}
      {Object.keys(funcaoCount).length > 0 && (
        <div className="card p-4">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Distribuição por Função</p>
          <div className="flex flex-wrap gap-2">
            {Object.entries(funcaoCount).map(([funcao, count]) => (
              <span key={funcao}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold ${FUNCAO_COLORS[funcao] || 'bg-gray-100 text-gray-700'}`}>
                <UserCheck className="w-3 h-3" />
                {getStatusLabel(funcao)} ({count})
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Add Form */}
      {showForm && (
        <div className="card p-5 border-blue-200 bg-blue-50">
          <h3 className="section-title mb-4">Adicionar Membro à Equipe</h3>
          <form onSubmit={handleAdd} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="form-label">Funcionário *</label>
                <select value={form.funcionario_id}
                  onChange={e => setForm(p => ({ ...p, funcionario_id: e.target.value }))}
                  className="form-select" required>
                  <option value="">Selecionar...</option>
                  {funcionariosDisponiveis.map(f => (
                    <option key={f.id} value={f.id}>
                      {f.nome} — {getStatusLabel(f.funcao)}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="form-label">Data de Entrada *</label>
                <input type="date" value={form.data_entrada}
                  onChange={e => setForm(p => ({ ...p, data_entrada: e.target.value }))}
                  className="form-input" required />
              </div>
              <div>
                <label className="form-label">Cargo na Obra</label>
                <input value={form.cargo_na_obra}
                  onChange={e => setForm(p => ({ ...p, cargo_na_obra: e.target.value }))}
                  className="form-input" placeholder="Ex: Encarregado" />
              </div>
            </div>
            <div className="flex gap-3">
              <button type="submit" className="btn-primary">Adicionar</button>
              <button type="button" onClick={() => setShowForm(false)} className="btn-secondary">Cancelar</button>
            </div>
          </form>
        </div>
      )}

      {/* Team Grid */}
      {equipe.length === 0 ? (
        <div className="card p-12 text-center">
          <Users className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <p className="text-slate-500">Nenhum membro cadastrado</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {equipe.map(membro => (
            <div key={membro.id} className="card p-5 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div className="w-12 h-12 bg-slate-200 rounded-full flex items-center justify-center">
                  <span className="text-lg font-bold text-slate-600">
                    {membro.funcionario?.nome.charAt(0).toUpperCase()}
                  </span>
                </div>
                <button
                  onClick={() => setEquipe(p => p.filter(x => x.id !== membro.id))}
                  className="text-slate-400 hover:text-red-500 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <h3 className="font-semibold text-slate-900">{membro.funcionario?.nome}</h3>
              {membro.cargo_na_obra && (
                <p className="text-sm text-slate-500">{membro.cargo_na_obra}</p>
              )}

              <div className="mt-3">
                <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold ${FUNCAO_COLORS[membro.funcionario?.funcao || 'outros'] || 'bg-gray-100'}`}>
                  {getStatusLabel(membro.funcionario?.funcao || 'outros')}
                </span>
              </div>

              <div className="mt-3 space-y-1.5">
                {membro.funcionario?.telefone && (
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <Phone className="w-3.5 h-3.5" />
                    <span>{membro.funcionario.telefone}</span>
                  </div>
                )}
                {membro.funcionario?.email && (
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <Mail className="w-3.5 h-3.5" />
                    <span className="truncate">{membro.funcionario.email}</span>
                  </div>
                )}
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <span>Entrada: {formatDate(membro.data_entrada)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
