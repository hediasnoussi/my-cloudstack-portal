# Types TypeScript pour CloudStack Portal

Ce dossier contient toutes les interfaces TypeScript pour votre application CloudStack Portal.

## Structure des fichiers

### `index.ts`
Fichier principal qui exporte toutes les interfaces depuis les autres fichiers.

### `database.ts`
Interfaces pour les tables de la base de données :
- `Domain` - Domaines
- `Role` - Rôles utilisateurs
- `Account` - Comptes
- `Zone` - Zones
- `Project` - Projets
- `User` - Utilisateurs
- Types de filtres et réponses de base de données

### `api.ts`
Interfaces pour les réponses et requêtes API :
- Types de base pour les réponses API
- Interfaces d'authentification
- Types pour les requêtes CRUD
- Interfaces pour tous les modules (Compute, Storage, Network)
- Types pour les analytics et coûts

### `ui.ts`
Interfaces pour les composants UI et états de l'interface :
- États de chargement
- Notifications
- Modales
- Formulaires
- Tableaux de données
- Graphiques et visualisations
- Navigation et menus

## Utilisation

### Import des types

```typescript
// Import de tous les types
import * as Types from '../types';

// Import spécifique
import { Domain, User, ApiResponse } from '../types';
```

### Exemple d'utilisation dans un composant

```typescript
import React, { useState, useEffect } from 'react';
import { Domain, ApiListResponse } from '../types';
import { apiService } from '../services/api';

interface DomainsListProps {
  filters?: DomainFilter;
}

const DomainsList: React.FC<DomainsListProps> = ({ filters }) => {
  const [domains, setDomains] = useState<Domain[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDomains = async () => {
      setLoading(true);
      try {
        const response = await apiService.getDomains(filters);
        setDomains(response.data.data);
      } catch (err) {
        setError('Erreur lors du chargement des domaines');
      } finally {
        setLoading(false);
      }
    };

    fetchDomains();
  }, [filters]);

  if (loading) return <div>Chargement...</div>;
  if (error) return <div>Erreur: {error}</div>;

  return (
    <div>
      {domains.map((domain: Domain) => (
        <div key={domain.id}>{domain.name}</div>
      ))}
    </div>
  );
};
```

### Exemple d'utilisation dans un formulaire

```typescript
import React, { useState } from 'react';
import { CreateUserRequest, User } from '../types';
import { apiService } from '../services/api';

const CreateUserForm: React.FC = () => {
  const [formData, setFormData] = useState<CreateUserRequest>({
    username: '',
    email: '',
    password: '',
    role: 'user',
    account_id: undefined
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await apiService.createUser(formData);
      console.log('Utilisateur créé:', response.data.data);
    } catch (error) {
      console.error('Erreur lors de la création:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={formData.username}
        onChange={(e) => setFormData({...formData, username: e.target.value})}
        placeholder="Nom d'utilisateur"
      />
      {/* Autres champs... */}
    </form>
  );
};
```

### Exemple d'utilisation avec des tableaux

```typescript
import React from 'react';
import { TableColumn, User } from '../types';

const UserTable: React.FC<{ users: User[] }> = ({ users }) => {
  const columns: TableColumn<User>[] = [
    {
      key: 'id',
      title: 'ID',
      width: '80px',
      sortable: true
    },
    {
      key: 'username',
      title: 'Nom d\'utilisateur',
      sortable: true
    },
    {
      key: 'email',
      title: 'Email',
      sortable: true
    },
    {
      key: 'role',
      title: 'Rôle',
      render: (value: string) => (
        <span className={`role-${value}`}>{value}</span>
      )
    }
  ];

  return (
    <table>
      <thead>
        <tr>
          {columns.map(column => (
            <th key={String(column.key)}>{column.title}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {users.map(user => (
          <tr key={user.id}>
            {columns.map(column => (
              <td key={String(column.key)}>
                {column.render 
                  ? column.render(user[column.key], user)
                  : String(user[column.key])
                }
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};
```

## Avantages des interfaces TypeScript

1. **Sécurité de type** : Détection d'erreurs à la compilation
2. **Autocomplétion** : Suggestions intelligentes dans l'IDE
3. **Documentation** : Les interfaces servent de documentation
4. **Refactoring** : Changements automatiques dans tout le code
5. **Maintenabilité** : Code plus facile à maintenir et comprendre

## Bonnes pratiques

1. **Utilisez toujours les types** pour les props des composants
2. **Importez spécifiquement** les types dont vous avez besoin
3. **Utilisez les interfaces** pour les objets complexes
4. **Documentez** les types complexes avec des commentaires
5. **Mettez à jour** les interfaces quand l'API change

## Extension des types

Pour ajouter de nouveaux types :

1. Identifiez le bon fichier (`database.ts`, `api.ts`, ou `ui.ts`)
2. Ajoutez l'interface avec des commentaires explicatifs
3. Exportez-la depuis le fichier
4. Mettez à jour `index.ts` si nécessaire
5. Testez l'utilisation dans votre code 