const mysql = require('mysql2/promise');
const config = require('./config');

async function testConnection() {
  try {
    console.log('🔍 Test de connexion à la base de données...');
    console.log('Configuration:', config.database);
    
    const connection = await mysql.createConnection(config.database);
    console.log('✅ Connexion réussie');
    
    // Vérifier les tables
    const [tables] = await connection.execute('SHOW TABLES');
    console.log('📋 Tables disponibles:', tables.map(t => Object.values(t)[0]));
    
    // Vérifier la table domains
    try {
      const [domains] = await connection.execute('SELECT * FROM domains LIMIT 5');
      console.log('✅ Table domains:', domains.length, 'enregistrements');
    } catch (error) {
      console.log('❌ Erreur table domains:', error.message);
    }
    
    // Vérifier la table roles
    try {
      const [roles] = await connection.execute('SELECT * FROM roles LIMIT 5');
      console.log('✅ Table roles:', roles.length, 'enregistrements');
    } catch (error) {
      console.log('❌ Erreur table roles:', error.message);
    }
    
    // Vérifier la table accounts
    try {
      const [accounts] = await connection.execute('SELECT * FROM accounts LIMIT 5');
      console.log('✅ Table accounts:', accounts.length, 'enregistrements');
    } catch (error) {
      console.log('❌ Erreur table accounts:', error.message);
    }
    
    // Vérifier la table zones
    try {
      const [zones] = await connection.execute('SELECT * FROM zones LIMIT 5');
      console.log('✅ Table zones:', zones.length, 'enregistrements');
    } catch (error) {
      console.log('❌ Erreur table zones:', error.message);
    }
    
    await connection.end();
    console.log('✅ Test terminé');
    
  } catch (error) {
    console.error('❌ Erreur de connexion:', error.message);
  }
}

testConnection(); 