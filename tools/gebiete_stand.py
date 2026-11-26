#!/usr/bin/env python3
"""tools/gebiete_stand.py - misst die Gebietsverteilung und haelt SORTIERUNG_PRUEFUNGSORDNUNG.md buendig.

══════════ WARUM ES DIESES SKRIPT GIBT (02.09.2026) ══════════
`SORTIERUNG_PRUEFUNGSORDNUNG.md` fuehrte ZWEI von Hand gepflegte Tabellen mit Gebietszahlen.
Beide waren veraltet - und sie widersprachen einander schon untereinander:

  Gebiet   Tabelle 1   Tabelle 2 (28.07.)   gemessen 02.09.
  A1         127            142                 148
  A2         174            190                 197
  A4          22             44                  47
  A5         139            152                 182
  B3          54             --                 103

►► Genau die Sorte Zahl, die START_PROMPT.md fuer sich selbst laengst VERBIETET ("eine von Hand
   geschriebene Zahl ist eine Behauptung, kein Messwert"). Hier stand sie weiter - und sie ist
   nicht harmlos: `tests/test_didaktik.js` haengt mit SCHWELLE_GEBIET_MIN = 4.8 an A4. Gemessen
   sind das 47/934 = 5,03 %, also 0,23 Punkte Luft. Wer die Lage aus dieser Datei beurteilt,
   liest 22 oder 44 und haelt die Sache fuer unkritisch.

⛔ QUELLE IST `pool/*.json`, NICHT `fragen.js` - fragen.js ist erzeugt (Drift-Guard). Die neun
   Faelle (FALL-*) und M09 haben bewusst kein Gebiet und werden ausgelassen; das ist kein Befund.

Aufruf im Projektordner:
  python3 tools/gebiete_stand.py            # Messung lesbar ausgeben
  python3 tools/gebiete_stand.py --pruefe   # eine Zeile fuer check.sh (Bewertung macht check.sh)
  python3 tools/gebiete_stand.py --setze    # den Block in SORTIERUNG_PRUEFUNGSORDNUNG.md ersetzen

Ausgabe von --pruefe:
  OK <n>                  Block steht und stimmt mit der Messung ueberein (<n> Gebiete)
  ABWEICHUNG <details>    Block steht, weicht aber ab
  GEMISCHT <details>      ein Gebiet ODER ein Thema fuehrt zwei Pruefungsteile
  KEINBLOCK               die Markierungen stehen nicht (mehr) in der Datei
Rueckgabewert ist immer 0.

══════════ DIE THEMA-PRUEFUNG, UND WARUM SIE HIER STEHT (06.09.2026) ══════════
Am 02.09. wurde von Hand gefunden, dass „IP-Adressierung & Subnetting" EIN Thema mit ZWEI
Pruefungsteilen war: drei Fragen AP1, zwoelf AP2. Folge: vier Fragen, die der Katalog
ausdruecklich unter Teil 1 fuehrt, erschienen nur im AP2-Modus - der Lerner uebte fuer Teil 1
und bekam sie nie zu sehen. Repariert in v1.22.0 durch Aufteilen in zwei Themen.
⛔ **DIESER FEHLER WAR DANACH DURCH NICHTS BEWACHT.** Ein Thema, das zwei Teile traegt, ist
immer ein Fehler - entweder ist eine Frage falsch einsortiert, oder das Thema gehoert geteilt.
Heute (06.09.) sind es 0 von 86 Themen; die Ratsche steht also auf null.

⚠️ **WARUM NICHT GEGEN DEN KATALOG GEMESSEN WIRD.** Der urspruengliche Plan (Etappe G1) war, die
Teil-Zugehoerigkeit jeder Frage am Wortschatz des Pruefungskatalogs zu pruefen. **Gemessen am
06.09. und VERWORFEN:** Teil 2 hat 1027 eigene Begriffe gegen 385 in Teil 1, darunter viele
Alltagswoerter. Von 975 AP1-Fragen enthielten **185 ausschliesslich Teil-2-Woerter** - unter den
ersten Treffern M01-001 (Projektmerkmale), M01-004 (SMART-Ziele), M01-101 (Netzplan), M01-204
(Teambildung). Alle vier stehen woertlich in Fragenkomplex 01 von TEIL 1. ►► **EIN WAECHTER MIT
185 FEHLALARMEN AUF 975 FRAGEN WIRD STUMMGESCHALTET, NICHT BEFOLGT.** Was hier bleibt, ist die
Pruefung, die exakt ist: der Pool gegen sich selbst.
"""
import collections
import glob
import json
import sys
from pathlib import Path

DATEI  = "SORTIERUNG_PRUEFUNGSORDNUNG.md"
ANFANG = "<!-- GEBIETE-BLOCK: erzeugt von tools/gebiete_stand.py - NICHT von Hand pflegen -->"
ENDE   = "<!-- /GEBIETE-BLOCK -->"

# Namen und Pruefungsteil je Code: Pruefungskatalog FISI 2024 (2. Auflage),
# Raster S. 5/6. AP1 = 5 Gebiete (Par. 9 Abs. 2), AP2 = 3 Pruefungsbereiche (Par. 21/22, 4 Abs. 7).
GEBIETE = [
    ("A1", "AP1", "Kundenbedarfe ermitteln"),
    ("A2", "AP1", "Hard- und Software auswählen & beschaffen"),
    ("A3", "AP1", "IT-Arbeitsplatz konfigurieren, testen & absichern"),
    ("A4", "AP1", "Kunden und Kundinnen einweisen"),
    ("A5", "AP1", "Leistungserbringung kontrollieren & protokollieren"),
    ("B1", "AP2", "Konzeption und Administration von IT-Systemen"),
    ("B2", "AP2", "Analyse und Entwicklung von Netzwerken"),
    ("B3", "AP2", "Wirtschafts- und Sozialkunde"),
]

def messen():
    anzahl = collections.Counter()
    teile  = collections.defaultdict(collections.Counter)
    fein   = collections.defaultdict(collections.Counter)   # Gebiet -> (thema, modul) -> n
    ohne   = []
    for p in sorted(glob.glob("pool/*.json")):
        try:
            d = json.loads(Path(p).read_text(encoding="utf-8"))
        except (OSError, ValueError):         # eine kaputte Datei meldet validate_pool
            continue
        fs = d if isinstance(d, list) else d.get("fragen", d.get("items", []))
        if not isinstance(fs, list):
            continue
        for f in fs:
            if not isinstance(f, dict):
                continue
            g = "M9" if f.get("modul") == "M09" else f.get("gebiet")
            if not g:
                ohne.append(f.get("id", "?"))
                continue
            anzahl[g] += 1
            teile[g][f.get("pruefungsteil")] += 1
            fein[g][(f.get("thema"), f.get("modul"))] += 1
    return anzahl, teile, fein, sorted(ohne)


def themateile():
    """Je Thema die vorkommenden Pruefungsteile. Ein Thema gehoert zu genau einem."""
    aus = collections.defaultdict(collections.Counter)
    for pfad in sorted(glob.glob("pool/pool_*.json")):
        d = json.loads(Path(pfad).read_text(encoding="utf-8"))
        for f in (d if isinstance(d, list) else d.get("fragen", [])):
            if f.get("thema"):
                aus[f["thema"]][f.get("pruefungsteil")] += 1
    return aus

def block(anzahl, teile, ohne):
    nenner = sum(v for k, v in anzahl.items() if k.startswith("A"))
    z = [ANFANG, "",
         "| Code | Prüfungsteil | Gebiet / Prüfungsbereich | Fragen | Anteil an AP1 |",
         "|---|---|---|---|---|"]
    for code, teil, name in GEBIETE:
        n = anzahl.get(code, 0)
        ant = ("%.2f %%" % (n / nenner * 100)) if (teil == "AP1" and nenner) else "—"
        z.append(f"| {code} | {teil} | {name} | {n} | {ant} |")
    z.append(f"| | | **Nenner AP1 (A1–A5)** | **{nenner}** | 100 % |")
    z.append("")
    gemischt = [c for c, _, _ in GEBIETE if len(teile.get(c, {})) > 1]
    z.append("**Ohne Gebiet (so gewollt):** {:d} — die Fälle {!s}.".format(len(ohne), ", ".join(ohne) if ohne else "—"))
    if gemischt:
        for c in gemischt:
            z.append("⚠️ **{} führt zwei Prüfungsteile:** {} — ein Gebiet gehört zu genau einem Teil.".format(c, ", ".join(f"{k}={v}" for k, v in sorted(teile[c].items()))))
    z.append("")
    z.append(ENDE)
    return "\n".join(z)

ANFANG2 = "<!-- ZUORDNUNG-BLOCK: erzeugt von tools/gebiete_stand.py - NICHT von Hand pflegen -->"
ENDE2   = "<!-- /ZUORDNUNG-BLOCK -->"

def block2(anzahl, fein):
    """Feinthema -> Gebiet. Bis 02.09.2026 standen diese neun Tabellen von Hand in der Datei -
       mit Kopfzahlen aus dem Juli (A1 127 statt 148, A4 22 statt 47). Dieselbe Krankheit wie oben."""
    z = [ANFANG2, "", "## Zuordnung: Feinthema -> Gebiet (mit alter Herkunft Modul)", ""]
    namen = {c: n for c, _, n in GEBIETE}
    namen["M9"] = "Klausurvorbereitung"
    teil = {c: t for c, t, _ in GEBIETE}
    teil["M9"] = "M09"
    for code in [c for c, _, _ in GEBIETE] + ["M9"]:
        if not fein.get(code):
            continue
        z.append(f"### {code} – {namen[code]} ({teil[code]}, {anzahl.get(code, 0)} Fragen)")
        z.append("")
        z.append("| Feinthema | alte Herkunft | Fragen |")
        z.append("|---|---|---|")
        for (thema, modul), n in sorted(fein[code].items(), key=lambda x: (x[0][1] or "", x[0][0] or "")):
            z.append(f"| {thema} | {modul} | {n} |")
        z.append("")
    z.append(ENDE2)
    return "\n".join(z)

def main():
    anzahl, teile, fein, ohne = messen()
    neu = block(anzahl, teile, ohne)
    neu2 = block2(anzahl, fein)
    modus = sys.argv[1] if len(sys.argv) > 1 else ""
    if modus == "--setze":
        t = Path(DATEI).read_text(encoding="utf-8")
        if ANFANG in t and ENDE in t and ANFANG2 in t and ENDE2 in t:
            a = t.index(ANFANG); e = t.index(ENDE) + len(ENDE)
            t = t[:a] + neu + t[e:]
            a = t.index(ANFANG2); e = t.index(ENDE2) + len(ENDE2)
            t = t[:a] + neu2 + t[e:]
        else:
            print("KEINBLOCK - Markierungen fehlen, nichts geschrieben"); return
        with open(DATEI, "w", encoding="utf-8", newline="") as fh:  # LF auch unter Windows (BUILD_LOG 132)
            fh.write(t)
        print(f"Block gesetzt ({len(GEBIETE):d} Gebiete)"); return
    if modus == "--pruefe":
        # ⚠️ ZUERST die Sachpruefung, dann der Textvergleich: ein gemischtes Thema bleibt ein
        #    Fehler, auch wenn die Tabelle in der Datei buendig ist.
        schief_teil = ["Gebiet {}: {}".format(c, ", ".join("{}={}".format(*kv) for kv in sorted(teile[c].items())))
                       for c, _, _ in GEBIETE if len(teile.get(c, {})) > 1]
        for thema, zaehler in sorted(themateile().items()):
            if len(zaehler) > 1:
                schief_teil.append("Thema {!r}: {}".format(thema, ", ".join("{}={}".format(*kv) for kv in sorted(zaehler.items()))))
        if schief_teil:
            print("GEMISCHT " + "; ".join(schief_teil)); return
        try:
            t = Path(DATEI).read_text(encoding="utf-8")
        except Exception:                     # noqa: BLE001
            print("KEINBLOCK"); return
        if ANFANG not in t or ENDE not in t or ANFANG2 not in t or ENDE2 not in t:
            print("KEINBLOCK"); return
        ist  = t[t.index(ANFANG):t.index(ENDE) + len(ENDE)]
        ist2 = t[t.index(ANFANG2):t.index(ENDE2) + len(ENDE2)]
        if ist.strip() == neu.strip() and ist2.strip() == neu2.strip():
            print(f"OK {len(GEBIETE):d}"); return
        if ist.strip() == neu.strip():
            print("ABWEICHUNG Feinthema-Tabellen weichen ab"); return
        # Was genau weicht ab? Zahl je Code vergleichen, damit die Meldung brauchbar ist.
        schief = []
        for code, _, _ in GEBIETE:
            for zeile in ist.splitlines():
                if zeile.startswith(f"| {code} |"):
                    sp = [s.strip() for s in zeile.split("|")]
                    if len(sp) > 5 and sp[4] != str(anzahl.get(code, 0)):
                        schief.append(f"{code}: Datei {sp[4]}, gemessen {anzahl.get(code, 0)}")
        print("ABWEICHUNG " + ("; ".join(schief) if schief else "Block weicht ab (Text)"))
        return
    print(neu)
    print()
    print(neu2)

main()
