const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');
const config = require('./config');

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Configuration de la base de données
const dbConfig = {
  host: config.database.host,
  user: config.database.user,
  password: config.database.password,
  database: config.database.database
};

// Test route
app.get('/test', (req, res) => {
  res.json({ message: 'API is working!' });
});

// Route de base
app.get('/', (req, res) => {
  res.json({
    message: 'CloudStack Portal API',
    version: '1.0.0'
  });
});

// Routes pour les domaines
app.get('/api/global/domains', async (req, res) => {
  try {
    const connection = await mysql.createConnection(dbConfig);
    const [rows] = await connection.execute('SELECT * FROM domains');
    await connection.end();
    res.json({ success: true, data: rows });
  } catch (error) {
    console.error('Error fetching domains:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post('/api/global/domains', async (req, res) => {
  try {
    const { name } = req.body;
    const connection = await mysql.createConnection(dbConfig);
    const [result] = await connection.execute('INSERT INTO domains (name) VALUES (?)', [name]);
    await connection.end();
    res.json({ success: true, data: { id: result.insertId, name } });
  } catch (error) {
    console.error('Error creating domain:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.put('/api/global/domains/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;
    const connection = await mysql.createConnection(dbConfig);
    await connection.execute('UPDATE domains SET name = ? WHERE id = ?', [name, id]);
    await connection.end();
    res.json({ success: true, data: { id, name } });
  } catch (error) {
    console.error('Error updating domain:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.delete('/api/global/domains/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const connection = await mysql.createConnection(dbConfig);
    await connection.execute('DELETE FROM domains WHERE id = ?', [id]);
    await connection.end();
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting domain:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Routes pour les utilisateurs
app.get('/api/users', async (req, res) => {
  try {
    const connection = await mysql.createConnection(dbConfig);
    const [rows] = await connection.execute('SELECT * FROM users');
    await connection.end();
    res.json({ success: true, data: rows });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post('/api/users', async (req, res) => {
  try {
    const { username, email, password, role, account_id } = req.body;
    const connection = await mysql.createConnection(dbConfig);
    const [result] = await connection.execute(
      'INSERT INTO users (username, email, password, role, account_id) VALUES (?, ?, ?, ?, ?)',
      [username, email, password, role, account_id]
    );
    await connection.end();
    res.json({ success: true, data: { id: result.insertId, username, email, role } });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.put('/api/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { username, email, password, role, account_id } = req.body;
    const connection = await mysql.createConnection(dbConfig);
    await connection.execute(
      'UPDATE users SET username = ?, email = ?, role = ?, account_id = ? WHERE id = ?',
      [username, email, role, account_id, id]
    );
    await connection.end();
    res.json({ success: true, data: { id, username, email, role } });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.delete('/api/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const connection = await mysql.createConnection(dbConfig);
    await connection.execute('DELETE FROM users WHERE id = ?', [id]);
    await connection.end();
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Routes pour les comptes
app.get('/api/global/accounts', async (req, res) => {
  try {
    const connection = await mysql.createConnection(dbConfig);
    const [rows] = await connection.execute('SELECT * FROM accounts');
    await connection.end();
    res.json({ success: true, data: rows });
  } catch (error) {
    console.error('Error fetching accounts:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post('/api/global/accounts', async (req, res) => {
  try {
    const { name, domain_id, role_id } = req.body;
    const connection = await mysql.createConnection(dbConfig);
    const [result] = await connection.execute(
      'INSERT INTO accounts (name, domain_id, role_id) VALUES (?, ?, ?)',
      [name, domain_id, role_id]
    );
    await connection.end();
    res.json({ success: true, data: { id: result.insertId, name, domain_id, role_id } });
  } catch (error) {
    console.error('Error creating account:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.put('/api/global/accounts/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, domain_id, role_id } = req.body;
    const connection = await mysql.createConnection(dbConfig);
    await connection.execute(
      'UPDATE accounts SET name = ?, domain_id = ?, role_id = ? WHERE id = ?',
      [name, domain_id, role_id, id]
    );
    await connection.end();
    res.json({ success: true, data: { id, name, domain_id, role_id } });
  } catch (error) {
    console.error('Error updating account:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.delete('/api/global/accounts/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const connection = await mysql.createConnection(dbConfig);
    await connection.execute('DELETE FROM accounts WHERE id = ?', [id]);
    await connection.end();
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting account:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Routes pour les rôles
app.get('/api/global/roles', async (req, res) => {
  try {
    const connection = await mysql.createConnection(dbConfig);
    const [rows] = await connection.execute('SELECT * FROM roles');
    await connection.end();
    res.json({ success: true, data: rows });
  } catch (error) {
    console.error('Error fetching roles:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post('/api/global/roles', async (req, res) => {
  try {
    const { name, type, description } = req.body;
    const connection = await mysql.createConnection(dbConfig);
    const [result] = await connection.execute(
      'INSERT INTO roles (name, type, description) VALUES (?, ?, ?)',
      [name, type, description]
    );
    await connection.end();
    res.json({ success: true, data: { id: result.insertId, name, type, description } });
  } catch (error) {
    console.error('Error creating role:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.put('/api/global/roles/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, type, description } = req.body;
    const connection = await mysql.createConnection(dbConfig);
    await connection.execute(
      'UPDATE roles SET name = ?, type = ?, description = ? WHERE id = ?',
      [name, type, description, id]
    );
    await connection.end();
    res.json({ success: true, data: { id, name, type, description } });
  } catch (error) {
    console.error('Error updating role:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.delete('/api/global/roles/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const connection = await mysql.createConnection(dbConfig);
    await connection.execute('DELETE FROM roles WHERE id = ?', [id]);
    await connection.end();
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting role:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Routes pour les zones
app.get('/api/global/zones', async (req, res) => {
  try {
    const connection = await mysql.createConnection(dbConfig);
    const [rows] = await connection.execute('SELECT * FROM zones');
    await connection.end();
    res.json({ success: true, data: rows });
  } catch (error) {
    console.error('Error fetching zones:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Routes pour les projets
app.get('/api/projects', async (req, res) => {
  try {
    const connection = await mysql.createConnection(dbConfig);
    const [rows] = await connection.execute('SELECT * FROM projects');
    await connection.end();
    res.json({ success: true, data: rows });
  } catch (error) {
    console.error('Error fetching projects:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Simple server running on port ${PORT}`);
  console.log(`🌐 API available at http://localhost:${PORT}`);
  console.log(`📊 Test endpoint: http://localhost:${PORT}/test`);
}); 