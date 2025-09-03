# Guide de Démarrage Rapide - CloudStack Integration

## 🚀 Démarrage Rapide

### 1. Démarrer les Services
```bash
# Backend (port 3001)
cd backend-nodejs
node index.js

# Frontend (port 5173)
cd src
npm run dev
```

### 2. Vérifier la Connexion
```bash
# Test API VPS
curl -X GET "http://localhost:3001/api/global/cloudstack/virtual-machines"

# Test API Volumes
curl -X GET "http://localhost:3001/api/global/cloudstack/volumes"
```

---

## 🔧 Opérations Courantes

### Vérifier les Données CloudStack
```bash
# VPS
curl -s "http://localhost:3001/api/global/cloudstack/virtual-machines" | jq 'length'

# Volumes
curl -s "http://localhost:3001/api/global/cloudstack/volumes" | jq 'length'

# Snapshots
curl -s "http://localhost:3001/api/global/cloudstack/snapshots" | jq 'length'

# ISOs
curl -s "http://localhost:3001/api/global/cloudstack/isos" | jq 'length'

# Événements
curl -s "http://localhost:3001/api/global/cloudstack/events" | jq 'length'
```

### Redémarrer les Services
```bash
# Arrêter le backend
pkill -f "node index.js"

# Redémarrer le backend
cd backend-nodejs && node index.js

# Redémarrer le frontend
cd src && npm run dev
```

---

## 🐛 Dépannage Rapide

### Problème : Erreur 401 (Authentification)
```bash
# Vérifier les clés API
grep -r "apiKey" backend-nodejs/cloudstack-api.js
```

### Problème : Erreur 500 (Serveur CloudStack)
```bash
# Tester la connectivité
ping 172.21.23.1
curl -I "http://172.21.23.1/client/api"
```

### Problème : Frontend ne charge pas les données
```bash
# Vérifier le proxy Vite
cat vite.config.js | grep -A 5 "proxy"
```

---

## 📊 Monitoring Rapide

### Vérifier les Logs
```bash
# Logs backend en temps réel
tail -f backend-nodejs/logs/app.log

# Logs frontend (console navigateur)
# Ouvrir F12 dans le navigateur
```

### Métriques Clés
```bash
# Nombre de VPS actifs
curl -s "http://localhost:3001/api/global/cloudstack/virtual-machines" | jq '[.[] | select(.state == "Running")] | length'

# Nombre de volumes attachés
curl -s "http://localhost:3001/api/global/cloudstack/volumes" | jq '[.[] | select(.vmname != null)] | length'
```

---

## 🔄 Mise à Jour

### Mettre à Jour les Clés API
1. Modifier `backend-nodejs/cloudstack-api.js`
2. Redémarrer le backend
3. Tester avec `curl -X GET "http://localhost:3001/api/global/cloudstack/virtual-machines"`

### Mettre à Jour l'URL CloudStack
1. Modifier `apiUrl` dans `cloudstack-api.js`
2. Redémarrer le backend
3. Vérifier la connectivité

---

## 📞 Support Rapide

### Commandes de Diagnostic
```bash
# État des services
ps aux | grep -E "(node|vite)"

# Ports utilisés
netstat -tlnp | grep -E "(3001|5173)"

# Logs d'erreur
grep -i error backend-nodejs/logs/app.log
```

### Contacts
- **Documentation complète** : `CLOUDSTACK_INTEGRATION_GUIDE.md`
- **Logs détaillés** : `backend-nodejs/logs/`
- **Configuration** : `backend-nodejs/cloudstack-api.js`

---

*Guide de démarrage rapide - Version 1.0*
