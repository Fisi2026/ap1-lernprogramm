/* Test: AP1-Prüfungssimulation – buildAP1Exam() in app_sim.js (jsdom).
   ══════════ WARUM ES DIESE SUITE GIBT (2026-08-27) ══════════
   Bis zu diesem Tag hatte der Simulationsbauer, den die App WIRKLICH benutzt, keine einzige
   Prüfung. Getestet wurde stattdessen L.buildSimulation in logik.js – eine Funktion, die
   ausschliesslich tests/test_logik.js aufgerufen hat und im Produkt tot war. Vier gruene
   Pruefungen ueber einen toten Pfad, null ueber den lebenden.
   ►►► Dieselbe Familie wie "test_axe wuerfelte": eine Pruefung ist gruen, weil sie etwas
       anderes prueft als das, was laeuft.
   ⚠️ Diese Suite fuehrt deshalb ausdruecklich den Weg der App: Seite "sim" rendern, Simulation
      starten, und den Bestand pruefen, den buildAP1Exam zieht. */
const { t: check, boot, report } = require("./_harness.js");

(async () => {
  const w = await boot();

  // ── 1) Der Bauer existiert im App-Kontext und wird von der Seite benutzt ──────────────────
  check("buildAP1Exam im App-Kontext", typeof w.buildAP1Exam === "function");

  w.S.simDauerMin = 0; w.seite = "sim"; w.render();
  const startBtn = [].slice.call(w.document.querySelectorAll("button"))
    .find(function (b) { return /Prüfung starten/.test(b.textContent); });
  check("Start-Button vorhanden", !!startBtn);
  if (startBtn) startBtn.click();
  check("Simulation läuft", w.simLaeuft === true);
  check("Fragen gezogen", !!(w.sim && Array.isArray(w.sim.fragen) && w.sim.fragen.length > 0));

  const fragen = (w.sim && w.sim.fragen) || [];

  // ── 2) Nur Typen, die die Registry fuer die Simulation vorsieht ──────────────────────────
  // ⚠️ Genau hier lag der Befund vom 27.08.: app_sim.js fuehrte eine ZWEITE Typenliste, die von
  //    L.SIM_TYPEN abwich (reihenfolge fehlte). Diese Pruefung haelt beide zusammen.
  const typOk = fragen.every(function (f) {
    var t = f.typ === "bild" ? f.unterTyp : f.typ;
    return w.L.SIM_TYPEN.indexOf(t) >= 0;
  });
  check("nur Typen aus L.SIM_TYPEN (keine zweite Liste)", typOk);

  // ── 3) Was die Simulation ausdruecklich NICHT enthalten darf ─────────────────────────────
  check("keine Freitexte", fragen.every(function (f) { return f.typ !== "freitext" && f.typ !== "erklaeren"; }));
  check("kein M08 (WiSo/B3)", fragen.every(function (f) { return f.modul !== "M08"; }));
  check("kein M09 (Unterricht)", fragen.every(function (f) { return f.modul !== "M09"; }));
  check("jede Frage automatisch bewertbar", fragen.every(function (f) {
    var t = f.typ === "bild" ? f.unterTyp : f.typ;
    var r = w.L.TYP[t];
    return !!(r && typeof r.grade === "function");
  }));

  // ── 4) Der Bestand, aus dem gezogen wird ─────────────────────────────────────────────────
  // ⚠️ Zahl bewusst NICHT hart: sie waechst mit dem Pool. Geprueft wird die Eigenschaft,
  //    nicht der Messwert – ein harter Sollwert hier waere beim naechsten Batch rot.
  const basis = w.POOL.filter(function (f) {
    var t = f.typ === "bild" ? f.unterTyp : f.typ;
    return f.modul !== "M08" && w.L.SIM_TYPEN.indexOf(t) >= 0;
  });
  check("Simulationsbestand > 300 Fragen", basis.length > 300);
  check("reihenfolge ist im Bestand (Befund 27.08.)", basis.some(function (f) { return f.typ === "reihenfolge"; }));
  check("mtf ist im Bestand (Befund 27.08.)", basis.some(function (f) { return f.typ === "mtf"; }));

  // ── 5) Fallaufgabe: alle Teilaufgaben muessen erreichbar sein ────────────────────────────
  // ⚠️ ANLASS: 8 von 45 Teilaufgaben waren fuer keinen Lerner erreichbar, weil die Faelle NUR in
  //    der Simulation vorkommen und dort ueber autoBewertbar gefiltert werden.
  const faelle = w.FAELLE || [];
  let unerreichbar = [];
  faelle.forEach(function (fall) {
    (fall.teilaufgaben || []).forEach(function (ta, i) {
      var t = ta.typ === "bild" ? ta.unterTyp : ta.typ;
      if (w.L.SIM_TYPEN.indexOf(t) < 0) unerreichbar.push(fall.id + "-t" + i + " (" + ta.typ + ")");
    });
  });
  check("jede Fall-Teilaufgabe ist erreichbar" + (unerreichbar.length ? ": " + unerreichbar.join(", ") : ""),
    unerreichbar.length === 0);

  // ⚠️ Der Klausur-Timer laeuft nach dem Start weiter und haelt den Node-Prozess offen -
  //    die erste Fassung dieser Suite lief deshalb in den Zeitrahmen statt zu enden.
  //    simAbbrechen() raeumt ihn ab; report() liefert den Rueckgabewert wie in test_timer.
  if (typeof w.simAbbrechen === "function") w.simAbbrechen();

  process.exit(report());
})().catch(function (e) { console.log("ABBRUCH:", e); process.exit(1); });
