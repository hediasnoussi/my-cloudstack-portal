const mysql = require('mysql2/promise');
require('dotenv').config();

const createQuotaTablesFinal = async () => {
  let connection;
  
  try {
    // Connexion à la base de données
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'cloudstack_portal'
    });

    console.log('✅ Connexion à la base de données établie');

    // 1. Table des quotas utilisateur
    const createUserQuotasTable = `
      CREATE TABLE IF NOT EXISTS user_quotas (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        max_vps INT DEFAULT 0,
        max_cpu INT DEFAULT 0,
        max_ram INT DEFAULT 0,
        max_storage INT DEFAULT 0,
        used_vps INT DEFAULT 0,
        used_cpu INT DEFAULT 0,
        used_ram INT DEFAULT 0,
        used_storage INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users_new(id) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `;

    // 2. Table des relations hiérarchiques
    const createUserHierarchyTable = `
      CREATE TABLE IF NOT EXISTS user_hierarchy (
        id INT AUTO_INCREMENT PRIMARY KEY,
        parent_user_id INT,
        child_user_id INT NOT NULL,
        relationship_type ENUM('subprovider-partner', 'partner-client') NOT NULL,
        quota_assigned BOOLEAN DEFAULT FALSE,
        assigned_quota_id INT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (parent_user_id) REFERENCES users_new(id) ON DELETE SET NULL,
        FOREIGN KEY (child_user_id) REFERENCES users_new(id) ON DELETE CASCADE,
        FOREIGN KEY (assigned_quota_id) REFERENCES user_quotas(id) ON DELETE SET NULL
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `;

    // 3. Table des VPS avec propriétaire
    const createVpsOwnershipTable = `
      CREATE TABLE IF NOT EXISTS vps_ownership (
        id INT AUTO_INCREMENT PRIMARY KEY,
        vps_id VARCHAR(100) NOT NULL,
        vps_name VARCHAR(255) NOT NULL,
        owner_user_id INT NOT NULL,
        created_by_user_id INT NOT NULL,
        template VARCHAR(255),
        compute_offering VARCHAR(255),
        status ENUM('running', 'stopped', 'starting', 'stopping', 'error') DEFAULT 'stopped',
        ip_address VARCHAR(45),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (owner_user_id) REFERENCES users_new(id) ON DELETE CASCADE,
        FOREIGN KEY (created_by_user_id) REFERENCES users_new(id) ON DELETE CASCADE,
        INDEX idx_owner (owner_user_id),
        INDEX idx_created_by (created_by_user_id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `;

    // Exécution des requêtes
    console.log('📋 Création de la table user_quotas...');
    await connection.execute(createUserQuotasTable);
    console.log('✅ Table user_quotas créée avec succès');

    console.log('📋 Création de la table user_hierarchy...');
    await connection.execute(createUserHierarchyTable);
    console.log('✅ Table user_hierarchy créée avec succès');

    console.log('📋 Création de la table vps_ownership...');
    await connection.execute(createVpsOwnershipTable);
    console.log('✅ Table vps_ownership créée avec succès');

    // 4. Insertion des quotas par défaut pour les utilisateurs existants
    console.log('📋 Insertion des quotas par défaut...');
    
    // Récupérer tous les utilisateurs existants
    const [users] = await connection.execute('SELECT id, role FROM users_new');
    
    for (const user of users) {
      // Vérifier si l'utilisateur a déjà un quota
      const [existingQuota] = await connection.execute(
        'SELECT id FROM user_quotas WHERE user_id = ?',
        [user.id]
      );

      if (existingQuota.length === 0) {
        // Définir les quotas selon le rôle
        let quota = {
          max_vps: 0,
          max_cpu: 0,
          max_ram: 0,
          max_storage: 0
        };

        switch (user.role) {
          case 'admin':
            quota = { max_vps: 10000, max_cpu: 10000, max_ram: 100000, max_storage: 1000000 };
            break;
          case 'subprovider':
            quota = { max_vps: 1000, max_cpu: 1000, max_ram: 10000, max_storage: 100000 };
            break;
          case 'partner':
            quota = { max_vps: 100, max_cpu: 100, max_ram: 1000, max_storage: 10000 };
            break;
          case 'user':
            quota = { max_vps: 10, max_cpu: 10, max_ram: 100, max_storage: 1000 };
            break;
          default:
            quota = { max_vps: 100, max_cpu: 100, max_ram: 1000, max_storage: 10000 };
        }

        await connection.execute(
          'INSERT INTO user_quotas (user_id, max_vps, max_cpu, max_ram, max_storage) VALUES (?, ?, ?, ?, ?)',
          [user.id, quota.max_vps, quota.max_cpu, quota.max_ram, quota.max_storage]
        );

        console.log(`✅ Quota créé pour l'utilisateur ${user.id} (${user.role}): ${quota.max_vps} VPS, ${quota.max_cpu} CPU, ${quota.max_ram} GB RAM, ${quota.max_storage} GB Storage`);
      }
    }

    // 5. Créer quelques relations hiérarchiques de test
    console.log('\n📋 Création des relations hiérarchiques de test...');
    
    try {
      // SubProvider -> Partner
      await connection.execute(
        'INSERT INTO user_hierarchy (parent_user_id, child_user_id, relationship_type) VALUES (?, ?, ?)',
        [2, 3, 'subprovider-partner'] // subprovider1 -> partner1
      );
      console.log('✅ Relation subprovider1 -> partner1 créée');

      // Partner -> Client
      await connection.execute(
        'INSERT INTO user_hierarchy (parent_user_id, child_user_id, relationship_type) VALUES (?, ?, ?)',
        [3, 4, 'partner-client'] // partner1 -> client1
      );
      console.log('✅ Relation partner1 -> client1 créée');

    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        console.log('ℹ️ Relations hiérarchiques existent déjà');
      } else {
        console.log(`ℹ️ Erreur lors de la création des relations: ${error.message}`);
      }
    }

    console.log('\n🎉 Toutes les tables de quotas ont été créées avec succès !');
    console.log('\n📊 Structure créée :');
    console.log('   - user_quotas : Gestion des quotas par utilisateur');
    console.log('   - user_hierarchy : Relations hiérarchiques entre utilisateurs');
    console.log('   - vps_ownership : Propriété et création des VPS');
    console.log('\n👥 Hiérarchie créée :');
    console.log('   subprovider1 (SubProvider) -> partner1 (Partner) -> client1 (Client)');
    console.log('\n💡 Note: La table users s\'appelle "users_new" dans la base de données');

  } catch (error) {
    console.error('❌ Erreur lors de la création des tables :', error);
  } finally {
    if (connection) {
      await connection.end();
      console.log('🔌 Connexion à la base de données fermée');
    }
  }
};

// Exécution du script
createQuotaTablesFinal();
