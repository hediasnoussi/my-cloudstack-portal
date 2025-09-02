const mysql = require('mysql2/promise');
require('dotenv').config();

const insertTestUsers = async () => {
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

    // Insérer des utilisateurs de test
    console.log('📋 Insertion des utilisateurs de test...');
    
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

    // Vérifier les utilisateurs créés
    console.log('\n📋 Utilisateurs dans la base de données :');
    const [users] = await connection.execute('SELECT id, username, email, role FROM users');
    users.forEach(user => {
      console.log(`   ID: ${user.id} | ${user.username} | ${user.email} | ${user.role}`);
    });

    console.log('\n🎉 Utilisateurs de test créés avec succès !');

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
insertTestUsers();
