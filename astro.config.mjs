// @ts-check
import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  site: "https://prismatic-labs.github.io",
  base: "/alyssum",
  compressHTML: false,
  integrations: [sitemap()],
  vite: {
    plugins: [tailwindcss()],
  },
});
