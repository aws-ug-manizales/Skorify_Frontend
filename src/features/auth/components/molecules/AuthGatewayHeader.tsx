'use client';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import SportsSoccerIcon from '@mui/icons-material/SportsSoccer';
import { tokens } from '@lib/theme/theme';

interface AuthGatewayHeaderProps {
  title: string;
  subtitle: string;
}

const AuthGatewayHeader = ({ title, subtitle }: AuthGatewayHeaderProps) => (
  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
    <Typography
      variant="h4"
      align="center"
      sx={{
        fontSize: '1.5rem',
        fontWeight: 900,
        letterSpacing: '-0.04em',
        color: tokens.primary,
        textTransform: 'uppercase',
      }}
    >
      {title}
    </Typography>
    <Box
      sx={{
        position: 'relative',
        top: 0,
        left: 'calc(50% - 16px)',
        '@keyframes ballRoll': {
          '0%': { transform: 'translateX(0)', opacity: 0 },
          '5%': { transform: 'translateX(0)', opacity: 1 },
          '62%': { transform: 'translateX(0)', opacity: 1 },
          '80%': { transform: 'translateX(260px)', opacity: 0 },
          '100%': { transform: 'translateX(0)', opacity: 0 },
        },
        animation: 'ballRoll 5s ease-in infinite',
      }}
    >
      <SportsSoccerIcon
        sx={{
          color: tokens.primary,
          fontSize: '2rem',
          display: 'block',
          '@keyframes ballBounce': {
            '0%': {
              transform: 'translateY(-260px) rotate(0deg)',
              animationTimingFunction: 'ease-in',
            },
            '18%': {
              transform: 'translateY(2px) rotate(0deg) scaleY(0.72)',
              animationTimingFunction: 'ease-out',
            },
            '22%': {
              transform: 'translateY(0) rotate(0deg) scaleY(1)',
              animationTimingFunction: 'ease-in',
            },
            '30%': {
              transform: 'translateY(-70px) rotate(35deg)',
              animationTimingFunction: 'ease-in',
            },
            '38%': {
              transform: 'translateY(2px) rotate(62deg) scaleY(0.83)',
              animationTimingFunction: 'ease-out',
            },
            '41%': {
              transform: 'translateY(0) rotate(62deg) scaleY(1)',
              animationTimingFunction: 'ease-in',
            },
            '47%': {
              transform: 'translateY(-32px) rotate(88deg)',
              animationTimingFunction: 'ease-in',
            },
            '53%': {
              transform: 'translateY(2px) rotate(112deg) scaleY(0.9)',
              animationTimingFunction: 'ease-out',
            },
            '55%': {
              transform: 'translateY(0) rotate(112deg) scaleY(1)',
              animationTimingFunction: 'ease-in',
            },
            '58%': {
              transform: 'translateY(-10px) rotate(122deg)',
              animationTimingFunction: 'ease-in',
            },
            '62%': {
              transform: 'translateY(0) rotate(130deg)',
              animationTimingFunction: 'linear',
            },
            '80%': { transform: 'translateY(0) rotate(580deg)' },
            '100%': { transform: 'translateY(-260px) rotate(0deg)' },
          },
          animation: 'ballBounce 5s ease-out infinite',
        }}
      />
    </Box>
    <Typography align="center" sx={{ color: tokens.onSurfaceVariant }}>
      {subtitle}
    </Typography>
  </Box>
);

export default AuthGatewayHeader;
