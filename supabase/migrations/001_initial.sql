-- ============================================================
-- Obras ERP - Schema PostgreSQL (Supabase)
-- Execute no SQL Editor do seu projeto Supabase
-- ============================================================

-- EXTENSION
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- PROFILES (estende auth.users)
-- ============================================================
CREATE TABLE IF NOT EXISTS profiles (
  id          UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email       TEXT,
  full_name   TEXT,
  role        TEXT DEFAULT 'user' CHECK (role IN ('admin', 'user')),
  avatar_url  TEXT,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- Trigger: cria perfil automaticamente ao cadastrar usuário
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, email, full_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'role', 'user')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- ============================================================
-- OBRAS
-- ============================================================
CREATE TABLE IF NOT EXISTS obras (
  id                  UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nome                TEXT NOT NULL,
  descricao           TEXT,
  status              TEXT DEFAULT 'planejamento'
                        CHECK (status IN ('planejamento','em_andamento','concluida','pausada')),
  data_inicio         DATE NOT NULL,
  data_fim_prevista   DATE NOT NULL,
  data_fim_real       DATE,
  orcamento_total     NUMERIC(15,2) DEFAULT 0,
  custo_realizado     NUMERIC(15,2) DEFAULT 0,
  progresso           INTEGER DEFAULT 0 CHECK (progresso BETWEEN 0 AND 100),
  endereco            TEXT,
  responsavel_id      UUID REFERENCES profiles(id) ON DELETE SET NULL,
  created_by          UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at          TIMESTAMPTZ DEFAULT NOW(),
  updated_at          TIMESTAMPTZ DEFAULT NOW()
);

-- Trigger: atualiza updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER obras_updated_at
  BEFORE UPDATE ON obras
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================================
-- ETAPAS (Cronograma)
-- ============================================================
CREATE TABLE IF NOT EXISTS etapas (
  id              UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  obra_id         UUID REFERENCES obras(id) ON DELETE CASCADE NOT NULL,
  nome            TEXT NOT NULL,
  descricao       TEXT,
  data_inicio     DATE NOT NULL,
  data_fim        DATE NOT NULL,
  progresso       INTEGER DEFAULT 0 CHECK (progresso BETWEEN 0 AND 100),
  status          TEXT DEFAULT 'pendente'
                    CHECK (status IN ('pendente','em_andamento','concluida','atrasada')),
  ordem           INTEGER DEFAULT 0,
  dependencia_id  UUID REFERENCES etapas(id) ON DELETE SET NULL,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_etapas_obra_id ON etapas(obra_id);

-- ============================================================
-- DESPESAS (Controle de Custos)
-- ============================================================
CREATE TABLE IF NOT EXISTS despesas (
  id              UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  obra_id         UUID REFERENCES obras(id) ON DELETE CASCADE NOT NULL,
  descricao       TEXT NOT NULL,
  categoria       TEXT NOT NULL
                    CHECK (categoria IN ('materiais','mao_de_obra','equipamentos','servicos','administrativo','outros')),
  valor           NUMERIC(15,2) NOT NULL CHECK (valor >= 0),
  data            DATE NOT NULL,
  comprovante_url TEXT,
  fornecedor      TEXT,
  created_by      UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_despesas_obra_id ON despesas(obra_id);
CREATE INDEX idx_despesas_categoria ON despesas(categoria);

-- Trigger: atualiza custo_realizado na obra ao inserir/deletar despesa
CREATE OR REPLACE FUNCTION sync_custo_realizado()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE obras
  SET custo_realizado = (
    SELECT COALESCE(SUM(valor), 0) FROM despesas WHERE obra_id =
      CASE WHEN TG_OP = 'DELETE' THEN OLD.obra_id ELSE NEW.obra_id END
  )
  WHERE id = CASE WHEN TG_OP = 'DELETE' THEN OLD.obra_id ELSE NEW.obra_id END;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_sync_custo
  AFTER INSERT OR UPDATE OR DELETE ON despesas
  FOR EACH ROW EXECUTE FUNCTION sync_custo_realizado();

-- ============================================================
-- MATERIAIS
-- ============================================================
CREATE TABLE IF NOT EXISTS materiais (
  id              UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nome            TEXT NOT NULL,
  unidade         TEXT NOT NULL,
  preco_unitario  NUMERIC(15,2) DEFAULT 0,
  descricao       TEXT,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- OBRAS_MATERIAIS (Uso de materiais por obra)
-- ============================================================
CREATE TABLE IF NOT EXISTS obras_materiais (
  id                  UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  obra_id             UUID REFERENCES obras(id) ON DELETE CASCADE NOT NULL,
  material_id         UUID REFERENCES materiais(id) ON DELETE RESTRICT NOT NULL,
  quantidade_prevista NUMERIC(15,3) DEFAULT 0,
  quantidade_usada    NUMERIC(15,3) DEFAULT 0,
  created_at          TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(obra_id, material_id)
);

CREATE INDEX idx_obras_materiais_obra ON obras_materiais(obra_id);

-- ============================================================
-- FUNCIONARIOS
-- ============================================================
CREATE TABLE IF NOT EXISTS funcionarios (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nome        TEXT NOT NULL,
  funcao      TEXT NOT NULL
                CHECK (funcao IN ('engenheiro','arquiteto','mestre_de_obra','pedreiro',
                                  'eletricista','encanador','pintor','carpinteiro','servente','outros')),
  email       TEXT,
  telefone    TEXT,
  documento   TEXT,
  salario     NUMERIC(10,2),
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- OBRAS_FUNCIONARIOS (Equipe por obra)
-- ============================================================
CREATE TABLE IF NOT EXISTS obras_funcionarios (
  id              UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  obra_id         UUID REFERENCES obras(id) ON DELETE CASCADE NOT NULL,
  funcionario_id  UUID REFERENCES funcionarios(id) ON DELETE RESTRICT NOT NULL,
  data_entrada    DATE NOT NULL,
  data_saida      DATE,
  cargo_na_obra   TEXT,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_obras_func_obra ON obras_funcionarios(obra_id);

-- ============================================================
-- DIARIO_OBRAS
-- ============================================================
CREATE TABLE IF NOT EXISTS diario_obras (
  id                      UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  obra_id                 UUID REFERENCES obras(id) ON DELETE CASCADE NOT NULL,
  data                    DATE NOT NULL,
  descricao               TEXT NOT NULL,
  condicao_clima          TEXT,
  funcionarios_presentes  INTEGER,
  ocorrencias             TEXT,
  fotos                   TEXT[],
  created_by              UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at              TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_diario_obra_id ON diario_obras(obra_id);
CREATE INDEX idx_diario_data ON diario_obras(data);

-- ============================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================
ALTER TABLE profiles           ENABLE ROW LEVEL SECURITY;
ALTER TABLE obras              ENABLE ROW LEVEL SECURITY;
ALTER TABLE etapas             ENABLE ROW LEVEL SECURITY;
ALTER TABLE despesas           ENABLE ROW LEVEL SECURITY;
ALTER TABLE materiais          ENABLE ROW LEVEL SECURITY;
ALTER TABLE obras_materiais    ENABLE ROW LEVEL SECURITY;
ALTER TABLE funcionarios       ENABLE ROW LEVEL SECURITY;
ALTER TABLE obras_funcionarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE diario_obras       ENABLE ROW LEVEL SECURITY;

-- Profiles
CREATE POLICY "profile_select_own" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "profile_update_own" ON profiles FOR UPDATE USING (auth.uid() = id);

-- Obras: todos usuários autenticados leem; só o criador edita/exclui
CREATE POLICY "obras_select"  ON obras FOR SELECT TO authenticated USING (true);
CREATE POLICY "obras_insert"  ON obras FOR INSERT TO authenticated WITH CHECK (auth.uid() = created_by);
CREATE POLICY "obras_update"  ON obras FOR UPDATE TO authenticated USING (auth.uid() = created_by);
CREATE POLICY "obras_delete"  ON obras FOR DELETE TO authenticated USING (auth.uid() = created_by);

-- Tabelas de suporte: autenticados têm acesso total
DO $$
DECLARE
  t TEXT;
BEGIN
  FOREACH t IN ARRAY ARRAY['etapas','despesas','materiais','obras_materiais',
                            'funcionarios','obras_funcionarios','diario_obras']
  LOOP
    EXECUTE format(
      'CREATE POLICY "authenticated_full_%s" ON %I TO authenticated USING (true) WITH CHECK (true)',
      t, t
    );
  END LOOP;
END;
$$;

-- ============================================================
-- STORAGE (bucket para fotos do diário)
-- ============================================================
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'obras-fotos',
  'obras-fotos',
  true,
  10485760, -- 10MB
  ARRAY['image/jpeg','image/png','image/webp','image/gif']
) ON CONFLICT (id) DO NOTHING;

CREATE POLICY "fotos_upload" ON storage.objects
  FOR INSERT TO authenticated WITH CHECK (bucket_id = 'obras-fotos');

CREATE POLICY "fotos_select" ON storage.objects
  FOR SELECT USING (bucket_id = 'obras-fotos');

CREATE POLICY "fotos_delete" ON storage.objects
  FOR DELETE TO authenticated USING (bucket_id = 'obras-fotos' AND auth.uid()::text = owner);
