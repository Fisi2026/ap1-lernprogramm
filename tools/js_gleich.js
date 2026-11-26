#!/usr/bin/env node
/* tools/js_gleich.js - beweist, dass eine JS-Aenderung NUR Kommentare und Klammern betrifft (N45 W3).
 *
 * ZWECK: N45 W3 macht tools/**\/*.js unter `tsc --strict` fehlerfrei, und zwar AUSSCHLIESSLICH mit
 * JSDoc-Kommentaren und Cast-Klammern `/** @type {T} *\/ (ausdruck)`. Beides aendert kein Verhalten.
 * Dieses Werkzeug belegt das je Datei: Babel parst alt (git-Stand) und neu (Arbeitsbaum), der
 * Generator gibt beide OHNE Kommentare aus; Klammern verschwinden beim Parsen (createParenthesized-
 * Expressions ist aus). Gleiche Ausgabe = gleicher Syntaxbaum = gleiches Verhalten.
 *
 * Aufruf:  node tools/js_gleich.js [--ref HEAD] <datei.js> [...]   rc 0 alle gleich · 1 mind. eine
 *          ungleich (erste abweichende Zeile wird gezeigt) · 2 Aufruf-/Lesefehler
 *          node tools/js_gleich.js --probe                          Selbsttest an bekannten Faellen
 * Braucht @babel/core + @babel/generator aus neu/node_modules (cd neu && npm ci).
 */
"use strict";
const path = require("path");
const { execFileSync } = require("child_process");
const fs = require("fs");

const WURZEL = path.join(__dirname, "..");
const r = require("module").createRequire(path.join(WURZEL, "neu", "package.json"));
/** @type {any} */
let babel;
/** @type {any} */
let gen;
try {
  babel = r("@babel/core");
  gen = r("@babel/generator").default;
} catch (e) {
  console.error("[js_gleich] @babel/core fehlt in neu/node_modules (cd neu && npm ci): " + /** @type {Error} */ (e).message);
  process.exit(2);
}

/** Quelltext -> Code ohne Kommentare und ohne ueberfluessige Klammern.
 * @param {string} quelle
 * @returns {string} */
function normal(quelle) {
  const ast = babel.parseSync(quelle.replace(/^#!.*/, ""), {
    configFile: false, babelrc: false, sourceType: "unambiguous",
    parserOpts: { allowReturnOutsideFunction: true },
  });
  return gen(ast, { comments: false }).code;
}

/** @param {string} a @param {string} b @returns {string} erste abweichende Zeile oder "" */
function abweichung(a, b) {
  const x = a.split("\n"), y = b.split("\n");
  for (let i = 0; i < Math.max(x.length, y.length); i++) {
    if (x[i] !== y[i]) return `Zeile ${i + 1} (normalisiert):\n  alt: ${(x[i] ?? "<Ende>").slice(0, 160)}\n  neu: ${(y[i] ?? "<Ende>").slice(0, 160)}`;
  }
  return "";
}

function probe() {
  const F = [
    ["nur JSDoc ergaenzt", "function f(x){return x+1}", "/** @param {number} x */\nfunction f(x){return x+1}", true],
    ["Cast-Klammer", "const a = b.c;", "const a = /** @type {any} */ (b).c;", true],
    ["Zeilenkommentar + Leerzeilen", "let z = 1;\nz++;", "// hallo\nlet z = 1;\n\n\nz++; // dort", true],
    ["Shebang bleibt egal", "#!/usr/bin/env node\nx();", "#!/usr/bin/env node\n/** @type {any} */\nx();", true],
    ["leere Datei", "", "/* nur Kommentar */", true],
    ["Bezeichner geaendert (muss ROT)", "x.a + y", "x.b + y", false],
    ["Klammer aendert Vorrang (muss ROT)", "a + b * c", "(a + b) * c", false],
    ["Sonderzeichen im String (muss ROT)", "s = 'ä'", "s = 'ae'", false],
    ["Kommentarzeichen im String (muss ROT)", "s = 'x'", "s = '/* x */'", false],
  ];
  let ok = 0;
  for (const [name, a, b, soll] of F) {
    const ist = normal(/** @type {string} */ (a)) === normal(/** @type {string} */ (b));
    const gut = ist === soll;
    if (gut) ok++;
    console.log(`${gut ? "ok  " : "FEHL"} ${name}: ${ist ? "gleich" : "ungleich"}`);
  }
  console.log(`[js_gleich --probe] ${ok}/${F.length}`);
  process.exit(ok === F.length ? 0 : 1);
}

function main() {
  const arg = process.argv.slice(2);
  if (arg[0] === "--probe") return probe();
  let ref = "HEAD";
  if (arg[0] === "--ref") { ref = arg[1] ?? ""; arg.splice(0, 2); }
  if (!ref || arg.length === 0) { console.error("Aufruf: node tools/js_gleich.js [--ref HEAD] <datei.js> [...] | --probe"); process.exit(2); }
  let ungleich = 0;
  for (const d of arg) {
    const rel = path.relative(WURZEL, path.resolve(d)).split(path.sep).join("/");
    /** @type {string} */
    let alt;
    try {
      alt = execFileSync("git", ["show", `${ref}:${rel}`], { cwd: WURZEL, encoding: "utf8", maxBuffer: 64 << 20 });
    } catch (e) {
      console.error(`[js_gleich] ${rel}: nicht in ${ref} lesbar`); process.exit(2);
    }
    const neu = fs.readFileSync(path.join(WURZEL, rel), "utf8");
    const a = normal(alt), b = normal(neu);
    if (a === b) console.log(`gleich    ${rel}`);
    else { ungleich++; console.log(`UNGLEICH  ${rel}\n${abweichung(a, b)}`); }
  }
  console.log(`[js_gleich] ${arg.length - ungleich}/${arg.length} gleich (Referenz ${ref})`);
  process.exit(ungleich ? 1 : 0);
}
main();
