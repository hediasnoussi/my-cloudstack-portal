import { apiService } from './api';

class AuthService {
  constructor() {
    this.user = null;
    this.token = localStorage.getItem('token');
  }

  // Connexion utilisateur
  async login(username, password) {
    try {
      // Simulation des comptes de démonstration avec nouveaux rôles
      const demoUsers = {
        'subprovider': { username: 'subprovider', password: 'sub123', role: 'subprovider', displayName: 'Subprovider' },
        'agent': { username: 'agent', password: 'agent123', role: 'agent', displayName: 'Partenaire' },
        'admin': { username: 'admin', password: 'admin123', role: 'subprovider', displayName: 'Admin' },
        'user1': { username: 'user1', password: 'user123', role: 'agent', displayName: 'Partenaire 1' },
        'domain_admin': { username: 'domain_admin', password: 'domain123', role: 'subprovider', displayName: 'Domain Admin' }
      };

      const user = demoUsers[username];
      
      if (user && user.password === password) {
        this.user = {
          username: user.username,
          role: user.role,
          displayName: user.displayName,
          account_name: user.role === 'subprovider' ? 'Compte Subprovider' : 'Compte Partenaire'
        };
        
        // Stocker les informations utilisateur
        localStorage.setItem('user', JSON.stringify(this.user));
        return { success: true, user: this.user };
      }
      
      return { success: false, error: 'Nom d\'utilisateur ou mot de passe incorrect' };
    } catch (error) {
      console.error('Login error:', error);
      return { 
        success: false, 
        error: error.response?.data?.error || 'Erreur de connexion' 
      };
    }
  }

  // Déconnexion
  logout() {
    this.user = null;
    this.token = null;
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  }

  // Vérifier si l'utilisateur est connecté
  isAuthenticated() {
    const user = localStorage.getItem('user');
    return user !== null;
  }

  // Obtenir l'utilisateur actuel
  getCurrentUser() {
    if (!this.user) {
      const userStr = localStorage.getItem('user');
      if (userStr) {
        this.user = JSON.parse(userStr);
      }
    }
    return this.user;
  }

  // Vérifier si l'utilisateur est subprovider
  isSubprovider() {
    const user = this.getCurrentUser();
    return user && user.role === 'subprovider';
  }

  // Vérifier si l'utilisateur est agent commercial
  isAgent() {
    const user = this.getCurrentUser();
    return user && user.role === 'agent';
  }

  // Obtenir le nom d'affichage de l'utilisateur
  getDisplayName() {
    const user = this.getCurrentUser();
    if (user) {
      return user.displayName || user.username || user.email;
    }
    return 'Utilisateur';
  }

  // Obtenir les informations du compte associé
  getAccountInfo() {
    const user = this.getCurrentUser();
    return user?.account_name || 'Aucun compte';
  }
}

export default new AuthService(); 