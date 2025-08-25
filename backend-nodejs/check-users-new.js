const mysql = require('mysql2/promise');

// Database configuration
const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'cloudstack_portal'
};

async function checkUsersNew() {
  let connection;
  
  try {
    // Connect to database
    connection = await mysql.createConnection(dbConfig);
    console.log('✅ Connected to database successfully');

    // Check table structure
    console.log('\n📋 Structure de la table users_new:');
    const [columns] = await connection.execute('DESCRIBE users_new');
    columns.forEach(col => {
      console.log(`   ${col.Field} - ${col.Type} ${col.Null === 'NO' ? 'NOT NULL' : 'NULL'} ${col.Key === 'PRI' ? 'PRIMARY KEY' : ''}`);
    });

    // Check table content
    console.log('\n📊 Contenu de la table users_new:');
    const [users] = await connection.execute('SELECT id, username, email, role, created_at FROM users_new ORDER BY id');
    
    if (users.length === 0) {
      console.log('   Aucun utilisateur trouvé');
    } else {
      users.forEach(user => {
        console.log(`   👤 ID: ${user.id} | Username: ${user.username} | Email: ${user.email} | Role: ${user.role}`);
      });
    }

    // Count total users
    const [countResult] = await connection.execute('SELECT COUNT(*) as total FROM users_new');
    console.log(`\n📈 Total utilisateurs: ${countResult[0].total}`);

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    if (connection) {
      await connection.end();
      console.log('\n🔌 Database connection closed');
    }
  }
}

// Run the check
checkUsersNew().catch(console.error);
