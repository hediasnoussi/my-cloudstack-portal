# 🌐 CloudStack Portal - Portail de Gestion CloudStack

Un portail web moderne pour gérer vos ressources CloudStack avec une interface utilisateur intuitive et des fonctionnalités avancées.

## 🚀 Fonctionnalités

- **Dashboard en temps réel** avec métriques CloudStack
- **Gestion des VPS** (création, modification, suppression)
- **Gestion des volumes** et snapshots
- **Gestion des ISOs** et templates
- **Suivi des événements** CloudStack
- **Interface responsive** et moderne

## 📁 Structure du Projet

```
my-cloudstack-portal/
├── 📚 docs/                           # Documentation complète
│   ├── README.md                      # Guide principal
│   ├── CLOUDSTACK_INTEGRATION_GUIDE.md # Guide d'intégration
│   ├── QUICK_START_CLOUDSTACK.md      # Démarrage rapide
│   └── CONFIGURATION_EXAMPLE.md       # Exemples de config
├── 🔧 backend-nodejs/                  # Backend Node.js
│   ├── cloudstack-api.js             # API CloudStack
│   ├── controllers/                   # Contrôleurs
│   └── routes/                        # Routes API
└── 🎨 src/                           # Frontend React
    ├── services/                      # Services API
    ├── pages/                         # Pages de l'application
    └── components/                    # Composants React
```

## 🚀 Installation et Démarrage

### Prérequis
- Node.js 16+
- Accès à un serveur CloudStack
- Clés API CloudStack

### Installation

```bash
# Cloner le projet
git clone <repository-url>
cd my-cloudstack-portal

# Installer les dépendances frontend
npm install

# Installer les dépendances backend
cd backend-nodejs
npm install
cd ..
```

### Configuration

1. **Configurer CloudStack** dans `backend-nodejs/cloudstack-api.js`
2. **Ajuster les variables d'environnement** si nécessaire
3. **Vérifier les ports** (backend: 3001, frontend: 5173)

### Démarrage

```bash
# Démarrer le backend
cd backend-nodejs
node index.js

# Dans un autre terminal, démarrer le frontend
cd src
npm run dev
```

## 📚 Documentation

Toute la documentation est disponible dans le dossier `docs/` :

- **[Guide Principal](docs/README.md)** - Vue d'ensemble et accès rapide
- **[Guide d'Intégration](docs/CLOUDSTACK_INTEGRATION_GUIDE.md)** - Documentation complète
- **[Démarrage Rapide](docs/QUICK_START_CLOUDSTACK.md)** - Commandes essentielles
- **[Exemples de Config](docs/CONFIGURATION_EXAMPLE.md)** - Configurations types

## 🔧 API Endpoints

| Endpoint | Description |
|----------|-------------|
| `/api/global/cloudstack/virtual-machines` | Gestion des VPS |
| `/api/global/cloudstack/volumes` | Gestion des volumes |
| `/api/global/cloudstack/snapshots` | Gestion des snapshots |
| `/api/global/cloudstack/isos` | Gestion des ISOs |
| `/api/global/cloudstack/events` | Événements CloudStack |

## 🐛 Dépannage

### Problèmes Courants

1. **Erreur 401** - Vérifier les clés API CloudStack
2. **Erreur 500** - Vérifier la connectivité au serveur CloudStack
3. **CORS** - Vérifier la configuration proxy Vite

### Commandes de Diagnostic

```bash
# Test de l'API
curl -X GET "http://localhost:3001/api/global/cloudstack/virtual-machines"

# Vérifier les services
ps aux | grep -E "(node|vite)"

# Logs backend
tail -f backend-nodejs/logs/app.log
```

## 🔒 Sécurité

- Les clés API ne doivent jamais être commitées dans Git
- Utiliser des variables d'environnement en production
- Implémenter l'authentification utilisateur
- Configurer HTTPS en production

## 📊 Monitoring

Le portail inclut :
- Métriques en temps réel
- Logs détaillés
- Health checks automatiques
- Alertes en cas d'erreur

## 🤝 Contribution

1. Fork le projet
2. Créer une branche feature (`git checkout -b feature/AmazingFeature`)
3. Commit les changements (`git commit -m 'Add some AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

## 📞 Support

En cas de problème :
1. Consulter la [documentation](docs/)
2. Vérifier les [issues](https://github.com/votre-repo/issues)
3. Contacter l'équipe de développement

---

*CloudStack Portal - Version 1.0*
*Dernière mise à jour : Septembre 2025*
