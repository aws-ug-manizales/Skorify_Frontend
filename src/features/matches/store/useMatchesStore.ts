import { create } from 'zustand';
import { MOCK_MATCHES, MOCK_TEAMS, MOCK_TOURNAMENTS } from './mockData';
import {
  type MatchRecord,
  type MatchTeam,
  type MatchTournament,
  type UpdateMatchResultInput,
} from '../types/match';

interface MatchesState {
  teams: MatchTeam[];
  tournaments: MatchTournament[];
  matches: MatchRecord[];
  updateMatchResult: (input: UpdateMatchResultInput) => MatchRecord | null;
}

export const useMatchesStore = create<MatchesState>((set) => ({
  teams: MOCK_TEAMS,
  tournaments: MOCK_TOURNAMENTS,
  matches: MOCK_MATCHES,
  updateMatchResult: ({ matchId, homeGoals, awayGoals, status }) => {
    let updatedMatch: MatchRecord | null = null;

    set((state) => ({
      matches: state.matches.map((match) => {
        if (match.id !== matchId) {
          return match;
        }

        updatedMatch = {
          ...match,
          home_goals: homeGoals,
          away_goals: awayGoals,
          status,
          updated_at: new Date().toISOString(),
        };

        return updatedMatch;
      }),
    }));

    return updatedMatch;
  },
}));
