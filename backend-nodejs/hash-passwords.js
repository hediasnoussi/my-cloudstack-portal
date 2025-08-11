const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');
const config = require('./config');

async function hashPasswords() {
  let connection;
  
  try {
    connection = await mysql.createConnection({
      host: config.database.host,
      user: config.database.user,
      password: config.database.password,
      database: config.database.database
    });

    console.log('Connexion MySQL établie');

    // Récupérer tous les utilisateurs
    const [users] = await connection.execute('SELECT id, username, password FROM users');
    
    console.log(`Trouvé ${users.length} utilisateurs à traiter`);

    for (const user of users) {
      // Vérifier si le mot de passe est déjà hashé
      if (user.password.length < 60) { // Les mots de passe hashés par bcrypt font 60 caractères
        console.log(`Hachage du mot de passe pour ${user.username}...`);
        
        // Hasher le mot de passe
        const hashedPassword = await bcrypt.hash(user.password, 10);
        
        // Mettre à jour en base
        await connection.execute(
          'UPDATE users SET password = ? WHERE id = ?',
          [hashedPassword, user.id]
        );
        
        console.log(`✅ Mot de passe hashé pour ${user.username}`);
      } else {
        console.log(`⏭️ Mot de passe déjà hashé pour ${user.username}`);
      }
    }

    console.log('✅ Tous les mots de passe ont été traités');

  } catch (error) {
    console.error('Erreur lors du hachage des mots de passe:', error);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

hashPasswords(); 