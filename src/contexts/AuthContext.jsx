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
    // Initialiser l'authentification au démarrage
    initializeAuth();
  }, []);

  const initializeAuth = () => {
    try {
      // Vérifier si l'utilisateur est déjà connecté
      if (authService.isAuthenticated()) {
        const currentUser = authService.getCurrentUser();
        setUser(currentUser);
      }
    } catch (error) {
      console.error('Erreur lors de l\'initialisation de l\'authentification:', error);
    } finally {
      setLoading(false);
    }
  };

  const login = async (username, password) => {
    try {
      const result = await authService.login(username, password);
      
      if (result.success) {
        setUser(result.user);
        return result;
      } else {
        return result;
      }
    } catch (error) {
      console.error('Erreur lors de la connexion:', error);
      return {
        success: false,
        message: 'Erreur de connexion au serveur'
      };
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  const isAuthenticated = () => {
    return authService.isAuthenticated();
  };

  const isAdmin = () => {
    return authService.isAdmin();
  };

  const isSubprovider = () => {
    return authService.isSubprovider();
  };

  const isPartner = () => {
    return authService.isPartner();
  };

  const isUser = () => {
    const result = authService.isUser();
    console.log('🔍 isUser() appelé:', result);
    console.log('🔍 User actuel:', user);
    console.log('🔍 Rôle détecté:', user?.role);
    return result;
  };

  const getDisplayName = () => {
    return authService.getDisplayName();
  };

  const getAccountInfo = () => {
    return authService.getAccountInfo();
  };

  const value = {
    user,
    loading,
    login,
    logout,
    isAuthenticated,
    isAdmin,
    isSubprovider,
    isPartner,
    isUser,
    getDisplayName,
    getAccountInfo
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 