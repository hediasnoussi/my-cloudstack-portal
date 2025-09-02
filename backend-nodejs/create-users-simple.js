const mysql = require('mysql2/promise');
require('dotenv').config();

const createUsersSimple = async () => {
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

    // Créer la table users de manière simple
    const createUsersTable = `
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(100) NOT NULL UNIQUE,
        email VARCHAR(150) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        role ENUM('admin', 'user', 'subprovider', 'partner') DEFAULT 'user',
        account_id INT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `;

    console.log('📋 Création de la table users...');
    await connection.execute(createUsersTable);
    console.log('✅ Table users créée avec succès');

    // Vérifier que la table existe
    console.log('\n📋 Vérification de la table users :');
    const [tables] = await connection.execute('SHOW TABLES LIKE "users"');
    if (tables.length > 0) {
      console.log('✅ Table users existe bien');
      
      // Vérifier la structure
      const [columns] = await connection.execute('DESCRIBE users');
      console.log('\n📋 Structure de la table users :');
      columns.forEach(col => {
        console.log(`   ${col.Field} | ${col.Type} | ${col.Null} | ${col.Key} | ${col.Default} | ${col.Extra}`);
      });
    } else {
      console.log('❌ Table users n\'existe pas');
    }

  } catch (error) {
    console.error('❌ Erreur :', error);
  } finally {
    if (connection) {
      await connection.end();
      console.log('🔌 Connexion à la base de données fermée');
    }
  }
};

// Exécution du script
createUsersSimple();
