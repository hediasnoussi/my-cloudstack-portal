import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Paper,
  Grid,
  CircularProgress,
  Chip,
  IconButton,
  Button,
  ButtonGroup,
  Collapse,
  AppBar,
  Toolbar,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  CssBaseline
} from '@mui/material';
import {
  Domain as DomainIcon,
  People as PeopleIcon,
  Business as BusinessIcon,
  Cloud as CloudIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  Storage as StorageIcon,
  NetworkCheck as NetworkIcon,
  Security as SecurityIcon,
  Visibility as VisibilityIcon,
  KeyboardArrowDown as ArrowDownIcon,
  KeyboardArrowUp as ArrowUpIcon,
  ShowChart as ChartIcon,
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  Computer as ComputerIcon,
  Storage as StorageIcon2,
  NetworkCheck as NetworkIcon2,
  Settings as SettingsIcon,
  AccountCircle as AccountIcon,
  Security as SecurityIcon2,
  Backup as BackupIcon,
  Image as ImageIcon,
  Event as EventIcon,
  Assessment as AssessmentIcon,
  Group as GroupIcon,
  VpnKey as VpnKeyIcon,
  DataUsage as DataUsageIcon,
  AutoAwesome as AutoAwesomeIcon,
  CloudQueue as CloudQueueIcon,
  Folder as FolderIcon,
  Storage as StorageIcon3,
  NetworkCheck as NetworkIcon3,
  Security as SecurityIcon3,
  Public as PublicIcon,
  Balance as BalanceIcon,
  Code as CodeIcon,
  Backup as BackupIcon2,
  Cloud as CloudIcon2,
  Iso as IsoIcon,
  History as HistoryIcon,
  EventNote as EventNoteIcon
} from '@mui/icons-material';
import MainCard from '../components/MainCard';

interface DashboardStats {
  domains: number;
  users: number;
  accounts: number;
  projects: number;
  instances: number;
  volumes: number;
  networks: number;
  securityGroups: number;
}

const drawerWidth = 280;

const CloudStackDashboard = ({ onLogout }: { onLogout: () => void }) => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const [stats, setStats] = useState<DashboardStats>({
    domains: 0,
    users: 0,
    accounts: 0,
    projects: 0,
    instances: 0,
    volumes: 0,
    networks: 0,
    securityGroups: 0
  });
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<'month' | 'week'>('month');
  const [showMore, setShowMore] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      // Simulation de données pour le dashboard
      setStats({
        domains: 12,
        users: 45,
        accounts: 8,
        projects: 15,
        instances: 67,
        volumes: 89,
        networks: 23,
        securityGroups: 34
      });
    } catch (error) {
      console.error('Erreur lors du chargement des données:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawer = (
    <Box sx={{ bgcolor: '#1e3a8a', color: 'white', height: '100vh' }}>
      <Toolbar sx={{ minHeight: '80px !important' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Box sx={{ 
            width: 48, 
            height: 48, 
            borderRadius: '50%', 
            bgcolor: 'white', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center' 
          }}>
            <CloudIcon sx={{ fontSize: 24, color: '#1e3a8a' }} />
          </Box>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 600, color: 'white' }}>
              CloudStack Portal
            </Typography>
            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)' }}>
              Management System
            </Typography>
            <Box sx={{ mt: 1 }}>
              <Chip 
                label="v2.0.0" 
                size="small" 
                sx={{ 
                  bgcolor: 'rgba(255,255,255,0.2)', 
                  color: 'white',
                  fontSize: '0.7rem'
                }} 
              />
            </Box>
          </Box>
        </Box>
      </Toolbar>
      <Divider sx={{ bgcolor: 'rgba(255,255,255,0.2)' }} />
      
             {/* Menu principal */}
       <List sx={{ px: 2, py: 1 }}>
         <ListItem disablePadding>
           <ListItemButton 
             sx={{ 
               borderRadius: 1, 
               mb: 0.5,
               color: 'white',
               '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' },
               '&.Mui-selected': { bgcolor: 'rgba(255,255,255,0.2)' }
             }}
             onClick={() => navigate('/dashboard')}
             selected={location.pathname === '/dashboard' || location.pathname === '/'}
           >
             <ListItemIcon>
               <DashboardIcon sx={{ color: 'white' }} />
             </ListItemIcon>
             <ListItemText primary="Dashboard" sx={{ color: 'white' }} />
           </ListItemButton>
         </ListItem>
       </List>

       <Divider sx={{ mx: 2, my: 2, bgcolor: 'rgba(255,255,255,0.2)' }} />

             {/* Module Global */}
       <List sx={{ px: 2, py: 1 }}>
         <Typography variant="overline" sx={{ px: 2, color: 'text.secondary', fontWeight: 600 }}>
           Global
         </Typography>
         <ListItem disablePadding>
           <ListItemButton 
             sx={{ borderRadius: 1, mb: 0.5 }}
             onClick={() => navigate('/domains')}
             selected={location.pathname === '/domains'}
           >
             <ListItemIcon>
               <DomainIcon />
             </ListItemIcon>
             <ListItemText primary="Domains" />
           </ListItemButton>
         </ListItem>
         <ListItem disablePadding>
           <ListItemButton 
             sx={{ borderRadius: 1, mb: 0.5 }}
             onClick={() => navigate('/accounts')}
             selected={location.pathname === '/accounts'}
           >
             <ListItemIcon>
               <AccountIcon />
             </ListItemIcon>
             <ListItemText primary="Accounts" />
           </ListItemButton>
         </ListItem>
         <ListItem disablePadding>
           <ListItemButton 
             sx={{ borderRadius: 1, mb: 0.5, pl: 4 }}
             onClick={() => navigate('/roles')}
             selected={location.pathname === '/roles'}
           >
             <ListItemIcon>
               <SecurityIcon />
             </ListItemIcon>
             <ListItemText primary="Roles" />
           </ListItemButton>
         </ListItem>
         {/* Zones masqué */}
         {/* <ListItem disablePadding>
           <ListItemButton 
             sx={{ borderRadius: 1, mb: 0.5 }}
             onClick={() => navigate('/zones')}
             selected={location.pathname === '/zones'}
           >
             <ListItemIcon>
               <CloudIcon />
             </ListItemIcon>
             <ListItemText primary="Zones" />
           </ListItemButton>
         </ListItem> */}
         <ListItem disablePadding>
           <ListItemButton 
             sx={{ borderRadius: 1, mb: 0.5 }}
             onClick={() => navigate('/projects')}
             selected={location.pathname === '/projects'}
           >
             <ListItemIcon>
               <GroupIcon />
             </ListItemIcon>
             <ListItemText primary="Projects" />
           </ListItemButton>
         </ListItem>
       </List>

      <Divider sx={{ mx: 2, my: 2 }} />

      {/* Module Compute */}
      <List sx={{ px: 2, py: 1 }}>
        <Typography variant="overline" sx={{ px: 2, color: 'text.secondary', fontWeight: 600 }}>
          Compute
        </Typography>
        <ListItem disablePadding>
          <ListItemButton 
            sx={{ borderRadius: 1, mb: 0.5 }}
            onClick={() => navigate('/compute/instances')}
            selected={location.pathname === '/compute/instances'}
          >
            <ListItemIcon>
              <ComputerIcon />
            </ListItemIcon>
            <ListItemText primary="Instances" />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton 
            sx={{ borderRadius: 1, mb: 0.5 }}
            onClick={() => navigate('/images/templates')}
            selected={location.pathname === '/images/templates'}
          >
            <ListItemIcon>
              <ImageIcon />
            </ListItemIcon>
            <ListItemText primary="Templates" />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton 
            sx={{ borderRadius: 1, mb: 0.5 }}
            onClick={() => navigate('/images/isos')}
            selected={location.pathname === '/images/isos'}
          >
            <ListItemIcon>
              <IsoIcon />
            </ListItemIcon>
            <ListItemText primary="ISOs" />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton 
            sx={{ borderRadius: 1, mb: 0.5 }}
            onClick={() => navigate('/compute/snapshots')}
            selected={location.pathname === '/compute/snapshots'}
          >
            <ListItemIcon>
              <BackupIcon />
            </ListItemIcon>
            <ListItemText primary="Snapshots" />
          </ListItemButton>
        </ListItem>
                 {/* Kubernetes masqué */}
         {/* <ListItem disablePadding>
           <ListItemButton 
             sx={{ borderRadius: 1, mb: 0.5 }}
             onClick={() => navigate('/compute/kubernetes')}
             selected={location.pathname === '/compute/kubernetes'}
           >
             <ListItemIcon>
               <AutoAwesomeIcon />
             </ListItemIcon>
             <ListItemText primary="Kubernetes" />
           </ListItemButton>
         </ListItem> */}
         {/* Auto Scaling Groups masqué */}
         {/* <ListItem disablePadding>
           <ListItemButton 
             sx={{ borderRadius: 1, mb: 0.5 }}
             onClick={() => navigate('/compute/autoscaling')}
             selected={location.pathname === '/compute/autoscaling'}
           >
             <ListItemIcon>
               <TrendingUpIcon />
             </ListItemIcon>
             <ListItemText primary="Auto Scaling" />
           </ListItemButton>
         </ListItem> */}
        <ListItem disablePadding>
          <ListItemButton 
            sx={{ borderRadius: 1, mb: 0.5 }}
            onClick={() => navigate('/compute/groups')}
            selected={location.pathname === '/compute/groups'}
          >
            <ListItemIcon>
              <GroupIcon />
            </ListItemIcon>
            <ListItemText primary="Instance Groups" />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton 
            sx={{ borderRadius: 1, mb: 0.5 }}
            onClick={() => navigate('/compute/ssh-keys')}
            selected={location.pathname === '/compute/ssh-keys'}
          >
            <ListItemIcon>
              <VpnKeyIcon />
            </ListItemIcon>
            <ListItemText primary="SSH Key Pairs" />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton 
            sx={{ borderRadius: 1, mb: 0.5 }}
            onClick={() => navigate('/compute/user-data')}
            selected={location.pathname === '/compute/user-data'}
          >
            <ListItemIcon>
              <CodeIcon />
            </ListItemIcon>
            <ListItemText primary="User Data" />
          </ListItemButton>
        </ListItem>
      </List>

      <Divider sx={{ mx: 2, my: 2 }} />

      {/* Module Storage */}
      <List sx={{ px: 2, py: 1 }}>
        <Typography variant="overline" sx={{ px: 2, color: 'text.secondary', fontWeight: 600 }}>
          Storage
        </Typography>
        <ListItem disablePadding>
          <ListItemButton sx={{ borderRadius: 1, mb: 0.5 }}>
            <ListItemIcon>
              <StorageIcon2 />
            </ListItemIcon>
            <ListItemText primary="Volumes" />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton sx={{ borderRadius: 1, mb: 0.5 }}>
            <ListItemIcon>
              <BackupIcon2 />
            </ListItemIcon>
            <ListItemText primary="Snapshots" />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton sx={{ borderRadius: 1, mb: 0.5 }}>
            <ListItemIcon>
              <CloudIcon2 />
            </ListItemIcon>
            <ListItemText primary="Storage Pools" />
          </ListItemButton>
        </ListItem>
                 {/* Buckets masqué */}
         {/* <ListItem disablePadding>
           <ListItemButton sx={{ borderRadius: 1, mb: 0.5 }}>
             <ListItemIcon>
               <CloudQueueIcon />
             </ListItemIcon>
             <ListItemText primary="Buckets" />
           </ListItemButton>
         </ListItem> */}
         {/* Shared Filesystem masqué */}
         {/* <ListItem disablePadding>
           <ListItemButton sx={{ borderRadius: 1, mb: 0.5 }}>
             <ListItemIcon>
               <FolderIcon />
             </ListItemIcon>
             <ListItemText primary="Shared Filesystem" />
           </ListItemButton>
         </ListItem> */}
        <ListItem disablePadding>
          <ListItemButton sx={{ borderRadius: 1, mb: 0.5 }}>
            <ListItemIcon>
              <BackupIcon />
            </ListItemIcon>
            <ListItemText primary="Backups" />
          </ListItemButton>
        </ListItem>
      </List>

      <Divider sx={{ mx: 2, my: 2 }} />

      {/* Module Network */}
      <List sx={{ px: 2, py: 1 }}>
        <Typography variant="overline" sx={{ px: 2, color: 'text.secondary', fontWeight: 600 }}>
          Network
        </Typography>
        {/* Networks masqué */}
        {/* <ListItem disablePadding>
          <ListItemButton sx={{ borderRadius: 1, mb: 0.5 }}>
            <ListItemIcon>
              <NetworkIcon3 />
            </ListItemIcon>
            <ListItemText primary="Networks" />
          </ListItemButton>
        </ListItem> */}
        {/* Guest Networks masqué */}
        {/* <ListItem disablePadding>
          <ListItemButton sx={{ borderRadius: 1, mb: 0.5 }}>
            <ListItemIcon>
              <NetworkIcon />
            </ListItemIcon>
            <ListItemText primary="Guest Networks" />
          </ListItemButton>
        </ListItem> */}
        <ListItem disablePadding>
          <ListItemButton sx={{ borderRadius: 1, mb: 0.5 }}>
            <ListItemIcon>
              <CloudIcon />
            </ListItemIcon>
            <ListItemText primary="VPC" />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton sx={{ borderRadius: 1, mb: 0.5 }}>
            <ListItemIcon>
              <SecurityIcon3 />
            </ListItemIcon>
            <ListItemText primary="Security Groups" />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton sx={{ borderRadius: 1, mb: 0.5 }}>
            <ListItemIcon>
              <PublicIcon />
            </ListItemIcon>
            <ListItemText primary="Public IPs" />
          </ListItemButton>
        </ListItem>
        {/* Load Balancers masqué */}
        {/* <ListItem disablePadding>
          <ListItemButton sx={{ borderRadius: 1, mb: 0.5 }}>
            <ListItemIcon>
              <BalanceIcon />
            </ListItemIcon>
            <ListItemText primary="Load Balancers" />
          </ListItemButton>
        </ListItem> */}
      </List>

      <Divider sx={{ mx: 2, my: 2 }} />

      {/* Module Events & Monitoring */}
      <List sx={{ px: 2, py: 1 }}>
        <Typography variant="overline" sx={{ px: 2, color: 'text.secondary', fontWeight: 600 }}>
          Events & Monitoring
        </Typography>
        {/* Events masqué */}
        {/* <ListItem disablePadding>
          <ListItemButton sx={{ borderRadius: 1, mb: 0.5 }}>
            <ListItemIcon>
              <EventIcon />
            </ListItemIcon>
            <ListItemText primary="Events" />
          </ListItemButton>
        </ListItem> */}
        <ListItem disablePadding>
          <ListItemButton sx={{ borderRadius: 1, mb: 0.5 }}>
            <ListItemIcon>
              <EventNoteIcon />
            </ListItemIcon>
            <ListItemText primary="Event Logs" />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton sx={{ borderRadius: 1, mb: 0.5 }}>
            <ListItemIcon>
              <HistoryIcon />
            </ListItemIcon>
            <ListItemText primary="Audit Trail" />
          </ListItemButton>
                 </ListItem>
       </List>
       
       {/* Footer avec copyright */}
       <Box sx={{ 
         position: 'absolute', 
         bottom: 0, 
         left: 0, 
         right: 0, 
         p: 2, 
         textAlign: 'center',
         borderTop: '1px solid rgba(255,255,255,0.2)'
       }}>
         <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)' }}>
           © 2024 CloudStack Portal
         </Typography>
       </Box>
     </Box>
   );

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="50vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
             <AppBar
         position="fixed"
         sx={{
           width: { sm: `calc(100% - ${drawerWidth}px)` },
           ml: { sm: `${drawerWidth}px` },
           bgcolor: 'white',
           color: 'text.primary',
           boxShadow: 1
         }}
       >
         <Toolbar>
           <IconButton
             color="inherit"
             aria-label="open drawer"
             edge="start"
             onClick={handleDrawerToggle}
             sx={{ mr: 2, display: { sm: 'none' } }}
           >
             <MenuIcon />
           </IconButton>
           <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', gap: 2 }}>
             <CloudIcon sx={{ fontSize: 32, color: '#1e3a8a' }} />
             <Typography variant="h5" sx={{ fontWeight: 600, color: '#1e3a8a' }}>
               CloudStack Portal
             </Typography>
             <Chip 
               label="Production" 
               size="small" 
               sx={{ 
                 bgcolor: '#22c55e', 
                 color: 'white',
                 fontSize: '0.7rem'
               }} 
             />
           </Box>
           <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
             <IconButton sx={{ color: '#64748b' }}>
               <EventIcon />
             </IconButton>
             <IconButton sx={{ color: '#64748b' }}>
               <SettingsIcon />
             </IconButton>
             <IconButton sx={{ bgcolor: '#1e3a8a', color: 'white', '&:hover': { bgcolor: '#1e40af' } }}>
               <AccountIcon />
             </IconButton>
           </Box>
         </Toolbar>
       </AppBar>

      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          mt: '80px'
        }}
      >
        {/* En-tête du Dashboard */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" sx={{ fontWeight: 700, color: '#1e293b', mb: 1 }}>
            Rapport d'Analytics CloudStack
          </Typography>
          <Typography variant="body1" sx={{ color: '#64748b' }}>
            Vue d'ensemble de votre infrastructure cloud
          </Typography>
        </Box>

        {/* KPIs en haut */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={4}>
            <Card sx={{ 
              background: 'linear-gradient(135deg, #f5f5dc 0%, #fafaf0 100%)',
              border: '1px solid #f0f0d0',
              borderRadius: 2
            }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ color: '#1e293b', mb: 2, fontWeight: 600 }}>
                  Croissance Infrastructure
                </Typography>
                <Typography variant="h3" sx={{ color: '#22c55e', fontWeight: 700, mb: 1 }}>
                  +45.14%
                </Typography>
                <Typography variant="body2" sx={{ color: '#64748b' }}>
                  Augmentation des ressources
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <Card sx={{ 
              background: 'linear-gradient(135deg, #f5f5dc 0%, #fafaf0 100%)',
              border: '1px solid #f0f0d0',
              borderRadius: 2
            }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ color: '#1e293b', mb: 2, fontWeight: 600 }}>
                  Ratio d'Utilisation
                </Typography>
                <Typography variant="h3" sx={{ color: '#fbbf24', fontWeight: 700, mb: 1 }}>
                  0.58%
                </Typography>
                <Typography variant="body2" sx={{ color: '#64748b' }}>
                  Efficacité des ressources
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <Card sx={{ 
              background: 'linear-gradient(135deg, #f5f5dc 0%, #fafaf0 100%)',
              border: '1px solid #f0f0d0',
              borderRadius: 2
            }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ color: '#1e293b', mb: 2, fontWeight: 600 }}>
                  Cas de Risque
                </Typography>
                <Chip 
                  label="Faible" 
                  color="success"
                  sx={{ 
                    fontSize: '1.2rem', 
                    fontWeight: 600,
                    height: 40,
                    '& .MuiChip-label': { px: 2 }
                  }}
                />
                <Typography variant="body2" sx={{ color: '#64748b', mt: 1 }}>
                  Sécurité optimale
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Graphique en ligne */}
        <Grid container spacing={3}>
          <Grid item xs={12} lg={8}>
            <MainCard
              title="Évolution des Ressources"
              subtitle="Tendances mensuelles"
              sx={{ height: '400px' }}
            >
              <Box sx={{ mb: 2 }}>
                <ButtonGroup size="small" sx={{ mb: 2 }}>
                  <Button
                    variant={timeRange === 'month' ? 'contained' : 'outlined'}
                    onClick={() => setTimeRange('month')}
                    sx={{
                      backgroundColor: timeRange === 'month' ? '#1e3a8a' : 'transparent',
                      color: timeRange === 'month' ? 'white' : '#1e3a8a',
                      '&:hover': {
                        backgroundColor: timeRange === 'month' ? '#1e40af' : 'rgba(30, 58, 138, 0.1)',
                      }
                    }}
                  >
                    Mois
                  </Button>
                  <Button
                    variant={timeRange === 'week' ? 'contained' : 'outlined'}
                    onClick={() => setTimeRange('week')}
                    sx={{
                      backgroundColor: timeRange === 'week' ? '#1e3a8a' : 'transparent',
                      color: timeRange === 'week' ? 'white' : '#1e3a8a',
                      '&:hover': {
                        backgroundColor: timeRange === 'week' ? '#1e40af' : 'rgba(30, 58, 138, 0.1)',
                      }
                    }}
                  >
                    Semaine
                  </Button>
                </ButtonGroup>
              </Box>
              
              {/* Graphique en ligne avec données */}
              <Box sx={{ 
                height: 300, 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                background: 'linear-gradient(135deg, rgba(30, 58, 138, 0.05) 0%, rgba(30, 58, 138, 0.1) 100%)',
                borderRadius: 2,
                border: '1px solid rgba(30, 58, 138, 0.2)',
                position: 'relative'
              }}>
                {/* Ligne de graphique simulée */}
                <Box sx={{ 
                  position: 'absolute',
                  top: '50%',
                  left: 0,
                  right: 0,
                  height: 2,
                  background: 'linear-gradient(90deg, #fbbf24 0%, #f59e0b 100%)',
                  borderRadius: 1,
                  transform: 'translateY(-50%)',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: -4,
                    left: '10%',
                    width: 8,
                    height: 8,
                    bgcolor: '#fbbf24',
                    borderRadius: '50%',
                    boxShadow: '0 0 10px rgba(251, 191, 36, 0.5)'
                  },
                  '&::after': {
                    content: '""',
                    position: 'absolute',
                    top: -4,
                    left: '90%',
                    width: 8,
                    height: 8,
                    bgcolor: '#fbbf24',
                    borderRadius: '50%',
                    boxShadow: '0 0 10px rgba(251, 191, 36, 0.5)'
                  }
                }} />
                
                <Box sx={{ textAlign: 'center', zIndex: 1 }}>
                  <ChartIcon sx={{ fontSize: 60, color: '#1e3a8a', mb: 2 }} />
                  <Typography variant="h6" sx={{ color: '#1e293b', mb: 1 }}>
                    Graphique d'Évolution
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#64748b' }}>
                    {timeRange === 'month' ? 'Données de Juin à Décembre' : 'Données de la semaine'}
                  </Typography>
                </Box>
              </Box>
            </MainCard>
          </Grid>

          {/* Statistiques latérales */}
          <Grid item xs={12} lg={4}>
            <MainCard
              title="Aperçu des Ressources"
              subtitle="Statistiques de cette semaine"
              sx={{ height: '400px' }}
            >
              <Box sx={{ mb: 3 }}>
                <Typography variant="h4" sx={{ fontWeight: 700, color: '#1e293b', mb: 1 }}>
                  {stats.instances.toLocaleString()}
                </Typography>
                <Typography variant="body2" sx={{ color: '#64748b' }}>
                  Instances actives
                </Typography>
              </Box>

              {/* Statistiques détaillées */}
              <Box sx={{ space: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, p: 2, bgcolor: 'rgba(30, 58, 138, 0.05)', borderRadius: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <BusinessIcon sx={{ fontSize: 20, color: '#1e3a8a' }} />
                    <Typography variant="body2" sx={{ color: '#1e293b' }}>
                      Comptes
                    </Typography>
                  </Box>
                  <Typography variant="h6" sx={{ fontWeight: 600, color: '#1e293b' }}>
                    {stats.accounts}
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, p: 2, bgcolor: 'rgba(30, 58, 138, 0.05)', borderRadius: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CloudIcon sx={{ fontSize: 20, color: '#1e3a8a' }} />
                    <Typography variant="body2" sx={{ color: '#1e293b' }}>
                      Projets
                    </Typography>
                  </Box>
                  <Typography variant="h6" sx={{ fontWeight: 600, color: '#1e293b' }}>
                    {stats.projects}
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, p: 2, bgcolor: 'rgba(30, 58, 138, 0.05)', borderRadius: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <NetworkIcon sx={{ fontSize: 20, color: '#1e3a8a' }} />
                    <Typography variant="body2" sx={{ color: '#1e293b' }}>
                      Réseaux
                    </Typography>
                  </Box>
                  <Typography variant="h6" sx={{ fontWeight: 600, color: '#1e293b' }}>
                    {stats.networks}
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2, bgcolor: 'rgba(30, 58, 138, 0.05)', borderRadius: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <SecurityIcon sx={{ fontSize: 20, color: '#1e3a8a' }} />
                    <Typography variant="body2" sx={{ color: '#1e293b' }}>
                      Groupes de Sécurité
                    </Typography>
                  </Box>
                  <Typography variant="h6" sx={{ fontWeight: 600, color: '#1e293b' }}>
                    {stats.securityGroups}
                  </Typography>
                </Box>
              </Box>
            </MainCard>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default CloudStackDashboard; 