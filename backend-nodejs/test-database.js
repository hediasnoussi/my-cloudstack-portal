const mysql = require('mysql2/promise');
const config = require('./config');

async function testDatabase() {
  let connection;
  
  try {
    console.log('🔍 Test de la base de données...');
    
    // Connexion à la base de données
    connection = await mysql.createConnection({
      host: config.database.host,
      user: config.database.user,
      password: config.database.password,
      database: config.database.database
    });

    console.log('✅ Connexion à la base de données réussie');

    // Test des tables
    const tables = ['domains', 'roles', 'accounts', 'zones', 'projects', 'users'];
    
    for (const table of tables) {
      try {
        const [rows] = await connection.execute(`SELECT COUNT(*) as count FROM ${table}`);
        const count = rows[0].count;
        console.log(`📊 Table ${table}: ${count} enregistrement(s)`);
        
        if (count > 0) {
          const [sampleRows] = await connection.execute(`SELECT * FROM ${table} LIMIT 3`);
          console.log(`   Exemples:`, sampleRows.map(row => {
            if (table === 'users') {
              return { id: row.id, username: row.username, email: row.email, role: row.role };
            }
            return { id: row.id, name: row.name };
          }));
        }
      } catch (error) {
        console.error(`❌ Erreur avec la table ${table}:`, error.message);
      }
    }

    // Test des relations
    console.log('\n🔗 Test des relations...');
    
    try {
      const [accountsWithRelations] = await connection.execute(`
        SELECT a.id, a.name, r.name as role_name, d.name as domain_name
        FROM accounts a
        LEFT JOIN roles r ON a.role_id = r.id
        LEFT JOIN domains d ON a.domain_id = d.id
        LIMIT 5
      `);
      
      console.log('📋 Comptes avec relations:');
      accountsWithRelations.forEach(account => {
        console.log(`   - ${account.name} (Rôle: ${account.role_name || 'N/A'}, Domaine: ${account.domain_name || 'N/A'})`);
      });
    } catch (error) {
      console.error('❌ Erreur lors du test des relations:', error.message);
    }

    // Test des projets
    try {
      const [projectsWithRelations] = await connection.execute(`
        SELECT p.id, p.name, p.display_text, d.name as domain_name, a.name as account_name
        FROM projects p
        LEFT JOIN domains d ON p.domain_id = d.id
        LEFT JOIN accounts a ON p.account_id = a.id
        LIMIT 5
      `);
      
      console.log('\n📋 Projets avec relations:');
      projectsWithRelations.forEach(project => {
        console.log(`   - ${project.name} (${project.display_text || 'N/A'}) - Domaine: ${project.domain_name || 'N/A'}, Compte: ${project.account_name || 'N/A'}`);
      });
    } catch (error) {
      console.error('❌ Erreur lors du test des projets:', error.message);
    }

    console.log('\n✅ Test de la base de données terminé avec succès!');

  } catch (error) {
    console.error('❌ Erreur lors du test de la base de données:', error);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

// Exécuter le test
testDatabase(); 