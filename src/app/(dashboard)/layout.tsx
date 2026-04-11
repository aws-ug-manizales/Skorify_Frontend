import DashboardLayout from '@shared/layouts/DashboardLayout';
import { ReactNode } from 'react';

const Layout = ({ children }: { children: ReactNode }) => (
  <DashboardLayout>{children}</DashboardLayout>
);

export default Layout;
