export interface Match {
  id: string;
  homeTeam: string;
  homeTeamFlag: string;
  awayTeam: string;
  awayTeamFlag: string;
  date: string;
  isUserPredicted: boolean;
}

// Función rápida para generar fechas dinámicas
const getDate = (offsetDays: number, hours: number) => {
  const date = new Date();
  date.setDate(date.getDate() + offsetDays);
  date.setHours(hours, 0, 0, 0);
  return date.toISOString();
};

export const MOCK_MATCHES: Match[] = [
  // --- PARTIDOS DE AYER ---
  {
    id: '1',
    homeTeam: 'Francia',
    homeTeamFlag: 'https://flagcdn.com/w80/fr.png',
    awayTeam: 'Inglaterra',
    awayTeamFlag: 'https://flagcdn.com/w80/gb.png',
    date: getDate(-1, 15), // Ayer a las 3:00 PM
    isUserPredicted: true,
  },
  // --- PARTIDOS DE HOY ---
  {
    id: '2',
    homeTeam: 'Colombia',
    homeTeamFlag: 'https://flagcdn.com/w80/co.png',
    awayTeam: 'Brasil',
    awayTeamFlag: 'https://flagcdn.com/w80/br.png',
    date: getDate(0, 18), // Hoy a las 6:00 PM
    isUserPredicted: false,
  },
  {
    id: '3',
    homeTeam: 'Argentina',
    homeTeamFlag: 'https://flagcdn.com/w80/ar.png',
    awayTeam: 'Uruguay',
    awayTeamFlag: 'https://flagcdn.com/w80/uy.png',
    date: getDate(0, 20), // Hoy a las 8:00 PM
    isUserPredicted: false,
  },
  // --- PARTIDOS DE MAÑANA ---
  {
    id: '4',
    homeTeam: 'España',
    homeTeamFlag: 'https://flagcdn.com/w80/es.png',
    awayTeam: 'Alemania',
    awayTeamFlag: 'https://flagcdn.com/w80/de.png',
    date: getDate(1, 14), // Mañana a las 2:00 PM
    isUserPredicted: false,
  },
  {
    id: '5',
    homeTeam: 'Portugal',
    homeTeamFlag: 'https://flagcdn.com/w80/pt.png',
    awayTeam: 'Italia',
    awayTeamFlag: 'https://flagcdn.com/w80/it.png',
    date: getDate(1, 21), // Mañana a las 9:00 PM
    isUserPredicted: false,
  },
];
