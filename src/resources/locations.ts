import type { ProxyHat } from "../client.js";
import type {
  Country,
  Region,
  City,
  ISP,
  Zipcode,
} from "../types/locations.js";

export class LocationsResource {
  constructor(private client: ProxyHat) {}

  async countries(options?: {
    limit?: number;
    offset?: number;
    name?: string;
    connection_type?: string;
  }): Promise<Country[]> {
    return (await this.client.request("GET", "/locations/countries", {
      params: options as Record<string, unknown> | undefined,
    })) as Country[];
  }

  async regions(options?: {
    limit?: number;
    offset?: number;
    name?: string;
    connection_type?: string;
    country__code?: string;
  }): Promise<Region[]> {
    return (await this.client.request("GET", "/locations/regions", {
      params: options as Record<string, unknown> | undefined,
    })) as Region[];
  }

  async cities(options?: {
    limit?: number;
    offset?: number;
    name?: string;
    connection_type?: string;
    country__code?: string;
    region__code?: string;
  }): Promise<City[]> {
    return (await this.client.request("GET", "/locations/cities", {
      params: options as Record<string, unknown> | undefined,
    })) as City[];
  }

  async isps(options?: {
    limit?: number;
    offset?: number;
    name?: string;
    connection_type?: string;
    country__code?: string;
  }): Promise<ISP[]> {
    return (await this.client.request("GET", "/locations/isps", {
      params: options as Record<string, unknown> | undefined,
    })) as ISP[];
  }

  async zipcodes(options?: {
    limit?: number;
    offset?: number;
    name?: string;
    connection_type?: string;
    country__code?: string;
    city__code?: string;
  }): Promise<Zipcode[]> {
    return (await this.client.request("GET", "/locations/zipcodes", {
      params: options as Record<string, unknown> | undefined,
    })) as Zipcode[];
  }
}
