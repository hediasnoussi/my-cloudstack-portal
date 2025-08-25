const mysql = require('mysql2/promise');
require('dotenv').config();

const recreateUsersTable = async () => {
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

    // 1. Supprimer la table users si elle existe
    console.log('📋 Suppression de la table users existante...');
    try {
      await connection.execute('DROP TABLE IF EXISTS users');
      console.log('✅ Table users supprimée');
    } catch (error) {
      console.log(`ℹ️ Erreur lors de la suppression: ${error.message}`);
    }

    // 2. Créer une nouvelle table users
    console.log('📋 Création d\'une nouvelle table users...');
    const createTableSQL = `
      CREATE TABLE users (
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
    console.log('✅ Table users créée avec succès');

    // 3. Vérifier que la table fonctionne
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

    // 4. Tester l'insertion d'un utilisateur
    console.log('\n📋 Test d\'insertion d\'un utilisateur...');
    try {
      await connection.execute(
        'INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)',
        ['testuser', 'test@test.com', 'testpass', 'user']
      );
      console.log('   ✅ Insertion de test réussie');
      
      // Vérifier l'utilisateur créé
      const [users] = await connection.execute('SELECT * FROM users');
      console.log(`   📊 Utilisateurs dans la table: ${users.length}`);
      
      // Nettoyer l'utilisateur de test
      await connection.execute('DELETE FROM users WHERE username = ?', ['testuser']);
      console.log('   🧹 Utilisateur de test supprimé');
      
    } catch (error) {
      console.log(`   ❌ Erreur lors du test d'insertion: ${error.message}`);
    }

    console.log('\n🎉 Table users recréée et testée avec succès !');

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
recreateUsersTable();
