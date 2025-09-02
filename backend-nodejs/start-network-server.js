const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logging middleware
app.use((req, res, next) => {
  console.log(`🌐 ${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Routes
const networkRoutes = require('./routes/network');
const globalRoutes = require('./routes/global');
const computeRoutes = require('./routes/compute');
const storageRoutes = require('./routes/storage');
const userRoutes = require('./routes/users');
const projectRoutes = require('./routes/projects');
const quotaRoutes = require('./routes/quotas');

// API Routes
app.use('/api/network', networkRoutes);
app.use('/api/global', globalRoutes);
app.use('/api/compute', computeRoutes);
app.use('/api/storage', storageRoutes);
app.use('/api/users', userRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/quotas', quotaRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'CloudStack Network API Server is running',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    features: {
      vpcs: true,
      networks: true,
      publicIPs: true,
      securityGroups: true,
      cloudstack: true
    }
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'CloudStack Network Management API',
    endpoints: {
      health: '/api/health',
      vpcs: '/api/network/vpcs',
      networks: '/api/network/guest-networks',
      publicIPs: '/api/network/public-ip-addresses',
      securityGroups: '/api/network/security-groups',
      compute: '/api/compute',
      storage: '/api/storage',
      users: '/api/users'
    },
    documentation: '/api/docs'
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('❌ Server Error:', err);
  res.status(500).json({
    success: false,
    error: err.message,
    message: 'Erreur interne du serveur'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint not found',
    message: `L'endpoint ${req.originalUrl} n'existe pas`,
    availableEndpoints: [
      '/api/health',
      '/api/network/vpcs',
      '/api/network/guest-networks',
      '/api/network/public-ip-addresses',
      '/api/network/security-groups'
    ]
  });
});

// Start server
app.listen(PORT, () => {
  console.log('🚀 CloudStack Network API Server démarré');
  console.log(`📍 Port: ${PORT}`);
  console.log(`🌐 URL: http://localhost:${PORT}`);
  console.log('📋 Endpoints disponibles:');
  console.log('   - GET  /api/health');
  console.log('   - GET  /api/network/vpcs');
  console.log('   - POST /api/network/vpcs');
  console.log('   - GET  /api/network/guest-networks');
  console.log('   - POST /api/network/guest-networks');
  console.log('   - GET  /api/network/public-ip-addresses');
  console.log('   - POST /api/network/public-ip-addresses');
  console.log('   - GET  /api/network/security-groups');
  console.log('   - POST /api/network/security-groups');
  console.log('');
  console.log('🔧 Configuration CloudStack:');
  console.log(`   - API URL: ${process.env.CLOUDSTACK_API_URL || 'Non configuré'}`);
  console.log(`   - API Key: ${process.env.CLOUDSTACK_API_KEY ? 'Configuré' : 'Non configuré'}`);
  console.log(`   - Secret Key: ${process.env.CLOUDSTACK_SECRET_KEY ? 'Configuré' : 'Non configuré'}`);
  console.log('');
  console.log('✅ Serveur prêt à recevoir des requêtes !');
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🛑 Arrêt du serveur...');
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\n🛑 Arrêt du serveur...');
  process.exit(0);
});

module.exports = app;
