'use client';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import SportsSoccerIcon from '@mui/icons-material/SportsSoccer';
import { tokens } from '@lib/theme/theme';
import MatchesFilters, { type MatchesFilterKey } from './MatchesFilters';

type Props = {
  title: string;
  subtitle: string;
  activeFilter: MatchesFilterKey;
  onFilterChange: (filter: MatchesFilterKey) => void;
  filterLabelFor: (filter: MatchesFilterKey) => string;
};

const MatchesHeader = ({
  title,
  subtitle,
  activeFilter,
  onFilterChange,
  filterLabelFor,
}: Props) => (
  <Box
    sx={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-end',
      mb: 6,
      flexWrap: 'wrap',
      gap: 2,
    }}
  >
    <Box>
      <Typography
        sx={{
          fontSize: { xs: '2rem', md: '3rem' },
          fontWeight: 900,
          fontStyle: 'italic',
          letterSpacing: '-0.04em',
          color: tokens.onSurface,
          textTransform: 'uppercase',
          lineHeight: 1,
          mb: 1.5,
        }}
      >
        {title}
      </Typography>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <SportsSoccerIcon sx={{ color: tokens.primary, fontSize: '1rem' }} />
        <Typography
          sx={{
            fontSize: '0.75rem',
            color: tokens.onSurfaceVariant,
            fontWeight: 500,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
          }}
        >
          {subtitle}
        </Typography>
      </Box>
    </Box>

    <MatchesFilters active={activeFilter} onChange={onFilterChange} labelFor={filterLabelFor} />
  </Box>
);

export default MatchesHeader;
