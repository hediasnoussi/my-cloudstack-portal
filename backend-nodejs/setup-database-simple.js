const mysql = require('mysql2');
const config = require('./config');

function setupDatabase() {
  // Use regular mysql2 instead of promise version
  const connection = mysql.createConnection({
    host: config.database.host,
    user: config.database.user,
    password: config.database.password,
  });

  console.log('✅ Connected to MySQL');

  // Create database if it doesn't exist
  connection.query(`CREATE DATABASE IF NOT EXISTS ${config.database.database}`, (err) => {
    if (err) {
      console.error('❌ Error creating database:', err.message);
      return;
    }
    console.log(`✅ Database '${config.database.database}' created/verified`);

    // Use the database
    connection.query(`USE ${config.database.database}`, (err) => {
      if (err) {
        console.error('❌ Error using database:', err.message);
        return;
      }

      // Create domains table
      const createDomainsTable = `
        CREATE TABLE IF NOT EXISTS domains (
          id INT AUTO_INCREMENT PRIMARY KEY,
          name VARCHAR(255) NOT NULL UNIQUE,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        )
      `;
      
      connection.query(createDomainsTable, (err) => {
        if (err) {
          console.error('❌ Error creating domains table:', err.message);
          return;
        }
        console.log('✅ Domains table created/verified');

        // Create roles table
        const createRolesTable = `
          CREATE TABLE IF NOT EXISTS roles (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(255) NOT NULL UNIQUE,
            type VARCHAR(100),
            description TEXT,
            state ENUM('enabled', 'disabled') DEFAULT 'enabled',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
          )
        `;
        
        connection.query(createRolesTable, (err) => {
          if (err) {
            console.error('❌ Error creating roles table:', err.message);
            return;
          }
          console.log('✅ Roles table created/verified');

          // Create accounts table
          const createAccountsTable = `
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
          `;
          
          connection.query(createAccountsTable, (err) => {
            if (err) {
              console.error('❌ Error creating accounts table:', err.message);
              return;
            }
            console.log('✅ Accounts table created/verified');

            // Create zones table
            const createZonesTable = `
              CREATE TABLE IF NOT EXISTS zones (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(255) NOT NULL UNIQUE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
              )
            `;
            
            connection.query(createZonesTable, (err) => {
              if (err) {
                console.error('❌ Error creating zones table:', err.message);
                return;
              }
              console.log('✅ Zones table created/verified');

              // Insert sample data
              const insertDomains = `INSERT IGNORE INTO domains (name) VALUES ('ROOT'), ('Default'), ('Test Domain')`;
              connection.query(insertDomains, (err) => {
                if (err) {
                  console.error('❌ Error inserting domains:', err.message);
                  return;
                }
                console.log('✅ Sample domains inserted');

                const insertRoles = `INSERT IGNORE INTO roles (name, type, description) VALUES 
                  ('Admin', 'Admin', 'Administrator role with full access'),
                  ('User', 'User', 'Regular user role'),
                  ('ReadOnly', 'ReadOnly', 'Read-only access role')`;
                
                connection.query(insertRoles, (err) => {
                  if (err) {
                    console.error('❌ Error inserting roles:', err.message);
                    return;
                  }
                  console.log('✅ Sample roles inserted');

                  const insertZones = `INSERT IGNORE INTO zones (name) VALUES ('Zone1'), ('Zone2'), ('Default Zone')`;
                  connection.query(insertZones, (err) => {
                    if (err) {
                      console.error('❌ Error inserting zones:', err.message);
                      return;
                    }
                    console.log('✅ Sample zones inserted');

                    console.log('\n🎉 Database setup completed successfully!');
                    console.log('You can now start the backend server with: npm run dev');
                    
                    connection.end();
                  });
                });
              });
            });
          });
        });
      });
    });
  });
}

setupDatabase(); 