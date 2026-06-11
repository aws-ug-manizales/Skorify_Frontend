'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';
import AppButton from '@shared/components/atoms/AppButton';
import CheckCircle from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import InfoIcon from '@mui/icons-material/Info';
import { InvitationCodeInput } from '../molecules/InvitationCodeInput';
import { JoinGroupCard } from '../molecules/JoinGroupCard';
import { useJoinGroup } from '../../hooks/useJoinGroup';
import { INVITATION_CONFIG } from '../../constants/invitation';
import type { ValidateCodeResponse } from '../../types/invitation.types';

type FlowStep =
  | 'INPUT'
  | 'VALIDATING'
  | 'CONFIRM'
  | 'JOINING'
  | 'SUCCESS'
  | 'ERROR'
  | 'ALREADY_MEMBER';

interface JoinGroupFlowProps {
  initialCode?: string;
}

export const JoinGroupFlow = ({ initialCode }: JoinGroupFlowProps) => {
  const t = useTranslations('groups');
  const router = useRouter();
  const { loading, error, validateCode, joinGroup, resetError } = useJoinGroup();

  const [step, setStep] = useState<FlowStep>('INPUT');
  const [code, setCode] = useState(initialCode?.toUpperCase() || '');
  const [validationData, setValidationData] = useState<ValidateCodeResponse | null>(null);
  const [inputError, setInputError] = useState(false);

  const handleValidateCode = useCallback(
    async (codeToValidate?: string) => {
      const finalCode = codeToValidate || code;

      if (!finalCode.trim()) {
        setInputError(true);
        return;
      }

      setInputError(false);
      setStep('VALIDATING');
      resetError();

      const result = await validateCode(finalCode);

      if (result && result.isValid) {
        setValidationData(result);
        // Already enrolled in this group: skip the join step and send the user
        // home instead of letting them re-attempt a join the backend rejects.
        if (result.isMember) {
          setStep('ALREADY_MEMBER');
          setTimeout(() => router.replace('/home'), INVITATION_CONFIG.REDIRECT_DELAY_MS);
        } else {
          setStep('CONFIRM');
        }
      } else {
        setStep('ERROR');
      }
    },
    [code, validateCode, resetError, router],
  );
  useEffect(() => {
    if (initialCode && initialCode.length >= 6 && step === 'INPUT') {
      setTimeout(() => {
        handleValidateCode(initialCode);
      }, 0);
    }
  }, [initialCode, step, handleValidateCode]);

  const handleJoinGroup = async () => {
    setStep('JOINING');
    const result = await joinGroup(code);

    if (result && result.success) {
      setStep('SUCCESS');
    } else {
      setStep('ERROR');
    }
  };

  const handleReset = () => {
    setStep('INPUT');
    setCode('');
    setValidationData(null);
    setInputError(false);
    resetError();
  };

  // STEP: INPUT
  if (step === 'INPUT') {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <InvitationCodeInput
          value={code}
          onChange={(e) => setCode(e.target.value)}
          error={inputError}
          helperText={inputError ? t('codeRequired') : ''}
          disabled={loading}
        />
        <AppButton
          fullWidth
          onClick={() => handleValidateCode()}
          disabled={!code.trim() || loading}
          loading={loading}
          size="large"
        >
          {t('validateCode')}
        </AppButton>
      </Box>
    );
  }

  // STEP: VALIDATING
  if (step === 'VALIDATING') {
    return (
      <Box sx={{ textAlign: 'center', py: 3 }}>
        <CircularProgress sx={{ mb: 2 }} />
        <Box>{t('validatingCode')}</Box>
      </Box>
    );
  }

  // STEP: CONFIRM
  if (step === 'CONFIRM' && validationData) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <JoinGroupCard groupName={validationData.groupName} groupDescription={t('readyToJoin')} />
        <Box sx={{ display: 'flex', gap: 2, flexDirection: 'column' }}>
          <AppButton
            fullWidth
            onClick={handleJoinGroup}
            disabled={loading}
            loading={loading}
            size="large"
          >
            {t('joinGroup')}
          </AppButton>
          <AppButton
            variant="secondary"
            fullWidth
            onClick={handleReset}
            disabled={loading}
            size="large"
          >
            {t('cancel')}
          </AppButton>
        </Box>
      </Box>
    );
  }

  // STEP: JOINING
  if (step === 'JOINING') {
    return (
      <Box sx={{ textAlign: 'center', py: 3 }}>
        <CircularProgress sx={{ mb: 2 }} />
        <Box>{t('joiningGroup')}</Box>
      </Box>
    );
  }

  // STEP: SUCCESS
  if (step === 'SUCCESS') {
    return (
      <Box sx={{ textAlign: 'center', py: 3 }}>
        <CheckCircle sx={{ fontSize: 80, color: 'success.main', mb: 2 }} />
        <Alert severity="success" sx={{ mb: 2 }}>
          {t('successfullyJoinedGroup')}
        </Alert>
        <Box sx={{ color: 'textSecondary', fontSize: '0.9rem' }}>{t('redirecting')}</Box>
      </Box>
    );
  }

  // STEP: ALREADY_MEMBER
  if (step === 'ALREADY_MEMBER') {
    return (
      <Box sx={{ textAlign: 'center', py: 3 }}>
        <InfoIcon sx={{ fontSize: 80, color: 'info.main', mb: 2 }} />
        <Alert severity="info" sx={{ mb: 2 }}>
          {t('errors.alreadyMember')}
        </Alert>
        <Box sx={{ color: 'textSecondary', fontSize: '0.9rem' }}>{t('redirecting')}</Box>
      </Box>
    );
  }

  // STEP: ERROR
  if (step === 'ERROR' && error) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Box sx={{ textAlign: 'center', mb: 2 }}>
          <ErrorIcon sx={{ fontSize: 80, color: 'error.main' }} />
        </Box>
        <Alert severity="error">{error.message}</Alert>
        <Box sx={{ display: 'flex', gap: 2, flexDirection: 'column' }}>
          <AppButton fullWidth onClick={handleReset} size="large">
            {t('tryAgain')}
          </AppButton>
        </Box>
      </Box>
    );
  }

  return null;
};

export default JoinGroupFlow;
