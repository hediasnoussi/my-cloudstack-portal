const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');
const db = require('../db');

const userController = {
  // Authentification utilisateur (sans JWT)
  async loginUser(req, res) {
    try {
      const { username, password } = req.body;

      if (!username || !password) {
        return res.status(400).json({
          success: false,
          message: 'Nom d\'utilisateur et mot de passe requis'
        });
      }

      // Rechercher l'utilisateur
      const [users] = await db.execute(
        'SELECT * FROM users_new WHERE username = ?',
        [username]
      );

      if (users.length === 0) {
        return res.status(401).json({
          success: false,
          message: 'Nom d\'utilisateur ou mot de passe incorrect'
        });
      }

      const user = users[0];

      // Vérifier le mot de passe
      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        return res.status(401).json({
          success: false,
          message: 'Nom d\'utilisateur ou mot de passe incorrect'
        });
      }

      // Retourner les informations utilisateur (sans token)
      res.json({
        success: true,
        message: 'Connexion réussie',
        data: {
          user: {
            id: user.id,
            username: user.username,
            email: user.email,
            role: user.role,
            account_id: user.account_id
          }
        }
      });

    } catch (error) {
      console.error('Erreur lors de la connexion:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur serveur lors de la connexion'
      });
    }
  },

  // Récupérer tous les utilisateurs (admin uniquement)
  async getAllUsers(req, res) {
    try {
      const [users] = await db.execute(
        'SELECT id, username, email, role, account_id, created_at FROM users_new'
      );

      res.json({
        success: true,
        data: users
      });

    } catch (error) {
      console.error('Erreur lors de la récupération des utilisateurs:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur serveur lors de la récupération des utilisateurs'
      });
    }
  },

  // Récupérer un utilisateur par ID
  async getUserById(req, res) {
    try {
      const { id } = req.params;

      const [users] = await db.execute(
        'SELECT id, username, email, role, account_id, created_at FROM users_new WHERE id = ?',
        [id]
      );

      if (users.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'Utilisateur non trouvé'
        });
      }

      res.json({
        success: true,
        data: users[0]
      });

    } catch (error) {
      console.error('Erreur lors de la récupération de l\'utilisateur:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur serveur lors de la récupération de l\'utilisateur'
      });
    }
  },

  // Créer un nouvel utilisateur
  async createUser(req, res) {
    try {
      const { username, email, password, role, account_id } = req.body;

      // Validation des données
      if (!username || !email || !password || !role) {
        return res.status(400).json({
          success: false,
          message: 'Tous les champs obligatoires doivent être remplis'
        });
      }

      // Vérifier si l'utilisateur existe déjà
      const [existingUsers] = await db.execute(
        'SELECT id FROM users_new WHERE username = ? OR email = ?',
        [username, email]
      );

      if (existingUsers.length > 0) {
        return res.status(400).json({
          success: false,
          message: 'Un utilisateur avec ce nom ou cet email existe déjà'
        });
      }

      // Hasher le mot de passe
      const hashedPassword = await bcrypt.hash(password, 10);

      // Insérer l'utilisateur
      const [result] = await db.execute(
        'INSERT INTO users_new (username, email, password, role, account_id) VALUES (?, ?, ?, ?, ?)',
        [username, email, hashedPassword, role, account_id || null]
      );

      res.status(201).json({
        success: true,
        message: 'Utilisateur créé avec succès',
        data: {
          id: result.insertId,
          username,
          email,
          role,
          account_id
        }
      });

    } catch (error) {
      console.error('Erreur lors de la création de l\'utilisateur:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur serveur lors de la création de l\'utilisateur'
      });
    }
  },

  // Mettre à jour un utilisateur
  async updateUser(req, res) {
    try {
      const { id } = req.params;
      const { username, email, role, account_id } = req.body;

      // Vérifier si l'utilisateur existe
      const [existingUsers] = await db.execute(
        'SELECT id FROM users_new WHERE id = ?',
        [id]
      );

      if (existingUsers.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'Utilisateur non trouvé'
        });
      }

      // Mettre à jour l'utilisateur
      await db.execute(
        'UPDATE users_new SET username = ?, email = ?, role = ?, account_id = ? WHERE id = ?',
        [username, email, role, account_id || null, id]
      );

      res.json({
        success: true,
        message: 'Utilisateur mis à jour avec succès'
      });

    } catch (error) {
      console.error('Erreur lors de la mise à jour de l\'utilisateur:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur serveur lors de la mise à jour de l\'utilisateur'
      });
    }
  },

  // Supprimer un utilisateur
  async deleteUser(req, res) {
    try {
      const { id } = req.params;

      // Vérifier si l'utilisateur existe
      const [existingUsers] = await db.execute(
        'SELECT id FROM users_new WHERE id = ?',
        [id]
      );

      if (existingUsers.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'Utilisateur non trouvé'
        });
      }

      // Supprimer l'utilisateur
      await db.execute(
        'DELETE FROM users_new WHERE id = ?',
        [id]
      );

      res.json({
        success: true,
        message: 'Utilisateur supprimé avec succès'
      });

    } catch (error) {
      console.error('Erreur lors de la suppression de l\'utilisateur:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur serveur lors de la suppression de l\'utilisateur'
      });
    }
  },

  // Changer le mot de passe
  async changePassword(req, res) {
    try {
      const { id } = req.params;
      const { currentPassword, newPassword } = req.body;

      if (!currentPassword || !newPassword) {
        return res.status(400).json({
          success: false,
          message: 'Ancien et nouveau mot de passe requis'
        });
      }

      // Récupérer l'utilisateur
      const [users] = await db.execute(
        'SELECT password FROM users_new WHERE id = ?',
        [id]
      );

      if (users.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'Utilisateur non trouvé'
        });
      }

      // Vérifier l'ancien mot de passe
      const isValidPassword = await bcrypt.compare(currentPassword, users[0].password);
      if (!isValidPassword) {
        return res.status(400).json({
          success: false,
          message: 'Ancien mot de passe incorrect'
        });
      }

      // Hasher le nouveau mot de passe
      const hashedNewPassword = await bcrypt.hash(newPassword, 10);

      // Mettre à jour le mot de passe
      await db.execute(
        'UPDATE users_new SET password = ? WHERE id = ?',
        [hashedNewPassword, id]
      );

      res.json({
        success: true,
        message: 'Mot de passe modifié avec succès'
      });

    } catch (error) {
      console.error('Erreur lors du changement de mot de passe:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur serveur lors du changement de mot de passe'
      });
    }
  },

  // Obtenir les statistiques utilisateur
  async getUserStatistics(req, res) {
    try {
      const { id } = req.params;

      // Compter les utilisateurs par rôle
      const [roleStats] = await db.execute(
        'SELECT role, COUNT(*) as count FROM users_new GROUP BY role'
      );

      // Compter le total d'utilisateurs
      const [totalUsers] = await db.execute(
        'SELECT COUNT(*) as total FROM users_new'
      );

      res.json({
        success: true,
        data: {
          totalUsers: totalUsers[0].total,
          roleDistribution: roleStats
        }
      });

    } catch (error) {
      console.error('Erreur lors de la récupération des statistiques:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur serveur lors de la récupération des statistiques'
      });
    }
  }
};

module.exports = userController; 