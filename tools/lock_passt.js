#!/usr/bin/env node
// tools/lock_passt.js <ordner> - passt <ordner>/node_modules zum <ordner>/package-lock.json?
// Vergleicht INHALT (Fassung + integrity je Paket) mit node_modules/.package-lock.json, nicht den
// Zeitstempel: git pull/checkout macht das Lockfile "neuer", obwohl nichts zu installieren ist
// (gemessen 15.10.2026: mtime-Pruefung OFFEN, Inhalt 0 fehlend / 0 abweichend).
// Fehlende optional/peer-Pakete zaehlen nicht (Plattformpakete anderer Betriebssysteme).
// rc 0 = passt · rc 1 = weicht ab (Grund auf stdout) · rc 2 = Datei fehlt
"use strict";
const fs = require("fs"), path = require("path");
const dir = process.argv[2] || ".";
/** @param {string} p @returns {Record<string, {version?: string, integrity?: string, optional?: boolean, peer?: boolean}> | null} */
const lesen = (p) => { try { return JSON.parse(fs.readFileSync(path.join(dir, p), "utf8")).packages || {}; } catch { return null; } };
const soll = lesen("package-lock.json"), ist = lesen("node_modules/.package-lock.json");
if (!soll || !ist) { console.log(!soll ? "package-lock.json fehlt" : "node_modules fehlt"); process.exit(2); }
const fehlt = [], abw = [];
for (const [k, v] of Object.entries(soll)) {
  if (!k) continue;
  const h = ist[k];
  if (!h) { if (!v.optional && !v.peer) fehlt.push(k); continue; }
  if (h.version !== v.version || h.integrity !== v.integrity) abw.push(k);
}
const extra = Object.keys(ist).filter((k) => k && !(k in soll));
if (fehlt.length + abw.length + extra.length === 0) process.exit(0);
console.log(`fehlt ${fehlt.length}, abweichend ${abw.length}, ueberzaehlig ${extra.length}: ${[...fehlt, ...abw, ...extra].slice(0, 3).join(", ")}`);
process.exit(1);
