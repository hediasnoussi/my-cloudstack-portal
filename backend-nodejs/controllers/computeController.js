const db = require('../db');

// ===== INSTANCES =====
const getAllInstances = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT i.*, a.name as account_name, z.name as zone_name 
      FROM instances i 
      LEFT JOIN accounts a ON i.account_id = a.id 
      LEFT JOIN zones z ON i.zone_id = z.id
    `);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getInstanceById = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await db.query(`
      SELECT i.*, a.name as account_name, z.name as zone_name 
      FROM instances i 
      LEFT JOIN accounts a ON i.account_id = a.id 
      LEFT JOIN zones z ON i.zone_id = z.id 
      WHERE i.id = ?
    `, [id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Instance not found' });
    }
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createInstance = async (req, res) => {
  try {
    const { name, state, internal_name, ip_address, architecture, host, account_id, zone_id } = req.body;
    if (!name) {
      return res.status(400).json({ error: 'Name is required' });
    }
    const [result] = await db.query(
      'INSERT INTO instances (name, state, internal_name, ip_address, architecture, host, account_id, zone_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [name, state, internal_name, ip_address, architecture, host, account_id, zone_id]
    );
    res.status(201).json({ id: result.insertId, name, state, account_id, zone_id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateInstance = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, state, internal_name, ip_address, architecture, host, account_id, zone_id } = req.body;
    const [result] = await db.query(
      'UPDATE instances SET name = ?, state = ?, internal_name = ?, ip_address = ?, architecture = ?, host = ?, account_id = ?, zone_id = ? WHERE id = ?',
      [name, state, internal_name, ip_address, architecture, host, account_id, zone_id, id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Instance not found' });
    }
    res.json({ id, name, state, account_id, zone_id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteInstance = async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await db.query('DELETE FROM instances WHERE id = ?', [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Instance not found' });
    }
    res.json({ message: 'Instance deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ===== INSTANCE SNAPSHOTS =====
const getAllInstanceSnapshots = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT s.*, a.name as account_name, d.name as domain_name 
      FROM instance_snapshots s 
      LEFT JOIN accounts a ON s.account_id = a.id 
      LEFT JOIN domains d ON s.domain_id = d.id
    `);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getInstanceSnapshotById = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await db.query(`
      SELECT s.*, a.name as account_name, d.name as domain_name 
      FROM instance_snapshots s 
      LEFT JOIN accounts a ON s.account_id = a.id 
      LEFT JOIN domains d ON s.domain_id = d.id 
      WHERE s.id = ?
    `, [id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Instance snapshot not found' });
    }
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createInstanceSnapshot = async (req, res) => {
  try {
    const { display_name, state, name, type, is_current, parent_snapshot_id, created_at, account_id, domain_id } = req.body;
    if (!display_name) {
      return res.status(400).json({ error: 'Display name is required' });
    }
    const [result] = await db.query(
      'INSERT INTO instance_snapshots (display_name, state, name, type, is_current, parent_snapshot_id, created_at, account_id, domain_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [display_name, state, name, type, is_current, parent_snapshot_id, created_at, account_id, domain_id]
    );
    res.status(201).json({ id: result.insertId, display_name, account_id, domain_id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateInstanceSnapshot = async (req, res) => {
  try {
    const { id } = req.params;
    const { display_name, state, name, type, is_current, parent_snapshot_id, created_at, account_id, domain_id } = req.body;
    const [result] = await db.query(
      'UPDATE instance_snapshots SET display_name = ?, state = ?, name = ?, type = ?, is_current = ?, parent_snapshot_id = ?, created_at = ?, account_id = ?, domain_id = ? WHERE id = ?',
      [display_name, state, name, type, is_current, parent_snapshot_id, created_at, account_id, domain_id, id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Instance snapshot not found' });
    }
    res.json({ id, display_name, account_id, domain_id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteInstanceSnapshot = async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await db.query('DELETE FROM instance_snapshots WHERE id = ?', [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Instance snapshot not found' });
    }
    res.json({ message: 'Instance snapshot deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ===== KUBERNETES CLUSTERS =====
const getAllKubernetesClusters = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT k.*, a.name as account_name, z.name as zone_name 
      FROM kubernetes_clusters k 
      LEFT JOIN accounts a ON k.account_id = a.id 
      LEFT JOIN zones z ON k.zone_id = z.id
    `);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getKubernetesClusterById = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await db.query(`
      SELECT k.*, a.name as account_name, z.name as zone_name 
      FROM kubernetes_clusters k 
      LEFT JOIN accounts a ON k.account_id = a.id 
      LEFT JOIN zones z ON k.zone_id = z.id 
      WHERE k.id = ?
    `, [id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Kubernetes cluster not found' });
    }
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createKubernetesCluster = async (req, res) => {
  try {
    const { name, state, auto_scaling, cluster_type, size, cpu_core, memory, version, account_id, zone_id } = req.body;
    if (!name) {
      return res.status(400).json({ error: 'Name is required' });
    }
    const [result] = await db.query(
      'INSERT INTO kubernetes_clusters (name, state, auto_scaling, cluster_type, size, cpu_core, memory, version, account_id, zone_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [name, state, auto_scaling, cluster_type, size, cpu_core, memory, version, account_id, zone_id]
    );
    res.status(201).json({ id: result.insertId, name, account_id, zone_id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateKubernetesCluster = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, state, auto_scaling, cluster_type, size, cpu_core, memory, version, account_id, zone_id } = req.body;
    const [result] = await db.query(
      'UPDATE kubernetes_clusters SET name = ?, state = ?, auto_scaling = ?, cluster_type = ?, size = ?, cpu_core = ?, memory = ?, version = ?, account_id = ?, zone_id = ? WHERE id = ?',
      [name, state, auto_scaling, cluster_type, size, cpu_core, memory, version, account_id, zone_id, id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Kubernetes cluster not found' });
    }
    res.json({ id, name, account_id, zone_id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteKubernetesCluster = async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await db.query('DELETE FROM kubernetes_clusters WHERE id = ?', [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Kubernetes cluster not found' });
    }
    res.json({ message: 'Kubernetes cluster deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ===== AUTOSCALING GROUPS =====
const getAllAutoscalingGroups = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT a.*, acc.name as account_name 
      FROM autoscaling_groups a 
      LEFT JOIN accounts acc ON a.account_id = acc.id
    `);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getAutoscalingGroupById = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await db.query(`
      SELECT a.*, acc.name as account_name 
      FROM autoscaling_groups a 
      LEFT JOIN accounts acc ON a.account_id = acc.id 
      WHERE a.id = ?
    `, [id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Autoscaling group not found' });
    }
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createAutoscalingGroup = async (req, res) => {
  try {
    const { name, state, network_name, ip_address, private_port, min_members, max_members, available_instances, account_id } = req.body;
    if (!name) {
      return res.status(400).json({ error: 'Name is required' });
    }
    const [result] = await db.query(
      'INSERT INTO autoscaling_groups (name, state, network_name, ip_address, private_port, min_members, max_members, available_instances, account_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [name, state, network_name, ip_address, private_port, min_members, max_members, available_instances, account_id]
    );
    res.status(201).json({ id: result.insertId, name, account_id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateAutoscalingGroup = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, state, network_name, ip_address, private_port, min_members, max_members, available_instances, account_id } = req.body;
    const [result] = await db.query(
      'UPDATE autoscaling_groups SET name = ?, state = ?, network_name = ?, ip_address = ?, private_port = ?, min_members = ?, max_members = ?, available_instances = ?, account_id = ? WHERE id = ?',
      [name, state, network_name, ip_address, private_port, min_members, max_members, available_instances, account_id, id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Autoscaling group not found' });
    }
    res.json({ id, name, account_id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteAutoscalingGroup = async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await db.query('DELETE FROM autoscaling_groups WHERE id = ?', [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Autoscaling group not found' });
    }
    res.json({ message: 'Autoscaling group deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ===== INSTANCE GROUPS =====
const getAllInstanceGroups = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT i.*, a.name as account_name, d.name as domain_name 
      FROM instance_groups i 
      LEFT JOIN accounts a ON i.account_id = a.id 
      LEFT JOIN domains d ON i.domain_id = d.id
    `);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getInstanceGroupById = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await db.query(`
      SELECT i.*, a.name as account_name, d.name as domain_name 
      FROM instance_groups i 
      LEFT JOIN accounts a ON i.account_id = a.id 
      LEFT JOIN domains d ON i.domain_id = d.id 
      WHERE i.id = ?
    `, [id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Instance group not found' });
    }
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createInstanceGroup = async (req, res) => {
  try {
    const { name, account_id, domain_id } = req.body;
    if (!name) {
      return res.status(400).json({ error: 'Name is required' });
    }
    const [result] = await db.query(
      'INSERT INTO instance_groups (name, account_id, domain_id) VALUES (?, ?, ?)',
      [name, account_id, domain_id]
    );
    res.status(201).json({ id: result.insertId, name, account_id, domain_id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateInstanceGroup = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, account_id, domain_id } = req.body;
    const [result] = await db.query(
      'UPDATE instance_groups SET name = ?, account_id = ?, domain_id = ? WHERE id = ?',
      [name, account_id, domain_id, id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Instance group not found' });
    }
    res.json({ id, name, account_id, domain_id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteInstanceGroup = async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await db.query('DELETE FROM instance_groups WHERE id = ?', [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Instance group not found' });
    }
    res.json({ message: 'Instance group deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ===== SSH KEY PAIRS =====
const getAllSshKeyPairs = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT s.*, a.name as account_name, d.name as domain_name 
      FROM ssh_key_pairs s 
      LEFT JOIN accounts a ON s.account_id = a.id 
      LEFT JOIN domains d ON s.domain_id = d.id
    `);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getSshKeyPairById = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await db.query(`
      SELECT s.*, a.name as account_name, d.name as domain_name 
      FROM ssh_key_pairs s 
      LEFT JOIN accounts a ON s.account_id = a.id 
      LEFT JOIN domains d ON s.domain_id = d.id 
      WHERE s.id = ?
    `, [id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'SSH key pair not found' });
    }
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createSshKeyPair = async (req, res) => {
  try {
    const { name, fingerprints, account_id, domain_id } = req.body;
    if (!name) {
      return res.status(400).json({ error: 'Name is required' });
    }
    const [result] = await db.query(
      'INSERT INTO ssh_key_pairs (name, fingerprints, account_id, domain_id) VALUES (?, ?, ?, ?)',
      [name, fingerprints, account_id, domain_id]
    );
    res.status(201).json({ id: result.insertId, name, account_id, domain_id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateSshKeyPair = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, fingerprints, account_id, domain_id } = req.body;
    const [result] = await db.query(
      'UPDATE ssh_key_pairs SET name = ?, fingerprints = ?, account_id = ?, domain_id = ? WHERE id = ?',
      [name, fingerprints, account_id, domain_id, id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'SSH key pair not found' });
    }
    res.json({ id, name, account_id, domain_id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteSshKeyPair = async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await db.query('DELETE FROM ssh_key_pairs WHERE id = ?', [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'SSH key pair not found' });
    }
    res.json({ message: 'SSH key pair deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ===== USER DATA =====
const getAllUserData = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT u.*, a.name as account_name, d.name as domain_name 
      FROM user_data u 
      LEFT JOIN accounts a ON u.account_id = a.id 
      LEFT JOIN domains d ON u.domain_id = d.id
    `);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getUserDataById = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await db.query(`
      SELECT u.*, a.name as account_name, d.name as domain_name 
      FROM user_data u 
      LEFT JOIN accounts a ON u.account_id = a.id 
      LEFT JOIN domains d ON u.domain_id = d.id 
      WHERE u.id = ?
    `, [id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'User data not found' });
    }
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createUserData = async (req, res) => {
  try {
    const { name, ip_address, account_id, domain_id } = req.body;
    if (!name) {
      return res.status(400).json({ error: 'Name is required' });
    }
    const [result] = await db.query(
      'INSERT INTO user_data (name, ip_address, account_id, domain_id) VALUES (?, ?, ?, ?)',
      [name, ip_address, account_id, domain_id]
    );
    res.status(201).json({ id: result.insertId, name, account_id, domain_id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateUserData = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, ip_address, account_id, domain_id } = req.body;
    const [result] = await db.query(
      'UPDATE user_data SET name = ?, ip_address = ?, account_id = ?, domain_id = ? WHERE id = ?',
      [name, ip_address, account_id, domain_id, id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'User data not found' });
    }
    res.json({ id, name, account_id, domain_id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteUserData = async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await db.query('DELETE FROM user_data WHERE id = ?', [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'User data not found' });
    }
    res.json({ message: 'User data deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  // Instances
  getAllInstances,
  getInstanceById,
  createInstance,
  updateInstance,
  deleteInstance,
  
  // Instance Snapshots
  getAllInstanceSnapshots,
  getInstanceSnapshotById,
  createInstanceSnapshot,
  updateInstanceSnapshot,
  deleteInstanceSnapshot,
  
  // Kubernetes Clusters
  getAllKubernetesClusters,
  getKubernetesClusterById,
  createKubernetesCluster,
  updateKubernetesCluster,
  deleteKubernetesCluster,
  
  // Autoscaling Groups
  getAllAutoscalingGroups,
  getAutoscalingGroupById,
  createAutoscalingGroup,
  updateAutoscalingGroup,
  deleteAutoscalingGroup,
  
  // Instance Groups
  getAllInstanceGroups,
  getInstanceGroupById,
  createInstanceGroup,
  updateInstanceGroup,
  deleteInstanceGroup,
  
  // SSH Key Pairs
  getAllSshKeyPairs,
  getSshKeyPairById,
  createSshKeyPair,
  updateSshKeyPair,
  deleteSshKeyPair,
  
  // User Data
  getAllUserData,
  getUserDataById,
  createUserData,
  updateUserData,
  deleteUserData
}; 