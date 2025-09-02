const mysql = require('mysql2/promise');
const db = require('../db');

const quotaController = {
  // Récupérer les quotas d'un utilisateur
  async getUserQuotas(req, res) {
    try {
      const { userId } = req.params;
      
      const [quotas] = await db.execute(
        'SELECT * FROM user_quotas WHERE user_id = ?',
        [userId]
      );

      if (quotas.length === 0) {
        return res.status(404).json({ 
          success: false, 
          message: 'Aucun quota trouvé pour cet utilisateur' 
        });
      }

      res.json({
        success: true,
        data: quotas[0]
      });

    } catch (error) {
      console.error('Erreur lors de la récupération des quotas:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Erreur serveur lors de la récupération des quotas' 
      });
    }
  },

  // Récupérer les quotas de l'utilisateur connecté
  async getMyQuotas(req, res) {
    try {
      const userId = req.user.id; // Depuis le middleware d'authentification
      
      const [quotas] = await db.execute(
        'SELECT * FROM user_quotas WHERE user_id = ?',
        [userId]
      );

      if (quotas.length === 0) {
        return res.status(404).json({ 
          success: false, 
          message: 'Aucun quota trouvé pour votre compte' 
        });
      }

      res.json({
        success: true,
        data: quotas[0]
      });

    } catch (error) {
      console.error('Erreur lors de la récupération de vos quotas:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Erreur serveur lors de la récupération de vos quotas' 
      });
    }
  },

  // Mettre à jour les quotas d'un utilisateur (admin uniquement)
  async updateUserQuotas(req, res) {
    try {
      const { userId } = req.params;
      const { max_vps, max_cpu, max_ram, max_storage } = req.body;
      
      // Vérifier que l'utilisateur est admin
      if (req.user.role !== 'admin') {
        return res.status(403).json({ 
          success: false, 
          message: 'Accès refusé. Seuls les administrateurs peuvent modifier les quotas.' 
        });
      }

      // Vérifier que les nouvelles valeurs ne sont pas inférieures à l'utilisation actuelle
      const [currentQuotas] = await db.execute(
        'SELECT * FROM user_quotas WHERE user_id = ?',
        [userId]
      );

      if (currentQuotas.length === 0) {
        return res.status(404).json({ 
          success: false, 
          message: 'Utilisateur non trouvé' 
        });
      }

      const current = currentQuotas[0];
      
      if (max_vps < current.used_vps || 
          max_cpu < current.used_cpu || 
          max_ram < current.used_ram || 
          max_storage < current.used_storage) {
        return res.status(400).json({ 
          success: false, 
          message: 'Les nouvelles valeurs de quotas ne peuvent pas être inférieures aux valeurs actuellement utilisées' 
        });
      }

      // Mettre à jour les quotas
      await db.execute(
        `UPDATE user_quotas 
         SET max_vps = ?, max_cpu = ?, max_ram = ?, max_storage = ?, updated_at = CURRENT_TIMESTAMP
         WHERE user_id = ?`,
        [max_vps, max_cpu, max_ram, max_storage, userId]
      );

      res.json({
        success: true,
        message: 'Quotas mis à jour avec succès'
      });

    } catch (error) {
      console.error('Erreur lors de la mise à jour des quotas:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Erreur serveur lors de la mise à jour des quotas' 
      });
    }
  },

  // Créer des quotas pour un nouvel utilisateur
  async createUserQuotas(req, res) {
    try {
      const { user_id, max_vps, max_cpu, max_ram, max_storage } = req.body;
      
      // Vérifier que l'utilisateur existe
      const [user] = await db.execute(
        'SELECT id FROM users_new WHERE id = ?',
        [user_id]
      );

      if (user.length === 0) {
        return res.status(404).json({ 
          success: false, 
          message: 'Utilisateur non trouvé' 
        });
      }

      // Vérifier que l'utilisateur n'a pas déjà des quotas
      const [existingQuotas] = await db.execute(
        'SELECT id FROM user_quotas WHERE user_id = ?',
        [user_id]
      );

      if (existingQuotas.length > 0) {
        return res.status(400).json({ 
          success: false, 
          message: 'Cet utilisateur a déjà des quotas' 
        });
      }

      // Créer les quotas
      await db.execute(
        `INSERT INTO user_quotas (user_id, max_vps, max_cpu, max_ram, max_storage)
         VALUES (?, ?, ?, ?, ?)`,
        [user_id, max_vps, max_cpu, max_ram, max_storage]
      );

      res.status(201).json({
        success: true,
        message: 'Quotas créés avec succès'
      });

    } catch (error) {
      console.error('Erreur lors de la création des quotas:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Erreur serveur lors de la création des quotas' 
      });
    }
  },

  // Récupérer tous les quotas (admin uniquement)
  async getAllQuotas(req, res) {
    try {
      // Vérifier que l'utilisateur est admin
      if (req.user.role !== 'admin') {
        return res.status(403).json({ 
          success: false, 
          message: 'Accès refusé. Seuls les administrateurs peuvent voir tous les quotas.' 
        });
      }

      const [quotas] = await db.execute(`
        SELECT uq.*, u.username, u.email, u.role
        FROM user_quotas uq
        JOIN users_new u ON uq.user_id = u.id
        ORDER BY u.username
      `);

      res.json({
        success: true,
        data: quotas
      });

    } catch (error) {
      console.error('Erreur lors de la récupération de tous les quotas:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Erreur serveur lors de la récupération des quotas' 
      });
    }
  },

  // Mettre à jour l'utilisation des quotas (appelé lors de la création/suppression de VPS)
  async updateQuotaUsage(req, res) {
    try {
      const { userId, vpsDelta, cpuDelta, ramDelta, storageDelta } = req.body;
      
      // Vérifier que l'utilisateur est admin ou qu'il modifie ses propres quotas
      if (req.user.role !== 'admin' && req.user.id !== parseInt(userId)) {
        return res.status(403).json({ 
          success: false, 
          message: 'Accès refusé' 
        });
      }

      // Mettre à jour l'utilisation
      await db.execute(
        `UPDATE user_quotas 
         SET used_vps = used_vps + ?, 
             used_cpu = used_cpu + ?, 
             used_ram = used_ram + ?, 
             used_storage = used_storage + ?,
             updated_at = CURRENT_TIMESTAMP
         WHERE user_id = ?`,
        [vpsDelta, cpuDelta, ramDelta, storageDelta, userId]
      );

      res.json({
        success: true,
        message: 'Utilisation des quotas mise à jour'
      });

    } catch (error) {
      console.error('Erreur lors de la mise à jour de l\'utilisation des quotas:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Erreur serveur lors de la mise à jour de l\'utilisation' 
      });
    }
  }
};

module.exports = quotaController;
