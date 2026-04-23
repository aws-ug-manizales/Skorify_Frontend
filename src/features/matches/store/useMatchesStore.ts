import { create } from 'zustand';
import { MOCK_MATCHES, MOCK_TEAMS, MOCK_TOURNAMENTS } from './mockData';
import { type MatchRecord, type MatchTeam, type MatchTournament } from '../types/match';

interface MatchesState {
  teams: MatchTeam[];
  tournaments: MatchTournament[];
  matches: MatchRecord[];
}

export const useMatchesStore = create<MatchesState>(() => ({
  teams: MOCK_TEAMS,
  tournaments: MOCK_TOURNAMENTS,
  matches: MOCK_MATCHES,
}));
