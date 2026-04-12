import { INVITATION_CONFIG } from '../constants/invitation';

export const normalizeInvitationCode = (code: string): string => {
  return code.trim().toUpperCase().replace(/\s+/g, '');
};

export const validateInvitationCode = (code: string): { valid: boolean; message?: string } => {
  if (!code || code.length === 0) {
    return { valid: false, message: 'El código es requerido' };
  }

  const normalized = normalizeInvitationCode(code);

  if (normalized.length < INVITATION_CONFIG.CODE_MIN_LENGTH) {
    return {
      valid: false,
      message: `El código debe tener al menos ${INVITATION_CONFIG.CODE_MIN_LENGTH} caracteres`,
    };
  }

  if (normalized.length > INVITATION_CONFIG.CODE_MAX_LENGTH) {
    return {
      valid: false,
      message: `El código no puede exceder ${INVITATION_CONFIG.CODE_MAX_LENGTH} caracteres`,
    };
  }

  if (!/^[A-Z0-9-]+$/.test(normalized)) {
    return {
      valid: false,
      message: 'Solo se permiten letras, números y guiones',
    };
  }

  return { valid: true };
};
