'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Save } from 'lucide-react'

export default function NewObraPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    nome: '',
    descricao: '',
    status: 'planejamento',
    data_inicio: '',
    data_fim_prevista: '',
    orcamento_total: '',
    endereco: '',
  })

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    // In production: insert into Supabase
    // const { data } = await supabase.from('obras').insert({ ...form }).select().single()
    await new Promise(r => setTimeout(r, 800)) // Simulate async
    router.push('/obras')
  }

  return (
    <div className="max-w-2xl">
      <div className="flex items-center gap-3 mb-6">
        <Link href="/obras" className="btn-ghost">
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <h1 className="page-title">Nova Obra</h1>
          <p className="text-slate-500 text-sm">Cadastre uma nova obra no sistema</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="card p-6 space-y-5">
        <div>
          <label className="form-label">Nome da Obra *</label>
          <input name="nome" value={form.nome} onChange={handleChange}
            className="form-input" placeholder="Ex: Residencial Solar das Palmeiras" required />
        </div>

        <div>
          <label className="form-label">Descrição</label>
          <textarea name="descricao" value={form.descricao} onChange={handleChange}
            className="form-input resize-none" rows={3}
            placeholder="Descreva brevemente a obra..." />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="form-label">Status *</label>
            <select name="status" value={form.status} onChange={handleChange} className="form-select" required>
              <option value="planejamento">Planejamento</option>
              <option value="em_andamento">Em Andamento</option>
              <option value="concluida">Concluída</option>
              <option value="pausada">Pausada</option>
            </select>
          </div>
          <div>
            <label className="form-label">Orçamento Total (R$) *</label>
            <input name="orcamento_total" value={form.orcamento_total} onChange={handleChange}
              type="number" min="0" step="0.01" className="form-input"
              placeholder="0,00" required />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="form-label">Data de Início *</label>
            <input name="data_inicio" value={form.data_inicio} onChange={handleChange}
              type="date" className="form-input" required />
          </div>
          <div>
            <label className="form-label">Previsão de Término *</label>
            <input name="data_fim_prevista" value={form.data_fim_prevista} onChange={handleChange}
              type="date" className="form-input" required />
          </div>
        </div>

        <div>
          <label className="form-label">Endereço</label>
          <input name="endereco" value={form.endereco} onChange={handleChange}
            className="form-input" placeholder="Rua, Número - Cidade, Estado" />
        </div>

        <div className="flex gap-3 pt-2">
          <button type="submit" disabled={loading} className="btn-primary">
            <Save className="w-4 h-4" />
            {loading ? 'Salvando...' : 'Salvar Obra'}
          </button>
          <Link href="/obras" className="btn-secondary">Cancelar</Link>
        </div>
      </form>
    </div>
  )
}
