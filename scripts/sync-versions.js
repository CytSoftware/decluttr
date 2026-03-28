#!/usr/bin/env node

import { readFileSync, writeFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");

const version = process.argv[2];
if (!version) {
  console.error("Usage: node scripts/sync-versions.js <version>");
  process.exit(1);
}

const files = [
  "package.json",
  "apps/extension/package.json",
  "apps/extension/manifest.json",
  "apps/landing/package.json",
];

for (const file of files) {
  const filepath = resolve(root, file);
  const content = JSON.parse(readFileSync(filepath, "utf-8"));
  content.version = version;
  writeFileSync(filepath, JSON.stringify(content, null, 2) + "\n");
  console.log(`  ✓ ${file} → ${version}`);
}
