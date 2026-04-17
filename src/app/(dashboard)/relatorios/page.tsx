'use client'

import { useState } from 'react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell, Legend,
} from 'recharts'
import { Download, FileText, TrendingUp, Building2, DollarSign, CheckCircle } from 'lucide-react'
import { mockObras, mockDespesas } from '@/lib/mock-data'
import { formatCurrency, formatDate, getStatusLabel } from '@/lib/utils'

const CATEGORIA_COLORS: Record<string, string> = {
  materiais: '#3b82f6',
  mao_de_obra: '#f59e0b',
  equipamentos: '#8b5cf6',
  servicos: '#10b981',
  administrativo: '#64748b',
  outros: '#94a3b8',
}

export default function RelatoriosPage() {
  const [activeTab, setActiveTab] = useState<'financeiro' | 'progresso' | 'geral'>('financeiro')

  // Aggregate all despesas
  const todasDespesas = Object.values(mockDespesas).flat()

  // Financial totals across all obras
  const totalOrcamento = mockObras.reduce((s, o) => s + o.orcamento_total, 0)
  const totalGasto = mockObras.reduce((s, o) => s + o.custo_realizado, 0)
  const totalSaldo = totalOrcamento - totalGasto

  // Category breakdown across all obras
  const porCategoria = Object.entries(
    todasDespesas.reduce((acc, d) => {
      acc[d.categoria] = (acc[d.categoria] || 0) + d.valor
      return acc
    }, {} as Record<string, number>)
  ).map(([cat, val]) => ({ name: getStatusLabel(cat), value: val, color: CATEGORIA_COLORS[cat] || '#94a3b8' }))
    .sort((a, b) => b.value - a.value)

  // Per-obra comparison
  const obraComparison = mockObras.map(o => ({
    name: o.nome.length > 20 ? o.nome.substring(0, 18) + '...' : o.nome,
    nomeCompleto: o.nome,
    orcado: o.orcamento_total,
    realizado: o.custo_realizado,
    progresso: o.progresso,
  }))

  // Progress data
  const progressoData = mockObras.map(o => ({
    name: o.nome.length > 18 ? o.nome.substring(0, 16) + '...' : o.nome,
    progresso: o.progresso,
    status: getStatusLabel(o.status),
  }))

  function exportJSON() {
    const data = {
      exportadoEm: new Date().toISOString(),
      resumo: {
        totalObras: mockObras.length,
        totalOrcamento,
        totalGasto,
        totalSaldo,
      },
      obras: mockObras,
      despesas: Object.entries(mockDespesas).map(([obraId, despesas]) => ({
        obraId,
        despesas,
      })),
    }
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `relatorio-obras-${new Date().toISOString().split('T')[0]}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  function exportCSV() {
    const headers = ['Obra', 'Status', 'Or\u00e7amento', 'Custo Realizado', 'Saldo', 'Progresso', 'Inicio', 'Previs\u00e3o T\u00e9rmino']
    const rows = mockObras.map(o => [
      `"${o.nome}"`,
      getStatusLabel(o.status),
      o.orcamento_total,
      o.custo_realizado,
      o.orcamento_total - o.custo_realizado,
      `${o.progresso}%`,
      formatDate(o.data_inicio),
      formatDate(o.data_fim_prevista),
    ])
    const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n')
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `relatorio-obras-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  const tabs = [
    { id: 'financeiro' as const, label: 'Financeiro' },
    { id: 'progresso' as const, label: 'Progresso' },
    { id: 'geral' as const, label: 'Geral' },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="page-title">Relatórios</h1>
          <p className="text-slate-500 text-sm mt-1">Visão consolidada de todas as obras</p>
        </div>
        <div className="flex gap-2">
          <button onClick={exportCSV} className="btn-secondary">
            <Download className="w-4 h-4" />
            CSV
          </button>
          <button onClick={exportJSON} className="btn-secondary">
            <FileText className="w-4 h-4" />
            JSON
          </button>
        </div>
      </div>

      {/* Summary KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
              <Building2 className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-xs text-slate-500">Total de Obras</p>
              <p className="text-2xl font-bold text-slate-900">{mockObras.length}</p>
            </div>
          </div>
        </div>
        <div className="card p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-violet-50 rounded-xl flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-violet-600" />
            </div>
            <div>
              <p className="text-xs text-slate-500">Orçamento Total</p>
              <p className="text-xl font-bold text-slate-900">{formatCurrency(totalOrcamento)}</p>
            </div>
          </div>
        </div>
        <div className="card p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <p className="text-xs text-slate-500">Total Gasto</p>
              <p className="text-xl font-bold text-slate-900">{formatCurrency(totalGasto)}</p>
            </div>
          </div>
        </div>
        <div className="card p-5">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${totalSaldo >= 0 ? 'bg-emerald-50' : 'bg-red-50'}`}>
              <CheckCircle className={`w-5 h-5 ${totalSaldo >= 0 ? 'text-emerald-600' : 'text-red-600'}`} />
            </div>
            <div>
              <p className="text-xs text-slate-500">Saldo Total</p>
              <p className={`text-xl font-bold ${totalSaldo >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                {formatCurrency(totalSaldo)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-0 bg-white border border-slate-200 rounded-xl p-1 w-fit">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-5 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === tab.id
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 'financeiro' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="card p-5">
              <h3 className="section-title mb-4">Orçado vs Realizado por Obra</h3>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={obraComparison} layout="vertical" barGap={4}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                  <XAxis type="number" tick={{ fontSize: 10 }} axisLine={false} tickLine={false}
                    tickFormatter={v => `R$${(v / 1000).toFixed(0)}k`} />
                  <YAxis type="category" dataKey="name" tick={{ fontSize: 10 }} width={100}
                    axisLine={false} tickLine={false} />
                  <Tooltip formatter={(v: number) => formatCurrency(v)}
                    contentStyle={{ borderRadius: '8px', fontSize: 12 }} />
                  <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 11 }} />
                  <Bar dataKey="orcado" name="Orçado" fill="#dbeafe" radius={[0, 4, 4, 0]} />
                  <Bar dataKey="realizado" name="Realizado" fill="#3b82f6" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="card p-5">
              <h3 className="section-title mb-4">Despesas por Categoria</h3>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie data={porCategoria} cx="50%" cy="50%"
                    innerRadius={55} outerRadius={90} paddingAngle={3} dataKey="value">
                    {porCategoria.map((entry, idx) => <Cell key={idx} fill={entry.color} />)}
                  </Pie>
                  <Tooltip formatter={(v: number) => formatCurrency(v)}
                    contentStyle={{ borderRadius: '8px', fontSize: 12 }} />
                  <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 11 }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Category Table */}
          <div className="card">
            <div className="px-5 py-4 border-b border-slate-100">
              <h3 className="section-title">Detalhamento por Categoria</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-100">
                    <th className="table-header text-left px-5 py-3">Categoria</th>
                    <th className="table-header text-right px-5 py-3">Total</th>
                    <th className="table-header text-right px-5 py-3">% do Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {porCategoria.map(cat => (
                    <tr key={cat.name} className="hover:bg-slate-50">
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: cat.color }} />
                          <span className="text-sm font-medium text-slate-900">{cat.name}</span>
                        </div>
                      </td>
                      <td className="table-cell px-5 py-3 text-right font-semibold">{formatCurrency(cat.value)}</td>
                      <td className="table-cell px-5 py-3 text-right">
                        {totalGasto > 0 ? Math.round((cat.value / totalGasto) * 100) : 0}%
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="border-t-2 border-slate-200 bg-slate-50">
                    <td className="px-5 py-3 text-sm font-bold text-slate-900">Total Geral</td>
                    <td className="px-5 py-3 text-right font-bold text-slate-900">{formatCurrency(todasDespesas.reduce((s, d) => s + d.valor, 0))}</td>
                    <td className="px-5 py-3 text-right font-bold text-slate-900">100%</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'progresso' && (
        <div className="space-y-6">
          <div className="card p-5">
            <h3 className="section-title mb-4">Progresso por Obra</h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={progressoData} barSize={40}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11 }} axisLine={false} tickLine={false}
                  domain={[0, 100]} tickFormatter={v => `${v}%`} />
                <Tooltip formatter={(v: number) => [`${v}%`, 'Progresso']}
                  contentStyle={{ borderRadius: '8px', fontSize: 12 }} />
                <Bar dataKey="progresso" fill="#3b82f6" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="card">
            <div className="px-5 py-4 border-b border-slate-100">
              <h3 className="section-title">Detalhamento de Progresso</h3>
            </div>
            <div className="divide-y divide-slate-100">
              {mockObras.map(obra => {
                const pct = obra.orcamento_total > 0
                  ? Math.round((obra.custo_realizado / obra.orcamento_total) * 100)
                  : 0
                return (
                  <div key={obra.id} className="px-5 py-4">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <p className="font-semibold text-slate-900 text-sm">{obra.nome}</p>
                        <p className="text-xs text-slate-500">{getStatusLabel(obra.status)} • Prazo: {formatDate(obra.data_fim_prevista)}</p>
                      </div>
                      <span className="text-xl font-bold text-blue-600">{obra.progresso}%</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2">
                      <div
                        className="bg-blue-500 h-2 rounded-full transition-all"
                        style={{ width: `${obra.progresso}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-xs text-slate-500 mt-1">
                      <span>Orçamento utilizado: {pct}%</span>
                      <span>{formatCurrency(obra.custo_realizado)} / {formatCurrency(obra.orcamento_total)}</span>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'geral' && (
        <div className="card">
          <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
            <h3 className="section-title">Resumo Geral de Obras</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-100">
                  <th className="table-header text-left px-5 py-3">Obra</th>
                  <th className="table-header text-left px-3 py-3">Status</th>
                  <th className="table-header text-right px-3 py-3">Orçamento</th>
                  <th className="table-header text-right px-3 py-3">Realizado</th>
                  <th className="table-header text-right px-3 py-3">Saldo</th>
                  <th className="table-header text-right px-3 py-3">Progresso</th>
                  <th className="table-header text-right px-5 py-3">Previsão</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {mockObras.map(obra => {
                  const saldo = obra.orcamento_total - obra.custo_realizado
                  return (
                    <tr key={obra.id} className="hover:bg-slate-50">
                      <td className="px-5 py-4">
                        <p className="text-sm font-semibold text-slate-900">{obra.nome}</p>
                        {obra.endereco && <p className="text-xs text-slate-500 mt-0.5">{obra.endereco}</p>}
                      </td>
                      <td className="px-3 py-4">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold border ${
                          obra.status === 'concluida' ? 'bg-emerald-100 text-emerald-800 border-emerald-200' :
                          obra.status === 'em_andamento' ? 'bg-amber-100 text-amber-800 border-amber-200' :
                          obra.status === 'planejamento' ? 'bg-blue-100 text-blue-800 border-blue-200' :
                          'bg-slate-100 text-slate-700 border-slate-200'
                        }`}>
                          {getStatusLabel(obra.status)}
                        </span>
                      </td>
                      <td className="table-cell px-3 py-4 text-right">{formatCurrency(obra.orcamento_total)}</td>
                      <td className="table-cell px-3 py-4 text-right">{formatCurrency(obra.custo_realizado)}</td>
                      <td className={`px-3 py-4 text-right text-sm font-semibold ${saldo < 0 ? 'text-red-600' : 'text-emerald-600'}`}>
                        {formatCurrency(saldo)}
                      </td>
                      <td className="px-3 py-4 text-right">
                        <span className="text-sm font-bold text-blue-600">{obra.progresso}%</span>
                      </td>
                      <td className="table-cell px-5 py-4 text-right whitespace-nowrap">{formatDate(obra.data_fim_prevista)}</td>
                    </tr>
                  )
                })}
              </tbody>
              <tfoot>
                <tr className="border-t-2 border-slate-200 bg-slate-50">
                  <td colSpan={2} className="px-5 py-3 text-sm font-bold text-slate-900">Totais</td>
                  <td className="px-3 py-3 text-right font-bold text-slate-900">{formatCurrency(totalOrcamento)}</td>
                  <td className="px-3 py-3 text-right font-bold text-slate-900">{formatCurrency(totalGasto)}</td>
                  <td className={`px-3 py-3 text-right font-bold ${totalSaldo < 0 ? 'text-red-600' : 'text-emerald-600'}`}>
                    {formatCurrency(totalSaldo)}
                  </td>
                  <td colSpan={2} />
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
