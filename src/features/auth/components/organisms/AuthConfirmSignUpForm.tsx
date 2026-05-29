'use client';

import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import AppButton from '@shared/components/atoms/AppButton';

interface AuthConfirmSignUpFormProps {
  email: string;
  code: string;
  onCodeChange: (value: string) => void;
  onSubmit: () => void;
  onResend: () => void;
  isSubmitting: boolean;
  isResending: boolean;
  codeError?: string;
  title: string;
  description: string;
  codeLabel: string;
  codePlaceholder: string;
  submitLabel: string;
  resendLabel: string;
}

const AuthConfirmSignUpForm = ({
  email,
  code,
  onCodeChange,
  onSubmit,
  onResend,
  isSubmitting,
  isResending,
  codeError,
  title,
  description,
  codeLabel,
  codePlaceholder,
  submitLabel,
  resendLabel,
}: AuthConfirmSignUpFormProps) => (
  <Stack
    component="form"
    spacing={2}
    onSubmit={(event) => {
      event.preventDefault();
      onSubmit();
    }}
  >
    <Stack spacing={0.5}>
      <Typography variant="subtitle1" fontWeight={600}>
        {title}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        {description.replace('{email}', email)}
      </Typography>
    </Stack>

    <TextField
      label={codeLabel}
      placeholder={codePlaceholder}
      value={code}
      onChange={(event) => onCodeChange(event.target.value.replace(/\D/g, ''))}
      inputMode="numeric"
      autoComplete="one-time-code"
      error={!!codeError}
      helperText={codeError ?? ' '}
      fullWidth
    />

    <AppButton type="submit" loading={isSubmitting} fullWidth>
      {submitLabel}
    </AppButton>

    <AppButton variant="tertiary" onClick={onResend} loading={isResending} fullWidth>
      {resendLabel}
    </AppButton>
  </Stack>
);

export default AuthConfirmSignUpForm;
