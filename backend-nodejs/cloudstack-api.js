const crypto = require('crypto');
const axios = require('axios');
const config = require('./config');

class CloudStackAPI {
  constructor() {
    this.apiUrl = config.cloudstack.apiUrl;
    this.apiKey = config.cloudstack.apiKey;
    this.secretKey = config.cloudstack.secretKey;
    this.timeout = config.cloudstack.timeout;
  }

  // Générer la signature pour l'authentification CloudStack
  generateSignature(params) {
    // Trier les paramètres par ordre alphabétique
    const sortedParams = Object.keys(params)
      .sort()
      .map(key => `${key}=${encodeURIComponent(params[key])}`)
      .join('&');

    // Créer la signature HMAC-SHA1
    const signature = crypto
      .createHmac('sha1', this.secretKey)
      .update(sortedParams.toLowerCase())
      .digest('base64');

    return signature;
  }

  // Faire un appel API vers CloudStack
  async makeRequest(command, params = {}) {
    try {
      // Paramètres de base
      const requestParams = {
        ...params,
        apikey: this.apiKey,
        command: command,
        response: 'json'
      };

      // Générer la signature
      const signature = this.generateSignature(requestParams);
      requestParams.signature = signature;

      // Construire l'URL avec les paramètres
      const queryString = Object.keys(requestParams)
        .map(key => `${key}=${encodeURIComponent(requestParams[key])}`)
        .join('&');

      const url = `${this.apiUrl}?${queryString}`;

      console.log(`🌐 CloudStack API Request: ${command}`);
      console.log(`URL: ${url}`);

      // Faire la requête
      const response = await axios.get(url, {
        timeout: this.timeout,
        headers: {
          'Content-Type': 'application/json'
        }
      });

      console.log(`✅ CloudStack API Response: ${response.status}`);

      // Vérifier s'il y a une erreur dans la réponse CloudStack
      if (response.data.errorcode) {
        throw new Error(`CloudStack Error: ${response.data.errortext}`);
      }

      return response.data;
    } catch (error) {
      console.error(`❌ CloudStack API Error: ${error.message}`);
      throw error;
    }
  }

  // Méthodes spécifiques pour récupérer les données du dashboard
  async getDashboardStats() {
    try {
      // Récupérer les statistiques en parallèle
      const [
        domainsResponse,
        accountsResponse,
        projectsResponse,
        vmsResponse,
        volumesResponse,
        networksResponse,
        securityGroupsResponse
      ] = await Promise.all([
        this.makeRequest('listDomains'),
        this.makeRequest('listAccounts'),
        this.makeRequest('listProjects'),
        this.makeRequest('listVirtualMachines'),
        this.makeRequest('listVolumes'),
        this.makeRequest('listNetworks'),
        this.makeRequest('listSecurityGroups')
      ]);

      return {
        domains: domainsResponse.listdomainsresponse?.domain?.length || 0,
        accounts: accountsResponse.listaccountsresponse?.account?.length || 0,
        projects: projectsResponse.listprojectsresponse?.project?.length || 0,
        instances: vmsResponse.listvirtualmachinesresponse?.virtualmachine?.length || 0,
        volumes: volumesResponse.listvolumesresponse?.volume?.length || 0,
        networks: networksResponse.listnetworksresponse?.network?.length || 0,
        securityGroups: securityGroupsResponse.listsecuritygroupsresponse?.securitygroup?.length || 0
      };
    } catch (error) {
      console.error('Erreur lors de la récupération des statistiques CloudStack:', error);
      throw error;
    }
  }

  // Récupérer les domaines
  async getDomains() {
    const response = await this.makeRequest('listDomains');
    return response.listdomainsresponse?.domain || [];
  }

  // Récupérer les comptes
  async getAccounts() {
    const response = await this.makeRequest('listAccounts');
    return response.listaccountsresponse?.account || [];
  }

  // Récupérer les projets
  async getProjects() {
    const response = await this.makeRequest('listProjects');
    return response.listprojectsresponse?.project || [];
  }

  // Récupérer les instances
  async getVirtualMachines() {
    const response = await this.makeRequest('listVirtualMachines');
    return response.listvirtualmachinesresponse?.virtualmachine || [];
  }

  // Récupérer les volumes
  async getVolumes() {
    const response = await this.makeRequest('listVolumes');
    return response.listvolumesresponse?.volume || [];
  }

  // Récupérer les réseaux
  async getNetworks() {
    const response = await this.makeRequest('listNetworks');
    return response.listnetworksresponse?.network || [];
  }

  // Récupérer les groupes de sécurité
  async getSecurityGroups() {
    const response = await this.makeRequest('listSecurityGroups');
    return response.listsecuritygroupsresponse?.securitygroup || [];
  }

  // ===== NOUVELLES API POUR LA GESTION D'INSTANCES =====

  // Récupérer les templates disponibles
  async getTemplates() {
    const response = await this.makeRequest('listTemplates', { templatefilter: 'featured' });
    return response.listtemplatesresponse?.template || [];
  }

  // Récupérer les offres de service
  async getServiceOfferings() {
    const response = await this.makeRequest('listServiceOfferings');
    return response.listserviceofferingsresponse?.serviceoffering || [];
  }

  // Récupérer les zones
  async getZones() {
    const response = await this.makeRequest('listZones');
    return response.listzonesresponse?.zone || [];
  }

  // Récupérer les disk offerings
  async getDiskOfferings() {
    const response = await this.makeRequest('listDiskOfferings');
    return response.listdiskofferingsresponse?.diskoffering || [];
  }

  // Déployer une nouvelle instance
  async deployVirtualMachine(params) {
    const response = await this.makeRequest('deployVirtualMachine', params);
    return response.deployvirtualmachineresponse;
  }

  // Démarrer une instance
  async startVirtualMachine(id) {
    const response = await this.makeRequest('startVirtualMachine', { id });
    return response.startvirtualmachineresponse;
  }

  // Arrêter une instance
  async stopVirtualMachine(id) {
    const response = await this.makeRequest('stopVirtualMachine', { id });
    return response.stopvirtualmachineresponse;
  }

  // Redémarrer une instance
  async rebootVirtualMachine(id) {
    const response = await this.makeRequest('rebootVirtualMachine', { id });
    return response.rebootvirtualmachineresponse;
  }

  // Supprimer une instance
  async destroyVirtualMachine(id) {
    const response = await this.makeRequest('destroyVirtualMachine', { id });
    return response.destroyvirtualmachineresponse;
  }

  // ===== API POUR LA GESTION DE VOLUMES =====

  // Créer un volume
  async createVolume(params) {
    const response = await this.makeRequest('createVolume', params);
    return response.createvolumeresponse;
  }

  // Attacher un volume
  async attachVolume(volumeId, virtualMachineId) {
    const response = await this.makeRequest('attachVolume', { 
      id: volumeId, 
      virtualmachineid: virtualMachineId 
    });
    return response.attachvolumeresponse;
  }

  // Détacher un volume
  async detachVolume(volumeId) {
    const response = await this.makeRequest('detachVolume', { id: volumeId });
    return response.detachvolumeresponse;
  }

  // Supprimer un volume
  async deleteVolume(id) {
    const response = await this.makeRequest('deleteVolume', { id });
    return response.deletevolumeresponse;
  }

  // ===== API POUR LA GESTION DES SNAPSHOTS =====

  // Récupérer les snapshots
  async getSnapshots() {
    const response = await this.makeRequest('listSnapshots');
    return response.listsnapshotsresponse?.snapshot || [];
  }

  // Créer un snapshot
  async createSnapshot(params) {
    const response = await this.makeRequest('createSnapshot', params);
    return response.createsnapshotresponse;
  }

  // Supprimer un snapshot
  async deleteSnapshot(id) {
    const response = await this.makeRequest('deleteSnapshot', { id });
    return response.deletesnapshotresponse;
  }

  // Restaurer un snapshot
  async revertSnapshot(id) {
    const response = await this.makeRequest('revertSnapshot', { id });
    return response.revertsnapshotresponse;
  }

  // ===== API POUR LA GESTION DES VMSNAPSHOTS (INSTANCE SNAPSHOTS) =====

  // Récupérer les VMSnapshots
  async getVMSnapshots() {
    const response = await this.makeRequest('listVMSnapshots');
    return response.listvmsnapshotsresponse?.vmsnapshot || [];
  }

  // Créer un VMSnapshot
  async createVMSnapshot(params) {
    const response = await this.makeRequest('createVMSnapshot', params);
    return response.createvmsnapshotresponse;
  }

  // Supprimer un VMSnapshot
  async deleteVMSnapshot(id) {
    const response = await this.makeRequest('deleteVMSnapshot', { id });
    return response.deletevmsnapshotresponse;
  }

  // Restaurer un VMSnapshot
  async revertVMSnapshot(id) {
    const response = await this.makeRequest('revertVMSnapshot', { id });
    return response.revertvmsnapshotresponse;
  }

  // ===== API POUR LA GESTION DES ISOs =====

  // Récupérer les ISOs
  async getISOs() {
    const response = await this.makeRequest('listIsos');
    return response.listisosresponse?.iso || [];
  }

  // Créer un ISO
  async createISO(params) {
    const response = await this.makeRequest('registerIso', params);
    return response.registerisoresponse;
  }

  // Mettre à jour un ISO
  async updateISO(params) {
    const response = await this.makeRequest('updateIso', params);
    return response.updateisoresponse;
  }

  // Supprimer un ISO
  async deleteISO(id) {
    const response = await this.makeRequest('deleteIso', { id });
    return response.deleteisoresponse;
  }

  // ===== API POUR LA GESTION DES ÉVÉNEMENTS =====

  // Récupérer les événements
  async getEvents(params = {}) {
    // Nettoyer les paramètres - supprimer les valeurs undefined, null ou vides
    const cleanParams = {};
    Object.keys(params).forEach(key => {
      if (params[key] !== undefined && params[key] !== null && params[key] !== '' && params[key] !== 'undefined') {
        cleanParams[key] = params[key];
      }
    });
    
    console.log('📋 Paramètres nettoyés pour listEvents:', cleanParams);
    const response = await this.makeRequest('listEvents', cleanParams);
    return response.listeventsresponse?.event || [];
  }

  // ===== API POUR LA GESTION DES GROUPES D'INSTANCES =====

  // Récupérer les groupes d'instances
  async getInstanceGroups() {
    const response = await this.makeRequest('listInstanceGroups');
    return response.listinstancegroupsresponse?.instancegroup || [];
  }

  // Créer un groupe d'instances
  async createInstanceGroup(params) {
    const response = await this.makeRequest('createInstanceGroup', params);
    return response.createinstancegroupresponse;
  }

  // Supprimer un groupe d'instances
  async deleteInstanceGroup(id) {
    const response = await this.makeRequest('deleteInstanceGroup', { id });
    return response.deleteinstancegroupresponse;
  }

  // Mettre à jour un groupe d'instances
  async updateInstanceGroup(params) {
    const response = await this.makeRequest('updateInstanceGroup', params);
    return response.updateinstancegroupresponse;
  }

  // ===== API POUR LA GESTION DES CLÉS SSH =====

  // Récupérer les paires de clés SSH
  async getSSHKeyPairs() {
    const response = await this.makeRequest('listSSHKeyPairs');
    return response.listsshkeypairsresponse?.sshkeypair || [];
  }

  // Créer une paire de clés SSH
  async createSSHKeyPair(params) {
    const response = await this.makeRequest('createSSHKeyPair', params);
    return response.createsshkeypairresponse;
  }

  // Supprimer une paire de clés SSH
  async deleteSSHKeyPair(name) {
    const response = await this.makeRequest('deleteSSHKeyPair', { name });
    return response.deletesshkeypairresponse;
  }

  // Importer une paire de clés SSH
  async registerSSHKeyPair(params) {
    const response = await this.makeRequest('registerSSHKeyPair', params);
    return response.registersshkeypairresponse;
  }

  // ===== API POUR LA GESTION DES UTILISATEURS =====

  // Récupérer les utilisateurs
  async getUsers() {
    const response = await this.makeRequest('listUsers');
    return response.listusersresponse?.user || [];
  }

  // Créer un utilisateur
  async createUser(params) {
    const response = await this.makeRequest('createUser', params);
    return response.createuserresponse;
  }

  // Supprimer un utilisateur
  async deleteUser(id) {
    const response = await this.makeRequest('deleteUser', { id });
    return response.deleteuserresponse;
  }

  // Mettre à jour un utilisateur
  async updateUser(params) {
    const response = await this.makeRequest('updateUser', params);
    return response.updateuserresponse;
  }

  // Activer/Désactiver un utilisateur
  async updateUserStatus(params) {
    const response = await this.makeRequest('updateUser', params);
    return response.updateuserresponse;
  }

  // Récupérer les comptes
  async getAccounts() {
    const response = await this.makeRequest('listAccounts');
    return response.listaccountsresponse?.account || [];
  }

  // Créer un compte
  async createAccount(params) {
    const response = await this.makeRequest('createAccount', params);
    return response.createaccountresponse;
  }

  // Supprimer un compte
  async deleteAccount(id) {
    const response = await this.makeRequest('deleteAccount', { id });
    return response.deleteaccountresponse;
  }

  // ===== API POUR LA GESTION DES USER DATA =====

  // Récupérer les user data (via les templates ou les instances)
  async getUserDataFromInstances() {
    const response = await this.makeRequest('listVirtualMachines');
    const instances = response.listvirtualmachinesresponse?.vm || [];
    return instances.filter(instance => instance.userdata).map(instance => ({
      id: instance.id,
      name: instance.name,
      userdata: instance.userdata,
      account: instance.account,
      domain: instance.domain,
      created: instance.created,
      state: instance.state
    }));
  }

  // Récupérer les user data depuis les templates
  async getUserDataFromTemplates() {
    const response = await this.makeRequest('listTemplates', { templatefilter: 'self' });
    const templates = response.listtemplatesresponse?.template || [];
    return templates.filter(template => template.userdata).map(template => ({
      id: template.id,
      name: template.name,
      userdata: template.userdata,
      account: template.account,
      domain: template.domain,
      created: template.created,
      state: template.state
    }));
  }

  // Créer un template avec user data
  async createTemplateWithUserData(params) {
    const response = await this.makeRequest('createTemplate', params);
    return response.createtemplateresponse;
  }

  // Mettre à jour un template avec user data
  async updateTemplateWithUserData(params) {
    const response = await this.makeRequest('updateTemplate', params);
    return response.updatetemplateresponse;
  }

  // Supprimer un template
  async deleteTemplate(id) {
    const response = await this.makeRequest('deleteTemplate', { id });
    return response.deletetemplateresponse;
  }

  // Récupérer les OS types
  async getOSTypes() {
    const response = await this.makeRequest('listOsTypes');
    return response.listostypesresponse?.ostype || [];
  }

  // ===== API POUR LA GESTION DES RÉSEAUX =====

  // Créer un réseau
  async createNetwork(params) {
    const response = await this.makeRequest('createNetwork', params);
    return response.createnetworkresponse;
  }

  // Supprimer un réseau
  async deleteNetwork(id) {
    const response = await this.makeRequest('deleteNetwork', { id });
    return response.deletenetworkresponse;
  }

  // ===== GESTION DES VPC CLOUDSTACK =====
  
  // Récupérer les VPC
  async getVPCs() {
    const response = await this.makeRequest('listVPCs');
    return response.listvpcsresponse?.vpc || [];
  }

  // Créer un VPC
  async createVPC(vpcData) {
    const response = await this.makeRequest('createVPC', vpcData);
    return response.createvpcresponse?.vpc || response.createvpcresponse;
  }

  // Supprimer un VPC
  async deleteVPC(vpcId) {
    const response = await this.makeRequest('deleteVPC', { id: vpcId });
    return response.deletevpcresponse;
  }

  // Mettre à jour un VPC
  async updateVPC(vpcId, vpcData) {
    const response = await this.makeRequest('updateVPC', { id: vpcId, ...vpcData });
    return response.updatevpcresponse?.vpc || response.updatevpcresponse;
  }

  // ===== GESTION DES IP PUBLIQUES CLOUDSTACK =====
  
  // Récupérer les IP publiques
  async getPublicIPs() {
    const response = await this.makeRequest('listPublicIpAddresses');
    return response.listpublicipaddressesresponse?.publicipaddress || [];
  }

  // Associer une IP publique
  async associatePublicIP(ipData) {
    const response = await this.makeRequest('associateIpAddress', ipData);
    return response.associateipaddressresponse?.ipaddress || response.associateipaddressresponse;
  }

  // Dissocier une IP publique
  async disassociatePublicIP(ipId) {
    const response = await this.makeRequest('disassociateIpAddress', { id: ipId });
    return response.disassociateipaddressresponse;
  }

  // Libérer une IP publique
  async releasePublicIP(ipId) {
    const response = await this.makeRequest('releaseIpAddress', { id: ipId });
    return response.releaseipaddressresponse;
  }

  // ===== GESTION DES RÉSEAUX AVANCÉE CLOUDSTACK =====
  
  // Récupérer les réseaux avec plus de détails
  async getNetworksDetailed() {
    const response = await this.makeRequest('listNetworks');
    return response.listnetworksresponse?.network || [];
  }

  // Créer un réseau isolé
  async createIsolatedNetwork(networkData) {
    const response = await this.makeRequest('createNetwork', networkData);
    return response.createnetworkresponse?.network || response.createnetworkresponse;
  }

  // Créer un réseau partagé
  async createSharedNetwork(networkData) {
    const response = await this.makeRequest('createNetwork', { ...networkData, networktype: 'Shared' });
    return response.createnetworkresponse?.network || response.createnetworkresponse;
  }

  // Supprimer un réseau
  async deleteNetwork(networkId) {
    const response = await this.makeRequest('deleteNetwork', { id: networkId });
    return response.deletenetworkresponse;
  }

  // Mettre à jour un réseau
  async updateNetwork(networkId, networkData) {
    const response = await this.makeRequest('updateNetwork', { id: networkId, ...networkData });
    return response.updatenetworkresponse?.network || response.updatenetworkresponse;
  }

  // Récupérer les ACL (Access Control Lists) pour les réseaux
  async getNetworkACLs() {
    const response = await this.makeRequest('listNetworkACLLists');
    return response.listnetworkacllistsresponse?.networkacllist || [];
  }

  // Créer une ACL
  async createNetworkACL(aclData) {
    const response = await this.makeRequest('createNetworkACLList', aclData);
    return response.createnetworkacllistresponse?.networkacllist || response.createnetworkacllistresponse;
  }

  // Supprimer une ACL
  async deleteNetworkACL(aclId) {
    const response = await this.makeRequest('deleteNetworkACLList', { id: aclId });
    return response.deletenetworkacllistresponse;
  }
};

module.exports = new CloudStackAPI(); 