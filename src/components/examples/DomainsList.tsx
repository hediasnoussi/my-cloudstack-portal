import React, { useState, useEffect } from 'react';
import { Domain, DomainFilter, ApiListResponse } from '../../types';
import { apiService } from '../../services/api';

interface DomainsListProps {
  filters?: DomainFilter;
  onDomainSelect?: (domain: Domain) => void;
}

const DomainsList: React.FC<DomainsListProps> = ({ filters, onDomainSelect }) => {
  const [domains, setDomains] = useState<Domain[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');

  useEffect(() => {
    const fetchDomains = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const response = await apiService.getDomains({
          ...filters,
          search: searchTerm || undefined
        });
        setDomains(response.data.data);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Erreur lors du chargement des domaines');
      } finally {
        setLoading(false);
      }
    };

    fetchDomains();
  }, [filters, searchTerm]);

  const handleDomainClick = (domain: Domain) => {
    if (onDomainSelect) {
      onDomainSelect(domain);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-gray-600">Chargement des domaines...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-md p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">Erreur</h3>
            <div className="mt-2 text-sm text-red-700">{error}</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Barre de recherche */}
      <div className="relative">
        <input
          type="text"
          placeholder="Rechercher un domaine..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
          <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>

      {/* Liste des domaines */}
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {domains.length === 0 ? (
            <li className="px-6 py-4 text-center text-gray-500">
              Aucun domaine trouvé
            </li>
          ) : (
            domains.map((domain: Domain) => (
              <li key={domain.id} className="px-6 py-4 hover:bg-gray-50 cursor-pointer" onClick={() => handleDomainClick(domain)}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10">
                      <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                        <svg className="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                      </div>
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">{domain.name}</div>
                      <div className="text-sm text-gray-500">ID: {domain.id}</div>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="text-sm text-gray-500">
                      Créé le {new Date(domain.created_at).toLocaleDateString('fr-FR')}
                    </div>
                    <svg className="ml-2 h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
              </li>
            ))
          )}
        </ul>
      </div>

      {/* Statistiques */}
      {domains.length > 0 && (
        <div className="bg-gray-50 px-4 py-3 rounded-md">
          <p className="text-sm text-gray-600">
            {domains.length} domaine{domains.length > 1 ? 's' : ''} trouvé{domains.length > 1 ? 's' : ''}
          </p>
        </div>
      )}
    </div>
  );
};

export default DomainsList; 