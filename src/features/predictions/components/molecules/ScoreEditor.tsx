'use client';

import { useMemo, type KeyboardEvent } from 'react';
import { useTranslations } from 'next-intl';
import type { Control, FieldValues, Path, RegisterOptions } from 'react-hook-form';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import FormField from '@shared/components/atoms/FormField';
import { tokens } from '@lib/theme/theme';

interface ScoreEditorProps<T extends FieldValues> {
  control: Control<T>;
  homeName: Path<T>;
  awayName: Path<T>;
  disabled?: boolean;
  homeAriaLabel?: string;
  awayAriaLabel?: string;
}

const FIELD_SX = {
  width: 64,
  '& .MuiOutlinedInput-root': { height: 44 },
  '& .MuiOutlinedInput-input': {
    textAlign: 'center',
    fontWeight: 800,
    fontSize: '1.1rem',
    padding: '8px 4px',
    MozAppearance: 'textfield',
  },
  '& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button': {
    WebkitAppearance: 'none',
    margin: 0,
  },
} as const;

const BLOCKED_KEYS = new Set(['-', '+', 'e', 'E', '.', ',']);

const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
  if (BLOCKED_KEYS.has(event.key)) event.preventDefault();
};

const ScoreEditor = <T extends FieldValues>({
  control,
  homeName,
  awayName,
  disabled,
  homeAriaLabel,
  awayAriaLabel,
}: ScoreEditorProps<T>) => {
  const t = useTranslations('predictions.errors');

  const rules = useMemo<RegisterOptions<T, Path<T>>>(
    () => ({
      required: { value: true, message: t('required') },
      min: { value: 0, message: t('min') },
      max: { value: 99, message: t('max') },
      pattern: { value: /^\d+$/, message: t('integerOnly') },
    }),
    [t],
  );

  const sharedHtmlInputProps = {
    min: 0,
    max: 99,
    step: 1,
    inputMode: 'numeric' as const,
    onKeyDown: handleKeyDown,
  };

  const sharedSlotProps = (ariaLabel?: string) => ({
    htmlInput: {
      ...sharedHtmlInputProps,
      'aria-label': ariaLabel,
    },
    formHelperText: { sx: { display: 'none' } },
  });

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, justifyContent: 'center' }}>
      <FormField<T>
        name={homeName}
        control={control}
        rules={rules}
        type="number"
        size="small"
        disabled={disabled}
        sx={FIELD_SX}
        slotProps={sharedSlotProps(homeAriaLabel)}
      />
      <Typography
        sx={{ color: tokens.onSurfaceVariant, fontWeight: 800, fontSize: '1.1rem', mx: 0.25 }}
      >
        –
      </Typography>
      <FormField<T>
        name={awayName}
        control={control}
        rules={rules}
        type="number"
        size="small"
        disabled={disabled}
        sx={FIELD_SX}
        slotProps={sharedSlotProps(awayAriaLabel)}
      />
    </Box>
  );
};

export default ScoreEditor;
