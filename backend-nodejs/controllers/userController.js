const db = require('../db');
const bcrypt = require('bcrypt');

// ===== USERS =====
const getAllUsers = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT u.*, a.name as account_name 
      FROM users u 
      LEFT JOIN accounts a ON u.account_id = a.id
    `);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await db.query(`
      SELECT u.*, a.name as account_name 
      FROM users u 
      LEFT JOIN accounts a ON u.account_id = a.id 
      WHERE u.id = ?
    `, [id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createUser = async (req, res) => {
  try {
    const { username, email, password, role = 'user', account_id } = req.body;
    
    if (!username || !email || !password) {
      return res.status(400).json({ error: 'Username, email and password are required' });
    }

    // Hasher le mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);

    const [result] = await db.query(
      'INSERT INTO users (username, email, password, role, account_id) VALUES (?, ?, ?, ?, ?)',
      [username, email, hashedPassword, role, account_id]
    );
    
    res.status(201).json({ 
      id: result.insertId, 
      username, 
      email, 
      role, 
      account_id 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { username, email, password, role, account_id } = req.body;
    
    if (!username || !email) {
      return res.status(400).json({ error: 'Username and email are required' });
    }

    let updateQuery = 'UPDATE users SET username = ?, email = ?, role = ?, account_id = ?';
    let updateParams = [username, email, role, account_id];

    // Si un nouveau mot de passe est fourni, le hasher et l'inclure
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      updateQuery = 'UPDATE users SET username = ?, email = ?, password = ?, role = ?, account_id = ?';
      updateParams = [username, email, hashedPassword, role, account_id];
    }

    updateQuery += ' WHERE id = ?';
    updateParams.push(id);

    const [result] = await db.query(updateQuery, updateParams);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json({ id, username, email, role, account_id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await db.query('DELETE FROM users WHERE id = ?', [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ===== AUTHENTICATION =====
const loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;
    
    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required' });
    }

    // Rechercher l'utilisateur
    const [users] = await db.query(`
      SELECT u.*, a.name as account_name 
      FROM users u 
      LEFT JOIN accounts a ON u.account_id = a.id 
      WHERE u.username = ? OR u.email = ?
    `, [username, username]);

    if (users.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const user = users[0];

    // Vérifier le mot de passe
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Retourner les informations de l'utilisateur (sans le mot de passe)
    const { password: _, ...userInfo } = user;
    
    res.json({
      message: 'Login successful',
      user: userInfo
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const changePassword = async (req, res) => {
  try {
    const { id } = req.params;
    const { currentPassword, newPassword } = req.body;
    
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: 'Current password and new password are required' });
    }

    // Récupérer l'utilisateur
    const [users] = await db.query('SELECT * FROM users WHERE id = ?', [id]);
    if (users.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const user = users[0];

    // Vérifier l'ancien mot de passe
    const isValidPassword = await bcrypt.compare(currentPassword, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Current password is incorrect' });
    }

    // Hasher le nouveau mot de passe
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    // Mettre à jour le mot de passe
    await db.query('UPDATE users SET password = ? WHERE id = ?', [hashedNewPassword, id]);

    res.json({ message: 'Password changed successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ===== USER STATISTICS =====
const getUserStatistics = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Vérifier si l'utilisateur existe
    const [userRows] = await db.query('SELECT * FROM users WHERE id = ?', [id]);
    if (userRows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const user = userRows[0];

    // Statistiques des projets de l'utilisateur
    const [projectStats] = await db.query(`
      SELECT 
        COUNT(*) as total_projects,
        SUM(CASE WHEN state = 'enabled' THEN 1 ELSE 0 END) as active_projects
      FROM projects 
      WHERE account_id = ?
    `, [user.account_id]);

    const statistics = {
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role
      },
      projects: projectStats[0] || { total_projects: 0, active_projects: 0 }
    };

    res.json(statistics);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  // Users CRUD
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  
  // Authentication
  loginUser,
  changePassword,
  
  // User Analytics
  getUserStatistics
}; 