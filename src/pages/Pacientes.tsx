import { useState, useEffect } from 'react';
import type { FormEvent } from 'react';
import { api } from '../services/api';
import type { Paciente } from '../types';
import { UserPlus, Trash2, Edit2, Users, ArrowLeft, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function Pacientes() {
  const [pacientes, setPacientes] = useState<Paciente[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalAberto, setModalAberto] = useState(false);
  const [pacienteEmEdicao, setPacienteEmEdicao] = useState<Paciente | null>(null);
  const [erro, setErro] = useState('');
  const navigate = useNavigate();

  // Estados do formulário
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');
  const [cpf, setCpf] = useState('');
  const [logradouro, setLogradouro] = useState('');
  const [bairro, setBairro] = useState('');
  const [cep, setCep] = useState('');
  const [cidade, setCidade] = useState('');
  const [uf, setUf] = useState('');

  const carregarPacientes = async () => {
    try {
      setLoading(true);
      const response = await api.get<{ content: Paciente[] }>('/pacientes');
      setPacientes(response.data.content || response.data);
    } catch (err) {
      console.error('Erro ao carregar pacientes:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarPacientes();
  }, []);

  const abrirModalNovo = () => {
    setPacienteEmEdicao(null);
    setErro('');
    setNome('');
    setEmail('');
    setTelefone('');
    setCpf('');
    setLogradouro('');
    setBairro('');
    setCep('');
    setCidade('');
    setUf('');
    setModalAberto(true);
  };

  const abrirModalEdicao = (paciente: Paciente) => {
    setPacienteEmEdicao(paciente);
    setErro('');
    setNome(paciente.nome || '');
    setEmail(paciente.email || '');
    setTelefone(paciente.telefone || '');
    setCpf(paciente.cpf || '');
    setLogradouro(paciente.endereco?.logradouro || '');
    setBairro(paciente.endereco?.bairro || '');
    setCep(paciente.endereco?.cep || '');
    setCidade(paciente.endereco?.cidade || '');
    setUf(paciente.endereco?.uf || '');
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
      if (pacienteEmEdicao) {
        // Modo Edição: PUT /pacientes
        await api.put('/pacientes', {
          id: pacienteEmEdicao.id,
          nome,
          telefone,
          endereco: dadosEndereco,
        });
      } else {
        // Modo Cadastro: POST /pacientes
        await api.post('/pacientes', {
          nome,
          email,
          telefone,
          cpf: cpf.replace(/\D/g, ''),
          endereco: dadosEndereco,
        });
      }

      setModalAberto(false);
      carregarPacientes();
    } catch (err: any) {
      console.error('Erro retornado pela API:', err.response?.data);
      const msg = err.response?.data?.message || err.response?.data?.[0]?.mensagem || 'Erro ao salvar paciente. Verifique os dados.';
      setErro(msg);
    }
  };

  const handleExcluir = async (id: number) => {
    if (confirm('Deseja realmente inativar este paciente?')) {
      try {
        await api.delete(`/pacientes/${id}`);
        carregarPacientes();
      } catch (err) {
        alert('Erro ao excluir paciente.');
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
            <Users className="w-6 h-6 text-emerald-600" /> Gestão de Pacientes
          </h1>
        </div>

        <button
          onClick={abrirModalNovo}
          className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg font-medium shadow transition cursor-pointer"
        >
          <UserPlus className="w-4 h-4" /> Novo Paciente
        </button>
      </nav>

      <main className="max-w-6xl mx-auto p-6">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          {loading ? (
            <div className="p-8 text-center text-slate-500">Carregando pacientes...</div>
          ) : pacientes.length === 0 ? (
            <div className="p-8 text-center text-slate-500">Nenhum paciente cadastrado no momento.</div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-100 border-b border-slate-200 text-slate-600 text-sm">
                  <th className="p-4">Nome</th>
                  <th className="p-4">E-mail</th>
                  <th className="p-4">CPF</th>
                  <th className="p-4 text-center">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-slate-700 text-sm">
                {pacientes.map((paciente) => (
                  <tr key={paciente.id} className="hover:bg-slate-50 transition">
                    <td className="p-4 font-medium text-slate-900">{paciente.nome}</td>
                    <td className="p-4">{paciente.email || '-'}</td>
                    <td className="p-4">{paciente.cpf}</td>
                    <td className="p-4 text-center flex justify-center gap-2">
                      <button
                        onClick={() => abrirModalEdicao(paciente)}
                        className="p-1.5 text-slate-500 hover:text-emerald-600 rounded-lg hover:bg-emerald-50 transition cursor-pointer"
                        title="Editar Paciente"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleExcluir(paciente.id)}
                        className="p-1.5 text-slate-500 hover:text-red-600 rounded-lg hover:bg-red-50 transition cursor-pointer"
                        title="Inativar Paciente"
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
                {pacienteEmEdicao ? 'Editar Paciente' : 'Cadastrar Novo Paciente'}
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
                  className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">E-mail</label>
                  <input
                    type="email"
                    required
                    disabled={!!pacienteEmEdicao}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 outline-none disabled:bg-slate-100 disabled:text-slate-500"
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
                    className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">CPF</label>
                <input
                  type="text"
                  required
                  disabled={!!pacienteEmEdicao}
                  value={cpf}
                  onChange={(e) => setCpf(e.target.value)}
                  placeholder="12345678900"
                  className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 outline-none disabled:bg-slate-100 disabled:text-slate-500"
                />
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
                    className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
                  />

                  <div className="grid grid-cols-2 gap-3">
                    <input
                      type="text"
                      required
                      placeholder="Bairro"
                      value={bairro}
                      onChange={(e) => setBairro(e.target.value)}
                      className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
                    />

                    <input
                      type="text"
                      required
                      placeholder="CEP (somente números)"
                      value={cep}
                      onChange={(e) => setCep(e.target.value)}
                      className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <input
                      type="text"
                      required
                      placeholder="Cidade"
                      value={cidade}
                      onChange={(e) => setCidade(e.target.value)}
                      className="col-span-2 w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
                    />

                    <input
                      type="text"
                      required
                      maxLength={2}
                      placeholder="UF"
                      value={uf}
                      onChange={(e) => setUf(e.target.value.toUpperCase())}
                      className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 outline-none text-center"
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
                  className="px-4 py-2 text-sm bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium transition cursor-pointer"
                >
                  {pacienteEmEdicao ? 'Atualizar Paciente' : 'Salvar Paciente'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}