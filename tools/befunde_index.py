#!/usr/bin/env python3
"""tools/befunde_index.py – erzeugt docs/befunde/BEFUNDE_INDEX.md aus den BEFUNDE_*.md.

WARUM ES DAS GIBT (W1 Etappe D, 10.09.2026): Neun BEFUNDE-Dateien mit ~290 KB, und die Doku
zitiert durchgehend B-Nummern (B90, B106, B127, B136–B147), ohne dass eine Liste sagt, wo sie
stehen. Wer „B127" sucht, sucht in neun Dateien.
⛔ **ERZEUGT, NICHT GEPFLEGT.** Eine von Hand gefuehrte Liste driftet – das ist im selben Projekt
   dreimal belegt (zwei Listen fuer dieselbe Sache, Beleg 28.07.). Deshalb ein Skript.

⚠️ DER PLAN VERMUTETE `grep -oE "^#+ *B[0-9]+"`. GEMESSEN AM 10.09.: das findet **109** von **198**
   Zeilenanfaengen mit B-Nummer. Die Befunde stehen in DREI Formen, und die Vermutung kannte eine:

     ### B42 · MAC hat drei Bedeutungen …                 (Ueberschrift)
     ## 13. B131 — der Lehrtext verweist auf …            (Ueberschrift MIT Abschnittsnummer)
     ### ⚠️⚠️ B137 — der neue Lehrtext beantwortete …      (Ueberschrift mit Markup davor)
     ### B25/B26 · M04-051 und M04-507 …                  (ZWEI Nummern in einer Ueberschrift)
     | B90 | Verweisziel ohne Inhalt | 03#181 …           (Tabellenzeile, erste Zelle NUR die Nummer)
     **B63 - Der Aufgabentext fuehrt auf die falsche Antwort.**   (fett am Zeilenanfang)

⚠️ DIE ERSTEN DREI FASSUNGEN DIESES SKRIPTS KANNTEN DREI DAVON. Gefunden hat die Luecke NICHT
   der Blick auf die Dateien, sondern die Gegenprobe unten: B137 fehlte, und die "Luecke" B131-B133
   war keine. **Ein Kandidatenfilter braucht Gegenproben mit bekannter Antwort VOR dem ersten
   Urteil** (B138).
⚠️ DIE ZWEITE FASSUNG WAR IN EINER RICHTUNG BESSER UND IN DER ANDEREN SCHLECHTER: sie fand B20,
   B26, B55, B57, B59 und B137 dazu und verlor dabei B84, B85, B87, B88, B89. Ursache war eine
   HEURISTIK ("der Kopf muss im Wesentlichen aus der Nummer bestehen"). Ersetzt durch eine REGEL:
   nach Abstreifen von Markup, Abschnittsnummer und Symbolen muss die Zeile MIT der Nummer
   BEGINNEN. ►► **Wer einen Filter verschaerft, misst beide Richtungen** - ein Zugewinn verdeckt
   einen Verlust, wenn nur die Gesamtzahl betrachtet wird (sie stieg von 133 auf 134).
⚠️ ZWEI EINTRAEGE IN BEKANNT WAREN GERATEN, NICHT GEWUSST (B84, B131) - die Gegenprobe meldete
   Abweichung, und im Recht war das SKRIPT. Korrigiert wurde erst nach unabhaengiger Pruefung mit
   `grep -lF "<die Definitionszeile>"`. **Eine Erwartung, die man ans Ergebnis anpasst, ist keine
   Gegenprobe mehr** - deshalb steht hier, dass es passiert ist.

⛔⛔ DIE FALLE, DIE EIN BLANKES MUSTER MITNIMMT: **B1, B2 und B3 sind AUCH Gebietsnamen**
   (A1–A5/B1–B3 der Pruefungsordnung). `| B3 „Wirtschafts- und Sozialkunde" laut …` ist das
   GEBIET, `| B3 | M06-203 | …` der BEFUND. Unterschieden wird an der ersten Tabellenzelle:
   sie muss NUR die Nummer enthalten. Deshalb Form B mit abschliessendem `|`.

BENUTZUNG
  python3 tools/befunde_index.py            # Trockenlauf: Zahlen + Auffaelligkeiten, schreibt NICHTS
  python3 tools/befunde_index.py --setze    # schreibt docs/befunde/BEFUNDE_INDEX.md
  python3 tools/befunde_index.py --pruefe   # Gegenprobe an Faellen mit BEKANNTER Antwort (rc!=0 bei Abweichung)
"""
import glob
import os
import re
import sys

for _s in (sys.stdout, sys.stderr):  # cp1252-Konsole unter Windows (BUILD_LOG 134)
    if hasattr(_s, "reconfigure"): _s.reconfigure(encoding="utf-8")

# ⛔⛔ DIE AUSGABE IST KEINE QUELLE - GEMESSEN AM 10.09.2026, EINEN LAUF NACH DER EINFUEHRUNG.
#    `glob("BEFUNDE_*.md")` nahm beim ZWEITEN Lauf die eigene Ausgabe mit: aus 8 Dateien wurden 9,
#    aus "Mehrfach in verschiedenen Dateien: 0" wurden 145, und der Index wuchs von 171 auf 315
#    Zeilen. Jede Tabellenzeile des Index ist selbst eine gueltige Fundstelle - das Werkzeug hat
#    seine eigene Ausgabe als Befundlage gelesen.
#    ►► DER ERSTE LAUF KONNTE DAS NICHT ZEIGEN: da gab es die Datei noch nicht. **Ein Werkzeug,
#       das schreibt, muss ZWEIMAL gefahren werden, bevor man es glaubt** - die Klasse "am ersten
#       Tag gebaut, am ersten Tag nicht geprueft" (START_PROMPT Abschnitt 6).
#    ⚠️ Und die Gegenprobe blieb dabei GRUEN, weil sie nur fragte "ist die erwartete Datei DABEI".
#       Sie vergleicht seither die Fundstellen-Menge EXAKT.
AUSGABE = "docs/befunde/BEFUNDE_INDEX.md"

# Eine "Definitionszeile" ist eine Ueberschrift, eine fette Zeile oder eine Tabellenzeile, deren
# ERSTE Zelle nur die Nummer traegt. Aus ihrem KOPF (alles vor dem ersten Trenner) werden ALLE
# B-Nummern gezogen - "### B25/B26 · M04-051 …" definiert zwei.
# REGEL statt Heuristik: nach dem Abstreifen von Markup, Abschnittsnummer und Symbolen muss die
# Zeile MIT der B-Nummer BEGINNEN. Das deckt alle sechs beobachteten Formen ab und schliesst
# Ueberschriften aus, die eine Nummer nur beilaeufig im Satz nennen.
VORSPANN   = re.compile(r"^[#*\s>]*")            # ###, **, * **, Zitatzeichen
ABSCHNITT  = re.compile(r"^\d{1,2}\.\s*")        # "13. " in "## 13. B131 — …"
SYMBOLE    = re.compile(r"^[^0-9A-Za-z]*")        # ⚠️⚠️, Emoji, Gedankenstriche
# Das "Etikett" am Zeilenanfang: eine oder mehrere B-Nummern, verbunden durch /, Komma oder einen
# Bereichsstrich. "B18–B20", "B51–B55, B57–B59", "B25/B26" und "B42" sind alle Etiketten.
ETIKETT    = re.compile(r"^((?:B\d{1,3}[\s,/–—-]*)+)(.*)$")
BEREICH    = re.compile(r"B(\d{1,3})\s*[–—-]\s*B(\d{1,3})")
TAB_ZEILE  = re.compile(r"^\|\s*B(\d{1,3})(?:\s*/\s*B?(\d{1,3}))?\s*\|(.*)$")

# Faelle mit BEKANNTER Antwort – aus START_PROMPT und den Protokollen, nicht aus diesem Lauf.
# ⚠️ Ein neues Messwerkzeug wird erst an einem Fall geprueft, dessen Antwort man kennt (Lehre 28.07.).
BEKANNT = {
    "106": "BEFUNDE_LERNUNTERLAGE.md",   # Leasing-Widerspruch, 02.09.
    "127": "BEFUNDE_BUCH_KATALOG.md",    # das Buch war falsch, am Seitenbild belegt
    "137": "BEFUNDE_LERNUNTERLAGE.md",   # Lehrtext gegen Fragetext statt Musterloesung (Form: Markup davor)
    "141": "BEFUNDE_BILDFRAGEN.md",      # Sichtpruefung 07.09.
    "84":  "BEFUNDE_FAELLE.md",          # Form: **B84:** ohne Trenner mit Leerzeichen
    "131": "BEFUNDE_BUCH_KATALOG.md",    # Form: "## 13. B131 —" mit Abschnittsnummer davor
    "90":  "BEFUNDE_LERNUNTERLAGE.md",   # Form: Tabellenzeile
    "26":  "BEFUNDE_M04-M06.md",         # Form: "### B25/B26 ·" - zwei Nummern in einer Zeile
    "20":  "BEFUNDE_M04-M06.md",         # Form: "### B18–B20 ·" - BEREICH, muss ausgeschrieben werden
    "57":  "BEFUNDE_M04-M06.md",         # Form: "### B51–B55, B57–B59 ·" - zwei Bereiche in einer Zeile
}


def etikett_nummern(etikett):
    """Nummern eines Etiketts, Bereiche AUSGESCHRIEBEN: 'B51–B55, B57–B59' -> 51..55, 57..59.
    ⚠️ Ein Bereich ist kein Tippfehler und keine Luecke - er fasst Kleinbefunde zusammen. Wer ihn
    nicht ausschreibt, meldet vier Luecken, die keine sind (gemessen 10.09.: B20, B55, B57, B59)."""
    nummern, rest = [], etikett
    for a, b in BEREICH.findall(etikett):
        a, b = int(a), int(b)
        if b >= a and b - a <= 30:
            nummern += [str(x) for x in range(a, b + 1)]
    rest = BEREICH.sub(" ", etikett)
    nummern += re.findall(r"B(\d{1,3})", rest)
    return sorted(set(nummern), key=int)


def saeubern(s, max_len=78):
    s = re.sub(r"^[\s·\-–—:|*]+", "", s)
    s = re.sub(r"\*\*|`|\*", "", s)
    s = re.sub(r"\s*\|\s*$", "", s)
    s = re.sub(r"\s+", " ", s).strip()
    teile = s.split("|")
    s = teile[0].strip() if teile and teile[0].strip() else s
    return (s[:max_len - 1] + "…") if len(s) > max_len else s


def sammeln(dateien):
    treffer = {}          # nummer -> Liste (datei, form, stichwort)
    for pfad in dateien:
        with open(pfad, encoding="utf-8") as f:
            for zeile in f:
                zeile = zeile.rstrip("\n")
                nummern, rest, form = [], "", ""
                m = TAB_ZEILE.match(zeile)
                if m:
                    nummern = [g for g in (m.group(1), m.group(2)) if g]
                    rest, form = m.group(3), "Tabelle"
                elif zeile.startswith(("#", "*", ">")):
                    text = SYMBOLE.sub("", ABSCHNITT.sub("", VORSPANN.sub("", zeile)))
                    m = ETIKETT.match(text)
                    if m:
                        nummern = etikett_nummern(m.group(1))
                        rest, form = m.group(2), "Kopf"
                for nr in nummern:
                    treffer.setdefault(nr, []).append(
                        (os.path.basename(pfad), form, saeubern(rest or zeile)))
    return treffer


def main():
    setze = "--setze" in sys.argv
    pruefe = "--pruefe" in sys.argv
    dateien = sorted(p for p in glob.glob("docs/befunde/BEFUNDE_*.md") if os.path.basename(p) != os.path.basename(AUSGABE))
    if not dateien:
        sys.exit("Keine BEFUNDE_*.md gefunden – im Wurzelordner aufrufen.")
    if any(os.path.basename(p) == os.path.basename(AUSGABE) for p in dateien):   # Zusicherung, kein Kommentar
        sys.exit(f"⛔ {AUSGABE!s} steht in der Quellliste – das Werkzeug wuerde sich selbst lesen.")
    treffer = sammeln(dateien)

    mehrfach = {n: v for n, v in treffer.items() if len({d for d, _, _ in v}) > 1}
    nummern = sorted(int(n) for n in treffer)
    luecken = [n for n in range(1, max(nummern) + 1) if n not in nummern] if nummern else []

    print(f"Dateien   {len(dateien):d}")
    print(f"B-Nummern {len(nummern)} (B{min(nummern)} bis B{max(nummern)})")
    print(f"Mehrfach in verschiedenen Dateien: {len(mehrfach):d}")
    for n in sorted(mehrfach, key=int):
        print("   B{!s:<4} {!s}".format(n, ", ".join(sorted({d for d, _, _ in mehrfach[n]}))))
    print("Luecken   {:d} {!s}".format(len(luecken), luecken[:20] if luecken else ""))

    if pruefe:
        fehler = 0
        for nr, soll in sorted(BEKANNT.items(), key=lambda x: int(x[0])):
            ist = sorted({d for d, _, _ in treffer.get(nr, [])})
            # ⚠️ EXAKT, nicht "ist dabei" (10.09.): alle zehn Faelle sind in GENAU EINER Datei
            # definiert. Das blosse "soll in ist" blieb gruen, als die eigene Ausgabe mitgelesen
            # wurde und jede Nummer ploetzlich zwei Fundstellen hatte.
            # ⛔ Wer hier eine Nummer eintraegt, die WIRKLICH in zwei Dateien steht, muss diese
            #    Zusicherung mit ihr aendern - nicht sie aufweichen.
            ok = ist == [soll]
            print("GEGENPROBE B{!s:<4} erwartet {!s:<28} gefunden {!s}  {!s}".format(nr, soll, ist or "NICHTS", "ok" if ok else "ABWEICHUNG"))
            fehler += 0 if ok else 1
        if fehler:
            print(f"\n⛔ {fehler:d} Gegenprobe(n) abweichend – der Index wird NICHT geschrieben.")
            return 1
        print(f"Gegenprobe: alle {len(BEKANNT):d} Faelle wie erwartet.")

    if not setze:
        print("\nTROCKENLAUF – nichts geschrieben. Mit --setze ausfuehren.")
        return 0

    zeilen = [
        "# docs/befunde/BEFUNDE_INDEX.md — welche B-Nummer steht in welcher Datei",
        "",
        "⛔ **ERZEUGT, NICHT GEPFLEGT.** Diese Datei entsteht aus `python3 tools/befunde_index.py",
        "--setze`. **Hier von Hand zu schreiben ist sinnlos** – der naechste Lauf ueberschreibt es.",
        "Wer einen Befund umbenennt oder verschiebt, faehrt das Skript neu.",
        "",
        "⚠️ **Der Index nennt die FUNDSTELLE, nicht den Inhalt.** Was ein Befund besagt und ob er",
        "noch gilt, steht in der genannten Datei – und Entscheide dazu in `START_PROMPT.md`.",
        "",
        "| B-Nr | Datei | Stichwort |",
        "|---|---|---|",
    ]
    for n in nummern:
        for datei, _form, stich in treffer[str(n)][:1]:
            zeilen.append("| B{} | `{}` | {} |".format(n, datei, stich or "—"))
    zeilen += ["", "---", ""]
    zeilen.append(f"**{len(nummern):d} B-Nummern in {len(dateien):d} Dateien.**")
    if mehrfach:
        zeilen += ["", "⚠️ **In mehr als einer Datei definiert** – hier lohnt ein Blick, ob zwei",
                   "Befunde dieselbe Nummer tragen:", ""]
        for n in sorted(mehrfach, key=int):
            zeilen.append("* **B{}** — {}".format(n, ", ".join(sorted({d for d, _, _ in mehrfach[n]}))))
    if luecken:
        # ⚠️ Eine Luecke KANN heissen: die Nummer steht gar nicht in einer BEFUNDE-Datei, sondern nur
        #    im BUILD_LOG. Das wird nachgesehen statt vermutet - sonst behauptet der Index eine
        #    Luecke, wo in Wahrheit die Ablage abweicht.
        anderswo = {}
        for quelle in ("BUILD_LOG.md", "BUILD_LOG_ARCHIV.md"):
            if not os.path.exists(quelle):
                continue
            with open(quelle, encoding="utf-8") as fh:
                text = fh.read()
            for x in luecken:
                if re.search(rf"(?<![A-Za-z0-9])B{x}(?![0-9])", text):
                    anderswo.setdefault(x, []).append(quelle)
        zeilen += ["", "## Nicht in einer BEFUNDE-Datei", ""]
        for x in luecken:
            wo = ", ".join(f"`{q}`" for q in anderswo.get(x, []))
            zeilen.append("* **B{}** — {}".format(x, ("nur in " + wo) if wo else "nirgends gefunden"))
        zeilen += ["", "⚠️ **Das ist kein Fehler, sondern eine Ablage-Abweichung:** manche Befunde",
                   "wurden im `BUILD_LOG` beschrieben und nie in ein `BEFUNDE_*.md` uebernommen.",
                   "Wer sie sucht, sucht dort. **Nummern ohne jeden Fundort wurden vergeben und",
                   "wieder verworfen** – ebenfalls kein Fehler."]
    with open(AUSGABE, "w", encoding="utf-8", newline="\n") as f:
        f.write("\n".join(zeilen) + "\n")
    # ⚠️ 10.09.: hier stand `len(zeilen) + 1` – die Meldung war um eine Zeile zu hoch. Die Datei
    #    hat genau len(zeilen) Zeilen ("\n".join + Schluss-Newline). Kleiner Fehler, aber ein
    #    Werkzeug, das seine eigene Ausgabe falsch zaehlt, wird beim naechsten Vergleich geglaubt.
    print(f"\nGESCHRIEBEN: {AUSGABE!s} ({len(zeilen):d} Zeilen)")
    return 0


if __name__ == "__main__":
    sys.exit(main())
