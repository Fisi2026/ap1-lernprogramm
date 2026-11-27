#!/usr/bin/env python3
"""tools/live_waechter.py - B3 Live-Waechter (N42, ND7/E68; gebaut 27.11.2026, BUILD_LOG 316).

Prueft die Live-Seite gegen den ausgecheckten Stand von main und meldet je URSACHE einen Befund:
  1. erreichbar   - GET / liefert 200
  2. header       - jeder Kopf aus v2/_headers (Block /*) kommt live mit gleichem Wert an
  3. version      - der Cache-Name in app-sw.js live == v2/app-sw.js im Repo (Live-Stand = main)
  4. fehler       - neue Fehlerberichte der letzten 26 h aus D1 (Tabelle `fehler`), gruppiert nach bereich+meldung
                    (nur mit Lesezugang: CLOUDFLARE_D1_LESEN + CLOUDFLARE_ACCOUNT_ID; ohne: Hinweis, kein Befund)
Ausgabe: JSON-Liste [{"schluessel", "titel", "text"}] nach --aus (Standard stdout); der Workflow live.yml macht daraus
GitHub-Issues, EINES je Schluessel (ein offenes Issue mit gleichem Titel wird nicht doppelt angelegt).
Nur LESEN: kein POST auf die App, D1 nur SELECT (regeln: Produktions-D1, PLAN_NEUBAU B1).

  python3 tools/live_waechter.py [--url U] [--aus datei.json]
  python3 tools/live_waechter.py --probe     # Faelle mit bekannter Antwort, ohne Netz
"""
import http.client
import json
import os
import re
import sys
import time
import urllib.parse

BASIS = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
URL = "https://ap1-lernprogramm.fisi2026lernapp.workers.dev"
FENSTER_MS = 26 * 3600 * 1000   # taeglicher Lauf + 2 h Puffer


def lies(rel):
    with open(os.path.join(BASIS, rel), encoding="utf-8") as f:
        return f.read()


def soll_header(text):
    """Koepfe des Blocks /* aus v2/_headers -> {name_klein: wert}."""
    out, im = {}, False
    for z in text.splitlines():
        if not z.strip():
            continue
        if not z[0].isspace():
            im = z.strip() == "/*"
            continue
        if im and ":" in z:
            k, v = z.strip().split(":", 1)
            out[k.strip().lower()] = v.strip()
    return out


def cache_name(js):
    m = re.search(r'var CACHE = "([^"]+)"', js or "")
    return m.group(1) if m else None


def vergleiche_header(soll, ist):
    """Befunde fuer fehlende/abweichende Koepfe. ist: {name_klein: wert}."""
    b = []
    for k, v in sorted(soll.items()):
        if k not in ist:
            b.append(befund("header-" + k, f"Kopf {k} fehlt live", f"Soll laut v2/_headers: `{v}`"))
        elif ist[k].strip() != v:
            b.append(befund("header-" + k, f"Kopf {k} weicht ab", f"Soll `{v}`\n\nIst `{ist[k].strip()}`"))
    return b


def fehler_befunde(zeilen):
    """D1-Zeilen (bereich, meldung, version, n) -> ein Befund je bereich+meldung."""
    b = []
    for r in zeilen:
        kurz = re.sub(r"\s+", " ", str(r.get("meldung", "")))[:80]
        b.append(befund("fehler-" + str(r.get("bereich", "?")) + "-" + kurz,
                        f"Fehlerbericht {r.get('bereich', '?')}: {kurz}",
                        f"{r.get('n', '?')}x in den letzten 26 h, Version {r.get('version', '?')}"))
    return b


def befund(schluessel, titel, text):
    return {"schluessel": schluessel, "titel": "[Live] " + titel, "text": text}


def anfrage(url, methode="GET", daten=None, kopf=None):
    """(status, koepfe_klein, text). Nur https (HTTPSConnection kennt kein file: - ruff S310 entfaellt)."""
    teile = urllib.parse.urlsplit(url)
    if teile.scheme != "https":
        raise ValueError("nur https erlaubt: " + url[:60])
    pfad = teile.path or "/"
    if teile.query:
        pfad += "?" + teile.query
    verb = http.client.HTTPSConnection(teile.netloc, timeout=30)
    try:
        verb.request(methode, pfad, body=daten, headers={"User-Agent": "ap1-live-waechter", **(kopf or {})})
        r = verb.getresponse()
        return r.status, {k.lower(): v for k, v in r.getheaders()}, r.read().decode("utf-8", "replace")
    finally:
        verb.close()


def hole(url):
    return anfrage(url)


def d1_lesen():
    tok, acc = os.environ.get("CLOUDFLARE_D1_LESEN"), os.environ.get("CLOUDFLARE_ACCOUNT_ID")
    if not tok or not acc:
        print("[live] D1: kein Lesezugang (CLOUDFLARE_D1_LESEN/CLOUDFLARE_ACCOUNT_ID) - Fehlerberichte NICHT geprueft", file=sys.stderr)
        return None
    db = re.search(r'"database_id"\s*:\s*"([^"]+)"', lies("wrangler.jsonc")).group(1)
    sql = ("SELECT bereich, meldung, MAX(version) AS version, COUNT(*) AS n FROM fehler "
           "WHERE erstellt > ? GROUP BY bereich, meldung ORDER BY n DESC LIMIT 20")
    daten = json.dumps({"sql": sql, "params": [int(time.time() * 1000) - FENSTER_MS]}).encode()
    _, _, text = anfrage(f"https://api.cloudflare.com/client/v4/accounts/{acc}/d1/database/{db}/query", "POST", daten,
                          {"Authorization": "Bearer " + tok, "Content-Type": "application/json"})
    antwort = json.loads(text)
    if not antwort.get("success"):
        raise RuntimeError("D1-Abfrage: " + json.dumps(antwort.get("errors"))[:200])
    return antwort["result"][0]["results"]


def lauf(url):
    b = []
    try:
        st, kopf, _ = hole(url + "/?v=" + str(int(time.time())))
    except Exception as e:   # noqa: BLE001 - jeder Netzfehler ist der Befund
        return [befund("erreichbar", "Seite nicht erreichbar", f"`{type(e).__name__}: {e}`")]
    if st != 200:
        return [befund("erreichbar", f"Seite liefert HTTP {st}", url)]
    b += vergleiche_header(soll_header(lies("v2/_headers")), kopf)
    try:
        _, _, sw = hole(url + "/app-sw.js?v=" + str(int(time.time())))
    except Exception as e:   # noqa: BLE001
        sw = ""
        b.append(befund("version", "app-sw.js nicht lesbar", f"`{e}`"))
    soll, ist = cache_name(lies("v2/app-sw.js")), cache_name(sw)
    if sw and soll != ist:
        b.append(befund("version", "Live-Stand weicht von main ab", f"main `{soll}`, live `{ist}`"))
    zeilen = d1_lesen()
    if zeilen:
        b += fehler_befunde(zeilen)
    return b


def probe():
    faelle = [
        ("header-block", soll_header("/*\n  A: 1\n  B: x y\n/neben\n  C: 3\n"), {"a": "1", "b": "x y"}),
        ("cache", cache_name('x;var CACHE = "ap1-app-2.13.2-e22d6882";'), "ap1-app-2.13.2-e22d6882"),
        ("cache fehlt", cache_name("nichts"), None),
        ("header gleich", len(vergleiche_header({"a": "1"}, {"a": " 1 "})), 0),
        ("header fehlt", [x["schluessel"] for x in vergleiche_header({"a": "1"}, {})], ["header-a"]),
        ("header anders", [x["titel"] for x in vergleiche_header({"a": "1"}, {"a": "2"})], ["[Live] Kopf a weicht ab"]),
        ("fehler je Ursache", [x["schluessel"] for x in fehler_befunde([{"bereich": "ueben", "meldung": "x  y", "n": 3}])],
         ["fehler-ueben-x y"]),
        ("echte _headers lesbar", "strict-transport-security" in soll_header(lies("v2/_headers")), True),
    ]
    falsch = [(n, ist, soll) for n, ist, soll in faelle if ist != soll]
    for n, ist, soll in falsch:
        print(f"[live] FALSCH {n}: {ist!r} soll {soll!r}")
    print(f"[live] PROBE {len(faelle) - len(falsch)}/{len(faelle)} richtig")
    return 1 if falsch else 0


def main():
    a = sys.argv[1:]
    if "--probe" in a:
        sys.exit(probe())
    url = a[a.index("--url") + 1] if "--url" in a else URL
    b = lauf(url.rstrip("/"))
    text = json.dumps(b, ensure_ascii=False, indent=1)
    if "--aus" in a:
        with open(a[a.index("--aus") + 1], "w", encoding="utf-8") as f:
            f.write(text)
    else:
        print(text)
    print(f"[live] {len(b)} Befund(e)", file=sys.stderr)


main()
