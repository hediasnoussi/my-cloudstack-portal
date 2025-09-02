// material-ui
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

// assets
import CommentOutlined from '@ant-design/icons/CommentOutlined';
import LockOutlined from '@ant-design/icons/LockOutlined';
import QuestionCircleOutlined from '@ant-design/icons/QuestionCircleOutlined';
import UserOutlined from '@ant-design/icons/UserOutlined';
import UnorderedListOutlined from '@ant-design/icons/UnorderedListOutlined';
import BellOutlined from '@ant-design/icons/BellOutlined';
import SecurityScanOutlined from '@ant-design/icons/SecurityScanOutlined';

// ==============================|| HEADER PROFILE - SETTING TAB ||============================== //

export default function SettingTab() {
  return (
    <Box>
      {/* Paramètres généraux */}
      <Box sx={{ p: 2, bgcolor: 'grey.50' }}>
        <Typography variant="subtitle2" color="text.secondary" gutterBottom>
          Paramètres généraux
        </Typography>
      </Box>

      <List component="nav" sx={{ p: 0, '& .MuiListItemIcon-root': { minWidth: 32 } }}>
        <ListItemButton>
          <ListItemIcon>
            <UserOutlined />
          </ListItemIcon>
          <ListItemText primary="Paramètres du compte" />
        </ListItemButton>
        <ListItemButton>
          <ListItemIcon>
            <BellOutlined />
          </ListItemIcon>
          <ListItemText primary="Notifications" />
        </ListItemButton>
        <ListItemButton>
          <ListItemIcon>
            <LockOutlined />
          </ListItemIcon>
          <ListItemText primary="Sécurité et confidentialité" />
        </ListItemButton>
        <ListItemButton>
          <ListItemIcon>
            <SecurityScanOutlined />
          </ListItemIcon>
          <ListItemText primary="Permissions" />
        </ListItemButton>
      </List>

      <Divider />

      {/* Support et aide */}
      <Box sx={{ p: 2, bgcolor: 'grey.50' }}>
        <Typography variant="subtitle2" color="text.secondary" gutterBottom>
          Support et aide
        </Typography>
      </Box>

      <List component="nav" sx={{ p: 0, '& .MuiListItemIcon-root': { minWidth: 32 } }}>
        <ListItemButton>
          <ListItemIcon>
            <QuestionCircleOutlined />
          </ListItemIcon>
          <ListItemText primary="Centre d'aide" />
        </ListItemButton>
        <ListItemButton>
          <ListItemIcon>
            <CommentOutlined />
          </ListItemIcon>
          <ListItemText primary="Envoyer un commentaire" />
        </ListItemButton>
        <ListItemButton>
          <ListItemIcon>
            <UnorderedListOutlined />
          </ListItemIcon>
          <ListItemText primary="Historique des activités" />
        </ListItemButton>
      </List>
    </Box>
  );
}
