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
    email: 'subprovider@focustechnology.com',
    password: 'password123'
  },
  {
    email: 'partner@focustechnology.com',
    password: 'password123'
  },
  {
    email: 'user@focustechnology.com',
    password: 'password123'
  },
  {
    email: 'admin@focustechnology.com',
    password: 'password123'
  },
  {
    email: 'manager@focustechnology.com',
    password: 'password123'
  },
  {
    email: 'developer@focustechnology.com',
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
        // Find user by email
        const [users] = await connection.execute(
          'SELECT id, username, email, password, role FROM users WHERE email = ?',
          [cred.email]
        );

        if (users.length === 0) {
          console.log(`❌ ${cred.email} - User not found`);
          continue;
        }

        const user = users[0];
        
        // Verify password
        const isValidPassword = await bcrypt.compare(cred.password, user.password);
        
        if (isValidPassword) {
          console.log(`✅ ${cred.email} - Login successful!`);
          console.log(`   👤 Username: ${user.username}`);
          console.log(`   🎭 Role: ${user.role}`);
          console.log(`   🔑 Password: ${cred.password}`);
        } else {
          console.log(`❌ ${cred.email} - Invalid password`);
        }
        
        console.log('   -------------------------------------');
        
      } catch (error) {
        console.error(`❌ Error testing ${cred.email}:`, error.message);
      }
    }

    console.log('\n🎯 Summary of available login credentials:');
    console.log('==========================================');
    testCredentials.forEach(cred => {
      console.log(`   📧 ${cred.email}`);
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
