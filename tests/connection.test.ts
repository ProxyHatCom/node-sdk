import { describe, it, expect, vi, beforeEach } from "vitest";
import { ProxyHat } from "../src/client.js";
import { buildConnectionUrl, buildProxyUsername } from "../src/connection.js";

describe("buildProxyUsername", () => {
  it("always includes a country, defaulting to 'any'", () => {
    expect(buildProxyUsername("ph-8f2a1c")).toBe("ph-8f2a1c-country-any");
  });

  it("encodes country, region, city and filter in order", () => {
    expect(
      buildProxyUsername("ph-1", { country: "US", region: "California", city: "Los Angeles", filter: "high" }),
    ).toBe("ph-1-country-us-region-california-city-los_angeles-filter-high");
  });

  it("adds a 16-hex sticky session id + ttl", () => {
    expect(buildProxyUsername("ph-1", { sticky: "30m" })).toMatch(/^ph-1-country-any-sid-[0-9a-f]{16}-ttl-30m$/);
    expect(buildProxyUsername("ph-1", { sticky: true })).toMatch(/-ttl-30m$/);
  });

  it("omits session tokens when rotating (no sticky)", () => {
    expect(buildProxyUsername("ph-1", { country: "de" })).not.toContain("-sid-");
  });

  it("drops filter for 'none' and strips a leading 'filter-'", () => {
    expect(buildProxyUsername("ph-1", { filter: "none" })).toBe("ph-1-country-any");
    expect(buildProxyUsername("ph-1", { filter: "filter-high-speed-fast" })).toBe(
      "ph-1-country-any-filter-high-speed-fast",
    );
  });
});

describe("buildConnectionUrl", () => {
  it("builds an http gateway URL on port 8080 by default", () => {
    expect(buildConnectionUrl({ username: "ph-1", password: "pw", country: "us" })).toBe(
      "http://ph-1-country-us:pw@gate.proxyhat.com:8080",
    );
  });

  it("builds a socks5 URL on port 1080", () => {
    expect(buildConnectionUrl({ username: "ph-1", password: "pw", protocol: "socks5" })).toBe(
      "socks5://ph-1-country-any:pw@gate.proxyhat.com:1080",
    );
  });

  it("url-encodes credentials", () => {
    expect(buildConnectionUrl({ username: "ph-1", password: "p@s:s" })).toContain("p%40s%3As@gate.proxyhat.com");
  });
});

describe("client.connectionUrl", () => {
  function mockSubUsers(payload: unknown) {
    return vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      headers: new Headers({ "content-type": "application/json" }),
      json: async () => ({ payload }),
    });
  }

  beforeEach(() => vi.restoreAllMocks());

  it("picks an active sub-user and builds a URL", async () => {
    vi.stubGlobal(
      "fetch",
      mockSubUsers([
        { uuid: "u1", proxy_username: "abc", proxy_password: "pw", traffic_limit: 100, used_traffic: 1, suspended_at: null },
      ]),
    );
    const url = await new ProxyHat({ apiKey: "k" }).connectionUrl({ country: "gb" });
    expect(url).toBe("http://abc-country-gb:pw@gate.proxyhat.com:8080");
  });

  it("skips suspended / out-of-traffic sub-users", async () => {
    vi.stubGlobal(
      "fetch",
      mockSubUsers([
        { uuid: "s", proxy_username: "susp", proxy_password: "pw", traffic_limit: 100, used_traffic: 1, suspended_at: "2026-01-01" },
        { uuid: "g", proxy_username: "good", proxy_password: "pw", traffic_limit: 0, used_traffic: 9, suspended_at: null },
      ]),
    );
    const url = await new ProxyHat({ apiKey: "k" }).connectionUrl();
    expect(url).toContain("good-country-any");
  });

  it("throws when no usable sub-user exists", async () => {
    vi.stubGlobal(
      "fetch",
      mockSubUsers([
        { uuid: "s", proxy_username: "x", proxy_password: "pw", traffic_limit: 100, used_traffic: 100, suspended_at: null },
      ]),
    );
    await expect(new ProxyHat({ apiKey: "k" }).connectionUrl()).rejects.toThrow(/No usable sub-user/);
  });
});
