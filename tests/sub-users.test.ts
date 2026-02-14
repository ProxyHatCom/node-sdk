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

const SUB_USER = {
  uuid: "su-1",
  proxy_username: "user_abc",
  is_default_user: false,
  is_traffic_limited: true,
  used_traffic: 1000,
  traffic_limit: 5000,
  lifecycle_status: "Active",
  name: "Test",
  notes: null,
  sub_user_group_id: null,
  created_at: "2026-01-01T00:00:00Z",
};

beforeEach(() => {
  vi.restoreAllMocks();
});

describe("SubUsersResource", () => {
  it("list", async () => {
    vi.stubGlobal("fetch", mockFetch({ payload: [SUB_USER] }));

    const client = new ProxyHat({ apiKey: "ph_test" });
    const result = await client.sub_users.list();
    expect(result).toHaveLength(1);
    expect(result[0].uuid).toBe("su-1");
  });

  it("create", async () => {
    vi.stubGlobal("fetch", mockFetch({ payload: SUB_USER }));

    const client = new ProxyHat({ apiKey: "ph_test" });
    const result = await client.sub_users.create({
      proxy_password: "pass123",
      is_traffic_limited: true,
      traffic_limit: "5GB",
      name: "Test",
    });
    expect(result.proxy_username).toBe("user_abc");
  });

  it("get", async () => {
    vi.stubGlobal("fetch", mockFetch({ payload: SUB_USER }));

    const client = new ProxyHat({ apiKey: "ph_test" });
    const result = await client.sub_users.get("su-1");
    expect(result.uuid).toBe("su-1");
  });

  it("update", async () => {
    const updated = { ...SUB_USER, name: "Updated" };
    vi.stubGlobal("fetch", mockFetch({ payload: updated }));

    const client = new ProxyHat({ apiKey: "ph_test" });
    const result = await client.sub_users.update("su-1", { name: "Updated" });
    expect(result.name).toBe("Updated");
  });

  it("delete", async () => {
    vi.stubGlobal("fetch", mockFetch({ payload: null }));

    const client = new ProxyHat({ apiKey: "ph_test" });
    await expect(client.sub_users.delete("su-1")).resolves.toBeUndefined();
  });

  it("reset_usage", async () => {
    vi.stubGlobal("fetch", mockFetch({ payload: { reset: 2 } }));

    const client = new ProxyHat({ apiKey: "ph_test" });
    const result = await client.sub_users.reset_usage(["su-1", "su-2"]);
    expect(result.reset).toBe(2);
  });

  it("bulk_delete", async () => {
    vi.stubGlobal(
      "fetch",
      mockFetch({
        payload: { requested: 2, deleted: 2, skipped: 0, not_found: 0, failed: 0 },
      }),
    );

    const client = new ProxyHat({ apiKey: "ph_test" });
    const result = await client.sub_users.bulk_delete(["su-1", "su-2"]);
    expect(result.deleted).toBe(2);
  });

  it("bulk_move_to_group", async () => {
    vi.stubGlobal("fetch", mockFetch({ payload: null }));

    const client = new ProxyHat({ apiKey: "ph_test" });
    await client.sub_users.bulk_move_to_group(["su-1"], "grp-1");
  });
});
