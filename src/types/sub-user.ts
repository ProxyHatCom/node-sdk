export interface SubUser {
  uuid: string;
  proxy_username: string;
  is_default_user: boolean;
  is_traffic_limited: boolean;
  used_traffic: number;
  traffic_limit: number;
  lifecycle_status: string;
  name: string | null;
  notes: string | null;
  sub_user_group_id: string | null;
  created_at: string;
}

export interface ResetUsageResponse {
  reset: number;
}

export interface BulkDeleteResponse {
  requested: number;
  deleted: number;
  skipped: number;
  not_found: number;
  failed: number;
}
