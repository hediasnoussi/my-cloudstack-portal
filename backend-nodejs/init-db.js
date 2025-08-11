const mysql = require('mysql2/promise');
const config = require('./config');

async function initDatabase() {
  let connection;
  
  try {
    // Connexion sans spécifier de base de données pour la créer
    connection = await mysql.createConnection({
      host: config.database.host,
      user: config.database.user,
      password: config.database.password
    });

    console.log('Connexion MySQL établie');

    // Créer la base de données si elle n'existe pas
    await connection.execute(`CREATE DATABASE IF NOT EXISTS ${config.database.database}`);
    console.log(`Base de données ${config.database.database} créée ou existante`);

    // Fermer la connexion et se reconnecter avec la base de données spécifiée
    await connection.end();
    
    connection = await mysql.createConnection({
      host: config.database.host,
      user: config.database.user,
      password: config.database.password,
      database: config.database.database
    });

    console.log('Reconnexion avec la base de données établie');

    // Créer les tables
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS domains (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await connection.execute(`
      CREATE TABLE IF NOT EXISTS roles (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        type VARCHAR(100),
        description TEXT,
        state ENUM('enabled', 'disabled') DEFAULT 'enabled',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await connection.execute(`
      CREATE TABLE IF NOT EXISTS accounts (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        state ENUM('enabled', 'disabled') DEFAULT 'enabled',
        role_id INT,
        domain_id INT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (role_id) REFERENCES roles(id),
        FOREIGN KEY (domain_id) REFERENCES domains(id)
      )
    `);

    await connection.execute(`
      CREATE TABLE IF NOT EXISTS zones (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Ajouter la table projects
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS projects (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        display_text VARCHAR(255),
        state ENUM('enabled', 'disabled') DEFAULT 'enabled',
        domain_id INT,
        account_id INT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (domain_id) REFERENCES domains(id),
        FOREIGN KEY (account_id) REFERENCES accounts(id)
      )
    `);

    // Ajouter la table users
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(100) NOT NULL UNIQUE,
        email VARCHAR(150) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        role ENUM('admin', 'user') DEFAULT 'user',
        account_id INT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (account_id) REFERENCES accounts(id)
          ON DELETE SET NULL
          ON UPDATE CASCADE
      )
    `);

    console.log('Tables créées avec succès');

    // Insérer des données de test
    const domains = [
      { name: 'ROOT' },
      { name: 'Demo' },
      { name: 'Production' }
    ];

    for (const domain of domains) {
      await connection.execute('INSERT IGNORE INTO domains (name) VALUES (?)', [domain.name]);
    }

    const roles = [
      { name: 'Admin', type: 'Admin', description: 'Administrateur système' },
      { name: 'User', type: 'User', description: 'Utilisateur standard' },
      { name: 'Domain Admin', type: 'DomainAdmin', description: 'Administrateur de domaine' }
    ];

    for (const role of roles) {
      await connection.execute(
        'INSERT IGNORE INTO roles (name, type, description) VALUES (?, ?, ?)',
        [role.name, role.type, role.description]
      );
    }

    const accounts = [
      { name: 'admin', role_id: 1, domain_id: 1 },
      { name: 'user1', role_id: 2, domain_id: 2 },
      { name: 'domain_admin', role_id: 3, domain_id: 3 }
    ];

    for (const account of accounts) {
      await connection.execute(
        'INSERT IGNORE INTO accounts (name, role_id, domain_id) VALUES (?, ?, ?)',
        [account.name, account.role_id, account.domain_id]
      );
    }

    const zones = [
      { name: 'Zone 1' },
      { name: 'Zone 2' },
      { name: 'Zone 3' }
    ];

    for (const zone of zones) {
      await connection.execute('INSERT IGNORE INTO zones (name) VALUES (?)', [zone.name]);
    }

    // Ajouter des projets de test
    const projects = [
      { name: 'Project 1', display_text: 'Premier projet', domain_id: 1, account_id: 1 },
      { name: 'Project 2', display_text: 'Deuxième projet', domain_id: 2, account_id: 2 },
      { name: 'Project 3', display_text: 'Troisième projet', domain_id: 3, account_id: 3 }
    ];

    for (const project of projects) {
      await connection.execute(
        'INSERT IGNORE INTO projects (name, display_text, domain_id, account_id) VALUES (?, ?, ?, ?)',
        [project.name, project.display_text, project.domain_id, project.account_id]
      );
    }

    // Ajouter des utilisateurs de test
    const users = [
      { 
        username: 'admin', 
        email: 'admin@cloudstack.com', 
        password: 'admin123', 
        role: 'admin', 
        account_id: 1
      },
      { 
        username: 'user1', 
        email: 'user1@demo.com', 
        password: 'user123', 
        role: 'user', 
        account_id: 2
      },
      { 
        username: 'domain_admin', 
        email: 'domain@production.com', 
        password: 'domain123', 
        role: 'admin', 
        account_id: 3
      }
    ];

    for (const user of users) {
      await connection.execute(
        'INSERT IGNORE INTO users (username, email, password, role, account_id) VALUES (?, ?, ?, ?, ?)',
        [user.username, user.email, user.password, user.role, user.account_id]
      );
    }

    console.log('Données de test insérées avec succès');

  } catch (error) {
    console.error('Erreur lors de l\'initialisation de la base de données:', error);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

// Exécuter l'initialisation
initDatabase(); 