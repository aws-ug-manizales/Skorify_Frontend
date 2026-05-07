import type { ListMatchesParams, MatchesGateway } from './MatchesGateway';
import { ApiMatchesGateway } from './gateways/ApiMatchesGateway';
import { MockMatchesGateway } from './gateways/MockMatchesGateway';

type Source = 'mock' | 'api';

const getSource = (): Source => {
  const raw = process.env.NEXT_PUBLIC_MATCHES_SOURCE;
  return raw === 'api' ? 'api' : 'mock';
};

const getGateway = (): MatchesGateway => {
  const source = getSource();
  return source === 'api' ? new ApiMatchesGateway() : new MockMatchesGateway();
};

export const matchesService = {
  listMatches: (params?: ListMatchesParams) => getGateway().listMatches(params),
};
