export { default as MatchesHome } from './components/organisms/MatchesHome';
export type { Match, MatchScore, MatchStatus, MatchTeam } from './types';
export { matchesService } from './services/matchesService';

export { useCreateMatch } from './hooks/useCreateMatch';
export { useEditMatch } from './hooks/useEditMatch';
export { useGetMatchById } from './hooks/useGetMatchById';
export { useCalculateMatchScore } from './hooks/useCalculateMatchScore';
