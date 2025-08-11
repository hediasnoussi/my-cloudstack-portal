import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import { I18nextProvider } from 'react-i18next';
import i18n from './i18n';
import { LanguageProvider } from './contexts/LanguageContext';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import Login from './pages/Login';
import MainLayout from './components/Layout/MainLayout';
import Dashboard from './pages/Dashboard';
import Instances from './pages/Instances';
import CreateInstance from './pages/CreateInstance';
import InstanceSnapshots from './pages/InstanceSnapshots';
import Users from './pages/Users';
import Volumes from './pages/Volumes';
import Projects from './pages/Projects';
import AccountsManagement from './pages/AccountsManagement';
import RolesManagement from './pages/RolesManagement';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1e293b',
    },
    secondary: {
      main: '#64748b',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
  },
});

function App() {
  return (
    <I18nextProvider i18n={i18n}>
      <LanguageProvider>
        <AuthProvider>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <Router>
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/" element={<ProtectedRoute><MainLayout /></ProtectedRoute>}>
                  <Route index element={<Navigate to="/dashboard" replace />} />
                  <Route path="dashboard" element={<Dashboard />} />
                  <Route path="compute/instances" element={<Instances />} />
                  <Route path="create-instance" element={<CreateInstance />} />
                  <Route path="compute/snapshots" element={<InstanceSnapshots />} />
                  <Route path="accounts/users" element={<Users />} />
                  <Route path="storage/volumes" element={<Volumes />} />
                  <Route path="accounts/projects" element={<Projects />} />
                  <Route path="accounts/management" element={<AccountsManagement />} />
                  <Route path="accounts/roles" element={<RolesManagement />} />
                </Route>
              </Routes>
            </Router>
          </ThemeProvider>
        </AuthProvider>
      </LanguageProvider>
    </I18nextProvider>
  );
}

export default App; 