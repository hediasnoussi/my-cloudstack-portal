const cloudstackAPI = require('../cloudstack-api');

// Récupérer les statistiques du dashboard depuis CloudStack
const getDashboardStats = async (req, res) => {
  try {
    console.log('📊 Récupération des statistiques CloudStack...');
    
    const stats = await cloudstackAPI.getDashboardStats();
    
    console.log('✅ Statistiques récupérées:', stats);
    res.json(stats);
  } catch (error) {
    console.error('❌ Erreur lors de la récupération des statistiques:', error);
    res.status(500).json({ 
      error: 'Erreur lors de la récupération des statistiques CloudStack',
      details: error.message 
    });
  }
};

// Récupérer les domaines depuis CloudStack
const getCloudStackDomains = async (req, res) => {
  try {
    console.log('🌐 Récupération des domaines CloudStack...');
    
    const domains = await cloudstackAPI.getDomains();
    
    console.log(`✅ ${domains.length} domaines récupérés`);
    res.json(domains);
  } catch (error) {
    console.error('❌ Erreur lors de la récupération des domaines:', error);
    res.status(500).json({ 
      error: 'Erreur lors de la récupération des domaines CloudStack',
      details: error.message 
    });
  }
};

// Récupérer les comptes depuis CloudStack
const getCloudStackAccounts = async (req, res) => {
  try {
    console.log('🏦 Récupération des comptes CloudStack...');
    const accounts = await cloudstackAPI.getAccounts();
    
    // Transformer les données pour le frontend
    const transformedAccounts = accounts.map(account => ({
      id: account.id,
      name: account.name,
      accounttype: account.accounttype,
      domain: account.domain,
      domainid: account.domainid,
      state: account.state,
      created: account.created,
      primarynetworkid: account.primarynetworkid,
      networkdomain: account.networkdomain,
      defaultzoneid: account.defaultzoneid,
      user: account.user
    }));
    
    console.log(`✅ ${transformedAccounts.length} comptes récupérés`);
    res.json(transformedAccounts);
  } catch (error) {
    console.error('❌ Erreur lors de la récupération des comptes:', error);
    res.status(500).json({ 
      error: 'Erreur lors de la récupération des comptes CloudStack',
      details: error.message 
    });
  }
};

// Récupérer les projets depuis CloudStack
const getCloudStackProjects = async (req, res) => {
  try {
    console.log('📁 Récupération des projets CloudStack...');
    
    const projects = await cloudstackAPI.getProjects();
    
    console.log(`✅ ${projects.length} projets récupérés`);
    res.json(projects);
  } catch (error) {
    console.error('❌ Erreur lors de la récupération des projets:', error);
    res.status(500).json({ 
      error: 'Erreur lors de la récupération des projets CloudStack',
      details: error.message 
    });
  }
};

// Récupérer les instances depuis CloudStack
const getCloudStackVirtualMachines = async (req, res) => {
  try {
    console.log('🖥️ Récupération des instances CloudStack...');
    
    const vms = await cloudstackAPI.getVirtualMachines();
    
    console.log(`✅ ${vms.length} instances récupérées`);
    res.json(vms);
  } catch (error) {
    console.error('❌ Erreur lors de la récupération des instances:', error);
    res.status(500).json({ 
      error: 'Erreur lors de la récupération des instances CloudStack',
      details: error.message 
    });
  }
};

// Récupérer les volumes depuis CloudStack
const getCloudStackVolumes = async (req, res) => {
  try {
    console.log('💾 Récupération des volumes CloudStack...');
    
    const volumes = await cloudstackAPI.getVolumes();
    
    console.log(`✅ ${volumes.length} volumes récupérés`);
    res.json(volumes);
  } catch (error) {
    console.error('❌ Erreur lors de la récupération des volumes:', error);
    res.status(500).json({ 
      error: 'Erreur lors de la récupération des volumes CloudStack',
      details: error.message 
    });
  }
};

// Récupérer les réseaux depuis CloudStack
const getCloudStackNetworks = async (req, res) => {
  try {
    console.log('🌐 Récupération des réseaux CloudStack...');
    
    const networks = await cloudstackAPI.getNetworks();
    
    console.log(`✅ ${networks.length} réseaux récupérés`);
    res.json(networks);
  } catch (error) {
    console.error('❌ Erreur lors de la récupération des réseaux:', error);
    res.status(500).json({ 
      error: 'Erreur lors de la récupération des réseaux CloudStack',
      details: error.message 
    });
  }
};

// Récupérer les groupes de sécurité depuis CloudStack
const getCloudStackSecurityGroups = async (req, res) => {
  try {
    console.log('🔒 Récupération des groupes de sécurité CloudStack...');
    
    const securityGroups = await cloudstackAPI.getSecurityGroups();
    
    console.log(`✅ ${securityGroups.length} groupes de sécurité récupérés`);
    res.json(securityGroups);
  } catch (error) {
    console.error('❌ Erreur lors de la récupération des groupes de sécurité:', error);
    res.status(500).json({ 
      error: 'Erreur lors de la récupération des groupes de sécurité CloudStack',
      details: error.message 
    });
  }
};

// ===== NOUVELLES FONCTIONS POUR LA GESTION D'INSTANCES =====

// Récupérer les templates disponibles
const getCloudStackTemplates = async (req, res) => {
  try {
    console.log('📋 Récupération des templates CloudStack...');
    const templates = await cloudstackAPI.getTemplates();
    console.log(`✅ ${templates.length} templates récupérés`);
    res.json(templates);
  } catch (error) {
    console.error('❌ Erreur lors de la récupération des templates:', error);
    res.status(500).json({ 
      error: 'Erreur lors de la récupération des templates CloudStack',
      details: error.message 
    });
  }
};

// Récupérer les offres de service
const getCloudStackServiceOfferings = async (req, res) => {
  try {
    console.log('⚙️ Récupération des offres de service CloudStack...');
    const serviceOfferings = await cloudstackAPI.getServiceOfferings();
    console.log(`✅ ${serviceOfferings.length} offres de service récupérées`);
    res.json(serviceOfferings);
  } catch (error) {
    console.error('❌ Erreur lors de la récupération des offres de service:', error);
    res.status(500).json({ 
      error: 'Erreur lors de la récupération des offres de service CloudStack',
      details: error.message 
    });
  }
};

// Récupérer les zones
const getCloudStackZones = async (req, res) => {
  try {
    console.log('🌍 Récupération des zones CloudStack...');
    const zones = await cloudstackAPI.getZones();
    console.log(`✅ ${zones.length} zones récupérées`);
    res.json(zones);
  } catch (error) {
    console.error('❌ Erreur lors de la récupération des zones:', error);
    res.status(500).json({ 
      error: 'Erreur lors de la récupération des zones CloudStack',
      details: error.message 
    });
  }
};

// Déployer une nouvelle instance
const deployCloudStackVirtualMachine = async (req, res) => {
  try {
    console.log('🚀 Déploiement d\'une nouvelle instance CloudStack...');
    const { templateid, serviceofferingid, zoneid, name, displayname } = req.body;
    
    if (!templateid || !serviceofferingid || !zoneid) {
      return res.status(400).json({ 
        error: 'templateid, serviceofferingid et zoneid sont requis' 
      });
    }

    const result = await cloudstackAPI.deployVirtualMachine({
      templateid,
      serviceofferingid,
      zoneid,
      name,
      displayname
    });
    
    console.log('✅ Instance déployée avec succès');
    res.json(result);
  } catch (error) {
    console.error('❌ Erreur lors du déploiement de l\'instance:', error);
    res.status(500).json({ 
      error: 'Erreur lors du déploiement de l\'instance CloudStack',
      details: error.message 
    });
  }
};

// Démarrer une instance
const startCloudStackVirtualMachine = async (req, res) => {
  try {
    console.log('▶️ Démarrage de l\'instance CloudStack...');
    const { id } = req.params;
    
    if (!id) {
      return res.status(400).json({ error: 'ID de l\'instance requis' });
    }

    const result = await cloudstackAPI.startVirtualMachine(id);
    console.log('✅ Instance démarrée avec succès');
    res.json(result);
  } catch (error) {
    console.error('❌ Erreur lors du démarrage de l\'instance:', error);
    res.status(500).json({ 
      error: 'Erreur lors du démarrage de l\'instance CloudStack',
      details: error.message 
    });
  }
};

// Arrêter une instance
const stopCloudStackVirtualMachine = async (req, res) => {
  try {
    console.log('⏹️ Arrêt de l\'instance CloudStack...');
    const { id } = req.params;
    
    if (!id) {
      return res.status(400).json({ error: 'ID de l\'instance requis' });
    }

    const result = await cloudstackAPI.stopVirtualMachine(id);
    console.log('✅ Instance arrêtée avec succès');
    res.json(result);
  } catch (error) {
    console.error('❌ Erreur lors de l\'arrêt de l\'instance:', error);
    res.status(500).json({ 
      error: 'Erreur lors de l\'arrêt de l\'instance CloudStack',
      details: error.message 
    });
  }
};

// Redémarrer une instance
const rebootCloudStackVirtualMachine = async (req, res) => {
  try {
    console.log('🔄 Redémarrage de l\'instance CloudStack...');
    const { id } = req.params;
    
    if (!id) {
      return res.status(400).json({ error: 'ID de l\'instance requis' });
    }

    const result = await cloudstackAPI.rebootVirtualMachine(id);
    console.log('✅ Instance redémarrée avec succès');
    res.json(result);
  } catch (error) {
    console.error('❌ Erreur lors du redémarrage de l\'instance:', error);
    res.status(500).json({ 
      error: 'Erreur lors du redémarrage de l\'instance CloudStack',
      details: error.message 
    });
  }
};

// Supprimer une instance
const destroyCloudStackVirtualMachine = async (req, res) => {
  try {
    console.log('🗑️ Suppression de l\'instance CloudStack...');
    const { id } = req.params;
    
    if (!id) {
      return res.status(400).json({ error: 'ID de l\'instance requis' });
    }

    const result = await cloudstackAPI.destroyVirtualMachine(id);
    console.log('✅ Instance supprimée avec succès');
    res.json(result);
  } catch (error) {
    console.error('❌ Erreur lors de la suppression de l\'instance:', error);
    res.status(500).json({ 
      error: 'Erreur lors de la suppression de l\'instance CloudStack',
      details: error.message 
    });
  }
};

// Créer un nouveau template dans CloudStack
const createCloudStackTemplate = async (req, res) => {
  try {
    console.log('📦 Création d\'un nouveau template CloudStack...');
    const { 
      name, 
      displaytext, 
      format, 
      hypervisor, 
      ostypeid, 
      url, 
      zoneid,
      ispublic = true,
      isfeatured = false,
      isextractable = false,
      passwordenabled = false,
      sshkeyenabled = true
    } = req.body;
    
    if (!name || !displaytext || !format || !hypervisor || !ostypeid || !zoneid) {
      return res.status(400).json({ 
        error: 'Paramètres manquants: name, displaytext, format, hypervisor, ostypeid et zoneid sont requis' 
      });
    }

    const templateParams = {
      name,
      displaytext,
      format,
      hypervisor,
      ostypeid,
      url,
      zoneid,
      ispublic,
      isfeatured,
      isextractable,
      passwordenabled,
      sshkeyenabled
    };

    console.log('📋 Paramètres du template:', templateParams);
    
    const result = await cloudstackAPI.makeRequest('registerTemplate', templateParams);
    
    console.log('✅ Template créé avec succès');
    res.status(201).json({
      success: true,
      message: 'Template créé avec succès',
      template: result
    });
  } catch (error) {
    console.error('❌ Erreur lors de la création du template:', error);
    res.status(500).json({ 
      error: 'Erreur lors de la création du template CloudStack',
      details: error.message 
    });
  }
};

// Récupérer les types d'OS depuis CloudStack
const getCloudStackOsTypes = async (req, res) => {
  try {
    console.log('💻 Récupération des types d\'OS CloudStack...');
    
    const response = await cloudstackAPI.makeRequest('listOsTypes');
    const osTypes = response.listostypesresponse?.ostype || [];
    
    console.log(`✅ ${osTypes.length} types d'OS récupérés`);
    res.json({
      success: true,
      data: osTypes
    });
  } catch (error) {
    console.error('❌ Erreur lors de la récupération des types d\'OS:', error);
    res.status(500).json({ 
      success: false,
      error: 'Erreur lors de la récupération des types d\'OS CloudStack',
      details: error.message 
    });
  }
};

// ===== GESTION DES VOLUMES CLOUDSTACK =====

// Créer un volume dans CloudStack
const createCloudStackVolume = async (req, res) => {
  try {
    console.log('💾 Création d\'un nouveau volume CloudStack...');
    const { name, size, zoneid, diskofferingid } = req.body;
    
    if (!name || !size) {
      return res.status(400).json({ 
        error: 'name et size sont requis' 
      });
    }

    // Si aucun zoneid n'est fourni, récupérer la première zone disponible
    let finalZoneId = zoneid;
    if (!finalZoneId) {
      try {
        console.log('🔍 Récupération des zones disponibles...');
        const zones = await cloudstackAPI.getZones();
        if (zones && zones.length > 0) {
          finalZoneId = zones[0].id;
          console.log('✅ Zone sélectionnée:', finalZoneId);
        } else {
          throw new Error('Aucune zone disponible');
        }
      } catch (error) {
        console.error('❌ Erreur lors de la récupération des zones:', error);
        return res.status(400).json({ 
          error: 'Impossible de récupérer les zones',
          details: error.message 
        });
      }
    }

    // Si aucun diskofferingid n'est fourni, récupérer le premier disponible
    let finalDiskOfferingId = diskofferingid;
    if (!finalDiskOfferingId) {
      try {
        console.log('🔍 Récupération des disk offerings disponibles...');
        const diskOfferings = await cloudstackAPI.getDiskOfferings();
        if (diskOfferings && diskOfferings.length > 0) {
          // Chercher un disk offering qui permet des tailles personnalisées
          const customSizeOffering = diskOfferings.find(offering => 
            offering.iscustomized === true || offering.iscustomized === 'true'
          );
          
          if (customSizeOffering) {
            finalDiskOfferingId = customSizeOffering.id;
            console.log('✅ Disk offering avec taille personnalisée sélectionné:', finalDiskOfferingId);
          } else {
            // Si aucun n'a de taille personnalisée, prendre le premier
            finalDiskOfferingId = diskOfferings[0].id;
            console.log('⚠️ Aucun disk offering avec taille personnalisée trouvé, utilisation du premier:', finalDiskOfferingId);
          }
        } else {
          throw new Error('Aucun disk offering disponible');
        }
      } catch (error) {
        console.error('❌ Erreur lors de la récupération des disk offerings:', error);
        return res.status(400).json({ 
          error: 'Impossible de récupérer les disk offerings',
          details: error.message 
        });
      }
    }

    const result = await cloudstackAPI.createVolume({
      name,
      size,
      zoneid: finalZoneId,
      diskofferingid: finalDiskOfferingId
    });
    
    console.log('✅ Volume créé avec succès');
    res.status(201).json(result);
  } catch (error) {
    console.error('❌ Erreur lors de la création du volume:', error);
    res.status(500).json({ 
      error: 'Erreur lors de la création du volume CloudStack',
      details: error.message 
    });
  }
};

// Attacher un volume à une instance
const attachCloudStackVolume = async (req, res) => {
  try {
    console.log('🔗 Attachement d\'un volume CloudStack...');
    const { id } = req.params;
    const { vmId } = req.body;
    
    if (!id || !vmId) {
      return res.status(400).json({ error: 'ID du volume et vmId sont requis' });
    }

    const result = await cloudstackAPI.attachVolume(id, vmId);
    console.log('✅ Volume attaché avec succès');
    res.json(result);
  } catch (error) {
    console.error('❌ Erreur lors de l\'attachement du volume:', error);
    res.status(500).json({ 
      error: 'Erreur lors de l\'attachement du volume CloudStack',
      details: error.message 
    });
  }
};

// Détacher un volume
const detachCloudStackVolume = async (req, res) => {
  try {
    console.log('🔓 Détachement d\'un volume CloudStack...');
    const { id } = req.params;
    
    if (!id) {
      return res.status(400).json({ error: 'ID du volume requis' });
    }

    const result = await cloudstackAPI.detachVolume(id);
    console.log('✅ Volume détaché avec succès');
    res.json(result);
  } catch (error) {
    console.error('❌ Erreur lors du détachement du volume:', error);
    res.status(500).json({ 
      error: 'Erreur lors du détachement du volume CloudStack',
      details: error.message 
    });
  }
};

// Supprimer un volume
const deleteCloudStackVolume = async (req, res) => {
  try {
    console.log('🗑️ Suppression d\'un volume CloudStack...');
    const { id } = req.params;
    
    if (!id) {
      return res.status(400).json({ error: 'ID du volume requis' });
    }

    const result = await cloudstackAPI.deleteVolume(id);
    console.log('✅ Volume supprimé avec succès');
    res.json(result);
  } catch (error) {
    console.error('❌ Erreur lors de la suppression du volume:', error);
    res.status(500).json({ 
      error: 'Erreur lors de la suppression du volume CloudStack',
      details: error.message 
    });
  }
};

// ===== GESTION DES SNAPSHOTS CLOUDSTACK =====

// Récupérer les snapshots CloudStack
const getCloudStackSnapshots = async (req, res) => {
  try {
    console.log('📸 Récupération des snapshots CloudStack...');
    const snapshots = await cloudstackAPI.getSnapshots();
    
    // Transformer les données pour le frontend
    const transformedSnapshots = snapshots.map(snapshot => ({
      id: snapshot.id,
      name: snapshot.name,
      description: snapshot.description || '',
      volumeId: snapshot.volumeid,
      volumeName: snapshot.volumename || '',
      state: snapshot.state,
      created: snapshot.created,
      size: snapshot.size,
      type: snapshot.snapshottype || 'MANUAL',
      zoneId: snapshot.zoneid,
      zoneName: snapshot.zonename || ''
    }));
    
    console.log(`✅ ${transformedSnapshots.length} snapshots récupérés`);
    res.json(transformedSnapshots);
  } catch (error) {
    console.error('❌ Erreur lors de la récupération des snapshots:', error);
    res.status(500).json({ 
      error: 'Erreur lors de la récupération des snapshots CloudStack',
      details: error.message 
    });
  }
};

// Créer un snapshot dans CloudStack
const createCloudStackSnapshot = async (req, res) => {
  try {
    console.log('📸 Création d\'un nouveau snapshot CloudStack...');
    const { volumeid, name, description } = req.body;
    
    if (!volumeid) {
      return res.status(400).json({ 
        error: 'volumeid est requis' 
      });
    }

    const result = await cloudstackAPI.createSnapshot({
      volumeid,
      name: name || `snapshot-${Date.now()}`,
      description: description || ''
    });
    
    console.log('✅ Snapshot créé avec succès');
    res.status(201).json(result);
  } catch (error) {
    console.error('❌ Erreur lors de la création du snapshot:', error);
    res.status(500).json({ 
      error: 'Erreur lors de la création du snapshot CloudStack',
      details: error.message 
    });
  }
};

// Supprimer un snapshot
const deleteCloudStackSnapshot = async (req, res) => {
  try {
    console.log('🗑️ Suppression d\'un snapshot CloudStack...');
    const { id } = req.params;
    
    if (!id) {
      return res.status(400).json({ error: 'ID du snapshot requis' });
    }

    const result = await cloudstackAPI.deleteSnapshot(id);
    console.log('✅ Snapshot supprimé avec succès');
    res.json(result);
  } catch (error) {
    console.error('❌ Erreur lors de la suppression du snapshot:', error);
    res.status(500).json({ 
      error: 'Erreur lors de la suppression du snapshot CloudStack',
      details: error.message 
    });
  }
};

// Restaurer un snapshot
const revertCloudStackSnapshot = async (req, res) => {
  try {
    console.log('🔄 Restauration d\'un snapshot CloudStack...');
    const { id } = req.params;
    
    if (!id) {
      return res.status(400).json({ error: 'ID du snapshot requis' });
    }

    const result = await cloudstackAPI.revertSnapshot(id);
    console.log('✅ Snapshot restauré avec succès');
    res.json(result);
  } catch (error) {
    console.error('❌ Erreur lors de la restauration du snapshot:', error);
    res.status(500).json({ 
      error: 'Erreur lors de la restauration du snapshot CloudStack',
      details: error.message 
    });
  }
};

// ===== GESTION DES GROUPES D'INSTANCES CLOUDSTACK =====

// Récupérer les groupes d'instances CloudStack
const getCloudStackInstanceGroups = async (req, res) => {
  try {
    console.log('👥 Récupération des groupes d\'instances CloudStack...');
    const instanceGroups = await cloudstackAPI.getInstanceGroups();
    
    // Transformer les données pour le frontend
    const transformedGroups = instanceGroups.map(group => ({
      id: group.id,
      name: group.name,
      account: group.account,
      domain: group.domain,
      domainid: group.domainid,
      created: group.created,
      state: group.state || 'Active',
      virtualMachineIds: group.virtualmachineids || [],
      virtualMachineCount: group.virtualmachinecount || 0
    }));
    
    console.log(`✅ ${transformedGroups.length} groupes d'instances récupérés`);
    res.json(transformedGroups);
  } catch (error) {
    console.error('❌ Erreur lors de la récupération des groupes d\'instances:', error);
    res.status(500).json({ 
      error: 'Erreur lors de la récupération des groupes d\'instances CloudStack',
      details: error.message 
    });
  }
};

// Créer un groupe d'instances dans CloudStack
const createCloudStackInstanceGroup = async (req, res) => {
  try {
    console.log('👥 Création d\'un nouveau groupe d\'instances CloudStack...');
    const { name, account, domainid } = req.body;
    
    if (!name) {
      return res.status(400).json({ 
        error: 'name est requis' 
      });
    }

    const result = await cloudstackAPI.createInstanceGroup({
      name,
      account: account || 'admin',
      domainid: domainid || 'b4dc6fd1-820c-11f0-b443-0050568aa465' // ROOT domain
    });
    
    console.log('✅ Groupe d\'instances créé avec succès');
    res.status(201).json(result);
  } catch (error) {
    console.error('❌ Erreur lors de la création du groupe d\'instances:', error);
    res.status(500).json({ 
      error: 'Erreur lors de la création du groupe d\'instances CloudStack',
      details: error.message 
    });
  }
};

// Supprimer un groupe d'instances
const deleteCloudStackInstanceGroup = async (req, res) => {
  try {
    console.log('🗑️ Suppression d\'un groupe d\'instances CloudStack...');
    const { id } = req.params;
    
    if (!id) {
      return res.status(400).json({ error: 'ID du groupe d\'instances requis' });
    }

    const result = await cloudstackAPI.deleteInstanceGroup(id);
    console.log('✅ Groupe d\'instances supprimé avec succès');
    res.json(result);
  } catch (error) {
    console.error('❌ Erreur lors de la suppression du groupe d\'instances:', error);
    res.status(500).json({ 
      error: 'Erreur lors de la suppression du groupe d\'instances CloudStack',
      details: error.message 
    });
  }
};

// Mettre à jour un groupe d'instances
const updateCloudStackInstanceGroup = async (req, res) => {
  try {
    console.log('✏️ Mise à jour d\'un groupe d\'instances CloudStack...');
    const { id } = req.params;
    const { name } = req.body;
    
    if (!id || !name) {
      return res.status(400).json({ error: 'ID et name sont requis' });
    }

    const result = await cloudstackAPI.updateInstanceGroup({
      id,
      name
    });
    console.log('✅ Groupe d\'instances mis à jour avec succès');
    res.json(result);
  } catch (error) {
    console.error('❌ Erreur lors de la mise à jour du groupe d\'instances:', error);
    res.status(500).json({ 
      error: 'Erreur lors de la mise à jour du groupe d\'instances CloudStack',
      details: error.message 
    });
  }
};

// ===== GESTION DES CLÉS SSH CLOUDSTACK =====

// Récupérer les clés SSH CloudStack
const getCloudStackSSHKeyPairs = async (req, res) => {
  try {
    console.log('🔑 Récupération des clés SSH CloudStack...');
    const sshKeyPairs = await cloudstackAPI.getSSHKeyPairs();
    
    // Transformer les données pour le frontend
    const transformedKeys = sshKeyPairs.map(key => ({
      id: key.id,
      name: key.name,
      fingerprint: key.fingerprint,
      privatekey: key.privatekey,
      account: key.account,
      domain: key.domain,
      domainid: key.domainid,
      created: key.created,
      state: key.state || 'Active'
    }));
    
    console.log(`✅ ${transformedKeys.length} clés SSH récupérées`);
    res.json(transformedKeys);
  } catch (error) {
    console.error('❌ Erreur lors de la récupération des clés SSH:', error);
    res.status(500).json({ 
      error: 'Erreur lors de la récupération des clés SSH CloudStack',
      details: error.message 
    });
  }
};

// Créer une paire de clés SSH dans CloudStack
const createCloudStackSSHKeyPair = async (req, res) => {
  try {
    console.log('🔑 Création d\'une nouvelle paire de clés SSH CloudStack...');
    const { name, account, domainid } = req.body;
    
    if (!name) {
      return res.status(400).json({ 
        error: 'name est requis' 
      });
    }

    const result = await cloudstackAPI.createSSHKeyPair({
      name,
      account: account || 'admin',
      domainid: domainid || 'b4dc6fd1-820c-11f0-b443-0050568aa465' // ROOT domain
    });
    
    console.log('✅ Paire de clés SSH créée avec succès');
    res.status(201).json(result);
  } catch (error) {
    console.error('❌ Erreur lors de la création de la paire de clés SSH:', error);
    res.status(500).json({ 
      error: 'Erreur lors de la création de la paire de clés SSH CloudStack',
      details: error.message 
    });
  }
};

// Supprimer une paire de clés SSH
const deleteCloudStackSSHKeyPair = async (req, res) => {
  try {
    console.log('🗑️ Suppression d\'une paire de clés SSH CloudStack...');
    const { name } = req.params;
    
    if (!name) {
      return res.status(400).json({ error: 'Nom de la clé SSH requis' });
    }

    const result = await cloudstackAPI.deleteSSHKeyPair(name);
    console.log('✅ Paire de clés SSH supprimée avec succès');
    res.json(result);
  } catch (error) {
    console.error('❌ Erreur lors de la suppression de la paire de clés SSH:', error);
    res.status(500).json({ 
      error: 'Erreur lors de la suppression de la paire de clés SSH CloudStack',
      details: error.message 
    });
  }
};

// Importer une paire de clés SSH
const registerCloudStackSSHKeyPair = async (req, res) => {
  try {
    console.log('📥 Import d\'une paire de clés SSH CloudStack...');
    const { name, publickey, account, domainid } = req.body;
    
    if (!name || !publickey) {
      return res.status(400).json({ 
        error: 'name et publickey sont requis' 
      });
    }

    const result = await cloudstackAPI.registerSSHKeyPair({
      name,
      publickey,
      account: account || 'admin',
      domainid: domainid || 'b4dc6fd1-820c-11f0-b443-0050568aa465' // ROOT domain
    });
    
    console.log('✅ Paire de clés SSH importée avec succès');
    res.status(201).json(result);
  } catch (error) {
    console.error('❌ Erreur lors de l\'import de la paire de clés SSH:', error);
    res.status(500).json({ 
      error: 'Erreur lors de l\'import de la paire de clés SSH CloudStack',
      details: error.message 
    });
  }
};

// ===== GESTION DES UTILISATEURS CLOUDSTACK =====

// Récupérer les utilisateurs CloudStack
const getCloudStackUsers = async (req, res) => {
  try {
    console.log('👥 Récupération des utilisateurs CloudStack...');
    const users = await cloudstackAPI.getUsers();
    
    // Transformer les données pour le frontend
    const transformedUsers = users.map(user => ({
      id: user.id,
      username: user.username,
      firstname: user.firstname,
      lastname: user.lastname,
      email: user.email,
      account: user.account,
      accounttype: user.accounttype,
      domain: user.domain,
      domainid: user.domainid,
      state: user.state,
      created: user.created,
      lastlogin: user.lastlogin,
      apikey: user.apikey,
      secretkey: user.secretkey
    }));
    
    console.log(`✅ ${transformedUsers.length} utilisateurs récupérés`);
    res.json(transformedUsers);
  } catch (error) {
    console.error('❌ Erreur lors de la récupération des utilisateurs:', error);
    res.status(500).json({ 
      error: 'Erreur lors de la récupération des utilisateurs CloudStack',
      details: error.message 
    });
  }
};

// Créer un utilisateur dans CloudStack
const createCloudStackUser = async (req, res) => {
  try {
    console.log('👤 Création d\'un nouvel utilisateur CloudStack...');
    const { username, password, firstname, lastname, email, account, domainid } = req.body;
    
    if (!username || !password || !firstname || !lastname || !email) {
      return res.status(400).json({ 
        error: 'username, password, firstname, lastname et email sont requis' 
      });
    }

    const result = await cloudstackAPI.createUser({
      username,
      password,
      firstname,
      lastname,
      email,
      account: account || 'admin',
      domainid: domainid || 'b4dc6fd1-820c-11f0-b443-0050568aa465' // ROOT domain
    });
    
    console.log('✅ Utilisateur créé avec succès');
    res.status(201).json(result);
  } catch (error) {
    console.error('❌ Erreur lors de la création de l\'utilisateur:', error);
    res.status(500).json({ 
      error: 'Erreur lors de la création de l\'utilisateur CloudStack',
      details: error.message 
    });
  }
};

// Supprimer un utilisateur
const deleteCloudStackUser = async (req, res) => {
  try {
    console.log('🗑️ Suppression d\'un utilisateur CloudStack...');
    const { id } = req.params;
    
    if (!id) {
      return res.status(400).json({ error: 'ID utilisateur requis' });
    }

    const result = await cloudstackAPI.deleteUser(id);
    console.log('✅ Utilisateur supprimé avec succès');
    res.json(result);
  } catch (error) {
    console.error('❌ Erreur lors de la suppression de l\'utilisateur:', error);
    res.status(500).json({ 
      error: 'Erreur lors de la suppression de l\'utilisateur CloudStack',
      details: error.message 
    });
  }
};

// Mettre à jour un utilisateur
const updateCloudStackUser = async (req, res) => {
  try {
    console.log('✏️ Mise à jour d\'un utilisateur CloudStack...');
    const { id } = req.params;
    const { firstname, lastname, email } = req.body;
    
    if (!id) {
      return res.status(400).json({ error: 'ID utilisateur requis' });
    }

    const result = await cloudstackAPI.updateUser({
      id,
      firstname,
      lastname,
      email
    });
    console.log('✅ Utilisateur mis à jour avec succès');
    res.json(result);
  } catch (error) {
    console.error('❌ Erreur lors de la mise à jour de l\'utilisateur:', error);
    res.status(500).json({ 
      error: 'Erreur lors de la mise à jour de l\'utilisateur CloudStack',
      details: error.message 
    });
  }
};

// Activer/Désactiver un utilisateur
const updateCloudStackUserStatus = async (req, res) => {
  try {
    console.log('🔄 Mise à jour du statut d\'un utilisateur CloudStack...');
    const { id } = req.params;
    const { enabled } = req.body;
    
    if (!id) {
      return res.status(400).json({ error: 'ID utilisateur requis' });
    }

    const result = await cloudstackAPI.updateUserStatus({
      id,
      enabled: enabled ? 'true' : 'false'
    });
    console.log('✅ Statut utilisateur mis à jour avec succès');
    res.json(result);
  } catch (error) {
    console.error('❌ Erreur lors de la mise à jour du statut utilisateur:', error);
    res.status(500).json({ 
      error: 'Erreur lors de la mise à jour du statut utilisateur CloudStack',
      details: error.message 
    });
  }
};

// Créer un compte dans CloudStack
const createCloudStackAccount = async (req, res) => {
  try {
    console.log('🏦 Création d\'un nouveau compte CloudStack...');
    const { username, password, firstname, lastname, email, accounttype, domainid } = req.body;
    
    if (!username || !password || !firstname || !lastname || !email) {
      return res.status(400).json({ 
        error: 'username, password, firstname, lastname et email sont requis' 
      });
    }

    const result = await cloudstackAPI.createAccount({
      username,
      password,
      firstname,
      lastname,
      email,
      accounttype: accounttype || 0, // 0 = User, 1 = Admin, 2 = Domain Admin
      domainid: domainid || 'b4dc6fd1-820c-11f0-b443-0050568aa465' // ROOT domain
    });
    
    console.log('✅ Compte créé avec succès');
    res.status(201).json(result);
  } catch (error) {
    console.error('❌ Erreur lors de la création du compte:', error);
    res.status(500).json({ 
      error: 'Erreur lors de la création du compte CloudStack',
      details: error.message 
    });
  }
};

// Supprimer un compte
const deleteCloudStackAccount = async (req, res) => {
  try {
    console.log('🗑️ Suppression d\'un compte CloudStack...');
    const { id } = req.params;
    
    if (!id) {
      return res.status(400).json({ error: 'ID compte requis' });
    }

    const result = await cloudstackAPI.deleteAccount(id);
    console.log('✅ Compte supprimé avec succès');
    res.json(result);
  } catch (error) {
    console.error('❌ Erreur lors de la suppression du compte:', error);
    res.status(500).json({ 
      error: 'Erreur lors de la suppression du compte CloudStack',
      details: error.message 
    });
  }
};

// ===== GESTION DES USER DATA CLOUDSTACK =====

// Récupérer les user data CloudStack
const getCloudStackUserData = async (req, res) => {
  try {
    console.log('📄 Récupération des user data CloudStack...');
    
    // Récupérer les user data depuis les instances
    const instancesWithUserData = await cloudstackAPI.getUserDataFromInstances();
    
    // Récupérer les user data depuis les templates
    const templatesWithUserData = await cloudstackAPI.getUserDataFromTemplates();
    
    // Combiner et transformer les données
    const allUserData = [
      ...instancesWithUserData.map(item => ({
        ...item,
        type: 'Instance',
        source: 'instance'
      })),
      ...templatesWithUserData.map(item => ({
        ...item,
        type: 'Template',
        source: 'template'
      }))
    ];
    
    console.log(`✅ ${allUserData.length} user data récupérés`);
    res.json(allUserData);
  } catch (error) {
    console.error('❌ Erreur lors de la récupération des user data:', error);
    res.status(500).json({ 
      error: 'Erreur lors de la récupération des user data CloudStack',
      details: error.message 
    });
  }
};

// Créer un template avec user data dans CloudStack
const createCloudStackUserDataTemplate = async (req, res) => {
  try {
    console.log('📄 Création d\'un template avec user data CloudStack...');
    const { name, displaytext, ostypeid, userdata, account, domainid } = req.body;
    
    if (!name || !displaytext || !ostypeid) {
      return res.status(400).json({ 
        error: 'name, displaytext et ostypeid sont requis' 
      });
    }

    const result = await cloudstackAPI.createTemplateWithUserData({
      name,
      displaytext,
      ostypeid,
      userdata: userdata || '',
      account: account || 'admin',
      domainid: domainid || 'b4dc6fd1-820c-11f0-b443-0050568aa465' // ROOT domain
    });
    
    console.log('✅ Template avec user data créé avec succès');
    res.status(201).json(result);
  } catch (error) {
    console.error('❌ Erreur lors de la création du template avec user data:', error);
    res.status(500).json({ 
      error: 'Erreur lors de la création du template avec user data CloudStack',
      details: error.message 
    });
  }
};

// Mettre à jour un template avec user data
const updateCloudStackUserDataTemplate = async (req, res) => {
  try {
    console.log('✏️ Mise à jour d\'un template avec user data CloudStack...');
    const { id } = req.params;
    const { displaytext, userdata } = req.body;
    
    if (!id) {
      return res.status(400).json({ error: 'ID template requis' });
    }

    const result = await cloudstackAPI.updateTemplateWithUserData({
      id,
      displaytext,
      userdata
    });
    console.log('✅ Template avec user data mis à jour avec succès');
    res.json(result);
  } catch (error) {
    console.error('❌ Erreur lors de la mise à jour du template avec user data:', error);
    res.status(500).json({ 
      error: 'Erreur lors de la mise à jour du template avec user data CloudStack',
      details: error.message 
    });
  }
};

// Supprimer un template avec user data
const deleteCloudStackUserDataTemplate = async (req, res) => {
  try {
    console.log('🗑️ Suppression d\'un template avec user data CloudStack...');
    const { id } = req.params;
    
    if (!id) {
      return res.status(400).json({ error: 'ID template requis' });
    }

    const result = await cloudstackAPI.deleteTemplate(id);
    console.log('✅ Template avec user data supprimé avec succès');
    res.json(result);
  } catch (error) {
    console.error('❌ Erreur lors de la suppression du template avec user data:', error);
    res.status(500).json({ 
      error: 'Erreur lors de la suppression du template avec user data CloudStack',
      details: error.message 
    });
  }
};

// Récupérer les OS types CloudStack
const getCloudStackOSTypes = async (req, res) => {
  try {
    console.log('🖥️ Récupération des OS types CloudStack...');
    const osTypes = await cloudstackAPI.getOSTypes();
    
    // Transformer les données pour le frontend
    const transformedOSTypes = osTypes.map(os => ({
      id: os.id,
      description: os.description,
      oscategoryid: os.oscategoryid,
      oscategoryname: os.oscategoryname
    }));
    
    console.log(`✅ ${transformedOSTypes.length} OS types récupérés`);
    res.json(transformedOSTypes);
  } catch (error) {
    console.error('❌ Erreur lors de la récupération des OS types:', error);
    res.status(500).json({ 
      error: 'Erreur lors de la récupération des OS types CloudStack',
      details: error.message 
    });
  }
};

// ===== GESTION DES RÉSEAUX CLOUDSTACK =====

// Créer un réseau dans CloudStack
const createCloudStackNetwork = async (req, res) => {
  try {
    console.log('🌐 Création d\'un nouveau réseau CloudStack...');
    const { name, displaytext, zoneid, networkofferingid } = req.body;
    
    if (!name || !displaytext || !zoneid || !networkofferingid) {
      return res.status(400).json({ 
        error: 'name, displaytext, zoneid et networkofferingid sont requis' 
      });
    }

    const result = await cloudstackAPI.createNetwork({
      name,
      displaytext,
      zoneid,
      networkofferingid
    });
    
    console.log('✅ Réseau créé avec succès');
    res.status(201).json(result);
  } catch (error) {
    console.error('❌ Erreur lors de la création du réseau:', error);
    res.status(500).json({ 
      error: 'Erreur lors de la création du réseau CloudStack',
      details: error.message 
    });
  }
};

// Supprimer un réseau
const deleteCloudStackNetwork = async (req, res) => {
  try {
    console.log('🗑️ Suppression d\'un réseau CloudStack...');
    const { id } = req.params;
    
    if (!id) {
      return res.status(400).json({ error: 'ID du réseau requis' });
    }

    const result = await cloudstackAPI.deleteNetwork(id);
    console.log('✅ Réseau supprimé avec succès');
    res.json(result);
  } catch (error) {
    console.error('❌ Erreur lors de la suppression du réseau:', error);
    res.status(500).json({ 
      error: 'Erreur lors de la suppression du réseau CloudStack',
      details: error.message 
    });
  }
};

// ===== GESTION DES GROUPES DE SÉCURITÉ CLOUDSTACK =====

// Créer un groupe de sécurité dans CloudStack
const createCloudStackSecurityGroup = async (req, res) => {
  try {
    console.log('🛡️ Création d\'un nouveau groupe de sécurité CloudStack...');
    const { name, description } = req.body;
    
    if (!name) {
      return res.status(400).json({ 
        error: 'name est requis' 
      });
    }

    const result = await cloudstackAPI.createSecurityGroup({
      name,
      description: description || name
    });
    
    console.log('✅ Groupe de sécurité créé avec succès');
    res.status(201).json(result);
  } catch (error) {
    console.error('❌ Erreur lors de la création du groupe de sécurité:', error);
    res.status(500).json({ 
      error: 'Erreur lors de la création du groupe de sécurité CloudStack',
      details: error.message 
    });
  }
};

// Supprimer un groupe de sécurité
const deleteCloudStackSecurityGroup = async (req, res) => {
  try {
    console.log('🗑️ Suppression d\'un groupe de sécurité CloudStack...');
    const { id } = req.params;
    
    if (!id) {
      return res.status(400).json({ error: 'ID du groupe de sécurité requis' });
    }

    const result = await cloudstackAPI.deleteSecurityGroup(id);
    console.log('✅ Groupe de sécurité supprimé avec succès');
    res.json(result);
  } catch (error) {
    console.error('❌ Erreur lors de la suppression du groupe de sécurité:', error);
    res.status(500).json({ 
      error: 'Erreur lors de la suppression du groupe de sécurité CloudStack',
      details: error.message 
    });
  }
};

// ===== GESTION DES VPC CLOUDSTACK =====

// Récupérer les VPC CloudStack
const getCloudStackVPCs = async (req, res) => {
  try {
    console.log('🏗️ Récupération des VPC CloudStack...');
    const vpcs = await cloudstackAPI.getVPCs();
    console.log(`✅ ${vpcs.length} VPC récupérés`);
    res.json(vpcs);
  } catch (error) {
    console.error('❌ Erreur lors de la récupération des VPC:', error);
    res.status(500).json({ error: error.message });
  }
};

// Créer un VPC CloudStack
const createCloudStackVPC = async (req, res) => {
  try {
    console.log('🏗️ Création du VPC CloudStack:', req.body);
    const vpc = await cloudstackAPI.createVPC(req.body);
    console.log('✅ VPC créé avec succès');
    res.json(vpc);
  } catch (error) {
    console.error('❌ Erreur lors de la création du VPC:', error);
    res.status(500).json({ error: error.message });
  }
};

// Supprimer un VPC CloudStack
const deleteCloudStackVPC = async (req, res) => {
  try {
    const { id } = req.params;
    console.log('🗑️ Suppression du VPC CloudStack:', id);
    const result = await cloudstackAPI.deleteVPC(id);
    console.log('✅ VPC supprimé avec succès');
    res.json(result);
  } catch (error) {
    console.error('❌ Erreur lors de la suppression du VPC:', error);
    res.status(500).json({ error: error.message });
  }
};

// Mettre à jour un VPC CloudStack
const updateCloudStackVPC = async (req, res) => {
  try {
    const { id } = req.params;
    console.log('✏️ Mise à jour du VPC CloudStack:', id);
    const vpc = await cloudstackAPI.updateVPC(id, req.body);
    console.log('✅ VPC mis à jour avec succès');
    res.json(vpc);
  } catch (error) {
    console.error('❌ Erreur lors de la mise à jour du VPC:', error);
    res.status(500).json({ error: error.message });
  }
};

// ===== GESTION DES IP PUBLIQUES CLOUDSTACK =====

// Récupérer les IP publiques CloudStack
const getCloudStackPublicIPs = async (req, res) => {
  try {
    console.log('🌐 Récupération des IP publiques CloudStack...');
    const publicIPs = await cloudstackAPI.getPublicIPs();
    console.log(`✅ ${publicIPs.length} IP publiques récupérées`);
    res.json(publicIPs);
  } catch (error) {
    console.error('❌ Erreur lors de la récupération des IP publiques:', error);
    res.status(500).json({ error: error.message });
  }
};

// Associer une IP publique CloudStack
const associateCloudStackPublicIP = async (req, res) => {
  try {
    console.log('🔗 Association de l\'IP publique CloudStack:', req.body);
    const publicIP = await cloudstackAPI.associatePublicIP(req.body);
    console.log('✅ IP publique associée avec succès');
    res.json(publicIP);
  } catch (error) {
    console.error('❌ Erreur lors de l\'association de l\'IP publique:', error);
    res.status(500).json({ error: error.message });
  }
};

// Dissocier une IP publique CloudStack
const disassociateCloudStackPublicIP = async (req, res) => {
  try {
    const { id } = req.params;
    console.log('🔓 Dissociation de l\'IP publique CloudStack:', id);
    const result = await cloudstackAPI.disassociatePublicIP(id);
    console.log('✅ IP publique dissociée avec succès');
    res.json(result);
  } catch (error) {
    console.error('❌ Erreur lors de la dissociation de l\'IP publique:', error);
    res.status(500).json({ error: error.message });
  }
};

// Libérer une IP publique CloudStack
const releaseCloudStackPublicIP = async (req, res) => {
  try {
    const { id } = req.params;
    console.log('🗑️ Libération de l\'IP publique CloudStack:', id);
    const result = await cloudstackAPI.releasePublicIP(id);
    console.log('✅ IP publique libérée avec succès');
    res.json(result);
  } catch (error) {
    console.error('❌ Erreur lors de la libération de l\'IP publique:', error);
    res.status(500).json({ error: error.message });
  }
};

// ===== GESTION DES RÉSEAUX AVANCÉE CLOUDSTACK =====

// Récupérer les réseaux détaillés CloudStack
const getCloudStackNetworksDetailed = async (req, res) => {
  try {
    console.log('🌐 Récupération des réseaux détaillés CloudStack...');
    const networks = await cloudstackAPI.getNetworksDetailed();
    console.log(`✅ ${networks.length} réseaux récupérés`);
    res.json(networks);
  } catch (error) {
    console.error('❌ Erreur lors de la récupération des réseaux:', error);
    res.status(500).json({ error: error.message });
  }
};

// Créer un réseau isolé CloudStack
const createCloudStackIsolatedNetwork = async (req, res) => {
  try {
    console.log('🌐 Création du réseau isolé CloudStack:', req.body);
    const network = await cloudstackAPI.createIsolatedNetwork(req.body);
    console.log('✅ Réseau isolé créé avec succès');
    res.json(network);
  } catch (error) {
    console.error('❌ Erreur lors de la création du réseau isolé:', error);
    res.status(500).json({ error: error.message });
  }
};

// Créer un réseau partagé CloudStack
const createCloudStackSharedNetwork = async (req, res) => {
  try {
    console.log('🌐 Création du réseau partagé CloudStack:', req.body);
    const network = await cloudstackAPI.createSharedNetwork(req.body);
    console.log('✅ Réseau partagé créé avec succès');
    res.json(network);
  } catch (error) {
    console.error('❌ Erreur lors de la création du réseau partagé:', error);
    res.status(500).json({ error: error.message });
  }
};

// Mettre à jour un réseau CloudStack
const updateCloudStackNetwork = async (req, res) => {
  try {
    const { id } = req.params;
    console.log('✏️ Mise à jour du réseau CloudStack:', id);
    const network = await cloudstackAPI.updateNetwork(id, req.body);
    console.log('✅ Réseau mis à jour avec succès');
    res.json(network);
  } catch (error) {
    console.error('❌ Erreur lors de la mise à jour du réseau:', error);
    res.status(500).json({ error: error.message });
  }
};

// ===== GESTION DES ACL CLOUDSTACK =====

// Récupérer les ACL CloudStack
const getCloudStackNetworkACLs = async (req, res) => {
  try {
    console.log('🔒 Récupération des ACL CloudStack...');
    const acls = await cloudstackAPI.getNetworkACLs();
    console.log(`✅ ${acls.length} ACL récupérées`);
    res.json(acls);
  } catch (error) {
    console.error('❌ Erreur lors de la récupération des ACL:', error);
    res.status(500).json({ error: error.message });
  }
};

// Créer une ACL CloudStack
const createCloudStackNetworkACL = async (req, res) => {
  try {
    console.log('🔒 Création de l\'ACL CloudStack:', req.body);
    const acl = await cloudstackAPI.createNetworkACL(req.body);
    console.log('✅ ACL créée avec succès');
    res.json(acl);
  } catch (error) {
    console.error('❌ Erreur lors de la création de l\'ACL:', error);
    res.status(500).json({ error: error.message });
  }
};

// Supprimer une ACL CloudStack
const deleteCloudStackNetworkACL = async (req, res) => {
  try {
    const { id } = req.params;
    console.log('🗑️ Suppression de l\'ACL CloudStack:', id);
    const result = await cloudstackAPI.deleteNetworkACL(id);
    console.log('✅ ACL supprimée avec succès');
    res.json(result);
  } catch (error) {
    console.error('❌ Erreur lors de la suppression de l\'ACL:', error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getDashboardStats,
  getCloudStackDomains,
  getCloudStackAccounts,
  getCloudStackProjects,
  getCloudStackVirtualMachines,
  getCloudStackVolumes,
  getCloudStackNetworks,
  getCloudStackSecurityGroups,
  // Nouvelles fonctions
  getCloudStackTemplates,
  getCloudStackServiceOfferings,
  getCloudStackZones,
  deployCloudStackVirtualMachine,
  startCloudStackVirtualMachine,
  stopCloudStackVirtualMachine,
  rebootCloudStackVirtualMachine,
  destroyCloudStackVirtualMachine,
  createCloudStackTemplate,
  getCloudStackOsTypes,
  // Gestion des volumes
  createCloudStackVolume,
  attachCloudStackVolume,
  detachCloudStackVolume,
  deleteCloudStackVolume,
  // Gestion des snapshots
  getCloudStackSnapshots,
  createCloudStackSnapshot,
  deleteCloudStackSnapshot,
  revertCloudStackSnapshot,
  // Gestion des groupes d'instances
  getCloudStackInstanceGroups,
  createCloudStackInstanceGroup,
  deleteCloudStackInstanceGroup,
  updateCloudStackInstanceGroup,
  // Gestion des clés SSH
  getCloudStackSSHKeyPairs,
  createCloudStackSSHKeyPair,
  deleteCloudStackSSHKeyPair,
  registerCloudStackSSHKeyPair,
  // Gestion des utilisateurs
  getCloudStackUsers,
  createCloudStackUser,
  deleteCloudStackUser,
  updateCloudStackUser,
  updateCloudStackUserStatus,
  // Gestion des comptes
  createCloudStackAccount,
  deleteCloudStackAccount,
  // Gestion des user data
  getCloudStackUserData,
  createCloudStackUserDataTemplate,
  updateCloudStackUserDataTemplate,
  deleteCloudStackUserDataTemplate,
  // Gestion des OS types
  getCloudStackOSTypes,
  // Gestion des réseaux
  createCloudStackNetwork,
  deleteCloudStackNetwork,
  // Gestion des groupes de sécurité
  createCloudStackSecurityGroup,
  deleteCloudStackSecurityGroup,
  // Gestion des VPC
  getCloudStackVPCs,
  createCloudStackVPC,
  deleteCloudStackVPC,
  updateCloudStackVPC,
  // Gestion des IP publiques
  getCloudStackPublicIPs,
  associateCloudStackPublicIP,
  disassociateCloudStackPublicIP,
  releaseCloudStackPublicIP,
  // Gestion des réseaux avancés
  getCloudStackNetworksDetailed,
  createCloudStackIsolatedNetwork,
  createCloudStackSharedNetwork,
  updateCloudStackNetwork,
  // Gestion des ACL
  getCloudStackNetworkACLs,
  createCloudStackNetworkACL,
  deleteCloudStackNetworkACL
}; 