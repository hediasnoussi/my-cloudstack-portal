# 📚 Index de la Documentation CloudStack Portal

## 🎯 Navigation Rapide

### 📖 Guides Principaux
- **[README Principal](README.md)** - Vue d'ensemble et accès rapide
- **[Guide d'Intégration](CLOUDSTACK_INTEGRATION_GUIDE.md)** - Documentation complète de l'intégration
- **[Démarrage Rapide](QUICK_START_CLOUDSTACK.md)** - Commandes et opérations courantes
- **[Exemples de Configuration](CONFIGURATION_EXAMPLE.md)** - Configurations types

---

## 🔍 Recherche par Sujet

### 🚀 **Démarrage et Installation**
- [Guide de Démarrage Rapide](QUICK_START_CLOUDSTACK.md#démarrage-rapide)
- [Installation et Configuration](CLOUDSTACK_INTEGRATION_GUIDE.md#déploiement)
- [Prérequis](CLOUDSTACK_INTEGRATION_GUIDE.md#prérequis)

### ⚙️ **Configuration**
- [Configuration Backend](CONFIGURATION_EXAMPLE.md#configuration-backend)
- [Configuration Frontend](CONFIGURATION_EXAMPLE.md#configuration-frontend)
- [Variables d'Environnement](CONFIGURATION_EXAMPLE.md#variables-denvironnement)
- [Configuration Production](CONFIGURATION_EXAMPLE.md#configuration-production)

### 🔧 **Maintenance et Dépannage**
- [Dépannage Rapide](QUICK_START_CLOUDSTACK.md#dépannage-rapide)
- [Maintenance Avancée](CLOUDSTACK_INTEGRATION_GUIDE.md#maintenance-et-dépannage)
- [Monitoring](CLOUDSTACK_INTEGRATION_GUIDE.md#monitoring)
- [Logs et Debug](QUICK_START_CLOUDSTACK.md#vérifier-les-logs)

### 🔌 **API et Endpoints**
- [Endpoints Principaux](CLOUDSTACK_INTEGRATION_GUIDE.md#api-endpoints)
- [Configuration des Routes](CONFIGURATION_EXAMPLE.md#endpoints-configuration)
- [Test des API](QUICK_START_CLOUDSTACK.md#test-de-connexion)

### 🔒 **Sécurité**
- [Bonnes Pratiques](CLOUDSTACK_INTEGRATION_GUIDE.md#sécurité)
- [Configuration CORS](CONFIGURATION_EXAMPLE.md#configuration-sécurité)
- [Rate Limiting](CONFIGURATION_EXAMPLE.md#rate-limiting)

---

## 📋 Checklist de Déploiement

### ✅ **Préparation**
- [ ] Node.js 16+ installé
- [ ] Accès au serveur CloudStack
- [ ] Clés API CloudStack obtenues
- [ ] Variables d'environnement configurées

### ✅ **Installation**
- [ ] Dépendances frontend installées (`npm install`)
- [ ] Dépendances backend installées (`cd backend-nodejs && npm install`)
- [ ] Configuration CloudStack mise à jour
- [ ] Ports vérifiés (3001, 5173)

### ✅ **Test**
- [ ] Backend démarré (`node index.js`)
- [ ] Frontend démarré (`npm run dev`)
- [ ] API testée (`curl -X GET "http://localhost:3001/api/global/cloudstack/virtual-machines"`)
- [ ] Dashboard accessible

### ✅ **Production**
- [ ] Variables d'environnement sécurisées
- [ ] HTTPS configuré
- [ ] Monitoring activé
- [ ] Logs configurés

---

## 🚨 Problèmes Courants

### **Erreur 401 - Authentification**
- [Vérifier les clés API](QUICK_START_CLOUDSTACK.md#problème--erreur-401-authentification)
- [Configuration CloudStack](CONFIGURATION_EXAMPLE.md#configuration-cloudstack-api)

### **Erreur 500 - Serveur CloudStack**
- [Tester la connectivité](QUICK_START_CLOUDSTACK.md#problème--erreur-500-serveur-cloudstack)
- [Vérifier l'URL CloudStack](CONFIGURATION_EXAMPLE.md#configuration-cloudstack-api)

### **CORS - Frontend ne charge pas**
- [Vérifier le proxy Vite](QUICK_START_CLOUDSTACK.md#problème--frontend-ne-charge-pas-les-données)
- [Configuration CORS](CONFIGURATION_EXAMPLE.md#cors-configuration)

### **Données non synchronisées**
- [Vérifier les logs backend](QUICK_START_CLOUDSTACK.md#vérifier-les-logs)
- [Test des endpoints](QUICK_START_CLOUDSTACK.md#vérifier-les-données-cloudstack)

---

## 📞 Support et Contact

### **Documentation Officielle**
- [CloudStack Documentation](https://docs.cloudstack.apache.org/)
- [CloudStack API Reference](https://cloudstack.apache.org/api.html)

### **Ressources Locales**
- **Logs Backend** : `backend-nodejs/logs/`
- **Configuration** : `backend-nodejs/cloudstack-api.js`
- **Service Frontend** : `src/services/cloudstackService.js`

### **Commandes de Diagnostic**
```bash
# État des services
ps aux | grep -E "(node|vite)"

# Test API
curl -X GET "http://localhost:3001/api/global/cloudstack/virtual-machines"

# Logs en temps réel
tail -f backend-nodejs/logs/app.log
```

---

## 📝 Notes de Version

### **Version 1.0** (Septembre 2025)
- ✅ Intégration CloudStack complète
- ✅ Dashboard en temps réel
- ✅ Gestion des VPS, volumes, snapshots
- ✅ Interface utilisateur moderne
- ✅ Documentation complète

### **Prochaines Versions**
- 🔄 Authentification utilisateur
- 🔄 Notifications en temps réel
- 🔄 API REST complète
- 🔄 Monitoring avancé

---

*Index de Documentation - Version 1.0*
