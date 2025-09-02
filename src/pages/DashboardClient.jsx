import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import cloudstackService from '../services/cloudstackService';
import {
  AppBar,
  Box,
  CssBaseline,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  Button,
  Card,
  CardContent,
  Grid,
  Chip,
  Container,
  Divider,
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
  Menu,
  MenuItem,
  ListItemSecondaryAction,
  IconButton as MuiIconButton,
  Snackbar
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  Assessment as AssessmentIcon,
  AccountCircle as AccountIcon,
  PowerSettingsNew as LogoutIcon,
  Add as AddIcon,
  PlayArrow as PlayIcon,
  Pause as PauseIcon,
  Monitor as MonitorIcon,
  CameraAlt as CameraIcon,
  Cloud as CloudIcon,
  TrendingUp as TrendingUpIcon,
  MoreVert as MoreVertIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Close as CloseIcon
} from '@mui/icons-material';
import MainCard from "../components/MainCard";

const drawerWidth = 280;

const DashboardClient = ({ onLogout }) => {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [vmList, setVmList] = useState([
    { id: 1, name: "VM-001", status: "Running", cpu: 2, ram: 4096, color: "success" },
    { id: 2, name: "VM-002", status: "Stopped", cpu: 1, ram: 2048, color: "error" },
  ]);

  // CRUD States
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedVM, setSelectedVM] = useState(null);
  const [editFormData] = useState({ name: "", cpu: "", ram: "" });
  const [formError, setFormError] = useState("");
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
  const [menuAnchor, setMenuAnchor] = useState(null);
  const [menuVM, setMenuVM] = useState(null);

  // État pour l'instance créée
  const [newlyCreatedInstance, setNewlyCreatedInstance] = useState(null);
  const [showInstanceDetails, setShowInstanceDetails] = useState(false);
  const [loading, setLoading] = useState(true);

  // Charger les vraies données CloudStack
  useEffect(() => {
    loadCloudStackData();
  }, []);

  const loadCloudStackData = async () => {
    try {
      setLoading(true);
      console.log('🔄 Chargement des instances CloudStack...');
      
      const cloudstackVMs = await cloudstackService.getVirtualMachines();
      console.log('✅ Instances CloudStack récupérées:', cloudstackVMs);
      
      // Transformer les données CloudStack en format compatible
      const transformedVMs = cloudstackVMs.map(vm => ({
        id: vm.id,
        name: vm.name || vm.displayname,
        status: vm.state === 'Running' ? 'Running' : vm.state === 'Stopped' ? 'Stopped' : 'Error',
        cpu: vm.cpunumber || 1,
        ram: (vm.memory || 512) * 1024, // Convertir en MB
        color: vm.state === 'Running' ? 'success' : vm.state === 'Stopped' ? 'error' : 'warning',
        template: vm.templatename,
        zone: vm.zonename,
        created: vm.created,
        ip: vm.nic?.[0]?.ipaddress || 'N/A'
      }));
      
      setVmList(transformedVMs);
      console.log('✅ Données transformées:', transformedVMs);
    } catch (error) {
      console.error('❌ Erreur lors du chargement des instances CloudStack:', error);
      // Garder les données simulées en cas d'erreur
      showSnackbar('Erreur lors du chargement des données CloudStack', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Récupérer les informations de l'instance créée depuis la navigation
  useEffect(() => {
    if (location.state?.vpsCreated) {
      const instanceInfo = {
        name: location.state.vpsName || 'Nouveau VPS',
        template: location.state.template || 'Template par défaut',
        computeOffering: location.state.computeOffering || 'Offre par défaut',
        startInstance: location.state.startInstance || false,
        createdAt: new Date().toLocaleString('fr-FR'),
        status: location.state.startInstance ? 'Démarrage...' : 'Arrêtée'
      };
      
      setNewlyCreatedInstance(instanceInfo);
      setShowInstanceDetails(true);
      
      // Ajouter l'instance à la liste des VMs
      const newVM = {
        id: vmList.length + 1,
        name: instanceInfo.name,
        status: instanceInfo.startInstance ? 'Starting' : 'Stopped',
        cpu: 2, // Valeur par défaut
        ram: 4096, // Valeur par défaut
        color: instanceInfo.startInstance ? 'warning' : 'error'
      };
      
      setVmList(prevList => [...prevList, newVM]);
      
      // Afficher un message de succès
      showSnackbar(`Instance "${instanceInfo.name}" créée avec succès!`, "success");
      
      // Nettoyer le state de navigation
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const createVM = () => {
    const newId = vmList.length + 1;
    const newVM = {
      id: newId,
      name: `VM-00${newId}`,
      status: "Running",
      cpu: 1,
      ram: 2048,
      color: "success"
    };
    setVmList([...vmList, newVM]);
    showSnackbar("VM créée avec succès!", "success");
  };

  // CRUD Operations
  const handleEditVM = (vm) => {
    setSelectedVM(vm);
    setEditFormData({
      name: vm.name,
      cpu: vm.cpu.toString(),
      ram: vm.ram.toString()
    });
    setFormError("");
    setEditDialogOpen(true);
  };

  const handleDeleteVM = (vm) => {
    setSelectedVM(vm);
    setDeleteDialogOpen(true);
  };

  const handleStartStopVM = async (vm) => {
    try {
      if (vm.status === "Running") {
        await cloudstackService.stopVirtualMachine(vm.id);
        showSnackbar(`VM ${vm.name} arrêtée!`, "success");
      } else {
        await cloudstackService.startVirtualMachine(vm.id);
        showSnackbar(`VM ${vm.name} démarrée!`, "success");
      }
      
      // Recharger les données après l'action
      await loadCloudStackData();
    } catch (error) {
      console.error('Erreur lors de l\'action sur la VM:', error);
      showSnackbar(`Erreur lors de l'action sur ${vm.name}`, "error");
    }
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    if (!editFormData.name.trim() || !editFormData.cpu || !editFormData.ram) {
      setFormError("Veuillez remplir tous les champs.");
      return;
    }

    const cpu = parseInt(editFormData.cpu);
    const ram = parseInt(editFormData.ram);

    if (cpu < 1 || cpu > 32) {
      setFormError("CPU doit être entre 1 et 32.");
      return;
    }

    if (ram < 512 || ram > 65536) {
      setFormError("RAM doit être entre 512 et 65536 MB.");
      return;
    }

    const updatedVMList = vmList.map(vm => {
      if (vm.id === selectedVM.id) {
        return {
          ...vm,
          name: editFormData.name,
          cpu: cpu,
          ram: ram
        };
      }
      return vm;
    });

    setVmList(updatedVMList);
    setEditDialogOpen(false);
    showSnackbar("VM modifiée avec succès!", "success");
  };

  const handleDeleteConfirm = () => {
    const updatedVMList = vmList.filter(vm => vm.id !== selectedVM.id);
    setVmList(updatedVMList);
    setDeleteDialogOpen(false);
    showSnackbar("VM supprimée avec succès!", "success");
  };

  const handleMenuOpen = (event, vm) => {
    setMenuAnchor(event.currentTarget);
    setMenuVM(vm);
  };

  const handleMenuClose = () => {
    setMenuAnchor(null);
    setMenuVM(null);
  };

  const showSnackbar = (message, severity = "success") => {
    setSnackbar({ open: true, message, severity });
  };

  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleCloseInstanceDetails = () => {
    setShowInstanceDetails(false);
    setNewlyCreatedInstance(null);
  };

  const drawer = (
    <Box>
      <Toolbar sx={{ minHeight: '80px !important' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Avatar sx={{ bgcolor: 'primary.main', width: 48, height: 48 }}>
            <CloudIcon />
          </Avatar>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              VPS Platform
            </Typography>
            <Typography variant="caption" color="textSecondary">
              Management System
            </Typography>
          </Box>
        </Box>
      </Toolbar>
      <Divider />
      <List sx={{ px: 2, py: 1 }}>
        <ListItem disablePadding>
          <ListItemButton sx={{ borderRadius: 1, mb: 0.5 }}>
            <ListItemIcon>
              <DashboardIcon color="primary" />
            </ListItemIcon>
            <ListItemText primary="Dashboard" />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton sx={{ borderRadius: 1, mb: 0.5 }}>
            <ListItemIcon>
              <AssessmentIcon />
            </ListItemIcon>
            <ListItemText primary="Reports" />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton sx={{ borderRadius: 1, mb: 0.5 }}>
            <ListItemIcon>
              <AccountIcon />
            </ListItemIcon>
            <ListItemText primary="My Account" />
          </ListItemButton>
        </ListItem>
      </List>
      <Divider sx={{ mx: 2, my: 2 }} />
      <Box sx={{ px: 2, py: 1 }}>
        <Card sx={{ bgcolor: 'primary.light', color: 'primary.contrastText' }}>
          <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
              Upgrade to Pro
            </Typography>
            <Typography variant="caption" sx={{ opacity: 0.8, mb: 2, display: 'block' }}>
              Unlock advanced VPS features
            </Typography>
            <Button
              variant="contained"
              size="small"
              fullWidth
              sx={{
                bgcolor: 'white',
                color: 'primary.main',
                '&:hover': { bgcolor: 'grey.100' }
              }}
            >
              Upgrade Now
            </Button>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
          bgcolor: 'background.paper',
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
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="h4" sx={{ fontWeight: 600, mb: 0.5 }}>
              VPS Dashboard
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Manage your virtual private servers
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            <Chip
              label="Live Data"
              color="success"
              size="small"
              icon={<TrendingUpIcon />}
            />
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={createVM}
            >
              New VM
            </Button>
            <Button
              variant="outlined"
              startIcon={<LogoutIcon />}
              onClick={onLogout}
            >
              Logout
            </Button>
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
        <Container maxWidth="xl">
          {/* Affichage des détails de l'instance créée */}
          {showInstanceDetails && newlyCreatedInstance && (
            <MainCard 
              title={`🎉 Instance "${newlyCreatedInstance.name}" créée avec succès!`}
              sx={{ 
                mb: 3, 
                border: '2px solid #4caf50',
                backgroundColor: '#f8fff8'
              }}
            >
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Card sx={{ p: 2, backgroundColor: '#f0f8f0' }}>
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: '#2e7d32' }}>
                      Détails de l'instance
                    </Typography>
                    <Box sx={{ display: 'grid', gap: 1 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="body2" color="textSecondary">Nom:</Typography>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>{newlyCreatedInstance.name}</Typography>
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="body2" color="textSecondary">Template:</Typography>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>{newlyCreatedInstance.template}</Typography>
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="body2" color="textSecondary">Offre de calcul:</Typography>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>{newlyCreatedInstance.computeOffering}</Typography>
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="body2" color="textSecondary">Statut:</Typography>
                        <Chip 
                          label={newlyCreatedInstance.status} 
                          color={newlyCreatedInstance.startInstance ? 'warning' : 'default'}
                          size="small"
                        />
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="body2" color="textSecondary">Créée le:</Typography>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>{newlyCreatedInstance.createdAt}</Typography>
                      </Box>
                    </Box>
                  </Card>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Card sx={{ p: 2, backgroundColor: '#fff8f0' }}>
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: '#f57c00' }}>
                      Actions rapides
                    </Typography>
                    <Box sx={{ display: 'grid', gap: 2 }}>
                      <Button
                        variant="contained"
                        startIcon={<PlayIcon />}
                        fullWidth
                        color="success"
                        disabled={!newlyCreatedInstance.startInstance}
                      >
                        {newlyCreatedInstance.startInstance ? 'Démarrer l\'instance' : 'Instance en cours de démarrage...'}
                      </Button>
                      <Button
                        variant="outlined"
                        startIcon={<MonitorIcon />}
                        fullWidth
                        color="primary"
                      >
                        Accéder à la console
                      </Button>
                      <Button
                        variant="outlined"
                        startIcon={<CameraIcon />}
                        fullWidth
                        color="secondary"
                      >
                        Créer un snapshot
                      </Button>
                    </Box>
                  </Card>
                </Grid>
              </Grid>
              <Box sx={{ mt: 3, textAlign: 'center' }}>
                <Button
                  variant="outlined"
                  onClick={handleCloseInstanceDetails}
                  startIcon={<CloseIcon />}
                >
                  Fermer ce message
                </Button>
              </Box>
            </MainCard>
          )}

          <MainCard title="Your Virtual Machines">
            <Grid container spacing={3}>
              {vmList.map((vm) => (
                <Grid item xs={12} sm={6} lg={4} key={vm.id}>
                  <Card
                    sx={{
                      height: '100%',
                      transition: 'all 0.3s',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: 4
                      }
                    }}
                  >
                    <CardContent>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                        <Avatar sx={{ bgcolor: `${vm.color}.main`, width: 56, height: 56 }}>
                          <CloudIcon />
                        </Avatar>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Chip
                            label={vm.status}
                            color={vm.color}
                            size="small"
                          />
                          <MuiIconButton
                            size="small"
                            onClick={(e) => handleMenuOpen(e, vm)}
                          >
                            <MoreVertIcon />
                          </MuiIconButton>
                        </Box>
                      </Box>
                      <Typography variant="h5" sx={{ fontWeight: 600, mb: 2 }}>
                        {vm.name}
                      </Typography>
                      <Box sx={{ mb: 3 }}>
                        <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
                          <strong>CPU:</strong> {vm.cpu} vCPU
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          <strong>RAM:</strong> {vm.ram} MB
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Button
                          variant="outlined"
                          size="small"
                          startIcon={<MonitorIcon />}
                          fullWidth
                        >
                          Console
                        </Button>
                        <Button
                          variant="outlined"
                          size="small"
                          startIcon={vm.status === 'Running' ? <PauseIcon /> : <PlayIcon />}
                          fullWidth
                          color={vm.status === 'Running' ? 'warning' : 'success'}
                          onClick={() => handleStartStopVM(vm)}
                        >
                          {vm.status === 'Running' ? 'Stop' : 'Start'}
                        </Button>
                        <Button
                          variant="outlined"
                          size="small"
                          startIcon={<CameraIcon />}
                          fullWidth
                        >
                          Snapshot
                        </Button>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </MainCard>

          {/* Statistiques avec graphiques en donut */}
          <MainCard title="Statistiques des VMs" sx={{ mt: 3 }}>
            <Grid container spacing={4}>
              {/* Graphique Statut des VMs */}
              <Grid item xs={12} md={6}>
                <Card sx={{ p: 3, height: '100%' }}>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 3, textAlign: 'center' }}>
                    Statut des VMs
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box sx={{ position: 'relative', width: 200, height: 200 }}>
                      {/* Donut Chart Status */}
                      <svg width="200" height="200" viewBox="0 0 200 200">
                        <defs>
                          <linearGradient id="statusGradient1" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#4caf50" />
                            <stop offset="100%" stopColor="#66bb6a" />
                          </linearGradient>
                          <linearGradient id="statusGradient2" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#f44336" />
                            <stop offset="100%" stopColor="#ef5350" />
                          </linearGradient>
                        </defs>

                        {/* Background circle */}
                        <circle cx="100" cy="100" r="80" fill="none" stroke="#f0f0f0" strokeWidth="20" />

                        {/* Status segments */}
                        {(() => {
                          const runningCount = vmList.filter(vm => vm.status === 'Running').length;
                          const stoppedCount = vmList.filter(vm => vm.status === 'Stopped').length;
                          const total = vmList.length;

                          const runningPercentage = (runningCount / total) * 100;
                          const stoppedPercentage = (stoppedCount / total) * 100;

                          const runningStartAngle = 0;
                          const runningEndAngle = (runningPercentage / 100) * 360;
                          const stoppedStartAngle = runningEndAngle;
                          const stoppedEndAngle = 360;

                          const runningX1 = 100 + 80 * Math.cos((runningStartAngle - 90) * Math.PI / 180);
                          const runningY1 = 100 + 80 * Math.sin((runningStartAngle - 90) * Math.PI / 180);
                          const runningX2 = 100 + 80 * Math.cos((runningEndAngle - 90) * Math.PI / 180);
                          const runningY2 = 100 + 80 * Math.sin((runningEndAngle - 90) * Math.PI / 180);

                          const stoppedX1 = 100 + 80 * Math.cos((stoppedStartAngle - 90) * Math.PI / 180);
                          const stoppedY1 = 100 + 80 * Math.sin((stoppedStartAngle - 90) * Math.PI / 180);
                          const stoppedX2 = 100 + 80 * Math.cos((stoppedEndAngle - 90) * Math.PI / 180);
                          const stoppedY2 = 100 + 80 * Math.sin((stoppedEndAngle - 90) * Math.PI / 180);

                          return (
                            <>
                              {runningCount > 0 && (
                                <path
                                  d={`M ${runningX1} ${runningY1} A 80 80 0 ${runningPercentage > 50 ? 1 : 0} 1 ${runningX2} ${runningY2}`}
                                  fill="none"
                                  stroke="url(#statusGradient1)"
                                  strokeWidth="20"
                                  strokeLinecap="round"
                                />
                              )}
                              {stoppedCount > 0 && (
                                <path
                                  d={`M ${stoppedX1} ${stoppedY1} A 80 80 0 ${stoppedPercentage > 50 ? 1 : 0} 1 ${stoppedX2} ${stoppedY2}`}
                                  fill="none"
                                  stroke="url(#statusGradient2)"
                                  strokeWidth="20"
                                  strokeLinecap="round"
                                />
                              )}
                            </>
                          );
                        })()}

                        {/* Center text */}
                        <text x="100" y="95" textAnchor="middle" fontSize="24" fontWeight="bold" fill="#333">
                          {vmList.length}
                        </text>
                        <text x="100" y="115" textAnchor="middle" fontSize="12" fill="#666">
                          Total VMs
                        </text>
                      </svg>
                    </Box>

                    {/* Legend */}
                    <Box sx={{ flex: 1, ml: 3 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <Box
                          sx={{
                            width: 16,
                            height: 16,
                            bgcolor: '#4caf50',
                            borderRadius: '50%',
                            mr: 2
                          }}
                        />
                        <Typography variant="body2" sx={{ flex: 1 }}>
                          Running
                        </Typography>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {vmList.filter(vm => vm.status === 'Running').length}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <Box
                          sx={{
                            width: 16,
                            height: 16,
                            bgcolor: '#f44336',
                            borderRadius: '50%',
                            mr: 2
                          }}
                        />
                        <Typography variant="body2" sx={{ flex: 1 }}>
                          Stopped
                        </Typography>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {vmList.filter(vm => vm.status === 'Stopped').length}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                </Card>
              </Grid>

              {/* Graphique Répartition des Ressources */}
              <Grid item xs={12} md={6}>
                <Card sx={{ p: 3, height: '100%' }}>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 3, textAlign: 'center' }}>
                    Répartition des Ressources
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box sx={{ position: 'relative', width: 200, height: 200 }}>
                      {/* Donut Chart Resources */}
                      <svg width="200" height="200" viewBox="0 0 200 200">
                        <defs>
                          <linearGradient id="resourceGradient1" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#2196f3" />
                            <stop offset="100%" stopColor="#42a5f5" />
                          </linearGradient>
                          <linearGradient id="resourceGradient2" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#ff9800" />
                            <stop offset="100%" stopColor="#ffb74d" />
                          </linearGradient>
                        </defs>
                        
                        {/* Background circle */}
                        <circle cx="100" cy="100" r="80" fill="none" stroke="#f0f0f0" strokeWidth="20" />
                        
                        {/* Resource segments */}
                        {(() => {
                          const totalCpu = vmList.reduce((acc, vm) => acc + vm.cpu, 0);
                          const totalRam = vmList.reduce((acc, vm) => acc + vm.ram, 0);
                          const totalResources = totalCpu + totalRam;
                          
                          const cpuPercentage = totalResources > 0 ? (totalCpu / totalResources) * 100 : 0;
                          const ramPercentage = totalResources > 0 ? (totalRam / totalResources) * 100 : 0;
                          
                          const cpuStartAngle = 0;
                          const cpuEndAngle = (cpuPercentage / 100) * 360;
                          const ramStartAngle = cpuEndAngle;
                          const ramEndAngle = 360;
                          
                          const cpuX1 = 100 + 80 * Math.cos((cpuStartAngle - 90) * Math.PI / 180);
                          const cpuY1 = 100 + 80 * Math.sin((cpuStartAngle - 90) * Math.PI / 180);
                          const cpuX2 = 100 + 80 * Math.cos((cpuEndAngle - 90) * Math.PI / 180);
                          const cpuY2 = 100 + 80 * Math.sin((cpuEndAngle - 90) * Math.PI / 180);
                          
                          const ramX1 = 100 + 80 * Math.cos((ramStartAngle - 90) * Math.PI / 180);
                          const ramY1 = 100 + 80 * Math.sin((ramStartAngle - 90) * Math.PI / 180);
                          const ramX2 = 100 + 80 * Math.cos((ramEndAngle - 90) * Math.PI / 180);
                          const ramY2 = 100 + 80 * Math.sin((ramEndAngle - 90) * Math.PI / 180);
                          
                          return (
                            <>
                              {totalCpu > 0 && (
                                <path
                                  d={`M ${cpuX1} ${cpuY1} A 80 80 0 ${cpuPercentage > 50 ? 1 : 0} 1 ${cpuX2} ${cpuY2}`}
                                  fill="none"
                                  stroke="url(#resourceGradient1)"
                                  strokeWidth="20"
                                  strokeLinecap="round"
                                />
                              )}
                              {totalRam > 0 && (
                                <path
                                  d={`M ${ramX1} ${ramY1} A 80 80 0 ${ramPercentage > 50 ? 1 : 0} 1 ${ramX2} ${ramY2}`}
                                  fill="none"
                                  stroke="url(#resourceGradient2)"
                                  strokeWidth="20"
                                  strokeLinecap="round"
                                />
                              )}
                            </>
                          );
                        })()}
                        
                        {/* Center text */}
                        <text x="100" y="95" textAnchor="middle" fontSize="20" fontWeight="bold" fill="#333">
                          {vmList.reduce((acc, vm) => acc + vm.cpu, 0)} vCPU
                        </text>
                        <text x="100" y="115" textAnchor="middle" fontSize="12" fill="#666">
                          {vmList.reduce((acc, vm) => acc + vm.ram, 0)} MB
                        </text>
                      </svg>
                    </Box>
                    
                    {/* Legend */}
                    <Box sx={{ flex: 1, ml: 3 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <Box 
                          sx={{ 
                            width: 16, 
                            height: 16, 
                            bgcolor: '#2196f3', 
                            borderRadius: '50%', 
                            mr: 2 
                          }} 
                        />
                        <Typography variant="body2" sx={{ flex: 1 }}>
                          CPU Total
                        </Typography>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {vmList.reduce((acc, vm) => acc + vm.cpu, 0)} vCPU
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <Box 
                          sx={{ 
                            width: 16, 
                            height: 16, 
                            bgcolor: '#ff9800', 
                            borderRadius: '50%', 
                            mr: 2 
                          }} 
                        />
                        <Typography variant="body2" sx={{ flex: 1 }}>
                          RAM Total
                        </Typography>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {vmList.reduce((acc, vm) => acc + vm.ram, 0)} MB
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                </Card>
              </Grid>
            </Grid>

            {/* Résumé global */}
            <Box sx={{ mt: 4, p: 3, bgcolor: 'background.paper', borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 3, color: 'text.primary' }}>
                Résumé global
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6} md={3}>
                  <Box sx={{ textAlign: 'center', p: 2 }}>
                    <Typography variant="h3" sx={{ fontWeight: 700, color: 'primary.main', mb: 1 }}>
                      {vmList.length}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Total VMs
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Box sx={{ textAlign: 'center', p: 2 }}>
                    <Typography variant="h3" sx={{ fontWeight: 700, color: 'success.main', mb: 1 }}>
                      {vmList.filter(vm => vm.status === 'Running').length}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      VMs Running
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Box sx={{ textAlign: 'center', p: 2 }}>
                    <Typography variant="h3" sx={{ fontWeight: 700, color: 'info.main', mb: 1 }}>
                      {vmList.reduce((acc, vm) => acc + vm.cpu, 0)}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      CPU Total
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Box sx={{ textAlign: 'center', p: 2 }}>
                    <Typography variant="h3" sx={{ fontWeight: 700, color: 'warning.main', mb: 1 }}>
                      {vmList.reduce((acc, vm) => acc + vm.ram, 0)} MB
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      RAM Total
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </Box>
          </MainCard>
        </Container>
      </Box>

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          Modifier la VM
          <IconButton
            aria-label="close"
            onClick={() => setEditDialogOpen(false)}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <form onSubmit={handleEditSubmit}>
          <DialogContent>
            {formError && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {formError}
              </Alert>
            )}
            <TextField
              autoFocus
              margin="dense"
              name="name"
              label="Nom de la VM"
              type="text"
              fullWidth
              variant="outlined"
              value={editFormData.name}
              onChange={(e) => setEditFormData({...editFormData, name: e.target.value})}
              sx={{ mb: 2 }}
            />
            <TextField
              margin="dense"
              name="cpu"
              label="CPU (vCPU)"
              type="number"
              fullWidth
              variant="outlined"
              value={editFormData.cpu}
              onChange={(e) => setEditFormData({...editFormData, cpu: e.target.value})}
              inputProps={{ min: 1, max: 32 }}
              sx={{ mb: 2 }}
            />
            <TextField
              margin="dense"
              name="ram"
              label="RAM (MB)"
              type="number"
              fullWidth
              variant="outlined"
              value={editFormData.ram}
              onChange={(e) => setEditFormData({...editFormData, ram: e.target.value})}
              inputProps={{ min: 512, max: 65536 }}
            />
          </DialogContent>
          <DialogActions sx={{ p: 3 }}>
            <Button onClick={() => setEditDialogOpen(false)} variant="outlined">
              Annuler
            </Button>
            <Button type="submit" variant="contained">
              Modifier
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Confirmer la suppression</DialogTitle>
        <DialogContent>
          <Typography>
            Êtes-vous sûr de vouloir supprimer la VM "{selectedVM?.name}" ? Cette action est irréversible.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)} variant="outlined">
            Annuler
          </Button>
          <Button onClick={handleDeleteConfirm} variant="contained" sx={{ bgcolor: '#6b7280', '&:hover': { bgcolor: '#4b5563' } }}>
            Supprimer
          </Button>
        </DialogActions>
      </Dialog>

      {/* VM Menu */}
      <Menu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={() => {
          handleEditVM(menuVM);
          handleMenuClose();
        }}>
          <ListItemIcon>
            <EditIcon fontSize="small" />
          </ListItemIcon>
          Modifier
        </MenuItem>
        <MenuItem onClick={() => {
          handleDeleteVM(menuVM);
          handleMenuClose();
        }}>
          <ListItemIcon>
            <DeleteIcon fontSize="small" />
          </ListItemIcon>
          Supprimer
        </MenuItem>
      </Menu>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default DashboardClient;
