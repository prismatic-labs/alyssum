import { cpSync, mkdirSync } from "node:fs";

mkdirSync("public/data", { recursive: true });
cpSync("data/materials.json", "public/data/materials.json");
