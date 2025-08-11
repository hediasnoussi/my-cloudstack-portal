const mysql = require('mysql2/promise');
const config = require('./config');

async function setupDatabase() {
  let connection;
  
  try {
    // Connect to MySQL
    connection = await mysql.createConnection({
      host: config.database.host,
      user: config.database.user,
      password: config.database.password,
    });

    console.log('✅ Connected to MySQL');

    // Create database if it doesn't exist
    await connection.execute(`CREATE DATABASE IF NOT EXISTS ${config.database.database}`);
    console.log(`✅ Database '${config.database.database}' created/verified`);

    // Use the database
    await connection.execute(`USE ${config.database.database}`);

    // Create domains table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS domains (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL UNIQUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Domains table created/verified');

    // Create roles table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS roles (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL UNIQUE,
        type VARCHAR(100),
        description TEXT,
        state ENUM('enabled', 'disabled') DEFAULT 'enabled',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Roles table created/verified');

    // Create accounts table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS accounts (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL UNIQUE,
        state ENUM('enabled', 'disabled') DEFAULT 'enabled',
        role_id INT,
        domain_id INT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE SET NULL,
        FOREIGN KEY (domain_id) REFERENCES domains(id) ON DELETE SET NULL
      )
    `);
    console.log('✅ Accounts table created/verified');

    // Create users table (if it doesn't exist)
    await connection.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(255) NOT NULL UNIQUE,
        email VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        account_id INT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (account_id) REFERENCES accounts(id) ON DELETE CASCADE
      )
    `);
    console.log('✅ Users table created/verified');

    // Create zones table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS zones (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL UNIQUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Zones table created/verified');

    // Insert sample data
    await connection.query(`
      INSERT IGNORE INTO domains (name) VALUES 
      ('ROOT'),
      ('Default'),
      ('Test Domain')
    `);
    console.log('✅ Sample domains inserted');

    await connection.query(`
      INSERT IGNORE INTO roles (name, type, description) VALUES 
      ('Admin', 'Admin', 'Administrator role with full access'),
      ('User', 'User', 'Regular user role'),
      ('ReadOnly', 'ReadOnly', 'Read-only access role')
    `);
    console.log('✅ Sample roles inserted');

    await connection.query(`
      INSERT IGNORE INTO zones (name) VALUES 
      ('Zone1'),
      ('Zone2'),
      ('Default Zone')
    `);
    console.log('✅ Sample zones inserted');

    console.log('\n🎉 Database setup completed successfully!');
    console.log('You can now start the backend server with: npm run dev');

  } catch (error) {
    console.error('❌ Database setup failed:', error.message);
    console.log('\nTroubleshooting:');
    console.log('1. Make sure MySQL is running');
    console.log('2. Check your database credentials in config.js');
    console.log('3. Ensure you have permission to create databases');
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

setupDatabase(); 