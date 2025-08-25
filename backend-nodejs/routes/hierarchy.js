const express = require('express');
const router = express.Router();
const hierarchyController = require('../controllers/hierarchyController');
const { authenticateUser, requireRole } = require('../middleware/auth');

// Routes pour la hiérarchie des utilisateurs
router.get('/my-hierarchy', authenticateUser, hierarchyController.getUserHierarchy);
router.post('/create-user', authenticateUser, requireRole(['admin', 'subprovider', 'partner']), hierarchyController.createChildUser);
router.put('/user/:userId', authenticateUser, requireRole(['admin', 'subprovider', 'partner']), hierarchyController.updateChildUser);
router.delete('/user/:userId', authenticateUser, requireRole(['admin', 'subprovider', 'partner']), hierarchyController.deleteChildUser);
router.get('/stats', authenticateUser, hierarchyController.getHierarchyStats);

module.exports = router;
