import React, { createContext, useContext, useState, useEffect } from 'react';
import * as authService from '../services/authService';
import { getStoredToken, clearStoredAuth } from '../api/client';

const ROLE_SUPER_ADMIN = 'admin';
const ROLE_MEMBER = 'user';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = getStoredToken();
    if (!token) {
      clearStoredAuth();
      setUser(null);
      setLoading(false);
      return;
    }
    authService.getMe()
      .then((fetched) => {
        const normalized = {
          ...fetched,
          role: fetched.role || ROLE_MEMBER,
          roleType: fetched.roleType,
          phone: fetched.phone,
        };
        setUser(normalized);
      })
      .catch(() => {
        clearStoredAuth();
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  const loginAsSuperAdmin = () => { /* used only when API not used; real admin uses adminLogin */ };
  const loginAsMember = (memberData = {}) => {
    setUser({ role: ROLE_MEMBER, ...memberData });
  };

  const login = async (email, password) => {
    const { user: u} = await authService.login(email, password);
    setUser({ ...u, role: u.role || ROLE_MEMBER });
    return u;
  };

  const adminLogin = async (email, password) => {
    const { user: u} = await authService.adminLogin(email, password);
    setUser({ ...u, role: u.role || ROLE_SUPER_ADMIN });
    return u;
  };

  const signup = async (name, email, password, roleType, phone) => {
    const { user: u} = await authService.signup(name, email, password, roleType, phone);
    setUser({ ...u, role: u.role || ROLE_MEMBER });
    return u;
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  const isSuperAdmin = user?.role === ROLE_SUPER_ADMIN;
  const isLoggedIn = !!user;
  const isAuthenticated = isLoggedIn;
  const role = user?.role ?? null;
  const token = getStoredToken();

  const value = {
    user,
    token,
    isAuthenticated,
    role,
    loading,
    isSuperAdmin,
    isLoggedIn,
    loginAsSuperAdmin,
    loginAsMember,
    login,
    adminLogin,
    signup,
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
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
