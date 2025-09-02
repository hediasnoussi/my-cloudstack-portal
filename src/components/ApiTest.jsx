import React, { useState, useEffect } from 'react';
import { apiService } from '../services/api';

const ApiTest = () => {
  const [connectionStatus, setConnectionStatus] = useState('testing');
  const [apiData, setApiData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    testApiConnection();
  }, []);

  const testApiConnection = async () => {
    try {
      setConnectionStatus('testing');
      setError(null);
      
      // Test de connexion de base
      const testResponse = await apiService.testConnection();
      console.log('Test connection response:', testResponse.data);
      
      // Test des données globales
      const domainsResponse = await apiService.getDomains();
      const accountsResponse = await apiService.getAccounts();
      const projectsResponse = await apiService.getProjects();
      
      setApiData({
        test: testResponse.data,
        domains: domainsResponse.data,
        accounts: accountsResponse.data,
        projects: projectsResponse.data
      });
      
      setConnectionStatus('success');
    } catch (err) {
      console.error('API Test Error:', err);
      setError(err.message || 'Erreur de connexion à l\'API');
      setConnectionStatus('error');
    }
  };

  const renderStatus = () => {
    switch (connectionStatus) {
      case 'testing':
        return <div style={{ color: 'orange' }}>🔄 Test de connexion en cours...</div>;
      case 'success':
        return <div style={{ color: 'green' }}>✅ Connexion API réussie!</div>;
      case 'error':
        return <div style={{ color: 'red' }}>❌ Erreur de connexion: {error}</div>;
      default:
        return <div>État inconnu</div>;
    }
  };

  const renderData = () => {
    if (!apiData) return null;

    return (
      <div style={{ marginTop: '20px' }}>
        <h3>Données de l'API :</h3>
        
        <div style={{ marginBottom: '20px' }}>
          <h4>Test de connexion :</h4>
          <pre style={{ backgroundColor: '#f5f5f5', padding: '10px', borderRadius: '5px' }}>
            {JSON.stringify(apiData.test, null, 2)}
          </pre>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <h4>Domaines ({apiData.domains?.length || 0}) :</h4>
          <pre style={{ backgroundColor: '#f5f5f5', padding: '10px', borderRadius: '5px' }}>
            {JSON.stringify(apiData.domains, null, 2)}
          </pre>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <h4>Comptes ({apiData.accounts?.length || 0}) :</h4>
          <pre style={{ backgroundColor: '#f5f5f5', padding: '10px', borderRadius: '5px' }}>
            {JSON.stringify(apiData.accounts, null, 2)}
          </pre>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <h4>Projets ({apiData.projects?.length || 0}) :</h4>
          <pre style={{ backgroundColor: '#f5f5f5', padding: '10px', borderRadius: '5px' }}>
            {JSON.stringify(apiData.projects, null, 2)}
          </pre>
        </div>
      </div>
    );
  };

  return (
    <div style={{ 
      padding: '20px', 
      backgroundColor: 'white', 
      borderRadius: '8px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      margin: '20px'
    }}>
      <h2>Test de Connexion API</h2>
      {renderStatus()}
      
      <button 
        onClick={testApiConnection}
        style={{
          marginTop: '10px',
          padding: '10px 20px',
          backgroundColor: '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer'
        }}
      >
        🔄 Retester la connexion
      </button>
      
      {renderData()}
    </div>
  );
};

export default ApiTest; 