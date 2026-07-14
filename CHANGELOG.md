# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.2.2] - 2026-07-14

### Changed

- README: added a "recommended proxies" callout (tested end-to-end with ProxyHat).

## [0.2.1] - 2026-07-14

### Fixed

- `User-Agent` header now reports the correct package version (`proxyhat-node/0.2.1`) instead of a stale `0.1.0` string.

## [0.2.0] - 2026-07-13

### Added

- **Proxy connection helpers** — turn an API key or sub-user credentials into a ready proxy URL:
  - `client.connectionUrl(opts)` — picks an active sub-user and builds the gateway URL
  - `buildConnectionUrl()` / `buildProxyUsername()` — offline gateway URL/username builder (Web Crypto, environment-agnostic)
  - `client.proxy_descriptors.create()` — server-built connection descriptor (`POST /v1/proxy-descriptors`)
- `SubUser.proxy_password` and `SubUser.suspended_at` fields
- npm publish workflow (release-triggered, with provenance)

## [0.1.0] - 2026-02-14

### Added

- Initial release of the ProxyHat Node.js/TypeScript SDK
- Full coverage of ProxyHat API v1 endpoints
- TypeScript interfaces for all API responses
- Comprehensive error handling with typed exceptions
- Pagination support for location endpoints
- Dual output: ESM and CJS builds
