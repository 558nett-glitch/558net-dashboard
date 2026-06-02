import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AuthUser } from '../types';

interface AuthContextType {
  user: AuthUser | null;
  login: (username: string, password: string, rememberMe: boolean) => boolean;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

const CREDENTIALS = {
  username: 'admin',
  password: '558net',
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    const stored = sessionStorage.getItem('558net_user') || localStorage.getItem('558net_user');
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch {
        sessionStorage.removeItem('558net_user');
        localStorage.removeItem('558net_user');
      }
    }
  }, []);

  const login = (username: string, password: string, rememberMe: boolean): boolean => {
    if (username === CREDENTIALS.username && password === CREDENTIALS.password) {
      const authUser: AuthUser = {
        username,
        loginTime: new Date().toISOString(),
        rememberMe,
      };
      setUser(authUser);
      if (rememberMe) {
        localStorage.setItem('558net_user', JSON.stringify(authUser));
      } else {
        sessionStorage.setItem('558net_user', JSON.stringify(authUser));
      }
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    sessionStorage.removeItem('558net_user');
    localStorage.removeItem('558net_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
