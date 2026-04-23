export type MatchStatus = 'scheduled' | 'in_progress' | 'finished';

export type MatchStage = 'group' | 'finals';

export interface MatchTeam {
  id: string;
  name: string;
  short_name: string;
}

export interface MatchTournament {
  id: string;
  name: string;
}

export interface MatchRecord {
  id: string;
  home_team_id: string;
  away_team_id: string;
  tournament_id: string;
  kick_off: string;
  home_goals: number | null;
  away_goals: number | null;
  status: MatchStatus;
  stage: MatchStage;
  venue: string;
  created_at: string;
  updated_at: string;
}
