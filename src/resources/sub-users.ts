import type { ProxyHat } from "../client.js";
import type {
  SubUser,
  ResetUsageResponse,
  BulkDeleteResponse,
} from "../types/sub-user.js";

export class SubUsersResource {
  constructor(private client: ProxyHat) {}

  async list(): Promise<SubUser[]> {
    return (await this.client.request(
      "GET",
      "/sub-users",
    )) as SubUser[];
  }

  async create(options: {
    proxy_password: string;
    is_traffic_limited?: boolean;
    traffic_limit?: string;
    name?: string;
    notes?: string;
    sub_user_group_id?: string;
  }): Promise<SubUser> {
    return (await this.client.request("POST", "/sub-users", {
      json: options as unknown as Record<string, unknown>,
    })) as SubUser;
  }

  async get(id: string): Promise<SubUser> {
    return (await this.client.request(
      "GET",
      `/sub-users/${id}`,
    )) as SubUser;
  }

  async update(
    id: string,
    options: {
      proxy_password?: string;
      is_traffic_limited?: boolean;
      traffic_limit?: string;
      name?: string;
      notes?: string;
    },
  ): Promise<SubUser> {
    return (await this.client.request("PUT", `/sub-users/${id}`, {
      json: options as unknown as Record<string, unknown>,
    })) as SubUser;
  }

  async delete(id: string): Promise<void> {
    await this.client.request("DELETE", `/sub-users/${id}`);
  }

  async reset_usage(ids: string[]): Promise<ResetUsageResponse> {
    return (await this.client.request("POST", "/sub-users/reset/usage", {
      json: { ids },
    })) as ResetUsageResponse;
  }

  async bulk_delete(ids: string[]): Promise<BulkDeleteResponse> {
    return (await this.client.request("POST", "/sub-users/bulk-delete", {
      json: { ids },
    })) as BulkDeleteResponse;
  }

  async bulk_move_to_group(
    ids: string[],
    group_id?: string | null,
  ): Promise<unknown> {
    return await this.client.request(
      "POST",
      "/sub-users/bulk-move-to-group",
      { json: { ids, group_id: group_id ?? null } },
    );
  }
}
