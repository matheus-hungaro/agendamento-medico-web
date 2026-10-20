import { useState, useEffect } from 'react';
import type { FormEvent } from 'react';
import { api } from '../services/api';
import type { Medico, Especialidade } from '../types';
import { UserPlus, Trash2, Edit2, Stethoscope, ArrowLeft, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function Medicos() {
  const [medicos, setMedicos] = useState<Medico[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalAberto, setModalAberto] = useState(false);
  const [medicoEmEdicao, setMedicoEmEdicao] = useState<Medico | null>(null);
  const [erro, setErro] = useState('');
  const navigate = useNavigate();

  // Estados do formulário
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');
  const [crm, setCrm] = useState('');
  const [especialidade, setEspecialidade] = useState<Especialidade>('CARDIOLOGIA');
  const [logradouro, setLogradouro] = useState('');
  const [bairro, setBairro] = useState('');
  const [cep, setCep] = useState('');
  const [cidade, setCidade] = useState('');
  const [uf, setUf] = useState('');

  const carregarMedicos = async () => {
    try {
      setLoading(true);
      const response = await api.get<{ content: Medico[] }>('/medicos');
      setMedicos(response.data.content || response.data);
    } catch (err) {
      console.error('Erro ao carregar médicos:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarMedicos();
  }, []);

  const abrirModalNovo = () => {
    setMedicoEmEdicao(null);
    setErro('');
    setNome('');
    setEmail('');
    setTelefone('');
    setCrm('');
    setEspecialidade('CARDIOLOGIA');
    setLogradouro('');
    setBairro('');
    setCep('');
    setCidade('');
    setUf('');
    setModalAberto(true);
  };

  const abrirModalEdicao = (medico: Medico) => {
    setMedicoEmEdicao(medico);
    setErro('');
    setNome(medico.nome || '');
    setEmail(medico.email || '');
    setTelefone(medico.telefone || '');
    setCrm(medico.crm || '');
    setEspecialidade(medico.especialidade || 'CARDIOLOGIA');
    setLogradouro(medico.endereco?.logradouro || '');
    setBairro(medico.endereco?.bairro || '');
    setCep(medico.endereco?.cep || '');
    setCidade(medico.endereco?.cidade || '');
    setUf(medico.endereco?.uf || '');
    setModalAberto(true);
  };

  const handleSalvar = async (e: FormEvent) => {
    e.preventDefault();
    setErro('');

    const dadosEndereco = {
      logradouro,
      bairro,
      cep: cep.replace(/\D/g, ''),
      cidade,
      uf,
    };

    try {
      if (medicoEmEdicao) {
        // Atualização (PUT) - Envia ID, Nome, Telefone e Endereço (conforme DTO do Spring)
        await api.put('/medicos', {
          id: medicoEmEdicao.id,
          nome,
          telefone,
          endereco: dadosEndereco,
        });
      } else {
        // Cadastro Novo (POST) - Envia todos os dados
        await api.post('/medicos', {
          nome,
          email,
          telefone,
          crm,
          especialidade,
          endereco: dadosEndereco,
        });
      }

      setModalAberto(false);
      carregarMedicos();
    } catch (err: any) {
      console.error('Erro retornado pela API:', err.response?.data);
      const msg = err.response?.data?.message || err.response?.data?.[0]?.mensagem || 'Erro ao salvar médico. Verifique os dados.';
      setErro(msg);
    }
  };

  const handleExcluir = async (id: number) => {
    if (confirm('Deseja realmente inativar este médico?')) {
      try {
        await api.delete(`/medicos/${id}`);
        carregarMedicos();
      } catch (err) {
        alert('Erro ao excluir médico.');
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <nav className="bg-white border-b border-slate-200 px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/dashboard')}
            className="p-2 hover:bg-slate-100 rounded-lg text-slate-600 transition cursor-pointer"
            title="Voltar ao Dashboard"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <Stethoscope className="w-6 h-6 text-blue-600" /> Gestão de Médicos
          </h1>
        </div>

        <button
          onClick={abrirModalNovo}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium shadow transition cursor-pointer"
        >
          <UserPlus className="w-4 h-4" /> Novo Médico
        </button>
      </nav>

      <main className="max-w-6xl mx-auto p-6">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          {loading ? (
            <div className="p-8 text-center text-slate-500">Carregando médicos...</div>
          ) : medicos.length === 0 ? (
            <div className="p-8 text-center text-slate-500">Nenhum médico cadastrado no momento.</div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-100 border-b border-slate-200 text-slate-600 text-sm">
                  <th className="p-4">Nome</th>
                  <th className="p-4">E-mail</th>
                  <th className="p-4">CRM</th>
                  <th className="p-4">Especialidade</th>
                  <th className="p-4 text-center">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-slate-700 text-sm">
                {medicos.map((medico) => (
                  <tr key={medico.id} className="hover:bg-slate-50 transition">
                    <td className="p-4 font-medium text-slate-900">{medico.nome}</td>
                    <td className="p-4">{medico.email || '-'}</td>
                    <td className="p-4">{medico.crm}</td>
                    <td className="p-4">
                      <span className="px-2.5 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-semibold">
                        {medico.especialidade}
                      </span>
                    </td>
                    <td className="p-4 text-center flex justify-center gap-2">
                      <button
                        onClick={() => abrirModalEdicao(medico)}
                        className="p-1.5 text-slate-500 hover:text-blue-600 rounded-lg hover:bg-blue-50 transition cursor-pointer"
                        title="Editar Médico"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleExcluir(medico.id)}
                        className="p-1.5 text-slate-500 hover:text-red-600 rounded-lg hover:bg-red-50 transition cursor-pointer"
                        title="Inativar Médico"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </main>

      {modalAberto && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-lg w-full p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4 pb-2 border-b">
              <h3 className="text-lg font-bold text-slate-800">
                {medicoEmEdicao ? 'Editar Médico' : 'Cadastrar Novo Médico'}
              </h3>
              <button
                onClick={() => setModalAberto(false)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {erro && (
              <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-200">
                {erro}
              </div>
            )}

            <form onSubmit={handleSalvar} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Nome Completo</label>
                <input
                  type="text"
                  required
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">E-mail</label>
                  <input
                    type="email"
                    required
                    disabled={!!medicoEmEdicao} // Desativado na edição por regra de negócio do Spring
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none disabled:bg-slate-100 disabled:text-slate-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Telefone</label>
                  <input
                    type="text"
                    required
                    value={telefone}
                    onChange={(e) => setTelefone(e.target.value)}
                    placeholder="61999998888"
                    className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">CRM</label>
                  <input
                    type="text"
                    required
                    disabled={!!medicoEmEdicao} // CRM é imutável
                    value={crm}
                    onChange={(e) => setCrm(e.target.value)}
                    placeholder="123456"
                    className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none disabled:bg-slate-100 disabled:text-slate-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Especialidade</label>
                  <select
                    value={especialidade}
                    disabled={!!medicoEmEdicao} // Especialidade é imutável
                    onChange={(e) => setEspecialidade(e.target.value as Especialidade)}
                    className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none bg-white disabled:bg-slate-100 disabled:text-slate-500"
                  >
                    <option value="CARDIOLOGIA">Cardiologia</option>
                    <option value="DERMATOLOGIA">Dermatologia</option>
                    <option value="ORTOPEDIA">Ortopedia</option>
                    <option value="GINECOLOGIA">Ginecologia</option>
                  </select>
                </div>
              </div>

              <div className="pt-2 border-t">
                <p className="text-sm font-semibold text-slate-700 mb-2">Endereço</p>
                <div className="space-y-3">
                  <input
                    type="text"
                    required
                    placeholder="Logradouro / Rua"
                    value={logradouro}
                    onChange={(e) => setLogradouro(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                  />

                  <div className="grid grid-cols-2 gap-3">
                    <input
                      type="text"
                      required
                      placeholder="Bairro"
                      value={bairro}
                      onChange={(e) => setBairro(e.target.value)}
                      className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                    />

                    <input
                      type="text"
                      required
                      placeholder="CEP (somente números)"
                      value={cep}
                      onChange={(e) => setCep(e.target.value)}
                      className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <input
                      type="text"
                      required
                      placeholder="Cidade"
                      value={cidade}
                      onChange={(e) => setCidade(e.target.value)}
                      className="col-span-2 w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                    />

                    <input
                      type="text"
                      required
                      maxLength={2}
                      placeholder="UF"
                      value={uf}
                      onChange={(e) => setUf(e.target.value.toUpperCase())}
                      className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none text-center"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t mt-4">
                <button
                  type="button"
                  onClick={() => setModalAberto(false)}
                  className="px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-lg transition cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition cursor-pointer"
                >
                  {medicoEmEdicao ? 'Atualizar Médico' : 'Salvar Médico'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}