const db = require('../db');

// ===== VPCS =====
const getAllVpcs = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT v.*, a.name as account_name, d.name as domain_name, z.name as zone_name 
      FROM vpcs v 
      LEFT JOIN accounts a ON v.account_id = a.id 
      LEFT JOIN domains d ON v.domain_id = d.id 
      LEFT JOIN zones z ON v.zone_id = z.id
    `);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getVpcById = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await db.query(`
      SELECT v.*, a.name as account_name, d.name as domain_name, z.name as zone_name 
      FROM vpcs v 
      LEFT JOIN accounts a ON v.account_id = a.id 
      LEFT JOIN domains d ON v.domain_id = d.id 
      LEFT JOIN zones z ON v.zone_id = z.id 
      WHERE v.id = ?
    `, [id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'VPC not found' });
    }
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createVpc = async (req, res) => {
  try {
    const { name, state, description, cidr, account_id, domain_id, zone_id } = req.body;
    if (!name) {
      return res.status(400).json({ error: 'Name is required' });
    }
    const [result] = await db.query(
      'INSERT INTO vpcs (name, state, description, cidr, account_id, domain_id, zone_id) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [name, state, description, cidr, account_id, domain_id, zone_id]
    );
    res.status(201).json({ id: result.insertId, name, account_id, domain_id, zone_id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateVpc = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, state, description, cidr, account_id, domain_id, zone_id } = req.body;
    const [result] = await db.query(
      'UPDATE vpcs SET name = ?, state = ?, description = ?, cidr = ?, account_id = ?, domain_id = ?, zone_id = ? WHERE id = ?',
      [name, state, description, cidr, account_id, domain_id, zone_id, id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'VPC not found' });
    }
    res.json({ id, name, account_id, domain_id, zone_id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteVpc = async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await db.query('DELETE FROM vpcs WHERE id = ?', [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'VPC not found' });
    }
    res.json({ message: 'VPC deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ===== GUEST NETWORKS =====
const getAllGuestNetworks = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT g.*, v.name as vpc_name, a.name as account_name, d.name as domain_name, z.name as zone_name 
      FROM guest_networks g 
      LEFT JOIN vpcs v ON g.vpc_id = v.id 
      LEFT JOIN accounts a ON g.account_id = a.id 
      LEFT JOIN domains d ON g.domain_id = d.id 
      LEFT JOIN zones z ON g.zone_id = z.id
    `);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getGuestNetworkById = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await db.query(`
      SELECT g.*, v.name as vpc_name, a.name as account_name, d.name as domain_name, z.name as zone_name 
      FROM guest_networks g 
      LEFT JOIN vpcs v ON g.vpc_id = v.id 
      LEFT JOIN accounts a ON g.account_id = a.id 
      LEFT JOIN domains d ON g.domain_id = d.id 
      LEFT JOIN zones z ON g.zone_id = z.id 
      WHERE g.id = ?
    `, [id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Guest network not found' });
    }
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createGuestNetwork = async (req, res) => {
  try {
    const { name, state, type, vpc_id, ipv4_cidr, ipv6_cidr, broadcast_uri, domain_id, account_id, zone_id } = req.body;
    if (!name) {
      return res.status(400).json({ error: 'Name is required' });
    }
    const [result] = await db.query(
      'INSERT INTO guest_networks (name, state, type, vpc_id, ipv4_cidr, ipv6_cidr, broadcast_uri, domain_id, account_id, zone_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [name, state, type, vpc_id, ipv4_cidr, ipv6_cidr, broadcast_uri, domain_id, account_id, zone_id]
    );
    res.status(201).json({ id: result.insertId, name, vpc_id, account_id, domain_id, zone_id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateGuestNetwork = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, state, type, vpc_id, ipv4_cidr, ipv6_cidr, broadcast_uri, domain_id, account_id, zone_id } = req.body;
    const [result] = await db.query(
      'UPDATE guest_networks SET name = ?, state = ?, type = ?, vpc_id = ?, ipv4_cidr = ?, ipv6_cidr = ?, broadcast_uri = ?, domain_id = ?, account_id = ?, zone_id = ? WHERE id = ?',
      [name, state, type, vpc_id, ipv4_cidr, ipv6_cidr, broadcast_uri, domain_id, account_id, zone_id, id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Guest network not found' });
    }
    res.json({ id, name, vpc_id, account_id, domain_id, zone_id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteGuestNetwork = async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await db.query('DELETE FROM guest_networks WHERE id = ?', [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Guest network not found' });
    }
    res.json({ message: 'Guest network deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ===== SECURITY GROUPS =====
const getAllSecurityGroups = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT s.*, a.name as account_name 
      FROM security_groups s 
      LEFT JOIN accounts a ON s.account_id = a.id
    `);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getSecurityGroupById = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await db.query(`
      SELECT s.*, a.name as account_name 
      FROM security_groups s 
      LEFT JOIN accounts a ON s.account_id = a.id 
      WHERE s.id = ?
    `, [id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Security group not found' });
    }
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createSecurityGroup = async (req, res) => {
  try {
    const { name, description, account_id } = req.body;
    if (!name) {
      return res.status(400).json({ error: 'Name is required' });
    }
    const [result] = await db.query(
      'INSERT INTO security_groups (name, description, account_id) VALUES (?, ?, ?)',
      [name, description, account_id]
    );
    res.status(201).json({ id: result.insertId, name, account_id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateSecurityGroup = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, account_id } = req.body;
    const [result] = await db.query(
      'UPDATE security_groups SET name = ?, description = ?, account_id = ? WHERE id = ?',
      [name, description, account_id, id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Security group not found' });
    }
    res.json({ id, name, account_id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteSecurityGroup = async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await db.query('DELETE FROM security_groups WHERE id = ?', [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Security group not found' });
    }
    res.json({ message: 'Security group deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ===== VNF APPLIANCES =====
const getAllVnfAppliances = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT v.*, a.name as account_name, d.name as domain_name, z.name as zone_name 
      FROM vnf_appliances v 
      LEFT JOIN accounts a ON v.account_id = a.id 
      LEFT JOIN domains d ON v.domain_id = d.id 
      LEFT JOIN zones z ON v.zone_id = z.id
    `);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getVnfApplianceById = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await db.query(`
      SELECT v.*, a.name as account_name, d.name as domain_name, z.name as zone_name 
      FROM vnf_appliances v 
      LEFT JOIN accounts a ON v.account_id = a.id 
      LEFT JOIN domains d ON v.domain_id = d.id 
      LEFT JOIN zones z ON v.zone_id = z.id 
      WHERE v.id = ?
    `, [id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'VNF appliance not found' });
    }
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createVnfAppliance = async (req, res) => {
  try {
    const { name, state, internal_name, ip_address, account_id, domain_id, host, zone_id } = req.body;
    if (!name) {
      return res.status(400).json({ error: 'Name is required' });
    }
    const [result] = await db.query(
      'INSERT INTO vnf_appliances (name, state, internal_name, ip_address, account_id, domain_id, host, zone_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [name, state, internal_name, ip_address, account_id, domain_id, host, zone_id]
    );
    res.status(201).json({ id: result.insertId, name, account_id, domain_id, zone_id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateVnfAppliance = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, state, internal_name, ip_address, account_id, domain_id, host, zone_id } = req.body;
    const [result] = await db.query(
      'UPDATE vnf_appliances SET name = ?, state = ?, internal_name = ?, ip_address = ?, account_id = ?, domain_id = ?, host = ?, zone_id = ? WHERE id = ?',
      [name, state, internal_name, ip_address, account_id, domain_id, host, zone_id, id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'VNF appliance not found' });
    }
    res.json({ id, name, account_id, domain_id, zone_id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteVnfAppliance = async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await db.query('DELETE FROM vnf_appliances WHERE id = ?', [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'VNF appliance not found' });
    }
    res.json({ message: 'VNF appliance deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ===== PUBLIC IP ADDRESSES =====
const getAllPublicIpAddresses = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT p.*, v.name as vpc_name, a.name as account_name, d.name as domain_name, z.name as zone_name 
      FROM public_ip_addresses p 
      LEFT JOIN vpcs v ON p.vpc_id = v.id 
      LEFT JOIN accounts a ON p.account_id = a.id 
      LEFT JOIN domains d ON p.domain_id = d.id 
      LEFT JOIN zones z ON p.zone_id = z.id
    `);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getPublicIpAddressById = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await db.query(`
      SELECT p.*, v.name as vpc_name, a.name as account_name, d.name as domain_name, z.name as zone_name 
      FROM public_ip_addresses p 
      LEFT JOIN vpcs v ON p.vpc_id = v.id 
      LEFT JOIN accounts a ON p.account_id = a.id 
      LEFT JOIN domains d ON p.domain_id = d.id 
      LEFT JOIN zones z ON p.zone_id = z.id 
      WHERE p.id = ?
    `, [id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Public IP address not found' });
    }
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createPublicIpAddress = async (req, res) => {
  try {
    const { ip_address, state, network_name, vpc_id, instance_name, allocated_at, account_id, domain_id, zone_id } = req.body;
    if (!ip_address) {
      return res.status(400).json({ error: 'IP address is required' });
    }
    const [result] = await db.query(
      'INSERT INTO public_ip_addresses (ip_address, state, network_name, vpc_id, instance_name, allocated_at, account_id, domain_id, zone_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [ip_address, state, network_name, vpc_id, instance_name, allocated_at, account_id, domain_id, zone_id]
    );
    res.status(201).json({ id: result.insertId, ip_address, vpc_id, account_id, domain_id, zone_id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updatePublicIpAddress = async (req, res) => {
  try {
    const { id } = req.params;
    const { ip_address, state, network_name, vpc_id, instance_name, allocated_at, account_id, domain_id, zone_id } = req.body;
    const [result] = await db.query(
      'UPDATE public_ip_addresses SET ip_address = ?, state = ?, network_name = ?, vpc_id = ?, instance_name = ?, allocated_at = ?, account_id = ?, domain_id = ?, zone_id = ? WHERE id = ?',
      [ip_address, state, network_name, vpc_id, instance_name, allocated_at, account_id, domain_id, zone_id, id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Public IP address not found' });
    }
    res.json({ id, ip_address, vpc_id, account_id, domain_id, zone_id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deletePublicIpAddress = async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await db.query('DELETE FROM public_ip_addresses WHERE id = ?', [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Public IP address not found' });
    }
    res.json({ message: 'Public IP address deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ===== AS NUMBERS =====
const getAllAsNumbers = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT a.*, v.name as vpc_name, acc.name as account_name, d.name as domain_name, z.name as zone_name 
      FROM as_numbers a 
      LEFT JOIN vpcs v ON a.vpc_id = v.id 
      LEFT JOIN accounts acc ON a.account_id = acc.id 
      LEFT JOIN domains d ON a.domain_id = d.id 
      LEFT JOIN zones z ON a.zone_id = z.id
    `);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getAsNumberById = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await db.query(`
      SELECT a.*, v.name as vpc_name, acc.name as account_name, d.name as domain_name, z.name as zone_name 
      FROM as_numbers a 
      LEFT JOIN vpcs v ON a.vpc_id = v.id 
      LEFT JOIN accounts acc ON a.account_id = acc.id 
      LEFT JOIN domains d ON a.domain_id = d.id 
      LEFT JOIN zones z ON a.zone_id = z.id 
      WHERE a.id = ?
    `, [id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'AS number not found' });
    }
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createAsNumber = async (req, res) => {
  try {
    const { as_number, allocation_state, as_range, network_name, vpc_id, allocated_at, account_id, domain_id, zone_id } = req.body;
    if (!as_number) {
      return res.status(400).json({ error: 'AS number is required' });
    }
    const [result] = await db.query(
      'INSERT INTO as_numbers (as_number, allocation_state, as_range, network_name, vpc_id, allocated_at, account_id, domain_id, zone_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [as_number, allocation_state, as_range, network_name, vpc_id, allocated_at, account_id, domain_id, zone_id]
    );
    res.status(201).json({ id: result.insertId, as_number, vpc_id, account_id, domain_id, zone_id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateAsNumber = async (req, res) => {
  try {
    const { id } = req.params;
    const { as_number, allocation_state, as_range, network_name, vpc_id, allocated_at, account_id, domain_id, zone_id } = req.body;
    const [result] = await db.query(
      'UPDATE as_numbers SET as_number = ?, allocation_state = ?, as_range = ?, network_name = ?, vpc_id = ?, allocated_at = ?, account_id = ?, domain_id = ?, zone_id = ? WHERE id = ?',
      [as_number, allocation_state, as_range, network_name, vpc_id, allocated_at, account_id, domain_id, zone_id, id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'AS number not found' });
    }
    res.json({ id, as_number, vpc_id, account_id, domain_id, zone_id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteAsNumber = async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await db.query('DELETE FROM as_numbers WHERE id = ?', [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'AS number not found' });
    }
    res.json({ message: 'AS number deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ===== SITE TO SITE VPN =====
const getAllSiteToSiteVpn = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT s.*, a.name as account_name, d.name as domain_name 
      FROM site_to_site_vpn s 
      LEFT JOIN accounts a ON s.account_id = a.id 
      LEFT JOIN domains d ON s.domain_id = d.id
    `);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getSiteToSiteVpnById = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await db.query(`
      SELECT s.*, a.name as account_name, d.name as domain_name 
      FROM site_to_site_vpn s 
      LEFT JOIN accounts a ON s.account_id = a.id 
      LEFT JOIN domains d ON s.domain_id = d.id 
      WHERE s.id = ?
    `, [id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Site to site VPN not found' });
    }
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createSiteToSiteVpn = async (req, res) => {
  try {
    const { ip_address, account_id, domain_id } = req.body;
    if (!ip_address) {
      return res.status(400).json({ error: 'IP address is required' });
    }
    const [result] = await db.query(
      'INSERT INTO site_to_site_vpn (ip_address, account_id, domain_id) VALUES (?, ?, ?)',
      [ip_address, account_id, domain_id]
    );
    res.status(201).json({ id: result.insertId, ip_address, account_id, domain_id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateSiteToSiteVpn = async (req, res) => {
  try {
    const { id } = req.params;
    const { ip_address, account_id, domain_id } = req.body;
    const [result] = await db.query(
      'UPDATE site_to_site_vpn SET ip_address = ?, account_id = ?, domain_id = ? WHERE id = ?',
      [ip_address, account_id, domain_id, id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Site to site VPN not found' });
    }
    res.json({ id, ip_address, account_id, domain_id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteSiteToSiteVpn = async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await db.query('DELETE FROM site_to_site_vpn WHERE id = ?', [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Site to site VPN not found' });
    }
    res.json({ message: 'Site to site VPN deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ===== VPN USERS =====
const getAllVpnUsers = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT v.*, a.name as account_name, d.name as domain_name 
      FROM vpn_users v 
      LEFT JOIN accounts a ON v.account_id = a.id 
      LEFT JOIN domains d ON v.domain_id = d.id
    `);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getVpnUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await db.query(`
      SELECT v.*, a.name as account_name, d.name as domain_name 
      FROM vpn_users v 
      LEFT JOIN accounts a ON v.account_id = a.id 
      LEFT JOIN domains d ON v.domain_id = d.id 
      WHERE v.id = ?
    `, [id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'VPN user not found' });
    }
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createVpnUser = async (req, res) => {
  try {
    const { username, state, account_id, domain_id } = req.body;
    if (!username) {
      return res.status(400).json({ error: 'Username is required' });
    }
    const [result] = await db.query(
      'INSERT INTO vpn_users (username, state, account_id, domain_id) VALUES (?, ?, ?, ?)',
      [username, state, account_id, domain_id]
    );
    res.status(201).json({ id: result.insertId, username, account_id, domain_id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateVpnUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { username, state, account_id, domain_id } = req.body;
    const [result] = await db.query(
      'UPDATE vpn_users SET username = ?, state = ?, account_id = ?, domain_id = ? WHERE id = ?',
      [username, state, account_id, domain_id, id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'VPN user not found' });
    }
    res.json({ id, username, account_id, domain_id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteVpnUser = async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await db.query('DELETE FROM vpn_users WHERE id = ?', [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'VPN user not found' });
    }
    res.json({ message: 'VPN user deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ===== VPN CUSTOMER GATEWAYS =====
const getAllVpnCustomerGateways = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT v.*, a.name as account_name, d.name as domain_name 
      FROM vpn_customer_gateways v 
      LEFT JOIN accounts a ON v.account_id = a.id 
      LEFT JOIN domains d ON v.domain_id = d.id
    `);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getVpnCustomerGatewayById = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await db.query(`
      SELECT v.*, a.name as account_name, d.name as domain_name 
      FROM vpn_customer_gateways v 
      LEFT JOIN accounts a ON v.account_id = a.id 
      LEFT JOIN domains d ON v.domain_id = d.id 
      WHERE v.id = ?
    `, [id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'VPN customer gateway not found' });
    }
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createVpnCustomerGateway = async (req, res) => {
  try {
    const { name, gateway, cidr_list, preshared_key, account_id, domain_id } = req.body;
    if (!name) {
      return res.status(400).json({ error: 'Name is required' });
    }
    const [result] = await db.query(
      'INSERT INTO vpn_customer_gateways (name, gateway, cidr_list, preshared_key, account_id, domain_id) VALUES (?, ?, ?, ?, ?, ?)',
      [name, gateway, cidr_list, preshared_key, account_id, domain_id]
    );
    res.status(201).json({ id: result.insertId, name, account_id, domain_id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateVpnCustomerGateway = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, gateway, cidr_list, preshared_key, account_id, domain_id } = req.body;
    const [result] = await db.query(
      'UPDATE vpn_customer_gateways SET name = ?, gateway = ?, cidr_list = ?, preshared_key = ?, account_id = ?, domain_id = ? WHERE id = ?',
      [name, gateway, cidr_list, preshared_key, account_id, domain_id, id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'VPN customer gateway not found' });
    }
    res.json({ id, name, account_id, domain_id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteVpnCustomerGateway = async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await db.query('DELETE FROM vpn_customer_gateways WHERE id = ?', [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'VPN customer gateway not found' });
    }
    res.json({ message: 'VPN customer gateway deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ===== GUEST VLANS =====
const getAllGuestVlans = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT g.*, a.name as account_name, p.name as project_name, d.name as domain_name, z.name as zone_name, gn.name as guest_network_name 
      FROM guest_vlans g 
      LEFT JOIN accounts a ON g.account_id = a.id 
      LEFT JOIN projects p ON g.project_id = p.id 
      LEFT JOIN domains d ON g.domain_id = d.id 
      LEFT JOIN zones z ON g.zone_id = z.id 
      LEFT JOIN guest_networks gn ON g.guest_network_id = gn.id
    `);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getGuestVlanById = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await db.query(`
      SELECT g.*, a.name as account_name, p.name as project_name, d.name as domain_name, z.name as zone_name, gn.name as guest_network_name 
      FROM guest_vlans g 
      LEFT JOIN accounts a ON g.account_id = a.id 
      LEFT JOIN projects p ON g.project_id = p.id 
      LEFT JOIN domains d ON g.domain_id = d.id 
      LEFT JOIN zones z ON g.zone_id = z.id 
      LEFT JOIN guest_networks gn ON g.guest_network_id = gn.id 
      WHERE g.id = ?
    `, [id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Guest VLAN not found' });
    }
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createGuestVlan = async (req, res) => {
  try {
    const { vlan_vni, allocation_state, physical_network_name, taken, account_id, project_id, domain_id, zone_id, guest_network_id } = req.body;
    if (!vlan_vni) {
      return res.status(400).json({ error: 'VLAN VNI is required' });
    }
    const [result] = await db.query(
      'INSERT INTO guest_vlans (vlan_vni, allocation_state, physical_network_name, taken, account_id, project_id, domain_id, zone_id, guest_network_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [vlan_vni, allocation_state, physical_network_name, taken, account_id, project_id, domain_id, zone_id, guest_network_id]
    );
    res.status(201).json({ id: result.insertId, vlan_vni, account_id, project_id, domain_id, zone_id, guest_network_id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateGuestVlan = async (req, res) => {
  try {
    const { id } = req.params;
    const { vlan_vni, allocation_state, physical_network_name, taken, account_id, project_id, domain_id, zone_id, guest_network_id } = req.body;
    const [result] = await db.query(
      'UPDATE guest_vlans SET vlan_vni = ?, allocation_state = ?, physical_network_name = ?, taken = ?, account_id = ?, project_id = ?, domain_id = ?, zone_id = ?, guest_network_id = ? WHERE id = ?',
      [vlan_vni, allocation_state, physical_network_name, taken, account_id, project_id, domain_id, zone_id, guest_network_id, id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Guest VLAN not found' });
    }
    res.json({ id, vlan_vni, account_id, project_id, domain_id, zone_id, guest_network_id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteGuestVlan = async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await db.query('DELETE FROM guest_vlans WHERE id = ?', [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Guest VLAN not found' });
    }
    res.json({ message: 'Guest VLAN deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ===== IPV4 SUBNETS =====
const getAllIpv4Subnets = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT i.*, z.name as zone_name, v.name as vpc_name 
      FROM ipv4_subnets i 
      LEFT JOIN zones z ON i.zone_id = z.id 
      LEFT JOIN vpcs v ON i.vpc_id = v.id
    `);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getIpv4SubnetById = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await db.query(`
      SELECT i.*, z.name as zone_name, v.name as vpc_name 
      FROM ipv4_subnets i 
      LEFT JOIN zones z ON i.zone_id = z.id 
      LEFT JOIN vpcs v ON i.vpc_id = v.id 
      WHERE i.id = ?
    `, [id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'IPv4 subnet not found' });
    }
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createIpv4Subnet = async (req, res) => {
  try {
    const { subnet, zone_id, parent_subnet_id, network_name, vpc_id, created_at, allocated } = req.body;
    if (!subnet) {
      return res.status(400).json({ error: 'Subnet is required' });
    }
    const [result] = await db.query(
      'INSERT INTO ipv4_subnets (subnet, zone_id, parent_subnet_id, network_name, vpc_id, created_at, allocated) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [subnet, zone_id, parent_subnet_id, network_name, vpc_id, created_at, allocated]
    );
    res.status(201).json({ id: result.insertId, subnet, zone_id, vpc_id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateIpv4Subnet = async (req, res) => {
  try {
    const { id } = req.params;
    const { subnet, zone_id, parent_subnet_id, network_name, vpc_id, created_at, allocated } = req.body;
    const [result] = await db.query(
      'UPDATE ipv4_subnets SET subnet = ?, zone_id = ?, parent_subnet_id = ?, network_name = ?, vpc_id = ?, created_at = ?, allocated = ? WHERE id = ?',
      [subnet, zone_id, parent_subnet_id, network_name, vpc_id, created_at, allocated, id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'IPv4 subnet not found' });
    }
    res.json({ id, subnet, zone_id, vpc_id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteIpv4Subnet = async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await db.query('DELETE FROM ipv4_subnets WHERE id = ?', [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'IPv4 subnet not found' });
    }
    res.json({ message: 'IPv4 subnet deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  // VPCs
  getAllVpcs,
  getVpcById,
  createVpc,
  updateVpc,
  deleteVpc,
  
  // Guest Networks
  getAllGuestNetworks,
  getGuestNetworkById,
  createGuestNetwork,
  updateGuestNetwork,
  deleteGuestNetwork,
  
  // Security Groups
  getAllSecurityGroups,
  getSecurityGroupById,
  createSecurityGroup,
  updateSecurityGroup,
  deleteSecurityGroup,
  
  // VNF Appliances
  getAllVnfAppliances,
  getVnfApplianceById,
  createVnfAppliance,
  updateVnfAppliance,
  deleteVnfAppliance,
  
  // Public IP Addresses
  getAllPublicIpAddresses,
  getPublicIpAddressById,
  createPublicIpAddress,
  updatePublicIpAddress,
  deletePublicIpAddress,
  
  // AS Numbers
  getAllAsNumbers,
  getAsNumberById,
  createAsNumber,
  updateAsNumber,
  deleteAsNumber,
  
  // Site to Site VPN
  getAllSiteToSiteVpn,
  getSiteToSiteVpnById,
  createSiteToSiteVpn,
  updateSiteToSiteVpn,
  deleteSiteToSiteVpn,
  
  // VPN Users
  getAllVpnUsers,
  getVpnUserById,
  createVpnUser,
  updateVpnUser,
  deleteVpnUser,
  
  // VPN Customer Gateways
  getAllVpnCustomerGateways,
  getVpnCustomerGatewayById,
  createVpnCustomerGateway,
  updateVpnCustomerGateway,
  deleteVpnCustomerGateway,
  
  // Guest VLANs
  getAllGuestVlans,
  getGuestVlanById,
  createGuestVlan,
  updateGuestVlan,
  deleteGuestVlan,
  
  // IPv4 Subnets
  getAllIpv4Subnets,
  getIpv4SubnetById,
  createIpv4Subnet,
  updateIpv4Subnet,
  deleteIpv4Subnet
}; 