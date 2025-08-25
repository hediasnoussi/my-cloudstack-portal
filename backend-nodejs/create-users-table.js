const mysql = require('mysql2/promise');
require('dotenv').config();

const createUsersTable = async () => {
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

    // Créer la table users
    const createUsersTable = `
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(100) NOT NULL UNIQUE,
        email VARCHAR(150) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        role ENUM('admin', 'user', 'subprovider', 'partner') DEFAULT 'user',
        account_id INT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (account_id) REFERENCES accounts(id)
          ON DELETE SET NULL
          ON UPDATE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `;

    console.log('📋 Création de la table users...');
    await connection.execute(createUsersTable);
    console.log('✅ Table users créée avec succès');

    // Insérer des utilisateurs de test avec des rôles appropriés
    console.log('📋 Insertion des utilisateurs de test...');
    
    const testUsers = [
      {
        username: 'admin',
        email: 'admin@cloudstack.com',
        password: '$2b$10$E17.fhD/e0H7PMsOzw0IuOZ7OmYj5Zfm2Md/ejM8Gkk/PFcGfylwW', // admin123
        role: 'admin',
        account_id: null
      },
      {
        username: 'subprovider1',
        email: 'subprovider1@cloudstack.com',
        password: '$2b$10$E17.fhD/e0H7PMsOzw0IuOZ7OmYj5Zfm2Md/ejM8Gkk/PFcGfylwW', // sub123
        role: 'subprovider',
        account_id: null
      },
      {
        username: 'partner1',
        email: 'partner1@cloudstack.com',
        password: '$2b$10$hLZm./QnjIwoAGHXMrwN5unVUnXZ6MBkQQfrZLpbC3IjpbjcsZvk.', // partner123
        role: 'partner',
        account_id: null
      },
      {
        username: 'client1',
        email: 'client1@cloudstack.com',
        password: '$2b$10$hwb1eFejj93vvzdtaf2a5eW0P0KRa44kHtLIfkhBCpTSL5FbpPI4u', // client123
        role: 'user',
        account_id: null
      }
    ];

    for (const user of testUsers) {
      try {
        await connection.execute(
          'INSERT INTO users (username, email, password, role, account_id) VALUES (?, ?, ?, ?, ?)',
          [user.username, user.email, user.password, user.role, user.account_id]
        );
        console.log(`✅ Utilisateur ${user.username} (${user.role}) créé avec succès`);
      } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
          console.log(`ℹ️ Utilisateur ${user.username} existe déjà`);
        } else {
          console.error(`❌ Erreur lors de la création de ${user.username}:`, error.message);
        }
      }
    }

    // Vérifier la structure créée
    console.log('\n📋 Structure de la table users créée :');
    const [columns] = await connection.execute('DESCRIBE users');
    columns.forEach(col => {
      console.log(`   ${col.Field} | ${col.Type} | ${col.Null} | ${col.Key} | ${col.Default} | ${col.Extra}`);
    });

    console.log('\n🎉 Table users créée avec succès !');
    console.log('📊 Utilisateurs de test créés avec les rôles : admin, subprovider, partner, user');

  } catch (error) {
    console.error('❌ Erreur lors de la création de la table users :', error);
  } finally {
    if (connection) {
      await connection.end();
      console.log('🔌 Connexion à la base de données fermée');
    }
  }
};

// Exécution du script
createUsersTable();
