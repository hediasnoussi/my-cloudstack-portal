# Tableau de Bord Utilisateur - CloudStack Portal

## Vue d'ensemble

Ce document décrit l'implémentation du tableau de bord personnalisé pour les utilisateurs normaux du CloudStack Portal. Les utilisateurs connectés avec le rôle "user" ont maintenant accès à un environnement dédié et sécurisé pour gérer leurs propres services.

## Fonctionnalités principales

### 🔐 Accès sécurisé et isolé
- **Utilisateurs normaux** : Accès uniquement à leurs propres VPS et services
- **Admins/Subproviders** : Accès complet à tous les services
- **Séparation automatique** des données selon le rôle utilisateur

### 🖥️ Gestion des VPS personnels
- **Vue d'ensemble** : Liste de tous les VPS de l'utilisateur
- **Actions VPS** : Démarrer, arrêter, modifier, supprimer
- **Création de VPS** : Assistant guidé en 4 étapes
- **Statuts en temps réel** : Monitoring des ressources

### 💰 Facturation personnelle
- **Solde actuel** : Affichage du crédit disponible
- **Coût mensuel** : Total des services actifs
- **Historique des factures** : Consultation et téléchargement
- **Méthodes de paiement** : Gestion des moyens de paiement

### 🆘 Support et assistance
- **Tickets de support** : Création et suivi des demandes
- **Priorités** : Faible, moyenne, élevée
- **Catégories** : Technique, facturation, général
- **Contact direct** : Email, téléphone, chat en ligne

## Architecture technique

### Composants principaux

```
src/
├── components/
│   ├── UserNavigation.jsx          # Navigation utilisateur
│   ├── UserBilling.jsx             # Gestion facturation
│   ├── UserSupport.jsx             # Gestion support
│   ├── CreateVPSDialog.jsx         # Création de VPS
│   └── RoleBasedRouter.jsx         # Routage basé sur les rôles
├── pages/
│   └── UserDashboard.jsx           # Tableau de bord principal
└── contexts/
    └── AuthContext.jsx             # Gestion authentification
```

### Système de routage

Le `RoleBasedRouter` gère automatiquement la redirection des utilisateurs :

- **Route `/` ou `/dashboard`** → Redirection automatique selon le rôle
- **Utilisateurs normaux** → `/user-dashboard`
- **Admins/Subproviders** → `/dashboard` (tableau de bord admin)

### Filtrage des données

Les composants filtrent automatiquement les données selon le rôle :

```javascript
// Dans Instances.jsx
if (isAdmin() || isSubprovider()) {
  // Voir toutes les instances
} else if (isUser() && user) {
  // Voir seulement ses propres instances
}
```

## Utilisation

### 1. Connexion utilisateur
```javascript
// L'utilisateur se connecte avec ses identifiants
const { login } = useAuth();
const result = await login(username, password);
```

### 2. Redirection automatique
```javascript
// Le RoleBasedRouter redirige automatiquement vers le bon tableau de bord
if (isUser()) {
  navigate('/user-dashboard');
} else if (isAdmin()) {
  navigate('/dashboard');
}
```

### 3. Accès aux données filtrées
```javascript
// Les composants affichent seulement les données autorisées
const userVPS = instances.filter(instance => instance.owner_id === user.id);
```

## Sécurité

### Contrôle d'accès
- **Vérification des rôles** à chaque requête
- **Filtrage des données** côté client et serveur
- **Routes protégées** selon le niveau d'autorisation

### Isolation des données
- **Utilisateurs normaux** : Accès uniquement à leurs ressources
- **Pas d'accès** aux données d'autres utilisateurs
- **Séparation stricte** des environnements

## Personnalisation

### Thème et style
- **Interface utilisateur** adaptée aux besoins des utilisateurs finaux
- **Navigation intuitive** avec icônes descriptives
- **Responsive design** pour tous les appareils

### Fonctionnalités extensibles
- **Système modulaire** pour ajouter de nouvelles fonctionnalités
- **Composants réutilisables** pour la cohérence
- **API flexible** pour l'intégration de nouveaux services

## Déploiement

### Prérequis
- React 18+
- Material-UI 5+
- React Router 6+
- Contexte d'authentification configuré

### Installation
1. Copier les composants dans le projet
2. Importer `RoleBasedRouter` dans l'App principal
3. Configurer les routes utilisateur
4. Tester avec différents rôles utilisateur

### Configuration
```javascript
// Dans App.jsx
import RoleBasedRouter from './components/RoleBasedRouter';

function App() {
  return (
    <AuthProvider>
      <RoleBasedRouter>
        {/* Routes de l'application */}
      </RoleBasedRouter>
    </AuthProvider>
  );
}
```

## Tests et validation

### Scénarios de test
1. **Connexion utilisateur normal** → Redirection vers `/user-dashboard`
2. **Connexion admin** → Redirection vers `/dashboard`
3. **Accès non autorisé** → Redirection automatique
4. **Création de VPS** → Ajout à la liste personnelle
5. **Gestion facturation** → Affichage des données personnelles

### Validation des données
- **Filtrage correct** selon le rôle utilisateur
- **Pas d'accès** aux données d'autres utilisateurs
- **Fonctionnalités** limitées selon les permissions

## Support et maintenance

### Logs et monitoring
- **Console logs** pour le débogage
- **Gestion d'erreurs** avec messages utilisateur
- **Validation des formulaires** en temps réel

### Évolutions futures
- **Notifications push** pour les événements VPS
- **Métriques avancées** d'utilisation
- **Intégration API** CloudStack réelle
- **Sauvegarde automatique** des configurations

## Conclusion

Le tableau de bord utilisateur offre une expérience complète et sécurisée pour les utilisateurs finaux du CloudStack Portal. Il respecte les principes de sécurité et d'isolation tout en fournissant toutes les fonctionnalités nécessaires à la gestion de leurs services cloud.

L'architecture modulaire permet une maintenance facile et l'ajout de nouvelles fonctionnalités selon les besoins des utilisateurs.
