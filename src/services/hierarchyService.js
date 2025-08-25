import apiService from './api';

const hierarchyService = {
  // Récupérer ma hiérarchie (utilisateurs enfants)
  async getMyHierarchy() {
    try {
      const response = await apiService.get('/hierarchy/my-hierarchy');
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération de votre hiérarchie:', error);
      throw error;
    }
  },

  // Créer un nouvel utilisateur dans ma hiérarchie
  async createChildUser(userData) {
    try {
      const response = await apiService.post('/hierarchy/create-user', userData);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la création de l\'utilisateur:', error);
      throw error;
    }
  },

  // Mettre à jour un utilisateur enfant
  async updateChildUser(userId, userData) {
    try {
      const response = await apiService.put(`/hierarchy/user/${userId}`, userData);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la mise à jour de l\'utilisateur:', error);
      throw error;
    }
  },

  // Supprimer un utilisateur enfant
  async deleteChildUser(userId) {
    try {
      const response = await apiService.delete(`/hierarchy/user/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la suppression de l\'utilisateur:', error);
      throw error;
    }
  },

  // Récupérer les statistiques de ma hiérarchie
  async getHierarchyStats() {
    try {
      const response = await apiService.get('/hierarchy/stats');
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des statistiques:', error);
      throw error;
    }
  }
};

export default hierarchyService;
