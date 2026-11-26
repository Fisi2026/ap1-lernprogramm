/* Node-Testskript: node test_meta.js – prüft L.TYP_META / L.metaFuer (#73) */
"use strict";
const L = require("./logik.js");
let ok = 0, fail = 0;
function t(name, bed) { if (bed) { ok++; } else { fail++; console.log("FEHLER: " + name); } }

/* ---- TYP_META vorhanden + vollständig ---- */
t("TYP_META ist Objekt", L.TYP_META && typeof L.TYP_META === "object");
t("TYP_META_DEFAULT hat sek+punkte", L.TYP_META_DEFAULT.sek > 0 && L.TYP_META_DEFAULT.punkte > 0);
t("metaFuer ist Funktion", typeof L.metaFuer === "function");

/* Jeder kanonische Typ (L.TYPEN) hat einen Meta-Eintrag mit plausiblen Werten. */
L.TYPEN.forEach(function (ty) {
  const m = L.TYP_META[ty];
  t("TYP_META['" + ty + "'] vorhanden", !!m);
  t("TYP_META['" + ty + "'] sek plausibel (30..300)", m && m.sek >= 30 && m.sek <= 300);
  t("TYP_META['" + ty + "'] punkte plausibel (1..5)", m && m.punkte >= 1 && m.punkte <= 5);
});

/* ---- metaFuer: Standard je Typ ---- */
t("metaFuer(mc).punkte == 1", L.metaFuer({ typ: "mc" }).punkte === 1);
t("metaFuer(mc).sek == 60", L.metaFuer({ typ: "mc" }).sek === 60);
t("metaFuer(erklaeren).punkte == 3", L.metaFuer({ typ: "erklaeren" }).punkte === 3);

/* ---- metaFuer: Frage-Override hat Vorrang ---- */
const ovr = L.metaFuer({ typ: "mc", sek: 200, punkte: 4 });
t("Override sek greift", ovr.sek === 200);
t("Override punkte greift", ovr.punkte === 4);
t("Ungültiger Override (0) fällt auf Standard zurück", L.metaFuer({ typ: "mc", sek: 0, punkte: -1 }).sek === 60);

/* ---- metaFuer: unbekannter/fehlender Typ -> Default ---- */
t("Unbekannter Typ -> Default sek", L.metaFuer({ typ: "gibtsnicht" }).sek === L.TYP_META_DEFAULT.sek);
t("Kein Argument -> Default punkte", L.metaFuer().punkte === L.TYP_META_DEFAULT.punkte);

/* ---- Konsistenz: jede echte Frage bekommt gültige Meta ---- */
let FRAGEN = null;
try { FRAGEN = require("./fragen.js"); } catch (e) { /* noch nicht gebaut */ }
if (Array.isArray(FRAGEN)) {
  let alleOk = true;
  FRAGEN.forEach(function (f) {
    const m = L.metaFuer(f);
    if (!(m.sek > 0 && m.punkte > 0)) alleOk = false;
  });
  t("Alle " + FRAGEN.length + " Fragen liefern gültige Meta (sek>0, punkte>0)", alleOk);
} else {
  console.log("(fragen.js noch nicht gebaut – Konsistenz-Test übersprungen)");
}

console.log("\n==== " + ok + " Tests OK, " + fail + " Fehler ====");
process.exit(fail ? 1 : 0);
