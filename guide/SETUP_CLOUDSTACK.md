# 🚀 Guide d'Installation et Configuration CloudStack Portal

## 📋 Prérequis

- Node.js 18+ installé
- MySQL/MariaDB installé et configuré
- Accès à un serveur CloudStack avec clés API
- Git installé

## 🔧 Installation

### 1. Cloner le projet
```bash
git clone <votre-repo>
cd my-cloudstack-portal
```

### 2. Installer les dépendances
```bash
# Frontend
npm install

# Backend
cd backend-nodejs
npm install
```

### 3. Configuration de l'environnement

#### Créer le fichier `.env` dans `backend-nodejs/`
```bash
cp env.example .env
```

#### Modifier le fichier `.env` avec vos informations CloudStack :
```env
# Configuration CloudStack
CLOUDSTACK_API_URL=http://VOTRE_SERVEUR_CLOUDSTACK:8080/client/api
CLOUDSTACK_API_KEY=VOTRE_API_KEY
CLOUDSTACK_SECRET_KEY=VOTRE_SECRET_KEY

# Configuration Base de données
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=VOTRE_MOT_DE_PASSE_DB
DB_NAME=cloudstack_portal

# Configuration Serveur
PORT=3001

# Configuration JWT
JWT_SECRET=VOTRE_CLE_JWT_SECRETE
JWT_EXPIRES_IN=24h
```

## 🗄️ Configuration de la Base de Données

### 1. Créer la base de données
```sql
CREATE DATABASE cloudstack_portal;
```

### 2. Initialiser les tables
```bash
cd backend-nodejs
npm run setup
```

## 🧪 Test de Connexion CloudStack

### 1. Vérifier la configuration
```bash
cd backend-nodejs
node test-cloudstack-connection.js
```

### 2. Résoudre les erreurs courantes

#### Erreur de connexion refusée :
- Vérifiez que le serveur CloudStack est démarré
- Vérifiez l'URL et le port dans `CLOUDSTACK_API_URL`
- Vérifiez les règles de pare-feu

#### Erreur d'authentification :
- Vérifiez vos clés API CloudStack
- Vérifiez les permissions de votre compte
- Vérifiez que l'API est activée sur CloudStack

## 🚀 Démarrage de l'Application

### 1. Démarrer le backend
```bash
cd backend-nodejs
npm start
# ou pour le développement
npm run dev
```

### 2. Démarrer le frontend (dans un autre terminal)
```bash
npm run dev
```

### 3. Accéder à l'application
- Frontend : http://localhost:5173
- Backend API : http://localhost:3001

## 🔑 Obtention des Clés API CloudStack

### 1. Via l'interface web CloudStack
1. Connectez-vous à l'interface web CloudStack
2. Allez dans "Account" → "Users"
3. Sélectionnez votre utilisateur
4. Cliquez sur "Generate Keys"
5. Copiez l'API Key et la Secret Key

### 2. Via l'API CloudStack
```bash
# Récupérer les clés existantes
curl "http://VOTRE_SERVEUR:8080/client/api?command=listUsers&username=VOTRE_USERNAME&response=json"

# Générer de nouvelles clés
curl "http://VOTRE_SERVEUR:8080/client/api?command=registerUserKeys&id=USER_ID&response=json"
```

## 📊 Fonctionnalités Disponibles

### ✅ Gestion des Instances
- Création, modification, suppression d'instances
- Gestion des snapshots
- Gestion des groupes d'instances
- Gestion des clés SSH

### ✅ Gestion du Stockage
- Gestion des volumes
- Gestion des snapshots de volumes
- Gestion des templates

### ✅ Gestion du Réseau
- Gestion des VPC
- Gestion des sous-réseaux
- Gestion des groupes de sécurité
- Gestion des équilibreurs de charge

### ✅ Gestion des Projets
- Création et gestion de projets
- Gestion des quotas
- Gestion des utilisateurs

### ✅ Facturation et Quotas
- Suivi des quotas
- Calcul des coûts
- Rapports d'utilisation

## 🔍 Vérification du Fonctionnement

### 1. Test des endpoints API
```bash
# Test de base
curl http://localhost:3001/test

# Test des instances
curl http://localhost:3001/api/compute/instances

# Test des statistiques
curl http://localhost:3001/api/global/stats
```

### 2. Vérification des logs
```bash
# Backend logs
tail -f backend-nodejs/logs/app.log

# Vérifier les erreurs
grep "ERROR" backend-nodejs/logs/app.log
```

## 🛠️ Dépannage

### Problème de CORS
- Vérifiez la configuration CORS dans `backend-nodejs/index.js`
- Ajoutez votre domaine frontend dans les origines autorisées

### Problème de base de données
- Vérifiez la connexion MySQL
- Vérifiez les permissions utilisateur
- Vérifiez que la base existe

### Problème d'API CloudStack
- Vérifiez la connectivité réseau
- Vérifiez les clés API
- Vérifiez les permissions du compte

## 📚 Ressources Utiles

- [Documentation CloudStack API](https://cloudstack.apache.org/api.html)
- [CloudStack Developer Guide](https://docs.cloudstack.apache.org/en/latest/developers-guide/)
- [Node.js CloudStack SDK](https://www.npmjs.com/package/cloudstack)

## 🆘 Support

En cas de problème :
1. Vérifiez les logs du backend
2. Testez la connexion CloudStack avec le script de test
3. Vérifiez la configuration dans le fichier `.env`
4. Consultez la documentation CloudStack

