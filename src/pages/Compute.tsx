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
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      {...other}
      className={value === index ? 'block' : 'hidden'}
    >
      {value === index && children}
    </div>
  );
}

const Compute = () => {
  const [tabValue, setTabValue] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Mock data - À remplacer par de vrais appels API
  const [instances] = useState([
    { id: 1, name: 'web-server-01', state: 'Running', internalName: 'i-123456', ipAddress: '192.168.1.10', arch: 'x86_64', host: 'host1.example.com', account: 'admin', zone: 'zone1' },
    { id: 2, name: 'db-server-01', state: 'Stopped', internalName: 'i-789012', ipAddress: '192.168.1.11', arch: 'x86_64', host: 'host2.example.com', account: 'user1', zone: 'zone1' },
    { id: 3, name: 'api-server-01', state: 'Running', internalName: 'i-345678', ipAddress: '192.168.1.12', arch: 'x86_64', host: 'host1.example.com', account: 'admin', zone: 'zone2' }
  ]);

  const [instanceSnapshots] = useState([
    { id: 1, name: 'web-backup-01', vm: 'web-server-01', size: '20GB', created: '2024-01-15', status: 'Ready' },
    { id: 2, name: 'db-backup-01', vm: 'db-server-01', size: '50GB', created: '2024-01-10', status: 'Ready' }
  ]);

  const [instanceGroups] = useState([
    { id: 1, name: 'web-tier', instances: 3, status: 'Active' },
    { id: 2, name: 'db-tier', instances: 2, status: 'Active' }
  ]);

  const [sshKeyPairs] = useState([
    { id: 1, name: 'my-key-pair', fingerprint: 'aa:bb:cc:dd:ee:ff', account: 'admin' },
    { id: 2, name: 'dev-key', fingerprint: 'ff:ee:dd:cc:bb:aa', account: 'user1' }
  ]);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        // Simulation d'appel API
        await new Promise(resolve => setTimeout(resolve, 1000));
        setLoading(false);
      } catch (err) {
        setError('Erreur lors du chargement des données');
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
      case 'running':
        return 'bg-emerald-500';
      case 'stopped':
        return 'bg-red-500';
      case 'starting':
        return 'bg-yellow-500';
      default:
        return 'bg-gray-500';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500"></div>
        <p className="ml-4 text-lg text-slate-600">Chargement des données Compute...</p>
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
        <h1 className="text-3xl font-bold text-slate-700 dark:text-white mb-2">Compute</h1>
        <p className="text-slate-600 dark:text-slate-400">Gérez vos instances, snapshots et ressources de calcul</p>
      </div>
      
      {/* Onglets - Style Argon */}
      <div className="border-black/12.5 dark:bg-slate-850 dark:shadow-dark-xl shadow-xl relative z-20 flex min-w-0 flex-col break-words rounded-2xl border-0 border-solid bg-white bg-clip-border mb-6">
        <div className="border-black/12.5 mb-0 rounded-t-2xl border-b-0 border-solid p-6 pt-4 pb-0">
          <div className="flex flex-wrap">
            {[
              { label: 'Instances', icon: 'fas fa-server', index: 0 },
              { label: 'Instance Snapshots', icon: 'fas fa-camera', index: 1 },
              { label: 'Kubernetes', icon: 'fas fa-cogs', index: 2 },
              { label: 'Autoscaling Groups', icon: 'fas fa-expand-arrows-alt', index: 3 },
              { label: 'Instance Groups', icon: 'fas fa-layer-group', index: 4 },
              { label: 'SSH Key Pairs', icon: 'fas fa-key', index: 5 },
              { label: 'User Data', icon: 'fas fa-user-cog', index: 6 }
            ].map((tab) => (
              <button
                key={tab.index}
                onClick={() => handleTabChange(tab.index)}
                className={`px-4 py-2 mx-1 rounded-lg transition-colors duration-200 flex items-center ${
                  tabValue === tab.index
                    ? 'bg-blue-500 text-white shadow-lg'
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

      {/* Instances */}
      <TabPanel value={tabValue} index={0}>
        <div className="border-black/12.5 dark:bg-slate-850 dark:shadow-dark-xl shadow-xl relative z-20 flex min-w-0 flex-col break-words rounded-2xl border-0 border-solid bg-white bg-clip-border">
          <div className="border-black/12.5 mb-0 rounded-t-2xl border-b-0 border-solid p-6 pt-4 pb-0">
            <div className="flex justify-between items-center">
              <h6 className="capitalize dark:text-white">Instances ({instances.length})</h6>
              <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-200">
                <i className="fas fa-plus mr-2"></i>
            Nouvelle Instance
              </button>
            </div>
          </div>
          <div className="flex-auto p-4">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-700">
                    <th className="text-left py-3 px-4 font-semibold text-slate-600 dark:text-white">Nom</th>
                    <th className="text-left py-3 px-4 font-semibold text-slate-600 dark:text-white">État</th>
                    <th className="text-left py-3 px-4 font-semibold text-slate-600 dark:text-white">Nom interne</th>
                    <th className="text-left py-3 px-4 font-semibold text-slate-600 dark:text-white">Adresse IP</th>
                    <th className="text-left py-3 px-4 font-semibold text-slate-600 dark:text-white">Architecture</th>
                    <th className="text-left py-3 px-4 font-semibold text-slate-600 dark:text-white">Hôte</th>
                    <th className="text-left py-3 px-4 font-semibold text-slate-600 dark:text-white">Compte</th>
                    <th className="text-left py-3 px-4 font-semibold text-slate-600 dark:text-white">Zone</th>
                    <th className="text-left py-3 px-4 font-semibold text-slate-600 dark:text-white">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {instances.map((instance) => (
                    <tr key={instance.id} className="border-b border-slate-100 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800">
                      <td className="py-3 px-4 text-slate-700 dark:text-white font-medium">{instance.name}</td>
                      <td className="py-3 px-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStateColor(instance.state)} text-white`}>
                          {instance.state}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-600 dark:text-slate-400">{instance.internalName}</td>
                      <td className="py-3 px-4 text-slate-600 dark:text-slate-400">{instance.ipAddress}</td>
                      <td className="py-3 px-4 text-slate-600 dark:text-slate-400">{instance.arch}</td>
                      <td className="py-3 px-4 text-slate-600 dark:text-slate-400">{instance.host}</td>
                      <td className="py-3 px-4 text-slate-600 dark:text-slate-400">{instance.account}</td>
                      <td className="py-3 px-4 text-slate-600 dark:text-slate-400">{instance.zone}</td>
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

      {/* Instance Snapshots */}
      <TabPanel value={tabValue} index={1}>
        <div className="border-black/12.5 dark:bg-slate-850 dark:shadow-dark-xl shadow-xl relative z-20 flex min-w-0 flex-col break-words rounded-2xl border-0 border-solid bg-white bg-clip-border">
          <div className="border-black/12.5 mb-0 rounded-t-2xl border-b-0 border-solid p-6 pt-4 pb-0">
            <h6 className="capitalize dark:text-white">Instance Snapshots ({instanceSnapshots.length})</h6>
          </div>
          <div className="flex-auto p-4">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-700">
                    <th className="text-left py-3 px-4 font-semibold text-slate-600 dark:text-white">Nom</th>
                    <th className="text-left py-3 px-4 font-semibold text-slate-600 dark:text-white">VM</th>
                    <th className="text-left py-3 px-4 font-semibold text-slate-600 dark:text-white">Taille</th>
                    <th className="text-left py-3 px-4 font-semibold text-slate-600 dark:text-white">Créé</th>
                    <th className="text-left py-3 px-4 font-semibold text-slate-600 dark:text-white">Statut</th>
                    <th className="text-left py-3 px-4 font-semibold text-slate-600 dark:text-white">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {instanceSnapshots.map((snapshot) => (
                    <tr key={snapshot.id} className="border-b border-slate-100 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800">
                      <td className="py-3 px-4 text-slate-700 dark:text-white font-medium">{snapshot.name}</td>
                      <td className="py-3 px-4 text-slate-600 dark:text-slate-400">{snapshot.vm}</td>
                      <td className="py-3 px-4 text-slate-600 dark:text-slate-400">{snapshot.size}</td>
                      <td className="py-3 px-4 text-slate-600 dark:text-slate-400">{snapshot.created}</td>
                      <td className="py-3 px-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-500 text-white">
                          {snapshot.status}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex space-x-2">
                          <button className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
                            <i className="fas fa-download"></i>
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

      {/* Instance Groups */}
      <TabPanel value={tabValue} index={4}>
        <div className="border-black/12.5 dark:bg-slate-850 dark:shadow-dark-xl shadow-xl relative z-20 flex min-w-0 flex-col break-words rounded-2xl border-0 border-solid bg-white bg-clip-border">
          <div className="border-black/12.5 mb-0 rounded-t-2xl border-b-0 border-solid p-6 pt-4 pb-0">
            <h6 className="capitalize dark:text-white">Instance Groups ({instanceGroups.length})</h6>
          </div>
          <div className="flex-auto p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {instanceGroups.map((group) => (
                <div key={group.id} className="bg-white dark:bg-slate-800 rounded-lg shadow p-6 border border-slate-200 dark:border-slate-700">
                  <h4 className="text-lg font-semibold text-slate-700 dark:text-white mb-2">{group.name}</h4>
                  <p className="text-slate-600 dark:text-slate-400 mb-2">{group.instances} instances</p>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-500 text-white">
                    {group.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </TabPanel>

      {/* SSH Key Pairs */}
      <TabPanel value={tabValue} index={5}>
        <div className="border-black/12.5 dark:bg-slate-850 dark:shadow-dark-xl shadow-xl relative z-20 flex min-w-0 flex-col break-words rounded-2xl border-0 border-solid bg-white bg-clip-border">
          <div className="border-black/12.5 mb-0 rounded-t-2xl border-b-0 border-solid p-6 pt-4 pb-0">
            <h6 className="capitalize dark:text-white">SSH Key Pairs ({sshKeyPairs.length})</h6>
          </div>
          <div className="flex-auto p-4">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-700">
                    <th className="text-left py-3 px-4 font-semibold text-slate-600 dark:text-white">Nom</th>
                    <th className="text-left py-3 px-4 font-semibold text-slate-600 dark:text-white">Empreinte</th>
                    <th className="text-left py-3 px-4 font-semibold text-slate-600 dark:text-white">Compte</th>
                    <th className="text-left py-3 px-4 font-semibold text-slate-600 dark:text-white">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {sshKeyPairs.map((keyPair) => (
                    <tr key={keyPair.id} className="border-b border-slate-100 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800">
                      <td className="py-3 px-4 text-slate-700 dark:text-white font-medium">{keyPair.name}</td>
                      <td className="py-3 px-4 text-slate-600 dark:text-slate-400 font-mono text-sm">{keyPair.fingerprint}</td>
                      <td className="py-3 px-4 text-slate-600 dark:text-slate-400">{keyPair.account}</td>
                      <td className="py-3 px-4">
                        <div className="flex space-x-2">
                          <button className="text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300">
                            <i className="fas fa-download"></i>
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

      {/* Autres onglets - Contenu placeholder */}
      {[2, 3, 6].map((index) => (
        <TabPanel key={index} value={tabValue} index={index}>
          <div className="border-black/12.5 dark:bg-slate-850 dark:shadow-dark-xl shadow-xl relative z-20 flex min-w-0 flex-col break-words rounded-2xl border-0 border-solid bg-white bg-clip-border">
            <div className="border-black/12.5 mb-0 rounded-t-2xl border-b-0 border-solid p-6 pt-4 pb-0">
              <h6 className="capitalize dark:text-white">Fonctionnalité à venir</h6>
            </div>
            <div className="flex-auto p-4">
              <p className="text-slate-600 dark:text-slate-400">Cette section sera développée prochainement.</p>
            </div>
          </div>
        </TabPanel>
      ))}
    </div>
  );
};

export default Compute; 