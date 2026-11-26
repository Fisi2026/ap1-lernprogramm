"use strict";

const LS_KEY = "ap1v2_state";

let ok = 0, fail = 0;

function t(name, bed) {
  if (bed) { ok++; }
  else { fail++; console.log("FEHLER: " + name); }
}

function close(name, actual, expected, eps) {
  eps = eps == null ? 1e-9 : eps;
  t(name + " (ist=" + actual + ", erwartet=" + expected + ", eps=" + eps + ")", Math.abs(actual - expected) <= eps);
}

function within(name, actual, lo, hi) {
  t(name + " (ist=" + actual + ", erwartet in [" + lo + "," + hi + "])", actual >= lo && actual <= hi);
}

function counts() {
  return { ok: ok, fail: fail };
}

function report() {
  console.log("\n" + ok + " OK / " + fail + " FEHLER");
  return fail;
}

function sleep(ms) {
  return new Promise(function (res) { setTimeout(res, ms); });
}

function makeLocalStorageStub(initialObj) {
  const store = {};
  if (initialObj !== undefined) store[LS_KEY] = JSON.stringify(initialObj);
  return {
    getItem: function (k) { return Object.prototype.hasOwnProperty.call(store, k) ? store[k] : null; },
    setItem: function (k, v) { store[k] = String(v); },
    removeItem: function (k) { delete store[k]; },
    clear: function () { Object.keys(store).forEach(function (k) { delete store[k]; }); },
    key: function (i) { return Object.keys(store)[i] || null; },
    get length() { return Object.keys(store).length; },
    _store: store
  };
}

async function boot(preState) {
  const JSDOM = require("jsdom").JSDOM;
  const p = require("path");
  const dom = await JSDOM.fromFile(p.join(__dirname, "app.html"), {
    runScripts: "dangerously",
    resources: "usable",
    pretendToBeVisual: true,
    url: "file://" + __dirname + "/app.html",
    beforeParse(w) {
      w.confirm = function () { return true; };
      w.alert = function () { };
      Object.defineProperty(w, "localStorage", {
        configurable: true,
        value: makeLocalStorageStub(preState)
      });
    }
  });
  /* 2026-07-30: HIER STAND `await sleep(2500)` – EINE PAUSCHALE, KEINE MESSUNG.
     Gemessen (dreimal, mit Polling auf denselben Zustand): die App ist nach 445–486 ms bedienbar,
     POOL vollstaendig, render() funktioniert. Gewartet wurden 2500 ms.
     Im Repo stehen 44 boot()-Aufrufe – das sind ueber 110 s reines Schlafen je vollem Pruefllauf,
     und in der Sandbox mit ihrem 45-s-Fenster kostet das echte Aufrufe. test_state bootet allein
     siebenmal: 18,5 s Laufzeit, davon 17,5 s Warten.
     Gemessen nach der Umstellung (6 jsdom-Suiten, gleiche Parallelitaet): 11757 -> 5965 ms.

     ⚠️ WARUM DIE BEDINGUNG SO STRENG IST: Sie listet ALLES, was die Suiten unmittelbar nach boot()
     anfassen. Eine zu lockere Bedingung waere schlimmer als die alte Pauschale – sie machte den
     Lauf flackernd statt nur langsam, und ein flackernder Test ist wertlos (siehe TASKLIST:
     „Eine Pruefung, die wuerfelt, ist keine Pruefung"). Wer hier ein neues Globalobjekt braucht,
     traegt es in `bereit()` nach.
     ⚠️ DER DECKEL VON 8000 ms IST ABSICHT: Startet die App gar nicht, laeuft es weiter und die
     SUITE faellt mit einer inhaltlichen Meldung. Ein Harness, das haengt, sagt einem nichts.

     ⚠️⚠️ WAS HIER TATSAECHLICH WARTET – GEGENGEPROBT AM 30.07., UND DAS ERGEBNIS UEBERRASCHT:
     Gemessen NACH dem Aufloesen von JSDOM.fromFile (146–183 ms) ist die App noch NICHT bereit;
     es dauert weitere ~292–299 ms. Aber: `bis = Date.now()` (also gar keine Poll-Runde) liess
     test_state trotzdem gruen durchlaufen. Grund ist der Event-Loop – die Startsequenz belegt ihn
     mit dem Auswerten von fragen.js, und ein `await sleep(120)` kann erst danach feuern. **Ein
     einziges `await` genuegt heute, weil der Loop ohnehin erst fertig werden muss.**
     ►► Erst als BEIDES entfernt wurde (Schleife UND sleep), fiel die Suite.
     Die Schleife bleibt also nicht, weil sie heute noetig waere, sondern weil sie die Zusicherung
     EXPLIZIT macht: waechst der Pool oder wird die Maschine langsamer, wartet sie – ein blosses
     `sleep(120)` nicht. **Wer sie entfernt, verlaesst sich auf einen Nebeneffekt.**
     (Reproduzieren: `bash tools/sabotage.sh --datei tests/_harness.js --suite state --alt-datei …`) */
  const w = dom.window;
  const bereit = function () {
    return typeof w.render === "function" && Array.isArray(w.POOL) && w.POOL.length > 0
      && typeof w.L === "object" && typeof w.S === "object" && typeof w.TEXTE === "object"
      && typeof w.APP_CONFIG === "object" && !!w.document.getElementById("main");
  };
  const bis = Date.now() + 8000;
  while (!bereit() && Date.now() < bis) await sleep(10);
  await sleep(120);   // Beruhigung: nachgelagerte Mikrotasks/Timer der Startsequenz
  return dom.window;
}

module.exports = { boot, t, close, within, report, counts, sleep, LS_KEY };
