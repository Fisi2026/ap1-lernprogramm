#!/usr/bin/env python3
"""tools/lehrtext_pool.py – DIESELBE SACHAUSSAGE IN LEHRTEXT UND POOL NEBENEINANDER LEGEN.

    python3 tools/lehrtext_pool.py            alle Begriffe, die BEIDE Seiten definieren
    python3 tools/lehrtext_pool.py <begriff>  nur diesen, mit allen Fundstellen

══════════ WARUM ES DIESES WERKZEUG KEIN WAECHTER IST (06.09.2026) ══════════
Etappe G2 wollte einen WAECHTER fuer Widersprueche zwischen Lehrtext und Pool (Fehlerklasse
B106). Drei Anlaeufe, drei Messungen, drei Absagen:

 1. **Zahl-Einheit-Paare vergleichen.** Gemessen: „100 GB" steht 6x im Lehrtext und dutzendfach
    im Pool - in voellig unverbundenen Aufgaben. Eine Zahl ohne ihren Begriff sagt nichts.
 2. **Begriff und Zahl im Textfenster.** Gemessen an acht Fakten mit bekannter Antwort:
    FAT32 -> 4 GB sauber; aber **IPv4 findet 32 UND 128 Bit**, IPv6 ebenso, und 802.11ac findet
    2,4 GHz mit. Grund: genau dort, wo Fakten stehen - in Tabellen und in Gegenueberstellungen
    („IPv4 hat 32 Bit, IPv6 hat 128") -, liegt der falsche Wert im selben Satz.
    ►► **NAEHE IST KEINE AUSSAGE.**
 3. **Nur strukturierte Aussagen vergleichen** (Markdown-Tabellenzeile gegen `paare` im Pool).
    Gemessen: 462 Tabellenbegriffe, 430 Paar-Begriffe, **42 in beiden**. Aber die beiden Seiten
    haben verschiedene GESTALT: der Lehrtext fuehrt Werte („ext4 | 16 TB | Linux-Standard"),
    der Pool fuehrt Beschreibungen („Verbreitetes Dateisystem fuer Linux mit Journaling").
    Eine Maschine kann daran nicht ablesen, ob sie sich widersprechen.

►► **ALSO KEIN WAECHTER, SONDERN EIN LESEHILFSMITTEL.** Dieselbe Lehre wie bei
`pool_query.js kontext` (26.08.): Widersprueche werden sichtbar, wenn man die Stellen
NEBENEINANDER SIEHT - nicht, wenn eine Zahl sie zaehlt. Dieses Skript legt sie nebeneinander;
das Urteil faellt beim Lesen.
"""
import collections
import glob
import json
import re
import sys

for _s in (sys.stdout, sys.stderr):  # cp1252-Konsole unter Windows (BUILD_LOG 134)
    if hasattr(_s, "reconfigure"): _s.reconfigure(encoding="utf-8")

def norm(s):
    s = re.sub(r"[*`_]", "", str(s)).strip().lower()
    for a, b in (("ä","ae"),("ö","oe"),("ü","ue"),("ß","ss")):
        s = s.replace(a, b)
    return re.sub(r"\s+", " ", s)

KOPFZELLE = ("begriff","modell","typ","geraet","gerät","schicht","kategorie","standard",
             "merkmal","kriterium","art","phase","stufe","ebene","name","--","")

def lehrtext():
    aus = collections.defaultdict(list)
    for pfad in sorted(glob.glob("0?_*.md")):
        with open(pfad, encoding="utf-8") as fh:
            for nr, zeile in enumerate(fh, 1):
                if zeile.count("|") < 3 or re.match(r"^\s*\|[\s|:-]+\|\s*$", zeile):
                    continue
                zellen = [z.strip() for z in zeile.strip().strip("|").split("|")]
                if len(zellen) < 2 or norm(zellen[0]) in KOPFZELLE:
                    continue
                aus[norm(zellen[0])].append((pfad[:2] + " Z." + str(nr),
                                             " | ".join(zellen[1:])))
    return aus

def pool():
    aus = collections.defaultdict(list)
    for pfad in sorted(glob.glob("pool/pool_*.json")):
        with open(pfad, encoding="utf-8") as fh:
            d = json.load(fh)
        for f in (d if isinstance(d, list) else d.get("fragen", [])):
            for paar in (f.get("paare") or []):
                if len(paar) >= 2:
                    aus[norm(paar[0])].append((f.get("id", "?"), str(paar[1])))
    return aus

def main():
    L, P = lehrtext(), pool()
    gesucht = norm(sys.argv[1]) if len(sys.argv) > 1 else None
    gemeinsam = sorted(set(L) & set(P))
    if gesucht:
        gemeinsam = [b for b in gemeinsam if gesucht in b] or [gesucht]
    print(f"Tabellenbegriffe im Lehrtext: {len(L):d} · Paar-Begriffe im Pool: {len(P):d} · in BEIDEN: {len(set(L) & set(P)):d}")
    print("⚠️ KEIN WAECHTER, SONDERN EIN LESEHILFSMITTEL – das Urteil faellt beim Lesen.\n")
    for b in gemeinsam:
        print(f"== {b}")
        for quelle, text in L.get(b, [])[:3]:
            print(f"   Lehrtext {quelle!s:<10} {text[:110]!s}")
        for fid, text in P.get(b, [])[:3]:
            print(f"   Pool     {fid!s:<10} {text[:110]!s}")
        print()

if __name__ == "__main__":
    main()
