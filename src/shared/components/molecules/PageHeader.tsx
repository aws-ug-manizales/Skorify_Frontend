'use client';

import type { ReactNode } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import SportsSoccerIcon from '@mui/icons-material/SportsSoccer';
import { tokens } from '@lib/theme/theme';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  icon?: ReactNode;
  rightSlot?: ReactNode;
}

const PageHeader = ({
  title,
  subtitle,
  icon = <SportsSoccerIcon sx={{ color: tokens.primary, fontSize: '1rem' }} />,
  rightSlot,
}: PageHeaderProps) => (
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
        component="h1"
        sx={{
          fontSize: { xs: '2rem', md: '3rem' },
          fontWeight: 900,
          fontStyle: 'italic',
          letterSpacing: '-0.04em',
          color: tokens.onSurface,
          textTransform: 'uppercase',
          lineHeight: 1,
          mb: subtitle ? 1.5 : 0,
        }}
      >
        {title}
      </Typography>
      {subtitle && (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {icon}
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
      )}
    </Box>
    {rightSlot}
  </Box>
);

export default PageHeader;
