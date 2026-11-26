/* test_diagnose.js – jsdom-Integrationstests für Feature #63 ("Warum falsch?"-Diagnose).
   Aufruf: node test_diagnose.js   -> Ausgabe "N OK / M FEHLER", exit 1 bei mind. 1 Fehler. */
"use strict";
const { t, boot, report } = require("./_harness.js");

async function main() {
  function seedState() {
    return {
      version: 5,
      seen: {}, lastShown: [], antworten: [],
      level: 2, levelModus: "auto", module: [],
      fehlerDeck: {}, notizen: {},
      statistik: {},
      dailyCounts: {}, tagesziel: 20,
      pruefungsdatum: "", theme: null,
      simHistorie: [], simAnzahl: 40, simUsedIds: [],
      uebenZaehler: 0, fokusZu: true, serieDone: "",
      lastTyp: "",
      inklAP2: false,
      markiert: {}, simDauerMin: 90, fokus: false, meldungen: {},
      farbsymbole: false, ariaAltTexte: false, onboardingDone: true, typHilfeAus: {}
    };
  }

  const w = await boot(seedState());
  const doc = w.document;

  t("Boot: window.S existiert", !!w.S);
  t("Boot: window.POOL ist nicht-leeres Array", Array.isArray(w.POOL) && w.POOL.length > 0);
  t("Boot: window.loeseFrage ist eine Funktion", typeof w.loeseFrage === "function");
  t("Boot: window.zeigeDiagnose ist eine Funktion", typeof w.zeigeDiagnose === "function");

  function neuerHost() {
    const h = doc.createElement("div");
    doc.body.appendChild(h);
    return h;
  }
  function firstOfType(typ) {
    return w.POOL.find(function (f) { return f.typ === typ; });
  }
  function pruefenKlicken() {
    const btn = doc.getElementById("btnAktion");
    btn.click();
  }
  function diagDetails(host) {
    return host.querySelector("details.diagnose");
  }
  function fbVorhanden(host, cls) {
    return !!host.querySelector(".fb." + cls);
  }

  /* ============ 1) MC — falsch beantwortet ============ */
  {
    const f = firstOfType("mc");
    t("MC: Testfrage aus POOL gefunden", !!f);
    if (f) {
      const host = neuerHost();
      let graded = null;
      w.loeseFrage(f, host, {
        onGraded: function (korrekt) { graded = korrekt; },
        onNext: function () {}
      });
      const btns = Array.from(host.querySelectorAll("button.opt"));
      t("MC: 4 Options-Buttons gerendert", btns.length === 4);
      const falschBtn = btns.find(function (b) { return b.textContent !== f.optionen[f.loesungIndex]; });
      t("MC: falscher Options-Button gefunden", !!falschBtn);
      const gewaehlterIndex = f.optionen.indexOf(falschBtn.textContent);
      falschBtn.click();
      pruefenKlicken();
      t("MC: onGraded(false) bei falscher Antwort", graded === false);
      t("MC: Feedback 'nein' angezeigt", fbVorhanden(host, "nein"));
      const d = diagDetails(host);
      t("MC: <details class='diagnose'> vorhanden", !!d);
      t("MC: Diagnose ist standardmäßig zugeklappt", !!d && d.open === false);
      if (d) {
        const erwartet = f.distraktorErklaerungen && f.distraktorErklaerungen[gewaehlterIndex] &&
          String(f.distraktorErklaerungen[gewaehlterIndex]).trim();
        if (erwartet) {
          t("MC: Diagnose enthält Distraktor-Erklärung der gewählten Option", d.innerHTML.indexOf(erwartet) !== -1);
        } else {
          t("MC: Diagnose enthält generischen Hinweis auf Lösungsoption", d.textContent.indexOf(f.optionen[f.loesungIndex]) !== -1);
        }
      }
      t("MC: Summary-Text 'Warum war das falsch?'", !!d && d.querySelector("summary").textContent === "Warum war das falsch?");
    }
  }

  /* ============ 1b) MC — richtig beantwortet -> KEINE Diagnose ============ */
  {
    const f = firstOfType("mc");
    if (f) {
      const host = neuerHost();
      let graded = null;
      w.loeseFrage(f, host, {
        onGraded: function (korrekt) { graded = korrekt; },
        onNext: function () {}
      });
      const btns = Array.from(host.querySelectorAll("button.opt"));
      const richtigBtn = btns.find(function (b) { return b.textContent === f.optionen[f.loesungIndex]; });
      richtigBtn.click();
      pruefenKlicken();
      t("MC richtig: onGraded(true)", graded === true);
      t("MC richtig: Feedback 'ok' angezeigt", fbVorhanden(host, "ok"));
      t("MC richtig: KEINE Diagnose angezeigt", !diagDetails(host));
    }
  }

  /* ============ 1c) bild/mc — falsch beantwortet ============ */
  {
    const f = w.POOL.find(function (fx) { return fx.typ === "bild" && fx.unterTyp === "mc"; });
    if (f) {
      const host = neuerHost();
      let graded = null;
      w.loeseFrage(f, host, { onGraded: function (k) { graded = k; }, onNext: function () {} });
      const btns = Array.from(host.querySelectorAll("button.opt"));
      const falschBtn = btns.find(function (b) { return b.textContent !== f.optionen[f.loesungIndex]; });
      falschBtn.click();
      pruefenKlicken();
      t("bild/mc: onGraded(false)", graded === false);
      t("bild/mc: Diagnose vorhanden trotz f.typ==='bild'", !!diagDetails(host));
    } else {
      t("bild/mc: Testfrage im Pool vorhanden (optional)", true); // kein Hard-Fail, falls Pool keine hat
    }
  }

  /* ============ 2) Mehrfach — falsch beantwortet ============ */
  {
    const f = firstOfType("mehrfach");
    t("Mehrfach: Testfrage aus POOL gefunden", !!f);
    if (f) {
      const host = neuerHost();
      let graded = null;
      w.loeseFrage(f, host, { onGraded: function (k) { graded = k; }, onNext: function () {} });
      const wrongIdx = f.optionen.findIndex(function (_, i) { return f.loesungIndizes.indexOf(i) < 0; });
      t("Mehrfach: mind. eine falsche Option vorhanden", wrongIdx >= 0);
      const labels = Array.from(host.querySelectorAll("label.check"));
      const wrongLabel = labels.find(function (l) { return l.querySelector("span").textContent === f.optionen[wrongIdx]; });
      t("Mehrfach: Label zur falschen Option gefunden", !!wrongLabel);
      if (wrongLabel) wrongLabel.querySelector("input").click();
      pruefenKlicken();
      t("Mehrfach: onGraded(false)", graded === false);
      const d = diagDetails(host);
      t("Mehrfach: <details class='diagnose'> vorhanden", !!d);
      t("Mehrfach: zugeklappt", !!d && d.open === false);
      if (d) {
        t("Mehrfach: Diagnose nennt falsch angekreuzte Option", d.textContent.indexOf(f.optionen[wrongIdx]) !== -1);
        const uncheckedRichtige = f.loesungIndizes.filter(function (i) { return i !== wrongIdx; });
        if (uncheckedRichtige.length) {
          t("Mehrfach: Diagnose nennt fälschlich nicht angekreuzte richtige Option",
            d.textContent.indexOf(f.optionen[uncheckedRichtige[0]]) !== -1 && d.textContent.indexOf("wäre richtig gewesen") !== -1);
        }
      }
    }
  }

  /* ============ 3) Dropdown — falsch beantwortet ============ */
  {
    const f = firstOfType("dropdown");
    t("Dropdown: Testfrage aus POOL gefunden", !!f);
    if (f) {
      const host = neuerHost();
      let graded = null;
      w.loeseFrage(f, host, { onGraded: function (k) { graded = k; }, onNext: function () {} });
      const selects = Array.from(host.querySelectorAll("select"));
      t("Dropdown: Anzahl Selects === Anzahl Lücken", selects.length === f.luecken.length);
      selects.forEach(function (sel, i) {
        const falschWert = (f.luecken[i].loesung + 1) % f.luecken[i].optionen.length;
        sel.value = String(falschWert);
        sel.dispatchEvent(new w.Event("change", { bubbles: true }));
      });
      pruefenKlicken();
      t("Dropdown: onGraded(false)", graded === false);
      const d = diagDetails(host);
      t("Dropdown: <details class='diagnose'> vorhanden", !!d);
      t("Dropdown: zugeklappt", !!d && d.open === false);
      if (d) {
        t("Dropdown: Diagnose nennt 'Lücke 1'", d.textContent.indexOf("Lücke 1") !== -1);
        t("Dropdown: Diagnose nennt richtige Option der 1. Lücke",
          d.textContent.indexOf(f.luecken[0].optionen[f.luecken[0].loesung]) !== -1);
      }
    }
  }

  /* ============ 4) Rechenassistent — falsch beantwortet (1. Schritt falsch) ============ */
  {
    /* #35 (G2.6): rechenassistent-Aufgaben sind im Pool randomisiert (variablen+Formeln).
       Wie in der App (naechsteFrage) wird hier zuerst instanziiert – erst danach tragen
       die Schritte konkrete Werte und Musterloesungen. */
    const fRoh = firstOfType("rechenassistent");
    const f = (fRoh && w.L && typeof w.L.instanziiere === "function") ? w.L.instanziiere(fRoh) : fRoh;
    t("Rechenassistent: Testfrage aus POOL gefunden", !!f);
    if (f) {
      const host = neuerHost();
      let graded = null;
      w.loeseFrage(f, host, { onGraded: function (k) { graded = k; }, onNext: function () {} });
      const inputs = Array.from(host.querySelectorAll("input.luecke"));
      t("Rechenassistent: Anzahl Inputs === Anzahl Schritte", inputs.length === f.schritte.length);
      inputs.forEach(function (inp) { inp.value = "___falscher_wert___"; });
      pruefenKlicken();
      t("Rechenassistent: onGraded(false)", graded === false);
      const d = diagDetails(host);
      t("Rechenassistent: <details class='diagnose'> vorhanden", !!d);
      t("Rechenassistent: zugeklappt", !!d && d.open === false);
      if (d) {
        t("Rechenassistent: Diagnose nennt Schritt 1", d.textContent.indexOf("Schritt 1") !== -1);
        t("Rechenassistent: Diagnose nennt Sollwert des 1. Schritts", d.textContent.indexOf(String(f.schritte[0].loesung[0])) !== -1);
      }
      t("Rechenassistent: 1. Eingabefeld optisch hervorgehoben (outline var(--rot))",
        inputs[0] && inputs[0].style.outline.indexOf("var(--rot)") !== -1);
    }
  }

  /* ============ 5) Kalkulation — falsch beantwortet (1. Lösungszelle falsch) ============ */
  {
    const f = firstOfType("kalkulation");
    t("Kalkulation: Testfrage aus POOL gefunden", !!f);
    if (f) {
      const host = neuerHost();
      let graded = null;
      w.loeseFrage(f, host, { onGraded: function (k) { graded = k; }, onNext: function () {} });
      const inputs = Array.from(host.querySelectorAll("input.luecke"));
      let erwarteteAnzahl = 0;
      f.zeilen.forEach(function (row) { row.forEach(function (cell) { if (Array.isArray(cell.loesung)) erwarteteAnzahl++; }); });
      t("Kalkulation: Anzahl Inputs === Anzahl Lösungszellen", inputs.length === erwarteteAnzahl);
      inputs.forEach(function (inp) { inp.value = "___falscher_wert___"; });
      pruefenKlicken();
      t("Kalkulation: onGraded(false)", graded === false);
      const d = diagDetails(host);
      t("Kalkulation: <details class='diagnose'> vorhanden", !!d);
      t("Kalkulation: zugeklappt", !!d && d.open === false);
      // erste Lösungszelle row-major ermitteln
      let ersteZelle = null;
      f.zeilen.some(function (row) { return row.some(function (cell) { if (Array.isArray(cell.loesung)) { ersteZelle = cell; return true; } return false; }); });
      if (d && ersteZelle) {
        t("Kalkulation: Diagnose nennt Sollwert der ersten Lösungszelle", d.textContent.indexOf(String(ersteZelle.loesung[0])) !== -1);
      }
      t("Kalkulation: 1. Lösungsfeld optisch hervorgehoben (outline var(--rot))",
        inputs[0] && inputs[0].style.outline.indexOf("var(--rot)") !== -1);
    }
  }

  /* ============ 6) Trace — falsch beantwortet (erste Zelle falsch) ============ */
  {
    const f = firstOfType("trace");
    t("Trace: Testfrage aus POOL gefunden", !!f);
    if (f) {
      const host = neuerHost();
      let graded = null;
      w.loeseFrage(f, host, { onGraded: function (k) { graded = k; }, onNext: function () {} });
      const inputs = Array.from(host.querySelectorAll("input.luecke"));
      const anzSpalten = f.spalten.length;
      t("Trace: Anzahl Inputs === Zeilen × Spalten", inputs.length === f.zeilen.length * anzSpalten);
      inputs.forEach(function (inp) { inp.value = "___falscher_wert___"; });
      pruefenKlicken();
      t("Trace: onGraded(false)", graded === false);
      const d = diagDetails(host);
      t("Trace: <details class='diagnose'> vorhanden", !!d);
      t("Trace: zugeklappt", !!d && d.open === false);
      if (d) {
        t("Trace: Diagnose nennt Zeile 1", d.textContent.indexOf("Zeile 1") !== -1);
        t("Trace: Diagnose nennt Sollwert der ersten Zelle", d.textContent.indexOf(String(f.zeilen[0][0])) !== -1);
      }
      t("Trace: 1. Eingabefeld optisch hervorgehoben (outline var(--rot))",
        inputs[0] && inputs[0].style.outline.indexOf("var(--rot)") !== -1);
    }
  }

  /* ============ 6b) Trace — richtig beantwortet -> KEINE Diagnose ============ */
  {
    const f = firstOfType("trace");
    if (f) {
      const host = neuerHost();
      let graded = null;
      w.loeseFrage(f, host, { onGraded: function (k) { graded = k; }, onNext: function () {} });
      const inputs = Array.from(host.querySelectorAll("input.luecke"));
      const anzSpalten = f.spalten.length;
      f.zeilen.forEach(function (row, r) {
        row.forEach(function (cell, c) { inputs[r * anzSpalten + c].value = String(cell); });
      });
      pruefenKlicken();
      t("Trace richtig: onGraded(true)", graded === true);
      t("Trace richtig: Feedback 'ok' angezeigt", fbVorhanden(host, "ok"));
      t("Trace richtig: KEINE Diagnose angezeigt", !diagDetails(host));
    }
  }

  /* ============ 7) Simulation (opts.simulation=true) -> KEINE Diagnose ============ */
  {
    const f = firstOfType("mc");
    if (f) {
      const host = neuerHost();
      let graded = null;
      w.loeseFrage(f, host, {
        onGraded: function (k) { graded = k; },
        onNext: function () {},
        simulation: true
      });
      const btns = Array.from(host.querySelectorAll("button.opt"));
      const falschBtn = btns.find(function (b) { return b.textContent !== f.optionen[f.loesungIndex]; });
      falschBtn.click();
      pruefenKlicken();
      t("Simulation: onGraded(false) trotzdem korrekt gewertet", graded === false);
      t("Simulation: Feedback weiterhin angezeigt (Wertung unverändert)", fbVorhanden(host, "nein"));
      t("Simulation: KEINE Diagnose angezeigt (opts.simulation=true)", !diagDetails(host));
    }
  }

  /* ============ 8) "Ausführliche Erklärung" weiterhin vorhanden (unverändert) ============ */
  {
    const f = firstOfType("mc");
    if (f) {
      const host = neuerHost();
      w.loeseFrage(f, host, { onGraded: function () {}, onNext: function () {} });
      const btns = Array.from(host.querySelectorAll("button.opt"));
      const falschBtn = btns.find(function (b) { return b.textContent !== f.optionen[f.loesungIndex]; });
      falschBtn.click();
      pruefenKlicken();
      t("'Ausführliche Erklärung' (<details class=lang>) weiterhin vorhanden", !!host.querySelector("details.lang"));
      const langDetail = host.querySelector("details.lang");
      t("'Ausführliche Erklärung' zeigt weiterhin ALLE Distraktor-Erklärungen (unverändert)",
        !!langDetail && (f.distraktorErklaerungen || []).every(function (txt, i) {
          if (i === f.loesungIndex || !txt) return true;
          return langDetail.innerHTML.indexOf(txt) !== -1;
        }));
    }
  }

  /* ============ 9) Alle 12 Routen rendern weiterhin fehlerfrei ============ */
  {
    const routen = ["start", "ueben", "fd", "gen", "netzplan", "gantt", "sim", "glossar", "spickzettel", "serie", "stat", "einst"];
    routen.forEach(function (route) {
      let exc = null;
      try { w.eval('seite=' + JSON.stringify(route) + '; render();'); } catch (e) { exc = e; }
      t("Route '" + route + "' rendert ohne Fehler" + (exc ? " (" + exc.message + ")" : ""), !exc);
    });
  }

  w.close();
  process.exit(report());
}

main().catch(function (e) {
  console.log("FATAL: " + (e && e.stack || e));
  process.exit(1);
});
