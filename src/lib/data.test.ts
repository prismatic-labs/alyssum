import { describe, expect, it } from "vitest";
import { data, shares, rest, worldTotal, chinaLeads, bestEu, headlineRow, pct } from "./data";
import { COUNTRIES, EU } from "./countries";
import { ELEMENT_TO_MATERIAL, anchorSymbol } from "./periodic";
import { GLOSSARY } from "./glossary";

const rows = data.materials.flatMap((m) => m.rows.map((row) => ({ m, row })));

describe("materials.json", () => {
  it("lists the 17 strategic raw materials of CRMA Annex I", () => {
    expect(data.materials).toHaveLength(17);
    expect(new Set(data.materials.map((m) => m.id)).size).toBe(17);
  });

  it("uses only known country codes", () => {
    const codes = [
      ...rows.flatMap(({ row }) => row.producers.map(([c]) => c)),
      ...data.materials.flatMap((m) => m.reported?.rows.map(([c]) => c) ?? []),
    ];
    expect(codes.filter((c) => !COUNTRIES[c])).toEqual([]);
  });

  it("has 27 EU member states", () => {
    expect(EU.size).toBe(27);
  });

  it("has named producers and other countries that add up to the world total, within USGS rounding", () => {
    for (const { m, row } of rows) {
      const listed = row.producers.reduce((s, p) => s + (p[1] ?? 0), 0) + (row.other ?? 0);
      const withheld = row.producers.some((p) => p[1] === null);
      expect(listed / row.world, `${m.id} ${row.what}`).toBeLessThan(1.05);
      if (!withheld) expect(listed / row.world, `${m.id} ${row.what}`).toBeGreaterThan(0.97);
    }
  });

  it("cites a USGS source for every row", () => {
    for (const { row } of rows) expect(row.source.url).toMatch(/^https:\/\/pubs\.usgs\.gov\//);
  });

  it("links by-products only to materials and elements that exist", () => {
    for (const m of data.materials) {
      for (const h of m.origin.hosts) expect(data.materials.some((x) => x.id === h), `${m.id} <- ${h}`).toBe(true);
      for (const s of m.origin.hostElements) expect(ELEMENT_TO_MATERIAL[s], `${m.id} <- ${s}`).toBeUndefined();
      expect(anchorSymbol(m.id), m.id).toBeDefined();
    }
  });

  it("explains every ore and feedstock named in a dialog", () => {
    const named = data.materials.flatMap((m) => [...m.origin.minerals, ...m.origin.alsoFrom]);
    expect(named.filter((x) => !GLOSSARY[x])).toEqual([]);
  });

  it("explains every missing mining step", () => {
    for (const m of data.materials.filter((x) => !x.blank && !x.rows.some((r) => r.stage !== "refined"))) {
      expect(m.gap?.mined, m.id).toBeTruthy();
    }
  });

  it("gives every material either figures or a reason for the blank", () => {
    for (const m of data.materials) expect(Boolean(headlineRow(m)) || Boolean(m.blank), m.id).toBe(true);
  });
});

describe("shares", () => {
  it("never exceed 100% of the world, even when USGS rounds the total down", () => {
    for (const { m, row } of rows) {
      const named = shares(row).reduce((s, x) => s + x.share, 0);
      expect(named, `${m.id} ${row.what}`).toBeLessThanOrEqual(1 + 1e-9);
      expect(named + rest(row)).toBeCloseTo(1, 6);
    }
  });

  it("uses the listed sum when it is larger than the rounded world total", () => {
    const mg = data.materials.find((m) => m.id === "magnesium")!.rows[0];
    expect(worldTotal(mg)).toBe(1045);
    expect(pct(shares(mg)[0].share)).toBe("91%");
  });
});

describe("headline", () => {
  it("matches the figures", () => {
    expect(chinaLeads()).toEqual({ leads: 10, of: 15 });
    const eu = bestEu();
    expect(eu.m.id).toBe("copper");
    expect(pct(eu.share)).toBe("4%");
  });
});
