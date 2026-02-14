import type { ProxyHat } from "../client.js";
import type {
  TwoFactorStatus,
  TwoFactorEnableResponse,
  RecoveryCodes,
} from "../types/two-factor.js";

export class TwoFactorResource {
  constructor(private client: ProxyHat) {}

  async status(): Promise<TwoFactorStatus> {
    return (await this.client.request(
      "GET",
      "/profile/2fa/status",
    )) as TwoFactorStatus;
  }

  async enable(): Promise<TwoFactorEnableResponse> {
    return (await this.client.request(
      "POST",
      "/profile/2fa/enable",
    )) as TwoFactorEnableResponse;
  }

  async confirm(options: { code: string }): Promise<unknown> {
    return await this.client.request("POST", "/profile/2fa/confirm", {
      json: options,
    });
  }

  async disable(options: { twofa_code: string }): Promise<unknown> {
    return await this.client.request("POST", "/profile/2fa/disable", {
      json: options,
    });
  }

  async qr_code(): Promise<TwoFactorEnableResponse> {
    return (await this.client.request(
      "GET",
      "/profile/2fa/qr-code",
    )) as TwoFactorEnableResponse;
  }

  async recovery_codes(): Promise<RecoveryCodes> {
    return (await this.client.request(
      "GET",
      "/profile/2fa/recovery-codes",
    )) as RecoveryCodes;
  }

  async disable_by_recovery(options: {
    recovery_code: string;
  }): Promise<unknown> {
    return await this.client.request(
      "POST",
      "/profile/2fa/disable-by-recovery-code",
      { json: options },
    );
  }

  async change_password(options: {
    current_password: string;
    password: string;
    password_confirmation: string;
    twofa_code?: string;
  }): Promise<unknown> {
    return await this.client.request("POST", "/profile/password", {
      json: options as unknown as Record<string, unknown>,
    });
  }
}
