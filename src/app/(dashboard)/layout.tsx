import DashboardLayout from '@shared/layouts/DashboardLayout';
import { RequireAuth } from '@features/auth';
import { ReactNode } from 'react';

const Layout = ({ children }: { children: ReactNode }) => (
  <RequireAuth>
    <DashboardLayout>{children}</DashboardLayout>
  </RequireAuth>
);

export default Layout;
