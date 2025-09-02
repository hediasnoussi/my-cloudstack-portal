import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Card,
  CardContent,
  Alert,
  Stepper,
  Step,
  StepLabel,
  FormControlLabel,
  Checkbox,
  Chip
} from '@mui/material';
import {
  Cloud as CloudIcon,
  Upload as UploadIcon,
  Settings as SettingsIcon
} from '@mui/icons-material';

const CreateTemplateDialog = ({ open, onClose, onTemplateCreated }) => {
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const [formData, setFormData] = useState({
    name: '',
    displaytext: '',
    format: 'QCOW2',
    hypervisor: 'KVM',
    ostypeid: '1',
    url: '',
    zoneid: '',
    ispublic: true,
    isfeatured: false,
    isextractable: false,
    passwordenabled: false,
    sshkeyenabled: true
  });

  const [zones, setZones] = useState([]);
  const [osTypes, setOsTypes] = useState([]);

  const steps = ['Informations de base', 'Configuration technique', 'Options avancées'];

  // Récupérer les zones et types d'OS au chargement
  useEffect(() => {
    if (open) {
      fetchZones();
      fetchOsTypes();
    }
  }, [open]);

  const fetchZones = async () => {
    try {
      const response = await fetch('/api/cloudstack/zones');
      const data = await response.json();
      if (data.success) {
        setZones(data.data || []);
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des zones:', error);
    }
  };

  const fetchOsTypes = async () => {
    try {
      const response = await fetch('/api/cloudstack/ostypes');
      const data = await response.json();
      if (data.success) {
        setOsTypes(data.data || []);
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des types d\'OS:', error);
    }
  };

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleSubmit = async () => {
    if (!formData.name || !formData.displaytext || !formData.zoneid) {
      setError('Veuillez remplir tous les champs obligatoires');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/cloudstack/templates', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        setSuccess('Template créé avec succès !');
        setTimeout(() => {
          onTemplateCreated(data.template);
          handleClose();
        }, 2000);
      } else {
        setError(data.error || 'Erreur lors de la création du template');
      }
    } catch (error) {
      setError('Erreur de connexion au serveur');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setActiveStep(0);
    setFormData({
      name: '',
      displaytext: '',
      format: 'QCOW2',
      hypervisor: 'KVM',
      ostypeid: '1',
      url: '',
      zoneid: '',
      ispublic: true,
      isfeatured: false,
      isextractable: false,
      passwordenabled: false,
      sshkeyenabled: true
    });
    setError('');
    setSuccess('');
    onClose();
  };

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Nom du template *"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="ex: Ubuntu-22.04-LTS"
                helperText="Nom unique pour identifier le template"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description *"
                value={formData.displaytext}
                onChange={(e) => setFormData({ ...formData, displaytext: e.target.value })}
                placeholder="ex: Ubuntu 22.04 LTS (Jammy Jellyfish)"
                multiline
                rows={3}
                helperText="Description détaillée du template"
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Zone *</InputLabel>
                <Select
                  value={formData.zoneid}
                  onChange={(e) => setFormData({ ...formData, zoneid: e.target.value })}
                  label="Zone *"
                >
                  {zones.map((zone) => (
                    <MenuItem key={zone.id} value={zone.id}>
                      {zone.name} ({zone.id})
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        );

      case 1:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Format d'image</InputLabel>
                <Select
                  value={formData.format}
                  onChange={(e) => setFormData({ ...formData, format: e.target.value })}
                  label="Format d'image"
                >
                  <MenuItem value="QCOW2">QCOW2 (Recommandé)</MenuItem>
                  <MenuItem value="VMDK">VMDK</MenuItem>
                  <MenuItem value="OVA">OVA</MenuItem>
                  <MenuItem value="RAW">RAW</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Hyperviseur</InputLabel>
                <Select
                  value={formData.hypervisor}
                  onChange={(e) => setFormData({ ...formData, hypervisor: e.target.value })}
                  label="Hyperviseur"
                >
                  <MenuItem value="KVM">KVM</MenuItem>
                  <MenuItem value="VMware">VMware</MenuItem>
                  <MenuItem value="XenServer">XenServer</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Type d'OS</InputLabel>
                <Select
                  value={formData.ostypeid}
                  onChange={(e) => setFormData({ ...formData, ostypeid: e.target.value })}
                  label="Type d'OS"
                >
                  {osTypes.map((os) => (
                    <MenuItem key={os.id} value={os.id}>
                      {os.description}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="URL de l'image (optionnel)"
                value={formData.url}
                onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                placeholder="https://example.com/image.qcow2"
                helperText="URL de téléchargement de l'image (laisser vide pour upload manuel)"
              />
            </Grid>
          </Grid>
        );

      case 2:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Options du template
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={formData.ispublic}
                    onChange={(e) => setFormData({ ...formData, ispublic: e.target.checked })}
                  />
                }
                label="Template public"
              />
              <Typography variant="caption" display="block" color="textSecondary">
                Accessible à tous les utilisateurs
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={formData.isfeatured}
                    onChange={(e) => setFormData({ ...formData, isfeatured: e.target.checked })}
                  />
                }
                label="Template mis en avant"
              />
              <Typography variant="caption" display="block" color="textSecondary">
                Apparaît dans les templates recommandés
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={formData.isextractable}
                    onChange={(e) => setFormData({ ...formData, isextractable: e.target.checked })}
                  />
                }
                label="Template extractible"
              />
              <Typography variant="caption" display="block" color="textSecondary">
                Peut être téléchargé par les utilisateurs
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={formData.passwordenabled}
                    onChange={(e) => setFormData({ ...formData, passwordenabled: e.target.checked })}
                  />
                }
                label="Mot de passe activé"
              />
              <Typography variant="caption" display="block" color="textSecondary">
                Permet la configuration de mot de passe
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={formData.sshkeyenabled}
                    onChange={(e) => setFormData({ ...formData, sshkeyenabled: e.target.checked })}
                  />
                }
                label="Clé SSH activée"
              />
              <Typography variant="caption" display="block" color="textSecondary">
                Permet l'utilisation de clés SSH
              </Typography>
            </Grid>
          </Grid>
        );

      default:
        return null;
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box display="flex" alignItems="center" gap={1}>
          <CloudIcon color="primary" />
          <Typography variant="h6">Créer un nouveau template</Typography>
        </Box>
      </DialogTitle>
      
      <DialogContent>
        <Box sx={{ mt: 2 }}>
          <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          {success && (
            <Alert severity="success" sx={{ mb: 2 }}>
              {success}
            </Alert>
          )}

          {renderStepContent(activeStep)}
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 3 }}>
        <Button onClick={handleClose} disabled={loading}>
          Annuler
        </Button>
        <Button
          onClick={handleBack}
          disabled={activeStep === 0 || loading}
          sx={{ mr: 1 }}
        >
          Retour
        </Button>
        {activeStep === steps.length - 1 ? (
          <Button
            onClick={handleSubmit}
            variant="contained"
            disabled={loading}
            startIcon={loading ? null : <UploadIcon />}
          >
            {loading ? 'Création...' : 'Créer le template'}
          </Button>
        ) : (
          <Button onClick={handleNext} variant="contained">
            Suivant
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default CreateTemplateDialog;
