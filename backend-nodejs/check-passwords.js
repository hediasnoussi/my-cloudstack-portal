const db = require('./db');
const bcrypt = require('bcrypt');

async function checkPasswords() {
  try {
    console.log('🔍 Vérification des mots de passe dans la base...\n');
    
    const [users] = await db.execute('SELECT id, username, email, password, role FROM users_new');
    
    console.log('👥 Utilisateurs et mots de passe:');
    users.forEach(user => {
      console.log(`\n👤 ${user.username} (${user.role}):`);
      console.log(`   - Email: ${user.email}`);
      console.log(`   - Password hash: ${user.password.substring(0, 20)}...`);
      console.log(`   - Hash length: ${user.password.length} caractères`);
    });
    
    // Test de déchiffrement avec des mots de passe courants
    console.log('\n🔐 Test de déchiffrement des mots de passe...');
    
    const commonPasswords = [
      'admin123', 'admin', 'password', '123456', 'password123',
      'admin@123', 'Admin123', 'ADMIN123', 'admin123!'
    ];
    
    for (const user of users) {
      console.log(`\n🔍 Test pour ${user.username}:`);
      
      for (const testPassword of commonPasswords) {
        try {
          const isValid = await bcrypt.compare(testPassword, user.password);
          if (isValid) {
            console.log(`   ✅ MOT DE PASSE TROUVÉ: "${testPassword}"`);
            break;
          }
        } catch (error) {
          console.log(`   ❌ Erreur de test: ${error.message}`);
        }
      }
    }
    
  } catch (error) {
    console.error('❌ Erreur:', error);
  } finally {
    process.exit(0);
  }
}

checkPasswords();
