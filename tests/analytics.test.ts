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

describe("AnalyticsResource", () => {
  it("traffic", async () => {
    vi.stubGlobal(
      "fetch",
      mockFetch({ payload: { labels: ["2026-01-14"], data: [1073741824] } }),
    );

    const client = new ProxyHat({ apiKey: "ph_test" });
    const result = await client.analytics.traffic({ period: "7d" });
    expect(result.labels).toEqual(["2026-01-14"]);
    expect(result.data).toEqual([1073741824]);
  });

  it("traffic sends default period", async () => {
    const fetchMock = mockFetch({ payload: { labels: [], data: [] } });
    vi.stubGlobal("fetch", fetchMock);

    const client = new ProxyHat({ apiKey: "ph_test" });
    await client.analytics.traffic();

    const body = JSON.parse(fetchMock.mock.calls[0][1].body);
    expect(body.period).toBe("24h");
  });

  it("traffic_total", async () => {
    vi.stubGlobal("fetch", mockFetch({ payload: { total: 5000 } }));

    const client = new ProxyHat({ apiKey: "ph_test" });
    const result = await client.analytics.traffic_total({ period: "30d" });
    expect(result.total).toBe(5000);
  });

  it("requests", async () => {
    vi.stubGlobal(
      "fetch",
      mockFetch({ payload: { labels: ["2026-01-14"], data: [100] } }),
    );

    const client = new ProxyHat({ apiKey: "ph_test" });
    const result = await client.analytics.requests();
    expect(result.data).toEqual([100]);
  });

  it("requests_total", async () => {
    vi.stubGlobal("fetch", mockFetch({ payload: { total: 250 } }));

    const client = new ProxyHat({ apiKey: "ph_test" });
    const result = await client.analytics.requests_total();
    expect(result.total).toBe(250);
  });

  it("domain_breakdown", async () => {
    vi.stubGlobal(
      "fetch",
      mockFetch({
        payload: { items: [{ domain: "example.com", bandwidth: 1000, requests: 50 }] },
      }),
    );

    const client = new ProxyHat({ apiKey: "ph_test" });
    const result = await client.analytics.domain_breakdown();
    expect(result.items[0].domain).toBe("example.com");
  });
});
