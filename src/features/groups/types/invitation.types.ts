/**
 * Types para el sistema de invitaciones a grupos
 */

export interface GroupInvitation {
  code: string;
  groupId: string;
  groupName: string;
  createdBy: string;
  createdAt: Date;
  expiresAt?: Date;
  maxUses?: number;
  usesCount: number;
  isActive: boolean;
}

export interface JoinGroupRequest {
  invitationCode: string;
}

export interface JoinGroupResponse {
  success: boolean;
  groupId: string;
  groupName: string;
  message: string;
}

export interface ValidateCodeResponse {
  isValid: boolean;
  groupId?: string;
  groupName?: string;
  error?: string;
  isMember?: boolean;
}

export interface GroupInvitationError {
  code:
    | 'INVALID_CODE'
    | 'GROUP_NOT_FOUND'
    | 'ALREADY_MEMBER'
    | 'CODE_EXPIRED'
    | 'MAX_USES_REACHED'
    | 'UNAUTHORIZED';
  message: string;
}
