'use client'

import { useState } from 'react'
import { Plus, Package, Trash2 } from 'lucide-react'
import { mockObraMateriais, mockMateriais } from '@/lib/mock-data'
import { formatCurrency } from '@/lib/utils'
import type { ObraMaterial } from '@/types'

export default function MateriaisPage({ params }: { params: { id: string } }) {
  const [obraMateriais, setObraMateriais] = useState<ObraMaterial[]>(mockObraMateriais[params.id] || [])
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ material_id: '', quantidade_prevista: '', quantidade_usada: '0' })

  const totalCustoPrevisto = obraMateriais.reduce((sum, om) => {
    return sum + (om.material?.preco_unitario || 0) * om.quantidade_prevista
  }, 0)

  const totalCustoRealizado = obraMateriais.reduce((sum, om) => {
    return sum + (om.material?.preco_unitario || 0) * om.quantidade_usada
  }, 0)

  function handleAdd(e: React.FormEvent) {
    e.preventDefault()
    const material = mockMateriais.find(m => m.id === form.material_id)
    if (!material) return
    const novo: ObraMaterial = {
      id: `om${Date.now()}`,
      obra_id: params.id,
      material_id: form.material_id,
      material,
      quantidade_prevista: parseFloat(form.quantidade_prevista),
      quantidade_usada: parseFloat(form.quantidade_usada) || 0,
      created_at: new Date().toISOString(),
    }
    setObraMateriais(prev => [...prev, novo])
    setForm({ material_id: '', quantidade_prevista: '', quantidade_usada: '0' })
    setShowForm(false)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="page-title">Materiais</h2>
          <p className="text-slate-500 text-sm mt-1">{obraMateriais.length} materiais cadastrados</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary">
          <Plus className="w-4 h-4" /> Adicionar Material
        </button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 gap-4">
        <div className="card p-4">
          <p className="text-xs text-slate-500">Custo Previsto (materiais)</p>
          <p className="text-xl font-bold text-slate-900 mt-1">{formatCurrency(totalCustoPrevisto)}</p>
        </div>
        <div className="card p-4">
          <p className="text-xs text-slate-500">Custo Realizado (materiais)</p>
          <p className="text-xl font-bold text-slate-900 mt-1">{formatCurrency(totalCustoRealizado)}</p>
        </div>
      </div>

      {/* Form */}
      {showForm && (
        <div className="card p-5 border-blue-200 bg-blue-50">
          <h3 className="section-title mb-4">Adicionar Material</h3>
          <form onSubmit={handleAdd} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-3">
                <label className="form-label">Material *</label>
                <select value={form.material_id}
                  onChange={e => setForm(p => ({ ...p, material_id: e.target.value }))}
                  className="form-select" required>
                  <option value="">Selecione um material...</option>
                  {mockMateriais.map(m => (
                    <option key={m.id} value={m.id}>
                      {m.nome} ({m.unidade}) — {formatCurrency(m.preco_unitario)}/{m.unidade}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="form-label">Qtd. Prevista *</label>
                <input type="number" min="0" step="0.001" value={form.quantidade_prevista}
                  onChange={e => setForm(p => ({ ...p, quantidade_prevista: e.target.value }))}
                  className="form-input" required />
              </div>
              <div>
                <label className="form-label">Qtd. Utilizada</label>
                <input type="number" min="0" step="0.001" value={form.quantidade_usada}
                  onChange={e => setForm(p => ({ ...p, quantidade_usada: e.target.value }))}
                  className="form-input" />
              </div>
              <div className="flex items-end">
                <div className="text-sm text-slate-600 pb-2">
                  {form.material_id && form.quantidade_prevista && (
                    <>
                      <p className="text-xs text-slate-500">Custo previsto</p>
                      <p className="font-bold">
                        {formatCurrency((mockMateriais.find(m => m.id === form.material_id)?.preco_unitario || 0) * parseFloat(form.quantidade_prevista || '0'))}
                      </p>
                    </>
                  )}
                </div>
              </div>
            </div>
            <div className="flex gap-3">
              <button type="submit" className="btn-primary">Adicionar</button>
              <button type="button" onClick={() => setShowForm(false)} className="btn-secondary">Cancelar</button>
            </div>
          </form>
        </div>
      )}

      {/* Table */}
      {obraMateriais.length === 0 ? (
        <div className="card p-12 text-center">
          <Package className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <p className="text-slate-500">Nenhum material cadastrado</p>
        </div>
      ) : (
        <div className="card">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-100">
                  <th className="table-header text-left px-5 py-3">Material</th>
                  <th className="table-header text-left px-3 py-3">Unid.</th>
                  <th className="table-header text-right px-3 py-3">Preço Unit.</th>
                  <th className="table-header text-right px-3 py-3">Qtd. Prevista</th>
                  <th className="table-header text-right px-3 py-3">Qtd. Usada</th>
                  <th className="table-header text-right px-3 py-3">Uso %</th>
                  <th className="table-header text-right px-5 py-3">Custo Total</th>
                  <th className="px-3 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {obraMateriais.map(om => {
                  const percentUso = om.quantidade_prevista > 0
                    ? Math.round((om.quantidade_usada / om.quantidade_prevista) * 100)
                    : 0
                  const custoTotal = (om.material?.preco_unitario || 0) * om.quantidade_usada

                  return (
                    <tr key={om.id} className="hover:bg-slate-50">
                      <td className="table-cell px-5 py-3 font-medium">{om.material?.nome}</td>
                      <td className="table-cell px-3 py-3 text-slate-500">{om.material?.unidade}</td>
                      <td className="table-cell px-3 py-3 text-right">{formatCurrency(om.material?.preco_unitario || 0)}</td>
                      <td className="table-cell px-3 py-3 text-right">{om.quantidade_prevista.toLocaleString('pt-BR')}</td>
                      <td className="table-cell px-3 py-3 text-right">{om.quantidade_usada.toLocaleString('pt-BR')}</td>
                      <td className="px-3 py-3">
                        <div className="flex items-center gap-2 justify-end">
                          <div className="w-16 bg-slate-100 rounded-full h-1.5">
                            <div
                              className={`h-1.5 rounded-full ${percentUso > 100 ? 'bg-red-500' : 'bg-blue-500'}`}
                              style={{ width: `${Math.min(percentUso, 100)}%` }}
                            />
                          </div>
                          <span className={`text-xs font-semibold ${percentUso > 100 ? 'text-red-600' : 'text-slate-600'}`}>
                            {percentUso}%
                          </span>
                        </div>
                      </td>
                      <td className="table-cell px-5 py-3 text-right font-semibold">{formatCurrency(custoTotal)}</td>
                      <td className="px-3 py-3">
                        <button onClick={() => setObraMateriais(p => p.filter(x => x.id !== om.id))}
                          className="text-slate-400 hover:text-red-500 transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
              <tfoot>
                <tr className="border-t-2 border-slate-200 bg-slate-50">
                  <td colSpan={6} className="px-5 py-3 text-sm font-semibold text-slate-700">Total Materiais Utilizados</td>
                  <td className="px-5 py-3 text-right font-bold text-slate-900">{formatCurrency(totalCustoRealizado)}</td>
                  <td />
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
