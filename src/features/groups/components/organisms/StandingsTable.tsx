'use client';

import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import useMediaQuery from '@mui/material/useMediaQuery';
import LeaderboardOutlinedIcon from '@mui/icons-material/LeaderboardOutlined';
import { useTranslations } from 'next-intl';
import { tokens } from '@lib/theme/theme';
import type { StandingRow } from '../../types';

const getInitials = (name: string) =>
  name
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

interface StandingsTableProps {
  standings: StandingRow[];
  currentUserId: string;
}

const StandingsTable = ({ standings, currentUserId }: StandingsTableProps) => {
  const t = useTranslations('groups');
  const isDesktop = useMediaQuery('(min-width:900px)');

  const headerColsMobile = ['#', t('colPlayer'), t('colPoints')];
  const headerColsDesktop = [
    '#',
    t('colPlayer'),
    t('colPoints'),
    t('colWon'),
    t('colDrawn'),
    t('colLost'),
  ];
  const cols = isDesktop ? headerColsDesktop : headerColsMobile;
  const gridTemplate = isDesktop ? '32px 1fr 52px 36px 36px 36px' : '32px 1fr 52px';

  return (
    <Box
      sx={{
        bgcolor: tokens.surfaceContainerLow,
        borderRadius: '16px',
        p: { xs: 2, md: 2.5 },
        boxShadow: tokens.shadowSm,
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
        <LeaderboardOutlinedIcon sx={{ color: tokens.primary, fontSize: 20 }} />
        <Typography
          variant="h6"
          sx={{ color: tokens.onSurface, textTransform: 'uppercase', letterSpacing: '0.04em' }}
        >
          {t('standingsTitle')}
        </Typography>
      </Box>

      {/* Column headers */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: gridTemplate,
          gap: 1,
          px: 1.5,
          pb: 1,
        }}
      >
        {cols.map((col, idx) => (
          <Typography
            key={col}
            variant="body2"
            sx={{
              color: tokens.onSurfaceVariant,
              fontWeight: 600,
              fontSize: '0.68rem',
              textAlign: idx === 1 ? 'left' : 'center',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}
          >
            {col}
          </Typography>
        ))}
      </Box>

      {standings.map((row, idx) => {
        const isCurrentUser = row.userId === currentUserId;
        const isFirst = row.rank === 1;

        return (
          <Box
            key={row.userId}
            sx={{
              display: 'grid',
              gridTemplateColumns: gridTemplate,
              gap: 1,
              alignItems: 'center',
              px: 1.5,
              py: 0.875,
              borderRadius: '8px',
              bgcolor: isCurrentUser
                ? `${tokens.primaryContainer}20`
                : idx % 2 !== 0
                  ? `${tokens.surfaceContainerHighest}30`
                  : 'transparent',
              borderLeft: isCurrentUser ? `3px solid ${tokens.primary}` : '3px solid transparent',
              transition: 'background-color 150ms ease',
              '&:hover': { bgcolor: `${tokens.primary}0D` },
            }}
          >
            {/* Rank */}
            <Typography
              variant="body2"
              sx={{
                fontWeight: 700,
                textAlign: 'center',
                fontSize: '0.8rem',
                ...(isFirst
                  ? {
                      background: tokens.ctaGradient,
                      backgroundClip: 'text',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                    }
                  : { color: tokens.onSurfaceVariant }),
              }}
            >
              {row.rank}
            </Typography>

            {/* Player name + avatar */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, minWidth: 0 }}>
              <Avatar
                sx={{
                  width: 26,
                  height: 26,
                  bgcolor: tokens.surfaceContainerHighest,
                  fontSize: '0.6rem',
                  fontWeight: 700,
                  color: tokens.onSurface,
                  flexShrink: 0,
                }}
              >
                {getInitials(row.name)}
              </Avatar>
              <Typography
                variant="body1"
                sx={{
                  color: isCurrentUser ? tokens.primary : tokens.onSurface,
                  fontWeight: isCurrentUser ? 600 : 400,
                  fontSize: '0.8rem',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {row.name}
              </Typography>
            </Box>

            {/* Points */}
            <Typography
              variant="body2"
              sx={{
                color: isCurrentUser ? tokens.primary : tokens.onSurface,
                fontWeight: 700,
                textAlign: 'center',
                fontSize: '0.85rem',
              }}
            >
              {row.points}
            </Typography>

            {/* W / D / L — desktop only */}
            {isDesktop && (
              <>
                <Typography
                  variant="body2"
                  sx={{
                    color: tokens.success,
                    textAlign: 'center',
                    fontWeight: 600,
                    fontSize: '0.78rem',
                  }}
                >
                  {row.won}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: tokens.onSurfaceVariant,
                    textAlign: 'center',
                    fontWeight: 600,
                    fontSize: '0.78rem',
                  }}
                >
                  {row.drawn}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: tokens.error,
                    textAlign: 'center',
                    fontWeight: 600,
                    fontSize: '0.78rem',
                  }}
                >
                  {row.lost}
                </Typography>
              </>
            )}
          </Box>
        );
      })}
    </Box>
  );
};

export default StandingsTable;
