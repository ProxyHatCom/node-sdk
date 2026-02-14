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

describe("TwoFactorResource", () => {
  it("status", async () => {
    vi.stubGlobal("fetch", mockFetch({ payload: { enabled: true } }));

    const client = new ProxyHat({ apiKey: "ph_test" });
    const result = await client.two_factor.status();
    expect(result.enabled).toBe(true);
  });

  it("enable", async () => {
    vi.stubGlobal(
      "fetch",
      mockFetch({ payload: { qr: "data:image/svg+xml;base64,...", secret: "SECRET", recovery_codes: ["1234"] } }),
    );

    const client = new ProxyHat({ apiKey: "ph_test" });
    const result = await client.two_factor.enable();
    expect(result.secret).toBe("SECRET");
    expect(result.recovery_codes).toEqual(["1234"]);
  });

  it("confirm", async () => {
    vi.stubGlobal("fetch", mockFetch({ payload: { success: true } }));

    const client = new ProxyHat({ apiKey: "ph_test" });
    await client.two_factor.confirm({ code: "123456" });
  });

  it("disable", async () => {
    vi.stubGlobal("fetch", mockFetch({ payload: { success: true } }));

    const client = new ProxyHat({ apiKey: "ph_test" });
    await client.two_factor.disable({ twofa_code: "123456" });
  });

  it("qr_code", async () => {
    vi.stubGlobal(
      "fetch",
      mockFetch({ payload: { qr: "qr_data", secret: "SEC", recovery_codes: [] } }),
    );

    const client = new ProxyHat({ apiKey: "ph_test" });
    const result = await client.two_factor.qr_code();
    expect(result.qr).toBe("qr_data");
  });

  it("recovery_codes", async () => {
    vi.stubGlobal(
      "fetch",
      mockFetch({ payload: { codes: ["1111-2222", "3333-4444"] } }),
    );

    const client = new ProxyHat({ apiKey: "ph_test" });
    const result = await client.two_factor.recovery_codes();
    expect(result.codes).toHaveLength(2);
  });

  it("disable_by_recovery", async () => {
    vi.stubGlobal("fetch", mockFetch({ payload: { success: true } }));

    const client = new ProxyHat({ apiKey: "ph_test" });
    await client.two_factor.disable_by_recovery({ recovery_code: "1111-2222" });
  });

  it("change_password", async () => {
    vi.stubGlobal("fetch", mockFetch({ payload: { success: true } }));

    const client = new ProxyHat({ apiKey: "ph_test" });
    await client.two_factor.change_password({
      current_password: "old",
      password: "new",
      password_confirmation: "new",
    });
  });
});
