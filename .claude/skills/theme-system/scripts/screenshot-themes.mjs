#!/usr/bin/env node
// Capture les pages du site dans chaque thème, pour vérifier un changement de couleur à l'œil.
// Usage : node .claude/skills/theme-system/scripts/screenshot-themes.mjs <url de base> <dossier de sortie> [chemins…]
// Exemple : node .claude/skills/theme-system/scripts/screenshot-themes.mjs http://localhost:3000 /tmp/themes / /projects
// Playwright doit être installé (globalement ou dans node_modules).
import { createRequire } from "node:module";
import { execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const [base, out, ...paths] = process.argv.slice(2);
if (!base || !out) {
  console.error("Usage : screenshot-themes.mjs <url de base> <dossier de sortie> [chemins…]");
  process.exit(2);
}
const pages = paths.length ? paths : ["/", "/projects", "/skills", "/about", "/contact"];

// Le thème est lu par client/index.html dans localStorage["theme"] avant le premier rendu.
const themes = [...fs.readFileSync("client/src/lib/themes.ts", "utf8").matchAll(/id:\s*"([\w-]+)"/g)].map(m => m[1]);

let chromium;
for (const from of [process.cwd() + "/", execSync("npm root -g").toString().trim() + "/"]) {
  try { ({ chromium } = createRequire(from)("playwright")); break; } catch {}
}
if (!chromium) {
  console.error("Playwright introuvable.");
  process.exit(2);
}

fs.mkdirSync(out, { recursive: true });
const browser = await chromium.launch();
for (const theme of themes) {
  const context = await browser.newContext({ viewport: { width: 1280, height: 860 }, reducedMotion: "reduce" });
  await context.addInitScript(t => localStorage.setItem("theme", t), theme);
  const page = await context.newPage();
  for (const p of pages) {
    await page.goto(base + p, { waitUntil: "networkidle" });
    await page.waitForTimeout(400);
    const file = path.join(out, `${theme}${p === "/" ? "_accueil" : p.replace(/\//g, "_")}.png`);
    await page.screenshot({ path: file, fullPage: true });
    console.log(file);
  }
  await context.close();
}
await browser.close();
