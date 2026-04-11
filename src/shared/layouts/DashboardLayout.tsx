import Box from '@mui/material/Box';
import { type ReactNode } from 'react';
import { tokens } from '@lib/theme/theme';
import DashboardNavbar from '@shared/components/organisms/DashboardNavbar';
import DrawerShell from './DrawerShell';
import DashboardBottomNav from './DashboardBottomNav';

const DashboardLayout = ({ children }: { children: ReactNode }) => (
  <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: tokens.background }}>
    <DashboardNavbar />
    <DrawerShell>{children}</DrawerShell>
    <DashboardBottomNav />
  </Box>
);

export default DashboardLayout;
