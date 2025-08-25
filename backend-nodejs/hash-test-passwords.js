const bcrypt = require('bcrypt');

const hashPasswords = async () => {
  try {
    const passwords = [
      'admin123',
      'sub123', 
      'partner123',
      'client123'
    ];

    console.log('🔐 Hachage des mots de passe de test :');
    
    for (const password of passwords) {
      const hashedPassword = await bcrypt.hash(password, 10);
      console.log(`\nMot de passe: ${password}`);
      console.log(`Hashé: ${hashedPassword}`);
    }

    console.log('\n✅ Tous les mots de passe ont été hashés !');
    console.log('💡 Copiez ces hashes dans le script create-users-table.js');

  } catch (error) {
    console.error('❌ Erreur lors du hachage :', error);
  }
};

// Exécution du script
hashPasswords();
