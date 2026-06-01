import { AuthGateway, RequireGuest } from '@features/auth';

const AuthPage = () => (
  <RequireGuest>
    <AuthGateway />
  </RequireGuest>
);

export default AuthPage;
