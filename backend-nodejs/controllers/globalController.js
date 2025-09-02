const db = require('../db');

// ===== DOMAINS =====
const getAllDomains = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM domains');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getDomainById = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await db.query('SELECT * FROM domains WHERE id = ?', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Domain not found' });
    }
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createDomain = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({ error: 'Name is required' });
    }
    const [result] = await db.query('INSERT INTO domains (name) VALUES (?)', [name]);
    res.status(201).json({ id: result.insertId, name });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateDomain = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({ error: 'Name is required' });
    }
    const [result] = await db.query('UPDATE domains SET name = ? WHERE id = ?', [name, id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Domain not found' });
    }
    res.json({ id, name });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteDomain = async (req, res) => {
  try {
    const { id } = req.params;
    
    // First check if the domain exists
    const [domainCheck] = await db.query('SELECT * FROM domains WHERE id = ?', [id]);
    if (domainCheck.length === 0) {
      return res.status(404).json({ error: 'Domain not found' });
    }

    // Check for dependent accounts
    const [dependentAccounts] = await db.query('SELECT COUNT(*) as count FROM accounts WHERE domain_id = ?', [id]);
    
    if (dependentAccounts[0].count > 0) {
      return res.status(400).json({ 
        error: 'Cannot delete domain: It has associated accounts. Please delete or reassign the accounts first.' 
      });
    }

    // Delete the domain
    const [result] = await db.query('DELETE FROM domains WHERE id = ?', [id]);
    res.json({ message: 'Domain deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ===== ROLES =====
const getAllRoles = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM roles');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getRoleById = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await db.query('SELECT * FROM roles WHERE id = ?', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Role not found' });
    }
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createRole = async (req, res) => {
  try {
    const { name, type, description, state = 'enabled' } = req.body;
    if (!name) {
      return res.status(400).json({ error: 'Name is required' });
    }
    const [result] = await db.query(
      'INSERT INTO roles (name, type, description, state) VALUES (?, ?, ?, ?)',
      [name, type, description, state]
    );
    res.status(201).json({ id: result.insertId, name, type, description, state });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, type, description, state } = req.body;
    if (!name) {
      return res.status(400).json({ error: 'Name is required' });
    }
    const [result] = await db.query(
      'UPDATE roles SET name = ?, type = ?, description = ?, state = ? WHERE id = ?',
      [name, type, description, state, id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Role not found' });
    }
    res.json({ id, name, type, description, state });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteRole = async (req, res) => {
  try {
    const { id } = req.params;
    
    // First check if the role exists
    const [roleCheck] = await db.query('SELECT * FROM roles WHERE id = ?', [id]);
    if (roleCheck.length === 0) {
      return res.status(404).json({ error: 'Role not found' });
    }

    // Check for dependent accounts
    const [dependentAccounts] = await db.query('SELECT COUNT(*) as count FROM accounts WHERE role_id = ?', [id]);
    
    if (dependentAccounts[0].count > 0) {
      return res.status(400).json({ 
        error: 'Cannot delete role: It has associated accounts. Please delete or reassign the accounts first.' 
      });
    }

    // Delete the role
    const [result] = await db.query('DELETE FROM roles WHERE id = ?', [id]);
    res.json({ message: 'Role deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ===== ACCOUNTS =====
const getAllAccounts = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT a.*, r.name as role_name, d.name as domain_name 
      FROM accounts a 
      LEFT JOIN roles r ON a.role_id = r.id 
      LEFT JOIN domains d ON a.domain_id = d.id
    `);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getAccountById = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await db.query(`
      SELECT a.*, r.name as role_name, d.name as domain_name 
      FROM accounts a 
      LEFT JOIN roles r ON a.role_id = r.id 
      LEFT JOIN domains d ON a.domain_id = d.id 
      WHERE a.id = ?
    `, [id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Account not found' });
    }
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createAccount = async (req, res) => {
  try {
    const { name, state = 'enabled', role_id, domain_id } = req.body;
    if (!name) {
      return res.status(400).json({ error: 'Name is required' });
    }
    const [result] = await db.query(
      'INSERT INTO accounts (name, state, role_id, domain_id) VALUES (?, ?, ?, ?)',
      [name, state, role_id, domain_id]
    );
    res.status(201).json({ id: result.insertId, name, state, role_id, domain_id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateAccount = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, state, role_id, domain_id } = req.body;
    if (!name) {
      return res.status(400).json({ error: 'Name is required' });
    }
    const [result] = await db.query(
      'UPDATE accounts SET name = ?, state = ?, role_id = ?, domain_id = ? WHERE id = ?',
      [name, state, role_id, domain_id, id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Account not found' });
    }
    res.json({ id, name, state, role_id, domain_id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteAccount = async (req, res) => {
  try {
    const { id } = req.params;
    
    // First check if the account exists
    const [accountCheck] = await db.query('SELECT * FROM accounts WHERE id = ?', [id]);
    if (accountCheck.length === 0) {
      return res.status(404).json({ error: 'Account not found' });
    }

    // Check for dependent records
    const [dependentUsers] = await db.query('SELECT COUNT(*) as count FROM users WHERE account_id = ?', [id]);
    
    if (dependentUsers[0].count > 0) {
      return res.status(400).json({ 
        error: 'Cannot delete account: It has associated users. Please delete or reassign the users first.' 
      });
    }

    // Delete the account
    const [result] = await db.query('DELETE FROM accounts WHERE id = ?', [id]);
    res.json({ message: 'Account deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ===== ZONES =====
const getAllZones = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM zones');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getZoneById = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await db.query('SELECT * FROM zones WHERE id = ?', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Zone not found' });
    }
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createZone = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({ error: 'Name is required' });
    }
    const [result] = await db.query('INSERT INTO zones (name) VALUES (?)', [name]);
    res.status(201).json({ id: result.insertId, name });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateZone = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({ error: 'Name is required' });
    }
    const [result] = await db.query('UPDATE zones SET name = ? WHERE id = ?', [name, id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Zone not found' });
    }
    res.json({ id, name });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteZone = async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await db.query('DELETE FROM zones WHERE id = ?', [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Zone not found' });
    }
    res.json({ message: 'Zone deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  // Domains
  getAllDomains,
  getDomainById,
  createDomain,
  updateDomain,
  deleteDomain,
  
  // Roles
  getAllRoles,
  getRoleById,
  createRole,
  updateRole,
  deleteRole,
  
  // Accounts
  getAllAccounts,
  getAccountById,
  createAccount,
  updateAccount,
  deleteAccount,
  
  // Zones
  getAllZones,
  getZoneById,
  createZone,
  updateZone,
  deleteZone
}; 