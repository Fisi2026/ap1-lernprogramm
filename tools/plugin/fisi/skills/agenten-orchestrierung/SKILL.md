---
name: "agenten-orchestrierung"
description: "Regelt den Einsatz von Subagenten in jedem Chat: wann delegiert wird, welches Modell (Haiku für Recherche, Sonnet für Entwürfe), wie ein Auftrag aussieht, welche Rechte der Agent bekommt und wie sein Ergebnis geprüft wird. Verwenden, bevor ein Agent gestartet wird oder wenn Recherche, Doku-Abgleich oder Massenarbeit delegiert werden könnte."
---

# Agenten-Orchestrierung

Quelle: `tools/plugin/fisi/skills/agenten-orchestrierung/SKILL.md` im Training-Repo (Plugin „fisi“).
Gilt für alle Chats. Projektregeln gehen vor (Training-Repo: `TASKLIST.md`, Abschnitt 0).

Der Nutzer erlaubt ausdrücklich, Recherche- und Massenaufgaben nach diesen Regeln an Subagenten zu geben.

## Wann ein Agent

- **Ja:** abgeschlossene Nebenaufgabe, deren Rohdaten (Suchtreffer, Logs, viele Dateien) den
  Hauptkontext fluten würden und die als Zusammenfassung zurückkommen kann; unabhängige,
  parallelisierbare Recherchen.
- **Nein:** viel Hin und Her, geteilter Kontext, kleine gezielte Änderung, Wartezeit zählt, oder die
  Aufgabe ist mit 1–3 eigenen Aufrufen erledigt. Code-Arbeit bleibt im Hauptchat.
- **Kosten:** Mehr-Agenten-Arbeit braucht laut Anthropic rund 15-mal so viele Tokens; jeder Agent zählt
  auf dieselben Limits (5h/7T) wie der Hauptchat. Gemessen: ein Haiku-Agent mit 2 Aufrufen ≈ 84 000
  Tokens Grundlast; ein Sonnet-Agent für 108 Stellen ≈ 130 000 (14.10.).
- **Ab 80 % Wochenlimit vor jedem Agenten fragen** (Nutzer-Entscheid 14.10., BUILD_LOG 174/175) – mit
  geschätztem Verbrauch und der Uhrzeit der letzten Verbrauchsmessung.

## Modell – das billigste, das reicht (`model` je Aufruf setzen)

| Modell | Für |
|---|---|
| `haiku` | Web-Recherche, Doku-Abgleich, Fundstellensuche, Massenarbeit nach festem Template mit Prüfskript |
| `sonnet` | Code- und Textentwürfe mit Kontextbedarf, nur auf Kopien |
| `opus` / geerbt | Gegenprüfung, Architekturfragen |

Ohne `model` erbt jeder Agent das Modell des Hauptchats (Opus) – darum `model` immer setzen. Das gilt
auch für den eingebauten „Explore“: mit `model: haiku` läuft er billig (Doku Stand 14.10.).

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
4. Grenzen, wörtlich bei Recherche: „nur lesen; keine Dateien schreiben, kein git“ – und in JEDEM
   Auftrag „keine weiteren Agenten starten“ (Agenten dürfen laut Doku seit v2.1.219 selbst Agenten starten,
   Tiefe 3)

Große Ergebnisse legt der Agent unter `/tmp/agent_<thema>.md` ab und gibt nur Pfad und Kern
(höchstens 10 Zeilen) zurück.

## Rechte

Agenten erben die Schreib-Werkzeuge, auch die Shell auf dem PC – darum die Grenze in jedem Auftrag.
Schreiben, Commit, Push und Löschen macht nur der Hauptchat.
Code-Arbeit eines Agenten nur auf einer Kopie: `git worktree add --detach` plus Verlinkung von
`node_modules`, `neu/node_modules`, `.tooling/node_modules` (gemessen 14.10.: ohne Verlinkung fehlen
tsc/oxlint/vitest; das eingebaute `isolation: worktree` verlinkt nicht). Danach `git diff` als Patch in
den Hauptbaum, Kopie entfernen.

## Prüfung

- Ein Agent-Ergebnis ist Entwurf oder Hinweis, nie Beleg. Jeder Fund wird selbst nachgemessen
  (Test, Diff, Rechnung, Quelle), bevor er zählt.
- Erlaubt: ein Gegenprüf-Agent mit frischem Kontext sucht Lücken gegen Plan oder Anforderung
  („nur Lücken mit Wirkung auf Korrektheit, keine Stilwünsche“) – oder die eingebaute `/code-review`
  auf den aktuellen Diff. Ein Prüfer, der Lücken suchen soll, findet meist welche: nur Funde mit
  Wirkung auf Korrektheit verfolgen (Doku best-practices).

## Bericht an den Nutzer

Deutsch, knapp, als Liste; Abkürzungen ausschreiben. Am Ende die Quellen als Links.

## Quellen (abgeglichen 14.10.2026, BUILD_LOG 175)

code.claude.com/docs/en/sub-agents · code.claude.com/docs/en/best-practices ·
platform.claude.com/docs/en/about-claude/models/choosing-a-model ·
anthropic.com/engineering/multi-agent-research-system
