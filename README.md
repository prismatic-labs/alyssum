# Alyssum

Who makes the EU's 17 strategic raw materials? A periodic table showing how much of the world's supply of each one comes from a single country, and how much from the EU.

Live: https://prismatic-labs.github.io/alyssum/

## Sources

- **The list:** the 17 strategic raw materials in Annex I, Section 1 of the [Critical Raw Materials Act](https://eur-lex.europa.eu/eli/reg/2024/1252/oj) (Regulation (EU) 2024/1252).
- **The figures:** US Geological Survey, [Mineral Commodity Summaries 2025](https://pubs.usgs.gov/periodicals/mcs2025/mcs2025.pdf), estimates for 2024. Each material links to its USGS chapter.

Every number comes from those tables. Where USGS publishes no country figures (germanium, refined cobalt, refined lithium) or the figures can't be compared (boron), the tile is left blank rather than estimated.

## How the numbers are worked out

- A country's share is its production divided by the world total. USGS rounds world totals, so where the listed countries add up to more than the published total (magnesium: 1,045 vs 1,000 thousand tonnes), the sum is used instead.
- Each tile shows the furthest step USGS covers: refined output where there is a country table, mined output otherwise.
- "The EU" is the 27 member states USGS names. Smaller producers grouped under "other countries" are not counted, so EU shares are a floor.
- Platinum metals cover platinum and palladium added together, as USGS reports them.

## Data

`data/materials.json` holds every figure, with the USGS chapter and table it came from. It is copied to `public/data/materials.json` on build, so the data is also published with the site.

## Development

```sh
npm install
npm run dev     # http://localhost:4321/alyssum/
npm test        # data checks: country codes, totals, by-product links, headline claims
npm run check   # type check
npm run build
```

Pushing to `main` deploys to GitHub Pages.

## Licence

Code: MIT. USGS data is in the US public domain.
