export interface SubUserGroup {
  id: string;
  name: string;
  description: string | null;
  sub_users_count: number;
  created_at: string;
  sub_users: unknown[];
}
