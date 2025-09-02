const express = require('express');
const router = express.Router();
const projectController = require('../controllers/projectController');

// ===== PROJECTS CRUD ROUTES =====
router.get('/projects', projectController.getAllProjects);
router.get('/projects/:id', projectController.getProjectById);
router.post('/projects', projectController.createProject);
router.put('/projects/:id', projectController.updateProject);
router.delete('/projects/:id', projectController.deleteProject);

// ===== PROJECT ANALYTICS ROUTES =====
router.get('/projects/:id/statistics', projectController.getProjectStatistics);
router.get('/projects/:id/resources', projectController.getProjectResources);
router.get('/projects/:id/members', projectController.getProjectMembers);
router.get('/projects/:id/activity', projectController.getProjectActivity);
router.get('/projects/:id/costs', projectController.getProjectCosts);

module.exports = router; 