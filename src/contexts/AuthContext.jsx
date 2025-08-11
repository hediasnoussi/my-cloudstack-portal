import React, { createContext, useContext, useState, useEffect } from 'react';
import authService from '../services/authService';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Vérifier si l'utilisateur est déjà connecté au chargement
    const currentUser = authService.getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
    }
    setLoading(false);
  }, []);

  const login = async (username, password) => {
    setLoading(true);
    try {
      const result = await authService.login(username, password);
      if (result.success) {
        setUser(result.user);
        return { success: true };
      } else {
        return { success: false, error: result.error };
      }
    } catch (error) {
      return { success: false, error: 'Erreur de connexion' };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  const isAuthenticated = () => {
    return user !== null;
  };

  const isSubprovider = () => {
    return user && user.role === 'subprovider';
  };

  const isAgent = () => {
    return user && user.role === 'agent';
  };

  const getDisplayName = () => {
    if (!user) return 'Utilisateur';
    if (user.role === 'agent') return 'Partenaire';
    if (user.role === 'subprovider') return 'Subprovider';
    return user.displayName || user.username || user.email;
  };

  const getAccountInfo = () => {
    return user?.account_name || 'Aucun compte';
  };

  const value = {
    user,
    loading,
    login,
    logout,
    isAuthenticated,
    isSubprovider,
    isAgent,
    getDisplayName,
    getAccountInfo
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 