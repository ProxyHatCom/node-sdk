export class ProxyHatError extends Error {
  message: string;
  statusCode: number | null;
  errors: unknown;

  constructor(
    message: string,
    statusCode: number | null = null,
    errors: unknown = null,
  ) {
    super(message);
    this.name = "ProxyHatError";
    this.message = message;
    this.statusCode = statusCode;
    this.errors = errors;
  }
}

export class AuthenticationError extends ProxyHatError {
  constructor(message = "Unauthorized", errors: unknown = null) {
    super(message, 401, errors);
    this.name = "AuthenticationError";
  }
}

export class PermissionError extends ProxyHatError {
  constructor(message = "Forbidden", errors: unknown = null) {
    super(message, 403, errors);
    this.name = "PermissionError";
  }
}

export class NotFoundError extends ProxyHatError {
  constructor(message = "Not Found", errors: unknown = null) {
    super(message, 404, errors);
    this.name = "NotFoundError";
  }
}

export class ValidationError extends ProxyHatError {
  constructor(message = "Validation Error", errors: unknown = null) {
    super(message, 422, errors);
    this.name = "ValidationError";
  }
}

export class RateLimitError extends ProxyHatError {
  retryAfter: number | null;

  constructor(
    message = "Rate Limited",
    errors: unknown = null,
    retryAfter: number | null = null,
  ) {
    super(message, 429, errors);
    this.name = "RateLimitError";
    this.retryAfter = retryAfter;
  }
}

export class APIError extends ProxyHatError {
  constructor(
    message = "API Error",
    statusCode = 500,
    errors: unknown = null,
  ) {
    super(message, statusCode, errors);
    this.name = "APIError";
  }
}
