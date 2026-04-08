'use client';

import MuiButton, { type ButtonProps as MuiButtonProps } from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';

type ButtonVariant = 'primary' | 'secondary' | 'tertiary';

export type AppButtonProps = Omit<MuiButtonProps, 'variant'> & {
  variant?: ButtonVariant;
  loading?: boolean;
};

const variantMap: Record<ButtonVariant, MuiButtonProps['variant']> = {
  primary: 'contained',
  secondary: 'outlined',
  tertiary: 'text',
};

const AppButton = ({
  variant = 'primary',
  loading = false,
  disabled,
  children,
  startIcon,
  ...rest
}: AppButtonProps) => (
  <MuiButton
    {...rest}
    variant={variantMap[variant]}
    disabled={disabled || loading}
    startIcon={loading ? <CircularProgress size={16} color="inherit" /> : startIcon}
  >
    {children}
  </MuiButton>
);

export default AppButton;
