import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import * as authApi from '../api/authApi';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('token'));
  const [role, setRole] = useState(() => localStorage.getItem('tokenRole'));
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const clearAuth = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('tokenRole');
    setToken(null);
    setRole(null);
    setUser(null);
    setIsAuthenticated(false);
  }, []);

  const verifyAuth = useCallback(async () => {
    const storedToken = localStorage.getItem('token');
    if (!storedToken) {
      setIsLoading(false);
      return;
    }

    try {
      const response = await authApi.verifyToken();
      if (response.data.valid) {
        const payload = response.data.payload;
        setToken(storedToken);
        setRole(payload.role);
        setUser(payload);
        setIsAuthenticated(true);
      } else {
        clearAuth();
      }
    } catch {
      clearAuth();
    } finally {
      setIsLoading(false);
    }
  }, [clearAuth]);

  useEffect(() => {
    verifyAuth();
  }, [verifyAuth]);

  const adminLogin = async (storeIdentifier, username, password) => {
    const response = await authApi.adminLogin(storeIdentifier, username, password);
    const { token: newToken, admin } = response.data;

    localStorage.setItem('token', newToken);
    localStorage.setItem('tokenRole', 'admin');

    setToken(newToken);
    setRole('admin');
    setUser({ ...admin, role: 'admin' });
    setIsAuthenticated(true);

    return response.data;
  };

  const tableLogin = async (storeIdentifier, tableNumber, password) => {
    const response = await authApi.tableLogin(storeIdentifier, tableNumber, password);
    const { token: newToken, table, sessionId } = response.data;

    localStorage.setItem('token', newToken);
    localStorage.setItem('tokenRole', 'table');
    localStorage.setItem('storeId', storeIdentifier);
    localStorage.setItem('tableNumber', String(tableNumber));
    localStorage.setItem('tablePassword', password);
    localStorage.setItem('sessionId', String(sessionId));

    setToken(newToken);
    setRole('table');
    setUser({ ...table, sessionId, role: 'table' });
    setIsAuthenticated(true);

    return response.data;
  };

  const logout = () => {
    const currentRole = role;
    clearAuth();
    localStorage.removeItem('sessionId');
    if (currentRole === 'admin') {
      localStorage.removeItem('storeId');
    }
  };

  const value = {
    token,
    role,
    user,
    isAuthenticated,
    isLoading,
    adminLogin,
    tableLogin,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
