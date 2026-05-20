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
  {
    id: 'bra-classic',
    homeTeam: 'Brasil',
    homeTeamFlag: 'https://flagcdn.com/br.svg',
    awayTeam: 'Alemania',
    awayTeamFlag: 'https://flagcdn.com/de.svg',
    date: '2026-06-22T20:00:00Z',
    isUserPredicted: false,
  },
  {
    id: 'esp-vs-por',
    homeTeam: 'España',
    homeTeamFlag: 'https://flagcdn.com/es.svg',
    awayTeam: 'Portugal',
    awayTeamFlag: 'https://flagcdn.com/pt.svg',
    date: '2026-06-24T18:00:00Z',
    isUserPredicted: true,
  },
  {
    id: 'eng-vs-ita',
    homeTeam: 'Inglaterra',
    homeTeamFlag: 'https://flagcdn.com/gb-eng.svg',
    awayTeam: 'Italia',
    awayTeamFlag: 'https://flagcdn.com/it.svg',
    date: '2026-06-26T19:00:00Z',
    isUserPredicted: false,
  },
  {
    id: 'ned-vs-bel',
    homeTeam: 'Países Bajos',
    homeTeamFlag: 'https://flagcdn.com/nl.svg',
    awayTeam: 'Bélgica',
    awayTeamFlag: 'https://flagcdn.com/be.svg',
    date: '2026-06-28T16:30:00Z',
    isUserPredicted: false,
  },
  {
    id: 'col-vs-uru',
    homeTeam: 'Colombia',
    homeTeamFlag: 'https://flagcdn.com/co.svg',
    awayTeam: 'Uruguay',
    awayTeamFlag: 'https://flagcdn.com/uy.svg',
    date: '2026-06-30T21:00:00Z',
    isUserPredicted: true,
  },
  {
    id: 'jpn-vs-kor',
    homeTeam: 'Japón',
    homeTeamFlag: 'https://flagcdn.com/jp.svg',
    awayTeam: 'Corea del Sur',
    awayTeamFlag: 'https://flagcdn.com/kr.svg',
    date: '2026-07-02T12:00:00Z',
    isUserPredicted: false,
  },
  {
    id: 'mar-vs-sen',
    homeTeam: 'Marruecos',
    homeTeamFlag: 'https://flagcdn.com/ma.svg',
    awayTeam: 'Senegal',
    awayTeamFlag: 'https://flagcdn.com/sn.svg',
    date: '2026-07-04T17:00:00Z',
    isUserPredicted: false,
  },
  {
    id: 'cro-vs-pol',
    homeTeam: 'Croacia',
    homeTeamFlag: 'https://flagcdn.com/hr.svg',
    awayTeam: 'Polonia',
    awayTeamFlag: 'https://flagcdn.com/pl.svg',
    date: '2026-07-06T18:30:00Z',
    isUserPredicted: false,
  },
  {
    id: 'usa-vs-mex',
    homeTeam: 'Estados Unidos',
    homeTeamFlag: 'https://flagcdn.com/us.svg',
    awayTeam: 'México',
    awayTeamFlag: 'https://flagcdn.com/mx.svg',
    date: '2026-07-08T22:00:00Z',
    isUserPredicted: true,
  },
];
