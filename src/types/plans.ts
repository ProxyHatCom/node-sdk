export interface RegularPlan {
  id: string;
  name: string;
  gb: number;
  price_per_gb: number;
  price_total: number;
  currency: string;
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  gb: number;
  price_per_gb: number;
  price_total: number;
  period: string;
  rollover_enabled: boolean;
}
