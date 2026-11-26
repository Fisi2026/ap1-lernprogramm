#!/usr/bin/env node
/* index.js – erzeugt FUNCTIONS.md (Symbol → Datei:Zeile) für token-günstige Navigation.
   Aufruf im Training-Ordner:  node tools/index.js   (schreibt ../FUNCTIONS.md)
   Scannt die Kern-JS-Dateien nach Funktions-/Global-Definitionen. Nicht von Hand pflegen –
   bei Bedarf (z. B. nach Refactor/Modularisierung) neu generieren. */
const fs = require("fs"), path = require("path");
const BASIS = path.join(__dirname, "..", "referenz");   // N34 T6c: die alte App (logik.js, app_*.js) liegt nur noch dort
const DATEIEN = ["logik.js", "app.js", "spickzettel.js"];  // faelle.js entfiel mit N29 Teil 2 (reine Daten)

// Zusätzlich alle app_*.js / logik_*.js einsammeln (falls modularisiert)
fs.readdirSync(BASIS).forEach(f => {
  if (/^(app|logik)_[a-z0-9]+\.js$/.test(f) && !DATEIEN.includes(f)) DATEIEN.push(f);
});

const muster = [
  { re: /^\s*function\s+([A-Za-z_$][\w$]*)\s*\(/, art: "fn" },
  { re: /^\s*(?:L|window\.L)\.([A-Za-z_$][\w$]*)\s*=\s*function/, art: "L.fn" },
  { re: /^\s*(?:var|const|let)\s+([A-Z][A-Z0-9_]{2,})\s*=/, art: "GLOBAL" }
];

const out = ["# FUNCTIONS.md – Symbol-Index (generiert via `node tools/index.js`)", "",
  "Funktion/Global → Datei:Zeile. NICHT von Hand pflegen; nach Struktur-Änderungen neu generieren.", ""];
let gesamt = 0;
DATEIEN.forEach(datei => {
  const p = path.join(BASIS, datei);
  if (!fs.existsSync(p)) return;
  const zeilen = fs.readFileSync(p, "utf8").split("\n");
  const treffer = [];
  zeilen.forEach((z, i) => {
    for (const m of muster) {
      const g = z.match(m.re);
      if (g) { treffer.push({ name: g[1], zeile: i + 1, art: m.art }); break; }
    }
  });
  if (!treffer.length) return;
  gesamt += treffer.length;
  out.push("## " + datei + "  (" + treffer.length + " Symbole)", "");
  treffer.forEach(t => out.push("- `" + t.name + "`" + (t.art === "GLOBAL" ? " *(Global)*" : "") + " — " + datei + ":" + t.zeile));
  out.push("");
});
fs.writeFileSync(path.join(BASIS, "FUNCTIONS.md"), out.join("\n"));
console.log("FUNCTIONS.md geschrieben: " + gesamt + " Symbole aus " + DATEIEN.filter(d => fs.existsSync(path.join(BASIS, d))).length + " Dateien.");
