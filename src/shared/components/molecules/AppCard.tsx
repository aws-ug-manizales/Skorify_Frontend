'use client';

import MuiCard, { type CardProps as MuiCardProps } from '@mui/material/Card';
import CardActionArea from '@mui/material/CardActionArea';
import { tokens } from '@lib/theme/theme';
import Link from 'next/link';
import { type ReactNode } from 'react';

type CardVariant = 'default' | 'elevated' | 'outlined' | 'interactive';

export type AppCardProps = Omit<MuiCardProps, 'variant'> & {
  variant?: CardVariant;
  href?: string;
  children: ReactNode;
};

const variantStyles: Record<CardVariant, object> = {
  default: {
    bgcolor: tokens.surfaceContainerLow,
  },
  elevated: {
    bgcolor: tokens.surfaceContainerHigh,
    boxShadow: tokens.shadowMd,
  },
  outlined: {
    bgcolor: tokens.surfaceContainer,
    border: `1px solid ${tokens.outlineVariant}33`,
    boxShadow: 'none',
  },
  interactive: {
    bgcolor: tokens.surfaceContainerLow,
    transition: 'box-shadow 200ms ease, transform 200ms ease',
    '&:hover': {
      boxShadow: tokens.glowHover,
      transform: 'translateY(-2px)',
    },
    '&:active': {
      transform: 'scale(0.99)',
    },
  },
};

const AppCard = ({ variant = 'default', href, children, sx, ...rest }: AppCardProps) => (
  <MuiCard {...rest} sx={[variantStyles[variant], ...(Array.isArray(sx) ? sx : [sx])]}>
    {href ? (
      <CardActionArea component={Link} href={href} sx={{ height: '100%' }}>
        {children}
      </CardActionArea>
    ) : (
      children
    )}
  </MuiCard>
);

export default AppCard;
