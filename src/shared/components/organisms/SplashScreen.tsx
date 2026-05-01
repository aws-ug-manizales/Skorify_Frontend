'use client';

import { useEffect, useRef } from 'react';
import { animate, createTimeline } from 'animejs';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import DirectionsRunIcon from '@mui/icons-material/DirectionsRun';
import SportsSoccerIcon from '@mui/icons-material/SportsSoccer';
import { useTranslations } from 'next-intl';
import { tokens } from '@lib/theme/theme';
import FloatingParticles from './FloatingParticles';

interface SplashScreenProps {
  /** Brand text shown over the animation. Defaults to `common.appName`. */
  title?: string;
  /** Caption under the brand. Defaults to `splash.tagline`. */
  subtitle?: string;
  /**
   * `cover` = full viewport, `inline` = fits parent. Cover is the splash
   * default; inline is useful for embedding in a card.
   */
  mode?: 'cover' | 'inline';
  /**
   * If set, fires `onComplete` after this many milliseconds. Useful as a
   * timed transition between screens (e.g. login → home).
   */
  durationMs?: number;
  /** Callback fired when the timer (`durationMs`) elapses. */
  onComplete?: () => void;
}

const SplashScreen = ({
  title,
  subtitle,
  mode = 'cover',
  durationMs,
  onComplete,
}: SplashScreenProps = {}) => {
  const tCommon = useTranslations('common');
  const tSplash = useTranslations('splash');

  const playerRef = useRef<HTMLDivElement>(null);
  const playerBobRef = useRef<HTMLDivElement>(null);
  const ballRef = useRef<HTMLDivElement>(null);
  const goalRef = useRef<HTMLDivElement>(null);
  const goalFlashRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!durationMs || !onComplete) return;
    const timer = setTimeout(onComplete, durationMs);
    return () => clearTimeout(timer);
  }, [durationMs, onComplete]);

  useEffect(() => {
    const player = playerRef.current;
    const playerBob = playerBobRef.current;
    const ball = ballRef.current;
    const goal = goalRef.current;
    const goalFlash = goalFlashRef.current;
    if (!player || !playerBob || !ball || !goal || !goalFlash) return;

    // Continuous "running steps" — independent loop on the player's inner
    // wrapper so it composes with the stride (left/rotate) on the parent.
    // The combo of vertical bounce + tiny horizontal sway + body lean reads
    // as a left/right footstep cadence even with a static icon.
    const bob = animate(playerBob, {
      translateY: [
        { to: -7, duration: 130, ease: 'outQuad' },
        { to: 0, duration: 130, ease: 'inQuad' },
        { to: -5, duration: 130, ease: 'outQuad' },
        { to: 0, duration: 130, ease: 'inQuad' },
      ],
      translateX: [
        { to: -1.5, duration: 260, ease: 'inOutSine' },
        { to: 1.5, duration: 260, ease: 'inOutSine' },
      ],
      rotate: [
        { to: -2, duration: 260, ease: 'inOutSine' },
        { to: 2, duration: 260, ease: 'inOutSine' },
      ],
      duration: 520,
      loop: true,
    });

    // Main 4 s scene timeline. Each phase chains naturally; explicit numeric
    // positions are used when phases need to run in parallel (kick + ball
    // launch, ball impact + goal shake/flash).
    const scene = createTimeline({ loop: true, defaults: { ease: 'outQuad' } });

    // 0–1500: player jogs onto the pitch from off-screen left and stops just
    // BEFORE the ball (ball sits at left:24%, player ends at left:14% — its
    // right edge / front leg lines up with the ball at kick time).
    scene
      .add(
        player,
        {
          left: ['-22%', '14%'],
          opacity: [
            { to: 0, duration: 0 },
            { to: 1, duration: 220, ease: 'outQuad' },
          ],
          duration: 1500,
          ease: 'outCubic',
        },
        0,
      )
      // 1500–1750: plant the standing leg (slight body squash + lean back).
      .add(player, {
        rotate: [0, -6],
        scaleY: [1, 0.95],
        duration: 250,
        ease: 'outQuad',
      })
      // 1750–1950: KICK — body whips forward, leg follows through, player
      // edges into the ball position. This is when the foot meets the ball.
      .add(player, {
        left: ['14%', '20%'],
        rotate: [-6, 10],
        scaleY: [0.95, 1.05],
        duration: 200,
        ease: 'outBack',
      })
      // 1950–2200: settle from the kick.
      .add(player, {
        rotate: [10, 2, 0],
        scaleY: [1.05, 1, 1],
        duration: 250,
        ease: 'outQuad',
      })
      // 2200–3700: follow-through, the player keeps jogging through the play
      // and exits past the goal posts.
      .add(player, {
        left: ['20%', '120%'],
        opacity: [
          { to: 1, duration: 1200 },
          { to: 0, duration: 300, ease: 'inQuad' },
        ],
        duration: 1500,
        ease: 'inOutQuad',
      });

    // 1850: tiny "thunk" squash on the ball at the moment the foot meets it,
    // then it launches.
    scene.add(
      ball,
      {
        scale: [
          { from: 1, to: 0.85, duration: 60, ease: 'outQuad' },
          { to: 1.05, duration: 90, ease: 'outQuad' },
          { to: 1, duration: 80, ease: 'inOutQuad' },
        ],
        duration: 230,
      },
      1850,
    );

    // 1850–2950: ball flight. Scheduled in parallel so it leaves the player's
    // foot just as the kick lands. The arc is decomposed into "left" (linear-
    // ish) and "bottom" (out-then-in for the parabola) plus rotation.
    scene
      .add(
        ball,
        {
          left: ['24%', '88%'],
          rotate: [0, 1480],
          duration: 1100,
          ease: 'outCubic',
        },
        1850,
      )
      .add(
        ball,
        {
          bottom: [
            { from: '8%', to: '72%', duration: 520, ease: 'outQuad' },
            { to: '20%', duration: 580, ease: 'inQuad' },
          ],
          duration: 1100,
        },
        1850,
      );

    // 2940: ball impacts the net — quick squash + recovery.
    scene.add(
      ball,
      {
        scale: [
          { from: 1, to: 1.18, duration: 90, ease: 'outQuad' },
          { to: 1, duration: 220, ease: 'outElastic(1, 0.5)' },
        ],
        duration: 310,
      },
      2940,
    );

    // 2940: goal posts shake + radial flash — same beat as the impact.
    scene
      .add(
        goal,
        {
          translateX: [0, 6, -5, 3, 0],
          duration: 360,
          ease: 'outElastic(1, 0.4)',
        },
        2940,
      )
      .add(
        goalFlash,
        {
          opacity: [
            { from: 0, to: 1, duration: 90, ease: 'outQuad' },
            { to: 0, duration: 320, ease: 'inQuad' },
          ],
          duration: 410,
        },
        2920,
      );

    // 3650–4000: ball settles into the back of the net and fades for the loop.
    scene.add(
      ball,
      {
        opacity: [1, 0],
        duration: 320,
        ease: 'inQuad',
      },
      3650,
    );

    return () => {
      scene.pause();
      bob.pause();
    };
  }, []);

  return (
    <Box
      role="status"
      aria-live="polite"
      sx={{
        position: mode === 'cover' ? 'fixed' : 'relative',
        inset: mode === 'cover' ? 0 : 'auto',
        width: '100%',
        minHeight: mode === 'cover' ? '100vh' : 360,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 4,
        px: 3,
        zIndex: mode === 'cover' ? (theme) => theme.zIndex.modal + 1 : 'auto',
        background: `radial-gradient(circle at 30% 20%, ${tokens.primaryContainer}3D 0%, transparent 55%), linear-gradient(180deg, ${tokens.background}, ${tokens.surfaceContainerLow})`,
        overflow: 'hidden',
      }}
    >
      <FloatingParticles position="absolute" zIndex={0} opacity={0.6} />

      <Stack
        spacing={1}
        alignItems="center"
        sx={{ position: 'relative', zIndex: 1, textAlign: 'center' }}
      >
        <Typography
          variant="h2"
          sx={{
            fontWeight: 900,
            fontStyle: 'italic',
            letterSpacing: '-0.04em',
            textTransform: 'uppercase',
            color: tokens.onSurface,
            background: tokens.ctaGradient,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          {title ?? tCommon('appName')}
        </Typography>
        <Typography
          variant="body2"
          sx={{
            color: tokens.onSurfaceVariant,
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            fontWeight: 600,
          }}
        >
          {subtitle ?? tSplash('tagline')}
        </Typography>
      </Stack>

      <Box
        sx={{
          position: 'relative',
          width: { xs: 320, sm: 420 },
          height: { xs: 200, sm: 240 },
          zIndex: 1,
        }}
      >
        <Box
          aria-hidden
          sx={{
            position: 'absolute',
            left: '4%',
            bottom: 0,
            width: '92%',
            height: 2,
            background: `linear-gradient(90deg, transparent 0%, ${tokens.outlineVariant}66 50%, transparent 100%)`,
          }}
        />

        <Box
          ref={goalRef}
          aria-label={tSplash('goalAriaLabel')}
          sx={{
            position: 'absolute',
            right: '4%',
            bottom: 0,
            width: { xs: 110, sm: 140 },
            height: { xs: 130, sm: 160 },
            zIndex: 1,
          }}
        >
          <Box
            aria-hidden
            sx={{
              position: 'absolute',
              inset: 0,
              borderTop: `4px solid ${tokens.onSurface}`,
              borderLeft: `4px solid ${tokens.onSurface}`,
              borderRight: `4px solid ${tokens.onSurface}`,
              borderTopLeftRadius: 6,
              borderTopRightRadius: 6,
              backgroundImage: `
                linear-gradient(${tokens.onSurface}1F 1px, transparent 1px),
                linear-gradient(90deg, ${tokens.onSurface}1F 1px, transparent 1px)
              `,
              backgroundSize: '14px 14px',
              backgroundPosition: '0 0',
            }}
          />
          <Box
            ref={goalFlashRef}
            aria-hidden
            sx={{
              position: 'absolute',
              inset: 0,
              borderRadius: 1,
              opacity: 0,
              background: `radial-gradient(circle at 50% 80%, ${tokens.primary}55, transparent 60%)`,
              pointerEvents: 'none',
            }}
          />
        </Box>

        <Box
          ref={ballRef}
          aria-hidden
          sx={{
            position: 'absolute',
            left: '24%',
            bottom: '8%',
            zIndex: 2,
          }}
        >
          <SportsSoccerIcon
            sx={{
              display: 'block',
              fontSize: { xs: 28, sm: 34 },
              color: tokens.onSurface,
              filter: `drop-shadow(0 6px 14px ${tokens.primary}66)`,
            }}
          />
        </Box>

        <Box
          ref={playerRef}
          aria-label={tSplash('playerAriaLabel')}
          sx={{
            position: 'absolute',
            left: '-22%',
            bottom: 4,
            zIndex: 3,
            opacity: 0,
            transformOrigin: '50% 90%',
          }}
        >
          <Box ref={playerBobRef} sx={{ display: 'inline-block' }}>
            <DirectionsRunIcon
              sx={{
                display: 'block',
                fontSize: { xs: 60, sm: 76 },
                color: tokens.primary,
                filter: `drop-shadow(0 6px 16px ${tokens.primary}55)`,
              }}
            />
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default SplashScreen;
