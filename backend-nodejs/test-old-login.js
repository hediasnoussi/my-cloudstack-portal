const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');

// Database configuration
const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'cloudstack_portal'
};

// Test credentials
const testCredentials = [
  {
    username: 'subprovider',
    password: 'password123'
  },
  {
    username: 'partner',
    password: 'password123'
  },
  {
    username: 'user',
    password: 'password123'
  },
  {
    username: 'admin',
    password: 'password123'
  }
];

async function testLogin() {
  let connection;

  try {
    // Connect to database
    connection = await mysql.createConnection(dbConfig);
    console.log('✅ Connected to database successfully');

    console.log('\n🔐 Testing login credentials...\n');

    for (const cred of testCredentials) {
      try {
        // Find user by username
        const [users] = await connection.execute(
          'SELECT id, username, email, password, role FROM users_new WHERE username = ?',
          [cred.username]
        );

        if (users.length === 0) {
          console.log(`❌ ${cred.username} - User not found`);
          continue;
        }

        const user = users[0];

        // Verify password
        const isValidPassword = await bcrypt.compare(cred.password, user.password);

        if (isValidPassword) {
          console.log(`✅ ${cred.username} - Login successful!`);
          console.log(`   👤 Username: ${user.username}`);
          console.log(`   📧 Email: ${user.email}`);
          console.log(`   🎭 Role: ${user.role}`);
          console.log(`   🔑 Password: ${cred.password}`);
        } else {
          console.log(`❌ ${cred.username} - Invalid password`);
        }

        console.log('   -------------------------------------');

      } catch (error) {
        console.error(`❌ Error testing ${cred.username}:`, error.message);
      }
    }

    console.log('\n🎯 Summary of available login credentials:');
    console.log('==========================================');
    testCredentials.forEach(cred => {
      console.log(`   👤 Username: ${cred.username}`);
      console.log(`   🔑 Password: ${cred.password}`);
    });

  } catch (error) {
    console.error('❌ Database error:', error.message);
  } finally {
    if (connection) {
      await connection.end();
      console.log('\n🔌 Database connection closed');
    }
  }
}

// Run the test
testLogin().catch(console.error);
