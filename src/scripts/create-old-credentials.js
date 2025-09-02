const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');

// Database configuration
const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'cloudstack_portal'
};

// Users with old username-based credentials
const users = [
  {
    username: 'subprovider',
    email: 'subprovider@focustechnology.com',
    password: 'password123',
    role: 'subprovider',
    first_name: 'Sub',
    last_name: 'Provider',
    company: 'Focus Technology Solutions'
  },
  {
    username: 'partner',
    email: 'partner@focustechnology.com',
    password: 'password123',
    role: 'partner',
    first_name: 'Business',
    last_name: 'Partner',
    company: 'Focus Technology Solutions'
  },
  {
    username: 'user',
    email: 'user@focustechnology.com',
    password: 'password123',
    role: 'user',
    first_name: 'Standard',
    last_name: 'User',
    company: 'Focus Technology Solutions'
  },
  {
    username: 'admin',
    email: 'admin@focustechnology.com',
    password: 'password123',
    role: 'admin',
    first_name: 'System',
    last_name: 'Administrator',
    company: 'Focus Technology Solutions'
  }
];

async function createUsers() {
  let connection;
  
  try {
    // Connect to database
    connection = await mysql.createConnection(dbConfig);
    console.log('✅ Connected to database successfully');

    // Check if users table exists
    const [tables] = await connection.execute('SHOW TABLES LIKE "users"');
    if (tables.length === 0) {
      console.log('❌ Users table does not exist. Please run the database setup first.');
      return;
    }

    // Check table structure
    const [columns] = await connection.execute('DESCRIBE users');
    console.log('📋 Users table structure:', columns.map(col => col.Field));

    // Create users
    for (const user of users) {
      try {
        // Hash password
        const hashedPassword = await bcrypt.hash(user.password, 10);
        
        // Check if user already exists
        const [existingUsers] = await connection.execute(
          'SELECT id FROM users WHERE username = ?',
          [user.username]
        );

        if (existingUsers.length > 0) {
          console.log(`⚠️  User ${user.username} already exists, updating...`);
          
          // Update existing user
          await connection.execute(
            `UPDATE users SET 
             email = ?, 
             password = ?, 
             role = ?, 
             first_name = ?, 
             last_name = ?, 
             company = ?,
             updated_at = NOW()
             WHERE username = ?`,
            [user.email, hashedPassword, user.role, user.first_name, user.last_name, user.company, user.username]
          );
          
          console.log(`✅ Updated user: ${user.username}`);
        } else {
          // Insert new user
          await connection.execute(
            `INSERT INTO users (username, email, password, role, first_name, last_name, company, created_at, updated_at) 
             VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
            [user.username, user.email, hashedPassword, user.role, user.first_name, user.last_name, user.company]
          );
          
          console.log(`✅ Created user: ${user.username}`);
        }
      } catch (error) {
        console.error(`❌ Error creating user ${user.username}:`, error.message);
      }
    }

    // Display all users
    console.log('\n📊 Current users in database:');
    const [allUsers] = await connection.execute('SELECT username, email, role, created_at FROM users ORDER BY role, username');
    
    allUsers.forEach(user => {
      console.log(`   👤 ${user.username} (${user.email}) - Role: ${user.role}`);
    });

    console.log('\n🎯 Login Credentials (Username-based):');
    console.log('=========================================');
    users.forEach(user => {
      console.log(`   👤 Username: ${user.username}`);
      console.log(`   🔑 Password: ${user.password}`);
      console.log(`   🎭 Role: ${user.role}`);
      console.log('   -------------------------------------');
    });

    console.log('\n✨ Users created/updated successfully!');
    console.log('🚀 You can now login with username instead of email.');

  } catch (error) {
    console.error('❌ Database error:', error.message);
  } finally {
    if (connection) {
      await connection.end();
      console.log('🔌 Database connection closed');
    }
  }
}

// Run the script
createUsers().catch(console.error);

