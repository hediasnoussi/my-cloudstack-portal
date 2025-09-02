const mysql = require('mysql2/promise');
const config = require('./config');

async function checkTableStructure() {
  let connection;
  
  try {
    connection = await mysql.createConnection({
      host: config.database.host,
      user: config.database.user,
      password: config.database.password,
      database: config.database.database
    });

    console.log('Connexion MySQL établie');

    // Vérifier la structure de la table projects
    const [columns] = await connection.execute(`
      DESCRIBE projects
    `);
    
    console.log('\n📋 Structure de la table projects:');
    console.table(columns);

    // Vérifier les données existantes
    const [data] = await connection.execute(`
      SELECT * FROM projects LIMIT 5
    `);
    
    console.log('\n📊 Données existantes dans projects:');
    console.table(data);

    // Vérifier les autres tables importantes
    const tables = ['domains', 'accounts', 'roles', 'zones'];
    
    for (const table of tables) {
      try {
        const [tableData] = await connection.execute(`SELECT COUNT(*) as count FROM ${table}`);
        console.log(`\n📈 Table ${table}: ${tableData[0].count} enregistrements`);
      } catch (error) {
        console.log(`\n❌ Table ${table}: ${error.message}`);
      }
    }

  } catch (error) {
    console.error('Erreur:', error);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

checkTableStructure(); 