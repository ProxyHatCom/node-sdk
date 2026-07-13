/**
 * ProxyHat residential/mobile gateway connection helpers.
 *
 * The API (sub-users, analytics, …) manages your account; these helpers turn a
 * sub-user's `proxy_username` / `proxy_password` into a ready-to-use proxy URL,
 * building the gateway username with ProxyHat's targeting grammar. Everything
 * here is offline (no network) — see `docs.proxyhat.com/connecting`.
 */

export const PROXYHAT_GATEWAY = "gate.proxyhat.com";
export const PROXYHAT_PORT_HTTP = 8080;
export const PROXYHAT_PORT_SOCKS5 = 1080;

export type ProxyProtocol = "http" | "socks5";

/** AI IP-quality/speed filter tiers accepted by the gateway. */
export type ProxyFilter =
  | "high"
  | "medium"
  | "high-speed-fast"
  | "medium-speed-fast"
  | "none";

export interface ConnectionTargeting {
  /** ISO country code to exit from, or "any" (default). */
  country?: string;
  /** State/region slug (ignored when "any"). */
  region?: string;
  /** City slug, e.g. "new_york". */
  city?: string;
  /**
   * Sticky session: keep one IP. `true` → 30m default; a string sets the TTL
   * ("30m" | "12h"). Omit / `false` for a fresh rotating IP per request.
   */
  sticky?: boolean | string;
  /** AI filter tier. Accepts the value with or without the leading "filter-". */
  filter?: ProxyFilter | string;
}

function slug(value: string): string {
  return value.trim().toLowerCase().replace(/\s+/g, "_");
}

/** Random lowercase hex string via the universal Web Crypto API (Node 18+, browsers, edge). */
function randomHex(bytes: number): string {
  const arr = new Uint8Array(bytes);
  crypto.getRandomValues(arr);
  return Array.from(arr, (b) => b.toString(16).padStart(2, "0")).join("");
}

/**
 * Build a gateway username from a sub-user's base `proxy_username` plus targeting
 * tokens, in ProxyHat's fixed order:
 *   `<base>-country-<iso>[-region-<slug>][-city-<slug>][-sid-<16hex>-ttl-<dur>]-filter-<tier>`
 */
export function buildProxyUsername(base: string, targeting: ConnectionTargeting = {}): string {
  const parts = [base.trim(), "country", (targeting.country || "any").trim().toLowerCase()];

  if (targeting.region && targeting.region.trim().toLowerCase() !== "any") {
    parts.push("region", slug(targeting.region));
  }
  if (targeting.city) {
    parts.push("city", slug(targeting.city));
  }
  if (targeting.sticky !== undefined && targeting.sticky !== false) {
    const raw = targeting.sticky === true ? "" : String(targeting.sticky).trim();
    const ttl = raw === "" || /^(true|1|yes|on)$/i.test(raw) ? "30m" : raw;
    parts.push("sid", randomHex(8), "ttl", ttl);
  }
  const filter =
    typeof targeting.filter === "string" ? targeting.filter.trim().toLowerCase().replace(/^filter-/, "") : undefined;
  if (filter && filter !== "none") {
    parts.push("filter", filter);
  }

  return parts.join("-");
}

export interface BuildConnectionUrlOptions extends ConnectionTargeting {
  /** Sub-user gateway login (`proxy_username`). */
  username: string;
  /** Sub-user gateway password (`proxy_password`). */
  password: string;
  /** `http` (port 8080, default) or `socks5` (port 1080). */
  protocol?: ProxyProtocol;
}

/**
 * Build a full proxy connection URL for the ProxyHat gateway, e.g.
 * `http://<user>-country-us:<pass>@gate.proxyhat.com:8080`.
 */
export function buildConnectionUrl(options: BuildConnectionUrlOptions): string {
  const protocol = options.protocol ?? "http";
  const port = protocol === "socks5" ? PROXYHAT_PORT_SOCKS5 : PROXYHAT_PORT_HTTP;
  const username = buildProxyUsername(options.username, options);
  return `${protocol}://${encodeURIComponent(username)}:${encodeURIComponent(
    options.password,
  )}@${PROXYHAT_GATEWAY}:${port}`;
}
