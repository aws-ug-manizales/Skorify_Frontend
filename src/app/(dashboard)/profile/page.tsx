'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { useForm, FormProvider } from 'react-hook-form';

import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import LinearProgress from '@mui/material/LinearProgress';
import ListItemButton from '@mui/material/ListItemButton';
import Paper from '@mui/material/Paper';
import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import BoltIcon from '@mui/icons-material/Bolt';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import CloseIcon from '@mui/icons-material/Close';
import EmailIcon from '@mui/icons-material/Email';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import GpsFixedIcon from '@mui/icons-material/GpsFixed';
import GroupsIcon from '@mui/icons-material/Groups';
import PercentIcon from '@mui/icons-material/Percent';
import PersonIcon from '@mui/icons-material/Person';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import SportsScoreIcon from '@mui/icons-material/SportsScore';

import { tokens } from '@lib/theme/theme';
import AppButton from '@shared/components/atoms/AppButton';
import AppCard from '@shared/components/molecules/AppCard';
import FormField from '@shared/components/atoms/FormField';
import UploadFile from '@shared/components/atoms/UploadFile';
import { useUserGroups, type UserGroupSummary } from '@features/groups';

const PARTICIPATION = 85;
const STREAK_TOTAL = 9;
const STREAK_ACTIVE = 7;
const STREAK_COUNT = 12;
const TOTAL_POINTS = 2450;

const STAT_ITEMS = [
  { key: 'exact', value: '25 / 100', Icon: GpsFixedIcon, color: tokens.success },
  { key: 'partial', value: '40 / 100', Icon: ShowChartIcon, color: tokens.info },
  { key: 'accuracy', value: '45%', Icon: PercentIcon, color: tokens.secondary },
  { key: 'total', value: '120', Icon: SportsScoreIcon, color: tokens.primary },
] as const;

const numberFormatter = new Intl.NumberFormat('es-CO');

export default function ProfileDashboard() {
  const t = useTranslations('profile');
  const [showModal, setShowModal] = useState(false);

  const [userData, setUserData] = useState({
    fullName: 'James Rodriguez',
    handle: '@el_10',
    email: 'james@skorify.com',
  });

  const [avatarImage, setAvatarImage] = useState<string | null>(null);
  const { groups, isLoading: groupsLoading } = useUserGroups();

  const methods = useForm({ values: userData });

  const handleOpenModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  const onSubmit = (data: typeof userData) => {
    setUserData(data);
    handleCloseModal();
  };

  const handleAvatarSelect = ([file]: File[]) => {
    setAvatarImage(URL.createObjectURL(file));
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        px: { xs: 2, md: 3 },
        py: { xs: 3, md: 5 },
        display: 'flex',
        justifyContent: 'center',
      }}
    >
      <Box
        sx={{
          width: '100%',
          maxWidth: 1100,
          display: 'grid',
          gridTemplateColumns: { xs: 'minmax(0, 1fr)', md: '360px minmax(0, 1fr)' },
          gap: { xs: 2, md: 3 },
        }}
      >
        <Paper
          component="aside"
          elevation={1}
          sx={{ p: { xs: 2.5, md: 3 }, borderRadius: 2, alignSelf: 'start' }}
          aria-label={t('title')}
        >
          <Stack spacing={2.5}>
            <IdentityCard
              userData={userData}
              avatarImage={avatarImage}
              onAvatarSelect={handleAvatarSelect}
              onEdit={handleOpenModal}
              t={t}
            />

            <GroupsCard groups={groups} loading={groupsLoading} t={t} />
          </Stack>
        </Paper>

        <Paper
          component="main"
          elevation={1}
          sx={{ p: { xs: 2.5, md: 3 }, borderRadius: 2, alignSelf: 'start' }}
          aria-label={t('stats.title')}
        >
          <Stack spacing={3}>
            <Typography variant="h4" component="h2" sx={{ fontWeight: 900 }}>
              {t('stats.title')}
            </Typography>

            <Grid container spacing={2}>
              {STAT_ITEMS.map(({ key, value, Icon, color }) => (
                <Grid key={key} size={{ xs: 6, md: 6, lg: 3 }}>
                  <AppCard sx={{ height: '100%' }}>
                    <Stack
                      alignItems="center"
                      spacing={1.25}
                      sx={{ px: 1.5, py: 2.5, minHeight: 140, justifyContent: 'center' }}
                    >
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          width: 40,
                          height: 40,
                          borderRadius: '50%',
                          bgcolor: `${color}14`,
                        }}
                      >
                        <Icon sx={{ color, fontSize: 22 }} />
                      </Box>
                      <Typography
                        sx={{
                          color: tokens.onSurface,
                          fontSize: { xs: '1.25rem', md: '1.5rem' },
                          fontWeight: 900,
                          lineHeight: 1.1,
                          whiteSpace: 'nowrap',
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
                          textAlign: 'center',
                          fontSize: '0.6875rem',
                        }}
                      >
                        {t(`stats.${key}`)}
                      </Typography>
                    </Stack>
                  </AppCard>
                </Grid>
              ))}
            </Grid>

            <Stack spacing={2.5}>
              <AppCard>
                <Box sx={{ p: 3 }}>
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                    sx={{ mb: 2 }}
                  >
                    <Typography
                      variant="overline"
                      sx={{ color: tokens.onSurface, fontWeight: 800, letterSpacing: '0.08em' }}
                    >
                      {t('participation')}
                    </Typography>
                    <Typography sx={{ color: tokens.onSurface, fontWeight: 900 }}>
                      {PARTICIPATION}%
                    </Typography>
                  </Stack>
                  <LinearProgress
                    variant="determinate"
                    value={PARTICIPATION}
                    aria-label={t('participation')}
                    sx={{
                      height: 6,
                      borderRadius: 10,
                      bgcolor: tokens.surfaceContainerHigh,
                      '& .MuiLinearProgress-bar': {
                        borderRadius: 10,
                        background: tokens.ctaGradient,
                      },
                    }}
                  />
                </Box>
              </AppCard>

              <AppCard>
                <Box sx={{ p: 3 }}>
                  <Stack direction="row" alignItems="center" spacing={1.75} sx={{ mb: 2 }}>
                    <Box
                      sx={{
                        width: 40,
                        height: 40,
                        borderRadius: '50%',
                        bgcolor: `${tokens.secondary}14`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <BoltIcon sx={{ color: tokens.secondary, fontSize: 22 }} />
                    </Box>
                    <Stack spacing={0.25}>
                      <Typography
                        sx={{ fontSize: '1rem', fontWeight: 800, textTransform: 'uppercase' }}
                      >
                        {t('streakTitle')}
                      </Typography>
                      <Typography variant="body2" sx={{ color: tokens.onSurfaceVariant }}>
                        {t('streakSubtitle', { count: STREAK_COUNT })}
                      </Typography>
                    </Stack>
                  </Stack>
                  <Stack
                    direction="row"
                    spacing={0.75}
                    role="progressbar"
                    aria-valuenow={STREAK_ACTIVE}
                    aria-valuemin={0}
                    aria-valuemax={STREAK_TOTAL}
                    aria-label={t('streakTitle')}
                  >
                    {Array.from({ length: STREAK_TOTAL }).map((_, i) => (
                      <Box
                        key={i}
                        sx={{
                          flex: 1,
                          height: 6,
                          borderRadius: 0.5,
                          bgcolor:
                            i < STREAK_ACTIVE ? tokens.secondary : tokens.surfaceContainerHigh,
                        }}
                      />
                    ))}
                  </Stack>
                </Box>
              </AppCard>
            </Stack>
          </Stack>
        </Paper>
      </Box>

      <Dialog open={showModal} onClose={handleCloseModal} maxWidth="xs" fullWidth>
        <DialogContent sx={{ p: 3 }}>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            sx={{ mb: 2.5 }}
          >
            <Typography variant="h6">{t('editPersonalData')}</Typography>
            <IconButton
              onClick={handleCloseModal}
              size="small"
              aria-label={t('editPersonalData')}
              sx={{ opacity: 0.7 }}
            >
              <CloseIcon />
            </IconButton>
          </Stack>

          <FormProvider {...methods}>
            <Stack component="form" onSubmit={methods.handleSubmit(onSubmit)} spacing={2}>
              <FormField name="fullName" label={t('fullNameLabel')} control={methods.control} />
              <FormField name="handle" label={t('handleLabel')} control={methods.control} />
              <FormField name="email" label={t('emailLabel')} control={methods.control} />
              <Box sx={{ mt: 0.5 }}>
                <AppButton type="submit" fullWidth>
                  {t('saveChanges')}
                </AppButton>
              </Box>
            </Stack>
          </FormProvider>
        </DialogContent>
      </Dialog>
    </Box>
  );
}

interface IdentityCardProps {
  userData: { fullName: string; handle: string; email: string };
  avatarImage: string | null;
  onAvatarSelect: (files: File[]) => void;
  onEdit: () => void;
  t: ReturnType<typeof useTranslations<'profile'>>;
}

const IdentityCard = ({ userData, avatarImage, onAvatarSelect, onEdit, t }: IdentityCardProps) => (
  <AppCard>
    <Stack alignItems="center" sx={{ px: 3, py: 3.5, textAlign: 'center' }} spacing={2}>
      <Box sx={{ position: 'relative', width: 88, height: 88 }}>
        <Box
          sx={{
            position: 'absolute',
            inset: -8,
            background: tokens.ctaGradient,
            borderRadius: '50%',
            opacity: 0.18,
            filter: 'blur(20px)',
          }}
        />
        <Avatar
          src={avatarImage ?? undefined}
          sx={{
            position: 'relative',
            width: '100%',
            height: '100%',
            bgcolor: tokens.surfaceContainerHigh,
            border: `1px solid ${tokens.outlineVariant}40`,
          }}
        >
          <PersonIcon sx={{ color: tokens.primary, fontSize: 40 }} />
        </Avatar>
        <UploadFile
          accept="image/*"
          onSelect={onAvatarSelect}
          size="small"
          aria-label={t('editProfile')}
          sx={{
            position: 'absolute',
            bottom: -2,
            right: -2,
            bgcolor: tokens.surfaceContainerHighest,
            color: tokens.onSurface,
            border: `1px solid ${tokens.outlineVariant}66`,
            width: 30,
            height: 30,
            '&:hover': { bgcolor: tokens.surfaceContainerHigh },
          }}
        >
          <PhotoCameraIcon sx={{ fontSize: 14 }} />
        </UploadFile>
      </Box>

      <Stack spacing={0.5} alignItems="center" sx={{ width: '100%' }}>
        <Typography
          sx={{ fontSize: '1.125rem', fontWeight: 800, wordBreak: 'break-word', lineHeight: 1.2 }}
        >
          {userData.fullName}
        </Typography>
        <Typography sx={{ color: tokens.primary, fontWeight: 700, fontSize: '0.8125rem' }}>
          {userData.handle}
        </Typography>
        <Stack
          direction="row"
          alignItems="center"
          spacing={0.5}
          sx={{ color: tokens.onSurfaceVariant, mt: 0.25 }}
        >
          <EmailIcon sx={{ fontSize: 13 }} />
          <Typography sx={{ fontSize: '0.75rem', wordBreak: 'break-all' }}>
            {userData.email}
          </Typography>
        </Stack>
      </Stack>

      <Divider flexItem sx={{ borderColor: `${tokens.outlineVariant}26` }} />

      <Stack alignItems="center" spacing={0.5}>
        <Typography
          variant="overline"
          sx={{
            color: tokens.onSurfaceVariant,
            fontWeight: 700,
            letterSpacing: '0.1em',
            lineHeight: 1,
            fontSize: '0.6875rem',
          }}
        >
          {t('totalPointsLabel')}
        </Typography>
        <Stack direction="row" alignItems="baseline" spacing={0.75}>
          <Typography
            sx={{
              fontSize: '2.25rem',
              fontWeight: 900,
              lineHeight: 1,
              color: tokens.onSurface,
              fontVariantNumeric: 'tabular-nums',
            }}
          >
            {numberFormatter.format(TOTAL_POINTS)}
          </Typography>
          <EmojiEventsIcon sx={{ fontSize: 22, color: tokens.primary }} />
        </Stack>
      </Stack>

      <Box sx={{ width: '100%', pt: 0.5 }}>
        <AppButton onClick={onEdit} fullWidth>
          {t('editProfile')}
        </AppButton>
      </Box>
    </Stack>
  </AppCard>
);

interface GroupsCardProps {
  groups: UserGroupSummary[];
  loading: boolean;
  t: ReturnType<typeof useTranslations<'profile'>>;
}

const GroupsCard = ({ groups, loading, t }: GroupsCardProps) => (
  <AppCard>
    <Box sx={{ p: 1.5 }}>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        sx={{ mb: 1, minHeight: 24 }}
      >
        <Typography
          variant="overline"
          sx={{
            color: tokens.onSurface,
            fontWeight: 800,
            letterSpacing: '0.08em',
          }}
        >
          {t('groups.title')}
        </Typography>
        {groups.length > 0 && !loading && (
          <Typography
            component={Link}
            href="/groups"
            sx={{
              fontSize: '0.75rem',
              fontWeight: 700,
              color: tokens.primary,
              textDecoration: 'none',
              letterSpacing: '0.04em',
              '&:hover': { textDecoration: 'underline' },
            }}
          >
            {t('groups.viewAll')}
          </Typography>
        )}
      </Stack>

      {loading ? (
        <Stack spacing={1}>
          <Skeleton variant="rounded" height={56} />
          <Skeleton variant="rounded" height={56} />
        </Stack>
      ) : groups.length === 0 ? (
        <Stack alignItems="center" spacing={1} sx={{ py: 2, px: 1, textAlign: 'center' }}>
          <Box
            sx={{
              width: 44,
              height: 44,
              borderRadius: '50%',
              bgcolor: tokens.surfaceContainerHigh,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <GroupsIcon sx={{ color: tokens.onSurfaceVariant, fontSize: 22 }} />
          </Box>
          <Typography sx={{ fontWeight: 700, fontSize: '0.875rem' }}>
            {t('groups.emptyTitle')}
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: tokens.onSurfaceVariant,
              maxWidth: 240,
              lineHeight: 1.4,
              fontSize: '0.75rem',
            }}
          >
            {t('groups.emptySubtitle')}
          </Typography>
          <Box sx={{ pt: 0.5, width: '100%' }}>
            <AppButton
              variant="primary"
              startIcon={<AddCircleOutlineIcon />}
              component={Link}
              href="/groups"
              fullWidth
            >
              {t('groups.emptyCta')}
            </AppButton>
          </Box>
        </Stack>
      ) : (
        <Stack spacing={0.5}>
          {groups.map((group) => (
            <ListItemButton
              key={group.id}
              component={Link}
              href={`/groups/${group.id}`}
              sx={{
                borderRadius: 1.25,
                bgcolor: 'rgba(255,255,255,0.03)',
                px: 1.25,
                py: 0.875,
                minHeight: 48,
                gap: 1,
                transition: 'background-color 200ms ease',
                '&:hover': { bgcolor: 'rgba(255,255,255,0.06)' },
              }}
            >
              <Stack sx={{ flex: 1, minWidth: 0 }}>
                <Typography
                  sx={{
                    fontSize: '0.875rem',
                    fontWeight: 700,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                  title={group.name}
                >
                  {group.name}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ color: tokens.onSurfaceVariant, fontSize: '0.75rem' }}
                >
                  {t('groups.members', { count: group.memberCount })}
                </Typography>
              </Stack>
              <Stack direction="row" alignItems="center" spacing={0.5} sx={{ flexShrink: 0 }}>
                <Chip
                  label={`#${group.rank}`}
                  size="small"
                  sx={{
                    bgcolor: `${tokens.secondary}26`,
                    color: tokens.secondary,
                    fontWeight: 800,
                    height: 22,
                    fontSize: '0.6875rem',
                  }}
                />
                <ChevronRightIcon sx={{ color: tokens.onSurfaceVariant, fontSize: 18 }} />
              </Stack>
            </ListItemButton>
          ))}
        </Stack>
      )}
    </Box>
  </AppCard>
);
