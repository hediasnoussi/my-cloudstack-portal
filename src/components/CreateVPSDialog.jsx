import React, { useState } from 'react';
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
  Stepper,
  Step,
  StepLabel,
  Grid,
  Card,
  CardContent,
  Alert
} from '@mui/material';
import { Cloud as CloudIcon } from '@mui/icons-material';

const CreateVPSDialog = ({ open, onClose, onVPSCreated }) => {
  const [activeStep, setActiveStep] = useState(0);
  const [vpsData, setVpsData] = useState({
    name: '',
    template: 'Ubuntu 20.04',
    zone: 'Zone 1',
    cpu: 2,
    ram: 4096,
    storage: 50
  });

  const steps = ['Configuration de base', 'Ressources', 'Validation'];

  const templates = [
    'Ubuntu 20.04',
    'Ubuntu 22.04',
    'CentOS 7',
    'CentOS 8',
    'Windows Server 2019',
    'Windows Server 2022'
  ];

  const zones = ['Zone 1', 'Zone 2', 'Zone 3'];
  const cpuOptions = [1, 2, 4, 8, 16];
  const ramOptions = [1024, 2048, 4096, 8192, 16384, 32768];
  const storageOptions = [20, 50, 100, 200, 500, 1000];

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleCreate = () => {
    const newVPS = {
      id: Date.now(),
      ...vpsData,
      status: 'Stopped',
      ip_address: `192.168.1.${Math.floor(Math.random() * 254) + 1}`,
      created_at: new Date().toISOString(),
      monthly_cost: calculateMonthlyCost(vpsData)
    };

    onVPSCreated(newVPS);
    handleClose();
  };

  const calculateMonthlyCost = (data) => {
    // Calcul simple du coût basé sur les ressources
    const baseCost = 10;
    const cpuCost = data.cpu * 5;
    const ramCost = (data.ram / 1024) * 2;
    const storageCost = (data.storage / 50) * 5;
    
    return Math.round((baseCost + cpuCost + ramCost + storageCost) * 100) / 100;
  };

  const handleClose = () => {
    setActiveStep(0);
    setVpsData({
      name: '',
      template: 'Ubuntu 20.04',
      zone: 'Zone 1',
      cpu: 2,
      ram: 4096,
      storage: 50
    });
    onClose();
  };

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Configuration de base
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Nom du VPS"
                  value={vpsData.name}
                  onChange={(e) => setVpsData({ ...vpsData, name: e.target.value })}
                  required
                  helperText="Choisissez un nom unique pour votre serveur"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Template</InputLabel>
                  <Select
                    value={vpsData.template}
                    onChange={(e) => setVpsData({ ...vpsData, template: e.target.value })}
                    label="Template"
                  >
                    {templates.map((template) => (
                      <MenuItem key={template} value={template}>
                        {template}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Zone</InputLabel>
                  <Select
                    value={vpsData.zone}
                    onChange={(e) => setVpsData({ ...vpsData, zone: e.target.value })}
                    label="Zone"
                  >
                    {zones.map((zone) => (
                      <MenuItem key={zone} value={zone}>
                        {zone}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </Box>
        );

      case 1:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Configuration des ressources
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={4}>
                <FormControl fullWidth>
                  <InputLabel>CPU</InputLabel>
                  <Select
                    value={vpsData.cpu}
                    onChange={(e) => setVpsData({ ...vpsData, cpu: e.target.value })}
                    label="CPU"
                  >
                    {cpuOptions.map((cpu) => (
                      <MenuItem key={cpu} value={cpu}>
                        {cpu} vCPU
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={4}>
                <FormControl fullWidth>
                  <InputLabel>RAM</InputLabel>
                  <Select
                    value={vpsData.ram}
                    onChange={(e) => setVpsData({ ...vpsData, ram: e.target.value })}
                    label="RAM"
                  >
                    {ramOptions.map((ram) => (
                      <MenuItem key={ram} value={ram}>
                        {ram} MB
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={4}>
                <FormControl fullWidth>
                  <InputLabel>Stockage</InputLabel>
                  <Select
                    value={vpsData.storage}
                    onChange={(e) => setVpsData({ ...vpsData, storage: e.target.value })}
                    label="Stockage"
                  >
                    {storageOptions.map((storage) => (
                      <MenuItem key={storage} value={storage}>
                        {storage} GB
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </Box>
        );

      case 2:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Validation de la configuration
            </Typography>
            
            <Card variant="outlined" sx={{ mb: 2 }}>
              <CardContent>
                <Typography variant="subtitle1" gutterBottom>
                  Résumé de votre VPS
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">
                      Nom: <strong>{vpsData.name}</strong>
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">
                      Template: <strong>{vpsData.template}</strong>
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">
                      Zone: <strong>{vpsData.zone}</strong>
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">
                      CPU: <strong>{vpsData.cpu} vCPU</strong>
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">
                      RAM: <strong>{vpsData.ram} MB</strong>
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">
                      Stockage: <strong>{vpsData.storage} GB</strong>
                    </Typography>
                  </Grid>
                </Grid>
                
                <Box mt={2} p={2} bgcolor="primary.light" borderRadius={1}>
                  <Typography variant="h6" color="primary.contrastText">
                    Coût mensuel estimé: {calculateMonthlyCost(vpsData)}€
                  </Typography>
                </Box>
              </CardContent>
            </Card>

            <Alert severity="info">
              Votre VPS sera créé avec le statut "Arrêté". Vous pourrez le démarrer depuis le tableau de bord.
            </Alert>
          </Box>
        );

      default:
        return null;
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box display="flex" alignItems="center">
          <CloudIcon sx={{ mr: 1 }} />
          Créer un nouveau VPS
        </Box>
      </DialogTitle>
      
      <DialogContent>
        <Box mb={3}>
          <Stepper activeStep={activeStep} alternativeLabel>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
        </Box>
        
        {renderStepContent(activeStep)}
      </DialogContent>
      
      <DialogActions>
        <Button onClick={handleClose} color="inherit">
          Annuler
        </Button>
        <Button
          disabled={activeStep === 0}
          onClick={handleBack}
          sx={{ mr: 1 }}
        >
          Retour
        </Button>
        {activeStep === steps.length - 1 ? (
          <Button
            variant="contained"
            onClick={handleCreate}
            disabled={!vpsData.name}
          >
            Créer le VPS
          </Button>
        ) : (
          <Button
            variant="contained"
            onClick={handleNext}
            disabled={!vpsData.name}
          >
            Suivant
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default CreateVPSDialog;
