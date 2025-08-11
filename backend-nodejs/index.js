const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware de base
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Route de base
app.get('/', (req, res) => {
  res.json({
    message: 'CloudStack Portal API',
    version: '1.0.0',
    endpoints: {
      global: '/api/global',
      compute: '/api/compute',
      storage: '/api/storage',
      network: '/api/network',
      projects: '/api/projects'
    }
  });
});

// Test route
app.get('/test', (req, res) => {
  res.json({ message: 'API is working!' });
});

// Routes (ajoutées progressivement pour éviter les erreurs)
try {
  const globalRoutes = require('./routes/global');
  app.use('/api/global', globalRoutes);
  console.log('✅ Global routes loaded');
} catch (error) {
  console.log('❌ Error loading global routes:', error.message);
}

try {
  const computeRoutes = require('./routes/compute');
  app.use('/api/compute', computeRoutes);
  console.log('✅ Compute routes loaded');
} catch (error) {
  console.log('❌ Error loading compute routes:', error.message);
}

try {
  const storageRoutes = require('./routes/storage');
  app.use('/api/storage', storageRoutes);
  console.log('✅ Storage routes loaded');
} catch (error) {
  console.log('❌ Error loading storage routes:', error.message);
}

try {
  const networkRoutes = require('./routes/network');
  app.use('/api/network', networkRoutes);
  console.log('✅ Network routes loaded');
} catch (error) {
  console.log('❌ Error loading network routes:', error.message);
}

try {
  const projectRoutes = require('./routes/projects');
  app.use('/api', projectRoutes);
  console.log('✅ Project routes loaded');
} catch (error) {
  console.log('❌ Error loading project routes:', error.message);
}

try {
  const userRoutes = require('./routes/users');
  app.use('/api', userRoutes);
  console.log('✅ User routes loaded');
} catch (error) {
  console.log('❌ Error loading user routes:', error.message);
}

// Gestion globale des erreurs
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`API Documentation: http://localhost:${PORT}`);
  console.log(`Server accessible at: http://127.0.0.1:${PORT}`);
});
