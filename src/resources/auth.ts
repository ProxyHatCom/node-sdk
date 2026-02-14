import type { ProxyHat } from "../client.js";
import type {
  RegisterResponse,
  LoginResponse,
  User,
  SupportedProvider,
  SocialAccount,
} from "../types/auth.js";

export class AuthResource {
  constructor(private client: ProxyHat) {}

  async register(options: {
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
    referral_code?: string;
    utm_source?: string;
    utm_medium?: string;
    utm_campaign?: string;
  }): Promise<RegisterResponse> {
    return (await this.client.request("POST", "/auth/register", {
      json: options as unknown as Record<string, unknown>,
    })) as RegisterResponse;
  }

  async login(options: {
    email: string;
    password: string;
    twofa_code?: string;
  }): Promise<LoginResponse> {
    return (await this.client.request("POST", "/auth/login", {
      json: options as unknown as Record<string, unknown>,
    })) as LoginResponse;
  }

  async user(): Promise<User> {
    return (await this.client.request("GET", "/auth/user")) as User;
  }

  async logout(): Promise<void> {
    await this.client.request("POST", "/auth/logout");
  }

  async supported_providers(): Promise<SupportedProvider[]> {
    return (await this.client.request(
      "GET",
      "/auth/supported-providers",
    )) as SupportedProvider[];
  }

  async social_accounts(): Promise<SocialAccount[]> {
    return (await this.client.request(
      "GET",
      "/auth/social-accounts",
    )) as SocialAccount[];
  }

  async disconnect_social(provider: string): Promise<void> {
    await this.client.request(
      "DELETE",
      `/auth/social-accounts/${provider}`,
    );
  }

  async oauth_redirect(provider: string): Promise<unknown> {
    return await this.client.request(
      "GET",
      `/auth/${provider}/redirect`,
    );
  }
}
