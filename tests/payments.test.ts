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

beforeEach(() => {
  vi.restoreAllMocks();
});

describe("PaymentsResource", () => {
  it("list", async () => {
    vi.stubGlobal(
      "fetch",
      mockFetch({
        payload: [{ id: "pay-1", type: "regular", status: "completed", amount: 50, currency: "USD", created_at: "2026-01-01" }],
      }),
    );

    const client = new ProxyHat({ apiKey: "ph_test" });
    const result = await client.payments.list();
    expect(result[0].id).toBe("pay-1");
  });

  it("create", async () => {
    vi.stubGlobal("fetch", mockFetch({ success: true, payment_id: "pay-2" }));

    const client = new ProxyHat({ apiKey: "ph_test" });
    const result = await client.payments.create({
      type: "regular",
      plan_id: "plan-1",
      cryptocurrency_code: "BTC",
    });
    expect(result.payment_id).toBe("pay-2");
  });

  it("get", async () => {
    vi.stubGlobal(
      "fetch",
      mockFetch({
        data: {
          pay_address: "0xabc",
          crypto_amount: 0.001,
          amount_usd: 50,
          crypto: { code: "BTC", currency: "Bitcoin", network: "bitcoin" },
          status: "pending",
        },
      }),
    );

    const client = new ProxyHat({ apiKey: "ph_test" });
    const result = await client.payments.get("pay-1");
    expect(result.pay_address).toBe("0xabc");
  });

  it("check", async () => {
    vi.stubGlobal(
      "fetch",
      mockFetch({
        data: {
          pay_address: "0xabc",
          crypto_amount: 0.001,
          amount_usd: 50,
          crypto: { code: "BTC", currency: "Bitcoin", network: "bitcoin" },
          status: "completed",
        },
      }),
    );

    const client = new ProxyHat({ apiKey: "ph_test" });
    const result = await client.payments.check("pay-1");
    expect(result.status).toBe("completed");
  });

  it("invoice returns raw response", async () => {
    const response = {
      ok: true,
      status: 200,
      headers: new Headers({ "content-type": "application/pdf" }),
      json: async () => ({}),
    };
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(response));

    const client = new ProxyHat({ apiKey: "ph_test" });
    const result = await client.payments.invoice("pay-1");
    expect(result.status).toBe(200);
  });

  it("invoice passes format param", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      headers: new Headers({ "content-type": "text/html" }),
      json: async () => ({}),
    });
    vi.stubGlobal("fetch", fetchMock);

    const client = new ProxyHat({ apiKey: "ph_test" });
    await client.payments.invoice("pay-1", { format: "html" });

    const url = new URL(fetchMock.mock.calls[0][0]);
    expect(url.searchParams.get("format")).toBe("html");
  });

  it("cryptocurrencies", async () => {
    vi.stubGlobal(
      "fetch",
      mockFetch({
        payload: [{ code: "BTC", currency: "Bitcoin", network: "bitcoin" }],
      }),
    );

    const client = new ProxyHat({ apiKey: "ph_test" });
    const result = await client.payments.cryptocurrencies();
    expect(result[0].code).toBe("BTC");
  });
});
