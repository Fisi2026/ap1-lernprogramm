/* Test #42: DIDAKTIK-WAECHTER (Qualitaetsrunde Q1, Etappe 0, 2026-07-27).
   Vier Waechter ueber den POOL – kein jsdom, kein DOM. Grundlage: PRUEFBERICHT_2026-07-26.md,
   Plan: PLAENE.md „GESAMTPLAN QUALITAETSRUNDE Q1", Etappe 0.

   ⚠️ WOZU DIESE SUITE DA IST: Sie prueft NICHT, ob der Code funktioniert, sondern ob der Pool
   didaktisch nicht schlechter wird. Alle vier Werte sind RATSCHEN: Die Schwelle steht auf dem
   heute gemessenen Istwert (+ Puffer) und wird nach jedem geprueften Modul GESENKT. Sie darf
   NIE angehoben werden, um einen Lauf gruen zu bekommen – dann waere der Waechter wertlos.

   ⚠️ DIE SCHWELLEN STEHEN HIER ALS KONSTANTEN, NICHT IN sollwerte.env.
   sollwerte.env enthaelt Test-ANZAHLEN (wie viele Zusicherungen eine Suite fahren muss), nicht
   inhaltliche Messwerte. Wer eine Schwelle senkt, aendert NUR die Konstante unten – die Zahl der
   Zusicherungen bleibt gleich, sollwerte.env wird dabei NICHT angefasst.

   GRUNDSATZ WIE IN ALLEN VORRUNDEN: jeder Waechter hat seine GEGENPROBE IM SELBEN LAUF. Die
   Gegenproben laufen gegen kleine, von Hand gebaute Mini-Pools – so beweist der Lauf selbst, dass
   die Messfunktion anschlaegt, wenn sie soll, und schweigt, wenn sie nicht soll. */
"use strict";
const H = require("./_harness.js");
const FRAGEN = require("./fragen.js");
const ABK = require("./abkuerzungen.js");
/* ⚠️ DIE FALL-TEILAUFGABEN GEHOEREN IN DIE LAENGENMESSUNG.  (B80/B83, 27.08.2026)
   Diese Suite las bis heute ausschliesslich fragen.js - genau wie pool_query.js. Als die
   Faelle zum ersten Mal mitgemessen wurden, standen dort ZEHN VON VIERZEHN mc-Teilaufgaben
   mit dem Tell (71 %), waehrend der Fragenpool bei 2,09 % lag. Die Faelle waren nie Teil der
   Ratsche und standen deshalb noch auf dem Stand VOR der Qualitaetsrunde Q1.
   ►► Ein Waechter, der einen Teil des Bestands nicht liest, meldet gruen ueber ein Gebiet,
      das er nie betreten hat. Das war an einem Tag der vierte Fall dieser Klasse.
   ⚠️ NUR DIE BEIDEN LAENGENMASSE lesen BESTAND. Stufenluecken und Gebietsanteile bleiben auf
   FRAGEN: Fall-Teilaufgaben haben kein Feld `gebiet`, und ihre Schwierigkeit gehoert zum Fall,
   nicht zu einem Feinthema des Moduls. Wer ein weiteres Mass ergaenzt, entscheidet bewusst. */
const FAELLE = require("./faelle.js");
const FALLTEILE = [];
FAELLE.forEach(fall => {
  (fall.teilaufgaben || []).forEach((t, i) => {
    FALLTEILE.push(Object.assign({}, t, { id: fall.id + "-t" + (i + 1), modul: fall.modul }));
  });
});
const BESTAND = FRAGEN.concat(FALLTEILE);
/* Bestandsentscheide zum Laengenverhaeltnis – dieselbe Datei liest tools/apply_batch.py.
   ⚠️ Sie muss von check.sh flach ins Arbeitsverzeichnis kopiert werden (fuelle_work). */
const KONF = require("./laengen_ausnahmen.json");
const AUSN = KONF.ausnahmen;

/* ══════════════ SCHWELLEN (RATSCHE – nur senken, nie anheben) ══════════════ */

/* 1) Anteil der mc-Fragen, bei denen die richtige Option die laengste ist.
      Istwert 26.07./27.07.2026: 210 von 274 = 76,6 %. Zufallserwartung bei 4 Optionen: 25 %.
      Startschwelle war 78 % = Istwert + Puffer, damit der Waechter ab sofort jede Verschlechterung
      stoppt. NACH JEDEM GEPRUEFTEN MODUL auf den neuen Istwert + 1 Punkt senken.
      ZIELWERT AM ENDE DER QUALITAETSRUNDE (nach Etappe 3): 45.
      RATSCHENSTAND (Grundmenge in Klammern – sie aendert sich einmal, siehe unten):
        27.07. Etappe 0  ................ 76,6 % (210/274) → Schwelle 78
        27.07. M06-304 auf ECDHE ........ 76,3 % (209/274)
        27.07. Etappe 1, M05 geprueft ... 69,7 % (191/274) → Schwelle 71
        27.07. Kurzoptionen ausgenommen . 72,7 % (178/245)   ⚠️ NUR REGELWECHSEL, KEINE AENDERUNG
                                                              AM POOL – der Nenner schrumpfte.
        27.07. Etappe 1, M06 geprueft ... 63,7 % (156/245) → Schwelle 65
        27.07. Etappe 1, M04 geprueft ... 50,6 % (124/245) → Schwelle 52
        27.07. Etappe 4, 44 neue Fragen . 45,6 % (124/272) → Schwelle 47
      ⚠️ Auffaelligkeit der drei Module: M04 32 von 36 (88,9 %) · M05 18 von 21 (85,7 %) ·
      M06 25 von 36 (69,4 %). Entschaerft wurden ausschliesslich die DISTRAKTOREN, keine einzige
      richtige Antwort wurde gekuerzt.
      ⚠️ **DER LETZTE SCHRITT KAM NICHT AUS EINER KORREKTUR, SONDERN AUS DEM NENNER.** Die
      44 Einstiegsfragen der Etappe 4 brachten 27 neue mc-Fragen, von denen KEINE den Tell hat –
      der Zaehler blieb bei 124, die Grundmenge wuchs von 245 auf 272. Das ist eine echte
      Verbesserung des Pools (die neuen Fragen sind von Anfang an ausgeglichen), aber es hat KEINE
      der 124 verbleibenden Altlasten beseitigt. Die liegen weiter in den Modulen der ETAPPE 3
      (M01, M02, M03, M07, M08) und muessen dort einzeln angefasst werden.
      ⚠️ Das Ziel 45 % ist damit fast erreicht – **es darf aber nicht durch weiteres Hinzufuegen
      erreicht werden.** Wer neue Fragen schreibt, senkt den Anteil, ohne eine einzige schlechte
      Frage zu verbessern. Die Etappe-3-Module bleiben faellig. */
/* ⚠️⚠️ STAND 27.07. NACH ETAPPE 5: 124 von 283 = 43,8 %. Das Ziel 45 % ist damit RECHNERISCH
   unterschritten – und genau deshalb steht hier eine Warnung statt eines Hakens:
   **DER ZAEHLER STEHT SEIT ETAPPE 1 UNVERAENDERT BEI 124.** Gesunken ist allein der Nenner
   (272 → 283), weil Etappe 4 und 5 zusammen 62 saubere Fragen hinzugefuegt haben.
   Es wurde seit Etappe 1 keine einzige schlechte Bestandsfrage verbessert.
   Die Schwelle geht deshalb nur auf 45,0 – tiefer LAESST der Test es nicht zu, weil die
   Zusicherung `SCHWELLE >= ZIEL` sonst faellt. Das ist Absicht: Die Ratsche soll hier stehen
   bleiben, bis ETAPPE 3 die 124 Altlasten in M01/M02/M03/M07/M08 einzeln anfasst.
   Nutzer-Entscheid 27.07.: Ziel bleibt bei 45, Schwelle auf 45. */
/* ✅✅ STAND 27.07. NACH ETAPPE 3 / TEIL M01: **114 von 285 = 40,0 %.**
   **ZUM ERSTEN MAL SEIT ETAPPE 1 IST DER ZAEHLER GESUNKEN – 124 → 114.** Nicht der Nenner hat
   sich bewegt (er blieb bei 285), sondern es wurden zehn Altlasten in M01 tatsaechlich entschaerft:
   M01-001, M01-004, M01-009, M01-010, M01-011, M01-017, M01-102, M01-103, M01-109, M01-112.
   Bei allen zehn wurden AUSSCHLIESSLICH die Distraktoren verlaengert, keine einzige richtige
   Antwort gekuerzt; jede hat jetzt mindestens einen Distraktor ueber der richtigen Antwort
   (Verhaeltnis 1,01 bis 1,28).
   ⚠️ **IN M01 SIND NOCH 13 VON 23 OFFEN**, dazu die Altlasten in M02/M03/M07/M08. */
/* ✅✅ STAND 27.07. NACH ETAPPE 3 / M01 KOMPLETT: **102 von 285 = 35,8 %.**
   Zwoelf weitere M01-Altlasten entschaerft: M01-116, -118, -119, -120, -201, -203, -601, -731,
   -732, -734, -770, -771. Nenner unveraendert 285 – wieder echte Korrektur, keine Verduennung.
   Damit sind **22 von 23 M01-Treffern** erledigt; M01 stellt nur noch einen.
   ⚠️ **DER 23. TREFFER M01-117 BLEIBT ABSICHTLICH STEHEN** (Nutzer-Entscheid 27.07.): Die vier
   Optionen sind reine Rechenterme, der Abstand betraegt 2 Zeichen (35 gegen 33). Genau dafuer gibt
   es MIN_OPTIONSLAENGE – die Ausnahme greift hier nur deshalb nicht, weil die laengste Option mit
   35 Zeichen ueber der Schwelle 25 liegt. **Formal ein Treffer, didaktisch keiner.** Wer
   MIN_OPTIONSLAENGE je anfasst, findet hier den gemessenen Grenzfall.
   ⚠️ **SCHWELLE UND ZIEL BLEIBEN BEI 45** – tiefer laesst es die Zusicherung `SCHWELLE >= ZIEL`
   nicht zu, und das Ziel zu senken ist ein NUTZER-ENTSCHEID, der noch aussteht. Erst wenn Etappe 3
   durch ist, lohnt sich ein neuer Zielwert. */
/* ✅✅ STAND 27.07. NACH ETAPPE 3 / M02 KOMPLETT: **80 von 285 = 28,1 %.**
   Alle 22 M02-Altlasten entschaerft, M02 stellt keinen Treffer mehr. Nenner unveraendert 285.
   Gesamtbilanz der Qualitaetsrunde bisher: **124 → 102 → 80**, ohne eine einzige neue Frage.
   ⚠️ **LEHRE AUS BEIDEN MODULEN: ERST INHALT, DANN LAENGEN.** Die vorab notierten Faktoren waren
   nach dem Inhaltslauf jedes Mal ueberholt – in M02 hatte sich einer der 22 Treffer durch einen
   inhaltlichen Neubau von selbst erledigt, drei weitere Faktoren hatten sich verschoben.
   ⚠️ **GLEICHSTAND ZAEHLT ALS TREFFER** (`len[i] === max`). M02-304 und M02-306 standen auf exakt
   1,00 x und galten damit als Tell. Ein Distraktor muss STRIKT laenger sein.
   ⚠️ **DIE SCHWELLE IST JETZT WEIT VOM ISTWERT ENTFERNT (45 gegen 28,1).** Sie schuetzt damit
   nicht mehr gegen Verschlechterung. Das Nachziehen ist der Nutzer-Entscheid, der am Ende von
   Etappe 3 ansteht – bis dahin bleibt sie bewusst stehen. */
/* ✅✅ STAND 27.07. NACH ETAPPE 3 / M03 KOMPLETT: **47 von 285 = 16,5 %.**
   M03 von 36 auf 3 Treffer. Gesamtbilanz der Qualitaetsrunde: **124 → 102 → 80 → 47**, ohne eine
   einzige neue Frage. Offen sind nur noch M07 (21) und M08 (18) sowie 4 in M09.
   ⛔ **VIER TREFFER BLEIBEN DAUERHAFT STEHEN – NUTZER-ENTSCHEIDE, NICHT ERNEUT VORTRAGEN:**
   M01-117 (reine Rechenterme, 2 Zeichen Abstand), M03-001 und M03-002 (reine Fachbegriffe:
   "Router" 6 Zeichen gegen "Glasfaserkabel (Lichtwellenleiter/LWL)" 38) und M03-020 (die Laenge
   steckt im ausgeschriebenen Eigennamen "BITV (Barrierefreie-Informationstechnik-Verordnung)").
   Das sind genau die Faelle, fuer die MIN_OPTIONSLAENGE gedacht ist – sie greift nur deshalb
   nicht, weil die LAENGSTE Option ueber der Schwelle 25 liegt. **Wer MIN_OPTIONSLAENGE je
   anfasst, findet hier vier gemessene Grenzfaelle.**
   ⚠️ **DIE VORAB-TABELLE WAR DREIMAL IN FOLGE UEBERHOLT.** In M02 und in M03 hat sich je ein
   Treffer durch eine INHALTLICHE Korrektur von selbst erledigt. Erst Inhalt, dann neu messen. */
/* ⚠️⚠️ RATSCHE NACHGEZOGEN 28.07.2026 – NUTZER-ENTSCHEID NACH ABSCHLUSS VON ETAPPE 3.
     Bis dahin standen Schwelle und Ziel auf 45,0 bei einem Istwert von 3,2 % (9 von 285).
     Der Waechter haette einen Rueckfall von 9 auf 128 Treffer geduldet, ohne rot zu werden –
     er bewachte nichts mehr. Verlauf des Zaehlers ueber sechs Laeufe, Nenner konstant 285:
       124 → 114 (M01 L1) → 102 (M01 L2) → 80 (M02) → 47 (M03) → 27 (M07) → 9 (M08).
     NEU: Ziel 5,0 · Schwelle 8,0 → rot ab 23 Treffern, also 14 mehr als heute.
     Das ist bewusst Luft fuer neue Fragen: `tools/apply_batch.py` weist jede neue Frage mit Tell
     schon beim Einsortieren zurueck, die Schwelle ist nur das Netz darunter.
     ⚠️ Die neun verbleibenden Treffer sind KEINE Restschuld: M01-117, M03-001, M03-002, M03-020
     und M07-008 bleiben per Nutzer-Entscheid stehen (reine Aufzaehlungen/Fachbegriffe, formal
     Treffer, didaktisch keine); vier liegen in M09, das Etappe 2 ohnehin aufloest.
     ⚠️ NUR SENKEN, NIE ANHEBEN. Wer hier erhoehen will, verschleiert eine Verschlechterung. */
/* ✅✅ STAND 27.08.2026, ETAPPE IV: **6 von 302 = 1,99 %** - erstmals MIT den Fall-Teilaufgaben.
   Der Nenner waechst von 287 auf 302 (15 mc-Teilaufgaben in den neun Faellen), der Zaehler
   bleibt bei 6. Beim ersten gemeinsamen Lauf waren es 16 von 301 = 5,32 %; die zehn Tells in
   den Faellen wurden einzeln entschaerft - AUSSCHLIESSLICH durch Verlaengern der Distraktoren,
   keine einzige richtige Antwort wurde gekuerzt (FALL-04-t1, FALL-04-t5, FALL-05-t5,
   FALL-06-t1, FALL-06-t5, FALL-07-t1, FALL-07-t2, FALL-07-t5, FALL-09-t2 sowie FALL-03-t1,
   das mit dem Fall neu geschrieben wurde).
   Die sechs verbleibenden Treffer sind der Nutzer-Entscheid vom 27.07.: M01-117, M03-001,
   M03-002, M03-020, M05-105 und M07-008 bleiben stehen (reine Aufzaehlungen und Fachbegriffe,
   formal Treffer, didaktisch keine).
   Ziel und Schwelle gehen von 5,0/8,0 auf 3,0/3,0. Rot ab 10 Treffern - vier mehr als heute.
   ⚠️ NUR SENKEN, NIE ANHEBEN. Wer hier erhoeht, verschleiert eine Verschlechterung. */
const SCHWELLE_LAENGSTE = 3.0;
const ZIEL_LAENGSTE = 3.0;

/* 2) Feinthemen, deren Schwierigkeitsstufen eine Stufe UEBERSPRINGEN (z. B. {1,3}).
      Istwert 26.07.2026: 4 (M06 BSI-Grundschutz {1,3,4} · M07 Abnahme & Uebergabe {1,3} ·
      M07 Change Management {1,3} · M08 Tarifrecht {1,2,4}). Etappe 6 schliesst sie → dann auf 0. */
/* ✅ STAND 27.07. NACH ETAPPE 6: **0**. Alle vier Luecken sind geschlossen:
   Abnahme & Uebergabe und Change Management in Etappe 5 (je eine Stufe-2-Frage), M06
   BSI-Grundschutz (M06-030, Stufe 2) und M08 Tarifrecht (M08-030, Stufe 3) in Etappe 6.
   ⚠️ **DIE SCHWELLE STEHT JETZT AUF 0 UND DARF DORT BLEIBEN.** Anders als die anderen drei
   Waechter ist das hier kein Restbestand, der langsam abgetragen wird, sondern eine Eigenschaft,
   die der Pool ab sofort HAT: Kein Feinthema ueberspringt eine Schwierigkeitsstufe.
   Wer ein neues Thema anlegt oder eine Stufe hinzufuegt, muss die Progression lueckenlos halten –
   der Waechter faellt sonst sofort, und das ist der Zweck. */
const SCHWELLE_STUFENLUECKEN = 0;

/* 3) Kleinster Anteil eines AP1-Gebiets (A1–A5) am AP1-Bestand, in Prozent.
      Istwert 26.07.2026: A4 „Kunden einweisen" 22 von 799 = 2,75 %; groesstes Gebiet A3 42,2 %.
      ⚠️ BEWUSST AUF 2,5 GESETZT, NICHT AUF 5: Bei 5 waere der Waechter ROT, bis Etappe 5 den
      A4-Ausbau bringt – er wuerde also alle Releases davor blockieren. Das ist der saubere
      Ratschen-Weg: Startschwelle knapp unter dem Istwert, ANHEBEN AUF 5,0 NACH ETAPPE 5.
      (Das ist die einzige Stelle dieser Datei, an der eine Schwelle steigen darf – und zwar, weil
      der Bestand vorher besser geworden ist, nicht um einen Lauf gruen zu bekommen.)
      ══════════ ANGEHOBEN 27.07. NACH ETAPPE 5: 2,5 → 4,8 ══════════
      A4 ist von 24 auf 42 Fragen gewachsen, der Anteil von 2,75 % ueber 2,85 % auf **4,88 %**.
      ⚠️ **NICHT auf die im Plan genannten 5,0**, sondern auf 4,8 – der Istwert liegt knapp
      darunter, weil der NENNER mitgewachsen ist (799 → 861 AP1-Fragen). Nutzer-Entscheid 27.07.:
      die Schwelle folgt der Messung, nicht die Messung der Planzahl. Zwei Fragen nur deshalb zu
      schreiben, damit eine runde Zahl steht, waere genau die verkehrte Richtung.
      A4 ist damit nicht mehr das kleinste Sorgenkind – kleinstes Gebiet bleibt es trotzdem. */
const SCHWELLE_GEBIET_MIN = 4.8;

/* 4) Kuerzel im Fragetext, das nicht in abkuerzungen.js steht (gezaehlt je Frage-Kuerzel-Paar).
      Istwert 27.07.2026: 196 Treffer in 42 Kuerzeln. Nutzer-Entscheid 27.07.: Ratsche auf dem
      Istwert statt harter Null – die verbleibenden Faelle sind Schuld, die modulweise abgetragen
      wird (entweder das Kuerzel kommt ins Lexikon oder der Fragetext loest es einmal auf).
      ⚠️ IN DER RUECKFRAGE STANDEN 72 – DIESE ZAHL WAR ZU NIEDRIG UND IST BEWUSST KORRIGIERT.
      Die Vormessung hatte FAZ/FEZ/SAZ/SEZ/GP/FP (Netzplan), RFC/APIPA/RADIUS (bei M04 bewusst
      nicht ins Lexikon genommen) sowie IT/PC/AG/KG mit ignoriert. Das sind ECHTE Abkuerzungen;
      sie gehoeren in die Schuld, nicht in die Ignorierliste – sonst misst der Waechter sich
      selbst schoen. Ignoriert wird nur, was gar keine Abkuerzung ist (Klassen a–d unten).
      ⚠️ RATSCHE GEZOGEN 27.07.: Nutzer-Entscheid „IT ins Lexikon" (abkuerzungen.js 112 → 113,
      test_abk an zwei Stellen nachgezogen). „IT" war mit 72 Treffern der groesste Einzelposten;
      der Istwert faellt damit von 196 auf **124 Treffer in 41 Kuerzeln**. Naechste Kandidaten
      nach Haeufigkeit: PC 13 · AG 12 · GP 11 · FAZ 11 · SAZ 7 · FEZ 6 · ER 6 · TOM 6. */
const SCHWELLE_ABK = 124;

/* 5) mc-Fragen, in denen ein DISTRAKTOR mehr als MAX_FAKTOR mal so lang ist wie die richtige
      Antwort. ⚠️ NACHGERUESTET AM 28.07.2026 – DIE GEGENRICHTUNG VON WAECHTER 1.
      ►► WARUM ES DIESEN WAECHTER BRAUCHT: Waechter 1 und apply_batch-Klasse 6 verlangen, dass
      MINDESTENS EIN Distraktor laenger ist als die richtige Antwort. Eine Obergrenze kannte
      niemand. Wer Waechter 1 gruen bekommen will, verlaengert also Distraktoren – beliebig weit.
      Der Lerner lernt dann „nimm die kuerzeste" statt „nimm die laengste", und der Waechter
      meldet dazu nichts. Das Ziel „Gleichstand +-15 %" stand seit Wochen in START_PROMPT.md und
      war NIRGENDS durchgesetzt.
      GEMESSENE FOLGE (28.07.): 65 mc-Fragen mit einem Distraktor ueber 1,15 x, Spitzenwerte
      M06-008 3,22 x · M02-017 3,17 x · M04-308 2,33 x. 42 davon am 28.07. korrigiert.
      ⚠️ **DER KORREKTURLAUF SELBST HAT NEUN NEUE TREFFER VON WAECHTER 1 ERZEUGT**, weil
      Distraktoren unter die Laenge der richtigen Antwort gekuerzt wurden. Die beiden Waechter
      spannen ab jetzt gemeinsam ein FENSTER auf: strikt laenger als die richtige Antwort
      (Waechter 1) und hoechstens MAX_FAKTOR mal so lang (dieser hier).
      ⚠️ SCHWELLE 0 UND SIE DARF DORT BLEIBEN – wie bei den Stufenluecken ist das keine Restschuld,
      die abgetragen wird, sondern eine Eigenschaft, die der Pool HAT. Die elf verbleibenden
      Faelle stehen als Bestandsentscheid in laengen_ausnahmen.json, nicht in dieser Schwelle.
      ►► WER DIESE SCHWELLE ANHEBT, VERSCHLEIERT EINE VERSCHLECHTERUNG. Wer stattdessen eine ID
      in laengen_ausnahmen.json eintraegt, tut dasselbe – deshalb steht die Warnung auch dort. */
/* ⚠️ MAX_FAKTOR und MIN_OPTIONSLAENGE stehen NICHT hier, sondern in laengen_ausnahmen.json –
   EINE Quelle fuer diese Suite, tools/apply_batch.py und tools/opt_ersatz.py. Drei Kopien
   koennen auseinanderlaufen, ohne dass etwas rot wird: ein Waechter, der mit 1,15 misst, und ein
   apply_batch, das mit 1,25 einsortiert, waeren beide gruen und trotzdem widerspruechlich. */
const MAX_FAKTOR = KONF.grenzwerte.max_faktor;
const SCHWELLE_UEBERLANG = 0;

/* ══════════════ MESSFUNKTIONEN (nehmen den Pool als Parameter – dadurch gegenprobbar) ══════════════ */

/* --- 1) „laengste Antwort ist die richtige" ---
   ⚠️ GLEICHSTAND ZAEHLT ALS TREFFER. Die 76,6 % des Pruefberichts entstehen genau so
   (strikt-eindeutig waeren es 199 = 72,6 %). Wer hier auf „strikt laenger" umstellt, macht den
   Wert ueber Nacht besser, ohne dass sich eine einzige Frage geaendert haette. NICHT TUN.

   ⚠️ EINE EINZIGE AUSNAHME, NUTZER-ENTSCHEID 27.07.2026: **Fragen, deren LAENGSTE Option unter
   MIN_OPTIONSLAENGE Zeichen hat, zaehlen gar nicht mit.** Das sind Zahlen-, Fach- und
   Adressfragen („200 GB" · „150 GB" · „80 GB" · „260 GB" in M06-018; „Vertraulichkeit" gegen
   „Verfuegbarkeit" in M06-001; „192.168.5.127" in M04-103). Dort ist Laenge kein verwertbarer
   Hinweis – ein Unterschied von zwei Zeichen faellt niemandem auf, und wo ALLE Optionen exakt
   gleich lang sind, wurde bisher der bestmoegliche Zustand als schlechtester gewertet.
   Gemessen am 27.07.: 29 der 274 mc-Fragen fallen darunter, 13 davon galten als Treffer;
   bei dreien (M01-014, M03-306, M03-601) waren alle Optionen exakt gleich lang.
   ⚠️⚠️ **DIESE AUSNAHME HEBT DEN ISTWERT, WEIL DER NENNER SCHRUMPFT** (69,7 % auf 274 wurde zu
   72,7 % auf 245). Sie ist KEINE Verbesserung des Pools und darf nie als solche gebucht werden.
   Die Ratsche unten wurde deshalb beim Umstellen NEU GESETZT, nicht fortgeschrieben. */
const MIN_OPTIONSLAENGE = KONF.grenzwerte.min_optionslaenge;   /* Quelle: laengen_ausnahmen.json */
function laengsteQuote(pool) {
  let gesamt = 0, treffer = 0;
  const auffaellig = [];
  pool.forEach(function (f) {
    if (f.typ !== "mc") return;
    const opt = f.optionen, i = f.loesungIndex;
    if (!Array.isArray(opt) || opt.length < 2 || typeof i !== "number" || !opt[i]) return;
    if (Math.max.apply(null, opt.map(function (o) { return String(o).length; })) < MIN_OPTIONSLAENGE) return;
    gesamt++;
    const len = opt.map(function (o) { return String(o).length; });
    const max = Math.max.apply(null, len);
    if (len[i] === max) { treffer++; auffaellig.push(f.id); }
  });
  return { gesamt: gesamt, treffer: treffer, auffaellig: auffaellig,
           quote: gesamt ? (100 * treffer / gesamt) : 0 };
}

/* --- 1b) „laengste Antwort ist die richtige" bei szenario2 (N50 Q1/B2, 18.10.2026) ---
   tools/item_flaws.js maß 30 von 36 Schritten (schritt1/schritt2) als Treffer, Zufall 11,9. Der Wächter 1
   prüft nur typ mc. RATSCHE: SZENARIO2_LAENGSTE_MAX steht auf dem Istwert und darf nur SINKEN.
   Gleiche Regel wie Wächter 1 (Gleichstand zählt, Mindestlänge MIN_OPTIONSLAENGE, alle gleich lang = nicht gemessen). */
const SZENARIO2_LAENGSTE_MAX = 26;   /* 24.11.2026 N3: 30 -> 26 (Ablenker in szenario2-Schritten ersetzt, BUILD_LOG 259) */
function szenario2Laengste(pool) {
  let gesamt = 0;
  const auffaellig = [];
  pool.forEach(function (f) {
    if (f.typ !== "szenario2") return;
    ["schritt1", "schritt2"].forEach(function (s, k) {
      const st = f[s];
      if (!st || !Array.isArray(st.optionen) || st.optionen.length < 2 || typeof st.loesungIndex !== "number" || !st.optionen[st.loesungIndex]) return;
      const len = st.optionen.map(function (o) { return String(o).length; });
      const max = Math.max.apply(null, len);
      if (max < MIN_OPTIONSLAENGE || len.every(function (l) { return l === len[0]; })) return;
      gesamt++;
      if (len[st.loesungIndex] === max) auffaellig.push(f.id + "#s" + (k + 1));
    });
  });
  return { gesamt: gesamt, treffer: auffaellig.length, auffaellig: auffaellig };
}

/* --- 5) „ein Distraktor ist ueberlang" ---
   Gleiche Grundmenge und gleiche Kurzoptionen-Ausnahme wie Waechter 1, damit beide dieselben
   Fragen bewerten – ein Fenster aus zwei Waechtern mit verschiedenen Grundmengen waere nicht
   erfuellbar. Zusaetzlich: IDs aus laengen_ausnahmen.json fallen heraus (Bestandsentscheide). */
function ueberlangeDistraktoren(pool, ausnahmen, faktor) {
  const treffer = [];
  let gesamt = 0;
  pool.forEach(function (f) {
    if (f.typ !== "mc") return;
    const opt = f.optionen, i = f.loesungIndex;
    if (!Array.isArray(opt) || opt.length < 2 || typeof i !== "number" || !opt[i]) return;
    const len = opt.map(function (o) { return String(o).length; });
    if (Math.max.apply(null, len) < MIN_OPTIONSLAENGE) return;
    if (ausnahmen && ausnahmen[f.id]) return;
    gesamt++;
    const max = Math.max.apply(null, len);
    if (max > len[i] * faktor) treffer.push(f.id + " (" + (max / len[i]).toFixed(2) + "x)");
  });
  return { gesamt: gesamt, treffer: treffer };
}

/* --- 2) Stufenluecke ---
   Ein Feinthema ist „modul|thema". M09 bleibt AUSSEN VOR: das ist der Klausur-Sonderpool, er wird
   in Etappe 2 aufgeloest und folgt keiner eigenen Stufenprogression. Basis sind damit die
   Feinthemen des Pruefberichts – 73 bei Aufstellung des Waechters, 74 seit Etappe 5 (27.07.). */
function stufenLuecken(pool) {
  const stufen = {};
  pool.forEach(function (f) {
    if (f.modul === "M09") return;
    const k = f.modul + "|" + f.thema;
    (stufen[k] = stufen[k] || {})[f.schwierigkeit] = 1;
  });
  const luecken = [];
  Object.keys(stufen).forEach(function (k) {
    const s = Object.keys(stufen[k]).map(Number).sort(function (a, b) { return a - b; });
    for (let j = 1; j < s.length; j++) {
      if (s[j] - s[j - 1] > 1) { luecken.push(k + " {" + s.join(",") + "}"); break; }
    }
  });
  return luecken.sort();
}

/* --- 3) Gebiets-Unwucht ---
   Basis sind AUSSCHLIESSLICH die AP1-Gebiete A1–A5 (799 Fragen). Bewusst NICHT der ganze Pool:
   M09 (gebiet „M9") ist Klausurstoff auf Abruf, und die B-Gebiete gehoeren zu AP2, das erst
   aufgebaut wird – beide wuerden den Nenner verwaessern und die Unwucht kleinrechnen. */
const AP1_GEBIETE = ["A1", "A2", "A3", "A4", "A5"];
function gebietsAnteile(pool) {
  const z = {}; AP1_GEBIETE.forEach(function (g) { z[g] = 0; });
  let summe = 0;
  pool.forEach(function (f) {
    if (AP1_GEBIETE.indexOf(f.gebiet) < 0) return;
    z[f.gebiet]++; summe++;
  });
  const anteile = AP1_GEBIETE.map(function (g) {
    return { gebiet: g, anzahl: z[g], anteil: summe ? (100 * z[g] / summe) : 0 };
  });
  anteile.sort(function (a, b) { return a.anteil - b.anteil; });
  return { summe: summe, anteile: anteile, min: anteile[0] };
}

/* --- 4) Abkuerzung ohne Lexikoneintrag ---
   Gesucht wird im FRAGETEXT (nicht in Erklaerungen – dort ist die Aufloesung ja erlaubt und
   ueblich). Als Kuerzel gilt ein Wort aus Grossbuchstaben/Ziffern mit 2–8 Zeichen, das mit einem
   Buchstaben beginnt. Gezaehlt wird je FRAGE einmal pro Kuerzel.

   ⚠️ NICHT MIT `\b` ARBEITEN: JS-Wortgrenzen sind ASCII-basiert, Umlaute zaehlen dort als
   Nicht-Wort-Zeichen. Deshalb erst in Woerter zerlegen, dann pruefen – sonst weicht das Ergebnis
   von einer Nachmessung in Python ab (gegengerechnet am 27.07.: beide Wege 108 Typen/358 Treffer). */
const WORT_RE = /[A-Za-zÄÖÜäöüß0-9]+/g;
const KUERZEL_RE = /^[A-Z][A-Z0-9]{1,7}$/;

/* (a) Deutsche Woerter in Versalien: Betonung im Fragetext und Pseudocode-Schluesselwoerter der
       Schreibtischtest-Aufgaben. Das sind keine Abkuerzungen – sie gehoeren nicht ins Lexikon. */
const IGN_VERSALIEN = ["WENN", "DANN", "SONST", "SOLANGE", "WIEDERHOLE", "BIS", "TUN", "ENDE",
  "FUER", "UND", "ODER", "NICHT", "VOR", "NACH", "WAS", "WIE", "PLUS", "MOD", "DIV", "BEIDE",
  "JEDES", "KEIN", "EINE", "ZWEI", "SOWOHL", "AUCH", "MEHRERE", "ERSTEN", "PRODUKTE", "VORTEILE",
  "FUNKTION", "PROZEDUR", "PLAN", "BERUF", "BESTE"];
/* (b) Einheiten, Waehrungen, Produktbezeichnungen – keine erklaerungsbeduerftigen Fachkuerzel. */
const IGN_EINHEITEN = ["EUR", "GB", "MB", "TB", "KB", "PB", "HE", "CO2", "MS", "USA", "EU"];
/* (c) Bezeichner, die die Aufgabe SELBST einfuehrt (Risiko R1, Support-Stufe L1, Server FS01,
       Modell W4 …). Sie werden im Fragetext erklaert und sind ausserhalb der Frage bedeutungslos. */
const IGN_BEZEICHNER = ["R1", "R2", "L1", "L2", "W4", "W6", "FS01", "A1", "A2", "B1", "B2"];
const IGN = {};
[].concat(IGN_VERSALIEN, IGN_EINHEITEN, IGN_BEZEICHNER).forEach(function (w) { IGN[w] = 1; });

/* (d) Das Feinthema „Englische Fachtexte" bleibt aussen vor: dort ist der Quelltext absichtlich
       englisch (Release Notes, SLA-Auszuege, RMA-Formulare). Kuerzel wie RFQ, VAT oder CAUTION
       sind Teil der Leseaufgabe und nicht Stoff des deutschen Abkuerzungslexikons. */
const IGN_THEMA = "Englische Fachtexte";

function abkOhneLexikon(pool, lexikon) {
  const lex = {};
  lexikon.forEach(function (a) { lex[String(a.kurz).toUpperCase()] = 1; });
  const funde = {};
  let treffer = 0;
  pool.forEach(function (f) {
    if (f.thema === IGN_THEMA) return;
    const toks = String(f.frage || "").match(WORT_RE) || [];
    const seen = {};
    toks.forEach(function (tk) {
      if (!KUERZEL_RE.test(tk) || lex[tk] || IGN[tk] || seen[tk]) return;
      seen[tk] = 1; treffer++;
      (funde[tk] = funde[tk] || []).push(f.id);
    });
  });
  return { treffer: treffer, typen: Object.keys(funde).length, funde: funde };
}


/* ══════════════ WAECHTER 6: SELBSTVERRATENDE BILDAUFGABEN (2026-07-30) ══════════════
   ANLASS, NUTZER-BEFUND zu M09-022 (heute M07-410): Die Frage lautete "Klicke die Stabsstelle an", und im
   Organigramm stand auf genau diesem Kasten "Stabsstelle:". Die Aufgabe pruefte Lesen statt
   Verstehen. Poolweit gefunden: DREI Faelle (M09-022 = heute M07-410, M09-051 = heute M01-510 "Meilenstein", M04-996
   "Methoden"), alle drei behoben.
   ⚠️ DER ERSTE DETEKTOR HATTE 11 TREFFER UND WAR DAMIT UNBRAUCHBAR: Er meldete auch "Schicht"
   (M03-051/472), "Vorgang" (M09-052, am 04.08.2026 geloescht), "Regel" (M06-971) und "Support" (M01-701). Diese Woerter
   stehen auf ALLEN Zonen und unterscheiden nichts - wer bei "Klicke die Schicht an" die richtige
   OSI-Schicht treffen soll, muss trotzdem wissen, welche es ist.
   ►► DIE ENTSCHEIDENDE VERFEINERUNG: Ein Wort verraet nur, wenn es NUR auf der richtigen Zone
   steht und auf keiner falschen. Damit fielen die 8 Fehlalarme weg und die 3 echten blieben. */
const VZ_STOP = new Set(["welche", "welcher", "welches", "klicke", "klick", "markiere", "zeigt",
  "folgende", "folgenden", "abgebildeten", "abgebildete", "einer", "eines", "einem", "nicht",
  "durch", "steht", "sind", "wird", "wurde", "dass", "dieser", "diese", "dieses", "bereich"]);
function vzWorte(s) {
  return Array.from(new Set((String(s || "").toLowerCase().match(/[a-z\u00e4\u00f6\u00fc\u00df]{5,}/g) || [])
    .filter(function (w) { return !VZ_STOP.has(w); })));
}
function verraeterischeZonen(f) {
  if (!Array.isArray(f.zonen)) return [];
  const fr = String(f.frage || "").toLowerCase();
  const svg = (String(f.svg || "").match(/>([^<>]+)</g) || [])
    .map(function (x) { return x.slice(1, -1); }).join(" ").toLowerCase();
  const falsch = f.zonen.filter(function (z) { return !z.richtig; })
    .map(function (z) { return String(z.label || "").toLowerCase(); }).join(" ");
  const out = [];
  f.zonen.filter(function (z) { return z.richtig; }).forEach(function (z) {
    vzWorte(z.label).forEach(function (w) {
      if (fr.indexOf(w) >= 0 && svg.indexOf(w) >= 0 && falsch.indexOf(w) < 0) out.push(w);
    });
  });
  return Array.from(new Set(out));
}

/* ══════════════ LAUF ══════════════ */
(function () {
  H.t("Pool ist geladen (" + FRAGEN.length + " Fragen)", FRAGEN.length > 900);
  H.t("Lexikon ist geladen (" + ABK.length + " Eintraege)", ABK.length > 100);

  /* ---------- 1) Waechter „laengste Antwort ist die richtige" ---------- */
  const L = laengsteQuote(BESTAND);
  console.log("[didaktik] laengste=richtig: " + L.treffer + "/" + L.gesamt +
    " = " + L.quote.toFixed(1) + " % (Schwelle " + SCHWELLE_LAENGSTE + " %, Ziel " + ZIEL_LAENGSTE + " %)");
  H.t("mc-Grundmenge ist vorhanden (" + L.gesamt + " Fragen)", L.gesamt > 200);
  H.t("Anteil „laengste Option = richtige Antwort\" ist " + L.quote.toFixed(1) +
    " % und damit <= " + SCHWELLE_LAENGSTE + " %", L.quote <= SCHWELLE_LAENGSTE);
  H.t("Die Schwelle steht nicht unter dem Zielwert (Ratsche laeuft nach unten)",
    SCHWELLE_LAENGSTE >= ZIEL_LAENGSTE);

  /* GEGENPROBE 1a: ein Mini-Pool, in dem die richtige Antwort immer die laengste ist. */
  const boesA = [
    { typ: "mc", id: "X1", optionen: ["kurz", "das ist die ausfuehrliche richtige Antwort"], loesungIndex: 1 },
    { typ: "mc", id: "X2", optionen: ["nein", "auch hier die viel laengere richtige Antwort"], loesungIndex: 1 }
  ];
  H.t("GEGENPROBE: Mini-Pool mit durchweg laengster richtiger Antwort ergibt 100 %",
    laengsteQuote(boesA).quote === 100);
  H.t("GEGENPROBE: dieser Mini-Pool wuerde die Schwelle reissen",
    laengsteQuote(boesA).quote > SCHWELLE_LAENGSTE);
  /* GEGENPROBE 1b: ausgeglichener Mini-Pool – der Waechter muss schweigen. */
  const gutA = [
    { typ: "mc", id: "Y1", optionen: ["eine sehr lange falsche Option hier", "kurz richtig"], loesungIndex: 1 },
    { typ: "mc", id: "Y2", optionen: ["ebenfalls eine lange falsche Option", "kurz richtig"], loesungIndex: 1 }
  ];
  H.t("GEGENPROBE: ausgeglichener Mini-Pool ergibt 0 %", laengsteQuote(gutA).quote === 0);
  /* ⚠️ DIESE ZUSICHERUNG IST DER RIEGEL VOR B80. Sie faellt, sobald jemand die Faelle wieder
     aus der Messung nimmt - egal ob durch einen Umbau des Laders oder durch ein Zurueckstellen
     auf FRAGEN. Ohne sie waere das stille Herausfallen genau so wenig sichtbar wie vorher. */
  H.t("Die Laengenmessung liest die Fall-Teilaufgaben mit (B80)",
    FALLTEILE.length > 0 && BESTAND.length === FRAGEN.length + FALLTEILE.length &&
    BESTAND.some(f => String(f.id).indexOf("FALL-") === 0));

  /* ⚠️ FUER DIE FAELLE GILT NULL, NICHT DIE QUOTE.  (B86, 27.08.2026)
     Die Quotenschwelle oben ist eine Ratsche ueber 302 Fragen; ein EINZELNER neuer Tell laesst
     sie nicht anschlagen. Im Fragenpool faengt ihn stattdessen tools/apply_batch.py schon beim
     Einsortieren ab - aber apply_batch nimmt eine flache Fragenliste (--pool pool/pool_mNN.json)
     und kann pool_faelle.json mit seiner Teilaufgaben-Schachtelung gar nicht lesen. Fuer die
     Faelle gibt es also KEIN Netz je Aufgabe.
     ►► Deshalb hier eine harte Null statt einer Quote. Das ist bezahlbar, weil es nur 15
        mc-Teilaufgaben sind, und heute erfuellt: alle zehn Tells wurden am 27.08. entschaerft.
     ⚠️ Wer eine neue Fall-Teilaufgabe schreibt, sorgt dafuer, dass mindestens ein Distraktor
        LAENGER ist als die richtige Antwort - und hoechstens 1,15x so lang (das prueft die
        Ueberlang-Zusicherung weiter unten, die die Faelle ebenfalls mitliest). */
  const FALL_L = laengsteQuote(FALLTEILE);
  console.log("[didaktik] Tells in den Fall-Teilaufgaben: " + FALL_L.treffer + " von " +
    FALL_L.gesamt + (FALL_L.treffer ? " -> " + FALL_L.auffaellig.join(", ") : ""));
  H.t("Keine einzige Fall-Teilaufgabe hat den Laengen-Tell (B86)",
    FALL_L.gesamt > 0 && FALL_L.treffer === 0);
  /* GEGENPROBE 1c: Gleichstand MUSS als Treffer zaehlen (sonst rutscht die Quote unbemerkt).
     ⚠️ Die Optionen muessen dafuer laenger als MIN_OPTIONSLAENGE sein – sonst greift die
     Kurzoptionen-Ausnahme und die Gegenprobe misst versehentlich etwas anderes. */
  const gleich = [{ typ: "mc", id: "Z1",
    optionen: ["gleich lang und lang genug fuer die Messung!", "gleich lang und lang genug fuer die Messung?"],
    loesungIndex: 0 }];
  H.t("GEGENPROBE: Gleichstand zaehlt als Treffer (100 %, nicht 0 %)",
    laengsteQuote(gleich).quote === 100);
  /* GEGENPROBE 1d: Nicht-mc-Fragen duerfen die Grundmenge nicht aufblaehen. */
  H.t("GEGENPROBE: Nicht-mc-Typen zaehlen nicht mit",
    laengsteQuote([{ typ: "dropdown", optionen: ["a", "bbbb"], loesungIndex: 1 }]).gesamt === 0);
  /* GEGENPROBE 1e: die Kurzoptionen-Ausnahme greift – und zwar NUR dort, wo sie soll. */
  H.t("GEGENPROBE: Frage mit lauter kurzen Optionen faellt aus der Grundmenge",
    laengsteQuote([{ typ: "mc", id: "K1", optionen: ["200 GB", "150 GB", "80 GB", "260 GB"], loesungIndex: 0 }]).gesamt === 0);
  H.t("GEGENPROBE: eine Option von genau " + MIN_OPTIONSLAENGE + " Zeichen zaehlt noch mit",
    laengsteQuote([{ typ: "mc", id: "K2", optionen: ["x".repeat(MIN_OPTIONSLAENGE), "kurz"], loesungIndex: 0 }]).gesamt === 1);
  H.t("GEGENPROBE: eine Option von " + (MIN_OPTIONSLAENGE - 1) + " Zeichen zaehlt nicht mehr mit",
    laengsteQuote([{ typ: "mc", id: "K3", optionen: ["x".repeat(MIN_OPTIONSLAENGE - 1), "kurz"], loesungIndex: 0 }]).gesamt === 0);

  /* ---------- 1b) Ratsche „laengste=richtig" bei szenario2 ---------- */
  const S2 = szenario2Laengste(BESTAND);
  console.log("[didaktik] szenario2 laengste=richtig: " + S2.treffer + "/" + S2.gesamt +
    " (Obergrenze " + SZENARIO2_LAENGSTE_MAX + ")");
  H.t("szenario2-Grundmenge ist vorhanden (" + S2.gesamt + " Schritte)", S2.gesamt >= 30);
  H.t("szenario2: Schritte mit laengster=richtig " + S2.treffer + " <= Obergrenze " + SZENARIO2_LAENGSTE_MAX +
    (S2.treffer > SZENARIO2_LAENGSTE_MAX ? " -> " + S2.auffaellig.join(", ") : ""),
    S2.treffer <= SZENARIO2_LAENGSTE_MAX);
  /* GEGENPROBE 1f: ein zusaetzlicher Tell-Schritt hebt den Wert ueber die Obergrenze, die Meldung nennt die ID. */
  const s2Boes = BESTAND.concat([{ typ: "szenario2", id: "X-S2", schritt1: {
    optionen: ["kurz", "die ausfuehrliche richtige Antwort, deutlich laenger"], loesungIndex: 1 } }]);
  const S2b = szenario2Laengste(s2Boes);
  H.t("GEGENPROBE: Ist +1 ist ROT und die Meldung nennt die ID",
    S2b.treffer === S2.treffer + 1 && S2b.treffer > SZENARIO2_LAENGSTE_MAX && S2b.auffaellig.indexOf("X-S2#s1") >= 0);
  H.t("GEGENPROBE: szenario2-Schritt mit kuerzester richtiger Option zaehlt nicht",
    szenario2Laengste([{ typ: "szenario2", id: "X-S3", schritt1: {
      optionen: ["die ausfuehrliche falsche Antwort, deutlich laenger", "kurz"], loesungIndex: 1 } }]).treffer === 0);
  H.t("GEGENPROBE: Nicht-szenario2-Typen zaehlen nicht mit",
    szenario2Laengste([{ typ: "mc", id: "X-M", optionen: ["kurz", "die ausfuehrliche richtige Antwort, deutlich laenger"], loesungIndex: 1 }]).gesamt === 0);

  /* ---------- 2) Waechter „Stufenluecke" ---------- */
  const SL = stufenLuecken(FRAGEN);
  console.log("[didaktik] Stufenluecken: " + SL.length + " (Schwelle " + SCHWELLE_STUFENLUECKEN + ")");
  SL.forEach(function (s) { console.log("           - " + s); });
  H.t("Feinthemen mit uebersprungener Schwierigkeitsstufe: " + SL.length +
    " <= " + SCHWELLE_STUFENLUECKEN, SL.length <= SCHWELLE_STUFENLUECKEN);

  /* GEGENPROBE 2a: {1,3} muss als Luecke erkannt werden. */
  const luecke = [
    { modul: "MX", thema: "T", schwierigkeit: 1 }, { modul: "MX", thema: "T", schwierigkeit: 3 }
  ];
  H.t("GEGENPROBE: Thema mit Stufen {1,3} wird als Luecke gemeldet", stufenLuecken(luecke).length === 1);
  /* GEGENPROBE 2b: {1,2,3} ist keine Luecke. */
  const dicht = [
    { modul: "MX", thema: "T", schwierigkeit: 1 }, { modul: "MX", thema: "T", schwierigkeit: 2 },
    { modul: "MX", thema: "T", schwierigkeit: 3 }
  ];
  H.t("GEGENPROBE: Thema mit Stufen {1,2,3} wird NICHT gemeldet", stufenLuecken(dicht).length === 0);
  /* GEGENPROBE 2c: eine einzige Stufe ist keine Luecke (aber auch kein Aufbau – anderer Befund). */
  H.t("GEGENPROBE: Thema mit nur einer Stufe wird nicht als Luecke gemeldet",
    stufenLuecken([{ modul: "MX", thema: "T", schwierigkeit: 2 }]).length === 0);
  /* GEGENPROBE 2d: M09 bleibt aussen vor. */
  H.t("GEGENPROBE: M09 wird nicht mitgezaehlt", stufenLuecken([
    { modul: "M09", thema: "T", schwierigkeit: 1 }, { modul: "M09", thema: "T", schwierigkeit: 4 }
  ]).length === 0);

  /* ---------- 3) Waechter „Gebiets-Unwucht" ---------- */
  const G = gebietsAnteile(FRAGEN);
  console.log("[didaktik] AP1-Gebiete (" + G.summe + " Fragen): " + G.anteile.map(function (a) {
    return a.gebiet + " " + a.anzahl + " (" + a.anteil.toFixed(2) + " %)";
  }).join(" · ") + "  [Schwelle " + SCHWELLE_GEBIET_MIN + " %]");
  H.t("Alle fuenf AP1-Gebiete kommen im Pool vor",
    G.anteile.every(function (a) { return a.anzahl > 0; }));
  H.t("Kleinstes AP1-Gebiet ist " + G.min.gebiet + " mit " + G.min.anteil.toFixed(2) +
    " % und damit >= " + SCHWELLE_GEBIET_MIN + " %", G.min.anteil >= SCHWELLE_GEBIET_MIN);

  /* GEGENPROBE 3a: ein Gebiet unter der Schwelle muss anschlagen. */
  const schief = [];
  for (let i = 0; i < 99; i++) schief.push({ gebiet: "A3" });
  schief.push({ gebiet: "A1" }, { gebiet: "A2" }, { gebiet: "A4" }, { gebiet: "A5" });
  H.t("GEGENPROBE: Mini-Pool mit 1 von 103 Fragen in A4 reisst die Schwelle",
    gebietsAnteile(schief).min.anteil < SCHWELLE_GEBIET_MIN);
  /* GEGENPROBE 3b: gleichmaessige Verteilung ist gruen. */
  const eben = [];
  AP1_GEBIETE.forEach(function (g) { for (let i = 0; i < 20; i++) eben.push({ gebiet: g }); });
  H.t("GEGENPROBE: gleichmaessige Verteilung ergibt 20 % je Gebiet",
    Math.abs(gebietsAnteile(eben).min.anteil - 20) < 1e-9);
  /* GEGENPROBE 3c: M9 und B-Gebiete verwaessern den Nenner nicht. */
  const mitFremd = eben.concat([{ gebiet: "M9" }, { gebiet: "B1" }, { gebiet: "B2" }, { gebiet: "B3" }]);
  H.t("GEGENPROBE: M9 und B-Gebiete zaehlen nicht in den Nenner",
    gebietsAnteile(mitFremd).summe === 100);

  /* ---------- 4) Waechter „Abkuerzung ohne Lexikoneintrag" ---------- */
  const A = abkOhneLexikon(FRAGEN, ABK);
  console.log("[didaktik] Kuerzel ohne Lexikoneintrag: " + A.treffer + " Treffer in " +
    A.typen + " Kuerzeln (Schwelle " + SCHWELLE_ABK + ")");
  console.log("           " + Object.keys(A.funde).sort(function (a, b) {
    return A.funde[b].length - A.funde[a].length;
  }).map(function (k) { return k + " " + A.funde[k].length; }).join(" · "));
  H.t("Kuerzel im Fragetext ohne Lexikoneintrag: " + A.treffer + " <= " + SCHWELLE_ABK,
    A.treffer <= SCHWELLE_ABK);

  /* GEGENPROBE 4a: ein erfundenes Kuerzel MUSS gemeldet werden. */
  H.t("GEGENPROBE: erfundenes Kuerzel XQZ wird gemeldet",
    abkOhneLexikon([{ frage: "Was bedeutet XQZ im Betrieb?" }], ABK).treffer === 1);
  /* GEGENPROBE 4b: ein Kuerzel AUS dem Lexikon darf nicht gemeldet werden. */
  H.t("GEGENPROBE: DNS steht im Lexikon und wird nicht gemeldet",
    abkOhneLexikon([{ frage: "Wofuer sorgt DNS im Netz?" }], ABK).treffer === 0);
  /* GEGENPROBE 4c: die drei Ignorier-Klassen greifen. */
  H.t("GEGENPROBE: Versalien-Wort NICHT wird ignoriert",
    abkOhneLexikon([{ frage: "Welche Aussage trifft NICHT zu?" }], ABK).treffer === 0);
  H.t("GEGENPROBE: Einheit GB wird ignoriert",
    abkOhneLexikon([{ frage: "Die Platte hat 500 GB Kapazitaet." }], ABK).treffer === 0);
  H.t("GEGENPROBE: Feinthema „Englische Fachtexte\" bleibt aussen vor",
    abkOhneLexikon([{ thema: "Englische Fachtexte", frage: "Please submit the RFQ." }], ABK).treffer === 0);
  /* GEGENPROBE 4d: dasselbe Kuerzel zweimal in EINER Frage zaehlt einmal, in zwei Fragen zweimal. */
  H.t("GEGENPROBE: Kuerzel zweimal in einer Frage zaehlt einmal",
    abkOhneLexikon([{ frage: "XQZ und nochmal XQZ." }], ABK).treffer === 1);
  H.t("GEGENPROBE: Kuerzel in zwei Fragen zaehlt zweimal",
    abkOhneLexikon([{ frage: "XQZ hier." }, { frage: "XQZ dort." }], ABK).treffer === 2);
  /* GEGENPROBE 4e: einzelner Grossbuchstabe ist kein Kuerzel (sonst meldet jedes Satzende). */
  H.t("GEGENPROBE: einzelner Grossbuchstabe zaehlt nicht als Kuerzel",
    abkOhneLexikon([{ frage: "Der Wert A ist gesucht." }], ABK).treffer === 0);

  /* ══════════════ 5) UEBERLANGE DISTRAKTOREN (Gegenrichtung von Waechter 1) ══════════════ */
  const U = ueberlangeDistraktoren(BESTAND, AUSN, MAX_FAKTOR);
  H.t("Distraktoren ueber " + MAX_FAKTOR + "x der richtigen Antwort: " + U.treffer.length +
      " <= " + SCHWELLE_UEBERLANG + (U.treffer.length ? "  [" + U.treffer.join(", ") + "]" : ""),
    U.treffer.length <= SCHWELLE_UEBERLANG);
  /* Die Ausnahmeliste ist eine Escape-Luke. Laeuft sie leer oder wird sie unlesbar, wuerde der
     Waechter STILL auf eine andere Grundmenge umschalten – deshalb wird sie selbst geprueft. */
  H.t("laengen_ausnahmen.json ist geladen und nicht leer (" + Object.keys(AUSN).length + " IDs)",
    Object.keys(AUSN).length > 0);
  H.t("Jede Ausnahme traegt eine Begruendung mit Datum",
    Object.keys(AUSN).every(function (k) { return /^\d{4}-\d{2}-\d{2} · .{20,}/.test(AUSN[k]); }));
  /* Eine Ausnahme fuer eine Frage, die es nicht mehr gibt, faellt sonst NIE auf – sie wirkt
     stillschweigend weiter. Relevant ab Etappe 2: Wenn M09 aufgeloest wird, aendern sich IDs. */
  const poolIds = {};
  FRAGEN.forEach(function (f) { poolIds[f.id] = 1; });
  /* ⚠️⚠️ DECKEL JE AUSNAHME (27.08.2026). Eine Ausnahme galt bis dahin der FRAGE, nicht dem
     entschiedenen Fall: die ID fiel aus der Messung, und danach konnte die Frage beliebig
     schlechter werden. GEMESSEN an diesem Tag: der Distraktor von M03-018 wurde zur Probe von 26
     auf 91 Zeichen verlaengert (Faktor 1,18 -> 4,1) - diese Suite blieb bei 46 OK / 0 FEHLER.
     ►►► Eine Ausnahme, die die Fundstelle des Fehlers dauerhaft stillstellt, ist kein Sonderfall,
     sondern ein blinder Fleck. Jetzt deckelt jeder Eintrag sich selbst auf den Wert, der am Tag
     des Entscheids gemessen wurde. Wer eine dieser Fragen bewusst umschreibt, misst neu und
     traegt den Wert in laengen_ausnahmen.json nach - mit Datum, wie beim Eintrag selbst. */
  const DECKEL = KONF.faktor_bestand || {};
  const gewachsen = Object.keys(DECKEL).filter(function (id) {
    const f = FRAGEN.filter(function (x) { return x.id === id; })[0];
    if (!f || f.typ !== "mc" || !Array.isArray(f.optionen)) return false;
    const len = f.optionen.map(function (o) { return String(o).length; });
    if (Math.max.apply(null, len) < MIN_OPTIONSLAENGE) return false;
    const ist = Math.max.apply(null, len) / len[f.loesungIndex];
    return ist > DECKEL[id] + 0.005;
  }).map(function (id) {
    const f = FRAGEN.filter(function (x) { return x.id === id; })[0];
    const len = f.optionen.map(function (o) { return String(o).length; });
    return id + " (" + (Math.max.apply(null, len) / len[f.loesungIndex]).toFixed(2) + "x, Bestand " + DECKEL[id] + "x)";
  });
  H.t("keine Bestands-Ausnahme ist ueber ihren Deckel gewachsen" +
      (gewachsen.length ? ": " + gewachsen.join(", ") : " (" + Object.keys(DECKEL).length + " geprueft)"),
    gewachsen.length === 0);

  const verwaist = Object.keys(AUSN).filter(function (k) { return !poolIds[k]; });
  H.t("Keine Ausnahme zeigt auf eine Frage, die es nicht gibt" +
      (verwaist.length ? " [" + verwaist.join(", ") + "]" : ""), verwaist.length === 0);
  /* GEGENPROBE 5a: ein Distraktor mit Faktor 2 MUSS gemeldet werden. */
  const boesU = [{ typ: "mc", id: "U1", loesungIndex: 0,
    optionen: ["richtige Antwort mit genau vierzig Zeichen!!",
               "ein Distraktor, der ungefaehr doppelt so lang ist wie die richtige Antwort daneben"] }];
  H.t("GEGENPROBE: Distraktor mit rund Faktor 2 wird gemeldet",
    ueberlangeDistraktoren(boesU, {}, MAX_FAKTOR).treffer.length === 1);
  /* GEGENPROBE 5b: knapp unter der Grenze MUSS schweigen, knapp darueber MUSS melden.
     ⚠️ DIE FIXTURES WERDEN AUS MAX_FAKTOR BERECHNET, NICHT HARTKODIERT. Der erste Entwurf hatte
     40/46/47 fest eingetragen – beim Verstellen des Grenzwerts in laengen_ausnahmen.json fielen
     dann zwei Gegenproben, obwohl der Waechter korrekt arbeitete. Ein Pruefwert, der den
     gepruefen Wert dupliziert, misst irgendwann etwas anderes als er behauptet. */
  const BASIS = 40, GRENZE = Math.floor(BASIS * MAX_FAKTOR);
  const knappGut = [{ typ: "mc", id: "U2", loesungIndex: 0,
    optionen: ["A".repeat(BASIS), "B".repeat(GRENZE)] }];       // genau auf der Grenze
  const knappBoes = [{ typ: "mc", id: "U3", loesungIndex: 0,
    optionen: ["A".repeat(BASIS), "B".repeat(GRENZE + 1)] }];   // ein Zeichen darueber
  H.t("GEGENPROBE: Faktor genau " + MAX_FAKTOR + " ist noch in Ordnung",
    ueberlangeDistraktoren(knappGut, {}, MAX_FAKTOR).treffer.length === 0);
  H.t("GEGENPROBE: ein Zeichen darueber wird gemeldet",
    ueberlangeDistraktoren(knappBoes, {}, MAX_FAKTOR).treffer.length === 1);
  /* GEGENPROBE 5c: die Ausnahmeliste greift – und NUR fuer die eingetragene ID. */
  H.t("GEGENPROBE: eine ID auf der Ausnahmeliste wird uebersprungen",
    ueberlangeDistraktoren(knappBoes, { "U3": "Testeintrag" }, MAX_FAKTOR).treffer.length === 0);
  H.t("GEGENPROBE: eine FREMDE ID auf der Ausnahmeliste hilft nicht",
    ueberlangeDistraktoren(knappBoes, { "U9": "Testeintrag" }, MAX_FAKTOR).treffer.length === 1);
  /* GEGENPROBE 5d: Kurzoptionen bleiben aussen vor – gleiche Ausnahme wie bei Waechter 1.
     Ohne sie wuerde „Sehr hoch" gegen „Keine Einstufung erforderlich" als Befund gelten. */
  H.t("GEGENPROBE: Frage mit lauter kurzen Optionen faellt aus der Grundmenge",
    ueberlangeDistraktoren([{ typ: "mc", id: "U4", loesungIndex: 0,
      optionen: ["kurz", "auch kurz genug hier"] }], {}, MAX_FAKTOR).gesamt === 0);


  /* ---------- 6) Waechter „Bildaufgabe verraet ihre Loesung" ---------- */
  const vzTreffer = FRAGEN.filter(function (f) { return verraeterischeZonen(f).length > 0; });
  console.log("[didaktik] selbstverratende Bildaufgaben: " + vzTreffer.length +
    " (Schwelle 0, Grundmenge " + FRAGEN.filter(function (f) { return Array.isArray(f.zonen); }).length + " Bildaufgaben)");
  H.t("Waechter 6: keine Bildaufgabe verraet ihre Loesung in der Zonenbeschriftung" +
    (vzTreffer.length ? " – " + vzTreffer.map(function (f) { return f.id; }).join(", ") : ""),
    vzTreffer.length === 0);
  /* GEGENPROBE 6a: der alte M09-022-Zustand MUSS erkannt werden (die Frage heisst seit dem
     04.08.2026 M07-410; der Zustand ist hier synthetisch, die ID also nur Herkunftsangabe). */
  H.t("GEGENPROBE: der alte M09-022-Zustand wird erkannt", verraeterischeZonen({
    id: "V1", frage: "Klicke die Stabsstelle an.",
    svg: "<svg><text>Stabsstelle:</text><text>Abteilung Vertrieb</text></svg>",
    zonen: [{ label: "Abteilung Vertrieb", richtig: false }, { label: "Stabsstelle", richtig: true }]
  }).length === 1);
  /* GEGENPROBE 6b: ein Kategoriewort auf ALLEN Zonen darf NICHT anschlagen. */
  H.t("GEGENPROBE: ein Wort auf ALLEN Zonen ist kein Verrat", verraeterischeZonen({
    id: "V2", frage: "Klicke die Schicht an, auf der die Ursache liegt.",
    svg: "<svg><text>7 Anwendung</text><text>3 Vermittlung</text></svg>",
    zonen: [{ label: "Schicht 3 – Vermittlung", richtig: false }, { label: "Schicht 7 – Anwendung", richtig: true }]
  }).length === 0);
  /* GEGENPROBE 6c: nur im aria-Label, nicht sichtbar im Bild -> kein SICHTBARER Verrat. */
  H.t("GEGENPROBE: nur im aria-Label, nicht im Bild -> kein Treffer", verraeterischeZonen({
    id: "V3", frage: "Klicke die Stabsstelle an.",
    svg: "<svg><text>Recht und Controlling</text></svg>",
    zonen: [{ label: "Abteilung Vertrieb", richtig: false }, { label: "Stabsstelle", richtig: true }]
  }).length === 0);

  process.exit(H.report());
})();

module.exports = { laengsteQuote: laengsteQuote, szenario2Laengste: szenario2Laengste, stufenLuecken: stufenLuecken,
                   gebietsAnteile: gebietsAnteile, abkOhneLexikon: abkOhneLexikon,
                   ueberlangeDistraktoren: ueberlangeDistraktoren,
                   verraeterischeZonen: verraeterischeZonen };
