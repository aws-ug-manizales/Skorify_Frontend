const FIFA_TO_ISO2: Record<string, string> = {
  ESP: 'es',
  BRA: 'br',
  ARG: 'ar',
  MEX: 'mx',
  FRA: 'fr',
  GER: 'de',
  POR: 'pt',
  ENG: 'gb',
  COL: 'co',
  URU: 'uy',
  ITA: 'it',
  NED: 'nl',
  CHI: 'cl',
  PER: 'pe',
  ECU: 'ec',
  PAR: 'py',
  BOL: 'bo',
  VEN: 've',
  USA: 'us',
  CAN: 'ca',
  JPN: 'jp',
  KOR: 'kr',
  AUS: 'au',
  MAR: 'ma',
  SEN: 'sn',
  NGA: 'ng',
  CMR: 'cm',
  EGY: 'eg',
  CRO: 'hr',
  BEL: 'be',
  SUI: 'ch',
  DEN: 'dk',
  SWE: 'se',
  NOR: 'no',
  POL: 'pl',
  SRB: 'rs',
  GRE: 'gr',
  TUR: 'tr',
};

const PLACEHOLDER_FLAG = 'https://flagcdn.com/w320/un.png';

export const getCountryFlagUrl = (code?: string) => {
  if (!code) return PLACEHOLDER_FLAG;
  const iso2 = FIFA_TO_ISO2[code.toUpperCase()] ?? code.toLowerCase().slice(0, 2);
  return `https://flagcdn.com/w320/${iso2}.png`;
};
