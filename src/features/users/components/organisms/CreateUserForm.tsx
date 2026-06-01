'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslations } from 'next-intl';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Alert from '@mui/material/Alert';
import InputAdornment from '@mui/material/InputAdornment';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import FormField from '@shared/components/atoms/FormField';
import AppButton from '@shared/components/atoms/AppButton';
import { tokens } from '@lib/theme/theme';
import { useCreateUser } from '../../hooks/useCreateUser';

interface CreateUserFormValues {
  name: string;
  email: string;
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

interface CreateUserFormProps {
  onSuccess?: () => void;
}

const CreateUserForm = ({ onSuccess }: CreateUserFormProps) => {
  const t = useTranslations('users');
  const { createUser, isLoading, error, reset } = useCreateUser();
  const [createdUser, setCreatedUser] = useState<{ id: string; name: string } | null>(null);

  const {
    control,
    handleSubmit,
    reset: resetForm,
  } = useForm<CreateUserFormValues>({
    defaultValues: { name: '', email: '' },
  });

  const onSubmit = async (values: CreateUserFormValues) => {
    setCreatedUser(null);
    reset();
    const user = await createUser({ name: values.name, email: values.email });
    if (user) {
      setCreatedUser({ id: user.id, name: user.name });
      resetForm();
      onSuccess?.();
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit(onSubmit)}
      sx={{ px: { xs: 3, md: 4 }, pt: 1, pb: 4, maxWidth: 520, mx: 'auto' }}
    >
      <Box sx={{ mb: 3 }}>
        <Typography
          sx={{
            fontSize: { xs: '1.75rem', md: '2.25rem' },
            fontWeight: 900,
            letterSpacing: '-0.03em',
            textTransform: 'uppercase',
            lineHeight: 1,
            color: tokens.onSurface,
          }}
        >
          {t('createTitle')}
        </Typography>
        <Typography
          sx={{ mt: 1.5, fontSize: '0.875rem', color: tokens.onSurfaceVariant, lineHeight: 1.6 }}
        >
          {t('createSubtitle')}
        </Typography>
      </Box>

      <Box
        sx={{
          bgcolor: tokens.surfaceContainerLow,
          borderRadius: '16px',
          p: 3,
          display: 'flex',
          flexDirection: 'column',
          gap: 2.5,
        }}
      >
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
          <FormField<CreateUserFormValues>
            name="name"
            control={control}
            rules={{ required: t('nameRequired') }}
            placeholder={t('namePlaceholder')}
            fullWidth
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <PersonIcon sx={{ color: tokens.onSurfaceVariant, fontSize: '1.25rem' }} />
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
            {t('emailLabel')}
          </Typography>
          <FormField<CreateUserFormValues>
            name="email"
            control={control}
            rules={{
              required: t('emailRequired'),
              pattern: { value: EMAIL_REGEX, message: t('emailInvalid') },
            }}
            placeholder={t('emailPlaceholder')}
            fullWidth
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <EmailIcon sx={{ color: tokens.onSurfaceVariant, fontSize: '1.25rem' }} />
                  </InputAdornment>
                ),
              },
            }}
          />
        </Box>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mt: 2, borderRadius: '10px' }}>
          {error.message}
        </Alert>
      )}

      {createdUser && (
        <Alert severity="success" sx={{ mt: 2, borderRadius: '10px' }}>
          {t('createSuccess', { name: createdUser.name, id: createdUser.id })}
        </Alert>
      )}

      <AppButton
        type="submit"
        variant="primary"
        loading={isLoading}
        fullWidth
        endIcon={<ArrowForwardIcon />}
        sx={{ mt: 3 }}
      >
        {t('submit')}
      </AppButton>
    </Box>
  );
};

export default CreateUserForm;
