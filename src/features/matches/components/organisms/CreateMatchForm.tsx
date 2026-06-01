'use client';

import { useMemo, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useLocale, useTranslations } from 'next-intl';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import Box from '@mui/material/Box';
import InputAdornment from '@mui/material/InputAdornment';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import GroupsIcon from '@mui/icons-material/Groups';
import SportsSoccerIcon from '@mui/icons-material/SportsSoccer';
import StadiumIcon from '@mui/icons-material/Stadium';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { es as esLocale } from 'date-fns/locale/es';
import { enUS as enLocale } from 'date-fns/locale/en-US';
import FormField, { type FormFieldOption } from '@shared/components/atoms/FormField';
import AppButton from '@shared/components/atoms/AppButton';
import { tokens } from '@lib/theme/theme';
import { useFilterTournaments } from '@features/tournaments/hooks/useFilterTournaments';
import { useCreateMatch } from '../../hooks/useCreateMatch';
import type { CreateMatchPayload, MatchStage } from '@lib/api/skorify';

type FormValues = {
  tournamentId: string;
  homeTeamId: string;
  awayTeamId: string;
  kickOff: Date | null;
  stage: MatchStage;
  venue: string;
};

const STAGE_OPTIONS: FormFieldOption[] = [
  { label: 'Fase de grupos', value: 'group' },
  { label: 'Finales', value: 'finals' },
];

const FIELD_LABEL_SX = {
  fontSize: '0.625rem',
  fontWeight: 700,
  color: tokens.primary,
  letterSpacing: '0.12em',
  textTransform: 'uppercase',
  mb: 1,
} as const;

interface CreateMatchFormProps {
  onCreated?: () => void;
}

const CreateMatchForm = ({ onCreated }: CreateMatchFormProps = {}) => {
  const t = useTranslations('matchesAdmin');
  const locale = useLocale();
  const adapterLocale = locale.startsWith('es') ? esLocale : enLocale;
  const { createMatch, isLoading, error, data } = useCreateMatch();
  const { data: tournaments, isLoading: tournamentsLoading } = useFilterTournaments();
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const { control, handleSubmit, reset } = useForm<FormValues>({
    defaultValues: {
      tournamentId: '',
      homeTeamId: '',
      awayTeamId: '',
      kickOff: null,
      stage: 'group',
      venue: '',
    },
  });

  const tournamentOptions = useMemo<FormFieldOption[]>(
    () => tournaments.map((tournament) => ({ label: tournament.name, value: tournament.id })),
    [tournaments],
  );

  const onSubmit = async (values: FormValues) => {
    setSuccessMsg(null);
    if (!values.kickOff) return;
    const payload: CreateMatchPayload = {
      tournamentId: values.tournamentId,
      homeTeamId: values.homeTeamId.trim(),
      awayTeamId: values.awayTeamId.trim(),
      kickOff: values.kickOff.toISOString(),
      stage: values.stage,
      venue: values.venue.trim() || undefined,
    };

    const result = await createMatch(payload);
    if (result) {
      setSuccessMsg(t('successMessage'));
      reset({
        tournamentId: values.tournamentId,
        homeTeamId: '',
        awayTeamId: '',
        kickOff: null,
        stage: values.stage,
        venue: '',
      });
      onCreated?.();
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
            {t('titleLine1')}{' '}
            <Box
              component="span"
              sx={{
                background: tokens.ctaGradient,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              {t('titleLine2')}
            </Box>
          </Typography>
          <Typography
            sx={{ mt: 1.5, fontSize: '0.875rem', color: tokens.onSurfaceVariant, lineHeight: 1.6 }}
          >
            {t('subtitle')}
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
          <Box>
            <Typography sx={FIELD_LABEL_SX}>{t('tournamentLabel')}</Typography>
            <FormField<FormValues>
              name="tournamentId"
              control={control}
              rules={{ required: t('tournamentRequired') }}
              select
              fullWidth
              placeholder={t('tournamentPlaceholder')}
              options={tournamentOptions}
              disabled={tournamentsLoading || tournamentOptions.length === 0}
              helperText={tournamentOptions.length === 0 ? t('noTournaments') : undefined}
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

          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <Box sx={{ flex: 1 }}>
              <Typography sx={FIELD_LABEL_SX}>{t('homeTeamLabel')}</Typography>
              <FormField<FormValues>
                name="homeTeamId"
                control={control}
                rules={{ required: t('homeTeamRequired') }}
                fullWidth
                placeholder={t('teamIdPlaceholder')}
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
            <Box sx={{ flex: 1 }}>
              <Typography sx={FIELD_LABEL_SX}>{t('awayTeamLabel')}</Typography>
              <FormField<FormValues>
                name="awayTeamId"
                control={control}
                rules={{ required: t('awayTeamRequired') }}
                fullWidth
                placeholder={t('teamIdPlaceholder')}
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
          </Stack>

          <Box>
            <Typography sx={FIELD_LABEL_SX}>{t('kickOffLabel')}</Typography>
            <Controller
              control={control}
              name="kickOff"
              rules={{ required: t('kickOffRequired') }}
              render={({ field, fieldState }) => (
                <DateTimePicker
                  value={field.value}
                  onChange={field.onChange}
                  inputRef={field.ref}
                  ampm={false}
                  format="dd/MM/yyyy HH:mm"
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      onBlur: field.onBlur,
                      error: !!fieldState.error,
                      helperText: fieldState.error?.message,
                      slotProps: {
                        input: {
                          startAdornment: (
                            <InputAdornment position="start">
                              <CalendarMonthIcon
                                sx={{ color: tokens.onSurfaceVariant, fontSize: '1.25rem' }}
                              />
                            </InputAdornment>
                          ),
                        },
                      },
                    },
                  }}
                />
              )}
            />
          </Box>

          <Box>
            <Typography sx={FIELD_LABEL_SX}>{t('stageLabel')}</Typography>
            <FormField<FormValues>
              name="stage"
              control={control}
              select
              fullWidth
              options={STAGE_OPTIONS}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <SportsSoccerIcon
                        sx={{ color: tokens.onSurfaceVariant, fontSize: '1.25rem' }}
                      />
                    </InputAdornment>
                  ),
                },
              }}
            />
          </Box>

          <Box>
            <Typography sx={FIELD_LABEL_SX}>{t('venueLabel')}</Typography>
            <FormField<FormValues>
              name="venue"
              control={control}
              fullWidth
              placeholder={t('venuePlaceholder')}
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
        </Box>

        {successMsg && (
          <Alert
            severity="success"
            icon={<SportsSoccerIcon fontSize="inherit" />}
            sx={{ mt: 2, borderRadius: '12px' }}
          >
            <AlertTitle sx={{ fontWeight: 800 }}>{t('successTitle')}</AlertTitle>
            {successMsg}
            {data && (
              <Typography
                sx={{
                  fontSize: '0.75rem',
                  color: tokens.onSurfaceVariant,
                  mt: 0.5,
                  fontFamily: 'monospace',
                }}
              >
                {data.id}
              </Typography>
            )}
          </Alert>
        )}

        {error && (
          <Alert severity="error" sx={{ mt: 2, borderRadius: '12px' }}>
            {error.message}
          </Alert>
        )}

        <Box sx={{ mt: 3 }}>
          <AppButton
            type="submit"
            variant="primary"
            loading={isLoading}
            startIcon={<EmojiEventsIcon />}
            fullWidth
          >
            {t('submit')}
          </AppButton>
        </Box>
      </Box>
    </LocalizationProvider>
  );
};

export default CreateMatchForm;
