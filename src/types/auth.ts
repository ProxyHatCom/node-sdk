export interface RegisterResponse {
  message: string;
  access_token: string;
  token_type: string;
}

export interface LoginResponse {
  access_token: string;
  token_type: string;
  requires_2fa?: boolean;
}

export interface TrafficInfo {
  subscription: string | null;
  subscription_starts_at: string | null;
  subscription_expires_at: string | null;
  regular_bytes: number;
  regular_human: string;
  subscription_bytes: number;
  subscription_human: string;
  total_bytes: number;
  total_human: string;
}

export interface User {
  uuid: string;
  name: string;
  email: string;
  traffic: TrafficInfo;
}

export interface SupportedProvider {
  name: string;
  slug: string;
}

export interface SocialAccount {
  provider: string;
  email: string | null;
  connected_at: string | null;
}
