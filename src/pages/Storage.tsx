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
  Storage as StorageIcon,
  CameraAlt as SnapshotIcon,
  Backup as BackupIcon,
  Cloud as BucketIcon,
  Folder as FileSystemIcon,
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
      id={`storage-tabpanel-${index}`}
      aria-labelledby={`storage-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

const Storage = () => {
  const [tabValue, setTabValue] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // États pour les données
  const [volumes, setVolumes] = useState([]);
  const [snapshots, setSnapshots] = useState([]);
  const [backups, setBackups] = useState([]);
  const [buckets, setBuckets] = useState([]);
  const [fileSystems, setFileSystems] = useState([]);

  useEffect(() => {
    loadStorageData();
  }, []);

  const loadStorageData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Données de test pour Storage
      setVolumes([
        {
          id: 1,
          name: 'volume-prod-01',
          state: 'allocated',
          size: '100 GB',
          type: 'SSD',
          instanceName: 'VM-Production-01',
          storage: 'Local Storage',
          account: 'admin',
          zone: 'Zone-1'
        },
        {
          id: 2,
          name: 'volume-test-01',
          state: 'ready',
          size: '50 GB',
          type: 'HDD',
          instanceName: 'VM-Test-01',
          storage: 'Local Storage',
          account: 'user1',
          zone: 'Zone-1'
        }
      ]);

      setSnapshots([
        {
          id: 1,
          name: 'snapshot-vol-01',
          state: 'backed up',
          volumeName: 'volume-prod-01',
          intervalType: 'MANUAL',
          physicalSize: '100 GB',
          created: '2024-01-15 14:30:00',
          account: 'admin',
          domain: 'ROOT',
          zone: 'Zone-1'
        }
      ]);

      setBackups([
        {
          id: 1,
          name: 'backup-prod-01',
          status: 'backed up',
          size: '100 GB',
          virtualSize: '95 GB',
          type: 'Full',
          created: '2024-01-15 16:00:00',
          account: 'admin',
          domain: 'ROOT',
          zone: 'Zone-1'
        }
      ]);

      setBuckets([
        {
          id: 1,
          name: 'bucket-prod-01',
          status: 'active',
          objectStorage: 'S3 Compatible',
          size: '500 GB',
          account: 'admin'
        }
      ]);

      setFileSystems([
        {
          id: 1,
          name: 'filesystem-shared-01',
          state: 'enabled',
          size: '1 TB',
          account: 'admin',
          sizeUsed: '250 GB'
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
      case 'allocated':
      case 'ready':
      case 'backed up':
      case 'enabled':
      case 'active':
        return 'success';
      case 'backing up':
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
          Chargement des données Storage...
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
        Storage
      </Typography>
      
      <Paper sx={{ width: '100%' }}>
        <Tabs value={tabValue} onChange={handleTabChange} aria-label="storage tabs">
          <Tab label="Volumes" icon={<StorageIcon />} />
          <Tab label="Volume Snapshots" icon={<SnapshotIcon />} />
          <Tab label="Backups" icon={<BackupIcon />} />
          <Tab label="Buckets" icon={<BucketIcon />} />
          <Tab label="Shared FileSystem" icon={<FileSystemIcon />} />
        </Tabs>
      </Paper>

      {/* Volumes */}
      <TabPanel value={tabValue} index={0}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
          <Typography variant="h6">Volumes ({volumes.length})</Typography>
          <Button variant="contained" startIcon={<AddIcon />}>
            Nouveau Volume
          </Button>
        </Box>
        
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>State</TableCell>
                <TableCell>Size</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Instance Name</TableCell>
                <TableCell>Storage</TableCell>
                <TableCell>Account</TableCell>
                <TableCell>Zone</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {volumes.map((volume: any) => (
                <TableRow key={volume.id}>
                  <TableCell>{volume.name}</TableCell>
                  <TableCell>
                    <Chip 
                      label={volume.state} 
                      color={getStateColor(volume.state) as any}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>{volume.size}</TableCell>
                  <TableCell>{volume.type}</TableCell>
                  <TableCell>{volume.instanceName}</TableCell>
                  <TableCell>{volume.storage}</TableCell>
                  <TableCell>{volume.account}</TableCell>
                  <TableCell>{volume.zone}</TableCell>
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

      {/* Volume Snapshots */}
      <TabPanel value={tabValue} index={1}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
          <Typography variant="h6">Volume Snapshots ({snapshots.length})</Typography>
          <Button variant="contained" startIcon={<AddIcon />}>
            Nouveau Snapshot
          </Button>
        </Box>
        
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>State</TableCell>
                <TableCell>Volume Name</TableCell>
                <TableCell>Interval Type</TableCell>
                <TableCell>Physical Size</TableCell>
                <TableCell>Created</TableCell>
                <TableCell>Account</TableCell>
                <TableCell>Domain</TableCell>
                <TableCell>Zone</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {snapshots.map((snapshot: any) => (
                <TableRow key={snapshot.id}>
                  <TableCell>{snapshot.name}</TableCell>
                  <TableCell>
                    <Chip 
                      label={snapshot.state} 
                      color={getStateColor(snapshot.state) as any}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>{snapshot.volumeName}</TableCell>
                  <TableCell>{snapshot.intervalType}</TableCell>
                  <TableCell>{snapshot.physicalSize}</TableCell>
                  <TableCell>{snapshot.created}</TableCell>
                  <TableCell>{snapshot.account}</TableCell>
                  <TableCell>{snapshot.domain}</TableCell>
                  <TableCell>{snapshot.zone}</TableCell>
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

      {/* Backups */}
      <TabPanel value={tabValue} index={2}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
          <Typography variant="h6">Backups ({backups.length})</Typography>
          <Button variant="contained" startIcon={<AddIcon />}>
            Nouveau Backup
          </Button>
        </Box>
        
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Size</TableCell>
                <TableCell>Virtual Size</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Created</TableCell>
                <TableCell>Account</TableCell>
                <TableCell>Domain</TableCell>
                <TableCell>Zone</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {backups.map((backup: any) => (
                <TableRow key={backup.id}>
                  <TableCell>{backup.name}</TableCell>
                  <TableCell>
                    <Chip 
                      label={backup.status} 
                      color={getStateColor(backup.status) as any}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>{backup.size}</TableCell>
                  <TableCell>{backup.virtualSize}</TableCell>
                  <TableCell>{backup.type}</TableCell>
                  <TableCell>{backup.created}</TableCell>
                  <TableCell>{backup.account}</TableCell>
                  <TableCell>{backup.domain}</TableCell>
                  <TableCell>{backup.zone}</TableCell>
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

      {/* Buckets */}
      <TabPanel value={tabValue} index={3}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
          <Typography variant="h6">Buckets ({buckets.length})</Typography>
          <Button variant="contained" startIcon={<AddIcon />}>
            Nouveau Bucket
          </Button>
        </Box>
        
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Object Storage</TableCell>
                <TableCell>Size</TableCell>
                <TableCell>Account</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {buckets.map((bucket: any) => (
                <TableRow key={bucket.id}>
                  <TableCell>{bucket.name}</TableCell>
                  <TableCell>
                    <Chip 
                      label={bucket.status} 
                      color={getStateColor(bucket.status) as any}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>{bucket.objectStorage}</TableCell>
                  <TableCell>{bucket.size}</TableCell>
                  <TableCell>{bucket.account}</TableCell>
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

      {/* Shared FileSystem */}
      <TabPanel value={tabValue} index={4}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
          <Typography variant="h6">Shared FileSystem ({fileSystems.length})</Typography>
          <Button variant="contained" startIcon={<AddIcon />}>
            Nouveau FileSystem
          </Button>
        </Box>
        
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>State</TableCell>
                <TableCell>Size</TableCell>
                <TableCell>Account</TableCell>
                <TableCell>Size Used</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {fileSystems.map((fs: any) => (
                <TableRow key={fs.id}>
                  <TableCell>{fs.name}</TableCell>
                  <TableCell>
                    <Chip 
                      label={fs.state} 
                      color={getStateColor(fs.state) as any}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>{fs.size}</TableCell>
                  <TableCell>{fs.account}</TableCell>
                  <TableCell>{fs.sizeUsed}</TableCell>
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

export default Storage; 