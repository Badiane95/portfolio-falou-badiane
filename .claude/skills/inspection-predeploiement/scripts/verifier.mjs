#!/usr/bin/env node
// Vérifications automatiques avant déploiement du portfolio.
// Lecture seule : rien n'est écrit dans le dépôt. Le build Vite et la transpilation
// de l'API se font dans un dossier temporaire, supprimé à la fin.
//
// Usage : node .claude/skills/inspection-predeploiement/scripts/verifier.mjs [--rapide]
//   --rapide : saute le build Vite (l'étape la plus longue).
// Code de sortie : 0 si tout passe, 1 sinon.
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import { createRequire } from "node:module";
import os from "node:os";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../../..");
const RAPIDE = process.argv.includes("--rapide");
const SERVER_DIRS = ["api", "server", "shared", "drizzle"];
const TMP = fs.mkdtempSync(path.join(os.tmpdir(), "inspection-"));
const require = createRequire(path.join(ROOT, "package.json"));

/** Lance une commande dans le dépôt ; renvoie le code et la fin de la sortie. */
function run(cmd, args, options = {}) {
  const r = spawnSync(cmd, args, { cwd: ROOT, encoding: "utf8", timeout: 600_000, ...options });
  const output = `${r.stdout ?? ""}${r.stderr ?? ""}`.trim();
  return { ok: r.status === 0, output, tail: output.split("\n").slice(-25).join("\n") };
}

function walk(dir, filter) {
  const abs = path.join(ROOT, dir);
  if (!fs.existsSync(abs)) return [];
  return fs.readdirSync(abs, { withFileTypes: true }).flatMap(entry => {
    const rel = path.join(dir, entry.name);
    if (entry.isDirectory()) return entry.name === "node_modules" ? [] : walk(rel, filter);
    return filter(rel) ? [rel] : [];
  });
}

const isServerTs = file => file.endsWith(".ts") && !file.endsWith(".d.ts");

// --- Les vérifications ---------------------------------------------------------

function typecheck() {
  const r = run("pnpm", ["check"]);
  return { ok: r.ok, detail: r.ok ? "tsc --noEmit sans erreur" : r.tail };
}

function tests() {
  const r = run("pnpm", ["test"]);
  const summary = r.output.match(/Tests\s+[^\n]+/)?.[0] ?? "";
  return { ok: r.ok, detail: r.ok ? summary : r.tail };
}

function themes() {
  const r = run(process.execPath, [".claude/skills/theme-system/scripts/check-themes.mjs"]);
  return { ok: r.ok, detail: r.ok ? "cohérence, contrastes WCAG et couleurs en dur" : r.tail };
}

/**
 * La fonction Vercel est compilée fichier par fichier et chargée en ESM natif :
 * un import relatif sans extension `.js` ou un alias (@shared, @/) y provoque
 * ERR_MODULE_NOT_FOUND, alors que tsc et vitest l'acceptent.
 */
function serverImports() {
  const problems = [];
  for (const file of SERVER_DIRS.flatMap(d => walk(d, isServerTs))) {
    fs.readFileSync(path.join(ROOT, file), "utf8").split("\n").forEach((line, i) => {
      const trimmed = line.trim();
      if (trimmed.startsWith("*") || trimmed.startsWith("//")) return;
      for (const m of line.matchAll(/(?:\bfrom\s+|\bimport\s*\(\s*|^\s*import\s+)["']([^"']+)["']/g)) {
        const spec = m[1];
        if (spec.startsWith("@shared") || spec.startsWith("@/")) problems.push(`${file}:${i + 1} alias interdit côté serveur : ${spec}`);
        else if (spec.startsWith(".") && !/\.(js|mjs|cjs|json)$/.test(spec)) problems.push(`${file}:${i + 1} import sans extension .js : ${spec}`);
      }
    });
  }
  return { ok: problems.length === 0, detail: problems.length ? problems.join("\n") : "imports relatifs en .js, aucun alias" };
}

/** Reproduit le chargement de la fonction Vercel : transpilation fichier par fichier, puis import ESM. */
function apiLoads() {
  const esbuild = require("esbuild");
  const out = path.join(TMP, "api-esm");
  for (const file of SERVER_DIRS.flatMap(d => walk(d, f => isServerTs(f) && !/\.(test|spec)\.ts$/.test(f)))) {
    const { code } = esbuild.transformSync(fs.readFileSync(path.join(ROOT, file), "utf8"), {
      loader: "ts",
      format: "esm",
      target: "node20",
    });
    const dest = path.join(out, file.replace(/\.ts$/, ".js"));
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    fs.writeFileSync(dest, code);
  }
  fs.copyFileSync(path.join(ROOT, "package.json"), path.join(out, "package.json"));
  fs.symlinkSync(path.join(ROOT, "node_modules"), path.join(out, "node_modules"), "dir");
  const entry = pathToFileURL(path.join(out, "api/index.js")).href;
  const r = run(
    process.execPath,
    [
      "--input-type=module",
      "-e",
      `const m = await import(${JSON.stringify(entry)});
       if (typeof m.default !== "function") { console.error("api/index : pas d'application Express exportée par défaut"); process.exit(1); }
       process.exit(0);`,
    ],
    { cwd: out, timeout: 60_000 }
  );
  return { ok: r.ok, detail: r.ok ? "api/index.js se charge en ESM natif et exporte l'app" : r.tail };
}

function viteBuild() {
  if (RAPIDE) return { ok: true, skipped: true, detail: "sauté (--rapide)" };
  const r = run("pnpm", ["exec", "vite", "build", "--outDir", path.join(TMP, "public"), "--emptyOutDir", "--logLevel", "warn"]);
  return { ok: r.ok, detail: r.ok ? "build client sans erreur (sortie temporaire, dist/ intact)" : r.tail };
}

/** Cohérence du contenu : l'explorateur de compétences relie les données par leur nom exact. */
async function contentData() {
  const esbuild = require("esbuild");
  const { code } = esbuild.transformSync(fs.readFileSync(path.join(ROOT, "client/src/data/portfolio.ts"), "utf8"), {
    loader: "ts",
    format: "esm",
  });
  const file = path.join(TMP, "portfolio.mjs");
  fs.writeFileSync(file, code);
  const data = await import(pathToFileURL(file).href);
  const problems = [];
  const skills = new Set(data.skillGroups.flatMap(g => g.skills));
  const pub = rel => path.join(ROOT, "client/public", rel);

  const slugs = new Set();
  for (const p of data.projects) {
    if (slugs.has(p.slug)) problems.push(`projet « ${p.slug} » : slug en double`);
    slugs.add(p.slug);
    for (const s of p.stack) if (!skills.has(s)) problems.push(`projet « ${p.slug} » : « ${s} » absent de skillGroups`);
    if (p.image && !fs.existsSync(pub(p.image))) problems.push(`projet « ${p.slug} » : image introuvable ${p.image}`);
  }
  const employers = data.experience.map(e => e.place);
  for (const [skill, companies] of Object.entries(data.skillsAtWork)) {
    if (!skills.has(skill)) problems.push(`skillsAtWork : « ${skill} » absent de skillGroups`);
    for (const c of companies) if (!employers.some(place => place.startsWith(c))) problems.push(`skillsAtWork « ${skill} » : employeur « ${c} » absent de experience`);
  }
  for (const e of [...data.experience, ...data.education]) {
    if (!/^\d{4}-\d{2}$/.test(e.start ?? "")) problems.push(`« ${e.title} » : start doit être au format AAAA-MM (reçu ${e.start})`);
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.profile.email)) problems.push(`profile.email invalide : ${data.profile.email}`);
  if (!fs.existsSync(pub(data.profile.cv))) problems.push(`CV introuvable : ${data.profile.cv}`);

  // Une seule adresse publique : profil, constante client et destinataire par défaut du formulaire.
  const constTs = fs.readFileSync(path.join(ROOT, "client/src/const.ts"), "utf8");
  const envTs = fs.readFileSync(path.join(ROOT, "server/_core/env.ts"), "utf8");
  const constEmail = constTs.match(/CONTACT_EMAIL\s*=\s*"([^"]+)"/)?.[1];
  const ownerDefault = envTs.match(/OWNER_EMAIL\s*\|\|\s*"([^"]+)"/)?.[1];
  for (const [file, name, value] of [["client/src/const.ts", "CONTACT_EMAIL", constEmail], ["server/_core/env.ts", "OWNER_EMAIL par défaut", ownerDefault]]) {
    // Une adresse non trouvée ne doit pas faire passer le contrôle en silence.
    if (!value) problems.push(`${name} : adresse introuvable dans ${file} (format inattendu)`);
    else if (value !== data.profile.email) problems.push(`${file} ${name} = ${value}, différent de profile.email (${data.profile.email})`);
  }
  return {
    ok: problems.length === 0,
    detail: problems.length ? problems.join("\n") : `${data.projects.length} projets, ${skills.size} compétences, liens cohérents`,
  };
}

/**
 * Secrets ou fichiers d'environnement suivis par git, ou pas encore ajoutés mais
 * non ignorés : un `git add -A` les enverrait. Les fichiers ignorés par .gitignore
 * (node_modules, .env, …) ne sont pas examinés.
 */
function secrets() {
  const problems = [];
  const files = run("git", ["ls-files", "--cached", "--others", "--exclude-standard"]).output.split("\n");
  for (const f of files) if (/(^|\/)\.env(\.|$)/.test(f) && !f.endsWith(".example")) problems.push(`fichier d'environnement suivi ou à ajouter : ${f}`);
  const patterns = [
    "re_[A-Za-z0-9_]{20,}", // clé Resend
    "sk-[A-Za-z0-9_-]{20,}",
    "ghp_[A-Za-z0-9]{30,}",
    "AKIA[0-9A-Z]{16}",
    "-----BEGIN [A-Z ]*PRIVATE KEY-----",
  ];
  const grep = extra => run("git", ["grep", ...extra, "-nIE", patterns.join("|"), "--", ".", ":!pnpm-lock.yaml", ":!dist", ":!.claude/skills/inspection-predeploiement"]).output;
  // Deux passes : tous les fichiers suivis (même ajoutés de force malgré .gitignore),
  // puis avec --untracked les fichiers non suivis, en respectant .gitignore.
  const hits = new Set([grep([]), grep(["--untracked"])].flatMap(out => (out ? out.split("\n") : [])));
  problems.push(...[...hits].map(l => `secret possible : ${l.slice(0, 160)}`));
  return { ok: problems.length === 0, detail: problems.length ? problems.join("\n") : "aucun secret ni .env suivi ou à ajouter" };
}

// --- Exécution -----------------------------------------------------------------

const CHECKS = [
  ["Types (pnpm check)", typecheck],
  ["Tests (pnpm test)", tests],
  ["Thèmes et contrastes", themes],
  ["Imports serveur ESM", serverImports],
  ["Chargement de la fonction Vercel", apiLoads],
  ["Données du portfolio", contentData],
  ["Secrets", secrets],
  ["Build client (Vite)", viteBuild],
];

let failures = 0;
try {
  for (const [label, check] of CHECKS) {
    let result;
    try {
      result = await check();
    } catch (error) {
      result = { ok: false, detail: String(error?.stack ?? error).split("\n").slice(0, 8).join("\n") };
    }
    if (!result.ok) failures++;
    const mark = result.skipped ? "–" : result.ok ? "✓" : "✗";
    console.log(`${mark} ${label}`);
    console.log(result.detail.split("\n").map(l => `    ${l}`).join("\n"));
  }
} finally {
  fs.rmSync(TMP, { recursive: true, force: true });
}

console.log(failures ? `\n${failures} vérification(s) en échec.` : "\nToutes les vérifications passent.");
process.exit(failures ? 1 : 0);
