import type { ProxyHat } from "../client.js";
import type { EmailChangeResponse } from "../types/email.js";

export class EmailResource {
  constructor(private client: ProxyHat) {}

  async request_change(options: {
    email: string;
    twofa_code?: string;
  }): Promise<EmailChangeResponse> {
    return (await this.client.request(
      "POST",
      "/profile/email/request-change",
      { json: options as unknown as Record<string, unknown> },
    )) as EmailChangeResponse;
  }

  async confirm_change(options: {
    token: string;
  }): Promise<EmailChangeResponse> {
    return (await this.client.request(
      "POST",
      "/profile/email/confirm-change",
      { json: options },
    )) as EmailChangeResponse;
  }

  async cancel_change(): Promise<EmailChangeResponse> {
    return (await this.client.request(
      "POST",
      "/profile/email/cancel-change",
    )) as EmailChangeResponse;
  }

  async resend_verification(): Promise<EmailChangeResponse> {
    return (await this.client.request(
      "POST",
      "/profile/email/resend-verification",
    )) as EmailChangeResponse;
  }
}
