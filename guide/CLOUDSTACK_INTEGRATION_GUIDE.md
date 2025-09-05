# Guide d'Intégration CloudStack - Portail de Gestion

## Table des Matières
1. [Vue d'ensemble](#vue-densemble)
2. [Architecture de l'Intégration](#architecture-de-lintégration)
3. [Configuration Backend](#configuration-backend)
4. [Configuration Frontend](#configuration-frontend)
5. [API Endpoints](#api-endpoints)
6. [Maintenance et Dépannage](#maintenance-et-dépannage)
7. [Sécurité](#sécurité)
8. [Monitoring](#monitoring)

---

## 🎯 Vue d'ensemble

Ce portail est intégré avec l'API CloudStack pour gérer les ressources cloud en temps réel. L'intégration permet de :
- **Récupérer** les données CloudStack (VPS, Volumes, Snapshots, ISOs, Événements)
- **Créer** de nouvelles ressources (VPS)
- **Modifier** les ressources existantes
- **Supprimer** les ressources
- **Afficher** les données en temps réel dans l'interface utilisateur

---

## 🏗️ Architecture de l'Intégration

### Structure des Fichiers
```
my-cloudstack-portal/
├── backend-nodejs/
│   ├── cloudstack-api.js          # API CloudStack directe
│   ├── controllers/
│   │   └── cloudstackController.js # Contrôleurs backend
│   └── routes/
│       └── global.js               # Routes API
├── src/
│   ├── services/
│   │   └── cloudstackService.js   # Service frontend
│   └── pages/
│       ├── Dashboard.tsx           # Dashboard avec données CloudStack
│       ├── Instances.jsx           # Gestion des VPS
│       ├── Snapshots.jsx           # Gestion des snapshots
│       └── ISOs.jsx                # Gestion des ISOs
```

### Flux de Données
```
CloudStack API ←→ cloudstack-api.js ←→ cloudstackController.js ←→ Routes ←→ Frontend ←→ Interface Utilisateur
```

---

## ⚙️ Configuration Backend

### 1. Configuration CloudStack (`cloudstack-api.js`)

```javascript
class CloudStackAPI {
  constructor() {
    this.apiUrl = 'http://172.21.23.1/client/api';
    this.apiKey = 't2hpRTeUKriGGhUlD5onpNOWoEtJ8v3j759mcHlAocz37lwL7ZJtyQ_ABYSM3KWSOIlu4KR3ILiWMUtX9CUHdQ';
    this.secretKey = 'VOTRE_CLE_SECRETE';
  }
}
```

**Variables à configurer :**
- `apiUrl` : URL de votre serveur CloudStack
- `apiKey` : Clé API CloudStack
- `secretKey` : Clé secrète CloudStack

### 2. Contrôleurs (`cloudstackController.js`)

Les contrôleurs gèrent les appels API et transforment les données :

```javascript
// Exemple : Récupération des VPS
const getCloudStackVirtualMachines = async (req, res) => {
  try {
    const instances = await cloudstackAPI.getVirtualMachines();
    const transformedInstances = instances.map(instance => ({
      id: instance.id,
      name: instance.name,
      state: instance.state,
      // ... autres propriétés
    }));
    res.json(transformedInstances);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
```

### 3. Routes (`global.js`)

```javascript
// Routes CloudStack
router.get('/cloudstack/virtual-machines', cloudstackController.getCloudStackVirtualMachines);
router.get('/cloudstack/volumes', cloudstackController.getCloudStackVolumes);
router.get('/cloudstack/snapshots', cloudstackController.getCloudStackSnapshots);
router.get('/cloudstack/isos', cloudstackController.getCloudStackISOs);
router.get('/cloudstack/events', cloudstackController.getCloudStackEvents);
```

---

## 🎨 Configuration Frontend

### 1. Service CloudStack (`cloudstackService.js`)

```javascript
const cloudstackService = {
  // Récupération des VPS
  getVirtualMachines: async () => {
    const response = await api.get('/api/global/cloudstack/virtual-machines');
    return response.data;
  },
  
  // Création d'un VPS
  deployVirtualMachine: async (vmData) => {
    const response = await api.post('/api/global/cloudstack/virtual-machines', vmData);
    return response.data;
  }
};
```

### 2. Utilisation dans les Composants

```javascript
// Exemple dans Dashboard.tsx
const fetchData = async () => {
  const [instances, volumes, snapshots, events, isos] = await Promise.all([
    cloudstackService.getVirtualMachines(),
    cloudstackService.getVolumes(),
    cloudstackService.getSnapshots(),
    cloudstackService.getEvents(),
    cloudstackService.getISOs()
  ]);
  setData({ instances, volumes, snapshots, events, isos });
};
```

---

## 🔌 API Endpoints

### Endpoints Principaux

| Endpoint | Méthode | Description |
|----------|---------|-------------|
| `/api/global/cloudstack/virtual-machines` | GET | Récupérer tous les VPS |
| `/api/global/cloudstack/virtual-machines` | POST | Créer un nouveau VPS |
| `/api/global/cloudstack/volumes` | GET | Récupérer tous les volumes |
| `/api/global/cloudstack/snapshots` | GET | Récupérer tous les snapshots |
| `/api/global/cloudstack/isos` | GET | Récupérer tous les ISOs |
| `/api/global/cloudstack/events` | GET | Récupérer tous les événements |

### Exemple de Requête

```bash
# Test de l'API VPS
curl -X GET "http://localhost:3001/api/global/cloudstack/virtual-machines"

# Test de l'API Volumes
curl -X GET "http://localhost:3001/api/global/cloudstack/volumes"
```

---

## 🔧 Maintenance et Dépannage

### 1. Vérification de la Connexion

```bash
# Vérifier que le backend fonctionne
curl -X GET "http://localhost:3001/api/global/cloudstack/virtual-machines"

# Vérifier les logs du backend
tail -f /home/cloudstackportal/billingsolutions/my-cloudstack-portal/backend-nodejs/logs/app.log
```

### 2. Problèmes Courants

#### Erreur 401 - Authentification
```javascript
// Vérifier les clés API dans cloudstack-api.js
console.log('API Key:', this.apiKey);
console.log('Secret Key:', this.secretKey);
```

#### Erreur 500 - Serveur CloudStack
```bash
# Vérifier l'accessibilité du serveur CloudStack
ping 172.21.23.1
telnet 172.21.23.1 80
```

#### Erreur CORS
```javascript
// Vérifier la configuration proxy dans vite.config.js
proxy: {
  '/api': {
    target: 'http://localhost:3001',
    changeOrigin: true,
    secure: false,
  }
}
```

### 3. Logs de Débogage

```javascript
// Activer les logs détaillés
console.log('🔄 Chargement des données CloudStack...');
console.log('✅ Données CloudStack récupérées:', data);
console.error('❌ Erreur lors du chargement:', error);
```

---

## 🔒 Sécurité

### 1. Clés API
- **Ne jamais** commiter les clés API dans Git
- Utiliser des variables d'environnement
- Roter régulièrement les clés

### 2. Variables d'Environnement

```bash
# Créer un fichier .env
CLOUDSTACK_API_URL=http://172.21.23.1/client/api
CLOUDSTACK_API_KEY=votre_cle_api
CLOUDSTACK_SECRET_KEY=votre_cle_secrete
```

### 3. Validation des Données

```javascript
// Valider les données entrantes
const validateVMData = (vmData) => {
  if (!vmData.name || !vmData.templateid) {
    throw new Error('Données VPS invalides');
  }
};
```

---

## 📊 Monitoring

### 1. Métriques à Surveiller

- **Temps de réponse** des API CloudStack
- **Taux d'erreur** des requêtes
- **Nombre de VPS** actifs/arrêtés
- **Utilisation des ressources** (CPU, RAM, Stockage)

### 2. Alertes

```javascript
// Exemple d'alerte en cas d'erreur
if (error.response?.status === 500) {
  console.error('🚨 Erreur critique CloudStack API');
  // Envoyer une notification
}
```

### 3. Health Check

```bash
# Script de vérification automatique
#!/bin/bash
response=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3001/api/global/cloudstack/virtual-machines)
if [ $response -ne 200 ]; then
    echo "ALERTE: API CloudStack non accessible"
    # Envoyer notification
fi
```

---

## 🚀 Déploiement

### 1. Prérequis
- Node.js 16+
- Accès au serveur CloudStack
- Clés API CloudStack valides

### 2. Installation

```bash
# Backend
cd backend-nodejs
npm install
node index.js

# Frontend
cd src
npm install
npm run dev
```

### 3. Variables d'Environnement

```bash
# Production
export NODE_ENV=production
export CLOUDSTACK_API_URL=http://votre-serveur-cloudstack/client/api
export CLOUDSTACK_API_KEY=votre_cle_api_production
export CLOUDSTACK_SECRET_KEY=votre_cle_secrete_production
```

---

## 📝 Notes Importantes

### 1. Gestion des Erreurs
- Toujours gérer les erreurs API avec try/catch
- Fournir des messages d'erreur clairs aux utilisateurs
- Implémenter des retry automatiques pour les erreurs temporaires

### 2. Performance
- Utiliser `Promise.all()` pour les requêtes parallèles
- Mettre en cache les données statiques (templates, ISOs)
- Implémenter la pagination pour les grandes listes

### 3. Mise à Jour
- Tester les nouvelles fonctionnalités sur un environnement de développement
- Maintenir la compatibilité avec les versions CloudStack
- Documenter les changements d'API

---

## 📞 Support

En cas de problème :
1. Vérifier les logs du backend
2. Tester la connectivité CloudStack
3. Vérifier la validité des clés API
4. Consulter la documentation CloudStack officielle

---

*Dernière mise à jour : Septembre 2025*
*Version : 1.0*
