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
  Image as ImageIcon,
  Cloud as TemplateIcon,
  Storage as IsoIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Download as DownloadIcon
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
      id={`images-tabpanel-${index}`}
      aria-labelledby={`images-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

const Images = () => {
  const [tabValue, setTabValue] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // États pour les données
  const [isos, setIsos] = useState([]);

  useEffect(() => {
    loadImagesData();
  }, []);

  const loadImagesData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Données de test pour Images
      setIsos([
        {
          id: 1,
          name: 'ubuntu-20.04.3-live-server-amd64.iso',
          displayText: 'Ubuntu 20.04.3 Live Server',
          size: '1.2 GB',
          format: 'ISO',
          os: 'Ubuntu',
          osVersion: '20.04.3',
          state: 'ready',
          account: 'admin',
          domain: 'ROOT',
          zone: 'Zone-1'
        },
        {
          id: 2,
          name: 'centos-8-stream-x86_64.iso',
          displayText: 'CentOS 8 Stream',
          size: '8.5 GB',
          format: 'ISO',
          os: 'CentOS',
          osVersion: '8',
          state: 'ready',
          account: 'admin',
          domain: 'ROOT',
          zone: 'Zone-1'
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
      case 'ready':
      case 'active':
        return 'success';
      case 'uploading':
      case 'processing':
        return 'warning';
      case 'error':
      case 'failed':
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
          Chargement des données Images...
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
        Images
      </Typography>
      
      <Paper sx={{ width: '100%' }}>
        <Tabs value={tabValue} onChange={handleTabChange} aria-label="images tabs">
          <Tab label="ISOs" icon={<IsoIcon />} />
        </Tabs>
      </Paper>

      {/* ISOs */}
      <TabPanel value={tabValue} index={0}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
          <Typography variant="h6">ISOs ({isos.length})</Typography>
          <Button variant="contained" startIcon={<AddIcon />}>
            Nouveau ISO
          </Button>
        </Box>
        
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Display Text</TableCell>
                <TableCell>Size</TableCell>
                <TableCell>Format</TableCell>
                <TableCell>OS</TableCell>
                <TableCell>OS Version</TableCell>
                <TableCell>State</TableCell>
                <TableCell>Account</TableCell>
                <TableCell>Domain</TableCell>
                <TableCell>Zone</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {isos.map((iso: any) => (
                <TableRow key={iso.id}>
                  <TableCell>{iso.name}</TableCell>
                  <TableCell>{iso.displayText}</TableCell>
                  <TableCell>{iso.size}</TableCell>
                  <TableCell>{iso.format}</TableCell>
                  <TableCell>{iso.os}</TableCell>
                  <TableCell>{iso.osVersion}</TableCell>
                  <TableCell>
                    <Chip 
                      label={iso.state} 
                      color={getStateColor(iso.state) as any}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>{iso.account}</TableCell>
                  <TableCell>{iso.domain}</TableCell>
                  <TableCell>{iso.zone}</TableCell>
                  <TableCell>
                    <IconButton size="small">
                      <DownloadIcon />
                    </IconButton>
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

export default Images; 