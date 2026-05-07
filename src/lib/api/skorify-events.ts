import type { SkorifyEnvelope } from './skorify';

export const isSkorifyEnvelope = <T = unknown>(value: unknown): value is SkorifyEnvelope<T> => {
  if (!value || typeof value !== 'object') return false;
  const candidate = value as { meta?: { code?: unknown } };
  return (
    !!candidate.meta &&
    typeof candidate.meta === 'object' &&
    typeof candidate.meta.code === 'string'
  );
};

export const stripControllerPrefix = (code: string): string => {
  const colon = code.indexOf(':');
  return colon >= 0 ? code.slice(colon + 1) : code;
};

export const SKORIFY_DOMAIN_ERROR_CODES = new Set<string>([
  // user
  'NotGottenUserDomainEvent',
  'NotificationTokenAssignmentFailedDomainEvent',

  // match
  'MatchDoesNotExistDomainEvent',
  'MatchCannotBeBetedDomainEvent',
  'MatchCannotBeEditedDomainEvent',
  'MatchCannotChangeTeamsDomainEvent',
  'MatchCannotBeSavedDomainEvent',

  // tournament
  'EntityNotInstanciableDomainEvent',
  'TournamentNotSavedDomainEvent',
  'NotGottenTournamentDomainEvent',

  // tournament-instance
  'TournamentInstanceWithSameNameDomainEvent',
]);

export const isDomainErrorCode = (bareCode: string): boolean =>
  SKORIFY_DOMAIN_ERROR_CODES.has(bareCode);

export const getSkorifyErrorTranslationKey = (bareCode: string): string =>
  `errors.skorify.${bareCode}`;

export type { SkorifyEnvelope } from './skorify';
