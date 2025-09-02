const mysql = require('mysql2/promise');
require('dotenv').config();

const cleanMySQL = async () => {
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

    // 1. Forcer la suppression de la table users
    console.log('📋 Suppression forcée de la table users...');
    try {
      await connection.execute('DROP TABLE IF EXISTS users FORCE');
      console.log('✅ Table users supprimée avec FORCE');
    } catch (error) {
      console.log(`ℹ️ Erreur lors de la suppression FORCE: ${error.message}`);
      
      // Essayer une autre approche
      try {
        await connection.execute('SET FOREIGN_KEY_CHECKS = 0');
        await connection.execute('DROP TABLE IF EXISTS users');
        await connection.execute('SET FOREIGN_KEY_CHECKS = 1');
        console.log('✅ Table users supprimée avec désactivation des FK');
      } catch (error2) {
        console.log(`ℹ️ Erreur lors de la suppression avec FK désactivées: ${error2.message}`);
      }
    }

    // 2. Attendre un peu
    console.log('📋 Attente de 2 secondes...');
    await new Promise(resolve => setTimeout(resolve, 2000));

    // 3. Créer une nouvelle table users avec un nom différent
    console.log('📋 Création d\'une nouvelle table users...');
    const createTableSQL = `
      CREATE TABLE users_new (
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
    console.log('✅ Table users_new créée avec succès');

    // 4. Renommer la table
    console.log('📋 Renommage de la table...');
    await connection.execute('RENAME TABLE users_new TO users');
    console.log('✅ Table renommée en users');

    // 5. Vérifier que la table fonctionne
    console.log('\n📋 Vérification de la table users :');
    const [tables] = await connection.execute('SHOW TABLES LIKE "users"');
    console.log(`   Tables users trouvées: ${tables.length}`);
    
    if (tables.length > 0) {
      const [columns] = await connection.execute('DESCRIBE users');
      console.log('   ✅ DESCRIBE users réussi');
      console.log('   📋 Structure de la table :');
      columns.forEach(col => {
        console.log(`      ${col.Field} | ${col.Type} | ${col.Null} | ${col.Key} | ${col.Default} | ${col.Extra}`);
      });
    }

    console.log('\n🎉 Table users nettoyée et recréée avec succès !');

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
cleanMySQL();
