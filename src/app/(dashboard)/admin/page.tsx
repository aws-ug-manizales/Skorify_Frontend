import { RequireAdmin } from '@features/auth';
import { AdminDashboard } from '@features/admin';

const AdminPage = () => (
  <RequireAdmin>
    <AdminDashboard />
  </RequireAdmin>
);

export default AdminPage;
