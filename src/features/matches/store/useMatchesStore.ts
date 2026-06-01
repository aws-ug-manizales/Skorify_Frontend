import { create } from 'zustand';
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
  setTeams: (teams: MatchTeam[]) => void;
  setTournaments: (tournaments: MatchTournament[]) => void;
  setMatches: (matches: MatchRecord[]) => void;
  updateMatchResult: (input: UpdateMatchResultInput) => MatchRecord | null;
}

export const useMatchesStore = create<MatchesState>((set) => ({
  teams: [],
  tournaments: [],
  matches: [],
  setTeams: (teams) => set({ teams }),
  setTournaments: (tournaments) => set({ tournaments }),
  setMatches: (matches) => set({ matches }),
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
