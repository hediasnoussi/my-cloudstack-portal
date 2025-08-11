const mysql = require('mysql2/promise');
const config = require('./config');

async function initDatabase() {
  let connection;
  
  try {
    // Connexion sans spécifier de base de données pour pouvoir la créer
    connection = await mysql.createConnection({
      host: config.database.host,
      user: config.database.user,
      password: config.database.password
    });

    console.log('🔍 Vérification de la base de données...');

    // Vérifier si la base de données existe
    const [databases] = await connection.query('SHOW DATABASES');
    const dbExists = databases.some(db => db.Database === 'cloudstack_portal');
    
    if (!dbExists) {
      console.log('📦 Création de la base de données cloudstack_portal...');
      await connection.query('CREATE DATABASE cloudstack_portal');
      console.log('✅ Base de données cloudstack_portal créée');
    } else {
      console.log('✅ Base de données cloudstack_portal existe déjà');
    }

    // Utiliser la base de données
    await connection.query('USE cloudstack_portal');

    // Créer les tables
    console.log('📋 Création des tables...');

    // Table domains
    await connection.query(`
      CREATE TABLE IF NOT EXISTS domains (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL UNIQUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Table domains créée/vérifiée');

    // Table roles
    await connection.query(`
      CREATE TABLE IF NOT EXISTS roles (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL UNIQUE,
        type VARCHAR(100),
        description TEXT,
        state ENUM('enabled', 'disabled') DEFAULT 'enabled',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Table roles créée/vérifiée');

    // Table accounts
    await connection.query(`
      CREATE TABLE IF NOT EXISTS accounts (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL UNIQUE,
        state ENUM('enabled', 'disabled') DEFAULT 'enabled',
        role_id INT,
        domain_id INT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE SET NULL,
        FOREIGN KEY (domain_id) REFERENCES domains(id) ON DELETE SET NULL
      )
    `);
    console.log('✅ Table accounts créée/vérifiée');

    // Table zones
    await connection.query(`
      CREATE TABLE IF NOT EXISTS zones (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL UNIQUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Table zones créée/vérifiée');

    // Table users
    await connection.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(255) NOT NULL UNIQUE,
        email VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        role ENUM('admin', 'user') DEFAULT 'user',
        account_id INT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (account_id) REFERENCES accounts(id) ON DELETE SET NULL
      )
    `);
    console.log('✅ Table users créée/vérifiée');

    // Table projects
    await connection.query(`
      CREATE TABLE IF NOT EXISTS projects (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        display_text VARCHAR(255),
        state ENUM('enabled', 'disabled') DEFAULT 'enabled',
        domain_id INT,
        account_id INT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (domain_id) REFERENCES domains(id) ON DELETE SET NULL,
        FOREIGN KEY (account_id) REFERENCES accounts(id) ON DELETE SET NULL
      )
    `);
    console.log('✅ Table projects créée/vérifiée');

    // Insérer des données de test si les tables sont vides
    console.log('📝 Vérification des données de test...');

    // Vérifier si des domaines existent
    const [domains] = await connection.query('SELECT COUNT(*) as count FROM domains');
    if (domains[0].count === 0) {
      console.log('➕ Insertion de domaines de test...');
      await connection.query('INSERT INTO domains (name) VALUES (?)', ['ROOT']);
      await connection.query('INSERT INTO domains (name) VALUES (?)', ['Test Domain']);
      console.log('✅ Domaines de test ajoutés');
    }

    // Vérifier si des rôles existent
    const [roles] = await connection.query('SELECT COUNT(*) as count FROM roles');
    if (roles[0].count === 0) {
      console.log('➕ Insertion de rôles de test...');
      await connection.query('INSERT INTO roles (name, type, description, state) VALUES (?, ?, ?, ?)', 
        ['Admin', 'Admin', 'Administrator role', 'enabled']);
      await connection.query('INSERT INTO roles (name, type, description, state) VALUES (?, ?, ?, ?)', 
        ['User', 'User', 'Regular user role', 'enabled']);
      console.log('✅ Rôles de test ajoutés');
    }

    // Vérifier si des zones existent
    const [zones] = await connection.query('SELECT COUNT(*) as count FROM zones');
    if (zones[0].count === 0) {
      console.log('➕ Insertion de zones de test...');
      await connection.query('INSERT INTO zones (name) VALUES (?)', ['Zone 1']);
      await connection.query('INSERT INTO zones (name) VALUES (?)', ['Zone 2']);
      console.log('✅ Zones de test ajoutées');
    }

    console.log('🎉 Base de données cloudstack_portal initialisée avec succès !');
    console.log('📊 Récapitulatif des tables créées :');
    console.log('   - domains');
    console.log('   - roles');
    console.log('   - accounts');
    console.log('   - zones');
    console.log('   - users');
    console.log('   - projects');

  } catch (error) {
    console.error('❌ Erreur lors de l\'initialisation :', error.message);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

// Exécuter l'initialisation
initDatabase(); 