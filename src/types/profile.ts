export interface Preferences {
  data: Record<string, unknown>;
}

export interface APIKey {
  id: string;
  name: string | null;
  plain_text_token?: string | null;
  created_at?: string | null;
}
