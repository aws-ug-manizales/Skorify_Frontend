import type { StoredUser } from '../types/auth';

export const mockUsers: StoredUser[] = [
  {
    id: 'admin-user',
    email: 'admin@admin.com',
    displayName: 'admin',
    provider: 'email',
    emailVerified: true,
    role: 'admin',
    password: '12345678',
  },
  {
    id: 'mock-user-1',
    email: 'test@test.com',
    displayName: 'test',
    provider: 'email',
    emailVerified: true,
    role: 'user',
    password: '12345678',
  },
  {
    id: 'mock-user-2',
    email: 'ana@test.com',
    displayName: 'ana',
    provider: 'email',
    emailVerified: true,
    role: 'user',
    password: '12345678',
  },
  {
    id: 'mock-user-3',
    email: 'diego@test.com',
    displayName: 'diego',
    provider: 'email',
    emailVerified: true,
    role: 'user',
    password: '12345678',
  },
];

export const mockAdminUser = mockUsers[0];
export const mockAdminEmail = mockAdminUser.email;
export const mockAdminPassword = mockAdminUser.password ?? '12345678';
