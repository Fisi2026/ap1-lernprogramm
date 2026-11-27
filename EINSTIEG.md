# EINSTIEG - der kurze Weg in einen Chat

⛔ **ERZEUGT VON `tools/einstieg.py` - NICHT VON HAND AENDERN.** Jede Zeile stammt aus
`START_PROMPT.md` oder `BUILD_LOG.md`; `check.sh` 4f-einstieg meldet, sobald sie driften.
⚠️ **Diese Datei reicht fuer WERKZEUG- und NEUBAU-Arbeit.** Wer Pool, Frage, Verweis oder
Lehrtext anfasst, liest `START_PROMPT.md`, `regeln/pool.md` und `regeln/messen.md` GANZ (Tabelle unten).

## 1. Anfangen - EIN Aufruf

```
bash tools/start.sh --neuer-chat <gmail|web.de>
```
Er misst Umgebung, Baum, Push-Stand, CI-URTEIL, den Plugin-Stand je Konto und zeigt den
naechsten Griff. Verbrauch: die `[limits]`-Zeilen des Plugin-Hooks (seit 12.10. massgeblich,
`tools/wache.py` nur noch Notfall, wenn keine Zeile kommt - E077).

## 2. Stand (aus START_PROMPT.md gezogen)

**APP_VERSION 2.13.2 · app-sw ap1-app-2.13.2 · Pool 1487 Fragen + 9 Fälle · 7 von 7 Suiten GRÜN**
**LIVE beim Lerner: v2.13.2 · committet auf main: v2.13.2 · PUSH DURCH**

## 3. Naechster Griff (letzter BUILD_LOG-Eintrag)

**Damit offen:** ►► Zweig `claude/optimistic-feynman-b8gtxx` (BUILD_LOG 302–311) vom PC pruefen und nach main uebernehmen, danach `gh workflow run Mutation` (erster Volllauf) · Rest N42 (B1 Probelauf, B2 Rollback/Time Travel, B4 DORA – Cloudflare/`gh`; B3 Live-Waechter – Lese-Secret) · Paket 1 (Opus, PC: `gh` angemeldet): PR-Ablauf, Ruleset, Auto-Merge · erste Sonnet-Etappe mit `/advisor opus` messen · Inhalt danach: AP1 komplett bis Fruehjahr 2027 · Release `werkzeuge-fisi1.3.18-shell1.1.2` nach der Uebernahme nach main vom PC (`bash tools/werkzeug_release.sh`), dann fisi 1.3.18 in web.de und gmail installieren (Nutzer) und `tools/plugin/installiert.txt` nachziehen · Pfad-Kommentare in `pool/sets/*.json`, `zitate_belegt.json`, `tools/klausur_k*/set_bauen.py` auf `docs/plaene/` nachziehen (fliessen ins App-Buendel: nur zusammen mit einer Bau-Aenderung) · Schritt 14 auf den anderen zwei PCs · `../srv2.pid`, `../Training_erstcommit` loeschen (Nutzer) · `../Buch/klausur_k3` committen (Nutzer)

## 4. Die harten Grenzen der Bruecke

* Jeder Aufruf **60 s** - alles Laengere per `nohup` im Hintergrund, auf die `.fertig`-Marke warten.
* Jeder Aufruf **~8190 Zeichen** - STILL gekuerzt, Rueckgabewert 0. Ueber 4000 Zeichen
  schliesst der Befehl mit einer eigenen Zeile `#ENDE`; ueber ~6000 in Stuecken schreiben,
  danach `wc -c` lesen.
* Tests, Bau, git und Push laufen ueber die **Training Shell**, nicht ueber `device_bash`.

## 5. Arbeitsregeln (Kurztitel - Volltext in START_PROMPT.md Abschnitt 5)

  1. **RÜCKFRAGE-PFLICHT (AskUserQuestion):** Bei jeder Design-/Umfangs-/Formulierungs-Entscheidung
  2. **PUSH MACHT DER CHAT SELBST** (Nutzer-Entscheid 17.09.2026): erst wenn `check.sh` GRÜN ist,
  3. **Pool NUR in `pool/*.json`; gelesen wird er NUR über `tools/pool_laden.js`** (E40 – `fragen.js`/
  4. **Verifikation ist NIE Agentensache** – Suiten selbst fahren, jeden Diff lesen, Zahlen selbst
  6. **PRÜFLAUF: DER WEG WIRD JE SITZUNG GEMESSEN, NICHT GEGLAUBT** (Nutzer-Entscheid 07.09.).
  7. **`bash ci2.sh` läuft über die Training Shell** (`gh` gibt es nur auf Windows). Rückgabewert

## 6. WANN DIE VOLLFASSUNG PFLICHT IST

  PFLICHT: Pool-Datei, Frage, Verweis, Lehrtext oder Spickzettel anfassen → `regeln/pool.md` + `regeln/messen.md`
  PFLICHT: einen Wächter, eine Prüfung, eine Gegenprobe oder ein Messwerkzeug bauen/ändern → `regeln/messen.md`
  PFLICHT: eine Kennzahl, Quote oder Mengenaussage melden → `regeln/messen.md`
  PFLICHT: ein Python-Skript, das Projektdateien schreibt → `regeln/bruecke.md`
  PFLICHT: mehr als einen Einzeiler über die Brücke schicken, Rechner- oder Kontowechsel → `regeln/bruecke.md`
  PFLICHT: committen, pushen, Release, Aussage über den Stand beim Lerner → `regeln/git.md`
  PFLICHT: eine Steuer- oder Protokolldatei suchen → `regeln/dateien.md`
  PFLICHT: einen Nutzer-Entscheid festhalten (ab E072 je eine Datei) → `entscheide/README.md`
  PFLICHT: ein Mess- oder Hilfsskript schreiben wollen → `WERKZEUGE.md` (es gibt es meist schon)
  PFLICHT: am Neubau `neu/` arbeiten → `SCHIENE_NEU.md` und `docs/plaene/PLAN_NEUBAU.md`
  PFLICHT: Agenten einsetzen → Skill `fisi:agenten-orchestrierung`; Ausgaben kürzen, Tooling-Fallstricke → `TASKLIST.md`
  PFLICHT: eine Inhaltsrunde (Katalog-Luecken) planen oder fahren → `docs/plaene/PLAN_INHALT.md`
