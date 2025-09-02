// material-ui
import useMediaQuery from '@mui/material/useMediaQuery';
import IconButton from '@mui/material/IconButton';
import Link from '@mui/material/Link';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

// project imports
import Search from './Search';
import Profile from './Profile';
import Notification from './Notification';
// import Settings from './Settings';
import LanguageSelector from './LanguageSelector';
import MobileSection from './MobileSection';

// project import
import { GithubOutlined } from '@ant-design/icons';

// context
import { useAuth } from 'contexts/AuthContext';

// ==============================|| HEADER - CONTENT ||============================== //

export default function HeaderContent() {
  const downLG = useMediaQuery((theme) => theme.breakpoints.down('lg'));
  const { isUser } = useAuth();

  return (
    <>
      {/* Barre de recherche - seulement pour les non-utilisateurs */}
      {!isUser() && !downLG && <Search />}
      {!isUser() && downLG && <Box sx={{ width: '100%', ml: 1 }} />}
      
      <IconButton
        component={Link}
        href="https://github.com/codedthemes/mantis-free-react-admin-template"
        target="_blank"
        disableRipple
        color="secondary"
        title="Download Free Version"
        sx={{ color: 'text.primary', bgcolor: 'grey.100' }}
      >
        <GithubOutlined />
      </IconButton>

      <Notification />
      <LanguageSelector />
      {/* <Settings /> */}
      <div style={{ 
        display: 'inline-block',
        marginLeft: '6px',
        padding: '8px',
        background: 'red', 
        color: 'white', 
        borderRadius: '4px',
        fontSize: '12px',
        fontWeight: 'bold'
      }}>
        TEST INLINE
      </div>
      {/* Bouton profil - seulement pour les non-utilisateurs */}
      {!isUser() && !downLG && <Profile />}
      {!isUser() && downLG && <MobileSection />}
    </>
  );
}
