const INVITE_CODE_REGEX = /^[A-Z0-9]{5,10}$/;

export const normalizeInvitationCode = (code: string): string => {
  return code.trim().toUpperCase().replace(/\s+/g, '');
};

export const validateInvitationCode = (code: string): { valid: boolean; message?: string } => {
  if (!code || code.length === 0) {
    return { valid: false, message: 'El código es requerido' };
  }

  const normalized = normalizeInvitationCode(code);

  if (!INVITE_CODE_REGEX.test(normalized)) {
    return {
      valid: false,
      message: 'El código debe tener entre 5 y 10 caracteres alfanuméricos',
    };
  }

  return { valid: true };
};
