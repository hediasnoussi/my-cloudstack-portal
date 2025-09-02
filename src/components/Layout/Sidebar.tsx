import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../contexts/AuthContext.jsx';
import LogoFocus from '../../assets/LogoFocus.png';

interface SidebarProps {
  open: boolean;
  onClose?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ open, onClose }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();
  const { isPartner, isUser } = useAuth();
  const [expandedMenus, setExpandedMenus] = useState<string[]>([]);

  // Structure des menus avec sous-menus - Style Argon Dashboard
  const menuStructure = [
    { 
      text: t('common.dashboard'), 
      icon: 'ni ni-tv-2', 
      path: '/dashboard',
      color: 'text-gray-500',
      subItems: []
    },
    { 
      text: t('common.createNewInstance'), 
      icon: 'ni ni-fat-add', 
      path: '/create-instance',
      color: 'text-gray-500',
      subItems: []
    },
    {
      text: t('common.compute'),
      icon: 'ni ni-app',
      color: 'text-gray-500',
      path: '/compute',
      subItems: [
        { text: t('common.instances'), icon: 'fas fa-server', path: '/compute/instances', color: 'text-gray-500' },
        { text: t('common.instanceSnapshots'), icon: 'fas fa-camera', path: '/compute/snapshots', color: 'text-gray-500' },
        { text: t('common.instanceGroups'), icon: 'fas fa-layer-group', path: '/compute/groups', color: 'text-gray-500' },
        { text: t('common.sshKeyPairs'), icon: 'fas fa-key', path: '/compute/ssh-keys', color: 'text-gray-500' },
        { text: t('common.userData'), icon: 'fas fa-user-cog', path: '/compute/user-data', color: 'text-gray-500' }
      ]
    },
    {
      text: t('common.storage'),
      icon: 'ni ni-archive-2',
      color: 'text-gray-500',
      path: '/storage',
      subItems: [
        { text: t('common.volumes'), icon: 'fas fa-hdd', path: '/storage/volumes', color: 'text-gray-500' },
        { text: t('common.volumeSnapshots'), icon: 'fas fa-clone', path: '/compute/snapshots-global', color: 'text-gray-500' },
        { text: t('common.backups'), icon: 'fas fa-shield-alt', path: '/storage/backups', color: 'text-gray-500' }
      ]
    },
    {
      text: t('common.network'),
      icon: 'ni ni-world-2',
      color: 'text-gray-500',
      path: '/network',
      subItems: [
        { text: t('common.networks'), icon: 'fas fa-network-wired', path: '/network/networks', color: 'text-gray-500' },
        { text: t('common.publicIps'), icon: 'fas fa-globe', path: '/network/public-ips', color: 'text-gray-500' },
        { text: t('common.vpc'), icon: 'fas fa-cloud', path: '/network/vpc', color: 'text-gray-500' },
        { text: t('common.securityGroups'), icon: 'fas fa-shield-alt', path: '/network/security-groups', color: 'text-gray-500' }
      ]
    },
    {
      text: t('common.images'),
      icon: 'ni ni-image',
      color: 'text-gray-500',
      path: '/images',
      subItems: [
        { text: t('common.templates'), icon: 'fas fa-copy', path: '/images/templates', color: 'text-gray-500' },
        { text: t('common.isos'), icon: 'fas fa-compact-disc', path: '/images/isos', color: 'text-gray-500' }
      ]
    },
    {
      text: t('common.events'),
      icon: 'ni ni-calendar-grid-58',
      color: 'text-gray-500',
      path: '/events',
      subItems: [
        { text: t('common.logs'), icon: 'fas fa-clipboard-list', path: '/events/logs', color: 'text-gray-500' }
      ]
    }
  ];

  // Filtre les menus selon les permissions
  let filteredMenuStructure;
  
  if (isUser()) {
    // Sidebar simplifiée pour les utilisateurs finaux
    filteredMenuStructure = [
      { 
        text: t('common.dashboard'), 
        icon: 'ni ni-tv-2', 
        path: '/user-dashboard',
        color: 'text-gray-500',
        subItems: []
      }
    ];
  } else if (isPartner && isPartner()) {
    // Sidebar limitée pour les partenaires
    filteredMenuStructure = menuStructure.filter((item) => ['Dashboard', t('common.dashboard'), t('common.createNewInstance')].includes(item.text));
  } else {
    // Sidebar complète pour admin et subprovider
    filteredMenuStructure = menuStructure;
  }

  const renderMenuItem = (menu: any, level: number = 0) => {
    const hasSubItems = menu.subItems && menu.subItems.length > 0;
    const isActive = location.pathname === menu.path || 
                    (hasSubItems && menu.subItems.some((sub: any) => location.pathname === sub.path));
    const isExpanded = expandedMenus.includes(menu.text);

    const handleMenuClick = () => {
      if (hasSubItems) {
        setExpandedMenus(prev => 
          prev.includes(menu.text) 
            ? prev.filter(item => item !== menu.text)
            : [...prev, menu.text]
        );
      } else {
        navigate(menu.path);
        if (onClose) onClose();
      }
    };

    return (
      <li key={menu.text} className={`mt-0.5 w-full ${level > 0 ? 'ml-4' : ''}`}>
        <a
          onClick={handleMenuClick}
          className={`cursor-pointer py-2.7 text-sm ease-nav-brand my-0 mx-2 flex items-center whitespace-nowrap px-4 transition-colors ${
            isActive 
              ? 'bg-blue-500/13 dark:text-white dark:opacity-80 font-semibold text-slate-700 rounded-lg' 
              : 'dark:text-white dark:opacity-80 hover:bg-blue-500/5 rounded-lg'
          }`}
        >
          <div className="mr-2 flex h-8 w-8 items-center justify-center rounded-lg bg-center stroke-0 text-center xl:p-2.5">
            <i className={`relative top-0 text-sm leading-normal ${menu.color} ${menu.icon}`}></i>
          </div>
          <span className="ml-1 duration-300 opacity-100 pointer-events-none ease">{menu.text}</span>
            {hasSubItems && (
            <i className={`ml-auto transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''} fas fa-chevron-down text-xs`}></i>
          )}
        </a>
        
        {hasSubItems && menu.subItems && (
          <div className={`overflow-hidden transition-all duration-300 ${isExpanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
            <ul className="flex flex-col pl-0 mb-0">
              {menu.subItems.map((subItem: any) => renderMenuItem(subItem, level + 1))}
            </ul>
          </div>
        )}
      </li>
    );
  };

  return (
    <aside className="fixed inset-y-0 flex-wrap items-center justify-between block w-full p-0 my-4 overflow-y-auto antialiased transition-transform duration-200 bg-white border-0 shadow-xl dark:shadow-none dark:bg-slate-850 max-w-64 ease-nav-brand z-990 xl:ml-6 rounded-2xl xl:left-0 xl:translate-x-0">
      {/* Logo et en-tête */}
      <div className="h-32 flex items-center justify-center">
        <div className="block py-6 m-0 text-center">
          <img src={LogoFocus} className="inline h-full max-w-full transition-all duration-200 dark:hidden ease-nav-brand max-h-28" alt="main_logo" />
          <img src={LogoFocus} className="hidden h-full max-w-full transition-all duration-200 dark:inline ease-nav-brand max-h-28" alt="main_logo" />
        </div>
      </div>

      <hr className="h-px mt-0 bg-transparent bg-gradient-to-r from-transparent via-black/40 to-transparent dark:bg-gradient-to-r dark:from-transparent dark:via-white dark:to-transparent" />

      {/* Menu principal */}
      <div className="items-center block w-auto max-h-screen overflow-auto h-sidenav grow basis-full">
        <ul className="flex flex-col pl-0 mb-0">
          {filteredMenuStructure.map((menu) => renderMenuItem(menu))}
        </ul>
      </div>

      {/* Bouton de déconnexion */}
      <div className="mx-4 mt-4">
        <button
          onClick={() => {
            // Rediriger vers la page de login
            navigate('/login');
            // Optionnel : nettoyer le localStorage ou autre
            localStorage.removeItem('token');
            localStorage.removeItem('user');
          }}
          className="w-full flex items-center justify-center px-4 py-3 text-sm font-medium text-white bg-red-500 hover:bg-red-600 rounded-lg transition-colors duration-200 ease-in-out"
        >
          <i className="fas fa-sign-out-alt mr-2"></i>
          Déconnexion
        </button>
      </div>

      {/* Footer */}
      <div className="mx-4 mt-auto">
        <div className="block px-8 py-6 text-sm whitespace-nowrap dark:text-white text-slate-700">
          <div className="text-xs text-slate-400 dark:text-slate-500">
            {t('sidebar.version')} v2.0.1
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar; 