const mysql = require('mysql2/promise');
require('dotenv').config();

const finalUsersSetup = async () => {
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

    // 1. Vérifier l'état actuel
    console.log('📋 État actuel de la base de données :');
    const [tables] = await connection.execute('SHOW TABLES');
    console.log(`   Tables existantes: ${tables.length}`);
    tables.forEach(table => {
      const tableName = Object.values(table)[0];
      console.log(`   - ${tableName}`);
    });

    // 2. Essayer de supprimer la table users de plusieurs façons
    console.log('\n📋 Tentative de suppression de la table users...');
    
    try {
      // Désactiver les vérifications de clés étrangères
      await connection.execute('SET FOREIGN_KEY_CHECKS = 0');
      console.log('   ✅ Vérifications FK désactivées');
      
      // Supprimer la table
      await connection.execute('DROP TABLE IF EXISTS users');
      console.log('   ✅ Table users supprimée');
      
      // Réactiver les vérifications
      await connection.execute('SET FOREIGN_KEY_CHECKS = 1');
      console.log('   ✅ Vérifications FK réactivées');
      
    } catch (error) {
      console.log(`   ℹ️ Erreur lors de la suppression: ${error.message}`);
    }

    // 3. Attendre un peu
    console.log('\n📋 Attente de 3 secondes...');
    await new Promise(resolve => setTimeout(resolve, 3000));

    // 4. Créer une nouvelle table users avec un nom temporaire
    console.log('📋 Création d\'une nouvelle table users...');
    
    try {
      const createTableSQL = `
        CREATE TABLE users_temp (
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
      console.log('   ✅ Table users_temp créée avec succès');
      
      // 5. Renommer la table
      console.log('📋 Renommage de la table...');
      await connection.execute('RENAME TABLE users_temp TO users');
      console.log('   ✅ Table renommée en users');
      
    } catch (error) {
      console.log(`   ❌ Erreur lors de la création: ${error.message}`);
      
      // Essayer de créer directement avec le nom users
      console.log('📋 Tentative de création directe de la table users...');
      try {
        const createDirectSQL = `
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
        
        await connection.execute(createDirectSQL);
        console.log('   ✅ Table users créée directement');
      } catch (directError) {
        console.log(`   ❌ Erreur création directe: ${directError.message}`);
        return;
      }
    }

    // 6. Vérifier que la table fonctionne
    console.log('\n📋 Vérification finale de la table users :');
    const [userTables] = await connection.execute('SHOW TABLES LIKE "users"');
    console.log(`   Tables users trouvées: ${userTables.length}`);
    
    if (userTables.length > 0) {
      try {
        const [columns] = await connection.execute('DESCRIBE users');
        console.log('   ✅ DESCRIBE users réussi');
        console.log('   📋 Structure de la table :');
        columns.forEach(col => {
          console.log(`      ${col.Field} | ${col.Type} | ${col.Null} | ${col.Key} | ${col.Default} | ${col.Extra}`);
        });
        
        // 7. Tester l'insertion
        console.log('\n📋 Test d\'insertion d\'un utilisateur...');
        await connection.execute(
          'INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)',
          ['testuser', 'test@test.com', 'testpass', 'user']
        );
        console.log('   ✅ Insertion de test réussie');
        
        // Vérifier
        const [users] = await connection.execute('SELECT COUNT(*) as count FROM users');
        console.log(`   📊 Nombre d'utilisateurs: ${users[0].count}`);
        
        // Nettoyer
        await connection.execute('DELETE FROM users WHERE username = ?', ['testuser']);
        console.log('   🧹 Utilisateur de test supprimé');
        
        console.log('\n🎉 Table users fonctionne parfaitement !');
        
      } catch (error) {
        console.log(`   ❌ Erreur lors de la vérification: ${error.message}`);
      }
    } else {
      console.log('   ❌ Table users n\'existe toujours pas');
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
finalUsersSetup();
