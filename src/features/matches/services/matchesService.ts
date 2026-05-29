import type { ListMatchesParams, MatchesGateway } from './MatchesGateway';
import { ApiMatchesGateway } from './gateways/ApiMatchesGateway';

const gateway: MatchesGateway = new ApiMatchesGateway();

export const matchesService = {
  listMatches: (params?: ListMatchesParams) => gateway.listMatches(params),
};
