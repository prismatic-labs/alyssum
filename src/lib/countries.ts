export interface Country {
  name: string;
  /** Label point for map circles: [longitude, latitude]. Visual placement only. */
  at: [number, number];
}

/** EU member states (ISO 3166-1 alpha-2). */
export const EU = new Set([
  "AT", "BE", "BG", "HR", "CY", "CZ", "DK", "EE", "FI", "FR", "DE", "GR", "HU", "IE",
  "IT", "LV", "LT", "LU", "MT", "NL", "PL", "PT", "RO", "SK", "SI", "ES", "SE",
]);

export const COUNTRIES: Record<string, Country> = {
  AE: { name: "UAE", at: [54.2, 23.9] },
  AR: { name: "Argentina", at: [-65.2, -35.4] },
  AT: { name: "Austria", at: [14.1, 47.6] },
  AU: { name: "Australia", at: [134.5, -25.7] },
  BG: { name: "Bulgaria", at: [25.2, 42.7] },
  BH: { name: "Bahrain", at: [50.6, 26.0] },
  BO: { name: "Bolivia", at: [-64.7, -16.7] },
  BR: { name: "Brazil", at: [-52.9, -10.8] },
  CA: { name: "Canada", at: [-101.0, 57.0] },
  CD: { name: "DR Congo", at: [23.6, -2.9] },
  CI: { name: "Côte d'Ivoire", at: [-5.6, 7.6] },
  CL: { name: "Chile", at: [-70.5, -27.0] },
  CN: { name: "China", at: [103.8, 35.5] },
  CU: { name: "Cuba", at: [-78.9, 21.6] },
  DE: { name: "Germany", at: [10.4, 51.1] },
  ES: { name: "Spain", at: [-3.6, 40.2] },
  FR: { name: "France", at: [2.5, 46.6] },
  GA: { name: "Gabon", at: [11.7, -0.6] },
  GH: { name: "Ghana", at: [-1.2, 7.9] },
  GN: { name: "Guinea", at: [-10.9, 10.4] },
  GR: { name: "Greece", at: [22.6, 39.4] },
  ID: { name: "Indonesia", at: [117.3, -2.2] },
  IE: { name: "Ireland", at: [-8.0, 53.2] },
  IL: { name: "Israel", at: [35.0, 31.4] },
  IN: { name: "India", at: [79.6, 22.9] },
  IR: { name: "Iran", at: [54.3, 32.6] },
  IS: { name: "Iceland", at: [-18.6, 64.9] },
  JM: { name: "Jamaica", at: [-77.3, 18.1] },
  JP: { name: "Japan", at: [138.0, 37.5] },
  KE: { name: "Kenya", at: [37.9, 0.2] },
  KP: { name: "North Korea", at: [127.2, 40.1] },
  KR: { name: "South Korea", at: [127.8, 36.4] },
  KZ: { name: "Kazakhstan", at: [67.3, 48.2] },
  LA: { name: "Laos", at: [103.8, 18.5] },
  LK: { name: "Sri Lanka", at: [80.7, 7.6] },
  MG: { name: "Madagascar", at: [46.7, -19.4] },
  ML: { name: "Mali", at: [-4.0, 17.6] },
  MM: { name: "Myanmar", at: [96.5, 21.0] },
  MX: { name: "Mexico", at: [-102.5, 23.9] },
  MY: { name: "Malaysia", at: [102.0, 4.2] },
  MZ: { name: "Mozambique", at: [35.5, -17.3] },
  NA: { name: "Namibia", at: [17.2, -22.1] },
  NC: { name: "New Caledonia", at: [165.6, -21.3] },
  NG: { name: "Nigeria", at: [8.1, 9.6] },
  NO: { name: "Norway", at: [9.0, 61.2] },
  PE: { name: "Peru", at: [-74.4, -9.2] },
  PG: { name: "Papua New Guinea", at: [145.2, -6.5] },
  PH: { name: "Philippines", at: [122.9, 11.8] },
  PL: { name: "Poland", at: [19.4, 52.1] },
  PT: { name: "Portugal", at: [-8.1, 39.6] },
  RU: { name: "Russia", at: [97.0, 62.0] },
  RW: { name: "Rwanda", at: [29.9, -2.0] },
  SA: { name: "Saudi Arabia", at: [44.6, 24.1] },
  SL: { name: "Sierra Leone", at: [-11.8, 8.6] },
  SN: { name: "Senegal", at: [-14.5, 14.4] },
  TH: { name: "Thailand", at: [101.0, 15.1] },
  TR: { name: "Türkiye", at: [35.2, 39.0] },
  TZ: { name: "Tanzania", at: [34.8, -6.3] },
  UA: { name: "Ukraine", at: [31.4, 49.0] },
  US: { name: "United States", at: [-98.5, 39.5] },
  VN: { name: "Vietnam", at: [106.3, 15.9] },
  ZA: { name: "South Africa", at: [24.7, -29.0] },
  ZM: { name: "Zambia", at: [27.8, -13.5] },
  ZW: { name: "Zimbabwe", at: [29.9, -19.0] },
};

export function countryName(code: string): string {
  return COUNTRIES[code]?.name ?? code;
}
