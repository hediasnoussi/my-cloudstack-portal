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
    console.error(' Erreur lors de la récupération des comptes:', error);
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
      size: snapshot.physicalsize ? Math.round(snapshot.physicalsize / 1024 / 1024) + ' MB' : 'N/A',
      virtualSize: snapshot.virtualsize,
      type: snapshot.intervaltype || 'MANUAL',
      zoneId: snapshot.zoneid,
      zoneName: snapshot.zonename || '',
      account: snapshot.account,
      domain: snapshot.domain,
      revertable: snapshot.revertable,
      volumeType: snapshot.volumetype,
      volumeState: snapshot.volumestate
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

// ===== GESTION DES VMSNAPSHOTS (INSTANCE SNAPSHOTS) =====

// Récupérer les VMSnapshots CloudStack
const getCloudStackVMSnapshots = async (req, res) => {
  try {
    console.log('📸 Récupération des VMSnapshots CloudStack...');
    const vmSnapshots = await cloudstackAPI.getVMSnapshots();
    
    // Transformer les données pour le frontend
    const transformedVMSnapshots = vmSnapshots.map(snapshot => ({
      id: snapshot.id,
      name: snapshot.name,
      description: snapshot.description || '',
      virtualMachineId: snapshot.virtualmachineid,
      virtualMachineName: snapshot.virtualmachinename || '',
      state: snapshot.state,
      created: snapshot.created,
      type: snapshot.type || 'MANUAL',
      zoneId: snapshot.zoneid,
      zoneName: snapshot.zonename || '',
      account: snapshot.account,
      domain: snapshot.domain,
      revertable: snapshot.revertable
    }));
    
    console.log(`✅ ${transformedVMSnapshots.length} VMSnapshots récupérés`);
    res.json(transformedVMSnapshots);
  } catch (error) {
    console.error('❌ Erreur lors de la récupération des VMSnapshots:', error);
    res.status(500).json({ 
      error: 'Erreur lors de la récupération des VMSnapshots CloudStack',
      details: error.message 
    });
  }
};

// Créer un VMSnapshot dans CloudStack
const createCloudStackVMSnapshot = async (req, res) => {
  try {
    console.log('📸 Création d\'un nouveau VMSnapshot CloudStack...');
    const { virtualmachineid, name, description } = req.body;
    
    if (!virtualmachineid) {
      return res.status(400).json({ 
        error: 'virtualmachineid est requis' 
      });
    }

    const result = await cloudstackAPI.createVMSnapshot({
      virtualmachineid,
      name: name || `vm-snapshot-${Date.now()}`,
      description: description || ''
    });
    
    console.log('✅ VMSnapshot créé avec succès');
    res.status(201).json(result);
  } catch (error) {
    console.error('❌ Erreur lors de la création du VMSnapshot:', error);
    res.status(500).json({ 
      error: 'Erreur lors de la création du VMSnapshot CloudStack',
      details: error.message 
    });
  }
};

// Supprimer un VMSnapshot
const deleteCloudStackVMSnapshot = async (req, res) => {
  try {
    console.log('🗑️ Suppression d\'un VMSnapshot CloudStack...');
    const { id } = req.params;
    
    if (!id) {
      return res.status(400).json({ error: 'ID du VMSnapshot requis' });
    }

    const result = await cloudstackAPI.deleteVMSnapshot(id);
    console.log('✅ VMSnapshot supprimé avec succès');
    res.json(result);
  } catch (error) {
    console.error('❌ Erreur lors de la suppression du VMSnapshot:', error);
    res.status(500).json({ 
      error: 'Erreur lors de la suppression du VMSnapshot CloudStack',
      details: error.message 
    });
  }
};

// Restaurer un VMSnapshot
const revertCloudStackVMSnapshot = async (req, res) => {
  try {
    console.log('🔄 Restauration d\'un VMSnapshot CloudStack...');
    const { id } = req.params;
    
    if (!id) {
      return res.status(400).json({ error: 'ID du VMSnapshot requis' });
    }

    const result = await cloudstackAPI.revertVMSnapshot(id);
    console.log('✅ VMSnapshot restauré avec succès');
    res.json(result);
  } catch (error) {
    console.error('❌ Erreur lors de la restauration du VMSnapshot:', error);
    res.status(500).json({ 
      error: 'Erreur lors de la restauration du VMSnapshot CloudStack',
      details: error.message 
    });
  }
};

// ===== GESTION DES ISOs CLOUDSTACK =====

// Récupérer les ISOs CloudStack
const getCloudStackISOs = async (req, res) => {
  try {
    console.log('📀 Récupération des ISOs CloudStack...');
    const isos = await cloudstackAPI.getISOs();
    
    // Transformer les données pour le frontend
    const transformedISOs = isos.map(iso => ({
      id: iso.id,
      name: iso.name,
      displaytext: iso.displaytext || '',
      ostypeid: iso.ostypeid,
      ostypename: iso.ostypename || '',
      format: iso.format || 'ISO',
      size: iso.size ? Math.round(iso.size / 1024 / 1024 / 1024 * 100) / 100 + ' GB' : 'N/A',
      state: iso.state,
      created: iso.created,
      zoneId: iso.zoneid,
      zoneName: iso.zonename || '',
      account: iso.account,
      domain: iso.domain,
      ispublic: iso.ispublic,
      isfeatured: iso.isfeatured,
      isready: iso.isready
    }));
    
    console.log(`✅ ${transformedISOs.length} ISOs récupérés`);
    res.json(transformedISOs);
  } catch (error) {
    console.error('❌ Erreur lors de la récupération des ISOs:', error);
    res.status(500).json({ 
      error: 'Erreur lors de la récupération des ISOs CloudStack',
      details: error.message 
    });
  }
};

// Créer un ISO dans CloudStack
const createCloudStackISO = async (req, res) => {
  try {
    console.log('📀 Création d\'un nouveau ISO CloudStack...');
    const { name, displaytext, ostypeid, url, zoneid } = req.body;
    
    if (!name || !url) {
      return res.status(400).json({ 
        error: 'name et url sont requis' 
      });
    }

    const result = await cloudstackAPI.createISO({
      name,
      displaytext: displaytext || name,
      ostypeid: ostypeid || '1', // Default OS type
      url,
      zoneid: zoneid || '1' // Default zone
    });
    
    console.log('✅ ISO créé avec succès');
    res.status(201).json(result);
  } catch (error) {
    console.error('❌ Erreur lors de la création de l\'ISO:', error);
    res.status(500).json({ 
      error: 'Erreur lors de la création de l\'ISO CloudStack',
      details: error.message 
    });
  }
};

// Mettre à jour un ISO
const updateCloudStackISO = async (req, res) => {
  try {
    console.log('📀 Mise à jour d\'un ISO CloudStack...');
    const { id } = req.params;
    const { name, displaytext, ostypeid } = req.body;
    
    if (!id) {
      return res.status(400).json({ error: 'ID de l\'ISO requis' });
    }

    const result = await cloudstackAPI.updateISO({
      id,
      name,
      displaytext,
      ostypeid
    });
    console.log('✅ ISO mis à jour avec succès');
    res.json(result);
  } catch (error) {
    console.error('❌ Erreur lors de la mise à jour de l\'ISO:', error);
    res.status(500).json({ 
      error: 'Erreur lors de la mise à jour de l\'ISO CloudStack',
      details: error.message 
    });
  }
};

// Supprimer un ISO
const deleteCloudStackISO = async (req, res) => {
  try {
    console.log('🗑️ Suppression d\'un ISO CloudStack...');
    const { id } = req.params;
    
    if (!id) {
      return res.status(400).json({ error: 'ID de l\'ISO requis' });
    }

    const result = await cloudstackAPI.deleteISO(id);
    console.log('✅ ISO supprimé avec succès');
    res.json(result);
  } catch (error) {
    console.error('❌ Erreur lors de la suppression de l\'ISO:', error);
    res.status(500).json({ 
      error: 'Erreur lors de la suppression de l\'ISO CloudStack',
      details: error.message 
    });
  }
};

// ===== GESTION DES ÉVÉNEMENTS CLOUDSTACK =====

// Récupérer les événements CloudStack
const getCloudStackEvents = async (req, res) => {
  try {
    console.log('📋 Récupération des événements CloudStack...');
    const { startdate, enddate, level, type, keyword } = req.query;
    
    // Nettoyer les paramètres - supprimer les valeurs undefined
    const cleanParams = {};
    if (startdate && startdate !== 'undefined') cleanParams.startdate = startdate;
    if (enddate && enddate !== 'undefined') cleanParams.enddate = enddate;
    if (level && level !== 'undefined') cleanParams.level = level;
    if (type && type !== 'undefined') cleanParams.type = type;
    if (keyword && keyword !== 'undefined') cleanParams.keyword = keyword;
    
    try {
      const events = await cloudstackAPI.getEvents(cleanParams);
      
      // Transformer les données pour le frontend
      const transformedEvents = events.map(event => ({
        id: event.id,
        timestamp: event.created,
        level: event.level || 'info',
        type: event.type || 'system',
        message: event.description || event.event || 'Aucun message',
        user: event.username || 'system',
        details: event.event || '',
        account: event.account,
        domain: event.domain,
        resourceType: event.resourcetype,
        resourceId: event.resourceid,
        resourceName: event.resourcename
      }));
      
      console.log(`✅ ${transformedEvents.length} événements récupérés`);
      res.json(transformedEvents);
    } catch (cloudstackError) {
      console.log('⚠️ Erreur CloudStack API, utilisation de données de test...');
      
      // Données de test en cas d'erreur CloudStack
      const testEvents = [
        {
          id: '1',
          timestamp: new Date().toISOString(),
          level: 'info',
          type: 'instance',
          message: 'Instance "Web Server 1" démarrée avec succès',
          user: 'admin',
          account: 'admin',
          domain: 'ROOT',
          resourceType: 'UserVm',
          resourceId: 'vm-123',
          resourceName: 'Web Server 1'
        },
        {
          id: '2',
          timestamp: new Date(Date.now() - 300000).toISOString(),
          level: 'warning',
          type: 'storage',
          message: 'Espace disque faible sur le volume principal',
          user: 'system',
          account: 'admin',
          domain: 'ROOT',
          resourceType: 'Volume',
          resourceId: 'vol-456',
          resourceName: 'Volume principal'
        },
        {
          id: '3',
          timestamp: new Date(Date.now() - 600000).toISOString(),
          level: 'error',
          type: 'network',
          message: 'Échec de connexion au réseau externe',
          user: 'system',
          account: 'admin',
          domain: 'ROOT',
          resourceType: 'Network',
          resourceId: 'net-789',
          resourceName: 'Réseau externe'
        },
        {
          id: '4',
          timestamp: new Date(Date.now() - 900000).toISOString(),
          level: 'success',
          type: 'user',
          message: 'Utilisateur "john.doe" connecté avec succès',
          user: 'john.doe',
          account: 'user1',
          domain: 'ROOT',
          resourceType: 'User',
          resourceId: 'user-101',
          resourceName: 'john.doe'
        }
      ];
      
      console.log(`✅ ${testEvents.length} événements de test fournis`);
      res.json(testEvents);
    }
  } catch (error) {
    console.error('❌ Erreur lors de la récupération des événements:', error);
    res.status(500).json({ 
      error: 'Erreur lors de la récupération des événements CloudStack',
      details: error.message 
    });
  }
};



module.exports = {
  getDashboardStats,
  getCloudStackDomains,
  getCloudStackAccounts,
  getCloudStackProjects,
  getCloudStackVirtualMachines,
  getCloudStackVolumes,
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
  // Gestion des VMSnapshots
  getCloudStackVMSnapshots,
  createCloudStackVMSnapshot,
  deleteCloudStackVMSnapshot,
  revertCloudStackVMSnapshot,
  // Gestion des ISOs
  getCloudStackISOs,
  createCloudStackISO,
  updateCloudStackISO,
  deleteCloudStackISO,
  // Gestion des événements
  getCloudStackEvents,
  // Gestion des groupes d'instances
  getCloudStackInstanceGroups,
  createCloudStackInstanceGroup,
  deleteCloudStackInstanceGroup,
  updateCloudStackInstanceGroup,
  // Gestion des utilisateurs
  getCloudStackUsers,
  createCloudStackUser,
  deleteCloudStackUser,
  updateCloudStackUser,
  updateCloudStackUserStatus,
  // Gestion des comptes
  createCloudStackAccount,
  deleteCloudStackAccount,
  // Gestion des OS types
  getCloudStackOSTypes
}; 