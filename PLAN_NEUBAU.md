# Der Neubau `neu/` — Entscheidungen und Restarbeit

⚠️ **WOZU DIESE DATEI.** `SCHIENE_NEU.md` sagt, **was der Neubau ist**. Der `BUILD_LOG.md` sagt,
**wie weit er ist** (Etappen `N…`, und die Schlusszeile „Damit offen" im letzten Eintrag). Diese
Datei sagt, **was entschieden wurde und in welcher Reihenfolge gebaut werden soll** — damit ein
neuer Chat auf einem anderen Gerät ohne Rückfragen weiterarbeiten kann.

⛔ **HIER STEHT KEIN STAND.** Was gebaut ist, steht im BUILD_LOG — nur dort. Diese Datei wird
geändert, wenn sich eine **Entscheidung** ändert, nicht wenn eine Etappe fertig ist. Zwei Listen
für dieselbe Sache driften immer; deshalb führt diese hier keine Häkchen.

---

## 1. Die Entscheidungen vom 16.09.2026 (Nutzer-Entscheide)

| # | Frage | Entscheid |
|---|---|---|
| E1 | Wozu der Neubau? | **Ablösung.** Er soll die alte App beim Lerner ersetzen. Damit ist Vollständigkeit kein Luxus mehr, sondern die Bedingung. |
| E2 | Wie wird abgelöst? | **Erst parallel ausliefern** (eigener Pfad), im Alltag benutzen, dann umschalten. Der Lernstand ist derselbe Schlüssel `ap1v2_state` — beide Fassungen sehen denselben Fortschritt. |
| E3 | Welche der fünf fehlenden Schirme? | **Alle** — `start`, `serie` (Tagesserie), `markiert`, `frage`, `unterricht` — „mit Blick auf die Zukunft". |
| E4 | Welche fehlenden Bedienelemente? | **Alle vier Gruppen**: Rückseite vollständig · Stern + Frage melden · Glossar-Tooltips + SVG-Zoom · Einstellungen nachziehen. |
| E5 | shadcn-Bausteine? | **Ja, mit DOM-Schnappschuss davor — und aufräumen** (`scroll-area` ist installiert und nirgends benutzt). |
| E6 | Taschenrechner? | **Selber neu bauen** im Neubau, statt `rechner.js` aus `app_util.js` herauszulösen. ⚠️ Siehe Risiko R1. |
| E7 | Die 105 M09-Fragen? | **Erst prüfen, dann fragen.** Messen: Schema, Kennungen, Typen, Dubletten — Ergebnis vorlegen, bevor etwas in den Pool wandert. |
| E8 | Meldungen? (17.09.) | **Online und geräteunabhängig**: jeder Lerner kann melden, der Nutzer sieht alle Meldungen auf jedem Gerät. Speicher: **Cloudflare Worker + D1** im bestehenden Konto. **Nur der Neubau meldet online**; die alte App bleibt lokal. |
| E9 | Stern? (17.09.) | **Immer sichtbar im Kartenkopf**, kein Schalter (die alte App behält `markierenAn`). |
| E10 | Push? (17.09.) | **Der Chat pusht selbst** nach grünem `check.sh`, über die Training Shell, nie `--force`; ein Version-Bump wird vorher erfragt. |
| E11 | Tagesserie: Regelort? (17.09.) | **Für den Neubau neu geschrieben** (`kern/tagesserie.ts`), die alte App bleibt unangetastet; gegen `sSerie`/`schwaechstesGebiet`/`mischeTypen` misst ein Gleichheitstest in node:vm. Einstieg: **eigener Bereich in der Schiene**. |
| E12 | Tagesserie: Gebietswechsel? (17.09.) | **Gebiet und Auswahl beim Start einfrieren.** Die alte App rechnet nach jeder Antwort neu (gemessen: neuer Lerner 12 von 12 Wechseln); sie bleibt so, der Befund steht im BUILD_LOG. |
| E13 | Adressen, Startbild, Einzelfrage (17.09.) | **Hash-Routing neu gebaut** im Format der alten App (`#ueben`, `#frage=ID`, Browser-Zurück; „sinnvoll neu bauen"). **Ohne Adresse öffnet die Startseite.** Die Einzelfrage ist zusätzlich über **anklickbare Kennungen** in Markiert, Fehler-Deck und Meldungsliste erreichbar. **Badges nur gemessen** (fällig, markiert, Tagesserie heute offen) – keine festen „NEU", die Unterricht-Kachel kommt mit N28. |
| E14 | Tooltips und Zoom (18.09.) | **Regel neu geschrieben** (`kern/glossartip.ts`, auf dem ROHTEXT) statt `glossarWrap` zu exportieren – die alte Fassung liefert HTML und bräuchte `dangerouslySetInnerHTML`; Gleichheit an allen 1131 Fragen gemessen. **Schalter `glossarTip` gleich mitgenommen** (er muss wirken, nicht nur im Lernstand stehen). **Zoom über Radix-Dialog/Popover** aus dem schon installierten Paket `radix-ui` statt eines handgebauten Overlays. |
| E15 | Umfang von N24 (18.09.) | **Geteilt:** N24 zieht `simDauerMin`, `relevanzGewichtung`, `ariaAltTexte` und den Abruf-Umschalter nach; die **Typ-Hilfe** wird die eigene Etappe **N24b**, weil `typHilfeAus` ein Feature voraussetzt, das der Neubau nicht hat. **Die Abruf-Uebung gilt auch in der Tagesserie** (im Neubau derselbe Uebungsweg), **nicht** in Simulation und Einzelfrage. **`svgAltFuer` wird in `kern/` neu geschrieben** und gegen `app_util.js` in node:vm gemessen — kein UMD-Ausgang in der alten App. **`ariaAltTexte` verbessert die Beschriftung, statt sie hinzuzufuegen:** aus = die generische Zeile bleibt, an = der inhaltliche Text. Ein unbeschriftetes Bild gibt es im Neubau nicht (bewusste Abweichung von der alten App). |
| E16 | N25 (21.09.) | **Passend NEU bauen, nicht aus dem Alten übernehmen** (Nutzer, wörtlich: „baue lieber passend sachen neu anstatt sie aus dem alten zu übernehmen"): jeder Schirm wird aus shadcn-Bausteinen **komponiert** (Field, Item, Empty, Alert …), statt die handgebauten Elemente 1:1 zu ersetzen. **Datum:** natives Datumsfeld (`Input type=date` im Field), kein Date Picker. **Schiene:** bleibt in N25 stehen; shadcn Sidebar wird eine **eigene Etappe** mit eigenem Plan. **Auslieferung** nach jedem sichtbaren Block (Einstellungen · Fragetypen+Karte · Ende), Bump je vorher erfragt. |
| E17 | Alte App (22.09.) | **Die alte App ist nur noch REFERENZ** (Nutzer, wörtlich: „alte app ist eigl egal gilt nur noch als referenz für den neubau. aktueller lernstand auch egal aber natürlich in zukunft wichtig"). Sie wird nicht weiterentwickelt und ab N29 nicht mehr ausgeliefert. **Der heutige Lernstand hat keinen Wert** – der Neubau muss `ap1v2_state` nicht mehr lesen können; **künftige** Lernstände müssen sicher sein (N31). ⚠️ Damit gelten die Regeln des Parallelbetriebs (SCHIENE_NEU §1 „die alte App bleibt, was beim Lerner läuft", Abschnitt 4 Regel 1 „gerechnet wird in `logik.js`", R1–R3) **nur noch bis N29 bzw. N34** – dort werden sie abgelöst, nicht vorher still gebrochen. |
| E18 | Reihenfolge (22.09.) | **Vom Chat festgelegt im Auftrag des Nutzers** („lege du die reihenfolge fest und plane alles sinnvoll durch"): **N30 → N26 → N31 → N32 → N33 → N29 → N27 → N28 → N34 → N35 → N36.** Begründung je Etappe im Abschnitt „DIE REIHENFOLGE AB 22.09.2026". Sie geht der Aufzählung in Abschnitt 2 vor. |
| E19 | Rechner: Prozent (22.09.) | **`%` teilt durch 100 wie in der alten Fassung** (`50+10%` = 50,1, nicht 55 wie auf manchen Tischrechnern). Vom Chat festgelegt, weil eindeutig und 1:1 beweisbar; der Nutzer kann es umentscheiden (dann: Eintrag in der Abweichungsliste von T2). |
| E20 | Rechner: T2 (22.09.) | **T2 bleibt Pflicht, aber als REFERENZVERGLEICH**: der Beweis gegen eine bewährte Fassung. R1 (Drift zweier laufender Rechner) entfällt als Dauerrisiko, weil die alte Fassung nicht mehr läuft. Nach N29 zeigt T2 auf `referenz/`. |
| E21 | Die 45 alten Suiten (22.09.) | **Vom Chat entschieden im Auftrag des Nutzers** („wenn sie für die neue app nicht mehr benötigt werden mache das was du denkst"). Bei N29 wird jede Suite eingeordnet: **(a) prüft Pool-Inhalt** → bleibt, auf `pool/*.json` umgestellt · **(b) prüft `logik.js`** → bleibt bis N34, dann durch vitest ersetzt · **(c) prüft nur die alte Oberfläche** → aus `check.sh` heraus, Dateien bleiben im Tag `alt-app-final`. Die Liste steht dann im BUILD_LOG, je Suite mit Grund. |
| E22 | Auslieferung nach dem Umschalten (22.09.) | **Nur noch das Bauergebnis des Neubaus, aus einem eigenen Ordner (Positivliste)** statt des Repo-Wurzelordners mit Sperrliste. Die alte `sw.js` bekommt eine **letzte Fassung, die sich abmeldet und ihre Caches leert** – sonst liefert sie Lernern nach dem Umschalten weiter die alte App (R9). |
| E23 | Fehlerberichte (22.09.) | **Selbst über den vorhandenen Worker + D1** (`/api/fehler`, Regeln wie bei den Meldungen: keine IP, Längengrenzen, Mengenbremse). **Kein Drittanbieter** (Sentry geprüft und abgelehnt: Lernerdaten verlassen dann das eigene Konto). |
| E24 | Skills und Plugin (22.09.) | **Ein Plugin aus dem Repo für beide Konten** (N36) statt der Handpflege in `tools/skill_nachtraege.md`. `.claude/` (Skill *impeccable*, 4 Agenten, 17 MB) ist **nicht in git und in diesen Chats nicht verfügbar** (gemessen 22.09.: `git ls-files .claude` = 0, fehlt in der Skill-Liste) → bei N35 in die Ablage. |
| E25 | N31: Schema (22.09.) | **Schlank, Namen bleiben** (AskUserQuestion ~22:20, wie empfohlen). Nur die Felder, die der Neubau benutzt; gleiche Namen wie alt. **Weg fallen die 8 nirgends gelesenen** (gemessen 22.09.: `m09Historie`, `m09UsedIds`, `fokusZu`, `ap2Themen`, `fokus`, `farbsymbole`, `onboardingDone`, `schriftStufe`); die zwei M09-Felder kommen mit N27 als **Migration v1→v2** zurück. Unbekannte Felder werden beim Laden **verworfen und als Befund gemeldet**. |
| E26 | N31: unlesbarer Stand (22.09.) | **Sichern, dann weiter** (wie empfohlen): der Rohtext wandert in `fisi_ap1_stand_defekt` (mit Zeitpunkt), danach leerer Stand; der Banner nennt die Sicherung. Vorher überschrieb der erste Klick den kaputten Text endgültig. |
| E27 | N31: mehrere Tabs (22.09.) | **„EIN Tab schreibt"** (Nutzer: „plane das neu", danach wie empfohlen). Gemessen: „neu lesen und Änderung neu anwenden" trägt NICHT (`Ueben.tsx:160` rechnet den Zug außerhalb der Änderung aus dem alten Stand). (1) Sperre `fisi_ap1_stand` über `navigator.locks`, wer sie hat, schreibt · (2) jeder weitere Tab ist **Zuschauer**: zeigt live (`storage`), schreibt nie, Hinweis „Die App ist in einem anderen Tab offen" + Knopf **„Hier weiterarbeiten"** · (3) der Knopf holt die Sperre per `BroadcastChannel`, der neue Tab liest frisch · (4) schließt der aktive Tab, geht die Sperre von selbst weiter · (5) **`rev`** als zweite Sicherung: vor jedem Schreiben Platte lesen, ist dort `rev` höher → nicht schreiben, Plattenstand übernehmen, Befund. Ohne `navigator.locks` gilt nur (5). **Läuft im aktiven Tab eine Simulation oder Tagesserie, fragt der Knopf zurück** („Im anderen Tab läuft … – trotzdem hier weiter? Dort wird abgebrochen."). |
| E28 | N31: Befunde (22.09.) | **In den Einstellungen**, Abschnitt „Speicher": `persist()` ja/verweigert/nicht verfügbar und die Reparaturen beim Laden. **Kein neuer Banner**; die zwei Notfälle (Speichern schlägt fehl, Stand unlesbar) bleiben Banner. |
| E29 | N32: Fehlerbericht (23.09.) | **Automatisch, mit Hinweis** (AskUserQuestion ~08:40, wie empfohlen). Die Error Boundary eines Bereichs sendet an `POST /api/fehler` und sagt es im Absturz-Kasten („Ein Fehlerbericht wurde gesendet – ohne Lernstand, ohne Person“). |
| E30 | N32: Inhalt des Berichts (23.09.) | **Bereich + Meldung + gekürzter Stack**, App-Version, Zeitpunkt, Geräte-Kennung (nur Mengenbremse). Keine IP, kein Name, keine Route/Frage-ID – Regeln wie `/api/meldung`. |
| E31 | N32: Pool nachladen (23.09.) | **Eine Ladeanzeige für die App**: Hülle und Schiene sofort, der Inhalt wartet mit „Fragen werden geladen …“, bis der Pool da ist. Kein Ladezustand je Schirm. |
| E32 | N32: Schnitt (23.09.) | **Drei Commits, ein Release**: Code/oxlint → Error Boundary + `/api/fehler` → Bündel; jeder mit `check.sh` grün und Push, Release am Ende. |
| E33 | N33: Weg (23.09.) | **Handgeschriebener Service Worker, keine neue Abhängigkeit** (AskUserQuestion ~12:32, wie empfohlen; verworfen: `vite-plugin-pwa` = +236 Pakete gemessen, Cache-Name nur über `injectManifest`; nur Workbox-Laufzeit = zweiter Bauschritt). `neu/sw/plugin.ts` schreibt `v2/sw.js` aus `neu/sw/vorlage.js` mit der Dateiliste AUS DEM BÜNDEL, Cache `ap1v2-<APP_VERSION>`. Die alte `sw.js` räumt seitdem nur `ap1-v*` (vorher jeden fremden Cache – auch den des Neubaus). |
| E34 | N29: Auslieferung (23.09.) | **Bauordner im Repo** (AskUserQuestion ~13:08, wie empfohlen): `wrangler.jsonc` `assets.directory: "./v2"` – Positivliste, keine Einstellung im Dashboard, kein Token. Verworfen: Cloudflare baut selbst (Build-Befehl im Dashboard) · GitHub Actions deployt (API-Token als Secret, Git-Verbindung trennen). `deploy_inhalt.py` liest den Ordner seitdem aus `wrangler.jsonc`. |
| E35 | N29: alter SW (23.09.) | **Abschalt-SW unter `/sw.js` und `/v2/sw.js`** (wie empfohlen): übernimmt sofort, löscht `ap1-v*`/`ap1v2-*`, meldet sich ab, lädt offene Seiten auf `/` mit Bereich. Der Neubau-SW heißt **`/app-sw.js`**, Cache `ap1-app-<v>`. `_redirects`: `lernprogramm_ap1.html`, `/v2/`, `/v2`, `/v2/index.html` → `/` (301). ⛔ Die zwei Abschalt-Adressen bleiben DAUERHAFT ausgeliefert. |
| E36 | N29: Schnitt (23.09.) | **Zwei Teile** (wie empfohlen): Teil 1 = Umschalten + Release; Teil 2 ohne Wirkung beim Lerner = Tag `alt-app-final`, `referenz/`, Suiten nach E21, `fragen.js`/`faelle.js`/`build_fragen.py` raus, Version aus `neu/` (Plan-Schritte 4–6). |
| E37 | N29: Version (23.09.) | **2.0.0** (wie empfohlen): unter `/` läuft danach eine andere App mit eigenem Lernstand (E17). |
| E38 | N29: Suiten (24.09.) | **Einordnung nach E21 wie gemessen** (AskUserQuestion ~15:30, wie empfohlen): **(a) 6** didaktik, gantt, liniensysteme, matrix, wirtschaft, freitext · **(b) 10** logik, adaptiv, bereitschaft, engine, meta, note, rechnen, registry, toleranz, unterricht · **(c) 28** a11y, a11y_proxy, abk, abruf, axe, diagnose, fb_r1, fokus, glossar, hilfe, markiert, melden, onboarding, pwa, rechner, render_smoke, robust, routing, sim, state, stufen, swipe, teilpunkte, themenauswahl, timer, zoom, zurueck, zurueck_m09 · **(d) 1** entkommentiere (prüft ein Werkzeug, bleibt). Grund: `boot()` lädt `lernprogramm_ap1.html` – jede Boot-Suite hängt an der alten Oberfläche. Messung: BUILD_LOG 46. |
| E39 | N29: (c)-Dateien (24.09.) | **Nach `referenz/tests/`** (wie empfohlen), dazu Tag `alt-app-final`. `tests/` enthält danach nur, was `check.sh` fährt. |
| E40 | N29: Pool-Leser (24.09.) | **Ein gemeinsamer Lader** `tools/pool_laden.js` (wie empfohlen): baut FRAGEN/FAELLE aus `pool/*.json` wie `build_fragen.py`; Gegenprobe = identisch mit der heutigen `fragen.js`/`faelle.js`. Alle Leser (auch Werkzeuge außerhalb `check.sh`) stellen darauf um; erst dann entfallen `fragen.js`, `faelle.js`, `build_fragen.py` und der Drift-Guard. |
| E41 | N29: Version (24.09.) | **Einzige Quelle `neu/package.json` "version"** (AskUserQuestion ~15:36, wie empfohlen; verworfen: eigene Datei `neu/VERSION` · erst alles andere). Liest: `appversion.config.ts` (Vite/vitest), `check.sh` 4e/4e2/4e2b, `release.sh` (Bump in `package.json` + zwei verankerte Stellen im Lock), CI-Tag. Gleichklang 4e: gegen `v2/app-sw.js` `ap1-app-<v>` (der Bau) statt gegen die alte `sw.js`. |
| E42 | N29: Standzeile (24.09.) | **`app-sw ap1-app-<v>`** statt `sw.js ap1-v<v>` (wie empfohlen; verworfen: Feld streichen). |
| E43 | N29: DOM-Schnappschuss (24.09.) | **Aus `check.sh` wie (c)** (AskUserQuestion ~15:52, wie empfohlen; verworfen: reparieren per Ressourcen-Lader). Er prueft nur die Struktur der alten Oberflaeche. `tools/schnappschuss.js` bleibt, laeuft aber so nicht (HTML in `referenz/`, `logik.js` an der Wurzel). |
| E44 | N29: Wirkung beim Lerner (24.09.) | **`v2/` + Worker + Konfig** (AskUserQuestion ~16:22, wie empfohlen; verworfen: nur `v2/`). `ungepusht.py` liest `wrangler.jsonc`: zählt `assets.directory`, `wrangler.jsonc`, `migrations_dir`, `neu/package*.json` und die transitiven Importe von `main` (Worker, /api/*). Schloss eine alte Lücke: Worker-Änderungen galten als still. `--selbsttest` 20 Fälle. |
| E45 | N29: `.assetsignore` (24.09.) | **Bleibt als Sicherheitsnetz** (wie empfohlen; verworfen: entfernen wie in E36 geplant) – DEPLOY.md „NIEMALS entfernen" (Schutz von `.git/config` bei Rückfall auf `.`). Kein Werkzeug liest sie; der Wurzelteil von `deploy_inhalt.py` ist entfernt (Rückfall auf `.` → rc 2). |
| E46 | N27: Ergebnis (25.09.) | **Geschlossen, nichts übernommen** (AskUserQuestion ~07:55, wie empfohlen). Gemessen: `batches_m09/` ist der Rohbatch von v0.14.0 und längst aufgelöst – je Kennung aus `mig_m09_etappeA/B.py` gegen den Pool: 38 → M08, 28 → M01/02/03/07 (Zielkennungen alle vorhanden), 20 gelöscht (gedeckt), 19 gestrichen (BBiG), 0 ungeklärt. Übernahme hieße 66 Dubletten. `validate_pool`/`idcheck` bewusst nicht gefahren. Der Ordner liegt jetzt unter `referenz/batches_m09/`. `pool_m09_unterricht.json` bleibt `[]`. |
| E47 | N28: Umfang (25.09.) | **Nur der ehrliche Schirm** (wie empfohlen; verworfen: voll nach Plan · N28 zurückstellen). Bereich `unterricht` sagt selbst, dass kein M09-Stoff da ist. **Ziehung (`buildM09Klausur`) und Migration v1→v2 (`m09Historie`, `m09UsedIds`, E25) erst, wenn Fragen kommen** – sonst ein Zweig ohne Aufrufer (SCHIENE_NEU §5). Lernstand unberührt. |
| E48 | N28: Schiene und Text (25.09.) | **„Klausurvorbereitung", direkt nach „Üben"** (AskUserQuestion ~08:00, wie empfohlen; Name wie Gebiet M9, Platz wie alte App, Symbol GraduationCap). Leertext **gemessen + Herkunft**: Zahl aus `unterrichtsBestand`; bei 0 „Gerade kein Klausurstoff." mit Hinweis auf M01–M03/M07/M08; bei >0 die Zahl und „Üben und Klausur … noch nicht gebaut". |
| E49 | N34: Werkzeuge (25.09.) | **Direkt aus `kern/*.ts`** (AskUserQuestion ~08:40, wie empfohlen; verworfen: eigener JS-Bau des Kerns · Werkzeuge auf `referenz/logik.js`). Gemessen: Node 26 laedt `.ts` nativ, auch per `require` aus `.js` – **nur mit Endung `.ts` im Import** (ohne: „Cannot find module"). ⛔ Kern-Dateien, die ein Werkzeug laedt, importieren daher relativ mit `.ts`, nie `@/`. CI von Node 22 auf **24** (T0). |
| E50 | N34: Schnitt (25.09.) | **T0–T6, je ein Commit mit `check.sh` gruen und Push, ein Release am Ende (T6)** (wie empfohlen). T0 Referenz einfrieren · T1 Tabellen · T2 Bewertung · T3 Lernen · T4 Simulation · T5 Generatoren · T6 Glossar/Abkuerzungen/Spickzettel als Daten, Werkzeuge umstellen, Wurzel-Dateien, `@wurzel` und die 10 Suiten (b) weg, Arbeitsregel 1 „Gerechnet wird in `kern/`". Je Schritt: uebersetzen → Gleichheitstest gegen `referenz/` → Importe → Sabotage. |
| E51 | N34 T1: Tabellen (25.09.) | **Liste + Datenkonstanten, Typ-Daten ohne `grade`, TS-Module nach Thema** (AskUserQuestion ~21:35, alle wie empfohlen; verworfen: nur die Liste · TYP_META erst mit T2 · eine Datei · JSON – verliert die Begruendungs-Kommentare, z. B. „GEMESSEN, NICHT GESETZT" an `stufeMinKandidaten`). Ort `kern/tabellen/*.ts`, sie importieren nichts. |
| E52 | N34 T2: Bewertung (26.09.) | **Bewertung + Zahlen-Hilfen, alle Aufrufer in T2** (AskUserQuestion ~17:40, beide wie empfohlen; verworfen: nur Bewertung – `bewertung.ts` haette `L` importieren muessen · Aufrufer erst spaeter – zwei Bewertungen bis T6). Ort `kern/bewertung.ts` (22 Bewerter, Hilfen, `TYP` = T1-Daten + Bewerter, `grade`, `gradeSim`) und `kern/zahlen.ts` (`rundeAuf`, `runde2`, `toleranzFuer`, `zahlAusText` – T5 nutzt sie mit). |
| E53 | N34 T3: Lernen (26.09.) | **Vom Chat entschieden** (Nutzer: „40 Minuten selbstaendig, Fragen zurueckstellen"; nach dem Muster von E51/E52): `kern/lernen.ts` (Deck-Ziehung, Gebiet/Thema, Gewichtung, Bereitschaft, adaptive Stufe, Fehler-Deck, `dayKey`) + `kern/zufall.ts` (`shuffle`, `pick`, `pickGewichtet` – T4/T5 teilen sie); alle Aufrufer in T3. ✅ **Vom Nutzer bestaetigt** (26.09. abends, AskUserQuestion). **Reihenfolge danach: erst T5 (Generatoren/Instanziierung), dann T4 (Simulation)** – Nutzer-Entscheid, damit `baueAP1Pruefung` ohne Zwischenweg ueber `logik.js` umzieht. |
| E54 | N34 T5: Generatoren (26.09.) | **Zwei Dateien, alle Aufrufer in T5** (AskUserQuestion ~19:45, beide wie empfohlen; verworfen: eine Datei – Parser und Wuerfel gemischt · drei Dateien – Parser eigens · Aufrufer spaeter – zwei Fassungen bis T6). Ort `kern/rechenaufgabe.ts` (Formel-Parser, Werte ziehen, Zahlen deutsch schreiben, Platzhalter, Schritte, `instanziiere`) und `kern/generatoren.ts` (`gen*`, `netzplanBerechne`, `ganttBerechne`, `zahlNach`, `GENERATOREN`). |
| E55 | N34 T4: Simulation (26.09.) | **Eine reine Datei `kern/pruefung.ts`, `logik.ts` bleibt bis T6** (AskUserQuestion ~20:40, beide wie empfohlen; verworfen: alles in `simulation.ts` – importiert `@/daten`, nicht Node-ladbar · zwei Dateien mit Note/Ergebnis in `bewertung.ts` · `logik.ts` schon jetzt entfernen – greift T6 vor). `simulation.ts` bleibt App-Schicht (Pool, Faelle, Lernstand). Seit T4 rechnet die App nichts mehr ueber `L`; `istLogik` prueft `validateFragen`. |
| E56 | N34 T6: Schnitt und Daten (26.09.) | **Drei Teile, je Commit mit `check.sh` gruen und Push** (AskUserQuestion ~21:05, alle wie empfohlen): **T6a** `validateFragen` → `kern/validierung.ts`, Werkzeuge ueber `tools/kern.js` auf `kern/*.ts` · **T6b** Glossar, Abkuerzungen, Spickzettel als `kern/tabellen/*.ts` (Kommentare wandern mit; `build_spick.py` schreibt `tabellen/spickzettel.ts`), `@wurzel` und `logik.ts` weg · **T6c** die 10 Suiten (b) und die Wurzel-Dateien weg, `check.sh`, Arbeitsregel 1, **Release 2.2.1** (Patch: fuer den Lerner nichts Sichtbares). Verworfen: ein Stueck · JSON (verliert Kommentare) · 2.3.0 / kein Release. `normText`/`duplikatScan` wandern NICHT mit – kein Aufrufer ausser logik.js selbst (gemessen). |
| E57 | N34 T6c: Waechter nach dem Schnitt (27.09.) | **Schnell-Check = billige Guards + vitest `neu/src/kern`; Determinismus 2b entfaellt** (Gleichheitstests wuerfeln geseedet) · **Daten-Tabellen: Form statt Referenz** – Spickzettel bleibt zeichengleich mit `99_Spickzettel.md`, Glossar/Abkuerzungen nur noch auf Form (Felder, nicht leer, eindeutig) (AskUserQuestion ~10:00, beide wie empfohlen; verworfen: nur Guards · test_didaktik · referenz-Vergleich behalten – jede bewusste Datenaenderung haette eine Testanpassung gebraucht). |
| E58 | N35: Schnitt (27.09.) | **Drei Teile, je Commit, kein Release** (AskUserQuestion ~10:15, wie empfohlen): **N35a** START_PROMPT – Bloecke zur alten App verbatim ins Archiv (`rotiere.py`), veraltete Saetze ersetzen · **N35b** `_to_delete/` sichten (Liste + Nutzer-OK vor dem Loeschen) · **N35c** `.claude/` in die Ablage (E24). Verworfen: nur N35a · ein Stueck. |
| E59 | N36: Plugin (27.09.) | **Plugin „fisi" nur mit den zwei Skills** (`fisi-lernapp`, `token-wache`), Quelle `tools/plugin/fisi/`, Bau `tools/plugin/packen.py` (Nutzer: „mach nur die skills"; Name wie empfohlen). **Die Training Shell bleibt `.mcpb`** – einziger Weg zu Tests/git/Push, Plugin-Server mit Einstellungen ungemessen (`user_config_unsupported`), `${HOME}` wurde am 26.09. woertlich durchgereicht. Verworfen: Skills + Server · Test-Plugin fuer den Server vorab. |
| E60 | N37: Code-Qualitaet (27.09.) | **Alle sechs Vorschlaege der Neupruefung, in sechs Teilschritten U1–U6, je Commit mit `check.sh` gruen und Push, ein Release 2.2.2 am Ende** (Nutzer „mache alles"; AskUserQuestion ~12:00, alle wie empfohlen): Schema-Quelle = `tools/schema/frage.schema.json`, TS-Typen daraus GENERIERT (json-schema-to-typescript, nur devDependency), `validierung.ts` bleibt Laufzeitpruefung, ein Test haelt beide deckungsgleich · Referenz-Regel „je Fall": `referenz/` bleibt eingefroren, bei bewusster Regelaenderung wird genau der betroffene Gleichheitstest auf eine Eigenschaft umgestellt und die Abweichung dort benannt. Verworfen: valibot im Kern · Typen von Hand · alle Gleichheitstests jetzt umstellen · 2.3.0 / kein Release. |
| E61 | Befund aus BUILD_LOG 71 (27.09.) | **`validateFragen` bleibt wortgleich zur alten App** – `gebiet`, `modul`-/`id`-Muster und `thema` prueft zur Laufzeit weiter NUR das Schema in `check.sh` vor jedem Deploy (AskUserQuestion 13:58, wie empfohlen). Begruendung: der Pool kommt nur ueber den Deploy herein, und dort ist das Schema Pflicht. Verworfen: den Kern mitpruefen lassen (bewusste Regelaenderung gegen E60 „je Fall"). |
| E62 | Lernstand-Inhalt (27.09.) | **`pruefe` prueft bei zwoelf Feldern auch den INHALT** (Nutzer 16:56 „ja" auf (b)+(a), nach Rueckfrage „hat b einen Nachteil"): `lastShown`, `simUsedIds`, `gebiete`, `themen`, `module` (Text), `antworten`, `statistik`, `dailyCounts`, `themaLevel`, `themaTrack`, `fehlerDeck`, `simHistorie`. Verworfen wird nur der EINZELNE Eintrag, gemeldet als Reparatur → `lade` sichert den Rohtext (E26), Einstellungen zeigen es (E28). Geprueft wird nur, womit die App RECHNET (`simHistorie`: nur `prozent`; `richtig <= gesamt` nicht). Anlass: auch eine geladene Lernstand-Datei ging nur durch die Art-Pruefung. Verworfen: (a) allein (Annahme ungeprueft), (c) so lassen. |
| E63 | N38: Leistung + Code (28.09.) | **Hülle UND App vor dem Pool** (löst E31 ab; Nutzer: P1–P4 und Q1, Q2, Q4 per AskUserQuestion, alle gewählt): die App zeichnet sofort, nur Schirme, die Fragen brauchen, warten mit Ladezustand; der Pool wird per `modulepreload` parallel geholt. Anlass gemessen (Lighthouse 12, mobil, live, 28.09.): Score 65, LCP 5,5 s, TBT 470 ms – die Startseite erschien erst nach dem Pool (647 KB Übertragung, Start erst bei 566 ms), danach ein Task von 396 ms. |
| E64 | N38: Referenz (28.09.) | **E60 bleibt: Q3 („Referenz ablösen, alle Gleichheitstests umstellen“) gestrichen** (AskUserQuestion, wie empfohlen). Die 17 Gleichheitstest-Dateien kosten nichts, solange keine Regel bewusst geändert wird. |
| E65 | Komplettpruefung (09.10.) | **ND1 + ND4 umgesetzt, Semgrep mit FESTEN Regeln** (Nutzer „1,4 mit Semgrep"): semgrep-rules an einem Commit, Auswahl security/nicht-audit/MEDIUM+HIGH (76 Dateien), rot bei jedem Fund, Release/Deploy warten auf den Job. |
| E66 | Oeffentliches Repo (09.10.) | **Neues oeffentliches Repo mit frischer Historie, gleicher Name; das alte wird `…-archiv` (privat)** (AskUserQuestion, je wie empfohlen). Katalog-OCR (©-Vermerk des Katalog-Herausgebers) bleibt privat in `../Buch`. **Lizenz: keine – alle Rechte vorbehalten.** |
| E67 | Code-Qualitaet 10 (09.10.) | **Umfang App UND Werkzeuge** (`neu/src` + `tools/` + `check.sh`) – Nutzer gegen die Empfehlung „nur App". Zielwerte: PLAN N43. |
| E68 | Alarm (09.10.) | **Live-Fehler und Ausfaelle melden als GitHub-Issue** (taeglicher Zeitplan-Job), nicht per Cloudflare-Mail. |
| E69 | Release ND1 (09.10.) | **Kein eigenes Release fuer ND1** – 2.3.3 mit der naechsten Etappe (N40). **Ueberholt (O2, PLAN_UMZUG_V3):** `v2.3.3` kam am 10.10. (BUILD_LOG 124); das erste Tag im neuen Repo ist `v2.13.1` (26.11.2026). |
| E70 | Push-Weg (09.10.) | **Weiter direkt auf main**; der Regelsatz sperrt nur Force-Push und Loeschen, keine PR-Pflicht. |
| E71 | Mutationstest (09.10.) | **Stryker naechtlich + vor jedem Release**, Issue wenn der Wert sinkt; nicht bei jedem Push. |

⛔ **E1 ändert den Maßstab für alles Weitere.** Bis zum 16.09. galt: „die alte App bleibt das, was
beim Lerner läuft" (so steht es in `SCHIENE_NEU.md`, und für den Zeitraum der Umstellung gilt es
weiter). Ab jetzt ist das Ziel, dass der Neubau diese Rolle übernimmt. **Solange nicht umgeschaltet
ist, bleibt die alte App unangetastet** — was in ihr geändert wird, wird gemessen (45 Suiten,
DOM-Schnappschuss), wie bisher.

---

## 2. Die Etappen, in dieser Reihenfolge

⚠️ **Ab N26 gilt die Reihenfolge aus E18** (Abschnitt „DIE REIHENFOLGE AB 22.09.2026" unten).
Die Reihenfolge ist begründet, nicht beliebig: **zuerst, was der Nutzer sofort benutzen kann**
(Auslieferung), dann **was inhaltlich fehlt**, dann **was aufräumt**.

### N18 — Parallel ausliefern (E2)
**Ziel:** Der Neubau ist unter einem eigenen Pfad erreichbar, ohne die alte App anzufassen.
**Zu messen, bevor gebaut wird:**
* Wie wird heute ausgeliefert? (`.assetsignore` schließt `neu/` aus — deshalb kam bisher nichts an;
  Worker/Pages-Konfiguration lesen, nicht raten.)
* Fängt `sw.js` der alten App Pfade ab, die dem Neubau gehören? Der Service Worker cached
  aggressiv — ein fremder Pfad darf nicht in seinem Netz hängenbleiben.
* `vite.config.ts` braucht `base` passend zum Pfad, sonst zeigen die Asset-Verweise ins Leere.
**Abnahme:** Die Seite lädt unter dem neuen Pfad im echten Browser, Konsole leer, ein Lernstand aus
der alten App wird gelesen (derselbe Schlüssel), `check.sh` grün, CI grün.
⚠️ **Der Lernstand ist die einzige unersetzliche Sache im Projekt.** Vor dem ersten Parallelbetrieb
wird geprüft, dass beide Fassungen `STAND_VERSION` gleich behandeln und keine die Felder der
anderen verwirft.

### N19 — Die Rückseite vollständig (E4)
`erklaerungLang` und `verweis` auf der Karteikarte. Heute zeigt der Neubau nur `erklaerungKurz` —
der größte inhaltliche Verlust gegenüber der alten App.
**Zu messen:** Wie viele Fragen tragen `erklaerungLang`, wie viele `verweis`? Wohin zeigt der
Verweis (`MODUL_DATEI`), und ist das Ziel im ausgelieferten Stand überhaupt vorhanden?
**Abnahme:** Beide Felder erscheinen nach dem Prüfen; eine Frage ohne sie sagt das selbst, statt
leer zu bleiben. Sabotage je Feld.

### N20 — Stern, „Frage melden" und der Schirm `markiert` (E3, E4, E8, E9)
Gehören zusammen: der Stern schreibt `S.markiert`, der Schirm liest es.
**Zu messen:** Was genau schreibt die alte App beim Melden (`app_frage.js`), und wohin?
**Abnahme:** Markieren überlebt das Neuladen, der Schirm zeigt genau die markierten Fragen, das
Entfernen wirkt sofort. Melden legt denselben Eintrag an wie die alte App.
**Geteilt am 17.09.:** **N20a** lokal (Stern im Kartenkopf, Melden, Schirm in der Schiene, „Markierte
üben", Export) · **N20b** online (E8): Worker-Route `/api/*` (`run_worker_first`), D1-Tabelle,
Annahme nur gültiger Kennungen, Längengrenzen, Mengenbremse, **keine IP, kein Name**; Warteschlange
offline; geschützte Ansicht mit Schlüssel (Worker-Secret); Abruf für den Chat.
⚠️ **Vorbedingung N20b:** `npx wrangler login` durch den Nutzer (erledigt 17.09.; Betrieb: `DEPLOY.md`). `.assetsignore` bleibt Pflicht –
der Worker darf nichts ausliefern, was sie heute sperrt (`deploy_inhalt.py`).

### N21 — Die Tagesserie (`serie`) (E3)
⚠️ **Nicht zu verwechseln mit der Themen-Serie (N11), die gebaut ist.** Die Tagesserie zieht **5
Fragen aus dem schwächsten Gebiet**: zuerst zwei aus dem Fehler-Deck, dann frische, dann der Rest —
anschließend gemischt über die Fragetypen (`mischeTypen`), damit nicht fünfmal dasselbe kommt.
**Die Ziehungsregel gehört nach `kern/`**, nicht in den Schirm; `schwaechstesGebiet()` ebenso.
**Abnahme:** Über viele Anläufe kommt die Serie aus dem gemessenen schwächsten Gebiet, enthält
höchstens zwei Deck-Fragen, wiederholt keine Frage, und `serieDone` merkt sich den Tag.

### N22 — Startseite (`start`) und Einzelfrage (`frage`) (E3)
Die Startseite ist das Kachelmenü mit Badges (fällige Karten, „neu"-Markierungen, Serie-schon-heute).
Die Einzelfrage-Ansicht ist der Direktaufruf einer Frage über ihre Kennung.
**Zu klären beim Bauen:** Die Schiene bleibt; die Startseite tritt daneben, nicht an ihre Stelle.
**Abnahme:** Jede Kachel führt in ihren Bereich, jede Zahl auf einer Kachel ist gemessen (kein
Platzhalter — die Lehre aus N8).

### N23 — Glossar-Tooltips und SVG-Zoom (E4)
Begriffe im Fragetext antippbar (#53, höchstens zwei Treffer je Frage, **Leak-Schutz**: kein
Begriff, der in einer Antwortoption oder Musterlösung vorkommt), und die Lupe auf Fragenbildern.
⛔ **Die Auswahlregel steckt in `app_glossar.js`** (`glossarListe`, Regex je Begriff). Sie ist eine
**Regel** — sie wird gelesen, nicht nachgebaut: `app_glossar.js` trägt seit N14 einen UMD-Ausgang,
die Funktion wird dort ergänzt oder mitexportiert.
**Abnahme:** Auf einer gemessenen Frage erscheinen genau die Begriffe, die die alte App markiert;
der Leak-Schutz wird an einem gebauten Fall geprüft.

### N24 — Einstellungen nachziehen (E4; Umfang am 18.09. geteilt → E15)
`simDauerMin`, `relevanzGewichtung`, `ariaAltTexte`, Abruf-Umschalter (`abrufAn`).
**Jeder Schalter braucht eine Wirkung, die man messen kann** — ein Schalter, der nur im Lernstand
steht, ist Zierde (die Lehre aus „eine Sperre, die nichts sperrt").
⚠️ **VORABMESSUNG 18.09.2026 — die sieben Schalter sind NICHT gleich weit** (Tabelle: BUILD_LOG
18.09. (3)): `glossarTip` ist mit N23 fertig · `markierenAn` bleibt ohne Schalter (E9) ·
`simDauerMin` (`Simulation.tsx`) und `relevanzGewichtung` (`ziehen.ts`) **wirken schon** und brauchen
nur ein Bedienelement · `ariaAltTexte` und `abrufAn` **stehen nur im Lernstand und wirken nirgends**.
**Der Bauplan, an gemessenen Stellen:**
* **Abruf-Übung:** ein Prop an `Karteikarte` (wird aus `Ueben.tsx` exportiert; daran hängen
  Tagesserie und Markiert), die Regel nach `kern/` über `wirkTyp` (mc/mehrfach/dropdown).
  ⛔ Nicht in `Einzelfrage.tsx`, nicht in `Simulation.tsx`, nicht bei einer Karte aus dem Verlauf.
* **`ariaAltTexte`:** `svgAltFuer` neu in `kern/`, dazu EINE Beschriftungsregel, die `Ueben.tsx`,
  `Simulation.tsx` und `Hotspot.tsx` gemeinsam benutzen (heute beschriftet jede Stelle für sich).
**Abnahme:** Je Schalter ein Test, der die Wirkung zeigt, nicht nur den gespeicherten Wert; dazu der
Gleichheitstest gegen `app_util.js` in node:vm (Muster: `glossartip.gleichheit.test.ts`).

### N24b — Die Typ-Hilfe und ihr Schalter (E4, E15)
⛔ **`typHilfeAus` ist kein Schalter, dem die Wirkung fehlt — die Typ-Hilfe gibt es im Neubau gar
nicht.** Die alte App führt **10** „So geht's"-Texte (`TYP_HILFE` in `app_ui.js`: zuordnung,
reihenfolge, matrix, beschriftung, hotspot, baukasten, trace, konsole, rechenassistent,
kalkulation), zeigt sie über der Lösung, lässt sie je Typ über ein „nicht mehr zeigen"-Häkchen
abschalten (`S.typHilfeAus[typ] = true`) und hat in den Einstellungen einen Knopf, der alles
zurückholt. ⚠️ In der Abruf-Übung bleibt sie ABSICHTLICH sichtbar — sie verrät keine Lösung
(`app_loeser.js`, Zweig `typ-hilfe`). ⛔ Nicht in der Simulation.
**Abnahme:** die Hilfe erscheint je Typ, das Häkchen wirkt sofort und übersteht das Neuladen, der
Zurücksetzen-Knopf holt alle zurück.

### N25 — shadcn: Schnappschuss, dann jeden Schirm passend neu komponieren (E5, E16)
**Vorabmessung 21.09.2026** (`neu/src`, ohne Tests und `components/ui`): **16 `<input>`, 20 `<button>`,
6 `<table>`, 11 `<details>`, 5 `<select>`, 2 `<textarea>`, 9 `<label>`**, 14 handgebaute `role`
(switch/radio/radiogroup/checkbox). Installiert: badge, button, card, progress, scroll-area (0 Nutzer),
separator, tabs, tooltip. CLI **4.21.0**, Stil **radix-nova**; alle unten genannten Bausteine sind dort
abrufbar (`npx shadcn view …` gemessen). ⚠️ Seit 09/2026 importieren die Bausteine `cn` aus dem Paket
`cn` – die 8 installierten tun das schon, **26 App-Dateien noch aus `@/lib/utils`**.
**Geprüft und verworfen:** *Questionnaire* (neu 08/2026) – verwaltet Zustand und Navigation selbst;
bei uns bewertet `logik.js`, und gebucht wird genau einmal je Karte. Zwei Herren über denselben Zustand.

**Werkzeug der Etappe: ein Schnappschuss, der die BEDEUTUNG festhält, nicht die Klassen.** Je Bereich
und je Fragetyp-Karte der Barrierefreiheits-Baum (Rolle, Name, Zustand, Reihenfolge) als Datei;
vitest vergleicht (`toMatchFileSnapshot`), also läuft er in `check.sh` 4f mit. Ein Klassenwechsel ist
unsichtbar, ein verlorener Name oder eine verschwundene Rolle wird rot. **Jede Änderung am Schnappschuss
wird im Diff gelesen und im BUILD_LOG begründet.**

**Teilschritte – jeder mit eigenem Commit und grünem `check.sh`:**
* **P0 Schnappschuss** (Werkzeug oben, erst gegen einen Fall mit bekannter Antwort prüfen).
* **P1 Fundament:** App-Dateien auf `cn` aus dem Paket, `lib/utils` nur noch, wenn es sonst etwas
  trägt · die 8 installierten auf den aktuellen radix-nova-Stand heben (Diff lesen) · `scroll-area`
  entfernen · neu: field, input, input-group, textarea, native-select, radio-group, checkbox, switch,
  label, table, collapsible, accordion, alert, empty, item, toggle-group, button-group, dialog.
* **P2 Einstellungen** (→ **Release**): FieldSet/FieldGroup je Abschnitt; Schalter als `Field`
  horizontal mit `Switch`; Prüfungsteil als **Choice Cards** (RadioGroup in FieldLabel); Zahlen als
  Input/InputGroup mit Einheit; Datum `Input type=date`.
* **P3 Fragetypen:** Auswahl als Choice Cards (RadioGroup / Checkbox) · Richtig-Falsch-Zeilen als
  ToggleGroup · alle `<select>` als NativeSelect (der Grund aus `Dropdown.tsx` – kein Popover –
  bleibt erfüllt) · Eingaben als Input, Konsole als InputGroup mit Prompt · Freitext als Textarea ·
  Tabellen als Table, Kreuztabelle mit Checkbox · Reihenfolge mit ButtonGroup.
* **P4 Karte** (→ **Release** zusammen mit P3): Urteil, Abruf-Hinweis und Typ-Hilfe als **Alert** ·
  Rückseite und Melden als **Collapsible** · Lupe über shadcn **Dialog** · Kennung als Button (link).
* **P5 Listen und Leerzustände:** Markiert, Fehler-Deck, Meldungsliste als **Item**-Listen, leere
  Zustände als **Empty**, Filter der Meldungsliste als ToggleGroup, Schlüssel als Input.
* **P6 Nachschlagen:** Glossar und Spickzettel mit InputGroup-Suche und **Accordion**, Tabellen
  als Table; Gantt/Netzplan/Simulation-Auswertung: Table, Collapsible/Accordion, Field.
* **P7 Aufräumen + Wächter** (→ **Release**): `check.sh` meldet jedes rohe `<input|select|textarea|
  table|details>` außerhalb `components/ui` – **mit einer Liste der Ausnahmen, je mit Grund**
  (z. B. die Lücke mitten im Satz, die Klickzonen über dem Hotspot-Bild). Gegenprobe vor dem
  ersten Urteil.

⛔ **Die Rollen und Namen, an denen die Tests hängen, sind Vertrag** – ein Umbau, der
`getByRole("radio", { name })` bricht, ist erst fertig, wenn der Grund im BUILD_LOG steht.
⛔ **Bewertet wird weiter nur in `logik.js`**; die Antwortform je Typ (`kern/antwortform.ts`) ändert
sich durch keinen Baustein.
**Abnahme je Teilschritt:** Schnappschuss unterscheidet sich nur dort, wo es gewollt und begründet
ist · 45 Suiten + vitest grün · bei P2/P4/P7 Release mit gemessenem Push.

#### N25 — ARBEITSANLEITUNG FÜR P3 BIS P7 (geschrieben 21.09.2026 nach P2, für jeden Chat und jedes Konto)

⛔ **Stand steht nicht hier** – welcher Teilschritt offen ist, sagt die Schlusszeile „Damit offen" des
letzten `BUILD_LOG.md`-Eintrags. Hier steht nur, **wie** jeder Teilschritt gebaut und abgenommen wird.
**Vorbild ist P2** (`neu/src/schirme/Einstellungen.tsx`): Abschnitt als Card mit `h2`, darin
`FieldGroup`/`Field`; Name über `FieldLabel`/`aria-labelledby`, Erklärung über `aria-describedby`.

**A. DER ABLAUF JE TEILSCHRITT (in dieser Reihenfolge, jeder Punkt ist in P0–P2 schon einmal schiefgegangen):**
1. **Vor dem Anfassen die Verträge lesen:** `grep` in `neu/src/**/*.test.tsx` nach Rolle/Name/`data-teil`
   der Datei, die umgebaut wird. ⛔ **`data-teil` ist ein Anker für Tests** – beim Neukomponieren
   mitnehmen (P2: `meldungen-export` fiel weg, `markiert.jsdom` wurde rot).
2. Umbauen – aus den Bausteinen in `neu/src/components/ui/` (alle 18 installiert, P1). Fehlt einer:
   `cd neu && npx shadcn@4.21.4 view <name>` (prüft, ob er im Stil radix-nova existiert), dann
   `npx shadcn@4.21.4 add <name> --yes` (das Paket ist keine devDependency mehr, braces-Alarm; npx laedt es ad hoc). ⚠️ `shadcn add` für **viele** Bausteine im Hintergrund fahren (60-s-Deckel).
3. `cd neu && npx tsc -b --noEmit`.
4. **Schnappschuss:** `NO_COLOR=1 npx vitest run src/huelle/schnappschuss.jsdom.test.tsx` → rot ist
   erwartet. **Nur die betroffenen** übernehmen: `… -t "<name>" -u`, dann **`git diff src/huelle/__schnappschuss__/`
   LESEN** und jede Änderung im BUILD_LOG begründen. Eine verschwundene Rolle, ein doppelter oder
   zusammengeklebter Name ist ein Befund, keine Kleinigkeit (P2 fand beides).
5. **VOLLER vitest-Lauf im Hintergrund**, nicht nur „betroffene" Dateien (P2-Lehre):
   **`bash tools/hinter.sh vt 'cd neu && NO_COLOR=1 npx vitest run --reporter=dot'`**, dann `bash tools/warte.sh vt 50` (N30).
6. **Neue Tests nur für NEUES Verhalten** (z. B. Name ≠ Beschreibung) – und je neuem Test eine
   **Sabotage** mit **`python3 tools/sabotage_vt.py --datei … --alt … --neu … --test …`** (N30; Muster
   genau 1×, Datei immer wiederhergestellt, rot = bestanden, rc 5 = kein Testlauf, rc 7 = Absturz).
7. **Sichtprüfung im echten Browser**, Desktop 1280 und Handy 390: **`tools/sichtpruefung/`** –
   Aufrufe, Fallen und Grenzen stehen in dessen `LIESMICH.md` (seit 21.09. im Repo; vorher lag das
   Werkzeug in `_to_delete/`, also ungesichert). Kurz: `v2/` bauen, `git archive HEAD v2` als
   Vergleichsstand, zwei `http.server`, `node tools/sichtpruefung/p4.js` bzw. `typen.js`, Konsole
   prüfen — **und die Screenshots ANSEHEN** (`device_stage_files` → `Read`).
   ⛔⛔ **DIESER SCHRITT IST NICHT ERSETZBAR: in jsdom ist jede Größe null.** „Element da, aber auf
   0×0 zusammengefallen" sieht kein vitest-Test — so blieb die leere Lupe von N23 bis P4 stehen.
   Ohne Rechner: nach dem Push die Live-Seite `…/v2/#<bereich>` im eingebauten Browser.
8. Sollwert `check.sh` 4f nachziehen (Zeile „Sollwert …", Untergrenze ~15 unter der gemessenen Zahl).
9. **Bei Release:** **`bash tools/release.sh <x.y.z> --text <datei>`** (N30, erst `--trocken`) macht ERST Bump (`neu/package.json` + Lock, seit N29 Teil 2 = E41; CHANGELOG, Standzeile
   „PUSH OFFEN"), **DANN** `v2/` bauen (das Bündel trägt die Version – sonst driftet es sofort),
   dann `git add -A neu v2 …` (**`deploy_inhalt.py` sieht neue Dateien erst nach `add`**) und prüft das Bündel – **ab hier von Hand:** `check.sh`
   im Hintergrund → ALLES GRÜN → commit → push → CI (`ci2.sh` im Hintergrund, braucht > 55 s) → Tag
   (`git ls-remote --tags origin v<x>`) → Live (`curl …/sw.js`, `…/v2/` lädt dasselbe `index-*.js`
   wie `v2/index.html`) → Standzeile „PUSH DURCH", eigener Commit.

**B. DIE VERTRÄGE DER FRAGETYPEN (P3) – `neu/src/fragetypen/eingabe.test.tsx` bedient JEDEN Typ über diese
Rollen/Namen und wertet mit `L.grade`. Wer sie bricht, bricht den Gleichheitsbeweis:**
| Typ | Datei | wird bedient über | Baustein (Ziel) |
|---|---|---|---|
| mc | `Auswahl.tsx` | `radio` mit Namen = Optionstext | Wahlkarten: `RadioGroup` + `RadioGroupItem` in `FieldLabel` |
| mehrfach | `Auswahl.tsx` | `checkbox` mit Namen = Optionstext | Wahlkarten mit `Checkbox` |
| dropdown | `Dropdown.tsx` | Label `Lücke i`, `selectOptions` | `NativeSelect` (kein Popover – Grund steht im Dateikopf) |
| zuordnung | `Zuordnung.tsx` | Label `Zuordnung i` | `NativeSelect` |
| hotspot | `Hotspot.tsx` | `button` mit Namen = Zonen-Label (sonst „Zone i“) | **Ausnahme:** Klickzonen-SVG bleibt handgebaut |
| mtf | `Einfach.tsx` | `radio` „Aussage i: wahr“ / „… falsch“ | `ToggleGroup type="single"` je Aussage – ⚠️ vorher an EINEM Fall prüfen, dass Radix hier `radio` vergibt, sonst `RadioGroup` |
| fehlersuche | `Einfach.tsx` | `getAllByRole("radio")` = eine je Zeile, Index = Zeile | `RadioGroup` |
| szenario2 | `Einfach.tsx` | `radiogroup` „Schritt 1“/„Schritt 2“, darin `radio` nach Index | `RadioGroup` |
| reihenfolge | `Reihenfolge.tsx` | `listitem` + Knopf „Schritt n nach oben" | Liste + `ButtonGroup` (`Button size="icon-sm"`) |
| lueckentext | `Lueckentext.tsx` | Label `Lücke i von n` | **Ausnahme:** Feld mitten im Satz; nur Stil an `Input` angleichen |
| konsole | `Konsole.tsx` | Label `Befehl i: <prompt>` | `InputGroup` mit Prompt als `InputGroupAddon` |
| trace | `Tabellen.tsx` | Label `<Spalte>, Zelle r` | `Table` + `Input` |
| kreuztabelle | `Tabellen.tsx` | `checkbox` „<Zeile> — <Spalte>" | `Table` + `Checkbox` |
| beschriftung | `Bausteine.tsx` | Label `Stelle n`, `option` | `NativeSelect` |
| baukasten | `Bausteine.tsx` | Label `Lücke n`, `option` | `NativeSelect` |
| matrix | `Matrix.tsx` | Label `Element i`, `option` | `NativeSelect` |
| rechenassistent/kalkulation | `Rechnen.tsx` | Label je Feld | `Field` + `Input`/`InputGroup` (Einheit), Tabelle als `Table` |
| freitext/erklaeren | `Freitext.tsx` | Label „Deine Antwort" | `Field` + `Textarea` |
| (Generator) | `Generator.tsx` | Label `Antwort` / `Antwort i` | `Field` + `Input` |
⛔ **Die Antwortform je Typ ändert sich durch keinen Baustein** (`kern/antwortform.ts`). ⚠️ Radix-
Radio/Checkbox/Toggle sind `<button>` – `gesperrt` heißt dort `disabled`, nicht `readOnly`.

**C. P4–P6, WAS WO HINKOMMT (Ziel, nicht Pflicht – Abweichung im BUILD_LOG begründen):**
* **P4 Karte** (`schirme/Ueben.tsx` Karteikarte, `Rueckseite.tsx`, `Melden.tsx`, `fragetypen/Bildflaeche.tsx`,
  `Kennung.tsx`): `Urteilszeile` → `Alert` (falsch = `variant="destructive"`); Abruf-Hinweis und
  „So geht's" → `Alert` (Haken als `Checkbox` + `Label`, Name „Diese Bedienhilfe nicht mehr zeigen");
  „Eingabe noch nicht gebaut" → `Alert`; `Rueckseite` `<details>` → `Collapsible` (gesteuert über
  `aufklappen`); `Melden` → `Collapsible`, Gründe → `ToggleGroup type="single"` (Vertrag: `radio`
  „Veraltet"/„Tippfehler"…), Text → `Textarea`; Lupe → shadcn `Dialog` + `Button size="icon"`
  (`data-teil="bild-zoom"` bleibt); Stern → `Button variant="ghost" size="icon"` mit `aria-pressed`;
  Kennung → `Button variant="link"`.
* **P5 Listen** (`Markiert.tsx`, `Fehlerdeck.tsx`, `Meldungsliste.tsx`): Einträge als `Item`
  (`ItemContent`/`ItemTitle`/`ItemActions`), leere Zustände als `Empty` (Texte „Noch nichts markiert"
  usw. sind Vertrag), Filter als `ToggleGroup` (Vertrag `radio` „alle"), Schlüssel als `Input type=password`
  (Label „Schlüssel").
* **P6 Nachschlagen** (`Glossar.tsx`, `Spickzettel.tsx`, `Gantt.tsx`, `Netzplan.tsx`, `Simulation.tsx`,
  `Startseite.tsx`, `Statistik.tsx`): Suche als `InputGroup` mit Lupen-Icon; Klapplisten als
  `Accordion type="multiple"` (bei Suche alle offen – heute `open={suche !== ""}`); Tabellen als
  `Table`; Einzelklappen als `Collapsible`; Simulations-Start als `Field` + `Input`; Auswertung als
  `Accordion`. ⚠️ Startseite merkt sich den Klappzustand (`onToggle`) – beim `Collapsible` über
  `open`/`onOpenChange` erhalten.

**D. P7 – DER WÄCHTER:** `check.sh` Abschnitt 4f bekommt eine Prüfung, die jedes rohe
`<input|select|textarea|table|details|button` in `neu/src` außerhalb von `components/ui/` und
außerhalb von Tests meldet. **Ausnahmen in `neu/rohe_elemente.json`** (je Eintrag Datei, Element,
Grund – mindestens: Lückentext-Feld im Satz, Hotspot-Klickzonen, Schiene bis zur Hüllen-Etappe).
⛔ **Gegenprobe vor dem ersten Urteil:** ein rohes `<input>` in eine Datei legen → rot; ein Eintrag
in der Ausnahmeliste → grün; Werkzeug stumm (Datei fehlt) → rot, nicht grün.

### N25b — Die Hülle und die Schiene, mobil (E16: eigene Etappe nach N25) — ✅ DURCH (22.09.2026, v1.38.0)
✅ **ERLEDIGT — nicht erneut planen.** Was gebaut und gemessen wurde, steht im BUILD_LOG-Eintrag
22.09. (31); die zwei Lehren daraus (B164 Ueberlauf hat zwei Richtungen · B165 `min-h-0` staucht
unter min-content) gelten weiter. ⚠️ **Offen blieb nur ein Entscheid:** die Ausnahme
`huelle/Schiene.tsx` in `neu/rohe_elemente.json` — entfristen oder die Schiene doch umbauen.
Der Befund darunter ist die Vorgeschichte und bleibt als Herleitung stehen.
⛔⛔ **BEFUND 21.09.2026 (bei P2 gemessen, Playwright 390 px): `main` ist 554–610 px breit – JEDER
Schirm wird rechts abgeschnitten.** Nicht durch N25 entstanden (Statistik ist unverändert und ebenso
breit). ✅ **AM 22.09.2026 GEMESSEN (BUILD_LOG 30) – DIE URSACHE STEHT FEST, DIE VERMUTUNG WAR FALSCH.**
⛔ **Der Kandidat „shadcn `Sidebar`/`Sheet`" ist damit VOM TISCH: die Schiene ist 56 px breit und
war nie das Problem.** Die Hülle ist ein Grid `grid-cols-[3.5rem_1fr]`, und `1fr` heißt
`minmax(auto,1fr)` – die Spalte schrumpft nie unter die min-content-Breite ihres Inhalts, deshalb
wird `main` bis zu 1186 px breit. Gegengeprobt im Browser: mit `minmax(0,1fr)` fällt `main` in
allen vier gemessenen Bereichen auf genau 334 px (390 − 56).
⚠️ **Eine Zeile genügt aber NICHT:** danach stehen je Bereich noch **2–3 oberste** Elemente über
(die übrigen sind deren Kinder), alle mit demselben Muster `flex:1 min-width:auto` – die Kopfzeile
und je eine Filter-/Zählerleiste. **Die Restarbeit ist `min-w-0` plus Umbruch an diesen Stellen**,
nicht ein neuer Navigationsbaustein. Der Schnappschuss (P0) hält
dabei fest, dass die Navigation ihre Namen behält (`navigation "Bereiche"`, 13 Knöpfe).
⛔ **Handy-Test bietet der Chat nicht an** (Nutzer-Entscheid 27.07.) – gemessen wird mit Playwright.

### DIE REIHENFOLGE AB 22.09.2026 (E17, E18) — sie geht der Aufzählung in diesem Abschnitt vor

⛔ **Stand steht nicht hier** – welche Etappe offen ist, sagt die Schlusszeile „Damit offen" des letzten
BUILD_LOG-Eintrags. Hier steht nur die Reihenfolge und warum.

| # | Etappe | Warum an dieser Stelle |
|---|---|---|
| 1 | **N30** Werkzeuge | Jede folgende Etappe braucht Sabotage, Hintergrundläufe und einen Release. Heute ist alles drei Handarbeit bzw. Einwegskript. |
| 2 | **N26** Rechner | Fertig geplant; berührt den Lernstand nicht (Notizfeld nicht persistent). |
| 3 | **N31** Lernstand neu | **Billigster Moment ist JETZT**: noch kein Lernstand ist etwas wert (E17). Nach dem Umschalten kostet jede Formatänderung eine Migration. |
| 4 | **N32** Robustheit, Leistung, Code | Vor dem Umschalten: eine weiße Seite oder 876 KB gzip beim Start sind beim Lerner sichtbar. |
| 5 | **N33** Offline (PWA) | Die alte App ist eine PWA; der Neubau ohne Offline wäre beim Umschalten ein Rückschritt. |
| 6 | **N29** Umschalten | Erst jetzt ist der Neubau der alten App in allem ebenbürtig, was der Lerner merkt. |
| 7 | **N27 / N28** M09 und Unterricht | Hängen nicht am Umschalten; nach N29 gibt es keine zweite Fassung mehr, in der die Ziehung stehen müsste. |
| 8 | **N34** Kern in TypeScript | Erst nach N29: vorher teilen sich beide Fassungen `logik.js`. |
| 9 | **N35** Doku umbauen | Nach N34, weil erst dann die Regeln des Parallelbetriebs wirklich tot sind. |
| 10 | **N36** Plugin | Nach N35, weil sich dort die Texte der Skills ändern; sonst zweimal bauen. |

### N30 — Werkzeuge für den Neubau (E18)
⛔ **Vorher `WERKZEUGE.md` ganz lesen** – das Werkzeug gibt es meist schon (PFLICHT-Tabelle), und `LEHREN.md` (Messwerkzeug bauen).
* **`tools/sabotage_vt.py --datei F --alt M [--neu E] --test PFAD`** – die Gegenprobe für vitest, die
  SCHIENE_NEU §3 als fehlend nennt. Muster **genau einmal** (sonst rc≠0 ohne Lauf), Datei **immer**
  wiederherstellen (`try/finally`, Prüfsumme davor = danach), vitest nur auf PFAD mit `--reporter=dot`,
  **rot = bestanden**. `newline=""` beim Schreiben, `encoding="utf-8", errors="replace"` beim Lesen der
  Ausgabe. Vorbild: `tools/sabotage.sh` (alte Suiten), `_to_delete/helfer/sab_p2.py`.
* **`tools/hinter.sh <name> <befehl>`** und **`tools/warte.sh <name> [sek≤50]`** – das `nohup`-Rezept aus
  START_PROMPT §2 einmal statt in jedem Chat abgeschrieben; Marke `_to_delete/helfer/<name>.fertig`,
  `warte.sh` gibt den Rückgabewert und die letzten Zeilen aus.
* **`tools/release.sh <version> [--trocken]`** – Punkt 9 der N25-Anleitung **bis vor den Commit**: Bump
  (`app_state.js`, `sw.js`, CHANGELOG), Standzeile „PUSH OFFEN", `v2/` bauen, `git add`, Prüfung, dass das
  Bündel die Version trägt. ⛔ **Commit und Push bleiben Hand** (E10), der Bump wird weiter erfragt.
**Abnahme:** je Werkzeug eine Gegenprobe mit bekannter Antwort (sabotage_vt: ein bekannt tragender Test wird
rot; ein Muster ohne Treffer bricht ab; die Datei ist danach bytegleich) · Einträge in `WERKZEUGE.md` ·
**die N25-Anleitung Punkt 5/6/9 verweist danach auf die Werkzeuge.**

### N26 — Der Taschenrechner, selbst gebaut (E6)
Ein reiner Parser in TypeScript: Tokenizer + rekursiver Abstieg, **kein `eval`, kein
`new Function`** — dieselbe Zusage wie in der alten App. Wissenschaftlich (Wurzel, Potenz, Klammern,
Prozent, Vorzeichen, Speicher), sin/cos/tan im **Gradmaß**, Notizfeld **nicht** persistent,
**keine** Zahlensystem-Umrechnung (Nutzer-Entscheide vom 21.07.2026). Eingebunden nur bei
`rechenassistent`, `kalkulation` und den Zufallsaufgaben beim Üben — **nicht** in der Simulation.
⛔ **RISIKO R1 UND SEINE MESSSTELLE:** Zwei Parser für dieselbe Sache driften. Deshalb gehört zu
dieser Etappe ein **Gleichheitstest in jsdom**, der `app_util.js` lädt (dort ist der
`document`-Lauscher harmlos, weil es nur der Test ist) und **beide Parser über hunderte Ausdrücke
vergleicht** — Zahlen, Klammern, Funktionen, Fehlerfälle, Komma statt Punkt. Ohne diesen Test ist
die Etappe nicht fertig.

#### N26 — ARBEITSANLEITUNG (geschrieben 22.09.2026 nach N25b, für jeden Chat und jedes Konto)

⛔ **Stand steht nicht hier** – wie weit N26 ist, sagt die Schlusszeile „Damit offen" des letzten
`BUILD_LOG.md`-Eintrags. Hier steht, **wie** gebaut und abgenommen wird.
⚠️ **Die Entscheide vom 21.07.2026 sind gefallen** (Umfang oben) – nicht erneut vorlegen.

**DIE REIHENFOLGE — der Gleichheitsbeweis kommt VOR der Oberfläche.** Der Rechner ist die einzige
Stelle des Neubaus, an der eine Regel bewusst ZWEIMAL existiert (E6). Wer zuerst die Tastatur baut,
hat am Ende einen hübschen Rechner ohne Beweis – und R1 ist genau dieser Drift.

* **T1 Der Parser** (`neu/src/kern/rechner.ts`): Tokenizer + rekursiver Abstieg, reine Funktion
  `rechne(ausdruck: string): { wert: number } | { fehler: string }`. ⛔ **Kein `eval`, kein
  `new Function`** – dieselbe Zusage wie in der alten App, und sie ist prüfbar: ein Test liest den
  eigenen Quelltext und sucht beide Namen (Gegenprobe: mit eingebautem `eval` wird er rot).
  **Gradmaß** bei sin/cos/tan, Komma **und** Punkt als Dezimaltrenner, Prozent, Vorzeichen,
  Klammern, Potenz, Wurzel. **Fehler sind Werte, keine Ausnahmen** – jeder Fehlerfall hat einen Text.
* **T2 Der Gleichheitstest gegen `app_util.js`** (`kern/rechner.gleichheit.test.ts`, jsdom):
  lädt die alte Fassung, vergleicht **beide über hunderte Ausdrücke** – Zahlen, Klammern,
  Funktionen, Komma statt Punkt, **und die Fehlerfälle** (leer, `((`, `1/0`, `sqrt(-1)`).
  ⛔ **Ohne diesen Test ist die Etappe nicht fertig** (R1, Abschnitt 5).
  ⚠️ **Der Test sagt selbst, wenn er leer läuft:** er zählt die verglichenen Ausdrücke und fällt
  unter einer Untergrenze durch – sonst meldet eine leere Liste Erfolg (Regel 4 in Abschnitt 4).
  ⚠️ **Wo die beiden sich unterscheiden dürfen, steht als Liste IM TEST, mit Grund je Eintrag.**
* **T3 Die Oberfläche** (`neu/src/schirme/Rechner.tsx` + Einbindung): Tasten als `Button`,
  Anzeige als `Input` (readonly) oder `InputGroup`, Speicher und Notizfeld als `Field`;
  **Notizfeld nicht persistent** (Entscheid 21.07.) – also kein Eintrag im Lernstand.
  ⚠️ **Tastatur bedienbar**: Ziffern, Operatoren, Enter = gleich, Escape = löschen. Die Namen der
  Tasten sind Vertrag (`getByRole("button", { name: "7" })`).
* **T4 Einbinden – nur wo er hingehört:** `rechenassistent`, `kalkulation` und die Zufallsaufgaben
  beim Üben. ⛔ **Nicht in der Simulation** (Entscheid 21.07.) – und das ist ein Testfall, kein
  Kommentar: ein Test öffnet die Simulation und erwartet den Rechner NICHT.
* **T5 Schnappschuss + Sollwert:** `npx vitest run src/huelle/schnappschuss` mit `-u` nur für den
  betroffenen Namen, **Diff lesen und im BUILD_LOG begründen**; Sollwert `check.sh` 4f nachziehen.
* **T6 Sichtprüfung am Bild** (`tools/sichtpruefung/`, 1280 **und** 390 px): Tasten erreichbar,
  nichts über dem Rand, **`rest.js` meldet 0** (es prüft seit 22.09. beide Richtungen).
  ⛔ **In jsdom ist jede Größe null** – dieser Schritt ist nicht ersetzbar.
* **T7 Release v1.39.0** nach dem Ablauf in der N25-Anleitung, Punkt 9 (Bump → `v2/` bauen →
  `git add` → `check.sh` grün → commit → push → CI → Tag → Live → Standzeile).

**JEDE der Etappen T1–T4 bekommt eine Sabotage** (Muster genau einmal ersetzen, Datei immer
wiederherstellen, **rot ist das Bestehen**): beim Parser eine verdrehte Vorrangregel, beim
Gleichheitstest ein absichtlich falscher Wert, bei der Oberfläche ein entfernter Tastenname,
beim Einbinden der Rechner in der Simulation.

### N31 — Der Lernstand des Neubaus, neu aufgesetzt (E17)
**Zu messen, bevor gebaut wird:** wer heute `stand.ts` liest und schreibt (grep `lade`/`speichere`/`aendere`), welche
Tests das Format der alten App voraussetzen (`parallelbetrieb.jsdom`, `stand.gleichheit`, `schalter.gleichheit`).
* **Eigener Schlüssel** (`fisi_ap1_stand`), `version: 1`, das Schema als TS-Typ **plus eine Prüffunktion beim
  Laden**: ein kaputtes Feld wird zur Vorgabe mit Befund, nie zum Absturz. **Migrationen als Kette**
  (`v1→v2 …`), je Schritt ein Test. ⛔ `ap1v2_state` wird nicht mehr gelesen (E17) – und nicht gelöscht.
* **Kein Seiteneffekt im State-Updater** (Lehre N6c, heute verletzt in `useLernstand.aendere`): der Updater
  rechnet nur, geschrieben wird danach. Der Speicherfehler-Banner bleibt.
* **Mehrere Tabs** (R8): heute gewinnt der letzte Schreiber still. ⛔ **Abgelöst durch E27** („EIN Tab schreibt“:
  Sperre, Zuschauer, Übernahme-Knopf mit Rückfrage, `rev` als zweite Sicherung); Tests mit zwei Instanzen.
* **`navigator.storage.persist()`** beim ersten Buchen; das Ergebnis steht in den Einstellungen (gemessen,
  nicht behauptet – wird es verweigert, sagt die App das).
* Die Tests, die das alte Format voraussetzen: auf das neue umstellen oder streichen, **Grund je Datei im BUILD_LOG**.
**Abnahme:** Sabotage je Punkt (Migration übersprungen · Prüfung lässt Unsinn durch · `storage` ignoriert ·
Schreiben wieder im Updater) · Schnappschuss unverändert bis auf die Einstellungen · Release.

### N32 — Robustheit, Leistung und der Code (E23)
* **Error Boundary je Bereich**: ein Wurf zeigt „Dieser Bereich ist abgestürzt – neu laden", Schiene und
  Lernstand bleiben. Dazu **`POST /api/fehler`** im Worker (D1-Tabelle, Migration, Regeln wie `/api/meldung`).
* **Bündel** (gemessen 22.09.: `v2/assets/index-*.js` 3,02 MB, gzip 876 KB, ein Stück, Pool per
  `import.meta.glob` eingebaut): Pool als **eigene Datei** mit Ladezustand; `lazy()` für sim, gantt,
  netzplan, glossar, spickzettel, meldungen, gen; `chunkSizeWarningLimit` zurück auf die Vorgabe.
  **Ziel als Zahl im BUILD_LOG: Einstieg unter 500 KB gzip.**
* **Code** (oxlint 22.09.: 21 Warnungen): `useEffectEvent` statt Ref im Render (`Ueben.tsx:175`,
  `Simulation.tsx:99`) · setState im Effekt (`Meldungsliste.tsx:60`) · wirkungslose `useMemo`
  (`Zuordnung.tsx:24`, `Bausteine.tsx:166`) · `Date.now()` im Render (`Einstellungen.tsx:42`) · `Karteikarte`
  in eine eigene Datei (`Ueben.tsx` hat 722 Zeilen) · `"strict": true` ausdrücklich (TS 6 setzt es nur als
  Vorgabe) · `noUncheckedIndexedAccess` (49 Stellen) · **oxlint mit 0 Warnungen als Prüfung in `check.sh` 4f**
  (vorher messen, ob es dort schon läuft) · `neu/dist/` (7,6 MB, seit 17.09. tot) in die Ablage.
**Abnahme:** Schnappschuss unverändert · Sichtprüfung 1280/390 mit Ladezustand · Sabotage: Wurf in einem
Schirm → nur dieser Bereich fällt · Release.

### N33 — Offline: der Neubau als PWA ✅ (23.09., v1.41.0, E33 – Abnahme `tools/sichtpruefung/offline.js` 8/8)
**Zu messen zuerst:** ob ein Service Worker ohne neue Abhängigkeit reicht (handgeschrieben, Liste der Dateien
aus dem Vite-Manifest) oder ein Plugin nötig ist – Preis beider Wege vorlegen, dann fragen (Arbeitsregel 1).
* Cache-Name = APP_VERSION · Hülle und Pool vorab · **`/api/*` nie cachen** · die Melde-Warteschlange bleibt.
* Manifest und Icons (die der alten App wiederverwenden).
* **Update-Hinweis** „Neue Fassung – neu laden"; ⛔ nie mitten in einer Simulation umschalten.
**Abnahme:** Playwright mit `setOffline(true)` lädt jeden Bereich · Update-Fall gegen zwei Bauten · Release.

#### N27 BIS N29 — WAS JETZT SCHON FESTSTEHT

* **N27 ist eine MESSUNG, kein Umbau** – das Ergebnis wird vorgelegt, der Nutzer entscheidet über
  den Pool. ⛔ **Keine Frage aus `batches_m09/` wandert vorher in den Pool.** (Erledigt, E46: der Batch war längst aufgelöst, nichts übernommen.) Gemessen wird mit den
  vorhandenen Werkzeugen (`validate_pool`, `idcheck`, `pool_query.js`), **nicht mit neuen** –
  vorher `WERKZEUGE.md` lesen, das Skript gibt es meist schon.
* **N28 hängt an N27** und baut den Schirm **auch dann**, wenn der Pool leer bleibt (er sagt es
  dann selbst). ⛔ Die Ziehung ist eine **Regel** und gehört nach `kern/` (TypeScript, mit Referenztest) – seit E17
  gibt es nach N29 keine zweite Fassung mehr, die sie mitbenutzen müsste.
* ~~N29 kommt erst, wenn N18–N28 stehen UND der Neubau im Alltag benutzt wurde.~~ **Überholt durch E17/E18/E21:**
  N29 kommt nach N33, die Suiten ordnet E21 ein, `fragen.js`/`faelle.js` entfallen, sobald kein Leser mehr da ist.

### N27 — M09 prüfen und vorlegen (E7) · ✅ 25.09. gemessen und geschlossen (E46) – der Batch war längst aufgelöst, nichts übernommen
Messen, **ohne etwas zu ändern**: Erfüllen die 105 Fragen in `batches_m09/` das Schema
(`validate_pool`, `idcheck`)? Kollidieren Kennungen mit dem bestehenden Pool? Welche Fragetypen
kommen vor, und sind sie automatisch bewertbar (`m09Bewertbar`)? Gibt es Dubletten?
**Ergebnis wird vorgelegt** — erst danach entscheidet der Nutzer über den Pool.

### N28 — Der Unterricht-Schirm (`unterricht`) (E3) · ✅ 25.09. als ehrlicher Schirm (E47, E48) – Ziehung und Migration offen bis Stoff kommt
⚠️ **Umfang seit E47 (25.09.): nur der ehrliche Schirm.** Ziehung und Migration v1→v2 kommen erst mit echtem M09-Stoff; der Rest dieses Abschnitts gilt dann.
Hängt an N27. Enthält die M09-Klausur (eigene Ziehung `buildM09Klausur`, getrennt von der
AP1-Simulation, eigenes Gedächtnis `m09UsedIds`, breiteres Bewertbarkeits-Kriterium).
⛔ Diese Ziehung ist wieder eine **Regel** — sie gehört nach `kern/` (E17: nach N29 gibt es nur noch eine Fassung),
nicht in den Schirm.
**Wenn der Pool leer bleibt:** Der Bereich wird trotzdem gebaut und sagt selbst, dass kein Stoff da
ist — kein stiller leerer Schirm.

### N29 — Umschalten (neu gefasst am 22.09.2026: E17, E21, E22) · **Teil 1 (Schritte 1–3) ✅ 24.09., v2.0.0 (E34–E37) · Teil 2 ✅ 24.09. (E38–E45) – **N29 ABGESCHLOSSEN**, `check.sh` ~2 min 40 s**
Kommt nach N33 (E18). Die frühere Bedingung „erst nach Alltagsgebrauch" ist mit E17 überholt: die alte App
ist Referenz, nicht Rückfall.
1. **Der Neubau unter `/`** (`base: "/"`); die `#`-Adressen bleiben, `/v2/` leitet auf `/` um.
2. **Die alte `sw.js` stilllegen (R9):** eine letzte Fassung, die sich abmeldet, ihre Caches löscht und die
   Seite neu lädt. **Gegenprobe:** Playwright-Profil mit registriertem altem SW → landet auf dem Neubau.
3. **Auslieferung aus eigenem Ordner** (E22). **Erst messen**, wie heute deployt wird (Workers Builds oder
   Actions, `wrangler.jsonc` `assets.directory: "."`). Ziel: Bau in der CI, kein Bauergebnis im Repo;
   `.assetsignore` und `deploy_inhalt.py` schrumpfen auf das, was dann noch gilt.
4. **Die alte App wird Referenz:** Tag `alt-app-final`, Dateien nach `referenz/` (nicht ausgeliefert); die
   Gleichheitstests des Neubaus zeigen dorthin.
5. **`check.sh`:** die 45 Suiten nach E21 einordnen · Pool-Wächter, die `fragen.js` lesen (z. B.
   `pool_query.js firmen`), auf `pool/*.json` umstellen · `fragen.js`, `faelle.js`, `build_fragen.py`
   entfallen, **sobald `grep` keinen Leser mehr findet**.
6. **Standzeile, Stand-Guard, 4e2b2 und der Push-Takt** auf den Neubau umstellen (die Version kommt dann aus
   `neu/`, nicht aus `app_state.js`).
**Abnahme:** `/` liefert den Neubau · alter SW abgemeldet · Zeit von `check.sh` als Zahl im BUILD_LOG · CI
grün · Release (Major-Bump, vorher erfragt).

### N34 — Der Kern in TypeScript (E17, E49, E50, E51, E52, E53, E54, E55, E56) · T0 ✅ T1 ✅ 25.09. · T2 ✅ T3 ✅ T5 ✅ T4 ✅ T6a ✅ 26.09. · T6b ✅ T6c ✅ 27.09. (v2.2.1) – Stand je Teilschritt: letzter BUILD_LOG-Eintrag
`logik.js`, `app_glossar.js`, `spickzettel.js`, `abkuerzungen.js` (heute über `@wurzel/…` eingebunden, von
den 101 Exporten von `L` die meisten untypisiert) → `neu/src/kern/*.ts` (Tabellen als TS-Module mit ihren Kommentaren, E51). **Je Modul:**
übersetzen → der vorhandene Gleichheitstest gegen `referenz/` bleibt grün → Import umstellen → die Suite
der Sorte (b) aus E21 streichen. Danach heißt Regel 1 in Abschnitt 4: **„Gerechnet wird in `kern/`."**
⚠️ Das ist die größte Etappe; sie wird in Teilschritten je Modul gebaut, jeder mit eigenem Commit.

### N35 — Die Doku auf den Neubau zuschneiden · ✅ 27.09. (N35a–c, E58)
`START_PROMPT.md` ohne die Teile zur alten App (ins Archiv) · `EINSTIEG.md` bleibt der einzige Einstieg ·
SCHIENE_NEU §1 und Abschnitt 4 hier an E17 anpassen · die Regeln des Parallelbetriebs streichen, nicht
mitschleppen · `_to_delete/` (81 MB am 22.09.) sichten · `.claude/` in die Ablage (E24).

### N36 — Ein Plugin für beide Konten (E24, E59) · ✅ gebaut 27.09. (fisi 1.0.0) – Installation in beiden Konten beim Nutzer
`fisi-lernapp` + `token-wache` + der MCP-Server der Training Shell (`tools/training-shell/`, `.mcpb` liegt
schon vor) als **ein Plugin, Quelle im Repo** (`tools/plugin/`), Version im Manifest. Ersetzt die Handpflege
in `tools/skill_nachtraege.md`. ⚠️ Installieren muss der Nutzer in beiden Konten – der Chat baut die Datei.
### N37 — Code-Qualitaet & Architektur (E60) · Stand je Teilschritt: letzter BUILD_LOG-Eintrag
Anlass: Neupruefung 27.09. (`BEFUNDE_AUDIT.md`), Note Code 8,5. Reihenfolge nach Abhaengigkeit, kleine sichere Schritte zuerst:
* **U1 – Kern-Grenze + Stufe-4-Fehler.** `Frage.schwierigkeit` ist `1 | 2 | 3`, der Pool hat 97 Fragen mit 4 und `validierung.ts` erlaubt 4 → Typ auf `1 | 2 | 3 | 4` samt Kommentar. `kern/useLernstand.ts` (React-Hook) nach `huelle/`. `kern/glossar.ts` und `kern/simulation.ts` bekommen den Pool als Parameter statt ihn beim Import zu laden. **Architekturtest:** `kern/**` importiert weder `react` noch `daten/laden|pooldaten|faelle` (Sabotage: je ein Import rein → rot).
* **U2 – Referenz-Regel.** E60 in `SCHIENE_NEU.md` §5 und im Kopf von `testhilfe/altquelle.ts` – alle Gleichheitstests laden ueber `altQuelle`, die Regel steht damit an der Stelle, die jeder von ihnen importiert (statt 13 Kopien).
* **U3 – Eine Quelle fuer das Schema.** `tools/build_schema.js` schreibt zusaetzlich `neu/src/daten/frage.generiert.ts` (json-schema-to-typescript); `check.sh` meldet, wenn die Datei nicht dem Schema entspricht. **Deckungstest:** Schema (ajv) und `validateFragen` urteilen gleich – ganzer Pool + die verdorbenen Fassungen aus `validierung.gleichheit.test.ts`. `SCHEMA.md` verweist auf das Schema statt Felder zu wiederholen (oder wird daraus erzeugt – Entscheid beim Bau, wenn beides moeglich ist).
* **U4 – `Frage` als Union je `typ`.** `daten/typen.ts` nimmt die generierten Typen; der Sammel-Eintrag `[weiteres: string]: unknown` faellt, Typ fuer Typ. **Ratsche:** `check.sh` zaehlt die `as`-Umwandlungen im App-Code (heute 357) – die Zahl darf nur sinken.
* **U5 – Ablauf als Zustandsmaschine.** `Ueben.tsx` (11 `useState`) und `Simulation.tsx` (476 Zeilen, 4 `useEffect`): Ablauf als reiner `useReducer` in `kern/`, DOM-frei getestet; die Schirme zeichnen nur. Schnappschuss-Test (Bedeutungsbaum) muss unveraendert gruen bleiben.
* **U6 – `check.sh` aufteilen.** Waechter in eigene Dateien unter `tools/waechter/`, Aufruf und Ausgabe gleich; Gegenprobe: Ausgabe vorher/nachher zeilengleich (bis auf Zeiten).
* **Release 2.2.2** nach U6 (Patch, fuer den Lerner nichts Sichtbares).

### N38 — Leistung und Code (E63, E64) · Stand je Teilschritt: letzter BUILD_LOG-Eintrag
Anlass: Neupruefung 28.09. (Noten Performance 7, Code 8,5). Messung vorher (Lighthouse 12 mobil, live `/`): **Score 65 · FCP 2,2 s · LCP 5,5 s · TBT 470 ms · CLS 0**; beim Start 121 von 209 KB JS ungenutzt. Jeder Schritt: Lighthouse vorher/nachher, Schnappschuss unveraendert, `check.sh` gruen, Push.
* **P1 – App vor dem Pool (E63).** `huelle/start.tsx` zeichnet `App` sofort; Schirme mit Fragen (ueben, serie, sim, fd, markiert, frage, glossar, stat …) zeigen „Fragen werden geladen …“ bis `poolGeladen()`. `modulepreload` fuer den Pool-Chunk in `index.html`. Fehlerfall wie heute („Nochmal versuchen“). Ziel: LCP < 2,5 s.
* ✅ **P2 (28.09., BUILD_LOG 89: gemessen, geschlossen ohne Code – Nutzer-Entscheid; der Pool-Task ist seit P1 nur noch 61–67 ms, der laengste ist der erste Render der Startseite 235–285 ms bei 4× Drossel, live TBT 100–140 ms)** – Der lange Task. 396 ms nach dem Pool messen (`lies`, Sortieren, Map, Faelle) und aufteilen oder zur Bauzeit vorziehen. Ziel: TBT < 200 ms.
* ✅ **P3 (28.09., BUILD_LOG 89: Einstieg 212 → 164 KB gzip, Grenze 190)** – Schirme lazy. `lazy()` fuer sim, gantt, netzplan, gen, einst, meldungen, spickzettel, glossar (N32 geplant, nie gebaut). Waechter: Einstieg-gzip-Grenze in 4f von 500 auf das neue Ist + Reserve.
* ✅ **P4 (30.09., BUILD_LOG 92: geschlossen ohne Code – Nutzer-Entscheid; der Chunk ist schon 20× `JSON.parse(`…`)`, Vite 8 wandelt grosse JSON-Importe selbst um; Auswerten 19–21 ms laut P2)** – Pool als JSON. Pool-Chunk als `.json` statt JS-Modul (JSON.parse statt JS-Parsen); Service Worker und Offline-Abnahme (`tools/sichtpruefung/offline.js`) nachziehen.
* **Q1 – unsichere `as`.** ✅ Ratsche umgestellt (30.09., BUILD_LOG 92: `tools/as_ratsche.py` zaehlt per oxlint, Grenze 152, Selbsttest an `neu/werkzeug/as_probe`) · ✅ Klasse `T | undefined` 152 → 119 (BUILD_LOG 93, `kern/da.ts`) · ✅ any/unknown Teil 1 119 → 89 (BUILD_LOG 94, `kern/kopie.ts`, `kern/pruefe.ts`) · ✅ Teil 2 89 → 40 (BUILD_LOG 95, `istObjekt`/`tabelleVon`, Rueckgabetypen Gantt/Netzplan) · ✅ **Teil 3 40 → 22, Q1 GESCHLOSSEN (30.09., BUILD_LOG 96)**: `bewertung` 13 → 1 mit Nachweis „gleiches Urteil“ auch fuer kaputte Fragen, `bedeutungsbaum` 7 → 0 mit bekannter Antwort; die 22 sind je Stelle begruendet und kommentiert. oxlint `typescript/no-unsafe-type-assertion` zaehlt 152 im App-Code (28.09.; Schwerpunkte generatoren 20, bewertung 14, Spickzettel 13, rechenaufgabe 12). Die bestehende Ratsche (`tools/as_ratsche.py`, 217 von 222) auf diese Zahl umstellen oder zweite Ratsche, dann abbauen mit Typwaechtern.
* ✅ **Q2 – Grosse Schirme zerlegen (30.09., BUILD_LOG 98: Hauptfunktionen 272/266/224 → 30/118/135, `kern/kartenablauf.ts`, `Kartenkopf`, `Zufallskarte.tsx`; Schnappschuss unveraendert).** Einstellungen (274 Zeilen je Funktion), Karteikarte (267), Ueben (232): Ablauf nach `kern/` (Muster `uebenablauf.ts`), Teile als Unterkomponenten; mit P3 abgestimmt.
* ✅ **Q4 – Lint schaerfen (30.09., BUILD_LOG 97: alle vier Regeln an, je Regel an einer Probe gemessen).** App-Code: `consistent-return`, `no-shadow`, `no-array-index-key`, `no-await-in-loop` einschalten (vorher je Regel messen), Funde beheben.
* **Release** nach P1–P4 (sichtbar schneller → Minor 2.3.0, vorher fragen).
* ✅ **Release 2.3.1 (01.10., BUILD_LOG 100)** nach Q1, Q2, Q4 und dem Nebenpunkt `SimKarte` – Patch, Nutzer-Entscheid.

---

### N39 — Abhaengigkeiten, Barrierefreiheit, Aufraeumen (Neupruefung 09.10., NC1–NC7) · ✅ 09.10. (v2.3.2)
Anlass: Neupruefung 09.10. (`BEFUNDE_AUDIT.md`), Nutzer-Auswahl alle Befunde. Reihenfolge: lokal und gefahrlos zuerst, Lernersichtbares gebuendelt vor einem Release.
* **A1 – git aufraeumen (NC4).** `git gc --prune=now` ueber die Training Shell (nie `device_bash`). Vorher/nachher `git count-objects -vH`, danach `git fsck --no-dangling` rc 0. Kein Commit.
* **A2 – Abhaengigkeiten auf Stand (NC1).** PRs #10–#13 nicht einzeln mergen, sondern lokal: `npm update` in `neu/` (innerhalb der Bereiche) und Wurzel (wrangler ≥ 4.149, behebt sharp/undici), shadcn-Kette pruefen (`npm audit` neu/ nur noch Entwicklungs-Reste, je Rest begruendet). `vite build`, `git add -A v2`, `check.sh` voll, Push; PRs schliessen sich danach (oder von Hand schliessen). Ziel: Dependabot-Alarme 0 bzw. jeder Rest begruendet.
* **A3 – Dependabot-Weg dauerhaft (NC2).** Entscheid beim Bau (AskUserQuestion), Kandidaten: (a) CI-Job nur fuer Dependabot-PRs, der `vite build` faehrt und `v2/` in den PR-Zweig committet; (b) `check.sh` vergleicht `v2/` bei Dependabot-PRs nicht, der Bau entsteht erst beim Mergen lokal. Gegenprobe: ein kuenstlicher Dependabot-Fall muss gruen werden, ein echter Abweichungsfall weiter rot.
* **A4 – Barrierefreiheit (NC3, NC6).** Tab-Leiste in `#ueben` ohne `opacity` unter 4,5 : 1 (Farbtoken statt Deckkraft); Kartenkopf: Stufe 1–4 richtig (4 Punkte bzw. „von 4"), `role="img"` am Punkte-`span`; Radix-Tabs `aria-controls` auf existierendes Element (Inhalt rendern oder `forceMount`/Attribut korrekt). Abnahme: Lighthouse a11y `#ueben` = 100 (`_to_delete/helfer/lh_a11y.sh`), Schnappschuss nur an den geaenderten Stellen anders (Diff lesen).
* **A5 – Doku und Kleinkram (NC5, NC7).** Die 6 unverwiesenen Wurzel-`.md` nach `referenz/archiv/` (`git mv`, Verweise 0 vorher pruefen); `meta-description` in `neu/index.html`.
* ✅ **Release 2.3.2 (09.10., BUILD_LOG 109)** – A1–A5 durch, a11y `#ueben` live 86 → 100.

---

### Reihenfolge ab 11.10.2026 (Nutzer-Entscheid: erst Arbeitsweise und Technikstand, dann Inhalt)
Der Nutzer legte fest: N49 zuerst, danach N43/N44/N45, „erst alles abschliessen, was die Arbeit verbessert oder den aktuellen
Technikstand aufbessert“. Die Reihenfolge innerhalb folgt den Abhaengigkeiten, die in den Etappen selbst stehen:
1. **N49 W1** Kern + Themendateien → **N49 W3** Entscheide als ADR. (Senkt die Lesemenge jedes folgenden Chats – darum zuerst.)
1b. **N51 Arbeitsweg schneller** (Nutzer-Entscheid 11.10. abends, E075) – VOR N43 M4.
2. **N43 M4** Werkzeuge messen (ruff, shellcheck, `@ts-check`), Ratsche auf Ist → **N45 W1–W4** auf 0 bringen, dann archivieren.
   Grund: N43 M4 sagt „erst messen, Ratsche auf Ist“ – ohne Ratsche kann N45 rueckfallen, ohne N45 bleibt die Ratsche auf hohem Ist.
3. **N43 M2** Schichtregeln (dependency-cruiser) → **N44 C2** knip 0 → **C4** oxlint/jsx-a11y/no-cycle → **C1** die komplexen
   Funktionen zerlegen. Grund: Regeln und Linter zuerst, damit das Zerlegen in C1 gegen sie laeuft.
4. **N43 M3** Mutation (Stryker) → **N44 C5** Luecken schliessen (C5 braucht die Messung aus M3) → **Release** (vorher fragen).
5. **N40** Umzug → **N41** Repo-Schutz → **N42** Deploy/Betrieb → **N46** Abschluss. Grund: N41 S2/S6 muessen im neuen Repo nach
   N40 V3 ohnehin neu gesetzt werden; N40 V3 braucht den Nutzer (Cloudflare-Token).
6. Danach Inhalt: N48 P5-Rest (75 Fragen; Befunde M08-110, M03-115 in BUILD_LOG 141) · szenario2 · N50 · Inhaltsrunde 8.

### N40 — Umzug ins oeffentliche Repo (E66, E70) · ✅ erledigt 26.11.2026 (BUILD_LOG 283–285; Ablauf `PLAN_UMZUG_V3.md`)
Anlass: Komplettpruefung 09.10. abends (`BEFUNDE_AUDIT.md`), ND4/ND3: Branch-Schutz, CodeQL, Secret Scanning, Attestierung, Scorecard sind
auf dem privaten Free-Repo gesperrt (gemessen 403/404). Gemessen im Weg: `tools/katalog/pruefungskatalog_ocr.txt` = ©-Vermerk „… – Alle Rechte
vorbehalten" des Katalog-Herausgebers (4 Commits), private Gmail-Adresse als Autor in 33 Commits. Darum frische Historie statt Umschreiben (nie `--force`).
* **V1 – Inventur + Waechter.** Waechter `4e14_veroeffentlichung` in `check.sh`: kein ©-Fremdtext, keine private E-Mail, keine Dateien aus einer
  Sperrliste im Baum. Gegenproben mit bekannter Antwort (Katalogdatei da → rot, entfernt → gruen). Parallel: Opus-Gegenpruef-Agent mit frischem Kontext
  sucht im bereinigten Baum, was nicht oeffentlich sein darf (nur lesen; jeder Fund wird nachgemessen).
* ✅ **V1 + V2a (09.10., BUILD_LOG 113)** – 4e14, Katalog-Daten in `../Buch/katalog`. **V2b:** Teil 1 ✅ (BUILD_LOG 114: M09_FAKTEN, Benutzerpfade); Teil 2 (BUILD_LOG 115): `index.js` + Pfad-Sperre ✅, Konto-Notizen entschieden ✅; Shell 1.1.1 released ✅; Pool-Westermann ✅ (BUILD_LOG 116).
* **V2 – Katalog raus.** `pruefungskatalog_ocr.txt` (und was nur aus ihm abgeleitet ist – Inventur entscheidet je Datei) nach `../Buch` (privat, wie das
  Lehrbuch); `tools/katalog/abdeckung.py` liest von dort, fehlt die Datei: klare Meldung statt Absturz. `einrichten.sh --pruefen` meldet sie wie die Buch-PDFs.
* ✅ **V3 (26.11.2026, BUILD_LOG 285):** Erstcommit `1e98a44`, CI/Deploy/Herkunft gruen, oeffentlich, Alt-Repo `…-archiv` archiviert; offen nur die zwei anderen PCs (Schritt 14) und die Cloud-Probe (16.4).
* **V3 – Umzug.** Altes Repo → `ap1-lernprogramm-archiv` (privat, archiviert), neues `Fisi2026/ap1-lernprogramm` oeffentlich, EIN Erstcommit aus dem
  bereinigten Baum als `ap1`. Secrets `CLOUDFLARE_*` neu setzen (Nutzer gibt den Token ein), Remote auf beiden PCs, Dependabot/Actions an.
  Probe: CI gruen, Deploy laeuft, live liefert den neuen Bau. Doku: `DEPLOY.md`, Projekt-Dokument „Neuer Rechner", `fisi`-Skill falls Pfade.
* **V4 – Oeffentliche Huelle.** `LICENSE` „Alle Rechte vorbehalten" (E66), `SECURITY.md` (Meldeweg), `README.md` fuer Fremde lesbar.
* ~~**Release 2.3.3** (E69) – traegt ND1; erstes Tag im neuen Repo.~~ Ueberholt (O2): erstes Tag im neuen Repo ist `v2.13.1` (26.11.2026).

### N41 — Repo-Schutz und Lieferkette (E70) · offen
* **S1 – Regelsatz main:** Force-Push und Loeschen gesperrt; KEINE PR-Pflicht (E70: Push direkt auf main, `check.sh` vor jedem Commit bleibt der Riegel).
* ✅ **S2 – Actions** (Einstellung 09.10., BUILD_LOG 117; Probe 10.10., BUILD_LOG 119; im neuen Repo nach V3 NEU setzen)**:** `sha_pinning_required: true`, erlaubte Actions = GitHub-eigene + benannte (ND3). Probe: ein Tag-Verweis in einem Probe-Zweig wird abgelehnt.
* **S3 – GitHub-Sicherheit:** CodeQL Standard-Setup (JS/TS, Actions), Secret Scanning + Push-Schutz, Scorecard-Action woechentlich (`publish_results`).
  ⚠️ **Konflikt mit S2 (12.10., BUILD_LOG 146):** S2 erlaubt nur GitHub-eigene Actions – `ossf/scorecard-action` ist keine und wird blockiert.
  Laut GitHub-Doku („Managing GitHub Actions settings for a repository") braucht sie einen Eintrag `ossf/scorecard-action@<voller SHA>` in der
  Erlaubt-Liste (`selected-actions`, `patterns_allowed`). CodeQL (`github/codeql-action`) ist GitHub-eigen und laeuft ohne Eintrag.
  Probe: Scorecard-Lauf vor dem Eintrag rot („not allowed"), danach gruen. Nach N40 V3 frei auf oeffentlichem Free-Repo: Code Scanning,
  Secret Scanning, Copilot Autofix fuer CodeQL-Alarme (ohne Copilot-Abo), Rulesets (S1).
* **S4 – Herkunft:** `actions/attest-build-provenance` fuer den ausgelieferten Bau (`v2/`), Pruefbefehl in `DEPLOY.md`.
* **S5 – Pins schaerfen:** Semgrep und `.tooling` mit Pruefsummen (`--require-hashes`), harden-runner im Audit-Modus (Egress sehen).
  ⛔ **harden-runner ENTFAELLT KOMPLETT** (Nutzer-Entscheid 18.10.2026, BUILD_LOG 223): erster Lauf scheiterte an der Erlaubnisliste
  (startup_failure, BUILD_LOG 222), Community Tier nur fuer oeffentliche Repos. Auch nach V3 nicht wieder einbauen; die Zeilen darunter sind Geschichte.
  ⚠️ **Wie S3 (12.10., BUILD_LOG 146):** `step-security/harden-runner` ist nicht GitHub-eigen → Eintrag `step-security/harden-runner@<voller SHA>`
  in der Erlaubt-Liste, sonst blockiert S2 den Lauf. Jeder SHA-Wechsel (Dependabot) braucht den Eintrag neu – oder ein Muster
  `step-security/harden-runner@*` (SHA-Pflicht aus S2 gilt weiter); Nutzer-Entscheid beim Bau.
* ✅ **S6 – Aufraeumen (ND5)** (09.10., BUILD_LOG 117; `delete_branch_on_merge` im neuen Repo nach V3 neu setzen)**:** PR #15, alte Zweige, `delete_branch_on_merge`. Ziel: Scorecard ≥ 8 (Wert in `BEFUNDE_AUDIT.md`).

### N42 — Deploy und Betrieb (E68) · offen
* **B1 – Probelauf vor Freigabe:** `wrangler versions upload` → Rauchtest gegen die Versions-Adresse → `wrangler versions deploy`. D1-Migrationen laufen
  nicht mit der Version (Cloudflare-Doku) – Reihenfolge Migration → Upload in `DEPLOY.md`.
  ⚠️ **Zwei Stolpersteine (12.10., BUILD_LOG 146, Cloudflare-Doku „Deployment management" / „Version URLs"):**
  (1) `wrangler versions upload` uebertraegt KEINE Trigger – der Cron `23 3 * * *` (Aufraeumen nach `AUFBEWAHRUNG`) braucht
  `wrangler triggers deploy`; sonst bleibt bei einer Cron-Aenderung der alte Zeitplan. Probe: `wrangler triggers deploy` nach einer
  Testaenderung, Cron im Dashboard gemessen. (2) Version-URLs laufen gegen die **Produktions-D1** (keine eigene Datenbank) – der
  Rauchtest an der Versions-Adresse darf nur LESEN (kein POST auf `/api/meldung` oder `/api/fehler`); Waechter im Rauchtest.
* **B2 – Rollback:** Rezept (`wrangler rollback`) in `DEPLOY.md`, einmal geuebt und gemessen.
  ⚠️ **Nur Code (12.10., BUILD_LOG 146):** ein Rollback stellt D1 (Meldungen, Fehlerberichte) nicht wieder her. Ergaenzen:
  D1 Time Travel (`wrangler d1 time-travel info` / `restore`) – Frist auf dem Konto NICHT gemessen (Doku-Seite am 12.10. nicht
  erreicht), erst messen, dann Rezept + eine geuebte Wiederherstellung auf einer Wegwerf-Datenbank, nie auf `ap1-meldungen`.
* **B3 – Live-Waechter (ND7, E68):** Zeitplan-Job taeglich: Erreichbarkeit, Header, Version = main, neue Fehlerberichte (Lesezugang als Secret) →
  GitHub-Issue (eins je Ursache, nicht je Lauf).
* **B4 – Kennzahlen:** DORA (Liefertempo, Haeufigkeit, Ausfallquote, Wiederherstellung, Nacharbeit) monatlich aus `gh` – Skript + Bericht.
* **B5 – CI schneller:** `check.sh` in parallele Jobs (Ziel < 3 min statt ~5), Ausgabe und Urteil gleich.

### N43 — Code-Qualitaet messbar machen (E67, E71) · offen
Messung 09.10. (Kopie von `fa3252a`): jscpd 0,7 % · Komplexitaet > 20: 5 Funktionen (`validierung.ts` 140, `api.ts bearbeite` 49, `testhilfe/verderben.ts` 27,
`rechner.ts zerlege` 24, `Karteikarte` 21) · 46 Funktionen > 50 Zeilen · knip: 4 Dateien, 34 Exporte, 34 Typen, 1 unbenutztes, 1 nicht gelistetes Paket ·
Zweige 87,8 % · Mutation nie gemessen · `tools/` ~133 Dateien (py 47, js 33, sh 53, ~17 600 Zeilen) ungeprueft.
**Ziel „10" (E67, App + Werkzeuge):** Komplexitaet ≤ 15 · Funktion ≤ 80 Zeilen (laengere begruendet) · Duplikation < 1 % · knip 0 (Ausnahmeliste
`components/ui`) · keine Zyklen, Schichtregeln (`kern` ohne React/Schirme, `server` nur `kern/pruefe`) · Zweige ≥ 90 % · Mutation ≥ 80 % in `kern/` + `server/` ·
ruff 0, shellcheck 0, JS-Werkzeuge typgeprueft.
* **M1 – Ratschen:** je Kennzahl ein Waechter in `check.sh` nach dem Muster der `as`-Ratsche (Zahl darf nur sinken), Selbsttest an einer Probe. ✅ 10.10. (BUILD_LOG 121): `tools/qualitaet_ratsche.py`, Waechter 4f_qualitaet.
* **M2 – Architektur:** dependency-cruiser mit den Schichtregeln. ✅ 14.10. (BUILD_LOG 170): `tools/architektur_regeln.cjs` (keine Zyklen · kern ohne Oberflaeche · server nur kern/pruefe + kern/route), `tools/architektur.py` + `--probe`, Waechter 4f_architektur; dependency-cruiser 18.6 + typescript@6 in `.tooling/` (liest TS 7 noch nicht); ersetzt `kern/architektur.test.ts`.
* **M3 – Mutation (E71):** Stryker 10 + vitest-runner nur fuer `kern/` + `server/`; Zeitplan-Job naechtlich und vor jedem Release, Issue wenn der Wert sinkt.
* **M4 – Werkzeuge:** ruff (Python), shellcheck (sh), `// @ts-check` + tsc fuer `tools/*.js`; erst messen, Ratsche auf Ist. ✅ 13.10. (BUILD_LOG 152): ruff/shellcheck seit M1 in der Ratsche; tsc ueber `tools/tsconfig.tools.json` (checkJs, alle 34 JS-Dateien) – `tsc_tools` 23, `tsc_tools_streng` 789, Probe + Stumm bei TS5xxx/TS6xxx.

### N44 — App-Code auf 10 · offen
* **C1** die fuenf komplexen Funktionen zerlegen (`api.ts` als Pfad-Tabelle, `validierung.ts` aus dem Schema ableiten statt von Hand) – Schnappschuss unveraendert.
* ✅ **C2** knip auf 0 – erledigt 14.10. (BUILD_LOG 171): 76 → 0, `neu/knip.jsonc` (sw-Einstiege, Ausnahmeliste components/ui), 7 tote Symbole geloescht · **C3** TS-Schalter `exactOptionalPropertyTypes`, `noImplicitReturns`, `noImplicitOverride`, `noPropertyAccessFromIndexSignature` (je Schalter messen,
  dann an) ✅ 10.10. (BUILD_LOG 118, 120): drei Schalter an, `noPropertyAccessFromIndexSignature` verworfen (Nutzer-Entscheid: reiner Schreibstil, 477 Stellen) · ✅ **C4** oxlint-Kategorien + `jsx-a11y` + `import/no-cycle` – erledigt 14.10. (BUILD_LOG 172): correctness + suspicious + perf als Fehler, jsx-a11y und import an, 120 Befunde → 0 (10 begruendete Ausnahmen); pedantic: 9 Fehler-Regeln an, `prefer-nullish-coalescing` an (ignorePrimitives), `no-unsafe-*` als Ratsche `no_unsafe` 340 (BUILD_LOG 173) · **C5** Mutations-Luecken schliessen · ~~**C6** ND2 Admin-Schluessel nur `sessionStorage`~~ – gestrichen (Nutzer-Entscheid 09.10.: ND2 bleibt).
* **Release** nach C1–C6 (vorher fragen).

### N45 — Werkzeuge auf 10 (E67) · offen
* **W1** shellcheck 0 · **W2** ruff 0 – ⚠️ **erweitert 12.10. (BUILD_LOG 146):** zusaetzlich die Sicherheitsgruppe `S` (flake8-bandit).
  Gemessen auf einer Kopie von `75f8a3b` (ruff 0.16.8, `ruff check tools --select S`): 41 Funde – S108 12 (`/tmp` fest),
  S607 7 + S603 6 (subprocess), S110 5 + S112 2 (`except: pass/continue`), S101 4, S324 4 (sha1/md5), S602 1 (`shell=True`,
  `tools/sabotage_vt.py:42`). Alles nur lokale Werkzeuge. Vorschlag beim Bau: S101 und S324 (Fingerabdruecke, keine Kryptografie)
  begruendet ausnehmen, Rest beheben; eigene Zahl in der Ratsche (`ruff_s`), damit die Gruppe nicht in der 801er-Summe untergeht
  · ✅ **W3** `tools/*.js` typgeprueft – erledigt 14.10. (BUILD_LOG 169): strict 779 → 0 (archiv/ ausgenommen), nur JSDoc/Casts, bewiesen mit `tools/js_gleich.js`; `tsc_tools` = strict, `tsc_tools_streng` aufgegangen · **W4** Werkzeuge ohne Aufrufer nach `tools/archiv/` (vorher Verweise 0 pruefen). ⚠️ **W4 vorgezogen 13.10. (BUILD_LOG 153, `BEFUNDE_WERKZEUGE.md` §13):** Inventur aller 146 Code-Dateien, 11 archiviert, 2 auf den Kern umgestellt; offen: die 11 Sichtpruef-Skripte (§13d) einzeln.
  Massenkorrekturen nach festem Muster duerfen an einen Sonnet-Agenten auf einer Kopie (Pruefskript = 0, Diff liest der Hauptchat).


### N47 — Lerner-Meldungen 2–5 (BUILD_LOG 122) · **erledigt 10.10. (v2.3.3, BUILD_LOG 124)** · VOR Inhaltsrunde 1 (Nutzer-Entscheid 10.10.)
* **A – Antworten je Anzeige mischen.** Erst messen: welche Fragetypen zeigen Optionen in Pool-Reihenfolge (mc, mehrfach,
  dropdown, zuordnung, weitere?) · bewertet die App per Index oder per Text · was speichert der Lernstand (Antwort-Index?).
  Dann: Mischung je Anzeige mit `kern/zufall.ts shuffle`, stabil waehrend einer Frage (kein Neumischen beim Neurendern),
  Bewertung auf den Ursprungs-Index zurueckgefuehrt; Tests: Verteilung der richtigen Position ueber viele Ziehungen,
  Bewertung nach dem Mischen, gespeicherter Lernstand bleibt lesbar. Abnahme: Meldungen 2, 3, 4 am Live-Stand nachgestellt.
* **B – M01-486 (bild): Loesung wird bei falscher Antwort nicht angezeigt.** Am Live-Stand nachstellen, Ursache messen,
  Fehlerklasse ueber alle `bild`-Fragen pruefen.
* **Danach:** Meldungen 2–5 auf erledigt (`wrangler d1 execute … --remote`, oder in der App), Release-Bump vorher erfragen.

### N48 — Grobe Pruefung aller Fragen in der App (nach N47) · offen
Anlass: N47 zeigte zwei Fehlerklassen, die kein Waechter sah. Gemessen 10.10.: 21 Fragetypen (mc 352, dropdown 108,
zuordnung 104, mehrfach 80, freitext 66, erklaeren 57, hotspot 39, bild 29, rechenassistent 29, …); `eingabe.test.tsx`
bedient jeden Typ nur RICHTIG und nur einmal; `bewertung.gleichheit` vergleicht mit der alten App. **Falsche Antworten
und die Anzeige danach prueft fuer den ganzen Pool niemand.** Alle Punkte unten sind VERDACHT – erst messen, dann bewerten.
* **Stand 10.10. (BUILD_LOG 125): P1 + P2 gemessen** (`neu/src/messung/rundlauf.messung.test.tsx`) – P1 Bewertung 0 Funde; Loesung fehlte in fehlersuche/hotspot/mtf/reihenfolge (106) → behoben 2.3.4. P2: szenario2 30/38 Schritte mit laengster Option richtig (18 Fragen, geparkt fuer N50 Q1), mc 15/374 und dropdown 62/242 unter bzw. bei Zufall.
* **Stand 11.10. (BUILD_LOG 136, 140): P3 gemessen, Kalkulation als Zahl behoben. P4 gemessen** (`tools/sichtpruefung/n48p4.js`, 300 Fragen bei 390 px): Karte ragte bei langem Thema rechts heraus (4 Fragen, `Kartenkopf` min-w-0) und ein Reihenfolge-Schritt ohne Trennstelle schob die Pfeile hinaus (M08-361) – beide behoben. Klickflaechen unter 24 px ohne Abstand (WCAG 2.5.8): Hotspot-Zeichnung mit Mindestbreite (M01-483, M03-980…982), „Frage melden“ min-h-6 – behoben (Nutzer-Entscheid „Ziele groesser zeichnen“). **P4 durch.**
* **P1 Rundlauf je Frage (Kern, automatisch, jsdom ueber ALLE Fragen):** richtige Antwort → „richtig" · eine falsche →
  „falsch" UND Loesung + Erklaerung sichtbar · nach „richtig" Erklaerung sichtbar. Ergebnis als Liste Frage × Befund.
* **P2 Verraeterische Darstellung:** richtige Option an fester Stelle (N47 A, alle Auswahltypen) · `reihenfolge` startet
  schon in Loesungsreihenfolge · `zuordnung` rechte Spalte in Loesungsreihenfolge · laengste Option = richtige (Laengen-Tell,
  Waechter gibt es im Pool – gilt er fuer alle Typen?).
* **P3 Bewertung an den Raendern:** freitext/lueckentext (Gross-/Kleinschreibung, Tippfehler-Toleranz, Synonyme) ·
  rechenassistent/kalkulation (Rundung, Einheit, Komma/Punkt) · mehrfach (nur alle richtig = richtig?) · Generatoren
  (Zufallswerte ergeben loesbare Aufgaben, Rundung passt zur Musterloesung).
* **P4 Darstellung:** bild/hotspot/beschriftung auf Handy-Breite (Klickflaechen, SVG nicht abgeschnitten) · lange Optionen
  im dropdown · Sonderzeichen/Formeln.
* **P5 Inhalt:** doppelte oder fast gleiche Fragen · zwei Fragen mit widerspruechlicher Aussage · Erklaerung widerspricht
  der eigenen Loesung.
**Ablauf:** P1 und P2 als Messskript (Befundliste, KEIN Waechter im ersten Schritt), Befunde nach Klasse dem Nutzer vorlegen,
dann je Klasse entscheiden: beheben + Waechter. P3–P5 als Stichprobe je Typ, ausgeweitet nur bei Fund.
Reihenfolge laut Nutzer: N47 → N48 → Inhaltsrunde 1.
**Nutzer-Entscheid 10.10. abends:** eindeutige Fehler einzelner Fragen beseitigt der Chat selbst (Rest als Befundliste);
wirken sie beim Lerner: eigener Sprung 2.3.4 + Push nach gruenem `check.sh`.

### N49 — Arbeitsablauf schlanker und sicherer (Nutzer-Entscheid 10.10., BUILD_LOG 123) · offen
Recherche 10.10.: Claude-Code-Doku „How Claude remembers your project" (Anweisungsdatei unter 200 Zeilen, laengere
„reduce adherence"; Ablaeufe in Skills, Teilbereiche in Regeln, die nur bei Bedarf laden; Anweisungen sind Kontext,
Erzwingen per Hook) · Anthropic „Effective context engineering" („smallest possible set of high-signal tokens";
just-in-time: Pfade/Referenzen halten, Inhalt erst bei Bedarf laden; Notizen ausserhalb des Kontexts) · ADR-Praxis
(eine kurze Datei je Entscheidung, Status, unveraenderlich). Gemessen: START_PROMPT 399 Zeilen, LEHREN 282, EINSTIEG 52,
Skill fisi-lernapp 177; Pool-Arbeit liest START_PROMPT + LEHREN ganz (~60 KB).
* **W1 Kern + Themendateien (just-in-time).** Ein Kern unter 200 Zeilen, den jeder Chat liest (Stand, Arbeitsregeln,
  Pflichttabelle); alles andere in Themendateien (z. B. `regeln/pool.md`, `regeln/verweise.md`, `regeln/bruecke.md`),
  die die Pflichttabelle je Aufgabe nennt. LEHREN-Bloecke den Themen zuordnen, NICHT kuerzen (verbatim wie rotiere.py).
  Vorher messen: welche LEHREN-Bloecke welche Aufgabe braucht; Abnahme: Lesemenge je Aufgabenart vorher/nachher in Byte,
  Waechter prueft Kern-Zeilen und dass jede Themendatei in der Pflichttabelle steht. ⚠️ `.claude/rules/` laedt hier
  nicht (die Sitzung arbeitet nicht im Repo-Ordner) – das Laden steuert der Skill.
* **W2 Push-Sperre – erledigt 10.10. (BUILD_LOG 125, `tools/check_stempel.sh`).** `tools/gitc.sh push` verweigert, wenn kein GRUENER `check.sh`-Lauf (voll oder doku, passend zum
  Pfad-Tor) zum aktuellen Baum-Fingerabdruck vorliegt. Anlass: am 10.10. trotz „1 PROBLEM" gepusht (BUILD_LOG 121/122).
  Selbsttest: roter Lauf → Push abgelehnt; Gegenprobe gruen → Push geht.
* ✅ **W3 erledigt 11.10. (BUILD_LOG 143): `entscheide/`, E072–E074, Waechter 4g2 (`tools/entscheide.py`).** **W3 Entscheidungen als ADR.** Neue Entscheide als `entscheide/E072-<titel>.md` (Kontext, Entscheid, Folgen, Status);
  die Tabelle E1–E71 in PLAN_NEUBAU bleibt als Verzeichnis, wird nicht umgeschrieben. Waechter: jede E-Nummer genau einmal.

### N51 — Arbeitsweg schneller und billiger (Nutzer-Entscheid 11.10.2026, E075, BUILD_LOG 144) · offen, VOR N43
Anlass: Auswertung 11.10. – 10 volle `check.sh`-Laeufe, davon 4 rot an vorher Erkennbarem; 4 von 8 Doku-Pruefungen umsonst
(3x `EINSTIEG.md` veraltet); ~70 Bruecken-Aufrufe nur zum Warten; `n48p4.js` 4x ueber 300 Fragen, 2x wegen eigener Fehlalarme;
`wache.py` ohne eine Ablesung; gestern 2x Fremd-Rot `eingabe.test.tsx` durch Pool-Zuwachs. Zahlen gezaehlt, nicht gemessen.
* ✅ **A1 `tools/vorlauf.sh`** (11.10., BUILD_LOG 145) (Ziel < 30 s, vor jedem vollen Lauf): `einstieg.py --setze`, Standzeile gegen die vorgemerkten Aenderungen,
  ruff/shellcheck nur auf geaenderten Dateien gegen die Ratsche, Waechter 4e2d + 4g + 4g2, vitest nur fuer die beruehrten Ordner
  inkl. Schnappschuss. Abnahme: die vier roten Laeufe vom 11.10. (Standzeile, Schnappschuss, Bestands-ID, ruff) je als Sabotage nachgestellt
  → vorlauf meldet jeden.
* ✅ **A2 `check.sh` parallel** (12.10., BUILD_LOG 149: PC 105/104 s → 89/87/90 s, -16 %; Cloud 2 Kerne unveraendert ~233 s) (= N42 B5 vorgezogen): vitest, Suiten, Bau als parallele Teile, Ausgabe und Urteil gleich; Ziel < 2 min.
  Abnahme: Laufzeit vorher/nachher je 3 Laeufe, Sabotage in jedem Teil → rot.
* ✅ **A3 Warten:** (12.10., BUILD_LOG 148: `warte.sh <lauf> 45` unter Git Bash 3x 46,9 s, Aufruf 47,1–47,2 s < 50 s; Vorgabe 45 bleibt, Skill auf 45) `warte.sh` Vorgabe 45 s (gemessen ~13 % Aufschlag unter Git Bash – vorher messen, ob 45 s unter 50 s bleiben);
  Skill fisi-lernapp: Wartezeit mit Schreibarbeit fuellen, ein voller Lauf je Arbeitspaket.
* ✅ **A4 Standzeile im Commit:** (12.10., BUILD_LOG 148, Nutzer-Entscheid „vorab DURCH": `tools/standzeile.py`, `release.sh`, `gitc.sh push` setzt bei Fehlschlag OFFEN per Folge-Commit) `tools/gitc.sh commit` setzt „PUSH OFFEN“ selbst, wenn der Commit etwas ausliefert (Kriterium wie
  `ungepusht.py`), und `push` + CI-Urteil setzt „PUSH DURCH“ – kein Extra-Commit mehr. Gegenprobe: Commit mit/ohne `v2/`.
* ✅ **A5 Messwerkzeuge:** (11.10., BUILD_LOG 145) Regel in `regeln/messen.md` + Schalter `--probe` als Muster: neues Werkzeug erst an 5 bekannten Faellen
  inkl. Grenzfaellen, dann voll.
* ✅ **A6 Token-Wache an den Hook:** (12.10., BUILD_LOG 150, E077: anders als geplant - wache.py nur Notfall, Skill token-wache entfaellt, Handlung steht in der SCHWELLE-Zeile des Hooks; fisi 1.3.2) `wache.py` liest die `[limits]`-Werte (Kontext, 5h, 7T) statt Nutzer-Ablesungen; Schwellen wie
  im Hook; Skill token-wache nachziehen (Plugin-Bump, beide Konten).
* ✅ **A7 Stichprobe fest:** (11.10., BUILD_LOG 145) `eingabe.test.tsx` mit fester ID-Liste je Typ statt „25 aus n“ – Pool-Zuwachs aendert sie nicht mehr.
* ✅ **A8 zwei Lehren** in `regeln/bruecke.md` (11.10., BUILD_LOG 144): `chr(92)` in Python-Befehlen; Release-Dateien ueber `gh api`.

### N50 — Fragenqualitaet ohne grosse Lerner-Stichprobe (Nutzer-Entscheid 10.10.) · offen, nach N48
Recherche 10.10.: klassische Item-Analyse (Schwierigkeit, Trennschaerfe ab 0,3, Distraktoren) braucht viele Lerner – alle
Meldungen kommen von EINEM Geraet, darum vorerst nicht anwendbar. Tragfaehig ohne Stichprobe:
* **Q1 Regelbasierte Item-Writing-Flaws** (Moore u. a. 2023, arXiv 2307.08161: Regeln 90,9 % Uebereinstimmung mit Menschen,
  GPT-4 78,9 %; „longest option correct" regelbasiert F1 0,80–1,00): pruefen auf laengste Option = richtig (Pool-Waechter
  gibt es – auf alle Typen pruefen), absolute Begriffe („immer", „nie") nur in Distraktoren, „keine der genannten"/„alle",
  Wortwiederholung Fragestamm ↔ richtige Antwort. Erst als Befundliste, Fehlalarmquote messen, dann je Regel entscheiden.
* **Q2 Problemfragen aus dem eigenen Lernstand** (Muster Anki-„Leech": 8 Fehlversuche, Warnung je 4 weitere): Fragen mit
  wiederholten Fehlern als Pruefliste – Ursache Frage (unklar, falsch) oder Stoff? Schwelle vorher am Lernstand messen.
* **Q3 Item-Analyse** erst, wenn mehrere Lerner Daten liefern; bis dahin nur Notiz.
### N46 — Abschluss · offen
Neupruefung nach demselben Rahmen (OWASP Top 10:2025, ASVS 5.0, Scorecard, WCAG 2.2, Ziel-Kennzahlen N43) mit einem Opus-Gegenpruef-Agenten; Release.

**Agenten fuer N40–N46 (Skill `fisi:agenten-orchestrierung`):** vor N40–N43 je EIN Haiku-Agent (nur lesen) fuer aktuelle Befehle/Einstellungen, ≤ 15 Zeilen
mit Quellen · Opus-Gegenpruefung in N40 V1 und N46 · Sonnet nur fuer Massenarbeit in N45 auf Kopien. Code, Tests, Commit und Push macht der Hauptchat;
jedes Agenten-Ergebnis wird nachgemessen. Je Etappe etwa ein Chat; die Token-Wache entscheidet den Wechsel.

## 3. Was bewusst NICHT gebaut wird

* **Die „Deine Antwort / Richtig"-Zeile** in der Simulations-Auswertung. Die alte App setzt sie für
  genau fünf Typen aus typspezifischen Feldern zusammen; das wäre eine zweite Beschreibung der
  Antwortform, die schon in `kern/antwortform.ts` an 1131 Fragen belegt ist.
* **Ein Knopf ins Netzplan-Training** auf dem Rechen-Generator-Schirm: der Bereich ist über die
  Schiene erreichbar, ein zweiter Weg dorthin ist Zierde.
* **`rechnerPanel`** aus `app_util.js`: das ist Darstellung, die zeichnet der Neubau selbst
  (nur der Parser ist die Sache — siehe N26).

## 4. Die Regeln, die beim Weiterbauen gelten

Sie stehen ausführlich in `SCHIENE_NEU.md` Abschnitt 5; hier die, an denen diese Restarbeit hängt:

1. ⛔ **Gerechnet wird in `kern/`** (`neu/src/kern/`, seit N34 T6c am 27.09.2026; vorher `logik.js`).
   Wer eine Regel außerhalb von `kern/` nachbaut, hat zwei Fassungen —
   und die laufen auseinander (gemessen am 27.08.2026: 23 Fragen still ausgeschlossen).
   Ausnahme ist nur, was der Nutzer ausdrücklich anders entschieden hat (E6).
2. ⛔ **Ein Zweig, den kein Aufrufer erreicht, ist kein Feature** — und eine Sperre, die nichts
   sperrt, ist kein Schutz. Beides ist in diesem Umbau viermal vorgekommen.
3. ⛔ **Sabotage ist die Abnahme.** Jede Etappe: Muster genau einmal ersetzen, Datei immer
   wiederherstellen, **rot ist das Bestehen** — und jede Sabotage einzeln messen.
4. ⚠️ **Was der Bestand nicht erreicht, wird an einem gebauten Fall gemessen** — und der Test sagt
   ausdrücklich, dass der Bestand ihn nicht erreicht (sonst läuft er leer und meldet Erfolg).
5. ⚠️ **Gemessen wird die Eigenschaft, nicht die Zahl**, wo das geht.
6. ⛔ **Der Sollwert in `check.sh` 4f wird bei jeder Etappe nachgezogen.**
7. ⚠️ **Ein grüner Lauf zu Hause ist kein CI-Befund** — und 614 grüne Tests sind kein Beweis, dass
   die App startet. Nach jeder größeren Etappe: Rauchtest im echten Browser.

## 5. Offene Risiken

| | Risiko | Messstelle |
|---|---|---|
| ~~R1~~ | ~~Zwei Taschenrechner driften (E6)~~ – **entfällt als Dauerrisiko (E20)**: die alte Fassung läuft nicht mehr; T2 bleibt als Referenzvergleich | N26 T2 |
| ~~R2~~ | ~~Parallelbetrieb am selben Schlüssel~~ – **entfällt (E17)**: der Neubau bekommt einen eigenen Schlüssel | N31 |
| **R3** | `sw.js` der alten App fängt Pfade des Neubaus ab – **wird mit N29 zu R9** | N29 Schritt 2 |
| ~~R4~~ | ~~kein Schnappschuss~~ – **erledigt 21.09.** (N25 P0, Bedeutungsbaum) | `src/huelle/schnappschuss.jsdom.test.tsx` |
| ~~R5~~ | ~~`BUILD_LOG.md` wächst~~ – **rotiert 22.09.** nach v1.38.0 (765 → 65 Zeilen, Gegenprobe 0 Verluste) | nach dem nächsten Release wieder (`python3 tools/rotiere.py`) |
| ~~R6~~ | ~~Hülle auf dem Handy abgeschnitten~~ – **erledigt 22.09.** (v1.38.0, `main` = 334 px) | `rest.js`, alle 13 Bereiche |
| **R7** | Ein Wächter misst nur EINE Richtung und meldet trotzdem grün (B164, 22.09.) | `rest.js` prüft rechts UND unten; **jede neue Prüfung braucht ihre Gegenprobe am alten Stand** |
| **R8** | Mehrere Tabs überschreiben den Lernstand still – kein Tab hört auf `storage` (gemessen 22.09.: 0 Treffer) | N31 |
| **R9** | Der alte Service Worker liefert Lernern nach dem Umschalten weiter die alte App (cache-first unter `/`) | N29 Schritt 2 |

## 6. Für einen neuen Chat: die Reihenfolge des Lesens

1. `START_PROMPT.md` — die Einstiegsdatei des ganzen Projekts
2. `SCHIENE_NEU.md` — was der Neubau ist, die zehn Bereiche, wie gemessen wird, die Werkzeugfallen
3. **diese Datei** — was entschieden ist und was noch ansteht
4. `BUILD_LOG.md`, letzter Eintrag — wie weit es ist („Damit offen: …")
5. Beim Arbeiten an N25: die **Arbeitsanleitung** unter N25 (Ablauf A, Verträge B, Ziele C, Wächter D)

Messen, bevor gebaut wird. Und: **im Zweifel die gemessene Quelle, nicht die Abschrift.**
