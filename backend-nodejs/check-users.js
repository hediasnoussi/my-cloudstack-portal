const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');

async function checkUsers() {
  try {
    // Connexion à la base de données
    const connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '',
      database: 'cloudstack_portal'
    });

    console.log('✅ Connexion à MySQL réussie');

    // Vérifier les utilisateurs existants
    const [users] = await connection.execute('SELECT id, username, email, role, password FROM users_new');
    
    console.log('\n📋 Utilisateurs existants :');
    users.forEach(user => {
      console.log(`- ${user.username} (${user.email}) - Rôle: ${user.role}`);
      console.log(`  Mot de passe hashé: ${user.password.substring(0, 20)}...`);
    });

    // Tester le hash de "password123"
    const testPassword = 'password123';
    const hashedPassword = await bcrypt.hash(testPassword, 10);
    console.log(`\n🔐 Hash de "password123": ${hashedPassword}`);

    // Vérifier si un utilisateur peut se connecter avec "password123"
    for (const user of users) {
      const isValid = await bcrypt.compare(testPassword, user.password);
      console.log(`\n🔍 Test de connexion pour ${user.username}:`);
      console.log(`   Mot de passe "password123" valide: ${isValid ? '✅ OUI' : '❌ NON'}`);
    }

    await connection.end();
    console.log('\n✅ Vérification terminée');

  } catch (error) {
    console.error('❌ Erreur:', error);
  }
}

checkUsers();
