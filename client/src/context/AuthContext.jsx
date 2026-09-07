import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authApi, usersApi } from '../utils/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    authApi.me()
      .then((res) => setUser(res.data.user))
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  const register = async (credentials) => {
    const res = await authApi.register(credentials);
    setUser(res.data.user);
    return res.data;
  };

  const login = async (credentials) => {
    const res = await authApi.login(credentials);
    setUser(res.data.user);
    return res.data;
  };

  const logout = async () => {
    await authApi.logout();
    setUser(null);
  };

  const updateUser = (updates) => {
    setUser(prev => prev ? { ...prev, ...updates } : prev);
  };

  const saveProperty = useCallback(async (propertyId) => {
    if (!user) return false;
    try {
      await usersApi.saveProperty(propertyId);
      setUser(prev => ({
        ...prev,
        savedProperties: [...(prev.savedProperties || []), { _id: propertyId }],
      }));
      return true;
    } catch { return false; }
  }, [user]);

  const unsaveProperty = useCallback(async (propertyId) => {
    if (!user) return false;
    try {
      await usersApi.unsaveProperty(propertyId);
      setUser(prev => ({
        ...prev,
        savedProperties: (prev.savedProperties || []).filter(p =>
          (p._id || p) !== propertyId
        ),
      }));
      return true;
    } catch { return false; }
  }, [user]);

  const isSaved = useCallback((propertyId) => {
    if (!user?.savedProperties) return false;
    return user.savedProperties.some(p => (p._id || p)?.toString() === propertyId?.toString());
  }, [user]);

  const isAdmin = user?.role === 'admin' || user?.role === 'superadmin';
  const isUser  = !!user;

  return (
    <AuthContext.Provider value={{
      user, loading,
      isAuthenticated: isUser,
      isAdmin,
      register, login, logout,
      updateUser, saveProperty, unsaveProperty, isSaved,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
