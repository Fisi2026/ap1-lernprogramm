#!/usr/bin/env python3
"""tools/ungepusht.py - zaehlt ungepushte Commits, die beim LERNER etwas aendern wuerden.

══════════ WARUM ES DIESES SKRIPT GIBT (02.09.2026) ══════════
Guard 4e2b der `check.sh` vergleicht VERSIONSNUMMERN. Nach dem Push von v1.19.0 lag der
B106-Commit ungepusht auf main; beide Nummern waren 1.19.0, und 4e2b haette den Marker
"PUSH DURCH" ERZWUNGEN - waehrend eine Aenderung, die der Lerner sieht, unveroeffentlicht dalag.

Die erste Fassung des Gegen-Waechters nahm eine handverlesene Ausnahme ("Commits, die nur
START_PROMPT.md anfassen, zaehlen nicht"), damit der Waechter nicht zirkulaer wird: "PUSH DURCH"
liesse sich sonst nie eintragen, weil das Eintragen selbst ein Commit ist.

⛔⛔ BEIM ERSTEN ECHTEN EINSATZ ZEIGTE SICH, DASS DIE AUSNAHME AM FALSCHEN MASS HING.
   `.assetsignore` sagt, was Cloudflare NICHT ausliefert - und dort steht `*.md`, `*.sh`, `*.py`,
   `tools/**`, `tests/**`. Gemessen: die App laedt zur Laufzeit KEINE .md, `sw.js` cacht keine.
   ►► Also ist die richtige Frage nicht "welche Datei habe ich ausgenommen", sondern
      "aendert dieser Commit etwas, das ueberhaupt beim Lerner ankommt?" - und die beantwortet
      `.assetsignore`, nicht mein Gedaechtnis. Ein gemessenes Kriterium statt einer Liste.
   ⚠️ Nebenbefund: der Commit 75f36ee (Doku + zwei Werkzeuge) aendert beim Lerner NICHTS.
      Das ist richtig so und faellt nur auf, weil das Kriterium jetzt misst statt aufzuzaehlen.

⛔ WO DIESES SKRIPT NICHTS MISST, SAGT ES ES. In der CI ist HEAD == origin/main per Konstruktion
   (push-Trigger), der Zaehler dort STRUKTURELL 0 - eine gruene Zeile aus der CI ist kein
   Messwert. Und `origin/main` ist ein LOKALER Ref (GitHub ist aus der Sandbox 403): er stimmt,
   solange von diesem Rechner gepusht oder geholt wird.

══════════ SEIT N29 TEIL 2 (24.09.2026, E44): DAS KRITERIUM KOMMT AUS wrangler.jsonc ══════════
⛔ `.assetsignore` wirkt seit N29 nicht mehr: Cloudflare liefert NUR `assets.directory` aus (`./v2`).
   Das alte Kriterium haette jeden Commit an Dateien der Wurzel (z. B. `referenz/`) als „Wirkung beim
   Lerner" gezaehlt – und hatte eine LUECKE: `neu/**` und `wrangler.jsonc` galten als still, obwohl
   Cloudflare den WORKER (`main`, fuer /api/*) aus `neu/src/server/` baut und `wrangler.jsonc` samt
   D1-Migrationen anwendet.
►► Wirkung beim Lerner hat ein Pfad, wenn er
   * unter `assets.directory` liegt (das Buendel, `_redirects` eingeschlossen – es leitet um), ODER
   * `wrangler.jsonc` ist, ODER unter `migrations_dir` liegt, ODER
   * `neu/package.json`/`neu/package-lock.json` ist (wrangler buendelt den Worker mit diesen Paketen), ODER
   * `main` ist oder von `main` TRANSITIV importiert wird (relativ, `@/`, `@pool/`; Tests nie).
⚠️ Im Zweifel zaehlt ein Pfad (auch `import type`): lieber einmal zu oft „PUSH OFFEN" als eine stille
   Auslieferung. `--selbsttest` prueft Faelle mit bekannter Antwort, `--commit <sha>` einen Commit.

══════════ SEIT PAKET 1 (27.11.2026, BUILD_LOG 316): INHALT STATT SHA ══════════
⛔ main laeuft nur noch per PR mit SQUASH: origin/main traegt danach einen NEUEN Commit mit demselben Inhalt.
   `rev-list origin/main..main` zaehlte darum ALLES Gesquashte als ungepusht (Stand-Guard rot, gemessen 27.11.).
►► Offen ist ein Commit nur noch, wenn er einen Pfad anfasst, der sich zwischen origin/main und main
   UNTERSCHEIDET (`git diff --no-renames --name-only origin/main main`); zaehlend nur ueber genau diese Pfade.
   Gleicher Baum -> 0 offen. Im Zweifel zaehlt ein Commit (ein alter Commit am selben Pfad wie ein neuer).
   `--selbsttest` prueft auch diese Faelle (FAELLE_INHALT, bekannte Antworten).

Aufruf im Projektordner:
  python3 tools/ungepusht.py            # lesbar: welcher Commit zaehlt und warum
  python3 tools/ungepusht.py --pruefe   # eine Zeile fuer check.sh
  python3 tools/ungepusht.py --selbsttest        # bekannte Faelle, rc 1 bei Abweichung
  python3 tools/ungepusht.py --commit <sha>      # welche Dateien eines Commits zaehlen

Ausgabe von --pruefe:
  CI                       in der CI - strukturell 0, hier wird nicht gemessen
  KEINREF                  kein lokaler Ref origin/main - nicht messbar
  OK <zaehlend> <gesamt>   <zaehlend> Commits aendern etwas beim Lerner, <gesamt> liegen offen
Rueckgabewert ist immer 0 - die Bewertung macht check.sh.
"""
import os
import re
import subprocess
import sys

BASIS = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ALIAS = {"@/": "neu/src/", "@pool/": "pool/"}   # `@wurzel/` entfiel mit N34 T6b
ENDUNGEN = ("", ".ts", ".tsx", ".js", ".json", "/index.ts", "/index.tsx", "/index.js")


def git(*a):
    return subprocess.run(["git"] + list(a), capture_output=True, text=True, encoding="utf-8", check=False).stdout


def lies(rel):
    try:
        with open(os.path.join(BASIS, rel), encoding="utf-8") as f:
            return f.read()
    except OSError:
        return None


def konfig():
    """(ordner, main, migrationen) aus wrangler.jsonc. Fehlt etwas: Ausnahme – nie still raten."""
    t = lies("wrangler.jsonc")
    if t is None:
        raise SystemExit("ungepusht: wrangler.jsonc fehlt - Kriterium nicht bestimmbar")
    def feld(name):
        m = re.search(rf'"{name}"\s*:\s*"([^"]+)"', t)
        return m.group(1).strip().lstrip("./").rstrip("/") if m else None
    ordner, main, mig = feld("directory"), feld("main"), feld("migrations_dir")
    if not ordner or not main:
        raise SystemExit("ungepusht: assets.directory oder main fehlt in wrangler.jsonc")
    return ordner, main, mig


def aufloesen(von, ziel):
    for pre, ers in ALIAS.items():
        if ziel.startswith(pre):
            basis = ers + ziel[len(pre):]
            break
    else:
        if not ziel.startswith("."):
            return None                      # Paket (npm/node:) - ueber package-lock abgedeckt
        basis = os.path.normpath(os.path.join(os.path.dirname(von), ziel)).replace("\\", "/")
    for e in ENDUNGEN:
        if lies(basis + e) is not None and os.path.isfile(os.path.join(BASIS, basis + e)):
            return basis + e
    return None


IMPORT_RE = re.compile(r'(?:\bfrom\s*|\bimport\s*\(?\s*)["\']([^"\']+)["\']')


def worker_huelle(main):
    """Alle Dateien, die main transitiv importiert (main eingeschlossen). Tests nie."""
    gesehen, offen = set(), [main]
    while offen:
        d = offen.pop()
        if d in gesehen or re.search(r"\.test\.tsx?$", d):
            continue
        t = lies(d)
        if t is None:
            continue
        gesehen.add(d)
        for ziel in IMPORT_RE.findall(t):
            r = aufloesen(d, ziel)
            if r and r not in gesehen:
                offen.append(r)
    return gesehen


class Kriterium:
    def __init__(self):
        self.ordner, self.main, self.mig = konfig()
        self.huelle = worker_huelle(self.main)
        if self.main not in self.huelle:
            raise SystemExit(f"ungepusht: main '{self.main}' nicht lesbar - Kriterium nicht bestimmbar")

    def grund(self, pfad):
        """Warum der Pfad beim Lerner ankommt - oder None."""
        if pfad.startswith(self.ordner + "/"):
            return "Auslieferungsordner " + self.ordner + "/"
        if pfad == "wrangler.jsonc":
            return "Deploy-Konfiguration"
        if self.mig and pfad.startswith(self.mig + "/"):
            return "D1-Migration"
        if pfad in ("neu/package.json", "neu/package-lock.json"):
            return "Pakete des Worker-Buendels"
        if pfad in self.huelle:
            return "Worker (" + self.main + " importiert es)"
        return None


FAELLE = [   # (pfad, zaehlt?) - bekannte Antworten, gemessen am 24.09.2026
    ("v2/index.html", True), ("v2/_redirects", True), ("v2/assets/x.js", True),
    ("wrangler.jsonc", True), ("neu/src/server/migrationen/0001_meldungen.sql", True),
    ("neu/src/server/worker.ts", True), ("neu/src/server/api.ts", True),
    ("neu/src/server/regeln.ts", True), ("neu/src/server/fragen-ids.ts", True),
    ("neu/src/kern/route.ts", True),        # nur TRANSITIV: fehlerregeln.ts importiert es
    ("neu/package-lock.json", True),
    ("neu/src/server/api.test.ts", False), ("neu/src/schirme/Startseite.tsx", False),
    ("referenz/app_util.js", False), ("tools/pool_laden.js", False), ("pool/pool_m01.json", False),
    ("START_PROMPT.md", False), ("check.sh", False), ("referenz/tests/test_logik.js", False),
    (".assetsignore", False),
]


def offene(commits, dateien, diff, grund):
    """(offen, zaehlend) - nur Commits, deren Pfade sich zwischen origin/main und main noch unterscheiden.
    commits: Liste der SHAs aus origin/main..main · dateien: sha -> Pfade · diff: Menge der unterschiedlichen Pfade."""
    offen = [c for c in commits if any(d in diff for d in dateien[c])]
    zaehlend = [c for c in offen if any(grund(d) for d in dateien[c] if d in diff)]
    return offen, zaehlend


FAELLE_INHALT = [   # (name, commits->pfade, diff, soll offen, soll zaehlend) - Paket 1, 27.11.2026
    ("normal: 1 Commit vor origin, v2/", {"a": ["v2/index.html"]}, {"v2/index.html"}, 1, 1),
    ("normal: Doku-Commit", {"a": ["BUILD_LOG.md"]}, {"BUILD_LOG.md"}, 1, 0),
    ("gesquasht, Baum gleich", {"a": ["v2/index.html"], "b": ["BUILD_LOG.md"]}, set(), 0, 0),
    ("gesquasht + neuer Doku-Commit", {"a": ["v2/x.js"], "b": ["START_PROMPT.md"]}, {"START_PROMPT.md"}, 1, 0),
    ("gesquasht + neuer v2-Commit", {"a": ["BUILD_LOG.md"], "b": ["v2/x.js"]}, {"v2/x.js"}, 1, 1),
    ("alter und neuer Commit am selben Pfad (im Zweifel zaehlen)", {"a": ["v2/x.js"], "b": ["v2/x.js"]}, {"v2/x.js"}, 2, 2),
    ("Commit mit v2/ und Doku, nur Doku noch verschieden", {"a": ["v2/x.js", "BUILD_LOG.md"]}, {"BUILD_LOG.md"}, 1, 0),
]


def selbsttest():
    k, fehl = Kriterium(), 0
    for pfad, soll in FAELLE:
        ist = k.grund(pfad) is not None
        if ist != soll:
            fehl += 1
            print(f"FALSCH  {pfad!s:<48} soll {soll!s}, ist {ist!s}")
    for name, dat, diff, so, sz in FAELLE_INHALT:
        o, z = offene(list(dat), dat, diff, k.grund)
        if (len(o), len(z)) != (so, sz):
            fehl += 1
            print(f"FALSCH  {name!s}: soll {so:d}/{sz:d}, ist {len(o):d}/{len(z):d}")
    n = len(FAELLE) + len(FAELLE_INHALT)
    print(f"SELBSTTEST {n - fehl:d}/{n:d} richtig · Worker-Huelle {len(k.huelle):d} Dateien ab {k.main!s}")
    return 1 if fehl else 0


def dateien_von(c):
    return [d for d in git("show", "--name-only", "--format=", c).splitlines() if d.strip()]


def main():
    modus = sys.argv[1] if len(sys.argv) > 1 else ""
    if hasattr(sys.stdout, "reconfigure"):
        sys.stdout.reconfigure(encoding="utf-8")
    if modus == "--selbsttest":
        sys.exit(selbsttest())
    if modus == "--commit":
        k = Kriterium(); c = sys.argv[2]
        for d in dateien_von(c):
            g = k.grund(d)
            print("  {!s:<50} {!s}".format(d, ("ZAEHLT: " + g) if g else "still"))
        return
    if os.environ.get("GITHUB_ACTIONS"):
        print("CI" if modus == "--pruefe" else
              "In der CI ist HEAD == origin/main - hier wird nichts gemessen.")
        return
    if not git("rev-parse", "--verify", "-q", "origin/main").strip():
        print("KEINREF" if modus == "--pruefe" else "Kein lokaler Ref origin/main - nicht messbar.")
        return
    k = Kriterium()
    alle = git("rev-list", "origin/main..main").split()
    diff = set(git("diff", "--no-renames", "--name-only", "origin/main", "main").split())
    dateien = {c: dateien_von(c) for c in alle}
    commits, zaehlend = offene(alle, dateien, diff, k.grund)
    if modus == "--pruefe":
        print(f"OK {len(zaehlend):d} {len(commits):d}")
        return
    print(f"Ungepusht: {len(commits):d} Commit(s), davon {len(zaehlend):d} mit Wirkung beim Lerner")
    if len(alle) != len(commits):
        print(f"  ({len(alle) - len(commits):d} weitere Commit(s) nicht auf origin/main, ihr Inhalt aber schon - gesquasht; bash tools/gitc.sh nachziehen)")
    print(f"Kriterium (E44): {k.ordner!s}/, wrangler.jsonc, Migrationen, Pakete, Worker-Huelle ({len(k.huelle):d} Dateien ab {k.main!s})")
    for c in commits:
        kopf = git("log", "-1", "--format=%s", c).strip()[:60]
        print("  {!s}  {!s:<8} {!s}".format(c[:7], "ZAEHLT" if c in zaehlend else "still", kopf))
        for d in dateien[c]:
            g = k.grund(d) if d in diff else None
            print("      {!s:<40} {!s}".format(d, ("-> kommt an: " + g) if g else ("-" if d in diff else "- (Inhalt schon auf origin/main)")))


main()
