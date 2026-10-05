import raw from "../../data/materials.json";
import { EU, countryName } from "./countries";

/** "source" is another material's step that this one is recovered from (gallium from alumina). */
export type Stage = "mined" | "refined" | "source";

export interface Source {
  url: string;
  table: string;
}

export interface Row {
  stage: Stage;
  /** Heading shown above the step, e.g. "Dug up", "Smelted". */
  label?: string;
  what: string;
  unit: string;
  world: number;
  producers: [string, number | null][];
  other: number | null;
  note?: string;
  source: Source;
}

export interface Origin {
  /** Ore minerals named in the USGS chapter. */
  minerals: string[];
  /** Other strategic materials whose mining or processing it comes out of (ids). */
  hosts: string[];
  /** Elements not on the EU list whose ores it is recovered from, per the USGS chapter (symbols). */
  hostElements: string[];
  /** Other named feedstocks: brines, non-strategic ores. */
  alsoFrom: string[];
  /** One plain sentence on where it comes from, paraphrasing the USGS chapter. */
  note: string | null;
  source: string;
}

/** Figures that can't be compared as shares (each country reports a different form). */
export interface Reported {
  unit: string;
  year: number;
  rows: [string, number | null, string][];
}

export interface Material {
  id: string;
  name: string;
  symbol: string;
  annex: string;
  origin: Origin;
  rows: Row[];
  blank?: string;
  /** Why a step has no country figures, when it isn't simply that USGS stops at the mine. */
  gap?: { mined?: string };
  reported?: Reported;
  source?: Source;
}

export interface Dataset {
  title: string;
  list: { name: string; citation: string; url: string };
  benchmark: { share: number; text: string; citation: string; url: string };
  year: number;
  yearNote: string;
  source: { name: string; url: string; licence: string };
  materials: Material[];
}

export const data = raw as Dataset;

export type Bloc = "cn" | "eu" | "other";

export function bloc(code: string): Bloc {
  if (code === "CN") return "cn";
  return EU.has(code) ? "eu" : "other";
}

export interface Share {
  code: string;
  name: string;
  value: number;
  share: number;
  bloc: Bloc;
}

/** Named producers with a published figure, largest first. Withheld ("W") figures are dropped. */
export function shares(row: Row): Share[] {
  const total = worldTotal(row);
  return row.producers
    .filter((p): p is [string, number] => p[1] !== null && p[1] > 0)
    .map(([code, value]) => ({
      code,
      name: countryName(code),
      value,
      share: value / total,
      bloc: bloc(code),
    }))
    .sort((a, b) => b.value - a.value);
}

/** USGS rounds world totals, so the listed countries can add up to more (magnesium: 1,045 vs 1,000). Use the larger. */
export function worldTotal(row: Row): number {
  const listed = row.producers.reduce((sum, p) => sum + (p[1] ?? 0), 0) + (row.other ?? 0);
  return Math.max(row.world, listed);
}

export function withheld(row: Row): string[] {
  return row.producers.filter((p) => p[1] === null).map(([code]) => countryName(code));
}

/** Share of the world total not attributed to a named country (USGS "other countries", withheld, rounding). */
export function rest(row: Row): number {
  const named = shares(row).reduce((sum, s) => sum + s.share, 0);
  const left = 1 - named;
  return left < 1e-9 ? 0 : left;
}

export function top(row: Row): Share {
  return shares(row)[0];
}

/** Combined share of EU member states among the named producers. Unnamed "other countries" may hide more. */
export function euShares(row: Row): Share[] {
  return shares(row).filter((s) => s.bloc === "eu");
}

export function euShare(row: Row): number {
  return euShares(row).reduce((sum, s) => sum + s.share, 0);
}

/** The material where named EU producers hold the largest share, at the headline step. */
export function bestEu(materials: Material[] = data.materials): { m: Material; share: number } {
  return materials
    .filter((m) => headlineRow(m))
    .map((m) => ({ m, share: euShare(headlineRow(m)!) }))
    .sort((a, b) => b.share - a.share)[0];
}

export function material(id: string): Material | undefined {
  return data.materials.find((m) => m.id === id);
}

export function stageRow(m: Material, stage: Stage): Row | undefined {
  return m.rows.find((r) => r.stage === stage);
}

/** The furthest-along step we have: the last refined row if present, else mined. */
export function headlineRow(m: Material): Row | undefined {
  return m.rows.findLast((r) => r.stage === "refined") ?? stageRow(m, "mined");
}

// Checked to stay distinct from each other, China and the EU blues under protanopia, deuteranopia and tritanopia.
const OTHER_COLOURS = ["#009e73", "#8a3ffc", "#885544", "#666677", "#cc79a7"];
const EU_COLOURS = ["#0072b2", "#003d66", "#7fb8e0"];

/** A distinct colour per named producer: China vermillion, EU members in blues, others in their own hues. */
export function colours(row: Row): Map<string, string> {
  const out = new Map<string, string>();
  let other = 0;
  let eu = 0;
  for (const s of shares(row)) {
    if (s.bloc === "cn") out.set(s.code, "var(--cn)");
    else if (s.bloc === "eu") out.set(s.code, EU_COLOURS[Math.min(eu++, EU_COLOURS.length - 1)]);
    else out.set(s.code, other < OTHER_COLOURS.length ? OTHER_COLOURS[other++] : "#b5b0a6");
  }
  return out;
}

/** Materials with numbers, most concentrated first; blanks last. */
export function byConcentration(materials: Material[] = data.materials): Material[] {
  const withData = materials.filter((m) => headlineRow(m));
  const blanks = materials.filter((m) => !headlineRow(m));
  withData.sort((a, b) => top(headlineRow(b)!).share - top(headlineRow(a)!).share);
  return [...withData, ...blanks];
}

export function chinaLeads(materials: Material[] = data.materials): { leads: number; of: number } {
  const withData = materials.filter((m) => headlineRow(m));
  return {
    leads: withData.filter((m) => top(headlineRow(m)!).code === "CN").length,
    of: withData.length,
  };
}

export function pct(share: number): string {
  if (share > 0 && share < 0.005) return "<1%";
  return `${Math.round(share * 100)}%`;
}

const UNIT_WORDS: Record<string, string> = {
  t: "tonnes",
  kt: "thousand tonnes",
  kg: "kilograms",
};

export function unitWord(unit: string): string {
  return UNIT_WORDS[unit] ?? unit;
}

export function num(n: number): string {
  return n.toLocaleString("en-GB");
}
