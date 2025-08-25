import React, { useState } from "react";
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
  Divider,
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
  LinearProgress,
  Chip,
  Menu,
  MenuItem,
  ListItemSecondaryAction,
  IconButton as MuiIconButton,
  Snackbar,
  FormControl,
  InputLabel,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  Assessment as AssessmentIcon,
  AccountCircle as AccountIcon,
  PowerSettingsNew as LogoutIcon,
  Add as AddIcon,
  Close as CloseIcon,
  People as PeopleIcon,
  Business as BusinessIcon,
  Storage as StorageIcon,
  Memory as MemoryIcon,
  MoreVert as MoreVertIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Cloud as CloudIcon
} from '@mui/icons-material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import MainCard from "../components/MainCard";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area, AreaChart } from 'recharts';
import HeaderUserBar from "../components/HeaderUserBar";
import ApiTest from "../components/ApiTest";

const drawerWidth = 280;

const SubProviderDashboard = ({ onLogout }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [clients, setClients] = useState([
    { id: 1, name: "Client A", email: "a@client.com", vms: 3, cpuQuota: 8, cpuUsed: 4, ramQuota: 16384, ramUsed: 8192 },
    { id: 2, name: "Client B", email: "b@client.com", vms: 1, cpuQuota: 4, cpuUsed: 2, ramQuota: 8192, ramUsed: 2048 },
  ]);

  const [subProviderData] = React.useState({
    name: "Mon Sub-Provider",
    logoUrl: "https://via.placeholder.com/100x40?text=Logo",
    themeColor: "#2563eb",
  });

  // CRUD States
  const [showForm, setShowForm] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);
  const [formData, setFormData] = useState({ name: "", email: "" });
  const [editFormData, setEditFormData] = useState({ 
    name: "", 
    email: "", 
    cpuQuota: "", 
    ramQuota: "" 
  });
  const [formError, setFormError] = useState("");
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
  const [menuAnchor, setMenuAnchor] = useState(null);
  const [menuClient, setMenuClient] = useState(null);
  const [showApiTest, setShowApiTest] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const createClient = () => setShowForm(true);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setFormError("");
  };

  const handleEditChange = (e) => {
    setEditFormData({ ...editFormData, [e.target.name]: e.target.value });
    setFormError("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim()) {
      setFormError("Veuillez remplir tous les champs.");
      return;
    }
    if (!formData.email.includes("@")) {
      setFormError("Email invalide.");
      return;
    }
    const newId = clients.length + 1;
    const newClient = {
      id: newId,
      name: formData.name,
      email: formData.email,
      vms: 0,
      cpuQuota: 4,
      cpuUsed: 0,
      ramQuota: 8192,
      ramUsed: 0,
    };
    setClients([...clients, newClient]);
    setFormData({ name: "", email: "" });
    setShowForm(false);
    showSnackbar("Client créé avec succès!", "success");
  };

  // CRUD Operations
  const handleEditClient = (client) => {
    setSelectedClient(client);
    setEditFormData({
      name: client.name,
      email: client.email,
      cpuQuota: client.cpuQuota.toString(),
      ramQuota: client.ramQuota.toString()
    });
    setFormError("");
    setEditDialogOpen(true);
  };

  const handleDeleteClient = (client) => {
    setSelectedClient(client);
    setDeleteDialogOpen(true);
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    if (!editFormData.name.trim() || !editFormData.email.trim() || !editFormData.cpuQuota || !editFormData.ramQuota) {
      setFormError("Veuillez remplir tous les champs.");
      return;
    }
    
    if (!editFormData.email.includes("@")) {
      setFormError("Email invalide.");
      return;
    }

    const cpuQuota = parseInt(editFormData.cpuQuota);
    const ramQuota = parseInt(editFormData.ramQuota);
    
    if (cpuQuota < 1 || cpuQuota > 64) {
      setFormError("Quota CPU doit être entre 1 et 64.");
      return;
    }
    
    if (ramQuota < 1024 || ramQuota > 131072) {
      setFormError("Quota RAM doit être entre 1024 et 131072 MB.");
      return;
    }

    const updatedClients = clients.map(client => {
      if (client.id === selectedClient.id) {
        return {
          ...client,
          name: editFormData.name,
          email: editFormData.email,
          cpuQuota: cpuQuota,
          ramQuota: ramQuota
        };
      }
      return client;
    });
    
    setClients(updatedClients);
    setEditDialogOpen(false);
    showSnackbar("Client modifié avec succès!", "success");
  };

  const handleDeleteConfirm = () => {
    const updatedClients = clients.filter(client => client.id !== selectedClient.id);
    setClients(updatedClients);
    setDeleteDialogOpen(false);
    showSnackbar("Client supprimé avec succès!", "success");
  };

  const handleMenuOpen = (event, client) => {
    setMenuAnchor(event.currentTarget);
    setMenuClient(client);
  };

  const handleMenuClose = () => {
    setMenuAnchor(null);
    setMenuClient(null);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setFormData({ name: "", email: "" });
    setFormError("");
  };

  const showSnackbar = (message, severity = "success") => {
    setSnackbar({ open: true, message, severity });
  };

  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  // KPI summary cards data
  const kpiCards = [
    {
      title: "Total Page Views",
      value: "4,42,236",
      trend: 59.3,
      trendUp: true,
      extra: "35,000",
      extraText: "You made an extra",
      color: "primary"
    },
    {
      title: "Total Users",
      value: "78,250",
      trend: 70.5,
      trendUp: true,
      extra: "8,900",
      extraText: "You made an extra",
      color: "primary"
    },
    {
      title: "Total Order",
      value: "18,800",
      trend: 27.4,
      trendUp: false,
      extra: "1,943",
      extraText: "You made an extra",
      color: "warning"
    },
    {
      title: "Total Sales",
      value: "35,078",
      trend: 27.4,
      trendUp: false,
      extra: "20,395",
      extraText: "You made an extra",
      color: "warning"
    }
  ];

  // Ajouter les données pour la table Recent Orders
  const recentOrders = [
    { trackingNo: 13256498, productName: "Keyboard", totalOrder: 125, status: "Rejected", totalAmount: "$70,999" },
    { trackingNo: 13286564, productName: "Computer Accessories", totalOrder: 100, status: "Approved", totalAmount: "$83,348" },
    { trackingNo: 84564564, productName: "Camera Lens", totalOrder: 40, status: "Rejected", totalAmount: "$40,570" },
    { trackingNo: 86739658, productName: "TV", totalOrder: 99, status: "Pending", totalAmount: "$410,780" },
    { trackingNo: 98652366, productName: "Handset", totalOrder: 50, status: "Approved", totalAmount: "$10,239" },
    { trackingNo: 98753263, productName: "Mouse", totalOrder: 89, status: "Rejected", totalAmount: "$10,570" },
    { trackingNo: 98753275, productName: "Desktop", totalOrder: 185, status: "Approved", totalAmount: "$98,063" },
    { trackingNo: 98753291, productName: "Chair", totalOrder: 100, status: "Pending", totalAmount: "$14,001" },
    { trackingNo: 98756325, productName: "Mobile", totalOrder: 355, status: "Approved", totalAmount: "$90,989" },
    { trackingNo: 98764564, productName: "Laptop", totalOrder: 300, status: "Pending", totalAmount: "$180,139" }
  ];

  const drawer = (
    <Box>
      <Toolbar sx={{ minHeight: '80px !important' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Avatar sx={{ bgcolor: 'primary.main', width: 48, height: 48 }}>
            <BusinessIcon />
          </Avatar>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              {subProviderData.name}
            </Typography>
            <Typography variant="caption" color="textSecondary">
              Sub-Provider Dashboard
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
              Unlock advanced features
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

  // Example data for the chart
  const visitorData = [
    { name: 'Jan', pageViews: 110, sessions: 80 },
    { name: 'Feb', pageViews: 70, sessions: 90 },
    { name: 'Mar', pageViews: 150, sessions: 100 },
    { name: 'Apr', pageViews: 40, sessions: 35 },
    { name: 'May', pageViews: 60, sessions: 60 },
    { name: 'Jun', pageViews: 100, sessions: 80 },
    { name: 'Jul', pageViews: 90, sessions: 40 },
    { name: 'Aug', pageViews: 110, sessions: 60 },
    { name: 'Sep', pageViews: 100, sessions: 50 },
    { name: 'Oct', pageViews: 120, sessions: 55 },
    { name: 'Nov', pageViews: 115, sessions: 60 },
    { name: 'Dec', pageViews: 60, sessions: 40 },
  ];

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar>
          <Typography variant="h6" noWrap component="div">
            Mon Sub-Provider
          </Typography>
          <Box sx={{ flexGrow: 1 }} />
          <HeaderUserBar userName="John Doe" />
        </Toolbar>
      </AppBar>
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' },
        }}
      >
        <Toolbar />
        {drawer}
      </Drawer>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: { xs: 0, sm: 1, md: 1 },
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` }
        }}
      >
        <Toolbar />
        {/* Suppression du Container pour que le contenu prenne toute la largeur */}
        {/* KPI Summary Cards */}
        <MainCard sx={{ mb: 2, p: 1, bgcolor: 'transparent', boxShadow: 'none' }}>
          <Grid container spacing={1}>
            {kpiCards.map((card, idx) => (
              <Grid item xs={12} sm={6} lg={3} key={idx}>
                <Card sx={{ height: '100%', p: 1 }}>
                  <CardContent sx={{ p: 1, '&:last-child': { pb: 1 } }}>
                    <Typography variant="h6" color="textSecondary" gutterBottom>
                      {card.title}
                    </Typography>
                    <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                      {card.value}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      {card.trendUp ? (
                        <TrendingUpIcon color="success" />
                      ) : (
                        <TrendingDownIcon color="error" />
                      )}
                      <Typography variant="body2" color={card.trendUp ? 'success.main' : 'error.main'}>
                        {card.trend}%
                      </Typography>
                    </Box>
                    <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                      {card.extraText} <Box component="span" sx={{ color: card.trendUp ? 'primary.main' : 'warning.main', fontWeight: 600 }}>{card.extra}</Box> this year
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </MainCard>

        {/* Recent Orders Table et Mes Clients - Layout en Grid */}
        <Grid container spacing={2} sx={{ mt: 2 }}>
          {/* Recent Orders Table - À gauche */}
          <Grid item xs={12} lg={6}>
            <MainCard title="Recent Orders" sx={{ p: 1 }}>
              <TableContainer component={Paper}>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Tracking No</TableCell>
                      <TableCell>Product Name</TableCell>
                      <TableCell>Total Order</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell align="right">Total Amount</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {recentOrders.map((order) => (
                      <TableRow key={order.trackingNo}>
                        <TableCell>{order.trackingNo}</TableCell>
                        <TableCell>{order.productName}</TableCell>
                        <TableCell>{order.totalOrder}</TableCell>
                        <TableCell>
                          <Chip
                            label={order.status}
                            color={order.status === 'Approved' ? 'success' : order.status === 'Rejected' ? 'error' : 'warning'}
                            size="small"
                          />
                        </TableCell>
                        <TableCell align="right">{order.totalAmount}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </MainCard>
          </Grid>

          {/* Mes Clients Section - À droite */}
          <Grid item xs={12} lg={6}>
            <MainCard 
              title="Mes Clients" 
              sx={{ p: 1 }}
              action={
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={<CloudIcon />}
                  onClick={() => setShowApiTest(!showApiTest)}
                  sx={{ mr: 1 }}
                >
                  {showApiTest ? 'Masquer' : 'Test'} API
                </Button>
              }
            >
              <Grid container spacing={1}>
                {clients.map((client) => (
                  <Grid item xs={12} sm={6} key={client.id}>
                    <Card sx={{ p: 1, height: '100%' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <Avatar sx={{ bgcolor: 'primary.main', mr: 1, width: 32, height: 32 }}>
                          <PeopleIcon />
                        </Avatar>
                        <Box sx={{ flexGrow: 1 }}>
                          <Typography variant="h6" sx={{ fontSize: '0.9rem' }}>{client.name}</Typography>
                          <Typography variant="body2" color="textSecondary" sx={{ fontSize: '0.75rem' }}>{client.email}</Typography>
                        </Box>
                        <IconButton onClick={(e) => handleMenuOpen(e, client)} size="small">
                          <MoreVertIcon fontSize="small" />
                        </IconButton>
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                        <Typography variant="body2" sx={{ fontSize: '0.75rem' }}>VMs: {client.vms}</Typography>
                        <Typography variant="body2" sx={{ fontSize: '0.75rem' }}>CPU: {client.cpuUsed}/{client.cpuQuota}</Typography>
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="body2" sx={{ fontSize: '0.75rem' }}>RAM: {client.ramUsed}/{client.ramQuota} MB</Typography>
                      </Box>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </MainCard>
          </Grid>
        </Grid>

        {/* Formulaire création client */}
        <Dialog open={showForm} onClose={handleCloseForm} maxWidth="sm" fullWidth>
          <DialogTitle>
            Créer un nouveau client
            <IconButton
              aria-label="close"
              onClick={handleCloseForm}
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
          <form onSubmit={handleSubmit}>
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
                label="Nom du client"
                type="text"
                fullWidth
                variant="outlined"
                value={formData.name}
                onChange={handleChange}
                sx={{ mb: 2 }}
              />
              <TextField
                margin="dense"
                name="email"
                label="Email du client"
                type="email"
                fullWidth
                variant="outlined"
                value={formData.email}
                onChange={handleChange}
              />
            </DialogContent>
            <DialogActions sx={{ p: 3 }}>
              <Button onClick={handleCloseForm} variant="outlined">
                Annuler
              </Button>
              <Button type="submit" variant="contained">
                Créer
              </Button>
            </DialogActions>
          </form>
        </Dialog>

        {/* Edit Dialog */}
        <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)} maxWidth="sm" fullWidth>
          <DialogTitle>
            Modifier le client
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
                label="Nom du client"
                type="text"
                fullWidth
                variant="outlined"
                value={editFormData.name}
                onChange={handleEditChange}
                sx={{ mb: 2 }}
              />
              <TextField
                margin="dense"
                name="email"
                label="Email du client"
                type="email"
                fullWidth
                variant="outlined"
                value={editFormData.email}
                onChange={handleEditChange}
                sx={{ mb: 2 }}
              />
              <TextField
                margin="dense"
                name="cpuQuota"
                label="Quota CPU (vCPU)"
                type="number"
                fullWidth
                variant="outlined"
                value={editFormData.cpuQuota}
                onChange={handleEditChange}
                inputProps={{ min: 1, max: 64 }}
                sx={{ mb: 2 }}
              />
              <TextField
                margin="dense"
                name="ramQuota"
                label="Quota RAM (MB)"
                type="number"
                fullWidth
                variant="outlined"
                value={editFormData.ramQuota}
                onChange={handleEditChange}
                inputProps={{ min: 1024, max: 131072 }}
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
              Êtes-vous sûr de vouloir supprimer le client "{selectedClient?.name}" ? 
              Cette action supprimera également toutes ses VMs et est irréversible.
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

        {/* Statistiques globales */}
        <MainCard title="Statistiques d'usage global" sx={{ mt: 2, p: 1 }}>
          <Grid container spacing={2}>
            {/* Graphique CPU */}
            <Grid item xs={12} lg={6}>
              <Card sx={{ p: 2, height: '100%' }}>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, textAlign: 'center' }}>
                  Distribution CPU
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box sx={{ position: 'relative', width: 150, height: 150 }}>
                    {/* Donut Chart CPU */}
                    <svg width="150" height="150" viewBox="0 0 150 150">
                      <defs>
                        <linearGradient id="cpuGradient1" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#667eea" />
                          <stop offset="100%" stopColor="#764ba2" />
                        </linearGradient>
                        <linearGradient id="cpuGradient2" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#f093fb" />
                          <stop offset="100%" stopColor="#f5576c" />
                        </linearGradient>
                        <linearGradient id="cpuGradient3" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#4facfe" />
                          <stop offset="100%" stopColor="#00f2fe" />
                        </linearGradient>
                      </defs>
                      
                      {/* Background circle */}
                      <circle cx="75" cy="75" r="60" fill="none" stroke="#f0f0f0" strokeWidth="15" />
                      
                      {/* CPU segments */}
                      {clients.map((client, index) => {
                        const totalCpu = clients.reduce((acc, c) => acc + c.cpuQuota, 0);
                        const percentage = (client.cpuQuota / totalCpu) * 100;
                        const startAngle = clients.slice(0, index).reduce((acc, c) => acc + (c.cpuQuota / totalCpu) * 360, 0);
                        const endAngle = startAngle + (percentage / 100) * 360;
                        
                        const x1 = 75 + 60 * Math.cos((startAngle - 90) * Math.PI / 180);
                        const y1 = 75 + 60 * Math.sin((startAngle - 90) * Math.PI / 180);
                        const x2 = 75 + 60 * Math.cos((endAngle - 90) * Math.PI / 180);
                        const y2 = 75 + 60 * Math.sin((endAngle - 90) * Math.PI / 180);
                        
                        const largeArcFlag = percentage > 50 ? 1 : 0;
                        
                        const colors = ['url(#cpuGradient1)', 'url(#cpuGradient2)', 'url(#cpuGradient3)', '#ff6b6b', '#4834d4'];
                        
                        return (
                          <path
                            key={client.id}
                            d={`M ${x1} ${y1} A 60 60 0 ${largeArcFlag} 1 ${x2} ${y2}`}
                            fill="none"
                            stroke={colors[index % colors.length]}
                            strokeWidth="15"
                            strokeLinecap="round"
                          />
                        );
                      })}
                      
                      {/* Center text */}
                      <text x="75" y="70" textAnchor="middle" fontSize="18" fontWeight="bold" fill="#333">
                        {clients.reduce((acc, c) => acc + c.cpuUsed, 0)}
                      </text>
                      <text x="75" y="85" textAnchor="middle" fontSize="10" fill="#666">
                        vCPU Utilisé
                      </text>
                    </svg>
                  </Box>
                  
                  {/* Legend */}
                  <Box sx={{ flex: 1, ml: 2 }}>
                    {clients.map((client, index) => {
                      const totalCpu = clients.reduce((acc, c) => acc + c.cpuQuota, 0);
                      const percentage = Math.round((client.cpuQuota / totalCpu) * 100);
                      const colors = ['#667eea', '#f093fb', '#4facfe', '#ff6b6b', '#4834d4'];
                      
                      return (
                        <Box key={client.id} sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                          <Box 
                            sx={{ 
                              width: 12, 
                              height: 12, 
                              bgcolor: colors[index % colors.length], 
                              borderRadius: '50%', 
                              mr: 1 
                            }} 
                          />
                          <Typography variant="body2" sx={{ flex: 1, fontSize: '0.75rem' }}>
                            {client.name}
                          </Typography>
                          <Typography variant="body2" sx={{ fontWeight: 600, fontSize: '0.75rem' }}>
                            {percentage}%
                          </Typography>
                        </Box>
                      );
                    })}
                  </Box>
                </Box>
              </Card>
            </Grid>

            {/* Graphique RAM */}
            <Grid item xs={12} lg={6}>
              <Card sx={{ p: 2, height: '100%' }}>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, textAlign: 'center' }}>
                  Distribution RAM
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box sx={{ position: 'relative', width: 150, height: 150 }}>
                    {/* Donut Chart RAM */}
                    <svg width="150" height="150" viewBox="0 0 150 150">
                      <defs>
                        <linearGradient id="ramGradient1" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#a8edea" />
                          <stop offset="100%" stopColor="#fed6e3" />
                        </linearGradient>
                        <linearGradient id="ramGradient2" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#ffecd2" />
                          <stop offset="100%" stopColor="#fcb69f" />
                        </linearGradient>
                        <linearGradient id="ramGradient3" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#ff9a9e" />
                          <stop offset="100%" stopColor="#fecfef" />
                        </linearGradient>
                      </defs>
                      
                      {/* Background circle */}
                      <circle cx="75" cy="75" r="60" fill="none" stroke="#f0f0f0" strokeWidth="15" />
                      
                      {/* RAM segments */}
                      {clients.map((client, index) => {
                        const totalRam = clients.reduce((acc, c) => acc + c.ramQuota, 0);
                        const percentage = (client.ramQuota / totalRam) * 100;
                        const startAngle = clients.slice(0, index).reduce((acc, c) => acc + (c.ramQuota / totalRam) * 360, 0);
                        const endAngle = startAngle + (percentage / 100) * 360;
                        
                        const x1 = 75 + 60 * Math.cos((startAngle - 90) * Math.PI / 180);
                        const y1 = 75 + 60 * Math.sin((startAngle - 90) * Math.PI / 180);
                        const x2 = 75 + 60 * Math.cos((endAngle - 90) * Math.PI / 180);
                        const y2 = 75 + 60 * Math.sin((endAngle - 90) * Math.PI / 180);
                        
                        const largeArcFlag = percentage > 50 ? 1 : 0;
                        
                        const colors = ['url(#ramGradient1)', 'url(#ramGradient2)', 'url(#ramGradient3)', '#ff9a9e', '#a8edea'];
                        
                        return (
                          <path
                            key={client.id}
                            d={`M ${x1} ${y1} A 60 60 0 ${largeArcFlag} 1 ${x2} ${y2}`}
                            fill="none"
                            stroke={colors[index % colors.length]}
                            strokeWidth="15"
                            strokeLinecap="round"
                          />
                        );
                      })}
                      
                      {/* Center text */}
                      <text x="75" y="70" textAnchor="middle" fontSize="18" fontWeight="bold" fill="#333">
                        {clients.reduce((acc, c) => acc + c.ramUsed, 0)}
                      </text>
                      <text x="75" y="85" textAnchor="middle" fontSize="10" fill="#666">
                        MB Utilisé
                      </text>
                    </svg>
                  </Box>
                  
                  {/* Legend */}
                  <Box sx={{ flex: 1, ml: 2 }}>
                    {clients.map((client, index) => {
                      const totalRam = clients.reduce((acc, c) => acc + c.ramQuota, 0);
                      const percentage = Math.round((client.ramQuota / totalRam) * 100);
                      const colors = ['#a8edea', '#ffecd2', '#ff9a9e', '#fed6e3', '#fcb69f'];
                      
                      return (
                        <Box key={client.id} sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                          <Box 
                            sx={{ 
                              width: 12, 
                              height: 12, 
                              bgcolor: colors[index % colors.length], 
                              borderRadius: '50%', 
                              mr: 1 
                            }} 
                          />
                          <Typography variant="body2" sx={{ flex: 1, fontSize: '0.75rem' }}>
                            {client.name}
                          </Typography>
                          <Typography variant="body2" sx={{ fontWeight: 600, fontSize: '0.75rem' }}>
                            {percentage}%
                          </Typography>
                        </Box>
                      );
                    })}
                  </Box>
                </Box>
              </Card>
            </Grid>
          </Grid>

          {/* Résumé global */}
          <Box sx={{ mt: 3, p: 2, bgcolor: 'background.paper', borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: 'text.primary' }}>
              Résumé global
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} lg={3}>
                <Box sx={{ textAlign: 'center', p: 1 }}>
                  <Typography variant="h3" sx={{ fontWeight: 700, color: 'primary.main', mb: 1 }}>
                    {clients.length}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Clients actifs
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6} lg={3}>
                <Box sx={{ textAlign: 'center', p: 1 }}>
                  <Typography variant="h3" sx={{ fontWeight: 700, color: 'success.main', mb: 1 }}>
                    {clients.reduce((acc, c) => acc + c.vms, 0)}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Total VMs
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6} lg={3}>
                <Box sx={{ textAlign: 'center', p: 1 }}>
                  <Typography variant="h3" sx={{ fontWeight: 700, color: 'info.main', mb: 1 }}>
                    {clients.reduce((acc, c) => acc + c.cpuQuota, 0)}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    CPU Total
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6} lg={3}>
                <Box sx={{ textAlign: 'center', p: 1 }}>
                  <Typography variant="h3" sx={{ fontWeight: 700, color: 'warning.main', mb: 1 }}>
                    {clients.reduce((acc, c) => acc + c.ramQuota, 0)} MB
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    RAM Total
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Box>
        </MainCard>
        {/* Unique Visitor Chart */}
        <MainCard title="Unique Visitor" sx={{ mt: 2, p: 1 }}>
          <Box sx={{ width: '100%', height: 300 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={visitorData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorPageViews" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#1976d2" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#1976d2" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Area type="monotone" dataKey="pageViews" stroke="#1976d2" fillOpacity={1} fill="url(#colorPageViews)" name="Page views" />
                <Line type="monotone" dataKey="sessions" stroke="#1976d2" name="Sessions" />
              </AreaChart>
            </ResponsiveContainer>
          </Box>
        </MainCard>

        {/* Test API Section */}
        {showApiTest && (
          <MainCard title="Test API Backend" sx={{ mt: 2, p: 1 }}>
            <ApiTest />
          </MainCard>
        )}
      </Box>

      {/* Client Menu */}
      <Menu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={() => {
          handleEditClient(menuClient);
          handleMenuClose();
        }}>
          <ListItemIcon>
            <EditIcon fontSize="small" />
          </ListItemIcon>
          Modifier
        </MenuItem>
        <MenuItem onClick={() => {
          handleDeleteClient(menuClient);
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

export default SubProviderDashboard;
