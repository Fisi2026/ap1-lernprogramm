# ARCHITECTURE.md – Code-Landkarte AP1-Lernprogramm

**Struktur vom 2026-07-14, Zahlen aufgefrischt am 2026-09-10 (1131 Fragen, 9 Fälle, 45 Suiten).**

Zweck: Einem neuen Modell/Entwickler das teure Selbst-Erkunden ersparen. Schema-Referenz separat
in SCHEMA.md, Einstieg für Menschen in README.md.

⚠️ **WAS HIER GEPRÜFT IST UND WAS NICHT.** Am 10.09.2026 wurden die Mengenangaben gegen den Code
gemessen (Dateiliste, `sollwerte.env`, `app_state.js`). **Die Zeilenangaben `~Z.xxx` wurden NICHT
nachgemessen** – sie stammen aus der Zeit vor der Modul-Aufteilung und sind Richtwerte im
Wortsinn. **Funktionsnamen sind stabil; wer eine Stelle sucht, greppt den Namen, nicht die Zeile.**
Eine Zeilenangabe in einer Doku ist ein Messwert von damals, kein Zustand.

## Dateien & Datenfluss
```
pool/pool_*.json  --python3 build_fragen.py-->  fragen.js (var FRAGEN, NIE direkt editieren)
pool/pool_faelle.json --------------------------^  (faelle.js analog)
99_Spickzettel.md -> spickzettel.js (var SPICKZETTEL)
abkuerzungen.js = var ABKUERZUNGEN (70 IT-/WiSo-Abkürzungen {kurz,lang,def,kat}, #61; dual-env)
logik.js   = reine Logik, DOM-frei, läuft in Node UND Browser (window.L / module.exports)
lernprogramm_ap1.html = nur Markup, lädt styles.css + logik/fragen/faelle/spickzettel/abkuerzungen.js + die 11 app_*.js
app_*.js   = UI + Steuerung ("use strict"), seit Block E aus app.js in Module aufgeteilt (app.js gelöscht);
             R7 (2026-07-16) hat app_loeser.js byte-identisch in app_glossar.js + app_loeser.js + app_verbuchen.js zerlegt → 11 Module.
             LADEREIHENFOLGE (Abhängigkeit!): app_state → app_pool → app_util → app_ui → app_frage →
             app_glossar → app_loeser → app_verbuchen → app_seiten → app_sim → app_pages2 (letzteres endet mit render()).
             Reassemblierung der Module == alte app.js (byte-identisch verifiziert). Bearbeiten: das jeweilige Modul, NICHT app.js.
styles.css = seit A8 ausgelagertes CSS (früher <style> in der HTML)
tests/ = Node-Suiten (Auto-Glob in check.sh), 45 Suiten; jsdom-Suiten nutzen tests/_harness.js.
  ⛔ HIER STEHT KEINE SUITEN-LISTE MEHR: die Soll-Zahl je Suite ist EINE Quelle, sollwerte.env.
  Eine zweite Liste driftet - genau das ist hier bis 09/2026 passiert (18 statt 45).
tools/ = pool_query.js (themen/typen/frage/ohne/freeids/idcheck/duenn/stufe/suche/coverage/verweise/
  zitate/begriffe/firmen/zufall/verrat/svg/abdeckung), validate_pool.js (ganzer Pool),
  validate_batch.js (neuer Batch), validate_schema.js (ajv gegen tools/schema/), apply_batch.py
  (Aufnahme mit 10 Pruefklassen), build_fragen.py-Umfeld, suite.sh/prueflauf.sh/gitc.sh/sabotage.sh,
  index.js (erzeugt FUNCTIONS.md), befunde_index.py (erzeugt BEFUNDE_INDEX.md), rotiere.py.
  tools/archiv/ = Einmal-Skripte abgeschlossener Etappen, von nichts aufgerufen (eigene README).
```

## logik.js (~1000 Zeilen) – wichtigste Exporte
- Zufall/Deck: L.shuffle, L.pick (~Z.10–19); L.deckPick(candidates, seen, lastShown, sperrfrist, rng,
  gewichtFn) (~Z.28) – 6. Param optional = gewichtete Ziehung.
- Gewichtungs-Engine (A3, ~Z.52–160): L.pickGewichtet, L.THEMA_RELEVANZ (73 kanonische Themen -> 3/2/1;
  Keys = maßgebliche Themenliste!), L.gewichteFrage(f, ctx).
- Adaptivität: L.autoLevel, L.trackAntwort, L.levelReif (Stufen 1–4, kein Auto-Hochstufen).
- Fehler-Deck: L.fdDue usw. (1/3/7 Tage, 3-Treffer-Regel).
- Schema: L.TYPEN, validateFragen, duplikatScan; Pflichtfeld-Checks je Typ (~Z.230–350).
- Grades: gradeMC/gradeMehrfach(loesungIndizes)/gradeDropdown/gradeLuecke(akzeptiert, eingabe)/
  gradeZuordnung (TEXTBASIERT wegen many-to-one!)/gradeHotspot(frage, index) ~Z.383/gradeMatrix/
  gradeBeschriftung/gradeTrace/gradeKonsole(+normBefehl)/gradeKalkulation/gradeBaukasten/
  gradeFehlersuche/gradeRechenassistent/gradeReihenfolge.
- Varianten: L.instanziiere (Zahlen-Varianten je Frage validiert).
- Generatoren: L.genSubnetting/genUebertragung/genZahlensysteme/genDatenmengen/genRaid/genNetzplan,
  L.ganttBerechne + L.GANTT_SZENARIEN, L.NETZPLAN_SZENARIEN; L.GENERATOREN-Map am Ende (~Z.898).

## app_*.js (Block-E-Module) – Struktur der Steuerung
Modul-Aufteilung (Zeilenbereiche der alten app.js, Funktionen unverändert): app_state.js = State/LS
(STATE_VERSION, defaultState, migriereState, ladeState, `var S`). app_pool.js = POOL-Selbsttest + MODULE.
app_util.js = el/esc/svgBox/svgAltFuer/normText/autoCheckText/gradeTeilpunkte. app_ui.js = Aktions-Footer,
Kopfzeile, Themes/setTheme, setFokus, setFarbsymbole, Onboarding (starteOnboarding), renderTypHilfe, renderNav.
app_frage.js = renderFrage (Sim-Renderer) + Feedback/Diagnose + renderStern/renderMelden. app_glossar.js =
metaTags + Tooltip-Glossar (GLOSSAR_TIPS/glossarWrap/glossarAttach …). app_loeser.js = R_TYP-Renderer +
loeseFrage (DER Split-Löser) + abruf. app_verbuchen.js = verbucheAntwort + zeigeLevelDialog. app_seiten.js = render()-Dispatch +
sStart/sUeben/sFehlerdeck/sMarkiert/sGenerator + naechsteFrage/kandidaten. app_sim.js = Prüfungssimulation
(buildAP1Exam/sSimulation/renderSimFrage/simAbgeben). app_pages2.js = sNetzplan/sGantt/sGlossar(+Tabs)/
sSpickzettel/sSerie/sStatistik/sEinstellungen + abschließender `render()`-Aufruf.
Frühere „app.js-Zeile" unten = grep verifizieren (Funktionsname stabil, jetzt im jeweiligen Modul).
- State (~Z.227–300): LS_KEY, STATE_VERSION=5 (MUSS vor `var S = ladeState()` stehen!), defaultState()
  mit v5-Feldern (markiert, simDauerMin, fokus, meldungen, relevanzGewichtung:true, farbsymbole,
  ariaAltTexte, onboardingDone, typHilfeAus), migriereState (idempotent), ladeState, speichere.
- Pool-Selbsttest (~Z.303): POOL = validateFragen(FRAGEN).gueltig; MODULE-Liste (~Z.310).
- Helfer: el() (ACHTUNG: kein <tr>/<td> – document.createElement nutzen!), esc(), heute(), frageById,
  passtAP (AP1/AP2-Filter), typVon, modulName.
- CSS-Themes: THEMES (~Z.492), setTheme; SEITEN-Array (~Z.499) + render()-Dispatch (~Z.1263):
  start ueben fd gen netzplan gantt sim glossar spickzettel serie stat einst.
- Feedback: zeigeFeedback (~Z.657), zeigeErklaerung (~Z.665, mc-Distraktorliste im Aufklapper),
  zeigeDiagnose (A4, ~Z.683–770, 6 Typen), renderNotiz.
- metaTags (~Z.780): Modul/Thema/Level/AP2/Wiedervorlage/Themen-Serie-Badges.
- loeseFrage(f, host, opts) (~Z.786–1240): DER Split-Löser. opts={onGraded(korrekt,extra), onNext,
  simulation?}. Je Typ ein Branch (mc, mehrfach, reihenfolge, dropdown, hotspot, zuordnung, freitext,
  erklaeren, bild, fehlersuche, rechenassistent, matrix, beschriftung, trace, konsole, kalkulation,
  baukasten). Prüfen läuft über globalen Aktions-Footer: setAktion/clearAktion.
- A3-Integration (~Z.1340–1420): letzteThemen/themenSerie (Session), anzahlBeantwortet(),
  gewichtsKontext(), zeigeThemenSerieAngebot(); naechsteFrage() = Üben-Ziehung (Serie > Fehler-Deck-
  Einstreuung 1/5 > Generator 1/4 > gewichtetes deckPick); verbucheAntwort (~Z.1223): Statistik
  (S.statistik[modul] und ["T:"+modul+":"+thema]), Fehler-Deck, Level-Track.
- kandidaten() (~Z.1377): passtAP + Modulfilter + Level.
- Seiten: sStart (Kacheln), sUeben, sFehlerdeck, sGenerator, sNetzplan (~Z.1690), sGantt (~Z.1770),
  sSimulation (~Z.1544: 40 Fragen, simUsedIds-Gedächtnis, 1 Fallaufgabe, Notenschlüssel),
  sGlossar, sSpickzettel (eigener mdToHtml), sSerie (5er, schwächstes Modul), sStatistik (~Z.1950),
  sEinstellungen (~Z.1973: Tagesziel, Prüfungsdatum, Theme, prüfungsnah-Toggle, Daten löschen).

## Neuere Features (Block B + D, 2026-07-13/14) – Funktions-Anker (Namen stabil, Zeilen ~)
- #73 TYP_META (logik.js): L.TYP_META (Zeit/Punkte je Typ) + L.metaFuer(f). Speist #45 Timer.
- #45 Klausur-Timer (app.js sSimulation): Budget aus TYP_META-Summe bzw. S.simDauerMin; clearInterval bei
  Seitenwechsel (simAbbrechen in render()); zeitSek in simHistorie.
- #46 Lesezeichen: renderStern(c,f) (~727) + Route sMarkiert + markierteIds(); S.markiert.
- #52 Zurück-Navigation (Üben): uebenVerlauf/uebenIdx + uebenRender (← Zurück / Weiter →).
- #54 Swipe: macheWischLeiste(zurueckFn,weiterFn) (~1533) – dedizierte Wisch-Leiste, KEIN #main-Handler.
- #47 SVG-Zoom: svgBox(inner, alt) (~90) baut .svgbox + ⤢; oeffneZoom(svgHtml) Overlay, document-Delegation.
- #98 Abruf-Übung: abrufAn + abrufVerdecken(R) + abrufToggle() (Optionen erst verdecken; nicht in Sim).
- #55 Fokus: setFokus(v) (~303), body.classList 'fokus' (reiner CSS-Toggle).
- #57 Frage melden: renderMelden(c,f) (~738) → S.meldungen; meldungenJSON/Text + downloadDatei.
- #53 Tooltip-Glossar: GLOSSAR_TIPS-Map + glossarWrap(f) (~859) + glossarPopEl/Show/Hide/Attach; in loeseFrage
  frage-text `opts.simulation ? esc : glossarWrap`, glossarAttach nur !sim. S.glossarTip (Default AN).
- #61 Abkürzungs-Lexikon: sGlossar (~2202) = Tab-Wrapper (Begriffe|Abkürzungen); glossarBegriffeView +
  glossarAbkView (~2248); Abk-Tab nur bei anzahlBeantwortet()>30 (Gate); Daten in abkuerzungen.js.
- #76 Teilpunkte: gradeTeilpunkte(antwort,f) (~253) + begriffTreffer (Pflicht=2/Kür=1, Schwelle 65 %); optionales
  Feld f.schluesselbegriffe:{pflicht,kuer} (logik.js-Validierung ~244, abwärtskompatibel; Selbsteinschätzung
  bleibt maßgeblich). 15 Demo-Fragen im Pool.
- #64/#65 Barrierefreiheit: setFarbsymbole(v) (~328, body.farbsymbole → CSS ✓/✗ an .opt/.fb); svgBox(inner,alt)
  setzt role=img+aria-label bei S.ariaAltTexte; svgAltFuer(f) (~100) generisch je Typ. Toggles in Einstellungen.
- #66/#67 Onboarding & Hilfe: starteOnboarding() (~369) Auto-Overlay .onb-overlay bei !S.onboardingDone
  (setTimeout); renderTypHilfe(container,typ) (~393) + TYP_HILFE-Map, „nicht mehr zeigen" → S.typHilfeAus[typ];
  Aufruf in loeseFrage nach „Deine Lösung"-Kicker, nur !sim. Reaktivier-Buttons in Einstellungen.
- State v5 (defaultState ~7–31): + glossarTip:true. Übrige a11y/Hilfe-Felder (farbsymbole, ariaAltTexte,
  onboardingDone, typHilfeAus) waren bereits v5-Felder.

## Fragen-Schema (pool/*.json) – Kernfelder
id (M0X-NNN, Modul==Präfix, eindeutig), pruefungsteil ("AP1"|"AP2"; Subnetting/ER/M08=AP2!), modul,
thema (KANONISCH = Key in L.THEMA_RELEVANZ), typ, schwierigkeit 1–4, frage, erklaerungKurz,
erklaerungLang, verweis; je Typ zusätzlich: mc: optionen+loesungIndex(+distraktorErklaerungen[4]);
mehrfach: optionen+loesungIndizes(+distraktorErklaerungen, ""=richtige Option); dropdown: luecken[{optionen,
loesung}] (Anzahl == ___ im Text); zuordnung: paare[[links,rechts]]; hotspot: svg+zonen[{x,y,w,h,richtig,
label}] (Zone==rect, genau 1 richtig); trace: code+spalten+zeilen; kalkulation: kopf+zeilen[[{v}|{loesung[]}]];
rechenassistent: schritte[{text,loesung[],einheit?}]; varianten: v[] von instanziiere geprüft.

## Bekannte gefixte Bugs (nicht wieder einbauen!)
el("<tr>") -> null (createElement nutzen); gerades " in el()-Strings bricht Parser; STATE_VERSION-
Hoisting; gradeZuordnung index- statt textbasiert; Google-Fonts-CDN (offline!); § 20 Abs. 3 BBiG u. a.
Rechtszitate; unverzügliche Rügepflicht beim Werkvertrag (M07-202).
