const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Database config
const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'cloudstack_portal'
};

// Test route
app.get('/test', (req, res) => {
  res.json({ message: 'Ultra-simple server works!' });
});

// Login route
app.post('/api/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: 'Username and password required'
      });
    }

    // Connect to database
    const connection = await mysql.createConnection(dbConfig);
    
    // Find user
    const [users] = await connection.execute(
      'SELECT * FROM users_new WHERE username = ?',
      [username]
    );

    if (users.length === 0) {
      await connection.end();
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    const user = users[0];
    
    // Check password
    const isValidPassword = await bcrypt.compare(password, user.password);
    
    if (!isValidPassword) {
      await connection.end();
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    await connection.end();

    // Success response
    res.json({
      success: true,
      message: 'Login successful',
      data: {
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          role: user.role
        }
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// Simple data routes (no auth required)
app.get('/api/global/domains', (req, res) => {
  res.json({
    success: true,
    data: [
      { id: 1, name: 'focustechnology.com', status: 'active' },
      { id: 2, name: 'cloud.focustechnology.com', status: 'active' }
    ]
  });
});

app.get('/api/global/roles', (req, res) => {
  res.json({
    success: true,
    data: [
      { id: 1, name: 'admin', description: 'Administrator' },
      { id: 2, name: 'user', description: 'Standard User' },
      { id: 3, name: 'subprovider', description: 'Sub Provider' },
      { id: 4, name: 'partner', description: 'Partner' }
    ]
  });
});

app.get('/api/global/accounts', (req, res) => {
  res.json({
    success: true,
    data: [
      { id: 1, name: 'Focus Technology Solutions', status: 'active' },
      { id: 2, name: 'CloudStack Portal', status: 'active' }
    ]
  });
});

app.get('/api/global/zones', (req, res) => {
  res.json({
    success: true,
    data: [
      { id: 1, name: 'Zone 1', status: 'active' },
      { id: 2, name: 'Zone 2', status: 'active' }
    ]
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Ultra-simple server running on port ${PORT}`);
  console.log(`✅ No authentication, no middleware, just works!`);
});
