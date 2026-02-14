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

describe("ProfileResource", () => {
  it("get_preferences", async () => {
    vi.stubGlobal(
      "fetch",
      mockFetch({ payload: { data: { theme: "dark" } } }),
    );

    const client = new ProxyHat({ apiKey: "ph_test" });
    const result = await client.profile.get_preferences();
    expect(result.data.theme).toBe("dark");
  });

  it("update_preferences", async () => {
    vi.stubGlobal(
      "fetch",
      mockFetch({ payload: { data: { theme: "light" } } }),
    );

    const client = new ProxyHat({ apiKey: "ph_test" });
    const result = await client.profile.update_preferences({ theme: "light" });
    expect(result.data.theme).toBe("light");
  });

  it("list_api_keys", async () => {
    vi.stubGlobal(
      "fetch",
      mockFetch({
        payload: [{ id: "k-1", name: "Default", plain_text_token: null, created_at: "2026-01-01" }],
      }),
    );

    const client = new ProxyHat({ apiKey: "ph_test" });
    const result = await client.profile.list_api_keys();
    expect(result[0].id).toBe("k-1");
  });

  it("create_api_key", async () => {
    vi.stubGlobal(
      "fetch",
      mockFetch({
        payload: { id: "k-2", name: "New", plain_text_token: "ph_new_key", created_at: "2026-01-01" },
      }),
    );

    const client = new ProxyHat({ apiKey: "ph_test" });
    const result = await client.profile.create_api_key({ name: "New" });
    expect(result.plain_text_token).toBe("ph_new_key");
  });

  it("delete_api_key", async () => {
    vi.stubGlobal("fetch", mockFetch({ payload: null }));

    const client = new ProxyHat({ apiKey: "ph_test" });
    await expect(client.profile.delete_api_key("k-1")).resolves.toBeUndefined();
  });

  it("regenerate_api_key", async () => {
    vi.stubGlobal(
      "fetch",
      mockFetch({
        payload: { id: "k-1", name: "Default", plain_text_token: "ph_regen", created_at: "2026-01-01" },
      }),
    );

    const client = new ProxyHat({ apiKey: "ph_test" });
    const result = await client.profile.regenerate_api_key("k-1");
    expect(result.plain_text_token).toBe("ph_regen");
  });
});
