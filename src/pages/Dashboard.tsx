import { useAuth } from '../contexts/AuthContext';
import { LogOut, Calendar, Users, UserCheck, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function Dashboard() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Navbar */}
      <nav className="bg-white border-b border-slate-200 px-6 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-slate-800 flex items-center gap-2">
          <span className="p-1.5 bg-blue-600 text-white rounded-lg">🩺</span> 
          Painel do Agendamento Médico
        </h1>
        <button
          onClick={logout}
          className="flex items-center gap-2 text-slate-600 hover:text-red-600 text-sm font-medium transition cursor-pointer"
        >
          <LogOut className="w-4 h-4" /> Sair
        </button>
      </nav>

      {/* Conteúdo */}
      <main className="max-w-6xl mx-auto p-6">
        <h2 className="text-2xl font-semibold text-slate-800 mb-6">Visão Geral</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card Médicos */}
          <div
            onClick={() => navigate('/medicos')}
            className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between hover:shadow-md hover:border-blue-400 transition cursor-pointer group select-none"
          >
            <div className="flex items-center gap-4">
              <div className="p-4 bg-blue-100 text-blue-600 rounded-lg group-hover:bg-blue-600 group-hover:text-white transition">
                <UserCheck className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm text-slate-500 font-medium">Médicos</p>
                <p className="text-xl font-bold text-slate-800">Gerenciar Módulo</p>
              </div>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-sm font-semibold text-blue-600 group-hover:text-blue-700">
              <span>Acessar lista</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card Pacientes */}
          <div
            onClick={() => navigate('/pacientes')}
            className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between hover:shadow-md hover:border-emerald-400 transition cursor-pointer group select-none"
          >
            <div className="flex items-center gap-4">
              <div className="p-4 bg-emerald-100 text-emerald-600 rounded-lg group-hover:bg-emerald-600 group-hover:text-white transition">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm text-slate-500 font-medium">Pacientes</p>
                <p className="text-xl font-bold text-slate-800">Gerenciar Módulo</p>
              </div>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-sm font-semibold text-emerald-600 group-hover:text-emerald-700">
              <span>Acessar lista</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card Consultas */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4 opacity-60">
            <div className="p-4 bg-purple-100 text-purple-600 rounded-lg">
              <Calendar className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-slate-500 font-medium">Consultas Agendadas</p>
              <p className="text-xl font-bold text-slate-800">Em Breve</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}