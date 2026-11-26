#!/usr/bin/env python3
"""tools/waechter_zusicherung.py – hat jeder Pool-Waechter beide Zweige?

WARUM ES DAS GIBT (W1 Etappe E, 10.09.2026): Der Plan wollte die sieben Pool-Waechter
Seit 22.09.2026 auch die Neubau-/Werkzeugbloecke "# 4f-<name>)".
(4e3 firmen · 4e4 zitate · 4e5 zufall · 4e6 begriffe · 4e7 abdeckung · 4e8 verrat ·
4e9 svg) hinter EINE Funktion legen. **Nachgemessen spart das rund 20 von 114 Codezeilen**
und hinterlaesst zwei Arten, einen Waechter zu schreiben - dieselbe Rechnung, an der der
Plan selbst F1 gestrichen hat. ►► **E1 GESTRICHEN, NICHT ERNEUT VORSCHLAGEN.**
Was die Vereinheitlichung wirklich wert war, steht hier: nicht die gleiche FORM, sondern
die gleichen ZUSICHERUNGEN.

ZWEI ZWEIGE MUSS JEDER WAECHTER HABEN:
  1. WERKZEUG STUMM: liefert `pool_query.js <kmd>` keine auswertbare Zahl, muss das
     GEMELDET werden. Fehlt der Zweig, laeuft eine leere Ausgabe in den ok-Zweig -
     **gruen ueber Ungeprueftes**, die teuerste Fehlerklasse dieses Projekts.
  2. OK-ZWEIG: der Lauf muss sagen, dass die Pruefung stattgefunden hat. Eine Pruefung,
     die im Erfolgsfall schweigt, ist von einer uebersprungenen nicht zu unterscheiden.

⛔ KEINE AUSNAHMELISTE. Sobald hier eine stuende, waere die Zusicherung verhandelbar.

BENUTZUNG
  python3 tools/waechter_zusicherung.py              # prueft check.sh, rc=1 bei Luecke
  python3 tools/waechter_zusicherung.py --selbsttest # Faelle mit BEKANNTER Antwort
"""
import os
import re
import sys
from pathlib import Path

# Windows-Konsolen liefern cp1252. Die Waechtertitel tragen Gedankenstriche; ohne diese
# Zeile brach die Ausgabe entweder ab oder wurde so kaputt, dass `grep` sie fuer BINAER
# hielt - die Meldung in check.sh lautete dann "Binary file (standard input) matches"
# statt der Wächternamen. Gefunden von der Gegenprobe am 10.09., nicht vom Lauf.
if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")

# 22.09.2026 ERWEITERT um "auswertbare Antwort" und "Werkzeug stumm": 4f-einstieg liefert keine
# ZAHL, sondern eine Zeile - der Zweig war da und wurde trotzdem als Luecke gemeldet. Die
# Gegenprobe "ohne Stumm-Zweig" im Selbsttest zeigt, dass die Erweiterung nicht alles durchlaesst.
STUMM = re.compile(r"melde\s+\"[^\"]*(auswertbare (Zahl|Antwort)|lieferte keine|keine Summe|Werkzeug stumm)", re.IGNORECASE)
OK    = re.compile(r"^\s*ok\s+\"")
# 24.11.2026 (K3-E66): 4e16 antworttell ist der achte Pool-Waechter (4e10-4e15 sind keine Pool-Waechter).
KOPF  = re.compile(r"^\s*# (4e(?:[3-9]|16))\)\s*(.*)$")
ENDE  = re.compile(r"^\s*# (4f|5)\)")
# NEUBAU-WAECHTER (22.09.2026, BUILD_LOG 26 Nachtrag 6): Bloecke "# 4f-<name>)" im Abschnitt 4f,
# jeweils bis zum ersten "fi" in Spalte 0. ►► Jeder NEUE Neubau-Waechter bekommt diesen Kopf,
# sonst sieht ihn diese Zusicherung nicht (4f-roh war am 21.09. nur von Hand gegengeprobt).
KOPF4F = re.compile(r"^# (4f-[a-z0-9]+)\)\s*(.*)$")


def bloecke(zeilen):
    """Waechterbloecke schneiden: von '# 4eN)' bis zum naechsten Kopf oder '# 4f)'."""
    marken = []
    for i, z in enumerate(zeilen):
        m = KOPF.match(z)
        if m:
            marken.append((i, m.group(1), m.group(2).strip()))
        elif ENDE.match(z) and marken:
            marken.append((i, None, None))
            break
    raus = []
    for k, (i, name, titel) in enumerate(marken):
        if name is None:
            continue
        j = marken[k + 1][0] if k + 1 < len(marken) else len(zeilen)
        raus.append((name, titel, zeilen[i:j]))
    for i, z in enumerate(zeilen):
        m = KOPF4F.match(z)
        if m:
            j = next((k for k in range(i + 1, len(zeilen)) if zeilen[k] == "fi"), len(zeilen) - 1)
            raus.append((m.group(1), m.group(2).strip(), zeilen[i:j + 1]))
    return raus


def pruefe(bloecke_):
    """Je Block: (name, hat_stumm, hat_ok). Kommentarzeilen zaehlen NICHT als Zweig -
       sonst wuerde ein Kommentar, der den Zweig nur ERWAEHNT, ihn ersetzen."""
    raus = []
    for name, titel, zeilen in bloecke_:
        code = [z for z in zeilen if not z.lstrip().startswith("#")]
        raus.append((name, titel, any(STUMM.search(z) for z in code),
                     any(OK.match(z) for z in code)))
    return raus


def selbsttest():
    """Vier Faelle mit BEKANNTER Antwort - VOR dem ersten Urteil (Lehre 4 vom 07.09.)."""
    faelle = [
        ("vollstaendig", [
            '  # 4e3) VOLLSTAENDIG',
            '  X="$(node tools/pool_query.js x)"',
            '  if [ -z "$X" ]; then',
            '    melde "X-Guard: liefert keine auswertbare Zahl - Werkzeug pruefen"',
            '  else',
            '    ok "X geprueft"',
            '  fi',
            '  # 4f) ENDE'], True, True),
        ("ohne Stumm-Zweig", [
            '  # 4e4) OHNE STUMM',
            '  X="$(node tools/pool_query.js x)"',
            '  if [ -n "$X" ] && [ "$X" -gt 0 ]; then',
            '    echo "[hinweis] etwas"',
            '  else',
            '    ok "X geprueft"',
            '  fi',
            '  # 4f) ENDE'], False, True),
        ("ohne ok-Zweig", [
            '  # 4e5) OHNE OK',
            '  # ok "das hier ist ein Kommentar und zaehlt NICHT"',
            '  X="$(node tools/pool_query.js x)"',
            '  if [ -z "$X" ]; then melde "X-Guard: lieferte keine Summe"; fi',
            '  # 4f) ENDE'], True, False),
        ("4f-Block ohne Stumm", [
            '# 4f-xy) NEUBAU OHNE STUMM',
            'if [ -d neu ]; then',
            '  ok "Y geprueft"',
            'fi',
            'ok "danach, gehoert NICHT dazu"'], False, True),
    ]
    fehler = 0
    for titel, zeilen, soll_stumm, soll_ok in faelle:
        erg = pruefe(bloecke(zeilen))
        if len(erg) != 1:
            print(f"SELBSTTEST {titel!s:<18} ABWEICHUNG: {len(erg):d} Bloecke statt 1")
            fehler += 1
            continue
        _, _, hat_stumm, hat_ok = erg[0]
        gut = (hat_stumm == soll_stumm) and (hat_ok == soll_ok)
        print("SELBSTTEST {!s:<18} stumm={!s:<5} ok={!s:<5}  erwartet stumm={!s:<5} ok={!s:<5}  {!s}".format(titel, hat_stumm, hat_ok, soll_stumm, soll_ok, "ok" if gut else "ABWEICHUNG"))
        fehler += 0 if gut else 1
    if fehler:
        print(f"\n⛔ {fehler:d} Selbsttest(s) abweichend - dem Urteil dieses Werkzeugs ist nicht zu trauen.")
        return 1
    print(f"Selbsttest: alle {len(faelle):d} Faelle wie erwartet.")
    return 0


def quelltext(pfad="check.sh"):
    """check.sh MIT den Waechter-Dateien, in Aufruf-Reihenfolge eingesetzt (N37 U6, E60): seit U6
       stehen die Bloecke je in tools/waechter/<name>.sh und check.sh ruft sie mit
       `waechter a b c` (mit `\\`-Fortsetzung) auf. Eingesetzt wird an der Stelle des Aufrufs, damit
       die Bloecke genau so hintereinander stehen wie vorher im Text."""
    zeilen = Path(pfad).read_text(encoding="utf-8").split("\n")
    raus, namen, sammle = [], [], False
    for z in zeilen:
        roh = z.strip()
        if not sammle and re.match(r"^waechter(\s|\\|$)", roh):
            sammle, namen = True, []
            roh = roh[len("waechter"):].strip()
        if not sammle:
            raus.append(z)
            continue
        weiter = roh.endswith("\\")
        namen += roh.rstrip("\\").split()
        if not weiter:
            sammle = False
            for n in namen:
                w = os.path.join("tools", "waechter", n + ".sh")
                if not os.path.isfile(w):
                    raus.append("# WAECHTER-DATEI FEHLT: " + w)
                    continue
                raus += Path(w).read_text(encoding="utf-8").split("\n")
    return raus


def main():
    if "--selbsttest" in sys.argv:
        return selbsttest()
    zeilen = quelltext()
    erg = pruefe(bloecke(zeilen))
    if not erg:
        print("⛔ Keine Waechterbloecke '# 4eN)' in check.sh gefunden - Marker geaendert?")
        return 1
    luecken = 0
    for name, titel, hat_stumm, hat_ok in erg:
        fehlt = []
        if not hat_stumm:
            fehlt.append("WERKZEUG-STUMM-ZWEIG")
        if not hat_ok:
            fehlt.append("OK-ZWEIG")
        if fehlt:
            luecken += 1
            print("{}  FEHLT: {}   ({})".format(name, " und ".join(fehlt), titel[:48]))
        else:
            print(f"{name}  ok   ({titel[:48]})")
    print("---")
    print(f"{len(erg):d} Waechter-Bloecke geprueft, {luecken:d} mit Luecke.")
    # ⛔ EINE MASCHINENLESBARE ZEILE, DAMIT check.sh NICHT IM FLIESSTEXT SUCHEN MUSS.
    #    Die erste Fassung liess check.sh `grep FEHLT` ueber die ganze Ausgabe laufen - und die
    #    traegt Titel mit Gedankenstrichen. Auf der cp1252-Konsole wurde daraus fuer grep eine
    #    BINAERdatei, die Meldung lautete "Binary file (standard input) matches". Ein Meldezweig,
    #    der im Fehlerfall Muell sagt, ist so gut wie keiner. ►► Nur ASCII, nur Namen.
    print("LUECKEN: %s" % (" ".join(n for n, _t, hs, ho in erg if not (hs and ho)) or "-"))
    return 1 if luecken else 0


if __name__ == "__main__":
    sys.exit(main())
