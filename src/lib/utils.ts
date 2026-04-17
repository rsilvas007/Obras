import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { format, parseISO, differenceInDays, isPast } from 'date-fns'
import { ptBR } from 'date-fns/locale'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value)
}

export function formatDate(date: string): string {
  try {
    return format(parseISO(date), 'dd/MM/yyyy', { locale: ptBR })
  } catch {
    return date
  }
}

export function formatDateTime(date: string): string {
  try {
    return format(parseISO(date), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })
  } catch {
    return date
  }
}

export function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    planejamento: 'bg-blue-100 text-blue-800 border-blue-200',
    em_andamento: 'bg-amber-100 text-amber-800 border-amber-200',
    concluida: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    pausada: 'bg-slate-100 text-slate-700 border-slate-200',
    pendente: 'bg-slate-100 text-slate-700 border-slate-200',
    atrasada: 'bg-red-100 text-red-800 border-red-200',
  }
  return colors[status] || 'bg-slate-100 text-slate-700 border-slate-200'
}

export function getStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    planejamento: 'Planejamento',
    em_andamento: 'Em Andamento',
    concluida: 'Concluída',
    pausada: 'Pausada',
    pendente: 'Pendente',
    atrasada: 'Atrasada',
    materiais: 'Materiais',
    mao_de_obra: 'Mão de Obra',
    equipamentos: 'Equipamentos',
    servicos: 'Serviços',
    administrativo: 'Administrativo',
    outros: 'Outros',
    engenheiro: 'Engenheiro',
    arquiteto: 'Arquiteto',
    mestre_de_obra: 'Mestre de Obra',
    pedreiro: 'Pedreiro',
    eletricista: 'Eletricista',
    encanador: 'Encanador',
    pintor: 'Pintor',
    carpinteiro: 'Carpinteiro',
    servente: 'Servente',
  }
  return labels[status] || status
}

export function calcularProgresso(realizado: number, total: number): number {
  if (total === 0) return 0
  return Math.min(Math.round((realizado / total) * 100), 100)
}

export function diasRestantes(dataFim: string): number {
  try {
    return differenceInDays(parseISO(dataFim), new Date())
  } catch {
    return 0
  }
}

export function isAtrasada(dataFim: string, progresso: number): boolean {
  try {
    return isPast(parseISO(dataFim)) && progresso < 100
  } catch {
    return false
  }
}
