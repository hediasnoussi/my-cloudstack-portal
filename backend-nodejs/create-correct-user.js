const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const createCorrectUser = async () => {
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

    // 1. Vérifier les tables existantes
    console.log('📋 Tables existantes :');
    const [tables] = await connection.execute('SHOW TABLES');
    tables.forEach(table => {
      const tableName = Object.values(table)[0];
      console.log(`   - ${tableName}`);
    });

    // 2. Déterminer quelle table utiliser
    let targetTable = 'users';
    if (tables.some(table => Object.values(table)[0] === 'users_new')) {
      targetTable = 'users_new';
    }

    console.log(`\n🎯 Utilisation de la table: ${targetTable}`);

    // 3. Vérifier la structure de la table
    const [columns] = await connection.execute(`DESCRIBE ${targetTable}`);
    console.log(`📊 Structure: ${columns.map(col => col.Field).join(', ')}`);

    // 4. Supprimer l'ancien utilisateur 'user' s'il existe
    console.log('\n🗑️  Suppression de l\'ancien utilisateur "user"...');
    try {
      await connection.execute(`DELETE FROM ${targetTable} WHERE username = 'user'`);
      console.log('   ✅ Ancien utilisateur supprimé');
    } catch (error) {
      console.log(`   ℹ️  Aucun ancien utilisateur à supprimer: ${error.message}`);
    }

    // 5. Créer le nouvel utilisateur avec le bon rôle
    console.log('\n👤 Création du nouvel utilisateur "user"...');
    
    const hashedPassword = await bcrypt.hash('password123', 10);
    
    const insertSQL = `
      INSERT INTO ${targetTable} (username, email, password, role, created_at, updated_at) 
      VALUES (?, ?, ?, ?, NOW(), NOW())
    `;
    
    await connection.execute(insertSQL, [
      'user',
      'user@focustechnology.com',
      hashedPassword,
      'user'
    ]);
    
    console.log('   ✅ Nouvel utilisateur créé avec succès !');

    // 6. Vérifier la création
    console.log('\n🔍 Vérification de l\'utilisateur créé :');
    const [newUser] = await connection.execute(`SELECT * FROM ${targetTable} WHERE username = 'user'`);
    
    if (newUser.length > 0) {
      const user = newUser[0];
      console.log(`   👤 Username: ${user.username}`);
      console.log(`   📧 Email: ${user.email}`);
      console.log(`   🎭 Role: ${user.role}`);
      console.log(`   🆔 ID: ${user.id}`);
      console.log(`   📅 Créé le: ${user.created_at}`);
    }

    // 7. Afficher tous les utilisateurs
    console.log('\n📋 Tous les utilisateurs dans la base :');
    const [allUsers] = await connection.execute(`SELECT username, email, role FROM ${targetTable} ORDER BY role, username`);
    allUsers.forEach(user => {
      console.log(`   👤 ${user.username} | ${user.email} | Rôle: ${user.role}`);
    });

    console.log('\n🎯 Credentials corrigés :');
    console.log('==========================');
    console.log('   👤 Username: user');
    console.log('   🔑 Password: password123');
    console.log('   🎭 Role: user (correct)');
    console.log('   🚀 Redirection: /user-dashboard');
    console.log('   📧 Email: user@focustechnology.com');

  } catch (error) {
    console.error('❌ Erreur :', error);
  } finally {
    if (connection) {
      await connection.end();
      console.log('\n🔌 Connexion à la base de données fermée');
    }
  }
};

// Exécution du script
createCorrectUser();
