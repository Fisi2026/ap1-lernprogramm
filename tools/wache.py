#!/usr/bin/env python3
"""tools/wache.py - Kassenbuch fuer den Kontextverbrauch EINES Chats.

WOZU. Ein Chat merkt selbst nicht, wie voll sein Kontext ist: es gibt in dieser
Oberflaeche kein Werkzeug, das den Verbrauch nennt, und kein Transkript auf dem
Rechner (gemessen 18.09.2026: unter ~/.claude wurde waehrend eines laufenden
Chats keine Datei angefasst). Die fertigen Loesungen draussen - context-sentinel,
context_guard, claude-context-optimizer - lesen genau dieses Transkript ueber
Hooks und setzen Claude Code im Terminal voraus. Hier geht das nicht.

WAS ES MISST (echte Messung, keine Schaetzung):
  * die BYTES jeder Bruecken-Ausgabe. Jeder Aufruf der Training Shell legt seine
    volle Ausgabe in _to_delete/helfer/letzte_ausgabe.txt ab - die wird gezaehlt.
  * die Zahl der Runden.

WAS ES NICHT MISST - und was deshalb GESCHAETZT wird:
  * meinen eigenen Text, mein Nachdenken, die Nachrichten des Nutzers,
    den Systemtext und alles, was andere Werkzeuge liefern.
  ►► Dafuer steht 'je_runde': ein NAMENTLICHER Zuschlag je Runde, kein
     verstecktes Aufrunden. Jede Ausgabe nennt ihn, damit niemand die Zahl fuer
     eine Messung haelt.
  ⚠️ Auch 'faktor' (Byte je Token) ist ein Schaetzwert - Anthropics Zerleger
     liegt nicht vor. 3.6 ist fuer deutschen Text plus Code eine Hausnummer.
     ►► Wer ihn genauer kennt: --faktor mitgeben, er steht im Kassenbuch.

⛔ EIN ABSTAND IST KEINE ZEIT, SONDERN EINE STELLE. Nichts laeuft hier zwischen
   zwei Nachrichten von selbst. 'tick' wird an Aufrufe angehaengt, die ohnehin
   stattfinden - deshalb kostet es fast nichts und deshalb SCHWEIGT es, solange
   nichts zu melden ist.

DIE ENTSCHEIDUNGSREGEL (das eigentliche Stueck):
   verbraucht + reserve + rest_der_aufgabe > budget  ->  ALARM
   Also nicht "der Kontext ist voll", sondern "er reicht nicht mehr fuer das,
   was noch kommt, PLUS die Uebergabe". Die Uebergabe muss bezahlt sein, bevor
   sie noetig wird - sonst bricht der Chat mitten in der Buchfuehrung ab, wie am
   18.09.2026 geschehen.

Aufrufe:
  python3 tools/wache.py start [--budget N] [--faktor F] [--aufgabe TEXT] [--schaetzung N]
  python3 tools/wache.py tick [--notiz TEXT]      # schweigt, wenn nichts zu melden ist
  python3 tools/wache.py stand                    # der volle Befund, auf Zuruf
  python3 tools/wache.py aufgabe <name> [--schaetzung N]
  python3 tools/wache.py abschluss <name>         # Kosten in die Historie schreiben
  python3 tools/wache.py konto --sitzung P --woche P [--reset-sitzung Z] [--reset-woche Z]
  python3 tools/wache.py konto                    # nur der Konto-Befund
  python3 tools/wache.py selbsttest               # Gegenprobe mit bekannter Antwort

DIE ZWEITE GRENZE: DAS KONTO (18.09.2026).
  Neben dem Kontext kann auch das NUTZUNGSBUDGET des Kontos zuerst anschlagen.
  Es gibt dafuer keine abfragbare Zahl: Anthropic nennt fuer Pro/Max kein
  Kontingent, und die beiden Balken (Fuenf-Stunden-Sitzung, Woche) stehen nur in
  Einstellungen -> Nutzung. Ein claude usage --json ist als Wunsch offen.
  DESHALB KALIBRIERUNG: der Nutzer liest die Prozente ab, konto verbucht sie
  zusammen mit dem eigenen Tokenstand. ZWEI Ablesungen ergeben den KURS
  (Prozent je 1000 Tokens). Aus EINER folgt keiner - das sagt das Werkzeug.
  Der Kurs gehoert dem KONTO und ueberdauert den Chat (tools/wache_konto.json),
  wird aber nur MIT Datum und Herkunfts-Chat benutzt (Nutzer-Entscheid 18.09.).
  AN DIESEM PROJEKT ARBEITEN ZWEI KONTEN am selben Arbeitsbaum. Die Kurse liegen
  deshalb je Konto getrennt, und der Chat sagt beim Start, auf welchem er sitzt:
  wache.py start --konto <name>. Ohne Namen wird KEIN fremder Kurs uebernommen
  und keiner gespeichert - ein vergessenes Flag ergibt "kein Kurs", nie einen
  falschen. Die Etappen-Historie bleibt gemeinsam: was eine Etappe kostet, haengt
  an der Aufgabe, nicht am Konto.
  Schlaegt die Kontogrenze an, hilft ein neuer Chat NICHT - der Topf ist geteilt.
  Dann: sichern, Aufgabe teilen oder auf nach dem Reset verschieben.
"""
import argparse
import contextlib
import hashlib
import json
import os
import sys
import time

NL = chr(10)
HIER = os.path.dirname(os.path.abspath(__file__))
WURZEL = os.path.dirname(HIER)

def pfad_ausgabe():
    return os.environ.get("WACHE_AUSGABE") or os.path.join(
        WURZEL, "_to_delete", "helfer", "letzte_ausgabe.txt")

def pfad_buch():
    return os.environ.get("WACHE_BUCH") or os.path.join(
        WURZEL, "_to_delete", "helfer", "wache_kassenbuch.json")

def pfad_historie():
    return os.environ.get("WACHE_HISTORIE") or os.path.join(HIER, "wache_historie.json")

def pfad_kladde():
    """DIE KLADDE - der Grund, warum diese Wache ueberhaupt vollstaendig zaehlt.
    Der Bruecken-Server haengt je Aufruf eine Zeile an; diese Datei wird nicht
    ueberschrieben. Vorher zaehlte die Wache aus `letzte_ausgabe.txt`, und die
    ueberlebt nur bis zum naechsten Aufruf: lief `tick` nicht dazwischen, war die
    Ausgabe fuer immer weg. ⛔ Eine Messung, die von einer Gewohnheit abhaengt,
    ist keine Messung (18.09.2026: `tick` lief bei 4 von rund 30 Aufrufen)."""
    return os.environ.get("WACHE_KLADDE") or os.path.join(
        WURZEL, "_to_delete", "helfer", "ausgabe_kladde.log")

def pfad_konto():
    """Der KURS gehoert dem Konto, nicht dem Chat - deshalb eine eigene Datei, die
    Chats ueberdauert. Unter tools/, NICHT in den Wurzelordner: eine .json dort
    geht an den Lerner (.assetsignore schliesst *.json nicht aus)."""
    return os.environ.get("WACHE_KONTO") or os.path.join(HIER, "wache_konto.json")

# ZWEI ABLESUNGEN DICHT BEIEINANDER ERGEBEN KEINEN KURS, SONDERN RAUSCHEN.
#    Die Balken zeigen ganze Prozent. Bei 500 Tokens Abstand macht EIN Prozentpunkt
#    schon 2 % je 1000 Tokens - ein Vielfaches jedes echten Kurses. Darunter bildet
#    das Werkzeug KEINEN Kurs und sagt das auch.
MINDEST_TOKENS = 2000
# RUNDUNG (22.09.2026, BUILD_LOG 26 Nachtrag 1): die Anzeige rundet auf ganze Prozent, jede Ablesung
# ist also +-0,5 unsicher. Unter MINDEST_PUNKTE Abstand wird mit der OBERGRENZE (dp + 1) gerechnet.
# Beleg 21.09.: 0,08 aus 1 Punkt Abstand, wahr waren 0,19.
MINDEST_PUNKTE = 3.0

# DIESE DREI ZEILEN STEHEN IN JEDER KONTO-AUSGABE (Bauplan 18.09., Punkt 4).
#    Ohne sie wird aus einer Rechnung ein Versprechen.
GRENZEN = (
    "  ⚠️ DREI GRENZEN DIESER RECHNUNG:",
    "     * der Balken zaehlt AUCH ANDERE CHATS mit - der Kurs ist eine Obergrenze,",
    "       kein gemessener Eigenanteil dieses Chats",
    "     * der Kurs gilt nur bei AEHNLICHEM TEMPO wie zwischen den beiden Ablesungen",
    "     * jede Ablesung ist eine MOMENTAUFNAHME, keine laufende Messung",
)

VORGABE = {
    "budget": 200000,   # Tokens, die ein Chat traegt. Anpassbar, nicht gemessen.
    "faktor": 3.6,      # Byte je Token (Schaetzwert, s. Kopf)
    "je_runde": 900,    # Tokens je Runde, die das Kassenbuch NICHT sieht
    "reserve": 18000,   # Tokens fuer die vollstaendige Uebergabe
}

def leer():
    d = {"begonnen": time.strftime("%Y-%m-%d %H:%M"), "runden": 0, "bytes": 0,
         "gesehen": [], "aufgabe": "", "schaetzung": 0, "verbraucht_bei_start": 0,
         "alarm_gemeldet": False, "notizen": [],
         "ablesungen": [], "konto_alarm_gemeldet": False, "konto_erinnert": False,
         "konto": "", "runden_bei_start": 0,
         "kladde_gelesen": 0, "kladde_zeilen": 0, "quelle": ""}
    d.update(VORGABE)
    return d

def lade():
    p = pfad_buch()
    if not os.path.exists(p):
        return None
    try:
        with open(p, encoding="utf-8") as f:
            d = json.load(f)
    except (OSError, ValueError):
        return None
    # Ein Kassenbuch von VOR der Konto-Erweiterung kennt diese Felder nicht.
    # Fehlende Felder hier ergaenzen, statt sie ueberall mit .get() zu umgehen.
    d.setdefault("ablesungen", [])
    d.setdefault("konto_alarm_gemeldet", False)
    d.setdefault("konto_erinnert", False)
    d.setdefault("konto", "")
    d.setdefault("runden_bei_start", 0)
    d.setdefault("kladde_gelesen", 0)
    d.setdefault("kladde_zeilen", 0)
    d.setdefault("quelle", "")
    return d

def sichere(d):
    p = pfad_buch()
    os.makedirs(os.path.dirname(p), exist_ok=True)
    roh = json.dumps(d, ensure_ascii=False, indent=1)
    with open(p, "w", encoding="utf-8", newline="") as f:
        f.write(roh + NL)

def tokens(d):
    """Gemessene Bytes in Tokens, plus der genannte Zuschlag je Runde."""
    aus_bytes = d["bytes"] / float(d["faktor"])
    return round(aus_bytes + d["runden"] * d["je_runde"])

def rest_der_aufgabe(d):
    """Was von der laufenden Aufgabe noch aussteht - nie unter null."""
    schon = tokens(d) - d.get("verbraucht_bei_start", 0)
    return max(0, int(d.get("schaetzung", 0)) - schon)

def urteil(d):
    """(alarm, zeile) - die Entscheidungsregel aus dem Kopf dieser Datei."""
    v = tokens(d)
    rest = rest_der_aufgabe(d)
    noetig = v + d["reserve"] + rest
    alarm = noetig > d["budget"]
    zeile = ("verbraucht ~" + str(v) + " + Reserve " + str(d["reserve"]) +
             " + Rest der Aufgabe ~" + str(rest) + " = " + str(noetig) +
             " von " + str(d["budget"]))
    return alarm, zeile

def verbuche_kladde(d):
    """(zuwachs, meldung) - verbucht ALLES, was seit dem gemerkten Stand in der
    Kladde steht, und merkt sich den neuen Stand.

    ⛔ GELESEN WIRD AB EINEM BYTE-VERSATZ, NICHT AB EINER ZEILENNUMMER: die Datei
       waechst zwischen zwei Aufrufen, und ein Versatz ueberlebt das.
    ⛔ SCHRUMPFT SIE (der Server hat sie nach 256 KB neu begonnen), wird das
       GEMELDET und von vorn gezaehlt - nicht stillschweigend weitergerechnet.
       Lieber einmal zu viel gezaehlt und es gesagt, als eine Luecke verschwiegen.
    ⚠️ Unlesbare Zeilen werden GEZAEHLT, nicht ignoriert: 'kein Befund' und
       'nicht verstanden' sind zwei verschiedene Dinge."""
    p = pfad_kladde()
    if not os.path.exists(p):
        return 0, "keine"
    try:
        groesse = os.path.getsize(p)
    except OSError:
        return 0, "keine"
    versatz = int(d.get("kladde_gelesen", 0))
    hinweis = ""
    if groesse < versatz:
        hinweis = ("Kladde ist von " + str(versatz) + " auf " + str(groesse)
                   + " Byte geschrumpft - neu begonnen, ab vorn gezaehlt")
        versatz = 0
    try:
        with open(p, "rb") as f:
            f.seek(versatz)
            roh = f.read()
    except OSError:
        return 0, "keine"
    text = roh.decode("utf-8", "replace")
    # Eine angefangene letzte Zeile bleibt liegen, bis sie fertig ist.
    schluss = text.rfind(NL)
    if schluss < 0:
        return 0, ("kladde" + ("; " + hinweis if hinweis else ""))
    verwertet = text[:schluss + 1]
    zuwachs, zeilen, krumm = 0, 0, 0
    for z in verwertet.splitlines():
        z = z.strip()
        if not z or z.startswith("#"):
            continue
        t = z.split()
        if len(t) < 2 or not t[1].isdigit():
            krumm += 1
            continue
        zuwachs += int(t[1])
        zeilen += 1
    d["kladde_gelesen"] = versatz + len(verwertet.encode("utf-8"))
    d["kladde_zeilen"] = int(d.get("kladde_zeilen", 0)) + zeilen
    meldung = "kladde"
    if hinweis:
        meldung += "; " + hinweis
    if krumm:
        meldung += "; " + str(krumm) + " unlesbare Zeile(n) uebersprungen"
    return zuwachs, meldung

def verbuche(d):
    """Verbucht die Kladde in das Kassenbuch: Bytes UND Runden. Gibt den Zweig zurueck
    ("keine" = es gibt keine Kladde, dann bleibt alles, wie es war).

    ⛔⛔ BEFUND 21.09.2026 (N24): die Kladde fuellte nur die BYTES. Die Runden zaehlte
       weiter allein `tick` - `stand` meldete 59 Aufrufe und "Runden 0", und
       `abschluss` verbuchte eine ganze Etappe als ~0 Tokens (Untergrenze). Eine
       Zeile der Kladde IST ein Bruecken-Aufruf, also eine Runde - genau das, was
       `tick` frueher je Aufruf gezaehlt hat.
    ⛔ UND JEDER BEFEHL, DER RECHNET, VERBUCHT VORHER: `aufgabe` und `abschluss`
       lasen bis dahin einen veralteten Stand (nur `tick` und `stand` verbuchten)."""
    vorher = int(d.get("kladde_zeilen", 0))
    zuwachs, wie = verbuche_kladde(d)
    if wie == "keine":
        return wie
    d["bytes"] += zuwachs
    d["runden"] += int(d.get("kladde_zeilen", 0)) - vorher
    d["quelle"] = "kladde"
    return wie

def messe_ausgabe(d):
    """Zaehlt die letzte Bruecken-Ausgabe GENAU EINMAL.

    ⛔ Zweimal zaehlen waere schlimmer als gar nicht zaehlen: der Alarm kaeme
       zu frueh und man lernte, ihn zu ueberhoeren. Deshalb der Fingerabdruck.
    ⚠️ Der Werkzeug-stumme Zweig sagt es AUSDRUECKLICH. 'kein Befund' und
       'nicht gemessen' sind zwei verschiedene Dinge - die Lehre vom 14.09."""
    p = pfad_ausgabe()
    if not os.path.exists(p):
        return 0, "stumm"
    try:
        with open(p, "rb") as fh:
            roh = fh.read()
    except OSError:
        return 0, "stumm"
    finger = hashlib.sha1(roh, usedforsecurity=False).hexdigest()[:16]
    if finger in d["gesehen"]:
        return 0, "schon gezaehlt"
    d["gesehen"].append(finger)
    if len(d["gesehen"]) > 400:
        d["gesehen"] = d["gesehen"][-400:]
    return len(roh), "neu"

# ==================== DER KONTO-TEIL (Bauplan 18.09.2026) ====================
# ES GIBT KEINE ZAHL, GEGEN DIE MAN RECHNEN KOENNTE. Anthropic nennt fuer Pro/Max
#    keine Token-Zahl; die Grenze ist ein Nutzungsbudget, und abfragbar ist sie
#    nicht - sie steht nur als Balken in Einstellungen -> Nutzung.
#    DESHALB KALIBRIERUNG STATT SCHAETZUNG: der Nutzer liest ab, das Werkzeug haelt
#    den eigenen Tokenstand daneben. Zwei Ablesungen ergeben den KURS.
# AUS EINER ABLESUNG FOLGT KEIN KURS - dieselbe Regel wie bei der Etappen-Schaetzung.
#    Das Werkzeug sagt das, statt einen zu erfinden.

def lade_konto():
    p = pfad_konto()
    if not os.path.exists(p):
        return {"konten": {}}
    try:
        with open(p, encoding="utf-8") as f:
            k = json.load(f)
    except (OSError, ValueError):
        return {"konten": {}}
    # An diesem Projekt arbeiten ZWEI Konten (gmail, web.de) am selben
    # Arbeitsbaum. Ein gemeinsamer Kurs waere die gefaehrlichste Sorte Zahl:
    # falsch, aber mit korrekt aussehender Herkunft. Deshalb je Konto ein Fach.
    # Eine Datei aus der Zeit vor der Trennung kommt unter "unbenannt" und wird
    # nie benutzt - sie gehoert keinem bekannten Konto.
    if "kurse" in k and "konten" not in k:
        k = {"konten": {"unbenannt": {"kurse": k.get("kurse", {})}}}
    k.setdefault("konten", {})
    return k

def sichere_konto(k):
    p = pfad_konto()
    os.makedirs(os.path.dirname(p), exist_ok=True)
    roh = json.dumps(k, ensure_ascii=False, indent=1)
    with open(p, "w", encoding="utf-8", newline="") as f:
        f.write(roh + NL)

def kurs_aus_paar(a, b, balken):
    """(kurs, grund) - Prozent je 1000 Tokens, oder (None, Grund warum nicht).

    DREI ZWEIGE SAGEN AUSDRUECKLICH NEIN, statt eine Zahl zu liefern:
    eine einzelne Ablesung - ein gefallener Balken (dazwischen lag ein Reset) -
    zwei Ablesungen zu dicht beieinander (Rauschen, s. MINDEST_TOKENS)."""
    if a is None or b is None:
        return None, "nur EINE Ablesung - aus einer folgt kein Kurs"
    if a.get(balken) is None or b.get(balken) is None:
        return None, "der Balken '" + balken + "' fehlt in einer der beiden Ablesungen"
    dt = int(b["tokens"]) - int(a["tokens"])
    if dt < MINDEST_TOKENS:
        return None, ("die Ablesungen liegen nur " + str(dt) + " Tokens auseinander (Untergrenze "
                      + str(MINDEST_TOKENS) + ") - das waere Rauschen, kein Kurs")
    dp = float(b[balken]) - float(a[balken])
    if dp < 0:
        return None, ("der Balken ist von " + str(a[balken]) + " auf " + str(b[balken])
                      + " % gefallen - dazwischen lag ein Reset, das Paar traegt keinen Kurs")
    if dp < MINDEST_PUNKTE:
        return ((dp + 1.0) / (dt / 1000.0),
                "OBERGRENZE aus 2 Ablesungen: nur " + str(round(dp, 1)) + " Prozentpunkte je " + str(dt)
                + " Tokens - Rundung +-0,5 je Ablesung, gerechnet mit " + str(round(dp + 1.0, 1)) + " Punkten")
    return (dp / (dt / 1000.0),
            "gemessen aus 2 Ablesungen: " + str(round(dp, 1)) + " Prozentpunkte je "
            + str(dt) + " Tokens")

def kurs_fuer(d, balken):
    """(kurs, herkunft) - erst die eigenen Ablesungen DIESES Chats, sonst der
    uebernommene Kurs des Kontos. NIE ohne Herkunft: eine Zahl ohne Herkunft steuert
    hier den Alarm (Nutzer-Entscheid 18.09.: uebernehmen JA, aber mit Datum)."""
    eigene = [a for a in d.get("ablesungen", []) if a.get(balken) is not None]
    if len(eigene) >= 2:
        # WEITESTES PAAR im laufenden Fenster (22.09.): von der letzten Ablesung zurueck, solange
        # der Balken nicht faellt (ein Fall = Reset). Mehr Abstand = weniger Rundungsfehler.
        i = len(eigene) - 1
        while i > 0 and float(eigene[i - 1][balken]) <= float(eigene[i][balken]):
            i -= 1
        k, grund = kurs_aus_paar(eigene[i] if i < len(eigene) - 1 else eigene[-2], eigene[-1], balken)
        if k is not None:
            return k, "aus DIESEM Chat, " + grund
        halt = grund
    else:
        halt = "nur " + str(len(eigene)) + " Ablesung(en) in diesem Chat"
    # EIN UEBERNOMMENER KURS GILT NUR FUER SEIN KONTO. Ist das Konto dieses
    # Chats nicht benannt, wird KEINER uebernommen - lieber kein Kurs als der
    # eines fremden Kontos. Ein vergessenes --konto fuehrt so zu "kein Kurs",
    # nie zu einem falschen.
    name = d.get("konto", "")
    if not name:
        return None, halt + " | kein uebernommener Kurs: das Konto ist nicht benannt (wache.py start --konto <name>)"
    alt = lade_konto()["konten"].get(name, {}).get("kurse", {}).get(balken)
    if alt:
        return (float(alt["prozent_je_1000"]),
                "UEBERNOMMEN von Konto '" + name + "', gemessen am " + str(alt.get("datum", "?"))
                + " (Chat vom " + str(alt.get("chat", "?")) + ") - hier selbst nicht messbar: " + halt)
    return None, halt + " | Konto '" + name + "' hat fuer '" + balken + "' noch keinen Kurs"

def konto_urteil(d, balken):
    """(alarm, zeile) fuer EINEN Balken; (None, zeile), wenn nichts zu rechnen ist.

    Die Regel ist die Schwester der Kontext-Regel:
       Stand jetzt + (Rest der Aufgabe + Reserve) x Kurs > 100 %  ->  ALARM
    Es gewinnt, was zuerst anschlaegt - Kontext oder Kontogrenze."""
    ab = [a for a in d.get("ablesungen", []) if a.get(balken) is not None]
    if not ab:
        return None, balken + ": keine Ablesung - NICHT gerechnet"
    letzte = ab[-1]
    kurs, herkunft = kurs_fuer(d, balken)
    if kurs is None:
        return None, (balken + ": " + str(letzte[balken]) + " % abgelesen um "
                      + str(letzte.get("zeit", "?")) + ", aber KEIN Kurs - " + herkunft)
    seither = tokens(d) - int(letzte["tokens"])
    stand = float(letzte[balken]) + seither / 1000.0 * kurs
    bedarf = (rest_der_aufgabe(d) + d["reserve"]) / 1000.0 * kurs
    zeile = (balken + ": ~" + str(round(stand, 1)) + " % jetzt + " + str(round(bedarf, 1))
             + " % fuer Rest der Aufgabe und Uebergabe = " + str(round(stand + bedarf, 1))
             + " % von 100 | Kurs " + str(round(kurs, 2)) + " % je 1000 Tokens (" + herkunft + ")")
    r = letzte.get("reset_" + balken)
    if r:
        zeile += " | Reset " + str(r)
    if herkunft.startswith("UEBERNOMMEN"):
        # NUR HINWEIS (22.09., Nutzer-Entscheid 21.09. „mache alles"): ein fremder Kurs war am 21.09.
        # fuenfmal zu hoch. Er warnt, loest aber KEINEN Alarm aus - das tut erst ein eigener Kurs.
        return False, ("HINWEIS" + (" (wuerde anschlagen)" if (stand + bedarf) > 100.0 else "")
                       + " - " + zeile + " | zweite Ablesung nach >= 3 Punkten entscheidet")
    return (stand + bedarf) > 100.0, zeile

def konto_rat(d, schlaegt):
    """EIN NEUER CHAT HILFT HIER NICHT - der Topf ist geteilt (Nutzer-Entscheid 18.09.).
    Deshalb ein EIGENER Wortlaut, nicht der des Kontext-Alarms."""
    z = ["[wache] ⛔ KONTOGRENZE: " + " und ".join(schlaegt)
         + " reicht nicht fuer das, was noch kommt.",
         "[wache] Erst sichern - dann die Aufgabe TEILEN oder auf nach dem Reset verschieben.",
         ("[wache] ⛔ Ein neuer Chat bringt hier NICHTS: claude.ai, Claude Code und die Apps"
         " zaehlen auf dieselbe Grenze.")]
    resets = []
    for b in schlaegt:
        mit = [a for a in d.get("ablesungen", []) if a.get("reset_" + b)]
        if mit:
            resets.append(b + " " + str(mit[-1]["reset_" + b]))
    if resets:
        z.append("[wache] Reset laut letzter Ablesung: " + ", ".join(resets))
    return z

def konto_alarme(d):
    return [b for b in ("sitzung", "woche") if konto_urteil(d, b)[0]]

def bericht_konto(d):
    print("== KONTO '" + (d.get("konto") or "NICHT BENANNT") + "' (Ablesungen des Nutzers, kalibriert) ==")
    if not d.get("konto"):
        print("  ohne Kontonamen wird KEIN Kurs uebernommen - 'wache.py start --konto <name>'"
              " oder 'wache.py konto --konto <name> ...'")
    if not d.get("ablesungen"):
        print("  keine Ablesung verbucht - Einstellungen -> Nutzung ablesen und verbuchen:")
        print("    python3 tools/wache.py konto --sitzung <prozent> --woche <prozent>")
    for b in ("sitzung", "woche"):
        print("  " + konto_urteil(d, b)[1])
    for zeile in GRENZEN:
        print(zeile)
    schlaegt = konto_alarme(d)
    if schlaegt:
        for zeile in konto_rat(d, schlaegt):
            print(zeile)
    return 0

def befehl_konto(args):
    """Verbucht eine ABLESUNG des Nutzers mit dem eigenen Tokenstand zum selben
    Zeitpunkt - ohne Argumente zeigt es nur den Befund."""
    d = lade()
    if d is None:
        print("[wache] Kein Kassenbuch. 'python3 tools/wache.py start' beginnt eines.")
        return 1
    if getattr(args, "konto", ""):
        d["konto"] = args.konto.strip()
        sichere(d)
        print("[wache] Konto dieses Chats: '" + d["konto"] + "'")
    if args.sitzung is None and args.woche is None:
        return bericht_konto(d)
    eintrag = {"zeit": time.strftime("%Y-%m-%d %H:%M"), "tokens": tokens(d)}
    for name, wert in (("sitzung", args.sitzung), ("woche", args.woche)):
        if wert is not None:
            eintrag[name] = float(wert)
    if args.reset_sitzung:
        eintrag["reset_sitzung"] = args.reset_sitzung
    if args.reset_woche:
        eintrag["reset_woche"] = args.reset_woche
    d["ablesungen"].append(eintrag)
    d["konto_alarm_gemeldet"] = False
    sichere(d)
    print("[wache] Ablesung verbucht bei ~" + str(eintrag["tokens"]) + " eigenen Tokens: "
          + ", ".join(b + " " + str(eintrag[b]) + " %" for b in ("sitzung", "woche") if b in eintrag))
    k = lade_konto()
    geschrieben = False
    for b in ("sitzung", "woche"):
        eigene = [a for a in d["ablesungen"] if a.get(b) is not None]
        if len(eigene) < 2:
            print("[wache] " + b + ": noch KEIN Kurs - aus EINER Ablesung folgt keiner.")
            continue
        kurs, grund = kurs_aus_paar(eigene[-2], eigene[-1], b)
        if kurs is None:
            print("[wache] " + b + ": KEIN Kurs - " + grund)
            continue
        if not d.get("konto"):
            print("[wache] " + b + ": Kurs " + str(round(kurs, 2)) + " % je 1000 Tokens - "
                  + grund + " | NICHT gespeichert: das Konto ist nicht benannt.")
            continue
        fach = k["konten"].setdefault(d["konto"], {}).setdefault("kurse", {})
        fach[b] = {"prozent_je_1000": round(kurs, 4), "datum": eintrag["zeit"],
                   "chat": d.get("begonnen", "?"), "grund": grund}
        geschrieben = True
        print("[wache] " + b + ": Kurs " + str(round(kurs, 2)) + " % je 1000 Tokens - " + grund)
    if geschrieben:
        sichere_konto(k)
    return bericht_konto(d)

def befehl_tick(args):
    d = lade()
    if d is None:
        d = leer()
        d["neu_angelegt"] = True
    # ►►► DIE KLADDE IST DER MESSPUNKT, `tick` NUR NOCH DER MELDER (21.09.2026).
    #     Sie enthaelt JEDEN Aufruf, auch die, bei denen `tick` nicht lief.
    # ⛔ NUR EINE QUELLE ZAEHLT. Liefen beide, wuerde dieselbe Ausgabe zweimal
    #    gezaehlt - der Alarm kaeme zu frueh und man lernte, ihn zu ueberhoeren.
    wie = verbuche(d)
    if wie == "keine":
        # Ausweichweg ohne Kladde: dann zaehlt `tick` selbst - eine Runde je Aufruf.
        zuwachs, wie = messe_ausgabe(d)
        d["quelle"] = "letzte_ausgabe"
        d["bytes"] += zuwachs
        d["runden"] += 1
    if args.notiz:
        d["notizen"].append(args.notiz)
    alarm, zeile = urteil(d)
    sichere(d)
    if wie == "stumm":
        print("[wache] STUMM: " + pfad_ausgabe() + " fehlt - es wird gerade NICHTS gemessen.")
        return 0
    # ⚠️ EIN AUSWEICHWEG, DER SICH NICHT MELDET, WIRD FUER DEN NORMALFALL GEHALTEN.
    #    Ohne Kladde zaehlt die Wache wieder nur, was `tick` zufaellig sieht -
    #    genau der Zustand, den die Kladde abschafft. Einmal je Chat sagen.
    if d["quelle"] == "letzte_ausgabe" and not d.get("kladde_gemeldet"):
        d["kladde_gemeldet"] = True
        sichere(d)
        print("[wache] KEINE KLADDE (" + pfad_kladde() + ") - gezaehlt wird nur,"
              " was 'tick' zufaellig sieht. Die Zahl ist eine UNTERGRENZE.")
        print("[wache] Grund ist meist ein Bruecken-Server ohne Kladde:"
              " 'bash tools/training-shell/einspielen.sh', danach App neu starten.")
    if alarm and not d["alarm_gemeldet"]:
        d["alarm_gemeldet"] = True
        sichere(d)
        print("[wache] ⛔ WECHSELN: " + zeile)
        print("[wache] Der Rest reicht nicht mehr fuer die Aufgabe UND die Uebergabe."
              " Jetzt sichern, dann neuen Chat.")
        return 0
    # ES GEWINNT, WAS ZUERST ANSCHLAEGT - Kontext oder Kontogrenze.
    schlaegt = konto_alarme(d)
    if schlaegt and not d["konto_alarm_gemeldet"]:
        d["konto_alarm_gemeldet"] = True
        sichere(d)
        for b in schlaegt:
            print("[wache] " + konto_urteil(d, b)[1])
        for z in GRENZEN:
            print(z)
        for z in konto_rat(d, schlaegt):
            print(z)
        return 0
    # EINMAL JE CHAT erinnern (Nutzer-Entscheid 18.09.) - ohne Ablesung ist die
    # Konto-Rechnung tot, und tick schweigt sonst so gruendlich, dass sie schlicht
    # vergessen wuerde. Danach schweigt es wieder.
    if not d["ablesungen"] and not d["konto_erinnert"]:
        d["konto_erinnert"] = True
        sichere(d)
        print("[wache] Keine Konto-Ablesung. Einstellungen -> Nutzung ablesen und verbuchen:")
        print("[wache]   python3 tools/wache.py konto --sitzung <prozent> --woche <prozent>"
              " [--reset-sitzung \"<zeit>\"] [--reset-woche \"<zeit>\"]")
        if not d["konto"]:
            print("[wache]   ...und --konto <name> mitgeben (zwei Konten am selben Arbeitsbaum),"
                  " sonst wird kein Kurs uebernommen oder gespeichert.")
        print("[wache] (einmalige Erinnerung - danach schweigt tick wieder)")
        return 0
    if args.laut:
        print("[wache] " + zeile)
    return 0

def befehl_stand(args):
    d = lade()
    if d is None:
        print("[wache] Kein Kassenbuch. 'python3 tools/wache.py start' beginnt eines.")
        return 1
    if verbuche(d) != "keine":
        sichere(d)
    alarm, zeile = urteil(d)
    print("== KASSENBUCH " + d["begonnen"] + " ==")
    print("  Runden                " + str(d["runden"]))
    print("  gemessene Bytes       " + str(d["bytes"]) + " (Bruecken-Ausgaben)")
    if d.get("quelle") == "kladde":
        print("  Quelle                Kladde, " + str(d.get("kladde_zeilen", 0))
              + " Aufruf(e) verbucht - VOLLSTAENDIG, unabhaengig von 'tick'")
    else:
        print("  Quelle                letzte_ausgabe.txt - nur was 'tick' sah:"
              " die Zahl ist eine UNTERGRENZE (keine Kladde)")
    print("  daraus Tokens         ~" + str(round(d["bytes"] / float(d["faktor"]))) +
          "  bei Faktor " + str(d["faktor"]) + " Byte/Token (GESCHAETZT)")
    print("  Zuschlag je Runde     " + str(d["runden"] * d["je_runde"]) +
          "  (" + str(d["je_runde"]) + " je Runde, GESCHAETZT - eigener Text, Nachdenken, Nutzer)")
    print("  zusammen              ~" + str(tokens(d)) + " von " + str(d["budget"]))
    print("  laufende Aufgabe      " + (d.get("aufgabe") or "-") +
          "  (Schaetzung " + str(d.get("schaetzung", 0)) + ", Rest ~" + str(rest_der_aufgabe(d)) + ")")
    print("  Urteil                " + ("⛔ WECHSELN" if alarm else "weiterarbeiten") + " - " + zeile)
    print("  ⚠️ NICHT gemessen: eigener Text, Nachdenken, Systemtext, Nutzernachrichten,")
    print("     Ausgaben anderer Werkzeuge. Dafuer steht allein der Zuschlag je Runde.")
    bericht_konto(d)
    return 0

def lade_historie():
    p = pfad_historie()
    if not os.path.exists(p):
        return {"etappen": []}
    try:
        with open(p, encoding="utf-8") as f:
            return json.load(f)
    except (OSError, ValueError):
        return {"etappen": []}

def befehl_aufgabe(args):
    """Setzt die laufende Aufgabe und ihre Schaetzung.

    ⚠️ Die Schaetzung kommt aus GEMESSENEN Vorgaengern, wenn es welche gibt -
       sonst sagt sie ausdruecklich, dass sie geraten ist. Eine Zahl ohne
       Herkunft waere hier das Gefaehrlichste: sie steuert den Alarm."""
    d = lade() or leer()
    verbuche(d)   # sonst beginnt das Messfenster an einem veralteten Stand
    h = lade_historie()
    # ⛔ EINE ETAPPE, DEREN KASSENBUCH ERST MITTENDRIN BEGANN, IST EINE UNTERGRENZE -
    #    KEINE KOSTEN. Waere sie hier dabei, zoege sie jede kuenftige Schaetzung zu
    #    niedrig, und der Alarm kaeme zu spaet. Belegt am eigenen ersten Eintrag (18.09.).
    gueltig = [e for e in h.get("etappen", []) if not e.get("unvollstaendig")]
    frueher = [e for e in gueltig if e.get("art") == args.art] if args.art else []
    art_text = "der Art '" + str(args.art) + "'"
    # UNTERARTEN (22.09., BUILD_LOG 26 Nachtrag 5): 'etappe/umbau', 'etappe/waechter', ... - eine
    # 'etappe' streute 19k..157k. Gibt es von der Unterart < 2 Messungen, zaehlt die Oberart
    # (alles vor dem '/') - und die Zeile SAGT es.
    if args.art and "/" in args.art and len(frueher) < 2:
        ober = args.art.split("/")[0]
        frueher = [e for e in gueltig if (e.get("art") or "").split("/")[0] == ober]
        art_text = "der OBERART '" + ober + "' (von '" + args.art + "' zu wenige)"
    if args.schaetzung:
        wert, woher = int(args.schaetzung), "vom Nutzer gesetzt"
    elif frueher:
        werte = sorted(int(e.get("tokens", 0)) for e in frueher)
        wert = werte[len(werte) // 2]
        woher = ("Median aus " + str(len(werte)) + " gemessenen Etappen " + art_text
                 + ", Spanne " + str(werte[0]) + ".." + str(werte[-1]))
    else:
        wert, woher = 0, "KEINE Grundlage - Historie leer, Schaetzung 0 (der Alarm rechnet dann ohne sie)"
    d["aufgabe"] = args.name
    d["art"] = args.art or ""
    d["schaetzung"] = wert
    d["verbraucht_bei_start"] = tokens(d)
    d["runden_bei_start"] = d["runden"]
    d["alarm_gemeldet"] = False
    sichere(d)
    print("[wache] Aufgabe '" + args.name + "', Schaetzung " + str(wert) + " Tokens - " + woher)
    alarm, zeile = urteil(d)
    if alarm:
        print("[wache] ⛔ SCHON JETZT ZU KNAPP: " + zeile)
        print("[wache] Diese Aufgabe im NEUEN Chat beginnen, hier nur noch sichern.")
    return 0

def befehl_abschluss(args):
    """Schreibt die gemessenen Kosten einer Etappe in die Historie.

    ⛔ Die Historie liegt unter tools/ und NICHT im Wurzelordner: eine .json
       dort geht an den Lerner (.assetsignore schliesst *.json nicht aus,
       tools/** dagegen schon). Belegt am 06.09.2026."""
    d = lade()
    if d is None:
        print("[wache] Kein Kassenbuch - nichts abzuschliessen.")
        return 1
    verbuche(d)   # sonst endet das Messfenster an einem veralteten Stand
    kosten = tokens(d) - d.get("verbraucht_bei_start", 0)
    # EIN ABSCHLUSS OHNE GEMESSENE RUNDEN IST KEINE MESSUNG, SONDERN EINE ZAHL.
    # Belegt am 18.09.2026 am eigenen Werkzeug: 'tick' lief bei 4 von rund 30
    # Aufrufen mit, und 'abschluss' schrieb trotzdem einen Wert in die Historie -
    # denselben wie die Etappe davor, weil sich zwischendurch nichts bewegt hatte.
    # Aus so einem Wert leitet die naechste Schaetzung ihren Alarm ab.
    # Ab hier gilt: unter zwei gemessenen Runden ist der Wert eine UNTERGRENZE.
    runden_dazu = d["runden"] - d.get("runden_bei_start", 0)
    zu_duenn = ""
    # EIN MESSFENSTER, DAS NICHT ZUR AUFGABE GEHOERT, MISST ETWAS ANDERES.
    # Belegt 18.09.2026, zweiter Fall am selben Tag und in die ANDERE Richtung:
    # ohne passendes 'aufgabe' steht verbraucht_bei_start auf 0, und 'abschluss'
    # verbucht den Verbrauch des GANZEN CHATS als Kosten EINER Aufgabe (15973
    # statt der echten). Die Runden-Pruefung merkte nichts - sie fragt, OB
    # gemessen wurde, nicht WORUEBER. Genau die Lehre "eine Messung gilt fuer
    # das Gemessene", diesmal am eigenen Werkzeug.
    if (d.get("aufgabe") or "") != args.name:
        zu_duenn = ("kein passendes 'aufgabe' gesetzt (laufend: "
                    + repr(d.get("aufgabe") or "-") + ") - gemessen wurde nicht diese Aufgabe")
    elif runden_dazu < 2:
        zu_duenn = "nur " + str(runden_dazu) + " gemessene Runde(n) seit dem Setzen der Aufgabe"
    elif kosten <= 0:
        zu_duenn = "gemessene Kosten " + str(kosten) + " - da hat nichts gezaehlt"
    h = lade_historie()
    h.setdefault("etappen", []).append({
        "name": args.name, "art": args.art or d.get("art", ""), "datum": time.strftime("%Y-%m-%d"),
        "tokens": kosten, "bytes": d["bytes"], "runden": d["runden"],
        "unvollstaendig": bool(args.unvollstaendig) or bool(zu_duenn),
        "grund": zu_duenn or None,
        "runden_dazu": runden_dazu,
        "faktor": d["faktor"], "je_runde": d["je_runde"],
    })
    p = pfad_historie()
    with open(p, "w", encoding="utf-8", newline="") as f:
        f.write(json.dumps(h, ensure_ascii=False, indent=1) + NL)
    d["aufgabe"] = ""
    sichere(d)
    print("[wache] '" + args.name + "' mit ~" + str(kosten) + " Tokens in die Historie geschrieben ("
          + str(len(h["etappen"])) + " Etappen).")
    if zu_duenn:
        print("[wache] ALS UNTERGRENZE VERBUCHT, NICHT ALS KOSTEN: " + zu_duenn + ".")
        if d.get("quelle") == "kladde":
            print("[wache] Kuenftige Schaetzungen lassen sie deshalb AUSSEN VOR."
                  " Gemessen wurde ueber die Kladde - der Grund steht oben.")
        else:
            print("[wache] Kuenftige Schaetzungen lassen sie deshalb AUSSEN VOR."
                  " Ohne Kladde zaehlt nur 'tick': 'bash tools/training-shell/einspielen.sh',"
                  " danach App neu starten.")
    return 0

def befehl_start(args):
    d = leer()
    if args.budget:
        d["budget"] = int(args.budget)
    if args.faktor:
        d["faktor"] = float(args.faktor)
    if args.je_runde:
        d["je_runde"] = int(args.je_runde)
    if args.reserve:
        d["reserve"] = int(args.reserve)
    if args.konto:
        d["konto"] = args.konto.strip()
    # ⛔ EIN NEUES KASSENBUCH BEGINNT AM HEUTIGEN ENDE DER KLADDE, nicht an ihrem Anfang:
    #    sie waechst ueber Chats hinweg (bis 256 KB). Ab 0 gelesen, stuende ein neuer
    #    Chat sofort mit dem Verbrauch aller vorigen im Buch - ein Fehlalarm ab Zeile 1.
    try:
        d["kladde_gelesen"] = os.path.getsize(pfad_kladde())
    except OSError:
        d["kladde_gelesen"] = 0
    sichere(d)
    print("[wache] Kassenbuch angelegt. Budget " + str(d["budget"]) + " Tokens, Faktor "
          + str(d["faktor"]) + " Byte/Token, Zuschlag " + str(d["je_runde"]) + " je Runde, Reserve "
          + str(d["reserve"]) + " fuer die Uebergabe.")
    if d["konto"]:
        print("[wache] Konto dieses Chats: '" + d["konto"] + "'.")
    else:
        print("[wache] KONTO NICHT BENANNT - es wird kein Kurs uebernommen und keiner gespeichert."
              " Mit '--konto <name>' starten (an diesem Projekt arbeiten zwei Konten).")
    return 0

def befehl_selbsttest(args):
    """GEGENPROBE MIT BEKANNTER ANTWORT - vor dem ersten Urteil.

    ⛔ Ein Messwerkzeug, das am ersten Tag gebaut wird, ist am ersten Tag noch
       nicht geprueft (docs/archiv/LEHREN.md). Hier sind alle Zahlen von Hand nachgerechnet:
       3600 Byte / 3.6 = 1000 Tokens. Wer den Kopf aendert, faehrt das hier."""
    import tempfile
    fehler = []
    zaehler = [0]   # Die Zahl im Urteil wird GEZAEHLT, nicht abgetippt - eine abgetippte
                    # Zahl driftet und niemand merkt es (check.sh 4e11 liest sie aus).
    def pruefe(was, ist, soll):
        zaehler[0] += 1
        if ist != soll:
            fehler.append(was + ": ist " + str(ist) + ", soll " + str(soll))
            print("  [FEHLER] " + was + ": ist " + str(ist) + ", soll " + str(soll))
        else:
            print("  [ok] " + was + " = " + str(ist))

    with tempfile.TemporaryDirectory() as t:
        aus = os.path.join(t, "ausgabe.txt")
        os.environ["WACHE_AUSGABE"] = aus
        os.environ["WACHE_BUCH"] = os.path.join(t, "buch.json")
        os.environ["WACHE_HISTORIE"] = os.path.join(t, "hist.json")
        os.environ["WACHE_KONTO"] = os.path.join(t, "konto.json")
        # ⛔ OHNE DIESE ZEILE LAESE DER SELBSTTEST DIE ECHTE KLADDE DES CHATS -
        #    er wuerde also das Projekt messen statt sich selbst.
        os.environ["WACHE_KLADDE"] = os.path.join(t, "kladde.log")

        print("1) Werkzeug-stumm: die Ausgabedatei fehlt")
        d = leer(); d["je_runde"] = 0
        zuwachs, wie = messe_ausgabe(d)
        pruefe("Zuwachs ohne Datei", zuwachs, 0)
        pruefe("Zweig", wie, "stumm")

        print("2) 3600 Byte bei Faktor 3.6 sind 1000 Tokens")
        with open(aus, "wb") as fh:
            fh.write(b"x" * 3600)
        zuwachs, wie = messe_ausgabe(d)
        d["bytes"] += zuwachs; d["runden"] += 1
        pruefe("gezaehlte Bytes", zuwachs, 3600)
        pruefe("Tokens ohne Zuschlag", tokens(d), 1000)

        print("3) Dieselbe Ausgabe wird NICHT zweimal gezaehlt")
        zuwachs, wie = messe_ausgabe(d)
        d["bytes"] += zuwachs; d["runden"] += 1
        pruefe("Zuwachs beim zweiten Mal", zuwachs, 0)
        pruefe("Zweig", wie, "schon gezaehlt")

        print("4) Der Zuschlag je Runde steht wirklich drin: 2 Runden x 900")
        d["je_runde"] = 900
        pruefe("Tokens mit Zuschlag", tokens(d), 1000 + 1800)

        print("5) Die Entscheidungsregel schlaegt an, wenn der Rest nicht reicht")
        e = leer(); e["budget"] = 10000; e["reserve"] = 2000; e["je_runde"] = 0
        e["faktor"] = 1.0; e["bytes"] = 4000
        e["schaetzung"] = 5000; e["verbraucht_bei_start"] = 4000
        alarm, _ = urteil(e)
        pruefe("4000 + 2000 + 5000 > 10000 -> Alarm", alarm, True)

        print("6) NULLPROBE: passt es, schweigt sie")
        e["schaetzung"] = 3000
        alarm, _ = urteil(e)
        pruefe("4000 + 2000 + 3000 = 9000 -> kein Alarm", alarm, False)

        print("7) Der Rest schrumpft, waehrend die Aufgabe laeuft")
        e["bytes"] = 5500
        pruefe("Rest von 3000 nach 1500 verbrauchten", rest_der_aufgabe(e), 1500)

        print("8) Eine unvollstaendige Etappe zaehlt bei der Schaetzung NICHT mit")
        # ⛔ DREI EINTRAEGE, NICHT ZWEI. Die erste Fassung nahm zwei - und blieb auch
        #    OHNE den Filter gruen, weil der Mittelwert von zweien ohnehin den oberen
        #    Wert zieht. Sie haette nie etwas gemessen; die Sabotage hat es gezeigt.
        #    ►► Mit zwei Untergrenzen kippt der Mittelwert ohne Filter auf 200.
        import json as _json
        with open(os.environ["WACHE_HISTORIE"], "w", encoding="utf-8") as fh:
            _json.dump({"etappen": [
                {"name": "zu niedrig A", "art": "etappe", "tokens": 100, "unvollstaendig": True},
                {"name": "zu niedrig B", "art": "etappe", "tokens": 200, "unvollstaendig": True},
                {"name": "echt", "art": "etappe", "tokens": 50000},
            ]}, fh)
        class A: pass
        z = A(); z.name = "Probe"; z.art = "etappe"; z.schaetzung = None
        with open(os.devnull, "w") as nichts, contextlib.redirect_stdout(nichts):
            befehl_aufgabe(z)
        pruefe("Schaetzung nimmt nur die vollstaendige", lade()["schaetzung"], 50000)

        print("9) Der Bericht laeuft durch, ohne an einem Sonderzeichen zu brechen")
        # ⛔ NICHT in einen Speicherstrom drucken - der kennt cp1252 gar nicht und
        #    waere immer gruen. Hier steht ein ECHTER cp1252-Strom wie unter Windows.
        d2 = leer(); sichere(d2)
        import io as _io
        roh = _io.BytesIO()
        eng = _io.TextIOWrapper(roh, encoding="cp1252", errors="strict")
        halt = sys.stdout
        sys.stdout = eng
        try:
            stelle_ausgabe_um()
            befehl_stand(None)
            eng.flush()
            text = roh.getvalue().decode("utf-8", "replace")
            kaputt = ""
        except Exception as ex:   # noqa: BLE001 - Probe: JEDER Absturz des Berichts ist der Befund, sein Name die Meldung
            text = ""
            kaputt = type(ex).__name__
        finally:
            sys.stdout = halt
        pruefe("Bericht ohne Absturz", kaputt, "")
        pruefe("Bericht nennt die Grenze der Messung", "NICHT gemessen" in text, True)

        # ====== DER KONTO-TEIL: alle Zahlen von Hand nachgerechnet ======
        def ab(tok, **kw):
            e = {"zeit": "probe", "tokens": tok}
            e.update(kw)
            return e

        print("10) ZWEI Ablesungen ergeben den Kurs: 10 Prozentpunkte je 10000 Tokens")
        a1, a2 = ab(10000, sitzung=20.0), ab(20000, sitzung=30.0)
        k10, g10 = kurs_aus_paar(a1, a2, "sitzung")
        pruefe("Kurs = 1.0 % je 1000 Tokens", round(k10, 4), 1.0)
        pruefe("Grund nennt die Herkunft", "2 Ablesungen" in g10, True)

        print("11) EINE Ablesung ergibt KEINEN Kurs")
        d11 = leer(); d11["ablesungen"] = [a1]
        k11, h11 = kurs_fuer(d11, "sitzung")
        pruefe("kein Kurs aus einer Ablesung", k11, None)
        pruefe("und er sagt es", "nur 1 Ablesung" in h11, True)

        print("12) Ein GEFALLENER Balken traegt keinen Kurs (dazwischen lag ein Reset)")
        k12, g12 = kurs_aus_paar(ab(10000, woche=80.0), ab(20000, woche=5.0), "woche")
        pruefe("kein Kurs nach Reset", k12, None)
        pruefe("und er nennt den Reset", "Reset" in g12, True)

        print("13) Zwei Ablesungen ZU DICHT sind Rauschen, kein Kurs (1000 < 2000)")
        k13, g13 = kurs_aus_paar(ab(10000, woche=70.0), ab(11000, woche=71.0), "woche")
        pruefe("kein Kurs unter dem Mindestabstand", k13, None)
        pruefe("und er nennt die Untergrenze", str(MINDEST_TOKENS) in g13, True)

        print("14) Die Konto-Regel schlaegt an: 80 % + (20000+5000) x 1.0/1000 = 105 > 100")
        # Kassenbuch so gestellt, dass tokens(d) GENAU 10000 ist: 10000 Byte bei Faktor 1.0
        # und Zuschlag 0 je Runde. Rest der Aufgabe 20000, Reserve 5000. Kurs aus den
        # zwei Ablesungen: 10 Prozentpunkte je 10000 Tokens = 1.0 % je 1000.
        d14 = leer(); d14["faktor"] = 1.0; d14["je_runde"] = 0; d14["bytes"] = 10000
        d14["budget"] = 999999; d14["reserve"] = 5000
        d14["schaetzung"] = 20000; d14["verbraucht_bei_start"] = 10000
        d14["ablesungen"] = [ab(0, woche=70.0), ab(10000, woche=80.0, reset_woche="So 09:00")]
        pruefe("eigener Tokenstand ist wirklich 10000", tokens(d14), 10000)
        alarm14, zeile14 = konto_urteil(d14, "woche")
        pruefe("Kontogrenze schlaegt an", alarm14, True)
        pruefe("die Zeile nennt den Reset", "So 09:00" in zeile14, True)

        print("15) NULLPROBE: mit 10000 statt 20000 Rest sind es 95 % - kein Alarm")
        d14["schaetzung"] = 10000
        pruefe("kein Alarm bei 95 %", konto_urteil(d14, "woche")[0], False)

        print("16) ES GEWINNT, WAS ZUERST ANSCHLAEGT: Kontext still, Konto laut")
        d14["schaetzung"] = 20000
        pruefe("Kontext-Regel schweigt (Budget 999999)", urteil(d14)[0], False)
        pruefe("Konto-Regel schlaegt an", konto_alarme(d14), ["woche"])

        print("17) Der Konto-Bericht laeuft unter cp1252 durch und nennt die drei Grenzen")
        # Wie Probe 9 ein ECHTER cp1252-Strom: die Warnzeichen in GRENZEN und im Rat
        # sind genau die Stelle, an der stand am 18.09. schon einmal abbrach.
        roh17 = _io.BytesIO()
        eng17 = _io.TextIOWrapper(roh17, encoding="cp1252", errors="strict")
        halt17 = sys.stdout
        sys.stdout = eng17
        try:
            stelle_ausgabe_um()
            bericht_konto(d14)
            eng17.flush()
            text17 = roh17.getvalue().decode("utf-8", "replace")
            kaputt17 = ""
        except Exception as ex17:   # noqa: BLE001 - Probe: jeder Absturz ist der Befund
            text17 = ""
            kaputt17 = type(ex17).__name__
        finally:
            sys.stdout = halt17
        pruefe("Konto-Bericht ohne Absturz", kaputt17, "")
        pruefe("Grenze 1: andere Chats", "ANDERE CHATS" in text17, True)
        pruefe("Grenze 2: aehnliches Tempo", "AEHNLICHEM TEMPO" in text17, True)
        pruefe("Grenze 3: Momentaufnahme", "MOMENTAUFNAHME" in text17, True)
        pruefe("Rat: Aufgabe TEILEN", "TEILEN" in text17, True)
        pruefe("Rat: ein neuer Chat bringt nichts", "neuer Chat bringt hier NICHTS" in text17, True)

        print("18) Ein UEBERNOMMENER Kurs wird benutzt - aber nur fuer SEIN Konto")
        def kontodatei(inhalt):
            with open(os.environ["WACHE_KONTO"], "w", encoding="utf-8") as fk:
                fk.write(json.dumps(inhalt))
        kontodatei({"konten": {
            "gmail":  {"kurse": {"woche": {"prozent_je_1000": 2.5,
                       "datum": "2026-09-18 11:00", "chat": "2026-09-18 09:30"}}},
            "web.de": {"kurse": {"sitzung": {"prozent_je_1000": 7.0,
                       "datum": "2026-09-17 20:00", "chat": "2026-09-17 19:00"}}}}})
        d18 = leer(); d18["ablesungen"] = [ab(10000, woche=40.0)]; d18["konto"] = "gmail"
        k18, h18 = kurs_fuer(d18, "woche")
        pruefe("uebernommener Kurs wird benutzt", k18, 2.5)
        pruefe("Herkunft ist gekennzeichnet", "UEBERNOMMEN" in h18, True)
        pruefe("Herkunft nennt das Konto", "'gmail'" in h18, True)
        pruefe("Herkunft nennt das Datum", "2026-09-18 11:00" in h18, True)

        print("20) DER KURS EINES KONTOS GILT NICHT FUER DAS ANDERE")
        # Der eigentliche Zweck der Trennung: web.de hat keinen Wochen-Kurs,
        # obwohl gmail einen hat. Es darf KEINE Zahl herauskommen.
        d20 = leer(); d20["ablesungen"] = [ab(10000, woche=40.0)]; d20["konto"] = "web.de"
        k20, h20 = kurs_fuer(d20, "woche")
        pruefe("kein fremder Kurs", k20, None)
        pruefe("und es sagt warum", "noch keinen Kurs" in h20, True)
        pruefe("das eigene Fach wird aber gefunden", kurs_fuer(d20, "sitzung")[0], 7.0)

        print("21) OHNE Kontonamen wird gar kein Kurs uebernommen")
        d21 = leer(); d21["ablesungen"] = [ab(10000, woche=40.0)]
        k21, h21 = kurs_fuer(d21, "woche")
        pruefe("kein Kurs ohne Kontonamen", k21, None)
        pruefe("und es sagt warum", "nicht benannt" in h21, True)

        print("22) Eine Kontodatei aus der Zeit VOR der Trennung wird nie benutzt")
        kontodatei({"kurse": {"woche": {"prozent_je_1000": 9.9, "datum": "alt"}}})
        d22 = leer(); d22["ablesungen"] = [ab(10000, woche=40.0)]; d22["konto"] = "gmail"
        pruefe("alter Kurs gilt fuer kein benanntes Konto", kurs_fuer(d22, "woche")[0], None)
        pruefe("er liegt unter 'unbenannt'", "unbenannt" in lade_konto()["konten"], True)

        print("23) OHNE KONTODATEI stuerzt nichts ab - der Zweig war nie gefahren")
        # Alle bisherigen Proben legten erst eine Kontodatei an. Der erste Lauf
        # eines frischen Chats hat aber keine - und genau dort stand bis zum
        # 18.09.2026 noch die alte Form {"kurse": ...} statt {"konten": ...}.
        # Ein Werkzeug, das in einen Ordner schreibt, den es liest, wird zweimal
        # gefahren (docs/archiv/LEHREN.md) - hier: einmal ohne, einmal mit Datei.
        os.remove(os.environ["WACHE_KONTO"])
        d23 = leer(); d23["konto"] = "gmail"; d23["ablesungen"] = [ab(10000, woche=40.0)]
        pruefe("kein Kurs, aber auch kein Absturz", kurs_fuer(d23, "woche")[0], None)
        pruefe("Bericht laeuft durch", bericht_konto(d23), 0)

        print("25) Ein Abschluss OHNE gemessene Runden ist eine Untergrenze, keine Kosten")
        os.environ["WACHE_HISTORIE"] = os.path.join(t, "hist25.json")
        d25 = leer(); d25["faktor"] = 1.0; d25["je_runde"] = 0; d25["bytes"] = 5000
        d25["runden"] = 7; d25["verbraucht_bei_start"] = 0; d25["runden_bei_start"] = 7
        # Die Aufgabe MUSS passen, sonst prueft diese Probe die Fenster-Regel statt
        # der Runden-Regel - zwei Zweige in einer Probe messen keinen von beiden.
        d25["aufgabe"] = "ohne Runden"
        sichere(d25)
        class B: pass
        y = B(); y.name = "ohne Runden"; y.art = "werkzeug"; y.unvollstaendig = False
        with open(os.devnull, "w", encoding="utf-8", errors="replace") as nichts, contextlib.redirect_stdout(nichts):
            befehl_abschluss(y)
        letzter = lade_historie()["etappen"][-1]
        pruefe("als unvollstaendig verbucht", letzter["unvollstaendig"], True)
        pruefe("mit genanntem Grund", "gemessene Runde" in (letzter.get("grund") or ""), True)
        y2 = B(); y2.name = "mit Runden"; y2.art = "werkzeug"; y2.unvollstaendig = False
        d25["runden"] = 12; d25["bytes"] = 9000; d25["aufgabe"] = "mit Runden"; sichere(d25)
        with open(os.devnull, "w", encoding="utf-8", errors="replace") as nichts, contextlib.redirect_stdout(nichts):
            befehl_abschluss(y2)
        pruefe("NULLPROBE: mit Runden wieder vollstaendig",
               lade_historie()["etappen"][-1]["unvollstaendig"], False)

        print("26) Ein Abschluss OHNE passende Aufgabe ist eine Untergrenze, keine Kosten")
        os.environ["WACHE_HISTORIE"] = os.path.join(t, "hist26.json")
        d26 = leer(); d26["faktor"]=1.0; d26["je_runde"]=0; d26["bytes"]=9000
        d26["runden"]=9; d26["runden_bei_start"]=0; d26["verbraucht_bei_start"]=0
        d26["aufgabe"]="etwas ganz anderes"
        sichere(d26)
        class C: pass
        z26=C(); z26.name="Aufgabe X"; z26.art="werkzeug"; z26.unvollstaendig=False
        with open(os.devnull,"w",encoding="utf-8",errors="replace") as nichts, contextlib.redirect_stdout(nichts):
            befehl_abschluss(z26)
        letzt26=lade_historie()["etappen"][-1]
        pruefe("als unvollstaendig verbucht", letzt26["unvollstaendig"], True)
        pruefe("Grund nennt die fehlende Aufgabe", "kein passendes" in (letzt26.get("grund") or ""), True)
        pruefe("die Aufgabe ist danach geschlossen", lade()["aufgabe"], "")

        print("27) NULLPROBE: mit passender Aufgabe zaehlt es als Kosten")
        d26["aufgabe"]="Aufgabe X"; d26["runden"]=9; d26["runden_bei_start"]=5
        d26["verbraucht_bei_start"]=4000; sichere(d26)
        z27=C(); z27.name="Aufgabe X"; z27.art="werkzeug"; z27.unvollstaendig=False
        with open(os.devnull,"w",encoding="utf-8",errors="replace") as nichts, contextlib.redirect_stdout(nichts):
            befehl_abschluss(z27)
        pruefe("vollstaendig", lade_historie()["etappen"][-1]["unvollstaendig"], False)
        pruefe("Kosten sind 9000-4000", lade_historie()["etappen"][-1]["tokens"], 5000)

        print("28) OHNE Kladde sagt sie 'keine' - und erfindet keine Null-Messung")
        kl = os.environ["WACHE_KLADDE"]
        dk = leer()
        pruefe("Zuwachs 0", verbuche_kladde(dk)[0], 0)
        pruefe("Zweig 'keine'", verbuche_kladde(dk)[1], "keine")

        def schreibe_kladde(text, anhaengen=True):
            with open(kl, "a" if anhaengen else "w", encoding="utf-8", newline="") as f:
                f.write(text)

        print("29) Zwei Zeilen mit 1200 und 800 Byte ergeben 2000")
        schreibe_kladde("2026-09-21T08:00:00Z 1200 1100 0" + NL, False)
        schreibe_kladde("2026-09-21T08:01:00Z 800 790 0" + NL)
        z, wie = verbuche_kladde(dk)
        pruefe("Summe", z, 2000)
        pruefe("Zweig 'kladde'", wie, "kladde")
        pruefe("zwei Aufrufe verbucht", dk["kladde_zeilen"], 2)

        print("30) DASSELBE NOCH EINMAL LESEN ZAEHLT NICHTS DAZU")
        # Der Kern des Versatzes. Zweimal zaehlen waere schlimmer als gar nicht.
        pruefe("Zuwachs beim zweiten Mal", verbuche_kladde(dk)[0], 0)
        pruefe("Zeilenzahl unveraendert", dk["kladde_zeilen"], 2)

        print("31) Eine neue Zeile zaehlt - und nur sie")
        schreibe_kladde("2026-09-21T08:02:00Z 500 490 0" + NL)
        pruefe("Zuwachs", verbuche_kladde(dk)[0], 500)
        pruefe("drei Aufrufe verbucht", dk["kladde_zeilen"], 3)

        print("32) Eine ANGEFANGENE Zeile bleibt liegen, bis sie fertig ist")
        # Der Server schreibt, waehrend die Wache liest. Eine halbe Zeile jetzt zu
        # zaehlen hiesse, sie spaeter ganz zu verlieren.
        schreibe_kladde("2026-09-21T08:03:00Z 999")
        pruefe("halbe Zeile zaehlt nicht", verbuche_kladde(dk)[0], 0)
        schreibe_kladde(" 990 0" + NL)
        pruefe("fertige Zeile zaehlt", verbuche_kladde(dk)[0], 999)
        # ⚠️ DIE ZWEI FAELLE OBEN TREFFEN NUR DEN ZWEIG "gar kein Zeilenende".
        #    Das Abschneiden SELBST wird erst geprueft, wenn eine fertige und eine
        #    halbe Zeile ZUSAMMEN ankommen - so, wie der Server wirklich schreibt.
        #    Gefunden 21.09.2026 von der Sabotage, nicht beim Schreiben der Probe.
        schreibe_kladde("2026-09-21T08:05:00Z 777 770 0" + NL + "2026-09-21T08:06:00Z 888")
        pruefe("nur die fertige Zeile zaehlt", verbuche_kladde(dk)[0], 777)
        schreibe_kladde(" 880 0" + NL)
        pruefe("die Nachzueglerin kommt vollstaendig an", verbuche_kladde(dk)[0], 888)

        print("33) Krumme Zeilen und Kommentare werden GEMELDET, nicht verschluckt")
        schreibe_kladde("# kladde neu begonnen" + NL)
        schreibe_kladde("voellig kaputt" + NL)
        schreibe_kladde("2026-09-21T08:04:00Z 100 90 0" + NL)
        z33, wie33 = verbuche_kladde(dk)
        pruefe("nur die gute Zeile zaehlt", z33, 100)
        pruefe("die kaputte wird gemeldet", "unlesbare" in wie33, True)

        print("34) SCHRUMPFT die Kladde, wird ab vorn gezaehlt - und es steht da")
        schreibe_kladde("2026-09-21T09:00:00Z 300 290 0" + NL, False)
        z34, wie34 = verbuche_kladde(dk)
        pruefe("ab vorn gezaehlt", z34, 300)
        pruefe("und es sagt warum", "geschrumpft" in wie34, True)

        print("35) Die Kladde zaehlt auch die RUNDEN - eine Zeile ist ein Aufruf (Befund 21.09.)")
        schreibe_kladde("2026-09-21T10:00:00Z 1000 990 0" + NL, False)
        schreibe_kladde("2026-09-21T10:01:00Z 500 490 0" + NL)
        d35 = leer(); d35["kladde_gelesen"] = 0
        pruefe("Zweig kladde", verbuche(d35), "kladde")
        pruefe("Bytes", d35["bytes"], 1500)
        pruefe("zwei Runden", d35["runden"], 2)
        pruefe("Quelle", d35["quelle"], "kladde")
        verbuche(d35)
        pruefe("zweites Lesen: keine Runde dazu", d35["runden"], 2)
        d35b = leer()
        os.environ["WACHE_KLADDE"] = os.path.join(t, "gibt_es_nicht.log")
        pruefe("ohne Kladde: 'keine', nichts veraendert", (verbuche(d35b), d35b["runden"], d35b["bytes"]), ("keine", 0, 0))
        os.environ["WACHE_KLADDE"] = kl

        print("36) abschluss VERBUCHT VORHER - die Etappe misst, was in der Kladde steht")
        os.environ["WACHE_HISTORIE"] = os.path.join(t, "hist36.json")
        d36 = leer(); d36["faktor"] = 1.0; d36["je_runde"] = 100
        d36["kladde_gelesen"] = os.path.getsize(kl); d36["aufgabe"] = "Etappe K"
        d36["verbraucht_bei_start"] = 0; d36["runden_bei_start"] = 0
        sichere(d36)
        schreibe_kladde("2026-09-21T10:02:00Z 3000 2990 0" + NL)
        schreibe_kladde("2026-09-21T10:03:00Z 2000 1990 0" + NL)
        schreibe_kladde("2026-09-21T10:04:00Z 1000 990 0" + NL)
        z36 = C(); z36.name = "Etappe K"; z36.art = "etappe"; z36.unvollstaendig = False
        with open(os.devnull, "w", encoding="utf-8", errors="replace") as nichts, contextlib.redirect_stdout(nichts):
            befehl_abschluss(z36)
        e36 = lade_historie()["etappen"][-1]
        pruefe("vollstaendig, keine Untergrenze", e36["unvollstaendig"], False)
        pruefe("Kosten = 6000 Byte + 3 Runden x 100", e36["tokens"], 6300)
        pruefe("drei Runden dazu", e36["runden_dazu"], 3)

        print("37) aufgabe VERBUCHT VORHER - das Messfenster beginnt am heutigen Stand")
        d37 = leer(); d37["faktor"] = 1.0; d37["je_runde"] = 0
        d37["kladde_gelesen"] = os.path.getsize(kl); sichere(d37)
        schreibe_kladde("2026-09-21T10:05:00Z 4000 3990 0" + NL)
        a37 = C(); a37.name = "Etappe L"; a37.art = "etappe"; a37.schaetzung = 0
        with open(os.devnull, "w", encoding="utf-8", errors="replace") as nichts, contextlib.redirect_stdout(nichts):
            befehl_aufgabe(a37)
        pruefe("die 4000 Byte davor gehoeren NICHT zur Aufgabe", lade()["verbraucht_bei_start"], 4000)

        print("38) start beginnt am ENDE der Kladde, nicht am Anfang")
        schreibe_kladde("2026-09-21T10:06:00Z 99999 99990 0" + NL)
        s38 = C(); s38.budget = None; s38.faktor = None; s38.je_runde = None; s38.reserve = None; s38.konto = "web.de"
        with open(os.devnull, "w", encoding="utf-8", errors="replace") as nichts, contextlib.redirect_stdout(nichts):
            befehl_start(s38)
        d38 = lade()
        pruefe("Versatz = Dateigroesse", d38["kladde_gelesen"], os.path.getsize(kl))
        pruefe("der alte Verbrauch zaehlt nicht mit", (verbuche(d38), d38["bytes"], d38["runden"]), ("kladde", 0, 0))

        print("39) tick MIT Kladde zaehlt KEINE Extra-Runde - nur die Zeilen der Kladde")
        d39 = leer(); d39["kladde_gelesen"] = os.path.getsize(kl); sichere(d39)
        schreibe_kladde("2026-09-21T10:07:00Z 700 690 0" + NL)
        t39 = C(); t39.notiz = None; t39.laut = False
        with open(os.devnull, "w", encoding="utf-8", errors="replace") as nichts, contextlib.redirect_stdout(nichts):
            befehl_tick(t39)
        pruefe("genau eine Runde (eine Zeile)", (lade()["runden"], lade()["bytes"]), (1, 700))

        print("40) Nur 1 Punkt Abstand: Kurs aus der OBERGRENZE (1+1)/10 = 0.2, nicht 0.1")
        k40, g40 = kurs_aus_paar(ab(10000, sitzung=88.0), ab(20000, sitzung=89.0), "sitzung")
        pruefe("Obergrenze 0.2", round(k40, 4), 0.2)
        pruefe("und er nennt sie", "OBERGRENZE" in g40, True)

        print("41) Das WEITESTE Paar im Fenster zaehlt: 88 -> 89 -> 94 ergibt 6/20 = 0.3")
        d41 = leer(); d41["ablesungen"] = [ab(10000, sitzung=88.0), ab(20000, sitzung=89.0), ab(30000, sitzung=94.0)]
        pruefe("Kurs aus 88..94", round(kurs_fuer(d41, "sitzung")[0], 4), 0.3)
        d41["ablesungen"].append(ab(40000, sitzung=2.0))
        pruefe("nach einem Reset kein Kurs ueber den Fall hinweg", kurs_fuer(d41, "sitzung")[0] is None or "UEBERNOMMEN" in kurs_fuer(d41, "sitzung")[1], True)

        print("24) Ohne jede Ablesung wird NICHT gerechnet - und das steht da")
        pruefe("kein Urteil ohne Ablesung", konto_urteil(leer(), "woche")[0], None)
        pruefe("und es sagt NICHT gerechnet",
               "NICHT gerechnet" in konto_urteil(leer(), "woche")[1], True)

    for s in ("WACHE_AUSGABE", "WACHE_BUCH", "WACHE_HISTORIE", "WACHE_KONTO", "WACHE_KLADDE"):
        os.environ.pop(s, None)
    if fehler:
        print("SELBSTTEST ROT: " + str(len(fehler)) + " Abweichung(en)")
        return 1
    print("SELBSTTEST GRUEN (" + str(zaehler[0]) + " Proben)")
    return 0

def stelle_ausgabe_um():
    """⛔ GEFUNDEN BEIM ERSTEN LAUF AM ECHTEN FALL (18.09.2026): Python schreibt
       unter Windows in cp1252, und die Warnzeichen brachen 'stand' mitten im
       Bericht mit einem UnicodeEncodeError ab - der Selbsttest hatte nichts
       gemerkt, weil er die Ausgabe gar nicht drucken laesst.
       ►► Ein MESSWERKZEUG DARF NIE ABSTUERZEN: ein Absturz sieht aus wie
          'nichts zu melden'. Genau die Verwechslung soll es verhindern."""
    for strom in (sys.stdout, sys.stderr):
        if hasattr(strom, "reconfigure"):
            strom.reconfigure(encoding="utf-8", errors="replace")

def main():
    stelle_ausgabe_um()
    p = argparse.ArgumentParser(description="Kassenbuch fuer den Kontextverbrauch eines Chats")
    u = p.add_subparsers(dest="befehl")
    s = u.add_parser("start"); s.add_argument("--budget"); s.add_argument("--faktor")
    s.add_argument("--je-runde", dest="je_runde"); s.add_argument("--reserve")
    s.add_argument("--konto", default="")
    t = u.add_parser("tick"); t.add_argument("--notiz", default=""); t.add_argument("--laut", action="store_true")
    u.add_parser("stand")
    a = u.add_parser("aufgabe"); a.add_argument("name"); a.add_argument("--art", default="")
    a.add_argument("--schaetzung")
    b = u.add_parser("abschluss"); b.add_argument("name"); b.add_argument("--art", default="")
    b.add_argument("--unvollstaendig", action="store_true",
                   help="Kassenbuch lief erst mitten in der Etappe - Wert ist eine Untergrenze")
    k = u.add_parser("konto")
    k.add_argument("--sitzung"); k.add_argument("--woche")
    k.add_argument("--reset-sitzung", dest="reset_sitzung", default="")
    k.add_argument("--reset-woche", dest="reset_woche", default="")
    k.add_argument("--konto", default="")
    u.add_parser("selbsttest")
    args = p.parse_args()
    if args.befehl == "start":      return befehl_start(args)
    if args.befehl == "tick":       return befehl_tick(args)
    if args.befehl == "stand":      return befehl_stand(args)
    if args.befehl == "aufgabe":    return befehl_aufgabe(args)
    if args.befehl == "abschluss":  return befehl_abschluss(args)
    if args.befehl == "konto":      return befehl_konto(args)
    if args.befehl == "selbsttest":
        # EIN ABSTURZ IST EIN ROTES URTEIL, KEIN SCHWEIGEN. Gemessen 18.09.2026:
        # zwei Sabotagen liessen den Selbsttest mit einer Ausnahme sterben - er
        # druckte dann WEDER GRUEN NOCH ROT, und die Gegenprobe las das als
        # "die Probe misst nichts". Dieselbe Verwechslung, die tick mit STUMM
        # abstellt und die check.sh 4e11 bei den Pool-Waechtern abstellt.
        try:
            return befehl_selbsttest(args)
        except Exception as ex:   # noqa: BLE001 - ein abstuerzender Selbsttest muss ROT melden, nicht still enden
            print("SELBSTTEST ROT: der Selbsttest selbst ist abgestuerzt - "
                  + type(ex).__name__ + ": " + str(ex)[:200])
            return 1
    p.print_help()
    return 1

if __name__ == "__main__":
    sys.exit(main())
