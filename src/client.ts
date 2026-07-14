import {
  AuthenticationError,
  PermissionError,
  NotFoundError,
  ValidationError,
  RateLimitError,
  APIError,
} from "./errors.js";
import {
  AuthResource,
  SubUsersResource,
  SubUserGroupsResource,
  LocationsResource,
  AnalyticsResource,
  ProxyPresetsResource,
  ProxyDescriptorsResource,
  ProfileResource,
  TwoFactorResource,
  EmailResource,
  CouponsResource,
  PlansResource,
  PaymentsResource,
} from "./resources/index.js";
import { buildConnectionUrl, type ConnectionTargeting, type ProxyProtocol } from "./connection.js";

const DEFAULT_BASE_URL = "https://api.proxyhat.com/v1";
const DEFAULT_TIMEOUT = 30000;
// Keep in sync with the "version" field in package.json.
const USER_AGENT = "proxyhat-node/0.2.2";

export interface ProxyHatOptions {
  apiKey?: string;
  baseUrl?: string;
  timeout?: number;
}

export interface RequestOptions {
  json?: Record<string, unknown>;
  params?: Record<string, unknown>;
}

export class ProxyHat {
  private apiKey: string | undefined;
  private baseUrl: string;
  private timeout: number;

  readonly auth: AuthResource;
  readonly sub_users: SubUsersResource;
  readonly sub_user_groups: SubUserGroupsResource;
  readonly locations: LocationsResource;
  readonly analytics: AnalyticsResource;
  readonly proxy_presets: ProxyPresetsResource;
  readonly proxy_descriptors: ProxyDescriptorsResource;
  readonly profile: ProfileResource;
  readonly two_factor: TwoFactorResource;
  readonly email: EmailResource;
  readonly coupons: CouponsResource;
  readonly plans: PlansResource;
  readonly payments: PaymentsResource;

  constructor(options: ProxyHatOptions = {}) {
    this.apiKey = options.apiKey;
    this.baseUrl = (options.baseUrl ?? DEFAULT_BASE_URL).replace(/\/+$/, "");
    this.timeout = options.timeout ?? DEFAULT_TIMEOUT;

    this.auth = new AuthResource(this);
    this.sub_users = new SubUsersResource(this);
    this.sub_user_groups = new SubUserGroupsResource(this);
    this.locations = new LocationsResource(this);
    this.analytics = new AnalyticsResource(this);
    this.proxy_presets = new ProxyPresetsResource(this);
    this.proxy_descriptors = new ProxyDescriptorsResource(this);
    this.profile = new ProfileResource(this);
    this.two_factor = new TwoFactorResource(this);
    this.email = new EmailResource(this);
    this.coupons = new CouponsResource(this);
    this.plans = new PlansResource(this);
    this.payments = new PaymentsResource(this);
  }

  /**
   * Get a ready-to-use residential proxy connection URL — the fast path from an
   * API key to actually using proxies. Looks up your sub-users, picks an active
   * one with remaining traffic (or the one named by `subUser`), and builds the
   * gateway URL locally with your targeting.
   *
   * ```ts
   * const proxy = new ProxyHat({ apiKey });
   * const url = await proxy.connectionUrl({ country: "us" });
   * // → http://<user>-country-us:<pass>@gate.proxyhat.com:8080
   * ```
   */
  async connectionUrl(
    options: ConnectionTargeting & { subUser?: string; protocol?: ProxyProtocol } = {},
  ): Promise<string> {
    const list = await this.sub_users.list();
    const want = options.subUser?.trim();
    const usable = list.filter(
      (s) => !s.suspended_at && (s.traffic_limit === 0 || s.used_traffic < s.traffic_limit),
    );
    const chosen = want ? list.find((s) => s.uuid === want || s.name === want) : usable[0];

    if (!chosen?.proxy_username || !chosen?.proxy_password) {
      throw new Error(
        want
          ? `No sub-user matched "${want}" (or it has no proxy credentials).`
          : "No usable sub-user found (all suspended or out of traffic). Create one, top up, or pass { subUser }.",
      );
    }
    return buildConnectionUrl({
      username: chosen.proxy_username,
      password: chosen.proxy_password,
      ...options,
    });
  }

  private buildHeaders(): Record<string, string> {
    const headers: Record<string, string> = {
      "User-Agent": USER_AGENT,
      Accept: "application/json",
    };
    if (this.apiKey) {
      headers["Authorization"] = `Bearer ${this.apiKey}`;
    }
    return headers;
  }

  private buildUrl(
    path: string,
    params?: Record<string, unknown>,
  ): string {
    const url = new URL(`${this.baseUrl}${path}`);
    if (params) {
      for (const [key, value] of Object.entries(params)) {
        if (value !== undefined && value !== null) {
          url.searchParams.set(key, String(value));
        }
      }
    }
    return url.toString();
  }

  private static raiseForStatus(
    statusCode: number,
    body: unknown,
    headers: Headers,
  ): void {
    if (statusCode >= 200 && statusCode < 300) {
      return;
    }

    let message = "";
    let errors: unknown = null;

    if (body && typeof body === "object") {
      const b = body as Record<string, unknown>;
      message =
        (b.description as string) || (b.message as string) || "";
      errors = b.errors ?? null;
    }

    if (!message) {
      message = `HTTP ${statusCode}`;
    }

    switch (statusCode) {
      case 401:
        throw new AuthenticationError(message, errors);
      case 403:
        throw new PermissionError(message, errors);
      case 404:
        throw new NotFoundError(message, errors);
      case 422:
        throw new ValidationError(message, errors);
      case 429: {
        let retryAfter: number | null = null;
        const retryHeader = headers.get("retry-after");
        if (retryHeader) {
          const parsed = parseInt(retryHeader, 10);
          if (!isNaN(parsed)) {
            retryAfter = parsed;
          }
        }
        throw new RateLimitError(message, errors, retryAfter);
      }
      default:
        throw new APIError(message, statusCode, errors);
    }
  }

  private static extractPayload(body: unknown): unknown {
    if (body && typeof body === "object") {
      const b = body as Record<string, unknown>;
      if ("payload" in b) return b.payload;
      if ("data" in b) return b.data;
    }
    return body;
  }

  async request(
    method: string,
    path: string,
    options?: RequestOptions,
  ): Promise<unknown> {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), this.timeout);

    try {
      const url = this.buildUrl(path, options?.params);
      const init: RequestInit = {
        method,
        headers: {
          ...this.buildHeaders(),
          ...(options?.json ? { "Content-Type": "application/json" } : {}),
        },
        signal: controller.signal,
        body: options?.json ? JSON.stringify(options.json) : undefined,
      };

      const response = await fetch(url, init);
      const contentType = response.headers.get("content-type") ?? "";

      let body: unknown = {};
      if (contentType.includes("application/json")) {
        try {
          body = await response.json();
        } catch {
          body = {};
        }
      }

      ProxyHat.raiseForStatus(response.status, body, response.headers);
      return ProxyHat.extractPayload(body);
    } finally {
      clearTimeout(timer);
    }
  }

  async requestRaw(
    method: string,
    path: string,
    options?: { params?: Record<string, unknown> },
  ): Promise<Response> {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), this.timeout);

    try {
      const url = this.buildUrl(path, options?.params);
      const init: RequestInit = {
        method,
        headers: this.buildHeaders(),
        signal: controller.signal,
      };

      const response = await fetch(url, init);

      if (!response.ok) {
        const contentType = response.headers.get("content-type") ?? "";
        let body: unknown = {};
        if (contentType.includes("application/json")) {
          try {
            body = await response.json();
          } catch {
            body = {};
          }
        }
        ProxyHat.raiseForStatus(response.status, body, response.headers);
      }

      return response;
    } finally {
      clearTimeout(timer);
    }
  }
}
