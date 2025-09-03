# ⚙️ Exemples de Configuration CloudStack

Ce fichier contient des exemples de configuration pour l'intégration CloudStack.

## 🔧 Configuration Backend

### 1. Configuration CloudStack API (`backend-nodejs/cloudstack-api.js`)

```javascript
class CloudStackAPI {
  constructor() {
    // Configuration CloudStack
    this.apiUrl = 'http://172.21.23.1/client/api';
    this.apiKey = 't2hpRTeUKriGGhUlD5onpNOWoEtJ8v3j759mcHlAocz37lwL7ZJtyQ_ABYSM3KWSOIlu4KR3ILiWMUtX9CUHdQ';
    this.secretKey = 'VOTRE_CLE_SECRETE';
    
    // Timeout et retry
    this.timeout = 30000; // 30 secondes
    this.maxRetries = 3;
  }
}
```

### 2. Variables d'Environnement (`.env`)

```bash
# Configuration CloudStack
CLOUDSTACK_API_URL=http://172.21.23.1/client/api
CLOUDSTACK_API_KEY=t2hpRTeUKriGGhUlD5onpNOWoEtJ8v3j759mcHlAocz37lwL7ZJtyQ_ABYSM3KWSOIlu4KR3ILiWMUtX9CUHdQ
CLOUDSTACK_SECRET_KEY=VOTRE_CLE_SECRETE

# Configuration Backend
NODE_ENV=development
PORT=3001
LOG_LEVEL=info

# Configuration Frontend
VITE_API_BASE_URL=http://localhost:3001/api
```

## 🎨 Configuration Frontend

### 1. Configuration Vite (`vite.config.js`)

```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
        secure: false,
      }
    }
  }
})
```

### 2. Configuration API Service (`src/services/cloudstackService.js`)

```javascript
import api from './api';

const cloudstackService = {
  // Configuration de base
  baseURL: '/api/global/cloudstack',
  
  // Headers par défaut
  headers: {
    'Content-Type': 'application/json',
  },
  
  // Timeout
  timeout: 30000,
};
```

## 🔌 Endpoints Configuration

### Routes Backend (`backend-nodejs/routes/global.js`)

```javascript
const express = require('express');
const router = express.Router();
const cloudstackController = require('../controllers/cloudstackController');

// Routes CloudStack
router.get('/cloudstack/virtual-machines', cloudstackController.getCloudStackVirtualMachines);
router.post('/cloudstack/virtual-machines', cloudstackController.deployVirtualMachine);
router.get('/cloudstack/volumes', cloudstackController.getCloudStackVolumes);
router.get('/cloudstack/snapshots', cloudstackController.getCloudStackSnapshots);
router.get('/cloudstack/isos', cloudstackController.getCloudStackISOs);
router.get('/cloudstack/events', cloudstackController.getCloudStackEvents);
router.get('/cloudstack/instance-groups', cloudstackController.getCloudStackInstanceGroups);

module.exports = router;
```

## 📊 Configuration Monitoring

### 1. Logs Configuration

```javascript
// backend-nodejs/config/logging.js
const winston = require('winston');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' }),
    new winston.transports.Console({
      format: winston.format.simple()
    })
  ]
});
```

### 2. Health Check Configuration

```javascript
// backend-nodejs/routes/health.js
router.get('/health', async (req, res) => {
  try {
    // Test CloudStack API
    const testResponse = await cloudstackAPI.getVirtualMachines();
    
    res.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      cloudstack: 'connected',
      services: {
        virtualMachines: 'ok',
        volumes: 'ok',
        snapshots: 'ok'
      }
    });
  } catch (error) {
    res.status(503).json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      cloudstack: 'disconnected',
      error: error.message
    });
  }
});
```

## 🔒 Configuration Sécurité

### 1. CORS Configuration

```javascript
// backend-nodejs/app.js
const cors = require('cors');

app.use(cors({
  origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
```

### 2. Rate Limiting

```javascript
// backend-nodejs/middleware/rateLimit.js
const rateLimit = require('express-rate-limit');

const cloudstackLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limite à 100 requêtes par fenêtre
  message: 'Trop de requêtes vers CloudStack API',
  standardHeaders: true,
  legacyHeaders: false,
});

app.use('/api/global/cloudstack', cloudstackLimiter);
```

## 🚀 Configuration Production

### 1. PM2 Configuration (`ecosystem.config.js`)

```javascript
module.exports = {
  apps: [{
    name: 'cloudstack-portal-backend',
    script: 'index.js',
    cwd: './backend-nodejs',
    instances: 2,
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 3001
    },
    env_production: {
      NODE_ENV: 'production',
      PORT: 3001
    }
  }]
};
```

### 2. Nginx Configuration

```nginx
# /etc/nginx/sites-available/cloudstack-portal
server {
    listen 80;
    server_name votre-domaine.com;

    # Frontend
    location / {
        root /var/www/cloudstack-portal/dist;
        try_files $uri $uri/ /index.html;
    }

    # Backend API
    location /api {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## 📝 Notes de Configuration

### Variables Importantes
- **API_URL** : URL de votre serveur CloudStack
- **API_KEY** : Clé API CloudStack (à renouveler périodiquement)
- **SECRET_KEY** : Clé secrète CloudStack
- **TIMEOUT** : Timeout des requêtes API (recommandé : 30s)
- **MAX_RETRIES** : Nombre de tentatives en cas d'échec

### Bonnes Pratiques
1. **Ne jamais** commiter les clés API dans Git
2. Utiliser des variables d'environnement en production
3. Configurer des timeouts appropriés
4. Implémenter un système de retry
5. Monitorer les performances API
6. Sauvegarder régulièrement les configurations

---

*Exemples de Configuration - Version 1.0*
