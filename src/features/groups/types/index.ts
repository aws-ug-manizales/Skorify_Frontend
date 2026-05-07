/**
 * Barrel Export para types de groups
 */

export type {
  GroupInvitation,
  JoinGroupRequest,
  JoinGroupResponse,
  ValidateCodeResponse,
  GroupInvitationError,
} from './invitation.types';

export interface CreateGroupPayload {
  name: string;
  description?: string;
}

export interface CreateGroupFormValues {
  name: string;
  description: string;
}

export interface Group {
  id: string;
  name: string;
  description?: string;
  inviteCode: string;
  adminId: string;
  memberCount: number;
  createdAt: string;
}

export interface GroupMember {
  id: string;
  name: string;
  avatarUrl?: string;
  isAdmin: boolean;
}

export interface StandingRow {
  rank: number;
  userId: string;
  name: string;
  points: number;
  won: number;
  drawn: number;
  lost: number;
}

export interface PendingMatch {
  id: string;
  homeTeam: { name: string; flagUrl?: string };
  awayTeam: { name: string; flagUrl?: string };
  matchDate: string;
  tournament?: string;
  hasPrediction: boolean;
}

export interface GroupDetailData {
  group: Group;
  standings: StandingRow[];
  pendingMatches: PendingMatch[];
  members: GroupMember[];
}
