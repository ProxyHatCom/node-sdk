import { describe, it, expect, vi, beforeEach } from "vitest";
import { ProxyHat } from "../src/client.js";
import {
  AuthenticationError,
  NotFoundError,
  PermissionError,
  ValidationError,
  RateLimitError,
  APIError,
} from "../src/errors.js";

function mockFetch(body: unknown, status = 200, headers: Record<string, string> = {}) {
  return vi.fn().mockResolvedValue({
    ok: status >= 200 && status < 300,
    status,
    headers: new Headers({ "content-type": "application/json", ...headers }),
    json: async () => body,
  });
}

beforeEach(() => {
  vi.restoreAllMocks();
});

describe("ProxyHat client", () => {
  it("initializes with default options", () => {
    const client = new ProxyHat({ apiKey: "ph_test" });
    expect(client).toBeInstanceOf(ProxyHat);
    expect(client.auth).toBeDefined();
    expect(client.sub_users).toBeDefined();
    expect(client.sub_user_groups).toBeDefined();
    expect(client.locations).toBeDefined();
    expect(client.analytics).toBeDefined();
    expect(client.proxy_presets).toBeDefined();
    expect(client.profile).toBeDefined();
    expect(client.two_factor).toBeDefined();
    expect(client.email).toBeDefined();
    expect(client.coupons).toBeDefined();
    expect(client.plans).toBeDefined();
    expect(client.payments).toBeDefined();
  });

  it("initializes with custom options", () => {
    const client = new ProxyHat({
      apiKey: "ph_custom",
      baseUrl: "https://custom.api.com/v2",
      timeout: 5000,
    });
    expect(client).toBeInstanceOf(ProxyHat);
  });

  it("sends authorization header", async () => {
    const fetchMock = mockFetch({ payload: [] });
    vi.stubGlobal("fetch", fetchMock);

    const client = new ProxyHat({ apiKey: "ph_test_key" });
    await client.request("GET", "/test");

    const callArgs = fetchMock.mock.calls[0];
    expect(callArgs[1].headers["Authorization"]).toBe("Bearer ph_test_key");
    expect(callArgs[1].headers["User-Agent"]).toBe("proxyhat-node/0.1.0");
    expect(callArgs[1].headers["Accept"]).toBe("application/json");
  });

  it("extracts payload from response envelope", async () => {
    vi.stubGlobal("fetch", mockFetch({ success: true, payload: { id: "123" } }));

    const client = new ProxyHat({ apiKey: "ph_test" });
    const result = await client.request("GET", "/test");
    expect(result).toEqual({ id: "123" });
  });

  it("extracts data from response envelope", async () => {
    vi.stubGlobal("fetch", mockFetch({ success: true, data: { id: "456" } }));

    const client = new ProxyHat({ apiKey: "ph_test" });
    const result = await client.request("GET", "/test");
    expect(result).toEqual({ id: "456" });
  });

  it("returns full body when no payload or data key", async () => {
    vi.stubGlobal("fetch", mockFetch({ access_token: "tok_123", token_type: "Bearer" }));

    const client = new ProxyHat({ apiKey: "ph_test" });
    const result = await client.request("GET", "/test");
    expect(result).toEqual({ access_token: "tok_123", token_type: "Bearer" });
  });

  it("sends JSON body on POST", async () => {
    const fetchMock = mockFetch({ payload: { id: "1" } });
    vi.stubGlobal("fetch", fetchMock);

    const client = new ProxyHat({ apiKey: "ph_test" });
    await client.request("POST", "/test", { json: { name: "test" } });

    const callArgs = fetchMock.mock.calls[0];
    expect(callArgs[1].method).toBe("POST");
    expect(callArgs[1].headers["Content-Type"]).toBe("application/json");
    expect(callArgs[1].body).toBe(JSON.stringify({ name: "test" }));
  });

  it("appends query params", async () => {
    const fetchMock = mockFetch({ payload: [] });
    vi.stubGlobal("fetch", fetchMock);

    const client = new ProxyHat({ apiKey: "ph_test" });
    await client.request("GET", "/test", { params: { limit: 10, offset: 0, empty: null } });

    const url = new URL(fetchMock.mock.calls[0][0]);
    expect(url.searchParams.get("limit")).toBe("10");
    expect(url.searchParams.get("offset")).toBe("0");
    expect(url.searchParams.has("empty")).toBe(false);
  });

  it("throws AuthenticationError on 401", async () => {
    vi.stubGlobal("fetch", mockFetch({ message: "Invalid token" }, 401));

    const client = new ProxyHat({ apiKey: "ph_bad" });
    await expect(client.request("GET", "/test")).rejects.toThrow(AuthenticationError);
  });

  it("throws PermissionError on 403", async () => {
    vi.stubGlobal("fetch", mockFetch({ message: "Forbidden" }, 403));

    const client = new ProxyHat({ apiKey: "ph_test" });
    await expect(client.request("GET", "/test")).rejects.toThrow(PermissionError);
  });

  it("throws NotFoundError on 404", async () => {
    vi.stubGlobal("fetch", mockFetch({ message: "Not found" }, 404));

    const client = new ProxyHat({ apiKey: "ph_test" });
    await expect(client.request("GET", "/test")).rejects.toThrow(NotFoundError);
  });

  it("throws ValidationError on 422", async () => {
    vi.stubGlobal(
      "fetch",
      mockFetch({ message: "Validation failed", errors: { name: ["required"] } }, 422),
    );

    const client = new ProxyHat({ apiKey: "ph_test" });
    try {
      await client.request("POST", "/test");
    } catch (e) {
      expect(e).toBeInstanceOf(ValidationError);
      expect((e as ValidationError).errors).toEqual({ name: ["required"] });
    }
  });

  it("throws RateLimitError on 429 with retry-after", async () => {
    vi.stubGlobal(
      "fetch",
      mockFetch({ message: "Too many requests" }, 429, { "retry-after": "30" }),
    );

    const client = new ProxyHat({ apiKey: "ph_test" });
    try {
      await client.request("GET", "/test");
    } catch (e) {
      expect(e).toBeInstanceOf(RateLimitError);
      expect((e as RateLimitError).retryAfter).toBe(30);
    }
  });

  it("throws APIError on 500", async () => {
    vi.stubGlobal("fetch", mockFetch({ message: "Internal error" }, 500));

    const client = new ProxyHat({ apiKey: "ph_test" });
    try {
      await client.request("GET", "/test");
    } catch (e) {
      expect(e).toBeInstanceOf(APIError);
      expect((e as APIError).statusCode).toBe(500);
    }
  });

  it("uses description field for error message", async () => {
    vi.stubGlobal("fetch", mockFetch({ description: "Custom error" }, 400));

    const client = new ProxyHat({ apiKey: "ph_test" });
    try {
      await client.request("GET", "/test");
    } catch (e) {
      expect((e as APIError).message).toBe("Custom error");
    }
  });

  it("falls back to HTTP status for error message", async () => {
    vi.stubGlobal("fetch", mockFetch({}, 503));

    const client = new ProxyHat({ apiKey: "ph_test" });
    try {
      await client.request("GET", "/test");
    } catch (e) {
      expect((e as APIError).message).toBe("HTTP 503");
    }
  });

  it("requestRaw returns raw Response", async () => {
    const response = {
      ok: true,
      status: 200,
      headers: new Headers({ "content-type": "application/pdf" }),
      json: async () => ({}),
    };
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(response));

    const client = new ProxyHat({ apiKey: "ph_test" });
    const result = await client.requestRaw("GET", "/test");
    expect(result.status).toBe(200);
  });
});
