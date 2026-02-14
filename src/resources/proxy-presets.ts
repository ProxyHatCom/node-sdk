import type { ProxyHat } from "../client.js";
import type { ProxyPreset } from "../types/proxy-preset.js";

export class ProxyPresetsResource {
  constructor(private client: ProxyHat) {}

  async list(): Promise<ProxyPreset[]> {
    return (await this.client.request(
      "GET",
      "/proxy-presets",
    )) as ProxyPreset[];
  }

  async create(options: {
    name: string;
    data: Record<string, unknown>;
  }): Promise<ProxyPreset> {
    return (await this.client.request("POST", "/proxy-presets", {
      json: options as unknown as Record<string, unknown>,
    })) as ProxyPreset;
  }

  async get(id: string): Promise<ProxyPreset> {
    return (await this.client.request(
      "GET",
      `/proxy-presets/${id}`,
    )) as ProxyPreset;
  }

  async update(
    id: string,
    options: {
      name?: string;
      data?: Record<string, unknown>;
    },
  ): Promise<ProxyPreset> {
    return (await this.client.request("PUT", `/proxy-presets/${id}`, {
      json: options as unknown as Record<string, unknown>,
    })) as ProxyPreset;
  }

  async delete(id: string): Promise<void> {
    await this.client.request("DELETE", `/proxy-presets/${id}`);
  }
}
