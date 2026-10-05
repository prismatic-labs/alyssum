import { geoEqualEarth, geoPath } from "d3-geo";
import { feature } from "topojson-client";
import type { FeatureCollection, Geometry } from "geojson";
import type { Topology, GeometryCollection } from "topojson-specification";
import world from "world-atlas/countries-110m.json";
import { COUNTRIES } from "./countries";
import type { Row } from "./data";
import { shares } from "./data";

const ANTARCTICA = "010";
const EU_NUMERIC = new Set([
  "040", "056", "100", "191", "196", "203", "208", "233", "246", "250", "276", "300", "348",
  "372", "380", "428", "440", "442", "470", "528", "616", "620", "642", "703", "705", "724", "752",
]);
const CHINA_NUMERIC = "156";

const topo = world as unknown as Topology<{ countries: GeometryCollection }>;
const all = feature(topo, topo.objects.countries) as FeatureCollection<Geometry, { name: string }>;
const countries: FeatureCollection<Geometry, { name: string }> = {
  type: "FeatureCollection",
  features: all.features.filter((f) => f.id !== ANTARCTICA),
};

export interface MapShape {
  width: number;
  height: number;
  land: { d: string; tint: "eu" | "cn" | null }[];
  circles: { code: string; x: number; y: number; r: number; share: number; value: number; bloc: string; name: string }[];
}

/** Equal-area projection; circle area is proportional to share of world output. */
export function worldMap(row: Row | undefined, width: number, maxRadiusRatio = 0.16): MapShape {
  const height = Math.round(width * 0.47);
  const projection = geoEqualEarth().fitExtent(
    [
      [2, 2],
      [width - 2, height - 2],
    ],
    countries,
  );
  const path = geoPath(projection);
  const land = countries.features.map((f) => ({
    d: path(f) ?? "",
    tint: EU_NUMERIC.has(String(f.id)) ? ("eu" as const) : String(f.id) === CHINA_NUMERIC ? ("cn" as const) : null,
  }));
  const rMax = width * maxRadiusRatio;
  const circles = row
    ? shares(row)
        .map((s) => {
          const at = COUNTRIES[s.code]?.at;
          const p = at ? projection(at) : null;
          if (!p) return null;
          return { code: s.code, x: p[0], y: p[1], r: rMax * Math.sqrt(s.share), share: s.share, value: s.value, bloc: s.bloc, name: s.name };
        })
        .filter((c): c is NonNullable<typeof c> => c !== null)
    : [];
  return { width, height, land, circles };
}
