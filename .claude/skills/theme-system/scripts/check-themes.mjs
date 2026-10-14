#!/usr/bin/env node
// Vérifie la cohérence et les contrastes des thèmes de couleur du portfolio.
// Usage (depuis la racine du dépôt) : node .claude/skills/theme-system/scripts/check-themes.mjs [racine]
// Sortie non nulle si une règle bloquante échoue.
import fs from "node:fs";
import path from "node:path";

const root = path.resolve(process.argv[2] ?? ".");
const read = rel => fs.readFileSync(path.join(root, rel), "utf8");

const css = read("client/src/index.css");
const themesTs = read("client/src/lib/themes.ts");
const html = read("client/index.html");

let failures = 0;
const fail = msg => { failures++; console.log(`  ✗ ${msg}`); };
const ok = msg => console.log(`  ✓ ${msg}`);
const warn = msg => console.log(`  ! ${msg}`);

// 1. Tokens de chaque thème dans index.css
const themes = {};
for (const m of css.matchAll(/\[data-theme="([\w-]+)"\]\s*\{([^}]*)\}/g)) {
  const tokens = {};
  for (const t of m[2].matchAll(/--([\w-]+):\s*([^;]+);/g)) tokens[t[1]] = t[2].trim();
  themes[m[1]] = tokens;
}
const cssIds = Object.keys(themes);

// 2. Identifiants déclarés dans themes.ts et dans le script en ligne de index.html
const tsThemes = [...themesTs.matchAll(/\{\s*id:\s*"([\w-]+)"[^}]*?themeColor:\s*"([^"]+)"[^}]*?dark:\s*(true|false)/g)]
  .map(m => ({ id: m[1], themeColor: m[2], dark: m[3] === "true" }));
const htmlColors = Object.fromEntries(
  [...(html.match(/var colors = \{([^}]*)\}/)?.[1] ?? "").matchAll(/([\w-]+):\s*"([^"]+)"/g)].map(m => [m[1], m[2]])
);

console.log("Cohérence des fichiers");
const tsIds = tsThemes.map(t => t.id);
const htmlIds = Object.keys(htmlColors);
const same = (a, b) => a.length === b.length && a.every(x => b.includes(x));
same(cssIds, tsIds) ? ok(`index.css et themes.ts déclarent les mêmes thèmes : ${cssIds.join(", ")}`)
  : fail(`index.css (${cssIds.join(", ")}) ≠ themes.ts (${tsIds.join(", ")})`);
same(tsIds, htmlIds) ? ok("le script de index.html connaît les mêmes thèmes")
  : fail(`themes.ts (${tsIds.join(", ")}) ≠ script de index.html (${htmlIds.join(", ")})`);

const reference = themes[cssIds[0]] ?? {};
for (const id of cssIds) {
  const missing = Object.keys(reference).filter(k => !(k in themes[id]));
  missing.length ? fail(`thème « ${id} » : tokens manquants ${missing.join(", ")}`) : ok(`thème « ${id} » : ${Object.keys(themes[id]).length} tokens`);
}
for (const t of tsThemes) {
  const bg = themes[t.id]?.background?.toLowerCase();
  if (bg && t.themeColor.toLowerCase() !== bg) fail(`themes.ts « ${t.id} » : themeColor ${t.themeColor} ≠ --background ${bg}`);
  if (htmlColors[t.id] && htmlColors[t.id].toLowerCase() !== t.themeColor.toLowerCase())
    fail(`index.html « ${t.id} » : ${htmlColors[t.id]} ≠ themeColor ${t.themeColor}`);
  const scheme = themes[t.id]?.["color-scheme"];
  if (!css.match(new RegExp(`\\[data-theme="${t.id}"\\]\\s*\\{[^}]*color-scheme:\\s*${t.dark ? "dark" : "light"}`)))
    fail(`thème « ${t.id} » : color-scheme devrait valoir ${t.dark ? "dark" : "light"}${scheme ? "" : ""}`);
}

// 3. Contrastes WCAG
const hex = v => {
  const m = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(v ?? "");
  if (!m) return null;
  const h = m[1].length === 3 ? [...m[1]].map(c => c + c).join("") : m[1];
  return [0, 2, 4].map(i => parseInt(h.slice(i, i + 2), 16) / 255);
};
const lum = rgb => {
  const [r, g, b] = rgb.map(c => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};
const ratio = (a, b) => {
  const [l1, l2] = [lum(a), lum(b)].sort((x, y) => y - x);
  return (l1 + 0.05) / (l2 + 0.05);
};

// [texte, fond, minimum, rôle]
const PAIRS = [
  ["foreground", "background", 4.5, "texte courant"],
  ["foreground", "card", 4.5, "texte sur carte"],
  ["muted-foreground", "background", 4.5, "texte secondaire"],
  ["muted-foreground", "card", 4.5, "texte secondaire sur carte"],
  ["primary", "background", 4.5, "liens et accents en texte"],
  ["primary-foreground", "primary", 4.5, "texte sur bouton principal"],
  ["background", "foreground", 4.5, "bouton inversé (bg-foreground text-background)"],
  ["popover-foreground", "popover", 4.5, "palette ⌘K"],
  ["destructive", "background", 4.5, "messages d'erreur"],
  ["success-foreground", "success", 4.5, "bouton « Message envoyé »"],
  ["ring", "background", 3, "contour de focus (non textuel)"],
];

for (const id of cssIds) {
  console.log(`\nContrastes — thème « ${id} »`);
  for (const [fg, bg, min, role] of PAIRS) {
    const a = hex(themes[id][fg]);
    const b = hex(themes[id][bg]);
    if (!a || !b) { warn(`${fg}/${bg} : couleur non hexadécimale, non vérifiée`); continue; }
    const r = ratio(a, b);
    const line = `${fg} sur ${bg} = ${r.toFixed(2)}:1 (min ${min}) — ${role}`;
    r >= min ? ok(line) : fail(line);
  }
  const borderRatio = ratio(hex(themes[id].border) ?? [1, 1, 1], hex(themes[id].background) ?? [1, 1, 1]);
  if (borderRatio < 3) warn(`border sur background = ${borderRatio.toFixed(2)}:1 : décoratif seulement, ne pas l'utiliser comme seul repère d'un champ`);
}

// 4. Couleurs codées en dur dans les composants
console.log("\nCouleurs codées en dur dans client/src (hors index.css et lib/themes.ts)");
const hard = [];
const walk = dir => {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) { if (e.name !== "ui") walk(p); continue; }
    if (!/\.(tsx?|css)$/.test(e.name) || /index\.css$|lib[\\/]themes\.ts$/.test(p)) continue;
    fs.readFileSync(p, "utf8").split("\n").forEach((l, i) => {
      if (/(?:bg|text|border|ring|fill|stroke|from|to|via|shadow)-\[#[0-9a-f]{3,8}\]|#[0-9a-f]{6}\b/i.test(l)) hard.push(`${path.relative(root, p)}:${i + 1}`);
    });
  }
};
walk(path.join(root, "client/src"));
hard.length ? hard.forEach(h => fail(`couleur en dur : ${h} (utiliser un token)`)) : ok("aucune");

console.log(failures ? `\n${failures} problème(s).` : "\nTout est bon.");
process.exit(failures ? 1 : 0);
