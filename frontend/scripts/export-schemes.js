// scripts/export-schemes.js
import { writeFileSync } from "fs";
import { SCHEMES } from "../src/data/schemes.js";

writeFileSync(
  "src/data/schemes.json",
  JSON.stringify(SCHEMES, null, 2),
  "utf-8"
);
console.log(`✅ Exported ${SCHEMES.length} schemes to src/data/schemes.json`);