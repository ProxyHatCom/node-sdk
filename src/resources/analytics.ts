import type { ProxyHat } from "../client.js";
import type {
  TimeSeriesResponse,
  TotalResponse,
  DomainBreakdownResponse,
} from "../types/analytics.js";

export class AnalyticsResource {
  constructor(private client: ProxyHat) {}

  async traffic(options?: {
    period?: string;
    start_date?: string;
    end_date?: string;
  }): Promise<TimeSeriesResponse> {
    return (await this.client.request("POST", "/traffic", {
      json: {
        period: options?.period ?? "24h",
        start_date: options?.start_date ?? null,
        end_date: options?.end_date ?? null,
      },
    })) as TimeSeriesResponse;
  }

  async traffic_total(options?: {
    period?: string;
    start_date?: string;
    end_date?: string;
  }): Promise<TotalResponse> {
    return (await this.client.request("POST", "/traffic/period-total", {
      json: {
        period: options?.period ?? "24h",
        start_date: options?.start_date ?? null,
        end_date: options?.end_date ?? null,
      },
    })) as TotalResponse;
  }

  async requests(options?: {
    period?: string;
    start_date?: string;
    end_date?: string;
  }): Promise<TimeSeriesResponse> {
    return (await this.client.request("POST", "/requests", {
      json: {
        period: options?.period ?? "24h",
        start_date: options?.start_date ?? null,
        end_date: options?.end_date ?? null,
      },
    })) as TimeSeriesResponse;
  }

  async requests_total(options?: {
    period?: string;
    start_date?: string;
    end_date?: string;
  }): Promise<TotalResponse> {
    return (await this.client.request(
      "POST",
      "/requests/period-total",
      {
        json: {
          period: options?.period ?? "24h",
          start_date: options?.start_date ?? null,
          end_date: options?.end_date ?? null,
        },
      },
    )) as TotalResponse;
  }

  async domain_breakdown(options?: {
    period?: string;
    start_date?: string;
    end_date?: string;
  }): Promise<DomainBreakdownResponse> {
    return (await this.client.request("POST", "/domain-breakdown", {
      json: {
        period: options?.period ?? "24h",
        start_date: options?.start_date ?? null,
        end_date: options?.end_date ?? null,
      },
    })) as DomainBreakdownResponse;
  }
}
