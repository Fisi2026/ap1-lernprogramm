#!/usr/bin/env python3
"""G1.7 #44: erzeugt die beiden Manifest-Screenshots (form_factor "narrow").

Aufruf im Projektordner:  python3 tools/make_screenshots.py
Ergebnis: screenshot-start.png und screenshot-ueben.png (je 412x915) im Projektordner.

HINWEIS: Das sind schematische Nachbauten im App-Look (dunkles Theme), keine echten
Geraeteaufnahmen - jsdom kann nicht rendern. Sie duerfen jederzeit durch echte Handy-
Screenshots gleicher Groesse und gleichen Dateinamens ersetzt werden; am Code oder am
Manifest muss dafuer nichts geaendert werden.
Farben stammen 1:1 aus styles.css (dunkles Theme).
"""
import os

from PIL import Image, ImageDraw, ImageFont

B, H = 412, 915

# Farben aus styles.css (html[data-theme="dark"])
INK900 = "#15171C"   # Seitenhintergrund
PANEL = "#1B1E25"    # Kartenflaeche
RAND = "#2E333D"
GELB = "#F4C20D"
TEXT = "#F0F2F5"
TEXT2 = "#C6CCD4"
GRAU = "#69707D"
GRUEN = "#3FA34D"

FONTS = [
    "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf",
    "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf",
]


def font(size, bold=False):
    pfad = FONTS[1] if bold else FONTS[0]
    try:
        return ImageFont.truetype(pfad, size)
    except OSError:
        return ImageFont.load_default()


def karte(d, x, y, w, h, fill=PANEL, rand=RAND, r=12):
    d.rounded_rectangle([x, y, x + w, y + h], radius=r, fill=fill, outline=rand, width=1)


def kopf(d, titel):
    """Statusleiste + Kopfzeile mit Marke und Countdown-Chip."""
    d.rectangle([0, 0, B, 26], fill=INK900)
    d.text((14, 7), "9:41", font=font(12, True), fill=TEXT2)
    d.ellipse([B - 30, 9, B - 22, 17], fill=TEXT2)
    # Marke
    d.ellipse([16, 38, 44, 66], outline=GELB, width=3)
    d.ellipse([26, 48, 34, 56], fill=GELB)
    d.text((54, 40), "minions", font=font(15, True), fill=TEXT)
    d.text((54, 58), "AP1 · FiSi", font=font(10), fill=GRAU)
    # Countdown-Chip
    karte(d, B - 132, 42, 116, 26, fill="#22262E", r=13)
    d.text((B - 120, 48), "AP1 in 220 Tagen", font=font(10), fill=TEXT2)
    d.text((16, 86), titel, font=font(20, True), fill=TEXT)


def start_screen(pfad):
    img = Image.new("RGB", (B, H), INK900)
    d = ImageDraw.Draw(img)
    kopf(d, "Was willst du heute schaffen?")

    # Hero-Kachel "Üben"
    karte(d, 16, 124, B - 32, 92, fill="#2A2412", rand=GELB)
    d.text((32, 142), "Üben", font=font(22, True), fill=GELB)
    d.text((32, 176), "Adaptives Training über alle Themen.", font=font(12), fill=TEXT2)

    kacheln = [
        ("5er-Serie", "Gegen deine größte Schwäche.", "NEU"),
        ("Fehler-Deck", "Wiedervorlage falscher Fragen.", "12"),
        ("Prüfungssimulation", "4 Aufgaben, 100 Punkte, 90 Min.", ""),
        ("Statistik", "Stärken und Schwächen je Modul.", ""),
        ("Glossar", "Begriffe nachschlagen.", ""),
        ("Spickzettel", "Formeln und Merksätze kompakt.", ""),
    ]
    y = 232
    for titel, sub, badge in kacheln:
        karte(d, 16, y, B - 32, 76)
        d.text((32, y + 14), titel, font=font(15, True), fill=TEXT)
        d.text((32, y + 40), sub, font=font(11), fill=TEXT2)
        if badge:
            bw = 34 if len(badge) > 2 else 26
            karte(d, B - 32 - bw - 14, y + 16, bw, 22, fill=GELB, rand=GELB, r=11)
            d.text((B - 32 - bw - 14 + (9 if len(badge) > 2 else 8), y + 21), badge,
                   font=font(10, True), fill=INK900)
        y += 88

    # Fußzeile: Tagesziel
    karte(d, 16, H - 96, B - 32, 62)
    d.text((32, H - 84), "Tagesziel", font=font(11), fill=GRAU)
    d.text((32, H - 66), "14 von 20 Fragen", font=font(14, True), fill=TEXT)
    d.rounded_rectangle([32, H - 44, B - 48, H - 38], radius=3, fill=RAND)
    d.rounded_rectangle([32, H - 44, 32 + int((B - 80) * 0.7), H - 38], radius=3, fill=GELB)
    img.save(pfad, "PNG", optimize=True)
    return pfad


def ueben_screen(pfad):
    img = Image.new("RGB", (B, H), INK900)
    d = ImageDraw.Draw(img)
    kopf(d, "Üben")

    # Aufgaben-Panel
    karte(d, 16, 124, B - 32, 220)
    d.text((32, 138), "AUFGABE", font=font(10, True), fill=GELB)
    # Meta-Chips
    x = 32
    for chip in ["M03", "Netze", "Stufe 2", "90 s"]:
        w = 8 + len(chip) * 7
        karte(d, x, 158, w, 20, fill="#22262E", r=10)
        d.text((x + 6, 162), chip, font=font(9), fill=TEXT2)
        x += w + 6
    d.text((B - 40, 156), "☆", font=font(18), fill=GRAU)

    zeilen = [
        "Ein Arbeitsplatzrechner erhält keine",
        "Verbindung zum Firmennetz. Die",
        "Konfiguration zeigt die Adresse",
        "169.254.18.7 mit Maske 255.255.0.0.",
        "",
        "Welche Ursache ist am wahrschein-",
        "lichsten?",
    ]
    y = 190
    for z in zeilen:
        d.text((32, y), z, font=font(13), fill=TEXT)
        y += 22

    # Antwortoptionen (eigenes Löser-Panel unterhalb der Aufgabe)
    optionen = [
        ("Der DHCP-Server ist nicht erreichbar.", True),
        ("Das Netzkabel ist defekt.", False),
        ("Die Firewall blockiert Port 80.", False),
        ("Der DNS-Server ist falsch gesetzt.", False),
    ]
    d.text((32, 360), "LÖSUNG", font=font(10, True), fill=GELB)
    y = 384
    for text, richtig in optionen:
        karte(d, 32, y, B - 64, 44, fill="#22262E", rand=GRUEN if richtig else RAND)
        if richtig:
            d.text((44, y + 14), "✓", font=font(14, True), fill=GRUEN)
        d.text((68 if richtig else 44, y + 14), text, font=font(12),
               fill=TEXT if richtig else TEXT2)
        y += 54

    # Feedback
    karte(d, 16, y + 10, B - 32, 108, fill="#16281B", rand=GRUEN)
    d.text((32, y + 26), "Richtig", font=font(14, True), fill=GRUEN)
    for i, z in enumerate([
        "169.254.x.x ist eine APIPA-Adresse: der",
        "Rechner hat keine Antwort vom DHCP-Server",
        "bekommen und sich selbst adressiert.",
    ]):
        d.text((32, y + 50 + i * 18), z, font=font(11), fill=TEXT2)

    # Distraktor-Erklärungen (#69) füllen den Rest bis zur Aktionsleiste
    y2 = y + 132
    karte(d, 16, y2, B - 32, 96)
    d.text((32, y2 + 14), "Warum die anderen nicht passen", font=font(11, True), fill=GELB)
    for i, z in enumerate([
        "Kabelbruch: dann gäbe es gar keine IP-Adresse.",
        "Firewall/Port 80: betrifft nur einzelne Dienste.",
        "Falscher DNS: Namen fehlen, Adresse käme trotzdem.",
    ]):
        d.text((32, y2 + 36 + i * 17), z, font=font(10), fill=TEXT2)

    # Aktionsleiste unten
    d.rectangle([0, H - 62, B, H], fill="#1B1E25")
    d.line([0, H - 62, B, H - 62], fill=RAND, width=1)
    d.text((20, H - 40), "Teilpunkte werden angezeigt.", font=font(10), fill=GRAU)
    karte(d, B - 116, H - 48, 96, 34, fill=GELB, rand=GELB, r=8)
    d.text((B - 92, H - 39), "Weiter", font=font(13, True), fill=INK900)
    img.save(pfad, "PNG", optimize=True)
    return pfad


if __name__ == "__main__":
    root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    for p in (start_screen(os.path.join(root, "screenshot-start.png")),
              ueben_screen(os.path.join(root, "screenshot-ueben.png"))):
        with Image.open(p) as im:
            print(f"[ok] {os.path.basename(p)}  {im.width}x{im.height}  {os.path.getsize(p)} Bytes")
