import type { ProxyHat } from "../client.js";
import type { Preferences, APIKey } from "../types/profile.js";

export class ProfileResource {
  constructor(private client: ProxyHat) {}

  async get_preferences(): Promise<Preferences> {
    return (await this.client.request(
      "GET",
      "/profile/preferences",
    )) as Preferences;
  }

  async update_preferences(
    preferences: Record<string, unknown>,
  ): Promise<Preferences> {
    return (await this.client.request("PUT", "/profile/preferences", {
      json: preferences,
    })) as Preferences;
  }

  async list_api_keys(): Promise<APIKey[]> {
    return (await this.client.request(
      "GET",
      "/profile/api-keys",
    )) as APIKey[];
  }

  async create_api_key(options?: { name?: string }): Promise<APIKey> {
    return (await this.client.request("POST", "/profile/api-keys", {
      json: (options ?? {}) as Record<string, unknown>,
    })) as APIKey;
  }

  async delete_api_key(id: string): Promise<void> {
    await this.client.request("DELETE", `/profile/api-keys/${id}`);
  }

  async regenerate_api_key(id: string): Promise<APIKey> {
    return (await this.client.request(
      "POST",
      `/profile/api-keys/${id}/regenerate`,
    )) as APIKey;
  }
}
