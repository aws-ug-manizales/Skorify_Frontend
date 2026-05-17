import { UsersAdmin } from '@features/users';
import { RequireAdmin } from '@features/auth';

const UsersAdminPage = () => (
  <RequireAdmin>
    <UsersAdmin />
  </RequireAdmin>
);

export default UsersAdminPage;
