export interface DadosEndereco {
  logradouro?: string;
  bairro?: string;
  cep?: string;
  cidade?: string;
  uf?: string;  
}

export type Especialidade = 'CARDIOLOGIA' | 'DERMATOLOGIA' | 'ORTOPEDIA' | 'GINECOLOGIA';

export interface Medico {
id: number;
  nome: string;
  email: string;
  telefone?: string;
  crm: string;
  especialidade: Especialidade;
  endereco?: DadosEndereco;
}

export interface Paciente {
  id: number;
  nome: string;
  email: string;
  cpf: string;
  telefone?: string;
  endereco?: DadosEndereco;
}

export interface Consulta {
  id: number;
  idMedico: number;
  idPaciente: number;
  data: string;
}

export interface RespostaLogin {
  token: string;
}