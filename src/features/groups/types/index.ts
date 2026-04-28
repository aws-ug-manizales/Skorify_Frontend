export interface CreateGroupPayload {
  name: string;
  description?: string;
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

export interface CreateGroupFormValues {
  name: string;
  description: string;
}
