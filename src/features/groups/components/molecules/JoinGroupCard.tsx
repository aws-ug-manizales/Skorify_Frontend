'use client';

import { useTranslations } from 'next-intl';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import People from '@mui/icons-material/People';
import type { CardProps as MuiCardProps } from '@mui/material/Card';

export interface JoinGroupCardProps extends Omit<MuiCardProps, 'variant'> {
  groupName?: string;
  groupDescription?: string;
  isLoading?: boolean;
  children?: React.ReactNode;
}

/**
 * Componente Molecule para mostrar información del grupo
 * Display de grupo que se va a unir
 */
export const JoinGroupCard = ({
  groupName,
  groupDescription,
  isLoading = false,
  children,
  sx,
  ...rest
}: JoinGroupCardProps) => {
  const t = useTranslations('groups');

  return (
    <Card
      sx={{
        borderRadius: 2,
        boxShadow: 1,
        transition: 'all 0.3s ease',
        ...sx,
      }}
      {...rest}
    >
      <CardContent>
        {isLoading ? (
          <Box sx={{ textAlign: 'center', py: 2 }}>
            <Typography color="textSecondary">{t('validatingCode')}</Typography>
          </Box>
        ) : groupName ? (
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <People sx={{ mr: 1, fontSize: 32, color: 'primary.main' }} />
              <Box>
                <Typography variant="h6">{groupName}</Typography>
                {groupDescription && (
                  <Typography variant="caption" color="textSecondary">
                    {groupDescription}
                  </Typography>
                )}
              </Box>
            </Box>
          </Box>
        ) : (
          <Typography color="textSecondary" sx={{ textAlign: 'center', py: 2 }}>
            {t('enterCodeToJoin')}
          </Typography>
        )}

        {children && <Box sx={{ mt: 2 }}>{children}</Box>}
      </CardContent>
    </Card>
  );
};

export default JoinGroupCard;
