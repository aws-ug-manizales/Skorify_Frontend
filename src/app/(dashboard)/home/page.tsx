'use client';

import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import { DashboardHome, UserDashboardHome } from '@features/dashboard';
import { useAuthSession } from '@features/auth';

const DashboardHomePage = () => {
  const { hydrated, isAdmin } = useAuthSession();

  if (!hydrated) {
    return (
      <Box sx={{ minHeight: '100vh', display: 'grid', placeItems: 'center' }}>
        <CircularProgress />
      </Box>
    );
  }

  return isAdmin ? <DashboardHome /> : <UserDashboardHome />;
};

export default DashboardHomePage;
