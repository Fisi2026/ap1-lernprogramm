"""tools/wache_sabotage.py - GEGENPROBE ZU tools/wache.py.

⛔ WARUM SIE HIER LIEGT (18.09.2026): sie lag bis heute nur in _to_delete/ -
   dem Ordner in .gitignore. Die einzige Gegenprobe zu dem Werkzeug, das ueber
   den Chatwechsel entscheidet, war damit nirgends versioniert. Derselbe Fehler
   wie beim Bruecken-Server, am selben Tag zweimal.
⛔ NICHT PARALLEL ZU check.sh FAHREN - sie aendert tools/wache.py waehrend des
   Laufs und stellt sie danach wieder her. Ein check.sh, das dabei laeuft, misst
   einen Zufall; ein Gruen daraus ist kein Messwert (BUILD_LOG 18.09. (12)).

Gegenprobe zur Konto-Erweiterung von tools/wache.py: jeder neue Zweig wird
einzeln ausgehebelt, der Selbsttest MUSS dann ROT werden. GRUEN ist der Fehlschlag.

Regeln aus tools/sabotage.sh, hier fuer ein Python-Werkzeug nachgebaut:
  1. ZUSICHERUNG VOR DEM LAUF - passt das Muster nicht genau einmal, Abbruch.
  2. URTEIL UMGEKEHRT - rot ist bestanden.
  3. WIEDERHERSTELLUNG IMMER - try/finally, auch bei Abbruch."""
import os
import subprocess
import sys

ZIEL = os.path.join("tools", "wache.py")
with open(ZIEL, encoding="utf-8", newline="") as fh:
    URFASSUNG = fh.read()

S = []
S.append(("S1 Mindestabstand ausgehebelt -> Probe 13 rot",
          r"""MINDEST_TOKENS = 2000""", r"""MINDEST_TOKENS = 0"""))
S.append(("S2 Reset-Erkennung ausgehebelt -> Probe 12 rot",
          "    if dp < 0:", "    if False:"))
S.append(("S3 eine einzelne Ablesung wird als Paar behandelt -> Probe 11 rot",
          "    if len(eigene) >= 2:", "    if len(eigene) >= 1:"))
S.append(("S4 Konto-Entscheidungsregel entschaerft -> Proben 14/16 rot",
          "    return (stand + bedarf) > 100.0, zeile",
          "    return (stand + bedarf) > 1000.0, zeile"))
S.append(("S5 die drei Grenzen weggelassen -> Probe 17 rot",
          "    for zeile in GRENZEN:\n        print(zeile)",
          "    for zeile in ():\n        print(zeile)"))
S.append(("S6 Herkunft des uebernommenen Kurses verschwiegen -> Probe 18 rot",
          r'''"UEBERNOMMEN von Konto '"''', r'''"von Konto '"'''))
S.append(("S7 der Rat beim Konto-Alarm faellt weg -> Probe 17 rot",
          "    schlaegt = konto_alarme(d)\n    if schlaegt:",
          "    schlaegt = konto_alarme(d)\n    if False:"))
S.append(("S8 Kontoname wird ignoriert -> Probe 21 rot",
          '    name = d.get("konto", "")\n    if not name:',
          '    name = d.get("konto", "")\n    if False:'))
S.append(("S9 der Kurs kommt aus dem FALSCHEN Konto -> Probe 20 rot",
          'lade_konto()["konten"].get(name, {})',
          'lade_konto()["konten"].get("gmail", {})'))
S.append(("S11 Abschluss ohne gemessene Runden wird nicht beanstandet -> Probe 25 rot",
          "    elif runden_dazu < 2:", "    elif False:"))
S.append(("S12 Fensterpruefung ausgehebelt -> Probe 26 rot",
          'if (d.get("aufgabe") or "") != args.name:', "if False:"))
S.append(("S13 Versatz wird nicht fortgeschrieben -> Probe 30 rot (Doppelzaehlung)",
          'd["kladde_gelesen"] = versatz + len(verwertet.encode("utf-8"))',
          'd["kladde_gelesen"] = versatz'))
S.append(("S14 halbe Zeile wird mitgezaehlt -> Probe 32 rot",
          "    verwertet = text[:schluss + 1]", "    verwertet = text"))
S.append(("S15 Schrumpfung wird verschluckt -> Probe 34 rot",
          "    if groesse < versatz:", "    if False:"))
S.append(("S16 krumme Zeilen werden still uebersprungen -> Probe 33 rot",
          '        meldung += "; " + str(krumm) + " unlesbare Zeile(n) uebersprungen"',
          '        pass'))
S.append(("S17 die Kladde wird gar nicht erst gefunden -> Proben 29ff rot",
          "    p = pfad_kladde()", "    p = os.path.join(HIER, 'gibt-es-nicht')"))
S.append(("S18 die Kladde zaehlt keine Runden -> Probe 35 rot (Befund 21.09.)",
          '    d["runden"] += int(d.get("kladde_zeilen", 0)) - vorher',
          '    d["runden"] += 0'))
S.append(("S19 abschluss verbucht nicht vorher -> Probe 36 rot",
          "    verbuche(d)   # sonst endet das Messfenster", "    pass   # sonst endet das Messfenster"))
S.append(("S20 aufgabe verbucht nicht vorher -> Probe 37 rot",
          "    verbuche(d)   # sonst beginnt das Messfenster", "    pass   # sonst beginnt das Messfenster"))
S.append(("S21 start liest die Kladde ab 0 -> Probe 38 rot",
          '        d["kladde_gelesen"] = os.path.getsize(pfad_kladde())',
          '        d["kladde_gelesen"] = 0'))
S.append(("S22 tick zaehlt mit Kladde eine Runde doppelt -> Probe 39 rot",
          "    if args.notiz:", '    d["runden"] += 1\n    if args.notiz:'))
S.append(("S10 die Altdatei wandert nicht nach unbenannt -> Probe 22 rot",
          '    if "kurse" in k and "konten" not in k:', "    if False:"))

def schreibe(t):
    with open(ZIEL, "w", encoding="utf-8", newline="") as fh:
        fh.write(t)

def selbsttest():
    r = subprocess.run([sys.executable, ZIEL, "selbsttest"], capture_output=True,
                       text=True, encoding="utf-8", errors="replace", check=False)
    return (r.stdout or "") + (r.stderr or "")

ergebnis = []
try:
    print("NULLPROBE VORHER")
    if "SELBSTTEST GRUEN" not in selbsttest():
        print("  ABBRUCH: schon vor der Sabotage nicht gruen."); sys.exit(2)
    print("  gruen - der Ausgangszustand stimmt.")
    for name, alt, neu in S:
        n = URFASSUNG.count(alt)
        if n != 1:
            ergebnis.append((name, "MUSTER passt " + str(n) + "x - NICHT gefahren"))
            print(name + "\n  ABBRUCH: Muster passt " + str(n) + "x, nicht genau 1x."); continue
        schreibe(URFASSUNG.replace(alt, neu, 1))
        aus = selbsttest()
        rot = "SELBSTTEST ROT" in aus
        ergebnis.append((name, ("ROT, " + str(aus.count("[FEHLER]")) + " Probe(n) schlagen an")
                         if rot else "GRUEN GEBLIEBEN - die Probe misst NICHTS"))
        print(name + "\n  " + ergebnis[-1][1])
        schreibe(URFASSUNG)
finally:
    schreibe(URFASSUNG)

print("\nNULLPROBE NACHHER")
print("  " + ("gruen - Datei wiederhergestellt." if "SELBSTTEST GRUEN" in selbsttest()
              else "ROT - ACHTUNG, Datei NICHT sauber wiederhergestellt!"))
schlecht = [n for n, e in ergebnis if not e.startswith("ROT")]
print("\nURTEIL: " + str(len(ergebnis) - len(schlecht)) + " von " + str(len(S)) + " Sabotagen bemerkt.")
sys.exit(1 if schlecht else 0)
