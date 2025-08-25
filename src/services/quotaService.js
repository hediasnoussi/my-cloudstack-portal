import apiService from './api';

const quotaService = {
  // Récupérer mes propres quotas
  async getMyQuotas() {
    try {
      const response = await apiService.get('/quotas/my-quotas');
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération de vos quotas:', error);
      throw error;
    }
  },

  // Récupérer les quotas d'un utilisateur spécifique
  async getUserQuotas(userId) {
    try {
      const response = await apiService.get(`/quotas/user/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des quotas:', error);
      throw error;
    }
  },

  // Mettre à jour les quotas d'un utilisateur (admin uniquement)
  async updateUserQuotas(userId, quotaData) {
    try {
      const response = await apiService.put(`/quotas/user/${userId}`, quotaData);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la mise à jour des quotas:', error);
      throw error;
    }
  },

  // Créer des quotas pour un nouvel utilisateur
  async createUserQuotas(quotaData) {
    try {
      const response = await apiService.post('/quotas/create', quotaData);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la création des quotas:', error);
      throw error;
    }
  },

  // Récupérer tous les quotas (admin uniquement)
  async getAllQuotas() {
    try {
      const response = await apiService.get('/quotas/all');
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération de tous les quotas:', error);
      throw error;
    }
  },

  // Mettre à jour l'utilisation des quotas
  async updateQuotaUsage(usageData) {
    try {
      const response = await apiService.post('/quotas/update-usage', usageData);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la mise à jour de l\'utilisation:', error);
      throw error;
    }
  }
};

export default quotaService;
