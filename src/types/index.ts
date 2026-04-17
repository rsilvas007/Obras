export type UserRole = 'admin' | 'user'

export interface Profile {
  id: string
  email: string
  full_name: string
  role: UserRole
  avatar_url?: string
  created_at: string
}

export type ObraStatus = 'planejamento' | 'em_andamento' | 'concluida' | 'pausada'

export interface Obra {
  id: string
  nome: string
  descricao?: string
  status: ObraStatus
  data_inicio: string
  data_fim_prevista: string
  data_fim_real?: string
  orcamento_total: number
  custo_realizado: number
  progresso: number
  endereco?: string
  responsavel_id?: string
  created_by: string
  created_at: string
  updated_at: string
}

export interface Etapa {
  id: string
  obra_id: string
  nome: string
  descricao?: string
  data_inicio: string
  data_fim: string
  progresso: number
  status: 'pendente' | 'em_andamento' | 'concluida' | 'atrasada'
  ordem: number
  dependencia_id?: string
  created_at: string
}

export type CategoriasCusto =
  | 'materiais'
  | 'mao_de_obra'
  | 'equipamentos'
  | 'servicos'
  | 'administrativo'
  | 'outros'

export interface Despesa {
  id: string
  obra_id: string
  descricao: string
  categoria: CategoriasCusto
  valor: number
  data: string
  comprovante_url?: string
  fornecedor?: string
  created_by: string
  created_at: string
}

export interface Material {
  id: string
  nome: string
  unidade: string
  preco_unitario: number
  descricao?: string
  created_at: string
}

export interface ObraMaterial {
  id: string
  obra_id: string
  material_id: string
  material?: Material
  quantidade_prevista: number
  quantidade_usada: number
  created_at: string
}

export type FuncaoFuncionario =
  | 'engenheiro'
  | 'arquiteto'
  | 'mestre_de_obra'
  | 'pedreiro'
  | 'eletricista'
  | 'encanador'
  | 'pintor'
  | 'carpinteiro'
  | 'servente'
  | 'outros'

export interface Funcionario {
  id: string
  nome: string
  funcao: FuncaoFuncionario
  email?: string
  telefone?: string
  documento?: string
  salario?: number
  created_at: string
}

export interface ObraFuncionario {
  id: string
  obra_id: string
  funcionario_id: string
  funcionario?: Funcionario
  data_entrada: string
  data_saida?: string
  cargo_na_obra?: string
  created_at: string
}

export interface DiarioObra {
  id: string
  obra_id: string
  data: string
  descricao: string
  condicao_clima?: string
  funcionarios_presentes?: number
  ocorrencias?: string
  fotos?: string[]
  created_by: string
  created_at: string
}

export interface DashboardMetrics {
  totalObras: number
  obrasEmAndamento: number
  obrasConcluidas: number
  totalOrcamento: number
  totalGasto: number
  obrasAtrasadas: number
}
