#!/usr/bin/env python3
"""tools/verweis_nachbar.py – die Fehlerklasse aus B145 poolweit suchen.

FRAGE: Steht ein Stichwort des Verweistextes NICHT im Zielabschnitt, aber sehr wohl in einem
ANDEREN Abschnitt derselben Kursdatei? Dann zeigt der Verweis ins Nachbarkapitel.

⚠️ WARUM `e3_gegenprobe.py` DAS NICHT FINDET (Befund B145, 08.09.2026):
  * `trifft()` wertet ein Wort schon ueber seinen 6-ZEICHEN-STAMM als getroffen. Aus
    „Qualitaetsregelkarte" wird `qualit` – das steht in JEDEM Abschnitt eines QM-Moduls.
  * Der Vorgabelauf meldet nur Fragen ohne JEDEN Treffer. Ein Scheintreffer deckt echte
    Fehltreffer zu.
  * `--streng` listet die fehlenden Begriffe, druckt aber die Einzel-Kandidaten nicht aus.
  ►► Hier wird WORTGENAU verglichen – und der Fund erst dann gemeldet, wenn das Wort
     nachweislich woanders in derselben Datei steht. Das trennt den Zeiger-Fehler von der
     blossen Wortform, die nirgends vorkommt (die haeufigste Fehlalarm-Klasse).

⚠️ MARKDOWN ZERSCHNEIDET WOERTER (Falle aus B138): `**M**essbar`. Deshalb werden `*`, `_` und
   Backticks aus dem Kurstext entfernt, BEVOR verglichen wird.

BENUTZUNG
    python3 tools/verweis_nachbar.py                 # gegen den aktuellen Stand
    python3 tools/verweis_nachbar.py --datei X.js    # gegen einen anderen fragen.js-Stand
                                                     # (Gegenprobe: git show alt-app-final:fragen.js)
⚠️ KANDIDATENFILTER, KEIN URTEIL. Jede Zeile wird einzeln gegen die Kursdatei gelesen.
"""
import json
import os
import re
import sys
from pathlib import Path

for _s in (sys.stdout, sys.stderr):  # cp1252-Konsole unter Windows (BUILD_LOG 134)
    if hasattr(_s, "reconfigure"): _s.reconfigure(encoding="utf-8")

BASIS = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
STOPP = {"abschnitt", "modul", "kapitel", "siehe", "sowie", "deren", "dessen", "dieser", "diese", "dieses", "welche", "werden", "wurde", "nach", "ueber", "unter", "zwischen", "gegen", "jedes", "jeder", "jede", "alle", "beim", "ihrer", "seiner"}

def kursdatei(modul):
    n = modul[1:]
    for f in os.listdir(BASIS):
        if re.match(r"^0?{!s}_.*\.md$".format(n.lstrip("0")), f) or f.startswith(n + "_"):
            return os.path.join(BASIS, f)
    return None

def abschnitte(pfad, praefix):
    z = Path(pfad).read_text(encoding="utf-8").split("\n")
    erg, akt = {}, None
    for l in z:
        m = re.match(r"^## (" + praefix + r"\.\d)\b", l)
        if m:
            akt = m.group(1); erg[akt] = [l]; continue
        if re.match(r"^## ", l):
            akt = None; continue
        if akt: erg[akt].append(l)
    # Markdown-Marker entfernen, sonst zerschneiden sie Woerter
    return {k: re.sub(r"[*_`]", "", "\n".join(v)).lower() for k, v in erg.items()}

def worte(text):
    roh = re.split(r"[^0-9A-Za-zÄÖÜäöüß]+", text.lower())
    return [w for w in roh if len(w) >= 6 and w not in STOPP and not re.match(r"^\d+$", w)]

def main():
    if "--datei" in sys.argv:   # ein ALTER fragen.js-Stand (z. B. aus dem Tag alt-app-final)
        quelle = sys.argv[sys.argv.index("--datei") + 1]
        with open(quelle, encoding="utf-8") as fh:
            roh = fh.read()
        F = json.loads(re.sub(r"^[^\[]*", "", roh, count=1, flags=re.DOTALL).rsplit("]", 1)[0] + "]")
    else:                        # N29 Teil 2 (E40): pool/*.json ueber tools/pool_laden.js
        from poolzugang import fragen
        F = fragen()

    cache, geprueft, treffer = {}, 0, []
    for f in F:
        v = str(f.get("verweis") or "")
        ziele = sorted(set(re.findall(r"(\d\.\d)", v)))
        if not ziele: continue
        mm = re.search(r"Modul\s+(\d\d)", v)
        modul = ("M" + mm.group(1)) if mm else f.get("modul", "")
        pfad = kursdatei(modul)
        if not pfad: continue
        praefix = modul[1:].lstrip("0") or "0"
        if modul not in cache: cache[modul] = abschnitte(pfad, praefix)
        sek = cache[modul]
        ziele = [z for z in ziele if z in sek]
        if not ziele: continue
        geprueft += 1
        tail = v.split(ziele[-1], 1)[-1]
        ws = [w for w in dict.fromkeys(worte(tail))]
        if not ws: continue
        zieltext = " ".join(sek[z] for z in ziele)
        anderswo = []
        for w in ws:
            if w in zieltext: continue
            wo = [k for k, t in sek.items() if k not in ziele and w in t]
            if wo: anderswo.append((w, wo))
        if anderswo:
            treffer.append((f["id"], ",".join(ziele), anderswo, v))

    print(f"Nummerierte Verweise geprueft: {geprueft:d}")
    print(f"Kandidaten (Stichwort fehlt im Ziel, steht aber in einem anderen Abschnitt): {len(treffer):d}\n")
    for fid, ziel, aw, v in sorted(treffer):
        print(f"{fid!s:<9} Ziel {ziel!s:<4}  {v[:78]!s}")
        for w, wo in aw:
            print("            „{!s}\" fehlt im Ziel, steht in: {!s}".format(w, ", ".join(wo)))
    print("\n⚠ KANDIDATENFILTER, KEIN URTEIL – jede Zeile einzeln gegen die Kursdatei lesen.")

main()
