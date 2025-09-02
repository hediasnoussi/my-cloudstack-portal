const db = require('../db');

// ===== PROJECTS =====
const getAllProjects = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT p.*, a.name as account_name, d.name as domain_name 
      FROM projects p 
      LEFT JOIN accounts a ON p.account_id = a.id 
      LEFT JOIN domains d ON p.domain_id = d.id
    `);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getProjectById = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await db.query(`
      SELECT p.*, a.name as account_name, d.name as domain_name 
      FROM projects p 
      LEFT JOIN accounts a ON p.account_id = a.id 
      LEFT JOIN domains d ON p.domain_id = d.id 
      WHERE p.id = ?
    `, [id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Project not found' });
    }
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createProject = async (req, res) => {
  try {
    const { name, state = 'enabled', display_text, account_id, domain_id } = req.body;
    if (!name) {
      return res.status(400).json({ error: 'Name is required' });
    }
    const [result] = await db.query(
      'INSERT INTO projects (name, state, display_text, account_id, domain_id) VALUES (?, ?, ?, ?, ?)',
      [name, state, display_text, account_id, domain_id]
    );
    res.status(201).json({ id: result.insertId, name, state, account_id, domain_id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateProject = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, state, display_text, account_id, domain_id } = req.body;
    if (!name) {
      return res.status(400).json({ error: 'Name is required' });
    }
    const [result] = await db.query(
      'UPDATE projects SET name = ?, state = ?, display_text = ?, account_id = ?, domain_id = ? WHERE id = ?',
      [name, state, display_text, account_id, domain_id, id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Project not found' });
    }
    res.json({ id, name, state, account_id, domain_id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteProject = async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await db.query('DELETE FROM projects WHERE id = ?', [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Project not found' });
    }
    res.json({ message: 'Project deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ===== PROJECT STATISTICS =====
const getProjectStatistics = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Vérifier si le projet existe
    const [projectRows] = await db.query('SELECT * FROM projects WHERE id = ?', [id]);
    if (projectRows.length === 0) {
      return res.status(404).json({ error: 'Project not found' });
    }

    // Statistiques des instances
    const [instanceStats] = await db.query(`
      SELECT 
        COUNT(*) as total_instances,
        SUM(CASE WHEN state = 'running' THEN 1 ELSE 0 END) as running_instances,
        SUM(CASE WHEN state = 'stopped' THEN 1 ELSE 0 END) as stopped_instances
      FROM instances 
      WHERE account_id = ?
    `, [projectRows[0].account_id]);

    // Statistiques des volumes
    const [volumeStats] = await db.query(`
      SELECT 
        COUNT(*) as total_volumes,
        SUM(CASE WHEN state = 'ready' THEN 1 ELSE 0 END) as ready_volumes,
        SUM(CASE WHEN state = 'allocated' THEN 1 ELSE 0 END) as allocated_volumes,
        SUM(size) as total_size
      FROM volumes 
      WHERE account_id = ?
    `, [projectRows[0].account_id]);

    // Statistiques des réseaux
    const [networkStats] = await db.query(`
      SELECT 
        COUNT(*) as total_networks,
        SUM(CASE WHEN state = 'active' THEN 1 ELSE 0 END) as active_networks
      FROM guest_networks 
      WHERE account_id = ?
    `, [projectRows[0].account_id]);

    // Statistiques des VPCs
    const [vpcStats] = await db.query(`
      SELECT 
        COUNT(*) as total_vpcs,
        SUM(CASE WHEN state = 'active' THEN 1 ELSE 0 END) as active_vpcs
      FROM vpcs 
      WHERE account_id = ?
    `, [projectRows[0].account_id]);

    const statistics = {
      project: projectRows[0],
      instances: instanceStats[0] || { total_instances: 0, running_instances: 0, stopped_instances: 0 },
      volumes: volumeStats[0] || { total_volumes: 0, ready_volumes: 0, allocated_volumes: 0, total_size: 0 },
      networks: networkStats[0] || { total_networks: 0, active_networks: 0 },
      vpcs: vpcStats[0] || { total_vpcs: 0, active_vpcs: 0 }
    };

    res.json(statistics);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ===== PROJECT RESOURCES =====
const getProjectResources = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Vérifier si le projet existe
    const [projectRows] = await db.query('SELECT * FROM projects WHERE id = ?', [id]);
    if (projectRows.length === 0) {
      return res.status(404).json({ error: 'Project not found' });
    }

    // Instances du projet
    const [instances] = await db.query(`
      SELECT i.*, z.name as zone_name 
      FROM instances i 
      LEFT JOIN zones z ON i.zone_id = z.id 
      WHERE i.account_id = ?
    `, [projectRows[0].account_id]);

    // Volumes du projet
    const [volumes] = await db.query(`
      SELECT v.*, z.name as zone_name 
      FROM volumes v 
      LEFT JOIN zones z ON v.zone_id = z.id 
      WHERE v.account_id = ?
    `, [projectRows[0].account_id]);

    // Réseaux du projet
    const [networks] = await db.query(`
      SELECT g.*, v.name as vpc_name, z.name as zone_name 
      FROM guest_networks g 
      LEFT JOIN vpcs v ON g.vpc_id = v.id 
      LEFT JOIN zones z ON g.zone_id = z.id 
      WHERE g.account_id = ?
    `, [projectRows[0].account_id]);

    // VPCs du projet
    const [vpcs] = await db.query(`
      SELECT v.*, z.name as zone_name 
      FROM vpcs v 
      LEFT JOIN zones z ON v.zone_id = z.id 
      WHERE v.account_id = ?
    `, [projectRows[0].account_id]);

    const resources = {
      project: projectRows[0],
      instances,
      volumes,
      networks,
      vpcs
    };

    res.json(resources);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ===== PROJECT MEMBERS =====
const getProjectMembers = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Vérifier si le projet existe
    const [projectRows] = await db.query('SELECT * FROM projects WHERE id = ?', [id]);
    if (projectRows.length === 0) {
      return res.status(404).json({ error: 'Project not found' });
    }

    // Membres du projet (comptes associés au même domaine)
    const [members] = await db.query(`
      SELECT a.*, r.name as role_name 
      FROM accounts a 
      LEFT JOIN roles r ON a.role_id = r.id 
      WHERE a.domain_id = ?
    `, [projectRows[0].domain_id]);

    res.json({
      project: projectRows[0],
      members
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ===== PROJECT ACTIVITY =====
const getProjectActivity = async (req, res) => {
  try {
    const { id } = req.params;
    const { days = 30 } = req.query;
    
    // Vérifier si le projet existe
    const [projectRows] = await db.query('SELECT * FROM projects WHERE id = ?', [id]);
    if (projectRows.length === 0) {
      return res.status(404).json({ error: 'Project not found' });
    }

    // Activité récente des instances
    const [instanceActivity] = await db.query(`
      SELECT 
        i.name,
        i.state,
        i.created_at,
        'instance' as resource_type
      FROM instances i 
      WHERE i.account_id = ?
      AND i.created_at >= DATE_SUB(NOW(), INTERVAL ? DAY)
      ORDER BY i.created_at DESC
      LIMIT 10
    `, [projectRows[0].account_id, days]);

    // Activité récente des volumes
    const [volumeActivity] = await db.query(`
      SELECT 
        v.name,
        v.state,
        v.created_at,
        'volume' as resource_type
      FROM volumes v 
      WHERE v.account_id = ?
      AND v.created_at >= DATE_SUB(NOW(), INTERVAL ? DAY)
      ORDER BY v.created_at DESC
      LIMIT 10
    `, [projectRows[0].account_id, days]);

    // Combiner et trier l'activité
    const allActivity = [...instanceActivity, ...volumeActivity]
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
      .slice(0, 20);

    res.json({
      project: projectRows[0],
      activity: allActivity,
      period: `${days} days`
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ===== PROJECT COSTS =====
const getProjectCosts = async (req, res) => {
  try {
    const { id } = req.params;
    const { month, year } = req.query;
    
    // Vérifier si le projet existe
    const [projectRows] = await db.query('SELECT * FROM projects WHERE id = ?', [id]);
    if (projectRows.length === 0) {
      return res.status(404).json({ error: 'Project not found' });
    }

    const targetMonth = month || new Date().getMonth() + 1;
    const targetYear = year || new Date().getFullYear();

    // Calculer les coûts estimés basés sur les ressources
    const [instanceCosts] = await db.query(`
      SELECT 
        COUNT(*) as instance_count,
        SUM(CASE WHEN state = 'running' THEN 1 ELSE 0 END) as running_instances,
        SUM(CASE WHEN state = 'stopped' THEN 1 ELSE 0 END) as stopped_instances
      FROM instances 
      WHERE account_id = ?
      AND MONTH(created_at) = ? AND YEAR(created_at) = ?
    `, [projectRows[0].account_id, targetMonth, targetYear]);

    const [volumeCosts] = await db.query(`
      SELECT 
        COUNT(*) as volume_count,
        SUM(size) as total_storage_gb
      FROM volumes 
      WHERE account_id = ?
      AND MONTH(created_at) = ? AND YEAR(created_at) = ?
    `, [projectRows[0].account_id, targetMonth, targetYear]);

    // Coûts estimés (exemple de tarification)
    const instanceCost = (instanceCosts[0]?.running_instances || 0) * 50; // $50 par instance running
    const storageCost = (volumeCosts[0]?.total_storage_gb || 0) * 0.1; // $0.10 par GB
    const totalCost = instanceCost + storageCost;

    const costs = {
      project: projectRows[0],
      period: { month: targetMonth, year: targetYear },
      resources: {
        instances: instanceCosts[0] || { instance_count: 0, running_instances: 0, stopped_instances: 0 },
        volumes: volumeCosts[0] || { volume_count: 0, total_storage_gb: 0 }
      },
      costs: {
        instance_cost: instanceCost,
        storage_cost: storageCost,
        total_cost: totalCost
      }
    };

    res.json(costs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  // Projects CRUD
  getAllProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
  
  // Project Analytics
  getProjectStatistics,
  getProjectResources,
  getProjectMembers,
  getProjectActivity,
  getProjectCosts
}; 