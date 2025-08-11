import React, { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { 
  Box, 
  AppBar, 
  Toolbar, 
  Typography, 
  IconButton, 
  Avatar, 
  Chip,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Tabs,
  Tab,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem as MuiMenuItem,
  FormControlLabel,
  Switch,
  RadioGroup,
  FormLabel,
  Radio,
  Alert,
  AlertTitle
} from '@mui/material';
import { 
  Notifications as NotificationsIcon,
  Settings as SettingsIcon,
  AccountCircle as AccountIcon,
  Cloud as CloudIcon,
  Logout as LogoutIcon,
  Lock as LockIcon,
  Language as LanguageIcon,
  Palette as PaletteIcon,
  Dashboard as DashboardIcon,
  FlashOn as FlashIcon,
  Security as SecurityIcon,
  Schedule as ScheduleIcon,
  VpnKey as VpnKeyIcon,
  Description as DescriptionIcon,
  Edit as EditIcon,
  Person as PersonIcon,
  GridOn as GridIcon,
  CreditCard as CreditCardIcon,
  ArrowBack as ArrowBackIcon,
  LinkedIn as LinkedInIcon,
  Twitter as TwitterIcon,
  GitHub as GitHubIcon,
  Add as AddIcon,
  Storage as StorageIcon,
  NetworkCheck as NetworkCheckIcon,
  Backup as BackupIcon
} from '@mui/icons-material';
import Sidebar from './Sidebar';
import { useLanguage } from '../../contexts/LanguageContext';
import { useAuth } from '../../contexts/AuthContext';
import { useTranslation } from 'react-i18next';

// Remove the Settings import since we'll implement it directly
// import Settings from '../../layout/Dashboard/Header/HeaderContent/Settings';

const MainLayout: React.FC = () => {
  const { currentLanguage, changeLanguage } = useLanguage();
  const { t } = useTranslation();
  const { logout, getDisplayName } = useAuth();
  const navigate = useNavigate();
  const [languageMenuAnchor, setLanguageMenuAnchor] = useState<null | HTMLElement>(null);
  const [settingsMenuAnchor, setSettingsMenuAnchor] = useState<null | HTMLElement>(null);
  const [settingsTabValue, setSettingsTabValue] = useState(0);
  
  // New state for different settings panels
  const [activePanel, setActivePanel] = useState<string>('main');
  const [profileData, setProfileData] = useState({
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    phone: '+33 1 23 45 67 89'
  });
  const [securitySettings, setSecuritySettings] = useState({
    twoFactorEnabled: false,
    sessionTimeout: 30,
    maxSessions: 3
  });
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    pushNotifications: false,
    smsNotifications: false
  });
  const [themeSettings, setThemeSettings] = useState({
    mode: 'light',
    primaryColor: '#1976d2',
    compactMode: false
  });

  const handleLanguageClick = (event: React.MouseEvent<HTMLElement>) => {
    setLanguageMenuAnchor(event.currentTarget);
  };

  const handleLanguageClose = () => {
    setLanguageMenuAnchor(null);
  };

  const handleLanguageChange = (language: string) => {
    changeLanguage(language);
    handleLanguageClose();
  };

  const handleSettingsClick = (event: React.MouseEvent<HTMLElement>) => {
    setSettingsMenuAnchor(event.currentTarget);
  };

  const handleSettingsClose = () => {
    setSettingsMenuAnchor(null);
    setSettingsTabValue(0);
    setActivePanel('main');
  };

  const handleSettingsTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setSettingsTabValue(newValue);
    setActivePanel('main');
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Profile actions
  const handleEditProfile = () => {
    setActivePanel('editProfile');
  };

  const handleViewProfile = () => {
    setActivePanel('viewProfile');
  };

  const handleSocialProfile = () => {
    setActivePanel('socialProfile');
  };

  const handleBilling = () => {
    setActivePanel('billing');
  };

  // Basic settings actions
  const handleProfileSettings = () => {
    setActivePanel('profileSettings');
  };

  const handleSecurity = () => {
    setActivePanel('security');
  };

  const handleNotifications = () => {
    setActivePanel('notifications');
  };

  // Interface customization actions
  const handleLanguageRegion = () => {
    setActivePanel('languageRegion');
  };

  const handleTheme = () => {
    setActivePanel('theme');
  };

  const handleDashboardCustomization = () => {
    setActivePanel('dashboardCustomization');
  };

  const handleQuickActions = () => {
    setActivePanel('quickActions');
  };

  // Advanced security actions
  const handleTwoFactor = () => {
    setActivePanel('twoFactor');
  };

  const handleSessionManagement = () => {
    setActivePanel('sessionManagement');
  };

  const handleApiKeys = () => {
    setActivePanel('apiKeys');
  };

  const handleAccessLogs = () => {
    setActivePanel('accessLogs');
  };

  const handleBackToMain = () => {
    setActivePanel('main');
  };

  // Update functions
  const updateProfileData = (field: string, value: string) => {
    setProfileData(prev => ({ ...prev, [field]: value }));
  };

  const toggleTwoFactor = () => {
    setSecuritySettings(prev => ({ ...prev, twoFactorEnabled: !prev.twoFactorEnabled }));
  };

  const updateThemeMode = (mode: string) => {
    setThemeSettings(prev => ({ ...prev, mode }));
  };

  const toggleNotification = (type: string) => {
    setNotificationSettings(prev => ({ ...prev, [type]: !prev[type as keyof typeof prev] }));
  };

  return (
    <Box sx={{ display: 'flex', width: '100%', height: '100vh', bgcolor: 'background.default' }}>
      <Sidebar open={true} />
      
      <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Header */}
        <AppBar 
          position="static" 
          elevation={0}
          sx={{ 
            bgcolor: 'background.paper',
            borderBottom: '1px solid rgba(30, 41, 59, 0.12)',
            zIndex: 1200
          }}
        >
          <Toolbar sx={{ minHeight: '70px !important', px: 3 }}>
            <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', gap: 2 }}>
              <CloudIcon sx={{ color: 'primary.main', fontSize: 28 }} />
              <Typography variant="h6" sx={{ 
                fontWeight: 600, 
                color: 'text.primary',
                letterSpacing: '0.5px'
              }}>
                {t('sidebar.cloudstackPortal')}
              </Typography>
              <Chip 
                label="Production" 
                size="small" 
                sx={{ 
                  bgcolor: '#f5f5dc', // Couleur beige du logo FOCUS
                  color: '#1e293b', // Texte foncé pour contraste
                  fontWeight: 600,
                  fontSize: '0.7rem',
                  border: '1px solid rgba(30, 41, 59, 0.2)',
                  '&:hover': {
                    bgcolor: '#f0f0d0',
                  }
                }} 
              />
            </Box>
            
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <IconButton 
                size="large" 
                sx={{ 
                  color: 'text.secondary',
                  '&:hover': { color: 'primary.main' }
                }}
              >
                <NotificationsIcon />
              </IconButton>
              
              {/* Language Selector */}
              <IconButton 
                size="large" 
                onClick={handleLanguageClick}
                sx={{ 
                  color: languageMenuAnchor ? 'primary.main' : 'text.secondary',
                  '&:hover': { color: 'primary.main' }
                }}
              >
                🌐
              </IconButton>
              
              <Menu
                anchorEl={languageMenuAnchor}
                open={Boolean(languageMenuAnchor)}
                onClose={handleLanguageClose}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'right',
                }}
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                PaperProps={{
                  sx: {
                    mt: 1,
                    minWidth: 150,
                    boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                    border: '1px solid rgba(0,0,0,0.1)',
                  }
                }}
              >
                <MenuItem 
                  onClick={() => handleLanguageChange('fr')}
                  selected={currentLanguage === 'fr'}
                  sx={{
                    '&.Mui-selected': {
                      bgcolor: 'primary.50',
                      '&:hover': { bgcolor: 'primary.100' }
                    }
                  }}
                >
                  <ListItemIcon>
                    <Typography variant="h6">🇫🇷</Typography>
                  </ListItemIcon>
                  <ListItemText 
                    primary="Français"
                    secondary={currentLanguage === 'fr' ? 'Langue actuelle' : ''}
                  />
                </MenuItem>
                <MenuItem 
                  onClick={() => handleLanguageChange('en')}
                  selected={currentLanguage === 'en'}
                  sx={{
                    '&.Mui-selected': {
                      bgcolor: 'primary.50',
                      '&:hover': { bgcolor: 'primary.100' }
                    }
                  }}
                >
                  <ListItemIcon>
                    <Typography variant="h6">🇺🇸</Typography>
                  </ListItemIcon>
                  <ListItemText 
                    primary="English"
                    secondary={currentLanguage === 'en' ? 'Current language' : ''}
                  />
                </MenuItem>
              </Menu>
              
              {/* Settings Dropdown */}
              <IconButton 
                size="large" 
                onClick={handleSettingsClick}
                sx={{ 
                  color: settingsMenuAnchor ? 'primary.main' : 'text.secondary',
                  '&:hover': { color: 'primary.main' }
                }}
              >
                <AccountIcon />
              </IconButton>
              
              <Menu
                anchorEl={settingsMenuAnchor}
                open={Boolean(settingsMenuAnchor)}
                onClose={handleSettingsClose}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'right',
                }}
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                PaperProps={{
                  sx: {
                    mt: 1,
                    minWidth: 400,
                    maxWidth: 600,
                    boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                    border: '1px solid rgba(0,0,0,0.1)',
                  }
                }}
              >
                {/* User Info Header */}
                <Box sx={{ p: 2, borderBottom: '1px solid rgba(0,0,0,0.1)' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Avatar 
                      sx={{ 
                        width: 50, 
                        height: 50,
                        bgcolor: 'primary.main'
                      }}
                    >
                      <AccountIcon />
                    </Avatar>
                    <Box>
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        {getDisplayName()}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Utilisateur connecté
                      </Typography>
                    </Box>
                    <IconButton 
                      size="small" 
                      onClick={handleLogout}
                      sx={{ ml: 'auto', color: 'error.main' }}
                    >
                      <LogoutIcon />
                    </IconButton>
                  </Box>
                </Box>

                {/* Tabs */}
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                  <Tabs 
                    value={settingsTabValue} 
                    onChange={handleSettingsTabChange}
                    sx={{ px: 2 }}
                  >
                    <Tab 
                      label="Profile" 
                      icon={<PersonIcon />} 
                      iconPosition="start"
                      sx={{ minHeight: 48 }}
                    />
                    <Tab 
                      label="Setting" 
                      icon={<SettingsIcon />} 
                      iconPosition="start"
                      sx={{ minHeight: 48 }}
                    />
                  </Tabs>
                </Box>

                {/* Tab Content */}
                <Box sx={{ p: 0, minHeight: 300 }}>
                  {/* Profile Tab */}
                  {settingsTabValue === 0 && (
                    <Box>
                      {activePanel === 'main' && (
                        <>
                          <MenuItem onClick={handleEditProfile}>
                            <ListItemIcon>
                              <EditIcon />
                            </ListItemIcon>
                            <ListItemText primary="Modifier le profil" />
                          </MenuItem>
                          <MenuItem onClick={handleViewProfile}>
                            <ListItemIcon>
                              <PersonIcon />
                            </ListItemIcon>
                            <ListItemText primary="Voir le profil" />
                          </MenuItem>
                          <MenuItem onClick={handleSocialProfile}>
                            <ListItemIcon>
                              <GridIcon />
                            </ListItemIcon>
                            <ListItemText primary="Profil social" />
                          </MenuItem>
                          <MenuItem onClick={handleBilling}>
                            <ListItemIcon>
                              <CreditCardIcon />
                            </ListItemIcon>
                            <ListItemText primary="Facturation" />
                          </MenuItem>
                        </>
                      )}

                      {/* Edit Profile Panel */}
                      {activePanel === 'editProfile' && (
                        <Box sx={{ p: 2 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                            <IconButton onClick={handleBackToMain} size="small">
                              <ArrowBackIcon />
                            </IconButton>
                            <Typography variant="h6" sx={{ ml: 1 }}>Modifier le profil</Typography>
                          </Box>
                          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                            <TextField
                              label="Prénom"
                              value={profileData.firstName}
                              onChange={(e) => updateProfileData('firstName', e.target.value)}
                              fullWidth
                              size="small"
                            />
                            <TextField
                              label="Nom"
                              value={profileData.lastName}
                              onChange={(e) => updateProfileData('lastName', e.target.value)}
                              fullWidth
                              size="small"
                            />
                            <TextField
                              label="Email"
                              value={profileData.email}
                              onChange={(e) => updateProfileData('email', e.target.value)}
                              fullWidth
                              size="small"
                            />
                            <TextField
                              label="Téléphone"
                              value={profileData.phone}
                              onChange={(e) => updateProfileData('phone', e.target.value)}
                              fullWidth
                              size="small"
                            />
                            <Button variant="contained" fullWidth>
                              Sauvegarder
                            </Button>
                          </Box>
                        </Box>
                      )}

                      {/* View Profile Panel */}
                      {activePanel === 'viewProfile' && (
                        <Box sx={{ p: 2 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                            <IconButton onClick={handleBackToMain} size="small">
                              <ArrowBackIcon />
                            </IconButton>
                            <Typography variant="h6" sx={{ ml: 1 }}>Voir le profil</Typography>
                          </Box>
                          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                              <Typography variant="body2" color="text.secondary">Prénom:</Typography>
                              <Typography variant="body2">{profileData.firstName}</Typography>
                            </Box>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                              <Typography variant="body2" color="text.secondary">Nom:</Typography>
                              <Typography variant="body2">{profileData.lastName}</Typography>
                            </Box>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                              <Typography variant="body2" color="text.secondary">Email:</Typography>
                              <Typography variant="body2">{profileData.email}</Typography>
                            </Box>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                              <Typography variant="body2" color="text.secondary">Téléphone:</Typography>
                              <Typography variant="body2">{profileData.phone}</Typography>
                            </Box>
                          </Box>
                        </Box>
                      )}

                      {/* Social Profile Panel */}
                      {activePanel === 'socialProfile' && (
                        <Box sx={{ p: 2 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                            <IconButton onClick={handleBackToMain} size="small">
                              <ArrowBackIcon />
                            </IconButton>
                            <Typography variant="h6" sx={{ ml: 1 }}>Profil social</Typography>
                          </Box>
                          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                            <MenuItem>
                              <ListItemIcon>
                                <LinkedInIcon />
                              </ListItemIcon>
                              <ListItemText primary="LinkedIn" secondary="Connecter votre compte LinkedIn" />
                            </MenuItem>
                            <MenuItem>
                              <ListItemIcon>
                                <TwitterIcon />
                              </ListItemIcon>
                              <ListItemText primary="Twitter" secondary="Connecter votre compte Twitter" />
                            </MenuItem>
                            <MenuItem>
                              <ListItemIcon>
                                <GitHubIcon />
                              </ListItemIcon>
                              <ListItemText primary="GitHub" secondary="Connecter votre compte GitHub" />
                            </MenuItem>
                          </Box>
                        </Box>
                      )}

                      {/* Billing Panel */}
                      {activePanel === 'billing' && (
                        <Box sx={{ p: 2 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                            <IconButton onClick={handleBackToMain} size="small">
                              <ArrowBackIcon />
                            </IconButton>
                            <Typography variant="h6" sx={{ ml: 1 }}>Facturation</Typography>
                          </Box>
                          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                            <Box sx={{ p: 2, border: '1px solid #e0e0e0', borderRadius: 1 }}>
                              <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>Plan actuel: Pro</Typography>
                              <Typography variant="body2" color="text.secondary">€29.99/mois</Typography>
                            </Box>
                            <Button variant="outlined" fullWidth>
                              Changer de plan
                            </Button>
                            <Button variant="outlined" fullWidth>
                              Télécharger les factures
                            </Button>
                          </Box>
                        </Box>
                      )}
                    </Box>
                  )}

                  {/* Setting Tab */}
                  {settingsTabValue === 1 && (
                    <Box>
                      {activePanel === 'main' && (
                        <>
                          {/* Paramètres de base */}
                          <MenuItem onClick={handleProfileSettings}>
                            <ListItemIcon>
                              <AccountIcon />
                            </ListItemIcon>
                            <ListItemText
                              primary="Paramètres du profil"
                              secondary="Gérer vos informations personnelles"
                            />
                          </MenuItem>
                          
                          <MenuItem onClick={handleSecurity}>
                            <ListItemIcon>
                              <LockIcon />
                            </ListItemIcon>
                            <ListItemText
                              primary="Sécurité"
                              secondary="Mots de passe et authentification"
                            />
                          </MenuItem>
                          
                          <MenuItem onClick={handleNotifications}>
                            <ListItemIcon>
                              <NotificationsIcon />
                            </ListItemIcon>
                            <ListItemText
                              primary="Notifications"
                              secondary="Préférences de notifications"
                            />
                          </MenuItem>
                          
                          <Divider sx={{ my: 1 }} />
                          
                          {/* Personnalisation de l'interface */}
                          <MenuItem sx={{ pointerEvents: 'none' }}>
                            <ListItemText
                              primary={
                                <Typography variant="subtitle2" sx={{ fontWeight: 600, color: 'primary.main' }}>
                                  Personnalisation de l'interface
                                </Typography>
                              }
                            />
                          </MenuItem>
                          
                          <MenuItem onClick={handleLanguageRegion}>
                            <ListItemIcon>
                              <LanguageIcon />
                            </ListItemIcon>
                            <ListItemText
                              primary="Langue et région"
                              secondary="Fuseau horaire, format de date, format des nombres"
                            />
                          </MenuItem>
                          
                          <MenuItem onClick={handleTheme}>
                            <ListItemIcon>
                              <PaletteIcon />
                            </ListItemIcon>
                            <ListItemText
                              primary="Thème"
                              secondary="Mode clair/sombre, schéma de couleurs, mise en page"
                            />
                          </MenuItem>
                          
                          <MenuItem onClick={handleDashboardCustomization}>
                            <ListItemIcon>
                              <DashboardIcon />
                            </ListItemIcon>
                            <ListItemText
                              primary="Personnalisation du tableau de bord"
                              secondary="Widgets, vues par défaut, intervalles de rafraîchissement"
                            />
                          </MenuItem>
                          
                          <MenuItem onClick={handleQuickActions}>
                            <ListItemIcon>
                              <FlashIcon />
                            </ListItemIcon>
                            <ListItemText
                              primary="Actions rapides"
                              secondary="Raccourcis personnalisés, templates favoris"
                            />
                          </MenuItem>
                          
                          <Divider sx={{ my: 1 }} />
                          
                          {/* Sécurité avancée */}
                          <MenuItem sx={{ pointerEvents: 'none' }}>
                            <ListItemText
                              primary={
                                <Typography variant="subtitle2" sx={{ fontWeight: 600, color: 'primary.main' }}>
                                  Sécurité avancée
                                </Typography>
                              }
                            />
                          </MenuItem>
                          
                          <MenuItem onClick={handleTwoFactor}>
                            <ListItemIcon>
                              <SecurityIcon />
                            </ListItemIcon>
                            <ListItemText
                              primary="Authentification à deux facteurs"
                              secondary="Activer/désactiver 2FA, codes de sauvegarde"
                            />
                          </MenuItem>
                          
                          <MenuItem onClick={handleSessionManagement}>
                            <ListItemIcon>
                              <ScheduleIcon />
                            </ListItemIcon>
                            <ListItemText
                              primary="Gestion des sessions"
                              secondary="Déconnexion automatique, limites de sessions"
                            />
                          </MenuItem>
                          
                          <MenuItem onClick={handleApiKeys}>
                            <ListItemIcon>
                              <VpnKeyIcon />
                            </ListItemIcon>
                            <ListItemText
                              primary="Clés API"
                              secondary="Générer/gérer les clés API CloudStack"
                            />
                          </MenuItem>
                          
                          <MenuItem onClick={handleAccessLogs}>
                            <ListItemIcon>
                              <DescriptionIcon />
                            </ListItemIcon>
                            <ListItemText
                              primary="Journaux d'accès"
                              secondary="Historique des connexions, utilisation des API"
                            />
                          </MenuItem>
                        </>
                      )}

                      {/* Profile Settings Panel */}
                      {activePanel === 'profileSettings' && (
                        <Box sx={{ p: 2 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                            <IconButton onClick={handleBackToMain} size="small">
                              <ArrowBackIcon />
                            </IconButton>
                            <Typography variant="h6" sx={{ ml: 1 }}>Paramètres du profil</Typography>
                          </Box>
                          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                            <TextField
                              label="Nom d'utilisateur"
                              value="johndoe"
                              fullWidth
                              size="small"
                            />
                            <TextField
                              label="Email de contact"
                              value={profileData.email}
                              onChange={(e) => updateProfileData('email', e.target.value)}
                              fullWidth
                              size="small"
                            />
                            <TextField
                              label="Téléphone"
                              value={profileData.phone}
                              onChange={(e) => updateProfileData('phone', e.target.value)}
                              fullWidth
                              size="small"
                            />
                            <Button variant="contained" fullWidth>
                              Mettre à jour
                            </Button>
                          </Box>
                        </Box>
                      )}

                      {/* Security Panel */}
                      {activePanel === 'security' && (
                        <Box sx={{ p: 2 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                            <IconButton onClick={handleBackToMain} size="small">
                              <ArrowBackIcon />
                            </IconButton>
                            <Typography variant="h6" sx={{ ml: 1 }}>Sécurité</Typography>
                          </Box>
                          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                            <Button variant="outlined" fullWidth>
                              Changer le mot de passe
                            </Button>
                            <Button variant="outlined" fullWidth>
                              Mettre à jour les questions de sécurité
                            </Button>
                            <FormControlLabel
                              control={
                                <Switch
                                  checked={securitySettings.twoFactorEnabled}
                                  onChange={toggleTwoFactor}
                                />
                              }
                              label="Authentification à deux facteurs"
                            />
                          </Box>
                        </Box>
                      )}

                      {/* Notifications Panel */}
                      {activePanel === 'notifications' && (
                        <Box sx={{ p: 2 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                            <IconButton onClick={handleBackToMain} size="small">
                              <ArrowBackIcon />
                            </IconButton>
                            <Typography variant="h6" sx={{ ml: 1 }}>Notifications</Typography>
                          </Box>
                          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                            <FormControlLabel
                              control={
                                <Switch
                                  checked={notificationSettings.emailNotifications}
                                  onChange={() => toggleNotification('emailNotifications')}
                                />
                              }
                              label="Notifications par email"
                            />
                            <FormControlLabel
                              control={
                                <Switch
                                  checked={notificationSettings.pushNotifications}
                                  onChange={() => toggleNotification('pushNotifications')}
                                />
                              }
                              label="Notifications push"
                            />
                            <FormControlLabel
                              control={
                                <Switch
                                  checked={notificationSettings.smsNotifications}
                                  onChange={() => toggleNotification('smsNotifications')}
                                />
                              }
                              label="Notifications SMS"
                            />
                          </Box>
                        </Box>
                      )}

                      {/* Language & Region Panel */}
                      {activePanel === 'languageRegion' && (
                        <Box sx={{ p: 2 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                            <IconButton onClick={handleBackToMain} size="small">
                              <ArrowBackIcon />
                            </IconButton>
                            <Typography variant="h6" sx={{ ml: 1 }}>Langue et région</Typography>
                          </Box>
                          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                            <FormControl fullWidth size="small">
                              <InputLabel>Langue</InputLabel>
                              <Select value={currentLanguage} onChange={(e) => changeLanguage(e.target.value)}>
                                <MuiMenuItem value="fr">Français</MuiMenuItem>
                                <MuiMenuItem value="en">English</MuiMenuItem>
                              </Select>
                            </FormControl>
                            <FormControl fullWidth size="small">
                              <InputLabel>Fuseau horaire</InputLabel>
                              <Select value="Europe/Paris">
                                <MuiMenuItem value="Europe/Paris">Europe/Paris (UTC+1)</MuiMenuItem>
                                <MuiMenuItem value="UTC">UTC (UTC+0)</MuiMenuItem>
                                <MuiMenuItem value="America/New_York">America/New_York (UTC-5)</MuiMenuItem>
                              </Select>
                            </FormControl>
                          </Box>
                        </Box>
                      )}

                      {/* Theme Panel */}
                      {activePanel === 'theme' && (
                        <Box sx={{ p: 2 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                            <IconButton onClick={handleBackToMain} size="small">
                              <ArrowBackIcon />
                            </IconButton>
                            <Typography variant="h6" sx={{ ml: 1 }}>Thème</Typography>
                          </Box>
                          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                            <FormControl component="fieldset">
                              <FormLabel component="legend">Mode d'affichage</FormLabel>
                              <RadioGroup value={themeSettings.mode} onChange={(e) => updateThemeMode(e.target.value)}>
                                <FormControlLabel value="light" control={<Radio />} label="Mode clair" />
                                <FormControlLabel value="dark" control={<Radio />} label="Mode sombre" />
                                <FormControlLabel value="auto" control={<Radio />} label="Automatique" />
                              </RadioGroup>
                            </FormControl>
                            <FormControlLabel
                              control={
                                <Switch
                                  checked={themeSettings.compactMode}
                                  onChange={() => setThemeSettings(prev => ({ ...prev, compactMode: !prev.compactMode }))}
                                />
                              }
                              label="Mode compact"
                            />
                          </Box>
                        </Box>
                      )}

                      {/* Dashboard Customization Panel */}
                      {activePanel === 'dashboardCustomization' && (
                        <Box sx={{ p: 2 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                            <IconButton onClick={handleBackToMain} size="small">
                              <ArrowBackIcon />
                            </IconButton>
                            <Typography variant="h6" sx={{ ml: 1 }}>Personnalisation du tableau de bord</Typography>
                          </Box>
                          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                            <FormControl fullWidth size="small">
                              <InputLabel>Vue par défaut</InputLabel>
                              <Select value="overview">
                                <MuiMenuItem value="overview">Vue d'ensemble</MuiMenuItem>
                                <MuiMenuItem value="compute">Compute</MuiMenuItem>
                                <MuiMenuItem value="storage">Storage</MuiMenuItem>
                                <MuiMenuItem value="network">Network</MuiMenuItem>
                              </Select>
                            </FormControl>
                            <FormControl fullWidth size="small">
                              <InputLabel>Intervalle de rafraîchissement</InputLabel>
                              <Select value="30">
                                <MuiMenuItem value="15">15 secondes</MuiMenuItem>
                                <MuiMenuItem value="30">30 secondes</MuiMenuItem>
                                <MuiMenuItem value="60">1 minute</MuiMenuItem>
                                <MuiMenuItem value="300">5 minutes</MuiMenuItem>
                              </Select>
                            </FormControl>
                          </Box>
                        </Box>
                      )}

                      {/* Quick Actions Panel */}
                      {activePanel === 'quickActions' && (
                        <Box sx={{ p: 2 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                            <IconButton onClick={handleBackToMain} size="small">
                              <ArrowBackIcon />
                            </IconButton>
                            <Typography variant="h6" sx={{ ml: 1 }}>Actions rapides</Typography>
                          </Box>
                          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                            <Button variant="outlined" fullWidth startIcon={<AddIcon />}>
                              Créer une instance
                            </Button>
                            <Button variant="outlined" fullWidth startIcon={<StorageIcon />}>
                              Créer un volume
                            </Button>
                            <Button variant="outlined" fullWidth startIcon={<NetworkCheckIcon />}>
                              Créer un réseau
                            </Button>
                            <Button variant="outlined" fullWidth startIcon={<BackupIcon />}>
                              Créer un backup
                            </Button>
                          </Box>
                        </Box>
                      )}

                      {/* Two Factor Panel */}
                      {activePanel === 'twoFactor' && (
                        <Box sx={{ p: 2 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                            <IconButton onClick={handleBackToMain} size="small">
                              <ArrowBackIcon />
                            </IconButton>
                            <Typography variant="h6" sx={{ ml: 1 }}>Authentification à deux facteurs</Typography>
                          </Box>
                          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                            <FormControlLabel
                              control={
                                <Switch
                                  checked={securitySettings.twoFactorEnabled}
                                  onChange={toggleTwoFactor}
                                />
                              }
                              label="Activer 2FA"
                            />
                            {securitySettings.twoFactorEnabled && (
                              <Box sx={{ p: 2, bgcolor: 'success.50', borderRadius: 1 }}>
                                <Typography variant="body2" color="success.main">
                                  Scannez ce QR code avec votre application d'authentification
                                </Typography>
                                <Box sx={{ mt: 1, p: 2, bgcolor: 'white', borderRadius: 1, textAlign: 'center' }}>
                                  <Typography variant="caption">QR Code ici</Typography>
                                </Box>
                              </Box>
                            )}
                          </Box>
                        </Box>
                      )}

                      {/* Session Management Panel */}
                      {activePanel === 'sessionManagement' && (
                        <Box sx={{ p: 2 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                            <IconButton onClick={handleBackToMain} size="small">
                              <ArrowBackIcon />
                            </IconButton>
                            <Typography variant="h6" sx={{ ml: 1 }}>Gestion des sessions</Typography>
                          </Box>
                          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                            <FormControl fullWidth size="small">
                              <InputLabel>Déconnexion automatique</InputLabel>
                              <Select value={securitySettings.sessionTimeout}>
                                <MuiMenuItem value={15}>15 minutes</MuiMenuItem>
                                <MuiMenuItem value={30}>30 minutes</MuiMenuItem>
                                <MuiMenuItem value={60}>1 heure</MuiMenuItem>
                                <MuiMenuItem value={0}>Jamais</MuiMenuItem>
                              </Select>
                            </FormControl>
                            <FormControl fullWidth size="small">
                              <InputLabel>Limite de sessions simultanées</InputLabel>
                              <Select value={securitySettings.maxSessions}>
                                <MuiMenuItem value={1}>1 session</MuiMenuItem>
                                <MuiMenuItem value={3}>3 sessions</MuiMenuItem>
                                <MuiMenuItem value={5}>5 sessions</MuiMenuItem>
                                <MuiMenuItem value={10}>10 sessions</MuiMenuItem>
                              </Select>
                            </FormControl>
                          </Box>
                        </Box>
                      )}

                      {/* API Keys Panel */}
                      {activePanel === 'apiKeys' && (
                        <Box sx={{ p: 2 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                            <IconButton onClick={handleBackToMain} size="small">
                              <ArrowBackIcon />
                            </IconButton>
                            <Typography variant="h6" sx={{ ml: 1 }}>Clés API</Typography>
                          </Box>
                          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                            <Button variant="contained" fullWidth startIcon={<AddIcon />}>
                              Générer une nouvelle clé
                            </Button>
                            <Box sx={{ p: 2, border: '1px solid #e0e0e0', borderRadius: 1 }}>
                              <Typography variant="subtitle2">Clé API actuelle</Typography>
                              <Typography variant="caption" sx={{ fontFamily: 'monospace' }}>
                                sk-...abc123
                              </Typography>
                            </Box>
                            <Button variant="outlined" fullWidth color="error">
                              Révoquer la clé
                            </Button>
                          </Box>
                        </Box>
                      )}

                      {/* Access Logs Panel */}
                      {activePanel === 'accessLogs' && (
                        <Box sx={{ p: 2 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                            <IconButton onClick={handleBackToMain} size="small">
                              <ArrowBackIcon />
                            </IconButton>
                            <Typography variant="h6" sx={{ ml: 1 }}>Journaux d'accès</Typography>
                          </Box>
                          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                            <Box sx={{ p: 2, border: '1px solid #e0e0e0', borderRadius: 1 }}>
                              <Typography variant="subtitle2">Dernière connexion</Typography>
                              <Typography variant="body2" color="text.secondary">
                                Aujourd'hui à 14:30 - 192.168.1.100
                              </Typography>
                            </Box>
                            <Box sx={{ p: 2, border: '1px solid #e0e0e0', borderRadius: 1 }}>
                              <Typography variant="subtitle2">Connexions ce mois</Typography>
                              <Typography variant="body2" color="text.secondary">
                                45 connexions
                              </Typography>
                            </Box>
                            <Button variant="outlined" fullWidth>
                              Télécharger les journaux
                            </Button>
                          </Box>
                        </Box>
                      )}
                    </Box>
                  )}
                </Box>
              </Menu>
            </Box>
          </Toolbar>
        </AppBar>
        
        {/* Main Content */}
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            width: '100%',
            backgroundColor: 'background.default',
            overflow: 'auto',
            position: 'relative'
          }}
        >
          <Box sx={{ 
            p: 4, 
            minHeight: 'calc(100vh - 70px)',
            background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)'
          }}>
            <Outlet />
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default MainLayout; 