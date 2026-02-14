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

const PRESET = {
  id: "p-1",
  name: "US Residential",
  data: { form: {}, location: {} },
  created_at: "2026-01-01T00:00:00Z",
};

beforeEach(() => {
  vi.restoreAllMocks();
});

describe("ProxyPresetsResource", () => {
  it("list", async () => {
    vi.stubGlobal("fetch", mockFetch({ payload: [PRESET] }));

    const client = new ProxyHat({ apiKey: "ph_test" });
    const result = await client.proxy_presets.list();
    expect(result).toHaveLength(1);
    expect(result[0].name).toBe("US Residential");
  });

  it("create", async () => {
    vi.stubGlobal("fetch", mockFetch({ payload: PRESET }));

    const client = new ProxyHat({ apiKey: "ph_test" });
    const result = await client.proxy_presets.create({
      name: "US Residential",
      data: { form: {}, location: {} },
    });
    expect(result.id).toBe("p-1");
  });

  it("get", async () => {
    vi.stubGlobal("fetch", mockFetch({ payload: PRESET }));

    const client = new ProxyHat({ apiKey: "ph_test" });
    const result = await client.proxy_presets.get("p-1");
    expect(result.name).toBe("US Residential");
  });

  it("update", async () => {
    vi.stubGlobal(
      "fetch",
      mockFetch({ payload: { ...PRESET, name: "EU Mobile" } }),
    );

    const client = new ProxyHat({ apiKey: "ph_test" });
    const result = await client.proxy_presets.update("p-1", { name: "EU Mobile" });
    expect(result.name).toBe("EU Mobile");
  });

  it("delete", async () => {
    vi.stubGlobal("fetch", mockFetch({ payload: null }));

    const client = new ProxyHat({ apiKey: "ph_test" });
    await expect(client.proxy_presets.delete("p-1")).resolves.toBeUndefined();
  });
});
