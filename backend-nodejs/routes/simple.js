const express = require('express');
const router = express.Router();

// Route simple de test
router.get('/test', (req, res) => {
  res.json({ 
    message: 'API simple fonctionne !',
    timestamp: new Date().toISOString()
  });
});

// Route pour obtenir des données de test
router.get('/data', (req, res) => {
  res.json({
    success: true,
    data: [
      { id: 1, name: 'Test 1', role: 'admin' },
      { id: 2, name: 'Test 2', role: 'user' },
      { id: 3, name: 'Test 3', role: 'partner' }
    ]
  });
});

// Route pour simuler l'accès aux données
router.get('/domains', (req, res) => {
  res.json({
    success: true,
    data: [
      { id: 1, name: 'Domain 1', status: 'active' },
      { id: 2, name: 'Domain 2', status: 'active' }
    ]
  });
});

module.exports = router;
