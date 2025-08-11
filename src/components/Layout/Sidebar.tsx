import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../contexts/AuthContext.jsx';
import RoleBasedAccess from '../RoleBasedAccess.jsx';
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Avatar,
  Divider,
  Toolbar,
  Collapse,
  Chip
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  Domain as DomainIcon,
  People as PeopleIcon,
  AccountBalance as AccountIcon,
  Security as SecurityIcon,
  Storage as ZoneIcon,
  Cloud as ProjectIcon,
  Cloud as CloudIcon,
  Memory as ComputeIcon,
  BugReport as TestIcon,
  ExpandLess,
  ExpandMore,
  Cloud as InstanceIcon,
  CameraAlt as SnapshotIcon,
  Settings as KubernetesIcon,
  ExpandMore as AutoscalingIcon,
  Group as InstanceGroupIcon,
  Key as SshKeyIcon,
  Person as UserDataIcon,
  Storage as StorageIcon,
  NetworkCheck as NetworkIcon,
  Image as ImageIcon,
  Event as EventIcon,
  Add as AddIcon,
  Group as AffinityGroupIcon
} from '@mui/icons-material';
import LogoFocus from '../../assets/LogoFocus.png';

const drawerWidth = 280;
// Match login page dark blue gradient
const SIDEBAR_BG = 'linear-gradient(to bottom right, #1F1540, #070920)';

interface SidebarProps {
  open: boolean;
  onClose?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ open, onClose }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();
  const { isAgent } = useAuth();
  const [expandedMenus, setExpandedMenus] = useState<string[]>(['Compute']);

  // Structure des menus avec sous-menus
  const menuStructure = [
    { 
      text: t('common.dashboard'), 
      icon: <DashboardIcon />, 
      path: '/dashboard',
      subItems: []
    },
    { 
      text: t('common.createNewInstance'), 
      icon: <AddIcon />, 
      path: '/create-instance',
      subItems: []
    },
    {
      text: t('common.compute'),
      icon: <ComputeIcon />,
      path: '/compute',
      subItems: [
        { text: t('common.instances'), icon: <InstanceIcon />, path: '/compute/instances' },
        { text: t('common.instanceSnapshots'), icon: <SnapshotIcon />, path: '/compute/snapshots' },
        // { text: 'Kubernetes', icon: <KubernetesIcon />, path: '/compute/kubernetes' },
        // { text: 'Autoscaling Groups', icon: <AutoscalingIcon />, path: '/compute/autoscaling' },
        { text: t('common.instanceGroups'), icon: <InstanceGroupIcon />, path: '/compute/groups' },
        { text: t('common.sshKeyPairs'), icon: <SshKeyIcon />, path: '/compute/ssh-keys' },
        { text: t('common.userData'), icon: <UserDataIcon />, path: '/compute/user-data' }
      ]
    },
    {
      text: t('common.storage'),
      icon: <StorageIcon />,
      path: '/storage',
      subItems: [
        { text: t('common.volumes'), icon: <StorageIcon />, path: '/storage/volumes' },
        { text: t('common.volumeSnapshots'), icon: <SnapshotIcon />, path: '/storage/snapshots' },
        { text: t('common.backups'), icon: <StorageIcon />, path: '/storage/backups' },
        // { text: 'Buckets', icon: <StorageIcon />, path: '/storage/buckets' },
        // { text: 'Shared FileSystem', icon: <StorageIcon />, path: '/storage/filesystem' }
      ]
    },
    {
      text: t('common.network'),
      icon: <NetworkIcon />,
      path: '/network',
      subItems: [
        { text: t('common.networks'), icon: <NetworkIcon />, path: '/network/networks' },
        { text: t('common.publicIps'), icon: <NetworkIcon />, path: '/network/public-ips' },
        { text: t('common.vpc'), icon: <NetworkIcon />, path: '/network/vpc' },
        { text: t('common.securityGroups'), icon: <NetworkIcon />, path: '/network/security-groups' },
        // { text: 'LoadBalancers', icon: <NetworkIcon />, path: '/network/load-balancers' }
      ]
    },
    {
      text: t('common.images'),
      icon: <ImageIcon />,
      path: '/images',
      subItems: [
        { text: t('common.templates'), icon: <ImageIcon />, path: '/images/templates' },
        { text: t('common.isos'), icon: <ImageIcon />, path: '/images/isos' }
      ]
    },
    {
      text: t('common.events'),
      icon: <EventIcon />,
      path: '/events',
      subItems: [
        { text: t('common.logs'), icon: <EventIcon />, path: '/events/logs' }
      ]
    }
  ];

  const filteredMenuStructure = isAgent() 
    ? menuStructure.filter((item) => ['Dashboard', t('common.dashboard'), t('common.createNewInstance')].includes(item.text))
    : menuStructure;

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  const handleMenuToggle = (menuText: string) => {
    setExpandedMenus((prev) =>
      prev.includes(menuText) ? prev.filter((m) => m !== menuText) : [...prev, menuText]
    );
  };

  const renderMenuItem = (menu: any, level: number = 0) => {
    const hasSubItems = menu.subItems && menu.subItems.length > 0;
    const isExpanded = expandedMenus.includes(menu.text);
    const isActive = location.pathname === menu.path || (hasSubItems && location.pathname.startsWith(menu.path));

    return (
      <Box key={menu.text}>
        <ListItem disablePadding>
          <ListItemButton
            sx={{
              borderRadius: 2,
              mb: 1,
              pl: level * 2 + 2,
              pr: 2,
              py: 1.5,
              backgroundColor: isActive ? 'rgba(255, 255, 255, 0.2)' : 'transparent',
              border: isActive ? '1px solid rgba(255, 255, 255, 0.3)' : '1px solid transparent',
              '&:hover': {
                backgroundColor: isActive ? 'rgba(255, 255, 255, 0.3)' : 'rgba(255, 255, 255, 0.1)',
                border: isActive ? '1px solid rgba(255, 255, 255, 0.5)' : '1px solid rgba(255, 255, 255, 0.2)',
              },
              transition: 'all 0.2s ease-in-out',
            }}
            onClick={() => {
              if (hasSubItems) {
                handleMenuToggle(menu.text);
              } else {
                handleNavigation(menu.path);
              }
            }}
          >
            <ListItemIcon sx={{ 
              color: isActive ? 'white' : 'rgba(255, 255, 255, 0.8)',
              minWidth: 40,
              fontSize: '1.2rem'
            }}>
              {menu.icon}
            </ListItemIcon>
            <ListItemText 
              primary={menu.text}
              sx={{
                '& .MuiListItemText-primary': {
                  color: isActive ? 'white' : 'rgba(255, 255, 255, 0.9)',
                  fontWeight: isActive ? 600 : 500,
                  fontSize: level > 0 ? '0.875rem' : '0.95rem',
                  letterSpacing: '0.5px'
                }
              }}
            />
            {hasSubItems && (
              <Box sx={{ 
                color: isActive ? 'white' : 'rgba(255, 255, 255, 0.8)',
                transition: 'transform 0.2s ease-in-out',
                transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)'
              }}>
                <ExpandMore />
              </Box>
            )}
          </ListItemButton>
        </ListItem>
        
        {hasSubItems && menu.subItems && (
          <Collapse in={isExpanded} timeout="auto" unmountOnExit>
            <List component="div" disablePadding sx={{ pl: 2 }}>
              {menu.subItems.map((subItem: any) => renderMenuItem(subItem, level + 1))}
            </List>
          </Collapse>
        )}
      </Box>
    );
  };

  const drawer = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', background: SIDEBAR_BG }}>
      <Toolbar sx={{ 
        minHeight: '100px !important',
        background: SIDEBAR_BG,
        borderBottom: '1px solid rgba(255, 255, 255, 0.2)'
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
          <img src={LogoFocus} alt="Focus" style={{ width: 300, height: 'auto' }} />
        </Box>
      </Toolbar>
      
      <Box sx={{ 
        p: 2, 
        background: 'rgba(255, 255, 255, 0.05)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
      }}>
        <Chip 
          label={t('sidebar.version')} 
          size="small" 
          sx={{ 
            bgcolor: 'rgba(255, 255, 255, 0.2)', 
            color: 'white',
            fontWeight: 600,
            fontSize: '0.7rem'
          }} 
        />
      </Box>
      
      <Box sx={{ flex: 1, overflow: 'auto', py: 2, background: SIDEBAR_BG }}>
        <List sx={{ px: 2 }}>
          {filteredMenuStructure.map((menu) => renderMenuItem(menu))}
        </List>
      </Box>
      
      <Box sx={{ 
        p: 2, 
        borderTop: '1px solid rgba(255, 255, 255, 0.1)',
        background: SIDEBAR_BG
      }}>
        <Typography variant="caption" sx={{ 
          color: 'rgba(255, 255, 255, 0.7)',
          fontSize: '0.7rem',
          textAlign: 'center',
          display: 'block'
        }}>
          {t('sidebar.copyright')}
        </Typography>
      </Box>
    </Box>
  );

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
          borderRight: '1px solid rgba(255, 255, 255, 0.2)',
          background: SIDEBAR_BG,
          boxShadow: '4px 0 12px rgba(0, 0, 0, 0.2)',
        }
      }}
      open={open}
      onClose={onClose}
    >
      {drawer}
    </Drawer>
  );
};

export default Sidebar; 