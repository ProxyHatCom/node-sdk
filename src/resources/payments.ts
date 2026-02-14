import type { ProxyHat } from "../client.js";
import type {
  Payment,
  PaymentCreateResponse,
  PaymentDetails,
  Cryptocurrency,
} from "../types/payments.js";

export class PaymentsResource {
  constructor(private client: ProxyHat) {}

  async list(): Promise<Payment[]> {
    return (await this.client.request(
      "GET",
      "/payments",
    )) as Payment[];
  }

  async create(options: {
    type: string;
    plan_id: string;
    gate?: string;
    cryptocurrency_code: string;
    coupon_code?: string;
  }): Promise<PaymentCreateResponse> {
    return (await this.client.request("POST", "/payments", {
      json: {
        gate: "crypto",
        ...options,
      } as unknown as Record<string, unknown>,
    })) as PaymentCreateResponse;
  }

  async get(id: string): Promise<PaymentDetails> {
    return (await this.client.request(
      "GET",
      `/payments/${id}`,
    )) as PaymentDetails;
  }

  async check(id: string): Promise<PaymentDetails> {
    return (await this.client.request(
      "GET",
      `/payments/${id}/check`,
    )) as PaymentDetails;
  }

  async invoice(
    id: string,
    options?: { format?: string },
  ): Promise<Response> {
    return await this.client.requestRaw("GET", `/payments/${id}/invoice`, {
      params: { format: options?.format ?? "pdf" },
    });
  }

  async cryptocurrencies(): Promise<Cryptocurrency[]> {
    return (await this.client.request(
      "GET",
      "/payments/cryptocurrencies",
    )) as Cryptocurrency[];
  }
}
