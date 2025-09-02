import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Button, 
  Chip, 
  IconButton, 
  Tooltip, 
  Alert, 
  CircularProgress, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  TextField, 
  Snackbar, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem 
} from '@mui/material';
import { 
  Refresh as RefreshIcon, 
  Visibility as ViewIcon, 
  History as HistoryIcon, 
  FilterList as FilterIcon 
} from '@mui/icons-material';

const AuditTrail = () => {
  const [auditLogs, setAuditLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedLog, setSelectedLog] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  // Mock data for audit logs
  const mockAuditLogs = [
    {
      id: 1,
      action: 'CREATE',
      resource: 'Instance',
      resourceName: 'web-server-01',
      user: 'admin',
      timestamp: '2024-01-15T10:30:00Z',
      ipAddress: '192.168.1.100',
      status: 'SUCCESS',
      details: 'Created new instance with ID vm-001'
    },
    {
      id: 2,
      action: 'UPDATE',
      resource: 'Volume',
      resourceName: 'data-volume-01',
      user: 'admin',
      timestamp: '2024-01-20T14:45:00Z',
      ipAddress: '192.168.1.100',
      status: 'SUCCESS',
      details: 'Updated volume size from 50GB to 100GB'
    },
    {
      id: 3,
      action: 'DELETE',
      resource: 'Network',
      resourceName: 'dev-network',
      user: 'user1',
      timestamp: '2024-01-25T09:15:00Z',
      ipAddress: '192.168.1.101',
      status: 'FAILED',
      details: 'Failed to delete network: Network is still in use'
    },
    {
      id: 4,
      action: 'LOGIN',
      resource: 'System',
      resourceName: 'Authentication',
      user: 'admin',
      timestamp: '2024-01-26T08:30:00Z',
      ipAddress: '192.168.1.100',
      status: 'SUCCESS',
      details: 'User logged in successfully'
    },
    {
      id: 5,
      action: 'LOGOUT',
      resource: 'System',
      resourceName: 'Authentication',
      user: 'user1',
      timestamp: '2024-01-26T17:45:00Z',
      ipAddress: '192.168.1.101',
      status: 'SUCCESS',
      details: 'User logged out'
    }
  ];

  useEffect(() => {
    fetchAuditLogs();
  }, []);

  const fetchAuditLogs = async () => {
    try {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      setAuditLogs(mockAuditLogs);
      setError('');
    } catch (err) {
      setError('Failed to fetch audit logs');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (log) => {
    setSelectedLog(log);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedLog(null);
  };

  const getActionColor = (action) => {
    switch (action) {
      case 'CREATE': return 'success';
      case 'UPDATE': return 'primary';
      case 'DELETE': return 'error';
      case 'LOGIN': return 'info';
      case 'LOGOUT': return 'warning';
      default: return 'default';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'SUCCESS': return 'success';
      case 'FAILED': return 'error';
      case 'PENDING': return 'warning';
      default: return 'default';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box p={3}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1">
          Audit Trail
        </Typography>
        <Box>
          <Button
            variant="outlined"
            startIcon={<FilterIcon />}
            sx={{ mr: 1 }}
          >
            Filter
          </Button>
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={fetchAuditLogs}
          >
            Refresh
          </Button>
        </Box>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Paper>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Action</TableCell>
                <TableCell>Resource</TableCell>
                <TableCell>Resource Name</TableCell>
                <TableCell>User</TableCell>
                <TableCell>IP Address</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Timestamp</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {auditLogs.map((log) => (
                <TableRow key={log.id}>
                  <TableCell>
                    <Chip 
                      label={log.action} 
                      color={getActionColor(log.action)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>{log.resource}</TableCell>
                  <TableCell>{log.resourceName}</TableCell>
                  <TableCell>{log.user}</TableCell>
                  <TableCell>
                    <Typography variant="body2" fontFamily="monospace">
                      {log.ipAddress}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={log.status} 
                      color={getStatusColor(log.status)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>{formatDate(log.timestamp)}</TableCell>
                  <TableCell align="center">
                    <Tooltip title="View Details">
                      <IconButton 
                        size="small" 
                        onClick={() => handleOpenDialog(log)}
                      >
                        <ViewIcon />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          Audit Log Details
        </DialogTitle>
        <DialogContent>
          {selectedLog && (
            <Box sx={{ pt: 1 }}>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h6">
                  {selectedLog.action} - {selectedLog.resource}
                </Typography>
                <Chip 
                  label={selectedLog.status} 
                  color={getStatusColor(selectedLog.status)}
                />
              </Box>
              
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" color="textSecondary">
                  Resource Information
                </Typography>
                <Typography variant="body2" sx={{ mt: 1 }}>
                  <strong>Resource Type:</strong> {selectedLog.resource}
                </Typography>
                <Typography variant="body2">
                  <strong>Resource Name:</strong> {selectedLog.resourceName}
                </Typography>
              </Box>

              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" color="textSecondary">
                  User Information
                </Typography>
                <Typography variant="body2" sx={{ mt: 1 }}>
                  <strong>User:</strong> {selectedLog.user}
                </Typography>
                <Typography variant="body2">
                  <strong>IP Address:</strong> {selectedLog.ipAddress}
                </Typography>
              </Box>

              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" color="textSecondary">
                  Timestamp
                </Typography>
                <Typography variant="body2" sx={{ mt: 1 }}>
                  {formatDate(selectedLog.timestamp)}
                </Typography>
              </Box>

              <Box>
                <Typography variant="subtitle2" color="textSecondary">
                  Details
                </Typography>
                <Typography variant="body2" sx={{ mt: 1 }}>
                  {selectedLog.details}
                </Typography>
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>
            Close
          </Button>
        </DialogActions>
      </Dialog>

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
    </Box>
  );
};

export default AuditTrail; 