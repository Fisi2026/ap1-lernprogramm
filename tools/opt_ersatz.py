"""opt_ersatz.py – Antwortoptionen im Pool ersetzen, ohne die Pool-Dateien umzuformatieren.

WOZU ES DIESES WERKZEUG GIBT
============================
Am 28.07.2026 wurde derselbe Rohtext-Ersatz DREIMAL neu geschrieben (fixverweis, korrektur, rest,
nachbesserung, feinschliff). Beim dritten Mal fehlte die Zusicherung – und der Lauf erzeugte
NEUN NEUE LAENGEN-TELLS, weil Distraktoren unter die Laenge der richtigen Antwort gekuerzt wurden.
Erst das Nachbesserungs-Skript hatte den `assert`, und der schlug sofort zweimal an.

►►► DIE LEHRE, DIE DIESES WERKZEUG FESTSCHREIBT:
    EINE REGEL, DIE NUR IN DER DOKU STEHT, WIRD GEBROCHEN. EINE, DIE IM SKRIPT STEHT, NICHT.
    Die Warnung „beim Zuruecknehmen zu langer Distraktoren entstehen neue Treffer" stand seit dem
    27.07. in START_PROMPT.md. Sie hat den Fehler nicht verhindert – nur seine Entdeckung.

WAS ES PRUEFT (alles VOR dem ersten Schreibzugriff, Abbruch ohne Teilaenderung)
==============================================================================
  1. Der Frageblock wird ueber `"id": "<ID>"` bis zur naechsten `"id":` abgegrenzt.
     ⚠️ PFLICHT, sobald Feldwerte wie `thema` oder `gebiet` ersetzt werden – die stehen sonst
     hundertfach im Pool. Ohne Abgrenzung trifft ein Ersatz die falsche Frage.
  2. Der alte Wert wird AUS DEM POOL GELESEN, nicht vom Aufrufer abgetippt. Das schliesst
     Transkriptionsfehler bei Gedankenstrich, deutschen Anfuehrungszeichen und NBSP aus –
     am 28.07. viermal die Ursache eines Fehlversuchs.
  3. Genau EINE Fundstelle im Block, sonst Abbruch.
  4. LAENGENFENSTER: der neue Wert muss STRIKT LAENGER sein als die richtige Antwort und darf
     hoechstens MAX_FAKTOR mal so lang sein – aber nur, wenn er der laengste Distraktor werden
     soll. Geprueft wird das ERGEBNIS der ganzen Frage, nicht die einzelne Option:
       * mindestens ein Distraktor strikt laenger als die richtige Antwort  (Waechter 1)
       * kein Distraktor ueber MAX_FAKTOR x der richtigen Antwort            (Waechter 5)
     ⚠️ DIE RICHTIGE ANTWORT DARF NIE GEKUERZT WERDEN – wird sie es doch, bricht das Werkzeug ab.
  5. `json.loads` als Syntaxprobe ueber die vollstaendige Datei, bevor etwas geschrieben wird.
  6. Geschrieben werden nur Dateien, die sich tatsaechlich aendern.

⛔ WAS ES BEWUSST NICHT TUT: `json.load`/`json.dump`. Das formatiert alle 20 Pool-Dateien um –
   am 27.07. entstanden so 37.000 Diff-Zeilen fuer 18 Wortkorrekturen.

BENUTZUNG
=========
    from tools.opt_ersatz import Ersatzlauf
    lauf = Ersatzlauf()                     # Backup nach <Temp>/pool_backup passiert automatisch
    lauf.option("M07-014", 3, "Ticket-System – Support per Mail")
    lauf.option("M07-014", 1, "Remote – Fernwartung übers Netz")
    lauf.feld("M05-700", "erklaerungLang", NEUER_TEXT)   # Freitextfeld, ohne Laengenpruefung
    lauf.schreiben()                        # prueft alles, schreibt oder bricht ab

  Direkt aufrufbar zur Kontrolle einer einzelnen Frage:
    python3 tools/opt_ersatz.py --zeige M07-014
"""
import json
import os
import re
import shutil
import sys
import tempfile

WURZEL = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
POOL = os.path.join(WURZEL, "pool")
BACKUP = os.path.join(tempfile.gettempdir(), "pool_backup")

# ⚠️ EINE QUELLE fuer test_didaktik.js, apply_batch.py und dieses Werkzeug. Nicht hartkodieren.
with open(os.path.join(WURZEL, "laengen_ausnahmen.json"), encoding="utf-8") as _fh:
    _KONF = json.load(_fh)
MIN_OPTIONSLAENGE = _KONF["grenzwerte"]["min_optionslaenge"]
MAX_FAKTOR = _KONF["grenzwerte"]["max_faktor"]


class Abbruch(Exception):
    pass


def _bloecke(rohtext, fid):
    """Grenzen des Frageblocks. Von der oeffnenden Klammer vor der ID bis zur naechsten ID."""
    m = re.search(rf'"id"\s*:\s*"{re.escape(fid)!s}"', rohtext)
    if not m:
        raise Abbruch(f"{fid}: ID im Rohtext nicht gefunden")
    if len(re.findall(rf'"id"\s*:\s*"{re.escape(fid)!s}"', rohtext)) > 1:
        raise Abbruch(f"{fid}: ID kommt in derselben Datei mehrfach vor")
    start = rohtext.rfind("{", 0, m.start())
    naechste = re.search(r'"id"\s*:\s*"', rohtext[m.end():])
    ende = m.end() + naechste.start() if naechste else len(rohtext)
    return start, ende


class Ersatzlauf:
    def __init__(self, backup=True):
        self.roh = {}          # dateiname -> rohtext
        self.aenderungen = []  # (datei, id, beschreibung)
        if backup:
            if os.path.isdir(BACKUP):
                shutil.rmtree(BACKUP)
            shutil.copytree(POOL, BACKUP)

    # ---------------------------------------------------------------- intern
    def _datei_der_frage(self, fid):
        for name in sorted(os.listdir(POOL)):
            if not name.endswith(".json"):
                continue
            if name not in self.roh:
                with open(os.path.join(POOL, name), encoding="utf-8") as fh:
                    self.roh[name] = fh.read()
            if re.search(rf'"id"\s*:\s*"{re.escape(fid)!s}"', self.roh[name]):
                return name
        raise Abbruch(f"{fid}: in keiner Pool-Datei gefunden")

    def _frage(self, datei, fid):
        d = json.loads(self.roh[datei])
        it = d if isinstance(d, list) else d.get("fragen", [])
        for q in it:
            if isinstance(q, dict) and q.get("id") == fid:
                return q
        raise Abbruch(f"{fid}: Block gefunden, Objekt aber nicht")

    def _ersetze(self, datei, fid, alt, neu):
        a, b = _bloecke(self.roh[datei], fid)
        blk = self.roh[datei][a:b]
        salt = json.dumps(alt, ensure_ascii=False)[1:-1]
        sneu = json.dumps(neu, ensure_ascii=False)[1:-1]
        n = blk.count(salt)
        if n != 1:
            raise Abbruch(f"{fid!s}: {n:d} Fundstellen statt genau 1 fuer {alt[:60]!r}")
        self.roh[datei] = self.roh[datei][:a] + blk.replace(salt, sneu) + self.roh[datei][b:]

    # ---------------------------------------------------------------- oeffentlich
    def option(self, fid, index, neu):
        """Eine Antwortoption ersetzen. Der alte Wert wird aus dem Pool gelesen."""
        datei = self._datei_der_frage(fid)
        q = self._frage(datei, fid)
        opt = q.get("optionen")
        if not isinstance(index, int):        # bool ist int: wie bisher Option 0/1 (BUILD_LOG 163)
            raise Abbruch(f"{fid}: Optionsindex muss eine ganze Zahl sein, nicht {index!r}")
        if not opt or index >= len(opt):
            raise Abbruch(f"{fid}: Option {index:d} gibt es nicht")
        li = q.get("loesungIndex")
        if isinstance(li, int) and index == li and len(neu) < len(opt[li]):
            raise Abbruch(f"{fid!s}: das wuerde die RICHTIGE ANTWORT kuerzen ({len(opt[li]):d} -> {len(neu):d} Zeichen). "
                          "Verboten – das kostet fachliche Praezision.")
        alt = opt[index]
        self._ersetze(datei, fid, alt, neu)
        self.aenderungen.append((datei, fid, f"Option {index:d}: {len(alt)} -> {len(neu)} Zeichen"))

    def feld(self, fid, name, neu):
        """Ein Freitextfeld ersetzen (erklaerungLang, verweis, ...). Ohne Laengenpruefung."""
        datei = self._datei_der_frage(fid)
        q = self._frage(datei, fid)
        if name not in q:
            raise Abbruch(f"{fid}: Feld {name!r} gibt es nicht")
        alt = q[name]
        if not isinstance(alt, str):
            raise Abbruch(f"{fid}: Feld {name!r} ist kein String")
        self._ersetze(datei, fid, alt, neu)
        self.aenderungen.append((datei, fid, f"{name!s}: {len(alt):d} -> {len(neu):d} Zeichen"))

    def _pruefe_laengen(self):
        """Das eigentliche Netz: nach ALLEN Ersetzungen jede beruehrte mc-Frage nachmessen."""
        ausn = set(_KONF.get("ausnahmen", {}))
        beruehrt = {(d, i) for d, i, _ in self.aenderungen}
        probleme = []
        for datei, fid in sorted(beruehrt):
            q = self._frage(datei, fid)
            if q.get("typ") != "mc":
                continue
            opt, li = q.get("optionen"), q.get("loesungIndex")
            if not opt or not isinstance(li, int):
                continue
            L = [len(o) for o in opt]
            if max(L) < MIN_OPTIONSLAENGE:
                continue
            r = L[li]
            d = max(x for n, x in enumerate(L) if n != li)
            if r >= d:
                probleme.append(f"{fid}: LAENGEN-TELL – richtige Antwort {r}, laengster Distraktor {d}. "
                                "Mindestens einer muss STRIKT laenger sein (Gleichstand zaehlt). "
                                f"Zielfenster: {r + 1} bis {int(r * MAX_FAKTOR)} Zeichen.")
            elif fid not in ausn and d > r * MAX_FAKTOR:
                probleme.append(f"{fid}: UEBERLANGER DISTRAKTOR – {d} gegen {r} (Faktor {d / r:.2f}). "
                                f"Zielfenster: {r + 1} bis {int(r * MAX_FAKTOR)} Zeichen.")
        return probleme

    def schreiben(self, trocken=False):
        if not self.aenderungen:
            raise Abbruch("nichts zu tun")
        for datei, txt in self.roh.items():
            try:
                json.loads(txt)
            except ValueError as e:
                raise Abbruch(f"{datei} waere kaputt: {e}")
        probleme = self._pruefe_laengen()
        if probleme:
            print("[opt_ersatz] ABBRUCH – nichts geschrieben:", file=sys.stderr)
            for p in probleme:
                print("  ! " + p, file=sys.stderr)
            raise Abbruch(f"{len(probleme):d} Laengenverstoss/-verstoesse")
        for datei, fid, was in self.aenderungen:
            print(f"  ok {fid!s:<10} {datei!s:<22} {was!s}")
        if trocken:
            print("[opt_ersatz] Probelauf – nichts geschrieben.")
            return
        n = 0
        for datei, txt in self.roh.items():
            pfad = os.path.join(POOL, datei)
            with open(pfad, encoding="utf-8") as fh:
                if fh.read() == txt:
                    continue
            with open(pfad, "w", encoding="utf-8", newline="") as fh:
                fh.write(txt)
            n += 1
            print(f"  geschrieben: {datei}")
        print(f"[opt_ersatz] {len(self.aenderungen):d} Aenderungen in {n:d} Dateien. Backup: {BACKUP!s}")


def _zeige(fid):
    lauf = Ersatzlauf(backup=False)
    datei = lauf._datei_der_frage(fid)
    q = lauf._frage(datei, fid)
    opt, li = q.get("optionen") or [], q.get("loesungIndex")
    if not opt:
        print(f"{fid} hat keine optionen")
        return
    r = len(opt[li]) if isinstance(li, int) else 0
    print("{}  [{}]  typ={}".format(fid, datei, q.get("typ")))
    if r:
        print(f"  richtige Antwort {r:d} Zeichen -> Zielfenster fuer den laengsten Distraktor: {r + 1:d}..{int(r * MAX_FAKTOR):d}")
    for i, o in enumerate(opt):
        print("   [{:d}] {:3d} {!s:>5} {!s} {!s}".format(i, len(o), ("%.2fx" % (len(o) / r)) if r else "", "<<<" if i == li else "   ", o))


if __name__ == "__main__":
    if len(sys.argv) == 3 and sys.argv[1] == "--zeige":
        _zeige(sys.argv[2])
    else:
        print(__doc__)
