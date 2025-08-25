const express = require('express');
const router = express.Router();
const quotaController = require('../controllers/quotaController');
const { authenticateUser, requireRole } = require('../middleware/auth');

// Routes pour les quotas
router.get('/my-quotas', authenticateUser, quotaController.getMyQuotas);
router.get('/user/:userId', authenticateUser, quotaController.getUserQuotas);
router.put('/user/:userId', authenticateUser, requireRole(['admin']), quotaController.updateUserQuotas);
router.post('/create', authenticateUser, requireRole(['admin']), quotaController.createUserQuotas);
router.get('/all', authenticateUser, requireRole(['admin']), quotaController.getAllQuotas);
router.post('/update-usage', authenticateUser, quotaController.updateQuotaUsage);

module.exports = router;
