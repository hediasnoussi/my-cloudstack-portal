import PropTypes from 'prop-types';
// material-ui
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

// context
import { useAuth } from 'contexts/AuthContext';

// assets
import EditOutlined from '@ant-design/icons/EditOutlined';
import ProfileOutlined from '@ant-design/icons/ProfileOutlined';
import UserOutlined from '@ant-design/icons/UserOutlined';
import WalletOutlined from '@ant-design/icons/WalletOutlined';
import MailOutlined from '@ant-design/icons/MailOutlined';
import TeamOutlined from '@ant-design/icons/TeamOutlined';

// ==============================|| HEADER PROFILE - PROFILE TAB ||============================== //

export default function ProfileTab() {
  const { user } = useAuth();

  return (
    <Box>
      {/* Informations utilisateur */}
      <Box sx={{ p: 2, bgcolor: 'grey.50' }}>
        <Typography variant="subtitle2" color="text.secondary" gutterBottom>
          Informations du compte
        </Typography>
        <Box sx={{ mt: 1 }}>
          <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
            <UserOutlined style={{ fontSize: 16, marginRight: 8 }} />
            {user?.username || 'Utilisateur'}
          </Typography>
          <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
            <MailOutlined style={{ fontSize: 16, marginRight: 8 }} />
            {user?.email || 'email@example.com'}
          </Typography>
          <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center' }}>
            <TeamOutlined style={{ fontSize: 16, marginRight: 8 }} />
            {user?.role === 'subprovider' ? 'Fournisseur Secondaire' : 
             user?.role === 'partner' ? 'Partenaire' : 
             user?.role === 'user' ? 'Client Final' : 'Utilisateur'}
          </Typography>
        </Box>
      </Box>

      <Divider />

      {/* Actions du profil */}
      <List component="nav" sx={{ p: 0, '& .MuiListItemIcon-root': { minWidth: 32 } }}>
        <ListItemButton>
          <ListItemIcon>
            <EditOutlined />
          </ListItemIcon>
          <ListItemText primary="Modifier le profil" />
        </ListItemButton>
        <ListItemButton>
          <ListItemIcon>
            <ProfileOutlined />
          </ListItemIcon>
          <ListItemText primary="Voir le profil" />
        </ListItemButton>
        <ListItemButton>
          <ListItemIcon>
            <WalletOutlined />
          </ListItemIcon>
          <ListItemText primary="Facturation" />
        </ListItemButton>
      </List>
    </Box>
  );
}

ProfileTab.propTypes = { handleLogout: PropTypes.func };
