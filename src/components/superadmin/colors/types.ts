
export interface ColorConfig {
  id: string;
  name: string;
  value: string;
  variable: string;
  description: string;
}

export interface SiteSettingsRow {
  id: number;
  type: string;
  key: string;
  name: string;
  value: string;
  description?: string;
  created_at: string;
  updated_at: string;
}
