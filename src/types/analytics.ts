export interface TimeSeriesResponse {
  labels: string[];
  data: number[];
}

export interface TotalResponse {
  total: number;
}

export interface DomainBreakdownItem {
  domain: string;
  bandwidth: number;
  requests: number;
}

export interface DomainBreakdownResponse {
  items: DomainBreakdownItem[];
}
