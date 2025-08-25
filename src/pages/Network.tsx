import React, { useState, useEffect } from 'react';
import { apiService } from '../services/api';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`network-tabpanel-${index}`}
      aria-labelledby={`network-tab-${index}`}
      {...other}
      className={value === index ? 'block' : 'hidden'}
    >
      {value === index && children}
    </div>
  );
}

const Network = () => {
  const [tabValue, setTabValue] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Mock data - À remplacer par de vrais appels API
  const [guestNetworks] = useState([
    { id: 1, name: 'default-network', type: 'Isolated', cidr: '192.168.1.0/24', gateway: '192.168.1.1', state: 'Implemented', zone: 'zone1' },
    { id: 2, name: 'web-tier-network', type: 'Isolated', cidr: '10.0.1.0/24', gateway: '10.0.1.1', state: 'Implemented', zone: 'zone1' },
    { id: 3, name: 'db-tier-network', type: 'Isolated', cidr: '10.0.2.0/24', gateway: '10.0.2.1', state: 'Allocated', zone: 'zone2' }
  ]);

  const [publicIPs] = useState([
    { id: 1, ip: '203.0.113.10', state: 'Allocated', vm: 'web-server-01', zone: 'zone1', source: 'Static' },
    { id: 2, ip: '203.0.113.11', state: 'Free', vm: null, zone: 'zone1', source: 'Static' },
    { id: 3, ip: '203.0.113.12', state: 'Allocated', vm: 'api-server-01', zone: 'zone2', source: 'Dynamic' }
  ]);

  const [vpcs] = useState([
    { id: 1, name: 'production-vpc', cidr: '10.0.0.0/16', state: 'Enabled', zone: 'zone1', networks: 3 },
    { id: 2, name: 'development-vpc', cidr: '172.16.0.0/16', state: 'Enabled', zone: 'zone2', networks: 2 }
  ]);

  const [securityGroups] = useState([
    { id: 1, name: 'web-sg', description: 'Security group for web servers', rules: 3, vms: 5 },
    { id: 2, name: 'db-sg', description: 'Security group for database servers', rules: 2, vms: 2 },
    { id: 3, name: 'admin-sg', description: 'Security group for admin access', rules: 5, vms: 1 }
  ]);

  const [loadBalancers] = useState([
    { id: 1, name: 'web-lb', state: 'Active', algorithm: 'Round Robin', members: 3, publicIP: '203.0.113.10' },
    { id: 2, name: 'api-lb', state: 'Active', algorithm: 'Least Connections', members: 2, publicIP: '203.0.113.12' }
  ]);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        // Simulation d'appel API
        await new Promise(resolve => setTimeout(resolve, 1000));
        setLoading(false);
      } catch (err) {
        setError('Erreur lors du chargement des données réseau');
      setLoading(false);
    }
  };

    loadData();
  }, []);

  const handleTabChange = (newValue: number) => {
    setTabValue(newValue);
  };

  const getStateColor = (state: string) => {
    switch (state.toLowerCase()) {
      case 'implemented':
      case 'enabled':
      case 'active':
      case 'allocated':
        return 'bg-emerald-500';
      case 'free':
        return 'bg-blue-500';
      case 'error':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getNetworkTypeColor = (type: string) => {
    switch (type) {
      case 'Isolated':
        return 'bg-purple-500';
      case 'Shared':
        return 'bg-green-500';
      case 'L2':
        return 'bg-yellow-500';
      default:
        return 'bg-gray-500';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500"></div>
        <p className="ml-4 text-lg text-slate-600">Chargement des données réseau...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        {error}
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* En-tête */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-slate-700 dark:text-white mb-2">Network</h1>
        <p className="text-slate-600 dark:text-slate-400">Gérez vos réseaux, adresses IP et configurations réseau</p>
      </div>
      
      {/* Onglets - Style Argon */}
      <div className="border-black/12.5 dark:bg-slate-850 dark:shadow-dark-xl shadow-xl relative z-20 flex min-w-0 flex-col break-words rounded-2xl border-0 border-solid bg-white bg-clip-border mb-6">
        <div className="border-black/12.5 mb-0 rounded-t-2xl border-b-0 border-solid p-6 pt-4 pb-0">
          <div className="flex flex-wrap">
            {[
              { label: 'Guest Networks', icon: 'fas fa-network-wired', index: 0 },
              { label: 'VPC', icon: 'fas fa-cloud', index: 1 },
              { label: 'Security Groups', icon: 'fas fa-shield-alt', index: 2 },
              { label: 'Public IP Addresses', icon: 'fas fa-globe', index: 3 },
              { label: 'Load Balancers', icon: 'fas fa-balance-scale', index: 4 }
            ].map((tab) => (
              <button
                key={tab.index}
                onClick={() => handleTabChange(tab.index)}
                className={`px-4 py-2 mx-1 rounded-lg transition-colors duration-200 flex items-center ${
                  tabValue === tab.index
                    ? 'bg-red-600 text-white shadow-lg'
                    : 'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-700'
                }`}
              >
                <i className={`${tab.icon} mr-2`}></i>
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Contenu des onglets */}

      {/* Guest Networks */}
      <TabPanel value={tabValue} index={0}>
        <div className="border-black/12.5 dark:bg-slate-850 dark:shadow-dark-xl shadow-xl relative z-20 flex min-w-0 flex-col break-words rounded-2xl border-0 border-solid bg-white bg-clip-border">
          <div className="border-black/12.5 mb-0 rounded-t-2xl border-b-0 border-solid p-6 pt-4 pb-0">
            <div className="flex justify-between items-center">
              <h6 className="capitalize dark:text-white">Guest Networks ({guestNetworks.length})</h6>
              <button className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-200">
                <i className="fas fa-plus mr-2"></i>
            Nouveau Réseau
              </button>
            </div>
          </div>
          <div className="flex-auto p-4">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-700">
                    <th className="text-left py-3 px-4 font-semibold text-slate-600 dark:text-white">Nom</th>
                    <th className="text-left py-3 px-4 font-semibold text-slate-600 dark:text-white">Type</th>
                    <th className="text-left py-3 px-4 font-semibold text-slate-600 dark:text-white">CIDR</th>
                    <th className="text-left py-3 px-4 font-semibold text-slate-600 dark:text-white">Passerelle</th>
                    <th className="text-left py-3 px-4 font-semibold text-slate-600 dark:text-white">État</th>
                    <th className="text-left py-3 px-4 font-semibold text-slate-600 dark:text-white">Zone</th>
                    <th className="text-left py-3 px-4 font-semibold text-slate-600 dark:text-white">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {guestNetworks.map((network) => (
                    <tr key={network.id} className="border-b border-slate-100 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800">
                      <td className="py-3 px-4 text-slate-700 dark:text-white font-medium">{network.name}</td>
                      <td className="py-3 px-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getNetworkTypeColor(network.type)} text-white`}>
                          {network.type}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-600 dark:text-slate-400 font-mono">{network.cidr}</td>
                      <td className="py-3 px-4 text-slate-600 dark:text-slate-400 font-mono">{network.gateway}</td>
                      <td className="py-3 px-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStateColor(network.state)} text-white`}>
                          {network.state}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-600 dark:text-slate-400">{network.zone}</td>
                      <td className="py-3 px-4">
                        <div className="flex space-x-2">
                          <button className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
                            <i className="fas fa-eye"></i>
                          </button>
                          <button className="text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300">
                            <i className="fas fa-edit"></i>
                          </button>
                          <button className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300">
                            <i className="fas fa-trash"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </TabPanel>

      {/* VPC */}
      <TabPanel value={tabValue} index={1}>
        <div className="border-black/12.5 dark:bg-slate-850 dark:shadow-dark-xl shadow-xl relative z-20 flex min-w-0 flex-col break-words rounded-2xl border-0 border-solid bg-white bg-clip-border">
          <div className="border-black/12.5 mb-0 rounded-t-2xl border-b-0 border-solid p-6 pt-4 pb-0">
            <div className="flex justify-between items-center">
              <h6 className="capitalize dark:text-white">Virtual Private Clouds ({vpcs.length})</h6>
              <button className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-200">
                <i className="fas fa-plus mr-2"></i>
            Nouveau VPC
              </button>
            </div>
          </div>
          <div className="flex-auto p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {vpcs.map((vpc) => (
                <div key={vpc.id} className="bg-white dark:bg-slate-800 rounded-lg shadow p-6 border border-slate-200 dark:border-slate-700">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-lg font-semibold text-slate-700 dark:text-white">{vpc.name}</h4>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStateColor(vpc.state)} text-white`}>
                      {vpc.state}
                    </span>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-slate-600 dark:text-slate-400">CIDR:</span>
                      <span className="text-slate-700 dark:text-white font-medium font-mono">{vpc.cidr}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600 dark:text-slate-400">Zone:</span>
                      <span className="text-slate-700 dark:text-white font-medium">{vpc.zone}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600 dark:text-slate-400">Réseaux:</span>
                      <span className="text-slate-700 dark:text-white font-medium">{vpc.networks}</span>
                    </div>
                  </div>
                  <div className="mt-4 flex space-x-2">
                    <button className="flex-1 bg-blue-500 hover:bg-blue-700 text-white text-sm py-2 px-3 rounded">
                      <i className="fas fa-eye mr-1"></i>
                      Voir
                    </button>
                    <button className="flex-1 bg-green-500 hover:bg-green-700 text-white text-sm py-2 px-3 rounded">
                      <i className="fas fa-edit mr-1"></i>
                      Modifier
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </TabPanel>

      {/* Security Groups */}
      <TabPanel value={tabValue} index={2}>
        <div className="border-black/12.5 dark:bg-slate-850 dark:shadow-dark-xl shadow-xl relative z-20 flex min-w-0 flex-col break-words rounded-2xl border-0 border-solid bg-white bg-clip-border">
          <div className="border-black/12.5 mb-0 rounded-t-2xl border-b-0 border-solid p-6 pt-4 pb-0">
            <div className="flex justify-between items-center">
              <h6 className="capitalize dark:text-white">Security Groups ({securityGroups.length})</h6>
              <button className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-200">
                <i className="fas fa-plus mr-2"></i>
                Nouveau Groupe
              </button>
            </div>
          </div>
          <div className="flex-auto p-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {securityGroups.map((sg) => (
                <div key={sg.id} className="bg-white dark:bg-slate-800 rounded-lg shadow p-6 border border-slate-200 dark:border-slate-700">
                  <h4 className="text-lg font-semibold text-slate-700 dark:text-white mb-2">{sg.name}</h4>
                  <p className="text-slate-600 dark:text-slate-400 mb-4">{sg.description}</p>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-slate-700 dark:text-white">{sg.rules}</div>
                      <div className="text-sm text-slate-600 dark:text-slate-400">Règles</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-slate-700 dark:text-white">{sg.vms}</div>
                      <div className="text-sm text-slate-600 dark:text-slate-400">VMs</div>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button className="flex-1 bg-blue-500 hover:bg-blue-700 text-white text-sm py-2 px-3 rounded">
                      <i className="fas fa-list mr-1"></i>
                      Règles
                    </button>
                    <button className="flex-1 bg-green-500 hover:bg-green-700 text-white text-sm py-2 px-3 rounded">
                      <i className="fas fa-edit mr-1"></i>
                      Modifier
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </TabPanel>

      {/* Public IP Addresses */}
      <TabPanel value={tabValue} index={3}>
        <div className="border-black/12.5 dark:bg-slate-850 dark:shadow-dark-xl shadow-xl relative z-20 flex min-w-0 flex-col break-words rounded-2xl border-0 border-solid bg-white bg-clip-border">
          <div className="border-black/12.5 mb-0 rounded-t-2xl border-b-0 border-solid p-6 pt-4 pb-0">
            <div className="flex justify-between items-center">
              <h6 className="capitalize dark:text-white">Public IP Addresses ({publicIPs.length})</h6>
              <button className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-200">
                <i className="fas fa-plus mr-2"></i>
                Acquérir IP
              </button>
            </div>
          </div>
          <div className="flex-auto p-4">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-700">
                    <th className="text-left py-3 px-4 font-semibold text-slate-600 dark:text-white">Adresse IP</th>
                    <th className="text-left py-3 px-4 font-semibold text-slate-600 dark:text-white">État</th>
                    <th className="text-left py-3 px-4 font-semibold text-slate-600 dark:text-white">VM associée</th>
                    <th className="text-left py-3 px-4 font-semibold text-slate-600 dark:text-white">Zone</th>
                    <th className="text-left py-3 px-4 font-semibold text-slate-600 dark:text-white">Source</th>
                    <th className="text-left py-3 px-4 font-semibold text-slate-600 dark:text-white">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {publicIPs.map((ip) => (
                    <tr key={ip.id} className="border-b border-slate-100 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800">
                      <td className="py-3 px-4 text-slate-700 dark:text-white font-medium font-mono">{ip.ip}</td>
                      <td className="py-3 px-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStateColor(ip.state)} text-white`}>
                          {ip.state}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-600 dark:text-slate-400">{ip.vm || 'Non assignée'}</td>
                      <td className="py-3 px-4 text-slate-600 dark:text-slate-400">{ip.zone}</td>
                      <td className="py-3 px-4 text-slate-600 dark:text-slate-400">{ip.source}</td>
                      <td className="py-3 px-4">
                        <div className="flex space-x-2">
                          {ip.state === 'Free' ? (
                            <button className="text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300">
                              <i className="fas fa-link"></i>
                            </button>
                          ) : (
                            <button className="text-yellow-600 hover:text-yellow-800 dark:text-yellow-400 dark:hover:text-yellow-300">
                              <i className="fas fa-unlink"></i>
                            </button>
                          )}
                          <button className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
                            <i className="fas fa-cog"></i>
                          </button>
                          <button className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300">
                            <i className="fas fa-times"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </TabPanel>

      {/* Load Balancers */}
      <TabPanel value={tabValue} index={4}>
        <div className="border-black/12.5 dark:bg-slate-850 dark:shadow-dark-xl shadow-xl relative z-20 flex min-w-0 flex-col break-words rounded-2xl border-0 border-solid bg-white bg-clip-border">
          <div className="border-black/12.5 mb-0 rounded-t-2xl border-b-0 border-solid p-6 pt-4 pb-0">
            <div className="flex justify-between items-center">
              <h6 className="capitalize dark:text-white">Load Balancers ({loadBalancers.length})</h6>
              <button className="bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-200">
                <i className="fas fa-plus mr-2"></i>
            Nouveau Load Balancer
              </button>
            </div>
          </div>
          <div className="flex-auto p-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {loadBalancers.map((lb) => (
                <div key={lb.id} className="bg-white dark:bg-slate-800 rounded-lg shadow p-6 border border-slate-200 dark:border-slate-700">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-lg font-semibold text-slate-700 dark:text-white">{lb.name}</h4>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStateColor(lb.state)} text-white`}>
                      {lb.state}
                    </span>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-slate-600 dark:text-slate-400">IP Publique:</span>
                      <span className="text-slate-700 dark:text-white font-medium font-mono">{lb.publicIP}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600 dark:text-slate-400">Algorithme:</span>
                      <span className="text-slate-700 dark:text-white font-medium">{lb.algorithm}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600 dark:text-slate-400">Membres:</span>
                      <span className="text-slate-700 dark:text-white font-medium">{lb.members}</span>
                    </div>
                  </div>
                  <div className="mt-4 flex space-x-2">
                    <button className="flex-1 bg-blue-500 hover:bg-blue-700 text-white text-sm py-2 px-3 rounded">
                      <i className="fas fa-eye mr-1"></i>
                      Voir
                    </button>
                    <button className="flex-1 bg-green-500 hover:bg-green-700 text-white text-sm py-2 px-3 rounded">
                      <i className="fas fa-edit mr-1"></i>
                      Configurer
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </TabPanel>
    </div>
  );
};

export default Network; 