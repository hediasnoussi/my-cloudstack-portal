import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Card,
  CardContent,
  Alert,
  Snackbar,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  RadioGroup,
  FormControlLabel,
  Radio,
  Chip,
  Divider
} from '@mui/material';
import {
  Cloud as InstanceIcon,
  Storage as StorageIcon,
  NetworkCheck as NetworkIcon,
  Settings as SettingsIcon,
  Language as GlobeIcon,
  Search as SearchIcon,
  Computer as ComputerIcon
} from '@mui/icons-material';
import { Checkbox } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../contexts/AuthContext.jsx';
import cloudstackService from '../services/cloudstackService';

const CreateInstance = () => {
  const { t } = useTranslation();
  const { isPartner, user } = useAuth();
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({
    // Étape 1: Template
    templateType: 'templates', // 'templates'
    templateCategory: 'featured', // 'featured', 'community', 'my-templates', 'shared'
    selectedTemplate: 'CentOS 5.5(64-bit) no GUI (KVM)', // Template par défaut
    overrideDiskSize: false,
    customDiskSize: '',
    
    // Étape 2: Compute offering
    computeOffering: 'Small Instance', // Offering par défaut
    
    // Étape 3: Disk size
    diskSize: '',
    
    // Étape 4: Details
    name: '',
    group: '',
    keyboardLanguage: '',
    startInstance: true,
    
    // Étape 4: Options de sauvegarde
    premiumBackup: false,
    snapshotBackup: false
  });
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [templates, setTemplates] = useState([]);
  const [offerings, setOfferings] = useState([]);
  const [zones, setZones] = useState([]);
  const [loading, setLoading] = useState(true);

  // Charger les ressources CloudStack au démarrage
  React.useEffect(() => {
    const loadResources = async () => {
      try {
        setLoading(true);
        const [templatesData, offeringsData, zonesData] = await Promise.all([
          cloudstackService.getTemplates(),
          cloudstackService.getServiceOfferings(),
          cloudstackService.getZones()
        ]);

        setTemplates(templatesData);
        setOfferings(offeringsData);
        setZones(zonesData);

        // Initialiser les valeurs par défaut
        if (templatesData.length > 0) {
          setFormData(prev => ({ ...prev, selectedTemplate: templatesData[0].name }));
        }
        if (offeringsData.length > 0) {
          setFormData(prev => ({ ...prev, computeOffering: offeringsData[0].name }));
        }
      } catch (error) {
        console.error('Erreur lors du chargement des ressources:', error);
        setSnackbar({ open: true, message: 'Erreur lors du chargement des ressources CloudStack', severity: 'error' });
      } finally {
        setLoading(false);
      }
    };

    loadResources();
  }, []);

  // Étapes selon le rôle
  const getSteps = () => {
    if (isPartner()) {
      // Pour les agents : VPS name, Template, Compute offering
      return [
        {
          label: t('createInstance.vpsName'),
          icon: <SettingsIcon />
        },
        {
          label: t('createInstance.templates'),
          icon: <InstanceIcon />
        },
        {
          label: t('createInstance.step2'),
          icon: <SettingsIcon />
        },
        {
          label: 'Choisissez vos options',
          icon: <SettingsIcon />
        }
      ];
    } else {
      // Pour les subproviders : VPS name en premier, puis Template, Compute
      return [
        {
          label: t('createInstance.vpsName'),
          icon: <SettingsIcon />
        },
        {
          label: t('createInstance.step1'),
          icon: <InstanceIcon />
        },
        {
          label: t('createInstance.step2'),
          icon: <SettingsIcon />
        },
        {
          label: 'Choisissez vos options',
          icon: <SettingsIcon />
        }
      ];
    }
  };

  const steps = getSteps();

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleSubmit = async () => {
    try {
      if (!formData.selectedTemplate) {
        setSnackbar({ open: true, message: t('createInstance.templateOrIsoRequired'), severity: 'error' });
        return;
      }

      // Afficher un message de création en cours
      setSnackbar({ open: true, message: 'Création du VPS en cours...', severity: 'info' });

      // Utiliser les ressources déjà chargées
      if (templates.length === 0 || offerings.length === 0 || zones.length === 0) {
        throw new Error('Ressources CloudStack non disponibles. Veuillez recharger la page.');
      }

      // Trouver les IDs correspondants
      const selectedTemplate = templates.find(t => t.name === formData.selectedTemplate) || templates[0];
      const selectedOffering = offerings.find(o => o.name === formData.computeOffering) || offerings[0];
      const selectedZone = zones[0]; // Utiliser la première zone disponible

      if (!selectedTemplate || !selectedOffering || !selectedZone) {
        console.error('Templates disponibles:', templates.map(t => ({ id: t.id, name: t.name })));
        console.error('Offers disponibles:', offerings.map(o => ({ id: o.id, name: o.name })));
        console.error('Zones disponibles:', zones.map(z => ({ id: z.id, name: z.name })));
        throw new Error('Ressources CloudStack non trouvées');
      }

      // Préparer les données pour la création
      const vmData = {
        name: formData.name || `vps-${Date.now()}`,
        displayname: formData.name || `VPS ${new Date().toLocaleDateString()}`,
        templateid: selectedTemplate.id,
        serviceofferingid: selectedOffering.id,
        zoneid: selectedZone.id,
        startvm: formData.startInstance
      };

      console.log('🚀 Création du VPS avec les données:', vmData);

      // Créer le VPS via l'API CloudStack
      const result = await cloudstackService.deployVirtualMachine(vmData);

      console.log('✅ VPS créé avec succès:', result);

      setSnackbar({ open: true, message: t('createInstance.instanceCreatedSuccess'), severity: 'success' });
      
      setTimeout(() => {
        // Redirection vers le dashboard avec les informations du VPS créé
        navigate('/dashboard', { 
          state: { 
            vpsCreated: true,
            vpsName: formData.name || result.name,
            template: formData.selectedTemplate || 'Default Template',
            computeOffering: formData.computeOffering || 'Small Instance',
            startInstance: formData.startInstance,
            owner: user?.username,
            vmId: result.id // Ajouter l'ID du VPS créé
          }
        });
      }, 2000);

    } catch (err) {
      console.error('❌ Erreur lors de la création du VPS:', err);
      setSnackbar({ 
        open: true, 
        message: `Erreur lors de la création du VPS: ${err instanceof Error ? err.message : 'Unknown error'}`, 
        severity: 'error' 
      });
    }
  };

  const renderStepContent = (step: number) => {
    if (isPartner()) {
      // Mapping des étapes pour les agents
      switch (step) {
        case 0: // VPS name
          return renderVpsNameStep();
        case 1: // Template
          return renderTemplateStep();
        case 2: // Compute offering
          return renderComputeOfferingStep();
        case 3: // Options
          return renderOptionsStep();
        default:
          return null;
      }
    } else {
      // Mapping des étapes pour les subproviders (VPS Name d'abord)
      switch (step) {
        case 0: // VPS name
          return renderVpsNameStep();
        case 1: // Template
          return renderTemplateStep();
        case 2: // Compute offering
          return renderComputeOfferingStep();
        case 3: // Options
          return renderOptionsStep();
        default:
          return null;
      }
    }
  };

  const renderTemplateStep = () => {
    return (
      <Box>
        {/* Step Header */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h5" sx={{ fontWeight: 600, color: 'white', mb: 1 }}>
            {isPartner() ? t('createInstance.templates') : t('createInstance.step1')}
          </Typography>
          <Typography variant="body1" sx={{ color: 'white' }}>
            {t('createInstance.templateDescription')}
          </Typography>
        </Box>

        {/* Main Tabs */}
        <Box sx={{ mb: 4 }}>
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            borderBottom: 2,
            borderColor: '#e2e8f0'
          }}>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button
                variant={formData.templateType === 'templates' ? 'contained' : 'text'}
                onClick={() => setFormData({ ...formData, templateType: 'templates' })}
                sx={{ 
                  borderRadius: 2,
                  textTransform: 'none',
                  fontWeight: 600
                }}
              >
                {t('createInstance.templates')}
              </Button>
            </Box>
          </Box>

          {/* Template Options */}
          <Box sx={{ mt: 3 }}>
            {isPartner() ? (
              // Template options for agents
              <Box>
                <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
                  {t('createInstance.selectTemplate')}
                </Typography>
                <Box sx={{ display: 'grid', gap: 2 }}>
                  <Card 
                    variant="outlined" 
                    sx={{ 
                      cursor: 'pointer',
                      borderColor: formData.selectedTemplate === 'ubuntu' ? 'primary.main' : 'divider',
                      bgcolor: formData.selectedTemplate === 'ubuntu' ? 'primary.50' : 'transparent'
                    }}
                    onClick={() => setFormData({ ...formData, selectedTemplate: 'ubuntu' })}
                  >
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <ComputerIcon color="primary" />
                        <Box>
                          <Typography variant="h6" sx={{ fontWeight: 600 }}>
                            Ubuntu
                          </Typography>
                          <Typography variant="body2" color="textSecondary">
                            Ubuntu 22.04 LTS - Système d'exploitation Linux populaire
                          </Typography>
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>

                  <Card 
                    variant="outlined" 
                    sx={{ 
                      cursor: 'pointer',
                      borderColor: formData.selectedTemplate === 'centos' ? 'primary.main' : 'divider',
                      bgcolor: formData.selectedTemplate === 'centos' ? 'primary.50' : 'transparent'
                    }}
                    onClick={() => setFormData({ ...formData, selectedTemplate: 'centos' })}
                  >
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <ComputerIcon color="primary" />
                        <Box>
                          <Typography variant="h6" sx={{ fontWeight: 600 }}>
                            CentOS
                          </Typography>
                          <Typography variant="body2" color="textSecondary">
                            CentOS 8 - Distribution Linux d'entreprise
                          </Typography>
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>

                  <Card 
                    variant="outlined" 
                    sx={{ 
                      cursor: 'pointer',
                      borderColor: formData.selectedTemplate === 'windows' ? 'primary.main' : 'divider',
                      bgcolor: formData.selectedTemplate === 'windows' ? 'primary.50' : 'transparent'
                    }}
                    onClick={() => setFormData({ ...formData, selectedTemplate: 'windows' })}
                  >
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <ComputerIcon color="primary" />
                        <Box>
                          <Typography variant="h6" sx={{ fontWeight: 600 }}>
                            Windows
                          </Typography>
                          <Typography variant="body2" color="textSecondary">
                            Windows Server 2022 - Système d'exploitation Microsoft
                          </Typography>
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                </Box>
              </Box>
            ) : (
              // Template options for subproviders (same as agents)
              <Box>
                <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
                  {t('createInstance.selectTemplate')}
                </Typography>
                <Box sx={{ display: 'grid', gap: 2 }}>
                  <Card 
                    variant="outlined" 
                    sx={{ 
                      cursor: 'pointer',
                      borderColor: formData.selectedTemplate === 'ubuntu' ? 'primary.main' : 'divider',
                      bgcolor: formData.selectedTemplate === 'ubuntu' ? 'primary.50' : 'transparent'
                    }}
                    onClick={() => setFormData({ ...formData, selectedTemplate: 'ubuntu' })}
                  >
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <ComputerIcon color="primary" />
                        <Box>
                          <Typography variant="h6" sx={{ fontWeight: 600 }}>
                            Ubuntu
                          </Typography>
                          <Typography variant="body2" color="textSecondary">
                            Ubuntu 22.04 LTS - Système d'exploitation Linux populaire
                          </Typography>
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>

                  <Card 
                    variant="outlined" 
                    sx={{ 
                      cursor: 'pointer',
                      borderColor: formData.selectedTemplate === 'centos' ? 'primary.main' : 'divider',
                      bgcolor: formData.selectedTemplate === 'centos' ? 'primary.50' : 'transparent'
                    }}
                    onClick={() => setFormData({ ...formData, selectedTemplate: 'centos' })}
                  >
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <ComputerIcon color="primary" />
                        <Box>
                          <Typography variant="h6" sx={{ fontWeight: 600 }}>
                            CentOS
                          </Typography>
                          <Typography variant="body2" color="textSecondary">
                            CentOS 8 - Distribution Linux d'entreprise
                          </Typography>
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>

                  <Card 
                    variant="outlined" 
                    sx={{ 
                      cursor: 'pointer',
                      borderColor: formData.selectedTemplate === 'windows' ? 'primary.main' : 'divider',
                      bgcolor: formData.selectedTemplate === 'windows' ? 'primary.50' : 'transparent'
                    }}
                    onClick={() => setFormData({ ...formData, selectedTemplate: 'windows' })}
                  >
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <ComputerIcon color="primary" />
                        <Box>
                          <Typography variant="h6" sx={{ fontWeight: 600 }}>
                            Windows
                          </Typography>
                          <Typography variant="body2" color="textSecondary">
                            Windows Server 2022 - Système d'exploitation Microsoft
                          </Typography>
                        </Box>
                </Box>
                    </CardContent>
                  </Card>
                </Box>
              </Box>
            )}
          </Box>

          {/* Override Disk Size removed */}
        </Box>
      </Box>
    );
  };

  const renderComputeOfferingStep = () => {
    return (
      <Box>
        {/* Step Header */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h5" sx={{ fontWeight: 600, color: 'white', mb: 1 }}>
            {t('createInstance.step2')}
          </Typography>
          <Typography variant="body1" sx={{ color: 'white' }}>
            {t('createInstance.selectComputeOffering')}
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="body2" color="textSecondary">
            {t('createInstance.selectComputeOffering')}
          </Typography>
          <TextField
            size="small"
            placeholder="Search"
            InputProps={{
              endAdornment: <SearchIcon />
            }}
            sx={{ width: 200 }}
          />
        </Box>

        <Box sx={{ border: 1, borderColor: 'divider', borderRadius: 1 }}>
          {/* Table Header */}
          <Box sx={{ 
            display: 'grid', 
            gridTemplateColumns: '1fr 1fr 1fr', 
            p: 2, 
            bgcolor: 'grey.50',
            borderBottom: 1,
            borderColor: 'divider'
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <SettingsIcon />
              <Typography variant="subtitle2">{t('createInstance.computeOffering')}</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <SettingsIcon />
              <Typography variant="subtitle2">CPU</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <SettingsIcon />
              <Typography variant="subtitle2">Memory</Typography>
            </Box>
          </Box>

          {/* Table Rows */}
          <RadioGroup
            value={formData.computeOffering}
            onChange={(e) => setFormData({ ...formData, computeOffering: e.target.value })}
          >
            <Box sx={{ 
              display: 'grid', 
              gridTemplateColumns: '1fr 1fr 1fr', 
              p: 2,
              borderBottom: 1,
              borderColor: 'divider',
              bgcolor: formData.computeOffering === 'small' ? 'primary.50' : 'transparent'
            }}>
              <FormControlLabel
                value="small"
                control={<Radio />}
                label="Small Instance"
                sx={{ m: 0 }}
              />
              <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center' }}>
                1 CPU x 0.50 Ghz
              </Typography>
              <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center' }}>
                512 MB
              </Typography>
            </Box>

            <Box sx={{ 
              display: 'grid', 
              gridTemplateColumns: '1fr 1fr 1fr', 
              p: 2,
              borderBottom: 1,
              borderColor: 'divider',
              bgcolor: formData.computeOffering === 'medium' ? 'primary.50' : 'transparent'
            }}>
              <FormControlLabel
                value="medium"
                control={<Radio />}
                label="Medium Instance"
                sx={{ m: 0 }}
              />
              <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center' }}>
                1 CPU x 1.00 Ghz
              </Typography>
              <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center' }}>
                1024 MB
              </Typography>
            </Box>

            <Box sx={{ 
              display: 'grid', 
              gridTemplateColumns: '1fr 1fr 1fr', 
              p: 2,
              borderBottom: 1,
              borderColor: 'divider',
              bgcolor: formData.computeOffering === '4cpu-8gb' ? 'primary.50' : 'transparent'
            }}>
              <FormControlLabel
                value="4cpu-8gb"
                control={<Radio />}
                label="4CPU-8GB"
                sx={{ m: 0 }}
              />
              <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center' }}>
                4 CPU x 2.30 Ghz
              </Typography>
              <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center' }}>
                8192 MB
              </Typography>
            </Box>

            <Box sx={{ 
              display: 'grid', 
              gridTemplateColumns: '1fr 1fr 1fr', 
              p: 2,
              bgcolor: formData.computeOffering === '4cpu-8gb-nfs' ? 'primary.50' : 'transparent'
            }}>
              <FormControlLabel
                value="4cpu-8gb-nfs"
                control={<Radio />}
                label="4CPU - 8GB - NFS"
                sx={{ m: 0 }}
              />
              <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center' }}>
                4 CPU x 2.30 Ghz
              </Typography>
              <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center' }}>
                8192 MB
              </Typography>
            </Box>
          </RadioGroup>
        </Box>
      </Box>
    );
  };

  const renderOptionsStep = () => {
    return (
      <Box>
        <Box sx={{ mb: 4 }}>
          <Typography variant="h5" sx={{ fontWeight: 600, color: '#1e293b', mb: 1 }}>
            Choisissez vos options
          </Typography>
          <Typography variant="body1" color="textSecondary">
            Sélectionnez les options de sauvegarde pour votre VPS
          </Typography>
        </Box>

        {/* Information Banner */}
        <Box sx={{ 
          mb: 4, 
          p: 3, 
          bgcolor: '#dbeafe', 
          borderRadius: 2,
          border: '1px solid #93c5fd'
        }}>
          <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
            <Box sx={{ 
              width: 20, 
              height: 20, 
              borderRadius: '50%', 
              bgcolor: '#3b82f6', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              color: 'white',
              fontSize: '14px',
              fontWeight: 'bold'
            }}>
              i
            </Box>
            <Typography variant="body2" color="#1e40af">
              La sauvegarde automatique est une fonctionnalité incluse avec votre achat de VPS ! Ainsi, vos données sont protégées quotidiennement sans effort et peuvent être facilement restaurées en cas de problème.
            </Typography>
          </Box>
        </Box>

        {/* Backup Options */}
        <Box sx={{ display: 'grid', gap: 3 }}>
          {/* Option 1: Sauvegarde automatique Premium */}
          <Card variant="outlined" sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Checkbox
                checked={formData.premiumBackup}
                onChange={(e) => setFormData({ ...formData, premiumBackup: e.target.checked })}
              />
              <Box sx={{ flex: 1 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, color: '#1e40b2', mb: 1 }}>
                  Sauvegarde automatique Premium
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Votre sauvegarde personnalisée, avec une restauration roulante de 7 jours.
                </Typography>
              </Box>
            </Box>
          </Card>

          {/* Option 2: Snapshot backup */}
          <Card variant="outlined" sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Checkbox
                checked={formData.snapshotBackup}
                onChange={(e) => setFormData({ ...formData, snapshotBackup: e.target.checked })}
              />
              <Box sx={{ flex: 1 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, color: '#1e40b2', mb: 1 }}>
                  Snapshot backup
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Créez une image de votre serveur quand vous le souhaitez. Simple d'utilisation, il vous permet de restaurer et sécuriser rapidement votre VPS avant d'effectuer tout changement.
                </Typography>
              </Box>
            </Box>
          </Card>
        </Box>
      </Box>
    );
  };

  const renderVpsNameStep = () => {
    return (
      <Box>
        <Box sx={{ mb: 4 }}>
          <Typography variant="h5" sx={{ fontWeight: 600, color: 'white', mb: 1 }}>
            {t('createInstance.vpsName')}
          </Typography>
          <Typography variant="body1" sx={{ color: 'white' }}>
            {t('createInstance.configureVpsName')}
          </Typography>
        </Box>

        <Box sx={{ display: 'grid', gap: 3 }}>
          <TextField
            fullWidth
            label={t('createInstance.vpsName')}
            placeholder={t('createInstance.enterVpsName')}
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
          
          <FormControlLabel
            control={
              <Checkbox
                checked={formData.startInstance}
                onChange={(e) => setFormData({ ...formData, startInstance: e.target.checked })}
              />
            }
            label={t('createInstance.startInstanceAfterCreation')}
          />
        </Box>
      </Box>
    );
  };

  const renderDiskSizeStep = () => {
    return (
      <Box>
        <Box sx={{ mb: 4 }}>
          <Typography variant="h5" sx={{ fontWeight: 600, color: 'white', mb: 1 }}>
            {t('createInstance.step3')}
          </Typography>
          <Typography variant="body1" sx={{ color: 'white' }}>
            {t('createInstance.selectDiskSize')}
          </Typography>
        </Box>

        <FormControl component="fieldset">
          <RadioGroup
            value={formData.diskSize}
            onChange={(e) => setFormData({ ...formData, diskSize: e.target.value })}
          >
            <FormControlLabel value="10" control={<Radio />} label="10 GB" />
            <FormControlLabel value="20" control={<Radio />} label="20 GB" />
            <FormControlLabel value="50" control={<Radio />} label="50 GB" />
            <FormControlLabel value="100" control={<Radio />} label="100 GB" />
            <FormControlLabel value="custom" control={<Radio />} label={t('createInstance.customDiskSize')} />
          </RadioGroup>
        </FormControl>

        {formData.diskSize === 'custom' && (
          <TextField
            fullWidth
            label={t('createInstance.customDiskSize')}
            placeholder={t('createInstance.enterDiskSize')}
            sx={{ mt: 2 }}
          />
        )}
      </Box>
    );
  };





  const renderDetailsStep = () => {
    return (
      <Box>
        <Box sx={{ mb: 4 }}>
          <Typography variant="h5" sx={{ fontWeight: 600, color: 'white', mb: 1 }}>
            {t('createInstance.step6')}
          </Typography>
          <Typography variant="body1" sx={{ color: 'white' }}>
            {t('createInstance.configureFinalDetails')}
          </Typography>
        </Box>

        <Box sx={{ display: 'grid', gap: 3 }}>
          <TextField
            fullWidth
            label={t('createInstance.instanceName')}
            placeholder={t('createInstance.enterInstanceName')}
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
          
          <TextField
            fullWidth
            label={t('createInstance.instanceGroup')}
            placeholder={t('createInstance.enterGroupName')}
            value={formData.group}
            onChange={(e) => setFormData({ ...formData, group: e.target.value })}
          />
          
          <TextField
            fullWidth
            label={t('createInstance.keyboardLanguage')}
            select
            value={formData.keyboardLanguage}
            onChange={(e) => setFormData({ ...formData, keyboardLanguage: e.target.value })}
          >
            <MenuItem value="en">English</MenuItem>
            <MenuItem value="fr">Français</MenuItem>
            <MenuItem value="es">Español</MenuItem>
          </TextField>
          
          <FormControlLabel
            control={
              <Checkbox
                checked={formData.startInstance}
                onChange={(e) => setFormData({ ...formData, startInstance: e.target.checked })}
              />
            }
            label={t('createInstance.startInstanceAfterCreation')}
          />
        </Box>
      </Box>
    );
  };

  return (
    <Box sx={{ maxWidth: 1200, margin: '0 auto', p: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 4, textAlign: 'center' }}>
                 <Typography variant="h4" component="h1" sx={{ fontWeight: 600, color: 'white' }}>
           {t('createInstance.title')}
         </Typography>
         <Typography variant="body1" sx={{ mt: 1, color: 'white' }}>
           {t('createInstance.configureStepByStep')}
         </Typography>
      </Box>

      {/* Main Content */}
      <Box sx={{ display: 'flex', gap: 4 }}>
        {/* Left Side - Stepper */}
        <Box sx={{ flex: '0 0 300px' }}>
          <Paper sx={{ p: 3, position: 'sticky', top: 20 }}>
                         <Typography variant="h6" sx={{ mb: 3, fontWeight: 600, color: 'white' }}>
               {t('createInstance.configurationSteps')}
             </Typography>
                         <Stepper activeStep={activeStep} orientation="vertical">
               {steps.map((step, index) => (
                 <Step key={step.label}>
                   <StepLabel 
                     icon={step.icon}
                     onClick={() => setActiveStep(index)}
                     sx={{
                       cursor: 'pointer',
                       '& .MuiStepLabel-label': {
                         fontSize: '0.9rem',
                         fontWeight: activeStep === index ? 600 : 400
                       },
                       '&:hover': {
                         opacity: 0.7
                       }
                     }}
                   >
                     {step.label}
                   </StepLabel>
                 </Step>
               ))}
             </Stepper>
          </Paper>
        </Box>

        {/* Right Side - Content */}
        <Box sx={{ flex: 1 }}>
          <Paper sx={{ p: 4, minHeight: '600px' }}>
            {/* Step Content */}
            <Box sx={{ mb: 4 }}>
              {renderStepContent(activeStep)}
            </Box>

            {/* Navigation Buttons */}
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              pt: 3,
              borderTop: 1,
              borderColor: 'divider'
            }}>
                               <Button
                   disabled={activeStep === 0}
                   onClick={handleBack}
                   sx={{ minWidth: 100 }}
                 >
                   {t('common.back')}
                 </Button>
              
              <Box sx={{ display: 'flex', gap: 2 }}>
                                 <Typography variant="body2" color="textSecondary" sx={{ display: 'flex', alignItems: 'center' }}>
                   {t('createInstance.step')} {activeStep + 1} {t('createInstance.of')} {steps.length}
                 </Typography>
                 <Button
                   variant="contained"
                   onClick={activeStep === steps.length - 1 ? handleSubmit : handleNext}
                   sx={{ minWidth: 120 }}
                 >
                   {activeStep === steps.length - 1 
                     ? (isPartner() ? t('createInstance.launchVps') : t('createInstance.launchInstance'))
                     : t('common.next')
                   }
                 </Button>
              </Box>
            </Box>
          </Paper>
        </Box>
      </Box>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert severity={snackbar.severity as 'success' | 'error' | 'warning' | 'info'} onClose={() => setSnackbar({ ...snackbar, open: false })}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default CreateInstance;  