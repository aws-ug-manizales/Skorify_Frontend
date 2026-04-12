'use client';

import { useState, useEffect, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';
import CheckCircle from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import { InvitationCodeInput } from '../molecules/InvitationCodeInput';
import { JoinGroupCard } from '../molecules/JoinGroupCard';
import { useJoinGroup } from '../../hooks/useJoinGroup';
import type { ValidateCodeResponse } from '../../types/invitation.types';

type FlowStep = 'INPUT' | 'VALIDATING' | 'CONFIRM' | 'JOINING' | 'SUCCESS' | 'ERROR';

interface JoinGroupFlowProps {
  initialCode?: string;
}

export const JoinGroupFlow = ({ initialCode }: JoinGroupFlowProps) => {
  const t = useTranslations('groups');
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
        setStep('CONFIRM');
      } else {
        setStep('ERROR');
      }
    },
    [code, validateCode, resetError],
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
        <Button
          variant="contained"
          fullWidth
          onClick={() => handleValidateCode()}
          disabled={!code.trim() || loading}
          size="large"
        >
          {loading ? <CircularProgress size={24} /> : t('validateCode')}
        </Button>
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
          <Button
            variant="contained"
            fullWidth
            onClick={handleJoinGroup}
            disabled={loading}
            size="large"
          >
            {loading ? <CircularProgress size={24} /> : t('joinGroup')}
          </Button>
          <Button
            variant="outlined"
            fullWidth
            onClick={handleReset}
            disabled={loading}
            size="large"
          >
            {t('cancel')}
          </Button>
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

  // STEP: ERROR
  if (step === 'ERROR' && error) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Box sx={{ textAlign: 'center', mb: 2 }}>
          <ErrorIcon sx={{ fontSize: 80, color: 'error.main' }} />
        </Box>
        <Alert severity="error">{error.message}</Alert>
        <Box sx={{ display: 'flex', gap: 2, flexDirection: 'column' }}>
          <Button variant="contained" fullWidth onClick={handleReset} size="large">
            {t('tryAgain')}
          </Button>
        </Box>
      </Box>
    );
  }

  return null;
};

export default JoinGroupFlow;
