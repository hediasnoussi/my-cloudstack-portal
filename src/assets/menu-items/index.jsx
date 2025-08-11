// project import
import dashboard from './dashboard';
import pages from './page';
import utilities from './utilities';
import support from './support';
import { IconDashboard } from '@tabler/icons'; // ou ton fichier d'icônes personnalisées

// ==============================|| MENU ITEMS ||============================== //

const menuItems = {
  items: [
    dashboard,
    pages,
    utilities,
    support,
    {
      id: 'client-dashboard',
      title: 'Client Dashboard',
      type: 'item',
      url: '/dashboard-client',
      icon: IconDashboard, // ou icons.IconDashboard si tu importes un objet `icons`
      breadcrumbs: false
    }
  ]
};

export default menuItems;
