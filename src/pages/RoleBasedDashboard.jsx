import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.jsx';
import { useTranslation } from 'react-i18next';
import quotaService from '../services/quotaService';
import hierarchyService from '../services/hierarchyService';
import cloudstackService from '../services/cloudstackService';

const RoleBasedDashboard = () => {
  const { user, isAuthenticated } = useAuth();
  const { t } = useTranslation();
  const location = useLocation();
  const [quotas, setQuotas] = useState(null);
  const [userHierarchy, setUserHierarchy] = useState([]);
  const [vpsList, setVpsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [demoMode, setDemoMode] = useState(false);
  const [apiFailed, setApiFailed] = useState(false);
  const [lastApiAttempt, setLastApiAttempt] = useState(0);

  // Gestionnaire global des erreurs non capturées
  useEffect(() => {
    const handleUnhandledRejection = (event) => {
      console.error('Erreur Promise non gérée:', event.reason);
      
      // Ignorer les erreurs d'extensions de navigateur
      if (event.reason && event.reason.message && 
          (event.reason.message.includes('extensionAdapter') || 
           event.reason.message.includes('content.js') ||
           event.reason.message.includes('background page'))) {
        console.log('Erreur d\'extension ignorée:', event.reason.message);
        return;
      }
      
      // Vérifier si c'est une erreur 403
      if (event.reason && (event.reason.code === 403 || event.reason.httpStatus === 403)) {
        console.warn('Erreur 403 détectée - Utilisation des valeurs par défaut');
        setError('Accès refusé - Affichage des données par défaut');
        setDemoMode(true);
        setApiFailed(true);
      } else {
        setError('Une erreur inattendue s\'est produite');
      }
    };

    const handleError = (event) => {
      console.error('Erreur JavaScript:', event.error);
      
      // Ignorer les erreurs d'extensions
      if (event.error && event.error.message && 
          (event.error.message.includes('extensionAdapter') || 
           event.error.message.includes('content.js'))) {
        console.log('Erreur d\'extension ignorée:', event.error.message);
        return;
      }
      
      setError('Erreur JavaScript détectée');
    };

    // Ajouter les écouteurs d'événements
    window.addEventListener('unhandledrejection', handleUnhandledRejection);
    window.addEventListener('error', handleError);

    // Nettoyage
    return () => {
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
      window.removeEventListener('error', handleError);
    };
  }, []);

  useEffect(() => {
    console.log('🔍 RoleBasedDashboard useEffect - location.state:', location.state);
    console.log('🔍 vpsList actuelle:', vpsList);
    
    if (isAuthenticated && user) {
      loadDashboardData();
    }
  }, [isAuthenticated, user]);

  // Gérer l'ajout d'un nouveau VPS après création
  useEffect(() => {
    console.log('🔍 RoleBasedDashboard useEffect - location.state:', location.state);
    console.log('🔍 vpsList actuelle:', vpsList);
    
    if (location.state?.vpsCreated) {
      console.log('✅ VPS créé détecté !');
      const { vpsName, template, computeOffering, startInstance } = location.state;
      console.log('📋 Données VPS:', { vpsName, template, computeOffering, startInstance });
      
      // Vérifier si ce VPS n'existe pas déjà (éviter la duplication)
      const vpsExists = vpsList.some(vps => vps.name === vpsName);
      if (vpsExists) {
        console.log('⚠️ VPS déjà existant, ignoré:', vpsName);
        // Nettoyer l'état de navigation même si le VPS existe déjà
        window.history.replaceState({}, document.title);
        return;
      }
      
      // Créer un nouveau VPS avec les informations reçues
      const newVps = {
        id: Date.now(), // ID unique temporaire
        name: vpsName,
        status: startInstance ? 'running' : 'stopped',
        cpu: computeOffering === 'Small Instance' ? 1 : computeOffering === 'Medium Instance' ? 2 : 4,
        ram: computeOffering === 'Small Instance' ? 2 : computeOffering === 'Medium Instance' ? 4 : 8,
        storage: 50, // Valeur par défaut
        ip: `192.168.1.${Math.floor(Math.random() * 100) + 200}`, // IP aléatoire
        os: template || 'Ubuntu Linux (64-bit)',
        created: new Date().toISOString().split('T')[0], // Date d'aujourd'hui
        owner: user?.username || 'unknown' // Ajouter le propriétaire
      };
      
      console.log('🆕 Nouveau VPS créé:', newVps);
      
      // Ajouter le nouveau VPS à la liste
      setVpsList(prevList => {
        const newList = [newVps, ...prevList];
        console.log('📝 Nouvelle liste VPS:', newList);
        return newList;
      });
      
      // Mettre à jour les quotas
      if (quotas) {
        setQuotas(prev => ({
          ...prev,
          used_vps: prev.used_vps + 1,
          used_cpu: prev.used_cpu + newVps.cpu,
          used_ram: prev.used_ram + newVps.ram,
          used_storage: prev.used_storage + newVps.storage
        }));
      }
      
      // Afficher une notification de succès
      setSnackbar({
        open: true,
        message: `VPS "${vpsName}" créé avec succès !`,
        severity: 'success'
      });
      
      // Nettoyer l'état de navigation IMMÉDIATEMENT
      window.history.replaceState({}, document.title);
    }
  }, [location.state]); // Supprimé 'quotas' et 'user' des dépendances

  // Fonction helper pour obtenir les quotas par défaut
  const getDefaultQuotas = (role) => {
    switch (role) {
      case 'admin':
        return { max_vps: 10000, max_cpu: 10000, max_ram: 100000, max_storage: 1000000, used_vps: 0, used_cpu: 0, used_ram: 0, used_storage: 0 };
      case 'subprovider':
        return { max_vps: 1000, max_cpu: 1000, max_ram: 10000, max_storage: 100000, used_vps: 0, used_cpu: 0, used_ram: 0, used_storage: 0 };
      case 'partner':
        return { max_vps: 100, max_cpu: 100, max_ram: 1000, max_storage: 10000, used_vps: 0, used_cpu: 0, used_ram: 0, used_storage: 0 };
      case 'user':
        return { max_vps: 10, max_cpu: 10, max_ram: 100, max_storage: 1000, used_vps: 0, used_cpu: 0, used_ram: 0, used_storage: 0 };
      default:
        return { max_vps: 10, max_cpu: 10, max_ram: 100, max_storage: 1000, used_vps: 0, used_cpu: 0, used_ram: 0, used_storage: 0 };
    }
  };

  const loadDashboardData = async () => {
    try {
      // Vérifier si on a déjà échoué récemment
      const now = Date.now();
      if (apiFailed && (now - lastApiAttempt) < 30000) { // 30 secondes de cooldown
        console.log('API a échoué récemment, utilisation du mode démo');
        setDemoMode(true);
        setQuotas(getDefaultQuotas(user.role));
        setUserHierarchy([]);
        setLoading(false);
        return;
      }
      
      setLoading(true);
      setError(null); // Réinitialiser les erreurs
      setLastApiAttempt(now);
      
      // Charger les quotas depuis l'API avec timeout ultra-court
      try {
        const quotasPromise = quotaService.getMyQuotas();
        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Timeout: API non accessible')), 2000) // 2 secondes seulement
        );
        
        const quotasResponse = await Promise.race([quotasPromise, timeoutPromise]);
        
        // Vérifier le code de statut HTTP
        if (quotasResponse && quotasResponse.code === 403) {
          console.warn('Accès refusé (403) - Utilisation des valeurs par défaut');
          setQuotas(getDefaultQuotas(user.role));
          setDemoMode(true);
        } else if (quotasResponse && quotasResponse.success) {
          setQuotas(quotasResponse.data);
          setDemoMode(false);
        } else {
          console.warn('Aucun quota trouvé, utilisation des valeurs par défaut');
          setQuotas(getDefaultQuotas(user.role));
          setDemoMode(true);
        }
      } catch (error) {
        console.error('Erreur lors du chargement des quotas:', error);
        
        // Gestion spécifique des erreurs 403 et timeout
        if (error.code === 403 || error.httpStatus === 403) {
          console.warn('Accès refusé (403) - Utilisation des valeurs par défaut');
        } else if (error.message && error.message.includes('Timeout')) {
          console.warn('API non accessible - Mode démo activé');
        }
        
        // Valeurs par défaut en cas d'erreur
        setQuotas(getDefaultQuotas(user.role));
        setDemoMode(true);
        setApiFailed(true);
      }

      // Charger la hiérarchie utilisateur depuis l'API (si applicable)
      if (user.role === 'subprovider' || user.role === 'partner') {
        try {
          const hierarchyPromise = hierarchyService.getMyHierarchy();
          const timeoutPromise = new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Timeout: API hiérarchie non accessible')), 2000) // 2 secondes seulement
          );
          
          const hierarchyResponse = await Promise.race([hierarchyPromise, timeoutPromise]);
          
          // Vérifier le code de statut HTTP
          if (hierarchyResponse && hierarchyResponse.code === 403) {
            console.warn('Accès refusé (403) pour la hiérarchie - Utilisation de liste vide');
            setUserHierarchy([]);
          } else if (hierarchyResponse && hierarchyResponse.success) {
            setUserHierarchy(hierarchyResponse.data);
          } else {
            console.warn('Aucune hiérarchie trouvée');
            setUserHierarchy([]);
          }
        } catch (error) {
          console.error('Erreur lors du chargement de la hiérarchie:', error);
          
          // Gestion spécifique des erreurs 403 et timeout
          if (error.code === 403 || error.httpStatus === 403) {
            console.warn('Accès refusé (403) pour la hiérarchie - Utilisation de liste vide');
          } else if (error.message && error.message.includes('Timeout')) {
            console.warn('API hiérarchie non accessible - Utilisation de liste vide');
          }
          
          setUserHierarchy([]);
        }
      } else {
        setUserHierarchy([]);
      }

      // Charger les vraies données CloudStack
      try {
        console.log('🔄 Chargement des instances CloudStack...');
        const cloudstackVMs = await cloudstackService.getVirtualMachines();
        console.log('✅ Instances CloudStack récupérées:', cloudstackVMs);
        
        // Transformer les données CloudStack en format compatible
        const transformedVMs = cloudstackVMs.map(vm => ({
          id: vm.id,
          name: vm.name || vm.displayname,
          status: vm.state === 'Running' ? 'running' : vm.state === 'Stopped' ? 'stopped' : 'error',
          cpu: vm.cpunumber || 1,
          ram: vm.memory || 512,
          storage: 50, // Valeur par défaut car pas dans l'API CloudStack
          ip: vm.nic?.[0]?.ipaddress || 'N/A',
          os: vm.templatename || 'Unknown',
          created: new Date(vm.created).toISOString().split('T')[0],
          zone: vm.zonename,
          template: vm.templatename,
          owner: vm.account || 'unknown'
        }));
        
        setVpsList(transformedVMs);
        console.log('✅ VPS CloudStack transformés:', transformedVMs);
      } catch (error) {
        console.error('❌ Erreur lors du chargement des instances CloudStack:', error);
        // En cas d'erreur, utiliser une liste vide
        setVpsList([]);
      }

      setLoading(false);
    } catch (error) {
      console.error('Erreur lors du chargement des données:', error);
      setError('Erreur lors du chargement des données du dashboard');
      setLoading(false);
    }
  };

  // Fonction pour obtenir le nom d'affichage du rôle
  const getRoleDisplayName = (role) => {
    switch (role) {
      case 'admin':
        return 'Administrateur';
      case 'subprovider':
        return 'Fournisseur Secondaire';
      case 'partner':
        return 'Partenaire';
      case 'user':
        return 'Client Final';
      default:
        return 'Utilisateur';
    }
  };

  // Fonction pour obtenir la couleur du rôle
  const getRoleColor = (role) => {
    switch (role) {
      case 'admin':
        return 'red';
      case 'subprovider':
        return 'blue';
      case 'partner':
        return 'green';
      case 'user':
        return 'orange';
      default:
        return 'grey';
    }
  };

  // Fonction pour obtenir le statut du VPS
  const getVpsStatus = (status) => {
    switch (status) {
      case 'running':
        return { text: 'En cours', color: 'bg-gray-500', textColor: 'text-gray-500' };
      case 'stopped':
        return { text: 'Arrêté', color: 'bg-red-500', textColor: 'text-red-500' };
      case 'starting':
        return { text: 'Démarrage', color: 'bg-gray-500', textColor: 'text-gray-500' };
      case 'stopping':
        return { text: 'Arrêt', color: 'bg-gray-500', textColor: 'text-gray-500' };
      default:
        return { text: 'Inconnu', color: 'bg-gray-500', textColor: 'text-gray-500' };
    }
  };

  // Fonction pour filtrer la liste des VPS selon le rôle
  const getFilteredVpsList = () => {
    if (!user || !vpsList) {
      return [];
    }
    
    let filteredList = [];
    
    switch (user.role) {
      case 'subprovider':
        // Subprovider : Vue globale sur TOUS les VPS
        filteredList = vpsList;
        console.log('🔍 Subprovider - Vue globale, VPS trouvés:', filteredList.length);
        break;
        
      case 'partner':
        // Partenaire : Vue restreinte sur SES VPS uniquement
        filteredList = vpsList.filter(vps => vps.owner === user.username);
        console.log('🔍 Partner - Vue restreinte, VPS trouvés:', filteredList.length);
        break;
        
      case 'user':
        // Client final : Vue ultra-limitée sur SES VPS uniquement
        filteredList = vpsList.filter(vps => vps.owner === user.username);
        console.log('🔍 User - Vue limitée, VPS trouvés:', filteredList.length);
        break;
        
      default:
        filteredList = [];
        console.log('❌ Rôle non reconnu:', user.role);
    }
    
    console.log('✅ Liste filtrée finale:', filteredList);
    return filteredList;
  };

  // Fonction pour obtenir le titre du dashboard selon le rôle
  const getDashboardTitle = () => {
    if (!user) return 'Dashboard';
    
    switch (user.role) {
      case 'subprovider':
        return 'Dashboard - Fournisseur Secondaire';
      case 'partner':
        return 'Dashboard - Partenaire';
      case 'user':
        return 'Dashboard - Client Final';
      default:
        return 'Dashboard';
    }
  };

  // Fonction pour obtenir la description selon le rôle
  const getDashboardDescription = () => {
    if (!user) return '';
    
    switch (user.role) {
      case 'subprovider':
        return 'Bienvenue ! Vous avez une vue globale sur tous les VPS de votre infrastructure.';
      case 'partner':
        return 'Bienvenue ! Vous gérez vos VPS et ceux de vos clients.';
      case 'user':
        return 'Bienvenue ! Vous gérez uniquement vos VPS personnels.';
      default:
        return '';
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-96">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500"></div>
        <p className="mt-4 text-lg text-slate-600 dark:text-slate-400">Chargement du dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center min-h-96">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 max-w-md">
          <div className="flex items-center">
            <i className="fas fa-exclamation-triangle mr-2"></i>
            <span className="font-semibold">Erreur de chargement</span>
          </div>
          <p className="mt-2 text-sm">{error}</p>
        </div>
        <div className="flex space-x-3">
          <button 
            onClick={loadDashboardData}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-colors duration-200"
          >
            <i className="fas fa-redo mr-2"></i>
          Réessayer
          </button>
          <button 
            onClick={() => window.location.reload()}
            className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded transition-colors duration-200"
          >
            <i className="fas fa-refresh mr-2"></i>
            Actualiser la page
          </button>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="flex justify-center items-center min-h-96">
        <p className="text-lg text-slate-600 dark:text-slate-400">
          Veuillez vous connecter pour accéder au dashboard
        </p>
      </div>
    );
  }

  return (
    <div className="w-full px-6 py-6 mx-auto">
      {/* En-tête du dashboard */}
      <div className="flex flex-wrap justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">
            {getDashboardTitle()}
          </h1>
          <p className="text-white">
            Bienvenue, {user.username} ! Gérez vos ressources et votre infrastructure.
          </p>
          

        </div>
        <div className="flex space-x-2">
          <button
          onClick={loadDashboardData}
          disabled={loading}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-lg disabled:opacity-50 disabled:hover:scale-100 disabled:hover:shadow-none"
        >
            <i className="fas fa-sync-alt mr-2"></i>
          Actualiser
          </button>
          

        </div>
      </div>

      {/* Cartes de quotas - Style Argon Dashboard */}
      <div className="flex flex-wrap -mx-3 mb-8">
        {/* Carte VPS */}
        <div className="w-full max-w-full px-3 mb-6 sm:w-1/2 sm:flex-none xl:mb-0 xl:w-1/4">
          <div className="relative flex flex-col min-w-0 break-words bg-white shadow-xl dark:bg-slate-850 dark:shadow-dark-xl rounded-2xl bg-clip-border transition-all duration-300 ease-in-out hover:transform hover:scale-105 hover:shadow-2xl hover:-translate-y-1 cursor-pointer">
            <div className="flex-auto p-4">
              <div className="flex flex-row -mx-3">
                <div className="flex-none w-2/3 max-w-full px-3">
                  <div>
                    <p className="mb-0 font-sans text-sm font-semibold leading-normal uppercase dark:text-white dark:opacity-60">VPS Actifs</p>
                    <h5 className="mb-2 font-bold dark:text-white">{quotas?.used_vps || 0}</h5>
                    <p className="mb-0 dark:text-white dark:opacity-60">
                      <span className="text-sm font-bold leading-normal text-emerald-500">
                        {quotas ? Math.round((quotas.used_vps / quotas.max_vps) * 100) : 0}%
                      </span>
                      de la limite
                    </p>
                  </div>
                </div>
                <div className="px-3 text-right basis-1/3">
                  <div className="inline-block w-12 h-12 text-center rounded-circle bg-gray-500 transition-all duration-300 hover:bg-gray-600">
                    <i className="fas fa-server text-lg relative top-3.5 text-white"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Carte CPU */}
        <div className="w-full max-w-full px-3 mb-6 sm:w-1/2 sm:flex-none xl:mb-0 xl:w-1/4">
          <div className="relative flex flex-col min-w-0 break-words bg-white shadow-xl dark:bg-slate-850 dark:shadow-dark-xl rounded-2xl bg-clip-border transition-all duration-300 ease-in-out hover:transform hover:scale-105 hover:shadow-2xl hover:-translate-y-1 cursor-pointer">
            <div className="flex-auto p-4">
              <div className="flex flex-row -mx-3">
                <div className="flex-none w-2/3 max-w-full px-3">
                  <div>
                    <p className="mb-0 font-sans text-sm font-semibold leading-normal uppercase dark:text-white dark:opacity-60">CPU Utilisés</p>
                    <h5 className="mb-2 font-bold dark:text-white">{quotas?.used_cpu || 0}</h5>
                    <p className="mb-0 dark:text-white dark:opacity-60">
                      <span className="text-sm font-bold leading-normal text-emerald-500">
                        {quotas ? Math.round((quotas.used_cpu / quotas.max_cpu) * 100) : 0}%
                      </span>
                      de la limite
                    </p>
                  </div>
                </div>
                <div className="px-3 text-right basis-1/3">
                  <div className="inline-block w-12 h-12 text-center rounded-circle bg-gray-500 transition-all duration-300 hover:bg-gray-600">
                    <i className="fas fa-microchip text-lg relative top-3.5 text-white"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Carte RAM */}
        <div className="w-full max-w-full px-3 mb-6 sm:w-1/2 sm:flex-none xl:mb-0 xl:w-1/4">
          <div className="relative flex flex-col min-w-0 break-words bg-white shadow-xl dark:bg-slate-850 dark:shadow-dark-xl rounded-2xl bg-clip-border transition-all duration-300 ease-in-out hover:transform hover:scale-105 hover:shadow-2xl hover:-translate-y-1 cursor-pointer">
            <div className="flex-auto p-4">
              <div className="flex flex-row -mx-3">
                <div className="flex-none w-2/3 max-w-full px-3">
                  <div>
                    <p className="mb-0 font-sans text-sm font-semibold leading-normal uppercase dark:text-white dark:opacity-60">RAM Utilisée</p>
                    <h5 className="mb-2 font-bold dark:text-white">{quotas?.used_ram || 0} GB</h5>
                    <p className="mb-0 dark:text-white dark:opacity-60">
                      <span className="text-sm font-bold leading-normal text-emerald-500">
                        {quotas ? Math.round((quotas.used_ram / quotas.max_ram) * 100) : 0}%
                      </span>
                      de la limite
                    </p>
                  </div>
                </div>
                <div className="px-3 text-right basis-1/3">
                  <div className="inline-block w-12 h-12 text-center rounded-circle bg-gray-500 transition-all duration-300 hover:bg-gray-600">
                    <i className="fas fa-memory text-lg relative top-3.5 text-white"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Carte Stockage */}
        <div className="w-full max-w-full px-3 sm:w-1/2 sm:flex-none xl:w-1/4">
          <div className="relative flex flex-col min-w-0 break-words bg-white shadow-xl dark:bg-slate-850 dark:shadow-dark-xl rounded-2xl bg-clip-border transition-all duration-300 ease-in-out hover:transform hover:scale-105 hover:shadow-2xl hover:-translate-y-1 cursor-pointer">
            <div className="flex-auto p-4">
              <div className="flex flex-row -mx-3">
                <div className="flex-none w-2/3 max-w-full px-3">
                  <div>
                    <p className="mb-0 font-sans text-sm font-semibold leading-normal uppercase dark:text-white dark:opacity-60">Stockage</p>
                    <h5 className="mb-2 font-bold dark:text-white">{quotas?.used_storage || 0} GB</h5>
                    <p className="mb-0 dark:text-white dark:opacity-60">
                      <span className="text-sm font-bold leading-normal text-emerald-500">
                        {quotas ? Math.round((quotas.used_storage / quotas.max_storage) * 100) : 0}%
                      </span>
                      de la limite
                    </p>
                  </div>
                </div>
                <div className="px-3 text-right basis-1/3">
                  <div className="inline-block w-12 h-12 text-center rounded-circle bg-gray-500 transition-all duration-300 hover:bg-gray-600">
                    <i className="fas fa-hdd text-lg relative top-3.5 text-white"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Section Sales Overview - Nouvelle section ajoutée */}
      <div className="flex flex-wrap -mx-3 mb-8">
        <div className="w-full max-w-full px-3 mb-6">
          <div className="border-white/30 dark:shadow-dark-xl shadow-xl relative z-20 flex min-w-0 flex-col break-words rounded-2xl border border-white/30 bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-xl bg-clip-border">
            <div className="border-white/20 mb-0 rounded-t-2xl border-b-0 border-solid p-6 pt-4 pb-0">
              <h6 className="capitalize text-gray-800 text-xl font-semibold">Aperçu des Ventes</h6>
              <p className="mb-0 text-sm leading-normal text-gray-600">
                <i className="fas fa-chart-line text-emerald-500 mr-2"></i>
                Statistiques et métriques de performance
              </p>
            </div>
            <div className="flex-auto p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Métrique 1: Revenus du mois */}
                <div className="text-center p-6 rounded-2xl backdrop-blur-xl bg-white/90 border border-white/50 shadow-2xl transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-3xl hover:bg-white hover:border-white/70 cursor-pointer group">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center backdrop-blur-xl bg-gray-100 border border-gray-200 shadow-lg transition-all duration-300 group-hover:bg-gray-200 group-hover:shadow-xl group-hover:scale-110">
                    <i className="fas fa-euro-sign text-2xl text-gray-700 transition-all duration-300 group-hover:text-gray-800 group-hover:scale-110"></i>
                  </div>
                  <h6 className="text-2xl font-bold text-gray-800 mb-2 transition-all duration-300 group-hover:text-gray-900">€2,450</h6>
                  <p className="text-sm text-gray-600 mb-3 transition-all duration-300 group-hover:text-gray-700">Revenus du mois</p>
                  <div className="flex items-center justify-center">
                    <i className="fas fa-arrow-up text-emerald-500 mr-2 text-lg transition-all duration-300 group-hover:text-emerald-600 group-hover:scale-110"></i>
                    <span className="text-sm text-emerald-600 font-medium transition-all duration-300 group-hover:text-emerald-700">+12.5%</span>
                  </div>
                </div>

                {/* Métrique 2: Nouveaux clients */}
                <div className="text-center p-6 rounded-2xl backdrop-blur-xl bg-white/90 border border-white/50 shadow-2xl hover:bg-white transition-all duration-300 hover:scale-105">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center backdrop-blur-xl bg-gray-100 border border-gray-200 shadow-lg">
                    <i className="fas fa-user-plus text-2xl text-gray-700"></i>
                  </div>
                  <h6 className="text-2xl font-bold text-gray-800 mb-2">24</h6>
                  <p className="text-sm text-gray-600 mb-3">Nouveaux clients</p>
                  <div className="flex items-center justify-center">
                    <i className="fas fa-arrow-up text-emerald-500 mr-2 text-lg"></i>
                    <span className="text-sm text-emerald-600 font-medium">+8.3%</span>
                  </div>
                </div>

                {/* Métrique 3: Taux de conversion */}
                <div className="text-center p-6 rounded-2xl backdrop-blur-xl bg-white/90 border border-white/50 shadow-2xl hover:bg-white transition-all duration-300 hover:scale-105">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center backdrop-blur-xl bg-gray-100 border border-gray-200 shadow-lg">
                    <i className="fas fa-percentage text-2xl text-gray-700"></i>
                  </div>
                  <h6 className="text-2xl font-bold text-gray-800 mb-2">68.5%</h6>
                  <p className="text-sm text-gray-600 mb-3">Taux de conversion</p>
                  <div className="flex items-center justify-center">
                    <i className="fas fa-arrow-up text-emerald-500 mr-2 text-lg"></i>
                    <span className="text-sm text-emerald-600 font-medium">+2.1%</span>
                  </div>
                </div>

                {/* Métrique 4: Satisfaction client */}
                <div className="text-center p-6 rounded-2xl backdrop-blur-xl bg-white/90 border border-white/50 shadow-2xl hover:scale-105 transition-all duration-300 hover:bg-white">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center backdrop-blur-xl bg-gray-100 border border-gray-200 shadow-lg">
                    <i className="fas fa-star text-2xl text-gray-700"></i>
                  </div>
                  <h6 className="text-2xl font-bold text-gray-800 mb-2">4.8/5</h6>
                  <p className="text-sm text-gray-600 mb-3">Satisfaction client</p>
                  <div className="flex items-center justify-center">
                    <i className="fas fa-arrow-up text-emerald-500 mr-2 text-lg"></i>
                    <span className="text-sm text-emerald-600 font-medium">+0.2</span>
                  </div>
                </div>
              </div>

              {/* Graphique simple des tendances */}
              <div className="mt-8 p-4 bg-slate-50 dark:bg-slate-800 rounded-xl">
                <h6 className="text-lg font-semibold text-slate-700 dark:text-white mb-4">Tendances des 30 derniers jours</h6>
                
                {/* Graphique des revenus */}
                <div className="mb-6">
                  <h6 className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-3">Revenus (€)</h6>
                  <div className="relative h-32">
                    <svg className="w-full h-full" viewBox="0 0 100 32" preserveAspectRatio="none">
                      {/* Grille de fond */}
                      <defs>
                        <pattern id="grid" width="10" height="8" patternUnits="userSpaceOnUse">
                          <path d="M 10 0 L 0 0 0 8" fill="none" stroke="currentColor" strokeWidth="0.1" opacity="0.2"/>
                        </pattern>
                      </defs>
                      <rect width="100" height="32" fill="url(#grid)" className="text-slate-300 dark:text-slate-600"/>
                      
                      {/* Ligne de revenus */}
                      <path 
                        d="M 0,28 L 3,26 L 7,24 L 10,22 L 13,20 L 17,18 L 20,16 L 23,14 L 27,12 L 30,10 L 33,8 L 37,6 L 40,4 L 43,2 L 47,0 L 50,2 L 53,4 L 57,6 L 60,8 L 63,10 L 67,12 L 70,14 L 73,16 L 77,18 L 80,20 L 83,22 L 87,24 L 90,26 L 93,28 L 97,30 L 100,28" 
                        fill="none" 
                        stroke="#1e40af" 
                        strokeWidth="1" 
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="drop-shadow-sm"
                      />
                      
                      {/* Zone sous la courbe */}
                      <defs>
                        <linearGradient id="revenueGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                          <stop offset="0%" stopColor="#1e40af" stopOpacity="0.8"/>
                          <stop offset="100%" stopColor="#1e40af" stopOpacity="0.1"/>
                        </linearGradient>
                      </defs>
                      <path 
                        d="M 0,28 L 3,26 L 7,24 L 10,22 L 13,20 L 17,18 L 20,16 L 23,14 L 27,12 L 30,10 L 33,8 L 37,6 L 40,4 L 43,2 L 47,0 L 50,2 L 53,4 L 57,6 L 60,8 L 63,10 L 67,12 L 70,14 L 73,16 L 77,18 L 80,20 L 83,22 L 87,24 L 90,26 L 93,28 L 97,30 L 100,28 L 100,32 L 0,32 Z" 
                        fill="url(#revenueGradient)" 
                        opacity="0.3"
                      />
                    </svg>
                  </div>
                </div>

                {/* Graphique des nouveaux clients */}
                <div className="mb-6">
                  <h6 className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-3">Nouveaux clients</h6>
                  <div className="relative h-32">
                    <svg className="w-full h-full" viewBox="0 0 100 32" preserveAspectRatio="none">
                      <rect width="100" height="32" fill="url(#grid)" className="text-slate-300 dark:text-slate-600"/>
                      
                      {/* Ligne des nouveaux clients */}
                      <path 
                        d="M 0,30 L 3,28 L 7,25 L 10,22 L 13,20 L 17,18 L 20,15 L 23,12 L 27,10 L 30,8 L 33,6 L 37,4 L 40,2 L 43,4 L 47,6 L 50,8 L 53,10 L 57,12 L 60,14 L 63,16 L 67,18 L 70,20 L 73,22 L 77,24 L 80,26 L 83,28 L 87,30 L 90,28 L 93,26 L 97,24 L 100,22" 
                        fill="none" 
                        stroke="#3b82f6" 
                        strokeWidth="1" 
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="drop-shadow-sm"
                      />
                      
                      {/* Zone sous la courbe */}
                      <defs>
                        <linearGradient id="clientsGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                          <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.8"/>
                          <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.1"/>
                        </linearGradient>
                      </defs>
                      <path 
                        d="M 0,30 L 3,28 L 7,25 L 10,22 L 13,20 L 17,18 L 20,15 L 23,12 L 27,10 L 30,8 L 33,6 L 37,4 L 40,2 L 43,4 L 47,6 L 50,8 L 53,10 L 57,12 L 60,14 L 63,16 L 67,18 L 70,20 L 73,22 L 77,24 L 80,26 L 83,28 L 87,30 L 90,28 L 93,26 L 97,24 L 100,22 L 100,32 L 0,32 Z" 
                        fill="url(#clientsGradient)" 
                        opacity="0.3"
                      />
                    </svg>
                  </div>
                </div>

                {/* Graphique du taux de conversion */}
                <div className="mb-6">
                  <h6 className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-3">Taux de conversion (%)</h6>
                  <div className="relative h-32">
                    <svg className="w-full h-full" viewBox="0 0 100 32" preserveAspectRatio="none">
                      <rect width="100" height="32" fill="url(#grid)" className="text-slate-300 dark:text-slate-600"/>
                      
                      {/* Ligne du taux de conversion */}
                      <path 
                        d="M 0,25 L 3,24 L 7,22 L 10,20 L 13,18 L 17,16 L 20,14 L 23,12 L 27,10 L 30,8 L 33,6 L 37,4 L 40,2 L 43,4 L 47,6 L 50,8 L 53,10 L 57,12 L 60,14 L 63,16 L 67,18 L 70,20 L 73,22 L 77,24 L 80,26 L 83,28 L 87,30 L 90,28 L 93,26 L 97,24 L 100,22 L 100,32 L 0,32 Z" 
                        fill="none" 
                        stroke="#60a5fa" 
                        strokeWidth="1" 
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="drop-shadow-sm"
                      />
                      
                      {/* Zone sous la courbe */}
                      <defs>
                        <linearGradient id="conversionGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                          <stop offset="0%" stopColor="#60a5fa" stopOpacity="0.8"/>
                          <stop offset="100%" stopColor="#60a5fa" stopOpacity="0.1"/>
                        </linearGradient>
                      </defs>
                      <path 
                        d="M 0,25 L 3,24 L 7,22 L 10,20 L 13,18 L 17,16 L 20,14 L 23,12 L 27,10 L 30,8 L 33,6 L 37,4 L 40,2 L 43,4 L 47,6 L 50,8 L 53,10 L 57,12 L 60,14 L 63,16 L 67,18 L 70,20 L 73,22 L 77,24 L 80,26 L 83,28 L 87,30 L 90,28 L 93,26 L 97,24 L 100,22 L 100,32 L 0,32 Z" 
                        fill="url(#conversionGradient)" 
                        opacity="0.3"
                      />
                    </svg>
                  </div>
                </div>

                {/* Légende et axes */}
                <div className="flex justify-between items-center mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
                  <div className="flex items-center space-x-4 text-xs text-slate-500 dark:text-slate-400">
                    <div className="flex items-center">
                      <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: '#1e40af' }}></div>
                      <span>Revenus</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: '#3b82f6' }}></div>
                      <span>Nouveaux clients</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: '#60a5fa' }}></div>
                      <span>Taux de conversion</span>
                    </div>
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">
                    <span>30 derniers jours</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

             {/* Contenu principal */}
      <div className="flex flex-wrap -mx-3">
        {/* Colonne gauche - Liste des VPS */}
        <div className="w-full max-w-full px-3 mt-0 lg:w-7/12 lg:flex-none">
          <div className="border-black/12.5 dark:bg-slate-850 dark:shadow-dark-xl shadow-xl relative z-20 flex min-w-0 flex-col break-words rounded-2xl border-0 border-solid bg-white bg-clip-border">
            <div className="border-black/12.5 mb-0 rounded-t-2xl border-b-0 border-solid p-6 pt-4 pb-0">
              <h6 className="capitalize dark:text-white">VPS Gérés</h6>
              <p className="mb-0 text-sm leading-normal dark:text-white dark:opacity-60">
                <i className="fas fa-server text-emerald-500 mr-1"></i>
                <span className="font-semibold">{getFilteredVpsList().length} VPS</span> au total
              </p>
            </div>
            <div className="flex-auto p-4">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-slate-700">
                      <th className="text-left py-3 px-4 font-semibold text-slate-600 dark:text-white">Nom</th>
                      <th className="text-left py-3 px-4 font-semibold text-slate-600 dark:text-white">Statut</th>
                      <th className="text-left py-3 px-4 font-semibold text-slate-600 dark:text-white">CPU</th>
                      <th className="text-left py-3 px-4 font-semibold text-slate-600 dark:text-white">RAM</th>
                      <th className="text-left py-3 px-4 font-semibold text-slate-600 dark:text-white">Stockage</th>
                      <th className="text-left py-3 px-4 font-semibold text-slate-600 dark:text-white">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {getFilteredVpsList().map((vps) => {
                      const status = getVpsStatus(vps.status);
                      return (
                        <tr key={vps.id} className="border-b border-slate-100 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800">
                          <td className="py-3 px-4">
                            <div>
                              <p className="font-semibold text-slate-700 dark:text-white">{vps.name}</p>
                              <p className="text-sm text-slate-500 dark:text-slate-400">{vps.ip}</p>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${status.color} text-white`}>
                              {status.text}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-slate-700 dark:text-white">{vps.cpu} vCPU</td>
                          <td className="py-3 px-4 text-slate-700 dark:text-white">{vps.ram} GB</td>
                          <td className="py-3 px-4 text-slate-700 dark:text-white">{vps.storage} GB</td>
                          <td className="py-3 px-4">
                            <div className="flex space-x-2">
                              <button className="text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-300">
                                <i className="fas fa-eye"></i>
                              </button>
                              <button className="text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-300">
                                <i className="fas fa-play"></i>
                              </button>
                              <button className="text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-300">
                                <i className="fas fa-stop"></i>
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
         
         {/* Colonne droite - Informations utilisateur et hiérarchie */}
        <div className="w-full max-w-full px-3 mt-6 lg:w-5/12 lg:flex-none">
          {/* Carte d'informations utilisateur */}
          <div className="border-black/12.5 dark:bg-slate-850 dark:shadow-dark-xl shadow-xl relative z-20 flex min-w-0 flex-col break-words rounded-2xl border-0 border-solid bg-white bg-clip-border mb-6">
            <div className="border-black/12.5 mb-0 rounded-t-2xl border-b-0 border-solid p-6 pt-4 pb-0">
              <h6 className="capitalize dark:text-white">Informations du compte</h6>
            </div>
            <div className="flex-auto p-6">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-tl from-blue-500 to-violet-500 flex items-center justify-center mr-4">
                  <i className="fas fa-user text-white"></i>
                </div>
                <div>
                  <h6 className="text-lg font-semibold text-slate-700 dark:text-white">{user.username}</h6>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-${getRoleColor(user.role)}-100 text-${getRoleColor(user.role)}-800 dark:bg-${getRoleColor(user.role)}-900 dark:text-${getRoleColor(user.role)}-300`}>
                    {getRoleDisplayName(user.role)}
                  </span>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-slate-600 dark:text-slate-400">Email:</span>
                  <span className="text-slate-700 dark:text-white font-medium">{user.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600 dark:text-slate-400">Rôle:</span>
                  <span className="text-slate-700 dark:text-white font-medium">{getRoleDisplayName(user.role)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600 dark:text-slate-400">Statut:</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-medium">Actif</span>
                </div>
              </div>
            </div>
          </div>

             {/* Carte de hiérarchie utilisateur */}
             {userHierarchy.length > 0 && (
            <div className="border-black/12.5 dark:bg-slate-850 dark:shadow-dark-xl shadow-xl relative z-20 flex min-w-0 flex-col break-words rounded-2xl border-0 border-solid bg-white bg-clip-border">
              <div className="border-black/12.5 mb-0 rounded-t-2xl border-b-0 border-solid p-6 pt-4 pb-0">
                <h6 className="capitalize dark:text-white">Hiérarchie</h6>
                <p className="mb-0 text-sm leading-normal dark:text-white dark:opacity-60">
                  <i className="fas fa-users text-emerald-500 mr-1"></i>
                  <span className="font-semibold">{userHierarchy.length}</span> utilisateurs
                </p>
              </div>
              <div className="flex-auto p-6">
                <div className="space-y-3">
                  {userHierarchy.slice(0, 5).map((hierarchyUser, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                      <div className="flex items-center">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-tl from-emerald-500 to-teal-400 flex items-center justify-center mr-3">
                          <i className="fas fa-user text-white text-sm"></i>
                        </div>
                        <div>
                          <p className="font-medium text-slate-700 dark:text-white">{hierarchyUser.username}</p>
                          <p className="text-sm text-slate-500 dark:text-slate-400">{hierarchyUser.role}</p>
                        </div>
                      </div>
                      <span className="text-xs text-slate-500 dark:text-slate-400">
                        {hierarchyUser.status || 'Actif'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Snackbar pour les notifications */}
      {snackbar.open && (
        <div className={`fixed bottom-4 right-4 p-4 rounded-lg shadow-lg transform transition-all duration-300 ${
          snackbar.severity === 'success' 
            ? 'bg-emerald-500 text-white' 
            : 'bg-red-500 text-white'
        }`}>
          <div className="flex items-center">
            <i className={`fas fa-${snackbar.severity === 'success' ? 'check-circle' : 'exclamation-circle'} mr-2`}></i>
            <span className="font-medium">{snackbar.message}</span>
            <button 
              onClick={() => setSnackbar({ ...snackbar, open: false })}
              className="ml-4 text-white hover:text-gray-200 transition-colors duration-200"
            >
              <i className="fas fa-times"></i>
            </button>
          </div>
        </div>
      )}

      {/* Notification d'erreur globale */}
      {error && (
        <div className="fixed top-4 right-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded shadow-lg max-w-md z-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <i className="fas fa-exclamation-triangle mr-2"></i>
              <span className="font-semibold">
                {error.includes('403') || error.includes('Accès refusé') ? 'Accès Restreint' : 'Erreur'}
              </span>
            </div>
            <button 
              onClick={() => setError(null)}
              className="text-red-700 hover:text-red-900 transition-colors duration-200"
            >
              <i className="fas fa-times"></i>
            </button>
          </div>
          <p className="mt-2 text-sm">{error}</p>
          
          {/* Actions spécifiques pour les erreurs 403 */}
          {(error.includes('403') || error.includes('Accès refusé')) && (
            <div className="mt-3 pt-3 border-t border-red-300">
              <p className="text-xs text-red-600 mb-2">
                <i className="fas fa-info-circle mr-1"></i>
                Vous n'avez pas les permissions nécessaires pour accéder à certaines données.
              </p>
              <div className="flex space-x-2">
                <button 
                  onClick={() => {
                    setError(null);
                    loadDashboardData();
                  }}
                  className="text-xs bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded transition-colors duration-200"
                >
                  <i className="fas fa-redo mr-1"></i>
                  Réessayer
                </button>
                <button 
                  onClick={() => window.location.reload()}
                  className="text-xs bg-gray-600 hover:bg-gray-700 text-white px-3 py-1 rounded transition-colors duration-200"
                >
                  <i className="fas fa-refresh mr-1"></i>
                  Actualiser
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
   );
 };

export default RoleBasedDashboard;
