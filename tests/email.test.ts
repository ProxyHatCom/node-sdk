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

describe("EmailResource", () => {
  it("request_change", async () => {
    vi.stubGlobal(
      "fetch",
      mockFetch({ payload: { message: "Verification email sent" } }),
    );

    const client = new ProxyHat({ apiKey: "ph_test" });
    const result = await client.email.request_change({ email: "new@example.com" });
    expect(result.message).toBe("Verification email sent");
  });

  it("confirm_change", async () => {
    vi.stubGlobal(
      "fetch",
      mockFetch({ payload: { message: "Email changed" } }),
    );

    const client = new ProxyHat({ apiKey: "ph_test" });
    const result = await client.email.confirm_change({ token: "tok_123" });
    expect(result.message).toBe("Email changed");
  });

  it("cancel_change", async () => {
    vi.stubGlobal(
      "fetch",
      mockFetch({ payload: { message: "Change cancelled" } }),
    );

    const client = new ProxyHat({ apiKey: "ph_test" });
    const result = await client.email.cancel_change();
    expect(result.message).toBe("Change cancelled");
  });

  it("resend_verification", async () => {
    vi.stubGlobal(
      "fetch",
      mockFetch({ payload: { message: "Email resent" } }),
    );

    const client = new ProxyHat({ apiKey: "ph_test" });
    const result = await client.email.resend_verification();
    expect(result.message).toBe("Email resent");
  });
});
