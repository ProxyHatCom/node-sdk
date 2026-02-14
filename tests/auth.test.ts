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

describe("AuthResource", () => {
  it("register", async () => {
    const data = { message: "Success", access_token: "tok", token_type: "Bearer" };
    vi.stubGlobal("fetch", mockFetch(data));

    const client = new ProxyHat({ apiKey: "ph_test" });
    const result = await client.auth.register({
      name: "John",
      email: "john@example.com",
      password: "pass123",
      password_confirmation: "pass123",
    });

    expect(result.access_token).toBe("tok");
    expect(result.message).toBe("Success");
  });

  it("login", async () => {
    const data = { access_token: "tok", token_type: "Bearer" };
    vi.stubGlobal("fetch", mockFetch(data));

    const client = new ProxyHat({ apiKey: "ph_test" });
    const result = await client.auth.login({
      email: "john@example.com",
      password: "pass123",
    });

    expect(result.access_token).toBe("tok");
  });

  it("user", async () => {
    const user = {
      payload: {
        uuid: "u-1",
        name: "John",
        email: "john@example.com",
        traffic: {
          subscription: null,
          subscription_starts_at: null,
          subscription_expires_at: null,
          regular_bytes: 1000,
          regular_human: "1 KB",
          subscription_bytes: 0,
          subscription_human: "0 B",
          total_bytes: 1000,
          total_human: "1 KB",
        },
      },
    };
    vi.stubGlobal("fetch", mockFetch(user));

    const client = new ProxyHat({ apiKey: "ph_test" });
    const result = await client.auth.user();

    expect(result.uuid).toBe("u-1");
    expect(result.traffic.total_bytes).toBe(1000);
  });

  it("logout", async () => {
    vi.stubGlobal("fetch", mockFetch({ payload: null }));

    const client = new ProxyHat({ apiKey: "ph_test" });
    await expect(client.auth.logout()).resolves.toBeUndefined();
  });

  it("supported_providers", async () => {
    vi.stubGlobal(
      "fetch",
      mockFetch({ payload: [{ name: "Google", slug: "google" }] }),
    );

    const client = new ProxyHat({ apiKey: "ph_test" });
    const result = await client.auth.supported_providers();
    expect(result).toEqual([{ name: "Google", slug: "google" }]);
  });

  it("social_accounts", async () => {
    vi.stubGlobal(
      "fetch",
      mockFetch({
        payload: [{ provider: "google", email: "j@g.com", connected_at: "2026-01-01" }],
      }),
    );

    const client = new ProxyHat({ apiKey: "ph_test" });
    const result = await client.auth.social_accounts();
    expect(result[0].provider).toBe("google");
  });

  it("disconnect_social", async () => {
    vi.stubGlobal("fetch", mockFetch({ payload: null }));

    const client = new ProxyHat({ apiKey: "ph_test" });
    await expect(client.auth.disconnect_social("google")).resolves.toBeUndefined();
  });

  it("oauth_redirect", async () => {
    vi.stubGlobal("fetch", mockFetch({ payload: { url: "https://oauth.example.com" } }));

    const client = new ProxyHat({ apiKey: "ph_test" });
    const result = await client.auth.oauth_redirect("google");
    expect(result).toEqual({ url: "https://oauth.example.com" });
  });
});
