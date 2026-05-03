'use client';

import type { Control } from 'react-hook-form';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import ClearIcon from '@mui/icons-material/Clear';
import { useTranslations } from 'next-intl';
import FormField, { type FormFieldOption } from '@shared/components/atoms/FormField';
import SearchField from '@shared/components/molecules/SearchField';

export interface PredictionsToolbarValues {
  search: string;
  week: string;
}

interface PredictionsToolbarProps {
  control: Control<PredictionsToolbarValues>;
  weekOptions: FormFieldOption[];
  hasActiveFilters: boolean;
  onClear: () => void;
}

const WEEK_MENU_SLOT_PROPS = {
  select: {
    MenuProps: {
      slotProps: {
        paper: {
          sx: {
            maxWidth: 'calc(100vw - 32px)',
            maxHeight: 'min(60vh, 480px)',
          },
        },
      },
    },
  },
} as const;

const WEEK_FIELD_SX = {
  '& .MuiSelect-select': {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
} as const;

const PredictionsToolbar = ({
  control,
  weekOptions,
  hasActiveFilters,
  onClear,
}: PredictionsToolbarProps) => {
  const t = useTranslations('predictions');

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' },
        gap: 1.5,
        mb: 3,
        alignItems: { xs: 'stretch', md: 'center' },
        justifyContent: 'space-between',
      }}
    >
      <SearchField<PredictionsToolbarValues>
        name="search"
        control={control}
        placeholder={t('searchPlaceholder')}
        clearAriaLabel={t('clearSearchAriaLabel')}
        sx={{ flex: 1, minWidth: { xs: 'unset', md: 380 } }}
      />

      <Box
        sx={{
          display: 'flex',
          gap: 1.5,
          alignItems: 'center',
          width: { xs: '100%', md: 'auto' },
        }}
      >
        <FormField<PredictionsToolbarValues>
          name="week"
          control={control}
          size="small"
          select
          label={t('weekLabel')}
          options={[{ value: '', label: t('weekAll') }, ...weekOptions]}
          slotProps={WEEK_MENU_SLOT_PROPS}
          sx={{
            flex: { xs: 1, md: 'unset' },
            minWidth: { xs: 'unset', md: 220 },
            ...WEEK_FIELD_SX,
          }}
        />

        {hasActiveFilters && (
          <IconButton onClick={onClear} aria-label={t('clearFilters')} size="small">
            <ClearIcon />
          </IconButton>
        )}
      </Box>
    </Box>
  );
};

export default PredictionsToolbar;
