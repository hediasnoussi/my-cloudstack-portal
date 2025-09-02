const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3001;

console.log('🚀 Démarrage du serveur CloudStack minimal...');

// Middleware de base
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Route de test
app.get('/test', (req, res) => {
  res.json({ message: 'API CloudStack is working!' });
});

// Route de base
app.get('/', (req, res) => {
  res.json({
    message: 'CloudStack Portal API - Version Minimal',
    version: '2.0.0',
    status: 'running'
  });
});

// Routes CloudStack directes
app.get('/api/global/cloudstack/stats', (req, res) => {
  res.json({ message: 'Stats endpoint - à implémenter' });
});

app.get('/api/global/cloudstack/virtual-machines', (req, res) => {
  res.json({ message: 'Virtual machines endpoint - à implémenter' });
});

app.get('/api/global/cloudstack/volumes', (req, res) => {
  res.json({ message: 'Volumes endpoint - à implémenter' });
});

app.post('/api/global/cloudstack/volumes', (req, res) => {
  res.json({ message: 'Create volume endpoint - à implémenter', data: req.body });
});

app.delete('/api/global/cloudstack/volumes/:id', (req, res) => {
  res.json({ message: 'Delete volume endpoint - à implémenter', id: req.params.id });
});

console.log('✅ Routes minimales configurées');

// Démarrer le serveur
app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Server running on port ${PORT}`);
  console.log(`🌐 Server accessible at: http://127.0.0.1:${PORT}`);
  console.log('🎉 Serveur CloudStack minimal prêt !');
});

console.log('✅ Script server-minimal.js terminé');
