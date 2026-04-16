import { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../api';

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (stored) {
      try { setUser(JSON.parse(stored)); } catch { localStorage.removeItem('user'); }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const res = await authAPI.login({ email, password });
      if (res.data.success) {
        const { token, ...userData } = res.data.data;
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);
        return { success: true };
      }
      return { success: false, message: res.data.message };
    } catch (err) {
      return { success: false, message: err.response?.data?.message || 'Đăng nhập thất bại' };
    }
  };

  const register = async (data) => {
    try {
      const res = await authAPI.register(data);
      return res.data;
    } catch (err) {
      return { success: false, message: err.response?.data?.message || 'Đăng ký thất bại' };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  const refreshProfile = async () => {
    try {
      const res = await authAPI.profile();
      if (res.data.success) {
        const profileData = res.data.data;
        // Preserve role from original login (profile API may not return role in same format)
        const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
        const merged = { ...storedUser, ...profileData };
        localStorage.setItem('user', JSON.stringify(merged));
        setUser(merged);
      }
    } catch {}
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, refreshProfile, isAdmin: user?.role === 'Admin' }}>
      {children}
    </AuthContext.Provider>
  );
}
