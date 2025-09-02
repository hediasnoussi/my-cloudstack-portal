import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import { I18nextProvider } from 'react-i18next';
import i18n from './i18n';
import { theme } from './themes';
import { LanguageProvider } from './contexts/LanguageContext';
import { AuthProvider } from './contexts/AuthContext.jsx';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import Login from './pages/Login';
import MainLayout from './components/Layout/MainLayout';
import RoleBasedDashboard from './pages/RoleBasedDashboard';
import Compute from './pages/Compute';
import Storage from './pages/Storage';
import Network from './pages/Network';
import Instances from './pages/Instances';
import CreateInstance from './pages/CreateInstance';
import InstanceSnapshots from './pages/InstanceSnapshots';
import InstanceGroups from './pages/InstanceGroups';
import Templates from './pages/Templates';
import ISOs from './pages/ISOs';
import Snapshots from './pages/Snapshots';
import SSHKeyPairs from './pages/SSHKeyPairs';
import ServiceOfferings from './pages/ServiceOfferings';
import DiskOfferings from './pages/DiskOfferings';
import Volumes from './pages/Volumes';
import StoragePools from './pages/StoragePools';
import StorageSnapshots from './pages/StorageSnapshots';
import SharedFilesystem from './pages/SharedFilesystem';
import Buckets from './pages/Buckets';
import Backups from './pages/Backups';
import Networks from './pages/Networks';
import GuestNetworks from './pages/GuestNetworks';
import PublicIPs from './pages/PublicIPs';
import LoadBalancers from './pages/LoadBalancers';
import SecurityGroups from './pages/SecurityGroups';
import VPC from './pages/VPC';
import Users from './pages/Users';
import Accounts from './pages/Accounts';
import Projects from './pages/Projects';
import AccountsManagement from './pages/AccountsManagement';
import RolesManagement from './pages/RolesManagement';
import Roles from './pages/Roles';
import DomainsManagement from './pages/DomainsManagement';
import Images from './pages/Images';
import Kubernetes from './pages/Kubernetes';
import AutoscalingGroups from './pages/AutoscalingGroups';
import AffinityGroups from './pages/AffinityGroups';
import EventLogs from './pages/EventLogs';
import Events from './pages/Events';
import Zones from './pages/Zones';
import ZonesManagement from './pages/ZonesManagement';
import UserData from './pages/UserData';
import AuditTrail from './pages/AuditTrail';
import TestPhase2 from './pages/TestPhase2';
import TestData from './pages/TestData';
import CloudStackTest from './pages/CloudStackTest';
import SubProviderDashboard from './pages/SubProviderDashboard';
import UserDashboard from './pages/UserDashboard';

function App() {
  return (
    <I18nextProvider i18n={i18n}>
      <LanguageProvider>
        <AuthProvider>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <Router>
              <Routes>
                {/* Route de connexion */}
                <Route path="/login" element={<Login />} />
                
                {/* Routes protégées avec MainLayout */}
                <Route path="/" element={<ProtectedRoute><MainLayout /></ProtectedRoute>}>
                  <Route index element={<Navigate to="/dashboard" replace />} />
                  <Route path="dashboard" element={<RoleBasedDashboard />} />
                  <Route path="user-dashboard" element={<ProtectedRoute><UserDashboard /></ProtectedRoute>} />
                  
                  {/* Compute */}
                  <Route path="compute" element={<Compute />} />
                  <Route path="compute/instances" element={<Instances />} />
                  <Route path="compute/create-instance" element={<CreateInstance />} />
                  <Route path="create-instance" element={<CreateInstance />} />
                  <Route path="compute/snapshots" element={<InstanceSnapshots />} />
                  <Route path="compute/groups" element={<InstanceGroups />} />
                  <Route path="compute/templates" element={<Templates />} />
                  <Route path="compute/isos" element={<ISOs />} />
                  <Route path="compute/snapshots-global" element={<Snapshots />} />
                  <Route path="compute/ssh-keys" element={<SSHKeyPairs />} />
                  <Route path="compute/service-offerings" element={<ServiceOfferings />} />
                  <Route path="compute/disk-offerings" element={<DiskOfferings />} />
                  <Route path="compute/user-data" element={<UserData />} />
                  
                  {/* Storage */}
                  <Route path="storage" element={<Storage />} />
                  <Route path="storage/volumes" element={<Volumes />} />
                  <Route path="storage/pools" element={<StoragePools />} />
                  <Route path="storage/snapshots" element={<StorageSnapshots />} />
                  <Route path="storage/filesystem" element={<SharedFilesystem />} />
                  <Route path="storage/buckets" element={<Buckets />} />
                  <Route path="storage/backups" element={<Backups />} />
                  
                  {/* Network */}
                  <Route path="network" element={<Network />} />
                  <Route path="network/networks" element={<Networks />} />
                  <Route path="network/guest-networks" element={<GuestNetworks />} />
                  <Route path="network/public-ips" element={<PublicIPs />} />
                  <Route path="network/load-balancers" element={<LoadBalancers />} />
                  <Route path="network/security-groups" element={<SecurityGroups />} />
                  <Route path="network/vpc" element={<VPC />} />
                  
                  {/* Accounts & Users */}
                  <Route path="accounts" element={<Accounts />} />
                  <Route path="accounts/users" element={<Users />} />
                  <Route path="accounts/projects" element={<Projects />} />
                  <Route path="accounts/management" element={<AccountsManagement />} />
                  <Route path="accounts/roles" element={<RolesManagement />} />
                  <Route path="accounts/domains" element={<DomainsManagement />} />
                  <Route path="roles" element={<Roles />} />
                  
                  {/* Other */}
                  <Route path="images" element={<Images />} />
                  <Route path="images/templates" element={<Templates />} />
                  <Route path="images/isos" element={<ISOs />} />
                  <Route path="kubernetes" element={<Kubernetes />} />
                  <Route path="autoscaling" element={<AutoscalingGroups />} />
                  <Route path="affinity-groups" element={<AffinityGroups />} />
                  <Route path="events" element={<Events />} />
                  <Route path="events/logs" element={<EventLogs />} />
                  <Route path="event-logs" element={<EventLogs />} />
                  <Route path="audit-trail" element={<AuditTrail />} />
                  <Route path="zones" element={<Zones />} />
                  <Route path="zones/management" element={<ZonesManagement />} />
                  <Route path="user-data" element={<UserData />} />
                  <Route path="test-phase2" element={<TestPhase2 />} />
                  <Route path="test-data" element={<TestData />} />
                  <Route path="test-routing" element={<TestData />} />
                  <Route path="cloudstack-test" element={<CloudStackTest />} />
                  <Route path="subprovider-dashboard" element={<SubProviderDashboard />} />
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