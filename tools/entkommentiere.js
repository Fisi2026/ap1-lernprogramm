#!/usr/bin/env node
/* tools/entkommentiere.js - blendet Kommentare aus JS/CSS/HTML aus, ohne die Datei zu verkuerzen.
 *
 * ZWECK (FB-R3 Punkt 12): Die grep-Waechter in check.sh sollen NUR echten Code sehen.
 * Vorher schlug der Anti-Pattern-Guard auch bei einem Kommentar an, der vor genau dieser
 * Falle warnte - daran ist die CI von v1.3.0 gescheitert. Derselbe Fehler droht dem
 * Offline-Audit, sobald jemand eine URL in einen Kommentar schreibt.
 *
 * INVARIANTE (wird am Ende selbst geprueft): Die Ausgabe ist ZEICHENGLEICH LANG wie die
 * Eingabe. Kommentare werden durch Leerzeichen ersetzt, Zeilenumbrueche bleiben stehen.
 * Damit stimmen Zeilennummern und Offsets weiter, und der Stripper kann per Konstruktion
 * nichts anderes tun als ausblenden. Verletzt er die Invariante, bricht er mit Code 3 ab -
 * check.sh faellt dann auf die Rohpruefung zurueck (fail-safe, nicht fail-open).
 *
 * Aufruf:  node tools/entkommentiere.js <datei> [--typ js|css|html]   -> Ausgabe auf stdout
 *          Typ wird sonst aus der Endung abgeleitet (.css / .htm(l) / sonst js).
 */
"use strict";

function blankRange(/** @type {string[]} */ out, /** @type {string} */ src, /** @type {number} */ a, /** @type {number} */ b) {
  for (var i = a; i < b && i < src.length; i++) {
    var c = src[i];
    out[i] = (c === "\n" || c === "\r") ? c : " ";
  }
}

/* ---- JavaScript ---------------------------------------------------------
 * Zustandsautomat ueber Code / String / Template / Regex. Strings und Regex-Literale
 * MUESSEN erkannt werden, sonst wuerde "https://..." als Zeilenkommentar gelesen.
 */
/** @param {string} src @param {string[]} out @param {number} start @param {number} end */
function scanJS(src, out, start, end) {
  var KEYW = /^(return|typeof|instanceof|in|of|new|delete|void|do|else|yield|await|case|throw)$/;
  var i = start, mode = "code", stack = [];
  var prevSig = "", prevWord = "";

  function regexMoeglich() {
    if (prevSig === "") return true;                       // Dateianfang
    if (/[A-Za-z0-9_$)\]]/.test(prevSig)) return KEYW.test(prevWord); // sonst Division
    return true;                                           // nach = ( , : ; [ { ! & | ? + - * % ~ ^ < >
  }

  while (i < end) {
    var c = src[i], j;

    if (mode === "tpl") {                                  // innerhalb `...`
      if (c === "\\") { i += 2; continue; }
      if (c === "`") { mode = "code"; prevSig = ")"; prevWord = ""; i++; continue; }
      if (c === "$" && src[i + 1] === "{") {
        stack.push({ t: "tplexpr", d: 0 }); mode = "code"; prevSig = "{"; prevWord = ""; i += 2; continue;
      }
      i++; continue;
    }

    if (c === "/" && src[i + 1] === "/") {                  // Zeilenkommentar
      j = i; while (j < end && src[j] !== "\n") j++;
      blankRange(out, src, i, j); i = j; continue;
    }
    if (c === "/" && src[i + 1] === "*") {                  // Blockkommentar
      j = i + 2; while (j < end && !(src[j] === "*" && src[j + 1] === "/")) j++;
      j = (j < end) ? j + 2 : end;
      blankRange(out, src, i, j); i = j; continue;
    }
    if (c === '"' || c === "'") {                           // String
      var q = c; j = i + 1;
      while (j < end) {
        if (src[j] === "\\") { j += 2; continue; }
        if (src[j] === q) { j++; break; }
        if (src[j] === "\n") break;                         // unbalanciert -> Notausstieg
        j++;
      }
      i = j; prevSig = ")"; prevWord = ""; continue;
    }
    if (c === "`") { mode = "tpl"; i++; continue; }

    if (c === "/" && regexMoeglich()) {                     // Regex-Literal
      j = i + 1; var inClass = false;
      while (j < end) {
        var d = src[j];
        if (d === "\\") { j += 2; continue; }
        if (d === "\n") break;                              // kein gueltiges Literal
        if (inClass) { if (d === "]") inClass = false; j++; continue; }
        if (d === "[") { inClass = true; j++; continue; }
        if (d === "/") { j++; break; }
        j++;
      }
      while (j < end && /[dgimsuy]/.test(src[j])) j++;       // Flags
      i = j; prevSig = ")"; prevWord = ""; continue;
    }

    if (c === "{" && stack.length && stack[stack.length - 1].t === "tplexpr") {
      stack[stack.length - 1].d++;
    } else if (c === "}") {
      var top = stack[stack.length - 1];
      if (top && top.t === "tplexpr") {
        if (top.d === 0) { stack.pop(); mode = "tpl"; i++; continue; }
        top.d--;
      }
    }

    if (!/\s/.test(c)) {
      prevSig = c;
      prevWord = /[A-Za-z0-9_$]/.test(c) ? (prevWord + c) : "";
    }
    i++;
  }
}

/* ---- CSS: nur Blockkommentare, aber Strings respektieren ----------------- */
/** @param {string} src @param {string[]} out @param {number} start @param {number} end */
function scanCSS(src, out, start, end) {
  var i = start, j;
  while (i < end) {
    var c = src[i];
    if (c === "/" && src[i + 1] === "*") {
      j = i + 2; while (j < end && !(src[j] === "*" && src[j + 1] === "/")) j++;
      j = (j < end) ? j + 2 : end;
      blankRange(out, src, i, j); i = j; continue;
    }
    if (c === '"' || c === "'") {
      var q = c; j = i + 1;
      while (j < end) {
        if (src[j] === "\\") { j += 2; continue; }
        if (src[j] === q) { j++; break; }
        if (src[j] === "\n") break;
        j++;
      }
      i = j; continue;
    }
    i++;
  }
}

/* ---- HTML: <!-- --> plus inline <script>/<style> ------------------------- */
/** @param {string} src @param {string[]} out @param {number} start @param {number} end */
function scanHTML(src, out, start, end) {
  var low = src.toLowerCase();
  var i = start;
  while (i < end) {
    if (src.startsWith("<!--", i)) {
      var j = src.indexOf("-->", i + 4);
      j = (j < 0 || j + 3 > end) ? end : j + 3;
      blankRange(out, src, i, j); i = j; continue;
    }
    var m = /^<(script|style)\b/.exec(low.slice(i, i + 8));
    if (m) {
      var gt = src.indexOf(">", i);
      if (gt < 0 || gt >= end) break;
      var tag = m[1];
      var close = low.indexOf("</" + tag, gt + 1);
      if (close < 0 || close > end) close = end;
      if (tag === "script") scanJS(src, out, gt + 1, close); else scanCSS(src, out, gt + 1, close);
      i = close; continue;
    }
    i++;
  }
}

/* ---- Kern als Funktion (damit tests/test_entkommentiere.js ihn direkt fahren kann) ---- */
/** @param {string} name */
function typFuer(name) {
  var e = String(name).toLowerCase();
  return /\.css$/.test(e) ? "css" : (/\.html?$/.test(e) ? "html" : "js");
}
/* Prueft die Invariante: gleiche Laenge, und geaenderte Stellen sind ausschliesslich Leerzeichen.
   Liefert null wenn alles stimmt, sonst einen Klartext-Grund. */
/** @param {string} orig @param {string} res */
function pruefeInvariante(orig, res) {
  if (res.length !== orig.length) return "Laenge veraendert (" + orig.length + " -> " + res.length + ")";
  for (var p = 0; p < res.length; p++) {
    if (res[p] !== orig[p] && res[p] !== " ") return "unerlaubte Ersetzung an Offset " + p;
  }
  return null;
}
/** @param {string} src @param {string} typ */
function entkommentiere(src, typ) {
  var out = src.split("");
  if (typ === "css") scanCSS(src, out, 0, src.length);
  else if (typ === "html") scanHTML(src, out, 0, src.length);
  else scanJS(src, out, 0, src.length);
  var res = out.join("");
  var grund = pruefeInvariante(src, res);
  if (grund) throw new Error("entkommentiere: " + grund);
  return res;
}
if (typeof module !== "undefined" && module.exports) {
  module.exports = { entkommentiere: entkommentiere, pruefeInvariante: pruefeInvariante, typFuer: typFuer };
}
/* ---- Hauptprogramm (nur beim direkten Aufruf, nicht beim require aus der Suite) ---- */
if (require.main === module) {
  var args = process.argv.slice(2);
  var datei = null, typ = null;
  for (var k = 0; k < args.length; k++) {
    if (args[k] === "--typ") { typ = (args[k + 1] || "").toLowerCase(); k++; }
    else if (!datei) datei = args[k];
  }
  if (!datei) {
    process.stderr.write("Aufruf: node tools/entkommentiere.js <datei> [--typ js|css|html]\n");
    process.exit(2);
  }
  var src = null;
  try { src = require("fs").readFileSync(datei, "utf8"); }
  catch (e) {
    process.stderr.write("entkommentiere: kann " + datei + " nicht lesen (" + /** @type {Error} */ (e).message + ")\n");
    process.exit(2);
  }
  try {
    /* Wirft, wenn die Invariante verletzt ist - Exit 3 signalisiert check.sh den Rueckfall
       auf die Rohdatei (fail-safe). Lieber gar nichts liefern als still etwas Falsches. */
    process.stdout.write(entkommentiere(src, typ || typFuer(datei)));
  } catch (e2) {
    process.stderr.write(/** @type {Error} */ (e2).message + "\n");
    process.exit(3);
  }
}
