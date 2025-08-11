 # CloudStack Portal API Documentation

## Vue d'ensemble

Cette API RESTful gère tous les modules de votre plateforme CloudStack :
- **Global** : Domaines, rôles, comptes, zones
- **Compute** : Instances, snapshots, clusters Kubernetes, groupes d'auto-scaling
- **Storage** : Volumes, snapshots, backups, buckets, systèmes de fichiers partagés
- **Network** : VPCs, réseaux, groupes de sécurité, VPN, adresses IP publiques
- **Projects** : Gestion des projets avec analytics et coûts

## Base URL

```
http://localhost:3001/api
```

## Modules

### 1. Global (`/api/global`)

#### Domaines
- `GET /domains` - Liste tous les domaines
- `GET /domains/:id` - Récupère un domaine par ID
- `POST /domains` - Crée un nouveau domaine
- `PUT /domains/:id` - Met à jour un domaine
- `DELETE /domains/:id` - Supprime un domaine

#### Rôles
- `GET /roles` - Liste tous les rôles
- `GET /roles/:id` - Récupère un rôle par ID
- `POST /roles` - Crée un nouveau rôle
- `PUT /roles/:id` - Met à jour un rôle
- `DELETE /roles/:id` - Supprime un rôle

#### Comptes
- `GET /accounts` - Liste tous les comptes
- `GET /accounts/:id` - Récupère un compte par ID
- `POST /accounts` - Crée un nouveau compte
- `PUT /accounts/:id` - Met à jour un compte
- `DELETE /accounts/:id` - Supprime un compte

#### Zones
- `GET /zones` - Liste toutes les zones
- `GET /zones/:id` - Récupère une zone par ID
- `POST /zones` - Crée une nouvelle zone
- `PUT /zones/:id` - Met à jour une zone
- `DELETE /zones/:id` - Supprime une zone

### 2. Compute (`/api/compute`)

#### Instances
- `GET /instances` - Liste toutes les instances
- `GET /instances/:id` - Récupère une instance par ID
- `POST /instances` - Crée une nouvelle instance
- `PUT /instances/:id` - Met à jour une instance
- `DELETE /instances/:id` - Supprime une instance

#### Snapshots d'instances
- `GET /instance-snapshots` - Liste tous les snapshots
- `GET /instance-snapshots/:id` - Récupère un snapshot par ID
- `POST /instance-snapshots` - Crée un nouveau snapshot
- `PUT /instance-snapshots/:id` - Met à jour un snapshot
- `DELETE /instance-snapshots/:id` - Supprime un snapshot

#### Clusters Kubernetes
- `GET /kubernetes-clusters` - Liste tous les clusters
- `GET /kubernetes-clusters/:id` - Récupère un cluster par ID
- `POST /kubernetes-clusters` - Crée un nouveau cluster
- `PUT /kubernetes-clusters/:id` - Met à jour un cluster
- `DELETE /kubernetes-clusters/:id` - Supprime un cluster

#### Groupes d'auto-scaling
- `GET /autoscaling-groups` - Liste tous les groupes
- `GET /autoscaling-groups/:id` - Récupère un groupe par ID
- `POST /autoscaling-groups` - Crée un nouveau groupe
- `PUT /autoscaling-groups/:id` - Met à jour un groupe
- `DELETE /autoscaling-groups/:id` - Supprime un groupe

#### Groupes d'instances
- `GET /instance-groups` - Liste tous les groupes
- `GET /instance-groups/:id` - Récupère un groupe par ID
- `POST /instance-groups` - Crée un nouveau groupe
- `PUT /instance-groups/:id` - Met à jour un groupe
- `DELETE /instance-groups/:id` - Supprime un groupe

#### Clés SSH
- `GET /ssh-key-pairs` - Liste toutes les clés SSH
- `GET /ssh-key-pairs/:id` - Récupère une clé SSH par ID
- `POST /ssh-key-pairs` - Crée une nouvelle clé SSH
- `PUT /ssh-key-pairs/:id` - Met à jour une clé SSH
- `DELETE /ssh-key-pairs/:id` - Supprime une clé SSH

#### User Data
- `GET /user-data` - Liste tous les user data
- `GET /user-data/:id` - Récupère un user data par ID
- `POST /user-data` - Crée un nouveau user data
- `PUT /user-data/:id` - Met à jour un user data
- `DELETE /user-data/:id` - Supprime un user data

### 3. Storage (`/api/storage`)

#### Volumes
- `GET /volumes` - Liste tous les volumes
- `GET /volumes/:id` - Récupère un volume par ID
- `POST /volumes` - Crée un nouveau volume
- `PUT /volumes/:id` - Met à jour un volume
- `DELETE /volumes/:id` - Supprime un volume

#### Snapshots de volumes
- `GET /volume-snapshots` - Liste tous les snapshots
- `GET /volume-snapshots/:id` - Récupère un snapshot par ID
- `POST /volume-snapshots` - Crée un nouveau snapshot
- `PUT /volume-snapshots/:id` - Met à jour un snapshot
- `DELETE /volume-snapshots/:id` - Supprime un snapshot

#### Backups
- `GET /backups` - Liste tous les backups
- `GET /backups/:id` - Récupère un backup par ID
- `POST /backups` - Crée un nouveau backup
- `PUT /backups/:id` - Met à jour un backup
- `DELETE /backups/:id` - Supprime un backup

#### Buckets
- `GET /buckets` - Liste tous les buckets
- `GET /buckets/:id` - Récupère un bucket par ID
- `POST /buckets` - Crée un nouveau bucket
- `PUT /buckets/:id` - Met à jour un bucket
- `DELETE /buckets/:id` - Supprime un bucket

#### Systèmes de fichiers partagés
- `GET /shared-file-systems` - Liste tous les systèmes
- `GET /shared-file-systems/:id` - Récupère un système par ID
- `POST /shared-file-systems` - Crée un nouveau système
- `PUT /shared-file-systems/:id` - Met à jour un système
- `DELETE /shared-file-systems/:id` - Supprime un système

### 4. Network (`/api/network`)

#### VPCs
- `GET /vpcs` - Liste tous les VPCs
- `GET /vpcs/:id` - Récupère un VPC par ID
- `POST /vpcs` - Crée un nouveau VPC
- `PUT /vpcs/:id` - Met à jour un VPC
- `DELETE /vpcs/:id` - Supprime un VPC

#### Réseaux invités
- `GET /guest-networks` - Liste tous les réseaux
- `GET /guest-networks/:id` - Récupère un réseau par ID
- `POST /guest-networks` - Crée un nouveau réseau
- `PUT /guest-networks/:id` - Met à jour un réseau
- `DELETE /guest-networks/:id` - Supprime un réseau

#### Groupes de sécurité
- `GET /security-groups` - Liste tous les groupes
- `GET /security-groups/:id` - Récupère un groupe par ID
- `POST /security-groups` - Crée un nouveau groupe
- `PUT /security-groups/:id` - Met à jour un groupe
- `DELETE /security-groups/:id` - Supprime un groupe

#### Appliances VNF
- `GET /vnf-appliances` - Liste toutes les appliances
- `GET /vnf-appliances/:id` - Récupère une appliance par ID
- `POST /vnf-appliances` - Crée une nouvelle appliance
- `PUT /vnf-appliances/:id` - Met à jour une appliance
- `DELETE /vnf-appliances/:id` - Supprime une appliance

#### Adresses IP publiques
- `GET /public-ip-addresses` - Liste toutes les adresses
- `GET /public-ip-addresses/:id` - Récupère une adresse par ID
- `POST /public-ip-addresses` - Crée une nouvelle adresse
- `PUT /public-ip-addresses/:id` - Met à jour une adresse
- `DELETE /public-ip-addresses/:id` - Supprime une adresse

#### Numéros AS
- `GET /as-numbers` - Liste tous les numéros AS
- `GET /as-numbers/:id` - Récupère un numéro AS par ID
- `POST /as-numbers` - Crée un nouveau numéro AS
- `PUT /as-numbers/:id` - Met à jour un numéro AS
- `DELETE /as-numbers/:id` - Supprime un numéro AS

#### VPN Site-to-Site
- `GET /site-to-site-vpn` - Liste tous les VPN
- `GET /site-to-site-vpn/:id` - Récupère un VPN par ID
- `POST /site-to-site-vpn` - Crée un nouveau VPN
- `PUT /site-to-site-vpn/:id` - Met à jour un VPN
- `DELETE /site-to-site-vpn/:id` - Supprime un VPN

#### Utilisateurs VPN
- `GET /vpn-users` - Liste tous les utilisateurs VPN
- `GET /vpn-users/:id` - Récupère un utilisateur par ID
- `POST /vpn-users` - Crée un nouvel utilisateur
- `PUT /vpn-users/:id` - Met à jour un utilisateur
- `DELETE /vpn-users/:id` - Supprime un utilisateur

#### Passerelles VPN client
- `GET /vpn-customer-gateways` - Liste toutes les passerelles
- `GET /vpn-customer-gateways/:id` - Récupère une passerelle par ID
- `POST /vpn-customer-gateways` - Crée une nouvelle passerelle
- `PUT /vpn-customer-gateways/:id` - Met à jour une passerelle
- `DELETE /vpn-customer-gateways/:id` - Supprime une passerelle

#### VLANs invités
- `GET /guest-vlans` - Liste tous les VLANs
- `GET /guest-vlans/:id` - Récupère un VLAN par ID
- `POST /guest-vlans` - Crée un nouveau VLAN
- `PUT /guest-vlans/:id` - Met à jour un VLAN
- `DELETE /guest-vlans/:id` - Supprime un VLAN

#### Sous-réseaux IPv4
- `GET /ipv4-subnets` - Liste tous les sous-réseaux
- `GET /ipv4-subnets/:id` - Récupère un sous-réseau par ID
- `POST /ipv4-subnets` - Crée un nouveau sous-réseau
- `PUT /ipv4-subnets/:id` - Met à jour un sous-réseau
- `DELETE /ipv4-subnets/:id` - Supprime un sous-réseau

### 5. Projects (`/api/projects`)

#### CRUD des projets
- `GET /projects` - Liste tous les projets
- `GET /projects/:id` - Récupère un projet par ID
- `POST /projects` - Crée un nouveau projet
- `PUT /projects/:id` - Met à jour un projet
- `DELETE /projects/:id` - Supprime un projet

#### Analytics des projets
- `GET /projects/:id/statistics` - Statistiques du projet
- `GET /projects/:id/resources` - Ressources du projet
- `GET /projects/:id/members` - Membres du projet
- `GET /projects/:id/activity` - Activité récente du projet
- `GET /projects/:id/costs` - Coûts du projet

## Exemples d'utilisation

### Créer une instance
```bash
curl -X POST http://localhost:3001/api/compute/instances \
  -H "Content-Type: application/json" \
  -d '{
    "name": "web-server-01",
    "state": "running",
    "internal_name": "i-12345678",
    "ip_address": "192.168.1.100",
    "architecture": "x86_64",
    "host": "host-01",
    "account_id": 1,
    "zone_id": 1
  }'
```

### Créer un volume
```bash
curl -X POST http://localhost:3001/api/storage/volumes \
  -H "Content-Type: application/json" \
  -d '{
    "name": "data-volume-01",
    "state": "ready",
    "size": 100,
    "type": "SSD",
    "instance_name": "web-server-01",
    "storage": "storage-01",
    "account_id": 1,
    "zone_id": 1
  }'
```

### Créer un VPC
```bash
curl -X POST http://localhost:3001/api/network/vpcs \
  -H "Content-Type: application/json" \
  -d '{
    "name": "production-vpc",
    "state": "active",
    "description": "VPC pour l\'environnement de production",
    "cidr": "10.0.0.0/16",
    "account_id": 1,
    "domain_id": 1,
    "zone_id": 1
  }'
```

### Obtenir les statistiques d'un projet
```bash
curl -X GET http://localhost:3001/api/projects/1/statistics
```

## Codes de réponse

- `200` - Succès
- `201` - Créé avec succès
- `400` - Requête invalide
- `404` - Ressource non trouvée
- `500` - Erreur serveur interne

## Sécurité

L'API inclut :
- **Helmet** pour la sécurité des en-têtes HTTP
- **CORS** pour la gestion des requêtes cross-origin
- **Rate limiting** (100 requêtes par 15 minutes par IP)
- Validation des données d'entrée
- Gestion d'erreurs centralisée

## Installation et démarrage

1. Installer les dépendances :
```bash
npm install
```

2. Configurer la base de données dans `db.js`

3. Démarrer le serveur :
```bash
npm start
```

Le serveur sera accessible sur `http://localhost:3001` 