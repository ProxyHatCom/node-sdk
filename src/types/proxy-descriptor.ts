import type { ProxyProtocol } from "../connection.js";

export interface ProxyDescriptorInput {
  /** UUID of an ACTIVE sub-user to connect through. */
  sub_user_uuid: string;
  protocol: ProxyProtocol;
  location?: {
    country?: string;
    region?: string;
    city?: string;
  };
  session?: {
    mode: "rotating" | "sticky";
    ttl?: "30m" | "12h";
    id?: string;
  };
  filter?: string;
}

/** Server-built connection descriptor (POST /v1/proxy-descriptors). */
export interface ProxyDescriptor {
  provider_id: string;
  sub_user_uuid: string;
  protocol: ProxyProtocol;
  filter: string;
  host: string;
  port: number;
  username: string;
  password: string;
  /** Ready-to-use connection URL. */
  url: string;
  host_socks5: string;
  host_http: string;
}
