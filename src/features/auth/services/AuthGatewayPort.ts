import type {
  AuthActionResult,
  AuthSession,
  CredentialsPayload,
  RegisterPayload,
  StoredUser,
} from '../types/auth';

export type AuthGatewayResult = AuthActionResult & {
  session?: AuthSession;
  users?: StoredUser[];
};

export interface AuthGatewayState {
  users: StoredUser[];
}

export interface AuthGatewayPort {
  registerWithEmail(payload: RegisterPayload, state: AuthGatewayState): AuthGatewayResult;
  loginWithEmail(payload: CredentialsPayload, state: AuthGatewayState): AuthGatewayResult;
  loginWithGoogle(state: AuthGatewayState): AuthGatewayResult;
}
