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
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import {
  Event as EventIcon,
  List as LogsIcon,
  Security as AuditIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  FilterList as FilterIcon
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
      id={`events-tabpanel-${index}`}
      aria-labelledby={`events-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

const Events = () => {
  const [tabValue, setTabValue] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // États pour les données
  const [systemLogs, setSystemLogs] = useState([]);
  const [auditTrail, setAuditTrail] = useState([]);

  useEffect(() => {
    loadEventsData();
  }, []);

  const loadEventsData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Données de test pour Events
      setSystemLogs([
        {
          id: 1,
          timestamp: '2024-01-15 14:30:25',
          level: 'INFO',
          component: 'Compute',
          message: 'VM-Production-01 started successfully',
          user: 'admin',
          ipAddress: '192.168.1.100',
          account: 'admin',
          domain: 'ROOT'
        },
        {
          id: 2,
          timestamp: '2024-01-15 14:25:10',
          level: 'WARNING',
          component: 'Storage',
          message: 'Volume volume-prod-01 is running low on space',
          user: 'system',
          ipAddress: '192.168.1.1',
          account: 'admin',
          domain: 'ROOT'
        },
        {
          id: 3,
          timestamp: '2024-01-15 14:20:45',
          level: 'ERROR',
          component: 'Network',
          message: 'Failed to allocate IP address for VM-Test-01',
          user: 'user1',
          ipAddress: '192.168.1.101',
          account: 'user1',
          domain: 'ROOT'
        }
      ]);

      setAuditTrail([
        {
          id: 1,
          timestamp: '2024-01-15 14:30:25',
          action: 'CREATE',
          resource: 'VM-Production-01',
          resourceType: 'Virtual Machine',
          user: 'admin',
          ipAddress: '192.168.1.100',
          details: 'Created new virtual machine with 4GB RAM, 2 vCPUs',
          account: 'admin',
          domain: 'ROOT'
        },
        {
          id: 2,
          timestamp: '2024-01-15 14:25:10',
          action: 'UPDATE',
          resource: 'volume-prod-01',
          resourceType: 'Volume',
          user: 'admin',
          ipAddress: '192.168.1.100',
          details: 'Resized volume from 50GB to 100GB',
          account: 'admin',
          domain: 'ROOT'
        },
        {
          id: 3,
          timestamp: '2024-01-15 14:20:45',
          action: 'DELETE',
          resource: 'VM-Old-01',
          resourceType: 'Virtual Machine',
          user: 'user1',
          ipAddress: '192.168.1.101',
          details: 'Deleted virtual machine and associated resources',
          account: 'user1',
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

  const getLevelColor = (level: string) => {
    switch (level.toLowerCase()) {
      case 'info':
        return 'success';
      case 'warning':
        return 'warning';
      case 'error':
        return 'error';
      case 'debug':
        return 'default';
      default:
        return 'default';
    }
  };

  const getActionColor = (action: string) => {
    switch (action.toLowerCase()) {
      case 'create':
        return 'success';
      case 'update':
        return 'warning';
      case 'delete':
        return 'error';
      case 'read':
        return 'info';
      default:
        return 'default';
    }
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <LinearProgress />
        <Typography variant="h6" sx={{ mt: 2 }}>
          Chargement des données Events...
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
        Events
      </Typography>
      
      <Paper sx={{ width: '100%' }}>
        <Tabs value={tabValue} onChange={handleTabChange} aria-label="events tabs">
          <Tab label="System Logs" icon={<LogsIcon />} />
          <Tab label="Audit Trail" icon={<AuditIcon />} />
        </Tabs>
      </Paper>

      {/* System Logs */}
      <TabPanel value={tabValue} index={0}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
          <Typography variant="h6">System Logs ({systemLogs.length})</Typography>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <TextField
              size="small"
              placeholder="Search logs..."
              InputProps={{
                startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />
              }}
            />
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel>Level</InputLabel>
              <Select label="Level" defaultValue="">
                <MenuItem value="">All</MenuItem>
                <MenuItem value="INFO">INFO</MenuItem>
                <MenuItem value="WARNING">WARNING</MenuItem>
                <MenuItem value="ERROR">ERROR</MenuItem>
                <MenuItem value="DEBUG">DEBUG</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </Box>
        
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Timestamp</TableCell>
                <TableCell>Level</TableCell>
                <TableCell>Component</TableCell>
                <TableCell>Message</TableCell>
                <TableCell>User</TableCell>
                <TableCell>IP Address</TableCell>
                <TableCell>Account</TableCell>
                <TableCell>Domain</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {systemLogs.map((log: any) => (
                <TableRow key={log.id}>
                  <TableCell>{log.timestamp}</TableCell>
                  <TableCell>
                    <Chip 
                      label={log.level} 
                      color={getLevelColor(log.level) as any}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>{log.component}</TableCell>
                  <TableCell>{log.message}</TableCell>
                  <TableCell>{log.user}</TableCell>
                  <TableCell>{log.ipAddress}</TableCell>
                  <TableCell>{log.account}</TableCell>
                  <TableCell>{log.domain}</TableCell>
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

      {/* Audit Trail */}
      <TabPanel value={tabValue} index={1}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
          <Typography variant="h6">Audit Trail ({auditTrail.length})</Typography>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <TextField
              size="small"
              placeholder="Search audit..."
              InputProps={{
                startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />
              }}
            />
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel>Action</InputLabel>
              <Select label="Action" defaultValue="">
                <MenuItem value="">All</MenuItem>
                <MenuItem value="CREATE">CREATE</MenuItem>
                <MenuItem value="UPDATE">UPDATE</MenuItem>
                <MenuItem value="DELETE">DELETE</MenuItem>
                <MenuItem value="READ">READ</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </Box>
        
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Timestamp</TableCell>
                <TableCell>Action</TableCell>
                <TableCell>Resource</TableCell>
                <TableCell>Resource Type</TableCell>
                <TableCell>User</TableCell>
                <TableCell>IP Address</TableCell>
                <TableCell>Details</TableCell>
                <TableCell>Account</TableCell>
                <TableCell>Domain</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {auditTrail.map((audit: any) => (
                <TableRow key={audit.id}>
                  <TableCell>{audit.timestamp}</TableCell>
                  <TableCell>
                    <Chip 
                      label={audit.action} 
                      color={getActionColor(audit.action) as any}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>{audit.resource}</TableCell>
                  <TableCell>{audit.resourceType}</TableCell>
                  <TableCell>{audit.user}</TableCell>
                  <TableCell>{audit.ipAddress}</TableCell>
                  <TableCell>{audit.details}</TableCell>
                  <TableCell>{audit.account}</TableCell>
                  <TableCell>{audit.domain}</TableCell>
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

export default Events; 