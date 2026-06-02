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
import IconButton from '@mui/material/IconButton';
import ListItemButton from '@mui/material/ListItemButton';
import Paper from '@mui/material/Paper';
import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import CloseIcon from '@mui/icons-material/Close';
import EmailIcon from '@mui/icons-material/Email';
import GroupsIcon from '@mui/icons-material/Groups';
import PersonIcon from '@mui/icons-material/Person';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';

import { tokens } from '@lib/theme/theme';
import AppButton from '@shared/components/atoms/AppButton';
import AppCard from '@shared/components/molecules/AppCard';
import FormField from '@shared/components/atoms/FormField';
import UploadFile from '@shared/components/atoms/UploadFile';
import { useUserGroups, type UserGroupSummary } from '@features/groups';
import { useAuthSession } from '@features/auth';

interface ProfileFormData {
  fullName: string;
  email: string;
}

export default function ProfileDashboard() {
  const t = useTranslations('profile');
  const { session } = useAuthSession();
  const [showModal, setShowModal] = useState(false);

  const [editedData, setEditedData] = useState<ProfileFormData | null>(null);
  const userData: ProfileFormData = editedData ?? {
    fullName: session?.user.displayName ?? '',
    email: session?.user.email ?? '',
  };

  const [avatarImage, setAvatarImage] = useState<string | null>(null);
  const { groups, isLoading: groupsLoading } = useUserGroups();

  const methods = useForm({ values: userData });

  const handleOpenModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  const onSubmit = (data: ProfileFormData) => {
    setEditedData(data);
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
      <Box sx={{ width: '100%', maxWidth: 420 }}>
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
  userData: ProfileFormData;
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
