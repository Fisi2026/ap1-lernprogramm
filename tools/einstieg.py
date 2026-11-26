#!/usr/bin/env python3
"""tools/einstieg.py - erzeugt EINSTIEG.md, den KURZ-Einstieg (BUILD_LOG 26, Nachtrag 2).

WARUM: START_PROMPT.md hat 34 KB und wird in JEDEM Chat ganz gelesen. Gemessen am 21.09.2026:
allein das Einlesen kostete gut 5 Prozentpunkte des Sitzungsbalkens. Fuer einen Chat, der am
Neubau arbeitet, ist das meiste davon Pool-Stoff.
⛔ KEINE ZWEITE LISTE. Jede Zeile hier wird AUS START_PROMPT.md und BUILD_LOG.md GEZOGEN, nie
   getippt - sonst driften zwei Listen (Beleg 28.07.). `--pruefe` faellt, sobald die Quelle sich
   geaendert hat; `check.sh` 4f-einstieg faehrt das mit.
⚠️ GRENZE: EINSTIEG.md ersetzt die Vollfassung NUR fuer Werkzeug- und Neubau-Arbeit. Wer den
   Pool, eine Frage, einen Verweis oder den Lehrtext anfasst, liest START_PROMPT.md und regeln/pool.md + regeln/messen.md
   ganz - die PFLICHT-Tabelle steht deshalb mit drin.

BENUTZUNG
  python3 tools/einstieg.py --setze    # schreibt EINSTIEG.md
  python3 tools/einstieg.py --pruefe   # rc=1, wenn EINSTIEG.md veraltet ist; rc=2 = Werkzeug stumm
"""
import re
import sys

if hasattr(sys.stdout, "reconfigure"):   # Git Bash: cp1252; ohne reconfigure (umgeleitet) bleibt es, wie es ist
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")

ZIEL = "EINSTIEG.md"

def lies(p):
    return open(p, encoding="utf-8", newline="").read().split("\n")

def entkommentiere(zeilen):
    return [re.sub(r"^#\s?", "", z).rstrip() for z in zeilen]

def baue():
    """(text, fehler) - fehler != None heisst: Quelle nicht lesbar, NICHT schreiben."""
    try:
        sp = lies("START_PROMPT.md"); bl = lies("BUILD_LOG.md")
    except (OSError, ValueError) as e:
        return None, f"Quelle nicht lesbar ({type(e).__name__!s})"
    stand = [z for z in sp if "APP_VERSION" in z and "app-sw" in z] + \
            [z for z in sp if "LIVE beim Lerner:" in z]
    pflicht = [z for z in sp if z.lstrip("# ").startswith("PFLICHT: ")]
    regeln = [z for z in sp if re.match(r"^#\s{3}\d+\.\s\*\*", z)]
    marken = [k for k, z in enumerate(bl) if z.startswith("**Damit offen:**")]
    if not (len(stand) == 2 and pflicht and regeln and marken):
        return None, (f"Anker fehlen (stand={len(stand):d} pflicht={len(pflicht):d} regeln={len(regeln):d} offen={len(marken):d})")
    letzte = marken[-1]
    ende = next((k for k in range(letzte + 1, len(bl)) if bl[k].startswith("## ")), len(bl))
    offen = [z for z in bl[letzte:ende] if z.strip()]
    t = ["# EINSTIEG - der kurze Weg in einen Chat", "",
         "⛔ **ERZEUGT VON `tools/einstieg.py` - NICHT VON HAND AENDERN.** Jede Zeile stammt aus",
         "`START_PROMPT.md` oder `BUILD_LOG.md`; `check.sh` 4f-einstieg meldet, sobald sie driften.",
         "⚠️ **Diese Datei reicht fuer WERKZEUG- und NEUBAU-Arbeit.** Wer Pool, Frage, Verweis oder",
         "Lehrtext anfasst, liest `START_PROMPT.md`, `regeln/pool.md` und `regeln/messen.md` GANZ (Tabelle unten).",
         "", "## 1. Anfangen - EIN Aufruf", "",
         "```", "bash tools/start.sh --neuer-chat <gmail|web.de>", "```",
         "Er misst Umgebung, Baum, Push-Stand, CI-URTEIL, den Plugin-Stand je Konto und zeigt den",
         "naechsten Griff. Verbrauch: die `[limits]`-Zeilen des Plugin-Hooks (seit 12.10. massgeblich,",
         "`tools/wache.py` nur noch Notfall, wenn keine Zeile kommt - E077).", "",
         "## 2. Stand (aus START_PROMPT.md gezogen)", ""] + entkommentiere(stand) + [
         "", "## 3. Naechster Griff (letzter BUILD_LOG-Eintrag)", ""] + offen + [
         "", "## 4. Die harten Grenzen der Bruecke", "",
         "* Jeder Aufruf **60 s** - alles Laengere per `nohup` im Hintergrund, auf die `.fertig`-Marke warten.",
         "* Jeder Aufruf **~8190 Zeichen** - STILL gekuerzt, Rueckgabewert 0. Ueber 4000 Zeichen",
         "  schliesst der Befehl mit einer eigenen Zeile `#ENDE`; ueber ~6000 in Stuecken schreiben,",
         "  danach `wc -c` lesen.",
         "* Tests, Bau, git und Push laufen ueber die **Training Shell**, nicht ueber `device_bash`.",
         "", "## 5. Arbeitsregeln (Kurztitel - Volltext in START_PROMPT.md Abschnitt 5)", ""] + \
        entkommentiere(regeln) + [
         "", "## 6. WANN DIE VOLLFASSUNG PFLICHT IST", ""] + entkommentiere(pflicht) + [""]
    return "\n".join(t), None


def selbsttest():
    """Faelle mit BEKANNTER Antwort - der stumme Zweig eingeschlossen (Lehre 4 vom 07.09.)."""
    global lies
    echt = lies
    faelle = []
    def mit(sp, bl):
        global lies
        lies = lambda p: (sp if "START" in p else bl)
    try:
        mit(["# **APP_VERSION 1.0.0 · app-sw x**", "# **LIVE beim Lerner: v1.0.0 · PUSH DURCH**",
             "#   1. **Regel A**", "#   PFLICHT: X anfassen -> Y"],
            ["## 1", "**Damit offen:** ETWAS", "noch dazu", "## 2", "**Damit offen:** DAS LETZTE", "Zeile zwei"])
        t, f = baue()
        faelle.append(("vollstaendig -> Text", f is None and "DAS LETZTE" in t, True))
        faelle.append(("nur der LETZTE offen-Block", t is not None and "ETWAS" not in t, True))
        faelle.append(("Stand uebernommen", t is not None and "APP_VERSION 1.0.0" in t, True))
        mit(["# **APP_VERSION 1.0.0 · app-sw x**"], ["**Damit offen:** X"])
        t2, f2 = baue()
        faelle.append(("Anker fehlt -> KEIN Text, Grund", (t2, f2 is not None), (None, True)))
        def kaputt(p): raise OSError("weg")
        lies = kaputt
        t3, f3 = baue()
        faelle.append(("Quelle nicht lesbar -> stumm", (t3, "nicht lesbar" in (f3 or "")), (None, True)))
    finally:
        lies = echt
    schlecht = 0
    for name, ist, soll in faelle:
        gut = ist == soll
        schlecht += not gut
        print("  {} {}".format("ok   " if gut else "FALSCH", name))
    print(f"SELBSTTEST: {len(faelle) - schlecht:d} von {len(faelle):d} Faellen richtig")
    return 1 if schlecht else 0


if __name__ == "__main__":
    if "--selbsttest" in sys.argv:
        sys.exit(selbsttest())
    text, fehler = baue()
    if fehler:
        print("STUMM: " + fehler + " - EINSTIEG.md NICHT geschrieben")
        sys.exit(2)
    try:
        with open(ZIEL, encoding="utf-8", newline="") as fh:
            alt = fh.read()
    except (OSError, ValueError):
        alt = None
    if "--pruefe" in sys.argv:
        if alt is None:
            print("EINSTIEG: " + ZIEL + " fehlt - 'python3 tools/einstieg.py --setze'"); sys.exit(1)
        if alt != text:
            print("EINSTIEG: " + ZIEL + " ist VERALTET (Quelle hat sich geaendert) - '--setze'"); sys.exit(1)
        print("EINSTIEG: {!s} ist buendig ({:d} Byte)".format(ZIEL, len(text.encode("utf-8")))); sys.exit(0)
    if "--setze" in sys.argv:
        with open(ZIEL, "w", encoding="utf-8", newline="") as fh:
            fh.write(text)
        print("EINSTIEG: {!s} geschrieben ({:d} Byte)".format(ZIEL, len(text.encode("utf-8")))); sys.exit(0)
    print(__doc__); sys.exit(2)
