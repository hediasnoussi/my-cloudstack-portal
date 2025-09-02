const mysql = require('mysql2/promise');
require('dotenv').config();

const checkUsersTable = async () => {
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

    // Vérifier la structure de la table users
    console.log('📋 Structure de la table users :');
    const [columns] = await connection.execute('DESCRIBE users');
    columns.forEach(col => {
      console.log(`   ${col.Field} | ${col.Type} | ${col.Null} | ${col.Key} | ${col.Default} | ${col.Extra}`);
    });

    // Vérifier les données existantes
    console.log('\n📋 Données de la table users :');
    const [users] = await connection.execute('SELECT * FROM users LIMIT 5');
    console.log(users);

    // Vérifier les contraintes
    console.log('\n📋 Contraintes de la table users :');
    const [constraints] = await connection.execute(`
      SELECT 
        CONSTRAINT_NAME,
        COLUMN_NAME,
        REFERENCED_TABLE_NAME,
        REFERENCED_COLUMN_NAME
      FROM information_schema.KEY_COLUMN_USAGE 
      WHERE TABLE_SCHEMA = 'cloudstack_portal' 
      AND TABLE_NAME = 'users'
    `);
    console.log(constraints);

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
checkUsersTable();
