'use client';

import { Controller, useForm, useWatch } from 'react-hook-form';
import { useLocale, useTranslations } from 'next-intl';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Alert from '@mui/material/Alert';
import Avatar from '@mui/material/Avatar';
import InputAdornment from '@mui/material/InputAdornment';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import SportsSoccerIcon from '@mui/icons-material/SportsSoccer';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import StadiumIcon from '@mui/icons-material/Stadium';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { es as esLocale } from 'date-fns/locale/es';
import { enUS as enLocale } from 'date-fns/locale/en-US';
import FormField from '@shared/components/atoms/FormField';
import AppButton from '@shared/components/atoms/AppButton';
import useSnackbar from '@shared/hooks/useSnackbar';
import { tokens } from '@lib/theme/theme';
import { getInitials } from '@shared/utils/string';
import type { MatchType } from '@lib/api/skorify';
import useCreateTournament from '../../hooks/useCreateTournament';

interface CreateTournamentFormValues {
  name: string;
  matchType: MatchType | '';
  startDate: Date | null;
  endDate: Date | null;
}

interface CreateTournamentFormProps {
  onCreated?: () => void;
}

const CreateTournamentForm = ({ onCreated }: CreateTournamentFormProps) => {
  const t = useTranslations('tournaments');
  const locale = useLocale();
  const adapterLocale = locale.startsWith('es') ? esLocale : enLocale;
  const snackbar = useSnackbar();
  const { createTournament, isLoading, error } = useCreateTournament();

  const { control, handleSubmit } = useForm<CreateTournamentFormValues>({
    defaultValues: { name: '', matchType: '', startDate: null, endDate: null },
  });

  const nameValue = useWatch({ control, name: 'name' });
  const startDateValue = useWatch({ control, name: 'startDate' });

  const matchTypeOptions = [
    { value: 'single_match_per_round', label: t('matchTypeSingle') },
    { value: 'home_and_away_per_round', label: t('matchTypeHomeAway') },
  ];

  const onSubmit = async (values: CreateTournamentFormValues) => {
    if (!values.matchType || !values.startDate || !values.endDate) return;

    const name = values.name.trim();
    const tournament = await createTournament({
      name,
      matchType: values.matchType,
      startDate: values.startDate.toISOString(),
      endDate: values.endDate.toISOString(),
    });

    if (tournament) {
      snackbar.success(t('createSuccess', { name: tournament.name }));
      onCreated?.();
    } else {
      snackbar.error(t('createError'));
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={adapterLocale}>
      <Box
        component="form"
        onSubmit={handleSubmit(onSubmit)}
        sx={{ px: { xs: 3, md: 4 }, pt: 1, pb: 4, maxWidth: 520, mx: 'auto' }}
      >
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
                <EmojiEventsIcon sx={{ fontSize: '2rem', opacity: 0.4 }} />
              )}
            </Avatar>
          </Box>

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
            <FormField<CreateTournamentFormValues>
              name="name"
              control={control}
              rules={{ required: t('nameRequired') }}
              placeholder={t('namePlaceholder')}
              fullWidth
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <EmojiEventsIcon
                        sx={{ color: tokens.onSurfaceVariant, fontSize: '1.25rem' }}
                      />
                    </InputAdornment>
                  ),
                },
              }}
            />
          </Box>

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
              {t('matchTypeLabel')}
            </Typography>
            <FormField<CreateTournamentFormValues>
              name="matchType"
              control={control}
              rules={{ required: t('matchTypeRequired') }}
              options={matchTypeOptions}
              fullWidth
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <StadiumIcon sx={{ color: tokens.onSurfaceVariant, fontSize: '1.25rem' }} />
                    </InputAdornment>
                  ),
                },
              }}
            />
          </Box>

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
              {t('startDateLabel')}
            </Typography>
            <Controller
              control={control}
              name="startDate"
              rules={{ required: t('startDateRequired') }}
              render={({ field, fieldState }) => (
                <DatePicker
                  value={field.value}
                  onChange={field.onChange}
                  inputRef={field.ref}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      onBlur: field.onBlur,
                      error: !!fieldState.error,
                      helperText: fieldState.error?.message,
                    },
                  }}
                />
              )}
            />
          </Box>

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
              {t('endDateLabel')}
            </Typography>
            <Controller
              control={control}
              name="endDate"
              rules={{
                required: t('endDateRequired'),
                validate: (value) =>
                  !startDateValue || !value || value > startDateValue || t('endDateBeforeStart'),
              }}
              render={({ field, fieldState }) => (
                <DatePicker
                  value={field.value}
                  onChange={field.onChange}
                  inputRef={field.ref}
                  minDate={startDateValue ?? undefined}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      onBlur: field.onBlur,
                      error: !!fieldState.error,
                      helperText: fieldState.error?.message,
                    },
                  }}
                />
              )}
            />
          </Box>
        </Box>

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
          <Typography
            sx={{ fontSize: '0.8125rem', color: tokens.onSurfaceVariant, lineHeight: 1.6 }}
          >
            {t('adminInfoBefore')}{' '}
            <Box component="span" sx={{ color: tokens.primary, fontWeight: 700 }}>
              {t('adminRole')}
            </Box>{' '}
            {t('adminInfoAfter')}
          </Typography>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mt: 2, borderRadius: '10px' }}>
            {error.message}
          </Alert>
        )}

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, my: 3 }}>
          <Box sx={{ flex: 1, height: '1px', bgcolor: `${tokens.outlineVariant}26` }} />
          <SportsSoccerIcon sx={{ color: `${tokens.onSurfaceVariant}4D`, fontSize: '1.5rem' }} />
          <Box sx={{ flex: 1, height: '1px', bgcolor: `${tokens.outlineVariant}26` }} />
        </Box>

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
    </LocalizationProvider>
  );
};

export default CreateTournamentForm;
