export interface Country {
  code: string;
  name: string;
  availability: string;
  connection_type: string;
}

export interface Region {
  code: string;
  name: string;
  country_code: string;
  availability?: string | null;
  connection_type?: string | null;
}

export interface City {
  code: string;
  name: string;
  country_code: string;
  region_code?: string | null;
  availability?: string | null;
  connection_type?: string | null;
}

export interface ISP {
  code: string;
  name: string;
  country_code: string;
  availability?: string | null;
  connection_type?: string | null;
}

export interface Zipcode {
  code: string;
  name: string;
  country_code: string;
  city_code?: string | null;
  availability?: string | null;
  connection_type?: string | null;
}
