export { useAuthStore } from './store/useAuthStore';
export { useAuthSession } from './hooks/useAuthSession';
export { useAuthGateway } from './hooks/useAuthGateway';
export { useCurrentUserId, getCurrentUserId } from './hooks/useCurrentUserId';
export { default as AuthGateway } from './components/organisms/AuthGateway';
export { default as RequireAuth } from './components/organisms/RequireAuth';
export { default as SessionExpiryGuard } from './components/organisms/SessionExpiryGuard';
export { default as RequireAdmin } from './components/organisms/RequireAdmin';
export { default as RequireGuest } from './components/organisms/RequireGuest';
export { default as AuthGatewayHeader } from './components/molecules/AuthGatewayHeader';
export { default as AuthGatewayModeTabs } from './components/molecules/AuthGatewayModeTabs';
export { default as AuthGatewayForm } from './components/organisms/AuthGatewayForm';
export { default as AuthConfirmSignUpForm } from './components/organisms/AuthConfirmSignUpForm';
export { authService } from './services/authService';
export {
  hasRole,
  hasAnyRole,
  isAdminSession,
  isManagerSession,
  canCreateGroups,
  createForbiddenError,
} from './lib/adminAccess';
export { ADMIN_ROLE, MANAGER_ROLE, GENERAL_ROLE } from './types/auth';
export type { AuthGatewayPort, AuthGatewayResult } from './services/AuthGatewayPort';
export type {
  AuthActionResult,
  AuthFieldErrors,
  AuthProvider,
  AuthRole,
  AuthSession,
  AuthUser,
  ConfirmSignUpPayload,
  CredentialsPayload,
  RegisterPayload,
} from './types/auth';
