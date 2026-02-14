export interface PaymentCreateResponse {
  success: boolean;
  payment_id: string;
}

export interface CryptoInfo {
  code: string;
  currency: string;
  network: string;
  icon?: string | null;
  label?: string | null;
}

export interface PaymentDetails {
  pay_address: string;
  crypto_amount: number;
  amount_usd: number;
  crypto: CryptoInfo;
  status: string;
  tx_hash?: string | null;
  expires_at?: string | null;
  completed_at?: string | null;
}

export interface Payment {
  id: string;
  type: string;
  status: string;
  amount?: number | null;
  currency?: string | null;
  created_at?: string | null;
}

export interface Cryptocurrency {
  code: string;
  currency: string;
  network: string;
  icon?: string | null;
  label?: string | null;
}
