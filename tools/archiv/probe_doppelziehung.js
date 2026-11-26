"use strict";
/* =====================================================================================
   tools/probe_doppelziehung.js - Instrumentierung fuer START_PROMPT Punkt 5
   ("URSACHE der doppelten Frage")

   START_PROMPT stand seit dem 30.07.: "Nur mit Instrumentierung im Browser zu klaeren."
   >> DAS WAR FALSCH. Beide Verdachtsfaelle sind in jsdom nachstellbar. Diese Datei ist
   der Beleg und bleibt als Wiederhol-Probe liegen.

   Aufruf (Sandbox):
     NODE_PATH=/tmp/ap1_tooling/node_modules node tools/probe_doppelziehung.js <arbeitskopie>
   <arbeitskopie> ist ein Verzeichnis mit app.html und tests/_m09fixture.js (die echte
   M09-Kategorie ist LEER - istUnterricht filtert auf modul === "M09" - deshalb der Fixture).

   Die Probe SCHREIBT NICHTS ins Projekt und aendert kein Produktverhalten. Sie misst nur.
   ===================================================================================== */
const { JSDOM } = require("jsdom");
const fs = require("fs");
const sleep = ms => new Promise(r => setTimeout(r, ms));
const L = [];
const sag = s => { L.push(s); };

(async () => {
  const W = process.argv[2];
  if (!W) { console.log("Aufruf: node tools/probe_doppelziehung.js <arbeitskopie>"); process.exit(2); }

  const dom = await JSDOM.fromFile(W + "/app.html", {
    runScripts: "dangerously", resources: "usable", pretendToBeVisual: true,
    url: "file://" + W + "/app.html",
    beforeParse(w) {
      w.confirm = () => true; w.alert = () => {};
      Object.defineProperty(w, "localStorage", { configurable: true, value: {
        getItem: () => null, setItem: () => {}, removeItem: () => {}, clear: () => {}, key: () => null, length: 0 } });
    }
  });
  const w = dom.window, D = w.document;
  const bereit = () => typeof w.render === "function" && Array.isArray(w.POOL) && w.POOL.length > 0 && !!D.getElementById("main");
  const bis = Date.now() + 20000;
  while (!bereit() && Date.now() < bis) await sleep(5);
  await sleep(150);
  require(W + "/tests/_m09fixture.js").injiziere(w, 30);
  w.gotoSeite("unterricht"); await sleep(80);

  const btn   = () => D.getElementById("btnAktion");
  const bar   = () => D.querySelector("#main .wischleiste");
  const klick = e => e.dispatchEvent(new w.MouseEvent("click", { bubbles: true }));
  /* Die Wischleiste haengt ihre Handler als Eigenschaften ans Element (ontouchstart/ontouchend).
     Genau darum feuert sie auch dann noch, wenn das Element laengst aus dem DOM ist. */
  const wisch = (b, richtung) => {
    if (!b || !b.ontouchstart) return false;
    const mk = (t, x) => { const e = new w.Event(t, { bubbles: true }); e.changedTouches = [{ clientX: x, clientY: 100 }]; return e; };
    if (richtung === "zurueck") { b.ontouchstart(mk("touchstart", 40)); b.ontouchend(mk("touchend", 220)); }
    else                        { b.ontouchstart(mk("touchstart", 220)); b.ontouchend(mk("touchend", 40)); }
    return true;
  };
  /* Eine Frage WIRKLICH beantworten. _beantwortet von aussen zu setzen genuegt nicht:
     loeseFrage baut den unbeantworteten Zustand jedes Mal neu auf, der Aktionsknopf bleibt
     dann auf "Loesung pruefen" und deaktiviert. Dieser Irrtum hat beim Bauen zwei Laeufe
     lang eine falsche Entwarnung erzeugt. */
  async function beantworte() {
    let v = 0;
    while (w.unterrichtVerlauf[w.unterrichtIdx] && w.unterrichtVerlauf[w.unterrichtIdx].typ !== "mc" && v++ < 40) {
      w.unterrichtZiehe(); await sleep(5);
    }
    const o = D.querySelectorAll("#main button.opt");
    if (!o.length) return false;
    klick(o[0]); await sleep(10); klick(btn()); await sleep(20);
    return !!w.unterrichtVerlauf[w.unterrichtIdx]._beantwortet;
  }

  let n = 0; const orig = w.unterrichtZiehe;
  w.unterrichtZiehe = function () { n++; return orig.apply(this, arguments); };

  /* ---- 1) Verdacht "ein Neu-Rendern zieht ein zweites Mal" ---- */
  n = 0; w.unterrichtRender(); await sleep(20);
  sag("1) unterrichtRender() allein -> Ziehungen=" + n + "   (erwartet 0)");

  let ids = [];
  for (let i = 0; i < 300; i++) { w.unterrichtZiehe(); ids.push(w.unterrichtVerlauf[w.unterrichtIdx].id); }
  let d = 0; for (let k = 1; k < ids.length; k++) if (ids[k] === ids[k - 1]) d++;
  sag("   300 Ziehungen -> benachbarte Dubletten=" + d + "   (erwartet 0)");

  /* ---- 2) Wiedereintritt in die bereits offene Seite ---- */
  const vVor = w.unterrichtVerlauf.length, fVor = w.unterrichtVerlauf[w.unterrichtIdx].id;
  w.gotoSeite("unterricht"); await sleep(60);
  sag("2) gotoSeite('unterricht') auf der bereits offenen Seite: Verlauf " + vVor + " -> " +
      w.unterrichtVerlauf.length + " | " + fVor + " -> " + w.unterrichtVerlauf[w.unterrichtIdx].id +
      (fVor !== w.unterrichtVerlauf[w.unterrichtIdx].id ? "   ANGEZEIGTE FRAGE VERWORFEN" : ""));

  /* ---- 3) Verdacht "Wischleiste und Weiter-Knopf feuern beide" ---- */
  let ok = await beantworte();
  const alteBar = bar();                       // Referenz VOR dem Klick festhalten
  n = 0; const v0 = w.unterrichtVerlauf.length;
  klick(btn()); await sleep(10);               // zieht Frage B, ersetzt das DOM
  const nachKnopf = w.unterrichtVerlauf.length, imDom = D.contains(alteBar);
  wisch(alteBar, "vor"); await sleep(30);      // die abgehaengte Leiste feuert nach
  sag("3) beantwortet=" + ok + " | Knopf: Verlauf " + v0 + " -> " + nachKnopf +
      " | alte Leiste noch im DOM: " + imDom +
      " | danach Nachwisch: -> " + w.unterrichtVerlauf.length + " Ziehungen=" + n +
      "   UEBERSPRUNGEN=" + (w.unterrichtVerlauf.length - v0 - 1));

  /* ---- 4) Gegenprobe: umgekehrte Reihenfolge muss harmlos sein ---- */
  ok = await beantworte();
  const bar2 = bar(); n = 0; const v1 = w.unterrichtVerlauf.length;
  wisch(bar2, "vor"); await sleep(10);
  klick(btn()); await sleep(30);
  sag("4) GEGENPROBE erst Wisch, dann Knopf: Verlauf " + v1 + " -> " + w.unterrichtVerlauf.length +
      " Ziehungen=" + n + "   UEBERSPRUNGEN=" + (w.unterrichtVerlauf.length - v1 - 1) +
      "   (erwartet 0 - setAktion hat _aktionFn laengst neu gebunden)");

  /* ---- 5) Wie eng ist die Kandidatenmenge? ---- */
  sag("5) kandidatenUnterricht() jetzt: " + w.kandidatenUnterricht().length + " von 30 Fixture-Fragen");
  sag("   ACHTUNG Solange hier >1 steht, macht die Doppelziehung aus 3) ein UEBERSPRINGEN, keine Dublette.");
  sag("   Zur Dublette wird sie erst, wenn kandidatenUnterricht() auf <=1 faellt: dann greift in");
  sag("   'var menge = frisch.length ? frisch : basis;' der Rueckfall auf basis - und basis");
  sag("   enthaelt die eben gezeigte Frage. Die Sperre unterrichtLetzteId gibt in genau dem Fall");
  sag("   auf, weil zweit leer ist. NICHT gemessen, aus dem Code gelesen.");

  ids = w.unterrichtVerlauf.map(x => x.id); d = 0;
  for (let k = 1; k < ids.length; k++) if (ids[k] === ids[k - 1]) d++;
  sag("   Verlauf gesamt " + ids.length + " Eintraege, benachbarte Dubletten " + d);

  const ziel = process.env.PROBE_AUS || "/tmp/probe_doppelziehung_out.txt";
  fs.writeFileSync(ziel, L.join("\n") + "\n");
  /* Bewusst in eine Datei: der Testlaeufer filtert stdout, und genau daran ist die Diagnose
     des wackelnden test_unterricht am 24.08. schon einmal fast gescheitert. */
})().catch(e => {
  fs.writeFileSync(process.env.PROBE_AUS || "/tmp/probe_doppelziehung_out.txt",
    L.join("\n") + "\nFEHLER: " + (e && e.stack || e) + "\n");
  process.exit(1);
});
