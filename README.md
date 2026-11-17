# ProxyHat Node.js SDK

The official Node.js/TypeScript SDK for the [ProxyHat](https://proxyhat.com?utm_source=github&utm_medium=readme&utm_campaign=sdk-node&utm_content=hero) residential proxy API.

[![CI](https://github.com/ProxyHatCom/node-sdk/actions/workflows/ci.yml/badge.svg)](https://github.com/ProxyHatCom/node-sdk/actions/workflows/ci.yml)
[![npm](https://img.shields.io/npm/v/proxyhat)](https://www.npmjs.com/package/proxyhat)
[![Node](https://img.shields.io/node/v/proxyhat)](https://www.npmjs.com/package/proxyhat)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

> [!TIP]
> **Recommended proxies — [ProxyHat](https://proxyhat.com?utm_source=github&utm_medium=readme&utm_campaign=sdk-node&utm_content=callout) residential IPs.** Every feature in this package is tested end-to-end against ProxyHat and works great. First-class integration; also works with any proxy, or none.


## Features

- **One-call proxy connection** — `client.connectionUrl()` turns your API key into a ready-to-use residential proxy URL
- Full coverage of the ProxyHat API
- Local gateway URL builder (`buildConnectionUrl`) — no network needed
- TypeScript types for all API responses
- Native `fetch` — no external HTTP dependencies
- Comprehensive error handling with typed exceptions
- Pagination support for location endpoints

## Installation

```bash
npm install proxyhat
```

## Quick Start

```typescript
import { ProxyHat } from "proxyhat";

const client = new ProxyHat({ apiKey: "ph_your_api_key" });

// List sub-users
const users = await client.sub_users.list();
for (const user of users) {
  console.log(user.proxy_username, user.lifecycle_status);
}

// Create a sub-user
const newUser = await client.sub_users.create({
  proxy_password: "secure_pass",
  is_traffic_limited: true,
  traffic_limit: "5GB",
  name: "Scraper",
});
console.log(newUser.uuid);
```

## Connecting to a proxy

From an API key to actually routing traffic in one call — the SDK looks up an active sub-user and builds the gateway URL for you:

```typescript
import { ProxyHat } from "proxyhat";

const proxy = new ProxyHat({ apiKey: "ph_your_api_key" });

// Rotating residential IP, US exit:
const url = await proxy.connectionUrl({ country: "us" });
// → http://<user>-country-us:<pass>@gate.proxyhat.com:8080

// Sticky session (same IP for 30m), city-targeted, SOCKS5.
// A city always needs its region (codes from client.locations.regions/cities):
const sticky = await proxy.connectionUrl({
  country: "de",
  region: "state_of_berlin",
  city: "berlin",
  sticky: "30m",
  protocol: "socks5",
});
```

Use the URL with any HTTP client (undici, axios, Playwright, curl…).

**Offline builder** — if you already have a sub-user's `proxy_username` / `proxy_password`, build the URL with no network call:

```typescript
import { buildConnectionUrl } from "proxyhat";

const url = buildConnectionUrl({
  username: "ph-8f2a1c",
  password: "PxSecret123",
  country: "gb",
  filter: "high", // AI IP-quality tier
});
```

**Server-built descriptor** — let the API assemble it (validates the sub-user is active):

```typescript
const d = await proxy.proxy_descriptors.create({
  sub_user_uuid: user.uuid,
  protocol: "http",
  location: { country: "us", region: "new_york", city: "new_york_city" },
  session: { mode: "sticky", ttl: "30m" },
});
console.log(d.url);
```

## Authentication

Get your API key from the [ProxyHat Dashboard](https://dashboard.proxyhat.com/register?utm_source=github&utm_medium=readme&utm_campaign=sdk-node&utm_content=signup).

See the [Authentication Guide](https://docs.proxyhat.com/authentication?utm_source=github&utm_medium=readme&utm_campaign=sdk-node&utm_content=auth-guide) for details.

## API Reference

| Resource | Methods |
|----------|---------|
| `client.auth` | `register`, `login`, `user`, `logout`, `supported_providers`, `social_accounts`, `disconnect_social`, `oauth_redirect` |
| `client.sub_users` | `list`, `create`, `get`, `update`, `delete`, `reset_usage`, `bulk_delete`, `bulk_move_to_group` |
| `client.sub_user_groups` | `list`, `create`, `get`, `update`, `delete` |
| `client.locations` | `countries`, `regions`, `cities`, `isps`, `zipcodes` |
| `client.analytics` | `traffic`, `traffic_total`, `requests`, `requests_total`, `domain_breakdown` |
| `client.proxy_presets` | `list`, `create`, `get`, `update`, `delete` |
| `client.proxy_descriptors` | `create` |
| `client.connectionUrl(opts)` | build a ready proxy URL from an active sub-user |
| `client.profile` | `get_preferences`, `update_preferences`, `list_api_keys`, `create_api_key`, `delete_api_key`, `regenerate_api_key` |
| `client.two_factor` | `status`, `enable`, `confirm`, `disable`, `qr_code`, `recovery_codes`, `disable_by_recovery`, `change_password` |
| `client.email` | `request_change`, `confirm_change`, `cancel_change`, `resend_verification` |
| `client.coupons` | `validate`, `apply`, `redeem` |
| `client.plans` | `list_regular`, `list_subscriptions`, `get_regular`, `get_subscription`, `pricing_regular`, `pricing_subscriptions` |
| `client.payments` | `list`, `create`, `get`, `check`, `invoice`, `cryptocurrencies` |

## Error Handling

```typescript
import {
  ProxyHat,
  ProxyHatError,
  NotFoundError,
  RateLimitError,
  ValidationError,
} from "proxyhat";

const client = new ProxyHat({ apiKey: "ph_your_api_key" });

try {
  const user = await client.sub_users.get("nonexistent-id");
} catch (e) {
  if (e instanceof NotFoundError) {
    console.log(`Not found: ${e.message}`);
  } else if (e instanceof RateLimitError) {
    console.log(`Rate limited. Retry after ${e.retryAfter}s`);
  } else if (e instanceof ValidationError) {
    console.log(`Validation failed: ${e.errors}`);
  } else if (e instanceof ProxyHatError) {
    console.log(`API error ${e.statusCode}: ${e.message}`);
  }
}
```

See the [Error Handling Guide](https://docs.proxyhat.com/errors?utm_source=github&utm_medium=readme&utm_campaign=sdk-node&utm_content=error-handling) for the full list of error codes.

## Documentation

- [Getting Started](https://docs.proxyhat.com?utm_source=github&utm_medium=readme&utm_campaign=sdk-node&utm_content=getting-started)
- [API Reference](https://docs.proxyhat.com/api/auth?utm_source=github&utm_medium=readme&utm_campaign=sdk-node&utm_content=api-reference)
- [Full Documentation](https://docs.proxyhat.com?utm_source=github&utm_medium=readme&utm_campaign=sdk-node&utm_content=docs-home)

## Links

- [ProxyHat](https://proxyhat.com?utm_source=github&utm_medium=readme&utm_campaign=sdk-node&utm_content=links) — Residential & mobile proxy network
- [Dashboard](https://dashboard.proxyhat.com?utm_source=github&utm_medium=readme&utm_campaign=sdk-node&utm_content=links) — Manage proxies, sub-users, and API keys
- [GitHub](https://github.com/ProxyHatCom/node-sdk) — Source code & issue tracker

## License

MIT — see [LICENSE](LICENSE) for details.
