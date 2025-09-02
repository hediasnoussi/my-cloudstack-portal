const mysql = require('mysql2/promise');
require('dotenv').config();

const debugDatabase = async () => {
  let connection;
  
  try {
    console.log('🔍 Diagnostic de la base de données...');
    console.log('📋 Variables d\'environnement :');
    console.log(`   DB_HOST: ${process.env.DB_HOST || 'localhost'}`);
    console.log(`   DB_USER: ${process.env.DB_USER || 'root'}`);
    console.log(`   DB_NAME: ${process.env.DB_NAME || 'cloudstack_portal'}`);
    
    // Connexion à la base de données
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'cloudstack_portal'
    });

    console.log('\n✅ Connexion à la base de données établie');

    // 1. Vérifier la base de données actuelle
    console.log('\n📋 Base de données actuelle :');
    const [dbInfo] = await connection.execute('SELECT DATABASE() as current_db');
    console.log(`   ${dbInfo[0].current_db}`);

    // 2. Lister toutes les tables
    console.log('\n📋 Toutes les tables existantes :');
    const [tables] = await connection.execute('SHOW TABLES');
    if (tables.length === 0) {
      console.log('   Aucune table trouvée');
    } else {
      tables.forEach(table => {
        const tableName = Object.values(table)[0];
        console.log(`   - ${tableName}`);
      });
    }

    // 3. Vérifier spécifiquement la table users
    console.log('\n📋 Vérification spécifique de la table users :');
    try {
      const [userTables] = await connection.execute('SHOW TABLES LIKE "users"');
      console.log(`   Résultat SHOW TABLES LIKE "users": ${userTables.length} table(s) trouvée(s)`);
      
      if (userTables.length > 0) {
        console.log('   ✅ Table users existe');
        
        // Essayer de décrire la table
        try {
          const [columns] = await connection.execute('DESCRIBE users');
          console.log('   ✅ DESCRIBE users réussi');
          console.log('   📋 Colonnes de la table users :');
          columns.forEach(col => {
            console.log(`      ${col.Field} | ${col.Type} | ${col.Null} | ${col.Key} | ${col.Default} | ${col.Extra}`);
          });
        } catch (descError) {
          console.log(`   ❌ Erreur DESCRIBE users: ${descError.message}`);
        }
      } else {
        console.log('   ❌ Table users n\'existe pas');
      }
    } catch (error) {
      console.log(`   ❌ Erreur lors de la vérification: ${error.message}`);
    }

    // 4. Essayer de créer la table users
    console.log('\n📋 Tentative de création de la table users...');
    try {
      const createTableSQL = `
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
      
      await connection.execute(createTableSQL);
      console.log('   ✅ CREATE TABLE users réussi');
      
      // Vérifier à nouveau
      const [newUserTables] = await connection.execute('SHOW TABLES LIKE "users"');
      console.log(`   📊 Vérification post-création: ${newUserTables.length} table(s) users`);
      
    } catch (createError) {
      console.log(`   ❌ Erreur CREATE TABLE: ${createError.message}`);
    }

  } catch (error) {
    console.error('❌ Erreur générale :', error);
  } finally {
    if (connection) {
      await connection.end();
      console.log('\n🔌 Connexion à la base de données fermée');
    }
  }
};

// Exécution du script
debugDatabase();
