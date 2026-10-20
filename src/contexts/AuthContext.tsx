import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';
import { api } from '../services/api';
import type { RespostaLogin } from '../types';

interface AuthContextType {
  authenticated: boolean;
  login: (loginInput: string, senhaInput: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem('@Agendamento:token');
  });
  const [loading, setLoading] = useState(false);

  const login = async (loginInput: string, senhaInput: string) => {
    setLoading(true);
    try {
      const response = await api.post<RespostaLogin>('/login', {
        login: loginInput,
        senha: senhaInput,
      });

      const { token: tokenRecebido } = response.data;

      localStorage.setItem('@Agendamento:token', tokenRecebido);
      setToken(tokenRecebido);
    } catch (error) {
      console.error('Erro na autenticação:', error);
      throw new Error('Usuário ou senha inválidos');
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('@Agendamento:token');
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ authenticated: !!token, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);