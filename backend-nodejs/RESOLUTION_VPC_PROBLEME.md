# 🔧 Résolution du Problème VPC - VPCs non trouvés dans CloudStack

## 🎯 Problème Identifié

**Vos VPCs créés dans le portail n'apparaissent pas dans CloudStack** car le provider `VpcVirtualRouter` est désactivé dans votre configuration CloudStack.

### 🔍 Diagnostic

- ✅ **VPCs dans le portail** : Créés dans la base de données locale
- ❌ **VPCs dans CloudStack** : Impossible de créer (erreur 431)
- 🔧 **Cause** : Provider `VpcVirtualRouter` désactivé

## 💡 Solutions

### **Solution 1 : Interface d'administration CloudStack (Recommandée)**

1. **Connectez-vous à l'interface d'administration CloudStack**
   - URL : `http://votre-serveur-cloudstack:8080/client`
   - Utilisateur : `admin`
   - Mot de passe : Votre mot de passe admin

2. **Allez dans Infrastructure > Zones**
   - Sélectionnez votre zone "CloudStack-Zone"

3. **Allez dans l'onglet "Physical Networks"**
   - Sélectionnez "Physical Network 1"

4. **Activez le provider "VpcVirtualRouter"**
   - Trouvez la ligne "VpcVirtualRouter"
   - Changez l'état de "Disabled" à "Enabled"
   - Cliquez sur "Update"

5. **Sauvegardez la configuration**
   - Cliquez sur "Apply" ou "Save"

### **Solution 2 : API CloudStack (Si vous avez les droits admin)**

```bash
# Activer le provider VpcVirtualRouter
node enable-vpc-provider.js

# Synchroniser les VPCs existants
node enable-vpc-provider.js --sync
```

### **Solution 3 : Script de diagnostic et activation**

```bash
# Diagnostic complet
node diagnostic-vpc-configuration.js

# Activation du provider
node enable-vpc-provider.js

# Test de création de VPC
node test-vpc-creation.js
```

## 🔄 Synchronisation des VPCs Existants

Une fois le provider activé, synchronisez vos VPCs existants :

```bash
# Synchroniser les VPCs du portail vers CloudStack
node enable-vpc-provider.js --sync
```

## 📋 Vérification

Après activation, vérifiez que tout fonctionne :

```bash
# Test de création de VPC
node test-vpc-creation.js

# Vérification des VPCs dans CloudStack
node test-network-cloudstack.js
```

## 🛠️ Dépannage

### **Erreur 401 - Non autorisé**
- Vérifiez vos clés API CloudStack
- Assurez-vous d'avoir les droits d'administrateur

### **Erreur 431 - Provider non activé**
- Le provider n'est pas encore complètement activé
- Attendez quelques minutes et relancez le test

### **Erreur de base de données**
- Vérifiez la connexion MySQL
- Assurez-vous que les tables existent

## 📊 Paramètres Recommandés

Une fois le provider activé, utilisez ces paramètres dans votre portail :

```javascript
// Paramètres VPC recommandés
const vpcParams = {
  name: "mon-vpc",
  displaytext: "Mon VPC",
  cidr: "10.0.0.0/16",
  vpcofferingid: "b1a77c5e-2fa8-4821-8fe9-7ab193489287", // Default VPC offering
  zoneid: "28e45a8a-e1a3-43c2-8174-8061f5ac83b6" // CloudStack-Zone
};
```

## 🔧 Configuration Alternative

Si vous ne pouvez pas activer le provider VpcVirtualRouter, utilisez des **réseaux isolés** à la place :

```bash
# Créer un réseau isolé au lieu d'un VPC
curl -X POST http://localhost:3000/api/network/guest-networks \
  -H "Content-Type: application/json" \
  -d '{
    "name": "mon-reseau",
    "displaytext": "Mon réseau isolé",
    "networkofferingid": "13e40b21-83f1-4f8b-828a-c97db54f77ad",
    "zoneid": "28e45a8a-e1a3-43c2-8174-8061f5ac83b6"
  }'
```

## 📚 Documentation Complète

- `NETWORK_CLOUDSTACK_INTEGRATION.md` - Intégration complète
- `README_NETWORK_INTEGRATION.md` - Guide d'utilisation
- `diagnostic-vpc-configuration.js` - Diagnostic détaillé
- `enable-vpc-provider.js` - Activation du provider

## 🎯 Prochaines Étapes

1. **Activez le provider VpcVirtualRouter** (voir solutions ci-dessus)
2. **Synchronisez les VPCs existants** du portail vers CloudStack
3. **Testez la création de nouveaux VPCs** depuis votre interface
4. **Vérifiez que les VPCs apparaissent** dans CloudStack
5. **Documentez la configuration** pour l'équipe

## ⚠️ Important

- Cette configuration nécessite des **droits d'administrateur CloudStack**
- L'activation du provider peut nécessiter un **redémarrage des services réseau**
- **Sauvegardez votre configuration** avant toute modification
- **Testez dans un environnement de développement** avant la production

## 🆘 Support

Si vous rencontrez des problèmes :

1. **Vérifiez les logs CloudStack** : `/var/log/cloudstack/management/`
2. **Consultez la documentation CloudStack** officielle
3. **Contactez votre administrateur CloudStack**
4. **Utilisez les scripts de diagnostic** fournis

---

**Résumé** : Le problème vient du provider `VpcVirtualRouter` désactivé. Activez-le et vos VPCs apparaîtront dans CloudStack !
