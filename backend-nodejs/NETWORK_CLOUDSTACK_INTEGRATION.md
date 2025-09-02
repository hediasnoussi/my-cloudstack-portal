# Intégration CloudStack pour les Réseaux, VPC et IP Publiques

## Vue d'ensemble

Cette documentation décrit l'intégration complète avec CloudStack pour la gestion des ressources réseau, incluant les VPC (Virtual Private Clouds), les réseaux isolés/partagés, les adresses IP publiques et les groupes de sécurité.

## Architecture

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend API    │    │   CloudStack    │
│   (React)       │◄──►│   (Node.js)      │◄──►│   API           │
└─────────────────┘    └──────────────────┘    └─────────────────┘
                              │
                              ▼
                       ┌──────────────────┐
                       │   Controllers    │
                       │   - VPC          │
                       │   - Networks     │
                       │   - Public IPs   │
                       │   - Security     │
                       └──────────────────┘
```

## Fonctionnalités Implémentées

### 1. Gestion des VPC (Virtual Private Clouds)

#### Endpoints API
- `GET /api/network/vpcs` - Récupérer tous les VPCs
- `GET /api/network/vpcs/:id` - Récupérer un VPC spécifique
- `POST /api/network/vpcs` - Créer un nouveau VPC
- `PUT /api/network/vpcs/:id` - Mettre à jour un VPC
- `DELETE /api/network/vpcs/:id` - Supprimer un VPC

#### Exemple de création de VPC
```javascript
// POST /api/network/vpcs
{
  "name": "mon-vpc",
  "displaytext": "Mon VPC de test",
  "cidr": "10.0.0.0/16",
  "vpcofferingid": "uuid-vpc-offering",
  "zoneid": "uuid-zone",
  "account": "admin",
  "domainid": "uuid-domain"
}
```

### 2. Gestion des Réseaux

#### Types de réseaux supportés
- **Réseaux isolés** : Réseaux privés pour les instances
- **Réseaux partagés** : Réseaux partagés entre plusieurs comptes
- **Réseaux VPC** : Réseaux dans un VPC

#### Endpoints API
- `GET /api/network/guest-networks` - Récupérer tous les réseaux
- `GET /api/network/guest-networks/:id` - Récupérer un réseau spécifique
- `POST /api/network/guest-networks` - Créer un nouveau réseau
- `PUT /api/network/guest-networks/:id` - Mettre à jour un réseau
- `DELETE /api/network/guest-networks/:id` - Supprimer un réseau

#### Exemple de création de réseau
```javascript
// POST /api/network/guest-networks
{
  "name": "mon-reseau",
  "displaytext": "Mon réseau de test",
  "networkofferingid": "uuid-network-offering",
  "zoneid": "uuid-zone",
  "account": "admin",
  "domainid": "uuid-domain",
  "vpcid": "uuid-vpc", // Optionnel
  "gateway": "10.0.1.1",
  "netmask": "255.255.255.0",
  "startip": "10.0.1.10",
  "endip": "10.0.1.100"
}
```

### 3. Gestion des IP Publiques

#### Endpoints API
- `GET /api/network/public-ip-addresses` - Récupérer toutes les IP publiques
- `GET /api/network/public-ip-addresses/:id` - Récupérer une IP spécifique
- `POST /api/network/public-ip-addresses` - Associer une nouvelle IP publique
- `PUT /api/network/public-ip-addresses/:id` - Mettre à jour une IP (non supporté par CloudStack)
- `DELETE /api/network/public-ip-addresses/:id` - Libérer une IP publique

#### Exemple d'association d'IP publique
```javascript
// POST /api/network/public-ip-addresses
{
  "zoneid": "uuid-zone",
  "account": "admin",
  "domainid": "uuid-domain",
  "networkid": "uuid-network", // Optionnel
  "vpcid": "uuid-vpc" // Optionnel
}
```

### 4. Gestion des Groupes de Sécurité

#### Endpoints API
- `GET /api/network/security-groups` - Récupérer tous les groupes de sécurité
- `GET /api/network/security-groups/:id` - Récupérer un groupe spécifique
- `POST /api/network/security-groups` - Créer un nouveau groupe de sécurité
- `PUT /api/network/security-groups/:id` - Mettre à jour un groupe (non supporté par CloudStack)
- `DELETE /api/network/security-groups/:id` - Supprimer un groupe de sécurité

#### Exemple de création de groupe de sécurité
```javascript
// POST /api/network/security-groups
{
  "name": "mon-groupe-securite",
  "description": "Groupe de sécurité pour les serveurs web",
  "account": "admin",
  "domainid": "uuid-domain"
}
```

## Configuration CloudStack

### Fichier de configuration (`config.js`)
```javascript
module.exports = {
  cloudstack: {
    apiUrl: 'http://your-cloudstack-server:8080/client/api',
    apiKey: 'your-api-key',
    secretKey: 'your-secret-key',
    timeout: 30000
  }
};
```

### Variables d'environnement
```bash
# .env
CLOUDSTACK_API_URL=http://your-cloudstack-server:8080/client/api
CLOUDSTACK_API_KEY=your-api-key
CLOUDSTACK_SECRET_KEY=your-secret-key
CLOUDSTACK_TIMEOUT=30000
```

## Utilisation des API

### 1. Récupération des ressources

```javascript
// Récupérer tous les VPCs
const response = await fetch('/api/network/vpcs');
const data = await response.json();
console.log(data.data); // Array des VPCs

// Récupérer tous les réseaux
const response = await fetch('/api/network/guest-networks');
const data = await response.json();
console.log(data.data); // Array des réseaux

// Récupérer toutes les IP publiques
const response = await fetch('/api/network/public-ip-addresses');
const data = await response.json();
console.log(data.data); // Array des IP publiques
```

### 2. Création de ressources

```javascript
// Créer un VPC
const vpcData = {
  name: "mon-vpc",
  displaytext: "Mon VPC de test",
  cidr: "10.0.0.0/16",
  vpcofferingid: "uuid-vpc-offering",
  zoneid: "uuid-zone"
};

const response = await fetch('/api/network/vpcs', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(vpcData)
});

const result = await response.json();
console.log(result.data); // VPC créé
```

### 3. Suppression de ressources

```javascript
// Supprimer un VPC
const response = await fetch(`/api/network/vpcs/${vpcId}`, {
  method: 'DELETE'
});

const result = await response.json();
console.log(result.message); // Message de confirmation
```

## Gestion des Erreurs

### Format des réponses d'erreur
```javascript
{
  "success": false,
  "error": "Error message",
  "message": "User-friendly message"
}
```

### Codes d'erreur courants
- `400` - Paramètres manquants ou invalides
- `404` - Ressource non trouvée
- `500` - Erreur serveur ou erreur CloudStack
- `501` - Fonctionnalité non implémentée

### Exemple de gestion d'erreur
```javascript
try {
  const response = await fetch('/api/network/vpcs');
  const data = await response.json();
  
  if (!data.success) {
    console.error('Erreur:', data.message);
    return;
  }
  
  console.log('VPCs:', data.data);
} catch (error) {
  console.error('Erreur réseau:', error);
}
```

## Tests et Validation

### Script de test
```bash
# Tester l'intégration CloudStack
node test-network-cloudstack.js

# Tester uniquement les endpoints API (serveur doit être démarré)
node test-network-cloudstack.js --api-only
```

### Tests inclus
1. Récupération des VPCs
2. Récupération des réseaux
3. Récupération des IP publiques
4. Récupération des groupes de sécurité
5. Récupération des zones et offerings
6. Test de création/suppression de groupes de sécurité
7. Test d'association/libération d'IP publiques
8. Test des endpoints API

## Sécurité

### Authentification
- Utilisation des clés API CloudStack (API Key + Secret Key)
- Signature HMAC-SHA1 pour les requêtes
- Validation des paramètres côté serveur

### Autorisations
- Vérification des permissions CloudStack
- Gestion des comptes et domaines
- Isolation des ressources par compte

## Monitoring et Logs

### Logs de l'API
```javascript
// Exemple de logs
🌐 Récupération de tous les VPCs depuis CloudStack...
✅ 5 VPCs récupérés
🌐 Création du VPC "mon-vpc" dans CloudStack...
✅ VPC "mon-vpc" créé avec succès
```

### Métriques à surveiller
- Temps de réponse des API CloudStack
- Taux de succès des opérations
- Utilisation des ressources réseau
- Erreurs d'authentification

## Limitations et Notes

### Limitations CloudStack
- Certaines opérations de mise à jour ne sont pas supportées
- Les VPC offerings doivent être configurés à l'avance
- Les network offerings doivent être compatibles avec les zones

### Bonnes pratiques
- Toujours vérifier les permissions avant les opérations
- Utiliser des noms uniques pour les ressources
- Libérer les IP publiques non utilisées
- Documenter les configurations réseau

## Support et Dépannage

### Problèmes courants
1. **Erreur d'authentification** : Vérifier les clés API
2. **Ressource non trouvée** : Vérifier les UUIDs
3. **Permission refusée** : Vérifier les droits du compte
4. **Timeout** : Augmenter le timeout dans la configuration

### Debug
```javascript
// Activer les logs détaillés
console.log('🌐 CloudStack API Request:', command);
console.log('URL:', url);
console.log('✅ CloudStack API Response:', response.status);
```

## Évolutions Futures

### Fonctionnalités prévues
- Gestion des ACL (Access Control Lists)
- Support des VPN Site-to-Site
- Gestion des VLANs
- Monitoring avancé des réseaux
- Interface graphique pour la configuration

### Améliorations techniques
- Cache des ressources fréquemment utilisées
- Pagination pour les grandes listes
- Webhooks pour les événements réseau
- API GraphQL pour les requêtes complexes
