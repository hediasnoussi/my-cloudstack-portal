# 📚 Documentation CloudStack Portal

Ce dossier contient toute la documentation relative à l'intégration CloudStack du portail de gestion.

## 📋 Fichiers de Documentation

### 🎯 Guides Principaux
- **[Guide d'Intégration CloudStack](CLOUDSTACK_INTEGRATION_GUIDE.md)** - Documentation complète de l'intégration
- **[Guide de Démarrage Rapide](QUICK_START_CLOUDSTACK.md)** - Commandes et opérations courantes

### 📖 Contenu des Guides

#### Guide d'Intégration CloudStack
- Architecture de l'intégration
- Configuration backend et frontend
- API endpoints détaillés
- Maintenance et dépannage
- Sécurité et bonnes pratiques
- Monitoring et alertes
- Déploiement en production

#### Guide de Démarrage Rapide
- Commandes de démarrage des services
- Opérations courantes (vérification, redémarrage)
- Dépannage rapide
- Monitoring et métriques
- Mise à jour des configurations

## 🚀 Accès Rapide

### Démarrage des Services
```bash
# Backend
cd backend-nodejs && node index.js

# Frontend
cd src && npm run dev
```

### Test de Connexion
```bash
curl -X GET "http://localhost:3001/api/global/cloudstack/virtual-machines"
```

### Vérification des Données
```bash
# Nombre de VPS
curl -s "http://localhost:3001/api/global/cloudstack/virtual-machines" | jq 'length'

# Nombre de volumes
curl -s "http://localhost:3001/api/global/cloudstack/volumes" | jq 'length'
```

## 📁 Structure du Projet

```
my-cloudstack-portal/
├── docs/                           # 📚 Documentation
│   ├── README.md                   # Ce fichier
│   ├── CLOUDSTACK_INTEGRATION_GUIDE.md
│   └── QUICK_START_CLOUDSTACK.md
├── backend-nodejs/                 # 🔧 Backend
│   ├── cloudstack-api.js          # API CloudStack
│   ├── controllers/
│   └── routes/
└── src/                           # 🎨 Frontend
    ├── services/
    └── pages/
```

## 🔗 Liens Utiles

- **Documentation CloudStack officielle** : https://docs.cloudstack.apache.org/
- **API CloudStack** : https://cloudstack.apache.org/api.html
- **Logs du backend** : `backend-nodejs/logs/`
- **Configuration** : `backend-nodejs/cloudstack-api.js`

## 📞 Support

En cas de problème :
1. Consulter le [Guide de Démarrage Rapide](QUICK_START_CLOUDSTACK.md)
2. Vérifier les logs du backend
3. Tester la connectivité CloudStack
4. Consulter le [Guide d'Intégration](CLOUDSTACK_INTEGRATION_GUIDE.md)

---

*Documentation CloudStack Portal - Version 1.0*
