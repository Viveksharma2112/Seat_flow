import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { authService } from '../services';

const AuthContext = createContext(null);
const TOKEN_KEY = 'seatflow_token';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sessionExpired, setSessionExpired] = useState(false);

  useEffect(() => {
    const init = async () => {
      const token = localStorage.getItem(TOKEN_KEY);
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const { data } = await authService.getMe();
        setUser(data.user);
        setSessionExpired(false);
      } catch {
        localStorage.removeItem(TOKEN_KEY);
        setUser(null);
        setSessionExpired(true);
      } finally {
        setLoading(false);
      }
    };
    init();
  }, []);

  const login = async (credentials) => {
    const { data } = await authService.login(credentials);
    localStorage.setItem(TOKEN_KEY, data.token);
    setUser(data.user);
    setSessionExpired(false);
    return data.user;
  };

  const register = async (payload) => {
    const { data } = await authService.register(payload);
    localStorage.setItem(TOKEN_KEY, data.token);
    setUser(data.user);
    setSessionExpired(false);
    return data.user;
  };

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
    setUser(null);
    setSessionExpired(false);
  };

  const value = useMemo(
    () => ({
      user,
      loading,
      sessionExpired,
      login,
      register,
      logout,
      isAdmin: user?.role === 'Admin',
    }),
    [user, loading, sessionExpired]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
