#!/usr/bin/env python3
"""G2.6 #35 – Migration der rechenassistent-Aufgaben auf echte Laufzeit-Randomisierung.

Arbeitsweise (bewusst konservativ):
  * Der ORIGINALE Wortlaut bleibt erhalten. Zahlen werden per exakter Textersetzung durch
    Platzhalter ersetzt; schlaegt eine Ersetzung fehl, bricht das Skript ab (kein stiller Drift).
  * Je Schritt tritt eine Formel an die Stelle der hinterlegten Loesung.
  * Die festen "varianten" entfallen bei migrierten Fragen.
  * M04-538 (Subnetting) und M02-535 (Nutzwertanalyse) bleiben unangetastet: sie haben
    Text-Antwortschritte (/27, IP-Listen, "Dienstleister B, 0,45") – Nutzer-Entscheid "Hybrid".

Aufruf:  python3 mig_g26.py --pruefen    (nur Gegenprobe, schreibt nichts)
         python3 mig_g26.py --schreiben  (fuehrt die Migration in pool/*.json aus)
"""
import glob
import json
import os
import subprocess
import sys
from pathlib import Path

POOL = "pool"
SKIP = {"M04-538", "M02-535"}

# ---------------------------------------------------------------------------
# Migrationstabelle. Je Frage:
#   vars   : name -> (min, max, schritt)
#   text   : Liste (suchen, ersetzen) fuer den Fragetext – EXAKTE Treffer, sonst Abbruch
#   steps  : Liste je Schritt: (formel, dezimalen|None, [(suchen,ersetzen), ...] fuer den Schritttext)
#   alt    : Liste der Variablensaetze der bisherigen Fassungen (Grundfassung + Varianten)
# ---------------------------------------------------------------------------
MIG = {
 "M01-539": {
  "vars": {"stunden": (20, 60, 5), "satz": (60, 95, 5), "material": (500, 1200, 50),
           "anfahrt": (50, 200, 10), "marge": (10, 25, 5)},
  "text": [("40 Arbeitsstunden", "{stunden} Arbeitsstunden"), ("à 75 EUR", "à {satz} EUR"),
           ("Materialkosten von 850 EUR", "Materialkosten von {material} EUR"),
           ("Anfahrtskosten von 120 EUR", "Anfahrtskosten von {anfahrt} EUR"),
           ("mit 20 % auf die Gesamtkosten", "mit {marge} % auf die Gesamtkosten")],
  "steps": [("stunden*satz", None, []),
            ("s1+material+anfahrt", None, []),
            ("s2*marge/100", None, [("Gewinnmarge 20%", "Gewinnmarge {marge}%")]),
            ("s2+s3", None, [])],
  "alt": [{"stunden": 40, "satz": 75, "material": 850, "anfahrt": 120, "marge": 20},
          {"stunden": 50, "satz": 80, "material": 900, "anfahrt": 100, "marge": 20},
          {"stunden": 30, "satz": 90, "material": 750, "anfahrt": 50, "marge": 20}],
 },
 "M02-534": {
  "vars": {"liste": (5000, 12000, 500), "rabatt": (5, 20, 5), "skonto": (2, 4, 1), "liefer": (80, 200, 10)},
  "text": [("von 8.000 EUR", "von {liste} EUR"), ("15 % Mengenrabatt", "{rabatt} % Mengenrabatt"),
           ("3 % Skonto", "{skonto} % Skonto"), ("120 EUR Lieferkosten", "{liefer} EUR Lieferkosten")],
  "steps": [("liste*(1-rabatt/100)", None, []), ("s1*(1-skonto/100)", None, []), ("s2+liefer", None, [])],
  "alt": [{"liste": 8000, "rabatt": 15, "skonto": 3, "liefer": 120},
          {"liste": 10000, "rabatt": 10, "skonto": 2, "liefer": 150},
          {"liste": 6000, "rabatt": 20, "skonto": 3, "liefer": 90}],
 },
 "M02-540": {
  "vars": {"liste": (8000, 16000, 1000), "rabatt": (5, 12, 1), "skonto": (2, 3, 1),
           "verpackung": (50, 120, 5), "versand": (100, 220, 10)},
  "text": [("von 12.000 EUR", "von {liste} EUR"), ("8 % Mengenrabatt", "{rabatt} % Mengenrabatt"),
           ("2 % Skonto", "{skonto} % Skonto"),
           ("Verpackungskosten von 85 EUR", "Verpackungskosten von {verpackung} EUR"),
           ("Versandkosten von 175 EUR", "Versandkosten von {versand} EUR")],
  "steps": [("liste*(1-rabatt/100)", None, []), ("s1*(1-skonto/100)", None, []),
            ("s2+verpackung+versand", None, [])],
  "alt": [{"liste": 12000, "rabatt": 8, "skonto": 2, "verpackung": 85, "versand": 175},
          {"liste": 15000, "rabatt": 10, "skonto": 3, "verpackung": 100, "versand": 200},
          {"liste": 8000, "rabatt": 5, "skonto": 2, "verpackung": 60, "versand": 140}],
 },
 "M02-760": {
  "vars": {"liste": (8000, 16000, 1000), "rabatt": (8, 18, 1), "skonto": (2, 3, 1), "bezug": (150, 350, 10)},
  "text": [("von 12.000 EUR", "von {liste} EUR"), ("12 % Rabatt", "{rabatt} % Rabatt"),
           ("2 % Skonto", "{skonto} % Skonto"), ("250 EUR Bezugskosten", "{bezug} EUR Bezugskosten")],
  "steps": [("liste*(1-rabatt/100)", None, []), ("s1*(1-skonto/100)", None, []), ("s2+bezug", None, [])],
  "alt": [{"liste": 12000, "rabatt": 12, "skonto": 2, "bezug": 250},
          {"liste": 15000, "rabatt": 8, "skonto": 3, "bezug": 300},
          {"liste": 9000, "rabatt": 15, "skonto": 2, "bezug": 180}],
 },
 "M07-537": {
  "vars": {"soll": (30, 60, 5), "satz": (70, 110, 5), "ist": (65, 95, 5)},
  "text": [("50 Arbeitsstunden", "{soll} Arbeitsstunden"), ("à 90 EUR/Stunde", "à {satz} EUR/Stunde"),
           ("benötigte er 62 Stunden", "benötigte er {ist} Stunden")],
  "steps": [("soll*satz", None, [("(50 h × 90 EUR/h)", "({soll} h × {satz} EUR/h)")]),
            ("ist-soll", None, []),
            ("s2*satz*1.5", None, []),
            ("s1+s3", None, [])],
  "alt": [{"soll": 50, "satz": 90, "ist": 62}, {"soll": 40, "satz": 80, "ist": 50},
          {"soll": 60, "satz": 100, "ist": 75}],
 },
 "M07-760": {
  "vars": {"sollk": (18000, 32000, 1000), "istk": (16000, 35000, 500)},
  "text": [("Sollkosten von 24.000 EUR", "Sollkosten von {sollk} EUR"),
           ("Istkosten von 25.800 EUR", "Istkosten von {istk} EUR")],
  "steps": [("istk-sollk", None, []), ("s1/sollk*100", None, [])],
  "alt": [{"sollk": 24000, "istk": 25800}, {"sollk": 18000, "istk": 16650},
          {"sollk": 30000, "istk": 33900}],
 },
 "M03-541": {
  "vars": {"anschaffung": (40000, 70000, 5000), "jahreskosten": (6000, 10000, 500),
           "jahre": (4, 6, 1), "restwert": (4000, 12000, 1000)},
  "text": [("Anschaffungskosten 50.000 EUR", "Anschaffungskosten {anschaffung} EUR"),
           ("Lizenzen) 8.000 EUR", "Lizenzen) {jahreskosten} EUR"),
           ("Nutzungszeitraum von 5 Jahren", "Nutzungszeitraum von {jahre} Jahren"),
           ("Nach 5 Jahren", "Nach {jahre} Jahren"),
           ("10.000 EUR", "{restwert} EUR")],
  "steps": [("jahreskosten*jahre", None, [("über 5 Jahre", "über {jahre} Jahre")]),
            ("anschaffung+s1", None, []),
            ("s2-restwert", None, [])],
  "alt": [{"anschaffung": 50000, "jahreskosten": 8000, "jahre": 5, "restwert": 10000},
          {"anschaffung": 60000, "jahreskosten": 9000, "jahre": 4, "restwert": 12000},
          {"anschaffung": 40000, "jahreskosten": 6000, "jahre": 6, "restwert": 4000}],
 },
 "M03-544": {
  "vars": {"last": (400, 900, 50), "wirkungsgrad": (80, 94, 1)},
  "text": [("Last von 600 Watt", "Last von {last} Watt"),
           ("beträgt 85 %", "beträgt {wirkungsgrad} %")],
  "steps": [("last*wirkungsgrad/100", None, []), ("last-s1", None, []), ("s2/last*100", None, [])],
  "alt": [{"last": 600, "wirkungsgrad": 85}, {"last": 800, "wirkungsgrad": 90},
          {"last": 500, "wirkungsgrad": 80}],
 },

 # --- Block 2: Energie / Datenmengen / Verfuegbarkeit -----------------------
 # Strompreise werden als GANZZAHLIGE Cent-Variable gezogen (Nutzer-Entscheid: keine
 # Dezimalvariablen) und im Text als EUR ausgegeben: {preisCent/100|2}.
 "M03-531": {
  "vars": {"watt": (400, 1200, 100), "stunden": (8, 20, 2), "preisCent": (22, 40, 1)},
  "text": [("von 800 Watt", "von {watt} Watt"), ("täglich 16 Stunden", "täglich {stunden} Stunden"),
           ("beträgt 0,30 EUR pro kWh", "beträgt {preisCent/100|2} EUR pro kWh")],
  "steps": [("watt/1000", None, []), ("s1*stunden", None, []), ("s2*365", None, []),
            ("s3*preisCent/100", None, [])],
  "alt": [{"watt": 800, "stunden": 16, "preisCent": 30}, {"watt": 500, "stunden": 12, "preisCent": 40},
          {"watt": 1200, "stunden": 10, "preisCent": 25}],
  "textform": {"preisCent": ("v/100", 2)},
 },
 "M03-952": {
  "vars": {"watt": (400, 1200, 100), "stunden": (4, 12, 1), "preisCent": (22, 40, 1)},
  "text": [("von 800 W", "von {watt} W"), ("läuft 5 Stunden", "läuft {stunden} Stunden"),
           ("beträgt 0,30 €/kWh", "beträgt {preisCent/100|2} €/kWh")],
  "steps": [("watt*stunden", None, [("von 800 W", "von {watt} W"),
                                    ("von 5 Stunden", "von {stunden} Stunden")]),
            ("s1/1000", None, []),
            ("s2*preisCent/100", None, [("von 0,30 €/kWh", "von {preisCent/100|2} €/kWh")])],
  "alt": [{"watt": 800, "stunden": 5, "preisCent": 30}, {"watt": 1200, "stunden": 6, "preisCent": 35},
          {"watt": 500, "stunden": 10, "preisCent": 40}],
  "textform": {"preisCent": ("v/100", 2)},
 },
 "M03-760": {
  "vars": {"watt": (100, 600, 50), "stunden": (2000, 8000, 2000), "preisCent": (25, 40, 1)},
  "text": [("von 350 W durchgehend das ganze Jahr (8.760 Betriebsstunden)",
            "von {watt} W mit {stunden} Betriebsstunden pro Jahr"),
           ("beträgt 0,32 EUR/kWh", "beträgt {preisCent/100|2} EUR/kWh")],
  "steps": [("watt*stunden", None, []), ("s1/1000", None, []), ("s2*preisCent/100", None, [])],
  "alt": [{"watt": 350, "stunden": 8760, "preisCent": 32}, {"watt": 500, "stunden": 8760, "preisCent": 30},
          {"watt": 120, "stunden": 2000, "preisCent": 35}],
  "textform": {"preisCent": ("v/100", 2)},
 },
 "M03-908": {
  "vars": {"anzahlAlt": (6, 12, 2), "wattAlt": (150, 300, 10), "anzahlNeu": (3, 6, 1),
           "wattNeu": (100, 250, 10), "preisCent": (22, 35, 1), "invest": (4000, 16000, 500)},
  "text": [("8 Altserver mit je 200 W", "{anzahlAlt} Altserver mit je {wattAlt} W"),
           ("4 neue Server mit je 150 W", "{anzahlNeu} neue Server mit je {wattNeu} W"),
           ("beträgt 0,30 EUR/kWh", "beträgt {preisCent/100|2} EUR/kWh"),
           ("neuen Server 7.884 EUR", "neuen Server {invest} EUR"),
           ("Nach wie vielen Jahren hat sich die Investition allein über die eingesparten Stromkosten bezahlt gemacht?",
            "Nach wie vielen Jahren hat sich die Investition allein über die eingesparten Stromkosten bezahlt gemacht (auf eine Nachkommastelle)?")],
  "steps": [("anzahlAlt*wattAlt", None, []), ("anzahlNeu*wattNeu", None, []),
            ("(s1-s2)/1000*8760", None, []), ("s3*preisCent/100", None, []), ("invest/s4", 1, [])],
  "alt": [{"anzahlAlt": 8, "wattAlt": 200, "anzahlNeu": 4, "wattNeu": 150, "preisCent": 30, "invest": 7884},
          {"anzahlAlt": 10, "wattAlt": 220, "anzahlNeu": 5, "wattNeu": 140, "preisCent": 25, "invest": 13140},
          {"anzahlAlt": 6, "wattAlt": 250, "anzahlNeu": 3, "wattNeu": 250, "preisCent": 30, "invest": 5913}],
  "textform": {"preisCent": ("v/100", 2)},
 },
 "M03-532": {
  # Dateigroesse wird in MB gezogen und im Text als GB angezeigt (keine Dezimalvariablen).
  "vars": {"mb": (500, 3000, 100), "bandbreite": (50, 120, 5)},
  "text": [("von 1,5 GB", "von {mb/1000|1} GB"), ("von 75 Mbit/s", "von {bandbreite} Mbit/s")],
  "steps": [("mb", None, []), ("s1*8", None, []), ("s2/bandbreite", None, []), ("s3/60", None, [])],
  "alt": [{"mb": 1500, "bandbreite": 75}, {"mb": 2500, "bandbreite": 100}, {"mb": 900, "bandbreite": 60}],
  "textform": {"mb": ("v/1000", 1)},
 },
 "M03-533": {
  "vars": {"tagesMB": (50, 150, 5), "redundanz": (2, 4, 1), "tage": (30, 90, 30)},
  "text": [("täglich 75 MB", "täglich {tagesMB} MB"), ("4-fache Datenredundanz", "{redundanz}-fache Datenredundanz"),
           ("60 Tage lang aufbewahrt", "{tage} Tage lang aufbewahrt")],
  "steps": [("tagesMB*redundanz", None, []),
            ("s1*tage", None, [("für 60 Tage", "für {tage} Tage"), ("× 60 Tage", "× {tage} Tage")]),
            ("s2/1024", None, [])],
  "alt": [{"tagesMB": 75, "redundanz": 4, "tage": 60}, {"tagesMB": 100, "redundanz": 3, "tage": 90},
          {"tagesMB": 120, "redundanz": 2, "tage": 100}],
 },
 "M03-726": {
  "vars": {"tb": (1, 8, 1)},
  "text": [("mit 2 TB bewirbt", "mit {tb} TB bewirbt")],
  "steps": [("tb*1000000000000", None, [("(2 TB = 2 × 10^12 Byte)", "({tb} TB = {tb} × 10^12 Byte)")]),
            ("1073741824", None, []),
            ("s1/s2", 1, [])],
  "alt": [{"tb": 2}, {"tb": 1}, {"tb": 4}],
 },
 "M03-727": {
  "vars": {"mb": (100, 900, 25)},
  "text": [("Eine 250 MB große Datei", "Eine {mb} MB große Datei")],
  "steps": [("mb*1000000", None, [("(250 MB × 10^6)", "({mb} MB × 10^6)")]),
            ("s1*8", None, []), ("s2/1000000", None, [])],
  "alt": [{"mb": 250}, {"mb": 500}, {"mb": 125}],
 },
 "M03-761": {
  "vars": {"bitrate": (4, 24, 1), "dauer": (600, 7200, 300)},
  "text": [("Bitrate von 8 Mbit/s", "Bitrate von {bitrate} Mbit/s"),
           ("dauert 3.600 Sekunden (1 Stunde)", "dauert {dauer} Sekunden")],
  "steps": [("bitrate*1000000*dauer", None, []), ("s1/8", None, []), ("s2/1000000000", None, [])],
  "alt": [{"bitrate": 8, "dauer": 3600}, {"bitrate": 20, "dauer": 900}, {"bitrate": 5, "dauer": 7200}],
 },
 "M03-950": {
  "vars": {"mb": (100, 900, 50), "bandbreite": (20, 100, 10)},
  "text": [("Größe von 500 MB", "Größe von {mb} MB"), ("von 50 Mbit/s", "von {bandbreite} Mbit/s")],
  "steps": [("mb*1000000", None, [("von 500 MB", "von {mb} MB")]),
            ("s1*8", None, []),
            ("s2/(bandbreite*1000000)", None,
             [("von 50 Mbit/s (= 50.000.000 Bit/s)", "von {bandbreite} Mbit/s (= {bandbreite*1000000} Bit/s)")])],
  "alt": [{"mb": 500, "bandbreite": 50}, {"mb": 900, "bandbreite": 60}, {"mb": 250, "bandbreite": 20}],
 },
 "M03-951": {
  "vars": {"breite": (640, 1600, 80), "hoehe": (480, 1200, 60), "farbtiefe": (8, 32, 8)},
  "text": [("von 800 × 600 Pixel", "von {breite} × {hoehe} Pixel"),
           ("Farbtiefe von 16 Bit", "Farbtiefe von {farbtiefe} Bit")],
  "steps": [("breite*hoehe", None, [("von 800 × 600 Pixel", "von {breite} × {hoehe} Pixel")]),
            ("s1*farbtiefe", None, [("von 16 Bit pro Pixel", "von {farbtiefe} Bit pro Pixel")]),
            ("s2/8", None, []), ("s3/1000", None, [])],
  "alt": [{"breite": 800, "hoehe": 600, "farbtiefe": 16}, {"breite": 1000, "hoehe": 500, "farbtiefe": 16},
          {"breite": 1200, "hoehe": 800, "farbtiefe": 24}],
 },
 "M03-953": {
  "vars": {"gib": (1, 8, 1)},
  "text": [("fasst 2 GiB", "fasst {gib} GiB")],
  "steps": [("gib*1024", None, [("Rechne 2 GiB in MiB um", "Rechne {gib} GiB in MiB um")]),
            ("s1*1024", None, []), ("s2*1024", None, []), ("s3*8", None, [])],
  "alt": [{"gib": 2}, {"gib": 4}, {"gib": 1}],
 },
 "M06-542": {
  "vars": {"vollMB": (300, 700, 50), "diffMB": (80, 250, 10), "tage": (14, 28, 7), "wochen": (2, 4, 1)},
  "text": [("Vollbackup von 500 MB", "Vollbackup von {vollMB} MB"),
           ("Backup von 150 MB", "Backup von {diffMB} MB"),
           ("28 Tage (4 Wochen) lang", "{tage} Tage ({wochen} Wochen) lang")],
  "steps": [("tage*vollMB", None, [("(28 Tage × 500 MB pro Tag)", "({tage} Tage × {vollMB} MB pro Tag)")]),
            ("5*wochen", None, [("(5 Tage pro Woche × 4 Wochen)", "(5 Tage pro Woche × {wochen} Wochen)")]),
            ("s2*diffMB", None, [("(Anzahl × 150 MB)", "(Anzahl × {diffMB} MB)")]),
            ("(s1+s3)/1024", None, [])],
  "alt": [{"vollMB": 500, "diffMB": 150, "tage": 28, "wochen": 4},
          {"vollMB": 400, "diffMB": 100, "tage": 28, "wochen": 4},
          {"vollMB": 600, "diffMB": 200, "tage": 14, "wochen": 2}],
 },
 # Verfuegbarkeit: gezogen wird der Ausfallanteil in HUNDERTSTEL Prozent (ganzzahlig),
 # angezeigt wird daraus die Verfuegbarkeit: 5 -> 0,05 % Ausfall -> 99,95 % Verfuegbarkeit.
 "M07-536": {
  "vars": {"ausfallH": (5, 50, 5)},
  "text": [("von 99,95 % pro Jahr", "von {100-ausfallH/100|2} % pro Jahr")],
  "steps": [("365*24", None, []), ("ausfallH/100", None, []), ("s1*s2/100", None, []), ("s3*60", 1, [])],
  "alt": [{"ausfallH": 5}, {"ausfallH": 10}, {"ausfallH": 50}],
  "textform": {"ausfallH": ("100-v/100", 2)},
 },
 "M07-543": {
  "vars": {"ausfallH": (10, 50, 10)},
  "text": [("von 99,9 % pro Monat", "von {100-ausfallH/100|2} % pro Monat")],
  "steps": [("30*24*60", None, []), ("ausfallH/100", None, []), ("s1*s2/100", 1, [])],
  "alt": [{"ausfallH": 10}, {"ausfallH": 20}, {"ausfallH": 50}],
  "textform": {"ausfallH": ("100-v/100", 2)},
 },
}


def lade(datei):
    with open(os.path.join(POOL, datei), encoding="utf-8") as fh:
        return json.load(fh)


def finde_datei(fid):
    for p in sorted(glob.glob(os.path.join(POOL, "pool_m*.json"))):
        with open(p, encoding="utf-8") as fh:
            for f in json.load(fh):
                if f.get("id") == fid:
                    return os.path.basename(p)
    return None


def ersetze(text, paare, wo):
    for such, ers in paare:
        if such not in text:
            raise SystemExit(f"ABBRUCH {wo}: Muster nicht gefunden: {such!r}")
        if text.count(such) > 1:
            raise SystemExit(f"ABBRUCH {wo!s}: Muster mehrdeutig ({text.count(such):d}x): {such!r}")
        text = text.replace(such, ers)
    return text


def baue(fid, frage):
    """Liefert die migrierte Fassung der Frage (ohne sie zu schreiben)."""
    m = MIG[fid]
    neu = dict(frage)
    neu["frage"] = ersetze(frage["frage"], m["text"], fid + "/frage")
    schritte = []
    for i, s in enumerate(frage["schritte"]):
        formel, dez, repl = m["steps"][i]
        alt = dict(s)
        alt["text"] = ersetze(s["text"], repl, f"{fid!s}/S{i + 1:d}")
        alt.pop("loesung", None)
        alt["formel"] = formel
        if dez is not None:
            alt["dezimalen"] = dez
        schritte.append(alt)
    neu["schritte"] = schritte
    neu["variablen"] = {k: {"min": v[0], "max": v[1], "schritt": v[2]} for k, v in m["vars"].items()}
    neu.pop("varianten", None)
    return neu


def gegenprobe():
    """Formel + Altwerte muss EXAKT die alte hinterlegte Musterloesung ergeben."""
    ref = json.loads(Path("/tmp/g26/referenz.json").read_text(encoding="utf-8"))
    auftrag = []
    for fid, m in MIG.items():
        if fid not in ref:
            raise SystemExit(f"ABBRUCH: {fid} nicht in Referenz")
        faelle = ref[fid]["faelle"]
        if len(m["alt"]) != len(faelle):
            raise SystemExit("ABBRUCH {!s}: {:d} Altwertsaetze, aber {:d} Faelle".format(fid, len(m["alt"]), len(faelle)))
        for j, (werte, fall) in enumerate(zip(m["alt"], faelle)):
            # (a) Plausibilitaet: jeder Altwert muss im zugehoerigen Alt-Fragetext vorkommen.
            #     Variablen, die im Text in ABGELEITETER Form stehen (Cent -> EUR, MB -> GB,
            #     Ausfallanteil -> Verfuegbarkeit), werden ueber "textform" umgerechnet geprueft.
            txt = fall["frage"]
            tf = m.get("textform", {})
            for name, v in werte.items():
                if name in tf:
                    ausdruck, dez = tf[name]
                    gezeigt = eval(ausdruck, {"__builtins__": {}}, {"v": float(v)})
                    kandidaten = {("%." + str(dez) + "f") % gezeigt,
                                  (("%." + str(dez) + "f") % gezeigt).replace(".", ","),
                                  (f"{gezeigt:g}").replace(".", ",")}
                else:
                    kandidaten = {str(int(v)) if float(v).is_integer() else str(v),
                                  f"{int(v):,}".replace(",", ".") if float(v).is_integer() else ""}
                if not any(k and k in txt for k in kandidaten):
                    raise SystemExit(f"ABBRUCH {fid!s} Fall {j:d}: Wert {name!s}={v!s} (erwartet im Text: {sorted(k for k in kandidaten if k)!s}) fehlt im Fragetext:\n   {txt[:180]!s}")
            auftrag.append({"id": fid, "fall": j, "werte": werte,
                            "formeln": [st[0] for st in m["steps"]],
                            "dez": [st[1] for st in m["steps"]],
                            "soll": [l[0] for l in fall["loesungen"]]})
    with open("/tmp/g26/auftrag.json", "w", encoding="utf-8") as fh:
        json.dump(auftrag, fh, ensure_ascii=False)
    out = subprocess.run(["node", "/tmp/g26/pruefe.js"], capture_output=True, text=True, check=False)
    print(out.stdout.strip())
    if out.returncode != 0:
        print(out.stderr.strip())
        raise SystemExit("ABBRUCH: Gegenprobe fehlgeschlagen")


def schreiben():
    proDatei = {}
    for fid in MIG:
        d = finde_datei(fid)
        if not d:
            raise SystemExit(f"ABBRUCH: Datei zu {fid} nicht gefunden")
        proDatei.setdefault(d, []).append(fid)
    for datei, ids in sorted(proDatei.items()):
        pfad = os.path.join(POOL, datei)
        with open(pfad, encoding="utf-8") as fh:
            fragen = json.load(fh)
        n = 0
        for k, f in enumerate(fragen):
            if f.get("id") in ids:
                fragen[k] = baue(f["id"], f)
                n += 1
        with open(pfad, "w", encoding="utf-8") as fh:
            json.dump(fragen, fh, ensure_ascii=False, indent=2)
            fh.write("\n")
        print(f"  {datei!s:<28} {n:d} Fragen migriert")


if __name__ == "__main__":
    modus = sys.argv[1] if len(sys.argv) > 1 else "--pruefen"
    print("Migrationstabelle: {:d} Fragen (ausgenommen: {!s})".format(len(MIG), ", ".join(sorted(SKIP))))
    gegenprobe()
    if modus == "--schreiben":
        schreiben()
        print("GESCHRIEBEN.")
    else:
        print("(nur geprueft, nichts geschrieben)")
