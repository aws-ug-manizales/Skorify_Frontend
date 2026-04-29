import type { Match } from '../types';

const WORLD_CUP_START_AT = Date.UTC(2026, 5, 11, 16, 0, 0);
const WORLD_CUP_END_AT = Date.UTC(2026, 6, 19, 19, 0, 0);
const UPCOMING_MATCHES_COUNT = 44;
const UPCOMING_MATCH_INTERVAL =
  (WORLD_CUP_END_AT - WORLD_CUP_START_AT) / (UPCOMING_MATCHES_COUNT - 1);

const createTournamentKickoff = (offsetMs = 0) =>
  new Date(WORLD_CUP_START_AT + offsetMs).toISOString();

export const MOCK_MATCHES: Match[] = [
  // Live (para probar marcador + filtro)
  {
    id: 'm-live-01',
    tournamentKey: 'worldcup',
    stageKey: 'groupStage',
    status: 'live',
    kickoffAt: createTournamentKickoff(1000 * 60 * 60 * 26),
    homeTeam: { name: 'España', code: 'ESP' },
    awayTeam: { name: 'Brasil', code: 'BRA' },
    score: { home: 1, away: 0 },
    prediction: { home: 2, away: 1 },
  },
  {
    id: 'm-live-02',
    tournamentKey: 'worldcup',
    stageKey: 'groupStage',
    status: 'live',
    kickoffAt: createTournamentKickoff(1000 * 60 * 60 * 74),
    homeTeam: { name: 'Argentina', code: 'ARG' },
    awayTeam: { name: 'México', code: 'MEX' },
    score: { home: 0, away: 0 },
  },
  {
    id: 'm-live-03',
    tournamentKey: 'worldcup',
    stageKey: 'roundOf16',
    status: 'live',
    kickoffAt: createTournamentKickoff(1000 * 60 * 60 * 492),
    homeTeam: { name: 'Francia', code: 'FRA' },
    awayTeam: { name: 'Alemania', code: 'GER' },
    score: { home: 2, away: 1 },
    prediction: { home: 1, away: 2 },
  },

  // Finished (para probar históricos + filtro)
  {
    id: 'm-fin-01',
    tournamentKey: 'worldcup',
    stageKey: 'groupStage',
    status: 'finished',
    kickoffAt: createTournamentKickoff(0),
    homeTeam: { name: 'Portugal', code: 'POR' },
    awayTeam: { name: 'Inglaterra', code: 'ENG' },
    score: { home: 1, away: 3 },
  },
  {
    id: 'm-fin-02',
    tournamentKey: 'worldcup',
    stageKey: 'groupStage',
    status: 'finished',
    kickoffAt: createTournamentKickoff(1000 * 60 * 60 * 12),
    homeTeam: { name: 'Colombia', code: 'COL' },
    awayTeam: { name: 'Uruguay', code: 'URU' },
    score: { home: 2, away: 2 },
  },
  {
    id: 'm-fin-03',
    tournamentKey: 'worldcup',
    stageKey: 'roundOf16',
    status: 'finished',
    kickoffAt: createTournamentKickoff(1000 * 60 * 60 * 456),
    homeTeam: { name: 'Italia', code: 'ITA' },
    awayTeam: { name: 'Países Bajos', code: 'NED' },
    score: { home: 0, away: 1 },
    prediction: { home: 0, away: 0 },
  },

  // Upcoming (mayoría para probar paginado)
  ...Array.from({ length: UPCOMING_MATCHES_COUNT }, (_, i) => {
    const idx = i + 1;
    const teams: Array<{ name: string; code: string }> = [
      { name: 'Chile', code: 'CHI' },
      { name: 'Perú', code: 'PER' },
      { name: 'Ecuador', code: 'ECU' },
      { name: 'Paraguay', code: 'PAR' },
      { name: 'Bolivia', code: 'BOL' },
      { name: 'Venezuela', code: 'VEN' },
      { name: 'Estados Unidos', code: 'USA' },
      { name: 'Canadá', code: 'CAN' },
      { name: 'Japón', code: 'JPN' },
      { name: 'Corea del Sur', code: 'KOR' },
      { name: 'Australia', code: 'AUS' },
      { name: 'Marruecos', code: 'MAR' },
      { name: 'Senegal', code: 'SEN' },
      { name: 'Nigeria', code: 'NGA' },
      { name: 'Camerún', code: 'CMR' },
      { name: 'Egipto', code: 'EGY' },
      { name: 'Croacia', code: 'CRO' },
      { name: 'Bélgica', code: 'BEL' },
      { name: 'Suiza', code: 'SUI' },
      { name: 'Dinamarca', code: 'DEN' },
      { name: 'Suecia', code: 'SWE' },
      { name: 'Noruega', code: 'NOR' },
      { name: 'Polonia', code: 'POL' },
      { name: 'Serbia', code: 'SRB' },
      { name: 'Grecia', code: 'GRE' },
      { name: 'Turquía', code: 'TUR' },
    ];

    const home = teams[idx % teams.length];
    const away = teams[(idx + 7) % teams.length];
    const stageKey = idx % 6 === 0 ? 'roundOf16' : 'groupStage';
    const kickoffAt = createTournamentKickoff(Math.round(i * UPCOMING_MATCH_INTERVAL));

    return {
      id: `m-up-${String(idx).padStart(2, '0')}`,
      tournamentKey: 'worldcup',
      stageKey,
      status: 'upcoming' as const,
      kickoffAt,
      homeTeam: home,
      awayTeam: away,
      prediction: idx % 9 === 0 ? { home: (idx % 4) + 1, away: idx % 3 } : undefined,
    };
  }),
];
