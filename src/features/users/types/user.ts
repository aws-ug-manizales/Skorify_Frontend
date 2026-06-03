export type UserStatus = 'active' | 'suspended';

export interface User {
  id: string;
  name: string;
  email: string;
  status: UserStatus;
  // Number of groups (tournament-instance enrollments) the user belongs to.
  groups: number;
}
