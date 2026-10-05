/** Standard 18-column periodic table. Row 8 and 9 hold the lanthanides and actinides. */
const MAIN: string[][] = [
  ["H", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "He"],
  ["Li", "Be", "", "", "", "", "", "", "", "", "", "", "B", "C", "N", "O", "F", "Ne"],
  ["Na", "Mg", "", "", "", "", "", "", "", "", "", "", "Al", "Si", "P", "S", "Cl", "Ar"],
  ["K", "Ca", "Sc", "Ti", "V", "Cr", "Mn", "Fe", "Co", "Ni", "Cu", "Zn", "Ga", "Ge", "As", "Se", "Br", "Kr"],
  ["Rb", "Sr", "Y", "Zr", "Nb", "Mo", "Tc", "Ru", "Rh", "Pd", "Ag", "Cd", "In", "Sn", "Sb", "Te", "I", "Xe"],
  ["Cs", "Ba", "*", "Hf", "Ta", "W", "Re", "Os", "Ir", "Pt", "Au", "Hg", "Tl", "Pb", "Bi", "Po", "At", "Rn"],
  ["Fr", "Ra", "**", "Rf", "Db", "Sg", "Bh", "Hs", "Mt", "Ds", "Rg", "Cn", "Nh", "Fl", "Mc", "Lv", "Ts", "Og"],
];
const LANTHANIDES = ["La", "Ce", "Pr", "Nd", "Pm", "Sm", "Eu", "Gd", "Tb", "Dy", "Ho", "Er", "Tm", "Yb", "Lu"];
const ACTINIDES = ["Ac", "Th", "Pa", "U", "Np", "Pu", "Am", "Cm", "Bk", "Cf", "Es", "Fm", "Md", "No", "Lr"];

/** Which strategic material each element belongs to (Annex I, Section 1). */
export const ELEMENT_TO_MATERIAL: Record<string, string> = {
  Li: "lithium",
  B: "boron",
  C: "graphite",
  Mg: "magnesium",
  Al: "aluminium",
  Si: "silicon",
  Ti: "titanium",
  Mn: "manganese",
  Co: "cobalt",
  Ni: "nickel",
  Cu: "copper",
  Ga: "gallium",
  Ge: "germanium",
  W: "tungsten",
  Bi: "bismuth",
  Ru: "pgm",
  Rh: "pgm",
  Pd: "pgm",
  Os: "pgm",
  Ir: "pgm",
  Pt: "pgm",
  Ce: "rare-earths",
  Pr: "rare-earths",
  Nd: "rare-earths",
  Sm: "rare-earths",
  Gd: "rare-earths",
  Tb: "rare-earths",
  Dy: "rare-earths",
};

export const ELEMENT_NAMES: Record<string, string> = {
  Li: "Lithium",
  B: "Boron",
  C: "Carbon",
  Mg: "Magnesium",
  Al: "Aluminium",
  Si: "Silicon",
  Ti: "Titanium",
  Mn: "Manganese",
  Co: "Cobalt",
  Ni: "Nickel",
  Cu: "Copper",
  Ga: "Gallium",
  Ge: "Germanium",
  W: "Tungsten",
  Bi: "Bismuth",
  Ru: "Ruthenium",
  Rh: "Rhodium",
  Pd: "Palladium",
  Os: "Osmium",
  Ir: "Iridium",
  Pt: "Platinum",
  Ce: "Cerium",
  Pr: "Praseodymium",
  Nd: "Neodymium",
  Sm: "Samarium",
  Gd: "Gadolinium",
  Tb: "Terbium",
  Dy: "Dysprosium",
};

/** The cell that stands for a group when drawing links. */
export const ANCHOR: Record<string, string> = {
  pgm: "Pt",
  "rare-earths": "Nd",
};

export interface Cell {
  symbol: string;
  col: number;
  row: number;
  placeholder: boolean;
}

export function cells(): Cell[] {
  const out: Cell[] = [];
  MAIN.forEach((r, row) =>
    r.forEach((symbol, col) => {
      if (symbol) out.push({ symbol, col, row, placeholder: symbol.startsWith("*") });
    }),
  );
  LANTHANIDES.forEach((symbol, i) => out.push({ symbol, col: i + 2, row: 7.6, placeholder: false }));
  ACTINIDES.forEach((symbol, i) => out.push({ symbol, col: i + 2, row: 8.6, placeholder: false }));
  return out;
}

export function elementsOf(materialId: string): string[] {
  return Object.entries(ELEMENT_TO_MATERIAL)
    .filter(([, id]) => id === materialId)
    .map(([symbol]) => symbol);
}

export function anchorSymbol(materialId: string): string | undefined {
  if (ANCHOR[materialId]) return ANCHOR[materialId];
  return Object.entries(ELEMENT_TO_MATERIAL).find(([, id]) => id === materialId)?.[0];
}
