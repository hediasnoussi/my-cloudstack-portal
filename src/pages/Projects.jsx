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
  Add as AddIcon, 
  Edit as EditIcon, 
  Delete as DeleteIcon, 
  Visibility as ViewIcon, 
  Refresh as RefreshIcon, 
  Group as GroupIcon, 
  Settings as SettingsIcon 
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';

const Projects = () => {
  const { t } = useTranslation();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogMode, setDialogMode] = useState('create');
  const [selectedProject, setSelectedProject] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  // Mock data for projects
  const mockProjects = [
    {
      id: 1,
      name: 'Web Development',
      description: 'Web application development project',
      owner: 'admin',
      state: 'Active',
      displayText: 'Web Development Project',
      account: 'admin',
      domain: 'ROOT',
      created: '2024-01-15T10:30:00Z',
      tags: ['web', 'development']
    },
    {
      id: 2,
      name: 'Mobile App',
      description: 'Mobile application development',
      owner: 'user1',
      state: 'Active',
      displayText: 'Mobile App Project',
      account: 'user1',
      domain: 'ROOT',
      created: '2024-01-20T14:45:00Z',
      tags: ['mobile', 'app']
    },
    {
      id: 3,
      name: 'Data Analytics',
      description: 'Data analysis and visualization project',
      owner: 'user2',
      state: 'Suspended',
      displayText: 'Data Analytics Project',
      account: 'user2',
      domain: 'ROOT',
      created: '2024-01-25T09:15:00Z',
      tags: ['data', 'analytics']
    }
  ];

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    displayText: '',
    account: '',
    domain: 'ROOT'
  });

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      // Simuler un délai de chargement
      await new Promise(resolve => setTimeout(resolve, 1000));
      setProjects(mockProjects);
      setError('');
    } catch (err) {
      setError(`${t('projects.errorLoadingProjects')}: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProject = async (projectData) => {
    try {
      const newProject = {
        id: Date.now(),
        ...projectData,
        created: new Date().toISOString(),
        state: 'Active'
      };
      setProjects([...projects, newProject]);
      setSnackbar({ open: true, message: t('projects.projectCreatedSuccess'), severity: 'success' });
    } catch (err) {
      setSnackbar({ open: true, message: `${t('projects.errorCreatingProject')}: ${err.message}`, severity: 'error' });
    }
  };

  const handleUpdateProject = async (id, projectData) => {
    try {
      setProjects(projects.map(project => 
        project.id === id ? { ...project, ...projectData } : project
      ));
      setSnackbar({ open: true, message: t('projects.projectUpdatedSuccess'), severity: 'success' });
    } catch (err) {
      setSnackbar({ open: true, message: `${t('projects.errorUpdatingProject')}: ${err.message}`, severity: 'error' });
    }
  };

  const handleDeleteProject = async (id) => {
    try {
      setProjects(projects.filter(project => project.id !== id));
      setSnackbar({ open: true, message: t('projects.projectDeletedSuccess'), severity: 'success' });
    } catch (err) {
      setSnackbar({ open: true, message: `${t('projects.errorDeletingProject')}: ${err.message}`, severity: 'error' });
    }
  };

  const handleOpenDialog = (mode, project = null) => {
    setDialogMode(mode);
    if (project) {
      setSelectedProject(project);
      setFormData({
        name: project.name,
        description: project.description,
        displayText: project.displayText,
        account: project.account,
        domain: project.domain
      });
    } else {
      setSelectedProject(null);
      setFormData({
        name: '',
        description: '',
        displayText: '',
        account: '',
        domain: 'ROOT'
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedProject(null);
  };

  const handleSubmit = async () => {
    if (dialogMode === 'create') {
      await handleCreateProject(formData);
    } else {
      await handleUpdateProject(selectedProject.id, formData);
    }
    handleCloseDialog();
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const getStateColor = (state) => {
    switch (state) {
      case 'Active':
        return 'success';
      case 'Suspended':
        return 'warning';
      case 'Inactive':
        return 'error';
      default:
        return 'default';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mt: 2 }}>
        {error}
      </Alert>
    );
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, color: '#1e293b' }}>
          {t('projects.title')}
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button variant="outlined" startIcon={<RefreshIcon />} onClick={fetchProjects}>
            {t('projects.refresh')}
          </Button>
          <Button variant="contained" startIcon={<AddIcon />} onClick={() => handleOpenDialog('create')}>
            + {t('projects.newProject')}
          </Button>
        </Box>
      </Box>

      <TableContainer component={Paper} sx={{ boxShadow: '0 1px 3px rgba(0,0,0,0.1)', borderRadius: 2 }}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: '#f8fafc' }}>
              <TableCell sx={{ fontWeight: 600, color: '#374151' }}>{t('projects.name')}</TableCell>
              <TableCell sx={{ fontWeight: 600, color: '#374151' }}>{t('projects.description')}</TableCell>
              <TableCell sx={{ fontWeight: 600, color: '#374151' }}>{t('projects.owner')}</TableCell>
              <TableCell sx={{ fontWeight: 600, color: '#374151' }}>{t('projects.state')}</TableCell>
              <TableCell sx={{ fontWeight: 600, color: '#374151' }}>{t('projects.account')}</TableCell>
              <TableCell sx={{ fontWeight: 600, color: '#374151' }}>{t('projects.domain')}</TableCell>
              <TableCell sx={{ fontWeight: 600, color: '#374151' }}>{t('projects.created')}</TableCell>
              <TableCell sx={{ fontWeight: 600, color: '#374151' }}>{t('projects.actions')}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {projects.map((project) => (
              <TableRow key={project.id} sx={{ '&:hover': { backgroundColor: '#f9fafb' } }}>
                <TableCell sx={{ fontWeight: 500 }}>{project.name}</TableCell>
                <TableCell>{project.description}</TableCell>
                <TableCell>{project.owner}</TableCell>
                <TableCell>
                  <Chip 
                    label={project.state} 
                    color={getStateColor(project.state)} 
                    size="small" 
                  />
                </TableCell>
                <TableCell>{project.account}</TableCell>
                <TableCell>{project.domain}</TableCell>
                <TableCell>{formatDate(project.created)}</TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Tooltip title={t('projects.viewProject')}>
                      <IconButton size="small" sx={{ color: '#6b7280' }}>
                        <ViewIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title={t('projects.editProject')}>
                      <IconButton size="small" sx={{ color: '#6b7280' }} onClick={() => handleOpenDialog('edit', project)}>
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title={t('projects.deleteProject')}>
                      <IconButton size="small" sx={{ color: '#ef4444' }} onClick={() => handleDeleteProject(project.id)}>
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

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {dialogMode === 'create' ? t('projects.newProject') : t('projects.editProject')}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <TextField 
              fullWidth 
              label={t('projects.name')} 
              value={formData.name} 
              onChange={(e) => handleInputChange('name', e.target.value)} 
              sx={{ mb: 2 }} 
            />
            <TextField 
              fullWidth 
              label={t('projects.description')} 
              value={formData.description} 
              onChange={(e) => handleInputChange('description', e.target.value)} 
              multiline 
              rows={3} 
              sx={{ mb: 2 }} 
            />
            <TextField 
              fullWidth 
              label={t('projects.displayText')} 
              value={formData.displayText} 
              onChange={(e) => handleInputChange('displayText', e.target.value)} 
              sx={{ mb: 2 }} 
            />
            <TextField 
              fullWidth 
              label={t('projects.account')} 
              value={formData.account} 
              onChange={(e) => handleInputChange('account', e.target.value)} 
              sx={{ mb: 2 }} 
            />
            <TextField 
              fullWidth 
              label={t('projects.domain')} 
              value={formData.domain} 
              onChange={(e) => handleInputChange('domain', e.target.value)} 
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>{t('common.cancel')}</Button>
          <Button onClick={handleSubmit} variant="contained">{t('common.save')}</Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={() => setSnackbar({ ...snackbar, open: false })}>
        <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Projects; 