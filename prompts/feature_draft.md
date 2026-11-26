> ⛔ **VERALTET seit N29/N34 (Vermerk 27.09.2026):** Diese Vorlage beschreibt die ALTE App (`logik.js`, `app_*.js`, jsdom-Boot, alte Suiten). Fuer den Neubau gelten `SCHIENE_NEU.md`, `PLAN_NEUBAU.md` und `ARCHITECTURE.md`.

# Agent-Vorlage: Feature-Entwurf am App-Code (für Sonnet-Subagenten)

Der Hauptprompt an den Agenten lautet nur noch:
> Lies /tmp/prompts/feature_draft.md. Feature: [BESCHREIBUNG + Entscheidungen des Nutzers].
> Anforderungen/Tests: [LISTE]. Arbeite auf /tmp/app.html (Snapshot /tmp/app_vorher.html NICHT anfassen).

## Regeln (gelten immer)
1. NUR in /tmp arbeiten. /tmp enthält: app.html (aktuelle App), app_vorher.html (Snapshot für den Diff),
   logik.js, fragen.js, faelle.js, spickzettel.js, ARCHITECTURE.md (Code-Landkarte – zuerst lesen,
   statt die App komplett zu erkunden), tools/, node_modules/jsdom.
2. Bestehendes Verhalten darf sich NICHT ändern, außer es ist ausdrücklich Teil des Features.
   Wertung/Fehler-Deck/Statistik nie als Nebenwirkung anfassen.
3. Bekannte Fallen (Details in ARCHITECTURE.md unten): kein el("<tr>/<td>") – document.createElement;
   keine geraden Anführungszeichen in el("…")-Strings; "use strict"-Inline-JS nie per w.eval laden
   (JSDOM.fromFile mit runScripts:'dangerously', resources:'usable'); localStorage unter file:// stubben
   (Object.defineProperty in beforeParse); Interval-/Event-Listener beim Seitenwechsel aufräumen;
   esc() für alle Nutzertexte; keine externen URLs (offline-Pflicht).
4. Syntax-Gate: <script>-Block extrahieren → node --check, bevor du Tests schreibst.
5. Tests: /tmp/test_[feature].js (jsdom; Muster wie tests/test_engine.js/test_diagnose.js – IMMER
   tests/_harness.js nutzen: const {boot,t,close,within,report}=require("./_harness.js"); boot(preState)
   liefert das window) für ALLE geforderten Fälle + Negativfälle; zusätzlich müssen die Bestands-Suiten
   in tests/ (test_logik/test_engine/test_diagnose/test_state) grün BLEIBEN.
   Iteriere bis alles grün. Wenn ein Test scheitert: erst prüfen, ob der TEST falsch ist; App-Bugs
   nur melden, wenn sicher – im Zweifel nicht eigenmächtig „mitfixen".
6. Antwort an das Hauptmodell (max. 15 Zeilen): was geändert (Funktionen + Anker-Zeilen),
   Testergebnis N OK/M FEHLER, Annahmen/Befunde. Der Diff wird vom Hauptmodell über app_vorher.html
   gezogen und Edit für Edit in die echte Datei übernommen.
