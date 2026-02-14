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

const GROUP = {
  id: "grp-1",
  name: "Scrapers",
  description: "Scraper group",
  sub_users_count: 3,
  created_at: "2026-01-01T00:00:00Z",
  sub_users: [],
};

beforeEach(() => {
  vi.restoreAllMocks();
});

describe("SubUserGroupsResource", () => {
  it("list", async () => {
    vi.stubGlobal("fetch", mockFetch({ payload: [GROUP] }));

    const client = new ProxyHat({ apiKey: "ph_test" });
    const result = await client.sub_user_groups.list();
    expect(result).toHaveLength(1);
    expect(result[0].name).toBe("Scrapers");
  });

  it("create", async () => {
    vi.stubGlobal("fetch", mockFetch({ payload: GROUP }));

    const client = new ProxyHat({ apiKey: "ph_test" });
    const result = await client.sub_user_groups.create({ name: "Scrapers" });
    expect(result.id).toBe("grp-1");
  });

  it("get", async () => {
    vi.stubGlobal("fetch", mockFetch({ payload: GROUP }));

    const client = new ProxyHat({ apiKey: "ph_test" });
    const result = await client.sub_user_groups.get("grp-1");
    expect(result.sub_users_count).toBe(3);
  });

  it("update", async () => {
    vi.stubGlobal(
      "fetch",
      mockFetch({ payload: { ...GROUP, name: "Updated" } }),
    );

    const client = new ProxyHat({ apiKey: "ph_test" });
    const result = await client.sub_user_groups.update("grp-1", { name: "Updated" });
    expect(result.name).toBe("Updated");
  });

  it("delete", async () => {
    vi.stubGlobal("fetch", mockFetch({ payload: null }));

    const client = new ProxyHat({ apiKey: "ph_test" });
    await expect(client.sub_user_groups.delete("grp-1")).resolves.toBeUndefined();
  });
});
