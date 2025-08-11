const express = require('express');
const router = express.Router();
const globalController = require('../controllers/globalController');

// ===== DOMAINS ROUTES =====
router.get('/domains', globalController.getAllDomains);
router.get('/domains/:id', globalController.getDomainById);
router.post('/domains', globalController.createDomain);
router.put('/domains/:id', globalController.updateDomain);
router.delete('/domains/:id', globalController.deleteDomain);

// ===== ROLES ROUTES =====
router.get('/roles', globalController.getAllRoles);
router.get('/roles/:id', globalController.getRoleById);
router.post('/roles', globalController.createRole);
router.put('/roles/:id', globalController.updateRole);
router.delete('/roles/:id', globalController.deleteRole);

// ===== ACCOUNTS ROUTES =====
router.get('/accounts', globalController.getAllAccounts);
router.get('/accounts/:id', globalController.getAccountById);
router.post('/accounts', globalController.createAccount);
router.put('/accounts/:id', globalController.updateAccount);
router.delete('/accounts/:id', globalController.deleteAccount);

// ===== ZONES ROUTES =====
router.get('/zones', globalController.getAllZones);
router.get('/zones/:id', globalController.getZoneById);
router.post('/zones', globalController.createZone);
router.put('/zones/:id', globalController.updateZone);
router.delete('/zones/:id', globalController.deleteZone);

module.exports = router; 