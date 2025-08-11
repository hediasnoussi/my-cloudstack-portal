import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Grid,
  Typography,
  Container,
  Paper,
  LinearProgress,
  Alert,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Button
} from '@mui/material';
import {
  NetworkCheck as NetworkIcon,
  Security as SecurityIcon,
  Public as PublicIPIcon,
  Router as LoadBalancerIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon
} from '@mui/icons-material';
import { apiService } from '../services/api';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`network-tabpanel-${index}`}
      aria-labelledby={`network-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

const Network = () => {
  const [tabValue, setTabValue] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // États pour les données
  const [guestNetworks, setGuestNetworks] = useState([]);
  const [vpcs, setVpcs] = useState([]);
  const [securityGroups, setSecurityGroups] = useState([]);
  const [publicIPs, setPublicIPs] = useState([]);
  const [loadBalancers, setLoadBalancers] = useState([]);

  useEffect(() => {
    loadNetworkData();
  }, []);

  const loadNetworkData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Données de test pour Network
      setGuestNetworks([
        {
          id: 1,
          name: 'web-network',
          state: 'implemented',
          type: 'Isolated',
          vpc: 'vpc-web-01',
          ipv4CIDR: '192.168.1.0/24',
          ipv6CIDR: '2001:db8::/64',
          broadcastURI: '192.168.1.255',
          domain: 'ROOT',
          account: 'admin',
          zone: 'Zone-1'
        },
        {
          id: 2,
          name: 'db-network',
          state: 'allocated',
          type: 'Shared',
          vpc: 'vpc-db-01',
          ipv4CIDR: '192.168.2.0/24',
          ipv6CIDR: '2001:db8:1::/64',
          broadcastURI: '192.168.2.255',
          domain: 'ROOT',
          account: 'admin',
          zone: 'Zone-1'
        }
      ]);

      setVpcs([
        {
          id: 1,
          name: 'vpc-web-01',
          state: 'enabled',
          description: 'VPC for web servers',
          cidr: '192.168.0.0/16',
          account: 'admin',
          domain: 'ROOT',
          zone: 'Zone-1'
        }
      ]);

      setSecurityGroups([
        {
          id: 1,
          name: 'web-sg',
          description: 'Security group for web servers',
          account: 'admin',
          domain: 'ROOT'
        },
        {
          id: 2,
          name: 'db-sg',
          description: 'Security group for database servers',
          account: 'admin',
          domain: 'ROOT'
        }
      ]);

      setPublicIPs([
        {
          id: 1,
          ipAddress: '203.0.113.10',
          state: 'allocated',
          networkName: 'web-network',
          vpc: 'vpc-web-01',
          instanceName: 'VM-Production-01',
          allocated: '2024-01-15 10:00:00',
          account: 'admin',
          domain: 'ROOT',
          zone: 'Zone-1'
        }
      ]);

      setLoadBalancers([
        {
          id: 1,
          name: 'lb-web-01',
          state: 'enabled',
          algorithm: 'roundrobin',
          protocol: 'HTTP',
          publicPort: 80,
          privatePort: 80,
          account: 'admin',
          domain: 'ROOT'
        }
      ]);

    } catch (err: any) {
      console.error('Erreur de chargement:', err);
      setError(err.response?.data?.message || 'Erreur lors du chargement des données');
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const getStateColor = (state: string) => {
    switch (state.toLowerCase()) {
      case 'implemented':
      case 'enabled':
      case 'allocated':
        return 'success';
      case 'allocating':
        return 'warning';
      case 'disabled':
      case 'error':
        return 'error';
      default:
        return 'default';
    }
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <LinearProgress />
        <Typography variant="h6" sx={{ mt: 2 }}>
          Chargement des données Network...
        </Typography>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Network
      </Typography>
      
      <Paper sx={{ width: '100%' }}>
        <Tabs value={tabValue} onChange={handleTabChange} aria-label="network tabs">
          <Tab label="Guest Networks" icon={<NetworkIcon />} />
          <Tab label="VPC" icon={<NetworkIcon />} />
          <Tab label="Security Groups" icon={<SecurityIcon />} />
          <Tab label="Public IP Addresses" icon={<PublicIPIcon />} />
          <Tab label="Load Balancers" icon={<LoadBalancerIcon />} />
        </Tabs>
      </Paper>

      {/* Guest Networks */}
      <TabPanel value={tabValue} index={0}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
          <Typography variant="h6">Guest Networks ({guestNetworks.length})</Typography>
          <Button variant="contained" startIcon={<AddIcon />}>
            Nouveau Réseau
          </Button>
        </Box>
        
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>State</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>VPC</TableCell>
                <TableCell>IPv4 CIDR</TableCell>
                <TableCell>IPv6 CIDR</TableCell>
                <TableCell>Broadcast URI</TableCell>
                <TableCell>Domain</TableCell>
                <TableCell>Account</TableCell>
                <TableCell>Zone</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {guestNetworks.map((network: any) => (
                <TableRow key={network.id}>
                  <TableCell>{network.name}</TableCell>
                  <TableCell>
                    <Chip 
                      label={network.state} 
                      color={getStateColor(network.state) as any}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>{network.type}</TableCell>
                  <TableCell>{network.vpc}</TableCell>
                  <TableCell>{network.ipv4CIDR}</TableCell>
                  <TableCell>{network.ipv6CIDR}</TableCell>
                  <TableCell>{network.broadcastURI}</TableCell>
                  <TableCell>{network.domain}</TableCell>
                  <TableCell>{network.account}</TableCell>
                  <TableCell>{network.zone}</TableCell>
                  <TableCell>
                    <IconButton size="small">
                      <EditIcon />
                    </IconButton>
                    <IconButton size="small">
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </TabPanel>

      {/* VPC */}
      <TabPanel value={tabValue} index={1}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
          <Typography variant="h6">VPC ({vpcs.length})</Typography>
          <Button variant="contained" startIcon={<AddIcon />}>
            Nouveau VPC
          </Button>
        </Box>
        
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>State</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>CIDR</TableCell>
                <TableCell>Account</TableCell>
                <TableCell>Domain</TableCell>
                <TableCell>Zone</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {vpcs.map((vpc: any) => (
                <TableRow key={vpc.id}>
                  <TableCell>{vpc.name}</TableCell>
                  <TableCell>
                    <Chip 
                      label={vpc.state} 
                      color={getStateColor(vpc.state) as any}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>{vpc.description}</TableCell>
                  <TableCell>{vpc.cidr}</TableCell>
                  <TableCell>{vpc.account}</TableCell>
                  <TableCell>{vpc.domain}</TableCell>
                  <TableCell>{vpc.zone}</TableCell>
                  <TableCell>
                    <IconButton size="small">
                      <EditIcon />
                    </IconButton>
                    <IconButton size="small">
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </TabPanel>

      {/* Security Groups */}
      <TabPanel value={tabValue} index={2}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
          <Typography variant="h6">Security Groups ({securityGroups.length})</Typography>
          <Button variant="contained" startIcon={<AddIcon />}>
            Nouveau Security Group
          </Button>
        </Box>
        
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Account</TableCell>
                <TableCell>Domain</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {securityGroups.map((sg: any) => (
                <TableRow key={sg.id}>
                  <TableCell>{sg.name}</TableCell>
                  <TableCell>{sg.description}</TableCell>
                  <TableCell>{sg.account}</TableCell>
                  <TableCell>{sg.domain}</TableCell>
                  <TableCell>
                    <IconButton size="small">
                      <EditIcon />
                    </IconButton>
                    <IconButton size="small">
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </TabPanel>

      {/* Public IP Addresses */}
      <TabPanel value={tabValue} index={3}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
          <Typography variant="h6">Public IP Addresses ({publicIPs.length})</Typography>
          <Button variant="contained" startIcon={<AddIcon />}>
            Nouvelle IP Publique
          </Button>
        </Box>
        
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>IP Address</TableCell>
                <TableCell>State</TableCell>
                <TableCell>Network Name</TableCell>
                <TableCell>VPC</TableCell>
                <TableCell>Instance Name</TableCell>
                <TableCell>Allocated</TableCell>
                <TableCell>Account</TableCell>
                <TableCell>Domain</TableCell>
                <TableCell>Zone</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {publicIPs.map((ip: any) => (
                <TableRow key={ip.id}>
                  <TableCell>{ip.ipAddress}</TableCell>
                  <TableCell>
                    <Chip 
                      label={ip.state} 
                      color={getStateColor(ip.state) as any}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>{ip.networkName}</TableCell>
                  <TableCell>{ip.vpc}</TableCell>
                  <TableCell>{ip.instanceName}</TableCell>
                  <TableCell>{ip.allocated}</TableCell>
                  <TableCell>{ip.account}</TableCell>
                  <TableCell>{ip.domain}</TableCell>
                  <TableCell>{ip.zone}</TableCell>
                  <TableCell>
                    <IconButton size="small">
                      <EditIcon />
                    </IconButton>
                    <IconButton size="small">
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </TabPanel>

      {/* Load Balancers */}
      <TabPanel value={tabValue} index={4}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
          <Typography variant="h6">Load Balancers ({loadBalancers.length})</Typography>
          <Button variant="contained" startIcon={<AddIcon />}>
            Nouveau Load Balancer
          </Button>
        </Box>
        
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>State</TableCell>
                <TableCell>Algorithm</TableCell>
                <TableCell>Protocol</TableCell>
                <TableCell>Public Port</TableCell>
                <TableCell>Private Port</TableCell>
                <TableCell>Account</TableCell>
                <TableCell>Domain</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loadBalancers.map((lb: any) => (
                <TableRow key={lb.id}>
                  <TableCell>{lb.name}</TableCell>
                  <TableCell>
                    <Chip 
                      label={lb.state} 
                      color={getStateColor(lb.state) as any}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>{lb.algorithm}</TableCell>
                  <TableCell>{lb.protocol}</TableCell>
                  <TableCell>{lb.publicPort}</TableCell>
                  <TableCell>{lb.privatePort}</TableCell>
                  <TableCell>{lb.account}</TableCell>
                  <TableCell>{lb.domain}</TableCell>
                  <TableCell>
                    <IconButton size="small">
                      <EditIcon />
                    </IconButton>
                    <IconButton size="small">
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </TabPanel>
    </Container>
  );
};

export default Network; 