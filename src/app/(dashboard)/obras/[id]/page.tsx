'use client'

import Link from 'next/link'
import {
  Building2, MapPin, Calendar, DollarSign, Users,
  ClipboardList, BookOpen, TrendingUp, ArrowLeft, Edit, AlertTriangle,
} from 'lucide-react'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { StatCard } from '@/components/ui/StatCard'
import { mockObras, mockEtapas, mockObraFuncionarios, mockDespesas } from '@/lib/mock-data'
import { formatCurrency, formatDate, diasRestantes, isAtrasada } from '@/lib/utils'

export default function ObraDetailPage({ params }: { params: { id: string } }) {
  const obra = mockObras.find(o => o.id === params.id) || mockObras[0]
  const etapas = mockEtapas[obra.id] || []
  const equipe = mockObraFuncionarios[obra.id] || []
  const despesas = mockDespesas[obra.id] || []
  const totalDespesas = despesas.reduce((sum, d) => sum + d.valor, 0)
  const dias = diasRestantes(obra.data_fim_prevista)
  const atrasada = isAtrasada(obra.data_fim_prevista, obra.progresso)
  const percentGasto = obra.orcamento_total > 0
    ? Math.round((obra.custo_realizado / obra.orcamento_total) * 100)
    : 0

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <Link href="/obras" className="btn-ghost mt-1">
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="page-title">{obra.nome}</h1>
              <StatusBadge status={atrasada ? 'atrasada' : obra.status} />
            </div>
            {obra.endereco && (
              <div className="flex items-center gap-1.5 text-sm text-slate-500 mt-1">
                <MapPin className="w-4 h-4" />
                <span>{obra.endereco}</span>
              </div>
            )}
          </div>
        </div>
        <button className="btn-secondary flex-shrink-0">
          <Edit className="w-4 h-4" />
          <span className="hidden sm:inline">Editar</span>
        </button>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Progresso Geral"
          value={`${obra.progresso}%`}
          subtitle="da obra concluído"
          icon={TrendingUp}
          iconColor="text-blue-600" iconBg="bg-blue-50"
        />
        <StatCard
          title="Orçamento"
          value={formatCurrency(obra.orcamento_total)}
          subtitle={`${formatCurrency(obra.custo_realizado)} gastos`}
          icon={DollarSign}
          iconColor={percentGasto > 100 ? 'text-red-600' : 'text-emerald-600'}
          iconBg={percentGasto > 100 ? 'bg-red-50' : 'bg-emerald-50'}
        />
        <StatCard
          title="Equipe"
          value={equipe.length}
          subtitle="membros na obra"
          icon={Users}
          iconColor="text-violet-600" iconBg="bg-violet-50"
        />
        <StatCard
          title={dias >= 0 ? 'Dias Restantes' : 'Dias de Atraso'}
          value={Math.abs(dias)}
          subtitle={dias >= 0 ? `término: ${formatDate(obra.data_fim_prevista)}` : 'prazo ultrapassado'}
          icon={Calendar}
          iconColor={atrasada ? 'text-red-600' : 'text-amber-600'}
          iconBg={atrasada ? 'bg-red-50' : 'bg-amber-50'}
        />
      </div>

      {/* Progress Bar */}
      <div className="card p-5">
        <div className="flex items-center justify-between mb-3">
          <h2 className="section-title">Progresso Geral</h2>
          <span className="text-2xl font-bold text-blue-600">{obra.progresso}%</span>
        </div>
        <ProgressBar value={obra.progresso} size="lg" showLabel={false} />
        <div className="flex justify-between text-xs text-slate-500 mt-2">
          <span>Início: {formatDate(obra.data_inicio)}</span>
          <span>Previsão: {formatDate(obra.data_fim_prevista)}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Budget Breakdown */}
        <div className="card p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="section-title">Financeiro</h2>
            <Link href={`/obras/${obra.id}/custos`} className="text-xs text-blue-600 hover:underline">Ver detalhes</Link>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center py-2 border-b border-slate-100">
              <span className="text-sm text-slate-600">Orçamento Total</span>
              <span className="font-semibold text-slate-900">{formatCurrency(obra.orcamento_total)}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-slate-100">
              <span className="text-sm text-slate-600">Custo Realizado</span>
              <span className={`font-semibold ${percentGasto > 100 ? 'text-red-600' : 'text-slate-900'}`}>
                {formatCurrency(obra.custo_realizado)}
              </span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-slate-100">
              <span className="text-sm text-slate-600">Saldo Disponível</span>
              <span className={`font-semibold ${obra.orcamento_total - obra.custo_realizado < 0 ? 'text-red-600' : 'text-emerald-600'}`}>
                {formatCurrency(obra.orcamento_total - obra.custo_realizado)}
              </span>
            </div>
            <div className="pt-1">
              <div className="flex justify-between text-xs text-slate-500 mb-1.5">
                <span>Utilização do orçamento</span>
                <span className="font-semibold">{percentGasto}%</span>
              </div>
              <ProgressBar value={percentGasto}
                color={percentGasto > 100 ? 'red' : percentGasto > 80 ? 'amber' : 'green'}
                size="md"
              />
            </div>
          </div>
        </div>

        {/* Etapas Summary */}
        <div className="card p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="section-title">Cronograma</h2>
            <Link href={`/obras/${obra.id}/cronograma`} className="text-xs text-blue-600 hover:underline">Ver detalhes</Link>
          </div>
          {etapas.length === 0 ? (
            <p className="text-sm text-slate-500 text-center py-4">Nenhuma etapa cadastrada</p>
          ) : (
            <div className="space-y-2">
              {etapas.slice(0, 5).map(etapa => (
                <div key={etapa.id} className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full flex-shrink-0 ${
                    etapa.status === 'concluida' ? 'bg-emerald-500' :
                    etapa.status === 'em_andamento' ? 'bg-amber-500' :
                    etapa.status === 'atrasada' ? 'bg-red-500' : 'bg-slate-300'
                  }`} />
                  <span className="text-sm text-slate-700 flex-1 truncate">{etapa.nome}</span>
                  <span className="text-xs font-semibold text-slate-500">{etapa.progresso}%</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {[
          { href: 'cronograma', icon: Calendar, label: 'Cronograma', count: `${etapas.length} etapas`, color: 'text-blue-600 bg-blue-50' },
          { href: 'custos', icon: DollarSign, label: 'Custos', count: formatCurrency(totalDespesas), color: 'text-emerald-600 bg-emerald-50' },
          { href: 'materiais', icon: ClipboardList, label: 'Materiais', count: 'estoque', color: 'text-orange-600 bg-orange-50' },
          { href: 'equipe', icon: Users, label: 'Equipe', count: `${equipe.length} pessoas`, color: 'text-violet-600 bg-violet-50' },
          { href: 'diario', icon: BookOpen, label: 'Diário', count: 'registros', color: 'text-rose-600 bg-rose-50' },
        ].map(item => (
          <Link
            key={item.href}
            href={`/obras/${obra.id}/${item.href}`}
            className="card p-4 hover:shadow-md hover:border-blue-200 transition-all text-center group"
          >
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center mx-auto mb-2 ${item.color}`}>
              <item.icon className="w-5 h-5" />
            </div>
            <p className="text-sm font-semibold text-slate-900">{item.label}</p>
            <p className="text-xs text-slate-500 mt-0.5">{item.count}</p>
          </Link>
        ))}
      </div>

      {atrasada && (
        <div className="card border-red-200 bg-red-50 p-4 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-red-800">Obra em atraso</p>
            <p className="text-sm text-red-700">
              O prazo previsto era {formatDate(obra.data_fim_prevista)} e o progresso está em {obra.progresso}%.
              Revise o cronograma e o plano de recuperação.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
