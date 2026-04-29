export interface Match {
  id: string;
  homeTeam: string;
  awayTeam: string;
  homeTeamFlag: string; // URL de la bandera
  awayTeamFlag: string;
  date: string; // ISO String para poder comparar fechas
  isUserPredicted: boolean;
}
