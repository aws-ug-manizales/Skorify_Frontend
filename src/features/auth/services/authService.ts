import type { AuthGatewayPort } from './AuthGatewayPort';
import { CognitoAuthGateway } from './gateways/CognitoAuthGateway';

let cachedGateway: AuthGatewayPort | null = null;

const getGateway = (): AuthGatewayPort => {
  if (!cachedGateway) {
    cachedGateway = new CognitoAuthGateway();
  }
  return cachedGateway;
};

export const authService: AuthGatewayPort = {
  registerWithEmail: (payload) => getGateway().registerWithEmail(payload),
  loginWithEmail: (payload) => getGateway().loginWithEmail(payload),
  confirmSignUp: (payload) => getGateway().confirmSignUp(payload),
  resendConfirmationCode: (email) => getGateway().resendConfirmationCode(email),
  loginWithGoogle: () => getGateway().loginWithGoogle(),
  logout: () => getGateway().logout(),
  restoreSession: () => getGateway().restoreSession(),
<<<<<<< HEAD
=======
  getValidSession: () => getGateway().getValidSession(),
>>>>>>> origin/develop
};
