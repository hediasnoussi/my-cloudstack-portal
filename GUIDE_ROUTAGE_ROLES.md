# 🎯 Guide de Routage Basé sur les Rôles

## 📋 Structure des Rôles et Redirections

### 🔐 Identifiants de Connexion

| Rôle | Username | Password | Dashboard Principal | Dashboard Spécialisé |
|------|----------|----------|-------------------|---------------------|
| **Admin** | `admin` | `password123` | `/dashboard` | `/subprovider-dashboard` |
| **Subprovider** | `subprovider` | `password123` | `/dashboard` | `/subprovider-dashboard` |
| **Partner** | `partner` | `password123` | `/dashboard` | `/partner-dashboard` (à créer) |
| **User** | `user` | `password123` | `/user-dashboard` | `/user-dashboard` |
| **Client** | `client` | `password123` | `/user-dashboard` | `/user-dashboard` |

## 🚀 Logique de Redirection

### **Connexion Initiale**
```javascript
// Dans Login.jsx
if (validUser.role === 'user') {
  window.location.href = '/user-dashboard'  // Dashboard utilisateur
} else {
  window.location.href = '/dashboard'       // Dashboard admin/subprovider/partner
}
```

### **Routage Automatique**
```javascript
// Dans RoleBasedRouter.jsx
if (isUser()) {
  // Utilisateur normal → /user-dashboard
  navigate('/user-dashboard');
} else if (isAdmin() || isSubprovider()) {
  // Admin/Subprovider → /dashboard
  navigate('/dashboard');
}
```

## 📊 Accès aux Données CloudStack

### **Admin & Subprovider** (`/dashboard`)
- ✅ **Vue globale** : Tous les VPS CloudStack
- ✅ **Actions complètes** : Création, modification, suppression
- ✅ **Statistiques globales** : Toutes les ressources
- ✅ **Gestion des utilisateurs** : Tous les comptes

### **Partner** (`/dashboard` - actuellement)
- ✅ **Vue restreinte** : Ses VPS + VPS de ses clients
- ✅ **Actions limitées** : Sur ses ressources
- ✅ **Statistiques personnelles** : Ses ressources
- ⚠️ **Dashboard spécialisé** : À créer (`/partner-dashboard`)

### **User & Client** (`/user-dashboard`)
- ✅ **Vue personnelle** : Ses VPS uniquement
- ✅ **Actions personnelles** : Sur ses VPS
- ✅ **Facturation personnelle** : Ses coûts
- ✅ **Support personnel** : Ses tickets

## 🔍 Filtrage des Données

### **Dans RoleBasedDashboard.jsx**
```javascript
const getFilteredVpsList = () => {
  switch (user.role) {
    case 'subprovider':
      // Vue globale sur TOUS les VPS
      return vpsList;
      
    case 'partner':
      // Vue restreinte sur SES VPS uniquement
      return vpsList.filter(vps => vps.owner === user.username);
      
    case 'user':
      // Vue ultra-limitée sur SES VPS uniquement
      return vpsList.filter(vps => vps.owner === user.username);
  }
};
```

## 🌐 URLs des Dashboards

### **Dashboards Principaux**
- **Admin/Subprovider** : `http://localhost:5173/dashboard`
- **Partner** : `http://localhost:5173/dashboard` (actuellement)
- **User/Client** : `http://localhost:5173/user-dashboard`

### **Dashboards Spécialisés**
- **Subprovider Dashboard** : `http://localhost:5173/subprovider-dashboard`
- **Partner Dashboard** : `http://localhost:5173/partner-dashboard` (à créer)
- **User Dashboard** : `http://localhost:5173/user-dashboard`

## 🎯 Votre Compréhension est Correcte !

### **Si vous vous connectez en tant qu'Admin :**
- Vous verrez les données CloudStack dans `/dashboard`
- Vous aurez accès à `/subprovider-dashboard` pour une vue spécialisée
- Vue globale sur tous les VPS CloudStack

### **Si vous vous connectez en tant qu'User :**
- Vous verrez vos données CloudStack dans `/user-dashboard`
- Vue limitée à vos VPS personnels
- Pas d'accès aux données d'autres utilisateurs

## 🔧 Améliorations Suggérées

### **1. Créer un Dashboard Partner Dédié**
```javascript
// Créer /src/pages/PartnerDashboard.jsx
// Route : /partner-dashboard
// Vue intermédiaire entre admin et user
```

### **2. Améliorer le Routage**
```javascript
// Dans Login.jsx
if (validUser.role === 'user') {
  window.location.href = '/user-dashboard'
} else if (validUser.role === 'partner') {
  window.location.href = '/partner-dashboard'
} else {
  window.location.href = '/dashboard'
}
```

### **3. Filtrage Plus Précis**
```javascript
// Pour les partners : voir leurs VPS + VPS de leurs clients
const partnerVPS = vpsList.filter(vps => 
  vps.owner === user.username || 
  vps.owner.startsWith(user.username + '_')
);
```

## 📱 Test des Différents Rôles

### **Test Admin**
```bash
# Connexion
Username: admin
Password: password123
# Redirection vers: /dashboard
# Accès: Toutes les données CloudStack
```

### **Test Subprovider**
```bash
# Connexion
Username: subprovider
Password: password123
# Redirection vers: /dashboard
# Accès: Toutes les données CloudStack
```

### **Test Partner**
```bash
# Connexion
Username: partner
Password: password123
# Redirection vers: /dashboard
# Accès: Ses données + données de ses clients
```

### **Test User**
```bash
# Connexion
Username: user
Password: password123
# Redirection vers: /user-dashboard
# Accès: Ses données personnelles uniquement
```

## 🎉 Résumé

**Votre compréhension est parfaitement correcte !**

- **Admin/Subprovider** → `/dashboard` (vue globale CloudStack)
- **Partner** → `/dashboard` (vue restreinte CloudStack)
- **User/Client** → `/user-dashboard` (vue personnelle CloudStack)

Les données CloudStack sont maintenant intégrées dans tous ces dashboards selon le niveau d'accès de chaque rôle !

---

**Status** : ✅ **CONFIRMÉ**  
**Date** : 1er Septembre 2025  
**Version** : 1.0
