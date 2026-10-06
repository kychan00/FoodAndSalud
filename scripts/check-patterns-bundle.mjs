import { readFileSync, readdirSync, statSync } from "node:fs";

import { basename, join } from "node:path";

const MAX_KB = 500;

const dist = "dist";

const assets = join(dist, "assets");

const html = readFileSync(join(dist, "index.html"), "utf8");

const scripts = [...html.matchAll(/<script[^>]+src="([^"]+\.js)"/g)].map(
  (match) => match[1],
);

if (scripts.length === 0) {
  throw new Error("No se encontró el bundle inicial.");
}

const entryPath = join(assets, basename(scripts[0]));

const entryKb = statSync(entryPath).size / 1024;

const jsFiles = readdirSync(assets)
  .filter((name) => name.endsWith(".js"))
  .map((name) => ({
    name,

    kb: statSync(join(assets, name)).size / 1024,
  }))
  .sort((left, right) => right.kb - left.kb);

const largest = jsFiles[0];

console.log(`Bundle inicial: ${entryKb.toFixed(2)} kB`);

console.log(
  `Mayor chunk: ${largest?.name ?? "—"} — ${
    largest?.kb.toFixed(2) ?? "0.00"
  } kB`,
);

if (entryKb > MAX_KB) {
  throw new Error(`Bundle inicial supera ${MAX_KB} kB.`);
}

if (largest && largest.kb > MAX_KB) {
  throw new Error(`Chunk ${largest.name} supera ${MAX_KB} kB.`);
}

/*
 * Sólo sentinels inequívocos de Laboratorio QA.
 * No usar nombres reales como Café, Leche u Omeprazol.
 */
const qaSentinels = [
  "coffee-milk-discrimination",
  "coffee-milk-delayed",
  "overlapping-meals",
  "temporal-persistent",
  "temporal-recent",
  "temporal-weakened",
  "medicine-discrimination",
  "medicine-before-discrimination",
  "latency-late-16h",
  "omeprazole-before-qa",
];

const assetText = readdirSync(assets)
  .map((name) => join(assets, name))
  .filter((path) => statSync(path).isFile())
  .map((path) => readFileSync(path, "utf8"))
  .join("\n");

const leaked = qaSentinels.filter((sentinel) => assetText.includes(sentinel));

if (leaked.length > 0) {
  throw new Error(
    `Sentinels QA encontrados en producción: ${leaked.join(", ")}`,
  );
}

console.log("✓ Bundle inicial dentro del presupuesto");

console.log("✓ Todos los chunks JS dentro del presupuesto");

console.log("✓ Sentinels QA ausentes de producción");
