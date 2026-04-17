'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    // Demo mode: accept any credentials
    if (process.env.NEXT_PUBLIC_SUPABASE_URL === 'https://your-project.supabase.co' ||
      !process.env.NEXT_PUBLIC_SUPABASE_URL) {
      router.push('/')
      return
    }

    try {
      const { createClient } = await import('@/lib/supabase/client')
      const supabase = createClient()
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) {
        setError(error.message === 'Invalid login credentials'
          ? 'Email ou senha inválidos'
          : error.message)
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
      <h2 className="text-2xl font-bold text-slate-900 mb-1">Entrar</h2>
      <p className="text-slate-500 text-sm mb-6">Acesse sua conta para continuar</p>

      <form onSubmit={handleLogin} className="space-y-4">
        <div>
          <label className="form-label">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="form-input"
            placeholder="seu@email.com"
            required
          />
        </div>
        <div>
          <label className="form-label">Senha</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="form-input"
            placeholder="••••••••"
            required
          />
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg p-3">
            {error}
          </div>
        )}

        <button type="submit" disabled={loading} className="btn-primary w-full justify-center py-2.5 text-base">
          {loading ? 'Entrando...' : 'Entrar'}
        </button>
      </form>

      <div className="mt-5 p-4 bg-blue-50 border border-blue-100 rounded-xl">
        <div className="flex items-center gap-2 mb-2">
          <span className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          </span>
          <p className="text-xs font-semibold text-blue-800">Modo Demo</p>
        </div>
        <p className="text-xs text-blue-700">Em modo demo, qualquer email/senha acessa o sistema com dados de exemplo.</p>
        <button
          type="button"
          onClick={() => { setEmail('admin@obras.com'); setPassword('demo1234') }}
          className="mt-2 text-xs text-blue-700 font-medium underline underline-offset-2"
        >
          Preencher automaticamente
        </button>
      </div>

      <p className="text-center text-sm text-slate-500 mt-6">
        Não tem conta?{' '}
        <Link href="/register" className="text-blue-600 font-medium hover:underline">
          Cadastre-se
        </Link>
      </p>
    </>
  )
}
