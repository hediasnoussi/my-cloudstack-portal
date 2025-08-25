const mysql = require('mysql2/promise');
const db = require('../db');

const hierarchyController = {
  // Récupérer la hiérarchie d'un utilisateur (ses enfants directs)
  async getUserHierarchy(req, res) {
    try {
      const userId = req.user.id;
      
      // Récupérer les utilisateurs enfants directs
      const [children] = await db.execute(`
        SELECT uh.*, u.username, u.email, u.role, uq.max_vps, uq.max_cpu, uq.max_ram, uq.max_storage,
               uq.used_vps, uq.used_cpu, uq.used_ram, uq.used_storage
        FROM user_hierarchy uh
        JOIN users_new u ON uh.child_user_id = u.id
        LEFT JOIN user_quotas uq ON u.id = uq.user_id
        WHERE uh.parent_user_id = ?
        ORDER BY u.username
      `, [userId]);

      res.json({
        success: true,
        data: children
      });

    } catch (error) {
      console.error('Erreur lors de la récupération de la hiérarchie:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Erreur serveur lors de la récupération de la hiérarchie' 
      });
    }
  },

  // Créer un nouvel utilisateur dans la hiérarchie
  async createChildUser(req, res) {
    try {
      const { username, email, password, role, max_vps, max_cpu, max_ram, max_storage } = req.body;
      const parentUserId = req.user.id;

      // Vérifier que le rôle est autorisé selon la hiérarchie
      const allowedRoles = await hierarchyController.getAllowedRoles(parentUserId);
      if (!allowedRoles.includes(role)) {
        return res.status(400).json({ 
          success: false, 
          message: `Vous ne pouvez pas créer un utilisateur avec le rôle '${role}'` 
        });
      }

      // Vérifier que l'utilisateur parent a assez de ressources disponibles
      const [parentQuotas] = await db.execute(
        'SELECT * FROM user_quotas WHERE user_id = ?',
        [parentUserId]
      );

      if (parentQuotas.length === 0) {
        return res.status(400).json({ 
          success: false, 
          message: 'Vous n\'avez pas de quotas configurés' 
        });
      }

      const parent = parentQuotas[0];
      const availableVps = parent.max_vps - parent.used_vps;
      const availableCpu = parent.max_cpu - parent.used_cpu;
      const availableRam = parent.max_ram - parent.used_ram;
      const availableStorage = parent.max_storage - parent.used_storage;

      if (max_vps > availableVps || max_cpu > availableCpu || 
          max_ram > availableRam || max_storage > availableStorage) {
        return res.status(400).json({ 
          success: false, 
          message: 'Vous n\'avez pas assez de ressources disponibles pour créer cet utilisateur' 
        });
      }

      // Commencer une transaction
      const connection = await db.getConnection();
      await connection.beginTransaction();

      try {
        // Créer l'utilisateur
        const [userResult] = await connection.execute(
          'INSERT INTO users_new (username, email, password, role) VALUES (?, ?, ?, ?)',
          [username, email, password, role]
        );

        const newUserId = userResult.insertId;

        // Créer les quotas pour le nouvel utilisateur
        await connection.execute(
          'INSERT INTO user_quotas (user_id, max_vps, max_cpu, max_ram, max_storage) VALUES (?, ?, ?, ?, ?)',
          [newUserId, max_vps, max_cpu, max_ram, max_storage]
        );

        // Créer la relation hiérarchique
        const relationshipType = role === 'partner' ? 'subprovider-partner' : 'partner-client';
        await connection.execute(
          'INSERT INTO user_hierarchy (parent_user_id, child_user_id, relationship_type) VALUES (?, ?, ?)',
          [parentUserId, newUserId, relationshipType]
        );

        // Mettre à jour l'utilisation des quotas du parent
        await connection.execute(
          `UPDATE user_quotas 
           SET used_vps = used_vps + ?, used_cpu = used_cpu + ?, 
               used_ram = used_ram + ?, used_storage = used_storage + ?
           WHERE user_id = ?`,
          [max_vps, max_cpu, max_ram, max_storage, parentUserId]
        );

        await connection.commit();

        res.status(201).json({
          success: true,
          message: 'Utilisateur créé avec succès',
          data: { userId: newUserId, username, email, role }
        });

      } catch (error) {
        await connection.rollback();
        throw error;
      } finally {
        connection.release();
      }

    } catch (error) {
      console.error('Erreur lors de la création de l\'utilisateur:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Erreur serveur lors de la création de l\'utilisateur' 
      });
    }
  },

  // Mettre à jour un utilisateur enfant
  async updateChildUser(req, res) {
    try {
      const { userId } = req.params;
      const { username, email, max_vps, max_cpu, max_ram, max_storage } = req.body;
      const parentUserId = req.user.id;

      // Vérifier que l'utilisateur appartient bien à la hiérarchie du parent
      const [hierarchy] = await db.execute(
        'SELECT * FROM user_hierarchy WHERE parent_user_id = ? AND child_user_id = ?',
        [parentUserId, userId]
      );

      if (hierarchy.length === 0) {
        return res.status(403).json({ 
          success: false, 
          message: 'Vous ne pouvez pas modifier cet utilisateur' 
        });
      }

      // Vérifier que les nouveaux quotas ne dépassent pas les ressources disponibles du parent
      const [parentQuotas] = await db.execute(
        'SELECT * FROM user_quotas WHERE user_id = ?',
        [parentUserId]
      );

      const [childQuotas] = await db.execute(
        'SELECT * FROM user_quotas WHERE user_id = ?',
        [userId]
      );

      if (parentQuotas.length === 0 || childQuotas.length === 0) {
        return res.status(400).json({ 
          success: false, 
          message: 'Quotas non trouvés' 
        });
      }

      const parent = parentQuotas[0];
      const child = childQuotas[0];

      // Calculer les ressources disponibles du parent (en excluant l'utilisateur actuel)
      const availableVps = parent.max_vps - parent.used_vps + child.max_vps;
      const availableCpu = parent.max_cpu - parent.used_cpu + child.max_cpu;
      const availableRam = parent.max_ram - parent.used_ram + child.max_ram;
      const availableStorage = parent.max_storage - parent.used_storage + child.max_storage;

      if (max_vps > availableVps || max_cpu > availableCpu || 
          max_ram > availableRam || max_storage > availableStorage) {
        return res.status(400).json({ 
          success: false, 
          message: 'Vous n\'avez pas assez de ressources disponibles' 
        });
      }

      // Commencer une transaction
      const connection = await db.getConnection();
      await connection.beginTransaction();

      try {
        // Mettre à jour l'utilisateur
        await connection.execute(
          'UPDATE users_new SET username = ?, email = ? WHERE id = ?',
          [username, email, userId]
        );

        // Mettre à jour les quotas
        await connection.execute(
          `UPDATE user_quotas 
           SET max_vps = ?, max_cpu = ?, max_ram = ?, max_storage = ?
           WHERE user_id = ?`,
          [max_vps, max_cpu, max_ram, max_storage, userId]
        );

        // Mettre à jour l'utilisation des quotas du parent
        const vpsDelta = max_vps - child.max_vps;
        const cpuDelta = max_cpu - child.max_cpu;
        const ramDelta = max_ram - child.max_ram;
        const storageDelta = max_storage - child.max_storage;

        await connection.execute(
          `UPDATE user_quotas 
           SET used_vps = used_vps + ?, used_cpu = used_cpu + ?, 
               used_ram = used_ram + ?, used_storage = used_storage + ?
           WHERE user_id = ?`,
          [vpsDelta, cpuDelta, ramDelta, storageDelta, parentUserId]
        );

        await connection.commit();

        res.json({
          success: true,
          message: 'Utilisateur mis à jour avec succès'
        });

      } catch (error) {
        await connection.rollback();
        throw error;
      } finally {
        connection.release();
      }

    } catch (error) {
      console.error('Erreur lors de la mise à jour de l\'utilisateur:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Erreur serveur lors de la mise à jour de l\'utilisateur' 
      });
    }
  },

  // Supprimer un utilisateur enfant
  async deleteChildUser(req, res) {
    try {
      const { userId } = req.params;
      const parentUserId = req.user.id;

      // Vérifier que l'utilisateur appartient bien à la hiérarchie du parent
      const [hierarchy] = await db.execute(
        'SELECT * FROM user_hierarchy WHERE parent_user_id = ? AND child_user_id = ?',
        [parentUserId, userId]
      );

      if (hierarchy.length === 0) {
        return res.status(403).json({ 
          success: false, 
          message: 'Vous ne pouvez pas supprimer cet utilisateur' 
        });
      }

      // Récupérer les quotas de l'utilisateur à supprimer
      const [childQuotas] = await db.execute(
        'SELECT * FROM user_quotas WHERE user_id = ?',
        [userId]
      );

      if (childQuotas.length === 0) {
        return res.status(400).json({ 
          success: false, 
          message: 'Quotas non trouvés' 
        });
      }

      const child = childQuotas[0];

      // Commencer une transaction
      const connection = await db.getConnection();
      await connection.beginTransaction();

      try {
        // Libérer les ressources du parent
        await connection.execute(
          `UPDATE user_quotas 
           SET used_vps = used_vps - ?, used_cpu = used_cpu - ?, 
               used_ram = used_ram - ?, used_storage = used_storage - ?
           WHERE user_id = ?`,
          [child.max_vps, child.max_cpu, child.max_ram, child.max_storage, parentUserId]
        );

        // Supprimer la relation hiérarchique
        await connection.execute(
          'DELETE FROM user_hierarchy WHERE parent_user_id = ? AND child_user_id = ?',
          [parentUserId, userId]
        );

        // Supprimer les quotas
        await connection.execute(
          'DELETE FROM user_quotas WHERE user_id = ?',
          [userId]
        );

        // Supprimer l'utilisateur
        await connection.execute(
          'DELETE FROM users_new WHERE id = ?',
          [userId]
        );

        await connection.commit();

        res.json({
          success: true,
          message: 'Utilisateur supprimé avec succès'
        });

      } catch (error) {
        await connection.rollback();
        throw error;
      } finally {
        connection.release();
      }

    } catch (error) {
      console.error('Erreur lors de la suppression de l\'utilisateur:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Erreur serveur lors de la suppression de l\'utilisateur' 
      });
    }
  },

  // Obtenir les rôles autorisés selon la hiérarchie
  async getAllowedRoles(parentUserId) {
    try {
      // Récupérer le rôle du parent
      const [parent] = await db.execute(
        'SELECT role FROM users_new WHERE id = ?',
        [parentUserId]
      );

      if (parent.length === 0) return [];

      const parentRole = parent[0].role;

      // Définir les rôles autorisés selon la hiérarchie
      switch (parentRole) {
        case 'subprovider':
          return ['partner'];
        case 'partner':
          return ['user'];
        default:
          return [];
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des rôles autorisés:', error);
      return [];
    }
  },

  // Récupérer les statistiques de la hiérarchie
  async getHierarchyStats(req, res) {
    try {
      const userId = req.user.id;
      
      // Récupérer les statistiques des utilisateurs enfants
      const [stats] = await db.execute(`
        SELECT 
          COUNT(*) as total_users,
          SUM(uq.used_vps) as total_used_vps,
          SUM(uq.used_cpu) as total_used_cpu,
          SUM(uq.used_ram) as total_used_ram,
          SUM(uq.used_storage) as total_used_storage,
          SUM(uq.max_vps) as total_max_vps,
          SUM(uq.max_cpu) as total_max_cpu,
          SUM(uq.max_ram) as total_max_ram,
          SUM(uq.max_storage) as total_max_storage
        FROM user_hierarchy uh
        JOIN user_quotas uq ON uh.child_user_id = uq.user_id
        WHERE uh.parent_user_id = ?
      `, [userId]);

      res.json({
        success: true,
        data: stats[0] || {
          total_users: 0,
          total_used_vps: 0,
          total_used_cpu: 0,
          total_used_ram: 0,
          total_used_storage: 0,
          total_max_vps: 0,
          total_max_cpu: 0,
          total_max_ram: 0,
          total_max_storage: 0
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

module.exports = hierarchyController;
