/* Test: Zurück-Navigation in der Klausurvorbereitung (M09, 2026-07-30, jsdom).
   Vorlage ist tests/test_zurueck.js (AP1-Übungsflow, #52) – dieselben Prüfungen für den zweiten
   Übungsfluss, PLUS den Teil, den der AP1-Flow gar nicht hat:

   ⚠️⚠️ DER EIGENTLICHE PUNKT DIESER SUITE SIND DIE SECHS SPERREN. Die Klausurvorbereitung führt
   seit dem 30.07. sechs Zustände, die die Ziehung steuern (Takt der Wiedervorlage, Deck,
   Sperre der letzten 10, Sperre gegen direkte Wiederholung, Themen-Runde, Typ-/Themenwechsel).
   Würde EINE davon beim Blättern fortgeschrieben, verschöbe sich das Deck durch blosses
   Zurückblättern – ein Fehler, den man beim Üben nie als solchen erkennt, sondern nur als
   „kommt komisch". Deshalb wird jede einzeln gegen das Blättern geprüft und die Gegenprobe
   gleich mit: beim ZIEHEN müssen sie sich bewegen. */
"use strict";
const { t: check, boot, report, sleep } = require("./_harness.js");
const FIX = require("./_m09fixture.js");

(async () => {
  const w = await boot();
  const D = w.document;
  const navHost = () => D.getElementById("unterrichtnav");
  const navTxt = () => (navHost() ? navHost().textContent : "");
  const navBtn = (re) => [].slice.call(D.querySelectorAll("#unterrichtnav button"))
    .find(function (b) { return re.test(b.textContent); });

  function antworteMc() {
    const opt = w.unterrichtQa.querySelector(".opt");
    if (opt) opt.click();
    const btn = D.getElementById("btnAktion");
    if (btn) btn.click();
  }
  // Alle sechs ziehungssteuernden Zustände in EINEM vergleichbaren Abzug.
  function sperrenAbzug() {
    return JSON.stringify({
      zaehler: w.unterrichtZaehler,
      seen: w.S.seenUnterricht,
      zuletzt: w.unterrichtZuletzt,
      letzteId: w.unterrichtLetzteId,
      runde: w.unterrichtThemenRunde,
      letzterTyp: w.unterrichtLetzterTyp,
      letztesThema: w.unterrichtLetztesThema
    });
  }

  /* ⚠️ 2026-08-04, Etappe B der M09-Aufloesung: Der echte M09-Pool ist LEER – die Kategorie
     bleibt fuer die naechste Klausur, ihr Inhalt ist umgezogen. Ohne Fragen rendert die Seite
     „keine Fragen" und hat gar keine Navigationsleiste; diese Suite pruefte damit nichts mehr.
     Die Fragen kommen deshalb aus tests/_m09fixture.js – VOR dem ersten render(), sonst steht
     der Leerzustand schon auf der Seite. Geprueft wird die MECHANIK der sechs Sperren, und die
     haengt nicht am Inhalt. */
  const injiziert = FIX.injiziere(w, 30);
  check("Injektion: M09-Fragen liegen im Pool", injiziert.length >= 30 &&
    w.POOL.filter(function (f) { return f.modul === "M09"; }).length >= 30);

  w.unterrichtTab = "ueben";
  w.seite = "unterricht"; w.render();
  await sleep(60);

  /* ---- 1. Verlauf und Leiste beim Betreten ---- */
  check("Verlauf startet mit 1 Frage (idx 0)", w.unterrichtVerlauf.length === 1 && w.unterrichtIdx === 0);
  check("Navigationsleiste ist da", !!navHost());
  check("← Zurück am Anfang deaktiviert", !!navBtn(/Zurück/) && navBtn(/Zurück/).disabled === true);
  check("Kein Weiter-Button am Ende", !navBtn(/Weiter/));
  check("Zähler zeigt 1 / 1", /Frage 1 \/ 1/.test(navTxt()));

  w.unterrichtZiehe(); const id1 = w.unterrichtVerlauf[1].id;
  w.unterrichtZiehe(); const id2 = w.unterrichtVerlauf[2].id;
  check("Verlauf hat 3 Fragen (idx 2)", w.unterrichtVerlauf.length === 3 && w.unterrichtIdx === 2);
  check("Zähler zeigt 3 / 3", /Frage 3 \/ 3/.test(navTxt()));
  check("Kein Wiederholungs-Hinweis auf der neuesten Frage", !/Wiederholung/.test(navTxt()));

  /* ---- 2. Blättern zeigt exakt dasselbe Frage-Objekt (Variante bleibt erhalten) ---- */
  const abzugVorBlaettern = sperrenAbzug();

  navBtn(/Zurück/).click();
  check("Zurück: idx 1", w.unterrichtIdx === 1);
  check("Zurück zeigt exakt das Frage-2-Objekt", w.unterrichtVerlauf[1].id === id1);
  check("Wiederholungs-Hinweis sichtbar", /Wiederholung/.test(navTxt()));
  navBtn(/Zurück/).click();
  check("Zurück: idx 0", w.unterrichtIdx === 0);
  check("← Zurück jetzt deaktiviert", navBtn(/Zurück/).disabled === true);
  navBtn(/Weiter/).click();
  check("Weiter: idx 1, gleiche Id", w.unterrichtIdx === 1 && w.unterrichtVerlauf[1].id === id1);
  navBtn(/Weiter/).click();
  check("Weiter: idx 2, gleiche Id", w.unterrichtIdx === 2 && w.unterrichtVerlauf[2].id === id2);

  /* ---- 3. DIE SECHS SPERREN: Blättern darf KEINE davon fortschreiben ---- */
  check("Blättern lässt ALLE sechs Sperren unberührt", sperrenAbzug() === abzugVorBlaettern);
  const abz = JSON.parse(abzugVorBlaettern), jetzt = JSON.parse(sperrenAbzug());
  check("Blättern: unterrichtZaehler unverändert", jetzt.zaehler === abz.zaehler);
  check("Blättern: S.seenUnterricht unverändert",
    JSON.stringify(jetzt.seen) === JSON.stringify(abz.seen));
  check("Blättern: unterrichtZuletzt unverändert",
    JSON.stringify(jetzt.zuletzt) === JSON.stringify(abz.zuletzt));
  check("Blättern: unterrichtLetzteId unverändert", jetzt.letzteId === abz.letzteId);
  check("Blättern: unterrichtThemenRunde unverändert",
    JSON.stringify(jetzt.runde) === JSON.stringify(abz.runde));
  check("Blättern: Typ-/Themensperre unverändert",
    jetzt.letzterTyp === abz.letzterTyp && jetzt.letztesThema === abz.letztesThema);

  /* ---- 3b. GEGENPROBE: Ziehen MUSS sie fortschreiben, sonst prüft 3 nichts ---- */
  const zaehlerVor = w.unterrichtZaehler, zuletztVor = w.unterrichtZuletzt.length;
  w.unterrichtZiehe();
  check("Gegenprobe: Ziehen erhöht unterrichtZaehler", w.unterrichtZaehler === zaehlerVor + 1);
  check("Gegenprobe: Ziehen schreibt unterrichtLetzteId fort",
    w.unterrichtLetzteId === w.unterrichtVerlauf[w.unterrichtVerlauf.length - 1].id);
  check("Gegenprobe: Ziehen füllt unterrichtZuletzt",
    w.unterrichtZuletzt.length === Math.min(10, zuletztVor + 1));
  check("Gegenprobe: Ziehen hängt ans Verlaufsende und springt dorthin",
    w.unterrichtIdx === w.unterrichtVerlauf.length - 1);

  /* ---- 4. Buchung: Wiederholung zählt nicht, die live-Frage sehr wohl ---- */
  /* ⚠️ INJEKTION STATT BESTAND (2026-08-04). Bis heute holte sich dieser Abschnitt drei echte
     M09-mc-Fragen aus dem POOL. Nach Etappe A der M09-Aufloesung war genau eine uebrig
     (M09-058), und die Suite brach bei `mcs[1]` mit TypeError ab – ein Testdaten-Problem, das
     wie ein Produktfehler aussah. Testdaten gehoeren in den Test, nicht in den Content-Stand;
     tests/test_unterricht.js haelt es seit jeher so. */
  const mcs = injiziert.filter(function (f) { return f.typ === "mc"; });
  check("Drei M09-mc-Fragen aus der Injektion vorhanden und ueber frageById erreichbar",
    mcs.length >= 3 && mcs.slice(0, 3).every(function (f) { return w.frageById(f.id) === f; }));

  const a = w.L.instanziiere(mcs[0]), b = w.L.instanziiere(mcs[1]);
  w.unterrichtVerlauf = [a, b]; w.unterrichtIdx = 0; w.unterrichtRender();
  const fdVor = Object.keys(w.S.fehlerDeck).length;
  const statVor = JSON.stringify(w.S.statistik);
  antworteMc();
  check("Wiederholung: Fehler-Deck unverändert", Object.keys(w.S.fehlerDeck).length === fdVor);
  check("Wiederholung: Statistik unverändert", JSON.stringify(w.S.statistik) === statVor);

  const c = w.L.instanziiere(mcs[2]); delete c._beantwortet;
  w.unterrichtVerlauf = [c]; w.unterrichtIdx = 0; w.unterrichtRender();
  const statLiveVor = JSON.stringify(w.S.statistik);
  antworteMc();
  check("Live: Statistik verändert (Buchung erfolgt)", JSON.stringify(w.S.statistik) !== statLiveVor);
  check("Live: _beantwortet gesetzt", c._beantwortet === true);
  check("Live: Buchung landet in der M09-Statistik", !!(w.S.statistik.M09 && w.S.statistik.M09.gesamt));
  check("POOL-Objekt bleibt unmutiert (instanziiere liefert Kopie)", mcs[2]._beantwortet === undefined);

  /* ---- 5. Verlauf-Reset (Nutzer-Entscheid 30.07.: wie sUeben) ---- */
  w.render(); await sleep(60);
  check("Neu-Betreten der Seite setzt den Verlauf zurück",
    w.unterrichtVerlauf.length === 1 && w.unterrichtIdx === 0);
  w.unterrichtZiehe(); w.unterrichtZiehe();
  check("Verlauf wächst wieder", w.unterrichtVerlauf.length === 3);
  const sel = D.querySelector("#main select");
  check("Themenfilter ist da", !!sel);
  sel.value = w.L.M09_THEMEN[0]; sel.onchange();
  check("Themenwechsel leert den Verlauf",
    w.unterrichtVerlauf.length === 1 && w.unterrichtIdx === 0);
  check("Themenwechsel wirkt auf die Auswahl", w.unterrichtThema === w.L.M09_THEMEN[0]);
  w.unterrichtThema = "";

  w.seite = "start"; w.render();
  process.exit(report());
})().catch(function (e) { console.log("ABBRUCH:", e); process.exit(1); });
