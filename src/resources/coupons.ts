import type { ProxyHat } from "../client.js";
import type { CouponResponse } from "../types/coupons.js";

export class CouponsResource {
  constructor(private client: ProxyHat) {}

  async validate(options: {
    code: string;
    plan_id?: string;
    order_sum?: number;
    currency?: string;
  }): Promise<CouponResponse> {
    return (await this.client.request("POST", "/coupon/validate", {
      json: options as unknown as Record<string, unknown>,
    })) as CouponResponse;
  }

  async apply(options: {
    code: string;
    plan_id?: string;
    order_sum?: number;
    currency?: string;
  }): Promise<CouponResponse> {
    return (await this.client.request("POST", "/coupon/apply", {
      json: options as unknown as Record<string, unknown>,
    })) as CouponResponse;
  }

  async redeem(options: { code: string }): Promise<CouponResponse> {
    return (await this.client.request("POST", "/coupon/redeem", {
      json: options,
    })) as CouponResponse;
  }
}
