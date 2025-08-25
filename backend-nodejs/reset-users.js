const db = require('./db');
const bcrypt = require('bcrypt');

async function resetUsers() {
  try {
    console.log('🔄 Réinitialisation des utilisateurs avec des mots de passe connus...\n');
    
    // Vider la table users_new
    await db.execute('DELETE FROM users_new');
    console.log('✅ Table users_new vidée');
    
    // Vider la table user_quotas
    await db.execute('DELETE FROM user_quotas');
    console.log('✅ Table user_quotas vidée');
    
    // Vider la table user_hierarchy
    await db.execute('DELETE FROM user_hierarchy');
    console.log('✅ Table user_hierarchy vidée');
    
    // Créer de nouveaux utilisateurs avec des mots de passe connus
    const users = [
      {
        username: 'admin',
        email: 'admin@cloudstack.com',
        password: 'admin123',
        role: 'admin'
      },
      {
        username: 'subprovider',
        email: 'subprovider@cloudstack.com',
        password: 'sub123',
        role: 'subprovider'
      },
      {
        username: 'partner',
        email: 'partner@cloudstack.com',
        password: 'partner123',
        role: 'partner'
      },
      {
        username: 'client',
        email: 'client@cloudstack.com',
        password: 'client123',
        role: 'user'
      }
    ];
    
    console.log('\n👥 Création des nouveaux utilisateurs...');
    
    for (const user of users) {
      // Hasher le mot de passe
      const hashedPassword = await bcrypt.hash(user.password, 10);
      
      // Insérer l'utilisateur
      const [result] = await db.execute(
        'INSERT INTO users_new (username, email, password, role) VALUES (?, ?, ?, ?)',
        [user.username, user.email, hashedPassword, user.role]
      );
      
      const userId = result.insertId;
      console.log(`✅ ${user.username} créé avec ID ${userId}`);
      
      // Créer les quotas par défaut
      let maxVps, maxCpu, maxRam, maxStorage;
      
      switch (user.role) {
        case 'admin':
          maxVps = 10000; maxCpu = 10000; maxRam = 100000; maxStorage = 1000000;
          break;
        case 'subprovider':
          maxVps = 1000; maxCpu = 1000; maxRam = 10000; maxStorage = 100000;
          break;
        case 'partner':
          maxVps = 100; maxCpu = 100; maxRam = 1000; maxStorage = 10000;
          break;
        case 'user':
          maxVps = 10; maxCpu = 10; maxRam = 100; maxStorage = 1000;
          break;
      }
      
      await db.execute(
        'INSERT INTO user_quotas (user_id, max_vps, max_cpu, max_ram, max_storage) VALUES (?, ?, ?, ?, ?)',
        [userId, maxVps, maxCpu, maxRam, maxStorage]
      );
      
      console.log(`   📊 Quotas créés: VPS=${maxVps}, CPU=${maxCpu}, RAM=${maxRam}, Storage=${maxStorage}`);
    }
    
    // Créer la hiérarchie
    console.log('\n🏗️ Création de la hiérarchie...');
    
    const [adminUser] = await db.execute('SELECT id FROM users_new WHERE username = ?', ['admin']);
    const [subproviderUser] = await db.execute('SELECT id FROM users_new WHERE username = ?', ['subprovider']);
    const [partnerUser] = await db.execute('SELECT id FROM users_new WHERE username = ?', ['partner']);
    const [clientUser] = await db.execute('SELECT id FROM users_new WHERE username = ?', ['client']);
    
    // Admin -> SubProvider
    await db.execute(
      'INSERT INTO user_hierarchy (parent_user_id, child_user_id, relationship_type) VALUES (?, ?, ?)',
      [adminUser[0].id, subproviderUser[0].id, 'admin-subprovider']
    );
    
    // SubProvider -> Partner
    await db.execute(
      'INSERT INTO user_hierarchy (parent_user_id, child_user_id, relationship_type) VALUES (?, ?, ?)',
      [subproviderUser[0].id, partnerUser[0].id, 'subprovider-partner']
    );
    
    // Partner -> Client
    await db.execute(
      'INSERT INTO user_hierarchy (parent_user_id, child_user_id, relationship_type) VALUES (?, ?, ?)',
      [partnerUser[0].id, clientUser[0].id, 'partner-client']
    );
    
    console.log('✅ Hiérarchie créée');
    
    console.log('\n🎉 Réinitialisation terminée !');
    console.log('\n🔑 Mots de passe des nouveaux utilisateurs:');
    console.log('   - admin / admin123');
    console.log('   - subprovider / sub123');
    console.log('   - partner / partner123');
    console.log('   - client / client123');
    
  } catch (error) {
    console.error('❌ Erreur lors de la réinitialisation:', error);
  } finally {
    process.exit(0);
  }
}

resetUsers();
