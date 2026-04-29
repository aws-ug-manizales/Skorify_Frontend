/**
 * Barrel Export para el feature groups
 */

// Components
export { default as GroupDetail } from './components/organisms/GroupDetail';
export { default as CreateGroupForm } from './components/organisms/CreateGroupForm';
export { default as CreateGroupDrawer } from './components/organisms/CreateGroupDrawer';
export { default as GroupsView } from './components/organisms/GroupsView';
export { InvitationCodeInput, JoinGroupCard, JoinGroupFlow } from './components/index';

// Hooks
export { useGroupDetail } from './hooks/useGroupDetail';
export { useJoinGroup } from './hooks/index';

// Types
export type {
  Group,
  GroupMember,
  StandingRow,
  PendingMatch,
  GroupDetailData,
  GroupInvitation,
  JoinGroupRequest,
  JoinGroupResponse,
  ValidateCodeResponse,
  GroupInvitationError,
} from './types/index';
