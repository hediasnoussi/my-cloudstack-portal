const mysql = require('mysql2/promise');
require('dotenv').config();

const fixUserRole = async () => {
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

    // 2. Vérifier l'utilisateur 'user' dans toutes les tables possibles
    const possibleTables = ['users', 'users_new', 'user'];
    
    for (const tableName of possibleTables) {
      try {
        console.log(`\n📋 Vérification de la table ${tableName} :`);
        
        // Vérifier si la table existe
        const [tableExists] = await connection.execute(`SHOW TABLES LIKE "${tableName}"`);
        if (tableExists.length === 0) {
          console.log(`   ❌ Table ${tableName} n'existe pas`);
          continue;
        }

        // Vérifier la structure de la table
        const [columns] = await connection.execute(`DESCRIBE ${tableName}`);
        console.log(`   📊 Structure: ${columns.map(col => col.Field).join(', ')}`);

        // Chercher l'utilisateur 'user'
        const [users] = await connection.execute(`SELECT * FROM ${tableName} WHERE username = 'user'`);
        
        if (users.length > 0) {
          const user = users[0];
          console.log(`   👤 Utilisateur trouvé: ${user.username}`);
          console.log(`   📧 Email: ${user.email}`);
          console.log(`   🎭 Rôle actuel: ${user.role}`);
          console.log(`   🆔 ID: ${user.id}`);
          
          // Si le rôle n'est pas 'user', le corriger
          if (user.role !== 'user') {
            console.log(`   ⚠️  Rôle incorrect détecté !`);
            console.log(`   🔧 Correction du rôle de '${user.role}' vers 'user'...`);
            
            await connection.execute(
              `UPDATE ${tableName} SET role = 'user', updated_at = NOW() WHERE username = 'user'`
            );
            
            console.log(`   ✅ Rôle corrigé !`);
            
            // Vérifier la correction
            const [updatedUser] = await connection.execute(`SELECT username, role FROM ${tableName} WHERE username = 'user'`);
            console.log(`   🔍 Vérification: ${updatedUser[0].username} - Rôle: ${updatedUser[0].role}`);
          } else {
            console.log(`   ✅ Rôle correct: ${user.role}`);
          }
        } else {
          console.log(`   ❌ Utilisateur 'user' non trouvé dans ${tableName}`);
        }
        
      } catch (error) {
        console.log(`   ❌ Erreur avec la table ${tableName}: ${error.message}`);
      }
    }

    // 3. Afficher tous les utilisateurs de la table active
    console.log('\n📋 Tous les utilisateurs dans la base :');
    try {
      const [allUsers] = await connection.execute('SELECT username, email, role FROM users ORDER BY role, username');
      allUsers.forEach(user => {
        console.log(`   👤 ${user.username} | ${user.email} | Rôle: ${user.role}`);
      });
    } catch (error) {
      console.log(`   ❌ Erreur lors de la récupération des utilisateurs: ${error.message}`);
    }

    console.log('\n🎯 Credentials corrigés :');
    console.log('==========================');
    console.log('   👤 Username: user');
    console.log('   🔑 Password: password123');
    console.log('   🎭 Role: user (corrigé)');
    console.log('   🚀 Redirection: /user-dashboard');

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
fixUserRole();
