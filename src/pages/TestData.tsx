import React from 'react';
import { useLocation, Link } from 'react-router-dom';

const TestData: React.FC = () => {
  const location = useLocation();

  // Liste des routes de base à tester
  const testRoutes = [
    { path: '/dashboard', name: 'Dashboard Principal' },
    { path: '/compute', name: 'Compute Principal' },
    { path: '/storage', name: 'Storage Principal' },
  ];

  return (
    <div className="w-full p-6">
      {/* En-tête de test */}
      <div className="mb-8 p-6 bg-blue-100 border border-blue-400 text-blue-700 rounded-lg">
        <h1 className="text-3xl font-bold mb-4">🧪 Test de Routage</h1>
        <p className="text-lg">Route actuelle : <code className="bg-blue-200 px-2 py-1 rounded">{location.pathname}</code></p>
        <p className="mt-2">Test des routes principales de l'application</p>
      </div>

      {/* Grille des routes de test */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {testRoutes.map((route) => (
          <div key={route.path} className="p-6 bg-white rounded-lg shadow-md border border-gray-200">
            <h3 className="text-lg font-semibold mb-2 text-gray-800">{route.name}</h3>
            <p className="text-sm text-gray-600 mb-4">Route : <code className="bg-gray-100 px-2 py-1 rounded text-xs">{route.path}</code></p>
            
            <Link
              to={route.path}
              className="inline-block px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors text-sm"
            >
              Tester la Route
            </Link>
          </div>
        ))}
      </div>

      {/* Statut */}
      <div className="mt-8 p-6 bg-green-100 border border-green-400 text-green-800 rounded-lg">
        <h3 className="text-lg font-semibold mb-2">✅ Système de Routage</h3>
        <p>Routes configurées : {testRoutes.length}</p>
        <p>Layout principal : MainLayout.tsx</p>
        <p>Navigation : React Router v6</p>
      </div>
    </div>
  );
};

export default TestData; 