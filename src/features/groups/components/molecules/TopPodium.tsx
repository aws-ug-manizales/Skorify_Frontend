'use client';

import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { animate } from 'animejs';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import { tokens } from '@lib/theme/theme';
import { getInitials } from '@shared/utils/string';
import type { StandingRow } from '../../types';

interface TopPodiumProps {
  standings: StandingRow[];
  /**
   * Optional previous standings — when provided AND the order differs from
   * `standings`, the podium first renders in the previous order, then animates
   * the positions to the new order, emits sparks at each moved step, and pops
   * a 🔥 next to the new #1.
   */
  previousStandings?: StandingRow[];
  currentUserId: string;
  pointsLabel: string;
}

const sortTop3 = (rows: StandingRow[]) => [...rows].sort((a, b) => b.points - a.points).slice(0, 3);
const idsKey = (rows: StandingRow[]) => rows.map((r) => r.userId).join('|');

type Step = {
  row: StandingRow;
  place: 1 | 2 | 3;
  accent: string;
  badgeText: string;
  badgeBg: string;
  badgeColor: string;
  size: { xs: number; md: number };
  offsetY: number;
  borderColor: string;
  isFirst: boolean;
};

interface SparkConfig {
  id: string;
  x: number;
  y: number;
  angle: number;
  distance: number;
  color: string;
  size: number;
}

const SPARK_COLORS = [tokens.secondary, tokens.primary, tokens.tertiary] as const;

const buildOrder = (rows: StandingRow[]): Step[] => {
  const [first, second, third] = rows;
  const order: Step[] = [];

  if (second) {
    order.push({
      row: second,
      place: 2,
      accent: tokens.onSurfaceVariant,
      badgeText: '2',
      badgeBg: tokens.onSurfaceVariant,
      badgeColor: tokens.background,
      size: { xs: 76, md: 104 },
      offsetY: 0,
      borderColor: `${tokens.onSurfaceVariant}66`,
      isFirst: false,
    });
  }

  if (first) {
    order.push({
      row: first,
      place: 1,
      accent: tokens.primary,
      badgeText: '1',
      badgeBg: tokens.primary,
      badgeColor: tokens.onPrimary,
      size: { xs: 104, md: 144 },
      offsetY: -24,
      borderColor: tokens.primary,
      isFirst: true,
    });
  }

  if (third) {
    order.push({
      row: third,
      place: 3,
      accent: tokens.secondary,
      badgeText: '3',
      badgeBg: tokens.secondary,
      badgeColor: tokens.onSecondary,
      size: { xs: 76, md: 104 },
      offsetY: 0,
      borderColor: `${tokens.secondary}66`,
      isFirst: false,
    });
  }

  return order;
};

const TopPodium = ({
  standings,
  previousStandings,
  currentUserId,
  pointsLabel,
}: TopPodiumProps) => {
  const top3 = useMemo(() => sortTop3(standings), [standings]);
  const prevTop3 = useMemo(
    () => (previousStandings ? sortTop3(previousStandings) : null),
    [previousStandings],
  );

  const orderChanged = !!prevTop3 && idsKey(prevTop3) !== idsKey(top3);

  // Holds the standings currently *displayed*. Starts as previous if order
  // changed (so we can animate from there to top3).
  const [displayed, setDisplayed] = useState<StandingRow[]>(orderChanged ? prevTop3! : top3);
  const [settled, setSettled] = useState(!orderChanged);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const stepRefs = useRef<Map<string, HTMLDivElement | null>>(new Map());
  const prevPositions = useRef<Map<string, DOMRect>>(new Map());
  const fireRef = useRef<HTMLSpanElement | null>(null);
  const [sparks, setSparks] = useState<SparkConfig[]>([]);

  // Trigger the swap from previous → current shortly after first render so
  // users see the "before" state for a moment, then it animates.
  useEffect(() => {
    if (!orderChanged) return;
    const swap = setTimeout(() => {
      // Snapshot current DOM positions BEFORE React re-renders the new order
      const snapshot = new Map<string, DOMRect>();
      stepRefs.current.forEach((el, id) => {
        if (el) snapshot.set(id, el.getBoundingClientRect());
      });
      prevPositions.current = snapshot;
      setDisplayed(top3);
    }, 700);
    return () => clearTimeout(swap);
  }, [orderChanged, top3]);

  // After the order changes in the DOM, run FLIP: animate each element from
  // its OLD position to the NEW one, and emit sparks at the destination.
  useLayoutEffect(() => {
    if (prevPositions.current.size === 0) return;
    const containerRect = containerRef.current?.getBoundingClientRect();
    if (!containerRect) return;

    const newSparks: SparkConfig[] = [];

    stepRefs.current.forEach((el, id) => {
      if (!el) return;
      const oldRect = prevPositions.current.get(id);
      if (!oldRect) return;
      const newRect = el.getBoundingClientRect();
      const dx = oldRect.left - newRect.left;
      const dy = oldRect.top - newRect.top;
      if (Math.abs(dx) < 1 && Math.abs(dy) < 1) return;

      animate(el, {
        translateX: [dx, 0],
        translateY: [dy, 0],
        duration: 950,
        ease: 'outBack(1.4)',
      });

      // Spawn ~10 sparks around the destination center
      const cx = newRect.left + newRect.width / 2 - containerRect.left;
      const cy = newRect.top + newRect.height / 2 - containerRect.top;
      for (let i = 0; i < 10; i += 1) {
        newSparks.push({
          id: `${id}-${Date.now()}-${i}`,
          x: cx,
          y: cy,
          angle: (Math.PI * 2 * i) / 10 + Math.random() * 0.4,
          distance: 36 + Math.random() * 36,
          color: SPARK_COLORS[i % SPARK_COLORS.length],
          size: 3 + Math.random() * 3,
        });
      }
    });

    // FLIP requires measuring DOM after layout, then driving spark visuals from
    // the measured coordinates — setState here is the synchronization with the
    // external (DOM) system.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSparks(newSparks);
    prevPositions.current.clear();

    const settleTimer = setTimeout(() => {
      setSettled(true);
      if (fireRef.current) {
        animate(fireRef.current, {
          scale: [0, 1.4, 1],
          rotate: [-20, 10, 0],
          duration: 700,
          ease: 'outElastic(1, 0.5)',
        });
      }
    }, 980);

    const sparkTimer = setTimeout(() => setSparks([]), 1400);

    return () => {
      clearTimeout(settleTimer);
      clearTimeout(sparkTimer);
    };
  }, [displayed]);

  const order = useMemo(() => buildOrder(displayed), [displayed]);
  if (order.length === 0) return null;

  return (
    <Box
      ref={containerRef}
      sx={{
        position: 'relative',
        bgcolor: tokens.surfaceContainerLow,
        borderRadius: '16px',
        pt: { xs: 5, md: 6 },
        pb: { xs: 4, md: 5 },
        px: { xs: 2, md: 3 },
        overflow: 'hidden',
        boxShadow: `0px 8px 64px ${tokens.primary}14`,
        border: `1px solid ${tokens.outlineVariant}1A`,
      }}
    >
      <Box
        component="img"
        src="/podium-stadium.png"
        alt=""
        aria-hidden
        sx={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          objectPosition: 'center 30%',
          opacity: { xs: 0.18, md: 0.28 },
          mixBlendMode: 'screen',
          pointerEvents: 'none',
        }}
      />
      <Box
        aria-hidden
        sx={{
          position: 'absolute',
          inset: 0,
          background: `linear-gradient(180deg, ${tokens.surfaceContainerLow}66 0%, ${tokens.surfaceContainerLow}E6 70%, ${tokens.surfaceContainerLow} 100%), radial-gradient(circle at 50% 0%, ${tokens.primaryContainer}33 0%, transparent 60%)`,
          pointerEvents: 'none',
        }}
      />

      <Box
        sx={{
          position: 'relative',
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'center',
          gap: { xs: 2, md: 5 },
        }}
      >
        {order.map((step) => (
          <PodiumStep
            key={step.row.userId}
            step={step}
            isCurrentUser={step.row.userId === currentUserId}
            pointsLabel={pointsLabel}
            settled={settled}
            fireRef={step.isFirst ? fireRef : undefined}
            registerRef={(el) => {
              if (el) stepRefs.current.set(step.row.userId, el);
              else stepRefs.current.delete(step.row.userId);
            }}
          />
        ))}
      </Box>

      {sparks.map((spark) => (
        <Spark key={spark.id} spark={spark} />
      ))}
    </Box>
  );
};

interface PodiumStepProps {
  step: Step;
  isCurrentUser: boolean;
  pointsLabel: string;
  settled: boolean;
  fireRef?: React.RefObject<HTMLSpanElement | null>;
  registerRef: (el: HTMLDivElement | null) => void;
}

const PodiumStep = ({
  step,
  isCurrentUser,
  pointsLabel,
  settled,
  fireRef,
  registerRef,
}: PodiumStepProps) => {
  const { row, accent, badgeText, badgeBg, badgeColor, size, offsetY, borderColor, isFirst } = step;

  return (
    <Box
      ref={registerRef}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        transform: `translateY(${offsetY}px)`,
        minWidth: 0,
        flex: '0 1 auto',
        willChange: 'transform',
      }}
    >
      <Box
        sx={{
          position: 'relative',
          mb: isFirst ? 3 : 2,
          transition: 'transform 250ms ease',
          '&:hover': { transform: 'scale(1.05)' },
        }}
      >
        {isFirst && (
          <Box
            aria-hidden
            sx={{
              position: 'absolute',
              inset: -16,
              borderRadius: '50%',
              background: `${tokens.primary}26`,
              filter: 'blur(24px)',
              zIndex: 0,
            }}
          />
        )}

        {isFirst && (
          <EmojiEventsIcon
            aria-hidden
            sx={{
              position: 'absolute',
              top: { xs: -16, md: -20 },
              left: '50%',
              transform: 'translateX(-50%)',
              color: tokens.primary,
              fontSize: { xs: 30, md: 38 },
              filter: `drop-shadow(0 4px 12px ${tokens.primary}66)`,
              zIndex: 2,
              '@keyframes podiumBounce': {
                '0%, 100%': {
                  transform: 'translateX(-50%) translateY(0)',
                  animationTimingFunction: 'cubic-bezier(0,0,0.2,1)',
                },
                '50%': {
                  transform: 'translateX(-50%) translateY(-25%)',
                  animationTimingFunction: 'cubic-bezier(0.8,0,1,1)',
                },
              },
              animation: 'podiumBounce 1.6s ease-in-out infinite',
            }}
          />
        )}

        <Avatar
          sx={{
            position: 'relative',
            zIndex: 1,
            width: size,
            height: size,
            border: `${isFirst ? 4 : 3}px solid ${borderColor}`,
            bgcolor: tokens.surfaceContainerHighest,
            color: tokens.onSurface,
            fontWeight: 800,
            fontSize: isFirst ? { xs: '1.5rem', md: '2rem' } : { xs: '1.125rem', md: '1.5rem' },
            transition:
              'width 600ms cubic-bezier(0.34, 1.56, 0.64, 1), height 600ms cubic-bezier(0.34, 1.56, 0.64, 1)',
            ...(isFirst && {
              boxShadow: `0px 8px 32px ${tokens.primary}40`,
            }),
          }}
        >
          {getInitials(row.name)}
        </Avatar>

        <Box
          sx={{
            position: 'absolute',
            bottom: -10,
            left: '50%',
            transform: 'translateX(-50%)',
            width: isFirst ? { xs: 36, md: 44 } : { xs: 28, md: 32 },
            height: isFirst ? { xs: 36, md: 44 } : { xs: 28, md: 32 },
            borderRadius: '50%',
            bgcolor: badgeBg,
            color: badgeColor,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 900,
            fontSize: isFirst ? { xs: '1.125rem', md: '1.25rem' } : '0.875rem',
            zIndex: 2,
            border: `2px solid ${tokens.surfaceContainerLow}`,
            boxShadow: isFirst ? `0 4px 16px ${tokens.primary}40` : 'none',
          }}
        >
          {badgeText}
        </Box>
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, maxWidth: '100%' }}>
        <Typography
          sx={{
            fontWeight: isFirst ? 800 : 700,
            color: isCurrentUser ? tokens.primary : isFirst ? tokens.primary : tokens.onSurface,
            fontSize: isFirst
              ? { xs: '0.9375rem', md: '1.125rem' }
              : { xs: '0.8125rem', md: '0.9375rem' },
            textAlign: 'center',
            maxWidth: { xs: 90, md: 140 },
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            letterSpacing: '-0.01em',
            mb: 0.5,
          }}
          title={row.name}
        >
          {row.name}
        </Typography>
        {isFirst && settled && (
          <Box
            ref={fireRef}
            component="span"
            aria-hidden
            sx={{
              display: 'inline-block',
              fontSize: { xs: '1rem', md: '1.125rem' },
              lineHeight: 1,
              mb: 0.5,
              filter: `drop-shadow(0 0 6px ${tokens.secondary}99)`,
              transformOrigin: 'center',
            }}
          >
            🔥
          </Box>
        )}
      </Box>

      <Typography
        sx={{
          fontWeight: 700,
          color: accent,
          fontSize: isFirst
            ? { xs: '0.8125rem', md: '0.875rem' }
            : { xs: '0.6875rem', md: '0.75rem' },
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
          fontVariantNumeric: 'tabular-nums',
          textAlign: 'center',
        }}
      >
        {row.points.toLocaleString()} {pointsLabel}
      </Typography>
    </Box>
  );
};

const Spark = ({ spark }: { spark: SparkConfig }) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    const tx = Math.cos(spark.angle) * spark.distance;
    const ty = Math.sin(spark.angle) * spark.distance - 18; // slight upward drift
    animate(ref.current, {
      translateX: [0, tx],
      translateY: [0, ty],
      opacity: [
        { to: 1, duration: 80 },
        { to: 0, duration: 720 },
      ],
      scale: [
        { from: 0.4, to: 1.1, duration: 120 },
        { to: 0, duration: 680 },
      ],
      duration: 800 + Math.random() * 400,
      ease: 'outQuad',
    });
  }, [spark]);

  return (
    <Box
      ref={ref}
      aria-hidden
      sx={{
        position: 'absolute',
        left: spark.x,
        top: spark.y,
        width: spark.size,
        height: spark.size,
        borderRadius: '50%',
        bgcolor: spark.color,
        boxShadow: `0 0 8px ${spark.color}, 0 0 16px ${spark.color}80`,
        pointerEvents: 'none',
        zIndex: 5,
        opacity: 0,
      }}
    />
  );
};

export default TopPodium;
