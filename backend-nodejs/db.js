const mysql = require('mysql2/promise');
const config = require('./config');

const db = mysql.createPool({
  host: config.database.host,
  user: config.database.user,
  password: config.database.password,
  database: config.database.database,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Test de connexion
db.getConnection()
  .then(connection => {
    console.log('Connexion à MySQL réussie');
    connection.release();
  })
  .catch(err => {
    console.error('Erreur de connexion MySQL:', err);
    console.log('Vérifiez que MySQL est démarré et que la base de données existe');
  });

module.exports = db;
