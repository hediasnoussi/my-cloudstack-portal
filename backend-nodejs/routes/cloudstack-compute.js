const express = require('express');
const router = express.Router();
const cloudstackComputeController = require('../controllers/cloudstackComputeController');

// ===== ROUTES POUR LA GESTION DES INSTANCES CLOUDSTACK =====

// Récupérer toutes les instances depuis CloudStack
router.get('/instances', cloudstackComputeController.getAllInstances);

// Récupérer une instance par ID depuis CloudStack
router.get('/instances/:id', cloudstackComputeController.getInstanceById);

// Déployer une nouvelle instance via CloudStack
router.post('/instances', cloudstackComputeController.createInstance);

// Démarrer une instance
router.post('/instances/:id/start', cloudstackComputeController.startInstance);

// Arrêter une instance
router.post('/instances/:id/stop', cloudstackComputeController.stopInstance);

// Redémarrer une instance
router.post('/instances/:id/reboot', cloudstackComputeController.rebootInstance);

// Supprimer une instance
router.delete('/instances/:id', cloudstackComputeController.deleteInstance);

// ===== ROUTES POUR LES TEMPLATES ET OFFRES =====

// Récupérer les templates disponibles
router.get('/templates', cloudstackComputeController.getTemplates);

// Récupérer les offres de service
router.get('/service-offerings', cloudstackComputeController.getServiceOfferings);

// Récupérer les zones disponibles
router.get('/zones', cloudstackComputeController.getZones);

// ===== ROUTES POUR LES STATISTIQUES =====

// Récupérer les statistiques des instances
router.get('/instances-stats', cloudstackComputeController.getInstanceStats);

module.exports = router;
