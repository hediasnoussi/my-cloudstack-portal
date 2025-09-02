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
      id={`storage-tabpanel-${index}`}
      aria-labelledby={`storage-tab-${index}`}
      {...other}
      className={value === index ? 'block' : 'hidden'}
    >
      {value === index && children}
    </div>
  );
}

const Storage = () => {
  const [tabValue, setTabValue] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Mock data - À remplacer par de vrais appels API
  const [volumes] = useState([
    { id: 1, name: 'data-volume-01', size: '100GB', type: 'ROOT', vm: 'web-server-01', state: 'Ready', zone: 'zone1' },
    { id: 2, name: 'backup-volume-01', size: '200GB', type: 'DATADISK', vm: null, state: 'Allocated', zone: 'zone1' },
    { id: 3, name: 'database-volume-01', size: '500GB', type: 'DATADISK', vm: 'db-server-01', state: 'Ready', zone: 'zone2' }
  ]);

  const [volumeSnapshots] = useState([
    { id: 1, name: 'data-backup-20240115', volume: 'data-volume-01', size: '100GB', created: '2024-01-15', status: 'BackedUp' },
    { id: 2, name: 'database-backup-20240110', volume: 'database-volume-01', size: '500GB', created: '2024-01-10', status: 'BackedUp' }
  ]);

  const [backups] = useState([
    { id: 1, name: 'full-backup-20240115', type: 'Full', size: '1.2TB', created: '2024-01-15', status: 'Completed' },
    { id: 2, name: 'incremental-backup-20240116', type: 'Incremental', size: '50GB', created: '2024-01-16', status: 'Completed' }
  ]);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        // Simulation d'appel API
        await new Promise(resolve => setTimeout(resolve, 1000));
        setLoading(false);
      } catch (err) {
        setError('Erreur lors du chargement des données de stockage');
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
      case 'ready':
      case 'backedup':
      case 'completed':
        return 'bg-emerald-500';
      case 'allocated':
        return 'bg-yellow-500';
      case 'error':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getVolumeTypeColor = (type: string) => {
    switch (type) {
      case 'ROOT':
        return 'bg-blue-500';
      case 'DATADISK':
        return 'bg-purple-500';
      default:
        return 'bg-gray-500';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500"></div>
        <p className="ml-4 text-lg text-slate-600">Chargement des données de stockage...</p>
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
        <h1 className="text-3xl font-bold text-slate-700 dark:text-white mb-2">Storage</h1>
        <p className="text-slate-600 dark:text-slate-400">Gérez vos volumes, snapshots et systèmes de stockage</p>
      </div>
      
      {/* Onglets - Style Argon */}
      <div className="border-black/12.5 dark:bg-slate-850 dark:shadow-dark-xl shadow-xl relative z-20 flex min-w-0 flex-col break-words rounded-2xl border-0 border-solid bg-white bg-clip-border mb-6">
        <div className="border-black/12.5 mb-0 rounded-t-2xl border-b-0 border-solid p-6 pt-4 pb-0">
          <div className="flex flex-wrap">
            {[
              { label: 'Volumes', icon: 'fas fa-hdd', index: 0 },
              { label: 'Volume Snapshots', icon: 'fas fa-clone', index: 1 },
              { label: 'Backups', icon: 'fas fa-shield-alt', index: 2 },
              { label: 'Buckets', icon: 'fas fa-bucket', index: 3 },
              { label: 'Shared FileSystem', icon: 'fas fa-folder-open', index: 4 }
            ].map((tab) => (
              <button
                key={tab.index}
                onClick={() => handleTabChange(tab.index)}
                className={`px-4 py-2 mx-1 rounded-lg transition-colors duration-200 flex items-center ${
                  tabValue === tab.index
                    ? 'bg-orange-500 text-white shadow-lg'
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

      {/* Volumes */}
      <TabPanel value={tabValue} index={0}>
        <div className="border-black/12.5 dark:bg-slate-850 dark:shadow-dark-xl shadow-xl relative z-20 flex min-w-0 flex-col break-words rounded-2xl border-0 border-solid bg-white bg-clip-border">
          <div className="border-black/12.5 mb-0 rounded-t-2xl border-b-0 border-solid p-6 pt-4 pb-0">
            <div className="flex justify-between items-center">
              <h6 className="capitalize dark:text-white">Volumes ({volumes.length})</h6>
              <button className="bg-orange-500 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-200">
                <i className="fas fa-plus mr-2"></i>
            Nouveau Volume
              </button>
            </div>
          </div>
          <div className="flex-auto p-4">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-700">
                    <th className="text-left py-3 px-4 font-semibold text-slate-600 dark:text-white">Nom</th>
                    <th className="text-left py-3 px-4 font-semibold text-slate-600 dark:text-white">Taille</th>
                    <th className="text-left py-3 px-4 font-semibold text-slate-600 dark:text-white">Type</th>
                    <th className="text-left py-3 px-4 font-semibold text-slate-600 dark:text-white">VM attachée</th>
                    <th className="text-left py-3 px-4 font-semibold text-slate-600 dark:text-white">État</th>
                    <th className="text-left py-3 px-4 font-semibold text-slate-600 dark:text-white">Zone</th>
                    <th className="text-left py-3 px-4 font-semibold text-slate-600 dark:text-white">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {volumes.map((volume) => (
                    <tr key={volume.id} className="border-b border-slate-100 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800">
                      <td className="py-3 px-4 text-slate-700 dark:text-white font-medium">{volume.name}</td>
                      <td className="py-3 px-4 text-slate-600 dark:text-slate-400">{volume.size}</td>
                      <td className="py-3 px-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getVolumeTypeColor(volume.type)} text-white`}>
                          {volume.type}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-600 dark:text-slate-400">{volume.vm || 'Non attaché'}</td>
                      <td className="py-3 px-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStateColor(volume.state)} text-white`}>
                          {volume.state}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-600 dark:text-slate-400">{volume.zone}</td>
                      <td className="py-3 px-4">
                        <div className="flex space-x-2">
                          <button className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
                            <i className="fas fa-eye"></i>
                          </button>
                          <button className="text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300">
                            <i className="fas fa-link"></i>
                          </button>
                          <button className="text-purple-600 hover:text-purple-800 dark:text-purple-400 dark:hover:text-purple-300">
                            <i className="fas fa-camera"></i>
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

      {/* Volume Snapshots */}
      <TabPanel value={tabValue} index={1}>
        <div className="border-black/12.5 dark:bg-slate-850 dark:shadow-dark-xl shadow-xl relative z-20 flex min-w-0 flex-col break-words rounded-2xl border-0 border-solid bg-white bg-clip-border">
          <div className="border-black/12.5 mb-0 rounded-t-2xl border-b-0 border-solid p-6 pt-4 pb-0">
            <h6 className="capitalize dark:text-white">Volume Snapshots ({volumeSnapshots.length})</h6>
          </div>
          <div className="flex-auto p-4">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-700">
                    <th className="text-left py-3 px-4 font-semibold text-slate-600 dark:text-white">Nom</th>
                    <th className="text-left py-3 px-4 font-semibold text-slate-600 dark:text-white">Volume source</th>
                    <th className="text-left py-3 px-4 font-semibold text-slate-600 dark:text-white">Taille</th>
                    <th className="text-left py-3 px-4 font-semibold text-slate-600 dark:text-white">Créé</th>
                    <th className="text-left py-3 px-4 font-semibold text-slate-600 dark:text-white">Statut</th>
                    <th className="text-left py-3 px-4 font-semibold text-slate-600 dark:text-white">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {volumeSnapshots.map((snapshot) => (
                    <tr key={snapshot.id} className="border-b border-slate-100 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800">
                      <td className="py-3 px-4 text-slate-700 dark:text-white font-medium">{snapshot.name}</td>
                      <td className="py-3 px-4 text-slate-600 dark:text-slate-400">{snapshot.volume}</td>
                      <td className="py-3 px-4 text-slate-600 dark:text-slate-400">{snapshot.size}</td>
                      <td className="py-3 px-4 text-slate-600 dark:text-slate-400">{snapshot.created}</td>
                      <td className="py-3 px-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStateColor(snapshot.status)} text-white`}>
                          {snapshot.status}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex space-x-2">
                          <button className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
                            <i className="fas fa-copy"></i>
                          </button>
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

      {/* Backups */}
      <TabPanel value={tabValue} index={2}>
        <div className="border-black/12.5 dark:bg-slate-850 dark:shadow-dark-xl shadow-xl relative z-20 flex min-w-0 flex-col break-words rounded-2xl border-0 border-solid bg-white bg-clip-border">
          <div className="border-black/12.5 mb-0 rounded-t-2xl border-b-0 border-solid p-6 pt-4 pb-0">
            <div className="flex justify-between items-center">
              <h6 className="capitalize dark:text-white">Backups ({backups.length})</h6>
              <button className="bg-teal-500 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-200">
                <i className="fas fa-plus mr-2"></i>
                Nouvelle Sauvegarde
              </button>
            </div>
          </div>
          <div className="flex-auto p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {backups.map((backup) => (
                <div key={backup.id} className="bg-white dark:bg-slate-800 rounded-lg shadow p-6 border border-slate-200 dark:border-slate-700">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-lg font-semibold text-slate-700 dark:text-white">{backup.name}</h4>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStateColor(backup.status)} text-white`}>
                      {backup.status}
                    </span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-slate-600 dark:text-slate-400">Type:</span>
                      <span className="text-slate-700 dark:text-white font-medium">{backup.type}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600 dark:text-slate-400">Taille:</span>
                      <span className="text-slate-700 dark:text-white font-medium">{backup.size}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600 dark:text-slate-400">Créé:</span>
                      <span className="text-slate-700 dark:text-white font-medium">{backup.created}</span>
                    </div>
                  </div>
                  <div className="mt-4 flex space-x-2">
                    <button className="flex-1 bg-blue-500 hover:bg-blue-700 text-white text-sm py-2 px-3 rounded">
                      <i className="fas fa-download mr-1"></i>
                      Télécharger
                    </button>
                    <button className="flex-1 bg-red-500 hover:bg-red-700 text-white text-sm py-2 px-3 rounded">
                      <i className="fas fa-trash mr-1"></i>
                      Supprimer
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </TabPanel>

      {/* Autres onglets - Contenu placeholder */}
      {[3, 4].map((index) => (
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

export default Storage; 