const mysql = require('mysql2/promise');
require('dotenv').config();

const checkExistingTables = async () => {
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

    // Lister toutes les tables existantes
    console.log('📋 Tables existantes dans la base de données :');
    const [tables] = await connection.execute('SHOW TABLES');
    if (tables.length === 0) {
      console.log('   Aucune table trouvée');
    } else {
      tables.forEach(table => {
        const tableName = Object.values(table)[0];
        console.log(`   - ${tableName}`);
      });
    }

    // Vérifier la structure de la base de données
    console.log('\n📋 Informations sur la base de données :');
    const [dbInfo] = await connection.execute('SELECT DATABASE() as current_db');
    console.log(`   Base de données actuelle : ${dbInfo[0].current_db}`);

  } catch (error) {
    console.error('❌ Erreur :', error);
  } finally {
    if (connection) {
      await connection.end();
      console.log('🔌 Connexion à la base de données fermée');
    }
  }
};

// Exécution du script
checkExistingTables();
