import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../api/client';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('salon1995_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState(() => 
    localStorage.getItem('salon1995_access_token') || localStorage.getItem('salon1995_token')
  );
  const [refreshToken, setRefreshToken] = useState(() => 
    localStorage.getItem('salon1995_refresh_token')
  );
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const handleAuthChange = () => {
      setUser(null);
      setToken(null);
      setRefreshToken(null);
    };
    window.addEventListener('auth-changed', handleAuthChange);
    return () => window.removeEventListener('auth-changed', handleAuthChange);
  }, []);

  const saveAuthSession = (authData) => {
    const accessToken = authData.accessToken || authData.token;
    const refToken = authData.refreshToken;

    localStorage.setItem('salon1995_token', accessToken);
    localStorage.setItem('salon1995_access_token', accessToken);
    if (refToken) {
      localStorage.setItem('salon1995_refresh_token', refToken);
      setRefreshToken(refToken);
    }
    localStorage.setItem('salon1995_user', JSON.stringify(authData.user));

    setToken(accessToken);
    setUser(authData.user);
  };

  const login = async (username, password) => {
    setLoading(true);
    try {
      const res = await api.auth.login(username, password);
      saveAuthSession(res);
      return res.user;
    } finally {
      setLoading(false);
    }
  };

  const register = async (payload) => {
    setLoading(true);
    try {
      const res = await api.auth.register(payload);
      return res;
    } finally {
      setLoading(false);
    }
  };


  const logout = async () => {
    const currentRefreshToken = localStorage.getItem('salon1995_refresh_token');
    if (currentRefreshToken) {
      try {
        await api.auth.revokeToken(currentRefreshToken);
      } catch (err) {
        console.warn('Revoke token failed or already expired', err);
      }
    }
    localStorage.removeItem('salon1995_token');
    localStorage.removeItem('salon1995_access_token');
    localStorage.removeItem('salon1995_refresh_token');
    localStorage.removeItem('salon1995_user');
    setToken(null);
    setRefreshToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, refreshToken, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

