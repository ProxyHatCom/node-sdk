import type { ProxyHat } from "../client.js";
import type { SubUserGroup } from "../types/sub-user-group.js";

export class SubUserGroupsResource {
  constructor(private client: ProxyHat) {}

  async list(): Promise<SubUserGroup[]> {
    return (await this.client.request(
      "GET",
      "/sub-user-groups",
    )) as SubUserGroup[];
  }

  async create(options: {
    name: string;
    description?: string;
  }): Promise<SubUserGroup> {
    return (await this.client.request("POST", "/sub-user-groups", {
      json: options as unknown as Record<string, unknown>,
    })) as SubUserGroup;
  }

  async get(id: string): Promise<SubUserGroup> {
    return (await this.client.request(
      "GET",
      `/sub-user-groups/${id}`,
    )) as SubUserGroup;
  }

  async update(
    id: string,
    options: {
      name?: string;
      description?: string;
    },
  ): Promise<SubUserGroup> {
    return (await this.client.request(
      "PUT",
      `/sub-user-groups/${id}`,
      { json: options as unknown as Record<string, unknown> },
    )) as SubUserGroup;
  }

  async delete(id: string): Promise<void> {
    await this.client.request("DELETE", `/sub-user-groups/${id}`);
  }
}
