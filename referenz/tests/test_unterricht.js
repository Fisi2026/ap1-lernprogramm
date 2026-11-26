/* Test: Kategorie „Klausurvorbereitung" (M09, 2026-07-20) – STRIKTE TRENNUNG vom AP1-Pool.

   Die harte Anforderung des Projekts: M09-Fragen duerfen NIE in der allgemeinen Zufallsauswahl
   auftauchen (Ueben, Serie, Simulation), wohl aber im gemeinsamen Fehler-Deck (E-U7) und in der
   Markiert-Liste. Da der echte M09-Pool zum Testzeitpunkt leer sein kann, injizieren die Tests
   synthetische M09-Fragen in den laufenden POOL – so testet die Suite die MECHANIK unabhaengig
   vom Content-Stand und bleibt auch nach Phase 3/4 gueltig. */
"use strict";
const H = require("./_harness.js");
const FIX = require("./_m09fixture.js");

function m09Frage(n, thema) {
  return { id: "M09-" + String(900 + n).slice(-3), pruefungsteil: "AP1", modul: "M09",
    thema: thema || "Testthema", typ: "mc", schwierigkeit: ((n % 4) + 1),
    frage: "Unterrichts-Testfrage " + n + "?",
    optionen: ["richtig", "falsch1", "falsch2", "falsch3"], loesungIndex: 0,
    distraktorErklaerungen: ["", "warum falsch 1", "warum falsch 2", "warum falsch 3"],
    erklaerungKurz: "Testerklaerung." };
}

(async () => {
  const w = await H.boot();

  /* ---- 0. Validierung akzeptiert M09, Modul-Name aufgeloest ---- */
  const v = w.L.validateFragen([m09Frage(1)]);
  H.t("validateFragen akzeptiert modul M09", v.gueltig.length === 1 && v.fehler.length === 0);
  const v2 = w.L.validateFragen([Object.assign(m09Frage(2), { modul: "M10" })]);
  H.t("validateFragen lehnt M10 weiterhin ab", v2.gueltig.length === 0);
  H.t("modulName kennt M09", w.modulName("M09") === "Klausurvorbereitung");
  H.t("istUnterricht erkennt M09 und nur M09",
    w.istUnterricht({ modul: "M09" }) === true && w.istUnterricht({ modul: "M08" }) === false);

  /* ---- Injektion: synthetische M09-Fragen in den laufenden Pool ----
     ⚠️ 2026-08-04, Etappe B der M09-Aufloesung: Der echte M09-Pool ist LEER – die Kategorie
     bleibt fuer die naechste Klausur, ihr Inhalt ist nach M01/M02/M03/M07/M08 umgezogen. Die
     Injektion stand vorher hier im Test und umfasste 8 Fragen EINES Typs mit fest getippten
     Themennamen („Rechtsformen", „Netzplantechnik") – beide sind heute M08- bzw. M01-Themen.
     Sie liegt jetzt in tests/_m09fixture.js: 30 Fragen, sechs Typen, Themen aus L.M09_THEMEN.
     Damit laufen Klausursimulation (25 Fragen), Typwechselsperre (>= 5 Typen) und Themenrunde
     ohne jeden Bezug auf den Content-Stand. */
  const inj = FIX.injiziere(w, 30);
  const injThema = inj[0].thema;
  H.t("Injektion aktiv (Pool enthaelt M09)", w.POOL.some(f => f.modul === "M09"));

  /* ---- 1. passtAP ist die zentrale Sperre ---- */
  H.t("passtAP lehnt M09 ab", inj.every(f => !w.passtAP(f)));
  H.t("passtAP laesst AP1-Fragen weiter durch", w.passtAP({ modul: "M03", pruefungsteil: "AP1" }));

  /* ---- 2. Allgemeine Zufallsauswahl (Ueben): nie M09, auch nicht bei leerer Modulwahl ---- */
  let leck = 0;
  for (let i = 0; i < 500; i++) {
    const ids = w.kandidaten();
    for (const id of ids) if (w.frageById(id) && w.frageById(id).modul === "M09") { leck++; break; }
  }
  H.t("500x kandidaten(): kein einziges M09-Leck", leck === 0);

  /* ---- 3. Simulation: Basis enthaelt nie M09 ---- */
  const exam = w.buildAP1Exam(24);
  const simIds = [];
  // Rueckgabeformat-unabhaengig: alles durchlaufen, was ein modul-Feld traegt
  JSON.stringify(exam, (k, val) => { if (val && val.modul === "M09") simIds.push(val.id); return val; });
  H.t("Simulation (buildAP1Exam) enthaelt kein M09", simIds.length === 0);

  /* ---- 4. Serie: schwaechstesGebiet kann nie M09/M9 liefern (FB-R3: Gebiet statt Modul) ---- */
  H.t("MODULE enthaelt M09 NICHT (bewusst – alle MODULE-Schleifen bleiben sauber)",
    !w.MODULE.some(mm => mm[0] === "M09"));
  H.t("schwaechstesGebiet liefert nie M9 (Klausurvorbereitung ist separat)",
    w.schwaechstesGebiet() !== "M9" && w.schwaechstesGebiet() !== "M09");

  /* ---- 5. Unterrichts-Seite zieht NUR M09 ---- */
  const uIds = w.kandidatenUnterricht();
  H.t("kandidatenUnterricht liefert Fragen", uIds.length > 0);
  H.t("kandidatenUnterricht liefert AUSSCHLIESSLICH M09",
    uIds.every(id => w.frageById(id) && w.frageById(id).modul === "M09"));

  /* ---- 6. Statistik: M09-Antwort zaehlt eigene Statistik, NICHT die AP1-Bereitschaft ---- */
  const vorher = w.L.bereitschaft(w.S.statistik).gesamt.score;
  const zweiGleiches = inj.filter(f => f.thema === injThema);
  H.t("Zwei Fragen desselben Themas fuer die Themen-Statistik vorhanden", zweiGleiches.length >= 2);
  w.verbucheAntwort(zweiGleiches[0], true, {});
  w.verbucheAntwort(zweiGleiches[1], false, {});
  const nachher = w.L.bereitschaft(w.S.statistik).gesamt.score;
  H.t("Bereitschafts-Score unveraendert durch M09-Antworten", vorher === nachher);
  H.t("Eigene M09-Statistik wird geschrieben (Modul-Ebene)",
    w.S.statistik.M09 && w.S.statistik.M09.gesamt === 2 && w.S.statistik.M09.richtig === 1);
  H.t("Eigene M09-Statistik wird geschrieben (Themen-Ebene)",
    w.S.statistik["T:M09:" + injThema] && w.S.statistik["T:M09:" + injThema].gesamt === 2);

  /* ---- 7. Fehler-Deck GEMEINSAM (E-U7): falsche M09-Antwort landet im Deck ---- */
  const falsch = zweiGleiches[1];
  H.t("Falsch beantwortete M09-Frage liegt im gemeinsamen Fehler-Deck", !!w.S.fehlerDeck[falsch.id]);
  const morgen = w.heute() + w.L.TAG_MS;
  const due = w.L.fdDue(w.S.fehlerDeck, morgen);
  H.t("M09-Deck-Eintrag wird faellig wie jeder andere", due.indexOf(falsch.id) >= 0);
  /* Die Due-Injection im NORMALEN Ueben filtert ueber passtAP → M09 wird dort uebersprungen
     (AP1-Fluss bleibt rein), die Deck-SEITE zeigt ihn (filtert nur ueber frageById): */
  H.t("Deck-Seite wuerde den M09-Eintrag zeigen (frageById aufloesbar)", !!w.frageById(falsch.id));

  /* ---- 7b. NEU 2026-07-30: M09-Fehler ist SOFORT wieder faellig, AP1 erst morgen ----
     Vor einer Klausur am naechsten Tag ist ein Erstintervall von 24 h die falsche Einstellung:
     Wer am Vorabend uebt, bekommt seine Fehler erst am Pruefungsmorgen wieder vorgelegt. */
  H.t("M09-Fehler ist noch in derselben Sitzung faellig",
    w.L.fdDue(w.S.fehlerDeck, w.heute()).indexOf(falsch.id) >= 0);
  /* ⚠️ EINEN Zeitpunkt festhalten und ueberall denselben verwenden. Der erste Entwurf rief
     w.heute() zweimal auf: fdOnWrong bekam t1, fdDue verglich gegen ein frueher berechnetes
     `morgen` (= t0 + 1 Tag). Wegen t1 > t0 lag due um wenige Millisekunden HINTER morgen – der
     Test war millisekundenabhaengig und mal gruen, mal rot. */
  const jetzt = w.heute();
  const deckAP1 = w.L.fdOnWrong({}, "AP1-PROBE", jetzt);
  H.t("GEGENPROBE: AP1 behaelt das Erstintervall von 1 Tag",
    w.L.fdDue(deckAP1, jetzt).length === 0 &&
    w.L.fdDue(deckAP1, jetzt + w.L.TAG_MS).length === 1);
  H.t("GEGENPROBE: Streak-Intervalle sind unveraendert (1. Treffer = 3 Tage)",
    (function(){ const d = w.L.fdOnWrong({}, "X", jetzt, 0); w.L.fdOnCorrect(d, "X", jetzt);
      return d["X"].streak === 1 && d["X"].due === jetzt + 3 * w.L.TAG_MS; })());

  /* ---- 7c. NEU 2026-07-30: Typ- und Themenwechsel in der Klausurvorbereitung ----
     kandidatenUnterricht() filtert den zuletzt gezeigten Typ UND das zuletzt gezeigte Thema
     heraus. Vorher zog die Seite mit L.pick() rein zufaellig: gemessen 4,3 % gleicher Typ und
     7,9 % gleiches Thema direkt hintereinander. Der AP1-Fluss hat die Typsperre seit jeher. */
  const m09Alle = w.POOL.filter(w.istUnterricht);
  const typen = {}; m09Alle.forEach(f => typen[f.typ] = 1);
  H.t("Genug Typvielfalt fuer eine Wechselsperre vorhanden", Object.keys(typen).length >= 5);
  w.unterrichtThema = ""; w.unterrichtZuletzt.length = 0;
  w.unterrichtLetzterTyp = m09Alle[0].typ; w.unterrichtLetztesThema = m09Alle[0].thema;
  const kand = w.kandidatenUnterricht().map(id => w.frageById(id));
  H.t("Kandidaten enthalten den zuletzt gezeigten TYP nicht mehr",
    kand.length > 0 && kand.every(f => f.typ !== m09Alle[0].typ));
  H.t("Kandidaten enthalten das zuletzt gezeigte THEMA nicht mehr",
    kand.every(f => f.thema !== m09Alle[0].thema));
  /* GEGENPROBE: Bei gewaehltem Themenfilter darf die THEMEN-Sperre NICHT greifen –
     wer gezielt ein Thema uebt, will genau dieses Thema wiedersehen. */
  w.unterrichtThema = m09Alle[0].thema; w.unterrichtLetztesThema = m09Alle[0].thema;
  const kandGefiltert = w.kandidatenUnterricht().map(id => w.frageById(id));
  H.t("GEGENPROBE: mit Themenfilter bleibt das Thema erhalten",
    kandGefiltert.length > 0 && kandGefiltert.every(f => f.thema === m09Alle[0].thema));
  w.unterrichtThema = ""; w.unterrichtLetzterTyp = null; w.unterrichtLetztesThema = null;

  /* ---- 7d. NEU 2026-07-30: THEMEN-RUNDE - jedes Thema einmal, bevor eines wiederkommt ----
     Gemessen war die Verteilung 3,6-fach schief (Netzplantechnik 9,1 Ziehungen je 60 Aufgaben,
     Aufgabenanalyse 2,5), weil ein Thema mit 16 Fragen viermal so oft gezogen wird wie eines
     mit 4. Mit der Runde: 1,2-fach (min 4,1, max 5,0 bei ideal 4,6). */
  const alleThemen = Array.from(new Set(m09Alle.map(f => f.thema)));
  H.t("M09 hat mehrere Themen (Runde ist sinnvoll)", alleThemen.length >= 5);
  w.unterrichtZuletzt.length = 0; w.unterrichtThema = "";
  w.unterrichtThemenRunde.length = 0;
  /* Alle Themen bis auf EINES als "schon dran" markieren -> es darf nur noch dieses kommen. */
  const uebrig = alleThemen[alleThemen.length - 1];
  alleThemen.slice(0, -1).forEach(t => w.unterrichtThemenRunde.push(t));
  const kandRunde = w.kandidatenUnterricht().map(id => w.frageById(id));
  H.t("Themen-Runde laesst nur noch das offene Thema zu",
    kandRunde.length > 0 && kandRunde.every(f => f.thema === uebrig));
  /* GEGENPROBE 7d-1: Ist die Runde VOLL, wird sie geleert statt den Pool leer zu lassen. */
  w.unterrichtThemenRunde.length = 0;
  alleThemen.forEach(t => w.unterrichtThemenRunde.push(t));
  const kandVoll = w.kandidatenUnterricht();
  H.t("volle Runde wird zurueckgesetzt statt zu blockieren", kandVoll.length > 0);
  H.t("nach dem Zuruecksetzen ist die Runde leer", w.unterrichtThemenRunde.length === 0);
  /* GEGENPROBE 7d-2: Bei gewaehltem Themenfilter greift die Runde NICHT - sonst waere nach der
     ersten Frage kein Kandidat mehr uebrig. */
  w.unterrichtThema = m09Alle[0].thema;
  w.unterrichtThemenRunde.length = 0; w.unterrichtThemenRunde.push(m09Alle[0].thema);
  const kandFilter = w.kandidatenUnterricht().map(id => w.frageById(id));
  H.t("GEGENPROBE: mit Themenfilter ignoriert die Runde das gewaehlte Thema",
    kandFilter.length > 0 && kandFilter.every(f => f.thema === m09Alle[0].thema));
  w.unterrichtThema = ""; w.unterrichtThemenRunde.length = 0;
  w.unterrichtLetzterTyp = null; w.unterrichtLetztesThema = null;

  /* ---- 8. Markiert: markierte M09-Frage bleibt sichtbar ---- */
  w.mutS(s => { s.markiert[inj[2].id] = true; });
  H.t("Markierte M09-Frage erscheint in markierteIds", w.markierteIds().indexOf(inj[2].id) >= 0);

  /* ---- 9. UI: Kachel, Route, Nav, Erklaerung, Tour ---- */
  w.gotoSeite("start");
  await H.sleep(30);
  const tiles = Array.prototype.map.call(w.document.querySelectorAll(".tile .t-titel"), x => x.textContent);
  /* FB-R1.9 (2026-07-21): Der Bereich heisst in der Oberflaeche jetzt „Vorbereitung nächste
     Klausur". Der MODULNAME heisst seit FB-R3 „Klausurvorbereitung" (frueher „Unser Unterricht"), siehe modulName-Test
     weiter oben und die verweis-Angaben im Pool) – beide Namen werden hier bewusst geprueft. */
  H.t("Startseite hat Kachel 'Vorbereitung nächste Klausur'", tiles.indexOf("Vorbereitung nächste Klausur") >= 0);
  w.gotoSeite("unterricht");
  await H.sleep(30);
  const main = w.document.getElementById("main").textContent;
  // Frische Ablesung nach einem Re-Render (const main oben ist eine Momentaufnahme).
  const mainTxt = () => w.document.getElementById("main").textContent;
  H.t("Route #unterricht rendert die Seite (Kicker sichtbar)", main.indexOf("Vorbereitung nächste Klausur") >= 0);
  /* FB-R1.9: eigener Zurueck-Knopf. Gegenprobe im selben Lauf: er muss die Route wirklich
     wechseln, ein blosses Vorhandensein sagt nichts. */
  const zur = w.document.querySelector("#main .unterricht-zurueck");
  H.t("Zurueck-Button im Unterrichtsbereich vorhanden", !!zur);
  if (zur) zur.dispatchEvent(new w.MouseEvent("click", { bubbles: true }));
  await H.sleep(30);
  H.t("Zurueck-Button fuehrt auf die Startseite", w.seite === "start");
  w.gotoSeite("unterricht");
  await H.sleep(30);
  H.t("Erklaerungstext (Abgrenzung) ist auf der Seite", main.indexOf("getrennt") >= 0);
  /* ⚠️ 2026-08-04: Hier stand `main.indexOf("31.07.2026") >= 0` – der Test hat das DATUM geprueft,
     nicht die MECHANIK. Der Termin ist jetzt `KLAUSUR_TERMIN` in app_state.js und `null`, solange
     keiner bekannt ist (Nutzer-Entscheid: Zeile faellt dann ganz weg). Geprueft werden deshalb
     beide Zustaende – ohne Termin keine Zeile, mit Termin der Countdown mit genau diesem Datum.
     Ein Test, der ein Datum festschreibt, faellt an dem Tag, an dem sich der Termin aendert. */
  H.t("Ohne Termin steht keine Countdown-Zeile im Kopf",
    w.KLAUSUR_TERMIN === null && !/Klausur am/.test(mainTxt()));
  const terminAlt = w.KLAUSUR_TERMIN;
  w.KLAUSUR_TERMIN = new Date(w.heute() + 3 * w.L.TAG_MS);
  w.gotoSeite("unterricht");
  await H.sleep(30);
  H.t("Mit Termin erscheint der Countdown mit genau diesem Datum",
    mainTxt().indexOf("Klausur am " + w.KLAUSUR_TERMIN.toLocaleDateString("de-DE")) >= 0 &&
    /noch 3 Tage/.test(mainTxt()));
  w.KLAUSUR_TERMIN = terminAlt;
  w.gotoSeite("unterricht");
  await H.sleep(30);
  H.t("Eigene Statistik der Kategorie sichtbar", main.indexOf("Dein Stand in diesem Bereich") >= 0);
  H.t("Onboarding-Tour enthaelt Unterrichts-Schritt",
    w.ONB_SCHRITTE.some(s => s.t === "Vorbereitung nächste Klausur"));

  /* ---- 9b. Themenlisten: Single Source und Disjunktheit (2026-07-20, Integration Phase 4) ----
     L.M09_THEMEN ist die kanonische Themenliste des Unterrichtsmoduls und wird von
     validate_batch.js, validate_pool.js und tools/validate_schema.js gemeinsam genutzt.
     Sie MUSS disjunkt zu L.THEMA_RELEVANZ bleiben: THEMA_RELEVANZ speist Gewichtung und
     Bereitschafts-Score, aus denen M09 ausgeschlossen ist. Waere ein Thema in beiden Listen,
     bekaeme eine M09-Frage ueber den Themen-Umweg doch ein AP1-Gewicht. */
  H.t("L.M09_THEMEN existiert und ist nicht leer",
    Array.isArray(w.L.M09_THEMEN) && w.L.M09_THEMEN.length > 0);
  H.t("M09-Themen und THEMA_RELEVANZ sind disjunkt",
    w.L.M09_THEMEN.every(t => !(t in w.L.THEMA_RELEVANZ)));

  /* ---- 9c. Deck-Einstreuung auf der Unterrichtsseite (Ausbaustufe 2, 2026-07-20) ----
     Befund vor dem Bau: die Einstreuung in naechsteFrage() filtert ueber passtAP() und schliesst
     M09 aus; die Unterrichtsseite zog ganz ohne Deck. Falsch beantwortete M09-Fragen tauchten
     dadurch von selbst nie wieder auf. dueUnterricht() ist das Gegenstueck – NUR M09. */
  const heuteMs = w.heute();
  /* unterrichtZuletzt leeren: dueUnterricht blendet die letzten 10 gezogenen Fragen aus. Die
     Seitentests oben ziehen echte M09-Fragen, und wenn dabei zufaellig genau inj[3] gezogen
     wurde, faellt der Test unten um. Das ist EINMAL passiert (1 von ~15 Laeufen) – ohne diese
     Zeile ist die Suite flaky, was schlimmer waere als gar kein Test. */
  w.unterrichtZuletzt.length = 0;
  w.mutS(s => { s.fehlerDeck[inj[3].id] = { streak: 0, due: heuteMs - 1000 }; });
  const dueU = w.dueUnterricht();
  H.t("dueUnterricht liefert die faellige M09-Karte", dueU.indexOf(inj[3].id) >= 0);
  H.t("dueUnterricht liefert AUSSCHLIESSLICH M09", dueU.every(id => {
    const fq = w.frageById(id); return fq && fq.modul === "M09";
  }));
  /* Gegenprobe: eine faellige AP1-Karte darf hier NICHT auftauchen (sonst waere die Sperre
     versehentlich in beide Richtungen offen). */
  const apFrage = w.POOL.find(f => f.modul !== "M09");
  w.mutS(s => { s.fehlerDeck[apFrage.id] = { streak: 0, due: heuteMs - 1000 }; });
  H.t("dueUnterricht ignoriert faellige AP1-Karten",
    w.dueUnterricht().indexOf(apFrage.id) === -1);
  /* Der Themenfilter gilt auch fuer Wiedervorlagen. */
  const themaVon3 = w.frageById(inj[3].id).thema;
  w.unterrichtThema = w.L.M09_THEMEN.find(t => t !== themaVon3);
  H.t("Themenfilter gilt auch fuer Wiedervorlagen",
    w.dueUnterricht().indexOf(inj[3].id) === -1);
  w.unterrichtThema = "";

  /* ---- 9d. Einstreuung im gerenderten Fluss ----
     Geprueft wird die Markierung als span.tag mit exakt dem Text „Wiedervorlage" – NICHT per
     textContent der Seite: das Wort steht auch im Erklaerungstext der Unterrichtsseite und ein
     Textsuch-Test waere immer gruen (dieser Irrtum ist beim Bauen einmal passiert).
     Der Takt haengt an unterrichtZaehler; gotoSeite("unterricht") ruft naechste() genau einmal. */
  const marke = () => Array.prototype.some.call(
    w.document.querySelectorAll("#main .meta .tag"), e => e.textContent.trim() === "Wiedervorlage");
  w.mutS(s => { s.fehlerDeck = {}; });
  w.mutS(s => { inj.slice(0, 3).forEach(f => { s.fehlerDeck[f.id] = { streak: 0, due: heuteMs - 1000 }; }); });
  /* ⚠️ 2026-08-04: `unterrichtZuletzt` MUSS hier geleert werden. dueUnterricht() filtert jede ID
     heraus, die in der Sperre der letzten 10 steht – wurde eine der drei Deck-Karten vorher im
     Testlauf gezogen, ist das Deck aus Sicht der Einstreuung leer und die Wiedervorlage bleibt
     aus. Bei 121 M09-Fragen ging das fast immer gut, bei 43 wurde der Test zum Wuerfelspiel:
     zwei Laeufe rot, fuenfzehn gruen. **Eine Pruefung, die wuerfelt, ist keine Pruefung** – und
     die Ursache lag nicht im Produkt, sondern in einem Zustand, den der Test nicht kontrolliert
     hat. Gegenprobe unten: die Sperre selbst wird in Abschnitt 9f weiterhin geprueft. */
  w.unterrichtZuletzt.length = 0;
  /* ⚠️ 2026-08-24 NACHGETRAGEN: `unterrichtLetzteId` MUSS hier EBENFALLS geleert werden.
     Der Fix vom 04.08. hat nur `unterrichtZuletzt` geleert – die Schwestersperre blieb stehen.
     Folge: Zog die Einstreuung genau die Karte, die zuletzt gezeigt worden war, ersetzte die
     Dubletten-Sperre am Ende von unterrichtZiehe() sie durch eine NORMALE Frage – Takt
     verbraucht, keine Wiedervorlage. Gemessen: 2 von 12 bzw. 1 von 20 Läufen rot.
     **Derselbe Fehlertyp wie am 04.08.: ein Zustand, den der Test nicht kontrolliert.**
     ⚠️ Das PRODUKTVERHALTEN dahinter ist damit NICHT behoben – s. BUILD_LOG 24.08. (5). */
  w.unterrichtLetzteId = null;

  w.unterrichtZaehler = w.APP_CONFIG.fdEinstreuung - 1;   // naechste() trifft den Takt
  w.gotoSeite("unterricht");
  await H.sleep(60);
  const gezogen = w.unterrichtZuletzt[w.unterrichtZuletzt.length - 1];
  H.t("Bei passendem Takt kommt eine Wiedervorlage", marke());
  H.t("Die eingestreute Frage stammt aus dem Deck",
    inj.slice(0, 3).some(f => f.id === gezogen));

  w.unterrichtZaehler = 1;                                 // Takt trifft NICHT
  w.gotoSeite("unterricht");
  await H.sleep(60);
  H.t("Ausserhalb des Takts keine Wiedervorlage", !marke());

  w.mutS(s => { s.fehlerDeck = {}; });                     // nichts faellig
  w.unterrichtZaehler = w.APP_CONFIG.fdEinstreuung - 1;
  w.gotoSeite("unterricht");
  await H.sleep(60);
  H.t("Leeres Deck erzeugt keine Wiedervorlage", !marke());

  /* ---- 9d2. Die Dubletten-Sperre darf eine Wiedervorlage NICHT degradieren (24.08.2026) ----
     Bis heute zog die Sperre am Ende von unterrichtZiehe() ihren Ersatz IMMER aus
     kandidatenUnterricht(). Traf die Einstreuung genau die zuletzt gezeigte Karte, wurde aus
     der Wiedervorlage eine normale Frage: Takt verbraucht, `hinweisFD` weg. Jetzt muss zuerst
     eine ANDERE FAELLIGE Karte kommen.
     ⚠️ L.pick wird hier bewusst deterministisch gemacht – sonst wuerde dieser Test wuerfeln,
     und „eine Pruefung, die wuerfelt, ist keine Pruefung" (START_PROMPT Abschnitt 6). */
  const pickOrig = w.L.pick;
  w.L.pick = arr => arr[0];
  w.mutS(s => { s.fehlerDeck = {}; });
  w.mutS(s => { inj.slice(0, 2).forEach(f => { s.fehlerDeck[f.id] = { streak: 0, due: heuteMs - 1000 }; }); });
  w.unterrichtZuletzt.length = 0;
  const faellig = w.dueUnterricht();                       // Reihenfolge steht durch pick fest
  w.unterrichtLetzteId = faellig[0];                       // genau die Karte, die pick zoege
  w.unterrichtZaehler = w.APP_CONFIG.fdEinstreuung - 1;
  w.gotoSeite("unterricht");
  await H.sleep(60);
  const nachSperre = w.unterrichtZuletzt[w.unterrichtZuletzt.length - 1];
  H.t("Sperre degradiert die Wiedervorlage nicht: Markierung bleibt", marke());
  H.t("Sperre weicht auf eine ANDERE faellige Karte aus",
    nachSperre !== faellig[0] && faellig.indexOf(nachSperre) >= 0);
  /* Gegenprobe zur Sperre selbst: mit nur EINER faelligen Karte, die zugleich die letzte ist,
     gibt das Deck keine zweite her – dann MUSS auf normale Kandidaten ausgewichen werden. */
  w.mutS(s => { s.fehlerDeck = {}; });
  w.mutS(s => { s.fehlerDeck[inj[0].id] = { streak: 0, due: heuteMs - 1000 }; });
  w.unterrichtZuletzt.length = 0;
  w.unterrichtLetzteId = inj[0].id;
  w.unterrichtZaehler = w.APP_CONFIG.fdEinstreuung - 1;
  w.gotoSeite("unterricht");
  await H.sleep(60);
  H.t("Einzige faellige Karte == letzte: dann normale Frage statt Wiederholung",
    w.unterrichtZuletzt[w.unterrichtZuletzt.length - 1] !== inj[0].id);
  w.L.pick = pickOrig;
  w.mutS(s => { s.fehlerDeck = {}; });
  w.unterrichtLetzteId = null;
  w.unterrichtZuletzt.length = 0;

  /* ---- 9e. Begriffslexikon ----
     ⚠️ 2026-08-04, Etappe B der M09-Aufloesung: Hier standen fuenf Zusicherungen zum EIGENEN
     M09-Spickzettel (SPICKZETTEL_M09 geladen, Abschnitte == L.M09_THEMEN in beide Richtungen,
     Trennung vom AP1-Blatt, gerenderte Ansicht). Die Kategorie hat ihren Inhalt abgegeben, ihre
     acht Spickzettel-Abschnitte sind in 99_Spickzettel.md aufgegangen (Nutzer-Entscheid: eine
     Quelle statt zwei), und damit sind spickzettel_m09.js, tools/build_spick_m09.py und der Tab
     entfernt. An ihre Stelle tritt die Zusicherung, dass der uebernommene Stoff im AP1-Blatt
     WIRKLICH angekommen ist – sonst waere der Umzug ein stiller Inhaltsverlust gewesen. */
  H.t("M09-Spickzettel ist restlos entfernt (kein SPICKZETTEL_M09 mehr im Fenster)",
    typeof w.SPICKZETTEL_M09 === "undefined");
  ["Gantt-Diagramm", "Wertschöpfung", "Aufgabenanalyse", "Stabsstelle", "Eisenhower",
   "freibleibend", "Bindefristen"].forEach(begriff =>
    H.t("AP1-Spickzettel fuehrt den uebernommenen Stoff: " + begriff,
      w.SPICKZETTEL.indexOf(begriff) >= 0));
  /* Lexikon-Begriffe: jeder gelistete Begriff braucht eine Definition in GLOSSAR_TIPS –
     sonst faellt er in glossarBegriffeView still raus und der Eintrag fehlt unbemerkt. */
  H.t("Jeder M09-Lexikonbegriff hat eine Definition",
    w.GLOSSAR_M09_BEGRIFFE.length > 0 && w.GLOSSAR_M09_BEGRIFFE.every(b => !!w.GLOSSAR_TIPS[b]));

  w.gotoSeite("glossar");
  await H.sleep(60);
  const lex = w.document.getElementById("main").textContent;
  H.t("Begriffslexikon zeigt M09-Begriffe", lex.indexOf("Kommanditist") >= 0);

  /* ---- 9f. M09-Klausur (Ausbaustufe 2, Punkt 4) ----
     Die Klausur nutzt bewusst loeseFrage (Uebungs-Renderer), NICHT renderFrage: letzterer hat nur
     Zweige fuer 5 Typen, womit 75 der 105 M09-Fragen ohne Bedienelemente dagestanden haetten.
     Tragende Idee: alle Fragen werden EINMAL gerendert und nur per display umgeschaltet – dadurch
     ueberlebt der Antwortzustand das Zurueckspringen, ohne dass 21 Typen einzeln eine
     Zustands-Wiederherstellung brauchen. Genau das pruefen die Tests hier. */
  H.t("buildM09Klausur liefert die gewuenschte Anzahl", w.buildM09Klausur(25).length === 25);
  const kl = w.buildM09Klausur(25);
  H.t("Klausur zieht ausschliesslich M09", kl.every(f => f.modul === "M09"));
  H.t("Klausur zieht nur automatisch bewertbare Typen", kl.every(w.m09Bewertbar));
  H.t("Klausur enthaelt keine Dubletten", new Set(kl.map(f => f.id)).size === kl.length);

  w.gotoSeite("unterricht");
  await H.sleep(40);
  const klTab = Array.prototype.slice.call(w.document.querySelectorAll("#main button"))
    .filter(function (b) { return b.textContent.trim() === "Klausur"; })[0];
  H.t("Klausur-Reiter vorhanden", !!klTab);
  klTab.dispatchEvent(new w.MouseEvent("click", { bubbles: true }));
  await H.sleep(50);
  /* Der Zurueck-Knopf aus FB-R1.9 heisst „← Zurück zur Startseite" und wuerde auf /start/i
     ebenfalls anschlagen – er wird hier ausdruecklich ausgeschlossen. */
  const startBtn = Array.prototype.slice.call(w.document.querySelectorAll("#main button"))
    .filter(function (b) { return /start/i.test(b.textContent) && !b.classList.contains("unterricht-zurueck"); })[0];
  H.t("Start-Button vorhanden", !!startBtn);
  startBtn.dispatchEvent(new w.MouseEvent("click", { bubbles: true }));
  await H.sleep(150);
  H.t("Klausur laeuft mit 25 Fragen", !!w.klausur && w.klausur.fragen.length === 25);
  H.t("Alle Fragen sind gerendert, genau eine sichtbar",
    w.klausur.hosts.length === 25 &&
    w.klausur.hosts.filter(function (h) { return h.style.display !== "none"; }).length === 1);
  /* Leak-Schutz AKTIV pruefen: eine Frage wirklich bewerten lassen. Ohne echte Bewertung gibt es
     auch im Uebungsmodus kein Feedback – ein Test ohne diesen Schritt waere immer gruen (dieser
     Fehler ist beim Bauen einmal passiert und erst durch die Gegenprobe aufgefallen). */
  const lueTest = w.POOL.filter(function (f) { return f.modul === "M09" && f.typ === "lueckentext"; })[0];
  const probeHost = w.document.createElement("div");
  w.document.body.appendChild(probeHost);
  let bewertet = false;
  w.loeseFrage(w.L.instanziiere(lueTest), probeHost,
    { klausur: true, onGraded: function () { bewertet = true; }, onNext: function () {} });
  probeHost.querySelectorAll("input").forEach(function (x) { x.value = "definitiv-falsch"; });
  const aktBtn = w.document.getElementById("btnAktion");
  if (aktBtn) aktBtn.dispatchEvent(new w.MouseEvent("click", { bubbles: true }));
  H.t("Klausur-Frage wurde tatsaechlich bewertet (sonst ist der Leak-Test wertlos)", bewertet);
  H.t("Kein Feedback-Kasten nach dem Bewerten in der Klausur",
    probeHost.querySelectorAll(".fb").length === 0);
  H.t("Keine Loesung im Klartext nach dem Bewerten in der Klausur",
    (probeHost.textContent || "").indexOf("Richtige Lösung") === -1);
  /* Gegenprobe im selben Lauf: OHNE klausur-Flag MUSS beides erscheinen. Damit kann der Test
     nicht still gruen werden, wenn der Leak-Schutz einmal wirkungslos wird. */
  const probe2 = w.document.createElement("div");
  w.document.body.appendChild(probe2);
  w.loeseFrage(w.L.instanziiere(lueTest), probe2,
    { simulation: true, onGraded: function () {}, onNext: function () {} });
  probe2.querySelectorAll("input").forEach(function (x) { x.value = "definitiv-falsch"; });
  const aktBtn2 = w.document.getElementById("btnAktion");
  if (aktBtn2) aktBtn2.dispatchEvent(new w.MouseEvent("click", { bubbles: true }));
  H.t("Gegenprobe: ohne Klausur-Flag erscheint das Feedback sehr wohl",
    probe2.querySelectorAll(".fb").length > 0);
  H.t("Gegenprobe: ohne Klausur-Flag steht die Loesung im Klartext",
    (probe2.textContent || "").indexOf("Richtige Lösung") >= 0);

  /* Der Kern: Antwort in einer Eingabe-Frage setzen, quer wegspringen, zurueck – Wert muss stehen. */
  const raster = Array.prototype.slice.call(w.document.querySelectorAll("#main .simgrid button"));
  H.t("Fragen-Raster hat 25 Eintraege", raster.length === 25);
  let mitInput = -1;
  for (let i = 0; i < 25 && mitInput < 0; i++) {
    if (w.klausur.hosts[i].querySelectorAll("input").length) mitInput = i;
  }
  H.t("Mindestens eine Frage mit Eingabefeldern vorhanden", mitInput >= 0);
  raster[mitInput].dispatchEvent(new w.MouseEvent("click", { bubbles: true }));
  await H.sleep(20);
  w.klausur.hosts[mitInput].querySelectorAll("input").forEach(function (x) { x.value = "42"; });
  const werteVor = Array.prototype.map.call(
    w.klausur.hosts[mitInput].querySelectorAll("input"), function (x) { return x.value; }).join("|");
  [24, 3, 11, 0].forEach(function (i) {
    raster[i].dispatchEvent(new w.MouseEvent("click", { bubbles: true }));
  });
  await H.sleep(40);
  raster[mitInput].dispatchEvent(new w.MouseEvent("click", { bubbles: true }));
  await H.sleep(20);
  const werteNach = Array.prototype.map.call(
    w.klausur.hosts[mitInput].querySelectorAll("input"), function (x) { return x.value; }).join("|");
  H.t("Antwort ueberlebt das Zurueckspringen", werteVor.length > 0 && werteVor === werteNach);

  w.klausurAbbrechen();
  H.t("klausurAbbrechen raeumt auf", w.klausur === null);

  /* ---- 10. Regression: bestehende Routen unveraendert ---- */
  const routenSoll = ["start","ueben","unterricht","fd","gen","netzplan","gantt","sim","glossar","spickzettel","stat","einst"];
  const seitenIst = w.SEITEN.map(s => s[0]);
  H.t("Alle bisherigen Nav-Seiten weiterhin vorhanden",
    routenSoll.every(r => r === "unterricht" || seitenIst.indexOf(r) >= 0));
  w.gotoSeite("ueben");
  await H.sleep(30);
  H.t("Ueben-Seite rendert weiterhin", w.document.getElementById("main").children.length > 0);

  process.exit(H.report() ? 1 : 0);
})();
