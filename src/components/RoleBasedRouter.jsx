import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Box, CircularProgress, Typography, Alert } from '@mui/material';
import UserNavigation from './UserNavigation';
import UserDashboard from '../pages/UserDashboard';

const RoleBasedRouter = ({ children }) => {
  const { user, isAuthenticated, isAdmin, isSubprovider, isUser, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isRouting, setIsRouting] = useState(true);

  useEffect(() => {
    if (!loading) {
      handleRouting();
    }
  }, [loading, user, location.pathname]);

  const handleRouting = () => {
    if (!isAuthenticated()) {
      // Utilisateur non connecté, rediriger vers la page de connexion
      if (location.pathname !== '/login') {
        navigate('/login');
      }
      setIsRouting(false);
      return;
    }

    // Utilisateur connecté, vérifier le rôle et la route
    if (isUser()) {
      // Utilisateur normal
      if (location.pathname === '/' || location.pathname === '/dashboard') {
        // Rediriger vers le tableau de bord utilisateur
        navigate('/user-dashboard');
        setIsRouting(false);
        return;
      }
      
      // Si l'utilisateur est sur une route admin, le rediriger
      if (location.pathname.startsWith('/admin') || 
          location.pathname.startsWith('/subprovider') ||
          location.pathname === '/instances' ||
          location.pathname === '/projects' ||
          location.pathname === '/quotas') {
        navigate('/user-dashboard');
        setIsRouting(false);
        return;
      }
    } else if (isAdmin() || isSubprovider()) {
      // Admin ou subprovider, rediriger vers le tableau de bord admin
      if (location.pathname === '/' || location.pathname === '/user-dashboard') {
        navigate('/dashboard');
        setIsRouting(false);
        return;
      }
    }

    setIsRouting(false);
  };

  // Affichage de chargement pendant la vérification du routage
  if (loading || isRouting) {
    return (
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
      >
        <CircularProgress size={60} />
        <Typography variant="h6" sx={{ mt: 2 }}>
          Vérification des autorisations...
        </Typography>
      </Box>
    );
  }

  // Si l'utilisateur est connecté et est un utilisateur normal
  if (isAuthenticated() && isUser()) {
    // Vérifier si on est sur une route utilisateur
    if (location.pathname.startsWith('/user-') || location.pathname === '/user-dashboard') {
      return (
        <UserNavigation>
          {location.pathname === '/user-dashboard' && <UserDashboard />}
          {/* Ajouter d'autres routes utilisateur ici */}
          {children}
        </UserNavigation>
      );
    }
  }

  // Pour les admins/subproviders ou routes non protégées
  return children;
};

export default RoleBasedRouter;
