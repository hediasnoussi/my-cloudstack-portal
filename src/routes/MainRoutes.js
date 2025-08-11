import DashboardClient from '../views/dashboard/DashboardClient';

const MainRoutes = {
  path: '/',
  element: <MainLayout />,
  children: [
    {
      path: 'dashboard-client',
      element: <DashboardClient />
    }
    // ... autres routes
  ]
};

export default MainRoutes;
