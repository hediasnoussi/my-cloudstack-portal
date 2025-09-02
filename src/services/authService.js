import apiService from './api';

class AuthService {
  constructor() {
    this.userKey = 'userData';
  }

  // Connexion utilisateur (sans JWT)
  async login(username, password) {
    try {
      const response = await apiService.post('/api/login', { username, password });
      
      if (response.data.success) {
        const { user } = response.data.data;
        
        // Stocker seulement les données utilisateur (sans token)
        localStorage.setItem(this.userKey, JSON.stringify(user));
        
        return {
          success: true,
          user
        };
      } else {
        return {
          success: false,
          message: response.data.message
        };
      }
    } catch (error) {
      console.error('Erreur de connexion:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Erreur de connexion au serveur'
      };
    }
  }

  // Déconnexion
  logout() {
    localStorage.removeItem(this.userKey);
  }

  // Vérifier si l'utilisateur est connecté
  isAuthenticated() {
    const userData = localStorage.getItem(this.userKey);
    return !!userData;
  }

  // Obtenir l'utilisateur actuel
  getCurrentUser() {
    const userData = localStorage.getItem(this.userKey);
    return userData ? JSON.parse(userData) : null;
  }

  // Vérifier si l'utilisateur est admin
  isAdmin() {
    const user = this.getCurrentUser();
    return user && user.role === 'admin';
  }

  // Vérifier si l'utilisateur est un utilisateur normal
  isUser() {
    const user = this.getCurrentUser();
    return user && user.role === 'user';
  }

  // Vérifier si l'utilisateur est un subprovider
  isSubprovider() {
    const user = this.getCurrentUser();
    return user && user.role === 'subprovider';
  }

  // Vérifier si l'utilisateur est un partner/agent
  isPartner() {
    const user = this.getCurrentUser();
    return user && user.role === 'partner';
  }

  // Obtenir le nom d'affichage du rôle
  getDisplayName() {
    const user = this.getCurrentUser();
    if (!user) return '';

    switch (user.role) {
      case 'admin': return 'Administrateur';
      case 'subprovider': return 'Fournisseur Secondaire';
      case 'partner': return 'Partenaire/Agent';
      case 'user': return 'Client Final';
      default: return user.role;
    }
  }

  // Obtenir les informations du compte
  getAccountInfo() {
    const user = this.getCurrentUser();
    return user ? {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
      account_id: user.account_id
    } : null;
  }
}

export default new AuthService(); 