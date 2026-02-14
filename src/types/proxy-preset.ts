export interface ProxyPreset {
  id: string;
  name: string;
  data: Record<string, unknown>;
  created_at?: string | null;
}
