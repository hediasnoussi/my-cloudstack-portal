# Intégration CloudStack pour les Réseaux

## 🚀 Démarrage Rapide

### 1. Configuration

Assurez-vous que votre fichier `.env` contient les informations CloudStack :

```bash
CLOUDSTACK_API_URL=http://your-cloudstack-server:8080/client/api
CLOUDSTACK_API_KEY=your-api-key
CLOUDSTACK_SECRET_KEY=your-secret-key
CLOUDSTACK_TIMEOUT=30000
```

### 2. Installation des dépendances

```bash
npm install
```

### 3. Test de l'intégration CloudStack

```bash
# Test de l'intégration CloudStack
node test-network-cloudstack.js
```

### 4. Démarrage du serveur

```bash
# Démarrage du serveur avec intégration réseau
node start-network-server.js
```

### 5. Test du serveur

```bash
# Dans un autre terminal
node test-server-network.js
```

## 📋 Endpoints Disponibles

### VPCs (Virtual Private Clouds)

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| GET | `/api/network/vpcs` | Récupérer tous les VPCs |
| GET | `/api/network/vpcs/:id` | Récupérer un VPC spécifique |
| POST | `/api/network/vpcs` | Créer un nouveau VPC |
| PUT | `/api/network/vpcs/:id` | Mettre à jour un VPC |
| DELETE | `/api/network/vpcs/:id` | Supprimer un VPC |

### Réseaux

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| GET | `/api/network/guest-networks` | Récupérer tous les réseaux |
| GET | `/api/network/guest-networks/:id` | Récupérer un réseau spécifique |
| POST | `/api/network/guest-networks` | Créer un nouveau réseau |
| PUT | `/api/network/guest-networks/:id` | Mettre à jour un réseau |
| DELETE | `/api/network/guest-networks/:id` | Supprimer un réseau |

### IP Publiques

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| GET | `/api/network/public-ip-addresses` | Récupérer toutes les IP publiques |
| GET | `/api/network/public-ip-addresses/:id` | Récupérer une IP spécifique |
| POST | `/api/network/public-ip-addresses` | Associer une nouvelle IP publique |
| DELETE | `/api/network/public-ip-addresses/:id` | Libérer une IP publique |

### Groupes de Sécurité

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| GET | `/api/network/security-groups` | Récupérer tous les groupes de sécurité |
| GET | `/api/network/security-groups/:id` | Récupérer un groupe spécifique |
| POST | `/api/network/security-groups` | Créer un nouveau groupe de sécurité |
| DELETE | `/api/network/security-groups/:id` | Supprimer un groupe de sécurité |

## 🔧 Exemples d'Utilisation

### Créer un VPC

```bash
curl -X POST http://localhost:3000/api/network/vpcs \
  -H "Content-Type: application/json" \
  -d '{
    "name": "mon-vpc",
    "displaytext": "Mon VPC de test",
    "cidr": "10.0.0.0/16",
    "vpcofferingid": "b1a77c5e-2fa8-4821-8fe9-7ab193489287",
    "zoneid": "28e45a8a-e1a3-43c2-8174-8061f5ac83b6"
  }'
```

### Créer un réseau

```bash
curl -X POST http://localhost:3000/api/network/guest-networks \
  -H "Content-Type: application/json" \
  -d '{
    "name": "mon-reseau",
    "displaytext": "Mon réseau de test",
    "networkofferingid": "13e40b21-83f1-4f8b-828a-c97db54f77ad",
    "zoneid": "28e45a8a-e1a3-43c2-8174-8061f5ac83b6",
    "gateway": "10.0.1.1",
    "netmask": "255.255.255.0",
    "startip": "10.0.1.10",
    "endip": "10.0.1.100"
  }'
```

### Associer une IP publique

```bash
curl -X POST http://localhost:3000/api/network/public-ip-addresses \
  -H "Content-Type: application/json" \
  -d '{
    "zoneid": "28e45a8a-e1a3-43c2-8174-8061f5ac83b6"
  }'
```

### Créer un groupe de sécurité

```bash
curl -X POST http://localhost:3000/api/network/security-groups \
  -H "Content-Type: application/json" \
  -d '{
    "name": "mon-groupe-securite",
    "description": "Groupe de sécurité pour les serveurs web"
  }'
```

## 📊 Récupération des Données

### Récupérer tous les VPCs

```bash
curl http://localhost:3000/api/network/vpcs
```

### Récupérer tous les réseaux

```bash
curl http://localhost:3000/api/network/guest-networks
```

### Récupérer toutes les IP publiques

```bash
curl http://localhost:3000/api/network/public-ip-addresses
```

### Récupérer tous les groupes de sécurité

```bash
curl http://localhost:3000/api/network/security-groups
```

## 🔍 Tests et Validation

### Test de l'intégration CloudStack

```bash
node test-network-cloudstack.js
```

Ce script teste :
- ✅ Connexion à CloudStack
- ✅ Récupération des VPCs
- ✅ Récupération des réseaux
- ✅ Récupération des IP publiques
- ✅ Récupération des groupes de sécurité
- ✅ Récupération des zones et offerings
- ✅ Test de création/suppression de ressources

### Test du serveur API

```bash
# Démarrer le serveur d'abord
node start-network-server.js

# Puis dans un autre terminal
node test-server-network.js
```

Ce script teste :
- ✅ Endpoints de santé
- ✅ Endpoints de lecture
- ✅ Endpoints de création
- ✅ Gestion des erreurs
- ✅ Validation des paramètres

## 🛠️ Dépannage

### Problèmes courants

1. **Erreur 401 - Non autorisé**
   - Vérifiez vos clés API CloudStack
   - Assurez-vous que l'utilisateur a les permissions nécessaires

2. **Erreur 533 - Ressource non disponible**
   - Vérifiez que les zones et offerings existent
   - Assurez-vous que les ressources sont activées

3. **Erreur de connexion**
   - Vérifiez l'URL de l'API CloudStack
   - Assurez-vous que le serveur CloudStack est accessible

4. **Timeout**
   - Augmentez le timeout dans la configuration
   - Vérifiez la latence réseau

### Logs utiles

```bash
# Activer les logs détaillés
export DEBUG=cloudstack:*

# Voir les requêtes CloudStack
node test-network-cloudstack.js
```

## 📚 Documentation Complète

Pour plus de détails, consultez :
- `NETWORK_CLOUDSTACK_INTEGRATION.md` - Documentation technique complète
- `API_DOCUMENTATION.md` - Documentation des API
- `cloudstack-api.js` - Code source de l'intégration

## 🎯 Prochaines Étapes

1. **Interface utilisateur** - Créer une interface web pour gérer les réseaux
2. **Monitoring** - Ajouter des métriques et alertes
3. **Automatisation** - Scripts de déploiement automatique
4. **Sécurité** - Ajouter l'authentification et l'autorisation
5. **Backup** - Système de sauvegarde des configurations

## 🤝 Contribution

Pour contribuer à ce projet :

1. Fork le repository
2. Créez une branche pour votre fonctionnalité
3. Ajoutez des tests pour votre code
4. Soumettez une pull request

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier LICENSE pour plus de détails.
