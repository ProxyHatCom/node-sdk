import { describe, it, expect, vi, beforeEach } from "vitest";
import { ProxyHat } from "../src/client.js";

function mockFetch(body: unknown, status = 200) {
  return vi.fn().mockResolvedValue({
    ok: status >= 200 && status < 300,
    status,
    headers: new Headers({ "content-type": "application/json" }),
    json: async () => body,
  });
}

const COUPON_RESPONSE = {
  success: true,
  coupon: {
    id: "c-1",
    code: "SAVE10",
    type: "percentage",
    data: {},
    discount: 10.0,
    final_amount: 45.0,
  },
};

beforeEach(() => {
  vi.restoreAllMocks();
});

describe("CouponsResource", () => {
  it("validate", async () => {
    vi.stubGlobal("fetch", mockFetch(COUPON_RESPONSE));

    const client = new ProxyHat({ apiKey: "ph_test" });
    const result = await client.coupons.validate({ code: "SAVE10" });
    expect(result.success).toBe(true);
    expect(result.coupon?.discount).toBe(10.0);
  });

  it("apply", async () => {
    vi.stubGlobal("fetch", mockFetch(COUPON_RESPONSE));

    const client = new ProxyHat({ apiKey: "ph_test" });
    const result = await client.coupons.apply({
      code: "SAVE10",
      plan_id: "plan-1",
      order_sum: 50.0,
    });
    expect(result.coupon?.final_amount).toBe(45.0);
  });

  it("redeem", async () => {
    vi.stubGlobal("fetch", mockFetch({ success: true, coupon: null }));

    const client = new ProxyHat({ apiKey: "ph_test" });
    const result = await client.coupons.redeem({ code: "FREETRAFFIC" });
    expect(result.success).toBe(true);
  });
});
