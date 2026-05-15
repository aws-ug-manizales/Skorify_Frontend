'use client';

import { useState, type ComponentType } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import Box from '@mui/material/Box';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { type SvgIconProps } from '@mui/material/SvgIcon';
import BoltIcon from '@mui/icons-material/Bolt';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CloseIcon from '@mui/icons-material/Close';
import GitHubIcon from '@mui/icons-material/GitHub';
import GroupsIcon from '@mui/icons-material/Groups';
import InstagramIcon from '@mui/icons-material/Instagram';
import LeaderboardIcon from '@mui/icons-material/Leaderboard';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import PublicIcon from '@mui/icons-material/Public';
import SportsSoccerIcon from '@mui/icons-material/SportsSoccer';
import VpnKeyOutlinedIcon from '@mui/icons-material/VpnKeyOutlined';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import YouTubeIcon from '@mui/icons-material/YouTube';
import AppButton from '@shared/components/atoms/AppButton';
import AppCard from '@shared/components/molecules/AppCard';
import Reveal from '@shared/components/atoms/Reveal';
import { InvitationCodeInput } from '@features/groups/components/molecules/InvitationCodeInput';
import {
  normalizeInvitationCode,
  validateInvitationCode,
} from '@features/groups/utils/invitationCodeValidator';
import { tokens } from '@lib/theme/theme';

const HomeHero = () => (
  <Box component="main" sx={{ position: 'relative', overflow: 'hidden' }}>
    <Hero />
    <StatsBand />
    <Features />
    <HowItWorks />
    <FinalCta />
    <Footer />
  </Box>
);

export default HomeHero;

const SectionContainer = ({ children, sx }: { children: React.ReactNode; sx?: object }) => (
  <Box
    sx={{
      width: '100%',
      maxWidth: 1200,
      mx: 'auto',
      px: { xs: 3, md: 6 },
      py: { xs: 8, md: 12 },
      position: 'relative',
      ...sx,
    }}
  >
    {children}
  </Box>
);

const Hero = () => {
  const t = useTranslations('home.hero');

  return (
    <Box
      component="section"
      sx={{
        position: 'relative',
        minHeight: { xs: 440, md: 560 },
        display: 'flex',
        alignItems: 'center',
        overflow: 'hidden',
      }}
    >
      {/* Banner image background */}
      <Box
        component="img"
        src="/hero-stadium.png"
        alt=""
        aria-hidden
        sx={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          opacity: 0.45,
          zIndex: 0,
        }}
      />
      {/* Dark gradient overlay — fades top→bottom into the background color */}
      <Box
        aria-hidden
        sx={{
          position: 'absolute',
          inset: 0,
          background: `linear-gradient(180deg, ${tokens.background}66 0%, ${tokens.background}CC 60%, ${tokens.background} 100%)`,
          zIndex: 1,
        }}
      />
      {/* Brand color glow — subtle accent on top of image */}
      <Box
        aria-hidden
        sx={{
          position: 'absolute',
          top: '-20%',
          right: '-10%',
          width: { xs: '120%', md: '60%' },
          height: { xs: '80%', md: '120%' },
          background: `radial-gradient(circle at 50% 50%, ${tokens.primaryContainer}26 0%, ${tokens.secondaryContainer}14 35%, transparent 70%)`,
          filter: 'blur(40px)',
          pointerEvents: 'none',
          zIndex: 2,
        }}
      />
      <Box
        aria-hidden
        sx={{
          position: 'absolute',
          bottom: '-20%',
          left: '-10%',
          width: { xs: '100%', md: '50%' },
          height: '70%',
          background: `radial-gradient(circle at 50% 50%, ${tokens.secondary}14 0%, transparent 60%)`,
          filter: 'blur(40px)',
          pointerEvents: 'none',
          zIndex: 2,
        }}
      />

      <SectionContainer sx={{ py: { xs: 6, md: 5 }, position: 'relative', zIndex: 3 }}>
        <Grid container spacing={{ xs: 4, md: 6 }} alignItems="center">
          <Grid size={{ xs: 12, md: 7 }}>
            <Stack spacing={3} sx={{ maxWidth: 600 }}>
              <Reveal delay={0} duration={700}>
                <Typography
                  sx={{
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    letterSpacing: '0.18em',
                    textTransform: 'uppercase',
                    color: tokens.primary,
                  }}
                >
                  {t('eyebrow')}
                </Typography>
              </Reveal>

              <Reveal delay={120} duration={800}>
                <Typography
                  component="h1"
                  sx={{
                    fontSize: { xs: '2.5rem', sm: '3.5rem', md: '4rem' },
                    fontWeight: 900,
                    letterSpacing: '-0.04em',
                    lineHeight: 0.95,
                    color: tokens.onSurface,
                    textTransform: 'uppercase',
                    fontStyle: 'italic',
                  }}
                >
                  {t('title')}
                </Typography>
              </Reveal>

              <Reveal delay={240} duration={800}>
                <Typography
                  sx={{
                    color: tokens.onSurfaceVariant,
                    fontWeight: 500,
                    lineHeight: 1.6,
                    fontSize: { xs: '1rem', md: '1.125rem' },
                    maxWidth: 520,
                  }}
                >
                  {t('description')}
                </Typography>
              </Reveal>

              <Reveal delay={360} duration={800}>
                <Box sx={{ pt: 1 }}>
                  <AppButton component={Link} href="/auth" variant="primary" size="large">
                    {t('cta')}
                  </AppButton>
                </Box>
              </Reveal>
            </Stack>
          </Grid>

          <Grid size={{ xs: 12, md: 5 }} sx={{ display: { xs: 'none', md: 'block' } }}>
            <HeroVisual />
          </Grid>
        </Grid>
      </SectionContainer>
    </Box>
  );
};

const HeroVisual = () => (
  <Box
    sx={{
      position: 'relative',
      height: 440,
      perspective: '1200px',
    }}
    aria-hidden
  >
    <FloatingCard
      appearDelay={500}
      restRotate={4}
      sx={{
        top: '4%',
        right: '6%',
        width: 280,
      }}
      home="COL"
      away="ARG"
      score="2 — 1"
      tournament="Copa América"
      status="finished"
    />
    <FloatingCard
      appearDelay={650}
      restRotate={-6}
      sx={{
        top: '38%',
        left: '0',
        width: 280,
      }}
      home="ESP"
      away="FRA"
      score="X — X"
      tournament="UEFA"
      status="open"
    />
    <FloatingCard
      appearDelay={800}
      restRotate={2}
      sx={{
        bottom: '0',
        right: '12%',
        width: 280,
      }}
      home="BRA"
      away="URU"
      score="X — X"
      tournament="Eliminatorias"
      status="open"
    />
  </Box>
);

interface FloatingCardProps {
  sx?: object;
  home: string;
  away: string;
  score: string;
  tournament: string;
  status: 'open' | 'finished';
  appearDelay?: number;
  restRotate?: number;
}

const FloatingCard = ({
  sx,
  home,
  away,
  score,
  tournament,
  status,
  appearDelay = 0,
  restRotate = 0,
}: FloatingCardProps) => (
  <Box
    sx={{
      position: 'absolute',
      bgcolor: tokens.surfaceContainerHigh,
      borderRadius: 3,
      border: `1px solid ${tokens.outlineVariant}33`,
      boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
      backdropFilter: 'blur(12px)',
      p: 2.5,
      opacity: 0,
      transform: `translateY(28px) rotate(${restRotate}deg) scale(0.96)`,
      animation: `floatCardIn 900ms cubic-bezier(0.16, 1, 0.3, 1) ${appearDelay}ms forwards`,
      '@keyframes floatCardIn': {
        to: {
          opacity: 1,
          transform: `translateY(0) rotate(${restRotate}deg) scale(1)`,
        },
      },
      '@media (prefers-reduced-motion: reduce)': {
        opacity: 1,
        transform: `rotate(${restRotate}deg)`,
        animation: 'none',
      },
      ...sx,
    }}
  >
    <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1.5 }}>
      <Typography
        sx={{
          fontSize: '0.625rem',
          fontWeight: 700,
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          color: tokens.onSurfaceVariant,
        }}
      >
        {tournament}
      </Typography>
      <Box
        sx={{
          width: 8,
          height: 8,
          borderRadius: '50%',
          bgcolor: status === 'open' ? tokens.success : tokens.onSurfaceVariant,
        }}
      />
    </Stack>
    <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={1}>
      <Typography sx={{ fontWeight: 800, fontSize: '0.9375rem' }}>{home}</Typography>
      <Typography
        sx={{
          fontWeight: 900,
          fontSize: '1.25rem',
          color: status === 'finished' ? tokens.onSurface : tokens.onSurfaceVariant,
          fontVariantNumeric: 'tabular-nums',
        }}
      >
        {score}
      </Typography>
      <Typography sx={{ fontWeight: 800, fontSize: '0.9375rem' }}>{away}</Typography>
    </Stack>
  </Box>
);

const StatsBand = () => {
  const t = useTranslations('home.stats');

  const items = [
    { value: '120K+', label: t('predictions') },
    { value: '3.5K+', label: t('groups') },
    { value: '18K+', label: t('users') },
    { value: '104', label: t('matches') },
  ];

  return (
    <Box
      component="section"
      sx={{
        borderTop: `1px solid ${tokens.outlineVariant}26`,
        borderBottom: `1px solid ${tokens.outlineVariant}26`,
        bgcolor: tokens.surfaceContainerLowest,
      }}
    >
      <SectionContainer sx={{ py: { xs: 6, md: 8 } }}>
        <Grid container spacing={{ xs: 4, md: 2 }}>
          {items.map(({ value, label }, idx) => (
            <Grid key={label} size={{ xs: 6, md: 3 }}>
              <Reveal delay={idx * 100} distance={20}>
                <Stack alignItems="center" spacing={0.75} sx={{ textAlign: 'center' }}>
                  <Typography
                    sx={{
                      fontSize: { xs: '2rem', md: '2.75rem' },
                      fontWeight: 900,
                      lineHeight: 1,
                      color: tokens.onSurface,
                      fontVariantNumeric: 'tabular-nums',
                      background: tokens.ctaGradient,
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                    }}
                  >
                    {value}
                  </Typography>
                  <Typography
                    variant="overline"
                    sx={{
                      color: tokens.onSurfaceVariant,
                      fontWeight: 700,
                      letterSpacing: '0.08em',
                      lineHeight: 1.2,
                      fontSize: '0.6875rem',
                    }}
                  >
                    {label}
                  </Typography>
                </Stack>
              </Reveal>
            </Grid>
          ))}
        </Grid>
      </SectionContainer>
    </Box>
  );
};

interface FeatureItem {
  key: string;
  Icon: ComponentType<SvgIconProps>;
  color: string;
}

const FEATURES: ReadonlyArray<FeatureItem> = [
  { key: 'predict', Icon: SportsSoccerIcon, color: tokens.primary },
  { key: 'groups', Icon: GroupsIcon, color: tokens.secondary },
  { key: 'ranking', Icon: LeaderboardIcon, color: tokens.info },
];

const Features = () => {
  const t = useTranslations('home.features');
  return (
    <Box component="section">
      <SectionContainer>
        <Reveal>
          <Stack
            spacing={1.5}
            sx={{ textAlign: 'center', mb: { xs: 6, md: 8 } }}
            alignItems="center"
          >
            <Typography
              sx={{
                fontSize: '0.75rem',
                fontWeight: 700,
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                color: tokens.primary,
              }}
            >
              {t('eyebrow')}
            </Typography>
            <Typography
              component="h2"
              sx={{
                fontSize: { xs: '1.75rem', md: '2.5rem' },
                fontWeight: 900,
                letterSpacing: '-0.02em',
                lineHeight: 1.1,
                color: tokens.onSurface,
              }}
            >
              {t('title')}
            </Typography>
            <Typography
              sx={{
                color: tokens.onSurfaceVariant,
                fontSize: '1rem',
                maxWidth: 560,
                lineHeight: 1.6,
              }}
            >
              {t('subtitle')}
            </Typography>
          </Stack>
        </Reveal>

        <Grid container spacing={3}>
          {FEATURES.map(({ key, Icon, color }, idx) => (
            <Grid key={key} size={{ xs: 12, md: 4 }}>
              <Reveal delay={idx * 120} duration={800}>
                <AppCard sx={{ height: '100%' }}>
                  <Stack spacing={2} sx={{ p: { xs: 3, md: 3.5 } }}>
                    <Box
                      sx={{
                        width: 56,
                        height: 56,
                        borderRadius: '16px',
                        bgcolor: `${color}14`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Icon sx={{ color, fontSize: 28 }} />
                    </Box>
                    <Typography sx={{ fontSize: '1.25rem', fontWeight: 800, lineHeight: 1.2 }}>
                      {t(`${key}.title`)}
                    </Typography>
                    <Typography
                      sx={{
                        color: tokens.onSurfaceVariant,
                        lineHeight: 1.6,
                        fontSize: '0.9375rem',
                      }}
                    >
                      {t(`${key}.description`)}
                    </Typography>
                  </Stack>
                </AppCard>
              </Reveal>
            </Grid>
          ))}
        </Grid>
      </SectionContainer>
    </Box>
  );
};

const STEPS = ['step1', 'step2', 'step3'] as const;

const HowItWorks = () => {
  const t = useTranslations('home.howItWorks');
  return (
    <Box component="section" sx={{ bgcolor: tokens.surfaceContainerLowest }}>
      <SectionContainer>
        <Reveal>
          <Stack
            spacing={1.5}
            sx={{ textAlign: 'center', mb: { xs: 6, md: 8 } }}
            alignItems="center"
          >
            <Typography
              sx={{
                fontSize: '0.75rem',
                fontWeight: 700,
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                color: tokens.secondary,
              }}
            >
              {t('eyebrow')}
            </Typography>
            <Typography
              component="h2"
              sx={{
                fontSize: { xs: '1.75rem', md: '2.5rem' },
                fontWeight: 900,
                letterSpacing: '-0.02em',
                lineHeight: 1.1,
                color: tokens.onSurface,
              }}
            >
              {t('title')}
            </Typography>
          </Stack>
        </Reveal>

        <Grid container spacing={3}>
          {STEPS.map((step, idx) => (
            <Grid key={step} size={{ xs: 12, md: 4 }}>
              <Reveal delay={idx * 120} duration={800}>
                <Stack spacing={2} sx={{ p: { xs: 1, md: 2 } }}>
                  <Stack direction="row" alignItems="center" spacing={1.5}>
                    <Box
                      sx={{
                        width: 44,
                        height: 44,
                        borderRadius: '12px',
                        background: tokens.ctaGradient,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: tokens.onSurface,
                        fontWeight: 900,
                        fontSize: '1.125rem',
                        fontVariantNumeric: 'tabular-nums',
                      }}
                    >
                      {idx + 1}
                    </Box>
                    <Typography sx={{ fontSize: '1.125rem', fontWeight: 800, lineHeight: 1.2 }}>
                      {t(`${step}.title`)}
                    </Typography>
                  </Stack>
                  <Typography
                    sx={{
                      color: tokens.onSurfaceVariant,
                      lineHeight: 1.6,
                      fontSize: '0.9375rem',
                    }}
                  >
                    {t(`${step}.description`)}
                  </Typography>
                </Stack>
              </Reveal>
            </Grid>
          ))}
        </Grid>
      </SectionContainer>
    </Box>
  );
};

const FinalCta = () => {
  const t = useTranslations('home.finalCta');
  const [inviteOpen, setInviteOpen] = useState(false);

  const perks = [t('perks.free'), t('perks.noCard'), t('perks.instant')];

  return (
    <Box component="section">
      <SectionContainer sx={{ py: { xs: 8, md: 12 } }}>
        <Reveal duration={900}>
          <Box
            sx={{
              position: 'relative',
              borderRadius: 4,
              overflow: 'hidden',
              p: { xs: 4, md: 7 },
              textAlign: 'center',
              border: `1px solid ${tokens.outlineVariant}33`,
              bgcolor: tokens.surfaceContainerLow,
            }}
          >
            {/* Glow superior */}
            <Box
              aria-hidden
              sx={{
                position: 'absolute',
                top: '-30%',
                left: '50%',
                transform: 'translateX(-50%)',
                width: { xs: '140%', md: '80%' },
                height: '100%',
                background: `radial-gradient(ellipse at 50% 50%, ${tokens.primaryContainer}40 0%, ${tokens.secondaryContainer}1A 40%, transparent 70%)`,
                filter: 'blur(40px)',
                pointerEvents: 'none',
              }}
            />
            {/* Patrón de líneas diagonales sutiles */}
            <Box
              aria-hidden
              sx={{
                position: 'absolute',
                inset: 0,
                opacity: 0.04,
                backgroundImage: `repeating-linear-gradient(45deg, ${tokens.onSurface} 0, ${tokens.onSurface} 1px, transparent 1px, transparent 12px)`,
                pointerEvents: 'none',
              }}
            />

            <Stack
              spacing={3}
              alignItems="center"
              sx={{ position: 'relative', zIndex: 1, maxWidth: 640, mx: 'auto' }}
            >
              <Typography
                sx={{
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  letterSpacing: '0.18em',
                  textTransform: 'uppercase',
                  color: tokens.primary,
                }}
              >
                {t('eyebrow')}
              </Typography>

              <Typography
                component="h2"
                sx={{
                  fontSize: { xs: '2rem', md: '3rem' },
                  fontWeight: 900,
                  letterSpacing: '-0.03em',
                  lineHeight: 1,
                  textTransform: 'uppercase',
                  fontStyle: 'italic',
                  background: tokens.ctaGradient,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                {t('title')}
              </Typography>

              <Typography
                sx={{
                  color: tokens.onSurfaceVariant,
                  fontSize: { xs: '1rem', md: '1.0625rem' },
                  lineHeight: 1.6,
                  maxWidth: 520,
                }}
              >
                {t('description')}
              </Typography>

              {/* Perks chips row */}
              <Stack
                direction="row"
                spacing={{ xs: 1, md: 2 }}
                justifyContent="center"
                flexWrap="wrap"
                useFlexGap
                sx={{ gap: 1, pt: 1 }}
              >
                {perks.map((perk) => (
                  <Stack
                    key={perk}
                    direction="row"
                    alignItems="center"
                    spacing={0.75}
                    sx={{
                      bgcolor: tokens.surfaceContainerHigh,
                      border: `1px solid ${tokens.outlineVariant}33`,
                      borderRadius: 999,
                      px: 1.5,
                      py: 0.75,
                    }}
                  >
                    <CheckCircleIcon sx={{ fontSize: 14, color: tokens.success }} />
                    <Typography
                      sx={{
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        color: tokens.onSurface,
                        letterSpacing: '0.01em',
                      }}
                    >
                      {perk}
                    </Typography>
                  </Stack>
                ))}
              </Stack>

              <Stack
                direction={{ xs: 'column', sm: 'row' }}
                spacing={2}
                sx={{ pt: 2, width: { xs: '100%', sm: 'auto' } }}
              >
                <AppButton
                  component={Link}
                  href="/auth"
                  variant="primary"
                  size="large"
                  startIcon={<BoltIcon />}
                >
                  {t('cta')}
                </AppButton>
                <AppButton
                  variant="secondary"
                  size="large"
                  startIcon={<VpnKeyOutlinedIcon />}
                  onClick={() => setInviteOpen(true)}
                >
                  {t('secondaryCta')}
                </AppButton>
              </Stack>
            </Stack>
          </Box>
        </Reveal>
      </SectionContainer>

      <InviteCodeModal open={inviteOpen} onClose={() => setInviteOpen(false)} />
    </Box>
  );
};

interface InviteCodeModalProps {
  open: boolean;
  onClose: () => void;
}

const InviteCodeModal = ({ open, onClose }: InviteCodeModalProps) => {
  const t = useTranslations('home.finalCta.inviteModal');
  const router = useRouter();
  const [code, setCode] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleClose = () => {
    setCode('');
    setError(null);
    onClose();
  };

  const handleContinue = () => {
    const validation = validateInvitationCode(code);
    if (!validation.valid) {
      setError(validation.message ?? null);
      return;
    }
    const normalized = normalizeInvitationCode(code);
    router.push(`/auth?invite=${encodeURIComponent(normalized)}`);
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="xs" fullWidth>
      <DialogContent sx={{ p: 3 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1.5 }}>
          <Stack direction="row" alignItems="center" spacing={1.25}>
            <Box
              sx={{
                width: 36,
                height: 36,
                borderRadius: '10px',
                bgcolor: `${tokens.primary}14`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <VpnKeyOutlinedIcon sx={{ color: tokens.primary, fontSize: 18 }} />
            </Box>
            <Typography variant="h6" sx={{ fontWeight: 800 }}>
              {t('title')}
            </Typography>
          </Stack>
          <IconButton
            onClick={handleClose}
            size="small"
            aria-label={t('cancel')}
            sx={{ opacity: 0.7 }}
          >
            <CloseIcon />
          </IconButton>
        </Stack>

        <Typography
          variant="body2"
          sx={{ color: tokens.onSurfaceVariant, mb: 2.5, lineHeight: 1.6 }}
        >
          {t('description')}
        </Typography>

        <Stack
          component="form"
          spacing={2}
          onSubmit={(e) => {
            e.preventDefault();
            handleContinue();
          }}
        >
          <InvitationCodeInput
            autoFocus
            value={code}
            onChange={(e) => {
              setCode(e.target.value);
              if (error) setError(null);
            }}
            error={!!error}
            helperText={error ?? undefined}
          />

          <Stack direction="row" spacing={1.5} sx={{ pt: 0.5 }}>
            <AppButton variant="secondary" fullWidth onClick={handleClose}>
              {t('cancel')}
            </AppButton>
            <AppButton type="submit" fullWidth disabled={!code.trim()}>
              {t('continue')}
            </AppButton>
          </Stack>
        </Stack>
      </DialogContent>
    </Dialog>
  );
};

interface SocialLink {
  key: string;
  href: string;
  label: string;
  Icon: ComponentType<SvgIconProps>;
}

const SOCIAL_LINKS: ReadonlyArray<SocialLink> = [
  {
    key: 'web',
    href: 'https://awsug.cloud-manizales.com/',
    label: 'AWS UG Manizales web',
    Icon: PublicIcon,
  },
  {
    key: 'instagram',
    href: 'https://www.instagram.com/awsug.manizales',
    label: 'Instagram',
    Icon: InstagramIcon,
  },
  {
    key: 'linkedin',
    href: 'https://www.linkedin.com/company/aws-user-group-manizales',
    label: 'LinkedIn',
    Icon: LinkedInIcon,
  },
  {
    key: 'youtube',
    href: 'https://www.youtube.com/@AWSUserGroupManizales',
    label: 'YouTube',
    Icon: YouTubeIcon,
  },
  {
    key: 'github',
    href: 'https://github.com/AWSUG-Manizales',
    label: 'GitHub',
    Icon: GitHubIcon,
  },
  {
    key: 'whatsapp',
    href: 'https://chat.whatsapp.com/LnIZZOcyvzyGOOJlSPfihH',
    label: 'WhatsApp',
    Icon: WhatsAppIcon,
  },
];

const Footer = () => {
  const t = useTranslations('home.footer');
  const year = new Date().getFullYear();

  return (
    <Box
      component="footer"
      sx={{
        position: 'relative',
        borderTop: `1px solid ${tokens.outlineVariant}26`,
        bgcolor: tokens.surfaceContainerLowest,
        overflow: 'hidden',
      }}
    >
      {/* Banner image background — mismo asset que el hero */}
      <Box
        component="img"
        src="/hero-stadium.png"
        alt=""
        aria-hidden
        sx={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          opacity: 0.35,
          zIndex: 0,
        }}
      />
      {/* Gradient overlay — bottom→up fade hacia el fondo para asegurar legibilidad */}
      <Box
        aria-hidden
        sx={{
          position: 'absolute',
          inset: 0,
          background: `linear-gradient(180deg, ${tokens.background} 0%, ${tokens.background}D9 35%, ${tokens.background}B3 100%)`,
          zIndex: 1,
        }}
      />
      {/* Brand glow sutil — acento al centro */}
      <Box
        aria-hidden
        sx={{
          position: 'absolute',
          top: '40%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: { xs: '120%', md: '70%' },
          height: '120%',
          background: `radial-gradient(ellipse at 50% 50%, ${tokens.primaryContainer}1A 0%, transparent 60%)`,
          filter: 'blur(40px)',
          pointerEvents: 'none',
          zIndex: 2,
        }}
      />

      <SectionContainer sx={{ py: { xs: 6, md: 8 }, position: 'relative', zIndex: 3 }}>
        <Reveal>
          <Stack spacing={{ xs: 4, md: 5 }} alignItems="center" sx={{ textAlign: 'center' }}>
            <Stack direction="row" alignItems="center" spacing={1.25}>
              <Typography
                sx={{
                  fontSize: { xs: '0.9375rem', md: '1rem' },
                  fontWeight: 700,
                  color: tokens.onSurface,
                  letterSpacing: '0.02em',
                }}
              >
                {t('madeIn')}
              </Typography>
              <Box
                component="img"
                src="/manizales-flag.svg"
                alt="Bandera de Manizales"
                sx={{
                  width: 28,
                  height: 'auto',
                  borderRadius: '3px',
                  border: `1px solid ${tokens.outlineVariant}40`,
                  display: 'block',
                }}
              />
            </Stack>

            <Typography
              sx={{
                color: tokens.onSurfaceVariant,
                fontSize: '0.8125rem',
                maxWidth: 460,
                lineHeight: 1.5,
              }}
            >
              {t('community')}
            </Typography>

            <Stack direction="row" spacing={1} alignItems="center" aria-label={t('socialTitle')}>
              {SOCIAL_LINKS.map(({ key, href, label, Icon }) => (
                <Box
                  key={key}
                  component="a"
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  sx={{
                    width: 40,
                    height: 40,
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: tokens.onSurfaceVariant,
                    bgcolor: tokens.surfaceContainerHigh,
                    border: `1px solid ${tokens.outlineVariant}1A`,
                    transition: 'all 200ms ease',
                    '&:hover': {
                      color: tokens.primary,
                      bgcolor: tokens.surfaceContainerHighest,
                      borderColor: `${tokens.primary}40`,
                      transform: 'translateY(-2px)',
                    },
                  }}
                >
                  <Icon sx={{ fontSize: 18 }} />
                </Box>
              ))}
            </Stack>

            <Typography
              sx={{
                color: tokens.onSurfaceVariant,
                fontSize: '0.6875rem',
                fontWeight: 500,
                letterSpacing: '0.04em',
                pt: 1,
              }}
            >
              {t('rights', { year })}
            </Typography>
          </Stack>
        </Reveal>
      </SectionContainer>
    </Box>
  );
};
