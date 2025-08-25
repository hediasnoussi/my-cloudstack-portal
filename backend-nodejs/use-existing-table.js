const mysql = require('mysql2/promise');
require('dotenv').config();

const useExistingTable = async () => {
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

    // 2. Utiliser la table users_new qui fonctionne
    console.log('\n📋 Utilisation de la table users_new...');
    
    try {
      const [columns] = await connection.execute('DESCRIBE users_new');
      console.log('   ✅ DESCRIBE users_new réussi');
      console.log('   📋 Structure de la table users_new :');
      columns.forEach(col => {
        console.log(`      ${col.Field} | ${col.Type} | ${col.Null} | ${col.Key} | ${col.Default} | ${col.Extra}`);
      });
      
      // 3. Créer les utilisateurs de test dans users_new
      console.log('\n📋 Création des utilisateurs de test...');
      
      const testUsers = [
        {
          username: 'admin',
          email: 'admin@cloudstack.com',
          password: '$2b$10$E17.fhD/e0H7PMsOzw0IuOZ7OmYj5Zfm2Md/ejM8Gkk/PFcGfylwW',
          role: 'admin',
          account_id: null
        },
        {
          username: 'subprovider1',
          email: 'subprovider1@cloudstack.com',
          password: '$2b$10$E17.fhD/e0H7PMsOzw0IuOZ7OmYj5Zfm2Md/ejM8Gkk/PFcGfylwW',
          role: 'subprovider',
          account_id: null
        },
        {
          username: 'partner1',
          email: 'partner1@cloudstack.com',
          password: '$2b$10$hLZm./QnjIwoAGHXMrwN5unVUnXZ6MBkQQfrZLpbC3IjpbjcsZvk.',
          role: 'partner',
          account_id: null
        },
        {
          username: 'client1',
          email: 'client1@cloudstack.com',
          password: '$2b$10$hwb1eFejj93vvzdtaf2a5eW0P0KRa44kHtLIfkhBCpTSL5FbpPI4u',
          role: 'user',
          account_id: null
        }
      ];

      for (const user of testUsers) {
        try {
          await connection.execute(
            'INSERT INTO users_new (username, email, password, role, account_id) VALUES (?, ?, ?, ?, ?)',
            [user.username, user.email, user.password, user.role, user.account_id]
          );
          console.log(`   ✅ Utilisateur ${user.username} (${user.role}) créé avec succès`);
        } catch (error) {
          if (error.code === 'ER_DUP_ENTRY') {
            console.log(`   ℹ️ Utilisateur ${user.username} existe déjà`);
          } else {
            console.error(`   ❌ Erreur lors de la création de ${user.username}:`, error.message);
          }
        }
      }

      // 4. Vérifier les utilisateurs créés
      console.log('\n📋 Utilisateurs dans la table users_new :');
      const [users] = await connection.execute('SELECT id, username, email, role FROM users_new');
      users.forEach(user => {
        console.log(`   ID: ${user.id} | ${user.username} | ${user.email} | ${user.role}`);
      });

      console.log('\n🎉 Utilisateurs de test créés avec succès dans users_new !');
      console.log('\n🔑 Mots de passe de test :');
      console.log('   admin / admin123');
      console.log('   subprovider1 / sub123');
      console.log('   partner1 / partner123');
      console.log('   client1 / client123');
      
      console.log('\n💡 Note: La table s\'appelle "users_new" au lieu de "users"');
      console.log('   Vous pouvez l\'utiliser comme table users principale');

    } catch (error) {
      console.log(`   ❌ Erreur avec users_new: ${error.message}`);
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
useExistingTable();
