export interface TwoFactorStatus {
  enabled: boolean;
}

export interface TwoFactorEnableResponse {
  qr: string;
  secret: string;
  recovery_codes: string[];
}

export interface RecoveryCodes {
  codes: string[];
}
