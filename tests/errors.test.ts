import { describe, it, expect } from "vitest";
import {
  ProxyHatError,
  AuthenticationError,
  PermissionError,
  NotFoundError,
  ValidationError,
  RateLimitError,
  APIError,
} from "../src/errors.js";

describe("Error hierarchy", () => {
  it("ProxyHatError is base class", () => {
    const err = new ProxyHatError("test");
    expect(err).toBeInstanceOf(Error);
    expect(err).toBeInstanceOf(ProxyHatError);
    expect(err.message).toBe("test");
    expect(err.statusCode).toBeNull();
    expect(err.errors).toBeNull();
    expect(err.name).toBe("ProxyHatError");
  });

  it("AuthenticationError has status 401", () => {
    const err = new AuthenticationError();
    expect(err).toBeInstanceOf(ProxyHatError);
    expect(err.statusCode).toBe(401);
    expect(err.message).toBe("Unauthorized");
    expect(err.name).toBe("AuthenticationError");
  });

  it("PermissionError has status 403", () => {
    const err = new PermissionError();
    expect(err).toBeInstanceOf(ProxyHatError);
    expect(err.statusCode).toBe(403);
    expect(err.message).toBe("Forbidden");
    expect(err.name).toBe("PermissionError");
  });

  it("NotFoundError has status 404", () => {
    const err = new NotFoundError("Resource missing");
    expect(err).toBeInstanceOf(ProxyHatError);
    expect(err.statusCode).toBe(404);
    expect(err.message).toBe("Resource missing");
    expect(err.name).toBe("NotFoundError");
  });

  it("ValidationError has status 422 and field errors", () => {
    const fieldErrors = { email: ["required"] };
    const err = new ValidationError("Bad input", fieldErrors);
    expect(err).toBeInstanceOf(ProxyHatError);
    expect(err.statusCode).toBe(422);
    expect(err.errors).toEqual(fieldErrors);
    expect(err.name).toBe("ValidationError");
  });

  it("RateLimitError has status 429 and retryAfter", () => {
    const err = new RateLimitError("Slow down", null, 60);
    expect(err).toBeInstanceOf(ProxyHatError);
    expect(err.statusCode).toBe(429);
    expect(err.retryAfter).toBe(60);
    expect(err.name).toBe("RateLimitError");
  });

  it("APIError has configurable status code", () => {
    const err = new APIError("Server error", 502);
    expect(err).toBeInstanceOf(ProxyHatError);
    expect(err.statusCode).toBe(502);
    expect(err.name).toBe("APIError");
  });
});
