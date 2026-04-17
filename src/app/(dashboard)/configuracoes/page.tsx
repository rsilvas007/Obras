'use client'

export default function ConfiguracoesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="page-title">Configurações</h1>
        <p className="text-slate-500 text-sm mt-1">Gerencie as preferências do sistema</p>
      </div>

      <div className="card p-6">
        <h2 className="section-title mb-4">Integração com Supabase</h2>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
          <p className="text-sm font-semibold text-blue-800 mb-1">Modo Demo Ativo</p>
          <p className="text-sm text-blue-700">
            O sistema está rodando com dados de demonstração. Para usar o banco de dados real,
            configure as variáveis de ambiente no arquivo <code className="bg-blue-100 px-1.5 py-0.5 rounded text-xs">.env.local</code>.
          </p>
        </div>
        <div className="space-y-3">
          <div>
            <label className="form-label">NEXT_PUBLIC_SUPABASE_URL</label>
            <input className="form-input" placeholder="https://seu-projeto.supabase.co" disabled />
          </div>
          <div>
            <label className="form-label">NEXT_PUBLIC_SUPABASE_ANON_KEY</label>
            <input className="form-input" placeholder="sua-chave-anonima" type="password" disabled />
          </div>
          <p className="text-xs text-slate-500">Configure essas variáveis no arquivo .env.local na raiz do projeto.</p>
        </div>
      </div>

      <div className="card p-6">
        <h2 className="section-title mb-4">Sobre o Sistema</h2>
        <div className="space-y-2 text-sm text-slate-600">
          <p><span className="font-medium">Versão:</span> 1.0.0</p>
          <p><span className="font-medium">Stack:</span> Next.js 14 (App Router) + Supabase + Tailwind CSS</p>
          <p><span className="font-medium">Banco de dados:</span> PostgreSQL via Supabase</p>
          <p><span className="font-medium">Autenticação:</span> Supabase Auth</p>
          <p><span className="font-medium">Storage:</span> Supabase Storage (fotos diário de obra)</p>
        </div>
      </div>
    </div>
  )
}
