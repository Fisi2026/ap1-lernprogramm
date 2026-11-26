#!/usr/bin/env python3
"""G2.6 #35, Teil 2: Erklaerungstexte der migrierten rechenassistent-Aufgaben parametrisieren.

Problem: erklaerungKurz/erklaerungLang enthalten die Zahlen der alten Grundfassung
("Schritt 1: 40 h x 75 EUR/h = 3.000 EUR"). Nach der Randomisierung wuerden sie den
gewuerfelten Werten widersprechen.

Vorgehen: Jede Zahl im Text, die exakt einem Variablenwert oder einem Schritt-Ergebnis
der ALTEN Grundfassung entspricht, wird durch den passenden Platzhalter ersetzt
({variable} bzw. {sN}). Laengere Zahlen zuerst, damit Teiltreffer ausgeschlossen sind.

GEGENPROBE (der eigentliche Sicherheitsgurt): Der parametrisierte Text wird mit genau
den Altwerten wieder gefuellt (ueber L.fuelleText aus logik.js) und muss den
ORIGINALTEXT reproduzieren. Jede Abweichung bricht ab.
"""
import glob
import json
import os
import re
import subprocess
import sys

POOL = "pool"


def zahl_muster(v):
    """Schreibweisen, in denen der Wert v im Text stehen kann."""
    out = []
    if float(v).is_integer():
        n = int(v)
        out.append(str(n))
        if abs(n) > 9999:
            out.append(f"{n:,}".replace(",", "."))
        elif abs(n) >= 1000:
            out.append(f"{n:,}".replace(",", "."))   # alte Texte schreiben auch "3.000"
    else:
        for d in (4, 3, 2, 1):
            r = round(v, d)
            if abs(r - v) < 1e-9:
                s = ("%." + str(d) + "f") % v
                out.append(s.replace(".", ","))
                out.append(s.rstrip("0").rstrip(".").replace(".", ","))
        ganz = (f"{v:.4f}").rstrip("0").rstrip(".")
        out.append(ganz.replace(".", ","))
        # Tausenderpunkte auch bei Dezimalzahlen ("10.819,20")
        for x in list(out):
            if "," in x:
                v_ganz, v_dez = x.split(",", 1)
                if len(v_ganz.lstrip("-")) > 3:
                    mit = f"{int(v_ganz):,}".replace(",", ".")
                    out.append(mit + "," + v_dez)
    # laengste zuerst
    return sorted({x for x in out if x}, key=len, reverse=True)


def parametrisiere(text, ersetzungen):
    """ersetzungen: Liste (muster, variablenname), bereits nach Laenge sortiert.

    Bereits eingesetzte Platzhalter werden maskiert (\x01..\x02) und erst am Ende
    aufgeloest – sonst ersetzt eine spaetere Regel Ziffern INNERHALB eines Platzhalters
    (beobachtet: skonto=3 machte aus "{s3}" ein "{s{skonto}}").
    Traegt das gefundene Muster Nachkommastellen, wird die Stellenzahl mitgegeben
    ("1,20" -> "{s3|2}"), damit die Anzeige exakt wie im Original bleibt.
    """
    if not text:
        return text
    # Schutz: Schrittnummern ("Schritt 1:") und Zehnerpotenzen ("10^6") nicht ersetzen
    text = re.sub(r"(Schritt )(\d+)", lambda m: m.group(1) + "\x00" + m.group(2) + "\x00", text)
    text = re.sub(r"(\^)(\d+)", lambda m: m.group(1) + "\x00" + m.group(2) + "\x00", text)

    # Eingesetzte Platzhalter werden durch ZIFFERNFREIE Token ersetzt (\x01AA\x02).
    # Sonst greift eine spaetere Zahlregel in einen fertigen Platzhalter hinein
    # (beobachtet: wochen=4 machte aus "{s4|1}" ein "{s{wochen}|1}").
    ablage = []

    def token(i):
        s, i = "", i + 1
        while i:
            i, r = divmod(i - 1, 26)
            s = chr(65 + r) + s
        return "\x01" + s + "\x02"

    def bau(name, muster):
        dez = len(muster.split(",")[1]) if "," in muster else 0
        ablage.append("{" + name + (f"|{dez:d}" if dez else "") + "}")
        return token(len(ablage) - 1)

    for muster, name in ersetzungen:
        text = re.sub(r"(?<![\d.,\x00-\x02])" + re.escape(muster) + r"(?![\d.,\x00-\x02])",
                      lambda m, n=name, mu=muster: bau(n, mu), text)
    text = re.sub(r"\x01([A-Z]+)\x02",
                  lambda m: ablage[sum((ord(c) - 64) * 26 ** i for i, c in enumerate(reversed(m.group(1)))) - 1], text)
    return text.replace("\x00", "")


def main(schreiben):
    mig = __import__("mig_g26").MIG
    aufgaben = []
    dateien = {}
    for p in sorted(glob.glob(os.path.join(POOL, "pool_m*.json"))):
        with open(p, encoding="utf-8") as fh:
            dateien[p] = json.load(fh)

    # WICHTIG: Die Erklaerungen werden aus der UNBERUEHRTEN Sicherung gelesen, nicht aus
    # dem Arbeitsstand – sonst parametrisiert ein zweiter Lauf bereits parametrisierte
    # Texte weiter und die Rueckprobe verliert ihre Referenz.
    urtext = {}
    for p in sorted(glob.glob("/tmp/g26/pool_alt/pool_m*.json")):
        with open(p, encoding="utf-8") as fh:
            for f in json.load(fh):
                urtext[f.get("id")] = f
    for p, fragen in dateien.items():
        for f in fragen:
            fid = f.get("id")
            if fid not in mig:
                continue
            m = mig[fid]
            werte = dict(m["alt"][0])                       # Werte der Grundfassung
            alt = urtext.get(fid, {})
            for feld in ("erklaerungKurz", "erklaerungLang"):
                if "{" in str(alt.get(feld, "")):
                    raise SystemExit(f"ABBRUCH {fid}/{feld}: Sicherung enthaelt bereits Platzhalter")
            # Schritt-Ergebnisse der Grundfassung nachrechnen (per Node, echte Mechanik)
            aufgaben.append({"id": fid, "werte": werte, "formeln": [s[0] for s in m["steps"]],
                             "dez": [s[1] for s in m["steps"]],
                             "kurz": alt.get("erklaerungKurz", ""), "lang": alt.get("erklaerungLang", "")})

    with open("/tmp/g26/erkl_auftrag.json", "w", encoding="utf-8") as fh:
        json.dump(aufgaben, fh, ensure_ascii=False)
    r = subprocess.run(["node", "/tmp/g26/schritte.js"], capture_output=True, text=True, check=False)
    if r.returncode != 0:
        print(r.stdout, r.stderr)
        raise SystemExit("ABBRUCH: Schrittwerte konnten nicht berechnet werden")
    schrittwerte = json.loads(r.stdout)                     # id -> [s1, s2, ...]

    neu = {}
    for a in aufgaben:
        fid = a["id"]
        werte = dict(a["werte"])
        for i, v in enumerate(schrittwerte[fid]["erg"]):
            werte[f"s{i + 1:d}"] = v
        a["roh"] = schrittwerte[fid]["roh"]
        # (1) direkte Treffer: Variablen und Schritt-Ergebnisse
        kandidaten = [(v, name) for name, v in werte.items()]
        # (2) ABGELEITETE Groessen. Ohne sie blieben Werte wie 0,85 (= 1 - Rabatt),
        #     0,30 EUR (= Cent/100) oder 99,95 % (= 100 - Ausfallanteil) als feste Zahl
        #     im Text stehen und wuerden den gewuerfelten Werten widersprechen.
        for i, roh in enumerate(a.get("roh", [])):
            kandidaten.append((roh, "({})".format(a["formeln"][i])))
        for name, v in list(werte.items()):
            if re.match(r"^s\d+$", name):
                continue
            kandidaten += [
                (1 - v / 100.0, f"1-{name}/100"),
                (v / 100.0, f"{name}/100"),
                (100 - v / 100.0, f"100-{name}/100"),
                (v / 1000.0, f"{name}/1000"),
                (v * 1000000.0, f"{name}*1000000"),
                (v * 1000.0, f"{name}*1000"),
            ]
        ers = []
        for v, ausdruck in kandidaten:
            if not isinstance(v, float) and not isinstance(v, int):
                continue
            if abs(v) < 1e-9:            # 0 nie ersetzen (steht fuer sich)
                continue
            for muster in zahl_muster(v):
                ers.append((muster, ausdruck))
        # Laengste Muster zuerst; bei gleicher Laenge direkte Variablen vor Ausdruecken
        ers.sort(key=lambda x: (len(x[0]), 0 if re.match(r"^[A-Za-z_]\w*$", x[1]) else -1), reverse=True)
        neu[fid] = {"erklaerungKurz": parametrisiere(a["kurz"], ers),
                    "erklaerungLang": parametrisiere(a["lang"], ers),
                    "werte": werte, "orig": {"erklaerungKurz": a["kurz"], "erklaerungLang": a["lang"]}}

    # ---- Gegenprobe: zurueckfuellen muss den Originaltext ergeben --------------
    with open("/tmp/g26/rueck_auftrag.json", "w", encoding="utf-8") as fh:
        json.dump(neu, fh, ensure_ascii=False)
    r = subprocess.run(["node", "/tmp/g26/rueckprobe.js"], capture_output=True, text=True, check=False)
    print(r.stdout.strip())
    if r.returncode != 0:
        print(r.stderr.strip())
        raise SystemExit("ABBRUCH: Rueckprobe fehlgeschlagen")

    if not schreiben:
        print("(nur geprueft, nichts geschrieben)")
        return
    for p, fragen in dateien.items():
        n = 0
        for f in fragen:
            if f.get("id") in neu:
                for feld in ("erklaerungKurz", "erklaerungLang"):
                    if f.get(feld):
                        f[feld] = neu[f["id"]][feld]
                n += 1
        if n:
            with open(p, "w", encoding="utf-8") as fh:
                json.dump(fragen, fh, ensure_ascii=False, indent=2)
                fh.write("\n")
            print(f"  {os.path.basename(p)!s:<28} {n:d} Erklaerungen parametrisiert")
    print("GESCHRIEBEN.")


if __name__ == "__main__":
    main(len(sys.argv) > 1 and sys.argv[1] == "--schreiben")
