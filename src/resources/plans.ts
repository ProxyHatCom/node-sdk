import type { ProxyHat } from "../client.js";
import type { RegularPlan, SubscriptionPlan } from "../types/plans.js";

export class PlansResource {
  constructor(private client: ProxyHat) {}

  async list_regular(): Promise<RegularPlan[]> {
    return (await this.client.request(
      "GET",
      "/regular-options",
    )) as RegularPlan[];
  }

  async list_subscriptions(): Promise<SubscriptionPlan[]> {
    return (await this.client.request(
      "GET",
      "/subscription-plans",
    )) as SubscriptionPlan[];
  }

  async get_regular(name: string): Promise<RegularPlan> {
    return (await this.client.request(
      "GET",
      `/plans/regular/${name}`,
    )) as RegularPlan;
  }

  async get_subscription(name: string): Promise<SubscriptionPlan> {
    return (await this.client.request(
      "GET",
      `/plans/subscription/${name}`,
    )) as SubscriptionPlan;
  }

  async pricing_regular(): Promise<unknown[]> {
    return (await this.client.request(
      "GET",
      "/pricing/regular",
    )) as unknown[];
  }

  async pricing_subscriptions(): Promise<unknown[]> {
    return (await this.client.request(
      "GET",
      "/pricing/subscriptions",
    )) as unknown[];
  }
}
