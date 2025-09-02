import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Container,
  Alert,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Tooltip,
  Snackbar
} from '@mui/material';
import {
  Computer as ComputerIcon,
  Support as SupportIcon,
  Add as AddIcon,
  PlayArrow as StartIcon,
  Stop as StopIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  TrendingUp as TrendingUpIcon,
  AccountBalance as BillingIcon,
  Help as HelpIcon,
  Email as EmailIcon,
  Phone as PhoneIcon
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../contexts/AuthContext';
import cloudstackService from '../services/cloudstackService';
import UserBilling from '../components/UserBilling';
import UserSupport from '../components/UserSupport';

const UserDashboard = () => {
  const { t } = useTranslation();
  const { user, isUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [userVPS, setUserVPS] = useState([]);
  const [billingInfo, setBillingInfo] = useState({});
  const [supportTickets, setSupportTickets] = useState([]);
  const [openBillingDialog, setOpenBillingDialog] = useState(false);
  const [openSupportDialog, setOpenSupportDialog] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    if (user && isUser()) {
      loadUserData();
    }
  }, [user]);

  // Effet séparé pour gérer le défilement vers les sections
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash) {
        setTimeout(() => {
          const element = document.querySelector(hash);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
          }
        }, 300);
      }
    };

    // Gérer le hash initial
    handleHashChange();

    // Écouter les changements de hash
    window.addEventListener('hashchange', handleHashChange);
    
    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);

  const loadUserData = async () => {
    try {
      setLoading(true);
      
      // Simuler le chargement des données utilisateur
      await Promise.all([
        loadUserVPS(),
        loadBillingInfo(),
        loadSupportTickets()
      ]);
    } catch (error) {
      console.error('Erreur lors du chargement des données:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadUserVPS = async () => {
    try {
      console.log('🔄 Chargement des VPS CloudStack pour l\'utilisateur...');
      const cloudstackVMs = await cloudstackService.getVirtualMachines();
      console.log('✅ VPS CloudStack récupérés:', cloudstackVMs);
      
      // Transformer les données CloudStack en format compatible
      const transformedVMs = cloudstackVMs.map(vm => ({
        id: vm.id,
        name: vm.name || vm.displayname,
        status: vm.state,
        template: vm.templatename,
        zone: vm.zonename,
        cpu: vm.cpunumber || 1,
        ram: vm.memory || 512,
        storage: 50, // Valeur par défaut
        ip_address: vm.nic?.[0]?.ipaddress || 'N/A',
        created_at: vm.created,
        monthly_cost: 29.99 // Valeur par défaut
      }));
      
      setUserVPS(transformedVMs);
      console.log('✅ VPS utilisateur transformés:', transformedVMs);
    } catch (error) {
      console.error('❌ Erreur lors du chargement des VPS CloudStack:', error);
      setUserVPS([]);
    }
  };

  const loadBillingInfo = async () => {
    // Simuler des informations de facturation
    const mockBilling = {
      current_balance: 150.50,
      monthly_total: 89.98,
      next_billing_date: '2024-02-01',
      payment_method: 'Carte Visa ****1234',
      invoices: [
        { id: 'INV-001', date: '2024-01-01', amount: 89.98, status: 'Paid' },
        { id: 'INV-002', date: '2023-12-01', amount: 89.98, status: 'Paid' }
      ]
    };
    setBillingInfo(mockBilling);
  };

  const loadSupportTickets = async () => {
    // Simuler des tickets de support
    const mockTickets = [
      {
        id: 'TKT-001',
        subject: 'Problème de connexion SSH',
        status: 'Open',
        priority: 'Medium',
        created_at: '2024-01-20T14:30:00Z',
        last_update: '2024-01-21T09:15:00Z'
      },
      {
        id: 'TKT-002',
        subject: 'Demande d\'augmentation de stockage',
        status: 'In Progress',
        priority: 'Low',
        created_at: '2024-01-18T11:20:00Z',
        last_update: '2024-01-19T16:45:00Z'
      }
    ];
    setSupportTickets(mockTickets);
  };

  const handleVPSAction = (action, vpsId) => {
    // Simuler les actions sur les VPS
    const message = `Action ${action} effectuée sur le VPS ${vpsId}`;
    setSnackbar({ open: true, message, severity: 'success' });
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (!isUser() || !user) {
    return (
      <Container maxWidth="md">
        <Alert severity="error">
          Accès non autorisé. Cette page est réservée aux utilisateurs connectés.
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl">
      <Box py={3}>
        {/* En-tête du tableau de bord */}
        <Box mb={4}>
          <Typography variant="h4" component="h1" gutterBottom sx={{ color: 'white' }}>
            Tableau de bord - {user.username}
          </Typography>
          <Typography variant="body1" sx={{ color: 'white' }}>
            Gérez vos VPS, consultez votre facturation et accédez au support
          </Typography>
        </Box>

        {/* Statistiques générales */}
        <Grid container spacing={3} mb={4}>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center">
                  <ComputerIcon color="primary" sx={{ fontSize: 40, mr: 2 }} />
                  <Box>
                    <Typography variant="h4" component="div">
                      {userVPS.length}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      VPS actifs
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center">
                  <TrendingUpIcon color="success" sx={{ fontSize: 40, mr: 2 }} />
                  <Box>
                    <Typography variant="h4" component="div">
                      {userVPS.filter(vps => vps.status === 'Running').length}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      VPS en cours
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center">
                  <BillingIcon color="warning" sx={{ fontSize: 40, mr: 2 }} />
                  <Box>
                    <Typography variant="h4" component="div">
                      {billingInfo.monthly_total}€
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Coût mensuel
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center">
                  <SupportIcon color="info" sx={{ fontSize: 40, mr: 2 }} />
                  <Box>
                    <Typography variant="h4" component="div">
                      {supportTickets.filter(ticket => ticket.status === 'Open').length}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Tickets ouverts
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Section VPS */}
        <Grid container spacing={3} mb={4} id="vps">
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                  <Typography variant="h6" component="h2">
                    Mes VPS
                  </Typography>
                </Box>
                
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Nom</TableCell>
                        <TableCell>Statut</TableCell>
                        <TableCell>Template</TableCell>
                        <TableCell>Ressources</TableCell>
                        <TableCell>IP</TableCell>
                        <TableCell>Coût mensuel</TableCell>
                        <TableCell>Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {userVPS.map((vps) => (
                        <TableRow key={vps.id}>
                          <TableCell>{vps.name}</TableCell>
                          <TableCell>
                            <Chip
                              label={vps.status}
                              color={vps.status === 'Running' ? 'success' : 'default'}
                              size="small"
                            />
                          </TableCell>
                          <TableCell>{vps.template}</TableCell>
                          <TableCell>
                            {vps.cpu} CPU, {vps.ram} MB RAM, {vps.storage} GB
                          </TableCell>
                          <TableCell>{vps.ip_address}</TableCell>
                          <TableCell>{vps.monthly_cost}€</TableCell>
                          <TableCell>
                            <Box>
                              <Tooltip title="Démarrer">
                                <IconButton
                                  size="small"
                                  onClick={() => handleVPSAction('start', vps.id)}
                                  disabled={vps.status === 'Running'}
                                >
                                  <StartIcon />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Arrêter">
                                <IconButton
                                  size="small"
                                  onClick={() => handleVPSAction('stop', vps.id)}
                                  disabled={vps.status === 'Stopped'}
                                >
                                  <StopIcon />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Modifier">
                                <IconButton
                                  size="small"
                                  onClick={() => handleVPSAction('edit', vps.id)}
                                >
                                  <EditIcon />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Supprimer">
                                <IconButton
                                  size="small"
                                  color="error"
                                  onClick={() => handleVPSAction('delete', vps.id)}
                                >
                                  <DeleteIcon />
                                </IconButton>
                              </Tooltip>
                            </Box>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Section Facturation et Support */}
        <Grid container spacing={3}>
          {/* Facturation */}
          <Grid item xs={12} md={6} id="billing">
            <Card>
              <CardContent>
                <Typography variant="h6" component="h2" gutterBottom>
                  Facturation
                </Typography>
                
                <Box mb={2}>
                  <Typography variant="body2" color="text.secondary">
                    Solde actuel
                  </Typography>
                  <Typography variant="h4" color="primary">
                    {billingInfo.current_balance}€
                  </Typography>
                </Box>
                
                <Box mb={2}>
                  <Typography variant="body2" color="text.secondary">
                    Prochaine facturation
                  </Typography>
                  <Typography variant="body1">
                    {billingInfo.next_billing_date}
                  </Typography>
                </Box>
                
                <Box mb={2}>
                  <Typography variant="body2" color="text.secondary">
                    Méthode de paiement
                  </Typography>
                  <Typography variant="body1">
                    {billingInfo.payment_method}
                  </Typography>
                </Box>
                
                <Button
                  variant="outlined"
                  fullWidth
                  onClick={() => setOpenBillingDialog(true)}
                >
                  Voir l'historique des factures
                </Button>
              </CardContent>
            </Card>
          </Grid>
          
          {/* Support */}
          <Grid item xs={12} md={6} id="support">
            <Card>
              <CardContent>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                  <Typography variant="h6" component="h2">
                    Support
                  </Typography>
                  <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => setOpenSupportDialog(true)}
                  >
                    Nouveau ticket
                  </Button>
                </Box>
                
                <List>
                  {supportTickets.slice(0, 3).map((ticket) => (
                    <React.Fragment key={ticket.id}>
                      <ListItem>
                        <ListItemIcon>
                          <SupportIcon color="primary" />
                        </ListItemIcon>
                        <ListItemText
                          primary={ticket.subject}
                          secondary={`${ticket.status} - Priorité: ${ticket.priority}`}
                        />
                        <Chip
                          label={ticket.status}
                          color={ticket.status === 'Open' ? 'error' : 'warning'}
                          size="small"
                        />
                      </ListItem>
                      <Divider />
                    </React.Fragment>
                  ))}
                </List>
                
                <Box mt={2}>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Besoin d'aide ?
                  </Typography>
                  <Box display="flex" gap={1}>
                    <Button
                      variant="outlined"
                      size="small"
                      startIcon={<EmailIcon />}
                    >
                      Email
                    </Button>
                    <Button
                      variant="outlined"
                      size="small"
                      startIcon={<PhoneIcon />}
                    >
                      Téléphone
                    </Button>
                    <Button
                      variant="outlined"
                      size="small"
                      startIcon={<HelpIcon />}
                    >
                      FAQ
                    </Button>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>

      {/* Snackbar pour les notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>

      {/* Composants de facturation et support */}
      <UserBilling
        open={openBillingDialog}
        onClose={() => setOpenBillingDialog(false)}
        billingInfo={billingInfo}
      />
      
      <UserSupport
        open={openSupportDialog}
        onClose={() => setOpenSupportDialog(false)}
        supportTickets={supportTickets}
      />
    </Container>
  );
};

export default UserDashboard;
