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

describe("LocationsResource", () => {
  it("countries", async () => {
    vi.stubGlobal(
      "fetch",
      mockFetch({
        payload: [{ code: "US", name: "United States", availability: "high", connection_type: "residential" }],
      }),
    );

    const client = new ProxyHat({ apiKey: "ph_test" });
    const result = await client.locations.countries({ limit: 10 });
    expect(result[0].code).toBe("US");
  });

  it("countries passes query params", async () => {
    const fetchMock = mockFetch({ payload: [] });
    vi.stubGlobal("fetch", fetchMock);

    const client = new ProxyHat({ apiKey: "ph_test" });
    await client.locations.countries({ limit: 50, connection_type: "residential" });

    const url = new URL(fetchMock.mock.calls[0][0]);
    expect(url.searchParams.get("limit")).toBe("50");
    expect(url.searchParams.get("connection_type")).toBe("residential");
  });

  it("regions", async () => {
    vi.stubGlobal(
      "fetch",
      mockFetch({
        payload: [{ code: "CA", name: "California", country_code: "US" }],
      }),
    );

    const client = new ProxyHat({ apiKey: "ph_test" });
    const result = await client.locations.regions({ country__code: "US" });
    expect(result[0].name).toBe("California");
  });

  it("cities", async () => {
    vi.stubGlobal(
      "fetch",
      mockFetch({
        payload: [{ code: "LA", name: "Los Angeles", country_code: "US" }],
      }),
    );

    const client = new ProxyHat({ apiKey: "ph_test" });
    const result = await client.locations.cities();
    expect(result[0].code).toBe("LA");
  });

  it("isps", async () => {
    vi.stubGlobal(
      "fetch",
      mockFetch({
        payload: [{ code: "att", name: "AT&T", country_code: "US" }],
      }),
    );

    const client = new ProxyHat({ apiKey: "ph_test" });
    const result = await client.locations.isps({ country__code: "US" });
    expect(result[0].name).toBe("AT&T");
  });

  it("zipcodes", async () => {
    vi.stubGlobal(
      "fetch",
      mockFetch({
        payload: [{ code: "90001", name: "90001", country_code: "US" }],
      }),
    );

    const client = new ProxyHat({ apiKey: "ph_test" });
    const result = await client.locations.zipcodes({ country__code: "US" });
    expect(result[0].code).toBe("90001");
  });
});
