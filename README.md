# Obras ERP

> Sistema completo de gestão de obras e construção civil, production-ready.

![Next.js](https://img.shields.io/badge/Next.js-14-black) ![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-green) ![TypeScript](https://img.shields.io/badge/TypeScript-5-blue) ![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-3-38bdf8)

---

## Funcionalidades

| Módulo | Descrição |
|---|---|
| **Dashboard** | KPIs, gráficos de custo e status, alertas de atraso |
| **Obras** | CRUD completo, filtro por status, pesquisa |
| **Cronograma** | Etapas com progresso, dependências, timeline |
| **Custos** | Orçado vs realizado, despesas por categoria, histórico |
| **Materiais** | Cadastro, controle de uso, custo por material |
| **Equipe** | Funcionários por função, associação com obras |
| **Diário de Obra** | Registro diário, clima, ocorrências |
| **Relatórios** | Financeiro, progresso, exportação JSON/CSV |
| **Autenticação** | Login/Cadastro via Supabase Auth |

---

## Stack

- **Frontend:** Next.js 14 (App Router) + TypeScript
- **Estilização:** Tailwind CSS
- **Banco de dados:** Supabase (PostgreSQL)
- **Autenticação:** Supabase Auth
- **Storage:** Supabase Storage
- **Gráficos:** Recharts
- **Ícones:** Lucide React

---

## Como rodar

### 1. Clone e instale dependências

```bash
git clone <url-do-repo>
cd obras-erp
npm install
```

### 2. Configure as variáveis de ambiente

```bash
cp .env.local.example .env.local
```

Edite `.env.local` com suas credenciais do Supabase:

```env
NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-chave-anonima
```

> **Modo Demo:** Se não configurar o Supabase, o sistema roda com dados mockados automaticamente. Ideal para avaliar o sistema.

### 3. Configure o banco de dados (opcional)

No painel do Supabase, acesse **SQL Editor** e execute:

```bash
# Cole o conteúdo de:
supabase/migrations/001_initial.sql
```

Isso criará:
- Todas as tabelas com constraints
- Triggers automáticos (sync custos, criação de perfil)
- Row Level Security (RLS)
- Bucket de storage para fotos

### 4. Rode o servidor de desenvolvimento

```bash
npm run dev
```

Acesse: [http://localhost:3000](http://localhost:3000)

---

## Estrutura do Projeto

```
src/
├── app/
│   ├── (auth)/           # Login e Cadastro
│   └── (dashboard)/      # Área protegida
│       ├── page.tsx       # Dashboard principal
│       ├── obras/         # CRUD de obras
│       │   └── [id]/
│       │       ├── cronograma/
│       │       ├── custos/
│       │       ├── materiais/
│       │       ├── equipe/
│       │       └── diario/
│       ├── relatorios/    # Relatórios consolidados
│       └── configuracoes/ # Configurações
├── components/
│   ├── layout/           # Sidebar, Header
│   └── ui/               # StatusBadge, ProgressBar, StatCard
├── lib/
│   ├── supabase/         # Clientes browser e server
│   ├── mock-data.ts      # Dados de demonstração
│   └── utils.ts          # Helpers (format, cn, etc.)
└── types/
    └── index.ts          # Tipos TypeScript

supabase/
└── migrations/
    └── 001_initial.sql   # Schema completo
```

---

## Modelagem do Banco

```
profiles         ← auth.users (1:1)
obras            ← profiles (N:1)
etapas           ← obras (N:1), etapas (self-ref dependência)
despesas         → obras (N:1)
materiais        (tabela de catálogo)
obras_materiais  → obras + materiais (N:N)
funcionarios     (tabela de pessoas)
obras_funcionarios → obras + funcionarios (N:N)
diario_obras     → obras (N:1)
```

---

## Deploy

### Vercel (recomendado)

```bash
npx vercel --prod
```

Configure as variáveis de ambiente no painel da Vercel.

### Docker

```bash
docker build -t obras-erp .
docker run -p 3000:3000 --env-file .env.local obras-erp
```

---

## Licença

MIT
