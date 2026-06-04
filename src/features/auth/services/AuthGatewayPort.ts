import type {
  AuthActionResult,
  AuthSession,
  ConfirmSignUpPayload,
  CredentialsPayload,
  RegisterPayload,
} from '../types/auth';

export type AuthGatewayResult = AuthActionResult & {
  session?: AuthSession;
  needsConfirmation?: boolean;
  pendingEmail?: string;
};

export interface AuthGatewayPort {
  registerWithEmail(payload: RegisterPayload): Promise<AuthGatewayResult>;
  loginWithEmail(payload: CredentialsPayload): Promise<AuthGatewayResult>;
  confirmSignUp(payload: ConfirmSignUpPayload): Promise<AuthGatewayResult>;
  resendConfirmationCode(email: string): Promise<AuthGatewayResult>;
  loginWithGoogle(): Promise<AuthGatewayResult>;
  logout(): Promise<void>;
  restoreSession(): Promise<AuthSession | null>;
<<<<<<< HEAD
=======
  getValidSession(): Promise<AuthSession | null>;
>>>>>>> origin/develop
}
