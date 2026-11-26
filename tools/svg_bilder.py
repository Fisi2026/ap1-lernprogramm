#!/usr/bin/env python3
"""tools/svg_bilder.py – SVG-Felder des Pools als Kontaktbogen rendern.

    python3 tools/svg_bilder.py M03            # alle SVGs eines Moduls
    python3 tools/svg_bilder.py M03 --von 0 --bis 6
    python3 tools/svg_bilder.py --id M04-119

Legt PNGs unter /tmp/ap1_svg/ ab: je Aufruf einen Kontaktbogen mit bis zu
sechs Grafiken, jede mit ihrer ID beschriftet.

⚠️ WOZU: Drei kaputte Grafiken dieser Runde waren AUSSCHLIESSLICH im
   gerenderten Zustand sichtbar - M06-019 zeichnete keine Matrix, M04-119
   setzte eine Beschriftung ausserhalb der Zeichenflaeche, M04-996 malte drei
   Kaesten statt einer Klasse. Im JSON sieht so etwas unauffaellig aus.
   Die mechanische Klasse (Element ausserhalb der viewBox) ist seit 28.08.
   ueber alle 96 geprueft: 0 Treffer. Was bleibt, findet nur Hinsehen.

⚠️ EIN KONTAKTBOGEN IST EINE MESSHILFE, KEIN URTEIL. Was auf dem Bogen
   auffaellt, wird einzeln gegen Frage, Loesung und Erklaerung gelesen.
"""
import io
import json
import os
import subprocess
import sys

AUS = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), ".svgpruefung")
SPALTEN, ZEILEN = 3, 2          # sechs je Bogen
KACHEL_B, KACHEL_H = 620, 460   # Zeichenflaeche je Kachel
KOPF = 26                       # Platz fuer die ID-Zeile


def fragen_laden():
    """Der Pool ueber tools/pool_laden.js (N29 Teil 2) – node gibt uns das JSON."""
    roh = subprocess.run(
        ["node", "-e",
         ("process.stdout.write(JSON.stringify(require('./tools/pool_laden.js').laden().fragen"
         ".filter(f=>f.svg).map(f=>({id:f.id,modul:f.modul,typ:f.typ,"
         "unterTyp:f.unterTyp||'',frage:String(f.frage||'').slice(0,90),svg:f.svg}))))")],
        capture_output=True, text=True, check=True)
    return json.loads(roh.stdout)


def main():
    arg = sys.argv[1:]
    alle = fragen_laden()
    if "--id" in arg:
        ids = arg[arg.index("--id") + 1].split(",")
        wahl = [f for f in alle if f["id"] in ids]
        marke = "_".join(ids)[:40]
    else:
        modul = arg[0].upper()
        wahl = [f for f in alle if f["modul"] == modul]
        wahl.sort(key=lambda f: f["id"])
        von = int(arg[arg.index("--von") + 1]) if "--von" in arg else 0
        bis = int(arg[arg.index("--bis") + 1]) if "--bis" in arg else von + SPALTEN * ZEILEN
        wahl = wahl[von:bis]
        marke = f"{modul!s}_{von:02d}-{bis:02d}"
    if not wahl:
        print("keine Treffer"); return 1

    os.makedirs(AUS, exist_ok=True)
    import cairosvg
    from PIL import Image, ImageDraw

    bogen = Image.new("RGB", (SPALTEN * KACHEL_B, ZEILEN * (KACHEL_H + KOPF)), "white")
    mal = ImageDraw.Draw(bogen)
    fehler = []
    for i, f in enumerate(wahl[:SPALTEN * ZEILEN]):
        sx, sy = (i % SPALTEN) * KACHEL_B, (i // SPALTEN) * (KACHEL_H + KOPF)
        art = f["typ"] + ("/" + f["unterTyp"] if f["unterTyp"] else "")
        mal.text((sx + 6, sy + 6), "{}   [{}]".format(f["id"], art), fill="black")
        mal.rectangle([sx, sy, sx + KACHEL_B - 2, sy + KACHEL_H + KOPF - 2], outline="#bbb")
        try:
            png = cairosvg.svg2png(bytestring=f["svg"].encode("utf-8"),
                                   output_width=KACHEL_B - 20, background_color="white")
            bild = Image.open(io.BytesIO(png))
            if bild.height > KACHEL_H - 8:      # zu hoch: auf die Kachel bringen
                neu_b = int(bild.width * (KACHEL_H - 8) / bild.height)
                bild = bild.resize((neu_b, KACHEL_H - 8))
            bogen.paste(bild, (sx + 10, sy + KOPF), bild if bild.mode == "RGBA" else None)
        except Exception as e:   # noqa: BLE001 - cairosvg/PIL werfen je nach SVG Verschiedenes; jede Kachel, die nicht rendert, ist der Befund
            mal.text((sx + 10, sy + KOPF + 20), f"RENDERT NICHT: {str(e)[:60]!s}", fill="red")
            fehler.append(f["id"])
    ziel = os.path.join(AUS, f"bogen_{marke!s}.png")
    bogen.save(ziel)
    print(ziel)
    for f in wahl[:SPALTEN * ZEILEN]:
        print("   {!s:<9} {!s}".format(f["id"], f["frage"].replace("\n", " ")))
    if fehler:
        print("RENDERT NICHT: " + ", ".join(fehler))
    return 0


if __name__ == "__main__":
    sys.exit(main())
