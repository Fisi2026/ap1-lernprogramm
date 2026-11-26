---
name: "agenten-orchestrierung"
description: "Regelt den Einsatz von Subagenten in jedem Chat: wann delegiert wird, welcher feste Projekt-Agent (recherche/Haiku, entwurf/Sonnet, pruefer/Opus, Explore/Haiku) bzw. welches Modell, wie ein Auftrag aussieht, welche Rechte der Agent bekommt und wie sein Ergebnis geprüft wird. Verwenden, bevor ein Agent gestartet wird oder wenn Recherche, Doku-Abgleich oder Massenarbeit delegiert werden könnte."
---

# Agenten-Orchestrierung

Quelle: `tools/plugin/fisi/skills/agenten-orchestrierung/SKILL.md` im Training-Repo (Plugin „fisi“).
**Dieser Skill ist die EINE Stelle für die Agenten-Regeln.** `TASKLIST.md` Abschnitt 0 verweist nur hierher
und trägt die datierten Projektbelege (Messungen, Entscheide).

Der Nutzer erlaubt ausdrücklich, Recherche- und Massenaufgaben nach diesen Regeln an Subagenten zu geben.
Der Hauptchat macht Briefing, Integration, fachliche Prüfung, Tests, Commit und Push; Code selbst bei Eingriffen < ~50 Zeilen.

## Wann ein Agent

- **Ja:** abgeschlossene Nebenaufgabe, deren Rohdaten (Suchtreffer, Logs, viele Dateien) den
  Hauptkontext fluten würden und die als Zusammenfassung zurückkommen kann; unabhängige,
  parallelisierbare Recherchen.
- **Nein:** viel Hin und Her, geteilter Kontext, kleine gezielte Änderung, Wartezeit zählt, oder die
  Aufgabe ist mit 1–3 eigenen Aufrufen erledigt. Code-Arbeit bleibt im Hauptchat (laut Anthropic schlecht parallelisierbar).
- **Kosten:** Mehr-Agenten-Arbeit braucht laut Anthropic rund 15-mal so viele Tokens; jeder Agent zählt
  auf dieselben Limits (5h/7T) wie der Hauptchat. Grundlast je Agent rund 55 000–85 000 Tokens, auch ohne Werkzeugaufruf
  (Messwerte: `TASKLIST.md` 0).
- **Ab 80 % Wochenlimit vor jedem Agenten fragen** – mit geschätztem Verbrauch und der Uhrzeit der letzten Verbrauchsmessung.

## Welcher Agent – feste Projekt-Agenten zuerst

Im Training-Repo liegen feste Agenten in `.claude/agents/` (Modell, Effort, Werkzeuge im Frontmatter). Sie gehen vor
`general-purpose` + `model`:

| Agent | Modell | Werkzeuge | Für |
|---|---|---|---|
| `recherche` | Haiku, effort medium | Read, Grep, Glob, WebSearch, WebFetch | Web-Recherche, Doku-Abgleich, Fundstellen |
| `Explore` | Haiku, effort medium | Read, Grep, Glob | schnelle Fundstellensuche (ersetzt den eingebauten, der sonst das Hauptmodell erbt) |
| `entwurf` | Sonnet | Read, Grep, Glob, Write, Edit | Code-/Textentwürfe mit Kontextbedarf, nur in eine Kopie |
| `pruefer` | Opus | Read, Grep, Glob | Gegenprüfung eines Diffs oder Plans |

Ohne festen Agenten (anderes Repo, Massenarbeit mit Shell): `general-purpose` und `model` setzen – das billigste, das reicht:
`haiku` für Recherche und Massenarbeit nach festem Template mit Prüfskript, `sonnet` für Entwürfe, `opus` nur für
Gegenprüfung und Architektur. Vorlagen im Training-Repo: Fragen-Batches nach `prompts/fragen_batch.md` (der Agent liefert
`tools/validate_batch.js` selbst grün, danach nur fachlich prüfen), Entwürfe nach `prompts/feature_draft.md` bzw.
`prompts/fragetyp_neu.md`.

**Welches Modell ein Agent bekommt (Vorrang, Doku sub-agents/model-config):** `model` im Aufruf > `model` im Frontmatter >
Umgebungsvariable `CLAUDE_CODE_SUBAGENT_MODEL` > Modell des Hauptchats. Ohne alles erbt der Agent das Hauptmodell – auch der
eingebaute Explore. **Effort** setzt das Frontmatter-Feld `effort` (low … max); ohne Feld gilt die Vorgabe des Modells
(Opus 5.5 und Haiku 5.5: medium).

**Preise je Mio. Tokens Ein-/Ausgabe** (API-Listenpreise; im Abo zählt der Anteil am 5h-/7T-Limit, Opus „uses meaningfully more“):
Fable 5.2 8/40 $ · Opus 5.5 4/20 $ · Sonnet 5.5 2/10 $ · Haiku 5.5 0,10/0,50 $ (bis 100K Prompt, darüber 0,50/2,50 $).
Quelle: platform.claude.com/docs/en/about-claude/models/overview (gelesen 26.11.2026) und Skill claude-api (Stand 03.11.2026).

**Advisor (experimentell):** statt eines Prüf-Agenten kann der Hauptchat ein stärkeres Beratermodell zuschalten
(`/advisor <modell>`, Einstellung `advisorModel`, Flag `claude --advisor <modell>`; aus: `/advisor off`); der Berater muss
mindestens so stark sein wie das Hauptmodell. Im Abo zählen seine Tokens aufs Planlimit, über die API zu den Raten des
Beratermodells. Nur auf Zuruf des Nutzers einschalten; Messstand: `TASKLIST.md` 0, Doku code.claude.com/docs/en/advisor.

## Umfang

- Faktfrage: 0–1 Agent, 3–10 Aufrufe · Vergleich: 2–4 Agenten parallel, je 10–15 Aufrufe ·
  große Recherche: mehr Agenten mit klar getrennten Zuständigkeiten.
- Unabhängige Agenten in einer Nachricht starten; sie laufen parallel.

## Auftrag

Der Agent sieht den Chat nicht; der Auftrag muss allein verständlich sein. Vier Pflichtteile:

1. Ziel
2. Ausgabeformat mit Deckel (z. B. „höchstens 15 Zeilen Liste, je Befund Quelle und Datum“)
3. Quellen und Werkzeuge – Primärquellen (Hersteller-Doku, Gesetzestext, IHK) vor SEO-Seiten;
   erst kurz und breit suchen, dann eingrenzen
4. Grenzen, wörtlich bei Recherche: „nur lesen; keine Dateien schreiben, kein git“

**Keine weiteren Agenten:** im Training-Repo deterministisch – `.claude/settings.json` setzt
`CLAUDE_CODE_MAX_SUBAGENT_SPAWN_DEPTH=1`, ein Subagent hat dann kein `Agent`-Werkzeug (gemessen 26.11.2026). Ohne diese
Einstellung (Standard Tiefe 3) gehört „keine weiteren Agenten starten“ in jeden Auftrag.

Große Ergebnisse legt der Agent als Datei ab (Scratchpad bzw. `/tmp/agent_<thema>.md`) und gibt nur Pfad und Kern
(höchstens 10 Zeilen) zurück.

## Rechte

Ein Agent ohne `tools`-Liste (z. B. `general-purpose`) erbt alle Werkzeuge, auch Shell und Schreiben – darum die Grenze im
Auftrag oder ein fester Agent mit enger `tools`-Liste. Schreiben, Commit, Push und Löschen macht nur der Hauptchat.
Code-Arbeit eines Agenten nur auf einer Kopie: `git worktree add --detach` plus Verlinkung von
`node_modules`, `neu/node_modules`, `.tooling/node_modules` (ohne Verlinkung fehlen tsc/oxlint/vitest; das eingebaute
`isolation: worktree` verlinkt nicht). Danach `git diff` als Patch in den Hauptbaum, Kopie entfernen.

## Prüfung

- Ein Agent-Ergebnis ist Entwurf oder Hinweis, nie Beleg. Jeder Fund wird selbst nachgemessen
  (Test, Diff, Rechnung, Quelle), bevor er zählt.
- Erlaubt: der `pruefer` (frischer Kontext) sucht Lücken gegen Plan oder Anforderung
  („nur Lücken mit Wirkung auf Korrektheit, keine Stilwünsche“) – oder die eingebaute `/code-review`
  auf den aktuellen Diff. Ein Prüfer, der Lücken suchen soll, findet meist welche: nur Funde mit
  Wirkung auf Korrektheit verfolgen (Doku best-practices).

## Bericht an den Nutzer

Deutsch, knapp, als Liste; Abkürzungen ausschreiben. Am Ende die Quellen als Links.

## Quellen (abgeglichen 26.11.2026, BUILD_LOG 296–298)

code.claude.com/docs/en/sub-agents · …/model-config · …/costs · …/advisor · …/best-practices ·
platform.claude.com/docs/en/about-claude/models/overview · …/choosing-a-model ·
anthropic.com/engineering/multi-agent-research-system
