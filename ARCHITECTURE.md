# ARCHITECTURE.md – Code-Landkarte des Neubaus

**Stand 27.09.2026 (v2.2.1, nach N34/N35).** Die Landkarte der ALTEN App (bis v1.x, `logik.js` + `app_*.js`)
liegt verbatim in `referenz/ARCHITECTURE_ALT.md`. ⚠️ **Hier stehen keine Zeilennummern und keine Zahlen** –
wer eine Stelle sucht, greppt den Namen; Mengen misst `check.sh`.

## Datenfluss

```
pool/*.json ──(Vite, @pool)──► daten/pooldaten.ts ──(import() bei Bedarf, eigener Chunk)──► daten/laden.ts (FRAGEN, Fälle)
                                                                                                │
kern/tabellen/*.ts (Konfiguration, Gebiete, Noten, Fragetypen, Prüfung, Szenarien, Glossar,     ▼
Abkürzungen, Spickzettel) ──────────────────────────────────────────────────────────────► kern/*.ts (rechnet)
                                                                                                │
Lernstand: localStorage (kern/stand.ts, LS_SCHLUESSEL) ◄──► huelle/useLernstand.ts ◄──► schirme/*, huelle/*, fragetypen/*
                                                                                                │
„Frage melden" / Fehlerberichte: kern/meldeversand.ts, kern/fehlerbericht.ts ──POST /api/*──► server/worker.ts → api.ts → D1
```

## Schichten

| Ordner (`neu/src/`) | Aufgabe | Regel |
|---|---|---|
| `kern/tabellen/` | reine Daten, importieren nichts | Node lädt sie nativ (E49); Werkzeuge über `tools/kern.js` |
| `kern/` | **jede Regel genau einmal**: `bewertung.ts` (grade, 22 Bewerter), `zahlen.ts`, `lernen.ts` (Deck, Fehler-Deck, Gewichtung, Bereitschaft), `zufall.ts`, `ziehen.ts`/`auswahl.ts`, `pruefung.ts` + `simulation.ts`, `rechenaufgabe.ts` + `generatoren.ts`, `validierung.ts`, `verbuchen.ts`, `stand.ts`, `uebenablauf.ts` + `simablauf.ts` (Ablauf der Schirme als reiner Reducer, N37 U5) … | „Gerechnet wird in `kern/`" (Regel 1); kein React, kein Pool-Laden, keine Oberflaeche – `tools/architektur_regeln.cjs` (Waechter 4f_architektur, N43 M2) |
| `daten/` | Pool laden, Typen (`typen.ts`), Fälle | liest `pool/` direkt, nie ein Bauergebnis |
| `fragetypen/` | je Typ eine Eingabe; `register.ts` ordnet Typ → Komponente, `vertrag.ts` die Props | bewertet NICHT |
| `schirme/` | die Bereiche (Üben, Simulation, Glossar …) | rufen `kern/`, zeichnen selbst |
| `huelle/` | Schiene, Kopf, Update-Hinweis, Service-Worker-Anbindung, `useLernstand` (React-Hook um `kern/stand.ts`), Bedeutungsbaum-Schnappschuss | |
| `components/ui/` | shadcn/ui (neutral, Dark) | |
| `lib/` | Trusted-Types-Politik (`vertrauen.ts`), Download | |
| `server/` | Cloudflare Worker: `worker.ts` (Eingang, Aufbewahrung per Cron), `api.ts` (Schreib-/Admin-Wege), `regeln.ts`/`fehlerregeln.ts` (Eingangsprüfung), `migrationen/` (D1) | nur gebundene SQL-Werte; aus der App nur `kern/pruefe.ts` + `kern/route.ts` (Waechter 4f_architektur) |
| `testhilfe/` | `altquelle.ts`: Pfade der eingefrorenen alten App für die Gleichheitstests | kein stiller Rückfall |

Adressen: Hash-Routing (`kern/route.ts`, `BEREICHE`), z. B. `#ueben`, `#frage=<ID>`.
Service Worker: `neu/sw/plugin.ts` erzeugt `v2/app-sw.js` (Cache `ap1-app-<version>-<stempel>`).

## Tests

* **vitest** neben dem Code (`*.test.ts`, DOM-Tests `*.jsdom.test.tsx`), Sollwert in `check.sh` 4f,
  Coverage-Schwellen in `vitest.config.ts`.
* **Gleichheitstests** `kern/*.gleichheit.test.ts`: jede übernommene Regel gegen die eingefrorene
  `referenz/logik.js` über den ganzen Pool (N34).
* **Bedeutungsbaum-Schnappschuss** `huelle/schnappschuss.jsdom.test.tsx`: verschiebt sich die Bedienung still?
* **Pool-Suiten** `tests/test_*.js` (Node/jsdom) und die Wächter in `check.sh`.
* **Rauchtest** im echten Browser: `tools/sichtpruefung/rauch.js` (auch in der CI).
