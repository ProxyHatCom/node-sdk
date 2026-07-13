export { ProxyHat } from "./client.js";
export type { ProxyHatOptions, RequestOptions } from "./client.js";

export {
  buildConnectionUrl,
  buildProxyUsername,
  PROXYHAT_GATEWAY,
  PROXYHAT_PORT_HTTP,
  PROXYHAT_PORT_SOCKS5,
} from "./connection.js";
export type {
  ConnectionTargeting,
  BuildConnectionUrlOptions,
  ProxyProtocol,
  ProxyFilter,
} from "./connection.js";

export {
  ProxyHatError,
  AuthenticationError,
  PermissionError,
  NotFoundError,
  ValidationError,
  RateLimitError,
  APIError,
} from "./errors.js";

export type {
  RegisterResponse,
  LoginResponse,
  TrafficInfo,
  User,
  SupportedProvider,
  SocialAccount,
  SubUser,
  ResetUsageResponse,
  BulkDeleteResponse,
  SubUserGroup,
  Country,
  Region,
  City,
  ISP,
  Zipcode,
  TimeSeriesResponse,
  TotalResponse,
  DomainBreakdownItem,
  DomainBreakdownResponse,
  ProxyPreset,
  ProxyDescriptor,
  ProxyDescriptorInput,
  Preferences,
  APIKey,
  TwoFactorStatus,
  TwoFactorEnableResponse,
  RecoveryCodes,
  EmailChangeResponse,
  Coupon,
  CouponResponse,
  RegularPlan,
  SubscriptionPlan,
  PaymentCreateResponse,
  CryptoInfo,
  PaymentDetails,
  Payment,
  Cryptocurrency,
} from "./types/index.js";
