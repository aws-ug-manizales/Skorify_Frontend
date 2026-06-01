export type UserStatus = 'active' | 'suspended';

export interface User {
  id: string;
  name: string;
  email: string;
  status: UserStatus;
  predictions: number;
  groups: number;
  accuracyRate: number;
  lastActiveAt: string;
}
