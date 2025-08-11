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
  Cloud as CloudIcon,
  CameraAlt as CameraIcon,
  Settings as SettingsIcon,
  ExpandMore as ExpandIcon,
  Search as SearchIcon,
  Key as KeyIcon,
  Person as PersonIcon,
  Group as GroupIcon,
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
      id={`compute-tabpanel-${index}`}
      aria-labelledby={`compute-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

const Compute = () => {
  const [tabValue, setTabValue] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // États pour les données
  const [instances, setInstances] = useState([]);
  const [snapshots, setSnapshots] = useState([]);
  const [kubernetes, setKubernetes] = useState([]);
  const [autoscalingGroups, setAutoscalingGroups] = useState([]);
  const [instanceGroups, setInstanceGroups] = useState([]);
  const [sshKeys, setSshKeys] = useState([]);
  const [userData, setUserData] = useState([]);

  useEffect(() => {
    loadComputeData();
  }, []);

  const loadComputeData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Pour l'instant, on utilise des données de test
      // Plus tard, on connectera aux vraies APIs CloudStack
      setInstances([
        {
          id: 1,
          name: 'VM-Production-01',
          state: 'running',
          internalName: 'i-2-3-VM',
          ipAddress: '192.168.1.100',
          arch: 'x86_64',
          host: 'host-01',
          account: 'admin',
          zone: 'Zone-1'
        },
        {
          id: 2,
          name: 'VM-Test-01',
          state: 'stopped',
          internalName: 'i-2-4-VM',
          ipAddress: '192.168.1.101',
          arch: 'x86_64',
          host: 'host-02',
          account: 'user1',
          zone: 'Zone-1'
        }
      ]);

      setSnapshots([
        {
          id: 1,
          displayName: 'Snapshot-Prod-01',
          state: 'backed up',
          name: 'snapshot-01',
          type: 'MANUAL',
          current: true,
          parent: 'VM-Production-01',
          created: '2024-01-15 10:30:00',
          account: 'admin',
          domain: 'ROOT'
        }
      ]);

      setKubernetes([
        {
          id: 1,
          name: 'K8s-Cluster-01',
          state: 'running',
          autoScaling: true,
          clusterType: 'MANAGED',
          size: 3,
          cpuCores: 8,
          memory: '16GB',
          kubernetesVersion: '1.24.0',
          account: 'admin',
          zone: 'Zone-1'
        }
      ]);

      setAutoscalingGroups([
        {
          id: 1,
          name: 'ASG-Web-01',
          state: 'enabled',
          networkName: 'web-network',
          ipAddress: '192.168.1.200',
          privatePort: 80,
          minMembers: 2,
          maxMembers: 5,
          availableInstances: 3,
          account: 'admin'
        }
      ]);

      setInstanceGroups([
        {
          id: 1,
          name: 'Web-Servers',
          account: 'admin',
          domain: 'ROOT'
        }
      ]);

      setSshKeys([
        {
          id: 1,
          name: 'admin-key',
          fingerprints: 'SHA256:abc123...',
          account: 'admin',
          domain: 'ROOT'
        }
      ]);

      setUserData([
        {
          id: 1,
          name: 'userdata-web',
          ip: '192.168.1.150',
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
      case 'running':
      case 'enabled':
      case 'backed up':
        return 'success';
      case 'stopped':
      case 'disabled':
        return 'error';
      case 'backing up':
        return 'warning';
      default:
        return 'default';
    }
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <LinearProgress />
        <Typography variant="h6" sx={{ mt: 2 }}>
          Chargement des données Compute...
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
        Compute
      </Typography>
      
      <Paper sx={{ width: '100%' }}>
        <Tabs value={tabValue} onChange={handleTabChange} aria-label="compute tabs">
          <Tab label="Instances" icon={<CloudIcon />} />
          <Tab label="Instance Snapshots" icon={<CameraIcon />} />
          <Tab label="Kubernetes" icon={<SettingsIcon />} />
          <Tab label="Autoscaling Groups" icon={<ExpandIcon />} />
          <Tab label="Instance Groups" icon={<GroupIcon />} />
          <Tab label="SSH Key Pairs" icon={<KeyIcon />} />
          <Tab label="User Data" icon={<PersonIcon />} />
        </Tabs>
      </Paper>

      {/* Instances */}
      <TabPanel value={tabValue} index={0}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
          <Typography variant="h6">Instances ({instances.length})</Typography>
          <Button variant="contained" startIcon={<AddIcon />}>
            Nouvelle Instance
          </Button>
        </Box>
        
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>State</TableCell>
                <TableCell>Internal Name</TableCell>
                <TableCell>IP Address</TableCell>
                <TableCell>Arch</TableCell>
                <TableCell>Host</TableCell>
                <TableCell>Account</TableCell>
                <TableCell>Zone</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {instances.map((instance: any) => (
                <TableRow key={instance.id}>
                  <TableCell>{instance.name}</TableCell>
                  <TableCell>
                    <Chip 
                      label={instance.state} 
                      color={getStateColor(instance.state) as any}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>{instance.internalName}</TableCell>
                  <TableCell>{instance.ipAddress}</TableCell>
                  <TableCell>{instance.arch}</TableCell>
                  <TableCell>{instance.host}</TableCell>
                  <TableCell>{instance.account}</TableCell>
                  <TableCell>{instance.zone}</TableCell>
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

      {/* Instance Snapshots */}
      <TabPanel value={tabValue} index={1}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
          <Typography variant="h6">Instance Snapshots ({snapshots.length})</Typography>
          <Button variant="contained" startIcon={<AddIcon />}>
            Nouveau Snapshot
          </Button>
        </Box>
        
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Display Name</TableCell>
                <TableCell>State</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Current</TableCell>
                <TableCell>Parent</TableCell>
                <TableCell>Created</TableCell>
                <TableCell>Account</TableCell>
                <TableCell>Domain</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {snapshots.map((snapshot: any) => (
                <TableRow key={snapshot.id}>
                  <TableCell>{snapshot.displayName}</TableCell>
                  <TableCell>
                    <Chip 
                      label={snapshot.state} 
                      color={getStateColor(snapshot.state) as any}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>{snapshot.name}</TableCell>
                  <TableCell>{snapshot.type}</TableCell>
                  <TableCell>{snapshot.current ? 'Yes' : 'No'}</TableCell>
                  <TableCell>{snapshot.parent}</TableCell>
                  <TableCell>{snapshot.created}</TableCell>
                  <TableCell>{snapshot.account}</TableCell>
                  <TableCell>{snapshot.domain}</TableCell>
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

      {/* Kubernetes */}
      <TabPanel value={tabValue} index={2}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
          <Typography variant="h6">Kubernetes Clusters ({kubernetes.length})</Typography>
          <Button variant="contained" startIcon={<AddIcon />}>
            Nouveau Cluster
          </Button>
        </Box>
        
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>State</TableCell>
                <TableCell>Auto-scaling</TableCell>
                <TableCell>Cluster Type</TableCell>
                <TableCell>Size</TableCell>
                <TableCell>CPU Cores</TableCell>
                <TableCell>Memory</TableCell>
                <TableCell>K8s Version</TableCell>
                <TableCell>Account</TableCell>
                <TableCell>Zone</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {kubernetes.map((cluster: any) => (
                <TableRow key={cluster.id}>
                  <TableCell>{cluster.name}</TableCell>
                  <TableCell>
                    <Chip 
                      label={cluster.state} 
                      color={getStateColor(cluster.state) as any}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>{cluster.autoScaling ? 'Yes' : 'No'}</TableCell>
                  <TableCell>{cluster.clusterType}</TableCell>
                  <TableCell>{cluster.size}</TableCell>
                  <TableCell>{cluster.cpuCores}</TableCell>
                  <TableCell>{cluster.memory}</TableCell>
                  <TableCell>{cluster.kubernetesVersion}</TableCell>
                  <TableCell>{cluster.account}</TableCell>
                  <TableCell>{cluster.zone}</TableCell>
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

      {/* Autoscaling Groups */}
      <TabPanel value={tabValue} index={3}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
          <Typography variant="h6">Autoscaling Groups ({autoscalingGroups.length})</Typography>
          <Button variant="contained" startIcon={<AddIcon />}>
            Nouveau Groupe
          </Button>
        </Box>
        
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>State</TableCell>
                <TableCell>Network Name</TableCell>
                <TableCell>IP Address</TableCell>
                <TableCell>Private Port</TableCell>
                <TableCell>Min Members</TableCell>
                <TableCell>Max Members</TableCell>
                <TableCell>Available Instances</TableCell>
                <TableCell>Account</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {autoscalingGroups.map((group: any) => (
                <TableRow key={group.id}>
                  <TableCell>{group.name}</TableCell>
                  <TableCell>
                    <Chip 
                      label={group.state} 
                      color={getStateColor(group.state) as any}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>{group.networkName}</TableCell>
                  <TableCell>{group.ipAddress}</TableCell>
                  <TableCell>{group.privatePort}</TableCell>
                  <TableCell>{group.minMembers}</TableCell>
                  <TableCell>{group.maxMembers}</TableCell>
                  <TableCell>{group.availableInstances}</TableCell>
                  <TableCell>{group.account}</TableCell>
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

      {/* Instance Groups */}
      <TabPanel value={tabValue} index={4}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
          <Typography variant="h6">Instance Groups ({instanceGroups.length})</Typography>
          <Button variant="contained" startIcon={<AddIcon />}>
            Nouveau Groupe
          </Button>
        </Box>
        
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Account</TableCell>
                <TableCell>Domain</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {instanceGroups.map((group: any) => (
                <TableRow key={group.id}>
                  <TableCell>{group.name}</TableCell>
                  <TableCell>{group.account}</TableCell>
                  <TableCell>{group.domain}</TableCell>
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

      {/* SSH Key Pairs */}
      <TabPanel value={tabValue} index={5}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
          <Typography variant="h6">SSH Key Pairs ({sshKeys.length})</Typography>
          <Button variant="contained" startIcon={<AddIcon />}>
            Nouvelle Clé SSH
          </Button>
        </Box>
        
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Fingerprints</TableCell>
                <TableCell>Account</TableCell>
                <TableCell>Domain</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {sshKeys.map((key: any) => (
                <TableRow key={key.id}>
                  <TableCell>{key.name}</TableCell>
                  <TableCell>{key.fingerprints}</TableCell>
                  <TableCell>{key.account}</TableCell>
                  <TableCell>{key.domain}</TableCell>
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

      {/* User Data */}
      <TabPanel value={tabValue} index={6}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
          <Typography variant="h6">User Data ({userData.length})</Typography>
          <Button variant="contained" startIcon={<AddIcon />}>
            Nouveau User Data
          </Button>
        </Box>
        
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>IP</TableCell>
                <TableCell>Account</TableCell>
                <TableCell>Domain</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {userData.map((data: any) => (
                <TableRow key={data.id}>
                  <TableCell>{data.name}</TableCell>
                  <TableCell>{data.ip}</TableCell>
                  <TableCell>{data.account}</TableCell>
                  <TableCell>{data.domain}</TableCell>
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

export default Compute; 