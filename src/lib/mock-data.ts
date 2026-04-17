import type {
  Obra, Etapa, Despesa, Material, ObraMaterial,
  Funcionario, ObraFuncionario, DiarioObra
} from '@/types'

export const mockObras: Obra[] = [
  {
    id: '1',
    nome: 'Residencial Solar das Palmeiras',
    descricao: 'Construção de condomínio residencial com 24 apartamentos, 2 torres de 6 andares.',
    status: 'em_andamento',
    data_inicio: '2024-01-15',
    data_fim_prevista: '2025-06-30',
    orcamento_total: 2800000,
    custo_realizado: 1450000,
    progresso: 52,
    endereco: 'Rua das Palmeiras, 100 - São Paulo, SP',
    created_by: 'demo',
    created_at: '2024-01-10T10:00:00Z',
    updated_at: '2024-04-10T15:30:00Z',
  },
  {
    id: '2',
    nome: 'Centro Comercial Novo Horizonte',
    descricao: 'Complexo comercial com 40 lojas, praça de alimentação e 3 andares de estacionamento.',
    status: 'em_andamento',
    data_inicio: '2024-03-01',
    data_fim_prevista: '2025-12-31',
    orcamento_total: 5500000,
    custo_realizado: 980000,
    progresso: 18,
    endereco: 'Av. Principal, 500 - Campinas, SP',
    created_by: 'demo',
    created_at: '2024-02-20T09:00:00Z',
    updated_at: '2024-04-12T11:00:00Z',
  },
  {
    id: '3',
    nome: 'Reforma Hospital Municipal',
    descricao: 'Ampliação e reforma da ala de emergências com 50 novos leitos.',
    status: 'concluida',
    data_inicio: '2023-06-01',
    data_fim_prevista: '2023-12-31',
    data_fim_real: '2024-01-15',
    orcamento_total: 1200000,
    custo_realizado: 1285000,
    progresso: 100,
    endereco: 'Rua do Hospital, 200 - Santos, SP',
    created_by: 'demo',
    created_at: '2023-05-20T10:00:00Z',
    updated_at: '2024-01-15T16:00:00Z',
  },
  {
    id: '4',
    nome: 'Ponte Sobre o Rio Verde',
    descricao: 'Construção de ponte de concreto protendido com 120 metros de vão livre.',
    status: 'planejamento',
    data_inicio: '2024-07-01',
    data_fim_prevista: '2025-07-01',
    orcamento_total: 8000000,
    custo_realizado: 120000,
    progresso: 2,
    endereco: 'Rodovia SP-340, km 85 - Interior SP',
    created_by: 'demo',
    created_at: '2024-04-01T08:00:00Z',
    updated_at: '2024-04-15T09:00:00Z',
  },
]

export const mockEtapas: Record<string, Etapa[]> = {
  '1': [
    { id: 'e1', obra_id: '1', nome: 'Fundação', descricao: 'Escavação e execução das fundações', data_inicio: '2024-01-15', data_fim: '2024-03-15', progresso: 100, status: 'concluida', ordem: 1, created_at: '2024-01-10T10:00:00Z' },
    { id: 'e2', obra_id: '1', nome: 'Estrutura', descricao: 'Pilares, vigas e lajes de concreto', data_inicio: '2024-03-16', data_fim: '2024-07-31', progresso: 75, status: 'em_andamento', ordem: 2, dependencia_id: 'e1', created_at: '2024-01-10T10:00:00Z' },
    { id: 'e3', obra_id: '1', nome: 'Alvenaria', descricao: 'Levantamento das paredes externas e internas', data_inicio: '2024-06-01', data_fim: '2024-09-30', progresso: 30, status: 'em_andamento', ordem: 3, dependencia_id: 'e2', created_at: '2024-01-10T10:00:00Z' },
    { id: 'e4', obra_id: '1', nome: 'Cobertura', descricao: 'Telhado e impermeabilização das lajes', data_inicio: '2024-09-01', data_fim: '2024-11-30', progresso: 0, status: 'pendente', ordem: 4, dependencia_id: 'e3', created_at: '2024-01-10T10:00:00Z' },
    { id: 'e5', obra_id: '1', nome: 'Instalações', descricao: 'Instalações elétricas, hidráulicas e ar-condicionado', data_inicio: '2024-10-01', data_fim: '2025-02-28', progresso: 0, status: 'pendente', ordem: 5, dependencia_id: 'e3', created_at: '2024-01-10T10:00:00Z' },
    { id: 'e6', obra_id: '1', nome: 'Acabamentos', descricao: 'Revestimentos, pintura, louças e metais', data_inicio: '2025-01-01', data_fim: '2025-05-31', progresso: 0, status: 'pendente', ordem: 6, dependencia_id: 'e5', created_at: '2024-01-10T10:00:00Z' },
  ],
  '2': [
    { id: 'e7', obra_id: '2', nome: 'Terraplenagem', descricao: 'Preparação e nivelamento do terreno', data_inicio: '2024-03-01', data_fim: '2024-04-30', progresso: 100, status: 'concluida', ordem: 1, created_at: '2024-02-20T10:00:00Z' },
    { id: 'e8', obra_id: '2', nome: 'Fundação', descricao: 'Estacas e blocos de fundação', data_inicio: '2024-04-15', data_fim: '2024-07-31', progresso: 40, status: 'em_andamento', ordem: 2, dependencia_id: 'e7', created_at: '2024-02-20T10:00:00Z' },
    { id: 'e9', obra_id: '2', nome: 'Estrutura Metálica', descricao: 'Montagem da estrutura metálica principal', data_inicio: '2024-07-01', data_fim: '2024-12-31', progresso: 0, status: 'pendente', ordem: 3, created_at: '2024-02-20T10:00:00Z' },
  ],
}

export const mockDespesas: Record<string, Despesa[]> = {
  '1': [
    { id: 'd1', obra_id: '1', descricao: 'Concreto usinado fck 25 - fundação', categoria: 'materiais', valor: 285000, data: '2024-02-10', fornecedor: 'ConcreMix Ltda', created_by: 'demo', created_at: '2024-02-10T10:00:00Z' },
    { id: 'd2', obra_id: '1', descricao: 'Mão de obra - fundação (fev)', categoria: 'mao_de_obra', valor: 95000, data: '2024-02-28', fornecedor: 'Equipe Alpha Construções', created_by: 'demo', created_at: '2024-02-28T10:00:00Z' },
    { id: 'd3', obra_id: '1', descricao: 'Aço CA-50 - estrutura', categoria: 'materiais', valor: 420000, data: '2024-03-20', fornecedor: 'Siderúrgica Nacional', created_by: 'demo', created_at: '2024-03-20T10:00:00Z' },
    { id: 'd4', obra_id: '1', descricao: 'Aluguel grua e guindaste (mar-abr)', categoria: 'equipamentos', valor: 35000, data: '2024-04-01', fornecedor: 'EquipRent Locações', created_by: 'demo', created_at: '2024-04-01T10:00:00Z' },
    { id: 'd5', obra_id: '1', descricao: 'Mão de obra - estrutura (mar)', categoria: 'mao_de_obra', valor: 120000, data: '2024-03-31', fornecedor: 'Equipe Alpha Construções', created_by: 'demo', created_at: '2024-03-31T10:00:00Z' },
    { id: 'd6', obra_id: '1', descricao: 'Projetos complementares e aprovações', categoria: 'servicos', valor: 45000, data: '2024-01-25', fornecedor: 'EngProjetos Consultoria', created_by: 'demo', created_at: '2024-01-25T10:00:00Z' },
    { id: 'd7', obra_id: '1', descricao: 'Bloco cerâmico 14x19x29 - alvenaria', categoria: 'materiais', valor: 185000, data: '2024-04-15', fornecedor: 'Cerâmica do Vale', created_by: 'demo', created_at: '2024-04-15T10:00:00Z' },
    { id: 'd8', obra_id: '1', descricao: 'Despesas administrativas (abr)', categoria: 'administrativo', valor: 25000, data: '2024-04-30', created_by: 'demo', created_at: '2024-04-30T10:00:00Z' },
    { id: 'd9', obra_id: '1', descricao: 'Mão de obra - alvenaria (abr)', categoria: 'mao_de_obra', valor: 85000, data: '2024-04-30', fornecedor: 'Equipe Alpha Construções', created_by: 'demo', created_at: '2024-04-30T10:00:00Z' },
    { id: 'd10', obra_id: '1', descricao: 'Cimento CP-II-E-32 (lote 1)', categoria: 'materiais', valor: 155000, data: '2024-04-20', fornecedor: 'Distribuidora Central', created_by: 'demo', created_at: '2024-04-20T10:00:00Z' },
  ],
  '2': [
    { id: 'd11', obra_id: '2', descricao: 'Serviço de terraplenagem', categoria: 'servicos', valor: 280000, data: '2024-03-15', fornecedor: 'TerraForte Terraplanagem', created_by: 'demo', created_at: '2024-03-15T10:00:00Z' },
    { id: 'd12', obra_id: '2', descricao: 'Estacas pré-moldadas', categoria: 'materiais', valor: 450000, data: '2024-04-20', fornecedor: 'EstacasTech', created_by: 'demo', created_at: '2024-04-20T10:00:00Z' },
    { id: 'd13', obra_id: '2', descricao: 'Projeto estrutural e compatibilização', categoria: 'servicos', valor: 95000, data: '2024-03-01', fornecedor: 'Engenharia Total', created_by: 'demo', created_at: '2024-03-01T10:00:00Z' },
    { id: 'd14', obra_id: '2', descricao: 'Mão de obra fundação (abr)', categoria: 'mao_de_obra', valor: 155000, data: '2024-04-30', fornecedor: 'Construtora Beta', created_by: 'demo', created_at: '2024-04-30T10:00:00Z' },
  ],
}

export const mockMateriais: Material[] = [
  { id: 'm1', nome: 'Concreto Usinado fck 25 MPa', unidade: 'm³', preco_unitario: 320, created_at: '2024-01-01T00:00:00Z' },
  { id: 'm2', nome: 'Aço CA-50 ø10mm', unidade: 'kg', preco_unitario: 5.80, created_at: '2024-01-01T00:00:00Z' },
  { id: 'm3', nome: 'Bloco Cerâmico 14x19x29', unidade: 'un', preco_unitario: 2.50, created_at: '2024-01-01T00:00:00Z' },
  { id: 'm4', nome: 'Cimento CP-II-E-32 50kg', unidade: 'sc', preco_unitario: 32, created_at: '2024-01-01T00:00:00Z' },
  { id: 'm5', nome: 'Areia Lavada Média', unidade: 'm³', preco_unitario: 95, created_at: '2024-01-01T00:00:00Z' },
  { id: 'm6', nome: 'Brita nº 1', unidade: 'm³', preco_unitario: 110, created_at: '2024-01-01T00:00:00Z' },
  { id: 'm7', nome: 'Tubo PVC Esgoto 100mm', unidade: 'm', preco_unitario: 28, created_at: '2024-01-01T00:00:00Z' },
  { id: 'm8', nome: 'Fio Elétrico 2,5mm²', unidade: 'm', preco_unitario: 4.50, created_at: '2024-01-01T00:00:00Z' },
  { id: 'm9', nome: 'Telha Cerâmica Colonial', unidade: 'un', preco_unitario: 1.85, created_at: '2024-01-01T00:00:00Z' },
  { id: 'm10', nome: 'Porcelanato 60x60cm', unidade: 'm²', preco_unitario: 65, created_at: '2024-01-01T00:00:00Z' },
]

export const mockObraMateriais: Record<string, ObraMaterial[]> = {
  '1': [
    { id: 'om1', obra_id: '1', material_id: 'm1', material: mockMateriais[0], quantidade_prevista: 850, quantidade_usada: 620, created_at: '2024-01-15T00:00:00Z' },
    { id: 'om2', obra_id: '1', material_id: 'm2', material: mockMateriais[1], quantidade_prevista: 45000, quantidade_usada: 38000, created_at: '2024-01-15T00:00:00Z' },
    { id: 'om3', obra_id: '1', material_id: 'm3', material: mockMateriais[2], quantidade_prevista: 120000, quantidade_usada: 35000, created_at: '2024-01-15T00:00:00Z' },
    { id: 'om4', obra_id: '1', material_id: 'm4', material: mockMateriais[3], quantidade_prevista: 3200, quantidade_usada: 1800, created_at: '2024-01-15T00:00:00Z' },
    { id: 'om5', obra_id: '1', material_id: 'm5', material: mockMateriais[4], quantidade_prevista: 280, quantidade_usada: 195, created_at: '2024-01-15T00:00:00Z' },
    { id: 'om6', obra_id: '1', material_id: 'm6', material: mockMateriais[5], quantidade_prevista: 190, quantidade_usada: 140, created_at: '2024-01-15T00:00:00Z' },
  ],
}

export const mockFuncionarios: Funcionario[] = [
  { id: 'f1', nome: 'Roberto Silva', funcao: 'engenheiro', email: 'roberto@example.com', telefone: '(11) 99999-0001', salario: 8500, created_at: '2024-01-01T00:00:00Z' },
  { id: 'f2', nome: 'José Ferreira', funcao: 'mestre_de_obra', email: 'jose@example.com', telefone: '(11) 99999-0002', salario: 4800, created_at: '2024-01-01T00:00:00Z' },
  { id: 'f3', nome: 'Carlos Oliveira', funcao: 'pedreiro', telefone: '(11) 99999-0003', salario: 2800, created_at: '2024-01-01T00:00:00Z' },
  { id: 'f4', nome: 'Ana Santos', funcao: 'arquiteto', email: 'ana@example.com', telefone: '(11) 99999-0004', salario: 7200, created_at: '2024-01-01T00:00:00Z' },
  { id: 'f5', nome: 'Pedro Costa', funcao: 'eletricista', telefone: '(11) 99999-0005', salario: 3600, created_at: '2024-01-01T00:00:00Z' },
  { id: 'f6', nome: 'Marcos Lima', funcao: 'encanador', telefone: '(11) 99999-0006', salario: 3400, created_at: '2024-01-01T00:00:00Z' },
  { id: 'f7', nome: 'João Souza', funcao: 'servente', telefone: '(11) 99999-0007', salario: 1800, created_at: '2024-01-01T00:00:00Z' },
  { id: 'f8', nome: 'Lucas Alves', funcao: 'carpinteiro', telefone: '(11) 99999-0008', salario: 2900, created_at: '2024-01-01T00:00:00Z' },
  { id: 'f9', nome: 'Fernanda Rocha', funcao: 'arquiteto', email: 'fernanda@example.com', telefone: '(11) 99999-0009', salario: 6800, created_at: '2024-01-01T00:00:00Z' },
]

export const mockObraFuncionarios: Record<string, ObraFuncionario[]> = {
  '1': [
    { id: 'of1', obra_id: '1', funcionario_id: 'f1', funcionario: mockFuncionarios[0], data_entrada: '2024-01-15', cargo_na_obra: 'Engenheiro Responsável', created_at: '2024-01-15T00:00:00Z' },
    { id: 'of2', obra_id: '1', funcionario_id: 'f2', funcionario: mockFuncionarios[1], data_entrada: '2024-01-15', cargo_na_obra: 'Mestre de Obras', created_at: '2024-01-15T00:00:00Z' },
    { id: 'of3', obra_id: '1', funcionario_id: 'f3', funcionario: mockFuncionarios[2], data_entrada: '2024-02-01', cargo_na_obra: 'Pedreiro', created_at: '2024-02-01T00:00:00Z' },
    { id: 'of4', obra_id: '1', funcionario_id: 'f4', funcionario: mockFuncionarios[3], data_entrada: '2024-01-15', cargo_na_obra: 'Arquiteta Responsável', created_at: '2024-01-15T00:00:00Z' },
    { id: 'of5', obra_id: '1', funcionario_id: 'f7', funcionario: mockFuncionarios[6], data_entrada: '2024-02-01', cargo_na_obra: 'Servente Geral', created_at: '2024-02-01T00:00:00Z' },
    { id: 'of6', obra_id: '1', funcionario_id: 'f8', funcionario: mockFuncionarios[7], data_entrada: '2024-03-01', cargo_na_obra: 'Carpinteiro de Forma', created_at: '2024-03-01T00:00:00Z' },
  ],
  '2': [
    { id: 'of7', obra_id: '2', funcionario_id: 'f1', funcionario: mockFuncionarios[0], data_entrada: '2024-03-01', cargo_na_obra: 'Engenheiro Responsável', created_at: '2024-03-01T00:00:00Z' },
    { id: 'of8', obra_id: '2', funcionario_id: 'f9', funcionario: mockFuncionarios[8], data_entrada: '2024-03-01', cargo_na_obra: 'Arquiteta', created_at: '2024-03-01T00:00:00Z' },
  ],
}

export const mockDiario: Record<string, DiarioObra[]> = {
  '1': [
    {
      id: 'diary1', obra_id: '1', data: '2024-04-15',
      descricao: 'Concretagem da laje do 3º pavimento realizada com sucesso. Foram utilizados 45m³ de concreto usinado fck 25. Trabalho concluído às 17h30.',
      condicao_clima: 'Ensolarado', funcionarios_presentes: 18,
      ocorrencias: 'Nenhuma ocorrência registrada.',
      created_by: 'demo', created_at: '2024-04-15T18:00:00Z',
    },
    {
      id: 'diary2', obra_id: '1', data: '2024-04-14',
      descricao: 'Continuação da armação de pilares e vigas do 3º pavimento. Progresso conforme cronograma aprovado.',
      condicao_clima: 'Nublado', funcionarios_presentes: 15,
      created_by: 'demo', created_at: '2024-04-14T18:00:00Z',
    },
    {
      id: 'diary3', obra_id: '1', data: '2024-04-13',
      descricao: 'Paralisação por chuva forte no período da manhã. Trabalhos de armação retomados às 14h com equipe reduzida.',
      condicao_clima: 'Chuva forte', funcionarios_presentes: 12,
      ocorrencias: 'Paralisação de 4 horas por condições climáticas adversas. Sem danos ao canteiro.',
      created_by: 'demo', created_at: '2024-04-13T18:00:00Z',
    },
    {
      id: 'diary4', obra_id: '1', data: '2024-04-12',
      descricao: 'Início do levantamento das alvenarias do 2º pavimento. Chegada e conferência do lote de bloco cerâmico.',
      condicao_clima: 'Ensolarado', funcionarios_presentes: 20,
      created_by: 'demo', created_at: '2024-04-12T18:00:00Z',
    },
    {
      id: 'diary5', obra_id: '1', data: '2024-04-11',
      descricao: 'Desforma das vigas do 2º pavimento. Inspeção visual realizada pelo engenheiro responsável – aprovado.',
      condicao_clima: 'Parcialmente nublado', funcionarios_presentes: 16,
      created_by: 'demo', created_at: '2024-04-11T18:00:00Z',
    },
  ],
}

export const mockCustosMensais = [
  { mes: 'Jan', orcado: 180000, realizado: 165000 },
  { mes: 'Fev', orcado: 220000, realizado: 240000 },
  { mes: 'Mar', orcado: 280000, realizado: 295000 },
  { mes: 'Abr', orcado: 310000, realizado: 330000 },
  { mes: 'Mai', orcado: 290000, realizado: 260000 },
  { mes: 'Jun', orcado: 320000, realizado: 160000 },
]
