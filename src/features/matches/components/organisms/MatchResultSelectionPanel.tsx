'use client';

import { useEffect, useMemo, useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { useLocale, useTranslations } from 'next-intl';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { type FormFieldOption } from '@shared/components/atoms/FormField';
import AppCard from '@shared/components/molecules/AppCard';
import { tokens } from '@lib/theme/theme';
import MatchAutocompleteField, {
  type MatchAutocompleteOption,
} from '../atoms/MatchAutocompleteField';
import MatchResultEditor, { type MatchResultFormValues } from '../molecules/MatchResultEditor';
import SelectedMatchSummary from '../molecules/SelectedMatchSummary';
import { useMatchesStore } from '../../store';
import { type MatchStatus } from '../../types/match';

const DEFAULT_STATUS: MatchStatus = 'finished';

type SubmitFeedback = {
  kind: 'success' | 'error';
  message: string;
  matchId: string;
};

const MatchResultSelectionPanel = () => {
  const t = useTranslations('matches.resultForm');
  const locale = useLocale();
  const { matches, teams, tournaments, updateMatchResult } = useMatchesStore();
  const [submitFeedback, setSubmitFeedback] = useState<SubmitFeedback | null>(null);

  const {
    control,
    handleSubmit,
    setValue,
    formState: { isDirty, isSubmitting },
  } = useForm<MatchResultFormValues>({
    defaultValues: {
      matchId: '',
      homeGoals: '',
      awayGoals: '',
      status: DEFAULT_STATUS,
    },
  });

  const selectedMatchId = useWatch({
    control,
    name: 'matchId',
  });

  const teamById = useMemo(() => new Map(teams.map((team) => [team.id, team])), [teams]);
  const tournamentById = useMemo(
    () => new Map(tournaments.map((tournament) => [tournament.id, tournament])),
    [tournaments],
  );

  const selectedMatch = useMemo(
    () => matches.find((item) => item.id === selectedMatchId),
    [matches, selectedMatchId],
  );

  useEffect(() => {
    if (!selectedMatch) {
      setValue('homeGoals', '', { shouldDirty: false, shouldTouch: false, shouldValidate: false });
      setValue('awayGoals', '', { shouldDirty: false, shouldTouch: false, shouldValidate: false });
      setValue('status', DEFAULT_STATUS, {
        shouldDirty: false,
        shouldTouch: false,
        shouldValidate: false,
      });
      return;
    }

    setValue('homeGoals', selectedMatch.home_goals?.toString() ?? '', {
      shouldDirty: false,
      shouldTouch: false,
      shouldValidate: false,
    });
    setValue('awayGoals', selectedMatch.away_goals?.toString() ?? '', {
      shouldDirty: false,
      shouldTouch: false,
      shouldValidate: false,
    });
    setValue('status', selectedMatch.status, {
      shouldDirty: false,
      shouldTouch: false,
      shouldValidate: false,
    });
  }, [selectedMatch, setValue]);

  const statusOptions = useMemo<FormFieldOption[]>(
    () => [
      { value: 'scheduled', label: t('statusOptions.scheduled') },
      { value: 'in_progress', label: t('statusOptions.in_progress') },
      { value: 'finished', label: t('statusOptions.finished') },
    ],
    [t],
  );

  const matchOptions = useMemo<MatchAutocompleteOption[]>(() => {
    const formatter = new Intl.DateTimeFormat(locale, {
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });

    return matches.map((match) => {
      const homeTeamName = teamById.get(match.home_team_id)?.name ?? t('fallbackTeam');
      const awayTeamName = teamById.get(match.away_team_id)?.name ?? t('fallbackTeam');
      const tournamentName =
        tournamentById.get(match.tournament_id)?.name ?? t('fallbackTournament');
      const stageLabel = t(`stageOptions.${match.stage}`);
      const kickOffLabel = formatter.format(new Date(match.kick_off));

      return {
        id: match.id,
        label: `${homeTeamName} vs ${awayTeamName} • ${tournamentName} • ${kickOffLabel} • ${stageLabel}`,
      };
    });
  }, [locale, matches, t, teamById, tournamentById]);

  const selectedMatchSummary = useMemo(() => {
    if (!selectedMatch) {
      return undefined;
    }

    const fullDateFormatter = new Intl.DateTimeFormat(locale, {
      dateStyle: 'long',
      timeStyle: 'short',
    });

    const homeTeamName = teamById.get(selectedMatch.home_team_id)?.name ?? t('fallbackTeam');
    const awayTeamName = teamById.get(selectedMatch.away_team_id)?.name ?? t('fallbackTeam');
    const tournamentName =
      tournamentById.get(selectedMatch.tournament_id)?.name ?? t('fallbackTournament');

    return {
      teams: `${homeTeamName} vs ${awayTeamName}`,
      tournament: tournamentName,
      kickOff: fullDateFormatter.format(new Date(selectedMatch.kick_off)),
      stage: t(`stageOptions.${selectedMatch.stage}`),
      venue: selectedMatch.venue,
      status: t(`statusOptions.${selectedMatch.status}`),
    };
  }, [locale, selectedMatch, t, teamById, tournamentById]);

  const validateNonNegativeInteger = (value: string) => {
    if (!/^\d+$/.test(value.trim())) {
      return t('validation.goalsInteger');
    }

    return true;
  };

  const onSubmit = handleSubmit((values) => {
    const homeGoals = Number.parseInt(values.homeGoals, 10);
    const awayGoals = Number.parseInt(values.awayGoals, 10);

    if (
      !Number.isInteger(homeGoals) ||
      !Number.isInteger(awayGoals) ||
      homeGoals < 0 ||
      awayGoals < 0
    ) {
      setSubmitFeedback({ kind: 'error', message: t('saveError'), matchId: values.matchId });
      return;
    }

    const updatedMatch = updateMatchResult({
      matchId: values.matchId,
      homeGoals,
      awayGoals,
      status: values.status,
    });

    if (!updatedMatch) {
      setSubmitFeedback({ kind: 'error', message: t('saveError'), matchId: values.matchId });
      return;
    }

    const updatedAtLabel = new Intl.DateTimeFormat(locale, {
      dateStyle: 'medium',
      timeStyle: 'short',
    }).format(new Date(updatedMatch.updated_at));

    setSubmitFeedback({
      kind: 'success',
      message: t('saveSuccess', { updatedAt: updatedAtLabel }),
      matchId: values.matchId,
    });

    setValue('homeGoals', String(updatedMatch.home_goals ?? ''), {
      shouldDirty: false,
      shouldTouch: false,
      shouldValidate: false,
    });
    setValue('awayGoals', String(updatedMatch.away_goals ?? ''), {
      shouldDirty: false,
      shouldTouch: false,
      shouldValidate: false,
    });
    setValue('status', updatedMatch.status, {
      shouldDirty: false,
      shouldTouch: false,
      shouldValidate: false,
    });
  });

  const isResultEditorDisabled = !selectedMatch;
  const isSaveDisabled = isResultEditorDisabled || isSubmitting || !isDirty;
  const activeFeedback =
    submitFeedback && submitFeedback.matchId === selectedMatchId ? submitFeedback : null;

  return (
    <Box sx={{ p: { xs: 3, md: 4 }, maxWidth: 1100, mx: 'auto' }}>
      <Box sx={{ mb: 4 }}>
        <Typography
          sx={{
            fontSize: { xs: '1.75rem', md: '2.5rem' },
            fontWeight: 900,
            fontStyle: 'italic',
            letterSpacing: '-0.04em',
            color: tokens.onSurface,
            textTransform: 'uppercase',
            lineHeight: 1,
            mb: 1,
          }}
        >
          {t('title')}
        </Typography>
        <Typography sx={{ fontSize: '0.875rem', color: tokens.onSurfaceVariant, maxWidth: 620 }}>
          {t('subtitle')}
        </Typography>
      </Box>

      <AppCard variant="default" sx={{ p: 3, display: 'flex', flexDirection: 'column', gap: 3 }}>
        <MatchAutocompleteField<MatchResultFormValues>
          name="matchId"
          control={control}
          label={t('matchLabel')}
          placeholder={t('matchPlaceholder')}
          helperText={t('matchHelper')}
          options={matchOptions}
          rules={{
            required: t('validation.matchRequired'),
          }}
        />

        <SelectedMatchSummary
          title={t('selectionSummaryTitle')}
          emptyStateLabel={t('selectionEmpty')}
          fields={{
            teams: t('fields.teams'),
            tournament: t('fields.tournament'),
            kickOff: t('fields.kickOff'),
            stage: t('fields.stage'),
            venue: t('fields.venue'),
            status: t('fields.status'),
          }}
          matchSummary={selectedMatchSummary}
        />

        <MatchResultEditor
          control={control}
          labels={{
            title: t('editor.title'),
            description: t('editor.description'),
            homeGoals: t('editor.homeGoalsLabel'),
            awayGoals: t('editor.awayGoalsLabel'),
            status: t('editor.statusLabel'),
            statusHelper: t('editor.statusHelper'),
            save: t('editor.saveButton'),
          }}
          validation={{
            homeGoals: {
              required: t('validation.homeGoalsRequired'),
              validate: validateNonNegativeInteger,
            },
            awayGoals: {
              required: t('validation.awayGoalsRequired'),
              validate: validateNonNegativeInteger,
            },
            status: {
              required: t('validation.statusRequired'),
            },
          }}
          statusOptions={statusOptions}
          disabled={isResultEditorDisabled}
          saveDisabled={isSaveDisabled}
          onSubmit={onSubmit}
        />

        {activeFeedback ? (
          <Typography
            sx={{
              fontSize: '0.8125rem',
              fontWeight: 600,
              color: activeFeedback.kind === 'success' ? tokens.success : tokens.error,
            }}
          >
            {activeFeedback.message}
          </Typography>
        ) : null}
      </AppCard>
    </Box>
  );
};

export default MatchResultSelectionPanel;
