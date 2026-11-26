# Skills fuer beide Konten – seit N36 ein Plugin

⛔⛔ **DIE SKILLS STEHEN IM REPO:** `tools/plugin/fisi/skills/<name>/SKILL.md` (Plugin „fisi", N36, E59).
Bis 27.09.2026 lagen sie als Konto-Skills in zwei Konten (`gmail`, `web.de`) und wurden von Hand
nachgezogen – dabei hing `token-wache` in web.de hinter gmail (8509 statt 8938 Byte, gemessen 27.09.).
Die Handpflege, `tools/skill_sicherung/*.SOLL` und `aktualisieren.sh` sind entfallen (Git-Historie).

## Aendern
1. `tools/plugin/fisi/skills/<name>/SKILL.md` bearbeiten (LF, `newline=""`), bei Bedarf `version` in
   `tools/plugin/fisi/.claude-plugin/plugin.json` hochzaehlen.
2. `python3 tools/plugin/packen.py` → `_to_delete/helfer/fisi-<version>.plugin` (prueft plugin.json und
   die name-Zeile jedes Skills).
3. **`bash tools/werkzeug_release.sh`** – baut `.plugin` und `.mcpb` und legt das GitHub-Release
   `werkzeuge-fisi<v>-shell<v>` mit beiden Dateien und dem Projekt-Dokument an (Nutzer-Entscheid 27.09.2026:
   ueberall herunterladbar, auch ohne Klon). Zusaetzlich die `.plugin` per `device_stage_files` holen und mit
   `SendUserFile` schicken. Der Nutzer installiert sie **in BEIDEN Konten**. ⛔ Quellen geaendert ohne
   Versionssprung → das Werkzeug bricht ab (Fingerabdruck in den Release-Notizen).

4. **Vermerken:** nach der Installation die Zeile des Kontos in `tools/plugin/installiert.txt` auf die
   neue Fassung setzen. `tools/start.sh` (Abschnitt PLUGIN, `tools/plugin/soll.sh`) warnt je Konto, wenn
   Vermerk und Repo auseinanderliegen. ⛔ **Die Shell sieht das Konto nicht:** ob das Plugin WIRKLICH da ist,
   sieht nur der Chat in seiner Skill-Liste (nur `fisi:…`) – beim Start ansehen, nicht glauben (27.09.:
   gmail lief nach dem PC-Wechsel noch mit den alten Konto-Skills, start.sh meldete nichts).

## Einmalig nach der ersten Installation (in beiden Konten)
* Die alten Konto-Skills `fisi-lernapp` und `token-wache` loeschen – sonst stehen sie neben
  `fisi:fisi-lernapp` / `fisi:token-wache` doppelt in der Liste.

## Projekt-Dokument je Konto (seit 27.09.2026 mit Quelle im Repo)
* `tools/plugin/projekt_einstieg.md` ist die Quelle des claude.ai-Projekt-Dokuments „FISI-Lern-App_Einstieg"
  im Projekt „Training". Aendern NUR dort; der Chat schreibt es mit `Projects project_write` ins Projekt
  SEINES Kontos – fuer das andere Konto schickt er die Datei, der Nutzer legt sie dort ab.

## Nicht im Plugin
* Die **Training Shell** bleibt die `.mcpb`-Erweiterung (`tools/training-shell/`) – Nutzer-Entscheid
  27.09.: ein Plugin-Server mit Einstellungen ist in der App ungemessen, der Pfad waere fest verdrahtet.
