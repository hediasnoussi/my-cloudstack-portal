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
}

module.exports = new CloudStackAPI(); 