'use client'

import { useState } from 'react'
import { Plus, TrendingUp, TrendingDown, DollarSign, Trash2 } from 'lucide-react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from 'recharts'
import { mockDespesas, mockObras } from '@/lib/mock-data'
import { formatCurrency, formatDate, getStatusLabel } from '@/lib/utils'
import type { Despesa, CategoriasCusto } from '@/types'

const CATEGORIA_COLORS: Record<string, string> = {
  materiais: '#3b82f6',
  mao_de_obra: '#f59e0b',
  equipamentos: '#8b5cf6',
  servicos: '#10b981',
  administrativo: '#64748b',
  outros: '#94a3b8',
}

export default function CustosPage({ params }: { params: { id: string } }) {
  const obra = mockObras.find(o => o.id === params.id) || mockObras[0]
  const [despesas, setDespesas] = useState<Despesa[]>(mockDespesas[params.id] || [])
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({
    descricao: '', categoria: 'materiais' as CategoriasCusto,
    valor: '', data: '', fornecedor: ''
  })

  const totalGasto = despesas.reduce((sum, d) => sum + d.valor, 0)
  const saldo = obra.orcamento_total - totalGasto
  const percentGasto = obra.orcamento_total > 0 ? Math.round((totalGasto / obra.orcamento_total) * 100) : 0

  // Category breakdown
  const porCategoria = Object.entries(
    despesas.reduce((acc, d) => {
      acc[d.categoria] = (acc[d.categoria] || 0) + d.valor
      return acc
    }, {} as Record<string, number>)
  ).map(([cat, val]) => ({ name: getStatusLabel(cat), value: val, color: CATEGORIA_COLORS[cat] || '#94a3b8' }))

  function handleAddDespesa(e: React.FormEvent) {
    e.preventDefault()
    const nova: Despesa = {
      id: `d${Date.now()}`,
      obra_id: params.id,
      descricao: form.descricao,
      categoria: form.categoria,
      valor: parseFloat(form.valor),
      data: form.data,
      fornecedor: form.fornecedor || undefined,
      created_by: 'demo',
      created_at: new Date().toISOString(),
    }
    setDespesas(prev => [nova, ...prev])
    setForm({ descricao: '', categoria: 'materiais', valor: '', data: '', fornecedor: '' })
    setShowForm(false)
  }

  function handleDelete(id: string) {
    setDespesas(prev => prev.filter(d => d.id !== id))
  }

  const orcamentoVsRealizado = [
    { label: 'Orçado', valor: obra.orcamento_total },
    { label: 'Realizado', valor: totalGasto },
    { label: 'Saldo', valor: Math.max(saldo, 0) },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="page-title">Controle de Custos</h2>
          <p className="text-slate-500 text-sm mt-1">{despesas.length} despesas registradas</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary">
          <Plus className="w-4 h-4" /> Nova Despesa
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="card p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-xs text-slate-500">Orçamento Total</p>
              <p className="text-lg font-bold text-slate-900">{formatCurrency(obra.orcamento_total)}</p>
            </div>
          </div>
        </div>
        <div className="card p-5">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${percentGasto > 100 ? 'bg-red-50' : 'bg-amber-50'}`}>
              <TrendingUp className={`w-5 h-5 ${percentGasto > 100 ? 'text-red-600' : 'text-amber-600'}`} />
            </div>
            <div>
              <p className="text-xs text-slate-500">Custo Realizado</p>
              <p className={`text-lg font-bold ${percentGasto > 100 ? 'text-red-600' : 'text-slate-900'}`}>
                {formatCurrency(totalGasto)}
              </p>
              <p className="text-xs text-slate-400">{percentGasto}% do orçado</p>
            </div>
          </div>
        </div>
        <div className="card p-5">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${saldo < 0 ? 'bg-red-50' : 'bg-emerald-50'}`}>
              <TrendingDown className={`w-5 h-5 ${saldo < 0 ? 'text-red-600' : 'text-emerald-600'}`} />
            </div>
            <div>
              <p className="text-xs text-slate-500">Saldo Disponível</p>
              <p className={`text-lg font-bold ${saldo < 0 ? 'text-red-600' : 'text-emerald-600'}`}>
                {formatCurrency(saldo)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card p-5">
          <h3 className="section-title mb-4">Orçado vs Realizado</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={orcamentoVsRealizado}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="label" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11 }} axisLine={false} tickLine={false}
                tickFormatter={v => `R$${(v / 1000).toFixed(0)}k`} />
              <Tooltip formatter={(v: number) => formatCurrency(v)}
                contentStyle={{ borderRadius: '8px', fontSize: 12 }} />
              <Bar dataKey="valor" fill="#3b82f6" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="card p-5">
          <h3 className="section-title mb-4">Por Categoria</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={porCategoria} cx="50%" cy="50%" outerRadius={70}
                paddingAngle={2} dataKey="value">
                {porCategoria.map((entry, idx) => <Cell key={idx} fill={entry.color} />)}
              </Pie>
              <Tooltip formatter={(v: number) => formatCurrency(v)}
                contentStyle={{ borderRadius: '8px', fontSize: 12 }} />
              <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 11 }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Add Form */}
      {showForm && (
        <div className="card p-5 border-blue-200 bg-blue-50">
          <h3 className="section-title mb-4">Registrar Despesa</h3>
          <form onSubmit={handleAddDespesa} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="form-label">Descrição *</label>
                <input value={form.descricao} onChange={e => setForm(p => ({ ...p, descricao: e.target.value }))}
                  className="form-input" placeholder="Descrição da despesa" required />
              </div>
              <div>
                <label className="form-label">Categoria *</label>
                <select value={form.categoria}
                  onChange={e => setForm(p => ({ ...p, categoria: e.target.value as CategoriasCusto }))}
                  className="form-select" required>
                  <option value="materiais">Materiais</option>
                  <option value="mao_de_obra">Mão de Obra</option>
                  <option value="equipamentos">Equipamentos</option>
                  <option value="servicos">Serviços</option>
                  <option value="administrativo">Administrativo</option>
                  <option value="outros">Outros</option>
                </select>
              </div>
              <div>
                <label className="form-label">Valor (R$) *</label>
                <input type="number" min="0" step="0.01" value={form.valor}
                  onChange={e => setForm(p => ({ ...p, valor: e.target.value }))}
                  className="form-input" placeholder="0,00" required />
              </div>
              <div>
                <label className="form-label">Data *</label>
                <input type="date" value={form.data}
                  onChange={e => setForm(p => ({ ...p, data: e.target.value }))}
                  className="form-input" required />
              </div>
              <div>
                <label className="form-label">Fornecedor</label>
                <input value={form.fornecedor}
                  onChange={e => setForm(p => ({ ...p, fornecedor: e.target.value }))}
                  className="form-input" placeholder="Nome do fornecedor" />
              </div>
            </div>
            <div className="flex gap-3">
              <button type="submit" className="btn-primary">Salvar Despesa</button>
              <button type="button" onClick={() => setShowForm(false)} className="btn-secondary">Cancelar</button>
            </div>
          </form>
        </div>
      )}

      {/* Table */}
      <div className="card">
        <div className="px-5 py-4 border-b border-slate-100">
          <h3 className="section-title">Histórico de Despesas</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-100">
                <th className="table-header text-left px-5 py-3">Data</th>
                <th className="table-header text-left px-3 py-3">Descrição</th>
                <th className="table-header text-left px-3 py-3">Categoria</th>
                <th className="table-header text-left px-3 py-3">Fornecedor</th>
                <th className="table-header text-right px-5 py-3">Valor</th>
                <th className="px-3 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {despesas.map(d => (
                <tr key={d.id} className="hover:bg-slate-50">
                  <td className="table-cell px-5 py-3 whitespace-nowrap">{formatDate(d.data)}</td>
                  <td className="table-cell px-3 py-3 max-w-xs">
                    <span className="line-clamp-2">{d.descricao}</span>
                  </td>
                  <td className="px-3 py-3">
                    <span className="inline-flex items-center gap-1.5 text-xs">
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: CATEGORIA_COLORS[d.categoria] }} />
                      {getStatusLabel(d.categoria)}
                    </span>
                  </td>
                  <td className="table-cell px-3 py-3 text-slate-500">{d.fornecedor || '—'}</td>
                  <td className="table-cell px-5 py-3 text-right font-semibold text-slate-900 whitespace-nowrap">
                    {formatCurrency(d.valor)}
                  </td>
                  <td className="px-3 py-3">
                    <button onClick={() => handleDelete(d.id)}
                      className="text-slate-400 hover:text-red-500 transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="border-t-2 border-slate-200 bg-slate-50">
                <td colSpan={4} className="px-5 py-3 text-sm font-semibold text-slate-700">Total</td>
                <td className="px-5 py-3 text-right font-bold text-slate-900">{formatCurrency(totalGasto)}</td>
                <td />
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  )
}
