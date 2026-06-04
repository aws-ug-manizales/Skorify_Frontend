import { RequireAdmin } from '@features/auth';
<<<<<<< HEAD
import { AdminComingSoon } from '@features/admin';

const AdminPage = () => (
  <RequireAdmin>
    <AdminComingSoon />
=======
import { AdminDashboard } from '@features/admin';

const AdminPage = () => (
  <RequireAdmin>
    <AdminDashboard />
>>>>>>> origin/develop
  </RequireAdmin>
);

export default AdminPage;
