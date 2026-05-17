import type { AuthGatewayPort, AuthGatewayResult, AuthGatewayState } from './AuthGatewayPort';
import { MockAuthGateway } from './gateways/MockAuthGateway';
import type { CredentialsPayload, RegisterPayload } from '../types/auth';

const gateway: AuthGatewayPort = new MockAuthGateway();

export const authService = {
  registerWithEmail: (payload: RegisterPayload, state: AuthGatewayState): AuthGatewayResult =>
    gateway.registerWithEmail(payload, state),
  loginWithEmail: (payload: CredentialsPayload, state: AuthGatewayState): AuthGatewayResult =>
    gateway.loginWithEmail(payload, state),
  loginWithGoogle: (state: AuthGatewayState): AuthGatewayResult => gateway.loginWithGoogle(state),
};
