const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');

async function resetPasswords() {
  try {
    // Connexion à la base de données
    const connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '',
      database: 'cloudstack_portal'
    });

    console.log('✅ Connexion à MySQL réussie');

    // Hash du nouveau mot de passe
    const newPassword = 'password123';
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    console.log(`🔐 Nouveau hash pour "password123": ${hashedPassword}`);

    // Mettre à jour tous les utilisateurs
    const [result] = await connection.execute(
      'UPDATE users_new SET password = ?',
      [hashedPassword]
    );

    console.log(`✅ ${result.affectedRows} utilisateurs mis à jour`);

    // Vérifier que ça fonctionne
    const [users] = await connection.execute('SELECT username, role FROM users_new');
    console.log('\n📋 Utilisateurs mis à jour :');
    users.forEach(user => {
      console.log(`- ${user.username} (${user.role})`);
    });

    await connection.end();
    console.log('\n🎉 Tous les mots de passe sont maintenant "password123" !');

  } catch (error) {
    console.error('❌ Erreur:', error);
  }
}

resetPasswords();
