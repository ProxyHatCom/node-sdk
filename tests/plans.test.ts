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

const REGULAR_PLAN = {
  id: "rp-1",
  name: "starter-10gb",
  gb: 10,
  price_per_gb: 5.0,
  price_total: 50.0,
  currency: "USD",
};

const SUB_PLAN = {
  id: "sp-1",
  name: "pro-monthly",
  gb: 100,
  price_per_gb: 3.0,
  price_total: 300.0,
  period: "monthly",
  rollover_enabled: false,
};

beforeEach(() => {
  vi.restoreAllMocks();
});

describe("PlansResource", () => {
  it("list_regular", async () => {
    vi.stubGlobal("fetch", mockFetch({ payload: [REGULAR_PLAN] }));

    const client = new ProxyHat({ apiKey: "ph_test" });
    const result = await client.plans.list_regular();
    expect(result[0].name).toBe("starter-10gb");
  });

  it("list_subscriptions", async () => {
    vi.stubGlobal("fetch", mockFetch({ payload: [SUB_PLAN] }));

    const client = new ProxyHat({ apiKey: "ph_test" });
    const result = await client.plans.list_subscriptions();
    expect(result[0].period).toBe("monthly");
  });

  it("get_regular", async () => {
    vi.stubGlobal("fetch", mockFetch({ payload: REGULAR_PLAN }));

    const client = new ProxyHat({ apiKey: "ph_test" });
    const result = await client.plans.get_regular("starter-10gb");
    expect(result.price_total).toBe(50.0);
  });

  it("get_subscription", async () => {
    vi.stubGlobal("fetch", mockFetch({ payload: SUB_PLAN }));

    const client = new ProxyHat({ apiKey: "ph_test" });
    const result = await client.plans.get_subscription("pro-monthly");
    expect(result.gb).toBe(100);
  });

  it("pricing_regular", async () => {
    vi.stubGlobal("fetch", mockFetch({ payload: [{ tier: "basic" }] }));

    const client = new ProxyHat({ apiKey: "ph_test" });
    const result = await client.plans.pricing_regular();
    expect(result).toHaveLength(1);
  });

  it("pricing_subscriptions", async () => {
    vi.stubGlobal("fetch", mockFetch({ payload: [{ tier: "pro" }] }));

    const client = new ProxyHat({ apiKey: "ph_test" });
    const result = await client.plans.pricing_subscriptions();
    expect(result).toHaveLength(1);
  });
});
