"use strict";
/* test_render_smoke.js – #23 (Arbeitspaket 29 Ideen, G1.2)
   Render-Smoke für ALLE Fragetypen (L.TYPEN): je Typ eine reale Frage über den echten Anzeigepfad
   loeseFrage()/R_TYP-Registry in jsdom rendern – ohne JS-Fehler und mit nicht-leerem Löser-Panel
   (= interaktiv/gradierbar aufgebaut). Deckt die Renderer ab, die test_logik (reine Logik) NICHT prüft.
   Fehlt ein Typ im Pool (aktuell nur 'lueckentext'), wird eine minimale gültige Frage gecraftet.
   Zählwert = Anzahl L.TYPEN (Sollwert render_smoke in sollwerte.env).
   Aufruf via check.sh (voll) / CI. Nutzt tests/_harness.js (boot in jsdom). */
const H = require("./_harness.js");

/* Minimal gültige Ersatzfragen für Typen ohne Pool-Instanz (nur Render-Pfad, fachlich belanglos). */
const CRAFT = {
  lueckentext: {
    id: "M01-001", pruefungsteil: "AP1", modul: "M01", thema: null, typ: "lueckentext",
    schwierigkeit: 1, frage: "Ein Byte besteht aus ___ Bit.", luecken: [["8", "acht"]],
    erklaerungKurz: "1 Byte = 8 Bit."
  }
};

(async () => {
  const w = await H.boot();
  const L = w.L, POOL = w.FRAGEN || [];
  const typen = (L && Array.isArray(L.TYPEN)) ? L.TYPEN : [];
  // Harte Boot-Guards (zählen NICHT als Test, damit der Zählwert == Anzahl Typen bleibt)
  if (typen.length < 20) { console.log("BOOT-FEHLER: L.TYPEN fehlt/zu kurz (" + typen.length + ")"); process.exit(1); }
  if (typeof w.loeseFrage !== "function") { console.log("BOOT-FEHLER: loeseFrage nicht vorhanden"); process.exit(1); }

  // gültiges kanonisches Thema für gecraftete Fragen (falls Pool eines braucht)
  const kanon = (L && L.THEMA_RELEVANZ) ? Object.keys(L.THEMA_RELEVANZ)[0] : "Betriebssysteme";

  typen.forEach(function (typ) {
    let quelle = POOL.find(function (f) { return f.typ === typ; });
    if (!quelle && CRAFT[typ]) { quelle = Object.assign({}, CRAFT[typ]); if (quelle.thema == null) quelle.thema = kanon; }

    if (!quelle) { H.t("render " + typ + " (keine Frage im Pool + kein Craft)", false); return; }

    let ok = false, grund = "";
    try {
      const f = (typeof L.instanziiere === "function") ? L.instanziiere(quelle) : quelle;
      const host = w.document.createElement("div");
      w.document.body.appendChild(host);
      w.loeseFrage(f, host, { simulation: false, onGraded: function () {}, onNext: function () {} });
      const loeser = host.querySelector(".loeser");
      const rendered = host.childNodes.length > 0 && loeser && loeser.childNodes.length > 0;
      host.parentNode.removeChild(host);
      ok = !!rendered;
      if (!ok) grund = " (Löser-Panel leer)";
    } catch (e) {
      ok = false; grund = " EXCEPTION: " + (e && e.message ? e.message : e);
    }
    H.t("render " + typ + grund, ok);
  });

  const c = H.counts();
  console.log("\n==== " + c.ok + " Tests OK, " + c.fail + " Fehler ====");
  process.exit(c.fail ? 1 : 0);
})();
