const db = require('../db');

// ===== VOLUMES =====
const getAllVolumes = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT v.*, a.name as account_name, z.name as zone_name 
      FROM volumes v 
      LEFT JOIN accounts a ON v.account_id = a.id 
      LEFT JOIN zones z ON v.zone_id = z.id
    `);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getVolumeById = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await db.query(`
      SELECT v.*, a.name as account_name, z.name as zone_name 
      FROM volumes v 
      LEFT JOIN accounts a ON v.account_id = a.id 
      LEFT JOIN zones z ON v.zone_id = z.id 
      WHERE v.id = ?
    `, [id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Volume not found' });
    }
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createVolume = async (req, res) => {
  try {
    const { name, state, size, type, instance_name, storage, account_id, zone_id } = req.body;
    if (!name) {
      return res.status(400).json({ error: 'Name is required' });
    }
    const [result] = await db.query(
      'INSERT INTO volumes (name, state, size, type, instance_name, storage, account_id, zone_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [name, state, size, type, instance_name, storage, account_id, zone_id]
    );
    res.status(201).json({ id: result.insertId, name, state, account_id, zone_id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateVolume = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, state, size, type, instance_name, storage, account_id, zone_id } = req.body;
    const [result] = await db.query(
      'UPDATE volumes SET name = ?, state = ?, size = ?, type = ?, instance_name = ?, storage = ?, account_id = ?, zone_id = ? WHERE id = ?',
      [name, state, size, type, instance_name, storage, account_id, zone_id, id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Volume not found' });
    }
    res.json({ id, name, state, account_id, zone_id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteVolume = async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await db.query('DELETE FROM volumes WHERE id = ?', [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Volume not found' });
    }
    res.json({ message: 'Volume deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ===== VOLUME SNAPSHOTS =====
const getAllVolumeSnapshots = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT vs.*, a.name as account_name, d.name as domain_name, z.name as zone_name 
      FROM volume_snapshots vs 
      LEFT JOIN accounts a ON vs.account_id = a.id 
      LEFT JOIN domains d ON vs.domain_id = d.id 
      LEFT JOIN zones z ON vs.zone_id = z.id
    `);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getVolumeSnapshotById = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await db.query(`
      SELECT vs.*, a.name as account_name, d.name as domain_name, z.name as zone_name 
      FROM volume_snapshots vs 
      LEFT JOIN accounts a ON vs.account_id = a.id 
      LEFT JOIN domains d ON vs.domain_id = d.id 
      LEFT JOIN zones z ON vs.zone_id = z.id 
      WHERE vs.id = ?
    `, [id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Volume snapshot not found' });
    }
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createVolumeSnapshot = async (req, res) => {
  try {
    const { name, state, volume_name, interval_type, physical_size, created_at, account_id, domain_id, zone_id } = req.body;
    if (!name) {
      return res.status(400).json({ error: 'Name is required' });
    }
    const [result] = await db.query(
      'INSERT INTO volume_snapshots (name, state, volume_name, interval_type, physical_size, created_at, account_id, domain_id, zone_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [name, state, volume_name, interval_type, physical_size, created_at, account_id, domain_id, zone_id]
    );
    res.status(201).json({ id: result.insertId, name, account_id, domain_id, zone_id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateVolumeSnapshot = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, state, volume_name, interval_type, physical_size, created_at, account_id, domain_id, zone_id } = req.body;
    const [result] = await db.query(
      'UPDATE volume_snapshots SET name = ?, state = ?, volume_name = ?, interval_type = ?, physical_size = ?, created_at = ?, account_id = ?, domain_id = ?, zone_id = ? WHERE id = ?',
      [name, state, volume_name, interval_type, physical_size, created_at, account_id, domain_id, zone_id, id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Volume snapshot not found' });
    }
    res.json({ id, name, account_id, domain_id, zone_id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteVolumeSnapshot = async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await db.query('DELETE FROM volume_snapshots WHERE id = ?', [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Volume snapshot not found' });
    }
    res.json({ message: 'Volume snapshot deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ===== BACKUPS =====
const getAllBackups = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT b.*, a.name as account_name, d.name as domain_name, z.name as zone_name 
      FROM backups b 
      LEFT JOIN accounts a ON b.account_id = a.id 
      LEFT JOIN domains d ON b.domain_id = d.id 
      LEFT JOIN zones z ON b.zone_id = z.id
    `);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getBackupById = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await db.query(`
      SELECT b.*, a.name as account_name, d.name as domain_name, z.name as zone_name 
      FROM backups b 
      LEFT JOIN accounts a ON b.account_id = a.id 
      LEFT JOIN domains d ON b.domain_id = d.id 
      LEFT JOIN zones z ON b.zone_id = z.id 
      WHERE b.id = ?
    `, [id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Backup not found' });
    }
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createBackup = async (req, res) => {
  try {
    const { name, status, size, virtual_size, type, created_at, account_id, domain_id, zone_id } = req.body;
    if (!name) {
      return res.status(400).json({ error: 'Name is required' });
    }
    const [result] = await db.query(
      'INSERT INTO backups (name, status, size, virtual_size, type, created_at, account_id, domain_id, zone_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [name, status, size, virtual_size, type, created_at, account_id, domain_id, zone_id]
    );
    res.status(201).json({ id: result.insertId, name, account_id, domain_id, zone_id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateBackup = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, status, size, virtual_size, type, created_at, account_id, domain_id, zone_id } = req.body;
    const [result] = await db.query(
      'UPDATE backups SET name = ?, status = ?, size = ?, virtual_size = ?, type = ?, created_at = ?, account_id = ?, domain_id = ?, zone_id = ? WHERE id = ?',
      [name, status, size, virtual_size, type, created_at, account_id, domain_id, zone_id, id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Backup not found' });
    }
    res.json({ id, name, account_id, domain_id, zone_id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteBackup = async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await db.query('DELETE FROM backups WHERE id = ?', [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Backup not found' });
    }
    res.json({ message: 'Backup deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ===== BUCKETS =====
const getAllBuckets = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT b.*, a.name as account_name 
      FROM buckets b 
      LEFT JOIN accounts a ON b.account_id = a.id
    `);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getBucketById = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await db.query(`
      SELECT b.*, a.name as account_name 
      FROM buckets b 
      LEFT JOIN accounts a ON b.account_id = a.id 
      WHERE b.id = ?
    `, [id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Bucket not found' });
    }
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createBucket = async (req, res) => {
  try {
    const { name, status, object_storage, size, account_id } = req.body;
    if (!name) {
      return res.status(400).json({ error: 'Name is required' });
    }
    const [result] = await db.query(
      'INSERT INTO buckets (name, status, object_storage, size, account_id) VALUES (?, ?, ?, ?, ?)',
      [name, status, object_storage, size, account_id]
    );
    res.status(201).json({ id: result.insertId, name, account_id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateBucket = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, status, object_storage, size, account_id } = req.body;
    const [result] = await db.query(
      'UPDATE buckets SET name = ?, status = ?, object_storage = ?, size = ?, account_id = ? WHERE id = ?',
      [name, status, object_storage, size, account_id, id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Bucket not found' });
    }
    res.json({ id, name, account_id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteBucket = async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await db.query('DELETE FROM buckets WHERE id = ?', [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Bucket not found' });
    }
    res.json({ message: 'Bucket deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ===== SHARED FILE SYSTEMS =====
const getAllSharedFileSystems = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT s.*, a.name as account_name 
      FROM shared_file_systems s 
      LEFT JOIN accounts a ON s.account_id = a.id
    `);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getSharedFileSystemById = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await db.query(`
      SELECT s.*, a.name as account_name 
      FROM shared_file_systems s 
      LEFT JOIN accounts a ON s.account_id = a.id 
      WHERE s.id = ?
    `, [id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Shared file system not found' });
    }
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createSharedFileSystem = async (req, res) => {
  try {
    const { name, state, size, account_id } = req.body;
    if (!name) {
      return res.status(400).json({ error: 'Name is required' });
    }
    const [result] = await db.query(
      'INSERT INTO shared_file_systems (name, state, size, account_id) VALUES (?, ?, ?, ?)',
      [name, state, size, account_id]
    );
    res.status(201).json({ id: result.insertId, name, account_id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateSharedFileSystem = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, state, size, account_id } = req.body;
    const [result] = await db.query(
      'UPDATE shared_file_systems SET name = ?, state = ?, size = ?, account_id = ? WHERE id = ?',
      [name, state, size, account_id, id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Shared file system not found' });
    }
    res.json({ id, name, account_id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteSharedFileSystem = async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await db.query('DELETE FROM shared_file_systems WHERE id = ?', [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Shared file system not found' });
    }
    res.json({ message: 'Shared file system deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  // Volumes
  getAllVolumes,
  getVolumeById,
  createVolume,
  updateVolume,
  deleteVolume,
  
  // Volume Snapshots
  getAllVolumeSnapshots,
  getVolumeSnapshotById,
  createVolumeSnapshot,
  updateVolumeSnapshot,
  deleteVolumeSnapshot,
  
  // Backups
  getAllBackups,
  getBackupById,
  createBackup,
  updateBackup,
  deleteBackup,
  
  // Buckets
  getAllBuckets,
  getBucketById,
  createBucket,
  updateBucket,
  deleteBucket,
  
  // Shared File Systems
  getAllSharedFileSystems,
  getSharedFileSystemById,
  createSharedFileSystem,
  updateSharedFileSystem,
  deleteSharedFileSystem
}; 