'use client';

import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { animate } from 'animejs';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import useMediaQuery from '@mui/material/useMediaQuery';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import LeaderboardOutlinedIcon from '@mui/icons-material/LeaderboardOutlined';
import RefreshIcon from '@mui/icons-material/Refresh';
import { useTranslations } from 'next-intl';
import { tokens } from '@lib/theme/theme';
import { getInitials } from '@shared/utils/string';
import type { StandingRow } from '../../types';

interface StandingsTableProps {
  standings: StandingRow[];
  /**
   * Optional previous standings. When provided AND the order differs from
   * `standings`, the table first renders in the previous order, then animates
   * each row from its old position to the new one (FLIP), flashes a primary
   * tint on movement, and shows a transient delta chip (▲+2 / ▼-1) next to
   * the rank of every user whose position changed.
   */
  previousStandings?: StandingRow[];
  currentUserId: string;
  onRefresh?: () => void;
  isRefreshing?: boolean;
}

const PRE_ROLL_MS = 700;
const DELTA_VISIBLE_MS = 3200;

const sortByPoints = (rows: StandingRow[]) => [...rows].sort((a, b) => b.points - a.points);
const idsKey = (rows: StandingRow[]) => rows.map((r) => r.userId).join('|');

const StandingsTable = ({
  standings,
  previousStandings,
  currentUserId,
  onRefresh,
  isRefreshing = false,
}: StandingsTableProps) => {
  const t = useTranslations('groups');
  const isDesktop = useMediaQuery('(min-width:900px)');

  const sorted = useMemo(() => sortByPoints(standings), [standings]);
  const prevSorted = useMemo(
    () => (previousStandings ? sortByPoints(previousStandings) : null),
    [previousStandings],
  );

  const orderChanged = !!prevSorted && idsKey(prevSorted) !== idsKey(sorted);

  // Map of previous rank per user (1-based, from sorted previous), to render
  // delta chips after the animation settles.
  const prevRankByUserId = useMemo(() => {
    if (!prevSorted) return new Map<string, number>();
    return new Map(prevSorted.map((row, idx) => [row.userId, idx + 1]));
  }, [prevSorted]);

  const [displayed, setDisplayed] = useState<StandingRow[]>(
    orderChanged ? (prevSorted as StandingRow[]) : sorted,
  );
  const [deltasVisible, setDeltasVisible] = useState(false);

  const rowRefs = useRef<Map<string, HTMLDivElement | null>>(new Map());
  const prevPositions = useRef<Map<string, DOMRect>>(new Map());

  useEffect(() => {
    if (!orderChanged) return;
    const swap = setTimeout(() => {
      const snapshot = new Map<string, DOMRect>();
      rowRefs.current.forEach((el, id) => {
        if (el) snapshot.set(id, el.getBoundingClientRect());
      });
      prevPositions.current = snapshot;
      setDisplayed(sorted);
    }, PRE_ROLL_MS);
    return () => clearTimeout(swap);
  }, [orderChanged, sorted]);

  useLayoutEffect(() => {
    if (prevPositions.current.size === 0) return;

    rowRefs.current.forEach((el, id) => {
      if (!el) return;
      const oldRect = prevPositions.current.get(id);
      if (!oldRect) return;
      const newRect = el.getBoundingClientRect();
      const dy = oldRect.top - newRect.top;
      if (Math.abs(dy) < 1) return;

      animate(el, {
        translateY: [dy, 0],
        backgroundColor: [
          `${tokens.primaryContainer}40`,
          `${tokens.primaryContainer}40`,
          'rgba(0,0,0,0)',
        ],
        duration: 850,
        ease: 'outBack(1.2)',
      });
    });

    prevPositions.current.clear();

    const showDeltas = setTimeout(() => setDeltasVisible(true), 900);
    const hideDeltas = setTimeout(() => setDeltasVisible(false), 900 + DELTA_VISIBLE_MS);

    return () => {
      clearTimeout(showDeltas);
      clearTimeout(hideDeltas);
    };
  }, [displayed]);

  const headerColsMobile = ['#', t('colPlayer'), t('colPoints')];
  const headerColsDesktop = ['#', t('colPlayer'), t('colPoints'), t('colPredictedMatches')];
  const cols = isDesktop ? headerColsDesktop : headerColsMobile;
  const gridTemplate = isDesktop ? '40px 1fr 60px 80px' : '40px 1fr 52px';

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
          sx={{
            color: tokens.onSurface,
            textTransform: 'uppercase',
            letterSpacing: '0.04em',
            flex: 1,
          }}
        >
          {t('standingsTitle')}
        </Typography>

        {onRefresh && (
          <Tooltip title={t('standingsRefresh')}>
            <span>
              <IconButton
                size="small"
                onClick={onRefresh}
                disabled={isRefreshing}
                sx={{
                  color: tokens.onSurfaceVariant,
                  '&:hover': { color: tokens.primary },
                  transition: 'transform 400ms ease',
                  ...(isRefreshing && { animation: 'spin 0.8s linear infinite' }),
                  '@keyframes spin': {
                    from: { transform: 'rotate(0deg)' },
                    to: { transform: 'rotate(360deg)' },
                  },
                }}
              >
                <RefreshIcon sx={{ fontSize: 18 }} />
              </IconButton>
            </span>
          </Tooltip>
        )}
      </Box>

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

      {displayed.map((row, idx) => {
        const isCurrentUser = row.userId === currentUserId;
        const newRank = idx + 1;
        const isFirst = newRank === 1;
        const previousRank = prevRankByUserId.get(row.userId);
        const delta = previousRank != null && deltasVisible ? previousRank - newRank : 0;

        return (
          <Box
            key={row.userId}
            ref={(el: HTMLDivElement | null) => {
              if (el) rowRefs.current.set(row.userId, el);
              else rowRefs.current.delete(row.userId);
            }}
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
              willChange: 'transform',
              transition: 'background-color 150ms ease',
              '&:hover': { bgcolor: `${tokens.primary}0D` },
            }}
          >
            <Box
              sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.25 }}
            >
              <Typography
                variant="body2"
                sx={{
                  fontWeight: 700,
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
                {newRank}
              </Typography>
              {delta !== 0 && <DeltaChip delta={delta} />}
            </Box>

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

            {isDesktop && (
              <Typography
                variant="body2"
                sx={{
                  color: tokens.onSurfaceVariant,
                  textAlign: 'center',
                  fontWeight: 500,
                  fontSize: '0.78rem',
                }}
              >
                {row.predictedMatches}
              </Typography>
            )}
          </Box>
        );
      })}
    </Box>
  );
};

const DeltaChip = ({ delta }: { delta: number }) => {
  const up = delta > 0;
  const color = up ? tokens.success : tokens.error;
  const Icon = up ? ArrowDropUpIcon : ArrowDropDownIcon;
  return (
    <Box
      aria-hidden
      sx={{
        display: 'inline-flex',
        alignItems: 'center',
        color,
        fontSize: '0.625rem',
        fontWeight: 800,
        lineHeight: 1,
        ml: 0.25,
        '@keyframes deltaIn': {
          '0%': { opacity: 0, transform: 'translateY(4px) scale(0.6)' },
          '60%': { opacity: 1, transform: 'translateY(0) scale(1.1)' },
          '100%': { opacity: 1, transform: 'translateY(0) scale(1)' },
        },
        animation: 'deltaIn 400ms cubic-bezier(0.34,1.56,0.64,1) both',
      }}
    >
      <Icon sx={{ fontSize: '0.9rem', color }} />
      {Math.abs(delta)}
    </Box>
  );
};

export default StandingsTable;
