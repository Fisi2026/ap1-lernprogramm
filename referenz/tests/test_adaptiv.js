/* Node-Testskript: node test_adaptiv.js – G3.2 (#6) Adaptive Schwierigkeit JE THEMA.
   Teil 1 prüft die reine Logik (L.themaKey/L.themaStufe/L.adaptivBuchen): stufenabhängiger Block
   mit Reset, ±1-Regel, Grenzen 1–4, Startwert.
   ⚠️ GEÄNDERT 2026-07-30 (Nutzer-Entscheid): Der Block ist NICHT mehr fest 3, sondern hängt an der
   aktuellen Stufe – aus Stufe 1 genügt EINE richtige Antwort, ab Stufe 2 sind es ZWEI. Anlass war
   der Befund "fast 20 Aufgaben gelöst und es kommen immer noch Anfänger-Aufgaben": Bei 13 Themen
   in M09 und Block 3 brauchte es 39 richtige Antworten, bis jedes Thema einmal aufstieg.
   `adaptivAbSchwelle` musste von 1 auf 0 mitwandern, sonst hätte EIN Fehler von zwei abgestuft –
   bei Block 3 stuften erst ZWEI Fehler ab. Teil 2 prüft die App-Anbindung in jsdom: stufeFuer()
   (Automatik vs. manuelle Übersteuerung), den Filter in kandidaten() samt Pool-Fallback und
   dass verbucheAntwort() die Themen-Stufe fortschreibt. */
"use strict";
const H = require("./_harness.js");
const L = require("./logik.js");

/* ================= Teil 1: reine Logik ================= */

/* ---- themaKey ---- */
H.t("themaKey verbindet Modul und Thema", L.themaKey("M03", "OSI-Modell") === "M03|OSI-Modell");
H.t("themaKey ist robust gegen undefined", typeof L.themaKey(undefined, undefined) === "string");

/* ---- themaStufe: Startwert und Grenzen ---- */
H.t("unbekanntes Thema startet auf dem Startwert", L.themaStufe({}, "M01|X", 3) === 3);
H.t("unbekanntes Thema ohne Startwert -> LEVEL_MIN", L.themaStufe({}, "M01|X") === L.LEVEL_MIN);
H.t("bekannte Stufe wird gelesen", L.themaStufe({ "M01|X": 4 }, "M01|X", 1) === 4);
H.t("Stufe wird nach oben gekappt", L.themaStufe({ "M01|X": 9 }, "M01|X", 1) === L.LEVEL_MAX);
H.t("Stufe wird nach unten gekappt", L.themaStufe({ "M01|X": -3 }, "M01|X", 1) === L.LEVEL_MIN);
H.t("kaputter Wert fällt auf den Startwert zurück", L.themaStufe({ "M01|X": "abc" }, "M01|X", 2) === 2);
H.t("themaStufe verträgt fehlendes levels-Objekt", L.themaStufe(null, "M01|X", 2) === 2);

/* ---- Blockgröße hängt an der Stufe ---- */
H.t("Block bei Stufe 1 (Anfänger) = 1", L.blockFuerStufe(1) === 1);
H.t("Block bei Stufe 2 = 2", L.blockFuerStufe(2) === 2);
H.t("Block bei Stufe 3 = 2", L.blockFuerStufe(3) === 2);

/* ---- aus Stufe 1 genügt EINE richtige Antwort (Nutzer-Entscheid 30.07.) ---- */
{
  const lv = {}, tr = {}, k = "M03|Netz";
  const r = L.adaptivBuchen(lv, tr, k, true, 1);
  H.t("Stufe 1 + 1x richtig -> Stufe 2", lv[k] === 2);
  H.t("Rückgabewert nennt die neue Stufe", r.stufe === 2);
  H.t("Block ist nach dem Aufstieg leer", tr[k].length === 0);
}
{
  const lv = {}, tr = {}, k = "M03|Netz";
  L.adaptivBuchen(lv, tr, k, false, 1);
  H.t("Stufe 1 + falsch -> bleibt 1 (LEVEL_MIN)", lv[k] === 1);
}

/* ---- ab Stufe 2 werten zwei Antworten ---- */
{
  const lv = {}, tr = {}, k = "M03|Netz";
  L.adaptivBuchen(lv, tr, k, true, 2);
  H.t("Stufe 2, nach 1 Antwort: Stufe unverändert", lv[k] === 2);
  H.t("Stufe 2, nach 1 Antwort: Block hat 1 Eintrag", tr[k].length === 1);
  L.adaptivBuchen(lv, tr, k, true, 2);
  H.t("2/2 richtig -> Stufe +1", lv[k] === 3);
  H.t("Block wird nach der Auswertung geleert", tr[k].length === 0);
}
{
  const lv = {}, tr = {}, k = "M03|Netz";
  [true, false].forEach(r => L.adaptivBuchen(lv, tr, k, r, 2));
  H.t("1/2 richtig -> Stufe bleibt (EIN Fehler stuft nicht ab)", lv[k] === 2);
  H.t("auch bei 1/2 wird der Block geleert", tr[k].length === 0);
}
{
  const lv = {}, tr = {}, k = "M03|Netz";
  [false, false].forEach(r => L.adaptivBuchen(lv, tr, k, r, 3));
  H.t("0/2 richtig -> Stufe -1", lv[k] === 2);
}

/* ---- Grenzen werden auch beim Buchen eingehalten ---- */
{
  const lv = { "M01|A": L.LEVEL_MAX }, tr = {};
  [true, true, true, true].forEach(r => L.adaptivBuchen(lv, tr, "M01|A", r, 1));
  H.t("auf LEVEL_MAX geht es nicht weiter hoch", lv["M01|A"] === L.LEVEL_MAX);
}
{
  const lv = { "M01|A": L.LEVEL_MIN }, tr = {};
  [false, false, false, false].forEach(r => L.adaptivBuchen(lv, tr, "M01|A", r, 1));
  H.t("auf LEVEL_MIN geht es nicht weiter runter", lv["M01|A"] === L.LEVEL_MIN);
}

/* ---- höchstens EINE Stufenänderung je Block (kein gleitendes Fenster) ---- */
{
  const lv = {}, tr = {}, k = "M02|B";
  /* Start 1: 1. Antwort -> Stufe 2 (Block 1). Danach Block 2: die 2. und 3. Antwort
     ergeben Stufe 3. Die 4. Antwort eröffnet den nächsten Block. */
  [true, true, true, true].forEach(r => L.adaptivBuchen(lv, tr, k, r, 1));
  H.t("4 richtige aus Stufe 1 -> Stufe 3, nicht 4", lv[k] === 3);
  H.t("Rest-Block enthält die überzählige 1 Antwort", tr[k].length === 1);
  L.adaptivBuchen(lv, tr, k, true, 1);
  H.t("mit der 5. Antwort wird der Block fällig -> +1", lv[k] === 4);
}

/* ---- Themen sind voneinander unabhängig ---- */
{
  const lv = {}, tr = {};
  [true, true].forEach(r => L.adaptivBuchen(lv, tr, "M03|Netz", r, 2));
  [false, false].forEach(r => L.adaptivBuchen(lv, tr, "M03|Sicherheit", r, 2));
  H.t("Thema A steigt", lv["M03|Netz"] === 3);
  H.t("Thema B sinkt", lv["M03|Sicherheit"] === 2 - 1);
  H.t("beide Themen existieren getrennt", Object.keys(lv).length === 2);
}

/* ---- CONFIG-Werte sind die vereinbarten ---- */
H.t("adaptivBlock = 2", L.CONFIG.adaptivBlock === 2);
H.t("adaptivBlockStufe1 = 1", L.CONFIG.adaptivBlockStufe1 === 1);
H.t("adaptivAbSchwelle = 0", L.CONFIG.adaptivAbSchwelle === 0);
/* GEGENPROBE: Der Aufstieg muss messbar schneller sein als mit dem alten Dreierblock.
   Ohne diese Probe wäre die Änderung nur behauptet. */
{
  let n1 = 0, lv = {}, tr = {};
  while (L.themaStufe(lv, "M09|Z", 1) < 2 && n1 < 50) { L.adaptivBuchen(lv, tr, "M09|Z", true, 1); n1++; }
  H.t("aus Stufe 1 reicht GENAU eine richtige Antwort", n1 === 1);
  let n2 = 0, lv2 = {}, tr2 = {};
  while (L.themaStufe(lv2, "M09|Z", 1) < 4 && n2 < 50) { L.adaptivBuchen(lv2, tr2, "M09|Z", true, 1); n2++; }
  H.t("von Stufe 1 auf 4 sind es 5 richtige Antworten (vorher 9)", n2 === 5);
}

/* ================= Teil 2: App-Anbindung (jsdom) ================= */
(async () => {
  const w = await H.boot();

  H.t("State kennt themaLevel", w.S.themaLevel && typeof w.S.themaLevel === "object");
  H.t("State kennt themaTrack", w.S.themaTrack && typeof w.S.themaTrack === "object");
  H.t("Default-Modus ist 'auto'", w.S.levelModus === "auto");
  H.t("stufeFuer ist vorhanden", typeof w.stufeFuer === "function");
  H.t("zeigeLevelDialog ist entfernt", typeof w.zeigeLevelDialog === "undefined");

  const f = w.POOL.find(x => x.thema && x.modul);
  const key = w.L.themaKey(f.modul, f.thema);

  /* ---- stufeFuer: Automatik nutzt die Themen-Stufe ---- */
  w.S.themaLevel[key] = 4;
  H.t("stufeFuer liest im Automatik-Modus die Themen-Stufe", w.stufeFuer(f) === 4);

  const unbekannt = { modul: "M99", thema: "gibt es nicht" };
  H.t("stufeFuer nutzt bei unbekanntem Thema S.level als Start", w.stufeFuer(unbekannt) === w.S.level);

  /* ---- stufeFuer: manueller Modus übersteuert ---- */
  w.S.levelModus = "manuell"; w.S.level = 2;
  H.t("manueller Modus übersteuert die Themen-Stufe", w.stufeFuer(f) === 2);
  w.S.levelModus = "auto"; w.S.level = 1;

  /* ---- kandidaten(): harter Filter je Thema ---- */
  w.S.gebiete = []; w.S.themen = []; w.S.themaLevel = {};   // FB-R3 Etappe 2: Auswahl über gebiete/themen (leer = alle)
  const idsStufe1 = w.kandidaten();
  H.t("kandidaten() liefert im Grundzustand nur Stufe-1-Fragen",
    idsStufe1.length > 0 && idsStufe1.every(id => w.frageById(id).schwierigkeit === 1));

  /* Ein einzelnes Thema hochstufen -> dessen Stufe-1-Fragen fallen raus, Stufe-3-Fragen kommen rein */
  const themaMit3 = w.POOL.find(x => x.schwierigkeit === 3 && x.thema && x.modul);
  if (themaMit3) {
    const k3 = w.L.themaKey(themaMit3.modul, themaMit3.thema);
    w.S.themaLevel = {}; w.S.themaLevel[k3] = 3;
    const ids = w.kandidaten();
    H.t("hochgestuftes Thema liefert seine Stufe-3-Fragen", ids.indexOf(themaMit3.id) >= 0);
    /* ⚠️ NUTZER-ENTSCHEID 09.09.2026: aufStufeFiltern nimmt die Stufe DARUNTER dazu, solange
       das Thema auf seiner Stufe weniger als L.CONFIG.stufeMinKandidaten Fragen hat. Hier stand
       bis dahin exakte Gleichheit; sie war die Ursache dafuer, dass Stufe 4 2,8-fach ueberzogen
       und Stufe 3 nur halb so oft gezogen wurde wie ihr Pool-Anteil (BEFUNDE_LERNFLUSS.md).
       ⛔ GEPRUEFT WIRD JETZT ZWEIERLEI, und das zweite ist das schaerfere:
         (a) keine Frage liegt UEBER der Stufe ihres Themas - nach oben wird NIE ergaenzt;
         (b) unter der Stufe liegt eine Frage nur dann, wenn ihr Thema auf der eigenen Stufe
             tatsaechlich knapp ist. Ohne (b) wuerde der Test jede Aufweichung durchwinken. */
    H.t("keine gezogene Frage liegt ueber der Stufe ihres Themas",
      ids.every(id => { const q = w.frageById(id); return q.schwierigkeit <= w.stufeFuer(q); }));
    const minN = w.L.CONFIG.stufeMinKandidaten;
    H.t("unter der Themenstufe wird nur bei Knappheit ergaenzt",
      ids.every(id => {
        const q = w.frageById(id), st = w.stufeFuer(q);
        if (q.schwierigkeit === st) return true;
        const aufStufe = w.POOL.filter(x => x.modul === q.modul && x.thema === q.thema &&
          x.schwierigkeit === st).length;
        return aufStufe < minN;
      }));
    /* ⚠️ Gilt nur, solange das Thema auf Stufe 3 nicht knapp ist - sonst ist das Nachruecken
       der Stufe 2 (und erst danach der Stufe 1) genau das gewollte Verhalten. */
    const aufDrei = w.POOL.filter(q => q.modul === themaMit3.modul &&
      q.thema === themaMit3.thema && q.schwierigkeit === 3).length;
    H.t("Fragen desselben Themas auf Stufe 1 sind jetzt draußen (Thema nicht knapp)",
      aufDrei < w.L.CONFIG.stufeMinKandidaten ||
      !w.POOL.some(q => q.modul === themaMit3.modul && q.thema === themaMit3.thema &&
        q.schwierigkeit === 1 && ids.indexOf(q.id) >= 0));
  } else {
    H.t("Stufe-3-Frage im Pool gefunden", false);
    H.t("(übersprungen)", false);
    H.t("(übersprungen)", false);
  }

  /* ---- Fallback: passt gar nichts, kommt der ganze (gefilterte) Pool ---- */
  w.S.themaLevel = {}; w.S.gebiete = []; w.S.themen = [];   // FB-R3 Etappe 2
  const alleAufUnmoegliche = {};
  w.POOL.forEach(q => { if (q.thema && q.modul) alleAufUnmoegliche[w.L.themaKey(q.modul, q.thema)] = 4; });
  w.S.themaLevel = alleAufUnmoegliche;
  const mitFallback = w.kandidaten();
  H.t("Fallback: kandidaten() ist nie leer, solange der Pool passt", mitFallback.length > 0);
  w.S.themaLevel = {};

  /* ---- verbucheAntwort schreibt die Themen-Stufe fort ---- */
  {
    w.S.levelModus = "auto"; w.S.level = 2; w.S.themaLevel = {}; w.S.themaTrack = {};
    const q = w.POOL.find(x => x.thema && x.modul);
    const kq = w.L.themaKey(q.modul, q.thema);
    w.verbucheAntwort(q, true, { keinFehlerDeck: true });
    H.t("verbucheAntwort legt den Block an", w.S.themaTrack[kq].length === 1);
    H.t("nach 1 Antwort bleibt die Stufe beim Startwert 2", w.S.themaLevel[kq] === 2);
    /* ⚠️ 2026-07-30: Ab Stufe 2 ist der Block 2 - die ZWEITE Antwort stuft hoch und leert.
       Vorher standen hier drei Aufrufe; der dritte hat den naechsten Block schon wieder
       gefuellt, weshalb "Block leer" fehlschlug. */
    w.verbucheAntwort(q, true, { keinFehlerDeck: true });
    H.t("verbucheAntwort stuft nach 2/2 hoch", w.S.themaLevel[kq] === 3);
    H.t("verbucheAntwort leert den Block", w.S.themaTrack[kq].length === 0);
  }

  /* ---- manueller Modus bucht keine Themen-Stufe ---- */
  {
    w.S.levelModus = "manuell"; w.S.level = 2; w.S.themaLevel = {}; w.S.themaTrack = {};
    const q = w.POOL.find(x => x.thema && x.modul);
    const kq = w.L.themaKey(q.modul, q.thema);
    w.verbucheAntwort(q, true, { keinFehlerDeck: true });
    w.verbucheAntwort(q, true, { keinFehlerDeck: true });
    w.verbucheAntwort(q, true, { keinFehlerDeck: true });
    H.t("im manuellen Modus bleibt themaLevel unberührt", w.S.themaLevel[kq] === undefined);
    H.t("im manuellen Modus bleibt themaTrack unberührt", w.S.themaTrack[kq] === undefined);
    w.S.levelModus = "auto";
  }

  process.exit(H.report() ? 1 : 0);
})();
