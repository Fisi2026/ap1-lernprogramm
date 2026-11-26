#!/usr/bin/env python3
"""Erzeugt neu/src/kern/tabellen/spickzettel.ts aus 99_Spickzettel.md. Aufruf im Projektordner:
       python3 tools/build_spick.py

⚠️ WARUM ES DIESES SKRIPT SEIT DEM 04.08.2026 GIBT:
   `spickzettel.js` trug im Kopf den Satz „Inhalt aus 99_Spickzettel.md" – gebaut wurde er aber
   nie, sondern von Hand als JSON-escapter String parallel gepflegt. Zwei Quellen fuer denselben
   Text, ohne Waechter: Gemessen waren sie am 04.08. zufaellig noch zeichengleich (10437 zu
   10437), aber das war Glueck, keine Zusicherung. Dieselbe Klasse wie die zwei Kopierlisten von
   check.sh und tools/suite.sh und die zwei Dateiuebersichten in START_PROMPT/TASKLIST – beide
   sind auseinandergelaufen.
   ►► Wer den Spickzettel aendert, aendert 99_Spickzettel.md und laesst dieses Skript laufen.
⚠️ SEIT N34 T6b (27.09.2026, E56): das Ziel ist `neu/src/kern/tabellen/spickzettel.ts`, nicht mehr die
   Wurzel-`spickzettel.js` (die faellt mit T6c). Geschrieben wird mit `newline=""` – unter Windows
   schriebe Python sonst CRLF (SCHIENE_NEU §3). `spickzettel.gleichheit.test.ts` haelt die Datei gegen
   die Markdown-Quelle.
"""
import json
import os

WURZEL = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
QUELLE = os.path.join(WURZEL, "99_Spickzettel.md")
ZIEL = os.path.join(WURZEL, "neu", "src", "kern", "tabellen", "spickzettel.ts")

with open(QUELLE, encoding="utf-8") as f:   # Lesen OHNE newline="": CRLF der Quelle wird zu LF
    md = f.read()
if len(md) < 2000:
    raise SystemExit(f"99_Spickzettel.md ist nur {len(md):d} Zeichen lang – das ist kein Spickzettel.")

ts = ('/* tabellen/spickzettel.ts – ERZEUGT aus 99_Spickzettel.md von tools/build_spick.py (N34 T6b).\n'
      '   NICHT hier aendern, sondern in der Markdown-Datei – sonst faellt die Aenderung beim\n'
      '   naechsten Lauf wieder heraus.\n'
      '   ⛔ Diese Datei importiert nichts - Werkzeuge laden sie direkt (E49). */\n'
      'export const SPICKZETTEL: string = ' + json.dumps(md, ensure_ascii=False) + ';\n')
with open(ZIEL, "w", encoding="utf-8", newline="") as f:
    f.write(ts)

abschnitte = [z for z in md.split("\n") if z.startswith("## ")]
print(f"tabellen/spickzettel.ts gebaut: {len(md):d} Zeichen, {len(abschnitte):d} Abschnitte")
for a in abschnitte:
    print("  " + a[3:])
