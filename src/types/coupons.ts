export interface Coupon {
  id: string;
  code: string;
  type: string;
  data: unknown;
  discount?: number | null;
  final_amount?: number | null;
}

export interface CouponResponse {
  success: boolean;
  coupon?: Coupon | null;
}
