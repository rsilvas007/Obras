'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function RegisterPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    if (process.env.NEXT_PUBLIC_SUPABASE_URL === 'https://your-project.supabase.co' ||
      !process.env.NEXT_PUBLIC_SUPABASE_URL) {
      router.push('/')
      return
    }

    try {
      const { createClient } = await import('@/lib/supabase/client')
      const supabase = createClient()
      const { error } = await supabase.auth.signUp({
        email, password,
        options: { data: { full_name: name, role: 'user' } },
      })
      if (error) {
        setError(error.message)
        setLoading(false)
      } else {
        router.push('/')
        router.refresh()
      }
    } catch {
      router.push('/')
    }
  }

  return (
    <>
      <h2 className="text-2xl font-bold text-slate-900 mb-1">Criar conta</h2>
      <p className="text-slate-500 text-sm mb-6">Registre-se para acessar o sistema</p>

      <form onSubmit={handleRegister} className="space-y-4">
        <div>
          <label className="form-label">Nome completo</label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)}
            className="form-input" placeholder="Seu nome" required />
        </div>
        <div>
          <label className="form-label">Email</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
            className="form-input" placeholder="seu@email.com" required />
        </div>
        <div>
          <label className="form-label">Senha</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}
            className="form-input" placeholder="Mínimo 6 caracteres" minLength={6} required />
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg p-3">{error}</div>
        )}

        <button type="submit" disabled={loading} className="btn-primary w-full justify-center py-2.5 text-base">
          {loading ? 'Criando conta...' : 'Criar conta'}
        </button>
      </form>

      <p className="text-center text-sm text-slate-500 mt-6">
        Já tem conta?{' '}
        <Link href="/login" className="text-blue-600 font-medium hover:underline">Entrar</Link>
      </p>
    </>
  )
}
