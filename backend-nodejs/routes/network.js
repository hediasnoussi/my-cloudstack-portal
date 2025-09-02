const express = require('express');
const router = express.Router();
const networkController = require('../controllers/networkController');

// ===== VPCS ROUTES =====
router.get('/vpcs', networkController.getAllVpcs);
router.get('/vpcs/:id', networkController.getVpcById);
router.post('/vpcs', networkController.createVpc);
router.put('/vpcs/:id', networkController.updateVpc);
router.delete('/vpcs/:id', networkController.deleteVpc);

// ===== GUEST NETWORKS ROUTES =====
router.get('/guest-networks', networkController.getAllGuestNetworks);
router.get('/guest-networks/:id', networkController.getGuestNetworkById);
router.post('/guest-networks', networkController.createGuestNetwork);
router.put('/guest-networks/:id', networkController.updateGuestNetwork);
router.delete('/guest-networks/:id', networkController.deleteGuestNetwork);

// ===== SECURITY GROUPS ROUTES =====
router.get('/security-groups', networkController.getAllSecurityGroups);
router.get('/security-groups/:id', networkController.getSecurityGroupById);
router.post('/security-groups', networkController.createSecurityGroup);
router.put('/security-groups/:id', networkController.updateSecurityGroup);
router.delete('/security-groups/:id', networkController.deleteSecurityGroup);

// ===== VNF APPLIANCES ROUTES =====
router.get('/vnf-appliances', networkController.getAllVnfAppliances);
router.get('/vnf-appliances/:id', networkController.getVnfApplianceById);
router.post('/vnf-appliances', networkController.createVnfAppliance);
router.put('/vnf-appliances/:id', networkController.updateVnfAppliance);
router.delete('/vnf-appliances/:id', networkController.deleteVnfAppliance);

// ===== PUBLIC IP ADDRESSES ROUTES =====
router.get('/public-ip-addresses', networkController.getAllPublicIpAddresses);
router.get('/public-ip-addresses/:id', networkController.getPublicIpAddressById);
router.post('/public-ip-addresses', networkController.createPublicIpAddress);
router.put('/public-ip-addresses/:id', networkController.updatePublicIpAddress);
router.delete('/public-ip-addresses/:id', networkController.deletePublicIpAddress);

// ===== AS NUMBERS ROUTES =====
router.get('/as-numbers', networkController.getAllAsNumbers);
router.get('/as-numbers/:id', networkController.getAsNumberById);
router.post('/as-numbers', networkController.createAsNumber);
router.put('/as-numbers/:id', networkController.updateAsNumber);
router.delete('/as-numbers/:id', networkController.deleteAsNumber);

// ===== SITE TO SITE VPN ROUTES =====
router.get('/site-to-site-vpn', networkController.getAllSiteToSiteVpn);
router.get('/site-to-site-vpn/:id', networkController.getSiteToSiteVpnById);
router.post('/site-to-site-vpn', networkController.createSiteToSiteVpn);
router.put('/site-to-site-vpn/:id', networkController.updateSiteToSiteVpn);
router.delete('/site-to-site-vpn/:id', networkController.deleteSiteToSiteVpn);

// ===== VPN USERS ROUTES =====
router.get('/vpn-users', networkController.getAllVpnUsers);
router.get('/vpn-users/:id', networkController.getVpnUserById);
router.post('/vpn-users', networkController.createVpnUser);
router.put('/vpn-users/:id', networkController.updateVpnUser);
router.delete('/vpn-users/:id', networkController.deleteVpnUser);

// ===== VPN CUSTOMER GATEWAYS ROUTES =====
router.get('/vpn-customer-gateways', networkController.getAllVpnCustomerGateways);
router.get('/vpn-customer-gateways/:id', networkController.getVpnCustomerGatewayById);
router.post('/vpn-customer-gateways', networkController.createVpnCustomerGateway);
router.put('/vpn-customer-gateways/:id', networkController.updateVpnCustomerGateway);
router.delete('/vpn-customer-gateways/:id', networkController.deleteVpnCustomerGateway);

// ===== GUEST VLANS ROUTES =====
router.get('/guest-vlans', networkController.getAllGuestVlans);
router.get('/guest-vlans/:id', networkController.getGuestVlanById);
router.post('/guest-vlans', networkController.createGuestVlan);
router.put('/guest-vlans/:id', networkController.updateGuestVlan);
router.delete('/guest-vlans/:id', networkController.deleteGuestVlan);

// ===== IPV4 SUBNETS ROUTES =====
router.get('/ipv4-subnets', networkController.getAllIpv4Subnets);
router.get('/ipv4-subnets/:id', networkController.getIpv4SubnetById);
router.post('/ipv4-subnets', networkController.createIpv4Subnet);
router.put('/ipv4-subnets/:id', networkController.updateIpv4Subnet);
router.delete('/ipv4-subnets/:id', networkController.deleteIpv4Subnet);

module.exports = router; 