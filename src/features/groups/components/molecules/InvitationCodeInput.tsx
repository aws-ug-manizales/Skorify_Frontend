'use client';

import { useTranslations } from 'next-intl';
import TextField, { type TextFieldProps as MuiTextFieldProps } from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { INVITATION_CONFIG } from '../../constants/invitation';

export type InvitationCodeInputProps = Omit<MuiTextFieldProps, 'variant'> & {
  helperText?: string;
  error?: boolean;
};

export const InvitationCodeInput = ({
  helperText,
  error = false,
  onChange,
  ...rest
}: InvitationCodeInputProps) => {
  const t = useTranslations('groups');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\s+/g, '').toUpperCase();
    e.target.value = value;
    onChange?.(e);
  };

  return (
    <Box>
      <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 500 }}>
        {t('join.codeLabel')}
      </Typography>
      <TextField
        fullWidth
        placeholder={t('enterInvitationCode')}
        inputProps={{
          maxLength: INVITATION_CONFIG.CODE_MAX_LENGTH,
          style: { textTransform: 'uppercase', letterSpacing: '2px' },
        }}
        error={error}
        helperText={helperText}
        onChange={handleChange}
        {...rest}
      />
    </Box>
  );
};

export default InvitationCodeInput;
