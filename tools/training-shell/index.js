#!/usr/bin/env node
"use strict";
/* ================================================================================
   training-shell – ein winziger MCP-Server, der Bash-Befehle im Projektordner
   ausfuehrt. KEINE Fremdabhaengigkeiten: reines JSON-RPC ueber stdin/stdout,
   damit die Datei in fuenf Minuten lesbar ist. Wer hier Rechte vergibt, soll
   sehen koennen, was er vergibt.

   WARUM ES DAS GIBT (10.09.2026): Windows-Update KB5124008 (Build 26200.9445)
   hat den Plan9-Mount der Cowork-Sandbox zerstoert ("no Plan9 drive shares",
   anthropics/claude-code#92984). Der Chat kann Dateien lesen und schreiben,
   aber nichts ausfuehren. Dieser Server schliesst genau diese Luecke - und
   ueberlebt den Neustart, weil ihn die Desktop-App startet.

   GRENZEN, BEWUSST GESETZT:
   * Das Arbeitsverzeichnis ist IMMER der Projektordner (projektOrdner()).
     Ein Befehl kann zwar mit absoluten Pfaden hinausgreifen - das ist bei
     einer Shell nicht zu verhindern und waere eine Scheinsicherheit. Wer das
     nicht will, startet den Server nicht.
   * Zeitgrenze je Befehl (Abbruch), Vorgabe 600 s, Obergrenze 900 s.
   * ANTWORT spaetestens nach ANTWORT_MS (50 s) - siehe DER HINTERGRUND unten.
   * Die Antwort wird gekuerzt, die VOLLSTAENDIGE Ausgabe landet immer in
     _to_delete/helfer/letzte_ausgabe.txt - lange Laeufe gehen so nicht verloren.

   FASSUNG 1.1 (26.09.2026, erster Tag auf einem frischen PC):
   * Projektordner nicht mehr fest auf einen Benutzer verdrahtet (projektOrdner()).
   * Kladde bucht die ANGEKOMMENE Laenge (BUILD_LOG 52), die volle steht daneben.
   * Jede Kopfzeile nennt die laufende Fassung (SERVER=<sha1-8>) und WARNT, wenn
     tools/training-shell/index.js im Projekt davon abweicht (einspielen vergessen
     oder App nicht neu gestartet - bisher merkte das niemand).
   * `info` misst die ganze Umgebung (Benutzbarkeit, nicht Existenz).
   * DER HINTERGRUND: Laeufe ueber ANTWORT_MS gehen selbst in den Hintergrund.
   ================================================================================ */

const { spawn, execFile } = require("child_process");
const crypto = require("crypto");
const fs = require("fs");
const path = require("path");
const os = require("os");

const FASSUNG = "1.1.2";
const MAX_ANTWORT = 40000;          // Zeichen, die in die Antwort passen
const ZEIT_VORGABE = 600000;        // 10 min bis zum Abbruch (check.sh braucht ~3 min)
const ZEIT_MAX = 900000;            // 15 min

/* ============================================================================
   DER PROJEKTORDNER - WARUM NICHT MEHR FEST (26.09.2026).
   Bis 1.0 stand TRAINING_DIR = C:\Users\<benutzer1>\... im Manifest. Auf dem
   neuen PC (Benutzer <benutzer2>) brach damit einspielen.sh ab, und die Erweiterung
   musste von Hand mit anderem Pfad gebaut werden.
   ►► Reihenfolge: TRAINING_DIR, wenn es ein EXISTIERENDER Ordner ist (eine
      nicht ersetzte Manifest-Variable "${...}" ist das nicht) - sonst
      <Benutzerordner>\Claude\Projects\Training - sonst das Startverzeichnis.
   ============================================================================ */
function projektOrdner() {
  const kandidaten = [
    process.env.TRAINING_DIR,
    path.join(os.homedir(), "Claude", "Projects", "Training")
  ].filter(k => k && k.indexOf("${") < 0);
  for (const k of kandidaten) { try { if (fs.statSync(/** @type {string} */ (k)).isDirectory()) return k; } catch (e) {} }
  return process.cwd();
}
const PROJEKT = /** @type {string} */ (projektOrdner());

/* ============================================================================
   DIE STILLE KUERZUNG - GEMESSEN AM 18.09.2026, ZWEIMAL.
   Ein `run`-Aufruf mit rund 21 KB kam mit 8225 Byte an, ein zweiter mit 9,1 KB
   mit 8189 Byte. Der erste enthielt Emoji (Mehrbyte-Zeichen), der zweite war
   reines ASCII - in ZEICHEN gerechnet liegen beide bei ~8190. Also eine
   ZEICHEN-Grenze bei rund 8192, keine Byte-Grenze.
   SIE LIEGT VOR DIESEM SERVER. Er selbst kennt keine Grenze: er liest
   zeilenweise JSON-RPC von stdin und reicht `command` unveraendert weiter.
   WO genau gekuerzt wird, ist von hier aus NICHT messbar (Client/Transport);
   bekannte Verwandte draussen sind zu lange JSON-RPC-Zeilen am Pipe-Puffer.
   DAS GEFAEHRLICHE IST NICHT DIE KUERZUNG, SONDERN DASS SIE STILL IST: bash
   fuehrt den abgeschnittenen Rest aus, der Rueckgabewert war 0, und eine halb
   geschriebene Datei sah aus wie eine ganze.
   ZWEI GEGENMITTEL, BEIDE HIER EINGEBAUT:
     1. JEDE Antwort nennt, wieviele Zeichen ANGEKOMMEN sind (Kopfzeile).
     2. Ein Befehl ueber LANG_AB Zeichen MUSS mit einer Zeile #ENDE schliessen.
        Fehlt sie, wird er ABGELEHNT statt ausgefuehrt. Eine Kuerzung frisst
        immer das Ende - also immer den Sentinel. Aus still wird laut.
   Der Sentinel ist ein bash-Kommentar und stoert den Befehl nicht.
   ============================================================================ */
const SENTINEL = "#ENDE";
const LANG_AB = 4000;               // ab hier ist der Sentinel Pflicht

/* ============================================================================
   DER HINTERGRUND - WARUM (26.09.2026).
   Die Bruecke zum Rechner deckelt JEDEN Aufruf bei ~60 s ("Device did not
   respond within 60s"). Bis 1.0 lag die Vorgabezeit des Servers bei 180 s:
   ein Lauf ohne passendes timeout_ms riss den Deckel, lief weiter - und sein
   Ergebnis war verloren. Der Umweg hiess hinter.sh + warte.sh, von Hand.
   ►► Jetzt: antwortet der Lauf nicht binnen ANTWORT_MS, antwortet der SERVER -
      mit dem, was bis dahin kam, und dem Namen des Laufs. Der Lauf schreibt
      weiter nach _to_delete/helfer/<name>.txt und hinterlaesst am Ende
      <name>.fertig mit "rc=N" - GENAU das Format von tools/hinter.sh, also
      liest ihn `bash tools/warte.sh <name> [sek]` ohne jede Aenderung.
   ⚠️ Die Zeitgrenze (timeout_ms) gilt weiter und bricht auch im Hintergrund ab.
   ⚠️ Abholen mit warte.sh <name> 45 (FASSUNG 1.1.2): gemessen 12.10. auf PC "w" (BUILD_LOG A3)
      kostet `warte.sh <lauf> 45` 46,9 s, der ganze Aufruf 47,1-47,2 s - unter der 50-s-Grenze.
      Die fruehere Vorgabe 40 stammte von einer Messung am 26.09. (30 s Warten kosteten 34 s).
   ============================================================================ */
const ANTWORT_MS = Math.max(1000, parseInt(process.env.TS_ANTWORT_MS || "50000", 10) || 50000);

/* Git Bash finden: erst die ueblichen Orte, dann PATH. Gemessen wird beim
   ersten Aufruf, nicht geraten - ein fehlender Pfad soll eine klare Meldung
   geben und nicht in einem ENOENT enden. */
function bashPfad() {
  const kandidaten = [
    process.env.BASH_PFAD,
    "C:\\Program Files\\Git\\bin\\bash.exe",
    "C:\\Program Files (x86)\\Git\\bin\\bash.exe",
    path.join(os.homedir(), "AppData\\Local\\Programs\\Git\\bin\\bash.exe")
  ].filter(Boolean);
  for (const k of kandidaten) { try { if (fs.existsSync(/** @type {string} */ (k))) return k; } catch (e) {} }
  return "bash";
}
const BASH = /** @type {string} */ (bashPfad());

/* ============================================================================
   DIE FASSUNG - WARUM SIE IN JEDER KOPFZEILE STEHT (26.09.2026).
   einspielen.sh endete mit "JETZT DIE APP NEU STARTEN - sonst laeuft die alte
   Fassung weiter und niemand merkt es". Das war eine Bitte, keine Messung.
   ►► LAUFEND = Pruefsumme dieser Datei beim Start. QUELLE = Pruefsumme von
      tools/training-shell/index.js im Projekt, bei JEDEM Aufruf neu gelesen.
      Weichen sie ab, sagt es die Antwort selbst.
   ============================================================================ */
/** @param {Buffer} daten */
function sha8(daten) { return crypto.createHash("sha1").update(daten).digest("hex").slice(0, 8); }
let LAUFEND = "?";
try { LAUFEND = sha8(fs.readFileSync(__filename)); } catch (e) {}
function fassungsWarnung() {
  try {
    const q = sha8(fs.readFileSync(path.join(PROJEKT, "tools", "training-shell", "index.js")));
    if (q !== LAUFEND)
      return "### ⚠️ FASSUNG: laufend " + LAUFEND + ", im Projekt " + q +
        " - einspielen (bash tools/training-shell/einspielen.sh) und die Claude-App neu starten\n";
  } catch (e) { /* keine Quelle im Projekt (z. B. in der Probe) - nichts zu vergleichen */ }
  return "";
}

/* ============================================================================
   DIE KLADDE - warum es sie gibt (21.09.2026).
   `letzte_ausgabe.txt` wird bei JEDEM Aufruf UEBERSCHRIEBEN. Die Wache
   (tools/wache.py) zaehlte daraus, und zwar nur dann, wenn `tick` zwischen zwei
   Aufrufen lief. Am 18.09. lief `tick` bei einem Bruchteil der Aufrufe mit -
   die Wache zaehlte also einen Bruchteil, meldete aber trotzdem ein Urteil.
   ⛔⛔ EINE MESSUNG, DIE VON EINER GEWOHNHEIT ABHAENGT, IST KEINE MESSUNG.
   ►► Deshalb schreibt der Server hier zusaetzlich eine KLADDE: eine Zeile je
      Aufruf mit Zeit und Laenge. Die Wache verbucht die Kladde ab ihrem
      gemerkten Stand und zaehlt damit VOLLSTAENDIG - egal wann `tick` laeuft.
      `tick` wird damit vom Messpunkt zum reinen Melder.
   ⛔ GEBUCHT WIRD, WAS IM CHAT ANKOMMT (26.09.2026, BUILD_LOG 52): bis 1.0 stand
      hier die VOLLE Laenge. Am 25.09. buchte ein ungezieltes grep 1 108 957 Byte,
      angekommen waren 40 000 Zeichen - die Wache meldete ~388k statt ~95k und
      riet zum Chatwechsel. Den Kontext kostet nur die Antwort.
      Zeile: <zeit> <bytes_angekommen> <zeichen_angekommen> <rc> voll=<bytes_erzeugt>
      (wache.py liest Spalte 2 - das Format bleibt fuer sie gleich.)
   ⚠️ Die Kladde liegt in `_to_delete/` (in .gitignore) und darf jederzeit
      fehlen oder geleert werden: die Wache faengt beides ab und sagt es.
   ============================================================================ */
const KLADDE_MAX = 262144;          // 256 KB; eine Zeile misst rund 40 Byte

function helferOrdner() {
  const ziel = path.join(PROJEKT, "_to_delete", "helfer");
  fs.mkdirSync(ziel, { recursive: true });
  return ziel;
}

/** @param {string} angekommen @param {number | string} rc @param {number} vollBytes */
function kladdeSchreiben(angekommen, rc, vollBytes) {
  try {
    const datei = path.join(helferOrdner(), "ausgabe_kladde.log");
    /* Bei Ueberlauf NICHT still rotieren: eine Markierung schreiben, damit die
       Wache die Schrumpfung sieht und sie MELDEN kann, statt sie zu verschlucken. */
    try {
      const st = fs.statSync(datei);
      if (st.size > KLADDE_MAX) fs.writeFileSync(datei, "# kladde neu begonnen " + new Date().toISOString() + "\n", "utf8");
    } catch (e) { /* gibt es noch nicht - der erste Anhang legt sie an */ }
    fs.appendFileSync(datei, new Date().toISOString() + " " + Buffer.byteLength(angekommen, "utf8") + " " +
      angekommen.length + " " + rc + " voll=" + vollBytes + "\n", "utf8");
    return true;
  } catch (e) { return false; }
}

/** @param {string} text */
function ausgabeSichern(text) {
  try {
    fs.writeFileSync(path.join(helferOrdner(), "letzte_ausgabe.txt"), text, "utf8");
    return true;
  } catch (e) { return false; }
}

/* Die Antwort bauen: Kopf + Ausgabe, kuerzen, sichern, buchen. EIN Weg fuer
   Vordergrund und Hintergrund, damit die Kladde nie zwei Regeln kennt. */
/** @param {string} kopf @param {string} roh @param {number | string} rc */
function antwortText(kopf, roh, rc) {
  const voll = kopf + roh;
  const gesichert = ausgabeSichern(voll);
  let text = voll;
  if (voll.length > MAX_ANTWORT) {
    text = voll.slice(0, MAX_ANTWORT) +
      "\n\n### GEKUERZT nach " + MAX_ANTWORT + " Zeichen (gesamt " + voll.length + ")." +
      (gesichert ? "\n### VOLLSTAENDIG in _to_delete/helfer/letzte_ausgabe.txt" : "");
  }
  kladdeSchreiben(text, rc, Buffer.byteLength(voll, "utf8"));
  return text;
}

/* Auf Windows beendet child.kill() nur bash - node, python, npm darunter
   liefen weiter. taskkill /T nimmt den ganzen Baum. */
/** @param {import("child_process").ChildProcess} kind */
function baumBeenden(kind) {
  try {
    if (process.platform === "win32") execFile("taskkill", ["/pid", String(kind.pid), "/T", "/F"], () => {});
    else kind.kill("SIGKILL");
  } catch (e) {}
}

let hintergrund = 0;                 // laufende Hintergrund-Laeufe (fuer das Beenden)

/**
 * @param {string} befehl @param {number} zeit @param {number} antwortMs
 * @returns {Promise<string>}
 */
function fuehreAus(befehl, zeit, antwortMs) {
  return new Promise(resolve => {
    const start = Date.now();
    /** @type {Buffer[]} */
    const teile = [];                  // Ausgabe bis zur Antwort (Buffer, erst am Ende dekodiert)
    /** @type {string | null} */
    let datei = null;                  // ab dem Wechsel in den Hintergrund: Ausgabedatei
    /** @type {string | null} */
    let name = null, abgebrochen = false, beantwortet = false;

    const kind = spawn(BASH, ["-lc", befehl], { cwd: PROJEKT, windowsHide: true });
    /** @param {Buffer} stueck */
    const schreib = stueck => { if (datei) { try { fs.appendFileSync(datei, stueck); } catch (e) {} } else teile.push(stueck); };
    kind.stdout.on("data", schreib);
    kind.stderr.on("data", schreib);   // wie 2>&1 in hinter.sh: in Reihenfolge des Eintreffens

    const abbruch = setTimeout(() => { abgebrochen = true; baumBeenden(kind); }, zeit);

    /** @param {number | string} rc */
    const kopf = rc => "### RUECKGABEWERT=" + rc + "  DAUER=" + ((Date.now() - start) / 1000).toFixed(1) +
      " s  BEFEHL=" + befehl.length + " Zeichen  CWD=" + PROJEKT + "  SERVER=" + FASSUNG + "/" + LAUFEND +
      (abgebrochen ? "\n### ABGEBROCHEN: Zeitgrenze " + (zeit / 1000) + " s erreicht" : "") + "\n" + fassungsWarnung();

    const wechsel = setTimeout(() => {
      if (beantwortet) return;
      beantwortet = true;
      name = "auto-" + new Date().toTimeString().slice(0, 8).replace(/:/g, "") + "-" + kind.pid;
      const h = helferOrdner();
      datei = path.join(h, name + ".txt");
      try {
        fs.writeFileSync(datei, Buffer.concat(teile));
        fs.writeFileSync(path.join(h, name + ".laeuft"), new Date().toTimeString().slice(0, 8) + "\n");
      } catch (e) {}
      hintergrund++;
      const bisher = Buffer.concat(teile).toString("utf8");
      resolve(antwortText(kopf("offen"),
        "### IM HINTERGRUND nach " + (antwortMs / 1000) + " s - Lauf '" + name + "' laeuft weiter (Abbruch nach " +
        (zeit / 1000) + " s).\n### Warten:  bash tools/warte.sh " + name + " 45\n### Ausgabe: _to_delete/helfer/" +
        name + ".txt  (bisher " + bisher.length + " Zeichen, letzte Zeilen:)\n" +
        bisher.split("\n").slice(-8).join("\n"), "offen"));
    }, antwortMs);

    kind.on("error", e => {
      /* Startfehler (bash nicht gefunden): ob danach noch "close" kommt, haengt an der
         Node-Fassung - also hier selbst antworten, statt auf "close" zu vertrauen. */
      teile.push(Buffer.from("\n### STARTFEHLER: " + e.message + " (Bash: " + BASH + ")\n"));
      if (!beantwortet) {
        beantwortet = true; clearTimeout(abbruch); clearTimeout(wechsel);
        resolve(antwortText(kopf(127), Buffer.concat(teile).toString("utf8"), 127));
      }
    });
    kind.on("close", code => {
      clearTimeout(abbruch); clearTimeout(wechsel);
      const rc = typeof code === "number" ? code : 1;
      if (!beantwortet) {
        beantwortet = true;
        return resolve(antwortText(kopf(rc), Buffer.concat(teile).toString("utf8"), rc));
      }
      if (!datei) return;              // schon beantwortet, aber nie im Hintergrund (Startfehler)
      // Hintergrund: Marke im Format von hinter.sh schreiben - warte.sh liest "rc=N".
      try {
        if (abgebrochen) fs.appendFileSync(datei, "\n### ABGEBROCHEN: Zeitgrenze " + (zeit / 1000) + " s erreicht\n");
        fs.writeFileSync(path.join(path.dirname(datei), name + ".fertig"), "rc=" + rc + "\n");
      } catch (e) {}
      hintergrund--; vielleichtBeenden();
    });
  });
}

/* Die Umgebung mit EINEM Aufruf messen - Benutzbarkeit, nicht Existenz
   (python3 war auf dem neuen PC "da", aber nur als Store-Platzhalter). */
const INFO = [
  'echo "Projektordner: $(pwd)"',
  'echo "Bash: ' + BASH.replace(/\\/g, "/") + '"',
  'probe(){ printf "%-9s " "$1"; shift; o="$("$@" 2>&1 | head -1)"; r=$?; [ -n "$o" ] && echo "$o" || echo "FEHLT"; }',
  'probe node node -v', 'probe npm npm -v', 'probe git git --version', 'probe jq jq --version',
  'probe gh gh --version',
  'printf "%-9s " python3; python3 -c "import sys; print(sys.version.split()[0])" 2>/dev/null || echo "FEHLT oder nur Store-Platzhalter"',
  'printf "%-9s " gh-login; gh auth status >/dev/null 2>&1 && echo angemeldet || echo "NICHT angemeldet (gh auth login)"',
  'printf "%-9s " identitaet; n="$(git config user.name)"; [ -n "$n" ] && echo "$n <$(git config user.email)>" || echo "FEHLT"',
  'for d in neu/node_modules .tooling/node_modules; do printf "%-9s " "$(basename $(dirname $d))"; [ -d "$d" ] && echo "$d da" || echo "$d FEHLT"; done',
  'git log --oneline -1; git status --porcelain | head -20'
].join("; ");

const WERKZEUGE = [
  {
    name: "run",
    description:
      "Fuehrt einen Bash-Befehl im FISI-Projektordner aus (Git Bash, cwd = " + PROJEKT + ") und " +
      "liefert Rueckgabewert, Dauer und Ausgabe. Laeuft ein Befehl laenger als " + (ANTWORT_MS / 1000) +
      " s, antwortet der Server trotzdem und laesst ihn im Hintergrund weiterlaufen; die Antwort nennt den " +
      "Namen, abzuholen mit 'bash tools/warte.sh <name> 45' (gemessen 12.10.: 45 s Warten kosten unter Git Bash ~47 s, unter dem 50-s-Deckel). timeout_ms ist die Abbruchgrenze (Vorgabe " +
      (ZEIT_VORGABE / 1000) + " s). Die vollstaendige Ausgabe steht in _to_delete/helfer/letzte_ausgabe.txt. " +
      "EIN BEFEHL UEBER " + LANG_AB + " ZEICHEN MUSS MIT EINER EIGENEN ZEILE " + SENTINEL + " ENDEN, " +
      "sonst wird er abgelehnt: der Weg hierher kuerzt lange Befehle bei rund 8190 Zeichen STILL ab. " +
      "Alles ueber ~6000 Zeichen besser in Stuecken schicken (cat > ... dann cat >> ..., mit wc -c pruefen).",
    inputSchema: {
      type: "object",
      properties: {
        command: { type: "string", description: "Der Bash-Befehl. Mehrzeilig erlaubt." },
        timeout_ms: {
          type: "integer",
          description: "Abbruchgrenze in Millisekunden (auch im Hintergrund). Vorgabe " + ZEIT_VORGABE + ", Obergrenze " + ZEIT_MAX + ".",
          minimum: 1000, maximum: ZEIT_MAX
        }
      },
      required: ["command"]
    }
  },
  {
    name: "info",
    description: "Misst die Arbeitsumgebung in einem Aufruf: Projektordner, Git-Bash, node, npm, git, jq, gh " +
      "(mit Anmeldung), python3 (echt ausgefuehrt), Git-Identitaet, node_modules, laufende Server-Fassung.",
    inputSchema: { type: "object", properties: {} }
  }
];

/* ---------------- JSON-RPC ueber stdio, zeilenweise ---------------- */
/** @param {object} nachricht */
function sende(nachricht) {
  process.stdout.write(JSON.stringify(nachricht) + "\n");
}
/** @param {any} id @param {any} ergebnis */
function antwort(id, ergebnis) { sende({ jsonrpc: "2.0", id: id, result: ergebnis }); }
/** @param {any} id @param {number} code @param {string} text */
function fehler(id, code, text) { sende({ jsonrpc: "2.0", id: id, error: { code: code, message: text } }); }
/** @param {string} t */
function textErgebnis(t) { return { content: [{ type: "text", text: t }] }; }

/** @param {{id?: any, method?: string, params?: any}} nachricht */
async function behandle(nachricht) {
  const { id, method, params } = nachricht;
  if (method === "initialize") {
    /* Die Protokollversion des Clients wird zurueckgespiegelt - so veraltet der
       Server nicht, wenn die App eine neuere Version spricht. */
    const version = (params && params.protocolVersion) || "2025-06-18";
    return antwort(id, {
      protocolVersion: version,
      capabilities: { tools: {} },
      serverInfo: { name: "training-shell", version: FASSUNG }
    });
  }
  if (method === "notifications/initialized" || method === "initialized") return;
  if (method === "ping") return antwort(id, {});
  if (method === "tools/list") return antwort(id, { tools: WERKZEUGE });
  if (method === "tools/call") {
    const name = params && params.name;
    const arg = (params && params.arguments) || {};
    if (name === "info") {
      return antwort(id, textErgebnis(await fuehreAus(INFO, 45000, ANTWORT_MS)));
    }
    if (name === "run") {
      if (typeof arg.command !== "string" || !arg.command.trim())
        return fehler(id, -32602, "command fehlt oder ist leer");
      const zeit = Math.min(Math.max(parseInt(arg.timeout_ms || ZEIT_VORGABE, 10), 1000), ZEIT_MAX);
      const laenge = arg.command.length;
      if (laenge > LANG_AB) {
        const zeilen = arg.command.replace(/\s+$/, "").split("\n");
        const letzte = zeilen[zeilen.length - 1].trim();
        if (letzte !== SENTINEL) {
          return antwort(id, textErgebnis(
            "### ABGELEHNT - KEIN SENTINEL AM ENDE\n" +
            "### Angekommen: " + laenge + " Zeichen. Letzte Zeile: " +
              JSON.stringify(letzte.slice(-90)) + "\n" +
            "### Ein Befehl ueber " + LANG_AB + " Zeichen muss mit einer eigenen Zeile " +
              SENTINEL + " schliessen.\n" +
            "### WARUM: der Weg zu diesem Server kuerzt lange Befehle bei rund 8190 ZEICHEN ab -\n" +
            "###   still, mit Rueckgabewert 0 (gemessen 18.09.2026, zweimal). Eine Kuerzung frisst\n" +
            "###   immer das Ende, also immer den Sentinel. Deshalb diese Ablehnung.\n" +
            "### Entweder war der Befehl ABGESCHNITTEN - dann in Stuecken schicken (cat > datei,\n" +
            "###   danach cat >> datei, je unter ~6000 Zeichen, mit wc -c pruefen) - oder der\n" +
            "###   Sentinel wurde vergessen: " + SENTINEL + " anhaengen und neu senden.\n" +
            "### NICHTS WURDE AUSGEFUEHRT."));
        }
      }
      return antwort(id, textErgebnis(await fuehreAus(arg.command, zeit, ANTWORT_MS)));
    }
    return fehler(id, -32601, "Unbekanntes Werkzeug: " + name);
  }
  if (typeof id !== "undefined") fehler(id, -32601, "Unbekannte Methode: " + method);
}

/* ⚠️ GEMESSEN BEIM BAUEN (10.09.): ein `process.exit(0)` direkt am stdin-Ende
   verschluckte die Antwort eines noch laufenden Befehls - die Probe lieferte
   fuer den einzigen echten `run`-Aufruf GAR NICHTS und sah trotzdem gruen aus.
   Im Betrieb faellt das nicht auf, weil stdin offen bleibt. Deshalb wird
   gezaehlt, was laeuft, und erst danach beendet - seit 1.1 auch die Laeufe
   im Hintergrund, sonst faende warte.sh nie eine .fertig-Marke. */
let offen = 0;
let stdinZu = false;
function vielleichtBeenden() { if (stdinZu && offen === 0 && hintergrund === 0) process.exit(0); }

let puffer = "";
process.stdin.setEncoding("utf8");
process.stdin.on("data", stueck => {
  puffer += stueck;
  let nl;
  while ((nl = puffer.indexOf("\n")) >= 0) {
    const zeile = puffer.slice(0, nl).trim();
    puffer = puffer.slice(nl + 1);
    if (!zeile) continue;
    let nachricht;
    try { nachricht = JSON.parse(zeile); }
    catch (e) { continue; }               // unlesbare Zeile ueberspringen, nicht sterben
    offen++;
    Promise.resolve(behandle(nachricht)).catch(e => {
      if (nachricht && typeof nachricht.id !== "undefined")
        fehler(nachricht.id, -32603, "Serverfehler: " + (e && e.message));
    }).then(() => { offen--; vielleichtBeenden(); });
  }
});
process.stdin.on("end", () => { stdinZu = true; vielleichtBeenden(); });
