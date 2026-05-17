import { RequireAdmin } from '@features/auth';
import { AdminComingSoon } from '@features/admin';

const AdminPage = () => (
  <RequireAdmin>
    <AdminComingSoon />
  </RequireAdmin>
);

export default AdminPage;
