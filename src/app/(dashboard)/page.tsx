'use client'

import { Building2, TrendingUp, AlertTriangle, DollarSign, CheckCircle, Clock } from 'lucide-react'
import Link from 'next/link'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from 'recharts'
import { StatCard } from '@/components/ui/StatCard'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { mockObras, mockCustosMensais } from '@/lib/mock-data'
import { formatCurrency, isAtrasada } from '@/lib/utils'

const STATUS_COLORS: Record<string, string> = {
  planejamento: '#3b82f6',
  em_andamento: '#f59e0b',
  concluida: '#10b981',
  pausada: '#94a3b8',
}

export default function DashboardPage() {
  const totalObras = mockObras.length
  const obrasEmAndamento = mockObras.filter(o => o.status === 'em_andamento').length
  const obrasConcluidas = mockObras.filter(o => o.status === 'concluida').length
  const totalOrcamento = mockObras.reduce((sum, o) => sum + o.orcamento_total, 0)
  const totalGasto = mockObras.reduce((sum, o) => sum + o.custo_realizado, 0)
  const obrasAtrasadas = mockObras.filter(o => isAtrasada(o.data_fim_prevista, o.progresso)).length

  const pieData = [
    { name: 'Em Andamento', value: obrasEmAndamento, color: STATUS_COLORS.em_andamento },
    { name: 'Concluídas', value: obrasConcluidas, color: STATUS_COLORS.concluida },
    { name: 'Planejamento', value: mockObras.filter(o => o.status === 'planejamento').length, color: STATUS_COLORS.planejamento },
    { name: 'Pausadas', value: mockObras.filter(o => o.status === 'pausada').length, color: STATUS_COLORS.pausada },
  ].filter(d => d.value > 0)

  const percentGasto = Math.round((totalGasto / totalOrcamento) * 100)

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="page-title">Dashboard</h1>
        <p className="text-slate-500 text-sm mt-1">Visão geral do portfólio de obras</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <StatCard
          title="Total de Obras"
          value={totalObras}
          subtitle={`${obrasEmAndamento} em andamento`}
          icon={Building2}
          iconColor="text-blue-600"
          iconBg="bg-blue-50"
          className="xl:col-span-1"
        />
        <StatCard
          title="Em Andamento"
          value={obrasEmAndamento}
          subtitle="obras ativas"
          icon={Clock}
          iconColor="text-amber-600"
          iconBg="bg-amber-50"
          className="xl:col-span-1"
        />
        <StatCard
          title="Concluídas"
          value={obrasConcluidas}
          subtitle="obras finalizadas"
          icon={CheckCircle}
          iconColor="text-emerald-600"
          iconBg="bg-emerald-50"
          className="xl:col-span-1"
        />
        <StatCard
          title="Orçamento Total"
          value={formatCurrency(totalOrcamento)}
          subtitle="soma de todas obras"
          icon={DollarSign}
          iconColor="text-violet-600"
          iconBg="bg-violet-50"
          className="xl:col-span-1"
        />
        <StatCard
          title="Custo Realizado"
          value={formatCurrency(totalGasto)}
          subtitle={`${percentGasto}% do orçado`}
          icon={TrendingUp}
          iconColor="text-orange-600"
          iconBg="bg-orange-50"
          className="xl:col-span-1"
        />
        <StatCard
          title="Obras em Alerta"
          value={obrasAtrasadas}
          subtitle="com atraso potencial"
          icon={AlertTriangle}
          iconColor="text-red-600"
          iconBg="bg-red-50"
          className="xl:col-span-1"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Bar Chart */}
        <div className="card p-5 lg:col-span-2">
          <h2 className="section-title mb-1">Evolução de Custos (2024)</h2>
          <p className="text-xs text-slate-500 mb-4">Orçado vs Realizado por mês</p>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={mockCustosMensais} barGap={4}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="mes" tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false}
                tickFormatter={(v) => `R$${(v / 1000).toFixed(0)}k`} />
              <Tooltip
                formatter={(value: number) => [formatCurrency(value), '']}
                contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: 12 }}
              />
              <Bar dataKey="orcado" name="Orçado" fill="#dbeafe" radius={[4, 4, 0, 0]} />
              <Bar dataKey="realizado" name="Realizado" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
          <div className="flex gap-4 mt-2 justify-end">
            <div className="flex items-center gap-1.5 text-xs text-slate-500">
              <div className="w-3 h-3 rounded bg-blue-200" /> Orçado
            </div>
            <div className="flex items-center gap-1.5 text-xs text-slate-500">
              <div className="w-3 h-3 rounded bg-blue-500" /> Realizado
            </div>
          </div>
        </div>

        {/* Pie Chart */}
        <div className="card p-5">
          <h2 className="section-title mb-1">Status das Obras</h2>
          <p className="text-xs text-slate-500 mb-4">Distribuição por status</p>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" innerRadius={50} outerRadius={75}
                paddingAngle={3} dataKey="value">
                {pieData.map((entry, index) => (
                  <Cell key={index} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ borderRadius: '8px', fontSize: 12 }} />
              <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12 }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Obras */}
      <div className="card">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
          <h2 className="section-title">Obras Recentes</h2>
          <Link href="/obras" className="btn-ghost text-blue-600 text-xs">
            Ver todas
          </Link>
        </div>
        <div className="divide-y divide-slate-100">
          {mockObras.map((obra) => (
            <Link
              key={obra.id}
              href={`/obras/${obra.id}`}
              className="flex items-center gap-4 px-5 py-4 hover:bg-slate-50 transition-colors"
            >
              <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Building2 className="w-5 h-5 text-slate-500" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-slate-900 truncate">{obra.nome}</p>
                <p className="text-xs text-slate-500 truncate">{obra.endereco}</p>
              </div>
              <div className="hidden md:flex flex-col items-end gap-1 w-32">
                <StatusBadge status={obra.status} />
              </div>
              <div className="hidden lg:block w-40">
                <ProgressBar value={obra.progresso} showLabel size="sm" />
              </div>
              <div className="hidden xl:block w-32 text-right">
                <p className="text-xs text-slate-500">Realizado</p>
                <p className="text-sm font-semibold text-slate-900">{formatCurrency(obra.custo_realizado)}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Alerts */}
      {mockObras.some(o => isAtrasada(o.data_fim_prevista, o.progresso) || o.custo_realizado > o.orcamento_total) && (
        <div className="card border-orange-200 bg-orange-50">
          <div className="px-5 py-4 border-b border-orange-200">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-orange-600" />
              <h2 className="section-title text-orange-900">Alertas</h2>
            </div>
          </div>
          <div className="p-5 space-y-3">
            {mockObras.map(obra => {
              const alerts = []
              if (isAtrasada(obra.data_fim_prevista, obra.progresso)) {
                alerts.push({ msg: `Obra em atraso — prazo previsto: ${new Date(obra.data_fim_prevista).toLocaleDateString('pt-BR')}`, type: 'atraso' })
              }
              if (obra.custo_realizado > obra.orcamento_total) {
                alerts.push({ msg: `Orçamento estourado — ${formatCurrency(obra.custo_realizado - obra.orcamento_total)} acima do previsto`, type: 'orcamento' })
              }
              return alerts.map((alert, i) => (
                <Link key={`${obra.id}-${i}`} href={`/obras/${obra.id}`}
                  className="flex items-start gap-3 p-3 bg-white rounded-lg border border-orange-200 hover:border-orange-400 transition-colors">
                  <AlertTriangle className="w-4 h-4 text-orange-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{obra.nome}</p>
                    <p className="text-xs text-slate-600">{alert.msg}</p>
                  </div>
                </Link>
              ))
            })}
          </div>
        </div>
      )}
    </div>
  )
}
