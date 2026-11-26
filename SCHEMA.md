# SCHEMA.md – Fragen-Schema des AP1-Lernprogramms (#81)

⚠️ **Seit N37 U3 (27.09.2026, E60):** Die Felder je Typ stehen maschinenlesbar in `tools/schema/frage.schema.json`
(erzeugt von `tools/build_schema.js`); daraus werden die TS-Typen `neu/src/daten/frage.generiert.ts` erzeugt.
Ausfuehrbar prueft `validateFragen` in `neu/src/kern/validierung.ts` (seit N34, vorher `logik.js`); wo Schema und
Kern bewusst verschieden pruefen, haelt `neu/src/daten/schema.deckung.test.ts` fest. Dieses Dokument ist die
menschenlesbare Referenz – **bei Widerspruch gilt das Schema**. Der Pool liegt in `pool/pool_m*.json` (Arrays von Frage-Objekten) und wird ueber
`tools/pool_laden.js` gelesen und geprueft (seit N29 Teil 2; `fragen.js`/`build_fragen.py` entfielen).

Prüfen: `node tools/validate_pool.js` (ganzer Pool) · `node tools/pool_query.js idcheck` (IDs) ·
`node tools/validate_batch.js <batch.json>` (neuer Batch gegen Bestand) ·
`node tools/validate_schema.js` (#22: deklaratives JSON-Schema, s. u.).

**Deklaratives JSON-Schema (#22, G1.1):** `tools/schema/frage.schema.json` (Draft-07, pro Typ streng) ist der
maschinenlesbare Spiegel von `L.validateFragen` – GENERIERT aus `tools/build_schema.js` (wie fragen.js: nicht
von Hand editieren, sondern Builder anpassen + `node tools/build_schema.js`). `validate_schema.js` prüft den
gebauten Pool (inkl. gemergter `varianten`) mit **ajv** dagegen; die kanonische `thema`-Enum wird zur Laufzeit aus
`L.THEMA_RELEVANZ` injiziert (driftfrei). Läuft in `check.sh` (nach validate_pool) und im CI. ajv liegt persistent
in `.tooling/` (gitignored, wie jsdom). Bei Schema-Regeländerung: build_schema.js anpassen → neu bauen → check.sh.

## Pflichtfelder (jede Frage)
| Feld | Typ | Regel |
|---|---|---|
| `id` | String | Format `M0X-NNN` (z. B. `M03-742`); eindeutig; Präfix == `modul`. |
| `modul` | String | `M01`…`M08`. |
| `thema` | String | Muss ein **kanonisches Thema** sein (Key von `L.THEMA_RELEVANZ`). |
| `typ` | String | Einer aus `L.TYPEN` (s. u.). |
| `schwierigkeit` | Integer | 1–4 (1 = Anfänger … 4 = Transfer). |
| `pruefungsteil` | String | `AP1` oder `AP2` (AP2 = Zusatzstoff, z. B. Subnetting/ER-Modell/WiSo). |
| `frage` | String | Aufgabentext. Bei `lueckentext`/`dropdown`: enthält `___`-Platzhalter. |

## Typen (`L.TYPEN`) und ihre typspezifischen Felder
- **mc**: `optionen` (≥2 Strings), `loesungIndex` (0-basiert). Optional `distraktorErklaerungen[]`.
- **mehrfach**: `optionen`, `loesungIndizes[]` (≥1).
- **dropdown**: `luecken[]` je mit `optionen` (≥2) + `loesung` (Index); Anzahl `___` == Anzahl luecken.
- **lueckentext**: `loesung` (akzeptierte Eingaben); `___` im Fragetext.
- **zuordnung**: `paare[]` (je `[links, rechts]`, ≥3). Bewertung TEXTBASIERT (many-to-one möglich).
- **reihenfolge**: `schritte[]` (≥3, in korrekter Reihenfolge).
- **hotspot**: `svg` (mit `viewBox`), `zonen[]` mit `{x,y,w,h,richtig}` – **genau 1** `richtig:true`, Zonen im viewBox.
- **freitext / erklaeren**: `musterloesung` (String). Optional `schluesselbegriffe:{pflicht:[…], kuer:[…]}` (#76,
  gewichtete Teilpunkte). `erklaeren` speist zusätzlich das Glossar (kurze Begriffe).
- **bild**: `svg` + `unterTyp` (rendert wie der jeweilige Basistyp über der Grafik).
- **matrix / beschriftung / trace / konsole / kalkulation / baukasten / fehlersuche /
  generator**: interaktive Sonderformen mit eigenen Feldern (Details: `L.validateFragen` + jeweiliger
  `grade…`-Aufruf in `logik.js`).
- **rechenassistent**: `schritte[]` mit `{text, einheit?}`. Es gibt ZWEI Bauformen, das Schema erzwingt
  per `oneOf` genau eine:
  - *klassisch*: je Schritt `loesung: […]` (akzeptierte Schreibweisen), optional feste `varianten`.
  - *randomisiert* (#35, G2.6): die Frage trägt `variablen: {name:{min,max,schritt}}`, je Schritt eine
    `formel` (Operatoren `+ - * / ( )`, Variablennamen und `s1..sN` = Ergebnisse der Vorgängerschritte),
    optional `dezimalen` (Default 2). Musterlösung und Anzeigewerte entstehen zur Laufzeit in
    `L.instanziiere`/`L.rechneAufgabe`; geprüft wird numerisch mit Toleranz (`L.toleranzFuer`).
    In `frage`, `schritte[].text` und den Erklärungen sind Platzhalter erlaubt: `{variable}`,
    `{ausdruck}` (volle Formelsyntax) und `{ausdruck|N}` für feste Nachkommastellen, z. B.
    `{preisCent/100|2}` für einen ganzzahlig gezogenen Cent-Betrag. Variablennamen dürfen NICHT
    `s1`, `s2`, … heißen. Der Validator prüft zusätzlich, dass alle Extremkombinationen der
    Wertebereiche rechenbar sind (keine Division durch 0).

## Optionale Felder (alle Typen)
`erklaerungKurz`, `erklaerungLang`, `verweis` (Quelle/Theorie-Fundstelle), `antwort2` (Zahlen-Varianten für
parametrisierte Fragen), `hinweisFD`/`hinweisSerie` (Laufzeit-Badges, nicht im Pool setzen).

## Invarianten
- Kein `el("<tr>/<td>")` im Renderer (HTML-Parser verwirft Tabellenzeilen ohne `<table>`).
- `thema` streng aus der kanonischen Liste – neue Themen zuerst in `L.THEMA_RELEVANZ` aufnehmen.
- AP1-Abgrenzung: Subnetting/ER-Modell/M08-WiSo = `pruefungsteil:"AP2"`, Rest `AP1`.
