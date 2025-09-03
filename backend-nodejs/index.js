const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3001;

console.log('🚀 Démarrage du serveur...');

// Middleware de base
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

console.log('✅ Middleware de base configuré');

// Route de base
app.get('/', (req, res) => {
  res.json({
    message: 'CloudStack Portal API',
    version: '1.0.0',
    endpoints: {
      global: '/api/global',
      compute: '/api/compute',
      storage: '/api/storage',
      projects: '/api/projects'
    }
  });
});

// Test route
app.get('/test', (req, res) => {
  res.json({ message: 'API is working!' });
});

// Route de login directe (pour compatibilité avec le frontend)
app.post('/login', (req, res) => {
  // Rediriger vers le contrôleur d'authentification
  const userController = require('./controllers/userController');
  userController.loginUser(req, res);
});

console.log('✅ Routes de base configurées');

// Routes (ajoutées progressivement pour éviter les erreurs)
try {
  console.log('🔄 Chargement des routes globales...');
  const globalRoutes = require('./routes/global');
  app.use('/api/global', globalRoutes);
  console.log('✅ Global routes loaded');
} catch (error) {
  console.log('❌ Error loading global routes:', error.message);
  console.log('❌ Stack:', error.stack);
}

try {
  console.log('🔄 Chargement des routes compute...');
  const computeRoutes = require('./routes/compute');
  app.use('/api/compute', computeRoutes);
  console.log('✅ Compute routes loaded');
} catch (error) {
  console.log('❌ Error loading compute routes:', error.message);
  console.log('❌ Stack:', error.stack);
}

try {
  console.log('🔄 Chargement des routes storage...');
  const storageRoutes = require('./routes/storage');
  app.use('/api/storage', storageRoutes);
  console.log('✅ Storage routes loaded');
} catch (error) {
  console.log('❌ Error loading storage routes:', error.message);
  console.log('❌ Stack:', error.stack);
}



try {
  console.log('🔄 Chargement des routes projects...');
  const projectRoutes = require('./routes/projects');
  app.use('/api', projectRoutes);
  console.log('✅ Project routes loaded');
} catch (error) {
  console.log('❌ Error loading project routes:', error.message);
  console.log('❌ Stack:', error.stack);
}

try {
  console.log('🔄 Chargement des routes users...');
  const userRoutes = require('./routes/users');
  app.use('/api', userRoutes);
  console.log('✅ User routes loaded');
} catch (error) {
  console.log('❌ Error loading user routes:', error.message);
  console.log('❌ Stack:', error.stack);
}

try {
  console.log('🔄 Chargement des routes quotas...');
  const quotaRoutes = require('./routes/quotas');
  app.use('/api/quotas', quotaRoutes);
  console.log('✅ Quota routes loaded');
} catch (error) {
  console.log('❌ Error loading quota routes:', error.message);
  console.log('❌ Stack:', error.stack);
}

try {
  console.log('🔄 Chargement des routes hierarchy...');
  const hierarchyRoutes = require('./routes/hierarchy');
  app.use('/api/hierarchy', hierarchyRoutes);
  console.log('✅ Hierarchy routes loaded');
} catch (error) {
  console.log('❌ Error loading hierarchy routes:', error.message);
  console.log('❌ Stack:', error.stack);
}

// Routes CloudStack pour la gestion des instances
try {
  console.log('🔄 Chargement des routes CloudStack compute...');
  const cloudstackComputeRoutes = require('./routes/cloudstack-compute');
  app.use('/api/cloudstack', cloudstackComputeRoutes);
  console.log('✅ CloudStack compute routes loaded');
} catch (error) {
  console.log('❌ Error loading CloudStack compute routes:', error.message);
  console.log('❌ Stack:', error.stack);
}

// Routes simples sans authentification
try {
  console.log('🔄 Chargement des routes simples...');
  const simpleRoutes = require('./routes/simple');
  app.use('/api/simple', simpleRoutes);
  console.log('✅ Simple routes loaded');
} catch (error) {
  console.log('❌ Error loading simple routes:', error.message);
  console.log('❌ Stack:', error.stack);
}

console.log('✅ Toutes les routes ont été traitées');

// Gestion globale des erreurs
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

console.log('🚀 Démarrage de l\'écoute sur le port', PORT);

// Démarrer le serveur avec gestion d'erreur
const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Server running on port ${PORT}`);
  console.log(`📚 API Documentation: http://localhost:${PORT}`);
  console.log(`🌐 Server accessible at: http://127.0.0.1:${PORT}`);
  console.log('🎉 Serveur prêt à recevoir des requêtes !');
});

// Gestion des erreurs du serveur
server.on('error', (error) => {
  if (error.code === 'EADDRINUSE') {
    console.error(`❌ Le port ${PORT} est déjà utilisé !`);
  } else {
    console.error('❌ Erreur du serveur:', error);
  }
  process.exit(1);
});

// Gestion de l'arrêt propre
process.on('SIGINT', () => {
  console.log('\n🛑 Arrêt du serveur...');
  server.close(() => {
    console.log('✅ Serveur arrêté proprement');
    process.exit(0);
  });
});

process.on('SIGTERM', () => {
  console.log('\n🛑 Arrêt du serveur...');
  server.close(() => {
    console.log('✅ Serveur arrêté proprement');
    process.exit(0);
  });
});

console.log('✅ Script index.js terminé - Serveur en cours d\'exécution...');
