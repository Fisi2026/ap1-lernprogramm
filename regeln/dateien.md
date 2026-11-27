# regeln/dateien.md – DATEIEN – wo steht was

**Wann lesen:** Die EINZIGE Liste der Steuer- und Protokolldateien (`TASKLIST.md` Abschnitt 5 verweist hierher).

⚠️ Entstanden am 11.10.2026 (N49 W1, Nutzer-Entscheid): die Bloecke unten stehen **verbatim** aus `START_PROMPT.md` und `docs/archiv/LEHREN.md` (verschoben mit `tools/rotiere.py`, Gegenprobe 0) – nichts gekuerzt, nichts umformuliert. Abschnittsnummern und „siehe oben“ darin beziehen sich auf die Ur-Fassung (`git log -p START_PROMPT.md`, Stand vor N49 W1).
⛔ Diese Datei traegt keinen Stand (der steht in den zwei Standzeilen von `START_PROMPT.md`). **Neue Lehren kommen ans Ende, mit Datum und Beleg.**

## Aus START_PROMPT.md verschoben am 11.10.2026 (N49 W1, verbatim, rotiere.py)

### aus START_PROMPT.md, Zeilen 159-208 der Ur-Fassung

# ============
# 7) WO STEHT WAS
# ============
#   ⚠️ **DIESE LISTE IST DIE EINZIGE. `TASKLIST.md` Abschnitt 5 verweist hierher und führt keine
#      zweite mehr.** **Zwei Listen für dieselbe Sache driften immer** (Beleg 28.07.: Archiv).
#   `TASKLIST.md` ............ **Agenten-Matrix, Prüfprotokoll, Tooling-Fallstricke, Token-Spar-
#                              regeln, Verfahrenslehren 0b.** ⚠️ **Kein Status, keine allgemeinen
#                              Arbeitsregeln** – die stehen nur in Abschnitt 5. Chronik: `TASKLIST_ARCHIV.md`.
#   `docs/archiv/PLAENE.md` .............. **nur noch die OFFENEN Etappen** + Alt-Pläne; erledigte:
#                              `docs/archiv/PLAENE_ARCHIV.md`. ⚠️ **PLANUNGSZAHLEN DARIN SIND MESSWERTE VON
#                              DAMALS**, keine Statusaussagen – der geltende Wert steht im
#                              erzeugten Block in `docs/befunde/SORTIERUNG_PRUEFUNGSORDNUNG.md`.
#   `BUILD_LOG.md` ........... laufender Stand **ab der Uebergabe zu N25 P3** (rotiert 21.09.; `check.sh` weist ab
#                              900 Zeilen hin – **Auslöser ist aber das RELEASE, nicht die Grenze**)
#   `BUILD_LOG_ARCHIV.md` .... alles bis einschließlich **v1.35.0**. ⚠️ **Jede Rotation hängt
#                              HINTEN an: der erste Block ist der älteste.** (Der Kopf behauptete
#                              bis zum 07.09. das Gegenteil.)
#   `START_PROMPT_ARCHIV.md` . **Chronik dieser Datei** – erledigte Etappen, alte Beschlüsse,
#                              Begründungen. Wird GEZIELT NACHGESCHLAGEN („warum ist X so gebaut?"),
#                              nicht am Stück gelesen.
#   ⚠️ **STATUS-AUSSAGEN IM ARCHIV SIND ÜBERHOLT.** Dort stehen Sätze wie „APP_VERSION steht auf
#      1.7.0", die damals stimmten. **Im Zweifel gilt diese Datei, und gemessen wird am Code.**
#   `docs/archiv/LEHREN.md` .............. **die teuren Lehren + Pool-Arbeitsregeln** (bis 17.09. Abschnitt 6 und Teile
#                              von 2/3) – WANN Pflicht: Tabelle in Abschnitt 6
#   `CLAUDE.md` .............. **Wegweiser, den Claude Code in JEDER Sitzung laedt** (seit 26.11.2026, BUILD_LOG 296) – kein Stand,
#                              keine Regeln im Wortlaut; `.claude/rules/*.md` = pfadbezogene Erinnerungen an die Pflichtlektuere;
#                              `.claude/agents/*.md` = feste Projekt-Agenten mit Modell und Werkzeugen (BUILD_LOG 297)
#   `WERKZEUGE.md` ........... **die Werkzeugliste** (bis 17.09. Abschnitt 8) – vor jedem neuen Skript lesen
#   `SCHIENE_NEU.md` ......... **der Neubau `neu/`** – zehn Bereiche, wie dort gemessen wird · `docs/plaene/PLAN_NEUBAU.md` = Entscheide + Restarbeit
#   `docs/plaene/PLAN_UMZUG_V3.md` ....... **Ablaufbuch N40 V3** (Umzug ins oeffentliche Repo): Schritte mit WER/Ort/Pruefbefehl/Rueckweg, Fundstellen des Repo-Namens, offene Nutzer-Fragen · Probe: `tools/umzug_v3_probe.sh`
#   `PRUEFBERICHT_2026-07-26.md` .. Hintergrund/Messwerte, die die Qualitätsrunde ausgelöst haben
#   `docs/befunde/COVERAGE.md` ............ manuelle Abdeckungsanalysen (live: `node tools/pool_query.js coverage`)
#   `docs/befunde/BEFUNDE_BILDFRAGEN.md` .. **Sichtprüfung aller 96 Bildfragen (07.09.)** – B141–B144, die
#                              Nachscans, die geprüften IDs. ⚠️ Abschnitt 3 nicht neu messen.
#   `docs/befunde/BEFUNDE_INDEX.md` ....... **welche B-Nummer wo steht.** ⛔ ERZEUGT (`befunde_index.py`).
#   `docs/befunde/BEFUNDE_BUCH_KATALOG.md`  Probe gegen Lehrbuch und Pruefungskatalog (03.09.), Quellenlage,
#                              B126, und warum der Prosa-Abgleich nicht taugt
#   `tools/katalog/` .......... Pruefungskatalog FISI 2024 als durchsuchbarer OCR-Text.
#                              **Die maßgebliche Quelle fuer den Pruefungsumfang.**
#   `docs/befunde/SORTIERUNG_PRUEFUNGSORDNUNG.md` .. Gebiets-Zuordnung A1–A5/B1–B3 · **Messpunkt der
#                              Gebietsverteilung vom 28.07.** und die Begründung, warum es
#                              bewusst keinen Wächter für das GRÖSSTE Gebiet gibt
#   `laengen_ausnahmen.json` . **Grenzwerte UND Bestandsentscheide zum Längenverhältnis der
#                              mc-Optionen.** EINE Quelle für `tests/test_didaktik.js` (Wächter 5),
#                              `tools/apply_batch.py` (Klasse 10) und `tools/opt_ersatz.py`.
#                              ⚠️ Ein Eintrag wirkt wie das Anheben einer Ratsche – **nur mit
#                              Nutzer-Entscheid, Datum und Begründung** (`faktor_bestand` deckelt).
#   `begriffe_belegt.json` .. **gegensaetzlich benutzte Fachbegriffe.** ⚠️ **Klein halten ist die
#                              Regel, nicht die Zahl** – aufgenommen wird ein Begriff erst, wenn der
#                              Widerspruch BELEGT ist (`_warnung`). ⚠️ Misst KEINE Bedeutung (`_grenze`).
#   `zitate_belegt.json` ..... **Belegte Gesetzeszitate UND Vorschriften ohne Absatzgliederung.**
#                              EINE Quelle für `check.sh` 4e4 und `pool_query.js zitate`. ⚠️ Ein
#                              neues Zitat wird eingetragen – sonst rot; auch der WORTLAUT wird geprüft.
#

## Nachgetragen 11.10.2026 (N49 W3)
#   `entscheide/` ............ **Nutzer-Entscheide ab E072, je eine Datei** (ADR-Muster: Status, Kontext, Entscheid,
#                              Folgen; unveraenderlich). E1–E71 bleiben als Tabelle in `docs/plaene/PLAN_NEUBAU.md`.
#                              Vorlage und Regeln: `entscheide/README.md`; Waechter 4g2 (`tools/entscheide.py`).
