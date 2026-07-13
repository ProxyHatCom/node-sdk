import type { ProxyHat } from "../client.js";
import type { ProxyDescriptor, ProxyDescriptorInput } from "../types/proxy-descriptor.js";

/**
 * Server-side connection builder. Given an active sub-user, returns a ready
 * connection URL with the gateway username fully assembled by the API.
 *
 * For a purely local build (no network), use {@link import("../connection.js").buildConnectionUrl}
 * or the high-level `client.connectionUrl()` helper.
 */
export class ProxyDescriptorsResource {
  constructor(private client: ProxyHat) {}

  async create(options: ProxyDescriptorInput): Promise<ProxyDescriptor> {
    return (await this.client.request("POST", "/proxy-descriptors", {
      json: options as unknown as Record<string, unknown>,
    })) as ProxyDescriptor;
  }
}
