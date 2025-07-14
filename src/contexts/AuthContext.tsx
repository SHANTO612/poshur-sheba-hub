import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../types/common';
import authService from '../services/auth';

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (userData: User, token: string) => void;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedToken = authService.getToken();
    const storedUser = authService.getUser();
    
    if (storedToken && storedUser) {
      try {
        setToken(storedToken);
        setUser(storedUser);
      } catch (error) {
        console.error('AuthContext: Error parsing stored user:', error);
        authService.logout();
      }
    }
    setIsLoading(false);
  }, []);

  const login = (userData: User, token: string) => {
    authService.setToken(token);
    authService.setUser(userData);
    setToken(token);
    setUser(userData);
  };

  const logout = () => {
    authService.logout();
    setToken(null);
    setUser(null);
  };

  const isAuthenticated = !!token;

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isAuthenticated, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};