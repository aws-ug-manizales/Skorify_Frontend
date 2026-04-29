// Definimos la interfaz para que el linter sepa exactamente qué es un "match"
export interface Match {
  id: string;
  homeTeam: string;
  homeTeamFlag: string;
  awayTeam: string;
  awayTeamFlag: string;
  date: string;
  isUserPredicted: boolean;
}

export const MOCK_MATCHES: Match[] = [
  {
    id: 'test-5-min',
    homeTeam: 'Brasil',
    homeTeamFlag: 'https://flagcdn.com/br.svg',
    awayTeam: 'Croacia',
    awayTeamFlag: 'https://flagcdn.com/hr.svg',
    // 5 minutos para bloqueo
    date: new Date(Date.now() + 300000).toISOString(),
    isUserPredicted: false,
  },
  {
    id: 'inaugural-2026',
    homeTeam: 'México',
    homeTeamFlag: 'https://flagcdn.com/mx.svg',
    awayTeam: 'Sudáfrica',
    awayTeamFlag: 'https://flagcdn.com/za.svg',
    // 11 minutos para editar
    date: new Date(Date.now() + 660000).toISOString(),
    isUserPredicted: false,
  },
  {
    id: 'usa-opener',
    homeTeam: 'Estados Unidos',
    homeTeamFlag: 'https://flagcdn.com/us.svg',
    awayTeam: 'Por definir',
    awayTeamFlag: 'https://flagcdn.com/w320/un.png',
    date: '2026-06-12T21:00:00Z',
    isUserPredicted: false,
  },
  {
    id: 'can-opener',
    homeTeam: 'Canadá',
    homeTeamFlag: 'https://flagcdn.com/ca.svg',
    awayTeam: 'Por definir',
    awayTeamFlag: 'https://flagcdn.com/w320/un.png',
    date: '2026-06-13T18:00:00Z',
    isUserPredicted: false,
  },
  {
    id: 'arg-classic',
    homeTeam: 'Argentina',
    homeTeamFlag: 'https://flagcdn.com/ar.svg',
    awayTeam: 'Francia',
    awayTeamFlag: 'https://flagcdn.com/fr.svg',
    date: '2026-06-20T19:00:00Z',
    isUserPredicted: false,
  },
];
