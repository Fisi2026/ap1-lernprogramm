"""Testserver fuer die SW-Abnahmen (N29) – bildet Cloudflare Static Assets so weit nach, wie die
Abnahme es braucht:
* `Cache-Control: no-cache` (HTML wird dort immer neu geprueft).
  ⛔ Anlass 23.09.: `python -m http.server` schickt nur Last-Modified; Edge nahm danach die ALTE
  index.html aus seinem HTTP-Cache – gemeldet wurde „Neubau startet nicht", der Fehler lag hier.
* `_redirects` im Auslieferungsordner: exakte Regeln `quelle ziel code` (mehr nutzt der Neubau nicht).
* Der Auslieferungsordner steht in einer DATEI und wird bei JEDER Anfrage gelesen – umgeschaltet wird
  durch Umschreiben der Datei, nicht durch Kopieren.
  ⛔ Anlass 24.09.: Kopieren ueber den alten Stand liess `/v2/index.html` liegen (Windows gab den
  Ordner nicht frei); die alte Seite registrierte `/v2/sw.js` danach immer wieder neu – live gibt es
  die Datei nicht, dort leitet `_redirects` auf / um.
* `_headers` im Auslieferungsordner (Audit 26.09.2026, AUD-B4): die Koepfe des Blocks `/*` gehen mit
  JEDER Antwort hinaus – auch die CSP. Sonst misst eine Abnahme eine Seite OHNE die Regeln, die live
  gelten, und ein CSP-Verstoss faellt erst beim Lerner auf.
Aufruf: python3 tools/sichtpruefung/dienst.py <datei-mit-ordnerpfad> <port>"""
import http.server
import os
import sys

ZEIGER, PORT = sys.argv[1], int(sys.argv[2])

def wurzel():
    with open(ZEIGER, encoding="utf-8") as f:
        return f.read().strip()

def koepfe(ordner):
    """Die Koepfe aus `_headers`, nur der Block `/*` (mehr nutzt der Neubau nicht)."""
    datei = os.path.join(ordner, "_headers")
    if not os.path.exists(datei):
        return []
    aus, im_block = [], False
    with open(datei, encoding="utf-8") as fh:
        for z in fh:
            if not z.strip():
                continue
            if not z.startswith(" "):
                im_block = z.strip() == "/*"
                continue
            if im_block and ":" in z:
                name, wert = z.strip().split(":", 1)
                aus.append((name.strip(), wert.strip()))
    return aus

class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *a, **k):
        super().__init__(*a, directory=wurzel(), **k)
    def end_headers(self):
        self.send_header("Cache-Control", "no-cache")
        for name, wert in koepfe(self.directory):
            self.send_header(name, wert)
        super().end_headers()
    def log_message(self, *a):
        pass
    def _umleitung(self):
        regeln = os.path.join(self.directory, "_redirects")
        if not os.path.exists(regeln):
            return False
        pfad = self.path.split("?")[0]
        with open(regeln, encoding="utf-8") as fh:
            for z in fh:
                t = z.split()
                if len(t) >= 2 and t[0] == pfad:
                    self.send_response(int(t[2]) if len(t) > 2 else 302)
                    self.send_header("Location", t[1])
                    self.end_headers()
                    return True
        return False
    def do_GET(self):
        if self.path.split("?")[0] in ("/_redirects", "/_headers"):
            self.send_error(404); return
        if not self._umleitung():
            super().do_GET()
    def do_HEAD(self):
        if not self._umleitung():
            super().do_HEAD()

http.server.ThreadingHTTPServer(("127.0.0.1", PORT), Handler).serve_forever()
