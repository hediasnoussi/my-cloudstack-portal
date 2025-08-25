import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  Tooltip
} from '@mui/material';
import {
  Refresh as RefreshIcon,
  Add as AddIcon,
  Visibility as ViewIcon,
  Edit as EditIcon,
  History as RevertIcon,
  Download as DownloadIcon,
  Delete as DeleteIcon
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';

const Snapshots = () => {
  const { t } = useTranslation();
  const [snapshots] = useState([
    {
      id: 1,
      name: 'Web Server Backup',
      description: 'Snapshot avant mise à jour système',
      instance: 'Web Server 1',
      size: '2.5 GB',
      status: 'ready',
      creationDate: '15/01/2024'
    },
    {
      id: 2,
      name: 'Database Snapshot',
      description: 'Sauvegarde de la base de données',
      instance: 'Database Server',
      size: '5.2 GB',
      status: 'inProgress',
      creationDate: '14/01/2024'
    }
  ]);

  const getStatusChip = (status) => {
    switch (status) {
      case 'ready':
        return <Chip label={t('snapshots.ready')} color="success" size="small" />;
      case 'inProgress':
        return <Chip label={t('snapshots.inProgress')} color="warning" size="small" />;
      case 'error':
        return <Chip label={t('snapshots.error')} color="error" size="small" />;
      default:
        return <Chip label={status} size="small" />;
    }
  };

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, color: '#1e293b' }}>
          {t('snapshots.title')}
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            sx={{
              borderColor: '#e2e8f0',
              color: '#64748b',
              '&:hover': {
                borderColor: '#cbd5e1',
                backgroundColor: '#f8fafc'
              }
            }}
          >
            {t('snapshots.refresh')}
          </Button>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            sx={{
              bgcolor: '#1e40af',
              '&:hover': {
                bgcolor: '#1e3a8a'
              }
            }}
          >
            + {t('snapshots.newSnapshot')}
          </Button>
        </Box>
      </Box>

      {/* Table */}
      <TableContainer component={Paper} sx={{ boxShadow: '0 1px 3px rgba(0,0,0,0.1)', borderRadius: 2 }}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: '#f8fafc' }}>
              <TableCell sx={{ fontWeight: 600, color: '#374151' }}>{t('snapshots.id')}</TableCell>
              <TableCell sx={{ fontWeight: 600, color: '#374151' }}>{t('snapshots.name')}</TableCell>
              <TableCell sx={{ fontWeight: 600, color: '#374151' }}>{t('snapshots.description')}</TableCell>
              <TableCell sx={{ fontWeight: 600, color: '#374151' }}>{t('snapshots.instance')}</TableCell>
              <TableCell sx={{ fontWeight: 600, color: '#374151' }}>{t('snapshots.size')}</TableCell>
              <TableCell sx={{ fontWeight: 600, color: '#374151' }}>{t('snapshots.status')}</TableCell>
              <TableCell sx={{ fontWeight: 600, color: '#374151' }}>{t('snapshots.creationDate')}</TableCell>
              <TableCell sx={{ fontWeight: 600, color: '#374151' }}>{t('snapshots.actions')}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {snapshots.map((snapshot) => (
              <TableRow key={snapshot.id} sx={{ '&:hover': { backgroundColor: '#f9fafb' } }}>
                <TableCell>{snapshot.id}</TableCell>
                <TableCell sx={{ fontWeight: 500 }}>{snapshot.name}</TableCell>
                <TableCell>{snapshot.description}</TableCell>
                <TableCell>{snapshot.instance}</TableCell>
                <TableCell>{snapshot.size}</TableCell>
                <TableCell>{getStatusChip(snapshot.status)}</TableCell>
                <TableCell>{snapshot.creationDate}</TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Tooltip title={t('snapshots.view')}>
                      <IconButton size="small" sx={{ color: '#6b7280' }}>
                        <ViewIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title={t('snapshots.edit')}>
                      <IconButton size="small" sx={{ color: '#6b7280' }}>
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    {snapshot.status === 'ready' && (
                      <>
                        <Tooltip title={t('snapshots.revert')}>
                          <IconButton size="small" sx={{ color: '#6b7280' }}>
                            <RevertIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title={t('snapshots.download')}>
                          <IconButton size="small" sx={{ color: '#6b7280' }}>
                            <DownloadIcon />
                          </IconButton>
                        </Tooltip>
                      </>
                    )}
                    <Tooltip title={t('snapshots.delete')}>
                      <IconButton size="small" sx={{ color: '#6b7280' }}>
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
    </Box>
  );
};

export default Snapshots; 