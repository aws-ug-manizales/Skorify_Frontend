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
  points?: number;
  rank?: number;
}

export interface StandingRow {
  rank: number;
  userId: string;
  name: string;
  points: number;
  predictedMatches: number;
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
  /**
   * Snapshot of the standings before the latest score update. Used by the podium
   * to animate rank changes. Optional — when absent or equal to `standings`, no
   * animation runs.
   */
  previousStandings?: StandingRow[];
  pendingMatches: PendingMatch[];
  members: GroupMember[];
}

export interface LeaveGroupResponse {
  success: boolean;
  dissolved?: boolean;
  newAdminId?: string;
  message?: string;
}
