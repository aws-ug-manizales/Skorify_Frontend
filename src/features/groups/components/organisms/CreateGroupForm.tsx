'use client';

import { useMemo } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import Avatar from '@mui/material/Avatar';
import InputAdornment from '@mui/material/InputAdornment';
import GroupsIcon from '@mui/icons-material/Groups';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import SportsSoccerIcon from '@mui/icons-material/SportsSoccer';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import FormField, { type FormFieldOption } from '@shared/components/atoms/FormField';
import AppButton from '@shared/components/atoms/AppButton';
import { tokens } from '@lib/theme/theme';
import { useFilterTournaments } from '@features/tournaments/hooks/useFilterTournaments';
import useCreateGroup from '../../hooks/useCreateGroup';
import type { CreateGroupFormValues } from '../../types';
import { getInitials } from '@shared/utils/string';

const CreateGroupForm = () => {
  const t = useTranslations('groups');
  const router = useRouter();
  const { createGroup, isLoading, error } = useCreateGroup();
  const { data: tournaments, isLoading: tournamentsLoading } = useFilterTournaments();

  const { control, handleSubmit } = useForm<CreateGroupFormValues>({
    defaultValues: { name: '', tournamentId: '' },
  });

  const nameValue = useWatch({ control, name: 'name' });

  const tournamentOptions = useMemo<FormFieldOption[]>(
    () => tournaments.map((tournament) => ({ label: tournament.name, value: tournament.id })),
    [tournaments],
  );

  const noTournamentsAvailable = !tournamentsLoading && tournamentOptions.length === 0;

  const onSubmit = async (values: CreateGroupFormValues) => {
    const group = await createGroup({
      name: values.name,
      tournamentId: values.tournamentId,
    });

    if (group) {
      sessionStorage.setItem('justCreatedGroup', group.id);
      router.push(`/groups/${group.id}`);
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit(onSubmit)}
      sx={{ px: { xs: 3, md: 4 }, pt: 1, pb: 4, maxWidth: 520, mx: 'auto' }}
    >
      {/* Title */}
      <Box sx={{ mb: 1 }}>
        <Typography
          sx={{
            fontSize: { xs: '2.25rem', md: '2.75rem' },
            fontWeight: 900,
            letterSpacing: '-0.03em',
            textTransform: 'uppercase',
            lineHeight: 1,
            color: tokens.onSurface,
          }}
        >
          {t('createTitleLine1')}{' '}
          <Box
            component="span"
            sx={{
              background: tokens.ctaGradient,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            {t('createTitleLine2')}
          </Box>
        </Typography>
        <Typography
          sx={{ mt: 1.5, fontSize: '0.875rem', color: tokens.onSurfaceVariant, lineHeight: 1.6 }}
        >
          {t('createSubtitle')}
        </Typography>
      </Box>

      {/* No tournaments notice */}
      {noTournamentsAvailable && (
        <Alert
          severity="info"
          icon={<EmojiEventsIcon fontSize="inherit" />}
          sx={{
            mt: 3,
            borderRadius: '12px',
            bgcolor: `${tokens.primary}14`,
            color: tokens.onSurface,
            border: `1px solid ${tokens.primary}33`,
            '& .MuiAlert-icon': { color: tokens.primary, alignItems: 'center' },
          }}
        >
          <AlertTitle sx={{ fontWeight: 800, mb: 0.5 }}>{t('noTournamentsTitle')}</AlertTitle>
          <Typography
            sx={{ fontSize: '0.8125rem', color: tokens.onSurfaceVariant, lineHeight: 1.6 }}
          >
            {t('noTournamentsMessage')}
          </Typography>
        </Alert>
      )}

      {/* Form Card */}
      <Box
        sx={{
          mt: 4,
          bgcolor: tokens.surfaceContainerLow,
          borderRadius: '16px',
          p: 3,
          display: 'flex',
          flexDirection: 'column',
          gap: 2.5,
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'center', pb: 1 }}>
          <Avatar
            sx={{
              width: 80,
              height: 80,
              background: nameValue.trim() ? tokens.ctaGradient : tokens.surfaceContainerHighest,
              fontSize: nameValue.trim() ? '1.75rem' : '1.25rem',
              fontWeight: 900,
              letterSpacing: '-0.02em',
              color: tokens.onSurface,
              transition: 'background 300ms, font-size 200ms',
            }}
          >
            {nameValue.trim() ? (
              getInitials(nameValue)
            ) : (
              <GroupsIcon sx={{ fontSize: '2rem', opacity: 0.4 }} />
            )}
          </Avatar>
        </Box>

        {/* Tournament select */}
        <Box>
          <Typography
            sx={{
              fontSize: '0.625rem',
              fontWeight: 700,
              color: tokens.primary,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              mb: 1,
            }}
          >
            {t('tournamentLabel')}
          </Typography>
          <FormField<CreateGroupFormValues>
            name="tournamentId"
            control={control}
            rules={{ required: t('tournamentRequired') }}
            select
            fullWidth
            disabled={tournamentsLoading || tournamentOptions.length === 0}
            placeholder={t('tournamentPlaceholder')}
            options={tournamentOptions}
            helperText={
              tournamentsLoading
                ? t('tournamentLoading')
                : tournamentOptions.length === 0
                  ? t('tournamentEmpty')
                  : undefined
            }
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <EmojiEventsIcon sx={{ color: tokens.onSurfaceVariant, fontSize: '1.25rem' }} />
                  </InputAdornment>
                ),
              },
            }}
          />
        </Box>

        {/* Name field */}
        <Box>
          <Typography
            sx={{
              fontSize: '0.625rem',
              fontWeight: 700,
              color: tokens.primary,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              mb: 1,
            }}
          >
            {t('nameLabel')}
          </Typography>
          <FormField<CreateGroupFormValues>
            name="name"
            control={control}
            rules={{ required: t('nameRequired') }}
            placeholder={t('namePlaceholder')}
            fullWidth
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <GroupsIcon sx={{ color: tokens.onSurfaceVariant, fontSize: '1.25rem' }} />
                  </InputAdornment>
                ),
              },
            }}
          />
        </Box>
      </Box>

      {/* Admin info card */}
      <Box
        sx={{
          mt: 3,
          bgcolor: tokens.surfaceContainer,
          borderRadius: '12px',
          p: 2.5,
          display: 'flex',
          gap: 1.5,
          alignItems: 'flex-start',
        }}
      >
        <InfoOutlinedIcon
          sx={{ color: tokens.primary, fontSize: '1.1rem', mt: 0.15, flexShrink: 0 }}
        />
        <Typography sx={{ fontSize: '0.8125rem', color: tokens.onSurfaceVariant, lineHeight: 1.6 }}>
          {t('adminInfoBefore')}{' '}
          <Box component="span" sx={{ color: tokens.primary, fontWeight: 700 }}>
            {t('adminRole')}
          </Box>
          {'. '}
          {t('adminInfoAfter')}
        </Typography>
      </Box>

      {/* Error */}
      {error && (
        <Alert severity="error" sx={{ mt: 2, borderRadius: '10px' }}>
          {error.message}
        </Alert>
      )}

      {/* Divider with soccer ball */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, my: 3 }}>
        <Box sx={{ flex: 1, height: '1px', bgcolor: `${tokens.outlineVariant}26` }} />
        <SportsSoccerIcon sx={{ color: `${tokens.onSurfaceVariant}4D`, fontSize: '1.5rem' }} />
        <Box sx={{ flex: 1, height: '1px', bgcolor: `${tokens.outlineVariant}26` }} />
      </Box>

      {/* CTA Button */}
      <AppButton
        type="submit"
        variant="primary"
        loading={isLoading}
        fullWidth
        endIcon={<ArrowForwardIcon />}
      >
        {t('createButton')}
      </AppButton>
    </Box>
  );
};

export default CreateGroupForm;
