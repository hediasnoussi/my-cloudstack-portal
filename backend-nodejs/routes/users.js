const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// ===== USERS ROUTES =====
router.get('/users', userController.getAllUsers);
router.get('/users/:id', userController.getUserById);
router.post('/users', userController.createUser);
router.put('/users/:id', userController.updateUser);
router.delete('/users/:id', userController.deleteUser);

// ===== AUTHENTICATION ROUTES =====
router.post('/login', userController.loginUser);
router.put('/users/:id/password', userController.changePassword);

// ===== USER STATISTICS =====
router.get('/users/:id/statistics', userController.getUserStatistics);

module.exports = router; 