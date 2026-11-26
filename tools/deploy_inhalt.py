#!/usr/bin/env python3
"""tools/deploy_inhalt.py – WAS LIEGT NACH DEM DEPLOY AUF DEM SERVER, UND WOZU?

    python3 tools/deploy_inhalt.py            lesbare Aufstellung
    python3 tools/deploy_inhalt.py --pruefe   eine Zeile fuer check.sh

══════════ WARUM ES DIESES SKRIPT GIBT (07.09.2026) ══════════
`.assetsignore` schliesst vom Deploy aus: `.git`, `*.env`, `*.sh`, `*.py`, `tests/`, `tools/`,
`prompts/`, `*.md`, Backups, PDF. Die Absicht steht in DEPLOY.md: **auf den Server gehoert, was
die App braucht – und sonst nichts.** Gemessen wird das nirgends. Dieses Skript misst es.

⛔ **ZUERST DER FEHLER, DEN ICH DABEI GEMACHT HABE — ER IST DIE HAELFTE DES WERTS DIESER DATEI.**
Der erste Messlauf ging ueber den ARBEITSORDNER und meldete **53 MB in 3014 Dateien**, darunter
`.tooling/node_modules` (jsdom, axe-core) und der ganze `_to_delete`-Muell. Das waere ein
spektakulaerer Befund gewesen – und er ist **falsch**. Cloudflare ist mit dem GitHub-Repo
verbunden und deployt bei jedem Push (DEPLOY.md); Ausgangsmenge ist also `git ls-files`, nicht
der Ordner auf der Platte. Alles, was `.gitignore` ausschliesst, kommt nie in die Naehe des
Servers. ►► **DIE AUSGANGSMENGE EINER MESSUNG IST TEIL DER MESSUNG.** Wer die falsche Menge
nimmt, misst sauber – und misst etwas anderes.

Die richtige Ausgangsmenge ist: **im Repo verfolgt UND nicht von `.assetsignore` ausgeschlossen.**
⛔ **SEIT N29 TEIL 2 (24.09.2026, E44) GILT NUR NOCH DER AUSLIEFERUNGSORDNER** aus `wrangler.jsonc`
(`./v2`); die Wurzel-Messung unten im Text und `.assetsignore` sind entfallen (Geschichte: git log).

Danach wird gefragt, was davon die App ueberhaupt anfasst. Erreichbar heisst:
  1. in `APP_FILES` von `sw.js` (die Precache-Liste), oder
  2. `sw.js` selbst, oder
  3. namentlich erwaehnt in einer dieser Dateien (Manifest-Symbole, Screenshots, Bilder).
Alles andere liegt auf dem Server, ohne dass ein Aufruf es je holt.

⚠️ **DAS SKRIPT AENDERT NICHTS UND SCHLAEGT AUCH NICHTS VOR.** Was mit dem unerreichbaren Teil
geschieht, ist eine Auslieferungs-Entscheidung und gehoert dem Nutzer. Das Skript sagt nur, wie
viel es ist – damit die Zahl nicht wieder jahrelang niemand kennt.
"""
import fnmatch
import os
import re
import subprocess
import sys

BASIS = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


def verfolgt():
    r = subprocess.run(["git", "ls-files"], cwd=BASIS, capture_output=True, text=True, check=False)
    return [z for z in r.stdout.split("\n") if z]


def ausgeschlossen(rel, muster):
    for m in muster:
        basis = m.rstrip("/*").rstrip("/")
        if (fnmatch.fnmatch(rel, m) or fnmatch.fnmatch(os.path.basename(rel), m)
                or rel == basis or rel.startswith(basis + "/")):
            return True
    return False


# ══════════ SEIT N29 (24.09.2026): DER AUSLIEFERUNGSORDNER STEHT IN wrangler.jsonc ══════════
# ⛔ Cloudflare liefert seit N29 NUR `assets.directory` aus (E22, Positivliste: `./v2`). Die Messung
#    oben ueber den Wurzelordner mit `.assetsignore` waere danach eine Messung von etwas, das gar
#    nicht mehr auf den Server geht – sie laeuft nur noch, wenn dort "." steht.
# ►► Ausgangsmenge: im Repo verfolgt UND unter dem Auslieferungsordner. `_redirects` wertet Cloudflare
#    aus und liefert es NICHT aus (Doku „Redirects") – es zaehlt nicht mit.
# ►► Erreichbar: transitiv von FESTEN EINSTIEGEN aus. Neben index.html sind das Adressen, die kein
#    Verweis nennt und die trotzdem abgerufen werden: der Neubau-SW (registriert per Code) und die
#    beiden Abschalt-SW (abgerufen von Browsern, die dort einen alten SW registriert haben, R9).
# ⛔ Liefert der Ordner NICHTS, bricht das Skript ab (rc 2) – ein leerer Ordner waere sonst „0
#    unerreichbare Dateien", also gruen an einer Stelle, an der nichts gemessen wird (LEHREN 4e2b).
FESTE_EINSTIEGE = ("index.html", "app-sw.js", "sw.js", "v2/sw.js")
NICHT_AUSGELIEFERT = {"_redirects", "_headers"}


def auslieferungsordner():
    pfad = os.path.join(BASIS, "wrangler.jsonc")
    if not os.path.exists(pfad):
        return "."
    with open(pfad, encoding="utf-8") as fh:
        t = fh.read()
    m = re.search(r'"directory"\s*:\s*"([^"]+)"', t)
    if not m:
        return "."
    d = m.group(1).strip()
    return "." if d in (".", "./") else d[2:].rstrip("/") if d.startswith("./") else d.rstrip("/")


def messen_ordner(ordner):
    teil = [t[len(ordner) + 1:] for t in verfolgt() if t.startswith(ordner + "/")]
    muster = []
    innen = os.path.join(BASIS, ordner, ".assetsignore")
    if os.path.exists(innen):
        with open(innen, encoding="utf-8") as fh:
            muster = [z.strip() for z in fh if z.strip() and not z.strip().startswith("#")]
    geliefert = [g for g in teil if g not in NICHT_AUSGELIEFERT and not ausgeschlossen(g, muster)]
    if not geliefert:
        print(f"DEPLOY-FEHLER: Auslieferungsordner '{ordner}' liefert nichts aus (git ls-files leer?)")
        sys.exit(2)
    erreicht = {e for e in FESTE_EINSTIEGE if e in geliefert}
    offen = list(erreicht)
    while offen:
        p = os.path.join(BASIS, ordner, offen.pop())
        try:
            with open(p, encoding="utf-8", errors="ignore") as fh:
                text = fh.read()
        except OSError:
            text = ""
        for g in geliefert:
            if g not in erreicht and (g in text or os.path.basename(g) in text):
                erreicht.add(g)
                offen.append(g)

    def groesse(rel):
        q = os.path.join(BASIS, ordner, rel)
        return os.path.getsize(q) if os.path.exists(q) else 0

    ohne = sorted(g for g in geliefert if g not in erreicht)
    return geliefert, erreicht, ohne, {g: groesse(g) for g in geliefert}


def messen():
    ordner = auslieferungsordner()
    if ordner == ".":
        # ⛔ N29 Teil 2 (E44): die Messung ueber den Wurzelordner mit `.assetsignore` ist entfallen.
        print("DEPLOY-FEHLER: wrangler.jsonc liefert den Wurzelordner aus - seit N29 nicht mehr vorgesehen")
        sys.exit(2)
    return messen_ordner(ordner)


def main():
    # ⚠️ Unter Git Bash auf Windows ist stdout cp1252 – das Warnzeichen unten liess das Skript
    #    am 17.09.2026 mit UnicodeEncodeError abbrechen, NACH der Aufstellung.
    if hasattr(sys.stdout, "reconfigure"):
        sys.stdout.reconfigure(encoding="utf-8")
    geliefert, erreicht, ohne, gr = messen()
    kb = lambda ns: sum(gr[n] for n in ns) / 1024.0
    if "--pruefe" in sys.argv:
        print(f"DEPLOY {len(geliefert):d} {int(kb(geliefert)):d} {len(ohne):d} {int(kb(ohne)):d}")
        return 0
    print(f"Auslieferungsordner (wrangler.jsonc): {auslieferungsordner()}")
    print(f"Ausgangsmenge: {len(verfolgt())} Dateien im Repo, davon {len(geliefert)} ausgeliefert ({kb(geliefert):.0f} KB)")
    print(f"Davon von der App erreichbar: {len(erreicht)} ({kb(sorted(erreicht)):.0f} KB)")
    print(f"NICHT erreichbar:             {len(ohne)} ({kb(ohne):.0f} KB)\n")
    gruppen = {}
    for n in ohne:
        kopf = n.split("/")[0] + "/" if "/" in n else "(Wurzel)"
        gruppen.setdefault(kopf, []).append(n)
    for kopf in sorted(gruppen, key=lambda k: -kb(gruppen[k])):
        n = gruppen[kopf]
        print(f"  {kb(n):8.1f} KB  {kopf:<14} {len(n)} Datei(en)")
        for d in sorted(n, key=lambda x: -gr[x])[:6]:
            print(f"             {gr[d] / 1024.0:8.1f} KB  {d}")
    print("\n⚠️ Das Skript aendert nichts. Was mit dem unerreichbaren Teil geschieht, ist eine")
    print("   Auslieferungs-Entscheidung und gehoert dem Nutzer.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
